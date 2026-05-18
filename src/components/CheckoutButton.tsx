/**
 * src/components/CheckoutButton.tsx
 * 
 * Reusable Stripe Checkout Button Component
 * Drop-in component for pricing page with full UX
 */

'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ''
);

interface CheckoutButtonProps {
  planId: string;
  planName: string;
  price: number;
  email?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function CheckoutButton({
  planId,
  planName,
  price,
  email,
  className = '',
  children = 'Get Started',
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (price === 0) {
      // Free tier - just show success
      window.location.href = '/?free-signup=true';
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get user email if not provided
      const userEmail =
        email ||
        prompt('Enter your email address:') ||
        '';

      if (!userEmail || !userEmail.includes('@')) {
        setError('Please provide a valid email address');
        setLoading(false);
        return;
      }

      // Create checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          email: userEmail,
          returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId, url } = await response.json();

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      } else {
        const stripe = await stripePromise;
        if (stripe && sessionId) {
          const result = await stripe.redirectToCheckout({
            sessionId,
          });

          if (result.error) {
            throw new Error(result.error.message);
          }
        }
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to create checkout session'
      );
      setLoading(false);
    }
  };

  return (
    <div className="checkout-button-wrapper">
      <button
        onClick={handleCheckout}
        disabled={loading}
        className={`checkout-button ${loading ? 'loading' : ''} ${className}`}
        style={{
          backgroundColor: '#c9a96e',
          color: '#09090b',
          padding: '12px 24px',
          borderRadius: '6px',
          border: 'none',
          fontWeight: '600',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          transition: 'all 0.2s ease',
          fontSize: '14px',
          letterSpacing: '0.5px',
        }}
      >
        {loading ? 'Processing...' : children}
      </button>

      {error && (
        <div
          style={{
            color: '#ef4444',
            fontSize: '12px',
            marginTop: '8px',
            textAlign: 'center',
          }}
        >
          {error}
        </div>
      )}

      {/* Stripe branding required for Checkout */}
      <p
        style={{
          fontSize: '11px',
          color: '#7a7068',
          marginTop: '12px',
          textAlign: 'center',
        }}
      >
        Powered by{' '}
        <a
          href="https://stripe.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#7a7068', textDecoration: 'underline' }}
        >
          Stripe
        </a>
      </p>
    </div>
  );
}
