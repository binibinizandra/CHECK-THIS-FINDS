"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import * as f from "@/components/profile/formStyles";
import PlatformEditor from "@/components/profile/PlatformEditor";
import AudienceFields from "@/components/profile/AudienceFields";
import { saveProfile } from "@/lib/profile/actions";
import type { CreatorProfileData } from "@/lib/profile/types";

const STEPS = ["Your niche & voice", "Where you post", "Audience & your rate"];

export default function OnboardingWizard({ initial }: { initial: CreatorProfileData }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<CreatorProfileData>(initial);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const canLeaveStep0 = Boolean(data.niche.trim());
  const canLeaveStep1 = data.platforms.some((p) => p.platform.trim());
  const canFinish = canLeaveStep0 && canLeaveStep1 && data.rateFloor !== null;

  function next() {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }
  function finish() {
    startTransition(async () => {
      await saveProfile(data);
      router.push("/dashboard");
    });
  }

  return (
    <div
      style={{
        maxWidth: 620,
        margin: "0 auto",
        padding: "56px 26px",
      }}
    >
      <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
        {STEPS.map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              background: i <= step ? "var(--color-accent)" : "var(--color-border)",
            }}
          />
        ))}
      </div>

      <div
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: 600,
          fontSize: 13,
          color: "var(--color-accent-dark)",
          marginBottom: 8,
        }}
      >
        Step {step + 1} of {STEPS.length}
      </div>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: 26,
          letterSpacing: "-0.012em",
          margin: "0 0 6px",
          color: "var(--color-ink)",
        }}
      >
        {STEPS[step]}
      </h1>
      <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--color-muted)", margin: "0 0 28px" }}>
        This is what every AI helper grounds its work on — so pitches, briefs, and proposals actually sound like you.
      </p>

      {step === 0 && (
        <div>
          <div style={f.fieldWrap}>
            <label style={f.label}>Your niche</label>
            <input
              autoFocus
              value={data.niche}
              onChange={(e) => setData({ ...data, niche: e.target.value })}
              placeholder="e.g. fitness, beauty, personal finance"
              style={f.input}
            />
          </div>
          <div style={f.fieldWrap}>
            <label style={f.label}>Short bio (optional)</label>
            <textarea
              value={data.bio}
              onChange={(e) => setData({ ...data, bio: e.target.value })}
              placeholder="A couple sentences about who you are and what you make."
              style={f.textarea}
            />
          </div>
          <div style={f.fieldWrap}>
            <label style={f.label}>Voice &amp; tone (optional)</label>
            <input
              value={data.tone}
              onChange={(e) => setData({ ...data, tone: e.target.value })}
              placeholder="e.g. warm and funny, direct and no-fluff"
              style={f.input}
            />
          </div>
        </div>
      )}

      {step === 1 && (
        <div style={f.fieldWrap}>
          <PlatformEditor value={data.platforms} onChange={(platforms) => setData({ ...data, platforms })} />
        </div>
      )}

      {step === 2 && (
        <div>
          <div style={f.fieldWrap}>
            <label style={f.label}>Your audience (optional)</label>
            <AudienceFields value={data.audience} onChange={(audience) => setData({ ...data, audience })} />
          </div>
          <div style={f.fieldWrap}>
            <label style={f.label}>Past brand deals (optional)</label>
            <textarea
              value={data.pastDeals}
              onChange={(e) => setData({ ...data, pastDeals: e.target.value })}
              placeholder="Brands you've worked with before, if any."
              style={f.textarea}
            />
          </div>
          <div style={f.fieldWrap}>
            <label style={f.label}>Rate floor — the least you'll take for a single deliverable</label>
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
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
        {step > 0 ? (
          <button type="button" onClick={back} style={f.secondaryButton}>
            Back
          </button>
        ) : (
          <span />
        )}
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={next}
            disabled={step === 0 ? !canLeaveStep0 : !canLeaveStep1}
            style={{ ...f.primaryButton, opacity: (step === 0 ? !canLeaveStep0 : !canLeaveStep1) ? 0.5 : 1 }}
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={finish}
            disabled={!canFinish || pending}
            style={{ ...f.primaryButton, opacity: !canFinish || pending ? 0.5 : 1 }}
          >
            {pending ? "Saving…" : "Finish setup"}
          </button>
        )}
      </div>
    </div>
  );
}
