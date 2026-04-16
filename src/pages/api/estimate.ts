import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { z } from 'zod';

import { LOCALES, type Locale } from '~/lib/i18n';
import { getClientIp, rateLimit } from '~/lib/rate-limit';
import {
  buildWhatsAppLink,
  formatEstimatorWhatsApp,
  type EstimatorLead,
} from '~/lib/whatsapp';

export const prerender = false;

// Same as /api/contact — the estimator sends roughly one lead per visitor and
// a minute-scale window comfortably absorbs legitimate retries.
const RATE_LIMIT = { limit: 5, windowMs: 60_000 };

// Enum slugs from docs/ai-integrations.md price matrix. Keeping these as slugs
// (not free text) lets us (a) validate tightly server-side and (b) render
// consistent Spanish labels in the WhatsApp message regardless of UI locale.
const PROJECT_TYPES = [
  'reforma_integral',
  'rehabilitacion_fachada',
  'construccion_nueva',
  'mantenimiento',
] as const;
type ProjectType = (typeof PROJECT_TYPES)[number];

const QUALITY_LEVELS = ['basica', 'media', 'alta', 'premium'] as const;
type QualityLevel = (typeof QUALITY_LEVELS)[number];

// WhatsApp messages always go out in Spanish — Jorge reads Spanish.
// The visitor's locale is preserved separately in the lead payload for triage.
const PROJECT_TYPE_LABELS_ES: Record<ProjectType, string> = {
  reforma_integral: 'Reforma integral',
  rehabilitacion_fachada: 'Rehabilitación de fachada',
  construccion_nueva: 'Construcción nueva',
  mantenimiento: 'Mantenimiento',
};

const QUALITY_LABELS_ES: Record<QualityLevel, string> = {
  basica: 'Básica',
  media: 'Media',
  alta: 'Alta',
  premium: 'Premium',
};

const EstimateSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(6).max(30),
  email: z.preprocess(
    (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
    z.string().trim().email().max(200).optional(),
  ),
  projectType: z.enum(PROJECT_TYPES),
  // Bounds mirror the estimator UI slider (20-1000 m²) with a little slack.
  area: z.number().finite().min(1).max(10_000),
  quality: z.enum(QUALITY_LEVELS),
  // Free-text to allow "Otra ubicación: Toledo" style entries. Client sends the
  // human-readable label that should appear in Jorge's WhatsApp message.
  location: z.string().trim().min(1).max(100),
  // Price range is computed client-side from the matrix in ai-integrations.md.
  // We accept what the client sends — the range is advisory, not authoritative.
  priceLow: z.number().finite().min(0).max(100_000_000),
  priceHigh: z.number().finite().min(0).max(100_000_000),
  language: z.enum(LOCALES as unknown as [Locale, ...Locale[]]),
  notes: z.string().trim().max(2000).optional(),
  // Honeypot — real users leave blank.
  website: z.string().max(0).optional().or(z.string().optional()),
});

export const POST: APIRoute = async ({ request }) => {
  const ip = getClientIp(request);
  const limit = rateLimit(`estimate:${ip}`, RATE_LIMIT.limit, RATE_LIMIT.windowMs);
  if (!limit.allowed) {
    return jsonError('Too many requests', 429, {
      'Retry-After': String(limit.retryAfterSeconds),
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError('Invalid JSON', 400);
  }

  const parsed = EstimateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError('Invalid input', 400, undefined, {
      issues: parsed.error.issues.map((i) => ({
        path: i.path.join('.'),
        message: i.message,
      })),
    });
  }

  if (parsed.data.priceHigh < parsed.data.priceLow) {
    return jsonError('priceHigh must be >= priceLow', 400);
  }

  // Silently accept honeypot hits — same pattern as /api/contact.
  if (parsed.data.website) {
    return jsonOk({ success: true, whatsappUrl: '', emailSent: false });
  }

  const lead: EstimatorLead = {
    name: parsed.data.name,
    phone: parsed.data.phone,
    email: parsed.data.email,
    projectType: PROJECT_TYPE_LABELS_ES[parsed.data.projectType],
    area: parsed.data.area,
    quality: QUALITY_LABELS_ES[parsed.data.quality],
    location: parsed.data.location,
    priceLow: parsed.data.priceLow,
    priceHigh: parsed.data.priceHigh,
    language: parsed.data.language,
  };

  const whatsappUrl = buildWhatsAppLink(formatEstimatorWhatsApp(lead));

  const emailSent = await sendEmailNotification(lead, parsed.data.notes).catch(
    (err: unknown) => {
      console.error('[estimate] email failed:', err);
      return false;
    },
  );

  return jsonOk({ success: true, whatsappUrl, emailSent });
};

async function sendEmailNotification(
  lead: EstimatorLead,
  notes: string | undefined,
): Promise<boolean> {
  const apiKey = import.meta.env.RESEND_API_KEY;
  const to = import.meta.env.CONTACT_EMAIL_TO;
  const from = import.meta.env.CONTACT_EMAIL_FROM;

  if (!apiKey || !to || !from) {
    console.warn('[estimate] Resend env vars missing — skipping email');
    return false;
  }

  const resend = new Resend(apiKey);
  const euros = (n: number) => n.toLocaleString('es-ES');
  const text = [
    'Nueva estimación de presupuesto desde la web de serintsur.com',
    '',
    `Nombre: ${lead.name}`,
    `Teléfono: ${lead.phone}`,
    lead.email ? `Email: ${lead.email}` : null,
    `Idioma: ${lead.language}`,
    '',
    `Proyecto: ${lead.projectType}`,
    `Superficie: ${lead.area} m²`,
    `Acabados: ${lead.quality}`,
    `Ubicación: ${lead.location}`,
    `Estimación: ${euros(lead.priceLow)}€ – ${euros(lead.priceHigh)}€`,
    notes ? '' : null,
    notes ? 'Notas del cliente:' : null,
    notes ?? null,
  ]
    .filter((line): line is string => line !== null)
    .join('\n');

  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: lead.email,
    subject: `Nueva estimación web: ${lead.name} — ${lead.projectType}`,
    text,
  });

  if (error) {
    console.error('[estimate] Resend error:', error);
    return false;
  }
  return true;
}

function jsonOk(data: Record<string, unknown>): Response {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

function jsonError(
  message: string,
  code: number,
  extraHeaders: Record<string, string> = {},
  details?: Record<string, unknown>,
): Response {
  return new Response(JSON.stringify({ error: message, code, ...(details ?? {}) }), {
    status: code,
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
  });
}
