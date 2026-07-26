"use client";
import { useState } from "react";

const NAVY = "#0A192F";

type Product = {
  name: string;
  cat: string[];
  rating: number;
  reviews: number;
  tint: string;
  icon: React.ReactNode;
};

const PRODUCTS: Product[] = [
  {
    name: "Adjustable Aluminum Laptop Stand",
    cat: ["home", "top"],
    rating: 4.8,
    reviews: 312,
    tint: "linear-gradient(150deg,#FFF3D6,#FFE6A6)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="10" rx="1.5" />
        <path d="M2 18h20l-2 3H4z" />
      </svg>
    ),
  },
  {
    name: "Ceramic Pour-Over Coffee Dripper",
    cat: ["kitchen", "top"],
    rating: 4.9,
    reviews: 501,
    tint: "linear-gradient(150deg,#F3ECE2,#E3D5C0)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8H13v6a4 4 0 0 1-8 0V8H4" />
        <path d="M8 8V5h8v3" />
        <path d="M6 20h12" />
      </svg>
    ),
  },
  {
    name: "Stackable Foldable Storage Bins",
    cat: ["home"],
    rating: 4.6,
    reviews: 189,
    tint: "linear-gradient(150deg,#EAF1EA,#D3E4D2)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="9" width="16" height="11" rx="1.5" />
        <path d="M4 9l3-5h10l3 5" />
      </svg>
    ),
  },
  {
    name: "Minimalist LED Desk Lamp",
    cat: ["home", "top"],
    rating: 4.7,
    reviews: 264,
    tint: "linear-gradient(150deg,#EFEAF7,#DCD2EE)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 21h8M10 21v-6" />
        <path d="M4 9l6-6 8 8-6 4-8-6z" />
      </svg>
    ),
  },
  {
    name: "Reusable Silicone Food Bags (Set of 6)",
    cat: ["kitchen"],
    rating: 4.5,
    reviews: 148,
    tint: "linear-gradient(150deg,#E7F3F1,#CDE7E2)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 4h10l1 6a8 8 0 0 1-12 0z" />
        <path d="M9 4V2M15 4V2" />
      </svg>
    ),
  },
  {
    name: "Bamboo Drawer Organizer Set",
    cat: ["home"],
    rating: 4.6,
    reviews: 97,
    tint: "linear-gradient(150deg,#F7EFE4,#EBDBC2)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="6" width="8" height="8" rx="1" />
        <rect x="13" y="6" width="8" height="8" rx="1" />
        <rect x="3" y="16" width="18" height="4" rx="1" />
      </svg>
    ),
  },
  {
    name: "Electric Milk Frother",
    cat: ["kitchen", "top"],
    rating: 4.8,
    reviews: 356,
    tint: "linear-gradient(150deg,#FDECE7,#F8D4C7)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="2" width="6" height="4" rx="1" />
        <path d="M12 6v6M8 12h8l-1 8H9z" />
      </svg>
    ),
  },
  {
    name: "Under-Sink Sliding Storage Rack",
    cat: ["kitchen"],
    rating: 4.5,
    reviews: 121,
    tint: "linear-gradient(150deg,#EAF0F6,#D2E0EE)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="16" rx="1.5" />
        <path d="M3 12h18M9 4v16" />
      </svg>
    ),
  },
];

const TABS = [
  { key: "all", label: "All Finds" },
  { key: "home", label: "Home & Living" },
  { key: "kitchen", label: "Kitchen Must-Haves" },
  { key: "top", label: "Top Rated" },
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

export default function Home() {
  const [filter, setFilter] = useState("all");
  const visible = filter === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.cat.includes(filter));

  return (
    <>
      <style>{`
        .sf-wrap { max-width: 1080px; margin: 0 auto; padding: 0 20px; }

        .sf-header { position: sticky; top: 0; z-index: 20; background: var(--sf-paper); border-bottom: 1px solid var(--sf-border); }
        .sf-header-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 14px 0; }
        .sf-brand-block { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .sf-brand-name { font-weight: 800; font-size: 19px; letter-spacing: -0.01em; color: var(--sf-ink); }
        .sf-brand-tagline { font-size: 11px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: var(--sf-ink-faint); }
        .sf-social-row { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        .sf-social-btn { display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 50%; background: var(--sf-card); border: 1px solid var(--sf-border); color: var(--sf-ink); transition: transform .15s ease, border-color .15s ease; }
        .sf-social-btn svg { width: 16px; height: 16px; }
        @media (prefers-reduced-motion: no-preference) { .sf-social-btn:hover { transform: translateY(-2px); border-color: var(--sf-gold); } }

        .sf-featured { padding: 28px 0 8px; }
        .sf-featured-label { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: var(--sf-gold-deep); background: rgba(255, 199, 0, 0.15); border-radius: 999px; padding: 5px 12px; margin-bottom: 12px; }
        .sf-video-frame { position: relative; width: 100%; aspect-ratio: 16 / 9; border-radius: 16px; overflow: hidden; background: radial-gradient(120% 140% at 15% 10%, rgba(255,199,0,.35), transparent 55%), linear-gradient(150deg, #16233C, #0A192F 70%); display: flex; align-items: center; justify-content: center; box-shadow: 0 18px 40px -20px rgba(10,25,47,.5); }
        .sf-play-btn { width: 64px; height: 64px; border-radius: 50%; background: rgba(255,255,255,.14); border: 1.5px solid rgba(255,255,255,.5); display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
        .sf-play-btn svg { width: 22px; height: 22px; margin-left: 3px; }
        .sf-video-caption { position: absolute; left: 16px; bottom: 14px; right: 16px; color: #fff; font-size: 13px; font-weight: 600; opacity: .85; }
        .sf-featured-cta-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 16px; flex-wrap: wrap; }
        .sf-featured-name { font-size: 15px; font-weight: 700; color: var(--sf-ink); }
        .sf-featured-sub { font-size: 12.5px; color: var(--sf-ink-muted); margin-top: 2px; }
        .sf-btn-buy-now { display: inline-flex; align-items: center; gap: 6px; background: var(--sf-gold); color: var(--sf-ink); font-weight: 800; font-size: 14px; padding: 11px 22px; border-radius: 999px; border: none; box-shadow: 0 10px 22px -8px rgba(255,199,0,.6); flex-shrink: 0; cursor: pointer; }

        .sf-tabs-section { padding: 28px 0 4px; }
        .sf-tabs-row { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; }
        .sf-tabs-row::-webkit-scrollbar { display: none; }
        .sf-tab-btn { flex-shrink: 0; border: 1px solid var(--sf-border); background: var(--sf-card); color: var(--sf-ink-muted); font-weight: 700; font-size: 13px; padding: 9px 16px; border-radius: 999px; transition: background .15s ease, color .15s ease, border-color .15s ease; cursor: pointer; }
        .sf-tab-btn[aria-pressed=true] { background: var(--sf-ink); border-color: var(--sf-ink); color: var(--sf-gold); }

        .sf-grid-section { padding: 20px 0 8px; }
        .sf-product-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
        @media (min-width: 720px) { .sf-product-grid { grid-template-columns: repeat(4, 1fr); gap: 20px; } }

        .sf-card { background: var(--sf-card); border: 1px solid var(--sf-border); border-radius: 16px; overflow: hidden; display: flex; flex-direction: column; }
        .sf-card-media { position: relative; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; }
        .sf-card-media svg { width: 38%; height: 38%; opacity: .85; }
        .sf-quality-badge { position: absolute; top: 10px; left: 10px; display: inline-flex; align-items: center; gap: 4px; background: rgba(10,25,47,.85); color: var(--sf-gold); font-size: 9.5px; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase; padding: 5px 9px; border-radius: 999px; }
        .sf-quality-badge svg { width: 10px; height: 10px; }
        .sf-card-body { padding: 12px 12px 14px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
        .sf-card-name { font-size: 13.5px; font-weight: 700; line-height: 1.3; color: var(--sf-ink); min-height: 34px; }
        .sf-stars { position: relative; display: inline-block; font-size: 12px; line-height: 1; letter-spacing: 2px; color: var(--sf-star-bg); }
        .sf-stars-fill { position: absolute; inset: 0; overflow: hidden; color: var(--sf-star); white-space: nowrap; }
        .sf-rating-row { display: flex; align-items: center; gap: 6px; }
        .sf-rating-num { font-size: 11.5px; font-weight: 700; color: var(--sf-ink-muted); font-variant-numeric: tabular-nums; }
        .sf-card-actions { display: flex; flex-direction: column; gap: 6px; margin-top: auto; }
        .sf-btn-store { display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 12px; font-weight: 700; padding: 9px 8px; border-radius: 10px; border: none; color: #fff; cursor: pointer; }
        .sf-btn-shopee { background: var(--sf-shopee); }
        .sf-btn-tiktok { background: var(--sf-tiktok); }
        @media (prefers-reduced-motion: no-preference) { .sf-btn-store { transition: opacity .15s ease; } .sf-btn-store:hover { opacity: .88; } }

        .sf-footer { margin-top: 44px; border-top: 1px solid var(--sf-border); padding: 26px 0 40px; }
        .sf-footer-copy { font-size: 12.5px; color: var(--sf-ink-muted); text-align: center; }
        .sf-footer-disclosure { font-size: 11.5px; color: var(--sf-ink-faint); text-align: center; max-width: 460px; margin: 8px auto 0; line-height: 1.5; }

        :root {
          --sf-paper: #FFFCF6;
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
        @media (prefers-color-scheme: dark) {
          :root { --sf-paper: #14181F; --sf-card: #1B212C; --sf-ink: #F3F1EA; --sf-ink-muted: #A6ADBB; --sf-ink-faint: #6E7585; --sf-border: #2A3140; --sf-star-bg: #333B4B; }
        }
      `}</style>

      <div style={{ background: "var(--sf-paper)", color: "var(--sf-ink)", minHeight: "100dvh", fontFamily: "-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif" }}>
        <header className="sf-header">
          <div className="sf-wrap sf-header-row">
            <div className="sf-brand-block">
              <span className="sf-brand-name">Check This Finds</span>
              <span className="sf-brand-tagline">Only Tested &amp; High-Quality Items</span>
            </div>
            <div className="sf-social-row">
              <a className="sf-social-btn" href="#" aria-label="Check This Finds on TikTok">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.6 5.2c-.9-.8-1.4-1.9-1.5-3.2h-3.1v13.6c0 1.5-1.2 2.7-2.7 2.7-1.5 0-2.7-1.2-2.7-2.7 0-1.5 1.2-2.7 2.7-2.7.3 0 .6.05.9.14V9.9c-.3-.04-.6-.06-.9-.06-3.2 0-5.8 2.6-5.8 5.8s2.6 5.8 5.8 5.8 5.8-2.6 5.8-5.8V8.6c1.2.9 2.7 1.4 4.3 1.4V6.9c-.9 0-1.8-.3-2.5-.9-.1-.2-.2-.3-.3-.5-.4-.1-.7-.2-1-.3z" />
                </svg>
              </a>
              <a className="sf-social-btn" href="#" aria-label="Check This Finds on Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.5 21v-7.6h2.6l.4-3h-3v-1.9c0-.87.24-1.46 1.5-1.46h1.6V4.3c-.28-.04-1.23-.12-2.34-.12-2.32 0-3.9 1.4-3.9 4V10.4H7.3v3h2.4V21h3.8z" />
                </svg>
              </a>
            </div>
          </div>
        </header>

        <main className="sf-wrap">
          <section className="sf-featured">
            <span className="sf-featured-label">Featured Find</span>
            <div className="sf-video-frame">
              {/* Swap for a real embed: <iframe src="https://www.youtube.com/embed/VIDEO_ID" allowFullScreen /> */}
              <div className="sf-play-btn">
                <svg viewBox="0 0 24 24" fill="#fff">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div className="sf-video-caption">AI Product Review — this week&rsquo;s pick, tested end to end</div>
            </div>
            <div className="sf-featured-cta-row">
              <div>
                <div className="sf-featured-name">Adjustable Aluminum Laptop Stand</div>
                <div className="sf-featured-sub">Watch the full review, then grab it below</div>
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
            <div className="sf-product-grid">
              {visible.map((p) => (
                <article key={p.name} className="sf-card">
                  <div className="sf-card-media" style={{ background: p.tint }}>
                    <span className="sf-quality-badge">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 1l2.6 5.6L19 7.3l-4.5 4.2 1.1 6.2L10 14.8l-5.6 2.9 1.1-6.2L1 7.3l6.4-.7z" />
                      </svg>
                      Tested Quality
                    </span>
                    {p.icon}
                  </div>
                  <div className="sf-card-body">
                    <div className="sf-card-name">{p.name}</div>
                    <div className="sf-rating-row">
                      <Stars rating={p.rating} />
                      <span className="sf-rating-num">
                        {p.rating.toFixed(1)} ({p.reviews})
                      </span>
                    </div>
                    <div className="sf-card-actions">
                      <button className="sf-btn-store sf-btn-shopee" type="button">
                        Buy on Shopee
                      </button>
                      <button className="sf-btn-store sf-btn-tiktok" type="button">
                        Buy on TikTok
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
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
