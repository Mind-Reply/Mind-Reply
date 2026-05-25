'use client';
import React, { useState } from 'react';
import type { Log, User, Knowledge } from '@/lib/db/schema';

const LOG_COLORS: Record<string, string> = {
  chat: '#818cf8',
  task_created: '#4ade80',
  plan_upgraded: '#c9a96e',
  addon_purchased: '#f97316',
  contact_form: '#7a7068',
};

export default function AdminClient({
  logs, users, knowledgeEntries, stats,
}: {
  logs: Log[];
  users: User[];
  knowledgeEntries: Knowledge[];
  stats: { totalUsers: number; planCounts: Record<string, number> };
}) {
  const [tab, setTab] = useState<'logs' | 'users' | 'knowledge'>('logs');
  const [logFilter, setLogFilter] = useState('all');
  const [kbForm, setKbForm] = useState({ title: '', content: '', tags: '' });
  const [kbSaving, setKbSaving] = useState(false);
  const [kbList, setKbList] = useState(knowledgeEntries);

  const logTypes = ['all', ...Array.from(new Set(logs.map(l => l.type)))];
  const filteredLogs = logFilter === 'all' ? logs : logs.filter(l => l.type === logFilter);

  async function saveKnowledge(e: React.FormEvent) {
    e.preventDefault();
    setKbSaving(true);
    const res = await fetch('/api/knowledge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(kbForm),
    });
    if (res.ok) {
      const entry = await res.json();
      setKbList(prev => [entry, ...prev]);
      setKbForm({ title: '', content: '', tags: '' });
    }
    setKbSaving(false);
  }

  async function deleteKnowledge(id: string) {
    await fetch(`/api/knowledge/${id}`, { method: 'DELETE' });
    setKbList(prev => prev.filter(k => k.id !== id));
  }

  return (
    <div style={{ minHeight: '100vh', background: '#09090b', padding: '40px' }}>
      {/* Header */}
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #c9a96e, #7c6b52)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Fraunces, serif', fontSize: 12, fontStyle: 'italic', color: '#09090b' }}>M</div>
              <span style={{ fontSize: 10, color: '#7a7068', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 700 }}>Admin Panel</span>
            </div>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 300, color: '#f2ede6' }}>
              Operational Control
            </h1>
          </div>
          <a href="/dashboard" style={{ fontSize: 12, color: '#7a7068', textDecoration: 'none' }}>← Dashboard</a>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}>
          {[
            { label: 'Total Users', value: stats.totalUsers },
            { label: 'Signal', value: stats.planCounts.signal || 0 },
            { label: 'Growth', value: stats.planCounts.growth || 0 },
            { label: 'Pro', value: stats.planCounts.pro || 0 },
          ].map((s, i) => (
            <div key={i} style={{ background: '#111115', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '16px 20px' }}>
              <p style={{ fontSize: 10, color: '#7a7068', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>{s.label}</p>
              <p style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 300, color: '#c9a96e', lineHeight: 1 }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 0 }}>
          {(['logs', 'users', 'knowledge'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em',
              color: tab === t ? '#c9a96e' : '#7a7068',
              borderBottom: `2px solid ${tab === t ? '#c9a96e' : 'transparent'}`,
              marginBottom: -1,
            }}>{t}</button>
          ))}
        </div>

        {/* LOGS TAB */}
        {tab === 'logs' && (
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
              {logTypes.map(t => (
                <button key={t} onClick={() => setLogFilter(t)} style={{
                  padding: '5px 14px', borderRadius: 99, fontSize: 10, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer',
                  border: `1px solid ${logFilter === t ? (LOG_COLORS[t] || '#c9a96e') + '66' : 'rgba(255,255,255,0.08)'}`,
                  background: logFilter === t ? (LOG_COLORS[t] || '#c9a96e') + '15' : 'transparent',
                  color: logFilter === t ? (LOG_COLORS[t] || '#c9a96e') : '#7a7068',
                }}>{t}</button>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filteredLogs.map(log => (
                <div key={log.id} style={{
                  background: '#111115', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 12, padding: '14px 18px',
                  borderLeft: `3px solid ${LOG_COLORS[log.type] || '#7a7068'}`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: LOG_COLORS[log.type] || '#7a7068' }}>
                      {log.type}
                    </span>
                    <span style={{ fontSize: 10, color: '#7a7068' }}>
                      {new Date(log.createdAt).toLocaleString()}
                      {log.userId && <span style={{ marginLeft: 8, color: '#4a4a52' }}>· {log.userId.slice(0, 12)}…</span>}
                    </span>
                  </div>
                  <pre style={{
                    fontSize: 11, color: 'rgba(242,237,230,0.5)', background: 'rgba(255,255,255,0.02)',
                    borderRadius: 8, padding: '8px 12px', margin: 0, overflow: 'auto',
                    fontFamily: 'monospace', lineHeight: 1.5,
                  }}>
                    {JSON.stringify(log.meta, null, 2)}
                  </pre>
                </div>
              ))}
              {filteredLogs.length === 0 && (
                <p style={{ color: '#7a7068', fontSize: 13, textAlign: 'center', padding: '40px 0' }}>No logs yet.</p>
              )}
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {tab === 'users' && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {users.map(user => (
                <div key={user.id} style={{
                  background: '#111115', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 12, padding: '14px 20px',
                  display: 'flex', alignItems: 'center', gap: 16,
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#f2ede6', marginBottom: 2 }}>{user.email}</p>
                    <p style={{ fontSize: 11, color: '#7a7068' }}>{user.name || 'No name'} · Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: 99, fontSize: 9, fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.1em',
                      background: user.plan === 'pro' ? 'rgba(242,237,230,0.1)' : user.plan === 'growth' ? 'rgba(201,169,110,0.1)' : 'rgba(122,112,104,0.1)',
                      color: user.plan === 'pro' ? '#f2ede6' : user.plan === 'growth' ? '#c9a96e' : '#7a7068',
                    }}>{user.plan}</span>
                    <span style={{ fontSize: 11, color: '#7a7068' }}>{user.operationsUsed}/{user.operationsLimit === 999999 ? '∞' : user.operationsLimit} ops</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* KNOWLEDGE BASE TAB */}
        {tab === 'knowledge' && (
          <div>
            {/* Add entry form */}
            <form onSubmit={saveKnowledge} style={{
              background: '#111115', border: '1px solid rgba(201,169,110,0.2)',
              borderRadius: 16, padding: 24, marginBottom: 24,
            }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#f2ede6', marginBottom: 16 }}>
                Add Knowledge Entry
              </p>
              <p style={{ fontSize: 12, color: '#7a7068', marginBottom: 16, lineHeight: 1.6 }}>
                These entries are injected into MR Advisor's context — use them to teach the AI about MindReply's services, pricing, policies, and tone.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
                <input
                  required value={kbForm.title}
                  onChange={e => setKbForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Title (e.g. 'Pro Plan Features')"
                  style={{ padding: '10px 14px', borderRadius: 10, background: '#1a1a1f', border: '1px solid rgba(255,255,255,0.08)', color: '#f2ede6', fontSize: 13, outline: 'none' }}
                />
                <textarea
                  required value={kbForm.content}
                  onChange={e => setKbForm(f => ({ ...f, content: e.target.value }))}
                  placeholder="Content — what should MR Advisor know about this?"
                  rows={4}
                  style={{ padding: '10px 14px', borderRadius: 10, background: '#1a1a1f', border: '1px solid rgba(255,255,255,0.08)', color: '#f2ede6', fontSize: 13, outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                />
                <input
                  value={kbForm.tags}
                  onChange={e => setKbForm(f => ({ ...f, tags: e.target.value }))}
                  placeholder="Tags (comma separated, e.g. pricing, pro, features)"
                  style={{ padding: '10px 14px', borderRadius: 10, background: '#1a1a1f', border: '1px solid rgba(255,255,255,0.08)', color: '#f2ede6', fontSize: 13, outline: 'none' }}
                />
              </div>
              <button type="submit" disabled={kbSaving} style={{
                padding: '9px 20px', borderRadius: 10, background: '#c9a96e',
                color: '#09090b', fontSize: 11, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.08em',
                border: 'none', cursor: 'pointer',
              }}>
                {kbSaving ? 'Saving…' : 'Add to Knowledge Base'}
              </button>
            </form>

            {/* Entries list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {kbList.map(entry => (
                <div key={entry.id} style={{
                  background: '#111115', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 12, padding: '16px 20px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#f2ede6' }}>{entry.title}</p>
                    <button onClick={() => deleteKnowledge(entry.id)} style={{
                      background: 'none', border: 'none', color: '#7a7068', cursor: 'pointer', fontSize: 16, padding: 0, flexShrink: 0,
                    }}>×</button>
                  </div>
                  <p style={{ fontSize: 12, color: '#7a7068', lineHeight: 1.6, marginBottom: 8 }}>{entry.content}</p>
                  {entry.tags && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {entry.tags.split(',').map(tag => (
                        <span key={tag} style={{ fontSize: 9, padding: '2px 8px', borderRadius: 99, background: 'rgba(201,169,110,0.08)', color: '#c9a96e', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {kbList.length === 0 && (
                <p style={{ color: '#7a7068', fontSize: 13, textAlign: 'center', padding: '40px 0' }}>
                  No knowledge entries yet. Add context to make MR Advisor smarter.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
