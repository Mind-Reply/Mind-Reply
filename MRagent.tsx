'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Tone = 'neutral' | 'warm' | 'assertive' | 'direct';
type Signal = { type: string; description: string; intensity: number };

interface MRagentMessage {
  role: 'user' | 'assistant';
  content: string;
  confidenceScore?: number;
  toneEffect?: string;
  signals?: Signal[];
}

interface MRagentProps {
  userId?: string | null;
  plan?: string;
  trialMessagesUsed?: number;
  sessionId?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TRIAL_LIMIT = 3;
const TONE_LABELS: Record<Tone, string> = {
  neutral: 'Neutral',
  warm: 'Warm',
  assertive: 'Assertive',
  direct: 'Direct',
};

const SIGNAL_COLORS: Record<string, string> = {
  avoidance: '#f59e0b',
  tension: '#ef4444',
  overload: '#8b5cf6',
  delay: '#6b7280',
  clarity: '#10b981',
  urgency: '#f97316',
};

// ─── MRagent Component ────────────────────────────────────────────────────────

export default function MRagent({
  userId,
  plan = 'free',
  trialMessagesUsed: initialTrialUsed = 0,
  sessionId: initialSessionId,
}: MRagentProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [tone, setTone] = useState<Tone>('neutral');
  const [messages, setMessages] = useState<MRagentMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [trialUsed, setTrialUsed] = useState(initialTrialUsed);
  const [sessionId, setSessionId] = useState(initialSessionId ?? null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Trial timer (60 seconds for free users)
  useEffect(() => {
    if (plan !== 'free' || !open) return;
    timerRef.current = setInterval(() => {
      setElapsedSeconds((s) => {
        if (s + 1 >= 60) {
          setShowPaywall(true);
          if (timerRef.current) clearInterval(timerRef.current);
        }
        return s + 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [open, plan]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const isTrialExhausted =
    plan === 'free' && (trialUsed >= TRIAL_LIMIT || showPaywall);

  const send = useCallback(async () => {
    if (!input.trim() || loading || isTrialExhausted) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, sessionId, tone }),
      });

      const data = await res.json();

      if (res.status === 402) {
        setShowPaywall(true);
        setLoading(false);
        return;
      }

      if (!res.ok) throw new Error(data.error ?? 'Error');

      if (data.sessionId && !sessionId) setSessionId(data.sessionId);
      if (plan === 'free') setTrialUsed((t) => t + 1);

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply,
          confidenceScore: data.confidenceScore,
          toneEffect: data.toneEffect,
          signals: data.signals,
        },
      ]);

      // Show paywall after trial messages exhausted
      if (plan === 'free' && trialUsed + 1 >= TRIAL_LIMIT) {
        setShowPaywall(true);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Something went wrong. Please retry.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, isTrialExhausted, sessionId, tone, plan, trialUsed]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {/* ── Floating Trigger ───────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open MRagent"
        style={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #c9a96e, #7c6b52)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 24px rgba(201,169,110,0.35)',
          zIndex: 9999,
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.06)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
        }}
      >
        <span style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontStyle: 'italic', color: '#09090b' }}>
          {open ? '×' : 'M'}
        </span>
      </button>

      {/* ── Panel ─────────────────────────────────────────────────────────── */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 92,
            right: 28,
            width: 380,
            maxHeight: 580,
            background: '#111115',
            border: '1px solid rgba(201,169,110,0.2)',
            borderRadius: 20,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 16px 64px rgba(0,0,0,0.6)',
            zIndex: 9998,
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #c9a96e, #7c6b52)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontStyle: 'italic', color: '#09090b',
                  fontFamily: 'Fraunces, serif',
                }}>M</div>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#f2ede6' }}>MRagent</span>
              </div>
              {plan === 'free' && !showPaywall && (
                <p style={{ fontSize: 10, color: '#7a7068', marginTop: 2 }}>
                  {TRIAL_LIMIT - trialUsed} messages remaining
                  {' · '}{Math.max(0, 60 - elapsedSeconds)}s
                </p>
              )}
            </div>

            {/* Tone Selector */}
            <div style={{ display: 'flex', gap: 4 }}>
              {(Object.keys(TONE_LABELS) as Tone[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  title={TONE_LABELS[t]}
                  style={{
                    padding: '3px 8px', borderRadius: 99,
                    fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.06em', cursor: 'pointer',
                    border: `1px solid ${tone === t ? 'rgba(201,169,110,0.5)' : 'rgba(255,255,255,0.08)'}`,
                    background: tone === t ? 'rgba(201,169,110,0.12)' : 'transparent',
                    color: tone === t ? '#c9a96e' : '#7a7068',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {t[0].toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '16px',
            display: 'flex', flexDirection: 'column', gap: 12,
            minHeight: 0,
          }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <p style={{
                  fontFamily: 'Fraunces, serif', fontSize: 15,
                  color: '#f2ede6', fontWeight: 300, marginBottom: 6,
                }}>
                  Paste a message.
                </p>
                <p style={{ fontSize: 12, color: '#7a7068', lineHeight: 1.6 }}>
                  MRagent refines it — sharper, cleaner, more precise.
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i}>
                <div style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}>
                  <div style={{
                    maxWidth: '85%',
                    padding: '10px 14px',
                    borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: msg.role === 'user' ? 'rgba(201,169,110,0.12)' : '#1a1a1f',
                    border: `1px solid ${msg.role === 'user' ? 'rgba(201,169,110,0.2)' : 'rgba(255,255,255,0.06)'}`,
                  }}>
                    <p style={{ fontSize: 13, color: '#f2ede6', lineHeight: 1.6, margin: 0 }}>
                      {msg.content}
                    </p>

                    {/* Confidence + Tone */}
                    {msg.role === 'assistant' && msg.confidenceScore !== undefined && (
                      <div style={{
                        marginTop: 8, paddingTop: 8,
                        borderTop: '1px solid rgba(255,255,255,0.06)',
                        display: 'flex', gap: 12, alignItems: 'center',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <div style={{
                            width: 32, height: 4, borderRadius: 99,
                            background: 'rgba(255,255,255,0.08)',
                            overflow: 'hidden',
                          }}>
                            <div style={{
                              height: '100%', borderRadius: 99,
                              width: `${msg.confidenceScore}%`,
                              background: msg.confidenceScore >= 70
                                ? '#10b981' : msg.confidenceScore >= 40
                                ? '#f59e0b' : '#ef4444',
                            }} />
                          </div>
                          <span style={{ fontSize: 10, color: '#7a7068' }}>
                            {msg.confidenceScore}
                          </span>
                        </div>
                        {msg.toneEffect && (
                          <span style={{
                            fontSize: 9, color: '#c9a96e', textTransform: 'uppercase',
                            letterSpacing: '0.08em', fontWeight: 700,
                          }}>
                            {msg.toneEffect}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Signals */}
                    {msg.signals && msg.signals.length > 0 && (
                      <div style={{ marginTop: 8, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {msg.signals.map((s, si) => (
                          <span
                            key={si}
                            title={s.description}
                            style={{
                              fontSize: 9, padding: '2px 7px', borderRadius: 99,
                              background: `${SIGNAL_COLORS[s.type] ?? '#7a7068'}15`,
                              border: `1px solid ${SIGNAL_COLORS[s.type] ?? '#7a7068'}40`,
                              color: SIGNAL_COLORS[s.type] ?? '#7a7068',
                              textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700,
                              cursor: 'help',
                            }}
                          >
                            {s.type}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', gap: 4, padding: '4px 0' }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: '#c9a96e',
                      animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Paywall */}
          {isTrialExhausted ? (
            <div style={{
              padding: '20px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              textAlign: 'center',
            }}>
              <p style={{
                fontFamily: 'Fraunces, serif', fontSize: 16,
                color: '#f2ede6', fontWeight: 300, marginBottom: 6,
              }}>
                Trial complete.
              </p>
              <p style={{ fontSize: 12, color: '#7a7068', marginBottom: 16, lineHeight: 1.6 }}>
                Activate a plan to continue with full access.
              </p>
              <a
                href="/pricing"
                style={{
                  display: 'block', padding: '10px 0',
                  background: 'linear-gradient(135deg, #c9a96e, #7c6b52)',
                  borderRadius: 10, color: '#09090b',
                  fontSize: 12, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  textDecoration: 'none',
                }}
              >
                View Plans
              </a>
            </div>
          ) : (
            /* Input */
            <div style={{
              padding: '12px 16px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', gap: 8, alignItems: 'flex-end',
            }}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Paste your message or ask MRagent…"
                rows={2}
                disabled={loading}
                style={{
                  flex: 1, padding: '10px 12px',
                  background: '#1a1a1f',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12, color: '#f2ede6',
                  fontSize: 13, resize: 'none', outline: 'none',
                  fontFamily: 'inherit', lineHeight: 1.5,
                  opacity: loading ? 0.6 : 1,
                }}
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                style={{
                  width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                  background: input.trim() && !loading ? '#c9a96e' : 'rgba(201,169,110,0.2)',
                  border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.15s ease',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M14 8L2 14l2.5-6L2 2l12 6z" fill={input.trim() && !loading ? '#09090b' : '#7a7068'} />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}
