"use server";
import { revalidatePath } from "next/cache";
import { currentUserId } from "@/lib/auth/currentUser";
import {
  createLead,
  importLeadsCsv,
  updateLeadStatus,
  updateLeadAgent,
  acceptLead,
  rejectLead,
} from "@/lib/leads/store";
import type { Lead, LeadStatus } from "@/lib/leads/types";
import type { CsvImportResult } from "@/lib/leads/store";

export async function addLead(data: {
  name: string;
  company?: string;
  email?: string;
  platform?: string;
  agentId?: string | null;
}): Promise<Lead | null> {
  const userId = await currentUserId();
  if (!userId) return null;
  const created = await createLead(userId, data);
  revalidatePath("/deals");
  return created;
}

export async function importCsv(csvText: string): Promise<CsvImportResult> {
  const userId = await currentUserId();
  if (!userId) return { added: 0, skipped: 0, leads: [] };
  const result = await importLeadsCsv(userId, csvText);
  revalidatePath("/deals");
  return result;
}

export async function moveLeadStage(leadId: string, status: LeadStatus): Promise<void> {
  const userId = await currentUserId();
  if (!userId) return;
  await updateLeadStatus(userId, leadId, status);
  revalidatePath("/deals");
}

export async function assignLeadAgent(leadId: string, agentId: string | null): Promise<void> {
  const userId = await currentUserId();
  if (!userId) return;
  await updateLeadAgent(userId, leadId, agentId);
  revalidatePath("/deals");
}

export async function approveLead(leadId: string): Promise<void> {
  const userId = await currentUserId();
  if (!userId) return;
  await acceptLead(userId, leadId);
  revalidatePath("/deals");
}

export async function declineLead(leadId: string): Promise<void> {
  const userId = await currentUserId();
  if (!userId) return;
  await rejectLead(userId, leadId);
  revalidatePath("/deals");
}
