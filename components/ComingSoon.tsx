export default function ComingSoon({ title, body }: { title: string; body: string }) {
  return (
    <div style={{ maxWidth: 620, margin: "0 auto", padding: "90px 26px", textAlign: "center" }}>
      <div
        style={{
          display: "inline-block",
          fontFamily: "var(--font-body)",
          fontWeight: 600,
          fontSize: 12,
          letterSpacing: "0.02em",
          textTransform: "uppercase",
          color: "var(--color-accent-dark)",
          background: "var(--color-bg-alt)",
          borderRadius: "var(--radius-buttons)",
          padding: "5px 14px",
          marginBottom: 18,
        }}
      >
        Coming soon
      </div>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: "clamp(26px, 3.4vw, 34px)",
          letterSpacing: "-0.012em",
          margin: "0 0 14px",
          color: "var(--color-ink)",
        }}
      >
        {title}
      </h1>
      <p style={{ fontFamily: "var(--font-body)", fontSize: 16, lineHeight: 1.55, color: "var(--color-muted)", margin: 0 }}>
        {body}
      </p>
    </div>
  );
}
