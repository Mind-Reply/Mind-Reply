'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    role: 'assistant',
    content: "Welcome to MR Advisor. I help you find clarity on operational decisions, growth priorities, and workflow design. What would you like to think through today?",
  },
];

const SUGGESTED = [
  "Where is my business leaking the most bandwidth?",
  "How do I protect my deep work time?",
  "What should I delegate first?",
  "How do I grow without losing quality?",
];

export default function ChatSection() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [opened, setOpened] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text?: string) => {
    const content = text || input.trim();
    if (!content || loading) return;

    const userMsg: Message = { role: 'user', content };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });

      if (!res.ok) throw new Error('Request failed');
      const data = await res.json();
      setMessages(m => [...m, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages(m => [
        ...m,
        { role: 'assistant', content: 'A brief delay — try again in a moment.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <section
      id="advisor"
      style={{ padding: '96px 24px', maxWidth: 1280, margin: '0 auto' }}
      aria-labelledby="chat-heading"
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 48 }} className="lg-chat-grid">
        <style>{`@media(min-width:1024px){.lg-chat-grid{grid-template-columns:1fr 1fr!important}}`}</style>

        {/* Left — intro */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{
            fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.14em', color: 'var(--primary, #c9a96e)',
            display: 'block', marginBottom: 14,
          }}>
            MR Advisor · Live
          </span>

          <h2
            id="chat-heading"
            style={{
              fontFamily: 'var(--font-display, Fraunces, serif)',
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              fontWeight: 300, letterSpacing: '-0.02em',
              color: 'var(--foreground, #f2ede6)', marginBottom: 20,
            }}
          >
            A direct line<br />
            <em style={{ color: 'rgba(201,169,110,0.75)' }}>to operational clarity.</em>
          </h2>

          <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--muted-foreground, #7a7068)', maxWidth: 400, marginBottom: 36 }}>
            Not a support bot. Not a FAQ engine. MR Advisor engages with the actual texture of your situation — operational, strategic, practical.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              ['Operational', 'Workflow design, delegation, system architecture'],
              ['Strategic', 'Growth signals, priority setting, decision clarity'],
              ['Contextual', 'Trained on MindReply ecosystem intelligence'],
            ].map(([label, desc]) => (
              <div key={label} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <span style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: 'var(--primary, #c9a96e)',
                  flexShrink: 0, marginTop: 7,
                }} />
                <div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--foreground, #f2ede6)' }}>{label} · </span>
                  <span style={{ fontSize: 12, color: 'var(--muted-foreground, #7a7068)' }}>{desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — chat interface */}
        <div style={{
          background: 'var(--card, #111115)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 24, overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          height: 560,
        }}
          className="card-glow"
        >
          {/* Header */}
          <div style={{
            padding: '18px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(201,169,110,0.1)',
              border: '1px solid rgba(201,169,110,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{
                fontFamily: 'var(--font-display, Fraunces, serif)',
                fontSize: 14, fontWeight: 300, fontStyle: 'italic',
                color: 'var(--primary, #c9a96e)',
              }}>M</span>
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground, #f2ede6)', marginBottom: 2 }}>MR Advisor</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="live-dot" style={{ width: 6, height: 6 }} aria-hidden="true" />
                <span style={{ fontSize: 10, color: 'var(--muted-foreground, #7a7068)' }}>Operational clarity engine · Active</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }} className="no-scrollbar">
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'}
                  style={{
                    padding: '12px 16px',
                    maxWidth: '85%',
                    fontSize: 13, lineHeight: 1.65,
                    color: msg.role === 'user' ? 'var(--foreground, #f2ede6)' : 'rgba(242,237,230,0.85)',
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div className="chat-bubble-assistant" style={{ padding: '12px 20px', display: 'flex', gap: 6, alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{
                      width: 5, height: 5, borderRadius: '50%',
                      background: 'var(--muted-foreground, #7a7068)',
                      animation: 'pulse-soft 1.2s ease-in-out infinite',
                      animationDelay: `${i * 0.2}s`,
                    }} aria-hidden="true" />
                  ))}
                </div>
              </div>
            )}

            {messages.length === 1 && !loading && (
              <div>
                <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted-foreground, #7a7068)', marginBottom: 10, fontWeight: 600 }}>
                  Suggested
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {SUGGESTED.map(s => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      style={{
                        padding: '10px 14px', borderRadius: 12, textAlign: 'left' as const,
                        border: '1px solid rgba(255,255,255,0.07)',
                        background: 'rgba(255,255,255,0.02)',
                        fontSize: 12, color: 'var(--muted-foreground, #7a7068)',
                        cursor: 'pointer', transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,169,110,0.3)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--foreground, #f2ede6)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--muted-foreground, #7a7068)'; }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '16px 20px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', gap: 10,
          }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="What would you like to think through?"
              rows={1}
              disabled={loading}
              style={{
                flex: 1, resize: 'none', background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12, padding: '10px 14px',
                fontSize: 13, color: 'var(--foreground, #f2ede6)',
                outline: 'none', fontFamily: 'inherit',
                lineHeight: 1.5,
              }}
              aria-label="Message to MR Advisor"
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              style={{
                width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                background: input.trim() && !loading ? 'var(--primary, #c9a96e)' : 'rgba(255,255,255,0.06)',
                border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: input.trim() && !loading ? 'var(--primary-foreground, #09090b)' : 'var(--muted-foreground, #7a7068)',
                transition: 'all 0.2s ease',
              }}
              aria-label="Send message"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M14 8H2M8 2l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
