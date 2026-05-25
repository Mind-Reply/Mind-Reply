import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db, gmailTokens } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { getGmailMessages } from '@/lib/gmail';
import { log } from '@/lib/log';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [token] = await db.select().from(gmailTokens).where(eq(gmailTokens.userId, userId)).limit(1);
  if (!token) return NextResponse.json({ error: 'Gmail not connected', connected: false }, { status: 200 });

  try {
    const emails = await getGmailMessages(token.accessToken, token.refreshToken);
    await log('gmail_sync', { count: emails.length, gmailEmail: token.email }, userId);
    return NextResponse.json({ emails, connected: true, gmailEmail: token.email });
  } catch (err: any) {
    // Token expired or revoked
    if (err?.code === 401 || err?.status === 401) {
      await db.delete(gmailTokens).where(eq(gmailTokens.userId, userId));
      return NextResponse.json({ error: 'Gmail token expired. Please reconnect.', connected: false }, { status: 200 });
    }
    return NextResponse.json({ error: 'Failed to fetch emails' }, { status: 500 });
  }
}
