/**
 * Stripe Configuration and Helper Functions
 */

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2024-04-10',
});

// Plan definitions
export const PLANS = {
  essentials: {
    name: 'Essentials',
    priceMonthly: 2997,
    priceYearly: 29970,
    currency: 'gbp',
    interval: 'month' as const,
  },
  executive: {
    name: 'Executive',
    priceMonthly: 7997,
    priceYearly: 79970,
    currency: 'gbp',
    interval: 'month' as const,
  },
  enterprise: {
    name: 'Enterprise',
    priceMonthly: 14997,
    priceYearly: 149970,
    currency: 'gbp',
    interval: 'month' as const,
  },
};

export type PlanId = keyof typeof PLANS;

/**
 * Create a Stripe customer
 */
export async function createStripeCustomer(params: {
  email: string;
  metadata?: Stripe.MetadataParam;
}): Promise<Stripe.Customer> {
  const { email, metadata } = params;

  // Check if customer already exists
  const existingCustomers = await stripe.customers.list({
    email,
    limit: 1,
  });

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0];
  }

  // Create new customer
  return await stripe.customers.create({
    email,
    metadata,
  });
}

/**
 * Ensure product and price exist in Stripe
 */
export async function ensureProductAndPrice(plan: typeof PLANS[PlanId]): Promise<{
  product: Stripe.Product;
  price: Stripe.Price;
}> {
  // Search for existing product
  const products = await stripe.products.list({
    active: true,
    limit: 100,
  });

  let product = products.data.find(p => p.name === plan.name);

  // Create product if it doesn't exist
  if (!product) {
    product = await stripe.products.create({
      name: plan.name,
      description: `${plan.name} Subscription Plan`,
    });
  }

  // Search for existing price
  const prices = await stripe.prices.list({
    product: product.id,
    active: true,
    limit: 100,
  });

  let price = prices.data.find(
    p =>
      p.unit_amount === plan.priceMonthly &&
      p.currency === plan.currency &&
      p.recurring?.interval === plan.interval
  );

  // Create price if it doesn't exist
  if (!price) {
    price = await stripe.prices.create({
      product: product.id,
      unit_amount: plan.priceMonthly,
      currency: plan.currency,
      recurring: {
        interval: plan.interval,
      },
    });
  }

  return { product, price };
}
