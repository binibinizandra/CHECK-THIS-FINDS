export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { currentUserId } from "@/lib/auth/currentUser";
import { deleteTikTokConnection } from "@/lib/tiktok/store";

export async function POST() {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  await deleteTikTokConnection(userId);
  return NextResponse.json({ ok: true });
}
