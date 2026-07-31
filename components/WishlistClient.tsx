"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Poppins, Playfair_Display } from "next/font/google";
import type { ProductRecord } from "@/lib/products/store";
import { track } from "@/lib/tracking/track";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["600", "700", "800"] });

const WISHLIST_KEY = "ctf_wishlist";

function LogoMark({ size = 26 }: { size?: number }) {
  return (
    <img
      src="/images/logo.png"
      alt="Check This Finds"
      width={size}
      height={size}
      style={{ width: size, height: size, objectFit: "contain", flexShrink: 0 }}
    />
  );
}

function HeartIcon({ className, filled }: { className?: string; filled?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} aria-hidden="true">
      <path
        d="M12 20.5s-7.5-4.6-9.9-9.1C.6 7.7 2.3 4 6 4c2.1 0 3.6 1.2 6 3.6C14.4 5.2 15.9 4 18 4c3.7 0 5.4 3.7 3.9 7.4C19.5 15.9 12 20.5 12 20.5z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function WishlistClient({ products, isAdmin }: { products: ProductRecord[]; isAdmin: boolean }) {
  const [ids, setIds] = useState<string[] | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");
      setIds(Array.isArray(saved) ? saved : []);
    } catch {
      setIds([]);
    }
  }, []);

  function removeFromWishlist(id: string) {
    setIds((prev) => {
      const next = (prev ?? []).filter((x) => x !== id);
      try {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }

  const saved = ids === null ? null : products.filter((p) => ids.includes(p.id));

  return (
    <>
      <style>{`
        .wl-wrap { max-width: 1100px; margin: 0 auto; padding: 0 20px; }
        .wl-header { position: sticky; top: 0; z-index: 20; background: rgba(250,250,247,.88); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid var(--sf-border); }
        .wl-header-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 14px 0; }
        .wl-brand { display: flex; align-items: center; gap: 9px; font-weight: 800; font-size: 17px; letter-spacing: -0.01em; color: var(--sf-ink); text-decoration: none; }
        .wl-back { font-size: 12.5px; font-weight: 700; color: var(--sf-white); background: var(--sf-primary); border: none; border-radius: 999px; padding: 8px 18px; text-decoration: none; }

        .wl-main { padding: 40px 0 60px; }
        .wl-title { font-size: 26px; font-weight: 800; color: var(--sf-ink); margin: 0 0 6px; }
        .wl-sub { font-size: 13.5px; color: var(--sf-muted); margin: 0 0 32px; }

        .wl-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        @media (min-width: 560px) { .wl-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 800px) { .wl-grid { grid-template-columns: repeat(4, 1fr); } }

        .wl-card { background: var(--sf-card); border-radius: 18px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 8px 24px -16px rgba(31,41,55,.2); }
        .wl-card-link { display: flex; flex-direction: column; text-decoration: none; color: inherit; }
        .wl-card-media { position: relative; aspect-ratio: 1; background: var(--sf-border); }
        .wl-card-media img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .wl-remove-btn { position: absolute; top: 8px; right: 8px; width: 30px; height: 30px; border-radius: 50%; background: rgba(255,255,255,.94); border: none; display: flex; align-items: center; justify-content: center; color: #C6603F; cursor: pointer; box-shadow: 0 3px 10px -3px rgba(0,0,0,.3); }
        .wl-remove-btn::before { content: ""; position: absolute; inset: -7px; }
        .wl-remove-btn svg { width: 15px; height: 15px; }
        .wl-card-body { padding: 12px 13px 10px; display: flex; flex-direction: column; gap: 6px; flex: 1; }
        .wl-card-name { font-size: 12.5px; font-weight: 700; line-height: 1.35; color: var(--sf-ink); min-height: 34px; }
        .wl-card-price { font-size: 13.5px; font-weight: 800; color: var(--sf-accent); }
        .wl-card-actions { padding: 0 13px 13px; }
        .wl-btn-store { display: flex; align-items: center; justify-content: center; gap: 4px; font-size: 11px; font-weight: 700; min-height: 44px; padding: 8px; border-radius: 999px; border: none; color: var(--sf-white); cursor: pointer; background: var(--sf-primary); text-decoration: none; }
        .wl-btn-store svg { width: 10px; height: 10px; }

        .wl-empty { text-align: center; padding: 60px 20px; }
        .wl-empty-icon { width: 52px; height: 52px; color: var(--sf-border); margin: 0 auto 18px; }
        .wl-empty h2 { font-size: 18px; font-weight: 800; color: var(--sf-ink); margin: 0 0 8px; }
        .wl-empty p { font-size: 13.5px; color: var(--sf-muted); margin: 0 0 24px; }
        .wl-empty a { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; color: var(--sf-white); background: var(--sf-primary); border-radius: 999px; padding: 12px 26px; text-decoration: none; }

        a:focus-visible, button:focus-visible { outline: 2px solid var(--sf-primary); outline-offset: 2px; border-radius: 4px; }

        :root {
          --sf-bg: #FAFAF7;
          --sf-card: #FFFFFF;
          --sf-border: #E7E3D9;
          --sf-ink: #1F2937;
          --sf-muted: #6B7280;
          --sf-primary: #0B6B57;
          --sf-secondary: #0F766E;
          --sf-accent: #D4AF37;
          --sf-white: #FFFFFF;
        }
      `}</style>

      <div
        className={poppins.className}
        style={{
          background: "var(--sf-bg)",
          color: "var(--sf-ink)",
          minHeight: "100dvh",
        }}
      >
        <header className="wl-header">
          <div className="wl-wrap wl-header-row">
            <a href="/" className={`wl-brand ${playfair.className}`}>
              <LogoMark size={26} />
              Check This Finds
            </a>
            <a href="/" className="wl-back">Back to all finds</a>
          </div>
        </header>

        <main className="wl-wrap wl-main">
          <h1 className={`wl-title ${playfair.className}`}>Your Wishlist</h1>
          <p className="wl-sub">Products you&apos;ve saved by tapping the heart on any item.</p>

          {saved === null ? null : saved.length === 0 ? (
            <div className="wl-empty">
              <HeartIcon className="wl-empty-icon" />
              <h2 className={playfair.className}>No saved finds yet</h2>
              <p>Browse the shop and tap the heart on anything you want to come back to.</p>
              <Link href="/">Explore Finds</Link>
            </div>
          ) : (
            <div className="wl-grid">
              {saved.map((p) => (
                <article className="wl-card" key={p.id}>
                  <Link href={`/product/${p.id}`} className="wl-card-link">
                    <div className="wl-card-media">
                      <img src={p.imageUrl} alt={p.name} loading="lazy" />
                    </div>
                    <div className="wl-card-body">
                      <div className="wl-card-name">{p.name}</div>
                      {p.price != null && <span className="wl-card-price">₱{p.price.toLocaleString()}</span>}
                    </div>
                  </Link>
                  <button
                    type="button"
                    className="wl-remove-btn"
                    aria-label="Remove from wishlist"
                    onClick={() => removeFromWishlist(p.id)}
                  >
                    <HeartIcon filled />
                  </button>
                  <div className="wl-card-actions">
                    {p.shopeeLink && (
                      <a
                        className="wl-btn-store"
                        href={p.shopeeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => { if (!isAdmin) track("product_click", p.id); }}
                      >
                        Buy on Shopee
                        <ArrowRightIcon />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
