"use client";
import { useState } from "react";
import type { ProductRecord } from "@/lib/products/store";

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
      <div className="sf-card-media">
        <span className="sf-quality-badge">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 1l2.6 5.6L19 7.3l-4.5 4.2 1.1 6.2L10 14.8l-5.6 2.9 1.1-6.2L1 7.3l6.4-.7z" />
          </svg>
          Tested
        </span>
        <img src={p.imageUrl} alt={p.name} loading="lazy" />
      </div>
      <div className="sf-card-body">
        <div className="sf-card-name">{p.name}</div>
        <div className="sf-rating-row">
          <Stars rating={p.rating} />
          <span className="sf-rating-num">{p.rating.toFixed(1)}</span>
        </div>
        <div className="sf-card-actions">
          <a className="sf-btn-store sf-btn-shopee" href={p.shopeeLink || "#"} target="_blank" rel="noopener noreferrer">
            Shopee
          </a>
          <a className="sf-btn-store sf-btn-tiktok" href={p.tiktokLink || "#"} target="_blank" rel="noopener noreferrer">
            TikTok
          </a>
        </div>
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

        .sf-header { position: sticky; top: 0; z-index: 20; background: var(--sf-paper); border-bottom: 2px solid var(--sf-gold); }
        .sf-header-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 12px 0; }
        .sf-brand-block { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .sf-brand-name { font-weight: 800; font-size: 28px; letter-spacing: -0.01em; color: var(--sf-ink); line-height: 1.1; }
        @media (min-width: 600px) { .sf-brand-name { font-size: 34px; } }
        .sf-brand-tagline { font-size: 10px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: var(--sf-ink-faint); }
        .sf-admin-link { flex-shrink: 0; font-size: 11px; font-weight: 700; color: var(--sf-ink-muted); border: 1px solid var(--sf-border); border-radius: 999px; padding: 6px 14px; }

        .sf-featured { padding: 22px 0 6px; }
        .sf-featured-label { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: var(--sf-gold-deep); background: rgba(255, 199, 0, 0.15); border-radius: 999px; padding: 5px 12px; margin-bottom: 10px; }
        .sf-hero-frame { position: relative; width: 100%; aspect-ratio: 1 / 1; max-height: 420px; border-radius: 16px; overflow: hidden; background: var(--sf-card); box-shadow: 0 1px 3px rgba(0,0,0,.06), 0 8px 20px -6px rgba(0,0,0,.1); }
        .sf-hero-frame img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .sf-featured-cta-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 12px; flex-wrap: wrap; }
        .sf-featured-name { font-size: 14px; font-weight: 700; color: var(--sf-ink); }
        .sf-featured-sub { font-size: 11.5px; color: var(--sf-ink-muted); margin-top: 2px; }

        .sf-tabs-section { padding: 16px 0 4px; }
        .sf-tabs-row { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; }
        .sf-tabs-row::-webkit-scrollbar { display: none; }
        .sf-tab-btn { flex-shrink: 0; border: 1px solid var(--sf-border); background: var(--sf-card); color: var(--sf-ink-muted); font-weight: 700; font-size: 11.5px; padding: 6px 12px; border-radius: 999px; transition: background .15s ease, color .15s ease, border-color .15s ease; cursor: pointer; }
        .sf-tab-btn[aria-pressed=true] { background: var(--sf-gold); border-color: var(--sf-gold); color: var(--sf-ink); }

        .sf-grid-section { padding: 12px 0 30px; }
        .sf-cat-label { font-size: 11px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: var(--sf-ink); margin: 20px 0 10px; padding-left: 8px; border-left: 3px solid var(--sf-gold); }
        .sf-cat-label:first-child { margin-top: 0; }
        .sf-product-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
        @media (min-width: 600px) { .sf-product-grid { grid-template-columns: repeat(4, 1fr); gap: 10px; } }
        @media (min-width: 900px) { .sf-product-grid { grid-template-columns: repeat(6, 1fr); gap: 12px; } }

        .sf-card { background: var(--sf-card); border-radius: 16px; overflow: hidden; display: flex; flex-direction: column; height: 100%; box-shadow: 0 1px 3px rgba(0,0,0,.06), 0 4px 8px -2px rgba(0,0,0,.06); transition: box-shadow .15s ease, transform .15s ease; }
        @media (prefers-reduced-motion: no-preference) { .sf-card:hover { box-shadow: 0 2px 4px rgba(0,0,0,.06), 0 10px 20px -4px rgba(0,0,0,.1); transform: translateY(-2px); } }
        .sf-card-media { position: relative; aspect-ratio: 1; background: var(--sf-border); }
        .sf-card-media img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .sf-quality-badge { position: absolute; top: 6px; left: 6px; display: inline-flex; align-items: center; gap: 2px; background: var(--sf-gold); color: var(--sf-ink); font-size: 7px; font-weight: 800; letter-spacing: 0.02em; text-transform: uppercase; padding: 3px 5px; border-radius: 999px; }
        .sf-quality-badge svg { width: 7px; height: 7px; }
        .sf-card-body { padding: 7px; display: flex; flex-direction: column; gap: 5px; flex: 1; }
        .sf-card-name { font-size: 10.5px; font-weight: 700; line-height: 1.25; color: var(--sf-ink); min-height: 26px; }
        .sf-stars { position: relative; display: inline-block; font-size: 9px; line-height: 1; letter-spacing: 1px; color: var(--sf-star-bg); }
        .sf-stars-fill { position: absolute; inset: 0; overflow: hidden; color: var(--sf-star); white-space: nowrap; }
        .sf-rating-row { display: flex; align-items: center; gap: 4px; }
        .sf-rating-num { font-size: 9px; font-weight: 700; color: var(--sf-ink-muted); font-variant-numeric: tabular-nums; }
        .sf-card-actions { display: flex; flex-direction: column; gap: 4px; margin-top: auto; }
        .sf-btn-store { display: flex; align-items: center; justify-content: center; gap: 3px; font-size: 9px; font-weight: 700; padding: 6px 4px; border-radius: 6px; border: none; color: #fff; cursor: pointer; }
        .sf-btn-shopee { background: var(--sf-shopee); }
        .sf-btn-tiktok { background: var(--sf-tiktok); }
        @media (prefers-reduced-motion: no-preference) { .sf-btn-store { transition: opacity .15s ease; } .sf-btn-store:hover { opacity: .88; } }

        .sf-footer { margin-top: 20px; border-top: 1px solid var(--sf-border); padding: 26px 0 40px; }
        .sf-footer-copy { font-size: 12.5px; color: var(--sf-ink-muted); text-align: center; }
        .sf-footer-disclosure { font-size: 11.5px; color: var(--sf-ink-faint); text-align: center; max-width: 460px; margin: 8px auto 0; line-height: 1.5; }

        .sf-empty { text-align: center; padding: 60px 20px; color: var(--sf-ink-faint); font-size: 14px; }

        :root {
          --sf-paper: #FAFAF9;
          --sf-card: #FFFFFF;
          --sf-ink: #1F1B12;
          --sf-ink-muted: #6B6355;
          --sf-ink-faint: #9C9484;
          --sf-gold: #FFC700;
          --sf-gold-deep: #8A6200;
          --sf-border: #F2E7C4;
          --sf-shopee: #EE4D2D;
          --sf-tiktok: #10141C;
          --sf-star: #FFC700;
          --sf-star-bg: #EFE6C6;
        }
      `}</style>

      <div style={{ background: "var(--sf-paper)", color: "var(--sf-ink)", minHeight: "100dvh", fontFamily: "-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif" }}>
        <header className="sf-header">
          <div className="sf-wrap sf-header-row">
            <div className="sf-brand-block">
              <span className="sf-brand-name">Check This Finds</span>
              <span className="sf-brand-tagline">Only Tested &amp; High-Quality Items</span>
            </div>
            {isAdmin && <a href="/admin" className="sf-admin-link">Manage</a>}
          </div>
        </header>

        {products.length === 0 ? (
          <div className="sf-empty">No products yet. Check back soon!</div>
        ) : (
          <main className="sf-wrap">
            {featured && (
              <section className="sf-featured">
                <span className="sf-featured-label">Featured Find</span>
                <div className="sf-hero-frame">
                  <img src={featured.imageUrl} alt={featured.name} />
                </div>
                <div className="sf-featured-cta-row">
                  <div>
                    <div className="sf-featured-name">{featured.name}</div>
                    <div className="sf-featured-sub">Tested and approved</div>
                  </div>
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
