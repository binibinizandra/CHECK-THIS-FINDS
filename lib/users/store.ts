import "server-only";
import { eq } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/lib/db";
import { users } from "@/lib/db/schema";

export async function ensureUser(id: string, email: string | null, name: string | null): Promise<void> {
  if (!isDbConfigured()) return;
  const db = getDb();
  if (!db) return;
  const existing = await db.select({ id: users.id }).from(users).where(eq(users.id, id)).limit(1);
  if (existing.length === 0) {
    await db.insert(users).values({ id, email: email ?? undefined, name: name ?? undefined });
  }
}

export async function getUser(id: string) {
  if (!isDbConfigured()) return null;
  const db = getDb();
  if (!db) return null;
  const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function setNotificationPreference(id: string, key: string, value: boolean): Promise<void> {
  if (!isDbConfigured()) return;
  const db = getDb();
  if (!db) return;
  const existing = await getUser(id);
  const notifications = { ...((existing?.notifications as Record<string, boolean>) ?? {}), [key]: value };
  await db.update(users).set({ notifications }).where(eq(users.id, id));
}
