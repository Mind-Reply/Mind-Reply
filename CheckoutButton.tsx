'use client';

import React, { useRef } from 'react';

const services = [
  {
    id: 'momentum',
    number: '01',
    title: 'Momentum Clarity',
    subtitle: 'Growth Signals & Next Actions',
    description: 'MindReply surfaces what is suppressing momentum, converts daily signals into ranked priorities, and sharpens conversion where demand already flows.',
    plan: 'Included in Pro',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80&fit=crop',
    alt: 'Illuminated data dashboard on dark monitor in a calm professional environment, representing growth signal analysis and strategic clarity',
  },
  {
    id: 'inbox',
    number: '02',
    title: 'Inbox Composure',
    subtitle: 'Messages & Deliberate Replies',
    description: 'Reads, ranks, and responds across email and team channels in your voice — crisp, timely, without the cognitive overhead of constant triage.',
    plan: 'Included in all plans',
    image: 'https://images.unsplash.com/photo-1483389127117-b6a2102724ae?w=800&q=80&fit=crop',
    alt: 'Clean minimal desk with open laptop showing message interface, soft ambient lighting — visual representation of inbox composure and focused communication',
  },
  {
    id: 'content',
    number: '03',
    title: 'Content Fluency',
    subtitle: 'Writing, Refinement & Publishing',
    description: 'From concept to publish-ready output — your content flows with consistent voice, deliberate rhythm, and none of the blank-page friction.',
    plan: 'Growth & Pro',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80&fit=crop',
    alt: 'Open notebook on warm-lit desk with pen, moody atmospheric writing space representing content creation with clarity and precision',
  },
  {
    id: 'research',
    number: '04',
    title: 'Deep Intelligence',
    subtitle: 'Research Synthesis & Reporting',
    description: 'Complex research distilled into clear summaries. What matters surfaced. What does not, discarded. Decisions informed before the meeting even starts.',
    plan: 'Growth & Pro',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80&fit=crop',
    alt: 'Abstract data visualisation on dark screen with low office lighting, representing research intelligence gathering and analytical precision',
  },
  {
    id: 'ops',
    number: '05',
    title: 'Deliberate Execution',
    subtitle: 'Workflow Operations & Digital Tasks',
    description: 'Forms, database entries, scheduling, and web tasks handled with measured precision — zero supervision, full accountability, nothing dropped.',
    plan: 'Pro',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80&fit=crop',
    alt: 'Code and workflow on dark computer screen representing automated digital operations, precision workflow execution and invisible leverage',
  },
];

export default function ServicesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'right' ? 480 : -480, behavior: 'smooth' });
  };

  return (
    <section
      id="services"
      style={{
        padding: '96px 0',
        background: 'var(--card, #111115)',
        borderRadius: '3rem 3rem 0 0',
        position: 'relative', overflow: 'hidden',
      }}
      aria-labelledby="services-heading"
    >
      {/* Ambient */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(201,169,110,0.04) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} aria-hidden="true" />

      {/* Header */}
      <div style={{
        padding: '0 24px 48px', maxWidth: 1280, margin: '0 auto',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
      }} className="md:px-12">
        <div>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--muted-foreground, #7a7068)', display: 'block', marginBottom: 14 }}>
            What We Handle
          </span>
          <h2
            id="services-heading"
            style={{
              fontFamily: 'var(--font-display, Fraunces, serif)',
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              fontWeight: 300, letterSpacing: '-0.02em',
              color: 'var(--foreground, #f2ede6)',
            }}
          >
            Five disciplines.<br />
            <em style={{ color: 'rgba(201,169,110,0.75)' }}>One composure.</em>
          </h2>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          {(['left', 'right'] as const).map(dir => (
            <button
              key={dir}
              onClick={() => scroll(dir)}
              aria-label={`Scroll services ${dir}`}
              style={{
                width: 44, height: 44, borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'transparent', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--foreground, #f2ede6)',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--foreground, #f2ede6)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--background, #09090b)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--foreground, #f2ede6)'; }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d={dir === 'left' ? 'M10 3L5 8l5 5' : 'M6 3l5 5-5 5'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Scroll cards */}
      <div
        ref={scrollRef}
        style={{
          display: 'flex', gap: 20, overflowX: 'auto',
          padding: '0 24px 48px',
          scrollSnapType: 'x mandatory',
        }}
        className="no-scrollbar"
        role="list"
      >
        {services.map(service => (
          <div
            key={service.id}
            style={{
              minWidth: 'min(85vw, 420px)',
              flexShrink: 0,
              scrollSnapAlign: 'center',
              position: 'relative',
            }}
            role="listitem"
          >
            {/* Shadow card */}
            <div style={{
              position: 'absolute', top: 12, left: 4, right: -4,
              height: '100%',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: 24, zIndex: 0,
              transition: 'all 0.4s ease',
            }} />

            <div style={{
              position: 'relative', height: 520, borderRadius: 24, overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.08)', zIndex: 1,
            }}>
              <img
                src={service.image}
                alt={service.alt}
                loading="lazy"
                style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  objectPosition: 'center',
                  opacity: 0.65, transition: 'all 0.7s ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0.85'; (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0.65'; (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }}
              />

              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(9,9,11,0.92) 0%, rgba(9,9,11,0.2) 55%, transparent 100%)',
              }} />

              <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: 28 }}>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(201,169,110,0.7)', display: 'block', marginBottom: 10 }}>
                  {service.number}
                </span>
                <h3 style={{ fontFamily: 'var(--font-display, Fraunces, serif)', fontSize: 24, fontWeight: 300, color: 'var(--foreground, #f2ede6)', marginBottom: 4 }}>
                  {service.title}
                </h3>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground, #7a7068)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {service.subtitle}
                </p>
                <p style={{ fontSize: 13, lineHeight: 1.65, color: 'rgba(242,237,230,0.7)', marginBottom: 18, maxWidth: 300 }}>
                  {service.description}
                </p>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 12px', borderRadius: 99,
                  border: '1px solid rgba(201,169,110,0.3)',
                  fontSize: 9, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                  color: 'var(--primary, #c9a96e)',
                }}>
                  {service.plan}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
