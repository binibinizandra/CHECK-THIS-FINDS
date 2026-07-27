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

        .sf-header { position: sticky; top: 0; z-index: 20; background: var(--sf-red); border-bottom: 1px solid rgba(255,255,255,.25); }
        .sf-header-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 14px 0; }
        .sf-brand-block { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .sf-brand-name { font-weight: 700; font-size: 26px; letter-spacing: -0.01em; color: var(--sf-white); line-height: 1.1; }
        @media (min-width: 600px) { .sf-brand-name { font-size: 32px; } }
        .sf-brand-tagline { font-size: 10px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,.85); }
        .sf-admin-link { flex-shrink: 0; font-size: 11px; font-weight: 600; color: var(--sf-red); background: var(--sf-white); border: none; border-radius: 999px; padding: 7px 16px; }

        .sf-featured { padding: 26px 0 8px; }
        .sf-featured-label { display: inline-flex; align-items: center; gap: 6px; font-size: 10.5px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--sf-red); background: var(--sf-gold); border-radius: 999px; padding: 6px 14px; margin-bottom: 12px; }
        .sf-hero-frame { position: relative; width: 100%; aspect-ratio: 1 / 1; max-height: 420px; border-radius: 24px; overflow: hidden; background: var(--sf-gold); box-shadow: 0 8px 32px -8px rgba(0,0,0,.35); border: 3px solid var(--sf-white); }
        .sf-hero-frame img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .sf-featured-cta-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 14px; flex-wrap: wrap; }
        .sf-featured-name { font-size: 15px; font-weight: 700; color: var(--sf-white); }
        .sf-featured-sub { font-size: 11.5px; color: rgba(255,255,255,.85); margin-top: 2px; }

        .sf-tabs-section { padding: 18px 0 6px; }
        .sf-tabs-row { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; }
        .sf-tabs-row::-webkit-scrollbar { display: none; }
        .sf-tab-btn { flex-shrink: 0; border: 1px solid rgba(255,255,255,.5); background: transparent; color: var(--sf-white); font-weight: 500; font-size: 11.5px; padding: 8px 16px; border-radius: 999px; transition: background .15s ease, color .15s ease, border-color .15s ease; cursor: pointer; }
        .sf-tab-btn[aria-pressed=true] { background: var(--sf-gold); border-color: var(--sf-gold); color: var(--sf-red); font-weight: 700; }

        .sf-grid-section { padding: 14px 0 34px; }
        .sf-cat-label { font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--sf-white); margin: 22px 0 12px; padding-left: 10px; border-left: 3px solid var(--sf-gold); }
        .sf-cat-label:first-child { margin-top: 0; }
        .sf-product-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        @media (min-width: 600px) { .sf-product-grid { grid-template-columns: repeat(4, 1fr); gap: 12px; } }
        @media (min-width: 900px) { .sf-product-grid { grid-template-columns: repeat(6, 1fr); gap: 14px; } }

        .sf-card { background: var(--sf-gold); border-radius: 20px; overflow: hidden; display: flex; flex-direction: column; height: 100%; box-shadow: 0 6px 20px -4px rgba(0,0,0,.3); transition: box-shadow .2s ease, transform .2s ease; }
        @media (prefers-reduced-motion: no-preference) { .sf-card:hover { box-shadow: 0 12px 28px -4px rgba(0,0,0,.4); transform: translateY(-3px); } }
        .sf-card-link { display: flex; flex-direction: column; flex: 1; text-decoration: none; color: inherit; min-width: 0; }
        .sf-card-media { position: relative; aspect-ratio: 1; background: rgba(255,255,255,.3); }
        .sf-card-media img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .sf-card-body { padding: 10px 10px 8px; display: flex; flex-direction: column; gap: 6px; flex: 1; }
        .sf-card-name { font-size: 10.5px; font-weight: 700; line-height: 1.3; color: var(--sf-white); min-height: 27px; }
        .sf-stars { position: relative; display: inline-block; font-size: 9px; line-height: 1; letter-spacing: 1px; color: rgba(255,255,255,.4); }
        .sf-stars-fill { position: absolute; inset: 0; overflow: hidden; color: var(--sf-red); white-space: nowrap; }
        .sf-rating-row { display: flex; align-items: center; gap: 4px; }
        .sf-rating-num { font-size: 9px; font-weight: 700; color: var(--sf-white); font-variant-numeric: tabular-nums; }
        .sf-card-actions { display: flex; flex-direction: column; gap: 5px; padding: 0 10px 10px; }
        .sf-btn-store { display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 700; padding: 7px 4px; border-radius: 999px; border: none; color: var(--sf-red); cursor: pointer; background: var(--sf-white); }
        @media (prefers-reduced-motion: no-preference) { .sf-btn-store { transition: opacity .15s ease; } .sf-btn-store:hover { opacity: .85; } }

        .sf-footer { margin-top: 24px; border-top: 1px solid rgba(255,255,255,.25); padding: 28px 0 44px; }
        .sf-footer-copy { font-size: 12.5px; color: var(--sf-white); text-align: center; }
        .sf-footer-disclosure { font-size: 11.5px; color: rgba(255,255,255,.8); text-align: center; max-width: 460px; margin: 8px auto 0; line-height: 1.6; }

        .sf-empty { text-align: center; padding: 60px 20px; color: var(--sf-white); font-size: 14px; }

        :root {
          --sf-red: #EE4D2D;
          --sf-red-deep: #D8431F;
          --sf-gold: #FFC700;
          --sf-white: #FFFFFF;
        }
      `}</style>

      <div
        className={poppins.className}
        style={{
          background: "linear-gradient(160deg, #EE4D2D 0%, #E14526 55%, #D8431F 100%)",
          color: "var(--sf-white)",
          minHeight: "100dvh",
        }}
      >
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
