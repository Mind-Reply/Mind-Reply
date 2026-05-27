import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db, gmailTokens } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await db.delete(gmailTokens).where(eq(gmailTokens.userId, userId));
  return NextResponse.json({ ok: true });
}
