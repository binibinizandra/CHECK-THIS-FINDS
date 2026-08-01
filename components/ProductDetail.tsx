import Image from "next/image";
import { Poppins, Playfair_Display } from "next/font/google";
import type { ProductRecord } from "@/lib/products/store";
import type { CommentRecord } from "@/lib/comments/store";
import ProductComments from "@/components/ProductComments";
import { ProductViewTracker, TrackedBuyButton } from "@/components/ProductTracking";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["600", "700", "800"] });

const CATEGORIES: Record<string, string> = {
  home: "Home Needs & Appliances",
  digital: "Digital Finds",
  care: "Personal Care",
  food: "Food & Treats",
};

const BADGE_INFO: Record<string, { label: string; bg: string; color: string }> = {
  best_pick: { label: "Best Pick", bg: "#D4AF37", color: "#1F2937" },
  trending: { label: "Trending", bg: "#C6603F", color: "#FFFFFF" },
  editors_choice: { label: "Editor's Choice", bg: "#0F766E", color: "#FFFFFF" },
  worth_every_peso: { label: "Worth Every Peso", bg: "#0B6B57", color: "#FFFFFF" },
};

function LogoMark({ size = 26 }: { size?: number }) {
  return (
    <Image
      src="/images/logo.png"
      alt="Check This Finds"
      width={size}
      height={size}
      style={{ width: size, height: size, objectFit: "contain", flexShrink: 0 }}
    />
  );
}

function bullets(text: string | null): string[] {
  if (!text) return [];
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function ProductDetail({
  product,
  comments,
  isAdmin,
}: {
  product: ProductRecord;
  comments: CommentRecord[];
  isAdmin: boolean;
}) {
  const pros = bullets(product.pros);
  const cons = bullets(product.cons);
  const badge = product.badge ? BADGE_INFO[product.badge] : null;

  return (
    <>
      <style>{`
        .pd-wrap { max-width: 1000px; margin: 0 auto; padding: 0 20px; }
        .pd-header { position: sticky; top: 0; z-index: 20; background: rgba(250,250,247,.88); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid var(--sf-border); }
        .pd-header-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding-top: 14px; padding-bottom: 14px; }
        .pd-brand { display: flex; align-items: center; gap: 9px; font-weight: 800; font-size: 17px; letter-spacing: -0.01em; color: var(--sf-ink); text-decoration: none; }
        .pd-back { font-size: 12.5px; font-weight: 700; color: var(--sf-white); background: var(--sf-primary); border: none; border-radius: 999px; padding: 8px 18px; text-decoration: none; }

        .pd-main { padding-top: 32px; padding-bottom: 40px; }
        .pd-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
        @media (min-width: 760px) { .pd-grid { grid-template-columns: 1fr 1fr; gap: 36px; align-items: start; } }

        .pd-media { position: relative; width: 100%; aspect-ratio: 1 / 1; border-radius: 24px; overflow: hidden; background: var(--sf-card); box-shadow: 0 14px 32px -14px rgba(31,41,55,.28); }
        .pd-media img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .pd-media-badge { position: absolute; top: 14px; left: 14px; font-size: 11px; font-weight: 800; letter-spacing: 0.02em; border-radius: 999px; padding: 6px 13px; box-shadow: 0 3px 12px -3px rgba(0,0,0,.35); }

        .pd-cat { display: inline-flex; font-size: 10.5px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--sf-white); background: var(--sf-primary); border-radius: 999px; padding: 6px 14px; margin-bottom: 14px; }
        .pd-name { font-size: 25px; font-weight: 800; color: var(--sf-ink); line-height: 1.25; }

        .pd-cols { display: grid; grid-template-columns: 1fr; gap: 16px; margin-top: 26px; }
        @media (min-width: 480px) { .pd-cols { grid-template-columns: 1fr 1fr; } }
        .pd-col-card { background: var(--sf-card); border: 1px solid var(--sf-border); border-radius: 18px; padding: 18px; }
        .pd-col-title { font-size: 11.5px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 12px; color: var(--sf-primary); }
        .pd-col-list { display: flex; flex-direction: column; gap: 9px; }
        .pd-col-item { display: flex; align-items: flex-start; gap: 8px; font-size: 13.5px; color: var(--sf-ink); line-height: 1.45; font-weight: 500; }
        .pd-col-icon { flex-shrink: 0; margin-top: 2px; color: var(--sf-primary); }

        .pd-voucher { margin-top: 22px; font-size: 13px; color: var(--sf-ink); font-weight: 600; background: #FBF1E6; border: 1px dashed var(--sf-accent); border-radius: 12px; padding: 11px 15px; }
        .pd-voucher-tag { display: inline-block; font-size: 10px; font-weight: 800; color: #1F2937; background: var(--sf-accent); border-radius: 999px; padding: 2px 9px; margin-right: 7px; vertical-align: middle; }

        .pd-cta-row { display: flex; gap: 10px; margin-top: 28px; flex-wrap: wrap; }
        .pd-btn-store { display: inline-flex; align-items: center; justify-content: center; gap: 6px; font-size: 14px; font-weight: 700; padding: 14px 26px; border-radius: 999px; border: none; color: var(--sf-white); cursor: pointer; background: var(--sf-primary); }
        @media (prefers-reduced-motion: no-preference) { .pd-btn-store { transition: background .15s ease; } .pd-btn-store:hover { background: var(--sf-secondary); } }

        .pd-comments { margin-top: 36px; background: var(--sf-card); border: 1px solid var(--sf-border); border-radius: 20px; padding: 20px; }
        .pd-comment-empty { font-size: 13px; color: var(--sf-muted); }
        .pd-comment-list { display: flex; flex-direction: column; gap: 10px; }
        .pd-comment-item { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; padding: 11px 14px; background: var(--sf-bg); border-radius: 12px; }
        .pd-comment-body { font-size: 13.5px; color: var(--sf-ink); line-height: 1.5; word-break: break-word; white-space: pre-wrap; }
        .pd-comment-link { color: var(--sf-primary); font-weight: 700; word-break: break-all; }
        .pd-comment-delete { flex-shrink: 0; font-size: 11px; font-weight: 600; color: var(--sf-muted); background: none; border: 1px solid var(--sf-border); border-radius: 999px; padding: 4px 10px; cursor: pointer; }
        .pd-comment-form { margin-top: 14px; display: flex; flex-direction: column; gap: 8px; }
        .pd-comment-input { width: 100%; font-size: 13.5px; padding: 11px 13px; border: 1px solid var(--sf-border); border-radius: 10px; color: var(--sf-ink); background: var(--sf-bg); resize: vertical; font-family: inherit; }
        .pd-comment-submit { align-self: flex-start; padding: 10px 22px; font-size: 12.5px; }
        .pd-comment-error { color: #B4483A; font-size: 12.5px; }

        .pd-footer { margin-top: 24px; border-top: 1px solid var(--sf-border); padding: 28px 0 40px; }
        .pd-footer-copy { font-size: 12px; color: var(--sf-muted); text-align: center; }

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
        <ProductViewTracker productId={product.id} isAdmin={isAdmin} />

        <header className="pd-header">
          <div className="pd-wrap pd-header-row">
            <a href="/" className={`pd-brand ${playfair.className}`}>
              <LogoMark size={24} />
              Check This Finds
            </a>
            <a href="/" className="pd-back">Back to all finds</a>
          </div>
        </header>

        <main className="pd-wrap pd-main">
          <div className="pd-grid">
            <div className="pd-media">
              <Image src={product.imageUrl} alt={product.name} fill priority sizes="(min-width: 760px) 480px, 100vw" />
              {badge && (
                <span className="pd-media-badge" style={{ background: badge.bg, color: badge.color }}>
                  {badge.label}
                </span>
              )}
            </div>

            <div>
              <span className="pd-cat">{CATEGORIES[product.category] ?? product.category}</span>
              <h1 className={`pd-name ${playfair.className}`}>{product.name}</h1>

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

              {product.voucherNote && (
                <div className="pd-voucher">
                  <span className="pd-voucher-tag">Voucher</span> {product.voucherNote}
                </div>
              )}

              <div className="pd-cta-row">
                {product.shopeeLink && <TrackedBuyButton productId={product.id} shopeeLink={product.shopeeLink} isAdmin={isAdmin} />}
              </div>
            </div>
          </div>

          <ProductComments productId={product.id} initialComments={comments} isAdmin={isAdmin} />
        </main>

        <footer className="pd-footer">
          <div className="pd-wrap pd-footer-copy">© {new Date().getFullYear()} Check This Finds. This site contains affiliate links.</div>
        </footer>
      </div>
    </>
  );
}
