"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import * as f from "@/components/profile/formStyles";
import { editAgent, toggleAgentPaused, deleteAgent } from "@/lib/agents/actions";
import { CAPABILITIES } from "@/lib/agentTypes";
import type { AgentSummary } from "@/lib/agents/types";

export default function AgentDetailClient({ agent: initial }: { agent: AgentSummary }) {
  const [agent, setAgent] = useState(initial);
  const [role, setRole] = useState(initial.role);
  const [goal, setGoal] = useState(initial.goal ?? "");
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  function handleSave() {
    setSaved(false);
    startTransition(async () => {
      await editAgent(agent.id, { role, goal });
      setAgent((a) => ({ ...a, role, goal }));
      setSaved(true);
    });
  }

  function handlePauseToggle() {
    const next = !agent.paused;
    setAgent((a) => ({ ...a, paused: next }));
    startTransition(() => {
      toggleAgentPaused(agent.id, next);
    });
  }

  function handleRemove() {
    startTransition(async () => {
      await deleteAgent(agent.id);
      router.push("/agents");
    });
  }

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "48px 26px 90px" }}>
      <Link href="/agents" style={{ fontFamily: "var(--font-body)", fontSize: 13.5, color: "var(--color-muted)" }}>
        ← Back to your team
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "18px 0 28px" }}>
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: "50%",
            background: agent.color,
            color: "#fff",
            fontWeight: 700,
            fontSize: 17,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {agent.initials}
        </div>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 22, color: "var(--color-ink)" }}>
            {agent.name}
          </div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 13.5, color: "var(--color-muted)" }}>
            {agent.capabilities.map((c) => CAPABILITIES.find((cap) => cap.id === c)?.label ?? c).join(" · ")}
          </div>
        </div>
      </div>

      <div style={f.fieldWrap}>
        <label style={f.label}>Role</label>
        <input value={role} onChange={(e) => setRole(e.target.value)} style={f.input} />
      </div>
      <div style={f.fieldWrap}>
        <label style={f.label}>Goal</label>
        <input
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          style={f.input}
          placeholder="What should this helper focus on?"
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 30 }}>
        <button type="button" onClick={handleSave} disabled={pending} style={f.primaryButton}>
          {pending ? "Saving…" : "Save changes"}
        </button>
        {saved && !pending && (
          <span style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--status-working)" }}>Saved.</span>
        )}
      </div>

      <div style={{ display: "flex", gap: 16, borderTop: "1px solid var(--color-border)", paddingTop: 20 }}>
        <button type="button" onClick={handlePauseToggle} style={f.secondaryButton}>
          {agent.paused ? "Resume this helper" : "Pause this helper"}
        </button>
        <button type="button" onClick={handleRemove} style={{ ...f.secondaryButton, color: "var(--status-error)" }}>
          Remove
        </button>
      </div>
    </div>
  );
}
