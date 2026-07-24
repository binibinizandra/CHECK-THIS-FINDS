"use client";
import { useState } from "react";
import type { Lead } from "@/lib/leads/types";
import * as f from "@/components/profile/formStyles";

export default function DiscoverBrandsButton({ onDiscovered }: { onDiscovered: (leads: Lead[]) => void }) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleClick() {
    setPending(true);
    setMessage(null);
    try {
      const res = await fetch("/api/scrape", { method: "POST" });
      const data = await res.json();
      const found: Lead[] = Array.isArray(data.leads) ? data.leads : [];
      onDiscovered(found);
      setMessage(
        found.length
          ? `Found ${found.length} brand${found.length === 1 ? "" : "s"} — check Pending review.`
          : "No new brands found this time."
      );
    } catch {
      setMessage("Something went wrong — try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        style={{ ...f.secondaryButton, opacity: pending ? 0.6 : 1 }}
      >
        {pending ? "Searching…" : "Discover brands"}
      </button>
      {message && (
        <span style={{ fontFamily: "var(--font-body)", fontSize: 13.5, color: "var(--color-muted)" }}>{message}</span>
      )}
    </div>
  );
}
