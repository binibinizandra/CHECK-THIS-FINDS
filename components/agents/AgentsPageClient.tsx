"use client";
import { useState } from "react";
import type { AgentSummary, TeamSummary } from "@/lib/agents/types";
import AgentCard from "@/components/agents/AgentCard";
import TeamCard from "@/components/agents/TeamCard";
import NewAgentForm from "@/components/agents/NewAgentForm";
import NewTeamForm from "@/components/agents/NewTeamForm";
import * as f from "@/components/profile/formStyles";

export default function AgentsPageClient({
  initialAgents,
  initialTeams,
}: {
  initialAgents: AgentSummary[];
  initialTeams: TeamSummary[];
}) {
  const [agentList, setAgentList] = useState(initialAgents);
  const [teamList, setTeamList] = useState(initialTeams);
  const [showNewAgent, setShowNewAgent] = useState(false);
  const [showNewTeam, setShowNewTeam] = useState(false);

  function handleAgentCreated(a: AgentSummary) {
    setAgentList((prev) => [...prev, a]);
    setShowNewAgent(false);
  }
  function handleTeamCreated(t: TeamSummary) {
    setTeamList((prev) => [...prev, t]);
    setShowNewTeam(false);
  }
  function handleAgentUpdated(id: string, patch: Partial<AgentSummary>) {
    setAgentList((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }
  function handleAgentRemoved(id: string) {
    setAgentList((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: "48px 26px 90px" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6, gap: 12 }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: 26,
            letterSpacing: "-0.012em",
            margin: 0,
            color: "var(--color-ink)",
          }}
        >
          Your AI team
        </h1>
        <button type="button" onClick={() => setShowNewAgent((s) => !s)} style={f.secondaryButton}>
          {showNewAgent ? "Cancel" : "+ New agent"}
        </button>
      </div>
      <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--color-muted)", margin: "0 0 24px" }}>
        Five ready-made helpers cover a brand deal end to end — find, pitch, propose, follow up, book. Add your own for
        anything else you need.
      </p>

      {showNewAgent && (
        <div style={{ marginBottom: 28 }}>
          <NewAgentForm onCreated={handleAgentCreated} onCancel={() => setShowNewAgent(false)} />
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 16,
          marginBottom: 52,
        }}
      >
        {agentList.map((a) => (
          <AgentCard key={a.id} agent={a} onUpdated={handleAgentUpdated} onRemoved={handleAgentRemoved} />
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6, gap: 12 }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: 20,
            letterSpacing: "-0.01em",
            margin: 0,
            color: "var(--color-ink)",
          }}
        >
          Teams
        </h2>
        <button type="button" onClick={() => setShowNewTeam((s) => !s)} style={f.secondaryButton}>
          {showNewTeam ? "Cancel" : "+ New team"}
        </button>
      </div>
      <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--color-muted)", margin: "0 0 24px" }}>
        Group agents together to work your brands as a pod.
      </p>

      {showNewTeam && (
        <div style={{ marginBottom: 28 }}>
          <NewTeamForm agents={agentList} onCreated={handleTeamCreated} onCancel={() => setShowNewTeam(false)} />
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
        {teamList.map((t) => (
          <TeamCard key={t.id} team={t} agents={agentList} />
        ))}
      </div>
    </div>
  );
}
