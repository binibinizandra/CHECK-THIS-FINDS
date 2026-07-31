import "server-only";
import { desc } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/lib/db";
import { newsletterSubscribers } from "@/lib/db/schema";

export interface SubscriberRecord {
  id: string;
  email: string;
  createdAt: Date;
}

export async function addSubscriber(email: string): Promise<void> {
  if (!isDbConfigured()) return;
  const db = getDb();
  if (!db) return;
  await db.insert(newsletterSubscribers).values({ email }).onConflictDoNothing();
}

export async function listSubscribers(): Promise<SubscriberRecord[]> {
  if (!isDbConfigured()) return [];
  const db = getDb();
  if (!db) return [];
  const rows = await db
    .select()
    .from(newsletterSubscribers)
    .orderBy(desc(newsletterSubscribers.createdAt));
  return rows.map((r) => ({ id: r.id, email: r.email, createdAt: r.createdAt }));
}
