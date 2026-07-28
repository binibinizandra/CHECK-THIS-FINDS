import "server-only";
import { eq, asc } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/lib/db";
import { comments } from "@/lib/db/schema";

export interface CommentRecord {
  id: string;
  productId: string;
  body: string;
  createdAt: string;
}

function toRecord(r: typeof comments.$inferSelect): CommentRecord {
  return {
    id: r.id,
    productId: r.productId,
    body: r.body,
    createdAt: r.createdAt.toISOString(),
  };
}

export async function listComments(productId: string): Promise<CommentRecord[]> {
  if (!isDbConfigured()) return [];
  const db = getDb();
  if (!db) return [];
  const rows = await db
    .select()
    .from(comments)
    .where(eq(comments.productId, productId))
    .orderBy(asc(comments.createdAt));
  return rows.map(toRecord);
}

export async function addComment(productId: string, body: string): Promise<CommentRecord> {
  const db = getDb();
  if (!db) throw new Error("Database not configured.");
  const [row] = await db.insert(comments).values({ productId, body }).returning();
  return toRecord(row);
}

export async function deleteComment(id: string): Promise<void> {
  const db = getDb();
  if (!db) return;
  await db.delete(comments).where(eq(comments.id, id));
}
