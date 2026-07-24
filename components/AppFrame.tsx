"use client";
import type { ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import { NAV_ITEMS } from "@/components/navItems";
import GlobalSearch from "@/components/GlobalSearch";
import NotificationBell from "@/components/NotificationBell";
import { IconMenu, IconClose } from "@/components/icons";

export default function AppFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app-frame">
      <div className={"app-frame-overlay" + (menuOpen ? " open" : "")} onClick={() => setMenuOpen(false)} />

      <aside
        className={"app-frame-sidebar" + (menuOpen ? " open" : "")}
        style={{ background: "#FFC700", border: "none" }}
      >
        <div style={{ padding: "22px 18px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link
            href="/dashboard"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 17,
              color: "#0A192F",
              letterSpacing: "-0.01em",
            }}
          >
            Agentic Sales Team
          </Link>
          <button
            className="app-frame-menu-btn"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#0A192F" }}
          >
            <IconClose size={18} />
          </button>
        </div>

        <div
          style={{
            margin: "4px 12px 16px",
            background: "#FFFFFF",
            borderRadius: 18,
            padding: 10,
            boxShadow: "0 10px 24px rgba(10,25,47,.18)",
          }}
        >
          <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href || pathname?.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 11,
                    padding: "9px 12px",
                    borderRadius: 12,
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    fontWeight: active ? 600 : 500,
                    color: active ? "#FFC700" : "#0A192F",
                    background: active ? "#0A192F" : "transparent",
                  }}
                >
                  <item.icon size={17} style={{ color: active ? "#FFC700" : "#0A192F" }} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      <div className="app-frame-content">
        <header
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "12px 22px",
            borderBottom: "1px solid var(--color-border)",
            position: "sticky",
            top: 0,
            background: "var(--color-bg)",
            zIndex: 20,
          }}
        >
          <button
            className="app-frame-menu-btn"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "var(--color-ink)" }}
          >
            <IconMenu size={20} />
          </button>
          <GlobalSearch />
          <div style={{ flex: 1 }} />
          <NotificationBell />
          <span style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--color-muted-2)", whiteSpace: "nowrap" }}>
            {user?.fullName ?? user?.firstName ?? ""}
          </span>
          <UserButton afterSignOutUrl="/" />
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
