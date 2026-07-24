"use client";
import { useEffect, useState } from "react";
import { av, statusMeta } from "@/lib/visuals";
import { DEMO_AGENTS, DEMO_STATS, DEMO_ACTIVITY, type DemoAgent, type WorkspaceStats, type ActivityItem } from "@/lib/demoDashboard";

const YELLOW = "#FFC700";
const NAVY = "#0A192F";

const cardStyle = {
  background: "#FFFFFF",
  borderRadius: 20,
  padding: 20,
  boxShadow: "0 8px 24px rgba(10,25,47,.08)",
};

const widgetTitle = {
  fontFamily: "var(--font-display)",
  fontWeight: 700,
  fontSize: 15,
  color: NAVY,
  marginBottom: 14,
};

export default function WidgetDashboard({
  agents: agentsProp,
  stats: statsProp,
  activity: activityProp,
}: {
  agents?: DemoAgent[];
  stats?: WorkspaceStats;
  activity?: ActivityItem[];
} = {}) {
  const [greeting, setGreeting] = useState("Good morning");
  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening");
  }, []);

  const agents = agentsProp ?? DEMO_AGENTS;
  const ws = statsProp ?? DEMO_STATS;
  const acts = activityProp ?? DEMO_ACTIVITY;
  const monthLabel = new Date().toLocaleString("en-US", { month: "long" });

  const badgeFor = (a: DemoAgent) => {
    const latest = acts.find((f) => f.agentId === a.id);
    if (latest) return latest.text;
    return a.status === "working" ? "Working…" : a.status === "waiting" ? "Waiting" : "Idle";
  };

  return (
    <div
      style={{
        background: "#FFFDE7",
        padding: "24px 26px",
        minHeight: "calc(100dvh - 64px)",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 400, color: NAVY }}>
        {greeting}! Here&apos;s your team at work.
      </div>

      {/* Hero widget */}
      <div
        style={{
          position: "relative",
          background: YELLOW,
          borderRadius: 24,
          padding: "30px 28px 34px",
          boxShadow: "0 14px 34px rgba(255,199,0,.4)",
        }}
      >
        <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13, color: NAVY, opacity: 0.7 }}>
          {monthLabel} summary
        </div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 44,
            color: NAVY,
            lineHeight: 1.1,
            marginTop: 4,
          }}
        >
          {ws.leadsWorked}
          <span style={{ fontSize: 16, fontWeight: 600, marginLeft: 10 }}>brands worked</span>
        </div>
        {ws.activeAgents > 0 && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              marginTop: 14,
              background: NAVY,
              color: YELLOW,
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: 12.5,
              borderRadius: 999,
              padding: "6px 14px",
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: YELLOW, animation: "pulse 2s infinite" }} />
            Working now — {ws.activeAgents} active, {ws.tasksRunning} tasks
          </div>
        )}

        {/* overlapping floating badge */}
        <div
          style={{
            position: "absolute",
            right: 28,
            bottom: -18,
            background: "#FFFFFF",
            borderRadius: 16,
            padding: "10px 16px",
            boxShadow: "0 10px 24px rgba(10,25,47,.16)",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex" }}>
            {agents.slice(0, 5).map((a, i) => (
              <div
                key={a.id}
                title={a.name}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: a.color,
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid #fff",
                  marginLeft: i === 0 ? 0 : -8,
                }}
              >
                {a.initials}
              </div>
            ))}
          </div>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 11.5, fontWeight: 600, color: NAVY, marginLeft: 8 }}>
            {agents.length} on your team
          </span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginTop: 6 }}>
        {/* Agent status widget */}
        <div style={cardStyle}>
          <div style={widgetTitle}>Agent status</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {agents.slice(0, 6).map((a) => {
              const m = statusMeta(a.status);
              return (
                <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", flexShrink: 0, background: a.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 12 }}>
                    {a.initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13, color: NAVY, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {a.name}
                    </div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 11.5, color: "#64748B", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {badgeFor(a)}
                    </div>
                  </div>
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: m.dot,
                      flexShrink: 0,
                      animation: a.status === "working" ? "pulse 2s infinite" : undefined,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick stats widget */}
        <div style={cardStyle}>
          <div style={widgetTitle}>Quick stats</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { label: "Active now", value: ws.activeAgents },
              { label: "Tasks running", value: ws.tasksRunning },
              { label: "Brands worked", value: ws.leadsWorked },
            ].map((s) => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#475569" }}>{s.label}</span>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 18,
                    color: NAVY,
                    background: "#FFF7CC",
                    borderRadius: 8,
                    padding: "2px 10px",
                  }}
                >
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Team activity widget */}
        <div style={cardStyle}>
          <div style={widgetTitle}>Team activity</div>
          {acts.length === 0 ? (
            <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#64748B" }}>Nothing yet.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {acts.slice(0, 5).map((act, i) => {
                const a = agents.find((ag) => ag.id === act.agentId);
                return (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0, marginTop: 1, background: a?.color ?? "#94A3B8", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 9.5 }}>
                      {a?.initials ?? "AI"}
                    </div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 12.5, lineHeight: 1.45, color: "#334155" }}>
                      <strong style={{ color: NAVY }}>{a?.name ?? "Agent"}</strong> {act.text}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
