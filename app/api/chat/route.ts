import { streamText } from "ai";
import { model } from "@/lib/ai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model,
    messages
  });

  return result.toAIStreamResponse();
}

