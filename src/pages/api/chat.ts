import type { APIRoute } from 'astro';
import { z } from 'zod';

import { CHAT_MAX_TOKENS, CHAT_MODEL, getAnthropicClient } from '~/lib/anthropic';
import { LOCALES, type Locale } from '~/lib/i18n';
import { getClientIp, rateLimit } from '~/lib/rate-limit';
import { SYSTEM_PROMPTS } from '~/lib/system-prompts';

export const prerender = false;

// 20 requests/minute per IP — chatbot traffic is bursty but a single visitor
// rarely needs more than one reply every few seconds.
const RATE_LIMIT = { limit: 20, windowMs: 60_000 };

// Keep a small rolling window so prompt cost stays bounded. The system prompt
// already carries all company context; older turns add little value.
const MESSAGE_WINDOW = 10;
const MAX_MESSAGE_LENGTH = 4000;

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().trim().min(1).max(MAX_MESSAGE_LENGTH),
});

const ChatRequestSchema = z.object({
  messages: z.array(ChatMessageSchema).min(1).max(50),
  language: z.enum(LOCALES as unknown as [Locale, ...Locale[]]),
});

export const POST: APIRoute = async ({ request }) => {
  const ip = getClientIp(request);
  const limit = rateLimit(`chat:${ip}`, RATE_LIMIT.limit, RATE_LIMIT.windowMs);
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

  const parsed = ChatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError('Invalid input', 400, undefined, {
      issues: parsed.error.issues.map((i) => ({
        path: i.path.join('.'),
        message: i.message,
      })),
    });
  }

  const { language } = parsed.data;
  // Last user turn must actually be a user turn; drop malformed tails so we
  // never send a trailing assistant message to Claude (the API would 400).
  const windowed = parsed.data.messages.slice(-MESSAGE_WINDOW);
  if (windowed[windowed.length - 1]?.role !== 'user') {
    return jsonError('Last message must be from user', 400);
  }

  let client;
  try {
    client = getAnthropicClient();
  } catch (err) {
    console.error('[chat] anthropic client init failed:', err);
    return jsonError('Chat service unavailable', 500);
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: SseEvent): void => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };

      try {
        const messageStream = client.messages.stream({
          model: CHAT_MODEL,
          max_tokens: CHAT_MAX_TOKENS,
          system: SYSTEM_PROMPTS[language],
          messages: windowed,
        });

        for await (const event of messageStream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            send({ type: 'text', value: event.delta.text });
          }
        }

        send({ type: 'done' });
      } catch (err) {
        console.error('[chat] stream error:', err);
        send({ type: 'error', message: 'Stream interrupted' });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      // Disable proxy buffering on Vercel/nginx so chunks reach the client live.
      'X-Accel-Buffering': 'no',
    },
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Types + helpers
// ─────────────────────────────────────────────────────────────────────────────

type SseEvent =
  | { type: 'text'; value: string }
  | { type: 'done' }
  | { type: 'error'; message: string };

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
