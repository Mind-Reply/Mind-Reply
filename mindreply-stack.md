---
name: MindReply stack & decisions
description: Core stack, ports, DB schema decisions, and field additions for mind-reply.com
---

# MindReply — Stack & Key Decisions

**Framework**: Next.js 15 App Router, TypeScript  
**Auth**: Clerk (`@clerk/nextjs`)  
**DB**: Drizzle ORM + Neon PostgreSQL. Schema at `src/lib/db/schema.ts`. Migrate with `npx drizzle-kit push`.  
**Payments**: Stripe (multi-currency). Prices created on the fly per checkout. Plans: signal/growth/pro.  
**AI**: Anthropic `claude-haiku-4-5` for chat and gmail draft replies.  
**Email**: Gmail OAuth via `googleapis`. Tokens in `gmail_tokens` table.  
**Dev port**: 5000  
**Prod domain**: mind-reply.com  

## Schema additions
- `users.currency` (text, default 'gbp') — added to fix SettingsClient crash where it read `user.currency`.

## API routes added
- `POST /api/gmail/draft` — generates AI reply draft using Anthropic, increments ops count.
- `GET /api/user/subscription` — returns plan, ops, and subscription period/cancel info.
- `GET /api/notifications` — returns actionable notifications (ops limit, payment failure, cancellation warning).

## Checkout flow
- `POST /api/checkout` returns Stripe session URL with `?success=true` / `?canceled=true` appended to returnUrl.
- Dashboard reads these via `window.location.search` in `useEffect` (NOT `useSearchParams` — avoids Suspense boundary requirement in Next 15).

**Why:** `useSearchParams()` in Next.js 15 requires Suspense wrapping; `window.location.search` in useEffect is safe and avoids that requirement.
