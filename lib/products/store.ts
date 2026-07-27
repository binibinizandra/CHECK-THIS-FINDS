import "server-only";
import { eq, and, asc } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/lib/db";
import { products } from "@/lib/db/schema";

export interface ProductRecord {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  imageUrl: string;
  shopeeLink: string | null;
  tiktokLink: string | null;
  pros: string | null;
  cons: string | null;
  sortOrder: number;
}

function toRecord(r: typeof products.$inferSelect): ProductRecord {
  return {
    id: r.id,
    name: r.name,
    category: r.category,
    rating: r.rating,
    reviews: r.reviews,
    imageUrl: r.imageUrl,
    shopeeLink: r.shopeeLink,
    tiktokLink: r.tiktokLink,
    pros: r.pros,
    cons: r.cons,
    sortOrder: r.sortOrder,
  };
}

export async function listProducts(userId: string): Promise<ProductRecord[]> {
  if (!isDbConfigured()) return [];
  const db = getDb();
  if (!db) return [];
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.userId, userId))
    .orderBy(asc(products.sortOrder), asc(products.createdAt));
  return rows.map(toRecord);
}

// Used by the public storefront, which has no logged-in visitor —
// this is a single-owner site, so we show every product in the table.
export async function listAllProducts(): Promise<ProductRecord[]> {
  if (!isDbConfigured()) return [];
  const db = getDb();
  if (!db) return [];
  const rows = await db.select().from(products).orderBy(asc(products.sortOrder), asc(products.createdAt));
  return rows.map(toRecord);
}

export interface ProductInput {
  name: string;
  category: string;
  rating: number;
  reviews: number;
  imageUrl: string;
  shopeeLink: string | null;
  tiktokLink: string | null;
  pros: string | null;
  cons: string | null;
}

// Used by the public product detail page, which has no logged-in visitor.
export async function getProduct(id: string): Promise<ProductRecord | null> {
  if (!isDbConfigured()) return null;
  const db = getDb();
  if (!db) return null;
  const rows = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return rows[0] ? toRecord(rows[0]) : null;
}

export async function createProduct(userId: string, data: ProductInput): Promise<void> {
  if (!isDbConfigured()) return;
  const db = getDb();
  if (!db) return;
  await db.insert(products).values({ userId, ...data });
}

export async function updateProduct(userId: string, id: string, data: ProductInput): Promise<void> {
  if (!isDbConfigured()) return;
  const db = getDb();
  if (!db) return;
  await db
    .update(products)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(products.id, id), eq(products.userId, userId)));
}

export async function deleteProduct(userId: string, id: string): Promise<void> {
  if (!isDbConfigured()) return;
  const db = getDb();
  if (!db) return;
  await db.delete(products).where(and(eq(products.id, id), eq(products.userId, userId)));
}
