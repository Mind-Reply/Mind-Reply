import { randomBytes } from 'crypto';

/**
 * Generates a URL-safe unique ID.
 * Prefixed IDs improve debuggability in logs and database queries.
 */
export function createId(prefix?: string): string {
  const id = randomBytes(12).toString('base64url');
  return prefix ? `${prefix}_${id}` : id;
}

/**
 * Returns a human-readable relative time string.
 */
export function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

/**
 * Safe JSON parse — returns null on failure instead of throwing.
 */
export function safeJsonParse<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * Truncates text to a maximum length with ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + '…';
}
