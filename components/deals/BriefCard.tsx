import type { LeadResearch } from "@/lib/leads/types";

const labelStyle = {
  fontFamily: "var(--font-body)",
  fontWeight: 600,
  fontSize: 12,
  letterSpacing: "0.02em",
  textTransform: "uppercase" as const,
  color: "var(--color-muted)",
  marginBottom: 6,
};

export default function BriefCard({ research }: { research: LeadResearch }) {
  return (
    <div
      style={{
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-cards)",
        padding: 18,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {research.summary && (
        <div style={{ fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.6, color: "var(--color-ink)" }}>
          {research.summary}
        </div>
      )}

      {!!research.priorities?.length && (
        <div>
          <div style={labelStyle}>What they'd want</div>
          <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 4 }}>
            {research.priorities.map((p, i) => (
              <li key={i} style={{ fontFamily: "var(--font-body)", fontSize: 13.5, color: "var(--color-muted-2)" }}>
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!!research.hooks?.length && (
        <div>
          <div style={labelStyle}>Hooks to use</div>
          <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 4 }}>
            {research.hooks.map((h, i) => (
              <li key={i} style={{ fontFamily: "var(--font-body)", fontSize: 13.5, color: "var(--color-muted-2)" }}>
                {h}
              </li>
            ))}
          </ul>
        </div>
      )}

      {research.angle && (
        <div>
          <div style={labelStyle}>Angle</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 13.5, color: "var(--color-muted-2)" }}>
            {research.angle}
          </div>
        </div>
      )}
    </div>
  );
}
