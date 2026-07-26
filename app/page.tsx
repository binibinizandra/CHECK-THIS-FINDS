import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const YELLOW = "#FFC700";
const NAVY = "#0A192F";
const LIGHT = "#F1F3FF";
const LIGHT_MUTED = "#AAB2D6";
const PAGE_GLOW =
  "radial-gradient(50% 26% at 15% 6%, rgba(157,92,255,.30), transparent 60%)," +
  "radial-gradient(50% 26% at 88% 26%, rgba(47,224,245,.18), transparent 60%)," +
  "radial-gradient(55% 26% at 18% 50%, rgba(255,61,174,.14), transparent 60%)," +
  "radial-gradient(50% 26% at 85% 72%, rgba(157,92,255,.20), transparent 60%)," +
  "radial-gradient(60% 26% at 30% 94%, rgba(47,224,245,.14), transparent 60%)," +
  "linear-gradient(180deg, #131A42 0%, #0B1130 30%, #0A0F2A 62%, #090C24 100%)";
const YELLOW_GLOW = "0 0 20px rgba(255,199,0,.55), 0 0 44px rgba(255,199,0,.28)";

const FEATURES = [
  {
    title: "Carefully Curated",
    body: "We search and filter through hundreds of trending items to select only the ones with great quality, high ratings, and real function.",
  },
  {
    title: "Tried & Reviewed",
    body: "No fake hype. We break down the key features, aesthetic details, and practical uses so you know exactly what you’re getting.",
  },
  {
    title: "Shop with Confidence",
    body: "Direct, verified product links to official store deals so you can grab the best home and lifestyle essentials with ease.",
  },
];

const STEPS = [
  { n: "01", title: "Search & Filter", body: "We scan top platforms for trending items across home, fashion, tech, and daily essentials with verified high ratings." },
  { n: "02", title: "Quality Check", body: "We review real buyer feedback, durability, and practical function to ensure zero fake hype or low-quality traps." },
  { n: "03", title: "Spot the Best Deals", body: "We track price drops and official vouchers so you get the best value for your hard-earned money." },
  { n: "04", title: "Shop via Direct Links", body: "Tap verified product links to order straight from trusted sellers with smooth checkout and reliable shipping." },
];

export default function Home() {
  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", background: PAGE_GLOW }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 26px",
          maxWidth: 1440,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 19,
            color: LIGHT,
            letterSpacing: "-0.01em",
          }}
        >
          Check This Finds
        </span>
        <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
          <SignedOut>
            <a href="/sign-in" style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 14, color: LIGHT }}>
              Log in
            </a>
            <a
              href="/sign-up"
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                fontSize: 14,
                color: NAVY,
                background: YELLOW,
                borderRadius: "var(--radius-buttons)",
                padding: "9px 20px",
                boxShadow: YELLOW_GLOW,
              }}
            >
              Sign up
            </a>
          </SignedOut>
          <SignedIn>
            <a href="/dashboard" style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 14, color: LIGHT }}>
              Dashboard
            </a>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </header>

      {/* Hero */}
      <section style={{ position: "relative", overflow: "hidden", maxWidth: 1440, margin: "0 auto", width: "100%", padding: "60px 26px 0" }}>
        <div style={{ position: "relative", textAlign: "center", maxWidth: 720, margin: "0 auto 8px" }}>
          <div
            style={{
              display: "inline-block",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              color: NAVY,
              background: YELLOW,
              borderRadius: "var(--radius-buttons)",
              padding: "6px 16px",
              marginBottom: 20,
              boxShadow: YELLOW_GLOW,
            }}
          >
            Aesthetic &amp; Practical Picks for Everyday Living
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "clamp(34px, 5.6vw, 64px)",
              lineHeight: 1.06,
              letterSpacing: "-0.02em",
              margin: "0 0 20px",
              color: LIGHT,
            }}
          >
            Smart finds for a space you&apos;ll love.
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 19,
              lineHeight: 1.5,
              letterSpacing: "-0.011em",
              color: LIGHT_MUTED,
              margin: "0 auto 30px",
              maxWidth: 580,
            }}
          >
            Check This Finds brings you handpicked, high-quality home and lifestyle items — tested for durability,
            designed for function, and worth every peso.
          </p>
          <a
            href="/sign-up"
            style={{
              display: "inline-block",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: 17,
              color: NAVY,
              background: YELLOW,
              borderRadius: "var(--radius-buttons)",
              padding: "12px 26px",
              boxShadow: YELLOW_GLOW,
            }}
          >
            Explore The Collection
          </a>
        </div>
      </section>

      {/* Product mockup collage */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          maxWidth: 1440,
          margin: "0 auto",
          width: "100%",
          padding: "50px 26px 100px",
        }}
      >
        {/* Coffee mug prop */}
        <div className="hero-float-card" style={{ position: "absolute", top: 6, left: "42%", width: 44, opacity: 0.9 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke={LIGHT} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8z" />
            <path d="M17 9.5h1.5a2.5 2.5 0 0 1 0 5H17" />
            <path d="M8 4.5c0 1-1 1-1 2M12 4.5c0 1-1 1-1 2" />
          </svg>
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 28,
            flexWrap: "wrap",
            padding: "20px 0",
          }}
        >
          {/* Laptop mockup */}
          <div style={{ width: "min(560px, 92vw)" }}>
            <div
              style={{
                background: NAVY,
                borderRadius: "20px 20px 4px 4px",
                padding: "14px 14px 10px",
                boxShadow: "0 30px 60px rgba(10,25,47,.35), 0 0 50px -12px rgba(157,92,255,.4)",
              }}
            >
              <div
                style={{
                  background: "linear-gradient(160deg, #1B2352, #0D1230)",
                  border: "1px solid rgba(255,255,255,.1)",
                  borderRadius: 12,
                  padding: "56px 32px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#2FE0F5", marginBottom: 10 }}>
                  Check This Finds
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: "clamp(24px, 3.2vw, 34px)",
                    background: "linear-gradient(90deg, #FF3DAE, #9D5CFF 55%, #2FE0F5)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  Best Picks
                </div>
              </div>
            </div>
            {/* Keyboard */}
            <div
              style={{
                background: "linear-gradient(180deg, #16233C, #0A192F)",
                borderRadius: "0 0 14px 14px",
                padding: "10px 12%",
                boxShadow: "0 20px 40px -18px rgba(10,25,47,.5)",
              }}
            >
              <div style={{ display: "flex", gap: "3%", marginBottom: "8%" }}>
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} style={{ flex: 1, aspectRatio: "2.4", background: "rgba(255,255,255,.08)", borderRadius: 2 }} />
                ))}
              </div>
              <div style={{ display: "flex", gap: "3%", marginBottom: "8%" }}>
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} style={{ flex: 1, aspectRatio: "2.4", background: "rgba(255,255,255,.08)", borderRadius: 2 }} />
                ))}
              </div>
              <div style={{ height: 12, background: "rgba(255,255,255,.06)", borderRadius: 5, margin: "0 24%" }} />
            </div>
          </div>
        </div>

        {/* Floating detail cards */}
        <div
          style={{
            position: "absolute",
            top: 40,
            right: "12%",
            background: "#fff",
            borderRadius: 14,
            padding: "10px 16px",
            boxShadow: "0 14px 30px rgba(10,25,47,.16)",
            fontFamily: "var(--font-body)",
            fontSize: 12.5,
            fontWeight: 600,
            color: NAVY,
            alignItems: "center",
            gap: 8,
          }}
          className="hero-float-card"
        >
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E" }} />
          Pitch drafted for Acme Outdoor
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: "10%",
            background: NAVY,
            borderRadius: 14,
            padding: "10px 16px",
            boxShadow: "0 14px 30px rgba(10,25,47,.24)",
            fontFamily: "var(--font-body)",
            fontSize: 12.5,
            fontWeight: 600,
            color: YELLOW,
            alignItems: "center",
            gap: 8,
          }}
          className="hero-float-card"
        >
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: YELLOW }} />
          Call booked — Thu 2pm
        </div>
      </section>

      <section style={{ padding: "80px 26px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "clamp(28px, 3.4vw, 40px)",
              lineHeight: 1.1,
              letterSpacing: "-0.012em",
              margin: "0 0 44px",
              color: LIGHT,
            }}
          >
            How Check This Finds Works
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 28 }}>
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                style={{
                  background: "#ffffff",
                  borderRadius: "var(--radius-cards)",
                  padding: 32,
                  boxShadow: "0 8px 24px rgba(10,25,47,.06)",
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: YELLOW,
                    color: NAVY,
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                    boxShadow: YELLOW_GLOW,
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 19, color: NAVY, marginBottom: 8 }}>
                  {f.title}
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 15, lineHeight: 1.5, color: "var(--color-muted)" }}>
                  {f.body}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "80px 26px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "clamp(28px, 3.4vw, 40px)",
              lineHeight: 1.1,
              letterSpacing: "-0.012em",
              margin: "0 0 44px",
              color: LIGHT,
            }}
          >
            How We Curate Your Finds
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 28 }}>
            {STEPS.map((s) => (
              <div key={s.n}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: YELLOW,
                    color: NAVY,
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 13,
                    marginBottom: 14,
                    boxShadow: YELLOW_GLOW,
                  }}
                >
                  {s.n}
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 19, marginBottom: 8, color: LIGHT }}>
                  {s.title}
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 15, lineHeight: 1.5, color: LIGHT_MUTED }}>
                  {s.body}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "80px 26px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "clamp(26px, 3vw, 36px)",
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
              margin: "0 0 18px",
              color: "#ffffff",
            }}
          >
            Everyday essentials, carefully curated.
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 17, lineHeight: 1.55, color: "rgba(255,255,255,.75)" }}>
            From home finds and personal care to trending fashion and smart gadgets — Check This Finds
            brings together clean, high-quality recommendations so you can discover items that upgrade
            your daily life without the endless scrolling.
          </p>
        </div>
      </section>

      <section style={{ position: "relative", overflow: "hidden", padding: "80px 26px", textAlign: "center" }}>
        <div style={{ position: "relative", maxWidth: 640, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "clamp(26px, 3.2vw, 38px)",
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
              margin: "0 0 22px",
              color: LIGHT,
            }}
          >
            Aesthetic &amp; Practical Picks for Everyday Living
          </h2>
          <a
            href="/sign-up"
            style={{
              display: "inline-block",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: 17,
              color: NAVY,
              background: YELLOW,
              borderRadius: "var(--radius-buttons)",
              padding: "12px 28px",
              boxShadow: YELLOW_GLOW,
            }}
          >
            Sign up free
          </a>
        </div>
      </section>

      <footer style={{ padding: "40px 26px", textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: LIGHT_MUTED }}>
          © {new Date().getFullYear()} Check This Finds. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
