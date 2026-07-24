"use server";
import { currentUserId } from "@/lib/auth/currentUser";
import { listRecentActivity, clearAllActivity } from "@/lib/activity/store";
import { listAgents } from "@/lib/agents/store";

export interface NotificationView {
  id: string;
  agentName: string | null;
  text: string;
  createdAt: string;
}

export async function getRecentActivity(): Promise<NotificationView[]> {
  const userId = await currentUserId();
  if (!userId) return [];
  const [items, agents] = await Promise.all([listRecentActivity(userId), listAgents(userId)]);
  return items.map((i) => ({
    id: i.id,
    agentName: i.agentId ? agents.find((a) => a.id === i.agentId)?.name ?? null : null,
    text: i.text,
    createdAt: i.createdAt,
  }));
}

export async function clearActivity(): Promise<void> {
  const userId = await currentUserId();
  if (!userId) return;
  await clearAllActivity(userId);
}
