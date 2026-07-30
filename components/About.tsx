import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function About() {
  return (
    <>
      <style>{`
        .ab-wrap { max-width: 780px; margin: 0 auto; padding: 0 16px; }
        .ab-header { position: sticky; top: 0; z-index: 20; background: rgba(245,241,243,.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid var(--sf-border); }
        .ab-header-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 14px 0; }
        .ab-brand { font-weight: 700; font-size: 20px; letter-spacing: -0.01em; color: var(--sf-ink); }
        .ab-back { font-size: 12.5px; font-weight: 600; color: var(--sf-white); background: var(--sf-pink); border: none; border-radius: 999px; padding: 7px 16px; }

        .ab-main { padding: 40px 0 40px; }
        .ab-eyebrow { display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--sf-pink); margin-bottom: 8px; }
        .ab-title { font-size: 28px; font-weight: 800; letter-spacing: -0.01em; color: var(--sf-ink); line-height: 1.2; margin: 0 0 18px; }
        .ab-intro { font-size: 14.5px; line-height: 1.75; color: var(--sf-ink); }
        .ab-intro p { margin: 0 0 16px; }
        .ab-intro p:last-child { margin-bottom: 0; }

        .ab-mv-grid { display: grid; grid-template-columns: 1fr; gap: 14px; margin: 34px 0; }
        @media (min-width: 600px) { .ab-mv-grid { grid-template-columns: 1fr 1fr; } }
        .ab-mv-card { background: var(--sf-card); border-radius: 18px; padding: 22px; box-shadow: 0 4px 16px -6px rgba(60,45,55,.18); }
        .ab-mv-title { font-size: 12px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; color: var(--sf-pink); margin-bottom: 10px; }
        .ab-mv-text { font-size: 13.5px; line-height: 1.7; color: var(--sf-ink); margin: 0; }

        .ab-curator { display: flex; align-items: flex-start; gap: 16px; background: var(--sf-card); border-radius: 18px; padding: 22px; margin: 0 0 34px; box-shadow: 0 4px 16px -6px rgba(60,45,55,.18); }
        .ab-curator-avatar { flex-shrink: 0; display: flex; align-items: center; justify-content: center; width: 46px; height: 46px; border-radius: 50%; background: var(--sf-pink); color: var(--sf-white); font-weight: 800; font-size: 14px; }
        .ab-curator-name { font-size: 13.5px; font-weight: 800; color: var(--sf-ink); margin-bottom: 6px; }
        .ab-curator-text { font-size: 13.5px; line-height: 1.7; color: var(--sf-ink); margin: 0; }
        .ab-curator-linkedin { display: inline-flex; align-items: center; gap: 6px; margin-top: 10px; font-size: 12px; font-weight: 600; color: var(--sf-muted); text-decoration: none; }
        .ab-curator-linkedin svg { width: 14px; height: 14px; flex-shrink: 0; }
        .ab-curator-linkedin:hover { color: #0A66C2; }

        .ab-faq-title { font-size: 12px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; color: var(--sf-ink); margin: 0 0 14px; padding-left: 10px; border-left: 3px solid var(--sf-pink); }
        .ab-faq-item { background: var(--sf-card); border-radius: 14px; padding: 4px 18px; margin-bottom: 10px; box-shadow: 0 4px 16px -6px rgba(60,45,55,.14); }
        .ab-faq-item summary { list-style: none; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 0; font-size: 13.5px; font-weight: 700; color: var(--sf-ink); cursor: pointer; }
        .ab-faq-item summary::-webkit-details-marker { display: none; }
        .ab-faq-item summary::after { content: "+"; flex-shrink: 0; font-size: 18px; font-weight: 400; color: var(--sf-pink); transition: transform .15s ease; }
        .ab-faq-item[open] summary::after { transform: rotate(45deg); }
        .ab-faq-item p { margin: 0 0 16px; font-size: 13px; line-height: 1.65; color: var(--sf-muted); }

        .ab-footer { margin-top: 24px; border-top: 1px solid var(--sf-border); padding: 28px 0 40px; }
        .ab-footer-links { display: flex; justify-content: center; margin-bottom: 10px; }
        .ab-footer-link { font-size: 12.5px; font-weight: 600; color: var(--sf-pink); text-decoration: none; }
        .ab-footer-link:hover { text-decoration: underline; }
        .ab-footer-copy { font-size: 12.5px; color: var(--sf-muted); text-align: center; }

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
        <header className="ab-header">
          <div className="ab-wrap ab-header-row">
            <a href="/" className="ab-brand">Check This Finds</a>
            <a href="/" className="ab-back">Back to all finds</a>
          </div>
        </header>

        <main className="ab-wrap ab-main">
          <span className="ab-eyebrow">About Check This Finds</span>
          <h1 className="ab-title">Welcome to Check This Finds</h1>

          <div className="ab-intro">
            <p>
              Check This Finds was created for every Filipino shopper who wants complete confidence in every online
              purchase. We know how overwhelming it is to spend hours scrolling, filtering through endless reviews,
              and second-guessing whether an item on Shopee is worth your hard-earned money. That&apos;s why we do
              the heavy lifting for you.
            </p>
            <p>
              We curate tested, highly rated, and verified items into one clean, seamless, and easy-to-navigate
              hub — ranging from everyday budget home essentials to premium, trusted tech finds. No endless
              scrolling, no wasted time, and zero regret. Just direct access to legitimate, proven products that
              deliver real value for every peso.
            </p>
          </div>

          <div className="ab-mv-grid">
            <div className="ab-mv-card">
              <div className="ab-mv-title">Our Mission</div>
              <p className="ab-mv-text">
                To provide a fast, honest, and reliable shopping shortcut for Filipinos by curating proven,
                high-quality products from trusted sellers.
              </p>
            </div>
            <div className="ab-mv-card">
              <div className="ab-mv-title">Our Vision</div>
              <p className="ab-mv-text">
                To become the #1 preferred and most trusted Affiliate Shopping Hub in the Philippines — the very
                first destination every shopper visits before checking out for a guaranteed safe, smart, and
                satisfying online shopping experience.
              </p>
            </div>
          </div>

          <div className="ab-curator">
            <span className="ab-curator-avatar" aria-hidden="true">KB</span>
            <div>
              <div className="ab-curator-name">Curated by Kazandra B.</div>
              <p className="ab-curator-text">
                As a passionate online shopper and researcher, I created Check This Finds to save you time and
                money. Every item listed here is handpicked based on high ratings, verified buyer reviews, and
                real value.
              </p>
              <a
                href="https://www.linkedin.com/in/binibinizandra/"
                target="_blank"
                rel="noopener noreferrer"
                className="ab-curator-linkedin"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z" />
                </svg>
                Connect with the Founder on LinkedIn
              </a>
            </div>
          </div>

          <section>
            <div className="ab-faq-title">Frequently Asked Questions</div>

            <details className="ab-faq-item">
              <summary>How does purchasing work on this site?</summary>
              <p>
                Check This Finds is a curated recommendation hub. When you click on an item, you&apos;ll be
                redirected directly to the official and verified seller on Shopee, where you can securely place
                your order.
              </p>
            </details>

            <details className="ab-faq-item">
              <summary>How are products selected?</summary>
              <p>
                We strictly filter items to include only those with high sales volumes, minimum 4.8/5 seller
                ratings, positive real customer feedback, and proven quality.
              </p>
            </details>

            <details className="ab-faq-item">
              <summary>Will it cost me more to buy through these links?</summary>
              <p>
                No. The prices are 100% the same as the official store. We highlight items with special discounts
                and free shipping deals so you get the best price possible.
              </p>
            </details>

            <details className="ab-faq-item">
              <summary>Are the seller links safe and verified?</summary>
              <p>
                Yes! We only link to Shopee Mall, Preferred sellers, and top-rated merchants so you can shop
                safely with peace of mind.
              </p>
            </details>
          </section>
        </main>

        <footer className="ab-footer">
          <div className="ab-wrap">
            <div className="ab-footer-links">
              <a
                href="https://www.linkedin.com/in/binibinizandra/"
                target="_blank"
                rel="noopener noreferrer"
                className="ab-footer-link"
              >
                Connect with the Founder on LinkedIn
              </a>
            </div>
            <div className="ab-footer-copy">© {new Date().getFullYear()} Check This Finds. This site contains affiliate links.</div>
          </div>
        </footer>
      </div>
    </>
  );
}
