/**
 * Shared chatbot types.
 *
 * The on-wire shape matches the `/api/chat` request schema exactly, so we
 * can ship `messages` to the server without transformation.
 */

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

/** SSE event shapes emitted by `/api/chat` — must match `src/pages/api/chat.ts`. */
export type ChatStreamEvent =
  | { type: 'text'; value: string }
  | { type: 'done' }
  | { type: 'error'; message: string };
