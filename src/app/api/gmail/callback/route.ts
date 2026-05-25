import { NextRequest, NextResponse } from 'next/server';
import { getOAuthClient } from '@/lib/gmail';
import { db, gmailTokens } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { google } from 'googleapis';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const userId = searchParams.get('state');

  if (!code || !userId) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/settings?gmail_error=true`);
  }

  try {
    const client = getOAuthClient();
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    // Get Gmail address
    const oauth2 = google.oauth2({ version: 'v2', auth: client });
    const { data } = await oauth2.userinfo.get();

    await db.insert(gmailTokens).values({
      id: randomUUID(),
      userId,
      accessToken: tokens.access_token!,
      refreshToken: tokens.refresh_token || null,
      expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
      email: data.email || null,
    }).onConflictDoUpdate({
      target: gmailTokens.userId,
      set: {
        accessToken: tokens.access_token!,
        refreshToken: tokens.refresh_token || null,
        expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
        email: data.email || null,
        updatedAt: new Date(),
      },
    });

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/inbox?gmail_connected=true`);
  } catch (err) {
    console.error('Gmail OAuth error:', err);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/settings?gmail_error=true`);
  }
}
