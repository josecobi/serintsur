/**
 * Stream chat replies from `/api/chat` over Server-Sent Events.
 *
 * We can't use `EventSource` because it only supports GET; the chat endpoint
 * takes a POST body. So we do the SSE framing ourselves with
 * `fetch` + `body.getReader()` + `TextDecoder`.
 *
 * The SSE protocol here is deliberately minimal — one `data: <json>\n\n`
 * event per Claude text delta. Event shapes are defined in
 * `src/pages/api/chat.ts` and mirrored in `types.ts`.
 */

import type { Locale } from '~/lib/i18n';

import type { ChatMessage, ChatStreamEvent } from './types';

export interface StreamChatOptions {
  messages: ChatMessage[];
  language: Locale;
  signal?: AbortSignal;
  onText: (delta: string) => void;
  /** Fired exactly once per successful stream. */
  onDone: () => void;
  /** Fired on HTTP failure OR mid-stream `error` event OR abort. */
  onError: (message: string) => void;
}

export async function streamChat(opts: StreamChatOptions): Promise<void> {
  let response: Response;
  try {
    response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: opts.messages, language: opts.language }),
      signal: opts.signal,
    });
  } catch (err) {
    if ((err as { name?: string })?.name === 'AbortError') return;
    opts.onError(err instanceof Error ? err.message : 'Network error');
    return;
  }

  if (!response.ok) {
    const errBody = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    opts.onError(errBody?.error ?? `Request failed (${response.status})`);
    return;
  }

  if (!response.body) {
    opts.onError('Empty response');
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // SSE events are terminated by a blank line (`\n\n`). Pop complete
      // frames; the last chunk may be incomplete — hold it in `buffer`.
      const frames = buffer.split('\n\n');
      buffer = frames.pop() ?? '';

      for (const frame of frames) {
        const event = parseFrame(frame);
        if (!event) continue;

        if (event.type === 'text') {
          opts.onText(event.value);
        } else if (event.type === 'done') {
          opts.onDone();
          return;
        } else if (event.type === 'error') {
          opts.onError(event.message);
          return;
        }
      }
    }

    // Stream ended without an explicit `done` — treat any buffered text as
    // complete so the UI doesn't hang.
    opts.onDone();
  } catch (err) {
    if ((err as { name?: string })?.name === 'AbortError') return;
    opts.onError(err instanceof Error ? err.message : 'Stream error');
  } finally {
    reader.releaseLock();
  }
}

/**
 * Parse a single SSE frame (one or more lines, no trailing blank).
 * Only `data:` lines are meaningful in our protocol; we ignore `:comment`
 * lines and any other fields the browser / proxies might inject.
 */
function parseFrame(frame: string): ChatStreamEvent | null {
  const lines = frame.split('\n');
  const dataLines: string[] = [];
  for (const line of lines) {
    if (line.startsWith('data:')) {
      dataLines.push(line.slice(5).trimStart());
    }
  }
  if (dataLines.length === 0) return null;

  try {
    const parsed: unknown = JSON.parse(dataLines.join('\n'));
    if (!parsed || typeof parsed !== 'object') return null;
    const obj = parsed as { type?: unknown };
    if (obj.type === 'text' && typeof (parsed as { value?: unknown }).value === 'string') {
      return { type: 'text', value: (parsed as { value: string }).value };
    }
    if (obj.type === 'done') {
      return { type: 'done' };
    }
    if (
      obj.type === 'error' &&
      typeof (parsed as { message?: unknown }).message === 'string'
    ) {
      return { type: 'error', message: (parsed as { message: string }).message };
    }
    return null;
  } catch {
    return null;
  }
}
