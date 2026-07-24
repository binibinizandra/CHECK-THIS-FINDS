import "server-only";
import { and, eq, desc } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { logActivity } from "@/lib/activity/store";
import type { Lead, LeadStatus, LeadResearch } from "@/lib/leads/types";

function toLead(r: typeof leads.$inferSelect): Lead {
  return {
    id: r.id,
    userId: r.userId,
    agentId: r.agentId,
    name: r.name,
    title: r.title,
    company: r.company,
    email: r.email,
    status: r.status as LeadStatus,
    score: r.score,
    source: r.source as Lead["source"],
    review: r.review as Lead["review"],
    profileUrl: r.profileUrl,
    platform: r.platform,
    research: r.research as LeadResearch | null,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}

export async function listLeads(userId: string): Promise<Lead[]> {
  if (!isDbConfigured()) return [];
  const db = getDb();
  if (!db) return [];
  const rows = await db
    .select()
    .from(leads)
    .where(and(eq(leads.userId, userId), eq(leads.review, "accepted")))
    .orderBy(desc(leads.updatedAt));
  return rows.map(toLead);
}

export async function getLeadById(userId: string, leadId: string): Promise<Lead | null> {
  if (!isDbConfigured()) return null;
  const db = getDb();
  if (!db) return null;
  const rows = await db
    .select()
    .from(leads)
    .where(and(eq(leads.userId, userId), eq(leads.id, leadId)))
    .limit(1);
  return rows[0] ? toLead(rows[0]) : null;
}

export async function listPendingLeads(userId: string): Promise<Lead[]> {
  if (!isDbConfigured()) return [];
  const db = getDb();
  if (!db) return [];
  const rows = await db
    .select()
    .from(leads)
    .where(and(eq(leads.userId, userId), eq(leads.review, "pending")))
    .orderBy(desc(leads.createdAt));
  return rows.map(toLead);
}

export async function createLead(
  userId: string,
  data: { name: string; company?: string; email?: string; platform?: string; agentId?: string | null }
): Promise<Lead | null> {
  if (!isDbConfigured()) return null;
  const db = getDb();
  if (!db) return null;
  const [row] = await db
    .insert(leads)
    .values({
      userId,
      name: data.name,
      company: data.company || null,
      email: data.email || null,
      platform: data.platform || null,
      agentId: data.agentId || null,
      status: "new",
      source: "manual",
      review: "accepted",
    })
    .returning();
  if (row) {
    await logActivity(userId, { agentId: data.agentId ?? null, type: "lead_added", text: `added ${data.name}` });
  }
  return row ? toLead(row) : null;
}

export async function updateLeadStatus(userId: string, leadId: string, status: LeadStatus): Promise<void> {
  if (!isDbConfigured()) return;
  const db = getDb();
  if (!db) return;
  await db
    .update(leads)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(leads.userId, userId), eq(leads.id, leadId)));
}

export async function updateLeadResearch(userId: string, leadId: string, research: LeadResearch): Promise<void> {
  if (!isDbConfigured()) return;
  const db = getDb();
  if (!db) return;
  await db
    .update(leads)
    .set({ research, updatedAt: new Date() })
    .where(and(eq(leads.userId, userId), eq(leads.id, leadId)));
}

export async function updateLeadAgent(userId: string, leadId: string, agentId: string | null): Promise<void> {
  if (!isDbConfigured()) return;
  const db = getDb();
  if (!db) return;
  await db
    .update(leads)
    .set({ agentId, updatedAt: new Date() })
    .where(and(eq(leads.userId, userId), eq(leads.id, leadId)));
}

export async function acceptLead(userId: string, leadId: string): Promise<void> {
  if (!isDbConfigured()) return;
  const db = getDb();
  if (!db) return;
  await db
    .update(leads)
    .set({ review: "accepted", updatedAt: new Date() })
    .where(and(eq(leads.userId, userId), eq(leads.id, leadId)));
}

export async function rejectLead(userId: string, leadId: string): Promise<void> {
  if (!isDbConfigured()) return;
  const db = getDb();
  if (!db) return;
  await db.delete(leads).where(and(eq(leads.userId, userId), eq(leads.id, leadId)));
}

export async function createDiscoveredLeads(
  userId: string,
  agentId: string | null,
  candidates: { name: string; company: string | null; platform: string | null; profileUrl: string | null }[]
): Promise<Lead[]> {
  if (!isDbConfigured()) return [];
  const db = getDb();
  if (!db) return [];

  const inserted: Lead[] = [];
  for (const c of candidates) {
    const [row] = await db
      .insert(leads)
      .values({
        userId,
        agentId,
        name: c.name,
        company: c.company,
        platform: c.platform,
        profileUrl: c.profileUrl,
        status: "new",
        source: "scrape",
        review: "pending",
      })
      .returning();
    if (row) inserted.push(toLead(row));
  }

  if (inserted.length > 0) {
    await logActivity(userId, {
      agentId,
      type: "lead_added",
      text: `found ${inserted.length} new brand${inserted.length === 1 ? "" : "s"} that fit your niche`,
    });
  }

  return inserted;
}

const HEADER_ALIASES: Record<string, "name" | "company" | "email" | "platform"> = {
  name: "name",
  contact: "name",
  "contact name": "name",
  "brand contact": "name",
  company: "company",
  brand: "company",
  "brand name": "company",
  organization: "company",
  org: "company",
  email: "email",
  "e-mail": "email",
  "contact email": "email",
  platform: "platform",
  social: "platform",
  channel: "platform",
};

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      cells.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  cells.push(cur);
  return cells.map((c) => c.trim());
}

export interface CsvImportResult {
  added: number;
  skipped: number;
  leads: Lead[];
}

export async function importLeadsCsv(userId: string, csvText: string): Promise<CsvImportResult> {
  if (!isDbConfigured()) return { added: 0, skipped: 0, leads: [] };
  const db = getDb();
  if (!db) return { added: 0, skipped: 0, leads: [] };

  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) return { added: 0, skipped: 0, leads: [] };

  const headerCells = parseCsvLine(lines[0]).map((h) => h.toLowerCase());
  const fieldByIndex = headerCells.map((h) => HEADER_ALIASES[h] ?? null);

  let skipped = 0;
  const inserted: Lead[] = [];
  for (const line of lines.slice(1)) {
    const cells = parseCsvLine(line);
    const row: Partial<Record<"name" | "company" | "email" | "platform", string>> = {};
    fieldByIndex.forEach((field, i) => {
      if (field && cells[i]) row[field] = cells[i];
    });
    const name = row.name || row.company;
    if (!name) {
      skipped++;
      continue;
    }
    const [insertedRow] = await db
      .insert(leads)
      .values({
        userId,
        name,
        company: row.company ?? null,
        email: row.email ?? null,
        platform: row.platform ?? null,
        status: "new",
        source: "manual",
        review: "accepted",
      })
      .returning();
    if (insertedRow) inserted.push(toLead(insertedRow));
  }

  if (inserted.length > 0) {
    await logActivity(userId, {
      type: "lead_added",
      text: `imported ${inserted.length} brand${inserted.length === 1 ? "" : "s"} from a list`,
    });
  }

  return { added: inserted.length, skipped, leads: inserted };
}
