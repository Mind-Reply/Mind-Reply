import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db, knowledge } from '@/lib/db';
import { eq } from 'drizzle-orm';

const ADMIN_IDS = (process.env.ADMIN_CLERK_IDS || '').split(',').filter(Boolean);

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId || (ADMIN_IDS.length > 0 && !ADMIN_IDS.includes(userId))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  await db.delete(knowledge).where(eq(knowledge.id, id));
  return NextResponse.json({ ok: true });
}
