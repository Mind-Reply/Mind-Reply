import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db, users } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { getStripe } from '@/lib/stripe';

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user?.stripeCustomerId) return NextResponse.json({ error: 'No billing account' }, { status: 400 });

  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/settings`,
  });

  return NextResponse.json({ url: session.url });
}
