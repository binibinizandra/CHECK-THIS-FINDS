"use client";
import { useTransition } from "react";
import Link from "next/link";
import { moveLeadStage, assignLeadAgent } from "@/lib/leads/actions";
import { STAGES } from "@/lib/leads/types";
import type { Lead, LeadStatus } from "@/lib/leads/types";
import type { AgentSummary } from "@/lib/agents/types";

export default function LeadCard({
  lead,
  agents,
  onStageChange,
  onAgentChange,
}: {
  lead: Lead;
  agents: AgentSummary[];
  onStageChange: (id: string, status: LeadStatus) => void;
  onAgentChange: (id: string, agentId: string | null) => void;
}) {
  const [pending, startTransition] = useTransition();
  const agent = agents.find((a) => a.id === lead.agentId);

  function handleStage(status: LeadStatus) {
    onStageChange(lead.id, status);
    startTransition(() => {
      moveLeadStage(lead.id, status);
    });
  }

  function handleAgent(agentId: string) {
    onAgentChange(lead.id, agentId || null);
    startTransition(() => {
      assignLeadAgent(lead.id, agentId || null);
    });
  }

  return (
    <div
      style={{
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-inputs)",
        padding: 14,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        opacity: pending ? 0.7 : 1,
        background: "var(--color-bg)",
      }}
    >
      <Link
        href={`/deals/${lead.id}`}
        style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14.5, color: "var(--color-ink)" }}
      >
        {lead.name}
      </Link>
      {(lead.company || lead.platform) && (
        <div style={{ fontFamily: "var(--font-body)", fontSize: 12.5, color: "var(--color-muted)" }}>
          {[lead.company, lead.platform].filter(Boolean).join(" · ")}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
        <select
          value={lead.status}
          onChange={(e) => handleStage(e.target.value as LeadStatus)}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12.5,
            color: "var(--color-ink)",
            background: "var(--color-bg-alt-2)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-inputs)",
            padding: "6px 8px",
          }}
        >
          {STAGES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>

        <select
          value={lead.agentId ?? ""}
          onChange={(e) => handleAgent(e.target.value)}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12.5,
            color: "var(--color-ink)",
            background: "var(--color-bg-alt-2)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-inputs)",
            padding: "6px 8px",
          }}
        >
          <option value="">Unassigned</option>
          {agents.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      {agent && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: agent.color,
              color: "#fff",
              fontSize: 8.5,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {agent.initials}
          </div>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 11.5, color: "var(--color-muted)" }}>{agent.name}</span>
        </div>
      )}
    </div>
  );
}
