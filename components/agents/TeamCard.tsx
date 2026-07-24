import type { AgentSummary, TeamSummary } from "@/lib/agents/types";

export default function TeamCard({ team, agents }: { team: TeamSummary; agents: AgentSummary[] }) {
  const members = team.memberIds.map((id) => agents.find((a) => a.id === id)).filter(Boolean) as AgentSummary[];

  return (
    <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-cards)", padding: 18 }}>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: 15.5,
          color: "var(--color-ink)",
          marginBottom: 4,
        }}
      >
        {team.name}
      </div>
      {team.description && (
        <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--color-muted)", marginBottom: 10 }}>
          {team.description}
        </div>
      )}
      <div style={{ display: "flex", marginLeft: 4, marginTop: 8 }}>
        {members.map((m) => (
          <div
            key={m.id}
            title={m.name}
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: m.color,
              color: "#fff",
              fontWeight: 700,
              fontSize: 11,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: -4,
              border: "2px solid var(--color-bg)",
            }}
          >
            {m.initials}
          </div>
        ))}
      </div>
    </div>
  );
}
