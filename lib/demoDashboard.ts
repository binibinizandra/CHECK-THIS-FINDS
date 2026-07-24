import { AGENT_TYPES } from "@/lib/agentTypes";
import type { AgentStatus } from "@/lib/agentTypes";

export interface DemoAgent {
  id: string;
  name: string;
  initials: string;
  color: string;
  status: AgentStatus;
  capabilities: string[];
}

export interface DemoTeam {
  id: string;
  name: string;
  memberIds: string[];
}

export interface WorkspaceStats {
  activeAgents: number;
  tasksRunning: number;
  leadsWorked: number;
  perAgent: { agentId: string; leadsWorked: number }[];
}

export interface ActivityItem {
  agentId: string;
  text: string;
}

const DEMO_STATUS: Record<string, AgentStatus> = {
  discovery: "working",
  outreach: "working",
  proposal: "working",
  followup: "waiting",
  scheduler: "working",
};

export const DEMO_AGENTS: DemoAgent[] = AGENT_TYPES.map((t) => ({
  id: t.id,
  name: t.name,
  initials: t.initials,
  color: t.color,
  status: DEMO_STATUS[t.id] ?? "working",
  capabilities: t.capabilities,
}));

export const DEMO_TEAMS: DemoTeam[] = [
  { id: "deal-team", name: "Deal Team", memberIds: AGENT_TYPES.map((t) => t.id) },
];

export const DEMO_STATS: WorkspaceStats = {
  activeAgents: 4,
  tasksRunning: 6,
  leadsWorked: 23,
  perAgent: [
    { agentId: "discovery", leadsWorked: 9 },
    { agentId: "outreach", leadsWorked: 14 },
    { agentId: "proposal", leadsWorked: 7 },
    { agentId: "followup", leadsWorked: 5 },
    { agentId: "scheduler", leadsWorked: 6 },
  ],
};

export const DEMO_ACTIVITY: ActivityItem[] = [
  { agentId: "scheduler", text: "booked a call with Glow Skincare for Thursday at 2pm" },
  { agentId: "outreach", text: "drafted a pitch for Acme Outdoor" },
  { agentId: "proposal", text: "sent a proposal to Verve Media" },
  { agentId: "discovery", text: "found 6 new brands that fit your niche" },
  { agentId: "followup", text: "is waiting on a reply from Bright Bites" },
];
