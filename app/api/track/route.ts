import { NextRequest, NextResponse } from "next/server";
import { recordEvent } from "@/lib/tracking/store";

export async function POST(req: NextRequest) {
  let body: { type?: string; productId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!body.type) {
    return NextResponse.json({ error: "Missing type" }, { status: 400 });
  }

  await recordEvent(body.type, body.productId ?? null);
  return NextResponse.json({ ok: true });
}
