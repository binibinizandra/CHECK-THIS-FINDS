import "server-only";
import { eq, asc } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/lib/db";
import { messages } from "@/lib/db/schema";

export interface ChatMessage {
  id: number;
  agentId: string | null;
  who: "ai" | "me";
  text: string;
  createdAt: string;
}

function toMessage(r: typeof messages.$inferSelect): ChatMessage {
  return {
    id: r.id,
    agentId: r.agentId,
    who: r.who as ChatMessage["who"],
    text: r.text,
    createdAt: r.createdAt.toISOString(),
  };
}

export async function listMessages(userId: string): Promise<ChatMessage[]> {
  if (!isDbConfigured()) return [];
  const db = getDb();
  if (!db) return [];
  const rows = await db.select().from(messages).where(eq(messages.userId, userId)).orderBy(asc(messages.id));
  return rows.map(toMessage);
}

export async function saveMessage(
  userId: string,
  data: { agentId: string | null; who: "ai" | "me"; text: string }
): Promise<ChatMessage | null> {
  if (!isDbConfigured()) return null;
  const db = getDb();
  if (!db) return null;
  const [row] = await db
    .insert(messages)
    .values({ userId, agentId: data.agentId, who: data.who, text: data.text })
    .returning();
  return row ? toMessage(row) : null;
}
