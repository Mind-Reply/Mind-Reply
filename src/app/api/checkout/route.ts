/**
 * API Route: POST /api/checkout
 * 
 * Creates a Stripe Checkout Session for subscription signup
 * Handles plan selection, customer data, and redirect URLs
 */

import { NextRequest, NextResponse } from 'next/server';
import { createStripeCustomer, ensureProductAndPrice, PLANS } from '@/lib/stripe';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2024-04-10',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, planId, returnUrl } = body;

    // Validate inputs
    if (!email || !planId || !PLANS[planId as keyof typeof PLANS]) {
      return NextResponse.json(
        { error: 'Missing or invalid parameters' },
        { status: 400 }
      );
    }

    const plan = PLANS[planId as keyof typeof PLANS];

    // Create or retrieve product and price
    const { product, price } = await ensureProductAndPrice(plan);

    // Create customer
    const customer = await createStripeCustomer({
      email,
      metadata: {
        plan_id: planId,
        source: 'web_checkout',
      },
    });

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      // Redirect URLs
      success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${returnUrl}?success=false`,
      // Enable automatic tax collection
      automatic_tax: {
        enabled: true,
      },
      // Enable instant activation for immediate access
      subscription_data: {
        metadata: {
          plan_name: plan.name,
          created_from: 'web_checkout',
        },
      },
      // Custom success/error pages
      locale: 'auto',
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
