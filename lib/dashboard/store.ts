import "server-only";
import { and, eq, desc } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/lib/db";
import { jobs, activity } from "@/lib/db/schema";
import { listAgents } from "@/lib/agents/store";
import { listActivitySince } from "@/lib/activity/store";
import type { AgentSummary } from "@/lib/agents/types";
import type { WorkspaceStats, ActivityItem } from "@/lib/demoDashboard";

export interface LiveDashboardData {
  agents: AgentSummary[];
  stats: WorkspaceStats;
  activity: ActivityItem[];
}

const EMPTY_STATS: WorkspaceStats = { activeAgents: 0, tasksRunning: 0, leadsWorked: 0, perAgent: [] };

export async function getLiveDashboardData(userId: string): Promise<LiveDashboardData> {
  const agentsList = await listAgents(userId);

  if (!isDbConfigured()) {
    return { agents: agentsList, stats: EMPTY_STATS, activity: [] };
  }
  const db = getDb();
  if (!db) {
    return { agents: agentsList, stats: EMPTY_STATS, activity: [] };
  }

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [runningJobs, monthTouches, recentActivity] = await Promise.all([
    db.select({ agentId: jobs.agentId }).from(jobs).where(and(eq(jobs.userId, userId), eq(jobs.status, "running"))),
    listActivitySince(userId, startOfMonth),
    db
      .select({ agentId: activity.agentId, text: activity.text })
      .from(activity)
      .where(eq(activity.userId, userId))
      .orderBy(desc(activity.createdAt))
      .limit(8),
  ]);

  const runningAgentIds = new Set(runningJobs.map((j) => j.agentId).filter((id): id is string => Boolean(id)));

  const distinctLeadIds = new Set(monthTouches.map((t) => t.leadId).filter(Boolean));
  const perAgentMap = new Map<string, Set<string>>();
  for (const t of monthTouches) {
    if (!t.agentId || !t.leadId) continue;
    if (!perAgentMap.has(t.agentId)) perAgentMap.set(t.agentId, new Set());
    perAgentMap.get(t.agentId)!.add(t.leadId);
  }

  const agentsWithLiveStatus: AgentSummary[] = agentsList.map((a) => ({
    ...a,
    status: runningAgentIds.has(a.id) ? "working" : a.status,
  }));

  return {
    agents: agentsWithLiveStatus,
    stats: {
      activeAgents: runningAgentIds.size,
      tasksRunning: runningJobs.length,
      leadsWorked: distinctLeadIds.size,
      perAgent: Array.from(perAgentMap.entries()).map(([agentId, leadSet]) => ({ agentId, leadsWorked: leadSet.size })),
    },
    activity: recentActivity.map((a) => ({ agentId: a.agentId ?? "", text: a.text })),
  };
}
