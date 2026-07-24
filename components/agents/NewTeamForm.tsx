"use client";
import { useState, useTransition } from "react";
import * as f from "@/components/profile/formStyles";
import { addTeam } from "@/lib/agents/actions";
import type { AgentSummary, TeamSummary } from "@/lib/agents/types";

export default function NewTeamForm({
  agents,
  onCreated,
  onCancel,
}: {
  agents: AgentSummary[];
  onCreated: (t: TeamSummary) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [memberIds, setMemberIds] = useState<string[]>([]);
  const [pending, startTransition] = useTransition();

  function toggleMember(id: string) {
    setMemberIds((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]));
  }

  const canSubmit = Boolean(name.trim() && memberIds.length > 0);

  function handleSubmit() {
    if (!canSubmit) return;
    startTransition(async () => {
      const created = await addTeam({ name, description, goal, memberIds });
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
      <div style={f.fieldWrap}>
        <label style={f.label}>Team name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Launch Squad" style={f.input} />
      </div>
      <div style={f.fieldWrap}>
        <label style={f.label}>Description (optional)</label>
        <input value={description} onChange={(e) => setDescription(e.target.value)} style={f.input} />
      </div>
      <div style={f.fieldWrap}>
        <label style={f.label}>Goal (optional)</label>
        <input value={goal} onChange={(e) => setGoal(e.target.value)} style={f.input} />
      </div>
      <div style={f.fieldWrap}>
        <label style={f.label}>Members</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {agents.map((a) => (
            <label
              key={a.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "var(--font-body)",
                fontSize: 13.5,
                color: "var(--color-ink)",
                background: memberIds.includes(a.id) ? "var(--color-bg)" : "transparent",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-buttons)",
                padding: "6px 12px",
                cursor: "pointer",
              }}
            >
              <input type="checkbox" checked={memberIds.includes(a.id)} onChange={() => toggleMember(a.id)} style={{ margin: 0 }} />
              {a.name}
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
          {pending ? "Creating…" : "Create team"}
        </button>
        <button type="button" onClick={onCancel} style={f.secondaryButton}>
          Cancel
        </button>
      </div>
    </div>
  );
}
