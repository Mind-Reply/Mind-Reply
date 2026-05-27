import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  real,
  pgEnum,
} from 'drizzle-orm/pg-core';

// ─── Enums ────────────────────────────────────────────────────────────────────

export const planEnum = pgEnum('plan', ['free', 'personal', 'business', 'creator']);
export const toneEnum = pgEnum('tone', ['neutral', 'warm', 'assertive', 'direct']);
export const sessionTypeEnum = pgEnum('session_type', ['audio', 'video', 'chat']);
export const bookingStatusEnum = pgEnum('booking_status', [
  'pending', 'confirmed', 'completed', 'cancelled', 'released',
]);
export const signalTypeEnum = pgEnum('signal_type', [
  'avoidance', 'tension', 'overload', 'delay', 'clarity', 'urgency',
]);
export const notificationTypeEnum = pgEnum('notification_type', [
  'suggestion', 'tone_upgrade', 'follow_up', 'inactivity', 'signal', 'system',
]);

// ─── Users ────────────────────────────────────────────────────────────────────

export const users = pgTable('users', {
  id: text('id').primaryKey(),                     // Clerk userId
  email: text('email').notNull(),
  name: text('name'),
  plan: planEnum('plan').notNull().default('free'),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  subscriptionStatus: text('subscription_status').default('inactive'),
  subscriptionCurrentPeriodEnd: timestamp('subscription_current_period_end'),
  operationsUsed: integer('operations_used').notNull().default(0),
  operationsLimit: integer('operations_limit').notNull().default(10),
  trialMessagesUsed: integer('trial_messages_used').notNull().default(0),
  trialStartedAt: timestamp('trial_started_at'),
  locale: text('locale').default('en'),            // 'en' | 'ru' | 'de'
  region: text('region').default('EU'),            // 'US' | 'EU' | 'RU'
  referralCode: text('referral_code'),
  referredBy: text('referred_by'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── Sessions (conversation sessions) ────────────────────────────────────────

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title'),
  tone: toneEnum('tone').default('neutral'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  lastMessageAt: timestamp('last_message_at').notNull().defaultNow(),
});

// ─── Messages ─────────────────────────────────────────────────────────────────

export const messages = pgTable('messages', {
  id: text('id').primaryKey(),
  sessionId: text('session_id').notNull().references(() => sessions.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: text('role').notNull(),                    // 'user' | 'assistant'
  content: text('content').notNull(),
  confidenceScore: integer('confidence_score'),    // 0–100
  toneEffect: text('tone_effect'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ─── Subconscious Layer ───────────────────────────────────────────────────────

export const signals = pgTable('signals', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  messageId: text('message_id').references(() => messages.id, { onDelete: 'set null' }),
  type: signalTypeEnum('type').notNull(),
  description: text('description').notNull(),
  intensity: real('intensity').notNull().default(0.5),  // 0.0–1.0
  acknowledged: boolean('acknowledged').notNull().default(false),
  acknowledgedAt: timestamp('acknowledged_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const patternSnapshots = pgTable('pattern_snapshots', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  windowDays: integer('window_days').notNull(),    // 7 | 30
  avoidanceScore: real('avoidance_score').default(0),
  tensionScore: real('tension_score').default(0),
  overloadScore: real('overload_score').default(0),
  delayScore: real('delay_score').default(0),
  dominantSignal: signalTypeEnum('dominant_signal'),
  messageCount: integer('message_count').notNull().default(0),
  meta: jsonb('meta'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ─── Subscriptions (webhook truth record) ────────────────────────────────────

export const subscriptions = pgTable('subscriptions', {
  id: text('id').primaryKey(),                     // Stripe subscription ID
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  stripeCustomerId: text('stripe_customer_id').notNull(),
  plan: planEnum('plan').notNull(),
  status: text('status').notNull(),                // Stripe status string
  currentPeriodStart: timestamp('current_period_start').notNull(),
  currentPeriodEnd: timestamp('current_period_end').notNull(),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').notNull().default(false),
  cancelledAt: timestamp('cancelled_at'),
  meta: jsonb('meta'),                             // full Stripe event payload
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── Notifications ────────────────────────────────────────────────────────────

export const notifications = pgTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: notificationTypeEnum('type').notNull(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  read: boolean('read').notNull().default(false),
  actionUrl: text('action_url'),
  meta: jsonb('meta'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ─── Reviews ─────────────────────────────────────────────────────────────────

export const reviews = pgTable('reviews', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  rating: integer('rating').notNull(),             // 1–5
  body: text('body'),
  approved: boolean('approved').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ─── Expert Profiles (StayHealthy / BuMind) ──────────────────────────────────

export const expertProfiles = pgTable('expert_profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  name: text('name').notNull(),
  specialization: text('specialization').notNull(),
  bio: text('bio'),
  pricePerHour: integer('price_per_hour').notNull(),   // in EUR cents
  sessionTypes: text('session_types').array().notNull().default(['chat']),
  available: boolean('available').notNull().default(true),
  rating: real('rating').default(0),
  reviewCount: integer('review_count').default(0),
  stripeAccountId: text('stripe_account_id'),
  meta: jsonb('meta'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ─── Bookings ─────────────────────────────────────────────────────────────────

export const bookings = pgTable('bookings', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expertId: text('expert_id').notNull().references(() => expertProfiles.id),
  sessionType: sessionTypeEnum('session_type').notNull(),
  status: bookingStatusEnum('status').notNull().default('pending'),
  scheduledAt: timestamp('scheduled_at').notNull(),
  durationMinutes: integer('duration_minutes').notNull().default(60),
  description: text('description'),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  amountCents: integer('amount_cents').notNull(),
  capturedAt: timestamp('captured_at'),
  cancelledAt: timestamp('cancelled_at'),
  expertConfirmedAt: timestamp('expert_confirmed_at'),
  reminderSentAt: timestamp('reminder_sent_at'),
  meta: jsonb('meta'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── Knowledge Base (MRagent context injection) ───────────────────────────────

export const knowledge = pgTable('knowledge', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  tags: text('tags'),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ─── Logs (operational audit trail) ──────────────────────────────────────────

export const logs = pgTable('logs', {
  id: text('id').primaryKey(),
  userId: text('user_id'),
  type: text('type').notNull(),
  meta: jsonb('meta'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ─── Addons ───────────────────────────────────────────────────────────────────

export const addons = pgTable('addons', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  active: boolean('active').notNull().default(true),
  stripeItemId: text('stripe_item_id'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ─── Type Exports ─────────────────────────────────────────────────────────────

export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Signal = typeof signals.$inferSelect;
export type PatternSnapshot = typeof patternSnapshots.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type ExpertProfile = typeof expertProfiles.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Knowledge = typeof knowledge.$inferSelect;
export type Log = typeof logs.$inferSelect;
export type Addon = typeof addons.$inferSelect;
