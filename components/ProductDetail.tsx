import { Poppins } from "next/font/google";
import type { ProductRecord } from "@/lib/products/store";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

const CATEGORIES: Record<string, string> = {
  home: "Home Needs & Appliances",
  digital: "Digital Finds",
  care: "Personal Care",
  food: "Food & Treats",
};

function bullets(text: string | null): string[] {
  if (!text) return [];
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function ProductDetail({ product }: { product: ProductRecord }) {
  const pros = bullets(product.pros);
  const cons = bullets(product.cons);
  const pct = Math.round((product.rating / 5) * 100);

  return (
    <>
      <style>{`
        .pd-wrap { max-width: 1000px; margin: 0 auto; padding: 0 16px; }
        .pd-header { position: sticky; top: 0; z-index: 20; background: rgba(245,241,243,.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid var(--sf-border); }
        .pd-header-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 14px 0; }
        .pd-brand { font-weight: 700; font-size: 20px; letter-spacing: -0.01em; color: var(--sf-ink); }
        .pd-back { font-size: 12.5px; font-weight: 600; color: var(--sf-white); background: var(--sf-pink); border: none; border-radius: 999px; padding: 7px 16px; }

        .pd-main { padding: 30px 0 40px; }
        .pd-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
        @media (min-width: 760px) { .pd-grid { grid-template-columns: 1fr 1fr; gap: 32px; align-items: start; } }

        .pd-media { position: relative; width: 100%; aspect-ratio: 1 / 1; border-radius: 24px; overflow: hidden; background: var(--sf-card); box-shadow: 0 10px 28px -10px rgba(60,45,55,.25); }
        .pd-media img { width: 100%; height: 100%; object-fit: cover; display: block; }

        .pd-cat { display: inline-flex; font-size: 10.5px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--sf-white); background: var(--sf-pink); border-radius: 999px; padding: 6px 14px; margin-bottom: 12px; }
        .pd-name { font-size: 24px; font-weight: 700; color: var(--sf-ink); line-height: 1.25; }
        .pd-rating-row { display: flex; align-items: center; gap: 8px; margin-top: 10px; }
        .pd-stars { position: relative; display: inline-block; font-size: 18px; line-height: 1; letter-spacing: 2px; color: var(--sf-border); }
        .pd-stars-fill { position: absolute; inset: 0; overflow: hidden; color: var(--sf-pink); white-space: nowrap; }
        .pd-rating-num { font-size: 14px; font-weight: 600; color: var(--sf-muted); }

        .pd-cols { display: grid; grid-template-columns: 1fr; gap: 16px; margin-top: 24px; }
        @media (min-width: 480px) { .pd-cols { grid-template-columns: 1fr 1fr; } }
        .pd-col-card { background: var(--sf-card); border-radius: 18px; padding: 18px; box-shadow: 0 4px 16px -6px rgba(60,45,55,.18); }
        .pd-col-title { font-size: 12px; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase; margin-bottom: 10px; color: var(--sf-pink); }
        .pd-col-list { display: flex; flex-direction: column; gap: 8px; }
        .pd-col-item { display: flex; align-items: flex-start; gap: 8px; font-size: 13.5px; color: var(--sf-ink); line-height: 1.4; font-weight: 500; }
        .pd-col-icon { flex-shrink: 0; margin-top: 2px; color: var(--sf-pink); }

        .pd-cta-row { display: flex; gap: 10px; margin-top: 26px; flex-wrap: wrap; }
        .pd-btn-store { display: inline-flex; align-items: center; justify-content: center; gap: 6px; font-size: 14px; font-weight: 700; padding: 13px 24px; border-radius: 999px; border: none; color: var(--sf-white); cursor: pointer; background: var(--sf-pink); }
        @media (prefers-reduced-motion: no-preference) { .pd-btn-store { transition: opacity .15s ease; } .pd-btn-store:hover { opacity: .85; } }

        .pd-footer { margin-top: 24px; border-top: 1px solid var(--sf-border); padding: 28px 0 40px; }
        .pd-footer-copy { font-size: 12.5px; color: var(--sf-muted); text-align: center; }

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
        }}
      >
        <header className="pd-header">
          <div className="pd-wrap pd-header-row">
            <a href="/" className="pd-brand">Check This Finds</a>
            <a href="/" className="pd-back">Back to all finds</a>
          </div>
        </header>

        <main className="pd-wrap pd-main">
          <div className="pd-grid">
            <div className="pd-media">
              <img src={product.imageUrl} alt={product.name} />
            </div>

            <div>
              <span className="pd-cat">{CATEGORIES[product.category] ?? product.category}</span>
              <h1 className="pd-name">{product.name}</h1>
              <div className="pd-rating-row">
                <span className="pd-stars" aria-hidden="true">
                  ★★★★★
                  <span className="pd-stars-fill" style={{ width: `${pct}%` }}>★★★★★</span>
                </span>
                <span className="pd-rating-num">{product.rating.toFixed(1)} ({product.reviews} reviews)</span>
              </div>

              {(pros.length > 0 || cons.length > 0) && (
                <div className="pd-cols">
                  {pros.length > 0 && (
                    <div className="pd-col-card">
                      <div className="pd-col-title">What we liked</div>
                      <div className="pd-col-list">
                        {pros.map((item, i) => (
                          <div className="pd-col-item" key={i}>
                            <span className="pd-col-icon">✓</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {cons.length > 0 && (
                    <div className="pd-col-card">
                      <div className="pd-col-title">Worth noting</div>
                      <div className="pd-col-list">
                        {cons.map((item, i) => (
                          <div className="pd-col-item" key={i}>
                            <span className="pd-col-icon">✕</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="pd-cta-row">
                <a className="pd-btn-store" href={product.shopeeLink || "#"} target="_blank" rel="noopener noreferrer">
                  Buy on Shopee
                </a>
                <a className="pd-btn-store" href={product.tiktokLink || "#"} target="_blank" rel="noopener noreferrer">
                  Buy on TikTok
                </a>
              </div>
            </div>
          </div>
        </main>

        <footer className="pd-footer">
          <div className="pd-wrap pd-footer-copy">© {new Date().getFullYear()} Check This Finds. This site contains affiliate links.</div>
        </footer>
      </div>
    </>
  );
}
