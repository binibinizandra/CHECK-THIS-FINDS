"use server";
import { currentUserId } from "@/lib/auth/currentUser";
import { getLiveDashboardData } from "@/lib/dashboard/store";
import type { LiveDashboardData } from "@/lib/dashboard/store";

export async function fetchLiveDashboard(): Promise<LiveDashboardData | null> {
  const userId = await currentUserId();
  if (!userId) return null;
  return getLiveDashboardData(userId);
}
