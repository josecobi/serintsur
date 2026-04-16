import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { z } from 'zod';

import { LOCALES, type Locale } from '~/lib/i18n';
import { getClientIp, rateLimit } from '~/lib/rate-limit';
import {
  buildWhatsAppLink,
  formatContactWhatsApp,
  type ContactLead,
} from '~/lib/whatsapp';

export const prerender = false;

const RATE_LIMIT = { limit: 5, windowMs: 60_000 };

const ContactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(6).max(30),
  // Empty strings are treated as "not provided".
  email: z.preprocess(
    (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
    z.string().trim().email().max(200).optional(),
  ),
  message: z.string().trim().min(5).max(2000),
  language: z.enum(LOCALES as unknown as [Locale, ...Locale[]]),
  source: z.string().trim().max(100).optional(),
  // Honeypot — legitimate users leave this blank; bots autofill it.
  website: z.string().max(0).optional().or(z.string().optional()),
});

export const POST: APIRoute = async ({ request }) => {
  const ip = getClientIp(request);
  const limit = rateLimit(`contact:${ip}`, RATE_LIMIT.limit, RATE_LIMIT.windowMs);
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

  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError('Invalid input', 400, undefined, {
      issues: parsed.error.issues.map((i) => ({
        path: i.path.join('.'),
        message: i.message,
      })),
    });
  }

  // Silently accept honeypot hits — don't let bots learn they were caught.
  if (parsed.data.website) {
    return jsonOk({ success: true, whatsappUrl: '', emailSent: false });
  }

  const lead: ContactLead = {
    name: parsed.data.name,
    phone: parsed.data.phone,
    email: parsed.data.email,
    message: parsed.data.message,
    language: parsed.data.language,
    source: parsed.data.source,
  };

  const whatsappUrl = buildWhatsAppLink(formatContactWhatsApp(lead));

  // Email is best-effort: if Resend fails, the lead still reaches Jorge via the
  // WhatsApp URL the client opens. Never block the response on email delivery.
  const emailSent = await sendEmailNotification(lead).catch((err: unknown) => {
    console.error('[contact] email failed:', err);
    return false;
  });

  return jsonOk({ success: true, whatsappUrl, emailSent });
};

async function sendEmailNotification(lead: ContactLead): Promise<boolean> {
  const apiKey = import.meta.env.RESEND_API_KEY;
  const to = import.meta.env.CONTACT_EMAIL_TO;
  const from = import.meta.env.CONTACT_EMAIL_FROM;

  if (!apiKey || !to || !from) {
    console.warn('[contact] Resend env vars missing — skipping email');
    return false;
  }

  const resend = new Resend(apiKey);
  const text = [
    'Nuevo mensaje desde el formulario de contacto de serintsur.com',
    '',
    `Nombre: ${lead.name}`,
    `Teléfono: ${lead.phone}`,
    lead.email ? `Email: ${lead.email}` : null,
    lead.source ? `Origen: ${lead.source}` : null,
    `Idioma: ${lead.language}`,
    '',
    'Mensaje:',
    lead.message,
  ]
    .filter((line): line is string => line !== null)
    .join('\n');

  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: lead.email,
    subject: `Nuevo contacto web: ${lead.name}`,
    text,
  });

  if (error) {
    console.error('[contact] Resend error:', error);
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
