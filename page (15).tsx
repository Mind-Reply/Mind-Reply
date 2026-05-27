import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { db, tasks } from '@/lib/db';
import { eq, and } from 'drizzle-orm';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const body = await req.json();

  const [task] = await db.update(tasks)
    .set({ ...body, updatedAt: new Date(), completedAt: body.status === 'done' ? new Date() : undefined })
    .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
    .returning();

  if (!task) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(task);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;

  await db.delete(tasks).where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
  return NextResponse.json({ ok: true });
}
