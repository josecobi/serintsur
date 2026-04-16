/**
 * Chatbot — floating AI assistant widget.
 *
 * FAB (bottom-right) toggles a chat panel. Consumes `/api/chat` via SSE,
 * streams the reply into the last assistant bubble as it arrives, persists
 * the conversation to sessionStorage for the current tab.
 *
 * The welcome message is client-only UI chrome (not a real conversation
 * turn) — we never POST a trailing assistant message to the API.
 */

import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';

import { getStrings, type Locale } from '~/lib/i18n';

import { streamChat } from './api';
import { initialState, reducer } from './reducer';
import { clearMessages, loadMessages, saveMessages } from './storage';
import type { ChatMessage } from './types';

export interface ChatbotProps {
  /** Page locale — drives UI strings and the `language` field on `/api/chat`. */
  language: Locale;
  /** Override the default WhatsApp "talk to a human" fallback link. */
  whatsappUrl?: string;
}

const DEFAULT_WHATSAPP_URL = 'https://wa.me/34655634800';

export default function Chatbot({ language, whatsappUrl = DEFAULT_WHATSAPP_URL }: ChatbotProps) {
  const t = useMemo(() => getStrings(language), [language]);
  const [state, dispatch] = useReducer(reducer, initialState);
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Hydrate from sessionStorage on mount. Deliberately per-locale so switching
  // languages starts a clean conversation in the new language.
  useEffect(() => {
    const stored = loadMessages(language);
    if (stored.length > 0) dispatch({ type: 'HYDRATE', messages: stored });
  }, [language]);

  useEffect(() => {
    saveMessages(language, state.messages);
  }, [language, state.messages]);

  // Auto-scroll to the newest message / streaming token.
  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [state.messages, state.streamingText, state.isOpen]);

  // Abort any in-flight stream when the component unmounts.
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const sendMessage = useCallback(
    (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || state.streaming) return;

      // The `/api/chat` endpoint requires the last message to be user-role,
      // so we build the next messages array here and reuse it for the POST.
      const nextMessages: ChatMessage[] = [
        ...state.messages,
        { role: 'user', content: trimmed },
      ];
      dispatch({ type: 'SEND_USER', content: trimmed });

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      void streamChat({
        messages: nextMessages,
        language,
        signal: controller.signal,
        onText: (delta) => dispatch({ type: 'STREAM_DELTA', value: delta }),
        onDone: () => dispatch({ type: 'STREAM_DONE' }),
        onError: (message) =>
          dispatch({ type: 'STREAM_ERROR', message: message || t.chatbot.errorGeneric }),
      });
    },
    [language, state.messages, state.streaming, t.chatbot.errorGeneric],
  );

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!inputRef.current) return;
    const value = inputRef.current.value;
    inputRef.current.value = '';
    sendMessage(value);
  };

  const handleQuickReply = (text: string) => {
    sendMessage(text);
  };

  const handleHumanHandoff = () => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleClear = () => {
    clearMessages(language);
    dispatch({ type: 'CLEAR' });
  };

  const showQuickReplies = state.messages.length === 0 && !state.streaming;

  return (
    <div className="chatbot-root">
      {/* Floating action button */}
      <button
        type="button"
        onClick={() => dispatch({ type: 'TOGGLE' })}
        aria-label={state.isOpen ? t.chatbot.closeLabel : t.chatbot.openLabel}
        aria-expanded={state.isOpen}
        aria-controls="chatbot-panel"
        className="chatbot-fab fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-gray-900 text-white shadow-lg flex items-center justify-center hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {state.isOpen ? <IconClose /> : <IconChat />}
      </button>

      {/* Chat panel */}
      {state.isOpen && (
        <section
          id="chatbot-panel"
          role="dialog"
          aria-label={t.chatbot.title}
          className="chatbot-panel fixed z-40 bg-white shadow-xl flex flex-col border border-gray-200 bottom-0 right-0 left-0 top-0 sm:bottom-24 sm:right-5 sm:left-auto sm:top-auto sm:w-[380px] sm:h-[540px] sm:rounded-2xl"
        >
          <header className="chatbot-header flex items-center gap-3 p-4 border-b border-gray-200">
            <div
              aria-hidden="true"
              className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold"
            >
              S
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate">{t.chatbot.title}</div>
              <div className="text-xs text-gray-500">{t.chatbot.poweredBy}</div>
            </div>
            <button
              type="button"
              onClick={handleClear}
              aria-label={t.errors.tryAgain}
              className="chatbot-clear text-xs text-gray-500 hover:text-gray-800 px-2"
              disabled={state.messages.length === 0 && !state.error}
            >
              ↻
            </button>
            <button
              type="button"
              onClick={() => dispatch({ type: 'CLOSE' })}
              aria-label={t.chatbot.closeLabel}
              className="chatbot-close text-gray-500 hover:text-gray-800 p-1"
            >
              <IconClose />
            </button>
          </header>

          <div className="chatbot-messages flex-1 overflow-y-auto p-4 space-y-3">
            {/* Welcome message — UI-only, not sent to the API. */}
            <Bubble role="assistant">{t.chatbot.greeting}</Bubble>

            {state.messages.map((msg, i) => (
              <Bubble key={i} role={msg.role}>
                {msg.content}
              </Bubble>
            ))}

            {state.streaming && (
              <Bubble role="assistant" streaming>
                {state.streamingText || <TypingDots />}
              </Bubble>
            )}

            {state.error && (
              <div
                role="alert"
                className="chatbot-error text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-2"
              >
                {state.error}
              </div>
            )}

            <div ref={scrollAnchorRef} />
          </div>

          {showQuickReplies && (
            <div className="chatbot-quick-replies px-4 pb-2 flex flex-wrap gap-2">
              {([
                t.chatbot.quickReplies.services,
                t.chatbot.quickReplies.quote,
                t.chatbot.quickReplies.timeline,
              ] as const).map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleQuickReply(label)}
                  className="chatbot-quick-reply text-sm border border-gray-300 rounded-full px-3 py-1.5 hover:border-gray-900"
                >
                  {label}
                </button>
              ))}
              <button
                type="button"
                onClick={handleHumanHandoff}
                className="chatbot-quick-reply text-sm border border-gray-300 rounded-full px-3 py-1.5 hover:border-gray-900"
              >
                {t.chatbot.quickReplies.contact}
              </button>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="chatbot-input-row p-3 border-t border-gray-200 flex items-end gap-2"
          >
            <textarea
              ref={inputRef}
              rows={1}
              placeholder={t.chatbot.placeholder}
              disabled={state.streaming}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              className="chatbot-input flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 text-sm max-h-32"
            />
            <button
              type="submit"
              disabled={state.streaming}
              className="chatbot-send bg-gray-900 text-white rounded-lg px-4 py-2 text-sm disabled:opacity-50"
            >
              {state.streaming ? t.chatbot.sending : '→'}
            </button>
          </form>

          <div className="chatbot-footer text-[11px] text-gray-500 px-3 pb-3 text-center">
            {t.chatbot.disclaimer}
          </div>
        </section>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Subcomponents
// ─────────────────────────────────────────────────────────────────────────────

function Bubble({
  role,
  children,
  streaming = false,
}: {
  role: 'user' | 'assistant';
  children: React.ReactNode;
  streaming?: boolean;
}) {
  const isUser = role === 'user';
  return (
    <div
      className={
        'chatbot-bubble flex ' + (isUser ? 'justify-end' : 'justify-start')
      }
      data-role={role}
      data-streaming={streaming || undefined}
    >
      <div
        className={
          'max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ' +
          (isUser ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900')
        }
      >
        {children}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="chatbot-typing inline-flex gap-1" aria-label="typing">
      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" />
      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
    </span>
  );
}

function IconChat() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="22"
      height="22"
      aria-hidden="true"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="20"
      height="20"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
