import "server-only";
import { geminiJSON, isGeminiConfigured } from "@/lib/ai/gemini";
import { CAPABILITIES } from "@/lib/agentTypes";
import type { Turn } from "@/lib/ai/gemini";

export type ChatCapability = "scrape" | "research" | "outreach" | "proposal" | "follow-up" | "book-meeting" | "unknown";

export interface ChatIntent {
  capability: ChatCapability;
  brandName: string | null;
  topic: string | null;
}

export interface ChatHistoryItem {
  who: "ai" | "me";
  text: string;
}

const INTENT_SCHEMA = {
  type: "object",
  properties: {
    capability: {
      type: "string",
      enum: ["scrape", "research", "outreach", "proposal", "follow-up", "book-meeting", "unknown"],
    },
    brandName: { type: "string" },
    topic: { type: "string" },
  },
  required: ["capability"],
};

const SPECIFIC_CAPABILITY_WORDS = /\b(pitch|outreach|proposal|quote|price it|brief|research|vet|follow[\s-]?up|book|schedule)\b/;

function fallbackIntent(text: string): ChatIntent {
  const t = text.toLowerCase();
  if (/\b(book|schedule)\b/.test(t) && /\b(at|on|tomorrow|next|today|am|pm)\b/.test(t)) {
    return { capability: "book-meeting", brandName: null, topic: null };
  }
  if (/\bfollow[\s-]?up\b/.test(t)) return { capability: "follow-up", brandName: null, topic: null };
  if (/\b(proposal|quote|price it)\b/.test(t)) return { capability: "proposal", brandName: null, topic: null };
  if (/\b(brief|research|vet)\b/.test(t)) return { capability: "research", brandName: null, topic: null };
  if (/\b(pitch|outreach)\b/.test(t)) return { capability: "outreach", brandName: null, topic: null };
  // Any other mention of "brand" without a more specific signal reads as "go find some" —
  // covers both "find me skincare brands" and a bare description like "skincare brand
  // in the Philippines with ceramides" with no explicit find/search verb.
  if (/\bbrands?\b/.test(t) && !SPECIFIC_CAPABILITY_WORDS.test(t)) {
    return { capability: "scrape", brandName: null, topic: text.trim() };
  }
  return { capability: "unknown", brandName: null, topic: null };
}

export async function classifyChatIntent(
  text: string,
  context: { leadNames: string[]; history?: ChatHistoryItem[] }
): Promise<ChatIntent> {
  if (!isGeminiConfigured()) return fallbackIntent(text);
  const capList = CAPABILITIES.map((c) => `${c.id} — ${c.label}`).join("\n");
  const system = [
    "You're routing a message from a creator to their AI sales team. Figure out which single capability they're asking for, and any brand name or search topic mentioned.",
    "Capabilities:",
    capList,
    "Brands they're already working (their real pipeline — match brandName to one of these verbatim only if they're clearly talking about one of THESE, or leave brandName empty):",
    context.leadNames.length ? context.leadNames.join(", ") : "(none yet)",
    '"scrape" vs "research" — this is the easiest mix-up, be careful: use "scrape" whenever they\'re describing the KIND of brand they want (a niche, a location, an ingredient, a category) to go find NEW ones — even if they never say "find" or "search." Only use "research" when they name one SPECIFIC brand that already appears in the pipeline list above and want a brief on it.',
    'Examples: "find me skincare brands" → scrape. "skincare brand here in the Philippines, with ceramides" → scrape, topic "skincare brand in the Philippines with ceramides" — this is a description of what to go find, not a named existing brand. "write a brief on Acme" → research, brandName "Acme" (only if Acme is in the pipeline list).',
    "If earlier messages are shown below, treat a short reply like \"okay, ...\" or one that just adds detail as a continuation of that same request — classify the combined intent, not just the last line in isolation.",
    "Return ONLY JSON matching the schema.",
  ].join("\n\n");

  const turns: Turn[] = [
    ...(context.history ?? []).slice(-6).map((h) => ({ role: h.who === "me" ? ("user" as const) : ("model" as const), text: h.text })),
    { role: "user" as const, text },
  ];
  try {
    return await geminiJSON<ChatIntent>(system, turns, INTENT_SCHEMA, { maxTokens: 800, temperature: 0.2 });
  } catch {
    return fallbackIntent(text);
  }
}
