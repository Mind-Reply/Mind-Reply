import { NextRequest, NextResponse } from 'next/server';
import { log } from '@/lib/log';

export async function POST(req: NextRequest) {
  try {
    const { name, email, message, subject } = await req.json();
    if (!email || !message) return NextResponse.json({ error: 'Email and message required' }, { status: 400 });

    await log('contact_form', { name, email, subject, message });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
