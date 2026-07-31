"use server";
import { currentUserId } from "@/lib/auth/currentUser";
import { isOwner } from "@/lib/auth/owner";
import { addSubscriber } from "@/lib/newsletter/store";
import { sendNewsletterBroadcast } from "@/lib/newsletter/send";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribeNewsletter(email: string): Promise<{ ok: true } | { error: string }> {
  const trimmed = email.trim().toLowerCase();
  if (!EMAIL_RE.test(trimmed)) return { error: "Please enter a valid email address." };
  await addSubscriber(trimmed);
  return { ok: true };
}

export async function sendNewsletterUpdate(
  subject: string,
  message: string
): Promise<{ ok: true; sent: number; failed: number; total: number } | { error: string }> {
  const userId = await currentUserId();
  if (!isOwner(userId)) return { error: "Not authorized." };

  const trimmedSubject = subject.trim();
  const trimmedMessage = message.trim();
  if (!trimmedSubject) return { error: "Please add a subject." };
  if (!trimmedMessage) return { error: "Please write a message." };

  try {
    const result = await sendNewsletterBroadcast(trimmedSubject, trimmedMessage);
    return { ok: true, ...result };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to send." };
  }
}
