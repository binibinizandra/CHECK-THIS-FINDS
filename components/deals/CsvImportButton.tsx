"use client";
import { useRef, useState, useTransition } from "react";
import { importCsv } from "@/lib/leads/actions";
import type { Lead } from "@/lib/leads/types";
import * as f from "@/components/profile/formStyles";

export default function CsvImportButton({ onImported }: { onImported: (leads: Lead[]) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      startTransition(async () => {
        const result = await importCsv(text);
        onImported(result.leads);
        setMessage(
          `Added ${result.added} brand${result.added === 1 ? "" : "s"}` +
            (result.skipped ? `, skipped ${result.skipped} row${result.skipped === 1 ? "" : "s"} without a name` : "")
        );
      });
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <button type="button" onClick={() => fileRef.current?.click()} disabled={pending} style={f.secondaryButton}>
        {pending ? "Importing…" : "Import CSV"}
      </button>
      <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={handleFile} style={{ display: "none" }} />
      {message && !pending && (
        <span style={{ fontFamily: "var(--font-body)", fontSize: 13.5, color: "var(--color-muted)" }}>{message}</span>
      )}
    </div>
  );
}
