"use client";
import { useState } from "react";
import { STAGES } from "@/lib/leads/types";
import type { Lead, LeadStatus } from "@/lib/leads/types";
import type { AgentSummary } from "@/lib/agents/types";
import LeadCard from "@/components/deals/LeadCard";
import PendingLeadCard from "@/components/deals/PendingLeadCard";
import AddLeadForm from "@/components/deals/AddLeadForm";
import CsvImportButton from "@/components/deals/CsvImportButton";
import DiscoverBrandsButton from "@/components/deals/DiscoverBrandsButton";
import * as f from "@/components/profile/formStyles";

export default function DealsPageClient({
  initialLeads,
  initialPending,
  agents,
}: {
  initialLeads: Lead[];
  initialPending: Lead[];
  agents: AgentSummary[];
}) {
  const [leadList, setLeadList] = useState(initialLeads);
  const [pendingList, setPendingList] = useState(initialPending);
  const [showAddForm, setShowAddForm] = useState(false);

  function handleAdded(lead: Lead) {
    setLeadList((prev) => [lead, ...prev]);
    setShowAddForm(false);
  }
  function handleImported(added: Lead[]) {
    setLeadList((prev) => [...added, ...prev]);
  }
  function handleStageChange(id: string, status: LeadStatus) {
    setLeadList((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  }
  function handleAgentChange(id: string, agentId: string | null) {
    setLeadList((prev) => prev.map((l) => (l.id === id ? { ...l, agentId } : l)));
  }
  function handlePendingResolved(id: string) {
    setPendingList((prev) => prev.filter((l) => l.id !== id));
  }
  function handleDiscovered(discovered: Lead[]) {
    setPendingList((prev) => [...discovered, ...prev]);
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 26px 90px" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6, gap: 12, flexWrap: "wrap" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: 26,
            letterSpacing: "-0.012em",
            margin: 0,
            color: "var(--color-ink)",
          }}
        >
          Deals
        </h1>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <DiscoverBrandsButton onDiscovered={handleDiscovered} />
          <CsvImportButton onImported={handleImported} />
          <button type="button" onClick={() => setShowAddForm((s) => !s)} style={f.secondaryButton}>
            {showAddForm ? "Cancel" : "+ Add a brand"}
          </button>
        </div>
      </div>
      <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--color-muted)", margin: "0 0 24px" }}>
        Every brand you're working, from first contact to booked call.
      </p>

      {showAddForm && (
        <div style={{ marginBottom: 32 }}>
          <AddLeadForm agents={agents} onAdded={handleAdded} onCancel={() => setShowAddForm(false)} />
        </div>
      )}

      <div style={{ marginBottom: 40 }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: 18,
            letterSpacing: "-0.01em",
            margin: "0 0 4px",
            color: "var(--color-ink)",
          }}
        >
          Pending review
        </h2>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 13.5, color: "var(--color-muted)", margin: "0 0 14px" }}>
          Brands your Research agent finds on its own wait here until you say go.
        </p>
        {pendingList.length === 0 ? (
          <div style={{ fontFamily: "var(--font-body)", fontSize: 13.5, color: "var(--color-muted)" }}>
            Nothing waiting right now.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {pendingList.map((lead) => (
              <PendingLeadCard key={lead.id} lead={lead} onResolved={handlePendingResolved} />
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${STAGES.length}, minmax(220px, 1fr))`,
          gap: 16,
          overflowX: "auto",
        }}
      >
        {STAGES.map((stage) => {
          const stageLeads = leadList.filter((l) => l.status === stage.id);
          return (
            <div key={stage.id} style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 220 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  fontSize: 13,
                  color: "var(--color-muted-2)",
                  padding: "0 2px",
                }}
              >
                {stage.label}
                <span style={{ color: "var(--color-muted)" }}>{stageLeads.length}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, minHeight: 40 }}>
                {stageLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    agents={agents}
                    onStageChange={handleStageChange}
                    onAgentChange={handleAgentChange}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
