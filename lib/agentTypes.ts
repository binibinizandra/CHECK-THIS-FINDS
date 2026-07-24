export type CapabilityId =
  | "scrape"
  | "research"
  | "outreach"
  | "proposal"
  | "follow-up"
  | "book-meeting";

export interface Capability {
  id: CapabilityId;
  label: string;
  jobKind: string;
}

export const CAPABILITIES: Capability[] = [
  { id: "scrape", label: "Research", jobKind: "scrape" },
  { id: "research", label: "Brand brief", jobKind: "research" },
  { id: "outreach", label: "Initial outreach", jobKind: "outreach" },
  { id: "proposal", label: "Proposals", jobKind: "proposal" },
  { id: "follow-up", label: "Follow-ups", jobKind: "follow-up" },
  { id: "book-meeting", label: "Scheduling", jobKind: "book-meeting" },
];

export type AgentStatus = "working" | "waiting" | "offline" | "error";

export interface AgentType {
  id: string;
  name: string;
  initials: string;
  role: string;
  color: string;
  capabilities: CapabilityId[];
  char: number;
}

export const AGENT_TYPES: AgentType[] = [
  {
    id: "discovery",
    name: "Nailah Nectar",
    initials: "NN",
    role: "Research",
    color: "#22C55E",
    capabilities: ["scrape", "research"],
    char: 0,
  },
  {
    id: "outreach",
    name: "Ollie Sta.Ana",
    initials: "OS",
    role: "Initial Outreach",
    color: "#6B21A8",
    capabilities: ["outreach"],
    char: 1,
  },
  {
    id: "proposal",
    name: "Tomi Ballesteros",
    initials: "TB",
    role: "Proposal",
    color: "#64748B",
    capabilities: ["proposal"],
    char: 2,
  },
  {
    id: "followup",
    name: "Moke Elikai",
    initials: "ME",
    role: "Follow-up",
    color: "#E5A93C",
    capabilities: ["follow-up"],
    char: 3,
  },
  {
    id: "scheduler",
    name: "Tovi Bito",
    initials: "TB",
    role: "Scheduler",
    color: "#F28D9B",
    capabilities: ["book-meeting"],
    char: 4,
  },
];

export interface TeamTemplate {
  id: string;
  name: string;
  memberTypeIds: string[];
}

export const TEAM_TEMPLATES: TeamTemplate[] = [
  {
    id: "deal-team",
    name: "Deal Team",
    memberTypeIds: ["discovery", "outreach", "proposal", "followup", "scheduler"],
  },
];

const typeByCapability: Record<string, string> = {
  scrape: "research",
  research: "research",
  outreach: "email",
  "follow-up": "email",
  proposal: "writing",
  "book-meeting": "meeting",
};

export function agentActivityType(a: { capabilities?: string[] }): string {
  return typeByCapability[a.capabilities?.[0] ?? ""] || "writing";
}
