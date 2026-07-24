import "server-only";
import { and, eq, desc, gte, isNotNull } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/lib/db";
import { activity } from "@/lib/db/schema";

export async function logActivity(
  userId: string,
  params: { agentId?: string | null; type: string; text: string; leadId?: string | null }
): Promise<void> {
  if (!isDbConfigured()) return;
  const db = getDb();
  if (!db) return;
  await db.insert(activity).values({
    userId,
    agentId: params.agentId ?? null,
    type: params.type,
    text: params.text,
    leadId: params.leadId ?? null,
  });
}

export interface NotificationItem {
  id: string;
  agentId: string | null;
  text: string;
  createdAt: string;
}

export async function listRecentActivity(userId: string, limit = 20): Promise<NotificationItem[]> {
  if (!isDbConfigured()) return [];
  const db = getDb();
  if (!db) return [];
  const rows = await db
    .select()
    .from(activity)
    .where(and(eq(activity.userId, userId), eq(activity.dismissed, false)))
    .orderBy(desc(activity.createdAt))
    .limit(limit);
  return rows.map((r) => ({ id: r.id, agentId: r.agentId, text: r.text, createdAt: r.createdAt.toISOString() }));
}

export async function clearAllActivity(userId: string): Promise<void> {
  if (!isDbConfigured()) return;
  const db = getDb();
  if (!db) return;
  await db.update(activity).set({ dismissed: true }).where(and(eq(activity.userId, userId), eq(activity.dismissed, false)));
}

export interface AgentLeadTouch {
  agentId: string | null;
  leadId: string | null;
}

export async function listActivitySince(userId: string, since: Date): Promise<AgentLeadTouch[]> {
  if (!isDbConfigured()) return [];
  const db = getDb();
  if (!db) return [];
  const rows = await db
    .select({ agentId: activity.agentId, leadId: activity.leadId })
    .from(activity)
    .where(and(eq(activity.userId, userId), gte(activity.createdAt, since), isNotNull(activity.leadId)));
  return rows;
}
