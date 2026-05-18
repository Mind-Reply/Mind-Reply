import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import HeroSection from '@/app/components/HeroSection';
import FeaturesSection from '@/app/components/FeaturesSection';
import ServicesSection from '@/app/components/ServicesSection';
import ToolsSection from '@/app/components/ToolsSection';
import ChatSection from '@/app/components/ChatSection';
import AboutSection from '@/app/components/AboutSection';
import PricingSection from '@/app/components/PricingSection';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  alternates: { canonical: 'https://mind-reply.com' },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'MindReply',
  url: 'https://mind-reply.com',
  logo: 'https://mind-reply.com/assets/images/app_logo.png',
  description: 'MindReply delivers precision-calibrated operations — invisible leverage for ambitious agencies, founders and premium individuals.',
  sameAs: [],
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'MindReply',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: [
    { '@type': 'Offer', name: 'Signal', price: '0', priceCurrency: 'GBP' },
    { '@type': 'Offer', name: 'Growth', price: '49', priceCurrency: 'GBP' },
    { '@type': 'Offer', name: 'Pro', price: '129', priceCurrency: 'GBP' },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is MindReply?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MindReply is a precision operations ecosystem that handles your inbox, content, research and digital workflow with calibrated composure — so your attention stays where it compounds.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a free plan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The Signal plan is free with 30 operations per month, one active inbox, and access to the Bandwidth Audit tool. No card required.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is my data handled?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'All operations use end-to-end encryption. Your context never trains shared models. Memory is encrypted at AES-256 and stored privately.',
      },
    },
    {
      '@type': 'Question',
      name: 'How quickly can I start?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most members are operational within 20 minutes. Onboarding is guided and the system begins supporting operations immediately after configuration.',
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="fixed inset-0 grid-bg pointer-events-none z-0 opacity-100" aria-hidden="true" />

      <Header />

      <main>
        <HeroSection />
        <FeaturesSection />
        <ToolsSection />
        <ServicesSection />
        <ChatSection />
        <AboutSection />
        <PricingSection />
      </main>

      <Footer />
    </>
  );
}
