import "server-only";
import { and, eq } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/lib/db";
import { agents, agentConfig, agentStates, teams, teamMembers } from "@/lib/db/schema";
import { AGENT_TYPES, TEAM_TEMPLATES } from "@/lib/agentTypes";
import type { CapabilityId, AgentStatus } from "@/lib/agentTypes";
import type { AgentSummary, TeamSummary } from "@/lib/agents/types";

function slugify(name: string): string {
  const base = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return (base || "agent") + "-" + Math.random().toString(36).slice(2, 7);
}

function initialsFor(name: string): string {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return initials || "AI";
}

function presetToSummary(t: (typeof AGENT_TYPES)[number]): AgentSummary {
  return {
    id: t.id,
    name: t.name,
    initials: t.initials,
    role: t.role,
    color: t.color,
    status: "waiting",
    task: null,
    goal: null,
    capabilities: t.capabilities,
    type: t.id,
    paused: false,
  };
}

export async function listAgents(userId: string): Promise<AgentSummary[]> {
  const base: AgentSummary[] = AGENT_TYPES.map(presetToSummary);
  if (!isDbConfigured()) return base;
  const db = getDb();
  if (!db) return base;

  const [customRows, configRows, stateRows] = await Promise.all([
    db.select().from(agents).where(eq(agents.userId, userId)),
    db.select().from(agentConfig).where(eq(agentConfig.userId, userId)),
    db.select().from(agentStates).where(eq(agentStates.userId, userId)),
  ]);

  const configById = new Map(configRows.map((c) => [c.agentId, c]));
  const stateById = new Map(stateRows.map((s) => [s.agentId, s]));

  const custom: AgentSummary[] = customRows.map((r) => ({
    id: r.id,
    name: r.name,
    initials: r.initials,
    role: r.role,
    color: r.color,
    status: (r.status as AgentStatus) ?? "waiting",
    task: r.task,
    goal: r.goal,
    capabilities: (r.capabilities as CapabilityId[]) ?? [],
    type: r.type,
    paused: false,
  }));

  return [...base, ...custom]
    .map((a) => {
      const cfg = configById.get(a.id);
      const state = stateById.get(a.id);
      return {
        ...a,
        role: cfg?.role ?? a.role,
        goal: cfg?.goal ?? a.goal,
        paused: state?.paused ?? false,
      };
    })
    .filter((a) => !stateById.get(a.id)?.removed);
}

export async function getAgent(userId: string, agentId: string): Promise<AgentSummary | null> {
  const list = await listAgents(userId);
  return list.find((a) => a.id === agentId) ?? null;
}

export async function createAgent(
  userId: string,
  data: { name: string; role: string; color: string; goal: string; capabilities: CapabilityId[] }
): Promise<AgentSummary | null> {
  if (!isDbConfigured()) return null;
  const db = getDb();
  if (!db) return null;
  const id = slugify(data.name);
  const initials = initialsFor(data.name);
  await db.insert(agents).values({
    userId,
    id,
    name: data.name,
    initials,
    role: data.role,
    color: data.color,
    status: "waiting",
    goal: data.goal || null,
    type: "custom",
    capabilities: data.capabilities,
  });
  return {
    id,
    name: data.name,
    initials,
    role: data.role,
    color: data.color,
    status: "waiting",
    task: null,
    goal: data.goal || null,
    capabilities: data.capabilities,
    type: "custom",
    paused: false,
  };
}

export async function updateAgent(userId: string, agentId: string, patch: { role?: string; goal?: string }): Promise<void> {
  if (!isDbConfigured()) return;
  const db = getDb();
  if (!db) return;
  const isPreset = AGENT_TYPES.some((t) => t.id === agentId);
  if (isPreset) {
    await db
      .insert(agentConfig)
      .values({ userId, agentId, role: patch.role, goal: patch.goal })
      .onConflictDoUpdate({
        target: [agentConfig.userId, agentConfig.agentId],
        set: { role: patch.role, goal: patch.goal, updatedAt: new Date() },
      });
  } else {
    await db
      .update(agents)
      .set({
        ...(patch.role !== undefined ? { role: patch.role } : {}),
        ...(patch.goal !== undefined ? { goal: patch.goal } : {}),
      })
      .where(and(eq(agents.userId, userId), eq(agents.id, agentId)));
  }
}

export async function setAgentPaused(userId: string, agentId: string, paused: boolean): Promise<void> {
  if (!isDbConfigured()) return;
  const db = getDb();
  if (!db) return;
  await db
    .insert(agentStates)
    .values({ userId, agentId, paused, removed: false })
    .onConflictDoUpdate({
      target: [agentStates.userId, agentStates.agentId],
      set: { paused, updatedAt: new Date() },
    });
}

export async function removeAgent(userId: string, agentId: string): Promise<void> {
  if (!isDbConfigured()) return;
  const db = getDb();
  if (!db) return;
  await db
    .insert(agentStates)
    .values({ userId, agentId, removed: true, paused: false })
    .onConflictDoUpdate({
      target: [agentStates.userId, agentStates.agentId],
      set: { removed: true, updatedAt: new Date() },
    });
}

function presetTeamToSummary(t: (typeof TEAM_TEMPLATES)[number]): TeamSummary {
  return {
    id: t.id,
    name: t.name,
    icon: null,
    iconBg: null,
    description: null,
    goal: null,
    memberIds: t.memberTypeIds,
    template: t.id,
  };
}

export async function listTeams(userId: string): Promise<TeamSummary[]> {
  const base = TEAM_TEMPLATES.map(presetTeamToSummary);
  if (!isDbConfigured()) return base;
  const db = getDb();
  if (!db) return base;

  const [customRows, memberRows] = await Promise.all([
    db.select().from(teams).where(eq(teams.userId, userId)),
    db.select().from(teamMembers).where(eq(teamMembers.userId, userId)),
  ]);
  const membersById = new Map(memberRows.map((m) => [m.teamId, (m.members as string[]) ?? []]));

  const custom: TeamSummary[] = customRows.map((r) => ({
    id: r.id,
    name: r.name,
    icon: r.icon,
    iconBg: r.iconBg,
    description: r.description,
    goal: r.goal,
    memberIds: (r.members as string[]) ?? [],
    template: r.template,
  }));

  return [...base, ...custom].map((t) => ({
    ...t,
    memberIds: membersById.get(t.id) ?? t.memberIds,
  }));
}

export async function createTeam(
  userId: string,
  data: { name: string; description: string; goal: string; memberIds: string[] }
): Promise<TeamSummary | null> {
  if (!isDbConfigured()) return null;
  const db = getDb();
  if (!db) return null;
  const id = slugify(data.name);
  await db.insert(teams).values({
    userId,
    id,
    name: data.name,
    description: data.description || null,
    goal: data.goal || null,
    members: data.memberIds,
    template: null,
  });
  return {
    id,
    name: data.name,
    icon: null,
    iconBg: null,
    description: data.description || null,
    goal: data.goal || null,
    memberIds: data.memberIds,
    template: null,
  };
}
