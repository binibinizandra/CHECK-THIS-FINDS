"use client";
import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import * as f from "@/components/profile/formStyles";
import type { TikTokConnection } from "@/lib/tiktok/store";

const NAVY = "#0A192F";
const YELLOW = "#FFC700";

export default function TikTokConnectCard({ connection }: { connection: TikTokConnection | null }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("tiktok");
  const [pending, startTransition] = useTransition();

  function handleDisconnect() {
    startTransition(async () => {
      await fetch("/api/tiktok/disconnect", { method: "POST" });
      router.refresh();
    });
  }

  return (
    <div style={f.fieldWrap}>
      <label style={f.label}>TikTok</label>
      {status === "connected" && (
        <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--status-working)", marginBottom: 8 }}>
          TikTok connected.
        </div>
      )}
      {status === "error" && (
        <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#DC2626", marginBottom: 8 }}>
          Couldn&apos;t connect TikTok. Please try again.
        </div>
      )}
      {connection ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "var(--color-bg-alt)",
            border: "1px solid var(--color-border)",
            borderRadius: 14,
            padding: "12px 16px",
          }}
        >
          {connection.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={connection.avatarUrl}
              alt={connection.displayName ?? "TikTok avatar"}
              style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
            />
          ) : (
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: NAVY,
                color: YELLOW,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              TT
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14, color: NAVY }}>
              {connection.displayName ?? "Connected"}
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 12.5, color: "var(--color-muted)" }}>
              {connection.followerCount != null ? `${connection.followerCount.toLocaleString()} followers` : "Follower count unavailable"}
            </div>
          </div>
          <button type="button" onClick={handleDisconnect} disabled={pending} style={{ ...f.secondaryButton, fontSize: 12.5, padding: "6px 12px" }}>
            {pending ? "…" : "Disconnect"}
          </button>
        </div>
      ) : (
        <a
          href="/api/tiktok/connect"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            fontSize: 13.5,
            color: NAVY,
            background: YELLOW,
            borderRadius: "var(--radius-buttons)",
            padding: "10px 18px",
            textDecoration: "none",
          }}
        >
          Connect TikTok
        </a>
      )}
    </div>
  );
}
