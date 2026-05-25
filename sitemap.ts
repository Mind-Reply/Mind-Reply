'use client';

import React, { useEffect, useRef, useState } from 'react';

const OPERATIONS = [
  'Signal distilled — 3 priority threads surfaced from 47 unread',
  'Content calibrated — voice fidelity 98% on draft #4',
  'Research synthesised — 12 sources → 1 actionable brief',
  'Inbox composure restored — 8 responses dispatched',
  'Follow-up sequenced — 3 open threads closed',
  'Momentum mapped — weekly priorities locked in',
  'Task chain resolved — 5-step operation completed',
  'Context archived — 14 patterns stored for recall',
];

export default function HeroSection() {
  const [opIndex, setOpIndex] = useState(0);
  const [opCount, setOpCount] = useState(127);
  const [useCase, setUseCase] = useState('Inbox & Replies');
  const [scale, setScale] = useState('Agency');

  useEffect(() => {
    const iv = setInterval(() => {
      setOpIndex(i => (i + 1) % OPERATIONS.length);
      setOpCount(c => c + 1);
    }, 3200);
    return () => clearInterval(iv);
  }, []);

  return (
    <section
      aria-label="MindReply — operational composure for ambitious work"
      style={{
        position: 'relative', width: '100%', minHeight: '100svh',
        paddingTop: 120, paddingBottom: 80,
        display: 'grid', gridTemplateColumns: '1fr',
        maxWidth: 1280, margin: '0 auto', padding: '120px 24px 80px',
        zIndex: 10,
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '10%',
        width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '50%', right: '5%',
        width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(201,169,110,0.05) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none',
      }} />

      {/* Rotating badge */}
      <div style={{
        position: 'absolute', top: 120, right: 48,
        display: 'none',
      }} className="hidden md:block">
        <div style={{ position: 'relative', width: 90, height: 90 }}>
          <svg
            className="animate-spin-slow"
            viewBox="0 0 100 100"
            style={{ width: '100%', height: '100%', color: 'var(--primary, #c9a96e)' }}
            aria-hidden="true"
          >
            <defs>
              <path id="badge-circle" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1,-74,0" fill="transparent" />
            </defs>
            <text fontSize="9.5" fontFamily="DM Sans, sans-serif" fontWeight="600" letterSpacing="2.8px" fill="currentColor">
              <textPath href="#badge-circle" startOffset="0%">ON POINT • SIGNAL • HUMAN • MR •</textPath>
            </text>
          </svg>
          <span style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            fontFamily: 'var(--font-display, Fraunces, serif)',
            fontSize: 20, fontWeight: 300, fontStyle: 'italic',
            color: 'var(--primary, #c9a96e)',
          }}>
            M
          </span>
        </div>
      </div>

      {/* Two-column layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: 32,
        alignItems: 'end',
        maxWidth: 1280,
        margin: '0 auto',
        width: '100%',
      }}>
        {/* Left — content */}
        <div style={{ gridColumn: 'span 12' }} className="lg-col-5">
          <style>{`@media(min-width:1024px){.lg-col-5{grid-column:span 5!important}.lg-col-7{grid-column:span 7!important}}`}</style>

          <div style={{ marginBottom: 48 }}>
            <span style={{
              display: 'inline-block',
              padding: '4px 14px',
              border: '1px solid rgba(201,169,110,0.25)',
              borderRadius: 99,
              fontSize: 10, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.14em',
              color: 'var(--muted-foreground, #7a7068)',
              marginBottom: 28,
            }}>
              MR Hub · Active
            </span>

            <h1 style={{
              fontFamily: 'var(--font-display, Fraunces, serif)',
              fontSize: 'clamp(3.2rem, 8vw, 6.5rem)',
              fontWeight: 300,
              lineHeight: 0.92,
              letterSpacing: '-0.03em',
              color: 'var(--foreground, #f2ede6)',
              marginBottom: 28,
            }}>
              Your signal,<br />
              <em style={{ color: 'var(--primary, #c9a96e)', fontStyle: 'italic' }}>relentlessly</em><br />
              composed.
            </h1>

            <p style={{
              fontSize: 15, fontWeight: 500,
              color: 'var(--foreground, #f2ede6)', opacity: 0.85,
              maxWidth: 400, marginBottom: 20, lineHeight: 1.6,
            }}>
              MindReply is the invisible layer between your attention and everything demanding it.
            </p>

            <p style={{
              maxWidth: 380, fontSize: 13.5, lineHeight: 1.75,
              color: 'var(--muted-foreground, #7a7068)',
              borderLeft: '2px solid rgba(201,169,110,0.3)',
              paddingLeft: 20, marginLeft: 2,
            }}>
              Precision-calibrated operations across messages, tasks, content and workflow — delivered with the composure of someone who genuinely understands your work.
            </p>
          </div>

          {/* CTA Widget */}
          <div style={{
            background: 'rgba(17,17,21,0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 20,
            padding: 24,
            maxWidth: 440,
          }}
            className="card-glow"
          >
            <p style={{
              fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.14em', color: 'var(--muted-foreground, #7a7068)',
              marginBottom: 16,
            }}>
              Configure your operation
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              {(['Inbox & Replies', 'Tasks & Ops', 'Content', 'Research'] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setUseCase(opt)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 12,
                    border: `1px solid ${useCase === opt ? 'rgba(201,169,110,0.4)' : 'rgba(255,255,255,0.06)'}`,
                    background: useCase === opt ? 'rgba(201,169,110,0.08)' : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease',
                  }}
                >
                  <p style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted-foreground, #7a7068)', marginBottom: 3 }}>Use case</p>
                  <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--foreground, #f2ede6)' }}>{opt}</p>
                </button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              {(['Individual', 'Agency', 'Founder', 'Team'] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setScale(opt)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 12,
                    border: `1px solid ${scale === opt ? 'rgba(201,169,110,0.4)' : 'rgba(255,255,255,0.06)'}`,
                    background: scale === opt ? 'rgba(201,169,110,0.08)' : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease',
                  }}
                >
                  <p style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted-foreground, #7a7068)', marginBottom: 3 }}>Scale</p>
                  <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--foreground, #f2ede6)' }}>{opt}</p>
                </button>
              ))}
            </div>

            <a
              href="#pricing"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                width: '100%', height: 50, borderRadius: 14,
                background: 'var(--primary, #c9a96e)',
                color: 'var(--primary-foreground, #09090b)',
                fontSize: 11, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.12em',
                textDecoration: 'none', transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Enter MR Hub
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>

            <p style={{ textAlign: 'center', fontSize: 10, color: 'var(--muted-foreground, #7a7068)', marginTop: 12 }}>
              Signal plan free — no card required
            </p>
          </div>
        </div>

        {/* Right — atmospheric visual */}
        <div style={{ gridColumn: 'span 12', height: '55vh' }} className="lg-col-7 hidden md:block" aria-hidden="true">
          <div style={{
            position: 'relative', height: '100%', minHeight: 480,
            borderRadius: '46% 46% 50% 50% / 18% 18% 82% 82%',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <img
              src="/assets/images/hero-atmosphere.png"
              alt="Warm atmospheric workspace interior with amber lighting — the visual language of operational composure and deliberate precision"
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                objectPosition: 'center',
                transition: 'transform 2.5s ease',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)')}
              onMouseLeave={e => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1)')}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(9,9,11,0.7) 0%, rgba(9,9,11,0.1) 50%, transparent 100%)',
            }} />

            {/* Live operations card */}
            <div style={{
              position: 'absolute', bottom: 32, right: 32,
              background: 'rgba(9,9,11,0.7)', backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 16, padding: '14px 18px',
              maxWidth: 220,
            }}
              className="animate-float"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span className="live-dot" aria-hidden="true" />
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(242,237,230,0.8)' }}>
                  System active
                </span>
              </div>
              <p style={{
                fontSize: 10, color: 'rgba(242,237,230,0.55)',
                lineHeight: 1.6, marginBottom: 10,
                transition: 'all 0.5s ease',
              }}>
                {OPERATIONS[opIndex]}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 9, color: 'var(--muted-foreground, #7a7068)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Ops today
                </span>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--primary, #c9a96e)', fontFamily: 'var(--font-display, Fraunces, serif)' }}>
                  {opCount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div style={{
        position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      }} aria-hidden="true">
        <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--muted-foreground, #7a7068)' }}>
          Scroll
        </span>
        <div style={{
          width: 1, height: 40,
          background: 'linear-gradient(to bottom, rgba(201,169,110,0.4), transparent)',
        }} />
      </div>
    </section>
  );
}
