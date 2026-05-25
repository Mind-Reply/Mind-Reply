import Stripe from 'stripe';

export function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY is not set');
  return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-04-10' });
}

// Currency by country code — auto-detected from user locale
export const CURRENCY_MAP: Record<string, string> = {
  GB: 'gbp', US: 'usd', EU: 'eur', DE: 'eur', FR: 'eur', ES: 'eur',
  IT: 'eur', NL: 'eur', AU: 'aud', CA: 'cad', JP: 'jpy', SG: 'sgd',
  AE: 'aed', CH: 'chf', SE: 'sek', NO: 'nok', DK: 'dkk', PL: 'pln',
  BR: 'brl', MX: 'mxn', IN: 'inr', ZA: 'zar', NG: 'ngn',
};

// Prices per currency per plan (monthly, in smallest unit)
export const PLAN_PRICES: Record<string, Record<string, number>> = {
  growth: {
    gbp: 4900, usd: 5900, eur: 5400, aud: 8900, cad: 7900,
    jpy: 8900, sgd: 7900, aed: 21900, chf: 5400, sek: 59900,
    nok: 59900, dkk: 39900, pln: 22900, brl: 28900, mxn: 98900,
    inr: 489900, zar: 109900, ngn: 4890000,
  },
  pro: {
    gbp: 12900, usd: 15900, eur: 14900, aud: 23900, cad: 20900,
    jpy: 23900, sgd: 20900, aed: 58900, chf: 14900, sek: 159900,
    nok: 159900, dkk: 109900, pln: 59900, brl: 78900, mxn: 259900,
    inr: 1289900, zar: 289900, ngn: 12890000,
  },
};

export const PLAN_LIMITS: Record<string, number> = {
  signal: 30,
  growth: 500,
  pro: 999999,
};

// Add-ons catalogue
export const ADDONS = {
  extra_ops_100: {
    name: '100 Extra Operations',
    description: 'Top up your monthly operation count by 100.',
    prices: { gbp: 499, usd: 599, eur: 549 },
  },
  extra_ops_500: {
    name: '500 Extra Operations',
    description: 'Bulk operation top-up — best value.',
    prices: { gbp: 1999, usd: 2499, eur: 2199 },
  },
  custom_profile: {
    name: 'Custom Agent Profile',
    description: 'Configure a bespoke communication character for a specific context.',
    prices: { gbp: 2900, usd: 3500, eur: 3200 },
  },
  slack_integration: {
    name: 'Slack Integration',
    description: 'Connect MindReply directly to your Slack workspace.',
    prices: { gbp: 999, usd: 1199, eur: 1099 },
  },
  notion_integration: {
    name: 'Notion Integration',
    description: 'Sync tasks and context with your Notion workspace.',
    prices: { gbp: 999, usd: 1199, eur: 1099 },
  },
  priority_support: {
    name: 'Priority Support',
    description: '4-hour response SLA with dedicated onboarding.',
    prices: { gbp: 4900, usd: 5900, eur: 5400 },
  },
};

export function detectCurrency(countryCode?: string | null): string {
  if (!countryCode) return 'gbp';
  return CURRENCY_MAP[countryCode.toUpperCase()] || 'usd';
}

export function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
  }).format(amount / 100);
}
