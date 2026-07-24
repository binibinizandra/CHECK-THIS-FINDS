import "server-only";
import { geminiJSON, isGeminiConfigured } from "@/lib/ai/gemini";

export interface ResearchResult {
  summary: string;
  priorities: string[];
  hooks: string[];
  angle: string;
}

export interface ResearchLeadFacts {
  name: string;
  company?: string | null;
  platform?: string | null;
  profileUrl?: string | null;
}

const RESEARCH_SCHEMA = {
  type: "object",
  properties: {
    summary: { type: "string" },
    priorities: { type: "array", items: { type: "string" } },
    hooks: { type: "array", items: { type: "string" } },
    angle: { type: "string" },
  },
  required: ["summary", "priorities", "hooks", "angle"],
};

function fallbackResearch(lead: ResearchLeadFacts): ResearchResult {
  const brand = lead.company || lead.name;
  return {
    summary: `Research brief unavailable (Gemini not configured). ${brand} looks like a reasonable fit worth a first message.`,
    priorities: [],
    hooks: [],
    angle: "Open with a genuine, specific reason you like the brand and propose a simple first collaboration.",
  };
}

function systemPrompt(agentGoal: string | null, creatorContext: string, creatorName: string): string {
  return [
    `You are researching a brand on behalf of ${creatorName}, a real creator, so their next pitch can be sharper and more specific.`,
    agentGoal ? `Your focus right now: ${agentGoal}` : "",
    `Write a short brief: (1) a 2-3 sentence summary of what the brand likely cares about and who they typically sponsor, (2) 2-4 priorities (what they'd want out of a creator partnership), (3) 2-4 concrete hooks (specific, genuine reasons to reach out), (4) a one-sentence angle for how to open the pitch.`,
    `Base this only on the brand's name/platform/profile below plus general knowledge of brands like it — never invent specific facts (numbers, campaigns, quotes) you can't reasonably infer, and don't overstate confidence.`,
    `This brief is for internal use only — it never gets sent to the brand, so it doesn't need first-person voice. Just be direct and useful.`,
    `The creator's Media Kit, for context on what they'd bring to a partnership:`,
    creatorContext || "(no Media Kit details provided)",
    `Return ONLY JSON matching the schema.`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function factsAbout(lead: ResearchLeadFacts): string {
  return [
    `Brand: ${lead.company || lead.name}`,
    lead.platform ? `Platform: ${lead.platform}` : "",
    lead.profileUrl ? `Profile: ${lead.profileUrl}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function draftResearch(
  agent: { goal?: string | null },
  lead: ResearchLeadFacts,
  creatorContext: string,
  creatorName: string
): Promise<ResearchResult> {
  if (!isGeminiConfigured()) return fallbackResearch(lead);
  const system = systemPrompt(agent.goal ?? null, creatorContext, creatorName);
  const turns = [{ role: "user" as const, text: factsAbout(lead) }];
  try {
    const result = await geminiJSON<ResearchResult>(system, turns, RESEARCH_SCHEMA, { maxTokens: 1200, temperature: 0.5 });
    return {
      summary: result.summary?.trim() || "",
      priorities: Array.isArray(result.priorities) ? result.priorities.filter(Boolean) : [],
      hooks: Array.isArray(result.hooks) ? result.hooks.filter(Boolean) : [],
      angle: result.angle?.trim() || "",
    };
  } catch {
    return fallbackResearch(lead);
  }
}
