import React, { Suspense } from 'react';
import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import '../styles/tailwind.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#09090b',
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://mind-reply.com'),
  title: {
    default: 'MindReply — Operational Composure for Ambitious Work',
    template: '%s | MindReply',
  },
  description:
    'MindReply delivers invisible leverage — precision-calibrated operations for your inbox, content, research, and daily workflow. Where signal becomes momentum.',
  keywords: [
    'business operations', 'inbox management', 'workflow automation', 'content creation',
    'productivity', 'digital operations', 'growth strategy', 'clarity', 'momentum', 'MindReply',
  ],
  authors: [{ name: 'MindReply', url: 'https://mind-reply.com' }],
  creator: 'MindReply',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://mind-reply.com',
    siteName: 'MindReply',
    title: 'MindReply — Operational Composure for Ambitious Work',
    description: 'Precision-calibrated operations. Invisible leverage. Your signal, relentlessly composed.',
    images: [
      {
        url: '/assets/images/app_logo.png',
        width: 1200,
        height: 630,
        alt: 'MindReply — Operational composure platform for agencies, founders and premium individuals',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MindReply — Operational Composure for Ambitious Work',
    description: 'Precision-calibrated operations. Invisible leverage. Your signal, relentlessly composed.',
    images: ['/assets/images/app_logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: 'var(--font-sans, DM Sans, system-ui, sans-serif)' }}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
