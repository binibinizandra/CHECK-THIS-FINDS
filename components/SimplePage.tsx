import { Manrope } from "next/font/google";

const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function SimplePage({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <>
      <style>{`
        .sp-wrap { max-width: 720px; margin: 0 auto; padding: 0 20px; }
        .sp-header { position: sticky; top: 0; z-index: 20; background: rgba(250,250,247,.88); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid var(--sf-border); }
        .sp-header-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding-top: 16px; padding-bottom: 16px; }
        .sp-brand { font-weight: 800; font-size: 18px; color: var(--sf-ink); text-decoration: none; }
        .sp-back { font-size: 12.5px; font-weight: 600; color: var(--sf-white); background: var(--sf-primary); border: none; border-radius: 999px; padding: 8px 18px; text-decoration: none; }

        .sp-main { padding-top: 44px; padding-bottom: 60px; }
        .sp-eyebrow { display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--sf-primary); margin-bottom: 10px; }
        .sp-title { font-size: 28px; font-weight: 700; letter-spacing: -0.01em; color: var(--sf-ink); line-height: 1.2; margin: 0 0 24px; }
        .sp-body { font-size: 14px; line-height: 1.8; color: var(--sf-ink); }
        .sp-body p { margin: 0 0 16px; }
        .sp-body h2 { font-size: 17px; font-weight: 700; color: var(--sf-ink); margin: 28px 0 10px; }
        .sp-body ul { margin: 0 0 16px; padding-left: 20px; }
        .sp-body li { margin-bottom: 8px; }
        .sp-body a { color: var(--sf-primary); font-weight: 600; }

        .sp-footer { margin-top: 24px; border-top: 1px solid var(--sf-border); padding: 28px 0 40px; }
        .sp-footer-copy { font-size: 12px; color: var(--sf-muted); text-align: center; }

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
        className={manrope.className}
        style={{
          background: "var(--sf-bg)",
          color: "var(--sf-ink)",
          minHeight: "100dvh",
        }}
      >
        <header className="sp-header">
          <div className="sp-wrap sp-header-row">
            <a href="/" className="sp-brand">Check This Finds</a>
            <a href="/" className="sp-back">Back to all finds</a>
          </div>
        </header>

        <main className="sp-wrap sp-main">
          <span className="sp-eyebrow">{eyebrow}</span>
          <h1 className="sp-title">{title}</h1>
          <div className="sp-body">{children}</div>
        </main>

        <footer className="sp-footer">
          <div className="sp-wrap sp-footer-copy">© {new Date().getFullYear()} Check This Finds. This site contains affiliate links.</div>
        </footer>
      </div>
    </>
  );
}
