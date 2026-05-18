/**
 * src/app/api/webhooks/stripe/route.ts
 * 
 * Stripe Webhook Handler - Processes all subscription events
 * Handles: payment success/failure, subscription lifecycle, invoices, disputes
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type StripeEvent = Stripe.Event;

// ============================================================================
// WEBHOOK HANDLER
// ============================================================================

/**
 * Verify webhook signature and process event
 */
async function verifyAndProcessWebhook(
  request: NextRequest
): Promise<{ event: StripeEvent | null; error: string | null }> {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return {
        event: null,
        error: 'Missing stripe-signature header',
      };
    }

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    return {
      event,
      error: null,
    };
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return {
      event: null,
      error:
        error instanceof Error ? error.message : 'Signature verification failed',
    };
  }
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

/**
 * Handle payment success
 */
async function onPaymentIntentSucceeded(paymentIntent: any) {
  console.log(`✅ Payment succeeded: ${paymentIntent.id}`);

  // TODO: Update database - mark payment as successful
  // TODO: Send receipt email
  // TODO: Log to analytics
}

/**
 * Handle payment failure
 */
async function onPaymentIntentFailed(paymentIntent: any) {
  console.error(`❌ Payment failed: ${paymentIntent.id}`);
  console.error(`Error: ${paymentIntent.last_payment_error?.message}`);

  // TODO: Send failure notification email
  // TODO: Trigger automatic retry sequence
  // TODO: Update subscription status
}

/**
 * Handle invoice payment attempt
 */
async function onInvoicePaymentAttemptFailed(invoice: any) {
  console.error(`Invoice payment failed: ${invoice.id}`);

  // TODO: Send dunning email (1st attempt)
  // TODO: Schedule retry for 3 days later
  // TODO: Update customer billing status
}

/**
 * Handle invoice finalized
 */
async function onInvoiceFinalized(invoice: any) {
  console.log(`📄 Invoice finalized: ${invoice.id}`);

  // TODO: Send invoice email to customer
  // TODO: Save invoice record to database
  // TODO: Update customer billing history
}

/**
 * Handle subscription created
 */
async function onSubscriptionCreated(subscription: any) {
  console.log(`✅ Subscription created: ${subscription.id}`);

  // TODO: Save subscription to database
  // TODO: Activate customer account
  // TODO: Send welcome email
  // TODO: Start onboarding sequence
}

/**
 * Handle subscription updated
 */
async function onSubscriptionUpdated(subscription: any) {
  console.log(`🔄 Subscription updated: ${subscription.id}`);

  // TODO: Update subscription record in database
  // TODO: If plan changed, send confirmation email
  // TODO: Update user's feature access
}

/**
 * Handle subscription deleted/canceled
 */
async function onSubscriptionDeleted(subscription: any) {
  console.log(`❌ Subscription canceled: ${subscription.id}`);

  // TODO: Mark subscription as canceled in database
  // TODO: Archive customer account (but keep data)
  // TODO: Send cancellation confirmation
  // TODO: Trigger winback email sequence (30 days later)
}

/**
 * Handle trial ending soon
 */
async function onSubscriptionTrialWillEnd(subscription: any) {
  console.log(`⏰ Trial ending soon: ${subscription.id}`);

  // TODO: Send "trial ending in 7 days" email
  // TODO: Include upgrade incentive (e.g., 30% off)
}

/**
 * Handle customer deleted
 */
async function onCustomerDeleted(customer: any) {
  console.log(`🗑️  Customer deleted: ${customer.id}`);

  // TODO: Archive all customer data
  // TODO: Cancel all subscriptions
  // TODO: Send final confirmation
}

/**
 * Handle invoice payment succeeded
 */
async function onInvoicePaid(invoice: any) {
  console.log(`💳 Invoice paid: ${invoice.id}`);

  // TODO: Send receipt/invoice email
  // TODO: Update customer billing status
  // TODO: Log payment to analytics
}

// ============================================================================
// MAIN WEBHOOK ROUTE
// ============================================================================

export async function POST(request: NextRequest) {
  // Verify webhook signature
  const { event, error } = await verifyAndProcessWebhook(request);

  if (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  if (!event) {
    return NextResponse.json(
      { error: 'No event to process' },
      { status: 400 }
    );
  }

  // Log event
  console.log(`📨 Webhook event: ${event.type} (${event.id})`);

  try {
    // Route event to appropriate handler
    switch (event.type) {
      // PAYMENT EVENTS
      case 'payment_intent.succeeded':
        await onPaymentIntentSucceeded(event.data.object);
        break;

      case 'payment_intent.payment_failed':
        await onPaymentIntentFailed(event.data.object);
        break;

      // INVOICE EVENTS
      case 'invoice.payment_attempt_failed':
        await onInvoicePaymentAttemptFailed(event.data.object);
        break;

      case 'invoice.finalized':
        await onInvoiceFinalized(event.data.object);
        break;

      case 'invoice.paid':
        await onInvoicePaid(event.data.object);
        break;

      // SUBSCRIPTION EVENTS
      case 'customer.subscription.created':
        await onSubscriptionCreated(event.data.object);
        break;

      case 'customer.subscription.updated':
        await onSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await onSubscriptionDeleted(event.data.object);
        break;

      case 'customer.subscription.trial_will_end':
        await onSubscriptionTrialWillEnd(event.data.object);
        break;

      // CUSTOMER EVENTS
      case 'customer.deleted':
        await onCustomerDeleted(event.data.object);
        break;

      // Additional useful events
      case 'charge.dispute.created':
        console.warn(`Dispute created: ${event.data.object.id}`);
        break;

      case 'charge.refunded':
        console.log(`Refund processed: ${event.data.object.id}`);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return 200 OK to acknowledge receipt
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Error processing webhook' },
      { status: 500 }
    );
  }
}

// ============================================================================
// HEALTH CHECK (for testing)
// ============================================================================

export async function GET() {
  return NextResponse.json({
    status: 'webhook endpoint active',
    timestamp: new Date().toISOString(),
  });
}
