"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { quickBookMeeting } from "@/lib/meetings/actions";
import type { Meeting } from "@/lib/meetings/store";
import type { AgentSummary } from "@/lib/agents/types";
import * as f from "@/components/profile/formStyles";

const YELLOW = "#FFC700";
const NAVY = "#0A192F";
const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}
function isSameDay(a: Date, b: Date): boolean {
  return dayKey(a) === dayKey(b);
}
function startOfWeek(d: Date): Date {
  const s = new Date(d);
  s.setDate(d.getDate() - d.getDay());
  s.setHours(0, 0, 0, 0);
  return s;
}

const cardStyle = {
  background: "#fff",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-cards)",
  padding: 18,
};

export default function CalendarPageClient({
  initialMeetings,
  agents,
}: {
  initialMeetings: Meeting[];
  agents: AgentSummary[];
}) {
  const [meetingList, setMeetingList] = useState(initialMeetings);
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [viewMonth, setViewMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [activeAgentIds, setActiveAgentIds] = useState<Set<string>>(() => new Set(agents.map((a) => a.id)));

  async function handleBook() {
    if (!text.trim() || pending) return;
    setPending(true);
    setMessage(null);
    const result = await quickBookMeeting(text);
    setMessage(result.message);
    if (result.ok && result.meeting) {
      const meeting = result.meeting;
      setMeetingList((prev) => [...prev, meeting].sort((a, b) => a.whenAt.localeCompare(b.whenAt)));
      setText("");
    }
    setPending(false);
  }

  function toggleAgent(id: string) {
    setActiveAgentIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function agentFor(id: string | null) {
    return id ? agents.find((a) => a.id === id) : undefined;
  }

  const visibleMeetings = useMemo(
    () => meetingList.filter((m) => !m.agentId || activeAgentIds.has(m.agentId)),
    [meetingList, activeAgentIds]
  );

  const meetingsByDay = useMemo(() => {
    const map = new Map<string, Meeting[]>();
    for (const m of visibleMeetings) {
      const key = dayKey(new Date(m.whenAt));
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(m);
    }
    return map;
  }, [visibleMeetings]);

  const today = new Date();

  const miniCells = useMemo(() => {
    const first = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
    const gridStart = startOfWeek(first);
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(gridStart);
      d.setDate(gridStart.getDate() + i);
      return d;
    });
  }, [viewMonth]);

  const weekDays = useMemo(() => {
    const start = startOfWeek(selectedDate);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [selectedDate]);

  function changeMonth(delta: number) {
    setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));
  }
  function changeWeek(delta: number) {
    setSelectedDate((d) => {
      const next = new Date(d);
      next.setDate(d.getDate() + delta * 7);
      setViewMonth(new Date(next.getFullYear(), next.getMonth(), 1));
      return next;
    });
  }
  function pickDay(d: Date) {
    setSelectedDate(d);
  }

  return (
    <div style={{ maxWidth: 1140, margin: "0 auto", padding: "48px 26px 90px" }}>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: 26,
          letterSpacing: "-0.012em",
          margin: "0 0 6px",
          color: NAVY,
        }}
      >
        Calendar
      </h1>
      <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--color-muted)", margin: "0 0 28px" }}>
        Every booked brand call, all in one place.
      </p>

      <div style={{ display: "flex", gap: 22, alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* Left panel */}
        <aside style={{ width: 260, flexShrink: 0, display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Mini month calendar */}
          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: NAVY }}>
                {viewMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </span>
              <div style={{ display: "flex", gap: 4 }}>
                <button type="button" onClick={() => changeMonth(-1)} aria-label="Previous month" style={miniNavBtn}>
                  ‹
                </button>
                <button type="button" onClick={() => changeMonth(1)} aria-label="Next month" style={miniNavBtn}>
                  ›
                </button>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
              {WEEKDAY_LABELS.map((w, i) => (
                <div
                  key={i}
                  style={{
                    textAlign: "center",
                    fontFamily: "var(--font-body)",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "var(--color-muted)",
                    padding: "2px 0 6px",
                  }}
                >
                  {w}
                </div>
              ))}
              {miniCells.map((d, i) => {
                const inMonth = d.getMonth() === viewMonth.getMonth();
                const isToday = isSameDay(d, today);
                const isSelected = isSameDay(d, selectedDate);
                const hasMeeting = meetingsByDay.has(dayKey(d));
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => pickDay(d)}
                    style={{
                      position: "relative",
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "var(--font-body)",
                      fontSize: 11.5,
                      fontWeight: isSelected || isToday ? 700 : 500,
                      color: isSelected ? YELLOW : isToday ? NAVY : inMonth ? NAVY : "var(--color-muted)",
                      background: isSelected ? NAVY : isToday ? "#FFF3B0" : "transparent",
                      opacity: inMonth ? 1 : 0.4,
                    }}
                  >
                    {d.getDate()}
                    {hasMeeting && !isSelected && (
                      <span
                        style={{
                          position: "absolute",
                          bottom: 2,
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: 4,
                          height: 4,
                          borderRadius: "50%",
                          background: YELLOW,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick book */}
          <div style={cardStyle}>
            <label style={{ ...f.label, marginBottom: 8 }}>Book a call in plain English</label>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleBook()}
              placeholder='"book a call with Acme next Tuesday at 2pm"'
              style={{ ...f.input, marginBottom: 10 }}
            />
            <button
              type="button"
              onClick={handleBook}
              disabled={pending || !text.trim()}
              style={{
                width: "100%",
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                fontSize: 14,
                color: NAVY,
                background: YELLOW,
                border: "none",
                borderRadius: "var(--radius-buttons)",
                padding: "10px 0",
                cursor: "pointer",
                opacity: pending || !text.trim() ? 0.5 : 1,
              }}
            >
              {pending ? "Booking…" : "Book"}
            </button>
            {message && (
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12.5, color: "var(--color-muted-2)", marginTop: 10 }}>
                {message}
              </div>
            )}
          </div>

          {/* Filters */}
          <div style={cardStyle}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: NAVY, marginBottom: 10 }}>
              Filters
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {agents.map((a) => (
                <label key={a.id} style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={activeAgentIds.has(a.id)}
                    onChange={() => toggleAgent(a.id)}
                    style={{ accentColor: a.color, margin: 0 }}
                  />
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: a.color, flexShrink: 0 }} />
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: NAVY }}>{a.name}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Week view */}
        <main style={{ flex: 1, minWidth: 320 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: NAVY }}>
              Week of {weekDays[0].toLocaleDateString("en-US", { month: "long", day: "numeric" })}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" onClick={() => changeWeek(-1)} style={f.smallGhostButton}>
                ← Prev
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedDate(new Date());
                  setViewMonth(new Date(today.getFullYear(), today.getMonth(), 1));
                }}
                style={f.smallGhostButton}
              >
                Today
              </button>
              <button type="button" onClick={() => changeWeek(1)} style={f.smallGhostButton}>
                Next →
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10 }}>
            {weekDays.map((d) => {
              const isToday = isSameDay(d, today);
              const dayMeetings = meetingsByDay.get(dayKey(d)) ?? [];
              return (
                <div key={dayKey(d)} style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
                  <div
                    style={{
                      textAlign: "center",
                      borderRadius: 10,
                      padding: "8px 4px",
                      background: isToday ? YELLOW : "var(--color-bg-alt)",
                    }}
                  >
                    <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 10, color: NAVY, opacity: 0.7 }}>
                      {d.toLocaleDateString("en-US", { weekday: "short" })}
                    </div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: NAVY }}>
                      {d.getDate()}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, minHeight: 60 }}>
                    {dayMeetings.map((m) => {
                      const agent = agentFor(m.agentId);
                      const color = agent?.color ?? "#94A3B8";
                      return (
                        <div
                          key={m.id}
                          style={{
                            background: `${color}1A`,
                            borderLeft: `3px solid ${color}`,
                            borderRadius: 8,
                            padding: "6px 8px",
                          }}
                        >
                          <div
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: 10,
                              fontWeight: 700,
                              color: NAVY,
                              opacity: 0.7,
                            }}
                          >
                            {new Date(m.whenAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                          </div>
                          <div
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: 11.5,
                              fontWeight: 600,
                              color: NAVY,
                              lineHeight: 1.3,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {m.title}
                          </div>
                          {m.leadId && (
                            <Link
                              href={`/deals/${m.leadId}`}
                              style={{ fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 600, color }}
                            >
                              View brand →
                            </Link>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}

const miniNavBtn = {
  width: 20,
  height: 20,
  borderRadius: 6,
  border: "none",
  background: "var(--color-bg-alt)",
  color: NAVY,
  cursor: "pointer",
  fontSize: 13,
  lineHeight: 1,
};
