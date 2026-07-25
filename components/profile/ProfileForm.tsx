"use client";
import { useState, useTransition } from "react";
import * as f from "@/components/profile/formStyles";
import PlatformEditor from "@/components/profile/PlatformEditor";
import AudienceFields from "@/components/profile/AudienceFields";
import TikTokConnectCard from "@/components/profile/TikTokConnectCard";
import { saveProfile } from "@/lib/profile/actions";
import type { CreatorProfileData } from "@/lib/profile/types";
import type { TikTokConnection } from "@/lib/tiktok/store";

export default function ProfileForm({
  initial,
  tiktokConnection,
}: {
  initial: CreatorProfileData;
  tiktokConnection: TikTokConnection | null;
}) {
  const [data, setData] = useState<CreatorProfileData>(initial);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(false);
    startTransition(async () => {
      await saveProfile(data);
      setSaved(true);
    });
  }

  return (
    <div>
      <div style={f.fieldWrap}>
        <label style={f.label}>Your niche</label>
        <input
          value={data.niche}
          onChange={(e) => setData({ ...data, niche: e.target.value })}
          placeholder="e.g. fitness, beauty, personal finance"
          style={f.input}
        />
      </div>

      <div style={f.fieldWrap}>
        <label style={f.label}>Short bio</label>
        <textarea
          value={data.bio}
          onChange={(e) => setData({ ...data, bio: e.target.value })}
          placeholder="A couple sentences about who you are and what you make."
          style={f.textarea}
        />
      </div>

      <TikTokConnectCard connection={tiktokConnection} />

      <div style={f.fieldWrap}>
        <label style={f.label}>Platforms</label>
        <PlatformEditor value={data.platforms} onChange={(platforms) => setData({ ...data, platforms })} />
      </div>

      <div style={f.fieldWrap}>
        <label style={f.label}>Your audience</label>
        <AudienceFields value={data.audience} onChange={(audience) => setData({ ...data, audience })} />
      </div>

      <div style={f.fieldWrap}>
        <label style={f.label}>Voice &amp; tone</label>
        <input
          value={data.tone}
          onChange={(e) => setData({ ...data, tone: e.target.value })}
          placeholder="e.g. warm and funny, direct and no-fluff"
          style={f.input}
        />
      </div>

      <div style={f.fieldWrap}>
        <label style={f.label}>Past brand deals</label>
        <textarea
          value={data.pastDeals}
          onChange={(e) => setData({ ...data, pastDeals: e.target.value })}
          placeholder="Brands you've worked with before, if any."
          style={f.textarea}
        />
      </div>

      <div style={f.fieldWrap}>
        <label style={f.label}>Rate floor — the least you&apos;ll take for a single deliverable</label>
        <div style={{ display: "flex", alignItems: "center", gap: 8, maxWidth: 220 }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--color-muted)" }}>$</span>
          <input
            type="number"
            min={0}
            value={data.rateFloor ?? ""}
            onChange={(e) => setData({ ...data, rateFloor: e.target.value === "" ? null : Number(e.target.value) })}
            placeholder="500"
            style={f.input}
          />
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 8 }}>
        <button type="button" onClick={handleSave} disabled={pending} style={f.primaryButton}>
          {pending ? "Saving…" : "Save changes"}
        </button>
        {saved && !pending && (
          <span style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--status-working)" }}>Saved.</span>
        )}
      </div>
    </div>
  );
}
