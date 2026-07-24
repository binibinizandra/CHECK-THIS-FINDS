"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { enqueueLeadJob } from "@/lib/jobs/actions";
import type { JobKind } from "@/lib/jobs/store";
import * as f from "@/components/profile/formStyles";

export default function RunJobButton({
  leadId,
  agentId,
  kind,
  label,
  workingLabel,
  disabled,
  disabledReason,
}: {
  leadId: string;
  agentId?: string | null;
  kind: JobKind;
  label: string;
  workingLabel: string;
  disabled?: boolean;
  disabledReason?: string;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleClick() {
    startTransition(async () => {
      await enqueueLeadJob(leadId, kind, agentId ?? null);
      let remaining = true;
      let guard = 0;
      while (remaining && guard < 15) {
        const res = await fetch("/api/jobs/run", { method: "POST" });
        const data = await res.json().catch(() => ({ remaining: false }));
        remaining = Boolean(data.remaining);
        guard++;
        if (remaining) await new Promise((r) => setTimeout(r, 1200));
      }
      router.refresh();
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={pending || disabled}
        title={disabled ? disabledReason : undefined}
        style={{ ...f.primaryButton, opacity: pending || disabled ? 0.5 : 1 }}
      >
        {pending ? workingLabel : label}
      </button>
      {disabled && disabledReason && (
        <div style={{ fontFamily: "var(--font-body)", fontSize: 12.5, color: "var(--color-muted)", marginTop: 6 }}>
          {disabledReason}
        </div>
      )}
    </div>
  );
}
