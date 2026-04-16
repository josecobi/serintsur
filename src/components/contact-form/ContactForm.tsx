/**
 * ContactForm — client island posting to `/api/contact`.
 *
 * On success the API returns a pre-built `wa.me/...` deep link carrying the
 * full lead. We open it in a new tab so Jorge gets the message on his phone,
 * and show a success state in-page. Email delivery is best-effort server-side
 * (see `/api/contact`). The form works even if Resend is down.
 *
 * Honeypot `website` field silently blocks bots — leave it blank, keep it
 * visually hidden but not `display: none` (some bots skip hidden fields).
 */

import { useState } from 'react';

import { getStrings, type Locale } from '~/lib/i18n';

export interface ContactFormProps {
  language: Locale;
  /** Tag so Jorge can tell which page the lead came from (e.g. "home", "contact"). */
  source?: string;
}

type Status =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success'; whatsappUrl: string }
  | { kind: 'error'; message: string };

export default function ContactForm({ language, source }: ContactFormProps) {
  const t = getStrings(language);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  async function handleSubmit(event: { preventDefault: () => void; currentTarget: HTMLFormElement }) {
    event.preventDefault();
    if (status.kind === 'submitting') return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get('name') ?? ''),
      phone: String(data.get('phone') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
      website: String(data.get('website') ?? ''),
      language,
      source,
    };

    setStatus({ kind: 'submitting' });
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        setStatus({ kind: 'error', message: t.contact.error });
        return;
      }
      const json = (await res.json()) as { whatsappUrl?: string };
      const whatsappUrl = json.whatsappUrl ?? '';
      setStatus({ kind: 'success', whatsappUrl });
      form.reset();
      // Open WhatsApp automatically so the lead reaches Jorge's phone. Browsers
      // may block this popup since it's async — fall back to the visible link.
      if (whatsappUrl) window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    } catch {
      setStatus({ kind: 'error', message: t.contact.error });
    }
  }

  if (status.kind === 'success') {
    return (
      <div className="contact-form-success p-4 border border-green-300 bg-green-50 text-green-900 rounded-md">
        <p className="font-medium mb-2">{t.contact.success}</p>
        {status.whatsappUrl && (
          <a
            href={status.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-form-wa-link text-sm underline"
          >
            {t.common.chatWhatsApp}
          </a>
        )}
      </div>
    );
  }

  const submitting = status.kind === 'submitting';

  return (
    <form
      onSubmit={handleSubmit}
      className="contact-form space-y-3"
      noValidate
    >
      <Field
        name="name"
        label={t.contact.fields.name}
        placeholder={t.contact.placeholders.name}
        required
        minLength={2}
        autoComplete="name"
      />
      <Field
        name="phone"
        type="tel"
        label={t.contact.fields.phone}
        placeholder={t.contact.placeholders.phone}
        required
        minLength={6}
        autoComplete="tel"
      />
      <Field
        name="email"
        type="email"
        label={t.contact.fields.emailOptional}
        placeholder={t.contact.placeholders.email}
        autoComplete="email"
      />
      <Field
        name="message"
        label={t.contact.fields.message}
        placeholder={t.contact.placeholders.message}
        required
        minLength={5}
        multiline
      />

      {/* Honeypot: hidden-in-layout but present in DOM. Legit users never fill it. */}
      <label
        aria-hidden="true"
        className="contact-form-honeypot absolute left-[-9999px] w-px h-px overflow-hidden"
        tabIndex={-1}
      >
        <span>Website</span>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>

      {status.kind === 'error' && (
        <div
          role="alert"
          className="contact-form-error text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-2"
        >
          {status.message}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="contact-form-submit bg-gray-900 text-white rounded-md px-4 py-2 text-sm disabled:opacity-50"
      >
        {submitting ? t.contact.submitting : t.contact.submit}
      </button>
    </form>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Field primitive
// ─────────────────────────────────────────────────────────────────────────────

interface FieldProps {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  minLength?: number;
  multiline?: boolean;
  autoComplete?: string;
}

function Field({
  name,
  label,
  placeholder,
  type = 'text',
  required,
  minLength,
  multiline,
  autoComplete,
}: FieldProps) {
  const id = `contact-${name}`;
  const shared =
    'contact-form-input border border-gray-300 rounded-md px-3 py-2 text-sm w-full';
  return (
    <div className="contact-form-field">
      <label htmlFor={id} className="block text-sm text-gray-700 mb-1">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {multiline ? (
        <textarea
          id={id}
          name={name}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          rows={4}
          className={shared + ' resize-y min-h-[96px]'}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          autoComplete={autoComplete}
          className={shared}
        />
      )}
    </div>
  );
}
