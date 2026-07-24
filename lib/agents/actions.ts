"use server";
import { revalidatePath } from "next/cache";
import { currentUserId } from "@/lib/auth/currentUser";
import { createAgent, updateAgent, setAgentPaused, removeAgent, createTeam } from "@/lib/agents/store";
import type { CapabilityId } from "@/lib/agentTypes";
import type { AgentSummary, TeamSummary } from "@/lib/agents/types";

export async function addAgent(data: {
  name: string;
  role: string;
  color: string;
  goal: string;
  capabilities: CapabilityId[];
}): Promise<AgentSummary | null> {
  const userId = await currentUserId();
  if (!userId) return null;
  const created = await createAgent(userId, data);
  revalidatePath("/agents");
  return created;
}

export async function editAgent(agentId: string, patch: { role?: string; goal?: string }): Promise<void> {
  const userId = await currentUserId();
  if (!userId) return;
  await updateAgent(userId, agentId, patch);
  revalidatePath("/agents");
  revalidatePath(`/agents/${agentId}`);
}

export async function toggleAgentPaused(agentId: string, paused: boolean): Promise<void> {
  const userId = await currentUserId();
  if (!userId) return;
  await setAgentPaused(userId, agentId, paused);
  revalidatePath("/agents");
  revalidatePath(`/agents/${agentId}`);
}

export async function deleteAgent(agentId: string): Promise<void> {
  const userId = await currentUserId();
  if (!userId) return;
  await removeAgent(userId, agentId);
  revalidatePath("/agents");
}

export async function addTeam(data: {
  name: string;
  description: string;
  goal: string;
  memberIds: string[];
}): Promise<TeamSummary | null> {
  const userId = await currentUserId();
  if (!userId) return null;
  const created = await createTeam(userId, data);
  revalidatePath("/agents");
  return created;
}
