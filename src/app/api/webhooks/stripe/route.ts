import { NextRequest, NextResponse } from 'next/server';
import { getStripe, PLAN_LIMITS } from '@/lib/stripe';
import { db, users, subscriptions, addons } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

function planFromMetadata(metadata: Record<string, string>): 'signal' | 'growth' | 'pro' {
  const plan = metadata?.plan;
  if (plan === 'growth') return 'growth';
  if (plan === 'pro') return 'pro';
  return 'signal';
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !webhookSecret) return NextResponse.json({ error: 'Missing signature' }, { status: 400 });

  const stripe = getStripe();
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const clerkId = session.metadata?.clerkId;
        const addonKey = session.metadata?.addonKey;
        if (!clerkId) break;

        if (addonKey) {
          await db.insert(addons).values({
            id: randomUUID(), userId: clerkId, addonKey,
            stripeItemId: session.id, active: true,
          }).onConflictDoNothing();

          if (addonKey === 'extra_ops_100' || addonKey === 'extra_ops_500') {
            const boost = addonKey === 'extra_ops_100' ? 100 : 500;
            const [u] = await db.select().from(users).where(eq(users.id, clerkId)).limit(1);
            if (u) await db.update(users).set({ operationsLimit: u.operationsLimit + boost }).where(eq(users.id, clerkId));
          }
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object as any;
        const clerkId = sub.metadata?.clerkId;
        if (!clerkId) break;

        const plan = planFromMetadata(sub.metadata);
        await db.update(users).set({
          plan, operationsLimit: PLAN_LIMITS[plan],
          stripeSubscriptionId: sub.id, updatedAt: new Date(),
        }).where(eq(users.id, clerkId));

        await db.insert(subscriptions).values({
          id: randomUUID(), userId: clerkId,
          stripeSubscriptionId: sub.id,
          stripePriceId: sub.items.data[0]?.price?.id || '',
          plan, status: sub.status,
          currentPeriodStart: new Date(sub.current_period_start * 1000),
          currentPeriodEnd: new Date(sub.current_period_end * 1000),
          cancelAtPeriodEnd: sub.cancel_at_period_end,
        }).onConflictDoUpdate({
          target: subscriptions.stripeSubscriptionId,
          set: {
            plan, status: sub.status,
            currentPeriodStart: new Date(sub.current_period_start * 1000),
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
            cancelAtPeriodEnd: sub.cancel_at_period_end,
          },
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as any;
        const clerkId = sub.metadata?.clerkId;
        if (!clerkId) break;
        await db.update(users).set({
          plan: 'signal', operationsLimit: PLAN_LIMITS.signal,
          stripeSubscriptionId: null, updatedAt: new Date(),
        }).where(eq(users.id, clerkId));
        await db.update(subscriptions).set({ status: 'canceled' })
          .where(eq(subscriptions.stripeSubscriptionId, sub.id));
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        const [user] = await db.select().from(users).where(eq(users.stripeCustomerId, invoice.customer)).limit(1);
        if (user) await db.update(subscriptions).set({ status: 'past_due' }).where(eq(subscriptions.userId, user.id));
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as any;
        const [user] = await db.select().from(users).where(eq(users.stripeCustomerId, invoice.customer)).limit(1);
        if (user) await db.update(users).set({ operationsUsed: 0, updatedAt: new Date() }).where(eq(users.id, user.id));
        break;
      }
    }
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
