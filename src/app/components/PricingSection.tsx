'use client';

import React, { useState } from 'react';

const plans = [
  {
    id: 'signal',
    tier: 'Signal',
    price: 0,
    period: 'Free forever',
    tagline: 'Discover whether invisible leverage is right for your operation.',
    badge: null,
    features: [
      '30 operations / month',
      '1 active inbox monitored',
      'Content drafts up to 500 words',
      'Bandwidth Audit tool (unlimited)',
      'Signal Clarity Check (unlimited)',
      'MR Advisor access (limited)',
      'Community support',
    ],
    cta: 'Start free — no card',
    href: '#',
  },
  {
    id: 'growth',
    tier: 'Growth',
    price: 49,
    period: '/ month',
    tagline: 'For founders and individuals building deliberate leverage.',
    badge: null,
    features: [
      '500 operations / month',
      'Full inbox management',
      'Unlimited content drafting',
      'Research synthesis & summaries',
      'Daily focus cues — ranked priorities',
      'Context memory (30-day window)',
      'Email support',
    ],
    cta: 'Start with Growth',
    href: '#',
  },
  {
    id: 'pro',
    tier: 'Pro',
    price: 129,
    period: '/ month',
    tagline: 'Full-spectrum operational composure, including Momentum Clarity.',
    badge: 'Most chosen',
    features: [
      'Unlimited operations',
      'Complete digital operations suite',
      'Momentum Clarity — growth signals & priorities',
      'Persistent context memory & learning',
      'Custom agent character profiles',
      'Platform integrations (Slack, Notion, 80+)',
      'Priority support & guided onboarding',
    ],
    cta: 'Start with Pro',
    href: '#',
  },
];

const faqs = [
  {
    q: 'What distinguishes Signal plan from Growth and Pro?',
    a: 'Signal gives you a genuine taste of the ecosystem — monitored inbox, content drafts, and access to both clarity tools — within a monthly operational cap. It is not a watered-down trial; it is a functional tier designed for early exploration.',
  },
  {
    q: 'How does context memory work?',
    a: 'The system retains your preferences, communication style, decision patterns, and recurring priorities across sessions. Growth stores 30 days of context; Pro builds an indefinitely expanding understanding of your work.',
  },
  {
    q: 'What are "character profiles"?',
    a: 'On Pro, you can configure distinct operational profiles — different communication tones, decision styles, and priorities for different contexts (client-facing vs. internal, strategic vs. tactical). Each profile operates coherently within its frame.',
  },
  {
    q: 'Is my data private?',
    a: 'Operations are encrypted end-to-end. Your context never contributes to shared training. Memory is stored at AES-256. Sensitive handling is structural, not a setting.',
  },
  {
    q: 'How quickly does onboarding take?',
    a: 'Most members are operational within 20 minutes. A brief guided session configures the system; it begins supporting operations immediately after.',
  },
  {
    q: 'Can I upgrade or downgrade freely?',
    a: 'Yes. Plan changes take effect at the next billing cycle. Your context memory is preserved across tier changes.',
  },
];

export default function PricingSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [annual, setAnnual] = useState(false);

  return (
    <section
      id="pricing"
      style={{ padding: '96px 24px', maxWidth: 1280, margin: '0 auto' }}
      aria-labelledby="pricing-heading"
    >
      {/* Header */}
      <div style={{ textAlign: 'center' as const, marginBottom: 64 }}>
        <span style={{
          fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.14em', color: 'var(--primary, #c9a96e)',
          display: 'block', marginBottom: 14,
        }}>
          Membership
        </span>
        <h2
          id="pricing-heading"
          style={{
            fontFamily: 'var(--font-display, Fraunces, serif)',
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            fontWeight: 300, letterSpacing: '-0.02em',
            color: 'var(--foreground, #f2ede6)', marginBottom: 16,
          }}
        >
          Calibrated to where<br />
          <em style={{ color: 'rgba(201,169,110,0.75)' }}>you are today.</em>
        </h2>
        <p style={{ fontSize: 14, color: 'var(--muted-foreground, #7a7068)', maxWidth: 380, margin: '0 auto 32px' }}>
          No hidden layers. No complexity. Start free, scale when the value is undeniable.
        </p>

        {/* Annual toggle */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, color: annual ? 'var(--muted-foreground, #7a7068)' : 'var(--foreground, #f2ede6)' }}>Monthly</span>
          <button
            onClick={() => setAnnual(!annual)}
            aria-pressed={annual}
            style={{
              width: 44, height: 24, borderRadius: 12,
              background: annual ? 'var(--primary, #c9a96e)' : 'rgba(255,255,255,0.1)',
              border: 'none', cursor: 'pointer', position: 'relative',
              transition: 'background 0.3s ease',
            }}
          >
            <span style={{
              position: 'absolute', top: 3, left: annual ? 23 : 3,
              width: 18, height: 18, borderRadius: '50%',
              background: annual ? 'var(--primary-foreground, #09090b)' : 'rgba(255,255,255,0.6)',
              transition: 'left 0.3s ease',
            }} />
          </button>
          <span style={{ fontSize: 12, color: annual ? 'var(--foreground, #f2ede6)' : 'var(--muted-foreground, #7a7068)' }}>
            Annual <span style={{ color: 'var(--primary, #c9a96e)', fontSize: 10, fontWeight: 700 }}>−20%</span>
          </span>
        </div>
      </div>

      {/* Plans */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 96 }} className="pricing-grid">
        <style>{`@media(max-width:768px){.pricing-grid{grid-template-columns:1fr!important}}`}</style>

        {plans.map(plan => (
          <div
            key={plan.id}
            style={{
              position: 'relative', borderRadius: 24,
              padding: 36, display: 'flex', flexDirection: 'column',
              background: plan.id === 'pro' ? 'rgba(201,169,110,0.06)' : 'var(--card, #111115)',
              border: plan.id === 'pro' ? '1px solid rgba(201,169,110,0.25)' : '1px solid rgba(255,255,255,0.06)',
              transform: plan.id === 'pro' ? 'scale(1.02)' : 'scale(1)',
              boxShadow: plan.id === 'pro' ? '0 0 60px rgba(201,169,110,0.07)' : 'none',
            }}
          >
            {plan.badge && (
              <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)' }}>
                <span style={{
                  padding: '4px 16px', borderRadius: 99,
                  background: 'var(--primary, #c9a96e)',
                  color: 'var(--primary-foreground, #09090b)',
                  fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
                  whiteSpace: 'nowrap' as const,
                }}>
                  {plan.badge}
                </span>
              </div>
            )}

            <div style={{ marginBottom: 32 }}>
              <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--primary, #c9a96e)', marginBottom: 12 }}>
                {plan.tier}
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 10 }}>
                {plan.price === 0 ? (
                  <span style={{ fontFamily: 'var(--font-display, Fraunces, serif)', fontSize: 42, fontWeight: 300, color: 'var(--foreground, #f2ede6)', lineHeight: 1 }}>
                    Free
                  </span>
                ) : (
                  <>
                    <span style={{ fontFamily: 'var(--font-display, Fraunces, serif)', fontSize: 42, fontWeight: 300, color: 'var(--foreground, #f2ede6)', lineHeight: 1 }}>
                      £{annual ? Math.round(plan.price * 0.8) : plan.price}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--muted-foreground, #7a7068)' }}>
                      {plan.period}
                    </span>
                  </>
                )}
              </div>
              <p style={{ fontSize: 13, color: 'var(--muted-foreground, #7a7068)', lineHeight: 1.6 }}>
                {plan.tagline}
              </p>
            </div>

            <ul style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
              {plan.features.map((feat, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'var(--muted-foreground, #7a7068)' }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--primary, #c9a96e)', flexShrink: 0, marginTop: 5 }} />
                  {feat}
                </li>
              ))}
            </ul>

            <a
              href={plan.href}
              style={{
                display: 'block', textAlign: 'center' as const,
                padding: '14px 24px', borderRadius: 16,
                background: plan.id === 'pro' ? 'var(--primary, #c9a96e)' : 'transparent',
                color: plan.id === 'pro' ? 'var(--primary-foreground, #09090b)' : 'var(--foreground, #f2ede6)',
                border: plan.id === 'pro' ? 'none' : '1px solid rgba(255,255,255,0.12)',
                fontSize: 11, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.1em',
                textDecoration: 'none', transition: 'all 0.25s ease',
              }}
              onMouseEnter={e => {
                if (plan.id !== 'pro') {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'var(--foreground, #f2ede6)';
                  (e.currentTarget as HTMLAnchorElement).style.color = 'var(--background, #09090b)';
                } else {
                  (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85';
                }
              }}
              onMouseLeave={e => {
                if (plan.id !== 'pro') {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                  (e.currentTarget as HTMLAnchorElement).style.color = 'var(--foreground, #f2ede6)';
                } else {
                  (e.currentTarget as HTMLAnchorElement).style.opacity = '1';
                }
              }}
            >
              {plan.cta}
            </a>
          </div>
        ))}
      </div>

      {/* Membership benefits */}
      <div style={{
        background: 'var(--card, #111115)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 24, padding: '40px 48px', marginBottom: 80,
      }}>
        <h3 style={{
          fontFamily: 'var(--font-display, Fraunces, serif)',
          fontSize: 22, fontWeight: 300, fontStyle: 'italic',
          color: 'var(--foreground, #f2ede6)', marginBottom: 32,
          textAlign: 'center' as const,
        }}>
          Where membership becomes personal.
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }} className="benefits-4col">
          <style>{`@media(min-width:768px){.benefits-4col{grid-template-columns:repeat(4,1fr)!important}}`}</style>

          {[
            { icon: '◎', title: 'Personal calibration', desc: 'Your priorities steer the ecosystem. Output stays aligned with your standards.' },
            { icon: '◈', title: 'Encrypted discretion', desc: 'End-to-end processing. Private context memory. Sensitive work handled with composure.' },
            { icon: '◷', title: 'Operational readiness', desc: 'Guided onboarding brings the system live in under 20 minutes.' },
            { icon: '◐', title: 'Expanded depth', desc: 'Higher tiers unlock greater capability. Priority support accelerates progress.' },
          ].map(item => (
            <div key={item.title} style={{ textAlign: 'center' as const }}>
              <span style={{ fontSize: 22, color: 'var(--primary, #c9a96e)', display: 'block', marginBottom: 12 }}>{item.icon}</span>
              <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground, #f2ede6)', marginBottom: 8 }}>{item.title}</h4>
              <p style={{ fontSize: 12, color: 'var(--muted-foreground, #7a7068)', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <h3 style={{
          fontFamily: 'var(--font-display, Fraunces, serif)',
          fontSize: 22, fontWeight: 300, fontStyle: 'italic',
          color: 'var(--foreground, #f2ede6)', textAlign: 'center' as const, marginBottom: 40,
        }}>
          Common questions
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              style={{
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 18, overflow: 'hidden',
                transition: 'border-color 0.25s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(201,169,110,0.2)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                aria-expanded={openFaq === i}
                style={{
                  width: '100%', padding: '20px 24px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                  background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' as const,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground, #f2ede6)', lineHeight: 1.4 }}>
                  {faq.q}
                </span>
                <span style={{
                  width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                  border: `1px solid ${openFaq === i ? 'var(--primary, #c9a96e)' : 'rgba(255,255,255,0.1)'}`,
                  background: openFaq === i ? 'var(--primary, #c9a96e)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.25s ease',
                }}>
                  <svg
                    width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true"
                    style={{ transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }}
                  >
                    <path d="M2 4l3.5 3.5L9 4" stroke={openFaq === i ? 'var(--primary-foreground, #09090b)' : 'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>

              <div style={{
                maxHeight: openFaq === i ? 200 : 0,
                overflow: 'hidden', transition: 'max-height 0.4s ease',
              }}>
                <p style={{ padding: '0 24px 20px', fontSize: 13, lineHeight: 1.75, color: 'var(--muted-foreground, #7a7068)' }}>
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
