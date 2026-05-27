'use client';
import React, { useState } from 'react';
import type { User, Addon } from '@/lib/db/schema';
import { ADDONS, formatPrice } from '@/lib/stripe';

const PLANS = [
  { id: 'signal', name: 'Signal', price: { gbp: 0, usd: 0, eur: 0 }, features: ['30 operations/month', '1 inbox', 'MR Advisor (limited)', 'Bandwidth Audit'] },
  { id: 'growth', name: 'Growth', price: { gbp: 4900, usd: 5900, eur: 5400 }, features: ['500 operations/month', 'Full inbox management', 'Unlimited content drafting', '30-day context memory'] },
  { id: 'pro', name: 'Pro', price: { gbp: 12900, usd: 15900, eur: 14900 }, features: ['Unlimited operations', 'Momentum Clarity', 'Persistent memory', 'Custom agent profiles', 'Priority support'] },
];

const CURRENCIES = ['GBP', 'USD', 'EUR', 'AUD', 'CAD', 'SGD', 'AED', 'JPY'];

export default function SettingsClient({
  user, activeAddons, gmailConnected, gmailEmail, clerkName,
}: {
  user: User; activeAddons: Addon[];
  gmailConnected: boolean; gmailEmail: string | null;
  clerkName: string | null;
}) {
  const [currency, setCurrency] = useState((user.currency || 'GBP').toUpperCase());
  const [tab, setTab] = useState<'plan' | 'addons' | 'connections' | 'billing' | 'profile'>('plan');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [loadingAddon, setLoadingAddon] = useState<string | null>(null);
  const [disconnecting, setDisconnecting] = useState(false);
  const [gmailState, setGmailState] = useState({ connected: gmailConnected, email: gmailEmail });
  const cur = currency.toLowerCase();

  async function upgradePlan(planId: string) {
    setLoadingPlan(planId);
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId, currency: cur, returnUrl: window.location.origin + '/dashboard' }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    setLoadingPlan(null);
  }

  async function purchaseAddon(addonKey: string) {
    setLoadingAddon(addonKey);
    const res = await fetch('/api/addons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ addonKey, currency: cur, returnUrl: window.location.origin + '/dashboard' }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    setLoadingAddon(null);
  }

  async function openBillingPortal() {
    const res = await fetch('/api/user/billing-portal', { method: 'POST' });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  async function disconnectGmail() {
    setDisconnecting(true);
    await fetch('/api/gmail/disconnect', { method: 'POST' });
    setGmailState({ connected: false, email: null });
    setDisconnecting(false);
  }

  const TABS = [
    { key: 'plan', label: 'Plan' },
    { key: 'addons', label: 'Add-ons' },
    { key: 'connections', label: 'Connections' },
    { key: 'billing', label: 'Billing' },
    { key: 'profile', label: 'Profile' },
  ] as const;

  return (
    <div style={{ padding: '40px', maxWidth: 960 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 300, color: '#f2ede6', marginBottom: 4 }}>Settings</h1>
        <p style={{ fontSize: 13, color: '#7a7068' }}>Manage your plan, connections, and preferences.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '10px 18px', background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em',
            color: tab === t.key ? '#c9a96e' : '#7a7068',
            borderBottom: `2px solid ${tab === t.key ? '#c9a96e' : 'transparent'}`,
            marginBottom: -1,
          }}>{t.label}</button>
        ))}
      </div>

      {/* Currency selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <span style={{ fontSize: 12, color: '#7a7068' }}>Currency:</span>
        <select value={currency} onChange={e => setCurrency(e.target.value)} style={{
          padding: '6px 12px', borderRadius: 8, background: '#111115',
          border: '1px solid rgba(255,255,255,0.08)', color: '#f2ede6', fontSize: 12, outline: 'none', cursor: 'pointer',
        }}>
          {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* PLAN */}
      {tab === 'plan' && (
        <div>
          <p style={{ fontSize: 12, color: '#7a7068', marginBottom: 20 }}>
            Current plan: <strong style={{ color: '#c9a96e', textTransform: 'capitalize' }}>{user.plan}</strong>
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {PLANS.map(plan => {
              const isCurrent = user.plan === plan.id;
              const price = plan.price[cur as keyof typeof plan.price] ?? plan.price.gbp;
              return (
                <div key={plan.id} style={{
                  background: isCurrent ? 'rgba(201,169,110,0.06)' : '#111115',
                  border: `1px solid ${isCurrent ? 'rgba(201,169,110,0.3)' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 16, padding: '22px',
                }}>
                  <p style={{ fontSize: 10, color: '#c9a96e', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>{plan.name}</p>
                  <p style={{ fontFamily: 'Fraunces, serif', fontSize: 26, fontWeight: 300, color: '#f2ede6', marginBottom: 14 }}>
                    {price === 0 ? 'Free' : formatPrice(price, cur)}
                    {price > 0 && <span style={{ fontSize: 11, color: '#7a7068' }}>/mo</span>}
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 18px', display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {plan.features.map(f => (
                      <li key={f} style={{ fontSize: 12, color: '#7a7068', display: 'flex', gap: 8 }}>
                        <span style={{ color: '#c9a96e' }}>·</span>{f}
                      </li>
                    ))}
                  </ul>
                  {isCurrent ? (
                    <div style={{ padding: '8px', borderRadius: 10, background: 'rgba(201,169,110,0.1)', textAlign: 'center', fontSize: 11, color: '#c9a96e', fontWeight: 700 }}>Current Plan</div>
                  ) : (
                    <button onClick={() => plan.id !== 'signal' && upgradePlan(plan.id)} disabled={loadingPlan === plan.id || plan.id === 'signal'} style={{
                      width: '100%', padding: '9px', borderRadius: 10,
                      background: plan.id === 'signal' ? 'transparent' : '#c9a96e',
                      color: plan.id === 'signal' ? '#7a7068' : '#09090b',
                      border: plan.id === 'signal' ? '1px solid rgba(255,255,255,0.08)' : 'none',
                      fontSize: 11, fontWeight: 700, cursor: plan.id === 'signal' ? 'default' : 'pointer',
                      textTransform: 'uppercase', letterSpacing: '0.08em',
                    }}>
                      {loadingPlan === plan.id ? 'Redirecting…' : plan.id === 'signal' ? 'Free Tier' : `Upgrade to ${plan.name}`}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ADD-ONS */}
      {tab === 'addons' && (
        <div>
          <p style={{ fontSize: 13, color: '#7a7068', marginBottom: 20 }}>Extend your capabilities. Active immediately after purchase.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {Object.entries(ADDONS).map(([key, addon]) => {
              const isActive = activeAddons.some(a => a.addonKey === key && a.active);
              const price = addon.prices[cur as keyof typeof addon.prices] ?? addon.prices.gbp;
              return (
                <div key={key} style={{
                  background: isActive ? 'rgba(74,222,128,0.04)' : '#111115',
                  border: `1px solid ${isActive ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 14, padding: '18px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#f2ede6' }}>{addon.name}</p>
                    {isActive && <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 99, background: 'rgba(74,222,128,0.1)', color: '#4ade80', fontWeight: 700, textTransform: 'uppercase' }}>Active</span>}
                  </div>
                  <p style={{ fontSize: 12, color: '#7a7068', marginBottom: 12, lineHeight: 1.5 }}>{addon.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'Fraunces, serif', fontSize: 18, color: '#c9a96e' }}>{formatPrice(price, cur)}</span>
                    <button onClick={() => !isActive && purchaseAddon(key)} disabled={isActive || loadingAddon === key} style={{
                      padding: '6px 14px', borderRadius: 8,
                      background: isActive ? 'transparent' : 'rgba(201,169,110,0.1)',
                      border: `1px solid ${isActive ? 'rgba(255,255,255,0.06)' : 'rgba(201,169,110,0.3)'}`,
                      color: isActive ? '#7a7068' : '#c9a96e',
                      fontSize: 11, fontWeight: 700, cursor: isActive ? 'default' : 'pointer',
                    }}>
                      {loadingAddon === key ? '…' : isActive ? 'Active' : 'Add'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CONNECTIONS */}
      {tab === 'connections' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 560 }}>
          {/* Gmail */}
          <div style={{
            background: '#111115', border: `1px solid ${gmailState.connected ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.06)'}`,
            borderRadius: 16, padding: '20px 24px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
          }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(234,67,53,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>✉</div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#f2ede6', marginBottom: 2 }}>Gmail</p>
                <p style={{ fontSize: 11, color: '#7a7068' }}>
                  {gmailState.connected ? `Connected: ${gmailState.email}` : 'Read inbox, surface signal, compose replies'}
                </p>
              </div>
            </div>
            {gmailState.connected ? (
              <button onClick={disconnectGmail} disabled={disconnecting} style={{
                padding: '7px 16px', borderRadius: 8, background: 'transparent',
                border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444',
                fontSize: 11, fontWeight: 600, cursor: 'pointer',
              }}>
                {disconnecting ? '…' : 'Disconnect'}
              </button>
            ) : (
              <a href="/api/gmail" style={{
                padding: '8px 18px', borderRadius: 8, background: 'rgba(201,169,110,0.1)',
                border: '1px solid rgba(201,169,110,0.3)', color: '#c9a96e',
                fontSize: 11, fontWeight: 700, textDecoration: 'none',
                textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>Connect</a>
            )}
          </div>

          {/* Slack — coming soon */}
          {['Slack', 'Notion'].map(name => (
            <div key={name} style={{
              background: '#111115', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 16, padding: '20px 24px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
              opacity: 0.6,
            }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                  {name === 'Slack' ? '💬' : '📝'}
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#f2ede6', marginBottom: 2 }}>{name}</p>
                  <p style={{ fontSize: 11, color: '#7a7068' }}>Available via add-on</p>
                </div>
              </div>
              <span style={{ fontSize: 10, padding: '3px 10px', borderRadius: 99, background: 'rgba(255,255,255,0.04)', color: '#7a7068', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Add-on
              </span>
            </div>
          ))}
        </div>
      )}

      {/* BILLING */}
      {tab === 'billing' && (
        <div style={{ maxWidth: 480 }}>
          <p style={{ fontSize: 13, color: '#7a7068', marginBottom: 20 }}>
            Manage your subscription, invoices, and payment methods through the Stripe billing portal.
          </p>
          {user.stripeCustomerId ? (
            <button onClick={openBillingPortal} style={{
              padding: '12px 28px', borderRadius: 12, background: '#c9a96e',
              color: '#09090b', fontSize: 12, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.1em', border: 'none', cursor: 'pointer',
            }}>
              Open Billing Portal →
            </button>
          ) : (
            <p style={{ fontSize: 13, color: '#7a7068' }}>No billing account yet. Upgrade to a paid plan to manage billing.</p>
          )}
        </div>
      )}

      {/* PROFILE */}
      {tab === 'profile' && (
        <div style={{ maxWidth: 480 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {[
              { label: 'Name', value: clerkName || user.name || '—' },
              { label: 'Email', value: user.email },
              { label: 'Plan', value: user.plan.charAt(0).toUpperCase() + user.plan.slice(1) },
              { label: 'Operations Used', value: `${user.operationsUsed} / ${user.operationsLimit === 999999 ? '∞' : user.operationsLimit}` },
              { label: 'Member Since', value: new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) },
              { label: 'User ID', value: user.id.slice(0, 20) + '…' },
            ].map(f => (
              <div key={f.label} style={{ background: '#111115', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '12px 18px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: '#7a7068' }}>{f.label}</span>
                <span style={{ fontSize: 12, color: '#f2ede6', fontWeight: 500 }}>{f.value}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: '#7a7068' }}>
            To update your name or email, use the account button (bottom of sidebar) — managed by Clerk.
          </p>
        </div>
      )}
    </div>
  );
}
