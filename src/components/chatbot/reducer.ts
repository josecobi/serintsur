/**
 * Chatbot state machine.
 *
 * Tracks the conversation, the in-flight streaming turn, and the UI error
 * surface. Streaming text lives in `streamingText` — when the stream ends,
 * we commit it to `messages` as an assistant turn.
 */

import type { ChatMessage } from './types';

export interface ChatbotState {
  isOpen: boolean;
  messages: ChatMessage[];
  /** In-flight assistant reply being assembled from SSE text deltas. */
  streamingText: string;
  /** `true` between POST and the `done` / `error` SSE event. */
  streaming: boolean;
  /** User-facing error text. Cleared on next send. */
  error: string | null;
}

export const initialState: ChatbotState = {
  isOpen: false,
  messages: [],
  streamingText: '',
  streaming: false,
  error: null,
};

export type ChatbotAction =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'TOGGLE' }
  | { type: 'HYDRATE'; messages: ChatMessage[] }
  | { type: 'SEND_USER'; content: string }
  | { type: 'STREAM_DELTA'; value: string }
  | { type: 'STREAM_DONE' }
  | { type: 'STREAM_ERROR'; message: string }
  | { type: 'CLEAR' };

export function reducer(state: ChatbotState, action: ChatbotAction): ChatbotState {
  switch (action.type) {
    case 'OPEN':
      return { ...state, isOpen: true };
    case 'CLOSE':
      return { ...state, isOpen: false };
    case 'TOGGLE':
      return { ...state, isOpen: !state.isOpen };
    case 'HYDRATE':
      return { ...state, messages: action.messages };
    case 'SEND_USER':
      return {
        ...state,
        messages: [...state.messages, { role: 'user', content: action.content }],
        streamingText: '',
        streaming: true,
        error: null,
      };
    case 'STREAM_DELTA':
      return { ...state, streamingText: state.streamingText + action.value };
    case 'STREAM_DONE': {
      const text = state.streamingText.trim();
      // Empty replies aren't useful; drop them silently instead of appending
      // a blank bubble.
      if (!text) {
        return { ...state, streamingText: '', streaming: false };
      }
      return {
        ...state,
        messages: [...state.messages, { role: 'assistant', content: text }],
        streamingText: '',
        streaming: false,
      };
    }
    case 'STREAM_ERROR':
      return {
        ...state,
        streamingText: '',
        streaming: false,
        error: action.message,
      };
    case 'CLEAR':
      return { ...initialState, isOpen: state.isOpen };
    default:
      return state;
  }
}
