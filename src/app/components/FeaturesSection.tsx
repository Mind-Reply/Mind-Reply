'use client';

import React, { useEffect, useRef } from 'react';

const capabilities = [
  {
    id: 'signal',
    tag: '01',
    title: 'Signal Orchestration',
    description: 'Complex multi-step workflows executed with contextual awareness. Your operations know what matters, sequenced in the right order, completed without supervision.',
    stat: '3.2s',
    statLabel: 'avg. resolution',
  },
  {
    id: 'inbox',
    tag: '02',
    title: 'Inbox Composure',
    description: 'Threads prioritised, replies calibrated, momentum preserved. Every message handled with the tone and intent you would deploy yourself — without the drain.',
    stat: '94%',
    statLabel: 'voice fidelity',
    accent: true,
    tall: true,
    items: ['Reply shaped — tone: precise', 'Thread resolved — 3 actions surfaced', 'Follow-up anchored — Tuesday 9am'],
  },
  {
    id: 'content',
    tag: '03',
    title: 'Content Fluency',
    description: 'Drafts, refinements, and publication — your content pipeline flows with consistent voice and deliberate structure. Built for real output, not approximations.',
  },
  {
    id: 'ops',
    tag: '04',
    title: 'Invisible Leverage',
    description: 'Form submissions, data handling, scheduling, and web tasks executed with zero friction. Precision at every repetition, so your attention stays on decisions that compound.',
    stat: '10k+',
    statLabel: 'ops / month',
  },
  {
    id: 'memory',
    tag: '05',
    title: 'Context Recall',
    description: 'Preferences, patterns, and prior interactions retained across sessions — so every operation builds on what came before. The system grows more attuned, quietly.',
  },
];

export default function FeaturesSection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.08 }
    );
    ref.current?.querySelectorAll('.reveal').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const card = {
    background: 'var(--card, #111115)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 24,
    padding: 32,
    transition: 'all 0.4s ease',
  };

  return (
    <section
      id="features"
      ref={ref}
      style={{ padding: '96px 24px', maxWidth: 1280, margin: '0 auto' }}
      aria-labelledby="features-heading"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 64 }} className="md:flex-row md:items-end md:justify-between">
        <div className="reveal">
          <span style={{
            fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.14em', color: 'var(--primary, #c9a96e)',
            display: 'block', marginBottom: 14,
          }}>
            Capabilities
          </span>
          <h2
            id="features-heading"
            style={{
              fontFamily: 'var(--font-display, Fraunces, serif)',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 300, lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: 'var(--foreground, #f2ede6)',
            }}
          >
            Built for every<br />
            <em style={{ color: 'rgba(201,169,110,0.75)', fontStyle: 'italic' }}>dimension of work.</em>
          </h2>
        </div>
        <p className="reveal" style={{
          maxWidth: 340, fontSize: 13.5, lineHeight: 1.75,
          color: 'var(--muted-foreground, #7a7068)',
          textAlign: 'right' as const,
        }}>
          Five core disciplines, unified inside one ecosystem — structured, on-signal, and built to scale without losing composure.
        </p>
      </div>

      {/* Bento Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {/* Card 1 */}
        <div className="reveal card-glow" style={{ ...card }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(201,169,110,0.5)' }}>
              {capabilities[0].tag}
            </span>
            <div style={{ textAlign: 'right' as const }}>
              <p style={{ fontFamily: 'var(--font-display, Fraunces, serif)', fontSize: 32, fontWeight: 300, color: 'var(--foreground, #f2ede6)', lineHeight: 1 }}>
                {capabilities[0].stat}
              </p>
              <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted-foreground, #7a7068)', marginTop: 4 }}>
                {capabilities[0].statLabel}
              </p>
            </div>
          </div>
          <h3 style={{ fontFamily: 'var(--font-display, Fraunces, serif)', fontSize: 20, fontWeight: 400, color: 'var(--foreground, #f2ede6)', marginBottom: 12 }}>
            {capabilities[0].title}
          </h3>
          <p style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--muted-foreground, #7a7068)' }}>
            {capabilities[0].description}
          </p>
        </div>

        {/* Card 2 — accent, row-span-2 */}
        <div className="reveal card-glow" style={{
          ...card,
          background: 'rgba(201,169,110,0.06)',
          border: '1px solid rgba(201,169,110,0.15)',
          gridRow: 'span 2',
          display: 'flex', flexDirection: 'column',
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(201,169,110,0.6)', display: 'block', marginBottom: 24 }}>
            {capabilities[1].tag}
          </span>
          <h3 style={{ fontFamily: 'var(--font-display, Fraunces, serif)', fontSize: 22, fontWeight: 400, color: 'var(--foreground, #f2ede6)', marginBottom: 16 }}>
            {capabilities[1].title}
          </h3>
          <p style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--muted-foreground, #7a7068)', marginBottom: 32 }}>
            {capabilities[1].description}
          </p>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <div style={{
              background: 'rgba(9,9,11,0.5)', borderRadius: 16,
              padding: 20, border: '1px solid rgba(255,255,255,0.05)',
              marginBottom: 24,
            }}>
              {capabilities[1].items?.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: i < 2 ? 12 : 0 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--primary, #c9a96e)', flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: 'rgba(242,237,230,0.65)', fontWeight: 500 }}>{item}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontFamily: 'var(--font-display, Fraunces, serif)', fontSize: 40, fontWeight: 300, color: 'var(--primary, #c9a96e)', lineHeight: 1 }}>
                  {capabilities[1].stat}
                </p>
                <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted-foreground, #7a7068)', marginTop: 6 }}>
                  {capabilities[1].statLabel}
                </p>
              </div>
              <div style={{ width: 56, height: 56, borderRadius: '50%', border: '1px solid rgba(201,169,110,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(201,169,110,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="live-dot" style={{ width: 10, height: 10 }} aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="reveal card-glow" style={{ ...card }}>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(201,169,110,0.5)', display: 'block', marginBottom: 20 }}>
            {capabilities[2].tag}
          </span>
          <h3 style={{ fontFamily: 'var(--font-display, Fraunces, serif)', fontSize: 20, fontWeight: 400, color: 'var(--foreground, #f2ede6)', marginBottom: 12 }}>
            {capabilities[2].title}
          </h3>
          <p style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--muted-foreground, #7a7068)' }}>
            {capabilities[2].description}
          </p>
        </div>

        {/* Card 4 */}
        <div className="reveal card-glow" style={{ ...card }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(201,169,110,0.5)' }}>
              {capabilities[3].tag}
            </span>
            <div style={{ textAlign: 'right' as const }}>
              <p style={{ fontFamily: 'var(--font-display, Fraunces, serif)', fontSize: 32, fontWeight: 300, color: 'var(--foreground, #f2ede6)', lineHeight: 1 }}>
                {capabilities[3].stat}
              </p>
              <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted-foreground, #7a7068)', marginTop: 4 }}>
                {capabilities[3].statLabel}
              </p>
            </div>
          </div>
          <h3 style={{ fontFamily: 'var(--font-display, Fraunces, serif)', fontSize: 20, fontWeight: 400, color: 'var(--foreground, #f2ede6)', marginBottom: 12 }}>
            {capabilities[3].title}
          </h3>
          <p style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--muted-foreground, #7a7068)' }}>
            {capabilities[3].description}
          </p>
        </div>

        {/* Card 5 — full width */}
        <div className="reveal card-glow" style={{ ...card, gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="md:flex-row md:items-center md:justify-between">
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(201,169,110,0.5)', display: 'block', marginBottom: 16 }}>
                {capabilities[4].tag}
              </span>
              <h3 style={{ fontFamily: 'var(--font-display, Fraunces, serif)', fontSize: 20, fontWeight: 400, color: 'var(--foreground, #f2ede6)', marginBottom: 12 }}>
                {capabilities[4].title}
              </h3>
              <p style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--muted-foreground, #7a7068)', maxWidth: 480 }}>
                {capabilities[4].description}
              </p>
            </div>

            {/* Memory bars visual */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, flexShrink: 0 }} aria-hidden="true">
              {[35, 55, 75, 90, 68, 82, 48, 70, 95, 60].map((h, i) => (
                <div key={i} style={{ width: 8, height: 60, background: 'rgba(201,169,110,0.1)', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                  <div style={{
                    position: 'absolute', bottom: 0, width: '100%',
                    height: `${h}%`,
                    background: `rgba(201,169,110,${0.2 + (h / 100) * 0.6})`,
                    borderRadius: 4,
                    transition: 'height 1.2s ease',
                  }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
