"use client";
import { useState, useTransition } from "react";
import * as f from "@/components/profile/formStyles";
import { CAPABILITIES } from "@/lib/agentTypes";
import type { CapabilityId } from "@/lib/agentTypes";
import { addAgent } from "@/lib/agents/actions";
import type { AgentSummary } from "@/lib/agents/types";

const COLOR_CHOICES = ["#FF3B30", "#22C55E", "#F28D9B", "#6B21A8", "#E5A93C", "#64748B", "#0B1B3D", "#2FA45C"];

export default function NewAgentForm({
  onCreated,
  onCancel,
}: {
  onCreated: (a: AgentSummary) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [goal, setGoal] = useState("");
  const [color, setColor] = useState(COLOR_CHOICES[0]);
  const [caps, setCaps] = useState<CapabilityId[]>([]);
  const [pending, startTransition] = useTransition();

  function toggleCap(id: CapabilityId) {
    setCaps((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  }

  const canSubmit = Boolean(name.trim() && role.trim() && caps.length > 0);

  function handleSubmit() {
    if (!canSubmit) return;
    startTransition(async () => {
      const created = await addAgent({ name, role, goal, color, capabilities: caps });
      if (created) onCreated(created);
    });
  }

  return (
    <div
      style={{
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-cards)",
        padding: 20,
        background: "var(--color-bg-alt)",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <div>
          <label style={f.label}>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Jordan Lee" style={f.input} />
        </div>
        <div>
          <label style={f.label}>Role</label>
          <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Content ideas" style={f.input} />
        </div>
      </div>
      <div style={f.fieldWrap}>
        <label style={f.label}>Goal (optional)</label>
        <input
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="What should this helper focus on?"
          style={f.input}
        />
      </div>
      <div style={f.fieldWrap}>
        <label style={f.label}>Color</label>
        <div style={{ display: "flex", gap: 8 }}>
          {COLOR_CHOICES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              aria-label={c}
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                background: c,
                border: color === c ? "2px solid var(--color-ink)" : "2px solid transparent",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      </div>
      <div style={f.fieldWrap}>
        <label style={f.label}>What can this helper do?</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {CAPABILITIES.map((c) => (
            <label
              key={c.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "var(--font-body)",
                fontSize: 13.5,
                color: "var(--color-ink)",
                background: caps.includes(c.id) ? "var(--color-bg)" : "transparent",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-buttons)",
                padding: "6px 12px",
                cursor: "pointer",
              }}
            >
              <input type="checkbox" checked={caps.includes(c.id)} onChange={() => toggleCap(c.id)} style={{ margin: 0 }} />
              {c.label}
            </label>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={pending || !canSubmit}
          style={{ ...f.primaryButton, opacity: pending || !canSubmit ? 0.5 : 1 }}
        >
          {pending ? "Creating…" : "Create agent"}
        </button>
        <button type="button" onClick={onCancel} style={f.secondaryButton}>
          Cancel
        </button>
      </div>
    </div>
  );
}
