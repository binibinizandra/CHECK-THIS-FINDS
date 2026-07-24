"use client";
import * as f from "@/components/profile/formStyles";
import type { PlatformEntry } from "@/lib/profile/types";

const PLATFORM_CHOICES = ["TikTok", "Instagram", "YouTube", "X", "Twitch", "Other"];

export default function PlatformEditor({
  value,
  onChange,
}: {
  value: PlatformEntry[];
  onChange: (next: PlatformEntry[]) => void;
}) {
  function update(i: number, patch: Partial<PlatformEntry>) {
    onChange(value.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  }
  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }
  function add() {
    onChange([...value, { platform: "", handle: "", followers: null, engagementRate: null }]);
  }

  return (
    <div>
      {value.length === 0 && (
        <div style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--color-muted)", marginBottom: 14 }}>
          No platforms added yet.
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 14 }}>
        {value.map((p, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 1.2fr 1fr 1fr auto",
              gap: 10,
              alignItems: "end",
              background: "var(--color-bg-alt)",
              borderRadius: "var(--radius-inputs)",
              padding: 12,
            }}
          >
            <div>
              <label style={f.label}>Platform</label>
              <select
                value={p.platform}
                onChange={(e) => update(i, { platform: e.target.value })}
                style={f.input}
              >
                <option value="">Choose…</option>
                {PLATFORM_CHOICES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={f.label}>Handle</label>
              <input
                value={p.handle}
                onChange={(e) => update(i, { handle: e.target.value })}
                placeholder="@yourname"
                style={f.input}
              />
            </div>
            <div>
              <label style={f.label}>Followers</label>
              <input
                type="number"
                min={0}
                value={p.followers ?? ""}
                onChange={(e) => update(i, { followers: e.target.value === "" ? null : Number(e.target.value) })}
                placeholder="0"
                style={f.input}
              />
            </div>
            <div>
              <label style={f.label}>Engagement %</label>
              <input
                type="number"
                min={0}
                step={0.1}
                value={p.engagementRate ?? ""}
                onChange={(e) => update(i, { engagementRate: e.target.value === "" ? null : Number(e.target.value) })}
                placeholder="0"
                style={f.input}
              />
            </div>
            <button type="button" onClick={() => remove(i)} style={{ ...f.smallGhostButton, color: "var(--status-error)" }}>
              Remove
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={add} style={f.secondaryButton}>
        + Add a platform
      </button>
    </div>
  );
}
