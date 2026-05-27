import { db, users } from './db';
import { eq, sql } from 'drizzle-orm';

export async function syncUser(clerkId: string, email: string, name?: string | null) {
  const existing = await db.select().from(users).where(eq(users.id, clerkId)).limit(1);
  if (existing.length > 0) {
    await db.update(users)
      .set({ email, name: name || null, updatedAt: new Date() })
      .where(eq(users.id, clerkId));
    return existing[0];
  }
  const [user] = await db.insert(users).values({
    id: clerkId, email, name: name || null,
    plan: 'signal', operationsLimit: 30, operationsUsed: 0,
  }).returning();
  return user;
}

export async function getUser(clerkId: string) {
  const [user] = await db.select().from(users).where(eq(users.id, clerkId)).limit(1);
  return user || null;
}

export async function incrementOperations(userId: string) {
  await db.update(users)
    .set({ operationsUsed: sql`${users.operationsUsed} + 1`, updatedAt: new Date() })
    .where(eq(users.id, userId));
}
