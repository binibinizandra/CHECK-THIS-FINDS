import "server-only";
import { count, eq, inArray } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/lib/db";
import { analyticsEvents } from "@/lib/db/schema";

// "product_click" is the legacy event from before Lazada buttons existed —
// every click was a Shopee click back then, so it still counts toward Shopee.
const ALLOWED_TYPES = new Set(["page_view", "product_view", "product_click", "product_click_shopee", "product_click_lazada"]);

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

async function getProductEventCounts(types: string[]): Promise<Record<string, number>> {
  if (!isDbConfigured()) return {};
  const db = getDb();
  if (!db) return {};
  const rows = await db
    .select({ productId: analyticsEvents.productId, value: count() })
    .from(analyticsEvents)
    .where(inArray(analyticsEvents.type, types))
    .groupBy(analyticsEvents.productId);
  const map: Record<string, number> = {};
  for (const r of rows) {
    if (r.productId) map[r.productId] = (map[r.productId] ?? 0) + r.value;
  }
  return map;
}

export function getProductClickCountsShopee(): Promise<Record<string, number>> {
  return getProductEventCounts(["product_click", "product_click_shopee"]);
}

export function getProductClickCountsLazada(): Promise<Record<string, number>> {
  return getProductEventCounts(["product_click_lazada"]);
}

export function getProductViewCounts(): Promise<Record<string, number>> {
  return getProductEventCounts(["product_view"]);
}
