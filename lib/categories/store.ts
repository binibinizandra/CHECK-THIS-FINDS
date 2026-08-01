import "server-only";
import { eq, and, asc } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/lib/db";
import { categories } from "@/lib/db/schema";

export interface CategoryRecord {
  id: string;
  key: string;
  label: string;
  sortOrder: number;
}

const DEFAULTS = [
  { key: "home", label: "Home Needs & Appliances" },
  { key: "digital", label: "Digital Finds" },
  { key: "care", label: "Personal Care" },
  { key: "food", label: "Food & Treats" },
];

function toRecord(r: typeof categories.$inferSelect): CategoryRecord {
  return { id: r.id, key: r.key, label: r.label, sortOrder: r.sortOrder };
}

function fallback(): CategoryRecord[] {
  return DEFAULTS.map((d, i) => ({ id: d.key, key: d.key, label: d.label, sortOrder: i }));
}

export async function listCategories(userId: string): Promise<CategoryRecord[]> {
  if (!isDbConfigured()) return fallback();
  const db = getDb();
  if (!db) return fallback();

  let rows = await db
    .select()
    .from(categories)
    .where(eq(categories.userId, userId))
    .orderBy(asc(categories.sortOrder), asc(categories.createdAt));

  // First time this owner loads categories, seed the defaults as real rows
  // so they behave the same as any category they'd add themselves (rename/delete).
  // onConflictDoNothing + a unique (user_id, key) index makes this safe if
  // multiple requests race to seed at once.
  if (rows.length === 0) {
    await db
      .insert(categories)
      .values(DEFAULTS.map((d, i) => ({ userId, key: d.key, label: d.label, sortOrder: i })))
      .onConflictDoNothing();
    rows = await db
      .select()
      .from(categories)
      .where(eq(categories.userId, userId))
      .orderBy(asc(categories.sortOrder), asc(categories.createdAt));
  }
  return rows.map(toRecord);
}

function slugify(label: string): string {
  return label.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "category";
}

export async function createCategory(userId: string, label: string): Promise<CategoryRecord | null> {
  if (!isDbConfigured()) return null;
  const db = getDb();
  if (!db) return null;

  const existing = await db.select().from(categories).where(eq(categories.userId, userId));
  const existingKeys = new Set(existing.map((r) => r.key));
  let key = slugify(label);
  if (existingKeys.has(key)) {
    let n = 2;
    while (existingKeys.has(`${key}_${n}`)) n++;
    key = `${key}_${n}`;
  }
  const maxSort = existing.reduce((m, r) => Math.max(m, r.sortOrder), -1);

  const rows = await db
    .insert(categories)
    .values({ userId, key, label: label.trim(), sortOrder: maxSort + 1 })
    .returning();
  return rows[0] ? toRecord(rows[0]) : null;
}

export async function updateCategoryLabel(userId: string, id: string, label: string): Promise<void> {
  if (!isDbConfigured()) return;
  const db = getDb();
  if (!db) return;
  await db
    .update(categories)
    .set({ label: label.trim() })
    .where(and(eq(categories.id, id), eq(categories.userId, userId)));
}

export async function deleteCategory(userId: string, id: string): Promise<void> {
  if (!isDbConfigured()) return;
  const db = getDb();
  if (!db) return;
  await db.delete(categories).where(and(eq(categories.id, id), eq(categories.userId, userId)));
}
