"use server";
import { addSubscriber } from "@/lib/newsletter/store";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribeNewsletter(email: string): Promise<{ ok: true } | { error: string }> {
  const trimmed = email.trim().toLowerCase();
  if (!EMAIL_RE.test(trimmed)) return { error: "Please enter a valid email address." };
  await addSubscriber(trimmed);
  return { ok: true };
}
