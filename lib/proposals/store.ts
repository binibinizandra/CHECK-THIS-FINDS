import "server-only";
import { and, eq, desc } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/lib/db";
import { proposals } from "@/lib/db/schema";

export interface Proposal {
  id: string;
  agentId: string | null;
  leadId: string;
  title: string;
  body: string;
  packages: string[];
  status: "draft" | "sent";
  createdAt: string;
}

function toProposal(r: typeof proposals.$inferSelect): Proposal {
  return {
    id: r.id,
    agentId: r.agentId,
    leadId: r.leadId,
    title: r.title,
    body: r.body,
    packages: (r.products as string[]) ?? [],
    status: r.status as Proposal["status"],
    createdAt: r.createdAt.toISOString(),
  };
}

export async function saveProposal(
  userId: string,
  data: { agentId?: string | null; leadId: string; title: string; body: string; products: string[] }
): Promise<Proposal | null> {
  if (!isDbConfigured()) return null;
  const db = getDb();
  if (!db) return null;
  const [row] = await db
    .insert(proposals)
    .values({
      userId,
      agentId: data.agentId ?? null,
      leadId: data.leadId,
      title: data.title,
      body: data.body,
      products: data.products,
    })
    .returning();
  return row ? toProposal(row) : null;
}

export async function listProposalsForLead(userId: string, leadId: string): Promise<Proposal[]> {
  if (!isDbConfigured()) return [];
  const db = getDb();
  if (!db) return [];
  const rows = await db
    .select()
    .from(proposals)
    .where(and(eq(proposals.userId, userId), eq(proposals.leadId, leadId)))
    .orderBy(desc(proposals.createdAt));
  return rows.map(toProposal);
}
