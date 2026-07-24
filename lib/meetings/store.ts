import "server-only";
import { eq, asc } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/lib/db";
import { meetings } from "@/lib/db/schema";

export interface Meeting {
  id: string;
  agentId: string | null;
  leadId: string | null;
  title: string;
  kind: string;
  whenAt: string;
  whenLabel: string | null;
  createdAt: string;
}

function toMeeting(r: typeof meetings.$inferSelect): Meeting {
  return {
    id: r.id,
    agentId: r.agentId,
    leadId: r.leadId,
    title: r.title,
    kind: r.kind,
    whenAt: r.whenAt.toISOString(),
    whenLabel: r.whenLabel,
    createdAt: r.createdAt.toISOString(),
  };
}

export async function listMeetings(userId: string): Promise<Meeting[]> {
  if (!isDbConfigured()) return [];
  const db = getDb();
  if (!db) return [];
  const rows = await db.select().from(meetings).where(eq(meetings.userId, userId)).orderBy(asc(meetings.whenAt));
  return rows.map(toMeeting);
}

export async function createMeeting(
  userId: string,
  data: { agentId?: string | null; leadId?: string | null; title: string; whenAt: Date; whenLabel?: string | null }
): Promise<Meeting | null> {
  if (!isDbConfigured()) return null;
  const db = getDb();
  if (!db) return null;
  const [row] = await db
    .insert(meetings)
    .values({
      userId,
      agentId: data.agentId ?? null,
      leadId: data.leadId ?? null,
      title: data.title,
      whenAt: data.whenAt,
      whenLabel: data.whenLabel ?? null,
    })
    .returning();
  return row ? toMeeting(row) : null;
}
