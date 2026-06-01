export const dynamic = 'force-dynamic';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db, users, tasks, messages, logs } from '@/lib/db';
import { eq, count, gte, and } from 'drizzle-orm';
import AnalyticsClient from '@/components/dashboard/AnalyticsClient';

export default async function AnalyticsPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) redirect('/dashboard');

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [totalTasks] = await db.select({ count: count() }).from(tasks).where(eq(tasks.userId, userId));
  const [doneTasks] = await db.select({ count: count() }).from(tasks).where(and(eq(tasks.userId, userId), eq(tasks.status, 'done')));
  const [pendingTasks] = await db.select({ count: count() }).from(tasks).where(and(eq(tasks.userId, userId), eq(tasks.status, 'pending')));
  const [inProgressTasks] = await db.select({ count: count() }).from(tasks).where(and(eq(tasks.userId, userId), eq(tasks.status, 'in_progress')));
  const [totalMsgs] = await db.select({ count: count() }).from(messages).where(eq(messages.userId, userId));
  const [recentMsgs] = await db.select({ count: count() }).from(messages).where(and(eq(messages.userId, userId), gte(messages.createdAt, thirtyDaysAgo)));
  const [weekMsgs] = await db.select({ count: count() }).from(messages).where(and(eq(messages.userId, userId), gte(messages.createdAt, sevenDaysAgo)));

  // Last 30 days of activity logs for timeline
  const activityLogs = await db.select().from(logs)
    .where(and(eq(logs.userId, userId), gte(logs.createdAt, thirtyDaysAgo)))
    .orderBy(logs.createdAt);

  // Build daily activity data for chart
  const dailyMap: Record<string, { date: string; chats: number; tasks: number; ops: number }> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    dailyMap[key] = { date: key, chats: 0, tasks: 0, ops: 0 };
  }
  activityLogs.forEach(l => {
    const key = l.createdAt.toISOString().slice(0, 10);
    if (!dailyMap[key]) return;
    if (l.type === 'chat') dailyMap[key].chats++;
    if (l.type === 'task_created') dailyMap[key].tasks++;
    dailyMap[key].ops++;
  });

  return (
    <AnalyticsClient
      user={user}
      stats={{
        totalTasks: totalTasks.count,
        doneTasks: doneTasks.count,
        pendingTasks: pendingTasks.count,
        inProgressTasks: inProgressTasks.count,
        totalMessages: totalMsgs.count,
        recentMessages: recentMsgs.count,
        weekMessages: weekMsgs.count,
        opsUsed: user.operationsUsed,
        opsLimit: user.operationsLimit,
      }}
      chartData={Object.values(dailyMap)}
    />
  );
}
