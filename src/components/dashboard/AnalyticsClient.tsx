'use client';
import React from 'react';
import type { User } from '@/lib/db/schema';

export default function AnalyticsClient({ user, stats }: {
  user: User;
  stats: { totalTasks: number; doneTasks: number; totalMessages: number; recentMessages: number; opsUsed: number; opsLimit: number };
}) {
  const completionRate = stats.totalTasks > 0 ? Math.round((stats.doneTasks / stats.totalTasks) * 100) : 0;
  const opsPct = Math.min(100, Math.round((stats.opsUsed / stats.opsLimit) * 100));

  const metrics = [
    { label: 'Task Completion Rate', value: `${completionRate}%`, sub: `${stats.doneTasks} of ${stats.totalTasks} tasks done`, bar: completionRate, color: '#4ade80' },
    { label: 'Operations Used', value: `${stats.opsUsed}`, sub: `of ${stats.opsLimit === 999999 ? 'unlimited' : stats.opsLimit} this month`, bar: opsPct, color: opsPct > 80 ? '#ef4444' : '#c9a96e' },
    { label: 'AI Conversations', value: `${stats.totalMessages}`, sub: `${stats.recentMessages} in last 30 days`, bar: Math.min(100, stats.recentMessages * 5), color: '#818cf8' },
    { label: 'Active Since', value: new Date(user.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }), sub: 'member since', bar: 100, color: '#c9a96e' },
  ];

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 300, color: '#f2ede6', marginBottom: 4 }}>
          Analytics
        </h1>
        <p style={{ fontSize: 13, color: '#7a7068' }}>Your operational performance at a glance.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 32 }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ background: '#111115', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '24px' }}>
            <p style={{ fontSize: 10, color: '#7a7068', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>{m.label}</p>
            <p style={{ fontFamily: 'Fraunces, serif', fontSize: 36, fontWeight: 300, color: '#f2ede6', lineHeight: 1, marginBottom: 4 }}>{m.value}</p>
            <p style={{ fontSize: 11, color: '#7a7068', marginBottom: 16 }}>{m.sub}</p>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${m.bar}%`, background: m.color, borderRadius: 2, transition: 'width 1s ease' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Insights */}
      <div style={{ background: '#111115', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '24px' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#f2ede6', marginBottom: 16 }}>Operational Insights</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            completionRate < 50 && stats.totalTasks > 3 ? '◈ Your task completion rate is below 50%. Consider breaking large tasks into smaller operations.' : null,
            opsPct > 80 ? '◎ You\'re approaching your monthly operation limit. Consider upgrading or adding extra operations.' : null,
            stats.recentMessages === 0 ? '◷ You haven\'t used MR Advisor this month. Regular sessions compound your operational clarity.' : null,
            user.plan === 'signal' ? '◐ Signal plan limits you to 30 operations. Growth unlocks 500 — enough for serious momentum.' : null,
            completionRate >= 80 ? '◎ Strong task completion rate. Your operational discipline is compounding.' : null,
          ].filter(Boolean).map((insight, i) => (
            <p key={i} style={{ fontSize: 13, color: '#7a7068', lineHeight: 1.6, padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: 10 }}>
              {insight}
            </p>
          ))}
          {[completionRate < 50, opsPct > 80, stats.recentMessages === 0, user.plan === 'signal'].every(v => !v) && completionRate < 80 && (
            <p style={{ fontSize: 13, color: '#7a7068' }}>Keep building — your operational patterns are taking shape.</p>
          )}
        </div>
      </div>
    </div>
  );
}
