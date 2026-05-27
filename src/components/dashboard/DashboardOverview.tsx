'use client';
import React from 'react';
import Link from 'next/link';
import type { User } from '@/lib/db/schema';

const PLAN_LABELS: Record<string, string> = { signal: 'Signal', growth: 'Growth', pro: 'Pro' };
const PLAN_COLORS: Record<string, string> = { signal: '#7a7068', growth: '#c9a96e', pro: '#f2ede6' };

export default function DashboardOverview({
  user,
  stats,
}: {
  user: User;
  stats: { tasks: number; messages: number; opsUsed: number; opsLimit: number };
}) {
  const opsPct = Math.min(100, Math.round((stats.opsUsed / stats.opsLimit) * 100));
  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={{ padding: '40px 40px', maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <p style={{ fontSize: 11, color: '#7a7068', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>
          {greeting}
        </p>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 32, fontWeight: 300, color: '#f2ede6', marginBottom: 8 }}>
          {user.name ? `${user.name.split(' ')[0]}'s Hub` : 'Your Hub'}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            padding: '3px 10px', borderRadius: 99, fontSize: 10, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.1em',
            background: 'rgba(201,169,110,0.1)',
            color: PLAN_COLORS[user.plan],
            border: `1px solid ${PLAN_COLORS[user.plan]}33`,
          }}>
            {PLAN_LABELS[user.plan]} Plan
          </span>
          {user.plan !== 'pro' && (
            <Link href="/dashboard/settings#upgrade" style={{
              fontSize: 11, color: '#c9a96e', textDecoration: 'none',
            }}>
              Upgrade →
            </Link>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Operations Used', value: stats.opsUsed, sub: `of ${stats.opsLimit === 999999 ? '∞' : stats.opsLimit}`, accent: opsPct > 80 },
          { label: 'Tasks Active', value: stats.tasks, sub: 'total created' },
          { label: 'AI Conversations', value: stats.messages, sub: 'messages exchanged' },
          { label: 'Plan Tier', value: PLAN_LABELS[user.plan], sub: 'current membership' },
        ].map((s, i) => (
          <div key={i} style={{
            background: '#111115', border: `1px solid ${s.accent ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.06)'}`,
            borderRadius: 16, padding: '20px 24px',
          }}>
            <p style={{ fontSize: 10, color: '#7a7068', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
              {s.label}
            </p>
            <p style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 300, color: s.accent ? '#ef4444' : '#f2ede6', lineHeight: 1, marginBottom: 4 }}>
              {s.value}
            </p>
            <p style={{ fontSize: 11, color: '#7a7068' }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Operations bar */}
      <div style={{
        background: '#111115', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 16, padding: '20px 24px', marginBottom: 32,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 12, color: '#f2ede6', fontWeight: 600 }}>Monthly Operations</span>
          <span style={{ fontSize: 12, color: opsPct > 80 ? '#ef4444' : '#c9a96e' }}>{opsPct}% used</span>
        </div>
        <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${opsPct}%`,
            background: opsPct > 80 ? '#ef4444' : opsPct > 60 ? '#f97316' : '#c9a96e',
            borderRadius: 3, transition: 'width 0.8s ease',
          }} />
        </div>
        {opsPct > 80 && (
          <p style={{ fontSize: 11, color: '#ef4444', marginTop: 8 }}>
            Running low — <Link href="/dashboard/settings#addons" style={{ color: '#c9a96e' }}>add more operations</Link> or upgrade your plan.
          </p>
        )}
      </div>

      {/* Quick actions */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 10, color: '#7a7068', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16 }}>
          Quick Actions
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { href: '/dashboard/chat', icon: '◷', label: 'Ask MR Advisor', desc: 'Get operational clarity now' },
            { href: '/dashboard/tasks', icon: '◈', label: 'Create a Task', desc: 'Add to your operation queue' },
            { href: '/dashboard/inbox', icon: '◫', label: 'View Inbox', desc: 'Review your message threads' },
          ].map(a => (
            <Link key={a.href} href={a.href} style={{
              background: '#111115', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 14, padding: '18px 20px', textDecoration: 'none',
              display: 'flex', gap: 14, alignItems: 'flex-start',
              transition: 'border-color 0.2s ease',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(201,169,110,0.3)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
            >
              <span style={{ fontSize: 20, color: '#c9a96e', flexShrink: 0 }}>{a.icon}</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#f2ede6', marginBottom: 3 }}>{a.label}</p>
                <p style={{ fontSize: 11, color: '#7a7068' }}>{a.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Upgrade CTA for non-pro */}
      {user.plan !== 'pro' && (
        <div style={{
          background: 'rgba(201,169,110,0.06)', border: '1px solid rgba(201,169,110,0.2)',
          borderRadius: 16, padding: '24px 28px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20,
        }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#f2ede6', marginBottom: 4 }}>
              Unlock your full operational potential
            </p>
            <p style={{ fontSize: 12, color: '#7a7068' }}>
              {user.plan === 'signal'
                ? 'Growth gives you 500 operations, full inbox management, and content drafting.'
                : 'Pro unlocks unlimited operations, Momentum Clarity, and persistent memory.'}
            </p>
          </div>
          <Link href="/dashboard/settings#upgrade" style={{
            padding: '10px 24px', borderRadius: 99, flexShrink: 0,
            background: '#c9a96e', color: '#09090b',
            fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
            textDecoration: 'none',
          }}>
            Upgrade Now
          </Link>
        </div>
      )}
    </div>
  );
}
