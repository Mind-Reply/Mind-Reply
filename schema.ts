'use client';
export const dynamic = 'force-dynamic';
import React, { useState, useEffect } from 'react';

type Message = { id: string; role: 'user' | 'assistant'; content: string; createdAt: string; sessionId?: string };

export default function InboxPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/messages').then(r => r.json()).then(data => { setMessages(data); setLoading(false); });
  }, []);

  const sessions = Array.from(new Set(messages.map(m => m.sessionId || 'default')));
  const filtered = selectedSession
    ? messages.filter(m => (m.sessionId || 'default') === selectedSession)
    : messages;

  return (
    <div style={{ padding: '40px', display: 'flex', gap: 24, height: 'calc(100vh - 0px)', overflow: 'hidden' }}>
      {/* Sessions sidebar */}
      <div style={{
        width: 220, flexShrink: 0,
        background: '#111115', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 16, padding: 16, overflow: 'auto',
      }}>
        <p style={{ fontSize: 10, color: '#7a7068', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
          Conversations
        </p>
        <button
          onClick={() => setSelectedSession(null)}
          style={{
            width: '100%', padding: '8px 12px', borderRadius: 8, textAlign: 'left',
            background: !selectedSession ? 'rgba(201,169,110,0.1)' : 'transparent',
            border: `1px solid ${!selectedSession ? 'rgba(201,169,110,0.3)' : 'transparent'}`,
            color: !selectedSession ? '#c9a96e' : '#7a7068', fontSize: 12, cursor: 'pointer', marginBottom: 4,
          }}
        >
          All messages
        </button>
        {sessions.map(s => (
          <button key={s} onClick={() => setSelectedSession(s)} style={{
            width: '100%', padding: '8px 12px', borderRadius: 8, textAlign: 'left',
            background: selectedSession === s ? 'rgba(201,169,110,0.1)' : 'transparent',
            border: `1px solid ${selectedSession === s ? 'rgba(201,169,110,0.3)' : 'transparent'}`,
            color: selectedSession === s ? '#c9a96e' : '#7a7068', fontSize: 12, cursor: 'pointer', marginBottom: 4,
          }}>
            Session {s.slice(0, 8)}…
          </button>
        ))}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 300, color: '#f2ede6', marginBottom: 4 }}>
            Inbox
          </h1>
          <p style={{ fontSize: 13, color: '#7a7068' }}>{filtered.length} messages</p>
        </div>

        {loading ? (
          <p style={{ color: '#7a7068', fontSize: 13 }}>Loading messages...</p>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ fontFamily: 'Fraunces, serif', fontSize: 20, color: '#f2ede6', fontWeight: 300, marginBottom: 8 }}>
              No messages yet
            </p>
            <p style={{ fontSize: 13, color: '#7a7068' }}>Start a conversation with MR Advisor to see your history here.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map(msg => (
              <div key={msg.id} style={{
                background: '#111115', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 14, padding: '16px 20px',
                borderLeft: `3px solid ${msg.role === 'assistant' ? '#c9a96e' : 'rgba(255,255,255,0.1)'}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
                    color: msg.role === 'assistant' ? '#c9a96e' : '#7a7068',
                  }}>
                    {msg.role === 'assistant' ? 'MR Advisor' : 'You'}
                  </span>
                  <span style={{ fontSize: 10, color: '#7a7068' }}>
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: '#f2ede6', lineHeight: 1.65 }}>{msg.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
