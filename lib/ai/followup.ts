import "server-only";
import { geminiJSON, isGeminiConfigured } from "@/lib/ai/gemini";
import { PITCH_GUARDRAILS } from "@/lib/ai/guardrails";

export interface FollowupResult {
  subject: string;
  body: string;
  rationale: string;
}

export interface FollowupLeadFacts {
  name: string;
  company?: string | null;
  platform?: string | null;
}

export interface PriorPitch {
  subject: string;
  body: string;
}

const FOLLOWUP_SCHEMA = {
  type: "object",
  properties: {
    subject: { type: "string" },
    body: { type: "string" },
    rationale: { type: "string" },
  },
  required: ["subject", "body", "rationale"],
};

function fallbackFollowup(lead: FollowupLeadFacts, creatorName: string): FollowupResult {
  const brand = lead.company || lead.name;
  return {
    subject: "Circling back",
    body: `Hi again,\n\nJust wanted to circle back on my last note about a partnership with ${brand} — still very interested if the timing works on your end. Happy to answer any questions.\n\nBest,\n${creatorName}`,
    rationale: "Fallback follow-up (Gemini not configured).",
  };
}

function systemPrompt(agentGoal: string | null, creatorContext: string, creatorName: string): string {
  return [
    `You ARE ${creatorName} — a real creator following up on your OWN earlier message to a brand that's gone quiet. Write in first person: I / my / me.`,
    agentGoal ? `Your focus right now: ${agentGoal}` : "",
    `Write a short, warm, polite nudge (2-4 sentences) that clearly builds on the prior pitch below — don't repeat it verbatim, just reference it naturally and re-open the door. No pressure, no guilt-tripping.`,
    PITCH_GUARDRAILS,
    `The creator's Media Kit:`,
    creatorContext || "(no Media Kit details provided)",
    `Return ONLY JSON matching the schema.`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function factsAbout(lead: FollowupLeadFacts, prior: PriorPitch): string {
  return [
    `Brand: ${lead.company || lead.name}`,
    lead.platform ? `Platform: ${lead.platform}` : "",
    `My prior pitch to them —`,
    `Subject: ${prior.subject}`,
    `Body: ${prior.body}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function draftFollowup(
  agent: { goal?: string | null },
  lead: FollowupLeadFacts,
  prior: PriorPitch,
  creatorContext: string,
  creatorName: string
): Promise<FollowupResult> {
  if (!isGeminiConfigured()) return fallbackFollowup(lead, creatorName);
  const system = systemPrompt(agent.goal ?? null, creatorContext, creatorName);
  const turns = [{ role: "user" as const, text: factsAbout(lead, prior) }];
  try {
    const result = await geminiJSON<FollowupResult>(system, turns, FOLLOWUP_SCHEMA, { maxTokens: 1200, temperature: 0.6 });
    return {
      subject: result.subject?.trim() || "Circling back",
      body: result.body?.trim() || "",
      rationale: result.rationale?.trim() || "",
    };
  } catch {
    return fallbackFollowup(lead, creatorName);
  }
}
