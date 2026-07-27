"use client";
import { useState } from "react";
import Link from "next/link";
import { Poppins } from "next/font/google";
import type { ProductRecord } from "@/lib/products/store";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

const CATEGORIES: Record<string, string> = {
  home: "Home Needs & Appliances",
  digital: "Digital Finds",
  care: "Personal Care",
  food: "Food & Treats",
};

const TABS = [
  { key: "all", label: "All Finds" },
  { key: "home", label: "Home Needs & Appliances" },
  { key: "digital", label: "Digital Finds" },
  { key: "care", label: "Personal Care" },
  { key: "food", label: "Food & Treats" },
];

function Stars({ rating }: { rating: number }) {
  const pct = Math.round((rating / 5) * 100);
  return (
    <span className="sf-stars" aria-hidden="true">
      ★★★★★
      <span className="sf-stars-fill" style={{ width: `${pct}%` }}>
        ★★★★★
      </span>
    </span>
  );
}

function ProductCard({ p }: { p: ProductRecord }) {
  return (
    <article className="sf-card">
      <Link href={`/product/${p.id}`} className="sf-card-link">
        <div className="sf-card-media">
          <img src={p.imageUrl} alt={p.name} loading="lazy" />
        </div>
        <div className="sf-card-body">
          <div className="sf-card-name">{p.name}</div>
          <div className="sf-rating-row">
            <Stars rating={p.rating} />
            <span className="sf-rating-num">{p.rating.toFixed(1)}</span>
          </div>
        </div>
      </Link>
      <div className="sf-card-actions">
        <a className="sf-btn-store" href={p.shopeeLink || "#"} target="_blank" rel="noopener noreferrer">
          Buy on Shopee
        </a>
        <a className="sf-btn-store" href={p.tiktokLink || "#"} target="_blank" rel="noopener noreferrer">
          Buy on TikTok
        </a>
      </div>
    </article>
  );
}

export default function StorefrontClient({ products, isAdmin }: { products: ProductRecord[]; isAdmin: boolean }) {
  const [filter, setFilter] = useState("all");
  const featured = products[0];

  return (
    <>
      <style>{`
        .sf-wrap { max-width: 1180px; margin: 0 auto; padding: 0 16px; }

        .sf-banner { position: relative; background-color: #EFE9EC; background-image: url(/images/banner-flowers.png); background-size: cover; background-position: top center; background-repeat: no-repeat; }
        .sf-header { position: relative; z-index: 2; }
        .sf-header-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 20px 0 34px; }
        .sf-brand-block { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .sf-brand-name { font-weight: 700; font-size: 26px; letter-spacing: -0.01em; color: var(--sf-ink); line-height: 1.1; }
        @media (min-width: 600px) { .sf-brand-name { font-size: 32px; } }
        .sf-brand-tagline { font-size: 10px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: var(--sf-muted); }
        .sf-admin-link { flex-shrink: 0; font-size: 11px; font-weight: 600; color: var(--sf-white); background: var(--sf-pink); border: none; border-radius: 999px; padding: 7px 16px; }

        .sf-featured { padding: 190px 0 8px; }
        @media (min-width: 700px) { .sf-featured { padding-top: 240px; } }
        .sf-featured-title-row { display: flex; flex-direction: column; }
        .sf-featured-name { font-size: 16px; font-weight: 700; color: var(--sf-ink); }
        .sf-featured-sub { font-size: 12px; color: var(--sf-muted); margin-top: 2px; }

        .sf-tabs-section { padding: 18px 0 6px; }
        .sf-tabs-row { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; }
        .sf-tabs-row::-webkit-scrollbar { display: none; }
        .sf-tab-btn { flex-shrink: 0; border: 1px solid var(--sf-border); background: var(--sf-card); color: var(--sf-ink); font-weight: 500; font-size: 11.5px; padding: 8px 16px; border-radius: 999px; transition: background .15s ease, color .15s ease, border-color .15s ease; cursor: pointer; }
        .sf-tab-btn[aria-pressed=true] { background: var(--sf-pink); border-color: var(--sf-pink); color: var(--sf-white); font-weight: 700; }

        .sf-grid-section { padding: 14px 0 34px; }
        .sf-cat-label { font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--sf-ink); margin: 22px 0 12px; padding-left: 10px; border-left: 3px solid var(--sf-pink); }
        .sf-cat-label:first-child { margin-top: 0; }
        .sf-product-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        @media (min-width: 600px) { .sf-product-grid { grid-template-columns: repeat(4, 1fr); gap: 12px; } }
        @media (min-width: 900px) { .sf-product-grid { grid-template-columns: repeat(6, 1fr); gap: 14px; } }

        .sf-card { background: var(--sf-card); border-radius: 18px; overflow: hidden; display: flex; flex-direction: column; height: 100%; box-shadow: 0 4px 16px -6px rgba(60,45,55,.18); transition: box-shadow .2s ease, transform .2s ease; }
        @media (prefers-reduced-motion: no-preference) { .sf-card:hover { box-shadow: 0 10px 24px -6px rgba(60,45,55,.25); transform: translateY(-3px); } }
        .sf-card-link { display: flex; flex-direction: column; flex: 1; text-decoration: none; color: inherit; min-width: 0; }
        .sf-card-media { position: relative; aspect-ratio: 1; background: var(--sf-border); }
        .sf-card-media img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .sf-card-body { padding: 10px 10px 8px; display: flex; flex-direction: column; gap: 6px; flex: 1; }
        .sf-card-name { font-size: 10.5px; font-weight: 700; line-height: 1.3; color: var(--sf-ink); min-height: 27px; }
        .sf-stars { position: relative; display: inline-block; font-size: 9px; line-height: 1; letter-spacing: 1px; color: var(--sf-border); }
        .sf-stars-fill { position: absolute; inset: 0; overflow: hidden; color: var(--sf-pink); white-space: nowrap; }
        .sf-rating-row { display: flex; align-items: center; gap: 4px; }
        .sf-rating-num { font-size: 9px; font-weight: 700; color: var(--sf-muted); font-variant-numeric: tabular-nums; }
        .sf-card-actions { display: flex; flex-direction: column; gap: 5px; padding: 0 10px 10px; }
        .sf-btn-store { display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 700; padding: 7px 4px; border-radius: 999px; border: none; color: var(--sf-white); cursor: pointer; background: var(--sf-pink); }
        @media (prefers-reduced-motion: no-preference) { .sf-btn-store { transition: opacity .15s ease; } .sf-btn-store:hover { opacity: .85; } }

        .sf-footer { margin-top: 24px; border-top: 1px solid var(--sf-border); padding: 28px 0 44px; }
        .sf-footer-copy { font-size: 12.5px; color: var(--sf-ink); text-align: center; }
        .sf-footer-disclosure { font-size: 11.5px; color: var(--sf-muted); text-align: center; max-width: 460px; margin: 8px auto 0; line-height: 1.6; }

        .sf-empty { text-align: center; padding: 60px 20px; color: var(--sf-muted); font-size: 14px; }

        .sf-petals { position: fixed; inset: 0; pointer-events: none; z-index: 3; overflow: hidden; }
        .sf-petal { position: absolute; top: -6vh; left: var(--sf-petal-left); width: var(--sf-petal-size); height: var(--sf-petal-size); border-radius: 50% 0 50% 50%; background: linear-gradient(135deg, var(--sf-pink), #F6DEE4); opacity: .5; }
        @media (prefers-reduced-motion: no-preference) {
          .sf-petal { animation: sf-fall var(--sf-petal-duration) linear infinite; animation-delay: var(--sf-petal-delay); }
        }
        @keyframes sf-fall {
          0% { transform: translateY(0) translateX(0) rotate(0deg); }
          100% { transform: translateY(112vh) translateX(24px) rotate(300deg); }
        }
        .sf-petal:nth-child(1) { --sf-petal-left: 4%; --sf-petal-size: 10px; --sf-petal-duration: 13s; --sf-petal-delay: 0s; }
        .sf-petal:nth-child(2) { --sf-petal-left: 14%; --sf-petal-size: 14px; --sf-petal-duration: 17s; --sf-petal-delay: 2s; }
        .sf-petal:nth-child(3) { --sf-petal-left: 24%; --sf-petal-size: 9px; --sf-petal-duration: 11s; --sf-petal-delay: 5s; }
        .sf-petal:nth-child(4) { --sf-petal-left: 36%; --sf-petal-size: 16px; --sf-petal-duration: 19s; --sf-petal-delay: 1s; }
        .sf-petal:nth-child(5) { --sf-petal-left: 48%; --sf-petal-size: 11px; --sf-petal-duration: 14s; --sf-petal-delay: 7s; }
        .sf-petal:nth-child(6) { --sf-petal-left: 58%; --sf-petal-size: 13px; --sf-petal-duration: 16s; --sf-petal-delay: 3s; }
        .sf-petal:nth-child(7) { --sf-petal-left: 68%; --sf-petal-size: 10px; --sf-petal-duration: 12s; --sf-petal-delay: 6s; }
        .sf-petal:nth-child(8) { --sf-petal-left: 78%; --sf-petal-size: 15px; --sf-petal-duration: 18s; --sf-petal-delay: 4s; }
        .sf-petal:nth-child(9) { --sf-petal-left: 88%; --sf-petal-size: 9px; --sf-petal-duration: 15s; --sf-petal-delay: 8s; }
        .sf-petal:nth-child(10) { --sf-petal-left: 94%; --sf-petal-size: 12px; --sf-petal-duration: 20s; --sf-petal-delay: 0.5s; }
        .sf-petal:nth-child(11) { --sf-petal-left: 20%; --sf-petal-size: 8px; --sf-petal-duration: 22s; --sf-petal-delay: 9s; }
        .sf-petal:nth-child(12) { --sf-petal-left: 62%; --sf-petal-size: 8px; --sf-petal-duration: 21s; --sf-petal-delay: 10s; }

        :root {
          --sf-bg: #F5F1F3;
          --sf-card: #FFFFFF;
          --sf-border: #EDE3E7;
          --sf-ink: #1B2A4E;
          --sf-muted: #5C6C8C;
          --sf-pink: #D99AA8;
          --sf-white: #FFFFFF;
        }
      `}</style>

      <div
        className={poppins.className}
        style={{
          background: "var(--sf-bg)",
          color: "var(--sf-ink)",
          minHeight: "100dvh",
          position: "relative",
        }}
      >
        <div className="sf-petals" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, i) => (
            <span className="sf-petal" key={i} />
          ))}
        </div>

        <div className="sf-banner">
          <header className="sf-header">
            <div className="sf-wrap sf-header-row">
              <div className="sf-brand-block">
                <span className="sf-brand-name">Check This Finds</span>
                <span className="sf-brand-tagline">Only Tested &amp; High-Quality Items</span>
              </div>
              {isAdmin && <a href="/admin" className="sf-admin-link">Manage</a>}
            </div>
          </header>

          {products.length > 0 && (
            <div className="sf-wrap">
              {featured && (
                <section className="sf-featured">
                  <div className="sf-featured-title-row">
                    <div className="sf-featured-name">{featured.name}</div>
                    <div className="sf-featured-sub">Tested and approved</div>
                  </div>
                </section>
              )}

              <section className="sf-tabs-section">
                <div className="sf-tabs-row" role="tablist" aria-label="Product categories">
                  {TABS.map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      className="sf-tab-btn"
                      aria-pressed={filter === t.key}
                      onClick={() => setFilter(t.key)}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>

        {products.length === 0 ? (
          <div className="sf-empty">No products yet. Check back soon!</div>
        ) : (
          <main className="sf-wrap">
            <section className="sf-grid-section">
              {filter === "all"
                ? Object.keys(CATEGORIES).map((key) => {
                    const items = products.filter((p) => p.category === key);
                    if (!items.length) return null;
                    return (
                      <div key={key}>
                        <div className="sf-cat-label">{CATEGORIES[key]}</div>
                        <div className="sf-product-grid">
                          {items.map((p) => (
                            <ProductCard key={p.id} p={p} />
                          ))}
                        </div>
                      </div>
                    );
                  })
                : (
                  <div className="sf-product-grid">
                    {products.filter((p) => p.category === filter).map((p) => (
                      <ProductCard key={p.id} p={p} />
                    ))}
                  </div>
                )}
            </section>
          </main>
        )}

        <footer className="sf-footer">
          <div className="sf-wrap">
            <div className="sf-footer-copy">© {new Date().getFullYear()} Check This Finds. All rights reserved.</div>
            <p className="sf-footer-disclosure">This site contains affiliate links. We may earn a commission at no extra cost to you.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
