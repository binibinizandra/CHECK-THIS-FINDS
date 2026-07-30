import "server-only";
import { getDb, isDbConfigured } from "@/lib/db";
import { newsletterSubscribers } from "@/lib/db/schema";

export async function addSubscriber(email: string): Promise<void> {
  if (!isDbConfigured()) return;
  const db = getDb();
  if (!db) return;
  await db.insert(newsletterSubscribers).values({ email }).onConflictDoNothing();
}
