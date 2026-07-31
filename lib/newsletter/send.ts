import "server-only";
import { listSubscribers } from "@/lib/newsletter/store";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

export interface SendResult {
  sent: number;
  failed: number;
  total: number;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br />");
}

export async function sendNewsletterBroadcast(subject: string, message: string): Promise<SendResult> {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  if (!apiKey || !senderEmail) {
    const missing: string[] = [];
    if (!apiKey) missing.push("BREVO_API_KEY");
    if (!senderEmail) missing.push("BREVO_SENDER_EMAIL");
    throw new Error(
      `DEBUG: missing=[${missing.join(", ")}] apiKeyLen=${apiKey?.length ?? "undefined"} senderEmailLen=${senderEmail?.length ?? "undefined"}`
    );
  }

  const subscribers = await listSubscribers();
  const htmlContent = `<div style="font-family: -apple-system, sans-serif; font-size: 15px; line-height: 1.6; color: #1F2937;">${escapeHtml(message)}</div>`;

  let sent = 0;
  let failed = 0;

  for (const sub of subscribers) {
    try {
      const res = await fetch(BREVO_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "api-key": apiKey,
        },
        body: JSON.stringify({
          sender: { name: "Check This Finds", email: senderEmail },
          to: [{ email: sub.email }],
          subject,
          htmlContent,
        }),
      });
      if (res.ok) sent++;
      else failed++;
    } catch {
      failed++;
    }
  }

  return { sent, failed, total: subscribers.length };
}
