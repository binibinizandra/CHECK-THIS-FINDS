"use client";
import * as f from "@/components/profile/formStyles";
import type { AudienceInfo } from "@/lib/profile/types";

export default function AudienceFields({
  value,
  onChange,
}: {
  value: AudienceInfo;
  onChange: (next: AudienceInfo) => void;
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
      <div>
        <label style={f.label}>Age range</label>
        <input
          value={value.age ?? ""}
          onChange={(e) => onChange({ ...value, age: e.target.value })}
          placeholder="e.g. 18–24"
          style={f.input}
        />
      </div>
      <div>
        <label style={f.label}>Where they live</label>
        <input
          value={value.geo ?? ""}
          onChange={(e) => onChange({ ...value, geo: e.target.value })}
          placeholder="e.g. mostly US"
          style={f.input}
        />
      </div>
      <div>
        <label style={f.label}>Gender split</label>
        <input
          value={value.gender ?? ""}
          onChange={(e) => onChange({ ...value, gender: e.target.value })}
          placeholder="e.g. 70% women"
          style={f.input}
        />
      </div>
    </div>
  );
}
