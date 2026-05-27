'use client';
import React, { useState } from 'react';
import type { User, Addon } from '@/lib/db/schema';
import { ADDONS, formatPrice } from '@/lib/stripe';

const PLANS = [
  {
    id: 'signal', name: 'Signal', price: { gbp: 0, usd: 0, eur: 0 },
    features: ['30 operations/month', '1 inbox', 'MR Advisor (limited)', 'Bandwidth Audit'],
  },
  {
    id: 'growth', name: 'Growth', price: { gbp: 4900, usd: 5900, eur: 5400 },
    features: ['500 operations/month', 'Full inbox management', 'Unlimited content drafting', '30-day context memory'],
  },
  {
    id: 'pro', name: 'Pro', price: { gbp: 12900, usd: 15900, eur: 14900 },
    features: ['Unlimited operations', 'Momentum Clarity', 'Persistent memory', 'Custom agent profiles', 'Priority support'],
  },
];

const CURRENCIES = ['GBP', 'USD', 'EUR', 'AUD', 'CAD', 'SGD', 'AED', 'JPY'];

export default function SettingsClient({ user, activeAddons }: { user: User; activeAddons: Addon[] }) {
  const [currency, setCurrency] = useState((user.currency || 'GBP').toUpperCase());
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [loadingAddon, setLoadingAddon] = useState<string | null>(null);
  const [tab, setTab] = useState<'plan' | 'addons' | 'billing' | 'profile'>('plan');

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

  return (
    <div style={{ padding: '40px', maxWidth: 900 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 300, color: '#f2ede6', marginBottom: 4 }}>
          Settings
        </h1>
        <p style={{ fontSize: 13, color: '#7a7068' }}>Manage your plan, add-ons, and preferences.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 32, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 0 }}>
        {(['plan', 'addons', 'billing', 'profile'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em',
            color: tab === t ? '#c9a96e' : '#7a7068',
            borderBottom: `2px solid ${tab === t ? '#c9a96e' : 'transparent'}`,
            marginBottom: -1,
          }}>
            {t}
          </button>
        ))}
      </div>

      {/* Currency selector — always visible */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <span style={{ fontSize: 12, color: '#7a7068' }}>Display currency:</span>
        <select
          value={currency}
          onChange={e => setCurrency(e.target.value)}
          style={{ padding: '6px 12px', borderRadius: 8, background: '#111115', border: '1px solid rgba(255,255,255,0.08)', color: '#f2ede6', fontSize: 12, outline: 'none', cursor: 'pointer' }}
        >
          {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Plan tab */}
      {tab === 'plan' && (
        <div>
          <p style={{ fontSize: 12, color: '#7a7068', marginBottom: 20 }}>
            Current plan: <strong style={{ color: '#c9a96e' }}>{user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}</strong>
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {PLANS.map(plan => {
              const isCurrent = user.plan === plan.id;
              const price = plan.price[cur as keyof typeof plan.price] ?? plan.price.gbp;
              return (
                <div key={plan.id} style={{
                  background: isCurrent ? 'rgba(201,169,110,0.06)' : '#111115',
                  border: `1px solid ${isCurrent ? 'rgba(201,169,110,0.3)' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 16, padding: '24px',
                }}>
                  <p style={{ fontSize: 10, color: '#c9a96e', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>{plan.name}</p>
                  <p style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 300, color: '#f2ede6', marginBottom: 16 }}>
                    {price === 0 ? 'Free' : formatPrice(price, cur)}
                    {price > 0 && <span style={{ fontSize: 12, color: '#7a7068' }}>/mo</span>}
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {plan.features.map(f => (
                      <li key={f} style={{ fontSize: 12, color: '#7a7068', display: 'flex', gap: 8 }}>
                        <span style={{ color: '#c9a96e' }}>·</span> {f}
                      </li>
                    ))}
                  </ul>
                  {isCurrent ? (
                    <div style={{ padding: '9px', borderRadius: 10, background: 'rgba(201,169,110,0.1)', textAlign: 'center', fontSize: 11, color: '#c9a96e', fontWeight: 700 }}>
                      Current Plan
                    </div>
                  ) : (
                    <button
                      onClick={() => upgradePlan(plan.id)}
                      disabled={loadingPlan === plan.id || plan.id === 'signal'}
                      style={{
                        width: '100%', padding: '9px', borderRadius: 10,
                        background: plan.id === 'signal' ? 'transparent' : '#c9a96e',
                        color: plan.id === 'signal' ? '#7a7068' : '#09090b',
                        border: plan.id === 'signal' ? '1px solid rgba(255,255,255,0.08)' : 'none',
                        fontSize: 11, fontWeight: 700, cursor: plan.id === 'signal' ? 'default' : 'pointer',
                        textTransform: 'uppercase', letterSpacing: '0.08em',
                      }}
                    >
                      {loadingPlan === plan.id ? 'Redirecting…' : plan.id === 'signal' ? 'Free Tier' : `Upgrade to ${plan.name}`}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add-ons tab */}
      {tab === 'addons' && (
        <div>
          <p style={{ fontSize: 13, color: '#7a7068', marginBottom: 24 }}>
            Extend your capabilities with precision add-ons. Purchased instantly, active immediately.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
            {Object.entries(ADDONS).map(([key, addon]) => {
              const isActive = activeAddons.some(a => a.addonKey === key && a.active);
              const price = addon.prices[cur as keyof typeof addon.prices] ?? addon.prices.gbp;
              return (
                <div key={key} style={{
                  background: isActive ? 'rgba(74,222,128,0.04)' : '#111115',
                  border: `1px solid ${isActive ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 14, padding: '20px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#f2ede6' }}>{addon.name}</p>
                    {isActive && <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 99, background: 'rgba(74,222,128,0.1)', color: '#4ade80', fontWeight: 700, textTransform: 'uppercase' }}>Active</span>}
                  </div>
                  <p style={{ fontSize: 12, color: '#7a7068', marginBottom: 14, lineHeight: 1.5 }}>{addon.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'Fraunces, serif', fontSize: 18, color: '#c9a96e' }}>{formatPrice(price, cur)}</span>
                    <button
                      onClick={() => purchaseAddon(key)}
                      disabled={isActive || loadingAddon === key}
                      style={{
                        padding: '7px 16px', borderRadius: 8,
                        background: isActive ? 'transparent' : 'rgba(201,169,110,0.1)',
                        border: `1px solid ${isActive ? 'rgba(255,255,255,0.06)' : 'rgba(201,169,110,0.3)'}`,
                        color: isActive ? '#7a7068' : '#c9a96e',
                        fontSize: 11, fontWeight: 700, cursor: isActive ? 'default' : 'pointer',
                      }}
                    >
                      {loadingAddon === key ? '…' : isActive ? 'Active' : 'Add'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Billing tab */}
      {tab === 'billing' && (
        <div>
          <p style={{ fontSize: 13, color: '#7a7068', marginBottom: 24 }}>
            Manage your subscription, invoices, and payment methods through the Stripe billing portal.
          </p>
          {user.stripeCustomerId ? (
            <button
              onClick={openBillingPortal}
              style={{
                padding: '12px 28px', borderRadius: 12, background: '#c9a96e',
                color: '#09090b', fontSize: 12, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.1em', border: 'none', cursor: 'pointer',
              }}
            >
              Open Billing Portal →
            </button>
          ) : (
            <p style={{ fontSize: 13, color: '#7a7068' }}>No billing account yet. Upgrade to a paid plan to manage billing.</p>
          )}
        </div>
      )}

      {/* Profile tab */}
      {tab === 'profile' && (
        <div style={{ maxWidth: 480 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { label: 'Email', value: user.email },
              { label: 'Name', value: user.name || '—' },
              { label: 'Plan', value: user.plan.charAt(0).toUpperCase() + user.plan.slice(1) },
              { label: 'Member Since', value: new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) },
              { label: 'Operations Used', value: `${user.operationsUsed} / ${user.operationsLimit === 999999 ? '∞' : user.operationsLimit}` },
            ].map(f => (
              <div key={f.label} style={{ background: '#111115', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px 18px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: '#7a7068' }}>{f.label}</span>
                <span style={{ fontSize: 12, color: '#f2ede6', fontWeight: 500 }}>{f.value}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: '#7a7068', marginTop: 16 }}>
            To update your name or email, use the account button in the sidebar.
          </p>
        </div>
      )}
    </div>
  );
}
