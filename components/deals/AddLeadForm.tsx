"use client";
import { useState, useTransition } from "react";
import * as f from "@/components/profile/formStyles";
import { addLead } from "@/lib/leads/actions";
import type { Lead } from "@/lib/leads/types";
import type { AgentSummary } from "@/lib/agents/types";

export default function AddLeadForm({
  agents,
  onAdded,
  onCancel,
}: {
  agents: AgentSummary[];
  onAdded: (lead: Lead) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [platform, setPlatform] = useState("");
  const [agentId, setAgentId] = useState("");
  const [pending, startTransition] = useTransition();

  const canSubmit = Boolean(name.trim());

  function handleSubmit() {
    if (!canSubmit) return;
    startTransition(async () => {
      const created = await addLead({ name, company, email, platform, agentId: agentId || null });
      if (created) {
        onAdded(created);
        setName("");
        setCompany("");
        setEmail("");
        setPlatform("");
        setAgentId("");
      }
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
          <label style={f.label}>Brand name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Acme Outdoor" style={f.input} />
        </div>
        <div>
          <label style={f.label}>Company (optional)</label>
          <input value={company} onChange={(e) => setCompany(e.target.value)} style={f.input} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <div>
          <label style={f.label}>Email (optional)</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contact@brand.com" style={f.input} />
        </div>
        <div>
          <label style={f.label}>Platform (optional)</label>
          <input value={platform} onChange={(e) => setPlatform(e.target.value)} placeholder="e.g. TikTok" style={f.input} />
        </div>
      </div>
      <div style={f.fieldWrap}>
        <label style={f.label}>Assign to (optional)</label>
        <select value={agentId} onChange={(e) => setAgentId(e.target.value)} style={f.input}>
          <option value="">Unassigned</option>
          {agents.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={pending || !canSubmit}
          style={{ ...f.primaryButton, opacity: pending || !canSubmit ? 0.5 : 1 }}
        >
          {pending ? "Adding…" : "Add brand"}
        </button>
        <button type="button" onClick={onCancel} style={f.secondaryButton}>
          Cancel
        </button>
      </div>
    </div>
  );
}
