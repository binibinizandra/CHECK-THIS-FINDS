import "server-only";
import { randomBytes, createHash } from "node:crypto";

const AUTH_URL = "https://www.tiktok.com/v2/auth/authorize/";
const TOKEN_URL = "https://open.tiktokapis.com/v2/oauth/token/";
const USER_INFO_URL = "https://open.tiktokapis.com/v2/user/info/";
const SCOPES = "user.info.basic,user.info.stats";

export function isTikTokConfigured(): boolean {
  return Boolean(process.env.TIKTOK_CLIENT_KEY && process.env.TIKTOK_CLIENT_SECRET && process.env.NEXT_PUBLIC_APP_URL);
}

export function redirectUri(): string {
  return `${process.env.NEXT_PUBLIC_APP_URL}/api/tiktok/callback`;
}

export function generateState(): string {
  return randomBytes(16).toString("hex");
}

export function generatePkcePair(): { verifier: string; challenge: string } {
  const verifier = randomBytes(32).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  return { verifier, challenge };
}

export function buildAuthorizeUrl(state: string, codeChallenge: string): string {
  const params = new URLSearchParams({
    client_key: process.env.TIKTOK_CLIENT_KEY as string,
    response_type: "code",
    scope: SCOPES,
    redirect_uri: redirectUri(),
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });
  return `${AUTH_URL}?${params.toString()}`;
}

export interface TikTokTokens {
  accessToken: string;
  refreshToken: string | null;
  expiresIn: number;
  openId: string;
}

export async function exchangeCodeForToken(code: string, codeVerifier: string): Promise<TikTokTokens | null> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded", "cache-control": "no-cache" },
    body: new URLSearchParams({
      client_key: process.env.TIKTOK_CLIENT_KEY as string,
      client_secret: process.env.TIKTOK_CLIENT_SECRET as string,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri(),
      code_verifier: codeVerifier,
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data.access_token) return null;
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? null,
    expiresIn: data.expires_in ?? 0,
    openId: data.open_id,
  };
}

export interface TikTokProfile {
  displayName: string | null;
  avatarUrl: string | null;
  followerCount: number | null;
}

export async function fetchTikTokProfile(accessToken: string): Promise<TikTokProfile | null> {
  const fields = "display_name,avatar_url,follower_count";
  const res = await fetch(`${USER_INFO_URL}?fields=${fields}`, {
    headers: { authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  const u = data?.data?.user;
  if (!u) return null;
  return {
    displayName: u.display_name ?? null,
    avatarUrl: u.avatar_url ?? null,
    followerCount: typeof u.follower_count === "number" ? u.follower_count : null,
  };
}
