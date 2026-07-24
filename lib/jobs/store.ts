import "server-only";
import { and, eq, inArray } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/lib/db";
import { jobs } from "@/lib/db/schema";

export type JobKind = "outreach" | "proposal" | "follow-up" | "research";

export async function enqueueJob(
  userId: string,
  kind: JobKind,
  params: Record<string, unknown>,
  agentId?: string | null
): Promise<string | null> {
  if (!isDbConfigured()) return null;
  const db = getDb();
  if (!db) return null;
  const [row] = await db
    .insert(jobs)
    .values({ userId, agentId: agentId ?? null, kind, status: "queued", params })
    .returning({ id: jobs.id });
  return row?.id ?? null;
}

export async function claimQueuedJobs(userId: string, limit = 5) {
  if (!isDbConfigured()) return [];
  const db = getDb();
  if (!db) return [];
  const candidates = await db
    .select({ id: jobs.id })
    .from(jobs)
    .where(and(eq(jobs.userId, userId), eq(jobs.status, "queued")))
    .limit(limit);

  const claimed: (typeof jobs.$inferSelect)[] = [];
  for (const c of candidates) {
    // Atomic claim: only proceed if this row was still queued at update time.
    const updated = await db
      .update(jobs)
      .set({ status: "running", startedAt: new Date() })
      .where(and(eq(jobs.id, c.id), eq(jobs.status, "queued")))
      .returning();
    if (updated[0]) claimed.push(updated[0]);
  }
  return claimed;
}

export async function completeJob(jobId: string, result: unknown): Promise<void> {
  if (!isDbConfigured()) return;
  const db = getDb();
  if (!db) return;
  await db
    .update(jobs)
    .set({ status: "done", result: result as object, finishedAt: new Date() })
    .where(eq(jobs.id, jobId));
}

export async function failJob(jobId: string, error: string): Promise<void> {
  if (!isDbConfigured()) return;
  const db = getDb();
  if (!db) return;
  await db.update(jobs).set({ status: "failed", error, finishedAt: new Date() }).where(eq(jobs.id, jobId));
}

export async function hasQueuedOrRunning(userId: string): Promise<boolean> {
  if (!isDbConfigured()) return false;
  const db = getDb();
  if (!db) return false;
  const rows = await db
    .select({ id: jobs.id })
    .from(jobs)
    .where(and(eq(jobs.userId, userId), inArray(jobs.status, ["queued", "running"])))
    .limit(1);
  return rows.length > 0;
}
