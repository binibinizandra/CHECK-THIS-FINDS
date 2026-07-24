"use client";
import { useTransition } from "react";
import { approveLead, declineLead } from "@/lib/leads/actions";
import type { Lead } from "@/lib/leads/types";
import * as f from "@/components/profile/formStyles";

export default function PendingLeadCard({ lead, onResolved }: { lead: Lead; onResolved: (id: string) => void }) {
  const [pending, startTransition] = useTransition();

  function handleAccept() {
    onResolved(lead.id);
    startTransition(() => {
      approveLead(lead.id);
    });
  }

  function handleReject() {
    onResolved(lead.id);
    startTransition(() => {
      declineLead(lead.id);
    });
  }

  return (
    <div
      style={{
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-inputs)",
        padding: 14,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        opacity: pending ? 0.6 : 1,
      }}
    >
      <div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14.5, color: "var(--color-ink)" }}>
          {lead.name}
        </div>
        {(lead.company || lead.platform) && (
          <div style={{ fontFamily: "var(--font-body)", fontSize: 12.5, color: "var(--color-muted)" }}>
            {[lead.company, lead.platform].filter(Boolean).join(" · ")}
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
        <button type="button" onClick={handleAccept} disabled={pending} style={f.secondaryButton}>
          Accept
        </button>
        <button
          type="button"
          onClick={handleReject}
          disabled={pending}
          style={{ ...f.smallGhostButton, color: "var(--status-error)" }}
        >
          Reject
        </button>
      </div>
    </div>
  );
}
