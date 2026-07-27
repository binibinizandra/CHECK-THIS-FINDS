import type { ProductRecord } from "@/lib/products/store";

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
        .pd-header { position: sticky; top: 0; z-index: 20; background: var(--sf-paper); border-bottom: 2px solid var(--sf-gold); }
        .pd-header-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 12px 0; }
        .pd-brand { font-weight: 800; font-size: 22px; letter-spacing: -0.01em; color: var(--sf-ink); }
        .pd-back { font-size: 12.5px; font-weight: 700; color: var(--sf-ink-muted); border: 1px solid var(--sf-border); border-radius: 999px; padding: 6px 14px; }

        .pd-main { padding: 28px 0 40px; }
        .pd-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
        @media (min-width: 760px) { .pd-grid { grid-template-columns: 1fr 1fr; gap: 32px; align-items: start; } }

        .pd-media { position: relative; width: 100%; aspect-ratio: 1 / 1; border-radius: 16px; overflow: hidden; background: var(--sf-card); box-shadow: 0 1px 3px rgba(0,0,0,.06), 0 8px 20px -6px rgba(0,0,0,.1); }
        .pd-media img { width: 100%; height: 100%; object-fit: cover; display: block; }

        .pd-cat { display: inline-flex; font-size: 11px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: var(--sf-gold-deep); background: rgba(255, 199, 0, 0.15); border-radius: 999px; padding: 5px 12px; margin-bottom: 10px; }
        .pd-name { font-size: 24px; font-weight: 800; color: var(--sf-ink); line-height: 1.2; }
        .pd-rating-row { display: flex; align-items: center; gap: 8px; margin-top: 10px; }
        .pd-stars { position: relative; display: inline-block; font-size: 18px; line-height: 1; letter-spacing: 2px; color: var(--sf-star-bg); }
        .pd-stars-fill { position: absolute; inset: 0; overflow: hidden; color: var(--sf-star); white-space: nowrap; }
        .pd-rating-num { font-size: 14px; font-weight: 700; color: var(--sf-ink-muted); }

        .pd-cols { display: grid; grid-template-columns: 1fr; gap: 16px; margin-top: 22px; }
        @media (min-width: 480px) { .pd-cols { grid-template-columns: 1fr 1fr; } }
        .pd-col-card { background: var(--sf-card); border-radius: 16px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,.06), 0 4px 8px -2px rgba(0,0,0,.06); }
        .pd-col-title { font-size: 12.5px; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase; margin-bottom: 10px; }
        .pd-col-title-pros { color: #1a7a3c; }
        .pd-col-title-cons { color: #a32d2d; }
        .pd-col-list { display: flex; flex-direction: column; gap: 8px; }
        .pd-col-item { display: flex; align-items: flex-start; gap: 8px; font-size: 13.5px; color: var(--sf-ink); line-height: 1.4; }
        .pd-col-icon { flex-shrink: 0; margin-top: 2px; }

        .pd-cta-row { display: flex; gap: 10px; margin-top: 24px; flex-wrap: wrap; }
        .pd-btn-store { display: inline-flex; align-items: center; justify-content: center; gap: 6px; font-size: 14px; font-weight: 800; padding: 12px 22px; border-radius: 999px; border: none; color: #fff; cursor: pointer; }
        .pd-btn-shopee { background: var(--sf-shopee); }
        .pd-btn-tiktok { background: var(--sf-tiktok); }

        .pd-footer { margin-top: 20px; border-top: 1px solid var(--sf-border); padding: 26px 0 40px; }
        .pd-footer-copy { font-size: 12.5px; color: var(--sf-ink-muted); text-align: center; }

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
                      <div className="pd-col-title pd-col-title-pros">What we liked</div>
                      <div className="pd-col-list">
                        {pros.map((item, i) => (
                          <div className="pd-col-item" key={i}>
                            <span className="pd-col-icon" style={{ color: "#1a7a3c" }}>✓</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {cons.length > 0 && (
                    <div className="pd-col-card">
                      <div className="pd-col-title pd-col-title-cons">Worth noting</div>
                      <div className="pd-col-list">
                        {cons.map((item, i) => (
                          <div className="pd-col-item" key={i}>
                            <span className="pd-col-icon" style={{ color: "#a32d2d" }}>✕</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="pd-cta-row">
                <a className="pd-btn-store pd-btn-shopee" href={product.shopeeLink || "#"} target="_blank" rel="noopener noreferrer">
                  Shop on Shopee
                </a>
                <a className="pd-btn-store pd-btn-tiktok" href={product.tiktokLink || "#"} target="_blank" rel="noopener noreferrer">
                  Shop on TikTok
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
