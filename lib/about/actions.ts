"use server";
import { revalidatePath } from "next/cache";
import { currentUserId } from "@/lib/auth/currentUser";
import { isOwner, OWNER_USER_ID } from "@/lib/auth/owner";
import { getAboutContent, updateAboutContent } from "@/lib/about/store";
import type { AboutContentRecord, FaqItem } from "@/lib/about/store";

export async function fetchAboutContent(): Promise<AboutContentRecord | null> {
  const userId = await currentUserId();
  if (!isOwner(userId)) return null;
  return getAboutContent(userId);
}

// Used by the public /about page, which has no logged-in visitor.
export async function fetchPublicAboutContent(): Promise<AboutContentRecord> {
  return getAboutContent(OWNER_USER_ID);
}

async function saveSection(patch: Partial<AboutContentRecord>): Promise<{ ok: true } | { error: string }> {
  const userId = await currentUserId();
  if (!isOwner(userId)) return { error: "Not authorized." };
  await updateAboutContent(userId, patch);
  revalidatePath("/about");
  revalidatePath("/admin");
  return { ok: true };
}

export async function saveHeaderSection(eyebrow: string, title: string) {
  if (!eyebrow.trim() || !title.trim()) return { error: "Both fields are required." };
  return saveSection({ eyebrow: eyebrow.trim(), title: title.trim() });
}

export async function saveIntroSection(intro: string) {
  if (!intro.trim()) return { error: "Intro text is required." };
  return saveSection({ intro: intro.trim() });
}

export async function saveMissionVisionSection(missionText: string, visionText: string) {
  if (!missionText.trim() || !visionText.trim()) return { error: "Both fields are required." };
  return saveSection({ missionText: missionText.trim(), visionText: visionText.trim() });
}

export async function saveCuratorSection(curatorName: string, curatorBio: string) {
  if (!curatorName.trim() || !curatorBio.trim()) return { error: "Both fields are required." };
  return saveSection({ curatorName: curatorName.trim(), curatorBio: curatorBio.trim() });
}

export async function saveFaqSection(faq: FaqItem[]) {
  const cleaned = faq.map((f) => ({ question: f.question.trim(), answer: f.answer.trim() })).filter((f) => f.question && f.answer);
  if (cleaned.length === 0) return { error: "Add at least one question and answer." };
  return saveSection({ faq: cleaned });
}
