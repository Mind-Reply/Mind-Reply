'use client';

import React from 'react';

export default function AboutSection() {
  return (
    <section
      id="about"
      style={{ padding: '96px 24px', maxWidth: 1280, margin: '0 auto', position: 'relative' }}
      aria-labelledby="about-heading"
    >
      {/* Ambient */}
      <div style={{
        position: 'absolute', top: '40%', right: '10%',
        width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none',
      }} aria-hidden="true" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 64 }} className="lg-about-grid">
        <style>{`@media(min-width:1024px){.lg-about-grid{grid-template-columns:1fr 1fr!important}}`}</style>

        {/* Left */}
        <div>
          <span style={{
            fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.14em', color: 'var(--primary, #c9a96e)',
            display: 'block', marginBottom: 14,
          }}>
            The Foundation
          </span>
          <h2
            id="about-heading"
            style={{
              fontFamily: 'var(--font-display, Fraunces, serif)',
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              fontWeight: 300, letterSpacing: '-0.02em',
              color: 'var(--foreground, #f2ede6)', marginBottom: 28,
            }}
          >
            Composure is<br />
            <em style={{ color: 'rgba(201,169,110,0.75)' }}>an engineered quality.</em>
          </h2>

          <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--muted-foreground, #7a7068)', marginBottom: 20, maxWidth: 480 }}>
            MindReply was built for a specific kind of professional: one who holds high standards, operates across multiple domains, and cannot afford to bleed bandwidth into noise.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--muted-foreground, #7a7068)', maxWidth: 480 }}>
            The ecosystem is designed around the principle that <em style={{ color: 'var(--foreground, #f2ede6)', fontStyle: 'normal' }}>operational composure — the capacity to handle complexity without chaos</em> — is achievable with the right infrastructure.
          </p>

          {/* Testimonial */}
          <div style={{
            marginTop: 48,
            borderLeft: '2px solid rgba(201,169,110,0.3)',
            paddingLeft: 24,
          }}>
            <p style={{ fontSize: 16, fontFamily: 'var(--font-display, Fraunces, serif)', fontWeight: 300, fontStyle: 'italic', color: 'var(--foreground, #f2ede6)', lineHeight: 1.65, marginBottom: 16 }}>
              "It does not feel like software. It feels like having someone who already understands the situation — and knows exactly what to do next."
            </p>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted-foreground, #7a7068)' }}>
              Agency Principal, London
            </p>
          </div>
        </div>

        {/* Right — principles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, justifyContent: 'center' }}>
          {[
            {
              icon: '◎',
              title: 'Signal before volume',
              desc: 'Every capability is calibrated to surface what matters and absorb what does not. The ecosystem prioritises decision quality over activity quantity.',
            },
            {
              icon: '◈',
              title: 'Composure under pressure',
              desc: 'High-standard work requires a system that does not degrade under load. MindReply is built for demanding environments, not just comfortable ones.',
            },
            {
              icon: '◷',
              title: 'Context that compounds',
              desc: 'Memory is not storage — it is accumulation. Each interaction builds richer context, so the ecosystem grows more attuned over time.',
            },
            {
              icon: '◐',
              title: 'Privacy without compromise',
              desc: 'End-to-end encryption. Your data trains nothing outside your own context. Discretion is structural, not optional.',
            },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                background: 'var(--card, #111115)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 18, padding: '24px 28px',
                display: 'flex', gap: 20, alignItems: 'flex-start',
                transition: 'border-color 0.3s ease',
              }}
              className="card-glow"
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(201,169,110,0.2)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
            >
              <span style={{
                fontSize: 20, color: 'var(--primary, #c9a96e)',
                flexShrink: 0, marginTop: 2, lineHeight: 1,
              }}>
                {item.icon}
              </span>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground, #f2ede6)', marginBottom: 6 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--muted-foreground, #7a7068)' }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div style={{
        marginTop: 80,
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1,
        background: 'rgba(255,255,255,0.04)',
        borderRadius: 20, overflow: 'hidden',
      }} className="stats-4col">
        <style>{`@media(min-width:768px){.stats-4col{grid-template-columns:repeat(4,1fr)!important}}`}</style>

        {[
          { stat: '98%', label: 'Voice fidelity across message types' },
          { stat: '<4s', label: 'Average operation resolution' },
          { stat: 'AES-256', label: 'Encryption standard for all context' },
          { stat: '20min', label: 'Typical onboarding to first live operation' },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              padding: '32px 28px', textAlign: 'center' as const,
              background: 'var(--card, #111115)',
            }}
          >
            <p style={{ fontFamily: 'var(--font-display, Fraunces, serif)', fontSize: 32, fontWeight: 300, color: 'var(--primary, #c9a96e)', marginBottom: 8, lineHeight: 1 }}>
              {item.stat}
            </p>
            <p style={{ fontSize: 11, color: 'var(--muted-foreground, #7a7068)', lineHeight: 1.5 }}>
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
