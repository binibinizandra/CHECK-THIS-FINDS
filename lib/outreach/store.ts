import "server-only";
import { and, eq, desc } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/lib/db";
import { outreachDrafts } from "@/lib/db/schema";

export interface OutreachDraft {
  id: string;
  agentId: string | null;
  leadId: string;
  subject: string;
  body: string;
  rationale: string | null;
  status: "draft" | "sent";
  dismissed: boolean;
  createdAt: string;
}

function toDraft(r: typeof outreachDrafts.$inferSelect): OutreachDraft {
  return {
    id: r.id,
    agentId: r.agentId,
    leadId: r.leadId,
    subject: r.subject,
    body: r.body,
    rationale: r.rationale,
    status: r.status as OutreachDraft["status"],
    dismissed: r.dismissed,
    createdAt: r.createdAt.toISOString(),
  };
}

export async function saveOutreachDraft(
  userId: string,
  data: { agentId?: string | null; leadId: string; subject: string; body: string; rationale?: string | null }
): Promise<OutreachDraft | null> {
  if (!isDbConfigured()) return null;
  const db = getDb();
  if (!db) return null;
  const [row] = await db
    .insert(outreachDrafts)
    .values({
      userId,
      agentId: data.agentId ?? null,
      leadId: data.leadId,
      subject: data.subject,
      body: data.body,
      rationale: data.rationale ?? null,
    })
    .returning();
  return row ? toDraft(row) : null;
}

export async function getLatestDraftForLead(userId: string, leadId: string): Promise<OutreachDraft | null> {
  if (!isDbConfigured()) return null;
  const db = getDb();
  if (!db) return null;
  const rows = await db
    .select()
    .from(outreachDrafts)
    .where(and(eq(outreachDrafts.userId, userId), eq(outreachDrafts.leadId, leadId)))
    .orderBy(desc(outreachDrafts.createdAt))
    .limit(1);
  return rows[0] ? toDraft(rows[0]) : null;
}

export async function listDraftsForLead(userId: string, leadId: string): Promise<OutreachDraft[]> {
  if (!isDbConfigured()) return [];
  const db = getDb();
  if (!db) return [];
  const rows = await db
    .select()
    .from(outreachDrafts)
    .where(and(eq(outreachDrafts.userId, userId), eq(outreachDrafts.leadId, leadId)))
    .orderBy(desc(outreachDrafts.createdAt));
  return rows.map(toDraft);
}
