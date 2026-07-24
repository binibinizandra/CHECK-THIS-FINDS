"use server";
import { currentUserId } from "@/lib/auth/currentUser";
import { enqueueJob } from "@/lib/jobs/store";
import type { JobKind } from "@/lib/jobs/store";

export async function enqueueLeadJob(leadId: string, kind: JobKind, agentId?: string | null): Promise<string | null> {
  const userId = await currentUserId();
  if (!userId) return null;
  return enqueueJob(userId, kind, { leadId }, agentId ?? null);
}
