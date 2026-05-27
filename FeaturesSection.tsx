import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db, messages } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const result = await db.select().from(messages)
    .where(eq(messages.userId, userId))
    .orderBy(desc(messages.createdAt))
    .limit(200);

  return NextResponse.json(result);
}
