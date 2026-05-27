/**
 * MindReply minimal production server (2-file build)
 *
 * What this gives you TODAY:
 * - Serves the website (index.html)
 * - Real Stripe Checkout Session creation (no libraries)
 * - Stripe webhook verification (HMAC SHA256)
 * - Session verification endpoint (so Success page can confirm access)
 *
 * Deploy target (best for your $180 Azure credit):
 * - Azure App Service (Linux) with Node 18+ or 20+
 * - Custom domain mind-reply.com
 *
 * ENV VARS YOU MUST SET IN AZURE:
 *   SITE_URL=https://mind-reply.com
 *   STRIPE_SECRET_KEY=sk_live_...
 *   STRIPE_WEBHOOK_SECRET=whsec_...
 *   STRIPE_PRICE_STARTER=price_...
 *   STRIPE_PRICE_PRO=price_...
 *   STRIPE_PRICE_ELITE=price_...
 *   (optional) STRIPE_MODE=subscription  (default: subscription)
 *
 * Stripe setup you do in 3 steps:
 * 1) Create 3 recurring Prices in Stripe (Starter/Pro/Elite)
 * 2) Add the PRICE IDs into the env vars above
 * 3) Create a Webhook endpoint:
 *      https://mind-reply.com/api/stripe-webhook
 *    Subscribe to events:
 *      checkout.session.completed
 *      invoice.payment_failed
 *      customer.subscription.updated
 *
 * IMPORTANT NOTE (truthful):
 * - This server verifies payments and confirms activation.
 * - For a full dashboard + persistent user accounts, add storage (Table/Cosmos).
 *   I kept this minimal on purpose to meet your “2-3 files” constraint.
 */

const http = require('http');
const { readFileSync } = require('fs');
const { createHmac, timingSafeEqual } = require('crypto');
const { URL } = require('url');

const PORT = process.env.PORT || 8080;
const SITE_URL = process.env.SITE_URL || `http://localhost:${PORT}`;

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

const STRIPE_MODE = process.env.STRIPE_MODE || 'subscription';

const PRICES = {
  Starter: process.env.STRIPE_PRICE_STARTER || '',
  Pro: process.env.STRIPE_PRICE_PRO || '',
  Elite: process.env.STRIPE_PRICE_ELITE || ''
};

const indexHtml = readFileSync(require('path').join(__dirname, 'index.html'), 'utf8');

function send(res, status, body, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', ...headers });
  res.end(JSON.stringify(body));
}

function sendHtml(res, status, html) {
  res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(html);
}

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function parseJsonSafe(buf) {
  try { return JSON.parse(buf.toString('utf8')); } catch { return null; }
}

async function stripeFetch(path, formBody) {
  if (!STRIPE_SECRET_KEY) {
    const err = new Error('Missing STRIPE_SECRET_KEY');
    err.statusCode = 500;
    throw err;
  }

  const res = await fetch(`https://api.stripe.com${path}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formBody
  });

  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text }; }
  if (!res.ok) {
    const err = new Error(data?.error?.message || `Stripe error (${res.status})`);
    err.statusCode = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

function toForm(params) {
  const entries = [];
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    entries.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
  }
  return entries.join('&');
}

function verifyStripeSignature(rawBody, sigHeader) {
  if (!STRIPE_WEBHOOK_SECRET) return { ok: false, reason: 'Missing STRIPE_WEBHOOK_SECRET' };
  if (!sigHeader) return { ok: false, reason: 'Missing stripe-signature header' };

  const parts = sigHeader.split(',').map(s => s.trim());
  const tPart = parts.find(p => p.startsWith('t='));
  const v1Part = parts.find(p => p.startsWith('v1='));
  if (!tPart || !v1Part) return { ok: false, reason: 'Invalid stripe-signature format' };

  const timestamp = tPart.slice(2);
  const signature = v1Part.slice(3);
  const signedPayload = `${timestamp}.${rawBody.toString('utf8')}`;

  const expected = createHmac('sha256', STRIPE_WEBHOOK_SECRET)
    .update(signedPayload, 'utf8')
    .digest('hex');

  const a = Buffer.from(expected, 'hex');
  const b = Buffer.from(signature, 'hex');
  if (a.length !== b.length) return { ok: false, reason: 'Signature length mismatch' };
  const ok = timingSafeEqual(a, b);
  return ok ? { ok: true } : { ok: false, reason: 'Signature mismatch' };
}

async function handleCreateCheckout(req, res) {
  const raw = await readRawBody(req);
  const body = parseJsonSafe(raw);
  if (!body) return send(res, 400, { error: 'Invalid JSON' });

  const plan = (body.plan || '').trim();
  const email = (body.email || '').trim();
  if (!PRICES[plan]) return send(res, 400, { error: 'Unknown plan. Use Starter, Pro, or Elite.' });
  if (!email || !email.includes('@')) return send(res, 400, { error: 'Valid email is required for instant activation.' });

  if (!STRIPE_SECRET_KEY) return send(res, 500, { error: 'Server not configured: missing STRIPE_SECRET_KEY' });

  const successUrl = `${SITE_URL}/#/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${SITE_URL}/#/cancel`;

  const params = {
    mode: STRIPE_MODE,
    'line_items[0][price]': PRICES[plan],
    'line_items[0][quantity]': 1,
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: email,
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
    'metadata[plan]': plan,
    'metadata[email]': email
  };

  const form = toForm(params);
  const session = await stripeFetch('/v1/checkout/sessions', form);
  return send(res, 200, { url: session.url });
}

async function handleVerifySession(req, res, url) {
  const sessionId = url.searchParams.get('session_id');
  if (!sessionId) return send(res, 400, { error: 'session_id is required' });
  if (!STRIPE_SECRET_KEY) return send(res, 500, { error: 'Server not configured: missing STRIPE_SECRET_KEY' });

  const r = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${STRIPE_SECRET_KEY}` }
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) return send(res, r.status, { error: data?.error?.message || 'Could not retrieve session' });

  const plan = data?.metadata?.plan || 'Unknown';
  const email = data?.customer_details?.email || data?.customer_email || data?.metadata?.email || '';
  const status = data?.payment_status || data?.status || '';

  const ok = (status === 'paid' || status === 'complete' || status === 'succeeded');
  if (!ok) return send(res, 402, { error: 'Payment not completed yet.', status });

  return send(res, 200, { plan, email, status });
}

async function handleStripeWebhook(req, res) {
  const raw = await readRawBody(req);
  const sig = req.headers['stripe-signature'];

  const v = verifyStripeSignature(raw, sig);
  if (!v.ok) return send(res, 400, { error: 'Webhook signature verification failed', reason: v.reason });

  const event = parseJsonSafe(raw);
  if (!event) return send(res, 400, { error: 'Invalid JSON event body' });

  const type = event.type;
  const obj = event?.data?.object;

  if (type === 'checkout.session.completed') {
    console.log('✅ checkout.session.completed', {
      session: obj?.id,
      email: obj?.customer_details?.email || obj?.customer_email || obj?.metadata?.email,
      plan: obj?.metadata?.plan
    });
    // Persist activation in storage and/or send welcome email (next step).
  }

  if (type === 'invoice.payment_failed') {
    console.log('❌ invoice.payment_failed', { customer: obj?.customer, invoice: obj?.id });
  }

  return send(res, 200, { received: true });
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, SITE_URL);

    if (url.pathname === '/api/create-checkout-session' && req.method === 'POST') {
      return await handleCreateCheckout(req, res);
    }

    if (url.pathname === '/api/verify-session' && req.method === 'GET') {
      return await handleVerifySession(req, res, url);
    }

    if (url.pathname === '/api/stripe-webhook' && req.method === 'POST') {
      return await handleStripeWebhook(req, res);
    }

    if (url.pathname === '/api/health') {
      return send(res, 200, {
        ok: true,
        site_url: SITE_URL,
        stripe_key_present: !!STRIPE_SECRET_KEY,
        webhook_secret_present: !!STRIPE_WEBHOOK_SECRET,
        prices_present: {
          Starter: !!PRICES.Starter,
          Pro: !!PRICES.Pro,
          Elite: !!PRICES.Elite
        }
      });
    }

    if (req.method === 'GET') {
      return sendHtml(res, 200, indexHtml);
    }

    send(res, 405, { error: 'Method not allowed' });
  } catch (err) {
    const status = err.statusCode || 500;
    console.error('Server error:', err);
    send(res, status, { error: err.message || 'Server error' });
  }
});

server.listen(PORT, () => {
  console.log(`MindReply server running on ${SITE_URL} (PORT=${PORT})`);
});
