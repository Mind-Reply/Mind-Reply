import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Not Found',
  description: 'This page does not exist.',
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main style={{
        minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '120px 24px', textAlign: 'center' as const,
      }}>
        <div>
          <p style={{
            fontFamily: 'var(--font-display, Fraunces, serif)',
            fontSize: 'clamp(4rem, 12vw, 10rem)',
            fontWeight: 300, lineHeight: 1,
            color: 'rgba(201,169,110,0.15)',
            marginBottom: 24,
          }}>
            404
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display, Fraunces, serif)',
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            fontWeight: 300, color: 'var(--foreground, #f2ede6)', marginBottom: 16,
          }}>
            Signal not found.
          </h1>
          <p style={{ fontSize: 14, color: 'var(--muted-foreground, #7a7068)', marginBottom: 40 }}>
            This page does not exist in the MindReply ecosystem.
          </p>
          <a
            href="/"
            style={{
              display: 'inline-block', padding: '12px 28px', borderRadius: 99,
              background: 'var(--primary, #c9a96e)',
              color: 'var(--primary-foreground, #09090b)',
              fontSize: 11, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.1em',
              textDecoration: 'none',
            }}
          >
            Return home
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
