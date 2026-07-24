"use client";
import { useState } from "react";
import * as f from "@/components/profile/formStyles";
import type { Proposal } from "@/lib/proposals/store";

export default function ProposalCard({ proposal }: { proposal: Proposal }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const packages = proposal.packages.length ? `\n\n${proposal.packages.map((p) => `- ${p}`).join("\n")}` : "";
    navigator.clipboard?.writeText(`${proposal.title}\n\n${proposal.body}${packages}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div
      style={{
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-cards)",
        padding: 18,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15.5, color: "var(--color-ink)" }}>
        {proposal.title}
      </div>
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 14,
          lineHeight: 1.6,
          color: "var(--color-muted-2)",
          whiteSpace: "pre-wrap",
        }}
      >
        {proposal.body}
      </div>
      {proposal.packages.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
          {proposal.packages.map((pkg, i) => (
            <div
              key={i}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13.5,
                color: "var(--color-ink)",
                background: "var(--color-bg-alt)",
                borderRadius: "var(--radius-inputs)",
                padding: "8px 12px",
              }}
            >
              {pkg}
            </div>
          ))}
        </div>
      )}
      <div style={{ marginTop: 6 }}>
        <button type="button" onClick={handleCopy} style={f.smallGhostButton}>
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
