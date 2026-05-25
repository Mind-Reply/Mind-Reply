import { db, logs } from './db';
import { randomUUID } from 'crypto';

export async function log(type: string, meta: Record<string, unknown>, userId?: string | null) {
  try {
    await db.insert(logs).values({
      id: randomUUID(),
      type,
      meta,
      userId: userId || null,
    });
  } catch {
    // Never let logging break the main flow
    console.error('Log write failed:', type, meta);
  }
}
