"use client";
import { useState } from "react";
import type { ReactNode } from "react";

const TABS = [
  { key: "products", label: "Products" },
  { key: "trending", label: "Trending / Sale" },
  { key: "about", label: "About Page" },
];

export default function AdminShell({
  products,
  trending,
  about,
}: {
  products: ReactNode;
  trending: ReactNode;
  about: ReactNode;
}) {
  const [tab, setTab] = useState("products");

  return (
    <>
      <style>{`
        .am-shell-nav { position: sticky; top: 0; z-index: 30; background: #FFFFFF; border-bottom: 1px solid #E7E3D9; }
        .am-shell-nav-inner { max-width: 720px; margin: 0 auto; padding: 0 20px; display: flex; gap: 4px; overflow-x: auto; scrollbar-width: none; }
        .am-shell-nav-inner::-webkit-scrollbar { display: none; }
        .am-shell-tab { flex-shrink: 0; font-size: 13.5px; font-weight: 700; padding: 16px 14px; border: none; background: none; color: #6B7280; cursor: pointer; border-bottom: 2px solid transparent; white-space: nowrap; font-family: -apple-system, "Segoe UI", Helvetica, Arial, sans-serif; }
        .am-shell-tab:hover { color: #1F2937; }
        .am-shell-tab[aria-selected="true"] { color: #0B6B57; border-bottom-color: #0B6B57; }
      `}</style>

      <nav className="am-shell-nav" aria-label="Admin sections">
        <div className="am-shell-nav-inner">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              className="am-shell-tab"
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      {tab === "products" && products}
      {tab === "trending" && trending}
      {tab === "about" && about}
    </>
  );
}
