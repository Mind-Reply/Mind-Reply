# Stripe Configuration & Setup Guide

**Status:** Ready to Deploy | **Stripe Keys Loaded:** ✅  
**Test Mode:** Enabled | **Mode:** Subscription + Usage Billing

---

## 🔑 Your Stripe API Keys (Test Mode)

Your test mode keys have been successfully configured. These are ready for local development and testing.

```
Public Key (pk_test):  pk_test_51TWNXQLTiMfuPTv6AY5U5Ft4jIXwNzUaQrMQhQwGRCFgIogFspxqvGuBooxLesjYM7qCmKouR3x1Zve6y9He6apA00rVQce0YT
Secret Key (sk_test):  sk_test_51TWNXQLTiMfuPTv6oe5vcXBmbMO2mi7FH4h1NuLHVPiizqUl3YJoqPQY32wbSLR2g995SVZmXh9OHrgLugJMgPM100D208ZDCh
```

---

## ⚙️ Environment Variables Setup

### Step 1: Create `.env.local` File

In your project root, create (or update) `.env.local`:

```bash
# Stripe API Keys (Test Mode)
STRIPE_PUBLIC_KEY=pk_test_51TWNXQLTiMfuPTv6AY5U5Ft4jIXwNzUaQrMQhQwGRCFgIogFspxqvGuBooxLesjYM7qCmKouR3x1Zve6y9He6apA00rVQce0YT
STRIPE_SECRET_KEY=sk_test_51TWNXQLTiMfuPTv6oe5vcXBmbMO2mi7FH4h1NuLHVPiizqUl3YJoqPQY32wbSLR2g995SVZmXh9OHrgLugJMgPM100D208ZDCh
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_51TWNXQLTiMfuPTv6AY5U5Ft4jIXwNzUaQrMQhQwGRCFgIogFspxqvGuBooxLesjYM7qCmKouR3x1Zve6y9He6apA00rVQce0YT

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:4028

# Webhook Secret (get from Stripe Dashboard → Webhooks)
STRIPE_WEBHOOK_SECRET=whsec_test_xxxxx
```

**⚠️ IMPORTANT:** Never commit `.env.local` to git. It's in `.gitignore` by default.

---

## 🚀 Quick Start (15 Minutes)

### Step 1: Install Dependencies (1 min)
```bash
npm install
```

### Step 2: Start Dev Server (2 min)
```bash
npm run dev
# Server runs on http://localhost:4028
```

### Step 3: Test Checkout (5 min)

1. Open **http://localhost:4028**
2. Navigate to **Pricing section**
3. Click **"Get Growth"** button
4. You'll be redirected to Stripe Checkout

### Step 4: Use Test Card (5 min)

On the Stripe Checkout page, use:

```
Card Number:  4242 4242 4242 4242
Expiry Date:  Any future date (e.g., 12/25)
CVC:          Any 3 digits (e.g., 123)
ZIP:          Any 5 digits (e.g., 12345)
```

**Expected Outcome:**
- ✅ Payment processes successfully
- ✅ Redirect to success page
- ✅ Stripe dashboard shows transaction

---

## 🧪 Test Mode Cards

### Success Scenarios

| Card Number | Scenario | Expiry | CVC |
|-------------|----------|--------|-----|
| `4242 4242 4242 4242` | Successful payment | Any future | Any 3 |
| `4000 0000 0000 0002` | Card declined | Any future | Any 3 |
| `4000 0000 0000 0069` | Expired card | Any past | Any 3 |
| `4000 0000 0000 0127` | Incorrect CVC | Any future | 999 |

### Subscription Scenarios

| Card | Result |
|------|--------|
| `4242 4242 4242 4242` | Active subscription |
| `4000 0000 0000 0002` | Subscription declined |
| `4000 0025 0000 3155` | 3D Secure required |

---

## 🔧 Webhook Setup (For Production)

### Local Testing with Stripe CLI

1. **Install Stripe CLI**
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. **Login to Stripe Account**
   ```bash
   stripe login
   ```

3. **Listen for Webhooks**
   ```bash
   stripe listen --forward-to localhost:4028/api/webhooks/stripe
   ```

   You'll get output like:
   ```
   ⠋ Forwarding to http://localhost:4028/api/webhooks/stripe
   > Ready! You are now listening to Stripe events...
   ```

4. **Get Webhook Secret**
   The CLI will display a webhook signing secret:
   ```
   whsec_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

5. **Add to `.env.local`**
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_test_xxxxx
   ```

### Production Webhook Setup

1. Go to **https://dashboard.stripe.com/webhooks**
2. Click **"Add an endpoint"**
3. Enter your production URL:
   ```
   https://your-domain.com/api/webhooks/stripe
   ```
4. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_attempt_failed`
   - `invoice.paid`
   - `invoice.finalized`

5. Copy the **Signing secret** and add to production environment variables

---

## 📊 Pricing Configuration

### Current Plans

| Plan | Price | Interactions | Teams | Support |
|------|-------|--------------|-------|---------|
| Signal | FREE | 1,000/mo | 1 | Community |
| Growth | $49.99/mo | 50,000/mo | 5 | Email |
| Pro | $149.99/mo | Unlimited | Unlimited | Phone |

**Overage:** $0.001 per additional interaction

### How to Add/Modify Plans

1. Edit `src/lib/stripe.ts` → `PLANS` object
2. Add new plan:
   ```typescript
   export const PLANS = {
     // ... existing plans
     team: {
       name: 'Team',
       id: 'team',
       price: 29999, // $299.99
       currency: 'usd',
       billingCycle: 'month',
       aiInteractions: 200000,
       teams: 20,
       support: 'phone',
     },
   };
   ```
3. Restart dev server
4. New plan will auto-sync to Stripe

---

## 💳 Testing Payment Flows

### Test Flow 1: Successful Subscription

```bash
# 1. Start dev server
npm run dev

# 2. In another terminal, listen for webhooks
stripe listen --forward-to localhost:4028/api/webhooks/stripe

# 3. Visit http://localhost:4028
# 4. Click "Get Growth"
# 5. Use card: 4242 4242 4242 4242
# 6. Complete payment
# 7. Check terminal for webhook events
```

### Test Flow 2: Failed Payment & Retry

```bash
# Use card: 4000 0000 0000 0002 (declined)
# Payment will fail automatically
# Webhook will trigger: payment_intent.payment_failed
# Dunning sequence will start
```

### Test Flow 3: Subscription Upgrade

```bash
# 1. Create subscription to "Growth" plan
# 2. Via Stripe Dashboard or API, upgrade to "Pro"
# 3. Check for prorated charges
# 4. Verify webhook: customer.subscription.updated
```

---

## 🔐 Security Checklist

- [ ] API keys never exposed in frontend code
- [ ] Webhook endpoint validates Stripe signature
- [ ] All payment data handled by Stripe (PCI compliant)
- [ ] Rate limiting enabled on checkout endpoint
- [ ] HTTPS enforced on all payment routes
- [ ] Environment variables stored securely (never in git)
- [ ] Customer data encrypted in database (if using DB)

---

## 📈 Monitoring & Analytics

### View Transactions
1. Go to **https://dashboard.stripe.com/payments**
2. Filter by date, amount, status
3. Click transaction for details

### View Subscriptions
1. Go to **https://dashboard.stripe.com/subscriptions**
2. See active, paused, canceled subscriptions
3. Click for customer details

### View Invoices
1. Go to **https://dashboard.stripe.com/invoices**
2. See all invoices and payment status
3. Export for accounting

### Revenue Dashboard
1. Go to **https://dashboard.stripe.com/balance**
2. See **Monthly Recurring Revenue (MRR)**
3. See **Net Volume (payments - refunds)**
4. Monitor **Churn Rate**

---

## 🆘 Troubleshooting

### Issue: "Webhook signature verification failed"
**Solution:**
1. Verify `STRIPE_WEBHOOK_SECRET` is set correctly
2. Re-run: `stripe listen --forward-to localhost:4028/api/webhooks/stripe`
3. Restart dev server

### Issue: "Invalid API Key"
**Solution:**
1. Verify keys in `.env.local` are correct
2. Ensure you're using **test mode** keys (pk_test_, sk_test_)
3. Don't include spaces or quotes around keys

### Issue: Checkout page shows blank/error
**Solution:**
1. Check browser console (F12) for JavaScript errors
2. Verify `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` is set
3. Ensure Stripe.js loaded: look for `stripe` in Network tab

### Issue: Payment succeeds but no confirmation email
**Solution:**
1. Implement email sending in webhook handlers
2. Use Resend, Loops, SendGrid, or Mailgun
3. Test email sending separately first

---

## 🚀 Deployment Steps

### For Vercel

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Add Stripe integration"
   git push origin main
   ```

2. **In Vercel Dashboard:**
   - Go to **Settings → Environment Variables**
   - Add all variables from `.env.local`
   - But use **LIVE mode keys** (pk_live_, sk_live_)

3. **Redeploy**
   - Changes automatically trigger redeployment
   - Or click **Redeploy**

4. **Update Stripe Webhook**
   - Go to https://dashboard.stripe.com/webhooks
   - Change webhook URL to: `https://your-domain.vercel.app/api/webhooks/stripe`
   - Use **LIVE mode keys** for webhooks

### For Netlify

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Add Stripe integration"
   git push origin main
   ```

2. **In Netlify Dashboard:**
   - Go to **Site Settings → Build & Deploy → Environment**
   - Add all variables
   - Use **LIVE mode keys**

3. **Trigger Deploy**
   - Go to **Deploys**
   - Click **Trigger deploy**

4. **Update Stripe Webhook**
   - Go to https://dashboard.stripe.com/webhooks
   - Change webhook URL to: `https://your-domain.netlify.app/api/webhooks/stripe`

---

## 📞 Additional Resources

- **Stripe Docs:** https://stripe.com/docs/billing
- **Stripe Dashboard:** https://dashboard.stripe.com
- **Stripe CLI:** https://stripe.com/docs/stripe-cli
- **Next.js API Routes:** https://nextjs.org/docs/app/building-your-application/routing/route-handlers

---

**Status:** ✅ Ready to test locally and deploy to production  
**Timeline:** 15 minutes to first payment  
**Next:** Run `npm run dev` and test with card `4242 4242 4242 4242`
