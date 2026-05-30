'use client';
export const dynamic = 'force-dynamic';
import React, { useState, useRef, useEffect } from 'react';

type Message = { role: 'user' | 'assistant'; content: string };

const SUGGESTED = [
  'Where is my business leaking the most bandwidth?',
  'What should I delegate first this week?',
  'How do I protect my deep work time?',
  'What growth signal should I act on right now?',
];

export default function DashboardChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Your operational clarity engine is active. What would you like to think through today?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

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
        body: JSON.stringify({ messages: next, sessionId, persist: true }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMessages(m => [...m, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'A brief delay — try again in a moment.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '0' }}>
      {/* Header */}
      <div style={{
        padding: '20px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Fraunces, serif', fontSize: 14, fontStyle: 'italic', color: '#c9a96e',
        }}>M</div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#f2ede6' }}>MR Advisor</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
            <span style={{ fontSize: 10, color: '#7a7068' }}>Operational clarity engine · Active</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflow: 'auto', padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '72%', padding: '12px 16px', borderRadius: 16,
              background: msg.role === 'user' ? 'rgba(201,169,110,0.12)' : '#111115',
              border: `1px solid ${msg.role === 'user' ? 'rgba(201,169,110,0.2)' : 'rgba(255,255,255,0.06)'}`,
              fontSize: 13, lineHeight: 1.65,
              color: msg.role === 'user' ? '#f2ede6' : 'rgba(242,237,230,0.85)',
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding: '12px 20px', borderRadius: 16,
              background: '#111115', border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', gap: 6, alignItems: 'center',
            }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  width: 5, height: 5, borderRadius: '50%', background: '#7a7068',
                  animation: 'pulse 1.2s ease-in-out infinite',
                  animationDelay: `${i * 0.2}s`,
                }} />
              ))}
            </div>
          </div>
        )}

        {messages.length === 1 && !loading && (
          <div style={{ marginTop: 8 }}>
            <p style={{ fontSize: 10, color: '#7a7068', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
              Suggested
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {SUGGESTED.map(s => (
                <button key={s} onClick={() => send(s)} style={{
                  padding: '10px 14px', borderRadius: 10, textAlign: 'left',
                  border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)',
                  fontSize: 12, color: '#7a7068', cursor: 'pointer', transition: 'all 0.2s ease',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,169,110,0.3)'; e.currentTarget.style.color = '#f2ede6'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#7a7068'; }}
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
        padding: '16px 32px', borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', gap: 10,
      }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="What would you like to think through?"
          rows={1}
          disabled={loading}
          style={{
            flex: 1, resize: 'none', background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12,
            padding: '10px 14px', fontSize: 13, color: '#f2ede6',
            outline: 'none', fontFamily: 'inherit', lineHeight: 1.5,
          }}
        />
        <button
          onClick={() => send()}
          disabled={!input.trim() || loading}
          style={{
            width: 42, height: 42, borderRadius: 12, flexShrink: 0,
            background: input.trim() && !loading ? '#c9a96e' : 'rgba(255,255,255,0.06)',
            border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: input.trim() && !loading ? '#09090b' : '#7a7068',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M14 8H2M8 2l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}"use client";

import { useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input.trim()) return;

    const newMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: [...messages, newMessage] })
    });

    const reader = res.body.getReader();
    let aiText = "";
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) {
        aiText += new TextDecoder().decode(value);
        setMessages((prev) => [
          ...prev.filter((m) => m.role !== "assistant-temp"),
          { role: "assistant-temp", content: aiText }
        ]);
      }
    }

    setMessages((prev) => [
      ...prev.filter((m) => m.role !== "assistant-temp"),
      { role: "assistant", content: aiText }
    ]);
  }

  return (
    <main style={{ padding: 40, maxWidth: 700, margin: "0 auto" }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>MindReply Chat</h1>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 12,
          padding: 20,
          height: 500,
          overflowY: "auto",
          marginBottom: 20
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              marginBottom: 12,
              padding: 12,
              borderRadius: 10,
              background: m.role === "user" ? "#e5f1ff" : "#f4f4f4"
            }}
          >
            <strong>{m.role === "user" ? "You" : "AI"}</strong>
            <div>{m.content}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <input
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 8,
            border: "1px solid #ccc"
          }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message…"
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "12px 20px",
            borderRadius: 8,
            background: "black",
            color: "white",
            border: "none"
          }}
        >
          Send
        </button>
      </div>
    </main>
  );
}

