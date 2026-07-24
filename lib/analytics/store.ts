import "server-only";
import { and, eq, gte, isNotNull } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/lib/db";
import { activity, outreachDrafts, meetings } from "@/lib/db/schema";
import { listAgents } from "@/lib/agents/store";

export interface AnalyticsData {
  pitchesDrafted: number;
  brandsWorked: number;
  callsBooked: number;
  perDay: { date: string; label: string; count: number }[];
  perAgent: { agentId: string; agentName: string; color: string; count: number }[];
}

const EMPTY: AnalyticsData = { pitchesDrafted: 0, brandsWorked: 0, callsBooked: 0, perDay: [], perAgent: [] };

export async function getAnalytics(userId: string): Promise<AnalyticsData> {
  if (!isDbConfigured()) return EMPTY;
  const db = getDb();
  if (!db) return EMPTY;

  const since = new Date();
  since.setDate(since.getDate() - 13);
  since.setHours(0, 0, 0, 0);

  const [pitchRows, allTouches, meetingRows, recentActivity, agentsList] = await Promise.all([
    db.select({ id: outreachDrafts.id }).from(outreachDrafts).where(eq(outreachDrafts.userId, userId)),
    db
      .select({ agentId: activity.agentId, leadId: activity.leadId })
      .from(activity)
      .where(and(eq(activity.userId, userId), isNotNull(activity.leadId))),
    db.select({ id: meetings.id }).from(meetings).where(eq(meetings.userId, userId)),
    db
      .select({ createdAt: activity.createdAt })
      .from(activity)
      .where(and(eq(activity.userId, userId), gte(activity.createdAt, since))),
    listAgents(userId),
  ]);

  const brandsWorked = new Set(allTouches.map((t) => t.leadId).filter(Boolean)).size;

  const perAgentMap = new Map<string, Set<string>>();
  for (const t of allTouches) {
    if (!t.agentId || !t.leadId) continue;
    if (!perAgentMap.has(t.agentId)) perAgentMap.set(t.agentId, new Set());
    perAgentMap.get(t.agentId)!.add(t.leadId);
  }
  const perAgent = Array.from(perAgentMap.entries())
    .map(([agentId, leadSet]) => {
      const agent = agentsList.find((a) => a.id === agentId);
      return { agentId, agentName: agent?.name ?? "Agent", color: agent?.color ?? "#94A3B8", count: leadSet.size };
    })
    .sort((a, b) => b.count - a.count);

  const dayCounts = new Map<string, number>();
  const dayLabels = new Map<string, string>();
  for (let i = 0; i < 14; i++) {
    const d = new Date(since);
    d.setDate(since.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    dayCounts.set(key, 0);
    dayLabels.set(key, d.toLocaleDateString("en-US", { weekday: "short", day: "numeric" }));
  }
  for (const row of recentActivity) {
    const key = row.createdAt.toISOString().slice(0, 10);
    if (dayCounts.has(key)) dayCounts.set(key, (dayCounts.get(key) ?? 0) + 1);
  }
  const perDay = Array.from(dayCounts.entries()).map(([date, count]) => ({
    date,
    label: dayLabels.get(date) ?? date,
    count,
  }));

  return {
    pitchesDrafted: pitchRows.length,
    brandsWorked,
    callsBooked: meetingRows.length,
    perDay,
    perAgent,
  };
}
