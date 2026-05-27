import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { db, tasks } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import { randomUUID } from 'crypto';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const result = await db.select().from(tasks)
    .where(eq(tasks.userId, userId))
    .orderBy(desc(tasks.createdAt));

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { title, description, priority, dueAt, tags } = body;

  if (!title) return NextResponse.json({ error: 'Title required' }, { status: 400 });

  const [task] = await db.insert(tasks).values({
    id: randomUUID(),
    userId,
    title,
    description: description || null,
    priority: priority ?? 0,
    dueAt: dueAt ? new Date(dueAt) : null,
    tags: tags || [],
    status: 'pending',
  }).returning();

  return NextResponse.json(task, { status: 201 });
}
