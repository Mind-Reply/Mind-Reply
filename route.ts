import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Anthropic from '@anthropic-ai/sdk';
import { db } from '@/lib/db';
import { users, sessions, messages, signals, logs } from '@/lib/db/schema';
import { eq, and, gte, count } from 'drizzle-orm';
import { subconsciousService } from '@/services/subconscious.service';
import { detectRegion, buildSystemPrompt } from '@/services/language.service';
import { createId } from '@/lib/utils';

export const dynamic = 'force-dynamic';

// ─── Trial Gate Configuration ─────────────────────────────────────────────────

const TRIAL_MESSAGE_LIMIT = 3;
const FREE_PLAN_LIMIT = 10;

// ─── Language Map ─────────────────────────────────────────────────────────────

const PLAN_LIMITS: Record<string, number> = {
  free: FREE_PLAN_LIMIT,
  personal: 999999,
  business: 999999,
  creator: 999999,
};

// ─── POST /api/chat ───────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    // ── Auth check ──────────────────────────────────────────────────────────
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required.' },
        { status: 401 }
      );
    }

    // ── Parse body ──────────────────────────────────────────────────────────
    const body = await req.json();
    const { message, sessionId, tone = 'neutral' } = body as {
      message: string;
      sessionId?: string;
      tone?: 'neutral' | 'warm' | 'assertive' | 'direct';
    };

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    if (message.length > 4000) {
      return NextResponse.json({ error: 'Message exceeds maximum length.' }, { status: 400 });
    }

    // ── Fetch user ───────────────────────────────────────────────────────────
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);

    if (!user) {
      return NextResponse.json({ error: 'User record not found.' }, { status: 404 });
    }

    // ── Trial gate (free plan users) ─────────────────────────────────────────
    if (user.plan === 'free' && user.trialMessagesUsed >= TRIAL_MESSAGE_LIMIT) {
      return NextResponse.json(
        {
          error: 'trial_exhausted',
          message: 'Your trial has concluded. Activate a plan to continue.',
          trialLimit: TRIAL_MESSAGE_LIMIT,
          upgradeUrl: '/pricing',
        },
        { status: 402 }
      );
    }

    // ── Operations limit ─────────────────────────────────────────────────────
    const planLimit = PLAN_LIMITS[user.plan] ?? FREE_PLAN_LIMIT;
    if (user.operationsUsed >= planLimit) {
      return NextResponse.json(
        {
          error: 'operations_exhausted',
          message: 'Monthly operations limit reached.',
          upgradeUrl: '/pricing',
        },
        { status: 402 }
      );
    }

    // ── Resolve or create session ─────────────────────────────────────────────
    let activeSessionId = sessionId;
    if (!activeSessionId) {
      activeSessionId = createId();
      await db.insert(sessions).values({
        id: activeSessionId,
        userId,
        tone,
      });
    }

    // ── Detect region and build system prompt ────────────────────────────────
    const region = user.region ?? detectRegion(req);
    const systemPrompt = buildSystemPrompt(region, tone);

    // ── Fetch recent session history (last 10 messages for context) ──────────
    const history = await db
      .select()
      .from(messages)
      .where(eq(messages.sessionId, activeSessionId))
      .orderBy(messages.createdAt)
      .limit(10);

    const conversationHistory = history.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    // ── Run Subconscious Layer in parallel with main reply ───────────────────
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const [mainReply, subconsciousAnalysis] = await Promise.all([
      anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          ...conversationHistory,
          { role: 'user', content: message },
        ],
      }),
      subconsciousService.analyze(message),
    ]);

    const replyContent =
      mainReply.content[0].type === 'text' ? mainReply.content[0].text : '';

    // ── Persist user message ─────────────────────────────────────────────────
    const userMessageId = createId();
    await db.insert(messages).values({
      id: userMessageId,
      sessionId: activeSessionId,
      userId,
      role: 'user',
      content: message,
      confidenceScore: subconsciousAnalysis.confidenceScore,
      toneEffect: subconsciousAnalysis.toneEffect,
    });

    // ── Persist assistant reply ───────────────────────────────────────────────
    const assistantMessageId = createId();
    await db.insert(messages).values({
      id: assistantMessageId,
      sessionId: activeSessionId,
      userId,
      role: 'assistant',
      content: replyContent,
    });

    // ── Persist signals (non-blocking) ────────────────────────────────────────
    if (subconsciousAnalysis.signals.length > 0) {
      await db.insert(signals).values(
        subconsciousAnalysis.signals.map((s) => ({
          id: createId(),
          userId,
          messageId: userMessageId,
          type: s.type,
          description: s.description,
          intensity: s.intensity,
        }))
      ).catch((err) => {
        console.error('[Chat] signal persistence failed silently:', err);
      });
    }

    // ── Update user counters ──────────────────────────────────────────────────
    await db
      .update(users)
      .set({
        operationsUsed: user.operationsUsed + 1,
        trialMessagesUsed:
          user.plan === 'free'
            ? user.trialMessagesUsed + 1
            : user.trialMessagesUsed,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    // ── Log (async, non-blocking) ─────────────────────────────────────────────
    db.insert(logs).values({
      id: createId(),
      userId,
      type: 'chat',
      meta: {
        sessionId: activeSessionId,
        tone,
        region,
        confidenceScore: subconsciousAnalysis.confidenceScore,
        signalCount: subconsciousAnalysis.signals.length,
      },
    }).catch(() => {});

    // ── Return response — exact contract per brief ────────────────────────────
    return NextResponse.json({
      reply: replyContent,
      confidenceScore: subconsciousAnalysis.confidenceScore,
      toneEffect: subconsciousAnalysis.toneEffect,
      signals: subconsciousAnalysis.signals,
      sessionId: activeSessionId,
      messageId: userMessageId,
      operationsRemaining: planLimit - (user.operationsUsed + 1),
      trialMessagesRemaining:
        user.plan === 'free'
          ? Math.max(0, TRIAL_MESSAGE_LIMIT - (user.trialMessagesUsed + 1))
          : null,
    });
  } catch (err) {
    console.error('[Chat API] fatal error:', err);
    return NextResponse.json(
      { error: 'An operational error occurred. Please retry.' },
      { status: 500 }
    );
  }
}
