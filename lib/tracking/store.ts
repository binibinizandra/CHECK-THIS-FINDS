import "server-only";
import { count, eq } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/lib/db";
import { analyticsEvents } from "@/lib/db/schema";

const ALLOWED_TYPES = new Set(["page_view", "product_view", "product_click"]);

export async function recordEvent(type: string, productId: string | null): Promise<void> {
  if (!ALLOWED_TYPES.has(type)) return;
  if (!isDbConfigured()) return;
  const db = getDb();
  if (!db) return;
  await db.insert(analyticsEvents).values({ type, productId });
}

export async function getPageViewCount(): Promise<number> {
  if (!isDbConfigured()) return 0;
  const db = getDb();
  if (!db) return 0;
  const rows = await db
    .select({ value: count() })
    .from(analyticsEvents)
    .where(eq(analyticsEvents.type, "page_view"));
  return rows[0]?.value ?? 0;
}

export async function getProductClickCounts(): Promise<Record<string, number>> {
  if (!isDbConfigured()) return {};
  const db = getDb();
  if (!db) return {};
  const rows = await db
    .select({ productId: analyticsEvents.productId, value: count() })
    .from(analyticsEvents)
    .where(eq(analyticsEvents.type, "product_click"))
    .groupBy(analyticsEvents.productId);
  const map: Record<string, number> = {};
  for (const r of rows) {
    if (r.productId) map[r.productId] = r.value;
  }
  return map;
}
