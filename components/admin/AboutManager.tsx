"use client";
import { useState, useTransition } from "react";
import { saveHeaderSection, saveIntroSection, saveMissionVisionSection, saveCuratorSection, saveFaqSection } from "@/lib/about/actions";
import type { AboutContentRecord, FaqItem } from "@/lib/about/store";

function SectionFeedback({ error, saved }: { error: string; saved: boolean }) {
  if (error) return <div className="am-error">{error}</div>;
  if (saved) return <div className="am-saved">Saved.</div>;
  return null;
}

export default function AboutManager({ initialContent }: { initialContent: AboutContentRecord }) {
  const [eyebrow, setEyebrow] = useState(initialContent.eyebrow);
  const [title, setTitle] = useState(initialContent.title);
  const [headerPending, startHeaderTransition] = useTransition();
  const [headerError, setHeaderError] = useState("");
  const [headerSaved, setHeaderSaved] = useState(false);

  const [intro, setIntro] = useState(initialContent.intro);
  const [introPending, startIntroTransition] = useTransition();
  const [introError, setIntroError] = useState("");
  const [introSaved, setIntroSaved] = useState(false);

  const [missionText, setMissionText] = useState(initialContent.missionText);
  const [visionText, setVisionText] = useState(initialContent.visionText);
  const [mvPending, startMvTransition] = useTransition();
  const [mvError, setMvError] = useState("");
  const [mvSaved, setMvSaved] = useState(false);

  const [curatorName, setCuratorName] = useState(initialContent.curatorName);
  const [curatorBio, setCuratorBio] = useState(initialContent.curatorBio);
  const [curatorPending, startCuratorTransition] = useTransition();
  const [curatorError, setCuratorError] = useState("");
  const [curatorSaved, setCuratorSaved] = useState(false);

  const [faq, setFaq] = useState<FaqItem[]>(initialContent.faq);
  const [faqPending, startFaqTransition] = useTransition();
  const [faqError, setFaqError] = useState("");
  const [faqSaved, setFaqSaved] = useState(false);

  function handleSaveHeader() {
    setHeaderError("");
    setHeaderSaved(false);
    startHeaderTransition(async () => {
      const result = await saveHeaderSection(eyebrow, title);
      if ("error" in result) {
        setHeaderError(result.error);
        return;
      }
      setHeaderSaved(true);
    });
  }

  function handleSaveIntro() {
    setIntroError("");
    setIntroSaved(false);
    startIntroTransition(async () => {
      const result = await saveIntroSection(intro);
      if ("error" in result) {
        setIntroError(result.error);
        return;
      }
      setIntroSaved(true);
    });
  }

  function handleSaveMv() {
    setMvError("");
    setMvSaved(false);
    startMvTransition(async () => {
      const result = await saveMissionVisionSection(missionText, visionText);
      if ("error" in result) {
        setMvError(result.error);
        return;
      }
      setMvSaved(true);
    });
  }

  function handleSaveCurator() {
    setCuratorError("");
    setCuratorSaved(false);
    startCuratorTransition(async () => {
      const result = await saveCuratorSection(curatorName, curatorBio);
      if ("error" in result) {
        setCuratorError(result.error);
        return;
      }
      setCuratorSaved(true);
    });
  }

  function updateFaqItem(index: number, field: "question" | "answer", value: string) {
    setFaq((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  }

  function addFaqItem() {
    setFaq((prev) => [...prev, { question: "", answer: "" }]);
  }

  function removeFaqItem(index: number) {
    setFaq((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSaveFaq() {
    setFaqError("");
    setFaqSaved(false);
    startFaqTransition(async () => {
      const result = await saveFaqSection(faq);
      if ("error" in result) {
        setFaqError(result.error);
        return;
      }
      setFaqSaved(true);
    });
  }

  return (
    <div className="am-wrap">
      <style>{`
        .am-about-faq-item { border: 1px solid #E7E3D9; border-radius: 10px; padding: 12px; margin-bottom: 10px; }
        .am-about-faq-remove { font-size: 11.5px; font-weight: 600; color: #B4483A; background: none; border: none; cursor: pointer; padding: 4px 0; }
      `}</style>

      <div style={{ fontWeight: 800, fontSize: 20, color: "#1F2937", marginBottom: 4 }}>Edit About Page</div>
      <div className="am-sub" style={{ marginBottom: 20 }}>
        Each section below saves independently — edit whatever you want and click that section&apos;s Save button.
      </div>

      <div className="am-card">
        <div style={{ fontWeight: 700, fontSize: 14, color: "#1F2937", marginBottom: 12 }}>Header</div>
        <div className="am-field">
          <label className="am-label">Eyebrow label</label>
          <input className="am-input" value={eyebrow} onChange={(e) => setEyebrow(e.target.value)} />
        </div>
        <div className="am-field">
          <label className="am-label">Page title</label>
          <input className="am-input" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <button className="am-btn am-btn-primary" type="button" onClick={handleSaveHeader} disabled={headerPending || !eyebrow.trim() || !title.trim()}>
          {headerPending ? "Saving…" : "Save header"}
        </button>
        <SectionFeedback error={headerError} saved={headerSaved && !headerPending} />
      </div>

      <div className="am-card">
        <div style={{ fontWeight: 700, fontSize: 14, color: "#1F2937", marginBottom: 12 }}>Intro</div>
        <div className="am-field">
          <label className="am-label">Intro text</label>
          <textarea className="am-input" rows={10} value={intro} onChange={(e) => setIntro(e.target.value)} />
          <div className="am-hint">Leave a blank line between paragraphs — each becomes its own paragraph on the page.</div>
        </div>
        <button className="am-btn am-btn-primary" type="button" onClick={handleSaveIntro} disabled={introPending || !intro.trim()}>
          {introPending ? "Saving…" : "Save intro"}
        </button>
        <SectionFeedback error={introError} saved={introSaved && !introPending} />
      </div>

      <div className="am-card">
        <div style={{ fontWeight: 700, fontSize: 14, color: "#1F2937", marginBottom: 12 }}>Mission &amp; Vision</div>
        <div className="am-field">
          <label className="am-label">Our Mission</label>
          <textarea className="am-input" rows={3} value={missionText} onChange={(e) => setMissionText(e.target.value)} />
        </div>
        <div className="am-field">
          <label className="am-label">Our Vision</label>
          <textarea className="am-input" rows={3} value={visionText} onChange={(e) => setVisionText(e.target.value)} />
        </div>
        <button className="am-btn am-btn-primary" type="button" onClick={handleSaveMv} disabled={mvPending || !missionText.trim() || !visionText.trim()}>
          {mvPending ? "Saving…" : "Save mission & vision"}
        </button>
        <SectionFeedback error={mvError} saved={mvSaved && !mvPending} />
      </div>

      <div className="am-card">
        <div style={{ fontWeight: 700, fontSize: 14, color: "#1F2937", marginBottom: 12 }}>Curator bio</div>
        <div className="am-field">
          <label className="am-label">Name</label>
          <input className="am-input" value={curatorName} onChange={(e) => setCuratorName(e.target.value)} />
        </div>
        <div className="am-field">
          <label className="am-label">Bio</label>
          <textarea className="am-input" rows={4} value={curatorBio} onChange={(e) => setCuratorBio(e.target.value)} />
        </div>
        <button className="am-btn am-btn-primary" type="button" onClick={handleSaveCurator} disabled={curatorPending || !curatorName.trim() || !curatorBio.trim()}>
          {curatorPending ? "Saving…" : "Save curator bio"}
        </button>
        <SectionFeedback error={curatorError} saved={curatorSaved && !curatorPending} />
      </div>

      <div className="am-card">
        <div style={{ fontWeight: 700, fontSize: 14, color: "#1F2937", marginBottom: 12 }}>Frequently Asked Questions</div>
        {faq.map((item, i) => (
          <div className="am-about-faq-item" key={i}>
            <div className="am-field">
              <label className="am-label">Question {i + 1}</label>
              <input className="am-input" value={item.question} onChange={(e) => updateFaqItem(i, "question", e.target.value)} />
            </div>
            <div className="am-field" style={{ marginBottom: 8 }}>
              <label className="am-label">Answer</label>
              <textarea className="am-input" rows={2} value={item.answer} onChange={(e) => updateFaqItem(i, "answer", e.target.value)} />
            </div>
            <button className="am-about-faq-remove" type="button" onClick={() => removeFaqItem(i)}>
              Remove this question
            </button>
          </div>
        ))}
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 4 }}>
          <button className="am-btn am-btn-ghost" type="button" onClick={addFaqItem}>
            Add question
          </button>
          <button className="am-btn am-btn-primary" type="button" onClick={handleSaveFaq} disabled={faqPending || faq.length === 0}>
            {faqPending ? "Saving…" : "Save FAQ"}
          </button>
        </div>
        <SectionFeedback error={faqError} saved={faqSaved && !faqPending} />
      </div>
    </div>
  );
}
