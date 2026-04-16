/**
 * Anthropic Claude API client.
 *
 * Used server-side only (edge functions). The API key must never reach the
 * browser — all Claude calls go through `src/pages/api/*` routes.
 *
 * Model choice: Sonnet 4.6 is the right tier for a public chatbot — good
 * quality, lower cost than Opus. docs/ai-integrations.md mentioned an older
 * date-suffixed Sonnet 4 ID; we use the current unsuffixed alias instead.
 * If quality demands it, bump to `claude-opus-4-7` — the wrapper is agnostic.
 */

import Anthropic from '@anthropic-ai/sdk';

export const CHAT_MODEL = 'claude-sonnet-4-6';

/** Max tokens per chatbot reply. Kept tight — answers are meant to be 2-3 sentences. */
export const CHAT_MAX_TOKENS = 400;

let cachedClient: Anthropic | null = null;

/**
 * Lazily constructs a singleton Anthropic client. Reads `ANTHROPIC_API_KEY`
 * from `import.meta.env` so Astro/Vercel inject it at edge-function runtime.
 *
 * Throws if the key is missing — callers should catch and return 500 rather
 * than let the client surface a raw stack trace.
 */
export function getAnthropicClient(): Anthropic {
  if (cachedClient) return cachedClient;

  const apiKey = import.meta.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set');
  }

  cachedClient = new Anthropic({ apiKey });
  return cachedClient;
}
