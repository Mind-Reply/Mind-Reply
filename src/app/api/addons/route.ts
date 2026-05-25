import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { db, users, addons } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { getStripe, ADDONS, detectCurrency } from '@/lib/stripe';
import { randomUUID } from 'crypto';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const result = await db.select().from(addons).where(eq(addons.userId, userId));
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { addonKey, currency: reqCurrency, returnUrl } = await req.json();
  const addon = ADDONS[addonKey as keyof typeof ADDONS];
  if (!addon) return NextResponse.json({ error: 'Invalid addon' }, { status: 400 });

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress || '';
  const country = clerkUser?.publicMetadata?.country as string | undefined;
  const currency = reqCurrency || detectCurrency(country);

  const unitAmount = addon.prices[currency as keyof typeof addon.prices] ?? addon.prices.gbp;
  const stripe = getStripe();

  let [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  let customerId = user?.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({ email, metadata: { clerkId: userId } });
    customerId = customer.id;
    await db.update(users).set({ stripeCustomerId: customerId }).where(eq(users.id, userId));
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'payment',
    line_items: [{
      price_data: { currency, unit_amount: unitAmount, product_data: { name: addon.name, description: addon.description } },
      quantity: 1,
    }],
    success_url: `${returnUrl || process.env.NEXT_PUBLIC_SITE_URL + '/dashboard'}?addon_success=true`,
    cancel_url: `${returnUrl || process.env.NEXT_PUBLIC_SITE_URL + '/dashboard/settings'}`,
    metadata: { clerkId: userId, addonKey },
  });

  return NextResponse.json({ url: session.url });
}
