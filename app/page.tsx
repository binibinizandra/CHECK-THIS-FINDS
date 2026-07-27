"use client";
import { useState } from "react";

type Product = {
  name: string;
  cat: string;
  rating: number;
  reviews: number;
  image: string;
  shopeeLink: string;
  tiktokLink: string;
};

const CATEGORIES: Record<string, string> = {
  home: "Home Needs & Appliances",
  digital: "Digital Finds",
  care: "Personal Care",
  food: "Food & Treats",
};

// ============================================================
// AFFILIATE LINKS: replace SHOPEE_LINK_HERE / TIKTOK_LINK_HERE
// below with your real links. Each product is labeled so you
// can find it fast — search this file for "PRODUCT" by number.
// ============================================================
const PRODUCTS: Product[] = [
  // PRODUCT 1: Woven Storage Basket
  { name: "Woven Storage Basket", cat: "home", rating: 4.6, reviews: 189, image: "https://images.unsplash.com/photo-1455669175216-9017c9b02fc6?q=80&w=600&auto=format&fit=crop", shopeeLink: "SHOPEE_LINK_HERE", tiktokLink: "TIKTOK_LINK_HERE" },
  // PRODUCT 2: Minimalist LED Desk Lamp
  { name: "Minimalist LED Desk Lamp", cat: "home", rating: 4.7, reviews: 264, image: "https://images.unsplash.com/photo-1582356630861-61bb9b41f541?q=80&w=600&auto=format&fit=crop", shopeeLink: "SHOPEE_LINK_HERE", tiktokLink: "TIKTOK_LINK_HERE" },
  // PRODUCT 3: Bamboo Drawer Organizer Set
  { name: "Bamboo Drawer Organizer Set", cat: "home", rating: 4.6, reviews: 97, image: "https://images.unsplash.com/photo-1678108040468-0cc9addd984d?q=80&w=600&auto=format&fit=crop", shopeeLink: "SHOPEE_LINK_HERE", tiktokLink: "TIKTOK_LINK_HERE" },
  // PRODUCT 4: Electric Kettle
  { name: "Electric Kettle", cat: "home", rating: 4.8, reviews: 356, image: "https://images.unsplash.com/photo-1643114786355-ff9e52736eab?q=80&w=600&auto=format&fit=crop", shopeeLink: "SHOPEE_LINK_HERE", tiktokLink: "TIKTOK_LINK_HERE" },

  // PRODUCT 5: Adjustable Aluminum Laptop Stand
  { name: "Adjustable Aluminum Laptop Stand", cat: "digital", rating: 4.8, reviews: 312, image: "https://images.unsplash.com/photo-1652198145075-b41c363792d3?q=80&w=600&auto=format&fit=crop", shopeeLink: "SHOPEE_LINK_HERE", tiktokLink: "TIKTOK_LINK_HERE" },
  // PRODUCT 6: Wireless Earbuds
  { name: "Wireless Earbuds", cat: "digital", rating: 4.7, reviews: 428, image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=600&auto=format&fit=crop", shopeeLink: "SHOPEE_LINK_HERE", tiktokLink: "TIKTOK_LINK_HERE" },
  // PRODUCT 7: Portable Power Bank
  { name: "Portable Power Bank", cat: "digital", rating: 4.6, reviews: 203, image: "https://images.unsplash.com/photo-1706275399524-813e89914e43?q=80&w=600&auto=format&fit=crop", shopeeLink: "SHOPEE_LINK_HERE", tiktokLink: "TIKTOK_LINK_HERE" },
  // PRODUCT 14: Orashare 20000mAh Power Bank (dual cable, 22.5W)
  { name: "Orashare 20000mAh Power Bank (Dual Cable, 22.5W)", cat: "digital", rating: 4.8, reviews: 214, image: "https://images.unsplash.com/photo-1706275399494-fb26bbc5da63?q=80&w=600&auto=format&fit=crop", shopeeLink: "https://s.shopee.ph/1LeUFGFaLr", tiktokLink: "TIKTOK_LINK_HERE" },

  // PRODUCT 8: Electric Toothbrush
  { name: "Electric Toothbrush", cat: "care", rating: 4.7, reviews: 275, image: "https://images.unsplash.com/photo-1559591939-c2d3c204f6da?q=80&w=600&auto=format&fit=crop", shopeeLink: "SHOPEE_LINK_HERE", tiktokLink: "TIKTOK_LINK_HERE" },
  // PRODUCT 9: LED Makeup Mirror
  { name: "LED Makeup Mirror", cat: "care", rating: 4.5, reviews: 162, image: "https://images.unsplash.com/photo-1701421052815-a66c64693978?q=80&w=600&auto=format&fit=crop", shopeeLink: "SHOPEE_LINK_HERE", tiktokLink: "TIKTOK_LINK_HERE" },
  // PRODUCT 10: Compact Hair Dryer
  { name: "Compact Hair Dryer", cat: "care", rating: 4.6, reviews: 141, image: "https://images.unsplash.com/photo-1715220169023-c1d5c8d2be37?q=80&w=600&auto=format&fit=crop", shopeeLink: "SHOPEE_LINK_HERE", tiktokLink: "TIKTOK_LINK_HERE" },

  // PRODUCT 11: Bamboo Cutting Board
  { name: "Bamboo Cutting Board", cat: "food", rating: 4.5, reviews: 148, image: "https://images.unsplash.com/photo-1617695615794-a5abcece0f48?q=80&w=600&auto=format&fit=crop", shopeeLink: "SHOPEE_LINK_HERE", tiktokLink: "TIKTOK_LINK_HERE" },
  // PRODUCT 12: Ceramic Pour-Over Coffee Dripper
  { name: "Ceramic Pour-Over Coffee Dripper", cat: "food", rating: 4.9, reviews: 501, image: "https://images.unsplash.com/photo-1620051524370-66b4d4ad141b?q=80&w=600&auto=format&fit=crop", shopeeLink: "SHOPEE_LINK_HERE", tiktokLink: "TIKTOK_LINK_HERE" },
  // PRODUCT 13: Glass Airtight Food Storage Jar
  { name: "Glass Airtight Food Storage Jar", cat: "food", rating: 4.7, reviews: 118, image: "https://images.unsplash.com/photo-1615174111664-cbe2de69ed9d?q=80&w=600&auto=format&fit=crop", shopeeLink: "SHOPEE_LINK_HERE", tiktokLink: "TIKTOK_LINK_HERE" },
];

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

function ProductCard({ p }: { p: Product }) {
  return (
    <article className="sf-card">
      <div className="sf-card-media">
        <span className="sf-quality-badge">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 1l2.6 5.6L19 7.3l-4.5 4.2 1.1 6.2L10 14.8l-5.6 2.9 1.1-6.2L1 7.3l6.4-.7z" />
          </svg>
          Tested
        </span>
        <img src={p.image} alt={p.name} loading="lazy" />
      </div>
      <div className="sf-card-body">
        <div className="sf-card-name">{p.name}</div>
        <div className="sf-rating-row">
          <Stars rating={p.rating} />
          <span className="sf-rating-num">{p.rating.toFixed(1)}</span>
        </div>
        <div className="sf-card-actions">
          <a className="sf-btn-store sf-btn-shopee" href={p.shopeeLink} target="_blank" rel="noopener noreferrer">
            Shopee
          </a>
          <a className="sf-btn-store sf-btn-tiktok" href={p.tiktokLink} target="_blank" rel="noopener noreferrer">
            TikTok
          </a>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const [filter, setFilter] = useState("all");
  const featured = PRODUCTS[4]; // Laptop Stand

  return (
    <>
      <style>{`
        .sf-wrap { max-width: 1180px; margin: 0 auto; padding: 0 16px; }

        .sf-header { position: sticky; top: 0; z-index: 20; background: var(--sf-paper); border-bottom: 1px solid var(--sf-border); }
        .sf-header-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 12px 0; }
        .sf-brand-block { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .sf-brand-name { font-weight: 800; font-size: 17px; letter-spacing: -0.01em; color: var(--sf-ink); }
        .sf-brand-tagline { font-size: 10px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: var(--sf-ink-faint); }

        .sf-featured { padding: 22px 0 6px; }
        .sf-featured-label { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: var(--sf-gold-deep); background: rgba(255, 199, 0, 0.15); border-radius: 999px; padding: 5px 12px; margin-bottom: 10px; }
        .sf-hero-frame { position: relative; width: 100%; aspect-ratio: 21 / 9; border-radius: 14px; overflow: hidden; background: var(--sf-border); box-shadow: 0 14px 32px -18px rgba(10,25,47,.3); }
        .sf-hero-frame img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .sf-featured-cta-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 12px; flex-wrap: wrap; }
        .sf-featured-name { font-size: 14px; font-weight: 700; color: var(--sf-ink); }
        .sf-featured-sub { font-size: 11.5px; color: var(--sf-ink-muted); margin-top: 2px; }
        .sf-btn-buy-now { display: inline-flex; align-items: center; gap: 6px; background: var(--sf-gold); color: var(--sf-ink); font-weight: 800; font-size: 13px; padding: 9px 18px; border-radius: 999px; border: none; box-shadow: 0 8px 18px -8px rgba(255,199,0,.6); flex-shrink: 0; cursor: pointer; }

        .sf-tabs-section { padding: 16px 0 4px; }
        .sf-tabs-row { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; }
        .sf-tabs-row::-webkit-scrollbar { display: none; }
        .sf-tab-btn { flex-shrink: 0; border: 1px solid var(--sf-border); background: var(--sf-card); color: var(--sf-ink-muted); font-weight: 700; font-size: 11.5px; padding: 6px 12px; border-radius: 999px; transition: background .15s ease, color .15s ease, border-color .15s ease; cursor: pointer; }
        .sf-tab-btn[aria-pressed=true] { background: var(--sf-ink); border-color: var(--sf-ink); color: var(--sf-gold); }

        .sf-grid-section { padding: 12px 0 30px; }
        .sf-cat-label { font-size: 11px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: var(--sf-ink-faint); margin: 14px 0 8px; }
        .sf-cat-label:first-child { margin-top: 0; }
        .sf-product-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
        @media (min-width: 600px) { .sf-product-grid { grid-template-columns: repeat(4, 1fr); gap: 10px; } }
        @media (min-width: 900px) { .sf-product-grid { grid-template-columns: repeat(6, 1fr); gap: 12px; } }

        .sf-card { background: var(--sf-card); border: 1px solid var(--sf-border); border-radius: 10px; overflow: hidden; display: flex; flex-direction: column; }
        .sf-card-media { position: relative; aspect-ratio: 1; background: var(--sf-border); }
        .sf-card-media img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .sf-quality-badge { position: absolute; top: 5px; left: 5px; display: inline-flex; align-items: center; gap: 2px; background: rgba(10,25,47,.85); color: var(--sf-gold); font-size: 7px; font-weight: 800; letter-spacing: 0.02em; text-transform: uppercase; padding: 3px 5px; border-radius: 999px; }
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

        :root {
          --sf-paper: #FFFFFF;
          --sf-card: #FFFFFF;
          --sf-ink: #0A192F;
          --sf-ink-muted: #5B6472;
          --sf-ink-faint: #8B92A3;
          --sf-gold: #FFC700;
          --sf-gold-deep: #A87B00;
          --sf-border: #ECE7DC;
          --sf-shopee: #EE4D2D;
          --sf-tiktok: #10141C;
          --sf-star: #FFC700;
          --sf-star-bg: #E4E1D6;
        }
      `}</style>

      <div style={{ background: "var(--sf-paper)", color: "var(--sf-ink)", minHeight: "100dvh", fontFamily: "-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif" }}>
        <header className="sf-header">
          <div className="sf-wrap sf-header-row">
            <div className="sf-brand-block">
              <span className="sf-brand-name">Check This Finds</span>
              <span className="sf-brand-tagline">Only Tested &amp; High-Quality Items</span>
            </div>
          </div>
        </header>

        <main className="sf-wrap">
          <section className="sf-featured">
            <span className="sf-featured-label">Featured Find</span>
            <div className="sf-hero-frame">
              <img src={featured.image} alt={featured.name} />
            </div>
            <div className="sf-featured-cta-row">
              <div>
                <div className="sf-featured-name">{featured.name}</div>
                <div className="sf-featured-sub">Tested and approved — grab it below</div>
              </div>
              <a className="sf-btn-buy-now" href="#">
                Buy Now
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 10h10M11 5l5 5-5 5" />
                </svg>
              </a>
            </div>
          </section>

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
                  const items = PRODUCTS.filter((p) => p.cat === key);
                  if (!items.length) return null;
                  return (
                    <div key={key}>
                      <div className="sf-cat-label">{CATEGORIES[key]}</div>
                      <div className="sf-product-grid">
                        {items.map((p) => (
                          <ProductCard key={p.name} p={p} />
                        ))}
                      </div>
                    </div>
                  );
                })
              : (
                <div className="sf-product-grid">
                  {PRODUCTS.filter((p) => p.cat === filter).map((p) => (
                    <ProductCard key={p.name} p={p} />
                  ))}
                </div>
              )}
          </section>
        </main>

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
