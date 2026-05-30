import { anthropic } from "@ai-sdk/anthropic";

export const model = anthropic("claude-3-sonnet");
if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("Missing ANTHROPIC_API_KEY");
}
