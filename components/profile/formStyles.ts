import type { CSSProperties } from "react";

export const label: CSSProperties = {
  display: "block",
  fontFamily: "var(--font-body)",
  fontWeight: 600,
  fontSize: 13.5,
  color: "var(--color-muted-2)",
  marginBottom: 6,
};

export const input: CSSProperties = {
  width: "100%",
  fontFamily: "var(--font-body)",
  fontSize: 15,
  color: "var(--color-ink)",
  background: "var(--color-bg-alt-2)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-inputs)",
  padding: "10px 13px",
  outline: "none",
};

export const textarea: CSSProperties = {
  ...input,
  resize: "vertical",
  minHeight: 80,
  fontFamily: "var(--font-body)",
};

export const fieldWrap: CSSProperties = {
  marginBottom: 20,
};

export const primaryButton: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "var(--font-body)",
  fontWeight: 500,
  fontSize: 15,
  color: "#ffffff",
  background: "var(--gradient-accent)",
  border: "none",
  borderRadius: "var(--radius-buttons)",
  padding: "11px 24px",
  cursor: "pointer",
  boxShadow: "0 8px 20px var(--glow-accent)",
};

export const secondaryButton: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "var(--font-body)",
  fontWeight: 500,
  fontSize: 15,
  color: "var(--color-ink)",
  background: "var(--color-bg-alt)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-buttons)",
  padding: "11px 22px",
  cursor: "pointer",
};

export const smallGhostButton: CSSProperties = {
  fontFamily: "var(--font-body)",
  fontWeight: 500,
  fontSize: 13,
  color: "var(--color-accent-dark)",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  padding: "4px 0",
};
