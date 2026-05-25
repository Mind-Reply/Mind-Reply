import Anthropic from '@anthropic-ai/sdk';
import { auth } from '@clerk/nextjs/server';
import { db, messages, users, knowledge } from '@/lib/db';
import { eq, sql } from 'drizzle-orm';
import { log } from '@/lib/log';
import { randomUUID } from 'crypto';

const anthropic = new Anthropic();

const BASE_SYSTEM = `You are MR Advisor — the strategic clarity engine inside MindReply.

Your character:
- Measured, composed, precise. You never overstate or use hype.
- You engage with the actual texture of a situation, not just its surface.
- You ask incisive questions that reveal what the person hasn't yet considered.
- You are not a support bot or FAQ machine. You think alongside the person.

Your purpose:
- Help users find clarity on operational decisions, delegation, workflow design, growth priorities.
- Surface what's actually creating friction or suppressing momentum in their work.
- Where appropriate, reference MindReply capabilities — only when genuinely relevant.

Your tone:
- Calm confidence. No urgency, no pressure, no hype.
- Short, considered responses. Never padded.
- Ask one focused follow-up question at the end of each response.

Vocabulary to use naturally: Signal, composure, bandwidth, calibrated, deliberate, leverage, momentum, clarity, structure.
Vocabulary to avoid: "Absolutely!", "Great question!", "Of course!", "AI", "language model", "happy to help".

Keep responses under 150 words unless complexity genuinely requires more. Never write bullet lists unless essential.`;

async function buildSystemPrompt(): Promise<string> {
  try {
    const entries = await db.select().from(knowledge);
    if (entries.length === 0) return BASE_SYSTEM;

    const context = entries.map(e =>
      `### ${e.title}${e.tags ? ` [${e.tags}]` : ''}\n${e.content}`
    ).join('\n\n');

    return `${BASE_SYSTEM}\n\n---\n## MindReply Knowledge Base\nUse this context when relevant — never force it:\n\n${context}`;
  } catch {
    return BASE_SYSTEM;
  }
}

export async function POST(request: Request) {
  try {
    const { messages: msgs, sessionId, persist } = await request.json();

    if (!Array.isArray(msgs) || msgs.length === 0) {
      return Response.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Check operation limits for authenticated users
    const { userId } = await auth();
    if (userId) {
      const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (user && user.operationsUsed >= user.operationsLimit) {
        return Response.json({
          error: 'Operation limit reached',
          message: "You've reached your monthly operation limit. Upgrade your plan or add more operations in Settings.",
          limitReached: true,
        }, { status: 429 });
      }
    }

    const systemPrompt = await buildSystemPrompt();

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 300,
      system: systemPrompt,
      messages: msgs.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    });

    const reply = response.content[0].type === 'text' ? response.content[0].text : '';

    // Persist + log for authenticated users
    if (persist && userId) {
      const lastUser = msgs[msgs.length - 1];
      const sid = sessionId || randomUUID();

      await db.insert(messages).values([
        { id: randomUUID(), userId, role: 'user', content: lastUser.content, sessionId: sid },
        { id: randomUUID(), userId, role: 'assistant', content: reply, sessionId: sid },
      ]);

      await db.update(users)
        .set({ operationsUsed: sql`${users.operationsUsed} + 1`, updatedAt: new Date() })
        .where(eq(users.id, userId));

      await log('chat', { sessionId: sid, messageLength: lastUser.content.length }, userId);
    }

    return Response.json({ reply });
  } catch (err) {
    console.error('Chat error:', err);
    return Response.json({ error: 'Service unavailable' }, { status: 503 });
  }
}
