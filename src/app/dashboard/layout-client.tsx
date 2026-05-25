'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';

const NAV = [
  { href: '/dashboard', label: 'Overview', icon: '◎' },
  { href: '/dashboard/inbox', label: 'Inbox', icon: '◫' },
  { href: '/dashboard/tasks', label: 'Tasks', icon: '◈' },
  { href: '/dashboard/chat', label: 'MR Advisor', icon: '◷' },
  { href: '/dashboard/analytics', label: 'Analytics', icon: '◐' },
  { href: '/dashboard/settings', label: 'Settings', icon: '◉' },
];

export default function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#09090b' }}>
      <aside style={{
        width: collapsed ? 64 : 220,
        background: '#0d0d10',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.3s ease',
        flexShrink: 0, position: 'sticky', top: 0, height: '100vh',
      }}>
        <div style={{
          padding: collapsed ? '20px 0' : '20px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
        }}>
          {!collapsed && (
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'linear-gradient(135deg, #c9a96e, #7c6b52)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Fraunces, serif', fontSize: 12, fontStyle: 'italic', color: '#09090b',
              }}>M</div>
              <span style={{ fontFamily: 'Fraunces, serif', fontSize: 15, color: '#f2ede6', fontWeight: 400 }}>MindReply</span>
            </Link>
          )}
          {collapsed && (
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'linear-gradient(135deg, #c9a96e, #7c6b52)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Fraunces, serif', fontSize: 12, fontStyle: 'italic', color: '#09090b',
            }}>M</div>
          )}
          {!collapsed && (
            <button onClick={() => setCollapsed(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7a7068', fontSize: 16, padding: 4 }}>‹</button>
          )}
        </div>

        {collapsed && (
          <button onClick={() => setCollapsed(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7a7068', fontSize: 16, padding: '8px 0', textAlign: 'center' }}>›</button>
        )}

        <nav style={{ flex: 1, padding: '12px 0' }}>
          {NAV.map(item => {
            const active = path === item.href || (item.href !== '/dashboard' && path.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} title={collapsed ? item.label : undefined} style={{
                display: 'flex', alignItems: 'center',
                gap: 12, padding: collapsed ? '12px 0' : '10px 20px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                textDecoration: 'none',
                background: active ? 'rgba(201,169,110,0.08)' : 'transparent',
                borderLeft: active ? '2px solid #c9a96e' : '2px solid transparent',
                transition: 'all 0.2s ease',
                color: active ? '#c9a96e' : '#7a7068',
                fontSize: 13, fontWeight: active ? 600 : 400,
              }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{
          padding: collapsed ? '16px 0' : '16px 20px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: 10,
        }}>
          <UserButton appearance={{ variables: { colorPrimary: '#c9a96e' } }} />
          {!collapsed && (
            <Link href="/" style={{ fontSize: 11, color: '#7a7068', textDecoration: 'none' }}>← Back to site</Link>
          )}
        </div>
      </aside>

      <main style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>{children}</main>
    </div>
  );
}
