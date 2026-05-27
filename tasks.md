# Implementation Plan: MindReply Platform Expansion

## Overview

This plan converts the MindReply Platform Expansion design into incremental coding tasks for a Next.js 15 TypeScript codebase. Tasks follow the module hierarchy: Subconscious Layer (primary) → MRagent Engine → Multi-Language Layer → Stripe Monetization → Engagement & Retention → Browser Extension → PWA Mobile → Web Dashboard → BUmind Expert Booking. Each task builds on the previous, ending with full integration.

## Tasks

- [ ] 1. Project foundation — types, database schema, and auth utilities
  - [ ] 1.1 Define all TypeScript types and interfaces
    - Create `src/types/user.ts`, `signal.ts`, `pattern.ts`, `subscription.ts`, `booking.ts`, `expert.ts`, `api.ts`
    - Define `Signal`, `Pattern`, `Snapshot`, `Message`, `Notification`, `Subscription`, `Expert`, `Booking`, `Payment`, `Review` interfaces
    - Export all types from `src/types/index.ts`
    - _Requirements: 1.1, 2.1, 3.1, 5.1, 11.1, 31.1, 33.1_

  - [ ] 1.2 Create database schema SQL files
    - Write `database/schema/users.sql`, `signals.sql`, `patterns.sql`, `snapshots.sql`, `messages.sql`, `subscriptions.sql`, `reviews.sql`, `notifications.sql`
    - Write `database/schema/bumind-schema.sql` (experts, bookings, payments, expert_reviews tables)
    - Write `database/migrations/001_initial_schema.sql` combining all tables with indexes
    - _Requirements: 1.2, 2.1, 3.1, 11.1, 31.1, 33.1_

  - [ ] 1.3 Implement database connection and query utilities
    - Create `src/lib/db/connection.ts` with PostgreSQL connection pool (max 20 connections)
    - Create `src/lib/db/queries/users.ts`, `signals.ts`, `patterns.ts`, `subscriptions.ts`, `bookings.ts`, `reviews.ts`
    - Create `src/lib/db/bumind-connection.ts` for separate BUmind database
    - Use parameterized queries throughout to prevent SQL injection
    - _Requirements: 1.2, 33.1_

  - [ ] 1.4 Implement authentication utilities
    - Create `src/lib/auth/jwt.ts` — JWT sign/verify with 24h access token and 30d refresh token
    - Create `src/lib/auth/session.ts` — session management helpers
    - Create `src/lib/auth/permissions.ts` — tier-based permission checks (Signal/Growth/Pro)
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

  - [ ] 1.5 Create constants and validators
    - Create `src/lib/constants/regions.ts` (EU/US/RU tone mappings), `subscription-tiers.ts` (tier feature lists), `expert-specializations.ts`
    - Create `src/lib/utils/validators.ts` — input validation for all API request bodies
    - _Requirements: 8.1, 9.1, 11.1_


- [ ] 2. Subconscious Layer Engine — signal ingestion and storage
  - [ ] 2.1 Implement signal ingestion API route
    - Create `src/app/api/subconscious/signal/route.ts` — POST handler
    - Validate request body (type, content, metadata) using `validators.ts`
    - Store signal in `signals` table via `src/lib/db/queries/signals.ts`
    - Return `{ signalId, status: "ingested" }` immediately (patterns/score added in task 2.3)
    - Require Bearer token auth; reject unauthenticated requests
    - _Requirements: 1.1, 1.2_

  - [ ] 2.2 Implement signal history API route
    - Create `src/app/api/subconscious/history/route.ts` — GET handler
    - Support query params: `limit`, `offset`, `type` (email|message|context|manual|all)
    - Return paginated signals with `{ signals, total }` shape
    - Enforce user data isolation — only return signals for authenticated user
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ]* 2.3 Write property test for signal integrity (Property 1)
    - **Property 1: Signal Integrity** — every ingested signal must be retrievable from history with unmodified content and metadata
    - **Validates: Requirements 1.2, 4.1**


- [ ] 3. Subconscious Layer Engine — pattern extraction and composure scoring
  - [ ] 3.1 Implement pattern extraction utility
    - Create `src/lib/utils/pattern-extractor.ts`
    - Tokenize signal content and extract entities (people, dates, actions, emotions)
    - Compare against existing patterns using similarity score (threshold 0.7)
    - Increment frequency and update `last_occurred_at` for matching patterns; create new pattern otherwise
    - Recalculate confidence score (0–1 range) on each update
    - _Requirements: 2.1, 2.2_

  - [ ] 3.2 Implement composure score calculator
    - Create `src/lib/utils/composure-calculator.ts`
    - Apply stress-pattern penalty and positive-pattern bonus per design formula
    - Apply exponential smoothing: `score = (0.7 * prev) + (0.3 * new)`
    - Clamp result to [0, 1]
    - _Requirements: 1.3, 3.1_

  - [ ]* 3.3 Write property test for composure score bounds (Property 3 — Signal Processing)
    - **Property 3: Composure Score Bounds** — score must always be in [0, 1] and must not jump more than 0.3 between consecutive calculations
    - **Validates: Requirements 1.3, 3.1**

  - [ ]* 3.4 Write property test for pattern extraction consistency (Property 2 — Signal Processing)
    - **Property 2: Pattern Extraction Consistency** — same signal content must always produce the same pattern names; pattern frequency must be monotonically non-decreasing
    - **Validates: Requirements 2.1, 2.2**

  - [ ] 3.5 Wire pattern extraction and composure scoring into signal ingestion
    - Update `src/app/api/subconscious/signal/route.ts` to call `pattern-extractor.ts` and `composure-calculator.ts` after storing signal
    - Persist extracted patterns and updated composure score
    - Return full response: `{ signalId, status, patterns, composureScore }`
    - Trigger snapshot generation when threshold met (10+ signals since last, or score delta >0.15, or new high-confidence pattern)
    - _Requirements: 1.3, 1.4, 2.1, 2.2_

  - [ ] 3.6 Implement patterns API route
    - Create `src/app/api/subconscious/patterns/route.ts` — GET handler
    - Support `limit`, `offset`, `timeRange` (7d|30d|90d|all-time) query params
    - Return `{ patterns, total }` with frequency, lastOccurred, confidence per pattern
    - Trigger engagement notification when pattern confidence exceeds 0.85
    - _Requirements: 2.3, 2.4, 2.5_

  - [ ] 3.7 Implement composure snapshots API route
    - Create `src/app/api/subconscious/snapshots/route.ts` — GET handler
    - Return paginated snapshots with composureScore, stressIndicators, decisionPatterns, recommendations
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_


- [ ] 4. Checkpoint — Subconscious Layer
  - Ensure all Subconscious Layer API routes return correct shapes, auth is enforced, and property tests pass. Ask the user if questions arise.

- [ ] 5. MRagent Communication Engine — chat and response generation
  - [ ] 5.1 Implement Anthropic Claude LLM integration
    - Create `src/lib/api/mragent.ts` — wrapper around Anthropic API (`claude-haiku-4-5` model, consistent with existing `/api/chat` route)
    - Accept signal context, patterns, and tone rules as input; return response text with confidence score
    - Implement fallback to cached response if API unavailable
    - Respect rate limit (100 req/min)
    - _Requirements: 5.1, 5.2_

  - [ ] 5.2 Implement MRagent chat API route
    - Create `src/app/api/mragent/chat/route.ts` — POST handler
    - Accept `{ message, context: { signalId?, conversationId? } }`
    - Store user message and MRagent response in `messages` table with `conversation_id`
    - Return `{ messageId, response, confidence, suggestedActions, tone }`
    - _Requirements: 5.3, 7.1, 7.2_

  - [ ] 5.3 Implement MRagent response GET route
    - Create `src/app/api/mragent/response/route.ts` — GET handler with `signalId` query param
    - Return same shape as chat POST
    - _Requirements: 5.1, 5.4_

  - [ ] 5.4 Implement notifications API route
    - Create `src/app/api/mragent/notifications/route.ts` — GET handler
    - Support `limit`, `offset`, `unreadOnly` query params
    - Return `{ notifications, unreadCount }`
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ]* 5.5 Write unit tests for MRagent chat route
    - Test message storage, conversation ID assignment, and response shape
    - Test auth rejection for unauthenticated requests
    - _Requirements: 5.3, 7.1_


- [ ] 6. Multi-Language Layer — region detection and tone adaptation
  - [ ] 6.1 Implement tone adapter utility
    - Create `src/lib/utils/tone-adapter.ts`
    - Accept region (EU|US|RU|other) and raw response text; return tone-adapted response via prompt engineering
    - Apply tone rules from `src/lib/constants/regions.ts`
    - Support user tone override stored in `users.tone_preference`
    - _Requirements: 9.1, 9.2, 9.3, 9.5_

  - [ ] 6.2 Implement language detection API route
    - Create `src/app/api/language/detect/route.ts` — POST handler
    - Accept `{ ipAddress?, userAgent?, manualRegion? }`; return `{ region, language, toneStyle, confidence }`
    - Store detected region in `users.region` on first detection
    - Default to balanced/professional tone when region cannot be detected
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [ ] 6.3 Implement tone rules API route
    - Create `src/app/api/language/tone/route.ts` — GET handler with `region` query param
    - Return `{ region, toneRules, examples }` from constants
    - _Requirements: 9.4_

  - [ ] 6.4 Wire tone adapter into MRagent response generation
    - Update `src/lib/api/mragent.ts` to call `tone-adapter.ts` after generating response
    - Pass user's region and language preference from database
    - _Requirements: 5.4, 9.1, 9.2, 9.3, 10.1, 10.2_

  - [ ]* 6.5 Write unit tests for tone adapter
    - Test EU/US/RU tone application produces distinct output characteristics
    - Test default fallback when region is unknown
    - _Requirements: 9.1, 9.2, 9.3, 8.5_


- [ ] 7. Stripe Monetization — subscriptions and webhooks
  - [ ] 7.1 Implement Stripe API wrapper and subscription constants
    - Create `src/lib/api/stripe.ts` — Stripe SDK wrapper for checkout sessions and payment intents
    - Update `src/lib/constants/subscription-tiers.ts` with feature lists per tier (Signal/Growth/Pro)
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

  - [ ] 7.2 Implement checkout session API route
    - Create `src/app/api/subscription/checkout/route.ts` — POST handler
    - Accept `{ tier, billingCycle }`; create Stripe checkout session; return `{ sessionId, checkoutUrl }`
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

  - [ ] 7.3 Implement Stripe webhook handler
    - Create `src/app/api/subscription/webhook/route.ts` — POST handler
    - Verify Stripe signature before processing (reject invalid signatures)
    - Handle `customer.subscription.created/updated/deleted` and `invoice.payment_succeeded/failed`
    - Update `subscriptions` table atomically; return 200 OK immediately
    - Implement idempotent processing (safe to receive duplicate events)
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7_

  - [ ]* 7.4 Write property test for webhook idempotency (Property 2 — Subscription Management)
    - **Property 2: Webhook Idempotency** — processing the same webhook event twice must result in identical database state
    - **Validates: Requirements 13.1, 13.2, 13.3_

  - [ ]* 7.5 Write property test for subscription state consistency (Property 1 — Subscription Management)
    - **Property 1: Subscription State Consistency** — user subscription tier in database must always match the Stripe subscription status; only valid state transitions are allowed
    - **Validates: Requirements 13.1, 13.2, 13.3, 14.1**

  - [ ] 7.6 Implement subscription status API route
    - Create `src/app/api/subscription/status/route.ts` — GET handler
    - Return `{ tier, status, currentPeriodStart, currentPeriodEnd, cancelAtPeriodEnd, features }`
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

  - [ ] 7.7 Implement tier-based feature access control in middleware
    - Update `src/middleware.ts` to enforce tier permissions on protected routes
    - Block Signal-tier users from expert booking routes; block unauthenticated users from all API routes
    - _Requirements: 11.2, 11.3, 11.4, 11.5, 11.6_

  - [ ]* 7.8 Write property test for feature access control (Property 3 — Subscription Management)
    - **Property 3: Feature Access Control** — users can only access features for their current subscription tier; downgraded users must lose premium feature access
    - **Validates: Requirements 11.2, 11.3, 11.4, 11.5, 11.6**


- [ ] 8. Checkpoint — Core API layer
  - Ensure Subconscious Layer, MRagent, Language, and Stripe API routes all pass their tests, auth is enforced on every route, and webhook idempotency is verified. Ask the user if questions arise.

- [ ] 9. Engagement & Retention — upsells, reviews, and metrics
  - [ ] 9.1 Implement upsell trigger logic
    - Create `src/lib/utils/signal-processor.ts` — evaluate upsell conditions (10+ signals on Signal tier, composure score <0.4, 30-day milestone, expert booking attempt on Growth tier)
    - Create `src/app/api/engagement/upsell/route.ts` — GET handler returning personalized `{ opportunities }` array
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

  - [ ] 9.2 Implement review submission API route
    - Create `src/app/api/engagement/review/route.ts` — POST handler
    - Accept `{ targetType, targetId?, rating, comment? }`; store in `reviews` table
    - Return `{ reviewId, status: "submitted" }`
    - _Requirements: 16.3, 16.4_

  - [ ] 9.3 Implement engagement metrics API route
    - Create `src/app/api/engagement/metrics/route.ts` — POST handler
    - Accept `{ event, metadata? }` for session-start, feature-used, signal-submitted, response-viewed events
    - Return `{ recorded: true }`
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5_

  - [ ] 9.4 Implement notification creation helpers
    - Add `createNotification(userId, type, title, message, actionUrl?)` helper in `src/lib/db/queries/`
    - Call from pattern extraction (confidence >0.85 → pattern-detected), upsell logic (upsell), and booking system (booking-reminder)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.6_

  - [ ]* 9.5 Write unit tests for upsell trigger logic
    - Test each trigger condition independently (signal count, composure score, tier, days active)
    - _Requirements: 15.1, 15.2, 15.3, 15.4_


- [ ] 10. Auth pages and API client wrapper
  - [ ] 10.1 Implement auth API routes and pages
    - Create `src/app/auth/login/page.tsx` and `src/app/auth/signup/page.tsx` — dark premium forms (Fraunces + DM Sans, `--background` / `--primary` gold)
    - Create `src/app/auth/callback/route.ts` — OAuth callback handler
    - Hash passwords with bcrypt (cost factor 12); never store plaintext
    - Rate-limit auth endpoints (5 attempts/minute)
    - _Requirements: 8.1 (user signup triggers region detection)_

  - [ ] 10.2 Implement API client wrapper
    - Create `src/lib/api/client.ts` — fetch wrapper that attaches Bearer token, handles 401 refresh, and throws typed errors
    - Create `src/lib/api/subconscious.ts`, `mragent.ts`, `stripe.ts`, `expert.ts`, `language.ts` — typed client functions for each module
    - _Requirements: 1.1, 5.3, 12.1_


- [ ] 11. Shared UI components
  - [ ] 11.1 Implement common components
    - Create `src/components/common/Button.tsx`, `Modal.tsx`, `Toast.tsx`, `Loading.tsx`
    - Use inline styles + Tailwind utilities; CSS custom properties (`--background`, `--card`, `--primary`, `--foreground`)
    - No CSS Modules; `'use client'` where interactive
    - _Requirements: 18.1, 26.1_

  - [ ] 11.2 Implement layout components
    - Create `src/components/layout/Header.tsx` (sticky nav, notification bell slot, mobile menu), `Footer.tsx`, `Sidebar.tsx`
    - Create `src/app/dashboard/layout.tsx` wrapping all dashboard pages with sidebar
    - _Requirements: 26.1, 27.1, 28.1, 29.1, 30.1_

  - [ ] 11.3 Implement NotificationBell component
    - Create `src/components/dashboard/NotificationBell.tsx`
    - Show unread count badge; dropdown with up to 5 items; "View all" link; "Mark all as read" button
    - Pulse animation on new notification using `live-dot` CSS class
    - _Requirements: 6.6, 30.1, 30.4_

  - [ ] 11.4 Implement UpsellPopup component
    - Create `src/components/dashboard/UpsellPopup.tsx`
    - Semi-transparent overlay, 500px modal, feature highlight, benefits list, pricing info
    - Primary gold upgrade button, secondary dismiss button; fade-in scale-up animation
    - _Requirements: 15.1, 15.2, 15.3, 15.4_


- [ ] 12. MRagent UI components and chat interface
  - [ ] 12.1 Implement FloatingWidget component
    - Create `src/components/mragent/FloatingWidget.tsx`
    - Fixed bottom-right, 380×500px, dark premium theme, z-index 9999
    - Minimize/expand toggle, drag-to-reposition, Cmd+Shift+M keyboard shortcut
    - Pulsing gold indicator when new responses available
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5_

  - [ ] 12.2 Implement ChatInterface, MessageBubble, and ResponseLoader components
    - Create `src/components/mragent/ChatInterface.tsx` — scrollable message list + input area + quick actions
    - Create `src/components/mragent/MessageBubble.tsx` — user vs MRagent bubble styling, confidence score display, helpful/not-helpful feedback buttons
    - Create `src/components/mragent/ResponseLoader.tsx` — loading state while awaiting LLM response
    - _Requirements: 5.5, 7.3, 7.4_

  - [ ] 12.3 Implement ReviewCard component
    - Create `src/components/dashboard/ReviewCard.tsx`
    - 1–5 star interactive rating (gold `--primary` when selected), optional comment textarea, submit/cancel buttons
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_


- [ ] 13. Web Dashboard — signal history, patterns, snapshots, settings, notifications
  - [ ] 13.1 Implement SignalCard component and signal history page
    - Create `src/components/dashboard/SignalCard.tsx` — type badge, source, timestamp, composure score (color-coded: red <0.5, yellow 0.5–0.75, green >0.75), pattern tags, MRagent snippet
    - Create `src/app/dashboard/signals/page.tsx` — paginated signal history with type filter and search
    - Create `src/app/dashboard/signals/[id]/page.tsx` — full signal detail with context, patterns, and MRagent response
    - _Requirements: 26.1, 26.2, 26.3, 26.4, 26.5_

  - [ ] 13.2 Implement PatternChart component and patterns page
    - Create `src/components/dashboard/PatternChart.tsx` — bar/line/radar chart (gold primary, muted grays secondary), interactive hover, responsive
    - Create `src/app/dashboard/patterns/page.tsx` — pattern list with frequency/confidence and chart visualization
    - Create `src/app/dashboard/patterns/[id]/page.tsx` — pattern detail with related signals and recommendations
    - _Requirements: 27.1, 27.2, 27.3, 27.4, 27.5_

  - [ ] 13.3 Implement SnapshotWidget component and snapshots page
    - Create `src/components/dashboard/SnapshotWidget.tsx` — circular progress composure score, stress indicator tags, decision pattern tags, recommendation items
    - Create `src/app/dashboard/snapshots/page.tsx` — paginated snapshots with timeline and composure trend
    - _Requirements: 28.1, 28.2, 28.3, 28.4, 28.5_

  - [ ] 13.4 Implement settings pages
    - Create `src/app/dashboard/settings/page.tsx` — profile form, language selector, notification preferences
    - Create `src/app/dashboard/settings/language.tsx` — language/tone preference form calling `/api/language/detect`
    - Create `src/app/dashboard/settings/notifications.tsx` — notification channel and frequency toggles
    - Implement CSV data export for signals and patterns
    - _Requirements: 29.1, 29.2, 29.3, 29.4, 29.5_

  - [ ] 13.5 Implement notification center page
    - Create `src/app/dashboard/notifications/page.tsx` — paginated notifications with type filter, read/unread toggle, mark-as-read action
    - _Requirements: 30.1, 30.2, 30.3, 30.4, 30.5_


- [ ] 14. Checkpoint — Web Dashboard
  - Ensure all dashboard pages render correctly, signal/pattern/snapshot data loads from API, and auth redirects work. Ask the user if questions arise.

- [ ] 15. Browser Extension
  - [ ] 15.1 Create extension manifest and scaffold
    - Create `extension/manifest.json` (Manifest v3, permissions: activeTab, scripting, storage, webRequest, tabs; host_permissions for Gmail, Outlook, Slack, Teams)
    - Create `extension/icons/` placeholder PNGs (16, 48, 128px)
    - Create `extension/styles.css` with dark premium theme and floating widget styles
    - _Requirements: 18.1, 19.1, 21.1_

  - [ ] 15.2 Implement extension popup
    - Create `extension/popup.html` and `extension/popup.js`
    - Show MRagent icon, notification count, signal history preview, settings link, login/logout
    - _Requirements: 21.1, 21.2_

  - [ ] 15.3 Implement background service worker
    - Create `extension/background.js`
    - Listen for messages from content script; handle API calls with Bearer token
    - Queue signals in IndexedDB when offline; sync with exponential backoff when online
    - Handle context menu "Send to MRagent" registration
    - _Requirements: 19.3, 20.1, 20.2, 20.3, 20.4, 20.5_

  - [ ] 15.4 Implement content script and context capture
    - Create `extension/content.js`
    - Detect text selection in Gmail/Outlook/Slack/Teams; extract sender, subject, timestamp, URL
    - Register right-click context menu option "Send to MRagent"
    - Inject floating widget into page DOM; display MRagent response inline after signal submission
    - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5_

  - [ ] 15.5 Implement floating widget script
    - Create `extension/floating-widget.js`
    - Render floating MRagent UI (380×500px, bottom-right, z-index 9999, dark premium)
    - Handle minimize/expand, drag-to-reposition, persist position in localStorage
    - Display chat history, input area, quick actions
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5_

  - [ ] 15.6 Implement extension settings persistence
    - Save notification preferences, capture behavior, and widget position to `chrome.storage.local`
    - Apply settings immediately on change
    - _Requirements: 21.2, 21.3, 21.4, 21.5_


- [ ] 16. PWA Mobile
  - [ ] 16.1 Create PWA manifest and service worker
    - Create `public/manifest.json` with name, icons (192, 512, maskable), theme_color `#09090b`, shortcuts (New Signal, Chat)
    - Create `public/service-worker.js` — cache-first for static assets, network-first for API calls, stale-while-revalidate for user data
    - Register service worker in `src/app/layout.tsx`
    - _Requirements: 22.1, 22.2, 24.1_

  - [ ] 16.2 Implement offline mode and signal queuing in PWA
    - Store queued signals in IndexedDB; display "Queued" status indicator
    - Show offline banner: "You're offline. Changes will sync when online."
    - Auto-sync queued signals on connectivity restore; update status to "Synced"
    - Disable expert booking and upsell features when offline
    - _Requirements: 22.2, 22.3, 22.4, 22.5_

  - [ ] 16.3 Implement quick reply feature
    - Create `src/components/` mobile quick reply section on signal detail page
    - Show 3–5 suggested reply buttons (Helpful, Not helpful, Tell me more, custom)
    - One-tap submit; track as engagement metric; show text input for custom reply
    - _Requirements: 23.1, 23.2, 23.3, 23.4, 23.5_

  - [ ] 16.4 Implement push notifications
    - Request push permission on PWA install
    - Subscribe to push service; store subscription endpoint in backend
    - Handle push events in service worker: navigate to relevant page on tap
    - _Requirements: 24.1, 24.2, 24.3, 24.4, 24.5_

  - [ ] 16.5 Implement saved replies feature
    - Add "Save" button to MRagent response display; store in IndexedDB collection
    - Create saved replies list page with search and filter
    - Implement delete saved reply
    - _Requirements: 25.1, 25.2, 25.3, 25.4, 25.5_


- [ ] 17. BUmind Expert Booking Platform — API layer
  - [ ] 17.1 Implement expert list and detail API routes
    - Create `src/app/api/expert/list/route.ts` — GET with `specialization`, `limit`, `offset` params; return `{ experts, total }`
    - Create `src/app/api/expert/[id]/route.ts` — GET returning full profile with credentials, reviews, availability
    - Create `src/app/api/expert/availability/route.ts` — GET with `expertId`, `month` params; return available 1-hour slots
    - Require Growth/Pro tier for expert list access
    - _Requirements: 31.1, 31.2, 31.3, 31.4, 31.5, 32.1, 32.2, 32.4_

  - [ ] 17.2 Implement booking creation API route
    - Create `src/app/api/booking/create/route.ts` — POST handler
    - Check expert availability before confirming (serialize concurrent requests)
    - Create booking record (status: pending) and payment record (status: on-hold)
    - Call Stripe to create payment intent with manual capture (hold, not charge)
    - Return `{ bookingId, status, expert, appointmentTime, paymentStatus, amount }`
    - _Requirements: 33.1, 33.2, 33.3, 34.1_

  - [ ]* 17.3 Write property test for appointment slot uniqueness (Property 1 — Expert Booking)
    - **Property 1: Appointment Slot Uniqueness** — concurrent booking attempts for the same expert and time slot must result in exactly one confirmed booking
    - **Validates: Requirements 33.1, 33.2**

  - [ ] 17.4 Implement booking confirmation and cancellation API routes
    - Create `src/app/api/booking/confirm/route.ts` — POST; update booking to completed; capture Stripe payment intent; trigger review collection notification
    - Create `src/app/api/booking/cancel/route.ts` — POST; update booking to canceled; cancel Stripe payment intent (release hold)
    - Create `src/app/api/booking/[id]/route.ts` — GET booking detail
    - _Requirements: 33.4, 33.5, 34.2, 34.3, 34.4, 34.5, 35.4, 35.5_

  - [ ]* 17.5 Write property test for payment hold correctness (Property 2 — Expert Booking)
    - **Property 2: Payment Hold Correctness** — payment must be on-hold before appointment; released only after completion or cancellation; amount must match expert hourly rate
    - **Validates: Requirements 34.1, 34.2, 34.3, 34.4**

  - [ ]* 17.6 Write property test for booking state consistency (Property 3 — Expert Booking)
    - **Property 3: Booking State Consistency** — booking status must only transition pending→completed or pending→canceled; completed and canceled bookings must have payment released
    - **Validates: Requirements 33.3, 33.4, 34.2, 34.3**

  - [ ] 17.7 Implement BUmind payment hold manager
    - Create `bumind/lib/payment/hold-manager.ts`
    - `holdPayment(bookingId, amount, customerId)` — create Stripe payment intent, store in payments table
    - `releasePayment(bookingId, capture: boolean)` — capture (on completion) or cancel (on cancellation) payment intent
    - _Requirements: 34.1, 34.2, 34.3_


- [ ] 18. BUmind Expert Booking Platform — UI
  - [ ] 18.1 Implement ExpertCard and expert directory page
    - Create `src/components/expert/ExpertCard.tsx` — 280px card, 80px circular avatar, name, specialization, gold star rating, bio truncated, hourly rate, availability status, View Profile + Book buttons
    - Create `bumind/app/page.tsx` — expert directory with specialization filter, search, sort (rating/rate/availability)
    - Show "Upgrade to Pro" prompt instead of Book button for Signal-tier users
    - _Requirements: 31.1, 31.2, 31.3, 31.4, 31.5, 32.5_

  - [ ] 18.2 Implement expert profile page
    - Create `bumind/app/expert/[id]/page.tsx` — full bio, credentials, hourly rate, reviews (name, role, 1-sentence comment), availability calendar
    - _Requirements: 32.1, 32.2, 32.3, 32.4_

  - [ ] 18.3 Implement AvailabilityCalendar and BookingForm components
    - Create `src/components/expert/AvailabilityCalendar.tsx` — month view, gold available dates, gray booked, 1-hour time slot selector
    - Create `src/components/expert/BookingForm.tsx` — 3-step form (select expert → select date/time → confirm details with pricing breakdown and terms)
    - Create `bumind/app/expert/[id]/booking/page.tsx` wrapping BookingForm
    - _Requirements: 33.1, 33.2, 33.3_

  - [ ] 18.4 Implement appointment management dashboard page
    - Create `src/app/dashboard/expert-bookings/page.tsx` — list of past and upcoming bookings with expert name, specialization, time, status
    - Create `src/app/dashboard/expert-bookings/[id]/page.tsx` — booking detail with expert profile, payment status, confirm completion button, review prompt
    - _Requirements: 35.1, 35.2, 35.3, 35.4, 35.5_

  - [ ]* 18.5 Write unit tests for BookingForm multi-step flow
    - Test step navigation, validation on each step, and confirmation submission
    - _Requirements: 33.1, 33.2_


- [ ] 19. Security hardening and data isolation
  - [ ] 19.1 Implement user data isolation enforcement
    - Audit all query functions in `src/lib/db/queries/` to ensure every query filters by `user_id` from the authenticated session
    - Add integration tests verifying that user A cannot retrieve user B's signals, patterns, bookings, or notifications
    - _Requirements: (Property 1 — Data Privacy)_

  - [ ]* 19.2 Write property test for user data isolation (Property 1 — Data Privacy)
    - **Property 1: User Data Isolation** — for any two distinct users, API responses for signals, patterns, snapshots, and bookings must never contain data belonging to the other user
    - **Validates: Requirements 1.1, 4.1, 33.1**

  - [ ] 19.3 Implement authentication consistency enforcement
    - Verify `src/middleware.ts` rejects expired and malformed tokens on all API routes
    - Ensure Stripe webhook route uses signature verification (not Bearer token)
    - _Requirements: (Property 2 — Data Privacy)_


- [ ] 20. Integration wiring — connect all modules end-to-end
  - [ ] 20.1 Wire signal ingestion pipeline end-to-end
    - Confirm that POST /api/subconscious/signal → pattern extraction → composure score → snapshot generation → MRagent response → tone adaptation → notification creation all execute in sequence
    - Confirm engagement upsell evaluation is triggered after each signal
    - _Requirements: 1.1, 1.3, 1.4, 2.5, 3.4, 5.1, 15.1_

  - [ ] 20.2 Wire subscription state into feature access
    - Confirm middleware blocks expert booking for Signal-tier users and returns 403 with upgrade prompt
    - Confirm UpsellPopup is shown when Signal-tier user hits signal limit or attempts expert booking
    - _Requirements: 11.2, 11.3, 11.4, 15.2, 32.5_

  - [ ] 20.3 Wire BUmind booking flow into main platform
    - Confirm engagement upsell triggers navigate to BUmind expert directory
    - Confirm booking confirmation triggers review collection notification via MRagent notifications
    - Confirm payment hold/release integrates with Stripe payment intents
    - _Requirements: 15.2, 16.2, 34.4, 34.5_

  - [ ] 20.4 Wire offline queuing across extension and PWA
    - Confirm extension background.js and PWA service worker both use the same IndexedDB queue schema
    - Confirm queued signals sync to `/api/subconscious/signal` in order when connectivity restores
    - _Requirements: 1.5, 20.3, 22.4, 22.5_

  - [ ]* 20.5 Write integration tests for signal ingestion pipeline
    - Submit a signal via API and assert: signal stored, patterns updated, composure score updated, MRagent response generated, notification created
    - _Requirements: 1.1, 1.3, 1.4, 5.1_

- [ ] 21. Final checkpoint — full platform
  - Ensure all tests pass (unit, property, integration), all API routes are authenticated, Stripe webhook signature verification is active, and BUmind payment hold mechanics are verified. Ask the user if questions arise.


## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- The design uses TypeScript / Next.js 15 throughout — all code tasks use this stack
- Terminology constraints from design must be respected: use MRagent, Subconscious Layer, signals, patterns — never "AI", "bot", or "chatbot"
- Design language: dark premium (`--background` #09090b, `--card` #111115, `--primary` #c9a96e gold, `--foreground` #f2ede6); Fraunces serif + DM Sans; inline styles + Tailwind utilities; no CSS Modules
- Stripe webhooks are the sole source of truth for subscription state — never update subscription from client
- BUmind is a separate domain with its own database (`bumind/` folder, `bumind-connection.ts`)
- Property tests validate universal correctness properties defined in the design document
- Checkpoints ensure incremental validation before proceeding to the next module

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["1.3", "1.4", "1.5"] },
    { "id": 2, "tasks": ["2.1", "2.2", "7.1"] },
    { "id": 3, "tasks": ["2.3", "3.1", "3.2", "10.2"] },
    { "id": 4, "tasks": ["3.3", "3.4", "3.5", "5.1", "6.1", "10.1"] },
    { "id": 5, "tasks": ["3.6", "3.7", "5.2", "5.3", "5.4", "6.2", "6.3", "7.2", "7.3"] },
    { "id": 6, "tasks": ["5.5", "6.4", "7.4", "7.5", "7.6", "9.4"] },
    { "id": 7, "tasks": ["6.5", "7.7", "7.8", "9.1", "9.2", "9.3", "11.1"] },
    { "id": 8, "tasks": ["9.5", "11.2", "11.3", "11.4"] },
    { "id": 9, "tasks": ["12.1", "12.2", "12.3"] },
    { "id": 10, "tasks": ["13.1", "13.2", "13.3", "13.4", "13.5"] },
    { "id": 11, "tasks": ["15.1", "16.1", "17.1"] },
    { "id": 12, "tasks": ["15.2", "15.3", "16.2", "17.2", "17.7"] },
    { "id": 13, "tasks": ["15.4", "16.3", "16.4", "17.3", "17.4"] },
    { "id": 14, "tasks": ["15.5", "15.6", "16.5", "17.5", "17.6", "18.1"] },
    { "id": 15, "tasks": ["18.2", "18.3", "18.5"] },
    { "id": 16, "tasks": ["18.4", "19.1", "19.3"] },
    { "id": 17, "tasks": ["19.2"] },
    { "id": 18, "tasks": ["20.1", "20.2", "20.3", "20.4"] },
    { "id": 19, "tasks": ["20.5"] }
  ]
}
```
