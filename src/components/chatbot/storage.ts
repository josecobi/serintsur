/**
 * sessionStorage helpers for chatbot conversation history.
 *
 * Per `docs/ai-integrations.md`: "Messages persist during session
 * (sessionStorage), cleared on tab close". Keyed by locale so a visitor who
 * switches languages mid-session doesn't see Spanish-context replies in the
 * German UI.
 */

import type { Locale } from '~/lib/i18n';

import type { ChatMessage } from './types';

const STORAGE_PREFIX = 'serintsur.chat.v1';

function storageKey(language: Locale): string {
  return `${STORAGE_PREFIX}.${language}`;
}

export function loadMessages(language: Locale): ChatMessage[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.sessionStorage.getItem(storageKey(language));
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Minimal runtime validation — sessionStorage is trusted but not immortal.
    return parsed.filter(isValidMessage);
  } catch {
    return [];
  }
}

export function saveMessages(language: Locale, messages: ChatMessage[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(storageKey(language), JSON.stringify(messages));
  } catch {
    // Quota exceeded or storage disabled — fail silently, conversation still
    // works in-memory.
  }
}

export function clearMessages(language: Locale): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.removeItem(storageKey(language));
  } catch {
    // ignore
  }
}

function isValidMessage(m: unknown): m is ChatMessage {
  if (!m || typeof m !== 'object') return false;
  const obj = m as Record<string, unknown>;
  return (
    (obj.role === 'user' || obj.role === 'assistant') &&
    typeof obj.content === 'string' &&
    obj.content.length > 0
  );
}
