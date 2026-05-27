# MINDREPLY // EXECUTION REPORT
**Date:** May 27, 2026
**Status:** Architecture audited. Critical modules built. Deployment blockers identified.

---

## AUDIT FINDINGS

### Critical Structural Problems (fix before next deploy)

1. **`.env` committed to repository root.**
   Live API keys (Clerk, Stripe, Anthropic, Neon) are exposed if anyone forks the repo.
   ACTION: Rotate all keys immediately. Confirm `.env` is in `.gitignore`. See attached `.gitignore`.

2. **File naming chaos at repository root.**
   `subconscious.ts` is actually the Settings page.
   `subscription.ts` is actually the Sign-In page.
   `schema.ts` is actually the Inbox UI.
   These are misnamed page files dumped at root during development.
   They do not belong there. The actual source files should live exclusively in `src/app/`.

3. **Multiple competing CI/CD pipelines.**
   `aws.yml`, `azure-webapps-node.yml`, `azure-functions-app-nodejs.yml`, `deploy-to-ionos.yaml`,
   `main_mind-reply.yml`, `nextjs.yml` — all in root. No single authoritative deploy.
   ACTION: Delete all of these. Use the new `.github/workflows/deploy.yml` provided here.
   Commit Vercel as the single deploy target.

4. **Plan names do not match the brief.**
   Admin panel code shows `signal`, `growth`, `pro`.
   Brief specifies `personal` (€29), `business` (€99), `creator` (€149).
   ACTION: Align DB enum, plan logic, and Stripe price IDs to the brief's naming.

5. **`MR Advisor` used in admin panel.**
   Approved vocabulary: `MRagent`. `MR Advisor` is not in the brief.

---

## WHAT WAS BUILT

### 1. Database Schema (`src/lib/db/schema.ts`)
Complete, consistent Drizzle schema covering:
- Users (with trial tracking, operations limit, regional fields)
- Sessions, Messages (with confidence score + tone effect columns)
- Signals, PatternSnapshots (Subconscious Layer persistence)
- Subscriptions (webhook truth record — separate from users table)
- Notifications, Reviews, ExpertProfiles, Bookings, Knowledge, Logs, Addons
- All foreign keys, enums, and audit timestamps in place

### 2. Subconscious Layer Service (`src/services/subconscious.service.ts`)
- Parallel execution alongside main chat reply (never blocks)
- Detects: avoidance, tension, overload, delay, clarity, urgency
- Returns: confidenceScore (0–100), toneEffect, signals[]
- Pattern snapshot computation (7d / 30d rolling windows)
- Silent failure: on any error, returns safe default — reply always reaches user

### 3. Chat API (`src/app/api/chat/route.ts`)
- Correct response contract: `{ reply, confidenceScore, toneEffect, signals[], sessionId }`
- Trial gate: 3 messages for free plan → 402 with `upgradeUrl`
- Operations limit enforcement
- Session management (create or continue)
- Subconscious Layer runs in `Promise.all` with main reply
- Signal persistence (non-blocking)
- Region-aware system prompt via Language Engine

### 4. Stripe Webhook Handler (`src/app/api/subscription/webhook/route.ts`)
- Signature verification (STRIPE_WEBHOOK_SECRET)
- Handles: `checkout.session.completed`, `customer.subscription.updated`,
  `customer.subscription.deleted`, `invoice.payment_failed`
- Webhook is the **only** writer of subscription state to DB
- User plan + operations limit updated atomically on each event
- All events logged before processing
- Failures logged but return 200 to prevent Stripe retry storms
- Cancellation and payment failure notifications created automatically

### 5. Checkout API (`src/app/api/checkout/route.ts`)
- Creates Stripe Checkout Session with `userId` in metadata
- Supports personal / business / creator plans
- Handles existing Stripe customers (passes `customer` param)
- Success page redirect does NOT write DB (webhook handles it)
- Zod-validated request body

### 6. Subconscious API (`src/app/api/subconscious/summary/route.ts` + `acknowledge/route.ts`)
- `GET /api/subconscious/summary?window=7|30` — rolling signal aggregation
- `POST /api/subconscious/acknowledge` — mark signals as seen
- Pattern snapshot persisted on every summary call

### 7. Language Engine (`src/services/language.service.ts`)
- Region detection from Vercel/Cloudflare headers
- Region-specific system prompt style rules (US / EU / RU)
- Tone-adjusted prompt construction (neutral / warm / assertive / direct)

### 8. MRagent Floating Engine (`src/components/mragent/MRagent.tsx`)
- Fixed bottom-right trigger
- Expandable panel with tone selector (N / W / A / D)
- Confidence score mini-bar display
- Signal badges with tooltips
- Trial gate: 3 messages + 60 second timer → paywall
- Input disabled after threshold
- Paywall screen with direct link to `/pricing`

### 9. Browser Extension Scaffold (`extension/`)
- `manifest.json` (Manifest V3, correct permissions)
- `content.js` — detects Gmail and Outlook compose textareas, injects MRagent icon
- Panel opens as iframe to `mind-reply.com/extension-panel`
- `postMessage` protocol for text replacement back into compose field

### 10. Deployment Pipeline (`.github/workflows/deploy.yml`)
- Single Vercel-targeted pipeline
- Build → Type check → Deploy on `main` push only
- All secrets parameterized via GitHub Secrets

---

## WHAT REMAINS

### High Priority (before launch)
- [ ] **Rotate all API keys** — `.env` was committed
- [ ] **Delete all competing CI/CD YML files** from root
- [ ] **Rename misidentified root files** or delete them (they are UI pages, not services)
- [ ] **Align plan names** in existing DB, admin panel, and Stripe price IDs (`personal`/`business`/`creator`)
- [ ] **Add `STRIPE_PRICE_PERSONAL`, `STRIPE_PRICE_BUSINESS`, `STRIPE_PRICE_CREATOR`** to `.env.example` and Vercel secrets
- [ ] **Run `db:migrate`** to apply updated schema to Neon
- [ ] **Register Stripe webhook endpoint** in Stripe Dashboard pointing to `/api/subscription/webhook`
- [ ] Set webhook secret in Vercel environment as `STRIPE_WEBHOOK_SECRET`

### Medium Priority (week 2)
- [ ] `/extension-panel` page in Next.js app (receives text via URL param, runs MRagent inline, sends `postMessage` back)
- [ ] PWA manifest + service worker + offline cache
- [ ] Notification bell component connected to `/api/notifications`
- [ ] Referral code generation and tracking
- [ ] `/stayhealthy` expert directory and booking flow
- [ ] Growth instrumentation (PostHog or Mixpanel — Vercel Analytics is not enough)

### Structural Cleanup
- [ ] Move all loose `.tsx` files from root into `src/app/` proper pages
- [ ] Delete: `server.rb`, `CodeDeployDefault.ECSAllAtOnce`, numbered `page (N).tsx` fragments
- [ ] Delete: `aws.yml`, `azure-webapps-node.yml`, `azure-functions-app-nodejs.yml`, `deploy-to-ionos.yaml`, `main_mind-reply.yml`, `nextjs.yml`

---

## BLOCKERS

| Blocker | Required From You |
|---|---|
| Stripe price IDs for 3 plans | Dashboard → Products → Copy price IDs |
| Vercel project/org IDs | For the new deploy pipeline |
| Confirmation `.env` keys have been rotated | Security — do this first |
| Webhook registered in Stripe Dashboard | Point to `/api/subscription/webhook` |

---

## NEXT MOVES (exact order)

1. Rotate all secrets immediately (Clerk, Stripe, Anthropic, Neon)
2. Add new `.gitignore` — verify `.env` is excluded before next commit
3. Run `db:migrate` with updated schema
4. Configure Stripe webhook in dashboard
5. Add price IDs to env
6. Delete all competing CI/CD files from root
7. Commit the new `deploy.yml` as the single pipeline
8. Test checkout → webhook → plan upgrade flow end-to-end in staging
9. Test trial gate (3 messages → paywall) in browser
10. Ship MRagent component to layout

---

*Built with precision. No flattery. No vague points. No omissions.*
