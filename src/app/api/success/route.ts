/**
 * src/app/api/success/route.ts
 * 
 * Success Page Handler - Displays after successful payment
 * Retrieves session details and shows confirmation
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10',
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing session_id' },
        { status: 400 }
      );
    }

    // Retrieve checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer'],
    });

    // Prepare response data
    const successData = {
      sessionId: session.id,
      customerId: session.customer,
      email: (session.customer as any)?.email,
      subscriptionId: session.subscription,
      amount: session.amount_total,
      currency: session.currency,
      items: session.line_items?.data.map((item) => ({
        name: item.description,
        price: item.price?.unit_amount,
        quantity: item.quantity,
      })),
      status: session.payment_status,
    };

    return NextResponse.json(successData);
  } catch (error) {
    console.error('Error retrieving session:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve session' },
      { status: 500 }
    );
  }
}
