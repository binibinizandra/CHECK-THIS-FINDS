import { currentUser, currentUserId } from "@/lib/auth/currentUser";
import { ensureUser } from "@/lib/users/store";
import { getAnalytics } from "@/lib/analytics/store";

export default async function AnalyticsPage() {
  const user = await currentUser();
  const userId = await currentUserId();
  if (userId) {
    await ensureUser(userId, user?.primaryEmailAddress?.emailAddress ?? null, user?.fullName ?? user?.firstName ?? null);
  }
  const data = userId
    ? await getAnalytics(userId)
    : { pitchesDrafted: 0, brandsWorked: 0, callsBooked: 0, perDay: [], perAgent: [] };

  const maxDay = Math.max(1, ...data.perDay.map((d) => d.count));
  const maxAgent = Math.max(1, ...data.perAgent.map((a) => a.count));

  const kpiStyle = {
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-cards)",
    padding: 20,
    flex: "1 1 160px",
  };

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "48px 26px 90px" }}>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: 26,
          letterSpacing: "-0.012em",
          margin: "0 0 6px",
          color: "var(--color-ink)",
        }}
      >
        Analytics
      </h1>
      <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--color-muted)", margin: "0 0 32px" }}>
        Real numbers on your brand deals — pitches drafted, brands worked, calls booked — and how each agent is
        contributing.
      </p>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 40 }}>
        {[
          { label: "Pitches drafted", value: data.pitchesDrafted },
          { label: "Brands worked", value: data.brandsWorked },
          { label: "Calls booked", value: data.callsBooked },
        ].map((k) => (
          <div key={k.label} style={kpiStyle}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 34, color: "var(--color-ink)" }}>
              {k.value}
            </div>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12.5,
                fontWeight: 600,
                letterSpacing: "0.03em",
                textTransform: "uppercase",
                color: "var(--color-muted)",
                marginTop: 4,
              }}
            >
              {k.label}
            </div>
            <div style={{ width: 24, height: 3, borderRadius: 2, background: "var(--color-accent)", marginTop: 10 }} />
          </div>
        ))}
      </div>

      <section style={{ marginBottom: 44 }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: 18,
            letterSpacing: "-0.01em",
            margin: "0 0 16px",
            color: "var(--color-ink)",
          }}
        >
          Last 14 days
        </h2>
        {data.perDay.every((d) => d.count === 0) ? (
          <div style={{ fontFamily: "var(--font-body)", fontSize: 13.5, color: "var(--color-muted)" }}>
            No activity yet in this window.
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 140 }}>
            {data.perDay.map((d) => (
              <div key={d.date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div
                  style={{
                    width: "100%",
                    height: Math.max(3, (d.count / maxDay) * 110),
                    background: d.count > 0 ? "var(--color-accent)" : "var(--color-border)",
                    borderRadius: 4,
                  }}
                  title={`${d.label}: ${d.count}`}
                />
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 9.5,
                    color: "var(--color-muted)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {d.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: 18,
            letterSpacing: "-0.01em",
            margin: "0 0 16px",
            color: "var(--color-ink)",
          }}
        >
          By agent
        </h2>
        {data.perAgent.length === 0 ? (
          <div style={{ fontFamily: "var(--font-body)", fontSize: 13.5, color: "var(--color-muted)" }}>
            No brands worked yet.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {data.perAgent.map((a) => (
              <div key={a.agentId} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--color-ink)",
                    width: 140,
                    flexShrink: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {a.agentName}
                </span>
                <div style={{ flex: 1, background: "var(--color-bg-alt)", borderRadius: 4, overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${Math.max(4, (a.count / maxAgent) * 100)}%`,
                      height: 10,
                      background: a.color,
                      borderRadius: 4,
                    }}
                  />
                </div>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--color-muted)", width: 24, textAlign: "right" }}>
                  {a.count}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
