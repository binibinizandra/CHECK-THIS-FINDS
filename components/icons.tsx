import type { CSSProperties } from "react";

interface IconProps {
  size?: number;
  style?: CSSProperties;
}

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export function IconDashboard({ size = 18, style }: IconProps) {
  return (
    <svg {...base(size)} style={style} aria-hidden="true">
      <circle cx="12" cy="12" r="3.2" />
      <circle cx="12" cy="4.5" r="1.4" />
      <circle cx="19.5" cy="12" r="1.4" />
      <circle cx="12" cy="19.5" r="1.4" />
      <circle cx="4.5" cy="12" r="1.4" />
      <path d="M12 7.5v1.3M16.5 12h-1.3M12 16.5v-1.3M7.5 12h1.3" />
    </svg>
  );
}

export function IconDeals({ size = 18, style }: IconProps) {
  return (
    <svg {...base(size)} style={style} aria-hidden="true">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7" />
      <path d="M3 12h18" />
    </svg>
  );
}

export function IconAgents({ size = 18, style }: IconProps) {
  return (
    <svg {...base(size)} style={style} aria-hidden="true">
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20c0-3.3 2.6-6 6-6" />
      <circle cx="17" cy="7" r="2.4" />
      <path d="M14.7 12.2c2.9.4 5.3 2.8 5.3 6" />
    </svg>
  );
}

export function IconChat({ size = 18, style }: IconProps) {
  return (
    <svg {...base(size)} style={style} aria-hidden="true">
      <path d="M4 5.5h16v10H9l-4 3.5v-3.5H4Z" />
    </svg>
  );
}

export function IconCalendar({ size = 18, style }: IconProps) {
  return (
    <svg {...base(size)} style={style} aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5" />
    </svg>
  );
}

export function IconAnalytics({ size = 18, style }: IconProps) {
  return (
    <svg {...base(size)} style={style} aria-hidden="true">
      <path d="M4 20V10M11 20V4M18 20v-7" />
    </svg>
  );
}

export function IconProfile({ size = 18, style }: IconProps) {
  return (
    <svg {...base(size)} style={style} aria-hidden="true">
      <circle cx="12" cy="8.2" r="3.6" />
      <path d="M4.5 20c0-4.1 3.4-7 7.5-7s7.5 2.9 7.5 7" />
    </svg>
  );
}

export function IconSettings({ size = 18, style }: IconProps) {
  return (
    <svg {...base(size)} style={style} aria-hidden="true">
      <circle cx="12" cy="12" r="2.8" />
      <path d="M19.4 13.5a1.7 1.7 0 0 0 .35 1.9l.05.05a2 2 0 1 1-2.85 2.85l-.05-.05a1.7 1.7 0 0 0-1.9-.35 1.7 1.7 0 0 0-1 1.55V19.6a2 2 0 1 1-4 0v-.08a1.7 1.7 0 0 0-1.1-1.55 1.7 1.7 0 0 0-1.9.35l-.05.05a2 2 0 1 1-2.85-2.85l.05-.05a1.7 1.7 0 0 0 .35-1.9 1.7 1.7 0 0 0-1.55-1H4.4a2 2 0 1 1 0-4h.08a1.7 1.7 0 0 0 1.55-1.1 1.7 1.7 0 0 0-.35-1.9l-.05-.05a2 2 0 1 1 2.85-2.85l.05.05a1.7 1.7 0 0 0 1.9.35H10.5a1.7 1.7 0 0 0 1-1.55V4.4a2 2 0 1 1 4 0v.08a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.9-.35l.05-.05a2 2 0 1 1 2.85 2.85l-.05.05a1.7 1.7 0 0 0-.35 1.9V10.5a1.7 1.7 0 0 0 1.55 1H19.6a2 2 0 1 1 0 4h-.08a1.7 1.7 0 0 0-1.55 1Z" />
    </svg>
  );
}

export function IconSearch({ size = 18, style }: IconProps) {
  return (
    <svg {...base(size)} style={style} aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-4.3-4.3" />
    </svg>
  );
}

export function IconMenu({ size = 18, style }: IconProps) {
  return (
    <svg {...base(size)} style={style} aria-hidden="true">
      <path d="M4 6.5h16M4 12h16M4 17.5h16" />
    </svg>
  );
}

export function IconClose({ size = 18, style }: IconProps) {
  return (
    <svg {...base(size)} style={style} aria-hidden="true">
      <path d="M5 5l14 14M19 5 5 19" />
    </svg>
  );
}

export function IconBell({ size = 18, style }: IconProps) {
  return (
    <svg {...base(size)} style={style} aria-hidden="true">
      <path d="M18 16v-5a6 6 0 1 0-12 0v5l-1.5 2.5h15L18 16Z" />
      <path d="M10 21a2 2 0 0 0 4 0" />
    </svg>
  );
}
