import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db, knowledge } from '@/lib/db';
import { desc } from 'drizzle-orm';
import { randomUUID } from 'crypto';

const ADMIN_IDS = (process.env.ADMIN_CLERK_IDS || '').split(',').filter(Boolean);

async function isAdmin(userId: string) {
  return ADMIN_IDS.length === 0 || ADMIN_IDS.includes(userId);
}

export async function GET() {
  const entries = await db.select().from(knowledge).orderBy(desc(knowledge.createdAt));
  return NextResponse.json(entries);
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId || !(await isAdmin(userId))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, content, tags } = await req.json();
  if (!title || !content) return NextResponse.json({ error: 'Title and content required' }, { status: 400 });

  const [entry] = await db.insert(knowledge).values({
    id: randomUUID(), title, content, tags: tags || null,
  }).returning();

  return NextResponse.json(entry, { status: 201 });
}
