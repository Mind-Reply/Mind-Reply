import { NextResponse } from "next/server";
import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: anthropic("claude-3-sonnet"),
    messages
  });

  return result.toAIStreamResponse();
}
