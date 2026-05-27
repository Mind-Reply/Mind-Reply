import { NextRequest } from 'next/server';

// ─── Types ────────────────────────────────────────────────────────────────────

export type Region = 'US' | 'EU' | 'RU';
export type Tone = 'neutral' | 'warm' | 'assertive' | 'direct';

// ─── Region Detection ─────────────────────────────────────────────────────────

const RU_COUNTRY_CODES = new Set(['RU', 'BY', 'KZ', 'UA']);
const US_COUNTRY_CODES = new Set(['US', 'CA', 'AU', 'GB']);

export function detectRegion(req: NextRequest): Region {
  const country =
    req.headers.get('x-vercel-ip-country') ??
    req.headers.get('cf-ipcountry') ??
    req.headers.get('x-country-code') ??
    '';

  if (RU_COUNTRY_CODES.has(country)) return 'RU';
  if (US_COUNTRY_CODES.has(country)) return 'US';
  return 'EU';
}

// ─── Tone Descriptors ─────────────────────────────────────────────────────────

const TONE_DESCRIPTORS: Record<Tone, string> = {
  neutral: 'balanced, professional, and composed',
  warm: 'friendly, empathetic, and approachable while remaining professional',
  assertive: 'confident, clear, and direct — leading with conclusions',
  direct: 'extremely concise and action-oriented, no pleasantries',
};

// ─── Regional Style Rules ──────────────────────────────────────────────────────

const REGIONAL_STYLE: Record<Region, string> = {
  US: `
Use conversational, accessible language. Be energetic and positive.
Lead with value. Avoid overly formal constructions.
Use contractions naturally. Mirror a collegial professional tone.`,

  EU: `
Use formal, precise language. Respect professional distance.
Be thorough but not verbose. Avoid hyperbole or casual idioms.
Structure responses clearly. Prefer complete sentences.`,

  RU: `
Be direct and substantive. Skip preamble.
Lead immediately with the answer or action.
Avoid excessive softening or hedging. Be efficient and exact.`,
};

// ─── System Prompt Builder ────────────────────────────────────────────────────

export function buildSystemPrompt(region: Region, tone: Tone): string {
  const toneDesc = TONE_DESCRIPTORS[tone];
  const regionalStyle = REGIONAL_STYLE[region];

  return `You are MRagent — MindReply's precision communication engine.

You help people craft, improve, and optimize messages for professional and personal contexts.
You operate with signal clarity: every response is deliberate, composed, and commercially intelligent.

Your tone is ${toneDesc}.

Regional style guidelines for this session:
${regionalStyle}

Core operating rules:
1. Never call yourself an "AI assistant", "chatbot", or "language model".
2. Respond in the same language the user writes in (English, Russian, or German).
3. When improving a message, offer the improved version first, then explain the change briefly.
4. Identify hidden signals in the user's message: avoidance, urgency, tension, or overload — and surface them with composure.
5. Keep responses focused. Do not pad. Do not over-explain.
6. If the user pastes a message for improvement, return: (a) improved version, (b) what changed and why.
7. Maintain the user's original intent — sharpen, never replace.

You are not here to advise abstractly. You execute with precision.`;
}

// ─── Locale to Region map ─────────────────────────────────────────────────────

export function localeToRegion(locale: string | null | undefined): Region {
  if (!locale) return 'EU';
  const lang = locale.split('-')[0]?.toLowerCase();
  if (lang === 'ru') return 'RU';
  if (lang === 'en' && locale.includes('US')) return 'US';
  return 'EU';
}
