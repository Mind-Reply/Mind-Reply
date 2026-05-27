export const dynamic = 'force-dynamic';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db, users, addons, gmailTokens } from '@/lib/db';
import { eq } from 'drizzle-orm';
import SettingsClient from '@/components/dashboard/SettingsClient';

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const clerkUser = await currentUser();
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) redirect('/dashboard');

  const userAddons = await db.select().from(addons).where(eq(addons.userId, userId));
  const [gmailToken] = await db.select().from(gmailTokens).where(eq(gmailTokens.userId, userId)).limit(1);

  return (
    <SettingsClient
      user={user}
      activeAddons={userAddons}
      gmailConnected={!!gmailToken}
      gmailEmail={gmailToken?.email || null}
      clerkName={clerkUser?.fullName || null}
    />
  );
}
