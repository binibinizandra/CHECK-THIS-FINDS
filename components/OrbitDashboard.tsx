"use client";
import { useEffect, useState } from "react";
import { css, Box } from "@/components/primitives";
import { av, hubIcon, statusMeta } from "@/lib/visuals";
import { agentActivityType, CAPABILITIES } from "@/lib/agentTypes";
import {
  DEMO_AGENTS,
  DEMO_TEAMS,
  DEMO_STATS,
  DEMO_ACTIVITY,
  type DemoAgent,
  type DemoTeam,
  type WorkspaceStats,
  type ActivityItem,
} from "@/lib/demoDashboard";

const hubIcons: Record<string, [string, string]> = {
  email: ["iconFly 2.6s ease-in-out infinite", "#0EA5E9"],
  call: ["iconRing 1.6s ease-in-out infinite", "#2FA45C"],
  research: ["iconSwing 2.4s ease-in-out infinite", "#F59E0B"],
  writing: ["iconPop 2.4s ease-in-out infinite", "#5122C1"],
  meeting: ["iconPop 2.8s ease-in-out infinite", "#F43F7E"],
  analytics: ["iconPop 3s ease-in-out infinite", "#8B5CF6"],
  idle: ["breathe 3s ease-in-out infinite", "#8A8A94"],
  alert: ["iconPop 1.8s ease-in-out infinite", "#EF4444"],
};

// The ring's gradient border cycles through every agent color plus the accent,
// so the "orbit path" itself hints at the whole team even before you look at the nodes.
const RING_GRADIENT =
  "conic-gradient(from 0deg, rgba(255,59,48,.5), rgba(34,197,94,.4), rgba(107,33,168,.4), rgba(100,116,139,.4), rgba(229,169,60,.4), rgba(242,141,155,.4), rgba(255,59,48,.5))";

export default function OrbitDashboard({
  agents: agentsProp,
  teams: teamsProp,
  stats: statsProp,
  activity: activityProp,
}: {
  agents?: DemoAgent[];
  teams?: DemoTeam[];
  stats?: WorkspaceStats;
  activity?: ActivityItem[];
} = {}) {
  const [hubTeam, setHubTeam] = useState("all");
  const [dims, setDims] = useState({ w: 1280, h: 800 });
  const [reduced, setReduced] = useState(false);
  const [greeting, setGreeting] = useState("Good morning");
  const [tick, setTick] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const agents = agentsProp ?? DEMO_AGENTS;
  const teams = teamsProp ?? DEMO_TEAMS;
  const ws = statsProp ?? DEMO_STATS;
  const acts = activityProp ?? DEMO_ACTIVITY;
  const paMap = new Map(ws.perAgent.map((p) => [p.agentId, p]));
  const maxOut = Math.max(1, ...ws.perAgent.map((p) => p.leadsWorked));

  useEffect(() => {
    const on = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening");
  }, []);
  useEffect(() => {
    const hub = setInterval(() => setTick((t) => t + 1), 3200);
    return () => clearInterval(hub);
  }, []);

  const hubMembers = (
    hubTeam === "all"
      ? agents.slice(0, 8)
      : ((teams.find((t) => t.id === hubTeam) || teams[0])?.memberIds ?? []).map((id) => agents.find((a) => a.id === id))
  ).filter(Boolean) as DemoAgent[];
  const HN = Math.max(hubMembers.length, 1);
  const nodes = hubMembers.map((a, i) => {
    const ang = ((-90 + (i * 360) / HN) * Math.PI) / 180;
    const x = Math.round(380 + Math.cos(ang) * 272);
    const y = Math.round(262 + Math.sin(ang) * 186);
    const type = agentActivityType(a);
    const ic = hubIcons[type];
    const m = statusMeta(a.status);
    const latest = acts.find((f) => f.agentId === a.id);
    const pct = Math.round(((paMap.get(a.id)?.leadsWorked ?? 0) / maxOut) * 100);
    return {
      a,
      i,
      x,
      y,
      m,
      ic,
      type,
      pct,
      badge: latest ? latest.text.slice(0, 40) : a.status === "working" ? "Working…" : "Idle",
      badgeFull: latest ? latest.text : a.status === "working" ? "Working…" : "Idle",
    };
  });
  const collabs = HN >= 5 ? [[0, 2], [1, 4]] : [];

  const hubWorking = ws.activeAgents;
  const leadsWorked = ws.leadsWorked;
  const tasksRunning = ws.tasksRunning;
  const monthLabel = new Date().toLocaleString("en-US", { month: "long" }).toUpperCase();

  const actLine = (f?: { agentId: string; text: string }) =>
    f ? (agents.find((a) => a.id === f.agentId)?.name ?? "Agent") + " " + f.text : "";
  const hubLive = actLine(acts[0]).slice(0, 90);
  const hubLive2 = actLine(acts[1]).slice(0, 90);

  const hubCardW = dims.w - 52 - 2;
  const hubScale = Math.max(0.7, Math.min((dims.h - 250) / 524, (hubCardW - 40) / 760, 1.45));
  const teamPills = [{ id: "all", label: "Everyone" }].concat(teams.map((t) => ({ id: t.id, label: t.name })));

  return (
    <div style={css("padding:24px 26px;display:flex;flex-direction:column;gap:18px;animation:fadeUp .3s ease")}>
      <div style={css("display:flex;align-items:baseline;gap:12px")}>
        <div
          style={css(
            "font-family:var(--font-display);font-size:22px;font-weight:400;letter-spacing:-.01em;white-space:nowrap;color:var(--color-ink)"
          )}
        >
          {greeting}! Here's your team at work.
        </div>
      </div>

      <div
        style={css(
          "position:relative;background:var(--color-surface-dark);border:1px solid rgba(11,27,61,.06);border-radius:var(--radius-cards);height:calc(100dvh - 178px);min-height:540px;overflow:hidden;box-shadow:var(--shadow-xl)"
        )}
      >
        {/* ambient background glow — soft, low-opacity color pools tucked in opposite corners */}
        <div
          style={css(
            "position:absolute;top:-90px;left:-90px;width:340px;height:340px;border-radius:50%;background:var(--color-accent);filter:blur(90px);opacity:.1;pointer-events:none;z-index:0"
          )}
        />
        <div
          style={css(
            "position:absolute;bottom:-90px;right:-90px;width:340px;height:340px;border-radius:50%;background:#E5A93C;filter:blur(90px);opacity:.1;pointer-events:none;z-index:0"
          )}
        />

        {/* twinkling sparkles — decorative only, tucked into empty corners */}
        {[
          { x: "8%", y: "42%", size: 14, delay: 0, dur: 3.4, color: "var(--color-accent)" },
          { x: "93%", y: "38%", size: 10, delay: 0.8, dur: 4, color: "#E5A93C" },
          { x: "6%", y: "74%", size: 9, delay: 1.6, dur: 3.8, color: "var(--color-ink)" },
          { x: "94%", y: "70%", size: 12, delay: 0.4, dur: 3.2, color: "#E5A93C" },
          { x: "50%", y: "6%", size: 8, delay: 1.2, dur: 4.4, color: "var(--color-accent)" },
        ].map((s, i) => (
          <svg
            key={i}
            width={s.size}
            height={s.size}
            viewBox="0 0 24 24"
            style={{
              position: "absolute",
              left: s.x,
              top: s.y,
              opacity: 0.2,
              animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
              pointerEvents: "none",
              zIndex: 1,
            }}
          >
            <path d="M12 0 14.2 9.8 24 12 14.2 14.2 12 24 9.8 14.2 0 12 9.8 9.8Z" fill={s.color} />
          </svg>
        ))}

        <div style={css("position:absolute;top:16px;left:20px;right:150px;display:flex;gap:8px;z-index:3;flex-wrap:wrap")}>
          {teamPills.map((p) => (
            <Box
              key={p.id}
              onClick={() => setHubTeam(p.id)}
              style={
                "font-size:11.5px;font-weight:600;border-radius:var(--radius-buttons);padding:5px 13px;cursor:pointer;transition:all .12s;backdrop-filter:blur(6px);" +
                (hubTeam === p.id
                  ? "background:var(--color-accent);color:var(--color-surface-dark);border:1px solid var(--color-accent)"
                  : "background:rgba(11,27,61,.06);color:var(--color-on-dark);border:1px solid rgba(11,27,61,.12)")
              }
              styleHover="border-color:var(--color-accent)"
            >
              {p.label}
            </Box>
          ))}
        </div>
        {hubWorking > 0 && (
          <div
            style={css(
              "position:absolute;top:16px;right:20px;display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:#146C43;background:rgba(46,164,92,.14);border:1px solid rgba(20,108,67,.3);border-radius:var(--radius-buttons);padding:4px 12px;z-index:3;backdrop-filter:blur(6px)"
            )}
          >
            <span style={css("width:6px;height:6px;border-radius:50%;background:#2FA45C;animation:pulse 2s infinite")} />
            Working now
          </div>
        )}

        <div
          style={css(
            "position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) scale(" +
              hubScale.toFixed(3) +
              ");width:760px;height:524px"
          )}
        >
          {/* orbit path rings — soft gradient border + glass fill */}
          <div
            style={css(
              "position:absolute;left:380px;top:262px;width:560px;height:380px;transform:translate(-50%,-50%);border-radius:50%;padding:1.5px;background:" +
                RING_GRADIENT
            )}
          >
            <div style={css("width:100%;height:100%;border-radius:50%;background:rgba(255,255,255,.55);backdrop-filter:blur(10px)")} />
          </div>
          <div
            style={css(
              "position:absolute;left:380px;top:262px;width:400px;height:270px;transform:translate(-50%,-50%);border-radius:50%;padding:1.5px;background:" +
                RING_GRADIENT
            )}
          >
            <div style={css("width:100%;height:100%;border-radius:50%;background:rgba(255,255,255,.4);backdrop-filter:blur(8px)")} />
          </div>

          <svg width="760" height="524" viewBox="0 0 760 524" style={{ position: "absolute", left: 0, top: 0 }}>
            <defs>
              <linearGradient id="spokeGradient" gradientUnits="userSpaceOnUse" x1="380" y1="262" x2="380" y2="0">
                <stop offset="0%" stopColor="rgba(255,59,48,.35)" />
                <stop offset="100%" stopColor="rgba(11,27,61,.12)" />
              </linearGradient>
            </defs>
            {nodes.map((n) => (
              <line
                key={"l" + n.i}
                x1="380"
                y1="262"
                x2={n.x}
                y2={n.y}
                stroke="url(#spokeGradient)"
                strokeWidth="1.5"
                strokeDasharray="3 7"
                style={{ animation: "dashMove 1.8s linear infinite" }}
              />
            ))}
            {!reduced &&
              nodes.map((n) => (
                <circle key={"p" + n.i} r="2.6" fill="var(--color-accent)" opacity="0.9">
                  <animateMotion
                    dur={2.4 + (n.i % 4) * 0.6 + "s"}
                    begin={n.i * 0.4 + "s"}
                    repeatCount="indefinite"
                    path={"M" + n.x + " " + n.y + " L380 262"}
                  />
                </circle>
              ))}
            {collabs.map((c, i) => (
              <line
                key={"c" + i}
                x1={nodes[c[0]].x}
                y1={nodes[c[0]].y}
                x2={nodes[c[1]].x}
                y2={nodes[c[1]].y}
                stroke="rgba(255,59,48,.45)"
                strokeWidth="1.5"
                strokeDasharray="2 6"
                style={{ animation: "dashMove 1.2s linear infinite" }}
              />
            ))}
          </svg>

          <div
            style={css(
              "position:absolute;left:380px;top:262px;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;gap:10px;z-index:2"
            )}
          >
            <div style={css("position:relative;width:124px;height:124px;display:flex;align-items:center;justify-content:center")}>
              <div
                style={css(
                  "position:absolute;left:0;top:0;right:0;bottom:0;border-radius:50%;border:2px solid rgba(255,59,48,.45);animation:ringPulse 3s ease-out infinite"
                )}
              />
              <div
                style={css(
                  "position:absolute;left:0;top:0;right:0;bottom:0;border-radius:50%;border:2px solid rgba(255,59,48,.45);animation:ringPulse 3s ease-out 1.5s infinite"
                )}
              />
              <div
                style={css(
                  "width:124px;height:124px;border-radius:50%;background:#FF3B30;border:5px solid #FFFFFF;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;box-shadow:0 0 26px rgba(255,59,48,.35)"
                )}
              >
                <div
                  style={css(
                    "font-family:var(--font-display);font-size:24px;font-weight:700;color:#FFFFFF;line-height:1"
                  )}
                >
                  {leadsWorked}
                </div>
                <div
                  style={css(
                    "font-size:8.5px;font-weight:700;letter-spacing:.1em;color:#FFFFFF;margin-top:4px;text-align:center;line-height:1.4"
                  )}
                >
                  BRANDS WORKED
                  <br />
                  {monthLabel}
                </div>
              </div>
            </div>
            <div style={css("display:flex;gap:8px")}>
              <div
                style={css(
                  "display:inline-flex;align-items:center;gap:5px;font-size:10.5px;font-weight:600;color:var(--color-on-dark);background:rgba(11,27,61,.06);border:1px solid rgba(11,27,61,.1);border-radius:var(--radius-buttons);padding:4px 11px;backdrop-filter:blur(6px)"
                )}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="var(--color-accent)" style={{ flex: "none" }} aria-hidden="true">
                  <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
                </svg>
                {hubWorking} working · {tasksRunning} tasks
              </div>
            </div>
          </div>

          {nodes.map((n) => (
            <Box
              key={n.a.id}
              aria-label={n.a.name}
              style={
                "position:absolute;left:" +
                n.x +
                "px;top:" +
                n.y +
                "px;transform:translate(-50%,-50%);width:170px;display:flex;flex-direction:column;align-items:center;z-index:2"
              }
              noButton
            >
              <div
                onMouseEnter={() => setHoveredId(n.a.id)}
                onMouseLeave={() => setHoveredId((id) => (id === n.a.id ? null : id))}
                style={{
                  position: "relative",
                  ...css(
                    "display:flex;flex-direction:column;align-items:center;gap:6px;animation:floaty " +
                      (5 + (n.i % 3)) +
                      "s ease-in-out " +
                      (n.i * 0.45).toFixed(2) +
                      "s infinite"
                  ),
                }}
              >
                {hoveredId === n.a.id && (
                  <div
                    style={css(
                      (n.y < 262 ? "top:100%;margin-top:10px;" : "bottom:100%;margin-bottom:10px;") +
                        "position:absolute;left:50%;transform:translateX(-50%);width:200px;background:var(--color-bg);border:1px solid var(--color-border);border-radius:var(--radius-inputs);box-shadow:var(--shadow-xl);padding:14px;z-index:5;text-align:left;pointer-events:none"
                    )}
                  >
                    <div style={css("display:flex;align-items:center;gap:9px;margin-bottom:8px")}>
                      <div style={css(av(n.a, 30))}>{n.a.initials}</div>
                      <div style={css("min-width:0")}>
                        <div style={css("font-size:13px;font-weight:700;color:var(--color-ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>
                          {n.a.name}
                        </div>
                        <div style={css("font-size:11px;font-weight:600;color:" + n.m.color)}>{n.m.label}</div>
                      </div>
                    </div>
                    <div style={css("font-size:11.5px;color:var(--color-muted);margin-bottom:6px")}>
                      {n.a.capabilities.map((c) => CAPABILITIES.find((cap) => cap.id === c)?.label ?? c).join(" · ")}
                    </div>
                    <div style={css("font-size:11.5px;color:var(--color-muted-2);line-height:1.4;margin-bottom:6px")}>
                      {n.badgeFull}
                    </div>
                    <div style={css("font-size:10.5px;font-weight:600;color:" + n.a.color)}>
                      {paMap.get(n.a.id)?.leadsWorked ?? 0} brands worked this month
                    </div>
                  </div>
                )}

                <div style={css("position:relative")}>
                  {n.a.status === "working" && (
                    <>
                      <div
                        style={css(
                          "position:absolute;left:0;top:0;right:0;bottom:0;border-radius:50%;border:2px solid " +
                            n.a.color +
                            "88;animation:ringPulse 2.6s ease-out infinite"
                        )}
                      />
                      <div
                        style={css(
                          "position:absolute;left:0;top:0;right:0;bottom:0;border-radius:50%;border:2px solid " +
                            n.a.color +
                            "88;animation:ringPulse 2.6s ease-out 1.3s infinite"
                        )}
                      />
                    </>
                  )}
                  <div
                    style={css(
                      "width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:conic-gradient(" +
                        n.a.color +
                        " " +
                        n.pct +
                        "%,rgba(11,27,61,.1) 0)"
                    )}
                  >
                    <div style={css("width:56px;height:56px;border-radius:50%;background:var(--color-surface-dark);display:flex;align-items:center;justify-content:center")}>
                      <div style={css("padding:3px;border-radius:50%;background:#fff;box-shadow:0 0 22px " + n.a.color + "66")}>
                        <div style={css(av(n.a, 42) + ";border:2px solid var(--color-surface-dark)")}>{n.a.initials}</div>
                      </div>
                    </div>
                  </div>
                  <div
                    style={css(
                      "position:absolute;top:-8px;right:-10px;width:22px;height:22px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 10px rgba(0,0,0,.35);animation:" +
                        n.ic[0]
                    )}
                  >
                    <span style={css(hubIcon(n.type, n.ic[1]))} />
                  </div>
                </div>
                <div style={css("display:flex;align-items:center;gap:5px;margin-top:2px")}>
                  <span
                    style={css(
                      "width:7px;height:7px;border-radius:50%;background:" +
                        n.m.dot +
                        ";flex:none;" +
                        (n.a.status === "working" ? "animation:pulse 2s infinite" : "")
                    )}
                  />
                  <span style={css("font-size:12px;font-weight:700;color:var(--color-on-dark)")}>{n.a.name}</span>
                </div>
                <div
                  style={css(
                    "display:flex;align-items:center;gap:6px;font-size:10.5px;font-weight:600;color:var(--color-on-dark);background:rgba(11,27,61,.06);border:1px solid rgba(11,27,61,.1);backdrop-filter:blur(6px);border-radius:var(--radius-buttons);padding:4px 10px;white-space:nowrap;max-width:168px;overflow:hidden;text-overflow:ellipsis;animation:" +
                      (tick % 2 ? "badgePopA" : "badgePopB") +
                      " .4s ease"
                  )}
                >
                  <span>{n.badge}</span>
                </div>
              </div>
            </Box>
          ))}
        </div>

        <div
          style={css(
            "position:absolute;left:18%;bottom:30%;width:5px;height:5px;border-radius:50%;background:rgba(255,59,48,.6);animation:rise 7s ease-in-out infinite"
          )}
        />
        <div
          style={css(
            "position:absolute;left:72%;bottom:24%;width:4px;height:4px;border-radius:50%;background:rgba(91,107,140,.4);animation:rise 9s ease-in-out 2s infinite"
          )}
        />
        <div
          style={css(
            "position:absolute;left:48%;bottom:18%;width:3px;height:3px;border-radius:50%;background:rgba(255,111,97,.55);animation:rise 8s ease-in-out 4s infinite"
          )}
        />
        <div
          style={css(
            "position:absolute;left:85%;bottom:55%;width:4px;height:4px;border-radius:50%;background:rgba(255,59,48,.4);animation:rise 10s ease-in-out 1s infinite"
          )}
        />

        <div style={css("position:absolute;bottom:16px;left:20px;display:flex;flex-direction:column;align-items:flex-start;gap:6px;z-index:3;max-width:70%")}>
          <div
            style={css(
              "display:flex;align-items:center;gap:7px;font-size:11px;font-weight:600;color:var(--color-on-dark-muted);background:rgba(11,27,61,.04);border:1px solid rgba(11,27,61,.08);border-radius:var(--radius-buttons);padding:5px 13px;backdrop-filter:blur(8px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;opacity:.75"
            )}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="var(--color-on-dark-muted)" style={{ flex: "none" }} aria-hidden="true">
              <path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3L12 3Z" />
            </svg>
            {hubLive2}
          </div>
          <div
            style={css(
              "display:flex;align-items:center;gap:7px;font-size:11px;font-weight:600;color:var(--color-on-dark);background:rgba(11,27,61,.06);border:1px solid rgba(11,27,61,.1);border-radius:var(--radius-buttons);padding:5px 13px;backdrop-filter:blur(8px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%"
            )}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="var(--color-accent)" style={{ flex: "none" }} aria-hidden="true">
              <path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3L12 3Z" />
            </svg>
            {hubLive}
          </div>
        </div>
      </div>
    </div>
  );
}
