"use client";
import { useState } from "react";
import * as f from "@/components/profile/formStyles";
import type { OutreachDraft } from "@/lib/outreach/store";

export default function DraftMessageCard({
  draft,
  label,
  toEmail,
}: {
  draft: OutreachDraft;
  label: string;
  toEmail?: string | null;
}) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard?.writeText(`${draft.subject}\n\n${draft.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  const mailto = toEmail
    ? `mailto:${encodeURIComponent(toEmail)}?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`
    : null;

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
      <div
        style={{
          display: "inline-block",
          alignSelf: "flex-start",
          fontFamily: "var(--font-body)",
          fontWeight: 600,
          fontSize: 11.5,
          letterSpacing: "0.02em",
          textTransform: "uppercase",
          color: "var(--color-accent-dark)",
          background: "var(--color-bg-alt)",
          borderRadius: "var(--radius-buttons)",
          padding: "3px 10px",
        }}
      >
        {label}
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15.5, color: "var(--color-ink)" }}>
        {draft.subject}
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
        {draft.body}
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
        {mailto && (
          <a href={mailto} style={{ ...f.secondaryButton, textDecoration: "none" }}>
            Open in mail app
          </a>
        )}
        <button type="button" onClick={handleCopy} style={f.smallGhostButton}>
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
