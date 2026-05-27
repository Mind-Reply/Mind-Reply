export const dynamic = 'force-dynamic';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db, users, tasks, messages } from '@/lib/db';
import { eq, count, gte, and } from 'drizzle-orm';
import AnalyticsClient from '@/components/dashboard/AnalyticsClient';

export default async function AnalyticsPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) redirect('/dashboard');

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [totalTasks] = await db.select({ count: count() }).from(tasks).where(eq(tasks.userId, userId));
  const [doneTasks] = await db.select({ count: count() }).from(tasks)
    .where(and(eq(tasks.userId, userId), eq(tasks.status, 'done')));
  const [totalMsgs] = await db.select({ count: count() }).from(messages).where(eq(messages.userId, userId));
  const [recentMsgs] = await db.select({ count: count() }).from(messages)
    .where(and(eq(messages.userId, userId), gte(messages.createdAt, thirtyDaysAgo)));

  return (
    <AnalyticsClient
      user={user}
      stats={{
        totalTasks: totalTasks.count,
        doneTasks: doneTasks.count,
        totalMessages: totalMsgs.count,
        recentMessages: recentMsgs.count,
        opsUsed: user.operationsUsed,
        opsLimit: user.operationsLimit,
      }}
    />
  );
}
