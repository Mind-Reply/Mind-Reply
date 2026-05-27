import { google } from 'googleapis';

export function getOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/gmail/callback`
  );
}

export function getAuthUrl(state: string) {
  const client = getOAuthClient();
  return client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
    state,
  });
}

export async function getGmailMessages(accessToken: string, refreshToken: string | null, maxResults = 50) {
  const client = getOAuthClient();
  client.setCredentials({ access_token: accessToken, refresh_token: refreshToken });

  const gmail = google.gmail({ version: 'v1', auth: client });

  const list = await gmail.users.messages.list({
    userId: 'me',
    maxResults,
    labelIds: ['INBOX'],
  });

  const messageIds = list.data.messages || [];

  const emails = await Promise.all(
    messageIds.slice(0, 20).map(async ({ id }) => {
      const msg = await gmail.users.messages.get({ userId: 'me', id: id!, format: 'metadata', metadataHeaders: ['Subject', 'From', 'Date'] });
      const headers = msg.data.payload?.headers || [];
      const get = (name: string) => headers.find(h => h.name === name)?.value || '';
      return {
        id: id!,
        subject: get('Subject') || '(no subject)',
        from: get('From'),
        date: get('Date'),
        snippet: msg.data.snippet || '',
        labelIds: msg.data.labelIds || [],
        isUnread: (msg.data.labelIds || []).includes('UNREAD'),
      };
    })
  );

  return emails;
}
