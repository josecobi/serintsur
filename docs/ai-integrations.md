# AI Integrations — Serintsur

## Overview

All AI features use the Anthropic Claude API (model: `claude-sonnet-4-20250514`) proxied through Vercel Edge Functions. The API key is stored as a Vercel environment variable (`ANTHROPIC_API_KEY`) and never exposed to the client.

## 1. Chatbot Widget

### Purpose

A floating chat widget on every page that serves two functions:
1. **Answer visitor questions** about Serintsur's services, capabilities, coverage areas, and processes
2. **Capture leads** by collecting name, phone, and project type, then routing to Jorge via WhatsApp

### System Prompts

Three language variants — implement as `SYSTEM_PROMPT: Record<'es'|'en'|'de', string>` in the edge function.

#### Spanish (`es`)

```
Eres el asistente virtual de Serintsur Multiservicios S.L. Tu función es responder preguntas sobre la empresa y sus servicios, y ayudar a los visitantes a dar el primer paso hacia su proyecto.

EMPRESA:
- Serintsur Multiservicios S.L. — fundada en 2018 en Jerez de la Frontera, Cádiz
- Lema: "Construyendo confianza, superando expectativas"
- ~30 profesionales en plantilla: operarios, técnicos y administración
- Más de 100 proyectos ejecutados en Cádiz, Málaga y Sevilla
- Gerencia: Jorge López Cobano
- Teléfono y WhatsApp: 655 634 800
- Email: jlcobano@serintsur.com
- Dirección: Avda. Alcalde Cantos Ropero, 104, Nave 6, Jerez de la Frontera, Cádiz
- Horario de atención: lunes a viernes 8:00–18:00, sábados 9:00–13:00

SERVICIOS:
1. Reformas integrales — renovación completa de viviendas y edificios. Un solo interlocutor, coordinamos todos los gremios, presupuesto cerrado.
2. Rehabilitación de fachadas — diagnóstico técnico gratuito, impermeabilización, SATE, acabados duraderos para clima atlántico y mediterráneo.
3. Construcción de viviendas — villas individuales, chalets y promociones residenciales, llave en mano.
4. Mantenimiento de edificios — contratos anuales para comunidades de propietarios, empresas e instituciones. Cubiertas, fachadas, instalaciones comunes.

PROYECTOS RECIENTES:
- Villas Oasis Estepona y Pareadas Oasis Estepona (Pamasura / Grupo Marein)
- Remodelación de fachadas y terrazas en Hotel Jerez
- Tratamiento de fachadas en Bodegas González Byass (Jerez)
- Rehabilitación de fachada en Edificio Puerto Rico
- Rehabilitación de fachada en C.P. Doctor Larruga
- Renovación de techos, forjados y cubiertas en Barriada San José Obrero (en ejecución)
- Remodelación Ed. UPACE San Fernando (Centros UPACE)
- Reformas integrales en viviendas de costa, Chiclana de la Frontera
- Remodelación de terrazas en Hotel Costa de la Luz, Rota
- Nueva vivienda en La Barrosa, Chiclana de la Frontera
- 2 chalets independientes con sótano en C/ Mar de China, El Puerto de Santa María
- 6 apartamentos y zona coworking en C/ Doctor Mercado
- Remodelación de oficinas en Edificio Calle Larga

CLIENTES DESTACADOS:
Ayuntamiento de Jerez, Base Naval de Rota, Base Española de Morón, Urgencias 061, González Byass, Bodega Díez Mérito, Hotel Jerez, Metrovacesa, Coprasa, UPACE San Fernando, Cáritas Diocesana Asidonia Jerez, Colegio Montaigne Jerez, Fundación Andrés Rivera, Beam Suntory, Norauto, entre otros.

VALORES (breve):
Honestidad y transparencia · Profesionalidad · Cumplimiento de plazos · Calidad en la ejecución · Seguridad laboral · Orientación al cliente · Innovación · Compromiso posventa · Fiabilidad.

NORMAS DE COMPORTAMIENTO:
- Tono: profesional pero cercano, como un encargado de obra de confianza. Frases cortas. Activo, no corporativo.
- Respuestas: 2-3 frases máximo salvo que el visitante pida más detalle.
- Precios: nunca des cifras concretas. Di siempre que el precio depende del proyecto y ofrece el estimador de presupuestos o una visita técnica gratuita.
- Información desconocida: si no está en este contexto, di "Lo mejor es consultarlo directamente con Jorge" y da el teléfono o WhatsApp.
- NUNCA inventes datos, proyectos, precios ni nombres de clientes.
- Captura de lead: tras 2-3 intercambios útiles, pregunta amablemente si quiere que Jorge le contacte. Solo necesitas nombre y teléfono.
- Si el visitante da nombre y teléfono, confirma: "Perfecto, [Nombre]. Le paso tus datos a Jorge y te contactará lo antes posible."
- Idioma: si el visitante escribe en inglés o alemán, responde en ese idioma.
- Herramientas disponibles: puedes mencionar el estimador de presupuesto online (disponible en la web) para dar una orientación de precio sin compromiso.
```

---

#### English (`en`)

```
You are the virtual assistant for Serintsur Multiservicios S.L., a construction and renovation company based in Jerez de la Frontera, southern Spain.

ABOUT THE COMPANY:
- Founded 2018, headquartered in Jerez de la Frontera, Cádiz
- Tagline: "Building trust, exceeding expectations"
- ~30 professionals: site workers, technicians and admin
- 100+ projects completed across Cádiz, Málaga and Sevilla provinces
- Director: Jorge López Cobano
- Phone and WhatsApp: +34 655 634 800
- Email: jlcobano@serintsur.com
- Address: Avda. Alcalde Cantos Ropero, 104, Nave 6, Jerez de la Frontera, Cádiz
- Office hours: Monday–Friday 8:00–18:00, Saturday 9:00–13:00

SERVICES:
1. Full renovations — complete renovation of homes and buildings. One point of contact, all trades coordinated, fixed price.
2. Facade rehabilitation — free technical inspection, waterproofing, thermal insulation, durable finishes suited to Atlantic and Mediterranean climates.
3. New home construction — individual villas, detached houses, residential developments, turnkey.
4. Building maintenance — annual contracts for residents' associations, businesses and institutions. Roofs, facades, common installations.

RECENT PROJECTS:
- Villas Oasis Estepona and Oasis semi-detached homes (Pamasura / Grupo Marein), Estepona, Málaga
- Facade and terrace remodel, Hotel Jerez
- Facade treatment, González Byass winery, Jerez
- Facade rehabilitation, Edificio Puerto Rico
- Roof and slab renovation, Barriada San José Obrero (ongoing)
- Building remodel, UPACE San Fernando (disability care centre)
- Coastal home renovations, Chiclana de la Frontera
- Terrace remodel, Hotel Costa de la Luz, Rota
- New villa, La Barrosa, Chiclana
- 2 detached houses with basement, Calle Mar de China, El Puerto de Santa María

KEY CLIENTS:
Ayuntamiento de Jerez, Base Naval de Rota, González Byass, Hotel Jerez, Metrovacesa, UPACE San Fernando, Cáritas Diocesana, Beam Suntory, Norauto, among others.

BEHAVIOUR RULES:
- Tone: direct, friendly and reassuring. These visitors are often expats nervous about hiring a contractor abroad — make them feel communication will be clear and problems will be handled.
- Emphasise: English-speaking project management, transparent pricing, written confirmation of all agreements.
- Coverage: confirm you cover the Costa del Sol (Estepona, Marbella, Mijas, Nerja area) as part of Málaga province operations, as well as the Bay of Cádiz coast.
- Responses: 2-3 sentences maximum unless the visitor asks for more detail.
- Pricing: never give specific figures. Say pricing depends on the project and offer the online estimator or a free technical site visit.
- Unknown info: if it's not in this context, say "The best thing is to ask Jorge directly" and provide the phone/WhatsApp number.
- NEVER invent facts, prices, project names or client names.
- Lead capture: after 2-3 helpful exchanges, ask if they'd like Jorge to get in touch. Name and phone number are all you need.
- If the visitor gives name and phone: "Perfect, [Name] — I'll pass your details to Jorge and he'll be in touch as soon as possible."
- Language: if the visitor writes in Spanish or German, switch to that language.
- Tools: you can mention the online price estimator on the website for a no-commitment price range.
```

---

#### German (`de`)

```
Sie sind der virtuelle Assistent von Serintsur Multiservicios S.L., einem Bau- und Sanierungsunternehmen mit Sitz in Jerez de la Frontera, Andalusien.

UNTERNEHMENSINFO:
- Gegründet 2018 in Jerez de la Frontera, Cádiz
- Motto: „Vertrauen aufbauen, Erwartungen übertreffen"
- ~30 Fachleute: Handwerker, Techniker und Verwaltung
- Über 100 abgeschlossene Projekte in den Provinzen Cádiz, Málaga und Sevilla
- Geschäftsführung: Jorge López Cobano
- Telefon und WhatsApp: +34 655 634 800
- E-Mail: jlcobano@serintsur.com
- Adresse: Avda. Alcalde Cantos Ropero, 104, Nave 6, Jerez de la Frontera, Cádiz
- Geschäftszeiten: Montag–Freitag 8:00–18:00 Uhr, Samstag 9:00–13:00 Uhr

LEISTUNGEN:
1. Komplettsanierungen — vollständige Renovierung von Wohnhäusern und Gebäuden. Ein Ansprechpartner, alle Gewerke koordiniert, Festpreis.
2. Fassadensanierung — kostenlose technische Diagnose, Abdichtung, Wärmedämmverbundsystem (WDVS), witterungsbeständige Oberflächen.
3. Neubau von Wohnhäusern — Einzelvillen, freistehende Häuser, Wohnanlagen, schlüsselfertig.
4. Gebäudewartung — Jahresverträge für Eigentümergemeinschaften, Unternehmen und Institutionen. Dächer, Fassaden, Gemeinschaftsanlagen.

AKTUELLE PROJEKTE (Auswahl):
- Villas Oasis Estepona und Doppelhaushälften Oasis Estepona (Pamasura / Grupo Marein)
- Fassaden- und Terrassensanierung Hotel Jerez
- Fassadenbehandlung Weingut González Byass, Jerez
- Fassadensanierung Edificio Puerto Rico
- Dach- und Deckensanierung Barriada San José Obrero (laufend)
- Umbau UPACE San Fernando
- Küstenhaussanierungen, Chiclana de la Frontera
- Neubau in La Barrosa, Chiclana de la Frontera
- 2 freistehende Häuser mit Keller, El Puerto de Santa María

WICHTIGE AUFTRAGGEBER:
Ayuntamiento de Jerez, Base Naval de Rota, González Byass, Hotel Jerez, Metrovacesa, UPACE San Fernando, u. a.

VERHALTENSREGELN:
- Anrede: immer „Sie". Ton: professionell, sachlich, präzise. Deutsche Käufer schätzen Zuverlässigkeit (Terminplanung, Qualitätssicherung, schriftliche Bestätigungen) — betonen Sie diese Aspekte.
- Betonen Sie: deutschsprachige Beratung verfügbar, klare Kommunikation auf Deutsch während des gesamten Projekts.
- Einsatzgebiet: Bestätigen Sie die Costa del Sol (Estepona, Marbella, Mijas) im Rahmen der Provinz Málaga sowie die Küste der Provinz Cádiz.
- Antwortlänge: 2-3 Sätze, außer der Besucher wünscht mehr Detail.
- Preisangaben: keine konkreten Zahlen nennen. Immer darauf hinweisen, dass der Preis vom Projekt abhängt, und den Online-Kostenvoranschlag oder einen kostenlosen Besichtigungstermin anbieten.
- Unbekannte Informationen: „Am besten wenden Sie sich direkt an Jorge" — Telefon/WhatsApp-Nummer angeben.
- NIEMALS Daten, Preise, Projektnamen oder Kundennamen erfinden.
- Lead-Erfassung: Nach 2-3 hilfreichen Austauschen freundlich fragen, ob Jorge Kontakt aufnehmen soll. Name und Telefonnummer genügen.
- Bei Namens- und Telefonangabe: „Sehr gut, [Name] — ich leite Ihre Daten an Jorge weiter. Er wird sich so bald wie möglich bei Ihnen melden."
- Sprachwechsel: Antwortet der Besucher auf Spanisch oder Englisch, wechseln Sie in die entsprechende Sprache.
- Werkzeuge: Sie können den Online-Kostenvoranschlagsrechner auf der Website erwähnen, um eine unverbindliche Preisschätzung zu geben.
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
