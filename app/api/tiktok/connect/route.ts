export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { currentUserId } from "@/lib/auth/currentUser";
import { isTikTokConfigured, generateState, generatePkcePair, buildAuthorizeUrl } from "@/lib/tiktok/oauth";

const COOKIE_OPTS = { httpOnly: true, secure: true, sameSite: "lax" as const, maxAge: 300, path: "/api/tiktok" };

export async function GET(req: Request) {
  const userId = await currentUserId();
  if (!userId) return NextResponse.redirect(new URL("/sign-in", req.url));

  if (!isTikTokConfigured()) {
    return NextResponse.json({ error: "TikTok is not configured on this deployment yet." }, { status: 503 });
  }

  const state = generateState();
  const { verifier, challenge } = generatePkcePair();

  const res = NextResponse.redirect(buildAuthorizeUrl(state, challenge));
  res.cookies.set("tiktok_oauth_state", state, COOKIE_OPTS);
  res.cookies.set("tiktok_oauth_verifier", verifier, COOKIE_OPTS);
  return res;
}
