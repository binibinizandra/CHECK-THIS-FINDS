import type { AgentStatus, CapabilityId } from "@/lib/agentTypes";

export interface AgentSummary {
  id: string;
  name: string;
  initials: string;
  role: string;
  color: string;
  status: AgentStatus;
  task: string | null;
  goal: string | null;
  capabilities: CapabilityId[];
  type: string;
  paused: boolean;
}

export interface TeamSummary {
  id: string;
  name: string;
  icon: string | null;
  iconBg: string | null;
  description: string | null;
  goal: string | null;
  memberIds: string[];
  template: string | null;
}
