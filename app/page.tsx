import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const YELLOW = "#FFC700";
const NAVY = "#0A192F";
const PAGE_TINT = "#FFFDE7";

const FEATURES = [
  {
    title: "Find brands",
    body: "Your Research agent scans the web for brands that already sponsor creators in your niche, and drops them into a queue for you to approve.",
  },
  {
    title: "Pitch in your voice",
    body: "Initial Outreach writes a personalized first message for every brand — an email or a DM — that sounds like you, not a template.",
  },
  {
    title: "Price it right",
    body: "Proposal turns interest into a scoped, priced offer, grounded in your audience, your niche, and your rate floor.",
  },
  {
    title: "Stay on their radar",
    body: "Follow-up nudges brands that went quiet, building on what you already said instead of starting over.",
  },
  {
    title: "Book the call",
    body: "Scheduler locks in the brand call the moment you're ready — just ask it in plain English.",
  },
  {
    title: "Watch it all happen",
    body: "A live dashboard shows your team working in real time — who's active, what's moving, and what they've gotten done.",
  },
];

const STEPS = [
  { n: "01", title: "Tell us who you are", body: "Fill in your niche, audience, platforms, and rates once — every agent grounds its work in it." },
  { n: "02", title: "Meet your team", body: "Five ready-made agents, each with one job, or build your own and group them into a team." },
  { n: "03", title: "Let them work your brands", body: "Agents find, research, pitch, price, and follow up — you stay in control at every step that matters." },
  { n: "04", title: "You approve, they execute", body: "Discovered brands wait for your sign-off, drafts wait in your inbox — nothing goes out without you." },
];

function Blob({ style }: { style: React.CSSProperties }) {
  return <div style={{ position: "absolute", borderRadius: "50%", pointerEvents: "none", ...style }} />;
}

export default function Home() {
  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", background: "#ffffff" }}>
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
            color: NAVY,
            letterSpacing: "-0.01em",
          }}
        >
          Check This Finds
        </span>
        <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
          <SignedOut>
            <a href="/sign-in" style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 14, color: NAVY }}>
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
                boxShadow: "0 6px 18px rgba(255,199,0,.45)",
              }}
            >
              Sign up
            </a>
          </SignedOut>
          <SignedIn>
            <a href="/dashboard" style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 14, color: NAVY }}>
              Dashboard
            </a>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </header>

      {/* Hero */}
      <section style={{ position: "relative", overflow: "hidden", maxWidth: 1440, margin: "0 auto", width: "100%", padding: "60px 26px 0" }}>
        <Blob style={{ width: 340, height: 340, background: YELLOW, opacity: 0.22, top: -140, right: -60 }} />
        <Blob style={{ width: 180, height: 180, background: NAVY, opacity: 0.06, bottom: -60, left: -40 }} />
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
              color: NAVY,
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
              color: "var(--color-muted)",
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
              boxShadow: "0 10px 26px rgba(255,199,0,.5)",
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
        <Blob style={{ width: 260, height: 260, background: YELLOW, opacity: 0.25, top: 0, left: -80 }} />
        <Blob style={{ width: 180, height: 180, background: YELLOW, opacity: 0.3, bottom: -40, right: 40 }} />
        <Blob style={{ width: 100, height: 100, background: NAVY, opacity: 0.05, top: 60, right: 160 }} />

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
          {/* Phone mockup */}
          <div
            style={{
              width: 168,
              flexShrink: 0,
              background: NAVY,
              borderRadius: 28,
              padding: 8,
              boxShadow: "0 24px 48px rgba(10,25,47,.28)",
            }}
          >
            <div style={{ background: PAGE_TINT, borderRadius: 20, padding: "16px 12px", minHeight: 300 }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11, color: NAVY, marginBottom: 14 }}>
                Check This Finds
              </div>
              {["Dashboard", "Deals", "Agents", "Chat"].map((label, i) => (
                <div
                  key={label}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 10.5,
                    fontWeight: i === 0 ? 700 : 500,
                    color: i === 0 ? NAVY : "#7a7a55",
                    background: i === 0 ? YELLOW : "transparent",
                    borderRadius: 8,
                    padding: "6px 8px",
                    marginBottom: 4,
                  }}
                >
                  {label}
                </div>
              ))}
              <div style={{ background: "#fff", borderRadius: 12, padding: 10, marginTop: 14, boxShadow: "0 6px 14px rgba(10,25,47,.08)" }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: NAVY }}>23</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 8.5, color: "#7a7a55", textTransform: "uppercase", letterSpacing: ".03em" }}>
                  Brands worked
                </div>
              </div>
            </div>
          </div>

          {/* Browser-style dashboard preview */}
          <div
            style={{
              position: "relative",
              width: "min(560px, 92vw)",
              background: "#fff",
              borderRadius: 24,
              boxShadow: "0 30px 60px rgba(10,25,47,.2)",
              overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 18px", borderBottom: "1px solid #F3EBC0" }}>
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: YELLOW }} />
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#F3EBC0" }} />
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#F3EBC0" }} />
              <div style={{ flex: 1, background: PAGE_TINT, borderRadius: 999, height: 22, marginLeft: 10 }} />
            </div>
            <div style={{ display: "flex" }}>
              <div style={{ width: 56, background: YELLOW, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "18px 0" }}>
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 8,
                      background: i === 0 ? NAVY : "rgba(10,25,47,.14)",
                    }}
                  />
                ))}
              </div>
              <div style={{ flex: 1, background: PAGE_TINT, padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 12.5, color: NAVY }}>
                  Good afternoon! Here&apos;s your team at work.
                </div>
                {[
                  { i: "NN", n: "Nailah Nectar", c: "#22C55E", t: "found 4 new brands that fit your niche" },
                  { i: "OS", n: "Ollie Sta.Ana", c: "#6B21A8", t: "drafted a pitch for Acme Outdoor" },
                  { i: "TB", n: "Tomi Ballesteros", c: "#64748B", t: "wrote a proposal for Verve Media" },
                ].map((a) => (
                  <div key={a.n} style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", borderRadius: 12, padding: "8px 12px" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: a.c, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 10, flexShrink: 0 }}>
                      {a.i}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 11.5, color: NAVY }}>{a.n}</div>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: 10.5, color: "#8a8a5f", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {a.t}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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

      <section style={{ background: PAGE_TINT, padding: "80px 26px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "clamp(28px, 3.4vw, 40px)",
              lineHeight: 1.1,
              letterSpacing: "-0.012em",
              margin: "0 0 44px",
              color: NAVY,
            }}
          >
            Everything a brand deal needs, handled
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 28 }}>
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

      <section style={{ background: "var(--color-bg)", padding: "80px 26px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "clamp(28px, 3.4vw, 40px)",
              lineHeight: 1.1,
              letterSpacing: "-0.012em",
              margin: "0 0 44px",
              color: NAVY,
            }}
          >
            How it works
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
                    background: NAVY,
                    color: YELLOW,
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 13,
                    marginBottom: 14,
                  }}
                >
                  {s.n}
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 19, marginBottom: 8, color: NAVY }}>
                  {s.title}
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 15, lineHeight: 1.5, color: "var(--color-muted)" }}>
                  {s.body}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "80px 26px", background: NAVY }}>
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
            Built for creators managing their own deals
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 17, lineHeight: 1.55, color: "rgba(255,255,255,.75)" }}>
            If you&apos;re a content creator who wants brand partnerships but doesn&apos;t have a manager
            chasing them for you, this is your team. It grounds every pitch, brief, and proposal in
            your real audience and your real rates — so the work sounds like you, because it&apos;s
            built entirely on who you are.
          </p>
        </div>
      </section>

      <section style={{ position: "relative", overflow: "hidden", padding: "80px 26px", textAlign: "center", background: YELLOW }}>
        <Blob style={{ width: 200, height: 200, background: "#ffffff", opacity: 0.15, top: -70, left: 40 }} />
        <Blob style={{ width: 260, height: 260, background: NAVY, opacity: 0.06, bottom: -120, right: -60 }} />
        <div style={{ position: "relative", maxWidth: 640, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "clamp(26px, 3.2vw, 38px)",
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
              margin: "0 0 22px",
              color: NAVY,
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
              color: YELLOW,
              background: NAVY,
              borderRadius: "var(--radius-buttons)",
              padding: "12px 28px",
              boxShadow: "0 10px 26px rgba(10,25,47,.3)",
            }}
          >
            Sign up free
          </a>
        </div>
      </section>

      <footer style={{ padding: "40px 26px", textAlign: "center", background: PAGE_TINT }}>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--color-muted)" }}>
          © {new Date().getFullYear()} Check This Finds. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
