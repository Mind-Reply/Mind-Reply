# Requirements Document: MindReply Platform Expansion

## Introduction

MindReply Platform Expansion establishes a complete reorganization of the operational composure system into eight integrated modules. The Subconscious Layer Engine serves as the primary module, processing signals and extracting patterns that inform all downstream systems. The MRagent Communication Engine generates contextual responses, while the Multi-Language Layer ensures region-appropriate tone and localization. Stripe Monetization manages subscription tiers (Signal free, Growth $29/mo, Pro $99/mo), with webhooks serving as the source of truth for subscription state. Engagement & Retention drives user value through targeted upsells and reviews. Three client interfaces (Browser Extension, PWA Mobile, Web Dashboard) provide signal capture and access. BUmind Expert Booking connects users with specialized professionals (psychologists, neurologists, HR advisors, accountants, lawyers) through 1-hour appointment slots with payment-on-hold mechanics.

## Glossary

- **Subconscious Layer**: Core signal processing and pattern recognition engine; the primary module upon which all other systems depend
- **Signal**: Raw input data (email, message, context, manual entry) captured from user interactions
- **Pattern**: Extracted behavioral or communication pattern identified from signal analysis
- **Snapshot**: Point-in-time composure state including score, stress indicators, and decision patterns
- **MRagent**: Conversational interface providing operational composure guidance and suggestions
- **MRteam**: User's team or organizational context for multi-user deployments
- **Composure Score**: Numerical metric (0-1) representing user's operational composure state
- **Tone Rules**: Region-specific communication style guidelines (EU=formal, US=friendly, RU=direct)
- **Subscription Tier**: Service level (Signal free, Growth, Pro) determining feature access
- **BUmind**: Expert booking platform for specialized professional consultations
- **Expert**: Qualified professional (psychologist, neurologist, HR advisor, accountant, lawyer)
- **Booking**: Appointment reservation with expert for 1-hour consultation
- **Payment Hold**: Stripe payment authorization held until appointment completion confirmation

## Requirements

### Requirement 1: Subconscious Layer Signal Ingestion

**User Story:** As a user, I want the system to capture and process signals from my work context, so that I can understand my operational patterns and receive relevant guidance.

#### Acceptance Criteria

1. WHEN a signal is submitted from any client interface (browser extension, PWA, web dashboard), THE Subconscious Layer SHALL ingest it via POST /api/subconscious/signal endpoint
2. WHEN a signal is ingested, THE Subconscious Layer SHALL store it with metadata (source, timestamp, sender, subject, context)
3. WHEN a signal is stored, THE Subconscious Layer SHALL extract patterns and calculate a composure score
4. WHEN a signal is processed, THE Subconscious Layer SHALL return the signal ID, ingestion status, extracted patterns, and composure score
5. WHEN signals are submitted offline, THE client interface SHALL queue them locally and sync when connectivity is restored

### Requirement 2: Subconscious Layer Pattern Extraction

**User Story:** As a user, I want the system to identify recurring patterns in my behavior and communication, so that I can recognize and address operational challenges.

#### Acceptance Criteria

1. WHEN signals are analyzed, THE Subconscious Layer SHALL extract behavioral patterns (decision-avoidance, context-switching, risk-aversion, etc.)
2. WHEN patterns are extracted, THE Subconscious Layer SHALL calculate frequency and confidence scores for each pattern
3. WHEN a user requests patterns via GET /api/subconscious/patterns, THE Subconscious Layer SHALL return paginated patterns with frequency, last occurrence, and confidence
4. WHEN patterns are retrieved, THE system SHALL support filtering by time range (7d, 30d, 90d, all-time)
5. WHEN a pattern confidence exceeds 0.85, THE Subconscious Layer SHALL trigger engagement notifications

### Requirement 3: Subconscious Layer Composure Snapshots

**User Story:** As a user, I want point-in-time snapshots of my operational state, so that I can track composure trends and identify stress periods.

#### Acceptance Criteria

1. WHEN signals are processed, THE Subconscious Layer SHALL generate composure snapshots containing score, stress indicators, and decision patterns
2. WHEN a user requests snapshots via GET /api/subconscious/snapshots, THE Subconscious Layer SHALL return paginated snapshots with timestamp and recommendations
3. WHEN a snapshot is generated, THE Subconscious Layer SHALL include actionable recommendations (take-break, prioritize-top-3, delegate, etc.)
4. WHEN composure score drops below 0.5, THE system SHALL trigger a retention notification
5. WHEN a user views a snapshot, THE system SHALL display stress indicators and decision patterns in a human-readable format

### Requirement 4: Subconscious Layer Signal History

**User Story:** As a user, I want to review my signal history, so that I can understand the context of my patterns and track progress over time.

#### Acceptance Criteria

1. WHEN a user requests signal history via GET /api/subconscious/history, THE Subconscious Layer SHALL return paginated signals with content, timestamp, and associated patterns
2. WHEN signals are retrieved, THE system SHALL support filtering by signal type (email, message, context, manual, all)
3. WHEN signals are retrieved, THE system SHALL support pagination with limit and offset parameters
4. WHEN a user views signal history, THE system SHALL display composure score for each signal
5. WHEN a user selects a signal, THE system SHALL display full context including sender, subject, and extracted patterns


### Requirement 5: MRagent Response Generation

**User Story:** As a user, I want the MRagent to generate contextual responses to my signals, so that I receive actionable guidance for improving operational composure.

#### Acceptance Criteria

1. WHEN a signal is processed, THE MRagent Communication Engine SHALL generate a response via LLM (Anthropic Claude)
2. WHEN a response is generated, THE MRagent SHALL include confidence score, suggested actions, and tone classification
3. WHEN a user sends a message via POST /api/mragent/chat, THE MRagent SHALL return a response with message ID and suggested actions
4. WHEN a response is generated, THE MRagent SHALL pass it to the Multi-Language Layer for tone adaptation
5. WHEN a response is displayed, THE system SHALL show confidence score and allow user feedback (helpful/not helpful)

### Requirement 6: MRagent Notification Delivery

**User Story:** As a user, I want to receive timely notifications about patterns, upsells, and bookings, so that I stay informed and engaged with the platform.

#### Acceptance Criteria

1. WHEN a pattern is detected with high confidence, THE MRagent SHALL create a notification of type "pattern-detected"
2. WHEN a user is eligible for upgrade, THE MRagent SHALL create a notification of type "upsell"
3. WHEN an expert becomes available, THE MRagent SHALL create a notification of type "expert-available"
4. WHEN a booking reminder is due, THE MRagent SHALL create a notification of type "booking-reminder"
5. WHEN a user requests notifications via GET /api/mragent/notifications, THE system SHALL return paginated notifications with read status and action URLs
6. WHEN a notification is created, THE system SHALL deliver it via in-app bell icon, email, and push notification (if enabled)

### Requirement 7: MRagent Message History

**User Story:** As a user, I want to review my conversation history with MRagent, so that I can reference previous guidance and track my progress.

#### Acceptance Criteria

1. WHEN a user sends a message to MRagent, THE system SHALL store the message and response with conversation ID
2. WHEN a user requests message history, THE system SHALL return paginated messages with timestamps and confidence scores
3. WHEN a user views a conversation, THE system SHALL display the full exchange with MRagent responses and user feedback
4. WHEN a user marks a message as helpful, THE system SHALL record the feedback for model improvement
5. WHEN a conversation is archived, THE system SHALL preserve it for historical reference

### Requirement 8: Multi-Language Layer Region Detection

**User Story:** As a user in different regions, I want the system to detect my location and apply appropriate communication tone, so that I receive culturally relevant guidance.

#### Acceptance Criteria

1. WHEN a user signs up, THE Multi-Language Layer SHALL detect region via IP address or manual selection
2. WHEN a user submits POST /api/language/detect, THE system SHALL return detected region (EU, US, RU, other) with confidence score
3. WHEN region is detected, THE system SHALL store it in user preferences and apply corresponding tone rules
4. WHEN a user changes region, THE system SHALL update tone rules immediately
5. WHEN region cannot be detected, THE system SHALL default to balanced, professional tone

### Requirement 9: Multi-Language Layer Tone Rules

**User Story:** As a user, I want responses adapted to my regional communication style, so that guidance feels natural and appropriate for my context.

#### Acceptance Criteria

1. WHEN a response is generated for EU users, THE Multi-Language Layer SHALL apply formal, structured, compliance-aware tone
2. WHEN a response is generated for US users, THE Multi-Language Layer SHALL apply friendly, conversational, action-oriented tone
3. WHEN a response is generated for RU users, THE Multi-Language Layer SHALL apply direct, pragmatic, efficiency-focused tone
4. WHEN a user requests tone rules via GET /api/language/tone, THE system SHALL return region-specific rules with formality, directness, and privacy focus
5. WHEN a user overrides tone preference, THE system SHALL apply custom tone rules to all subsequent responses

### Requirement 10: Multi-Language Layer Localization

**User Story:** As a non-English user, I want the system to communicate in my language, so that I can fully understand and benefit from the platform.

#### Acceptance Criteria

1. WHEN a user sets language preference, THE Multi-Language Layer SHALL translate all responses to that language
2. WHEN a response is generated, THE system SHALL maintain tone consistency across language translations
3. WHEN a user requests content in a new language, THE system SHALL translate it without losing meaning or context
4. WHEN a user changes language, THE system SHALL apply the new language to all subsequent communications
5. WHEN a language is not supported, THE system SHALL default to English and notify the user


### Requirement 11: Stripe Subscription Tier Management

**User Story:** As a business, I want to offer tiered subscriptions with clear feature differentiation, so that I can monetize the platform and serve users at different commitment levels.

#### Acceptance Criteria

1. THE system SHALL offer three subscription tiers: Signal (free), Growth ($29/month), and Pro ($99/month)
2. WHEN a user is on Signal tier, THE system SHALL provide basic signal capture, limited patterns, and community features
3. WHEN a user is on Growth tier, THE system SHALL provide enhanced pattern analysis, MRagent responses, and priority support
4. WHEN a user is on Pro tier, THE system SHALL provide full Subconscious Layer access, expert booking integration, and advanced analytics
5. WHEN a user upgrades tier, THE system SHALL immediately activate new features and update subscription status
6. WHEN a user downgrades tier, THE system SHALL preserve data and disable tier-specific features at period end

### Requirement 12: Stripe Checkout Flow

**User Story:** As a user, I want a seamless checkout experience, so that I can quickly upgrade to a paid tier.

#### Acceptance Criteria

1. WHEN a user initiates checkout via POST /api/subscription/checkout, THE system SHALL create a Stripe checkout session
2. WHEN a checkout session is created, THE system SHALL return session ID and checkout URL
3. WHEN a user completes checkout, THE system SHALL redirect to success page with subscription confirmation
4. WHEN a user cancels checkout, THE system SHALL return to the platform without creating a subscription
5. WHEN a checkout fails, THE system SHALL display error message and allow retry

### Requirement 13: Stripe Webhook Processing

**User Story:** As a system, I want to maintain accurate subscription state from Stripe webhooks, so that subscription status is always the source of truth.

#### Acceptance Criteria

1. WHEN Stripe emits customer.subscription.created event, THE system SHALL create subscription record in database
2. WHEN Stripe emits customer.subscription.updated event, THE system SHALL update subscription status and tier
3. WHEN Stripe emits customer.subscription.deleted event, THE system SHALL mark subscription as canceled
4. WHEN Stripe emits invoice.payment_succeeded event, THE system SHALL record successful payment
5. WHEN Stripe emits invoice.payment_failed event, THE system SHALL mark subscription as past_due and trigger retry
6. WHEN a webhook is received, THE system SHALL verify Stripe signature before processing
7. WHEN a webhook is processed, THE system SHALL return 200 OK to Stripe immediately

### Requirement 14: Subscription Status Retrieval

**User Story:** As a user, I want to check my subscription status anytime, so that I know what features are available to me.

#### Acceptance Criteria

1. WHEN a user requests subscription status via GET /api/subscription/status, THE system SHALL return current tier, status, and billing period
2. WHEN subscription status is retrieved, THE system SHALL include list of available features for current tier
3. WHEN a subscription is active, THE system SHALL display current period start and end dates
4. WHEN a subscription is canceled, THE system SHALL display cancelAtPeriodEnd flag and final billing date
5. WHEN a subscription is past_due, THE system SHALL display past due amount and retry date

### Requirement 15: Engagement & Retention Upsell Triggers

**User Story:** As a business, I want to intelligently trigger upsells based on user behavior, so that I can increase conversion and revenue.

#### Acceptance Criteria

1. WHEN a user on Signal tier submits 10+ signals, THE system SHALL trigger upsell to Growth tier
2. WHEN a user on Growth tier requests expert booking, THE system SHALL trigger upsell to Pro tier
3. WHEN a user's composure score drops below 0.4, THE system SHALL trigger retention upsell with discount
4. WHEN a user completes 30 days on current tier, THE system SHALL trigger feature highlight upsell
5. WHEN a user requests upsell opportunities via GET /api/engagement/upsell, THE system SHALL return personalized opportunities with CTA

### Requirement 16: Engagement & Retention Review Collection

**User Story:** As a business, I want to collect user feedback on MRagent responses and expert consultations, so that I can improve service quality and build social proof.

#### Acceptance Criteria

1. WHEN a user receives an MRagent response, THE system SHALL display review prompt after 5 minutes
2. WHEN a user completes an expert booking, THE system SHALL trigger review collection with 1-5 star rating
3. WHEN a user submits a review via POST /api/engagement/review, THE system SHALL store rating, comment, and timestamp
4. WHEN a review is submitted, THE system SHALL display it on expert profile or response detail page
5. WHEN reviews are displayed, THE system SHALL show name, role, and 1-sentence comment only (minimal format)

### Requirement 17: Engagement & Retention Metrics Tracking

**User Story:** As a business, I want to track user engagement metrics, so that I can measure platform health and identify retention risks.

#### Acceptance Criteria

1. WHEN a user starts a session, THE system SHALL record session-start event via POST /api/engagement/metrics
2. WHEN a user uses a feature, THE system SHALL record feature-used event with feature name
3. WHEN a user submits a signal, THE system SHALL record signal-submitted event
4. WHEN a user views an MRagent response, THE system SHALL record response-viewed event
5. WHEN metrics are recorded, THE system SHALL aggregate them for dashboard analytics and retention analysis


### Requirement 18: Browser Extension Floating Widget

**User Story:** As a user, I want a floating MRagent widget in my browser, so that I can access guidance without leaving my work context.

#### Acceptance Criteria

1. WHEN the browser extension is installed, THE system SHALL display a floating MRagent widget in the bottom-right corner
2. WHEN the widget is displayed, THE system SHALL show MRagent icon with pulsing indicator when new responses are available
3. WHEN a user clicks the widget, THE system SHALL open chat interface with conversation history
4. WHEN a user minimizes the widget, THE system SHALL collapse it to icon-only view
5. WHEN a user closes the widget, THE system SHALL preserve position and state for next session

### Requirement 19: Browser Extension Context Capture

**User Story:** As a user, I want the extension to capture email and message context automatically, so that I can submit signals without manual copying.

#### Acceptance Criteria

1. WHEN a user selects text in email or message, THE extension SHALL capture selected text, sender, subject, and timestamp
2. WHEN a user right-clicks selected text, THE extension SHALL display "Send to MRagent" context menu option
3. WHEN a user clicks "Send to MRagent", THE extension SHALL submit signal with captured context
4. WHEN a signal is submitted, THE extension SHALL display confirmation and MRagent response inline
5. WHEN a user hovers over captured context, THE extension SHALL highlight the source text

### Requirement 20: Browser Extension Offline Queuing

**User Story:** As a user, I want signals to queue locally when offline, so that I don't lose data and can sync when connectivity returns.

#### Acceptance Criteria

1. WHEN a user submits a signal while offline, THE extension SHALL store it in local queue
2. WHEN a signal is queued, THE extension SHALL display "Queued" status and retry indicator
3. WHEN connectivity is restored, THE extension SHALL automatically sync queued signals to Subconscious Layer
4. WHEN signals are synced, THE extension SHALL update status to "Synced" and display responses
5. WHEN a user views queued signals, THE extension SHALL show sync progress and estimated time

### Requirement 21: Browser Extension Settings Management

**User Story:** As a user, I want to configure extension settings, so that I can customize behavior and permissions.

#### Acceptance Criteria

1. WHEN a user clicks extension icon, THE extension SHALL display popup with settings option
2. WHEN a user opens settings, THE extension SHALL display options for notification preferences, capture behavior, and widget position
3. WHEN a user changes settings, THE extension SHALL save them to local storage and apply immediately
4. WHEN a user disables notifications, THE extension SHALL stop showing notification badges
5. WHEN a user changes widget position, THE extension SHALL move widget to new location

### Requirement 22: PWA Mobile Offline Mode

**User Story:** As a mobile user, I want the PWA to work offline, so that I can access my signals and responses without internet connection.

#### Acceptance Criteria

1. WHEN the PWA is installed, THE system SHALL register service worker for offline caching
2. WHEN a user accesses the PWA offline, THE system SHALL display cached signals, patterns, and responses
3. WHEN a user is offline, THE system SHALL disable features requiring real-time data (expert booking, upsells)
4. WHEN a user attempts to submit a signal offline, THE system SHALL queue it locally
5. WHEN connectivity is restored, THE system SHALL sync queued signals and update cached data

### Requirement 23: PWA Mobile Quick Reply

**User Story:** As a mobile user, I want quick reply functionality, so that I can respond to MRagent suggestions without typing.

#### Acceptance Criteria

1. WHEN an MRagent response is displayed, THE system SHALL show quick reply buttons (e.g., "Helpful", "Not helpful", "Tell me more")
2. WHEN a user taps a quick reply button, THE system SHALL submit the response and display next suggestion
3. WHEN quick replies are used, THE system SHALL track them as engagement metrics
4. WHEN a user wants to type a custom response, THE system SHALL display text input field
5. WHEN a custom response is submitted, THE system SHALL send it to MRagent for processing

### Requirement 24: PWA Mobile Notifications

**User Story:** As a mobile user, I want push notifications, so that I stay informed about patterns and opportunities.

#### Acceptance Criteria

1. WHEN the PWA is installed, THE system SHALL request push notification permission
2. WHEN a pattern is detected, THE system SHALL send push notification with pattern name and recommendation
3. WHEN an upsell opportunity arises, THE system SHALL send push notification with feature highlight
4. WHEN a booking reminder is due, THE system SHALL send push notification with appointment details
5. WHEN a user taps a notification, THE system SHALL navigate to relevant page (patterns, upsells, bookings)

### Requirement 25: PWA Mobile Saved Replies

**User Story:** As a mobile user, I want to save frequently used responses, so that I can quickly reference them.

#### Acceptance Criteria

1. WHEN a user views an MRagent response, THE system SHALL display "Save" button
2. WHEN a user taps "Save", THE system SHALL store response in saved replies collection
3. WHEN a user accesses saved replies, THE system SHALL display list with search and filter options
4. WHEN a user selects a saved reply, THE system SHALL display full response with context
5. WHEN a user deletes a saved reply, THE system SHALL remove it from collection


### Requirement 26: Web Dashboard Signal History

**User Story:** As a user, I want to view my complete signal history on the web, so that I can analyze patterns and track progress over time.

#### Acceptance Criteria

1. WHEN a user navigates to /dashboard/signals, THE system SHALL display paginated signal history with cards
2. WHEN signals are displayed, THE system SHALL show signal type, content preview, timestamp, and composure score
3. WHEN a user filters by signal type, THE system SHALL display only signals matching the filter
4. WHEN a user searches for signals, THE system SHALL return matching signals by content or metadata
5. WHEN a user clicks a signal, THE system SHALL display full detail page with context, patterns, and MRagent response

### Requirement 27: Web Dashboard Pattern Visualization

**User Story:** As a user, I want to visualize my patterns, so that I can understand behavioral trends and their impact on composure.

#### Acceptance Criteria

1. WHEN a user navigates to /dashboard/patterns, THE system SHALL display pattern list with frequency and confidence
2. WHEN patterns are displayed, THE system SHALL show chart visualization of pattern frequency over time
3. WHEN a user clicks a pattern, THE system SHALL display detail page with related signals and recommendations
4. WHEN a user filters by time range, THE system SHALL update pattern frequency and chart
5. WHEN a pattern confidence is high, THE system SHALL highlight it with visual indicator

### Requirement 28: Web Dashboard Composure Snapshots

**User Story:** As a user, I want to view composure snapshots, so that I can track my operational state and identify stress periods.

#### Acceptance Criteria

1. WHEN a user navigates to /dashboard/snapshots, THE system SHALL display paginated snapshots with timeline
2. WHEN snapshots are displayed, THE system SHALL show composure score, stress indicators, and decision patterns
3. WHEN a user clicks a snapshot, THE system SHALL display detail page with recommendations and related signals
4. WHEN a user views snapshot timeline, THE system SHALL display composure score trend over time
5. WHEN composure score drops significantly, THE system SHALL highlight the snapshot with warning indicator

### Requirement 29: Web Dashboard Settings

**User Story:** As a user, I want to manage my account settings, so that I can control my preferences and data.

#### Acceptance Criteria

1. WHEN a user navigates to /dashboard/settings, THE system SHALL display settings form with profile, language, and notification options
2. WHEN a user updates profile information, THE system SHALL save changes and display confirmation
3. WHEN a user changes language preference, THE system SHALL apply new language to all subsequent communications
4. WHEN a user changes notification preferences, THE system SHALL update delivery channels and frequency
5. WHEN a user requests data export, THE system SHALL generate CSV file with all signals and patterns

### Requirement 30: Web Dashboard Notification Center

**User Story:** As a user, I want a centralized notification center, so that I can review all alerts and updates.

#### Acceptance Criteria

1. WHEN a user navigates to /dashboard/notifications, THE system SHALL display paginated notifications with filters
2. WHEN notifications are displayed, THE system SHALL show type, title, message, timestamp, and read status
3. WHEN a user filters by notification type, THE system SHALL display only matching notifications
4. WHEN a user marks a notification as read, THE system SHALL update status and remove from unread count
5. WHEN a user clicks a notification, THE system SHALL navigate to relevant page (patterns, upsells, bookings)

### Requirement 31: BUmind Expert Directory

**User Story:** As a user, I want to browse available experts, so that I can find the right professional for my needs.

#### Acceptance Criteria

1. WHEN a user navigates to BUmind expert directory, THE system SHALL display expert cards with name, specialization, rating, and hourly rate
2. WHEN experts are displayed, THE system SHALL show profile photo, credentials, and review count
3. WHEN a user filters by specialization, THE system SHALL display only experts in that category (psychologist, neurologist, HR, accountant, lawyer)
4. WHEN a user searches for experts, THE system SHALL return matching experts by name or specialization
5. WHEN a user sorts experts, THE system SHALL support sorting by rating, rate, and availability

### Requirement 32: BUmind Expert Profile

**User Story:** As a user, I want to view detailed expert profiles, so that I can make informed booking decisions.

#### Acceptance Criteria

1. WHEN a user clicks an expert card, THE system SHALL display expert profile page with full bio and credentials
2. WHEN a profile is displayed, THE system SHALL show hourly rate, availability calendar, and reviews
3. WHEN a user views reviews, THE system SHALL display 1-5 star ratings with author name, role, and 1-sentence comment
4. WHEN a user views availability, THE system SHALL display available time slots for next 30 days
5. WHEN a user is on Signal tier, THE system SHALL display "Upgrade to Pro" prompt instead of booking button

### Requirement 33: BUmind Appointment Scheduling

**User Story:** As a user, I want to book 1-hour appointments with experts, so that I can receive specialized consultation.

#### Acceptance Criteria

1. WHEN a user selects an expert and time slot, THE system SHALL create booking via POST /api/booking/create
2. WHEN a booking is created, THE system SHALL display confirmation with appointment details and payment status
3. WHEN a booking is confirmed, THE system SHALL place payment on hold (not charged immediately)
4. WHEN a user cancels a booking, THE system SHALL release payment hold and mark booking as canceled
5. WHEN an appointment time approaches, THE system SHALL send reminder notification 24 hours before

### Requirement 34: BUmind Payment-on-Hold Mechanics

**User Story:** As a business, I want to hold payment until appointment completion, so that I ensure service quality and expert accountability.

#### Acceptance Criteria

1. WHEN a booking is created, THE system SHALL authorize payment via Stripe but not charge immediately
2. WHEN a booking is confirmed as completed, THE system SHALL release payment hold and charge expert's account
3. WHEN a booking is canceled, THE system SHALL release payment hold without charging
4. WHEN a user confirms appointment completion via POST /api/booking/confirm, THE system SHALL trigger payment release
5. WHEN payment is released, THE system SHALL send confirmation to both user and expert

### Requirement 35: BUmind Appointment Management

**User Story:** As a user, I want to manage my expert bookings, so that I can track appointments and reviews.

#### Acceptance Criteria

1. WHEN a user navigates to /dashboard/expert-bookings, THE system SHALL display list of past and upcoming appointments
2. WHEN bookings are displayed, THE system SHALL show expert name, specialization, appointment time, and status
3. WHEN a user clicks a booking, THE system SHALL display detail page with expert profile and payment status
4. WHEN an appointment is completed, THE system SHALL display review prompt and confirmation button
5. WHEN a user confirms completion, THE system SHALL trigger payment release and review collection


### Requirement 36: System Authentication and Authorization

**User Story:** As a system, I want to secure user data and control access to features, so that I protect privacy and enforce subscription tiers.

#### Acceptance Criteria

1. WHEN a user logs in, THE system SHALL validate credentials and issue JWT token
2. WHEN a user makes an API request, THE system SHALL verify JWT token and check authorization
3. WHEN a user accesses a feature, THE system SHALL verify subscription tier and deny access if not authorized
4. WHEN a user's session expires, THE system SHALL require re-authentication
5. WHEN a user logs out, THE system SHALL invalidate JWT token and clear local session

### Requirement 37: System Data Persistence

**User Story:** As a system, I want to reliably store all user data, so that I can provide consistent service and enable data recovery.

#### Acceptance Criteria

1. WHEN a signal is ingested, THE system SHALL persist it to PostgreSQL database with full metadata
2. WHEN a pattern is extracted, THE system SHALL persist it with frequency, confidence, and timestamp
3. WHEN a snapshot is generated, THE system SHALL persist it with composure score and recommendations
4. WHEN a subscription event occurs, THE system SHALL persist it to database as source of truth
5. WHEN a booking is created, THE system SHALL persist it to BUmind database with payment status

### Requirement 38: System Error Handling

**User Story:** As a system, I want to handle errors gracefully, so that users receive clear feedback and can recover.

#### Acceptance Criteria

1. WHEN an API request fails, THE system SHALL return appropriate HTTP status code (400, 401, 403, 500, etc.)
2. WHEN an error occurs, THE system SHALL return error message with actionable guidance
3. WHEN a signal ingestion fails, THE system SHALL queue it for retry and notify user
4. WHEN a payment fails, THE system SHALL display error message and allow retry
5. WHEN a service is unavailable, THE system SHALL display maintenance message and estimated recovery time

### Requirement 39: System Performance and Scalability

**User Story:** As a business, I want the system to handle growing user load, so that I can scale without service degradation.

#### Acceptance Criteria

1. WHEN signals are ingested, THE system SHALL process them within 200ms
2. WHEN patterns are extracted, THE system SHALL complete analysis within 500ms
3. WHEN responses are generated, THE system SHALL return them within 2 seconds
4. WHEN the system reaches capacity, THE system SHALL scale horizontally to handle additional load
5. WHEN database queries are slow, THE system SHALL implement caching and indexing to improve performance

### Requirement 40: System Monitoring and Analytics

**User Story:** As a business, I want to monitor system health and user analytics, so that I can identify issues and optimize features.

#### Acceptance Criteria

1. WHEN the system processes requests, THE system SHALL log all API calls with timestamp, user, and response time
2. WHEN errors occur, THE system SHALL log error details and stack trace for debugging
3. WHEN users engage with features, THE system SHALL track engagement metrics for analytics
4. WHEN the system detects anomalies, THE system SHALL alert operations team
5. WHEN business reviews analytics, THE system SHALL provide dashboard with key metrics (DAU, conversion, retention, revenue)

