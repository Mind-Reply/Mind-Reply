import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { db, users } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { getStripe, PLAN_PRICES, detectCurrency } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { planId, currency: reqCurrency, returnUrl } = await req.json();
  if (!planId || !['growth', 'pro'].includes(planId)) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
  }

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress || '';
  const country = clerkUser?.publicMetadata?.country as string | undefined;
  const currency = reqCurrency || detectCurrency(country);

  const planPrices = PLAN_PRICES[planId];
  const unitAmount = planPrices[currency] ?? planPrices.gbp;

  const stripe = getStripe();

  // Get or create Stripe customer
  let [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  let customerId = user?.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({ email, metadata: { clerkId: userId } });
    customerId = customer.id;
    await db.update(users).set({ stripeCustomerId: customerId }).where(eq(users.id, userId));
  }

  // Create price on the fly (or use existing)
  const price = await stripe.prices.create({
    currency,
    unit_amount: unitAmount,
    recurring: { interval: 'month' },
    product_data: { name: `MindReply ${planId.charAt(0).toUpperCase() + planId.slice(1)}` },
  });

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: price.id, quantity: 1 }],
    success_url: `${returnUrl || process.env.NEXT_PUBLIC_SITE_URL + '/dashboard'}?success=true`,
    cancel_url: `${returnUrl || process.env.NEXT_PUBLIC_SITE_URL + '/dashboard/settings'}?canceled=true`,
    automatic_tax: { enabled: true },
    subscription_data: { metadata: { clerkId: userId, plan: planId } },
    metadata: { clerkId: userId, plan: planId },
  });

  return NextResponse.json({ url: session.url, sessionId: session.id });
}
