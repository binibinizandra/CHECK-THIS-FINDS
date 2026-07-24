"use client";
import { useTransition } from "react";
import Link from "next/link";
import { toggleAgentPaused, deleteAgent } from "@/lib/agents/actions";
import { CAPABILITIES } from "@/lib/agentTypes";
import type { AgentSummary } from "@/lib/agents/types";
import * as f from "@/components/profile/formStyles";

const STATUS_COLORS: Record<string, string> = {
  working: "var(--status-working)",
  waiting: "var(--status-waiting)",
  offline: "var(--status-offline)",
  error: "var(--status-error)",
};

export default function AgentCard({
  agent,
  onUpdated,
  onRemoved,
}: {
  agent: AgentSummary;
  onUpdated: (id: string, patch: Partial<AgentSummary>) => void;
  onRemoved: (id: string) => void;
}) {
  const [pending, startTransition] = useTransition();

  function handlePauseToggle() {
    const next = !agent.paused;
    onUpdated(agent.id, { paused: next });
    startTransition(() => {
      toggleAgentPaused(agent.id, next);
    });
  }

  function handleRemove() {
    onRemoved(agent.id);
    startTransition(() => {
      deleteAgent(agent.id);
    });
  }

  const capLabels = agent.capabilities.map((c) => CAPABILITIES.find((cap) => cap.id === c)?.label ?? c).join(" · ");

  return (
    <div
      style={{
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-cards)",
        padding: 18,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        opacity: agent.paused ? 0.6 : 1,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: agent.color,
            color: "#fff",
            fontWeight: 700,
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {agent.initials}
        </div>
        <div style={{ minWidth: 0 }}>
          <Link
            href={`/agents/${agent.id}`}
            style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15.5, color: "var(--color-ink)" }}
          >
            {agent.name}
          </Link>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--color-muted)" }}>{agent.role}</div>
        </div>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontSize: 11.5,
            fontWeight: 600,
            color: STATUS_COLORS[agent.status] ?? "var(--color-muted)",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", flexShrink: 0 }} />
          {agent.paused ? "Paused" : agent.status}
        </div>
      </div>

      <div style={{ fontFamily: "var(--font-body)", fontSize: 12.5, color: "var(--color-muted)" }}>{capLabels}</div>

      <div style={{ display: "flex", gap: 14, marginTop: 4 }}>
        <button type="button" onClick={handlePauseToggle} disabled={pending} style={f.smallGhostButton}>
          {agent.paused ? "Resume" : "Pause"}
        </button>
        <button
          type="button"
          onClick={handleRemove}
          disabled={pending}
          style={{ ...f.smallGhostButton, color: "var(--status-error)" }}
        >
          Remove
        </button>
      </div>
    </div>
  );
}
