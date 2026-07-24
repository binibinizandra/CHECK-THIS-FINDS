"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { IconSearch } from "@/components/icons";
import { NAV_ITEMS } from "@/components/navItems";

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return NAV_ITEMS;
    return NAV_ITEMS.filter((item) => item.label.toLowerCase().includes(q));
  }, [query]);

  function go(href: string) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 340 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "var(--color-bg-alt)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-inputs)",
          padding: "8px 12px",
        }}
      >
        <IconSearch size={15} style={{ color: "var(--color-muted)", flexShrink: 0 }} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 130)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && results[0]) go(results[0].href);
            if (e.key === "Escape") (e.target as HTMLInputElement).blur();
          }}
          placeholder="Search your workspace…"
          style={{
            border: "none",
            outline: "none",
            background: "transparent",
            fontFamily: "var(--font-body)",
            fontSize: 14,
            color: "var(--color-ink)",
            width: "100%",
          }}
        />
      </div>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            background: "var(--color-bg)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-inputs)",
            boxShadow: "var(--shadow-xl)",
            overflow: "hidden",
            zIndex: 50,
          }}
        >
          {results.length === 0 ? (
            <div style={{ padding: "12px 14px", fontFamily: "var(--font-body)", fontSize: 13, color: "var(--color-muted)" }}>
              No matches yet.
            </div>
          ) : (
            results.map((item) => (
              <div
                key={item.href}
                onMouseDown={() => go(item.href)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 14px",
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  color: "var(--color-ink)",
                  cursor: "pointer",
                }}
              >
                <item.icon size={15} style={{ color: "var(--color-muted)" }} />
                {item.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
