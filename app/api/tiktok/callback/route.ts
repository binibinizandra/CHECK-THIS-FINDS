export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { currentUserId } from "@/lib/auth/currentUser";
import { exchangeCodeForToken, fetchTikTokProfile } from "@/lib/tiktok/oauth";
import { saveTikTokConnection } from "@/lib/tiktok/store";

function redirectWithStatus(req: Request, status: "connected" | "error") {
  const url = new URL("/profile", req.url);
  url.searchParams.set("tiktok", status);
  const res = NextResponse.redirect(url);
  res.cookies.delete("tiktok_oauth_state");
  res.cookies.delete("tiktok_oauth_verifier");
  return res;
}

export async function GET(req: Request) {
  const userId = await currentUserId();
  if (!userId) return NextResponse.redirect(new URL("/sign-in", req.url));

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const errorParam = url.searchParams.get("error");

  const cookieStore = cookies();
  const savedState = cookieStore.get("tiktok_oauth_state")?.value;
  const codeVerifier = cookieStore.get("tiktok_oauth_verifier")?.value;

  if (errorParam || !code || !state || !savedState || state !== savedState || !codeVerifier) {
    return redirectWithStatus(req, "error");
  }

  const tokens = await exchangeCodeForToken(code, codeVerifier);
  if (!tokens) return redirectWithStatus(req, "error");

  const profile = await fetchTikTokProfile(tokens.accessToken);

  await saveTikTokConnection(userId, {
    openId: tokens.openId,
    displayName: profile?.displayName ?? null,
    avatarUrl: profile?.avatarUrl ?? null,
    followerCount: profile?.followerCount ?? null,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    expiresAt: tokens.expiresIn ? new Date(Date.now() + tokens.expiresIn * 1000) : null,
  });

  return redirectWithStatus(req, "connected");
}
