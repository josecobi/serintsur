# AI Integrations — Serintsur

## Overview

All AI features use the Anthropic Claude API (model: `claude-sonnet-4-20250514`) proxied through Vercel Edge Functions. The API key is stored as a Vercel environment variable (`ANTHROPIC_API_KEY`) and never exposed to the client.

## 1. Chatbot Widget

### Purpose

A floating chat widget on every page that serves two functions:
1. **Answer visitor questions** about Serintsur's services, capabilities, coverage areas, and processes
2. **Capture leads** by collecting name, phone, and project type, then routing to Jorge via WhatsApp

### System Prompt (Spanish version)

```
Eres el asistente virtual de Serintsur Multiservicios S.L., una empresa de construcción, rehabilitación y mantenimiento de edificios con sede en Jerez de la Frontera, Cádiz.

INFORMACIÓN DE LA EMPRESA:
- Fundada en 2018
- ~30 empleados cualificados
- Operamos en Cádiz, Málaga y Sevilla
- Gerencia: Jorge López Cobano
- Contacto: 655 634 800 / jlcobano@serintsur.com
- Dirección: Avda. Alcalde Cantos Ropero, 104, Nave 6, Jerez de la Frontera

SERVICIOS PRINCIPALES:
- Reformas integrales de viviendas y edificios
- Rehabilitación de fachadas
- Construcción de villas y viviendas unifamiliares
- Promociones residenciales
- Mantenimiento de edificios e instalaciones
- Renovación de cubiertas, forjados y techos

CLIENTES DESTACADOS:
Ayuntamiento de Jerez, Base Naval de Rota, Base de Morón de la Frontera, González Byass, Hotel Jerez, Metrovacesa, Cáritas Diocesana, UPACE San Fernando, entre otros.

PROYECTOS RECIENTES:
- Villas Oasis Estepona (Pamasura Marein)
- Rehabilitación de fachadas en González Byass
- Renovación de cubiertas en Barriada San José Obrero
- Remodelación de Hotel Jerez (fachadas y terrazas)
- Construcción de viviendas en La Barrosa, Chiclana
- Chalets independientes en El Puerto de Santa María

VALORES:
Honestidad, transparencia, profesionalidad, cumplimiento de plazos, calidad en la ejecución, seguridad laboral, orientación al cliente, innovación, compromiso postventa.

INSTRUCCIONES DE COMPORTAMIENTO:
- Responde siempre en el idioma que use el visitante (español, inglés o alemán)
- Sé profesional pero cercano — como un encargado de obra de confianza
- Si el visitante pregunta por precios, explica que depende del proyecto y ofrece el estimador de presupuestos o una visita gratuita
- NUNCA inventes datos, cifras o precios que no estén en este contexto
- Si no sabes algo, di que lo mejor es contactar directamente con Jorge
- Después de 2-3 intercambios, sugiere amablemente capturar sus datos para que Jorge pueda contactarle
- Si el visitante proporciona su nombre y teléfono, genera un mensaje de lead para WhatsApp
- Mantén las respuestas breves (2-3 frases máximo) a menos que el visitante pida más detalle
- Usa quick replies para guiar la conversación: "Ver servicios", "Pedir presupuesto", "Hablar con Jorge"
```

### Lead Capture Flow

1. After 2-3 exchanges, chatbot suggests: "¿Te gustaría que Jorge te contactara? Solo necesito tu nombre y teléfono."
2. User provides info (via inline form or chat text — bot extracts name/phone)
3. Bot confirms: "¡Perfecto, [Nombre]! Jorge te contactará al [teléfono] lo antes posible."
4. Behind the scenes: a WhatsApp deep link is generated with pre-formatted lead text:

```
🔔 NUEVO LEAD (chatbot web)
👤 Nombre: [name]
📱 Teléfono: [phone]
📧 Email: [email if provided]
💬 Resumen: [2-line summary of what they asked about]
🌐 Idioma: [es/en/de]
```

### Technical Implementation

```typescript
// /api/chat edge function
export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  const { messages, language } = await req.json();

  // Rate limiting check (by IP, 20 req/min)

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      system: SYSTEM_PROMPT[language],
      messages: messages.slice(-10), // Keep last 10 messages for context window
    }),
  });

  // Stream response back via SSE
}
```

### UI Behavior

- Floating button: bottom-right, 56px circle, navy background, white chat icon
- Panel: 380px wide, 520px tall (desktop), full-width bottom sheet (mobile)
- Initial state: closed, with a subtle pulse animation after 8 seconds on page
- Welcome message on open: "¡Hola! Soy el asistente de Serintsur. ¿En qué puedo ayudarte?" with quick replies
- Close button always visible
- Messages persist during session (sessionStorage), cleared on tab close
- Typing indicator while waiting for API response

## 2. Quote Estimator

### Purpose

A 5-step guided form that collects project details and generates a ballpark price range. The goal is NOT to replace Jorge's visit-based quoting — it's to:
1. Give visitors an immediate, engaging response (reduces bounce)
2. Pre-qualify leads with structured data
3. Route complete, pre-formatted lead info to Jorge via WhatsApp

### Price Matrix

```typescript
// priceMatrix.ts
// Prices in €/m² — NEEDS CALIBRATION WITH JORGE
export const priceMatrix: Record<string, Record<string, [number, number]>> = {
  reforma_integral: {
    basica: [400, 600],
    media: [600, 900],
    alta: [900, 1400],
    premium: [1400, 2200],
  },
  rehabilitacion_fachada: {
    basica: [80, 120],
    media: [120, 200],
    alta: [200, 350],
    premium: [350, 550],
  },
  construccion_nueva: {
    basica: [800, 1100],
    media: [1100, 1500],
    alta: [1500, 2200],
    premium: [2200, 3500],
  },
  mantenimiento: {
    basica: [30, 50],
    media: [50, 80],
    alta: [80, 130],
    premium: [130, 200],
  },
};

// Location multipliers
export const locationMultiplier: Record<string, number> = {
  jerez: 1.0,
  cadiz: 1.05,
  chiclana: 1.0,
  puerto_santa_maria: 1.0,
  rota: 1.02,
  sanlucar: 1.0,
  malaga: 1.15,
  estepona: 1.12,
  marbella: 1.25,
  sevilla: 1.10,
  otro: 1.08,
};
```

### Step Flow

1. **Project Type**: Cards with icons — Reforma integral, Rehabilitación de fachada, Construcción nueva, Mantenimiento
2. **Surface Area**: Slider 20-1000 m² with manual input override
3. **Quality Level**: Básica, Media, Alta, Premium — each with description of what's included
4. **Location**: Chips for common cities + "Otra ubicación" freetext
5. **Contact Info**: Name (required), Phone (required), Email (optional), Notes (optional)
6. **Result**: Price range display + "Solicitar visita gratuita" button → WhatsApp

### WhatsApp Message Template

```
Hola, he usado el estimador de la web y me gustaría más información:

📋 Proyecto: [type]
📐 Superficie: [area] m²
✨ Acabados: [quality]
📍 Ubicación: [location]
💰 Estimación: [low]€ – [high]€

¿Podríamos concertar una visita?
```

## 3. Edge Function: Contact Form

### Purpose

Handle the generic contact form submission. Sends a formatted WhatsApp message + email notification.

### Flow

1. User fills form (name, phone, email, message, selected service interest)
2. Client-side validation
3. POST to `/api/contact`
4. Edge function:
   a. Validates inputs server-side
   b. Formats WhatsApp message
   c. Sends email via Resend API to jlcobano@serintsur.com
   d. Returns WhatsApp deep link URL
5. Client opens WhatsApp deep link in new tab

## 4. Future AI Integrations (Phase 2+)

### SEO Content Generator

- Jorge/Jose provides a topic (e.g., "ITE en edificios de Cádiz")
- Claude generates a long-form article in Spanish, optimized for local SEO
- Output goes into Sanity as a draft blog post for review
- Translations to EN/DE can be triggered from Sanity

### Project Showcase Auto-Generator

- Jorge uploads 5-10 photos + voice note describing the project
- Whisper transcribes the voice note
- Claude generates a structured project case study (title, description, specs, highlights) in three languages
- Output creates a draft project entry in Sanity

### Translation Assistant

- Integrated into Sanity Studio
- When Jorge publishes or edits Spanish content, a button triggers Claude to draft EN/DE translations
- Translations appear as drafts in the other locale fields for review

### Quote PDF Generator (the Phase 3c vision)

- Jorge visits a site, dictates notes via phone, takes photos
- Voice → text via Whisper
- Photos analyzed by Claude Vision for scope/condition assessment
- System generates a formatted PDF quote using Jorge's price matrix + professional descriptions
- This is a separate PWA, not part of the website
