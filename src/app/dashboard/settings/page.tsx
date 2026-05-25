export const dynamic = 'force-dynamic';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db, users, addons } from '@/lib/db';
import { eq } from 'drizzle-orm';
import SettingsClient from '@/components/dashboard/SettingsClient';

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) redirect('/dashboard');

  const userAddons = await db.select().from(addons)
    .where(eq(addons.userId, userId));

  return <SettingsClient user={user} activeAddons={userAddons} />;
}
