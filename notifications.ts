export const dynamic = 'force-dynamic';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db, users, tasks, messages } from '@/lib/db';
import { eq, count, gte } from 'drizzle-orm';
import DashboardOverview from '@/components/dashboard/DashboardOverview';

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const clerkUser = await currentUser();

  // Upsert user in DB
  const existing = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  let user = existing[0];
  if (!user) {
    const email = clerkUser?.emailAddresses[0]?.emailAddress || '';
    const name = clerkUser?.fullName || null;
    [user] = await db.insert(users).values({
      id: userId, email, name,
      plan: 'signal', operationsLimit: 30, operationsUsed: 0,
    }).returning();
  }

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [taskCount] = await db.select({ count: count() }).from(tasks).where(eq(tasks.userId, userId));
  const [msgCount] = await db.select({ count: count() }).from(messages).where(eq(messages.userId, userId));
  const [recentTasks] = await db.select({ count: count() }).from(tasks)
    .where(eq(tasks.userId, userId));

  return (
    <DashboardOverview
      user={user}
      stats={{
        tasks: taskCount.count,
        messages: msgCount.count,
        opsUsed: user.operationsUsed,
        opsLimit: user.operationsLimit,
      }}
    />
  );
}
