export const dynamic = 'force-dynamic';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db, logs, users, knowledge } from '@/lib/db';
import { desc, count } from 'drizzle-orm';
import AdminClient from './AdminClient';

// Only allow specific admin user IDs — add yours from Clerk dashboard
const ADMIN_IDS = (process.env.ADMIN_CLERK_IDS || '').split(',').filter(Boolean);

export default async function AdminPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  // Restrict to admins — if no ADMIN_IDS set, allow first user (dev mode)
  if (ADMIN_IDS.length > 0 && !ADMIN_IDS.includes(userId)) {
    redirect('/dashboard');
  }

  const recentLogs = await db.select().from(logs).orderBy(desc(logs.createdAt)).limit(100);
  const allUsers = await db.select().from(users).orderBy(desc(users.createdAt)).limit(200);
  const knowledgeEntries = await db.select().from(knowledge).orderBy(desc(knowledge.createdAt));
  const [{ count: totalUsers }] = await db.select({ count: count() }).from(users);
  const planCounts = allUsers.reduce((acc, u) => {
    acc[u.plan] = (acc[u.plan] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <AdminClient
      logs={recentLogs}
      users={allUsers}
      knowledgeEntries={knowledgeEntries}
      stats={{ totalUsers: Number(totalUsers), planCounts }}
    />
  );
}
