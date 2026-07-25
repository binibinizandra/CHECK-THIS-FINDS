import "server-only";
import { eq } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/lib/db";
import { tiktokConnections } from "@/lib/db/schema";

export interface TikTokConnection {
  openId: string;
  displayName: string | null;
  avatarUrl: string | null;
  followerCount: number | null;
  connectedAt: Date;
}

export async function getTikTokConnection(userId: string): Promise<TikTokConnection | null> {
  if (!isDbConfigured()) return null;
  const db = getDb();
  if (!db) return null;
  const rows = await db.select().from(tiktokConnections).where(eq(tiktokConnections.userId, userId)).limit(1);
  const row = rows[0];
  if (!row) return null;
  return {
    openId: row.openId,
    displayName: row.displayName,
    avatarUrl: row.avatarUrl,
    followerCount: row.followerCount,
    connectedAt: row.connectedAt,
  };
}

export interface SaveTikTokConnectionInput {
  openId: string;
  displayName: string | null;
  avatarUrl: string | null;
  followerCount: number | null;
  accessToken: string;
  refreshToken: string | null;
  expiresAt: Date | null;
}

export async function saveTikTokConnection(userId: string, data: SaveTikTokConnectionInput): Promise<void> {
  if (!isDbConfigured()) return;
  const db = getDb();
  if (!db) return;
  await db
    .insert(tiktokConnections)
    .values({ userId, ...data, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: tiktokConnections.userId,
      set: { ...data, updatedAt: new Date() },
    });
}

export async function deleteTikTokConnection(userId: string): Promise<void> {
  if (!isDbConfigured()) return;
  const db = getDb();
  if (!db) return;
  await db.delete(tiktokConnections).where(eq(tiktokConnections.userId, userId));
}
