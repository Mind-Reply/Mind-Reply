import Anthropic from '@anthropic-ai/sdk';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SignalType = 'avoidance' | 'tension' | 'overload' | 'delay' | 'clarity' | 'urgency';

export interface SubconsciousAnalysis {
  confidenceScore: number;       // 0–100
  toneEffect: string;
  signals: DetectedSignal[];
}

export interface DetectedSignal {
  type: SignalType;
  description: string;
  intensity: number;             // 0.0–1.0
}

export interface SubconsciousSummary {
  dominantSignal: SignalType | null;
  avoidanceScore: number;
  tensionScore: number;
  overloadScore: number;
  delayScore: number;
  messageCount: number;
  windowDays: 7 | 30;
  signals: DetectedSignal[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ANALYSIS_SYSTEM_PROMPT = `You are MindReply's Subconscious Layer — a precision signal detection engine.

Analyze the message provided and return ONLY a JSON object with this exact structure:
{
  "confidenceScore": <integer 0-100>,
  "toneEffect": <string: one of "neutral" | "warm" | "assertive" | "direct" | "evasive" | "overloaded" | "delayed" | "tense">,
  "signals": [
    {
      "type": <"avoidance" | "tension" | "overload" | "delay" | "clarity" | "urgency">,
      "description": <string: precise, 1 sentence, professional>,
      "intensity": <float 0.0-1.0>
    }
  ]
}

Signal detection rules:
- avoidance: hedging, excessive qualification, passive constructions, deflection
- tension: confrontational framing, elevated stakes language, conflict markers
- overload: too many topics, information density, scattered intent
- delay: procrastination signals, "I'll get to this", future-deferring language
- clarity: clean intent, precise request, focused ask (positive signal)
- urgency: time pressure, escalation, immediacy markers

confidenceScore reflects how actionable and clear the communication intent is.
Return ONLY the JSON. No preamble. No explanation.`;

// ─── Service ──────────────────────────────────────────────────────────────────

export class SubconsciousService {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  /**
   * Analyze a single message through the Subconscious Layer.
   * Never throws — on failure, returns a safe default so the main reply is never blocked.
   */
  async analyze(message: string): Promise<SubconsciousAnalysis> {
    try {
      const response = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 512,
        system: ANALYSIS_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: message }],
      });

      const raw = response.content[0];
      if (raw.type !== 'text') return this.safeDefault();

      const parsed = JSON.parse(raw.text.trim()) as SubconsciousAnalysis;

      // Validate shape
      if (
        typeof parsed.confidenceScore !== 'number' ||
        typeof parsed.toneEffect !== 'string' ||
        !Array.isArray(parsed.signals)
      ) {
        return this.safeDefault();
      }

      return {
        confidenceScore: Math.min(100, Math.max(0, Math.round(parsed.confidenceScore))),
        toneEffect: parsed.toneEffect,
        signals: parsed.signals.map((s) => ({
          type: s.type,
          description: s.description,
          intensity: Math.min(1, Math.max(0, s.intensity)),
        })),
      };
    } catch (err) {
      // Silent failure — log and return default
      console.error('[SubconsciousLayer] analysis failed silently:', err);
      return this.safeDefault();
    }
  }

  /**
   * Compute pattern summary across recent messages.
   * Aggregates signal scores into a rolling window snapshot.
   */
  computeSnapshot(
    signals: DetectedSignal[],
    messageCount: number,
    windowDays: 7 | 30
  ): Omit<SubconsciousSummary, 'signals'> & { signals: DetectedSignal[] } {
    const scoreMap: Record<SignalType, number[]> = {
      avoidance: [],
      tension: [],
      overload: [],
      delay: [],
      clarity: [],
      urgency: [],
    };

    for (const signal of signals) {
      if (scoreMap[signal.type] !== undefined) {
        scoreMap[signal.type].push(signal.intensity);
      }
    }

    const avg = (arr: number[]) =>
      arr.length === 0 ? 0 : arr.reduce((a, b) => a + b, 0) / arr.length;

    const scores: Record<SignalType, number> = {
      avoidance: avg(scoreMap.avoidance),
      tension: avg(scoreMap.tension),
      overload: avg(scoreMap.overload),
      delay: avg(scoreMap.delay),
      clarity: avg(scoreMap.clarity),
      urgency: avg(scoreMap.urgency),
    };

    // Dominant signal = highest scored (excluding clarity as it's positive)
    const negativeSignals: SignalType[] = ['avoidance', 'tension', 'overload', 'delay', 'urgency'];
    let dominantSignal: SignalType | null = null;
    let maxScore = 0;

    for (const type of negativeSignals) {
      if (scores[type] > maxScore) {
        maxScore = scores[type];
        dominantSignal = type;
      }
    }

    return {
      dominantSignal: maxScore > 0.2 ? dominantSignal : null,
      avoidanceScore: scores.avoidance,
      tensionScore: scores.tension,
      overloadScore: scores.overload,
      delayScore: scores.delay,
      messageCount,
      windowDays,
      signals,
    };
  }

  private safeDefault(): SubconsciousAnalysis {
    return {
      confidenceScore: 50,
      toneEffect: 'neutral',
      signals: [],
    };
  }
}

export const subconsciousService = new SubconsciousService();
