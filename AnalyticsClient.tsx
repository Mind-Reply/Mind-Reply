'use client';

import React, { useState } from 'react';

const BANDWIDTH_ITEMS = [
  { label: 'Inbox & replies', key: 'inbox', max: 20, default: 8 },
  { label: 'Admin & scheduling', key: 'admin', max: 15, default: 5 },
  { label: 'Content drafting', key: 'content', max: 15, default: 6 },
  { label: 'Research & reporting', key: 'research', max: 12, default: 4 },
  { label: 'Task coordination', key: 'tasks', max: 10, default: 3 },
];

const CLARITY_QUESTIONS = [
  {
    q: 'How often does your inbox dictate your day?',
    options: ['Rarely — I own my schedule', 'Sometimes — it slips', 'Most days', 'It runs everything'],
    scores: [0, 1, 2, 3],
  },
  {
    q: 'What proportion of your week is repeatable tasks you could delegate?',
    options: ['Under 10%', '10–25%', '25–50%', 'More than half'],
    scores: [0, 1, 2, 3],
  },
  {
    q: 'How clear is your next growth priority right now?',
    options: ['Crystalline — I know exactly', 'Fairly clear', 'Somewhat foggy', 'Genuinely unclear'],
    scores: [0, 1, 2, 3],
  },
  {
    q: 'How often do urgent things displace important ones?',
    options: ['Almost never', 'Occasionally', 'Weekly', 'Daily, reliably'],
    scores: [0, 1, 2, 3],
  },
  {
    q: 'When did you last do three hours of uninterrupted deep work?',
    options: ['This week', 'Last week', 'Last month', "I can't remember"],
    scores: [0, 1, 2, 3],
  },
];

const CLARITY_RESULTS = [
  { range: [0, 4], label: 'High clarity', colour: '#4ade80', desc: 'Your signal-to-noise ratio is strong. MindReply would amplify what you already do well — adding depth, not rescue.' },
  { range: [5, 8], label: 'Moderate clarity debt', colour: '#c9a96e', desc: 'There are seams showing. Some bandwidth is leaking into repeatable tasks. The right infrastructure would reclaim it cleanly.' },
  { range: [9, 12], label: 'Significant interference', colour: '#f97316', desc: 'The reactive loop is real. Urgency is crowding out momentum. This is exactly the kind of noise MindReply is built to absorb.' },
  { range: [13, 15], label: 'Critical bandwidth loss', colour: '#ef4444', desc: 'You\'re operating in scarcity mode. The gap between your actual potential and what\'s available to you is substantial — and fixable.' },
];

type SliderValues = { [key: string]: number };

export default function ToolsSection() {
  const [activeTab, setActiveTab] = useState<'bandwidth' | 'clarity'>('bandwidth');
  const [sliders, setSliders] = useState<SliderValues>(
    Object.fromEntries(BANDWIDTH_ITEMS.map(item => [item.key, item.default]))
  );
  const [clarityAnswers, setClarityAnswers] = useState<number[]>(Array(CLARITY_QUESTIONS.length).fill(-1));
  const [claritySubmitted, setClaritySubmitted] = useState(false);

  const totalHours = Object.values(sliders).reduce((a, b) => a + b, 0);
  const reclaimable = Math.round(totalHours * 0.72);
  const reclaimPct = Math.round((reclaimable / Math.max(totalHours, 1)) * 100);

  const clarityScore = clarityAnswers.reduce((a, b) => a + Math.max(0, b), 0);
  const clarityResult = CLARITY_RESULTS.find(r => clarityScore >= r.range[0] && clarityScore <= r.range[1]) || CLARITY_RESULTS[0];
  const clarityComplete = clarityAnswers.every(a => a >= 0);

  return (
    <section
      id="tools"
      style={{ padding: '96px 24px', background: 'rgba(17,17,21,0.6)', position: 'relative', overflow: 'hidden' }}
      aria-labelledby="tools-heading"
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center' as const, marginBottom: 56 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.14em', color: 'var(--primary, #c9a96e)',
            display: 'block', marginBottom: 14,
          }}>
            Clarity Tools · Free Access
          </span>
          <h2
            id="tools-heading"
            style={{
              fontFamily: 'var(--font-display, Fraunces, serif)',
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              fontWeight: 300, letterSpacing: '-0.02em',
              color: 'var(--foreground, #f2ede6)', marginBottom: 16,
            }}
          >
            Discover where your attention<br />
            <em style={{ color: 'rgba(201,169,110,0.75)' }}>is actually going.</em>
          </h2>
          <p style={{ fontSize: 14, color: 'var(--muted-foreground, #7a7068)', maxWidth: 420, margin: '0 auto' }}>
            Two diagnostic tools, no login required. Run them, get clarity, decide from there.
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 48 }}>
          {(['bandwidth', 'clarity'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 24px', borderRadius: 99,
                border: `1px solid ${activeTab === tab ? 'rgba(201,169,110,0.5)' : 'rgba(255,255,255,0.08)'}`,
                background: activeTab === tab ? 'rgba(201,169,110,0.1)' : 'transparent',
                color: activeTab === tab ? 'var(--primary, #c9a96e)' : 'var(--muted-foreground, #7a7068)',
                fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em',
                cursor: 'pointer', transition: 'all 0.25s ease',
              }}
            >
              {tab === 'bandwidth' ? 'Bandwidth Audit' : 'Signal Clarity Check'}
            </button>
          ))}
        </div>

        {/* Tool panels */}
        {activeTab === 'bandwidth' && (
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr', gap: 32,
            maxWidth: 900, margin: '0 auto',
          }} className="md:grid-2col">
            <style>{`@media(min-width:768px){.md\\:grid-2col{grid-template-columns:1fr 1fr!important}}`}</style>

            {/* Sliders */}
            <div style={{
              background: 'var(--card, #111115)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 24, padding: 32,
            }}
              className="card-glow"
            >
              <h3 style={{
                fontFamily: 'var(--font-display, Fraunces, serif)',
                fontSize: 18, fontWeight: 400,
                color: 'var(--foreground, #f2ede6)', marginBottom: 8,
              }}>
                Weekly hours by category
              </h3>
              <p style={{ fontSize: 12, color: 'var(--muted-foreground, #7a7068)', marginBottom: 28 }}>
                Drag each to reflect your typical week.
              </p>

              {BANDWIDTH_ITEMS.map(item => (
                <div key={item.key} style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--foreground, #f2ede6)' }}>
                      {item.label}
                    </label>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary, #c9a96e)' }}>
                      {sliders[item.key]}h
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={item.max}
                    value={sliders[item.key]}
                    onChange={e => setSliders(s => ({ ...s, [item.key]: Number(e.target.value) }))}
                    aria-label={`${item.label} hours per week`}
                    style={{ width: '100%' }}
                  />
                </div>
              ))}
            </div>

            {/* Results */}
            <div style={{
              background: 'var(--card, #111115)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 24, padding: 32,
              display: 'flex', flexDirection: 'column',
            }}
              className="card-glow"
            >
              <h3 style={{
                fontFamily: 'var(--font-display, Fraunces, serif)',
                fontSize: 18, fontWeight: 400,
                color: 'var(--foreground, #f2ede6)', marginBottom: 28,
              }}>
                Your attention audit
              </h3>

              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: 'var(--muted-foreground, #7a7068)' }}>Total weekly hours</span>
                  <span style={{ fontFamily: 'var(--font-display, Fraunces, serif)', fontSize: 28, fontWeight: 300, color: 'var(--foreground, #f2ede6)' }}>{totalHours}h</span>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(100, (totalHours / 60) * 100)}%`, background: 'rgba(201,169,110,0.4)', borderRadius: 4, transition: 'width 0.5s ease' }} />
                </div>
              </div>

              <div style={{
                background: 'rgba(201,169,110,0.06)',
                border: '1px solid rgba(201,169,110,0.15)',
                borderRadius: 16, padding: 24, marginBottom: 24,
              }}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(201,169,110,0.7)', marginBottom: 12 }}>
                  Reclaim potential
                </p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontFamily: 'var(--font-display, Fraunces, serif)', fontSize: 48, fontWeight: 300, color: 'var(--primary, #c9a96e)', lineHeight: 1 }}>
                    {reclaimable}h
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--muted-foreground, #7a7068)' }}>per week</span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--muted-foreground, #7a7068)', lineHeight: 1.6 }}>
                  {reclaimPct}% of your current operational load could be delegated with MindReply — that is{' '}
                  <strong style={{ color: 'var(--foreground, #f2ede6)' }}>{reclaimable * 4} hours monthly</strong>{' '}
                  redirected to decisions that compound.
                </p>
              </div>

              {BANDWIDTH_ITEMS.map(item => (
                <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 12, color: 'var(--muted-foreground, #7a7068)' }}>{item.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 60, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${(sliders[item.key] / item.max) * 100}%`, height: '100%', background: 'var(--primary, #c9a96e)', borderRadius: 2, transition: 'width 0.4s ease' }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--primary, #c9a96e)', width: 24, textAlign: 'right' as const }}>
                      {Math.round(sliders[item.key] * 0.72)}h
                    </span>
                  </div>
                </div>
              ))}

              <a
                href="#pricing"
                style={{
                  display: 'block', textAlign: 'center' as const,
                  marginTop: 'auto', paddingTop: 24,
                  padding: '14px 24px', borderRadius: 14,
                  background: 'var(--primary, #c9a96e)',
                  color: 'var(--primary-foreground, #09090b)',
                  fontSize: 11, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                  textDecoration: 'none', transition: 'opacity 0.2s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                Reclaim this bandwidth
              </a>
            </div>
          </div>
        )}

        {activeTab === 'clarity' && (
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            <div style={{
              background: 'var(--card, #111115)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 24, padding: 40,
            }}
              className="card-glow"
            >
              {!claritySubmitted ? (
                <>
                  <h3 style={{ fontFamily: 'var(--font-display, Fraunces, serif)', fontSize: 20, fontWeight: 400, color: 'var(--foreground, #f2ede6)', marginBottom: 8 }}>
                    Signal Clarity Check
                  </h3>
                  <p style={{ fontSize: 12, color: 'var(--muted-foreground, #7a7068)', marginBottom: 36 }}>
                    Five questions. Honest answers. No email required.
                  </p>

                  {CLARITY_QUESTIONS.map((q, qi) => (
                    <div key={qi} style={{ marginBottom: 32 }}>
                      <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--foreground, #f2ede6)', marginBottom: 14, lineHeight: 1.55 }}>
                        <span style={{ color: 'var(--primary, #c9a96e)', fontSize: 11, fontWeight: 700, marginRight: 6 }}>0{qi + 1}</span>
                        {q.q}
                      </p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        {q.options.map((opt, oi) => (
                          <button
                            key={oi}
                            onClick={() => {
                              const next = [...clarityAnswers];
                              next[qi] = q.scores[oi];
                              setClarityAnswers(next);
                            }}
                            style={{
                              padding: '10px 14px', borderRadius: 12, textAlign: 'left' as const,
                              border: `1px solid ${clarityAnswers[qi] === q.scores[oi] ? 'rgba(201,169,110,0.5)' : 'rgba(255,255,255,0.06)'}`,
                              background: clarityAnswers[qi] === q.scores[oi] ? 'rgba(201,169,110,0.08)' : 'transparent',
                              cursor: 'pointer', fontSize: 12,
                              color: clarityAnswers[qi] === q.scores[oi] ? 'var(--foreground, #f2ede6)' : 'var(--muted-foreground, #7a7068)',
                              transition: 'all 0.2s ease', lineHeight: 1.4,
                            }}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => clarityComplete && setClaritySubmitted(true)}
                    disabled={!clarityComplete}
                    style={{
                      width: '100%', padding: '14px', borderRadius: 14,
                      background: clarityComplete ? 'var(--primary, #c9a96e)' : 'rgba(255,255,255,0.06)',
                      color: clarityComplete ? 'var(--primary-foreground, #09090b)' : 'var(--muted-foreground, #7a7068)',
                      fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
                      border: 'none', cursor: clarityComplete ? 'pointer' : 'not-allowed',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    {clarityComplete ? 'Reveal my signal score' : `${clarityAnswers.filter(a => a >= 0).length} / ${CLARITY_QUESTIONS.length} answered`}
                  </button>
                </>
              ) : (
                <div style={{ textAlign: 'center' as const }}>
                  <div style={{
                    width: 100, height: 100, borderRadius: '50%', margin: '0 auto 28px',
                    background: `radial-gradient(circle, ${clarityResult.colour}22, transparent)`,
                    border: `2px solid ${clarityResult.colour}44`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontFamily: 'var(--font-display, Fraunces, serif)', fontSize: 32, fontWeight: 300, color: clarityResult.colour }}>
                      {clarityScore}
                    </span>
                  </div>

                  <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: clarityResult.colour, marginBottom: 12 }}>
                    {clarityResult.label}
                  </p>

                  <h3 style={{ fontFamily: 'var(--font-display, Fraunces, serif)', fontSize: 22, fontWeight: 400, color: 'var(--foreground, #f2ede6)', marginBottom: 20 }}>
                    Your clarity score: {clarityScore}/15
                  </h3>

                  <p style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--muted-foreground, #7a7068)', maxWidth: 400, margin: '0 auto 36px' }}>
                    {clarityResult.desc}
                  </p>

                  <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' as const }}>
                    <a
                      href="#pricing"
                      style={{
                        padding: '12px 28px', borderRadius: 99,
                        background: 'var(--primary, #c9a96e)',
                        color: 'var(--primary-foreground, #09090b)',
                        fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
                        textDecoration: 'none',
                      }}
                    >
                      See how MindReply helps
                    </a>
                    <button
                      onClick={() => { setClarityAnswers(Array(CLARITY_QUESTIONS.length).fill(-1)); setClaritySubmitted(false); }}
                      style={{
                        padding: '12px 28px', borderRadius: 99,
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'transparent', color: 'var(--muted-foreground, #7a7068)',
                        fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em',
                        cursor: 'pointer',
                      }}
                    >
                      Retake
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <p style={{ textAlign: 'center' as const, fontSize: 11, color: 'var(--muted-foreground, #7a7068)', marginTop: 32 }}>
          No data stored · No account required · Calculations are illustrative benchmarks
        </p>
      </div>
    </section>
  );
}
