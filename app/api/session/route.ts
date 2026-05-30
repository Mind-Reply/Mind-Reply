import { NextResponse } from "next/server";

export async function GET() {
  // по-късно: JWT / DB / user
  return NextResponse.json({
    userId: "demo-user",
    plan: "founder",
    features: ["chat", "dashboard", "insights"]
  });
}
