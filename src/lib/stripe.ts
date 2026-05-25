import Stripe from 'stripe';

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY is not set');
  return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-04-10' });
}

export const PLANS = {
  signal: { name: 'Signal', price: 0, currency: 'gbp', interval: 'month' as const },
  growth: { name: 'Growth', price: 4900, currency: 'gbp', interval: 'month' as const },
  pro: { name: 'Pro', price: 12900, currency: 'gbp', interval: 'month' as const },
};

type Plan = (typeof PLANS)[keyof typeof PLANS];

export async function ensureProductAndPrice(plan: Plan) {
  const stripe = getStripe();
  const products = await stripe.products.list({ active: true });
  let product = products.data.find(p => p.name === plan.name);
  if (!product) product = await stripe.products.create({ name: plan.name });

  const prices = await stripe.prices.list({ product: product.id, active: true });
  let price = prices.data.find(p => p.unit_amount === plan.price && p.currency === plan.currency);
  if (!price) {
    price = await stripe.prices.create({
      product: product.id,
      unit_amount: plan.price,
      currency: plan.currency,
      recurring: { interval: plan.interval },
    });
  }
  return { product, price };
}

export async function createStripeCustomer(params: {
  email: string;
  metadata?: Record<string, string>;
}) {
  return getStripe().customers.create({ email: params.email, metadata: params.metadata });
}

export function getStripeClient() {
  return getStripe();
}
