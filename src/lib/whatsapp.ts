/**
 * WhatsApp deep-link helpers.
 *
 * Jorge receives all leads as WhatsApp messages at `WHATSAPP_NUMBER`.
 * Each formatter returns plain text matching the templates in docs/ai-integrations.md.
 */

import type { Locale } from './i18n';

export const WHATSAPP_NUMBER = '34655634800';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ContactLead {
  name: string;
  phone: string;
  email?: string;
  message: string;
  language: Locale;
  source?: string;
}

export interface EstimatorLead {
  name: string;
  phone: string;
  email?: string;
  projectType: string;
  area: number;
  quality: string;
  location: string;
  priceLow: number;
  priceHigh: number;
  language: Locale;
}

export interface ChatbotLead {
  name: string;
  phone: string;
  email?: string;
  summary: string;
  language: Locale;
}

// ─────────────────────────────────────────────────────────────────────────────
// Link builder
// ─────────────────────────────────────────────────────────────────────────────

/** Build a `https://wa.me/<number>?text=<encoded>` deep link. */
export function buildWhatsAppLink(text: string, number: string = WHATSAPP_NUMBER): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Formatters
// ─────────────────────────────────────────────────────────────────────────────

export function formatContactWhatsApp(lead: ContactLead): string {
  const lines: string[] = [
    '🔔 NUEVO CONTACTO (formulario web)',
    `👤 Nombre: ${lead.name}`,
    `📱 Teléfono: ${lead.phone}`,
  ];
  if (lead.email) lines.push(`📧 Email: ${lead.email}`);
  lines.push('', '💬 Mensaje:', lead.message, '');
  lines.push(`🌐 Idioma: ${lead.language}`);
  if (lead.source) lines.push(`📍 Origen: ${lead.source}`);
  return lines.join('\n');
}

export function formatEstimatorWhatsApp(lead: EstimatorLead): string {
  const euros = (n: number) => n.toLocaleString('es-ES');
  return [
    'Hola, he usado el estimador de la web y me gustaría más información:',
    '',
    `📋 Proyecto: ${lead.projectType}`,
    `📐 Superficie: ${lead.area} m²`,
    `✨ Acabados: ${lead.quality}`,
    `📍 Ubicación: ${lead.location}`,
    `💰 Estimación: ${euros(lead.priceLow)}€ – ${euros(lead.priceHigh)}€`,
    '',
    `👤 Nombre: ${lead.name}`,
    `📱 Teléfono: ${lead.phone}`,
    ...(lead.email ? [`📧 Email: ${lead.email}`] : []),
    `🌐 Idioma: ${lead.language}`,
    '',
    '¿Podríamos concertar una visita?',
  ].join('\n');
}

export function formatChatbotWhatsApp(lead: ChatbotLead): string {
  const lines: string[] = [
    '🔔 NUEVO LEAD (chatbot web)',
    `👤 Nombre: ${lead.name}`,
    `📱 Teléfono: ${lead.phone}`,
  ];
  if (lead.email) lines.push(`📧 Email: ${lead.email}`);
  lines.push(`💬 Resumen: ${lead.summary}`);
  lines.push(`🌐 Idioma: ${lead.language}`);
  return lines.join('\n');
}
