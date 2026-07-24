"use client";
import { useEffect, useState } from "react";
import { getRecentActivity, clearActivity } from "@/lib/activity/actions";
import type { NotificationView } from "@/lib/activity/actions";
import { IconBell } from "@/components/icons";

export default function NotificationBell() {
  const [items, setItems] = useState<NotificationView[]>([]);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  async function refresh() {
    const data = await getRecentActivity();
    setItems(data);
    setLoaded(true);
  }

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 20000);
    return () => clearInterval(id);
  }, []);

  async function handleClear() {
    setItems([]);
    await clearActivity();
  }

  return (
    <div style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        style={{
          position: "relative",
          display: "flex",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 6,
          color: "var(--color-muted-2)",
        }}
      >
        <IconBell size={19} />
        {items.length > 0 && (
          <span
            style={{
              position: "absolute",
              top: 4,
              right: 4,
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "var(--color-accent)",
            }}
          />
        )}
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: 320,
            background: "var(--color-bg)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-inputs)",
            boxShadow: "var(--shadow-xl)",
            zIndex: 50,
            maxHeight: 400,
            overflowY: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 14px",
              borderBottom: "1px solid var(--color-border)",
              position: "sticky",
              top: 0,
              background: "var(--color-bg)",
            }}
          >
            <span style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13.5, color: "var(--color-ink)" }}>
              Notifications
            </span>
            {items.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--color-accent)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Clear all
              </button>
            )}
          </div>
          {!loaded ? (
            <div style={{ padding: 16, fontFamily: "var(--font-body)", fontSize: 13, color: "var(--color-muted)" }}>
              Loading…
            </div>
          ) : items.length === 0 ? (
            <div style={{ padding: 16, fontFamily: "var(--font-body)", fontSize: 13, color: "var(--color-muted)" }}>
              Nothing new.
            </div>
          ) : (
            items.map((n) => (
              <div
                key={n.id}
                style={{
                  padding: "10px 14px",
                  borderBottom: "1px solid var(--color-border)",
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  lineHeight: 1.45,
                  color: "var(--color-ink)",
                }}
              >
                {n.agentName && <strong>{n.agentName} </strong>}
                {n.text}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
