'use client';
export const dynamic = 'force-dynamic';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

type MRMessage = { id: string; role: 'user' | 'assistant'; content: string; createdAt: string; sessionId?: string };
type GmailEmail = { id: string; subject: string; from: string; date: string; snippet: string; isUnread: boolean };

export default function InboxPage() {
  const [tab, setTab] = useState<'gmail' | 'advisor'>('gmail');
  const [messages, setMessages] = useState<MRMessage[]>([]);
  const [emails, setEmails] = useState<GmailEmail[]>([]);
  const [gmailConnected, setGmailConnected] = useState(false);
  const [gmailEmail, setGmailEmail] = useState<string | null>(null);
  const [loadingGmail, setLoadingGmail] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(true);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    // Check URL params for connection status
    const params = new URLSearchParams(window.location.search);
    if (params.get('gmail_connected') === 'true') setTab('gmail');

    fetchGmail();
    fetchMessages();
  }, []);

  async function fetchGmail() {
    setLoadingGmail(true);
    const res = await fetch('/api/gmail/sync');
    const data = await res.json();
    setGmailConnected(data.connected);
    setGmailEmail(data.gmailEmail || null);
    setEmails(data.emails || []);
    setLoadingGmail(false);
  }

  async function fetchMessages() {
    setLoadingMsgs(true);
    const res = await fetch('/api/messages');
    if (res.ok) setMessages(await res.json());
    setLoadingMsgs(false);
  }

  async function syncGmail() {
    setSyncing(true);
    await fetchGmail();
    setSyncing(false);
  }

  async function disconnectGmail() {
    await fetch('/api/gmail/disconnect', { method: 'POST' });
    setGmailConnected(false);
    setGmailEmail(null);
    setEmails([]);
  }

  const sessions = Array.from(new Set(messages.map(m => m.sessionId || 'default')));
  const filteredMsgs = selectedSession
    ? messages.filter(m => (m.sessionId || 'default') === selectedSession)
    : messages;

  return (
    <div style={{ padding: '40px', height: '100vh', overflow: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 300, color: '#f2ede6', marginBottom: 4 }}>Inbox</h1>
          <p style={{ fontSize: 13, color: '#7a7068' }}>
            {gmailConnected ? `Connected: ${gmailEmail}` : 'Connect Gmail to see your emails here'}
          </p>
        </div>
        {gmailConnected ? (
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={syncGmail} disabled={syncing} style={{
              padding: '8px 16px', borderRadius: 10, background: 'rgba(201,169,110,0.1)',
              border: '1px solid rgba(201,169,110,0.3)', color: '#c9a96e',
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
              cursor: 'pointer',
            }}>
              {syncing ? 'Syncing…' : '↻ Sync'}
            </button>
            <button onClick={disconnectGmail} style={{
              padding: '8px 16px', borderRadius: 10, background: 'transparent',
              border: '1px solid rgba(255,255,255,0.08)', color: '#7a7068',
              fontSize: 11, fontWeight: 600, cursor: 'pointer',
            }}>
              Disconnect
            </button>
          </div>
        ) : (
          <a href="/api/gmail" style={{
            padding: '10px 20px', borderRadius: 10, background: '#c9a96e',
            color: '#09090b', fontSize: 11, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.1em', textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>
            Connect Gmail
          </a>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {[
          { key: 'gmail', label: `Gmail${emails.length > 0 ? ` (${emails.length})` : ''}` },
          { key: 'advisor', label: `MR Advisor History${messages.length > 0 ? ` (${messages.length})` : ''}` },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)} style={{
            padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em',
            color: tab === t.key ? '#c9a96e' : '#7a7068',
            borderBottom: `2px solid ${tab === t.key ? '#c9a96e' : 'transparent'}`,
            marginBottom: -1,
          }}>{t.label}</button>
        ))}
      </div>

      {/* GMAIL TAB */}
      {tab === 'gmail' && (
        <div>
          {!gmailConnected ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>✉</div>
              <p style={{ fontFamily: 'Fraunces, serif', fontSize: 22, color: '#f2ede6', fontWeight: 300, marginBottom: 8 }}>
                Connect your Gmail
              </p>
              <p style={{ fontSize: 13, color: '#7a7068', maxWidth: 360, margin: '0 auto 28px', lineHeight: 1.7 }}>
                MindReply reads your inbox, surfaces what matters, and lets MR Advisor help you respond with composure.
              </p>
              <a href="/api/gmail" style={{
                padding: '12px 28px', borderRadius: 99, background: '#c9a96e',
                color: '#09090b', fontSize: 12, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.1em', textDecoration: 'none',
              }}>Connect Gmail →</a>
            </div>
          ) : loadingGmail ? (
            <p style={{ color: '#7a7068', fontSize: 13 }}>Syncing your inbox…</p>
          ) : emails.length === 0 ? (
            <p style={{ color: '#7a7068', fontSize: 13, textAlign: 'center', padding: '40px 0' }}>No emails found in inbox.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {emails.map(email => (
                <div key={email.id} style={{
                  background: '#111115',
                  border: `1px solid ${email.isUnread ? 'rgba(201,169,110,0.2)' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 14, padding: '16px 20px',
                  borderLeft: `3px solid ${email.isUnread ? '#c9a96e' : 'rgba(255,255,255,0.06)'}`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <p style={{ fontSize: 13, fontWeight: email.isUnread ? 700 : 500, color: '#f2ede6', flex: 1, marginRight: 16 }}>
                      {email.subject}
                    </p>
                    <span style={{ fontSize: 10, color: '#7a7068', flexShrink: 0 }}>
                      {new Date(email.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <p style={{ fontSize: 11, color: '#c9a96e', marginBottom: 6 }}>{email.from}</p>
                  <p style={{ fontSize: 12, color: '#7a7068', lineHeight: 1.5 }}>{email.snippet}</p>
                  {email.isUnread && (
                    <span style={{ display: 'inline-block', marginTop: 8, fontSize: 9, padding: '2px 8px', borderRadius: 99, background: 'rgba(201,169,110,0.1)', color: '#c9a96e', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Unread
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MR ADVISOR HISTORY TAB */}
      {tab === 'advisor' && (
        <div style={{ display: 'flex', gap: 20 }}>
          {/* Sessions */}
          <div style={{ width: 200, flexShrink: 0 }}>
            <p style={{ fontSize: 10, color: '#7a7068', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>Sessions</p>
            <button onClick={() => setSelectedSession(null)} style={{
              width: '100%', padding: '8px 12px', borderRadius: 8, textAlign: 'left',
              background: !selectedSession ? 'rgba(201,169,110,0.1)' : 'transparent',
              border: `1px solid ${!selectedSession ? 'rgba(201,169,110,0.3)' : 'transparent'}`,
              color: !selectedSession ? '#c9a96e' : '#7a7068', fontSize: 12, cursor: 'pointer', marginBottom: 4,
            }}>All messages</button>
            {sessions.map(s => (
              <button key={s} onClick={() => setSelectedSession(s)} style={{
                width: '100%', padding: '8px 12px', borderRadius: 8, textAlign: 'left',
                background: selectedSession === s ? 'rgba(201,169,110,0.1)' : 'transparent',
                border: `1px solid ${selectedSession === s ? 'rgba(201,169,110,0.3)' : 'transparent'}`,
                color: selectedSession === s ? '#c9a96e' : '#7a7068', fontSize: 11, cursor: 'pointer', marginBottom: 4,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {s.slice(0, 10)}…
              </button>
            ))}
          </div>

          {/* Messages */}
          <div style={{ flex: 1 }}>
            {loadingMsgs ? (
              <p style={{ color: '#7a7068', fontSize: 13 }}>Loading…</p>
            ) : filteredMsgs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <p style={{ fontFamily: 'Fraunces, serif', fontSize: 20, color: '#f2ede6', fontWeight: 300, marginBottom: 8 }}>No messages yet</p>
                <Link href="/dashboard/chat" style={{ fontSize: 13, color: '#c9a96e', textDecoration: 'none' }}>Start a conversation →</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {filteredMsgs.map(msg => (
                  <div key={msg.id} style={{
                    background: '#111115', border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 12, padding: '14px 18px',
                    borderLeft: `3px solid ${msg.role === 'assistant' ? '#c9a96e' : 'rgba(255,255,255,0.1)'}`,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: msg.role === 'assistant' ? '#c9a96e' : '#7a7068' }}>
                        {msg.role === 'assistant' ? 'MR Advisor' : 'You'}
                      </span>
                      <span style={{ fontSize: 10, color: '#7a7068' }}>{new Date(msg.createdAt).toLocaleString()}</span>
                    </div>
                    <p style={{ fontSize: 13, color: '#f2ede6', lineHeight: 1.65 }}>{msg.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
