import "server-only";
import { eq } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/lib/db";
import { creatorProfile, users } from "@/lib/db/schema";
import type { CreatorProfileData, PlatformEntry, AudienceInfo } from "@/lib/profile/types";

export async function getCreatorProfile(userId: string): Promise<CreatorProfileData | null> {
  if (!isDbConfigured()) return null;
  const db = getDb();
  if (!db) return null;
  const rows = await db.select().from(creatorProfile).where(eq(creatorProfile.userId, userId)).limit(1);
  const row = rows[0];
  if (!row) return null;
  return {
    niche: row.niche ?? "",
    bio: row.bio ?? "",
    platforms: (row.platforms as PlatformEntry[]) ?? [],
    audience: (row.audience as AudienceInfo) ?? {},
    tone: row.tone ?? "",
    pastDeals: row.pastDeals ?? "",
    rateFloor: row.rateFloor ?? null,
  };
}

export async function saveCreatorProfile(userId: string, data: CreatorProfileData): Promise<void> {
  if (!isDbConfigured()) return;
  const db = getDb();
  if (!db) return;
  await db
    .insert(creatorProfile)
    .values({
      userId,
      niche: data.niche,
      bio: data.bio,
      platforms: data.platforms,
      audience: data.audience,
      tone: data.tone,
      pastDeals: data.pastDeals,
      rateFloor: data.rateFloor,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: creatorProfile.userId,
      set: {
        niche: data.niche,
        bio: data.bio,
        platforms: data.platforms,
        audience: data.audience,
        tone: data.tone,
        pastDeals: data.pastDeals,
        rateFloor: data.rateFloor,
        updatedAt: new Date(),
      },
    });
}

export function hasEssentials(profile: CreatorProfileData | null): boolean {
  if (!profile) return false;
  const hasNiche = Boolean(profile.niche.trim());
  const hasPlatform = profile.platforms.some((p) => p.platform.trim());
  const hasRate = profile.rateFloor !== null && profile.rateFloor !== undefined;
  return hasNiche && hasPlatform && hasRate;
}

// The "creatorContext" text block every AI engine grounds its work on.
export function profileSummary(profile: CreatorProfileData | null): string {
  if (!profile) return "";
  const parts: string[] = [];
  if (profile.niche) parts.push(`Niche: ${profile.niche}.`);
  if (profile.bio) parts.push(`Bio: ${profile.bio}.`);
  if (profile.platforms.length) {
    const lines = profile.platforms
      .map((p) => {
        const followers = p.followers != null ? `${p.followers.toLocaleString()} followers` : "follower count not given";
        const engagement = p.engagementRate != null ? `, ${p.engagementRate}% engagement` : "";
        return `${p.platform}${p.handle ? ` (${p.handle})` : ""} — ${followers}${engagement}`;
      })
      .join("; ");
    parts.push(`Platforms: ${lines}.`);
  }
  const { age, geo, gender } = profile.audience || {};
  if (age || geo || gender) {
    parts.push(`Audience: ${[age, geo, gender].filter(Boolean).join(", ")}.`);
  }
  if (profile.tone) parts.push(`Voice/tone: ${profile.tone}.`);
  if (profile.pastDeals) parts.push(`Past brand deals: ${profile.pastDeals}.`);
  if (profile.rateFloor != null) parts.push(`Rate floor: will not go below $${profile.rateFloor} per deliverable.`);
  return parts.join(" ");
}

export async function creatorDisplayName(userId: string): Promise<string> {
  if (!isDbConfigured()) return "";
  const db = getDb();
  if (!db) return "";
  const rows = await db.select({ name: users.name }).from(users).where(eq(users.id, userId)).limit(1);
  return rows[0]?.name ?? "";
}
