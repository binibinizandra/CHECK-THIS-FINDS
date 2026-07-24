"use client";
import { useState, useTransition } from "react";
import { toggleNotification } from "@/lib/users/actions";
import { NOTIFICATION_OPTIONS } from "@/lib/users/constants";

export default function NotificationSettings({ initial }: { initial: Record<string, boolean> }) {
  const [prefs, setPrefs] = useState<Record<string, boolean>>(initial);
  const [, startTransition] = useTransition();

  function handleToggle(key: string) {
    const next = !(prefs[key] ?? true);
    setPrefs((p) => ({ ...p, [key]: next }));
    startTransition(() => {
      toggleNotification(key, next);
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {NOTIFICATION_OPTIONS.map((opt) => {
        const on = prefs[opt.key] ?? true;
        return (
          <div
            key={opt.key}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 20,
              padding: "16px 4px",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            <div>
              <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 15, color: "var(--color-ink)" }}>
                {opt.label}
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 13.5, color: "var(--color-muted)", marginTop: 2 }}>
                {opt.body}
              </div>
            </div>
            <button
              role="switch"
              aria-checked={on}
              aria-label={opt.label}
              onClick={() => handleToggle(opt.key)}
              style={{
                flexShrink: 0,
                width: 42,
                height: 24,
                borderRadius: "var(--radius-buttons)",
                border: "none",
                cursor: "pointer",
                position: "relative",
                background: on ? "var(--gradient-accent)" : "var(--color-surface-tertiary)",
                transition: "background 0.15s ease",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 3,
                  left: on ? 21 : 3,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "#fff",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
                  transition: "left 0.15s ease",
                }}
              />
            </button>
          </div>
        );
      })}
    </div>
  );
}
