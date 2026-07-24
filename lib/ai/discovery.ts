import "server-only";
import { geminiJSON, isGeminiConfigured } from "@/lib/ai/gemini";
import type { FirecrawlResult } from "@/lib/discovery/firecrawl";

export interface BrandCandidate {
  name: string;
  company: string | null;
  platform: string | null;
  profileUrl: string | null;
}

const CANDIDATES_SCHEMA = {
  type: "object",
  properties: {
    brands: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          company: { type: "string" },
          platform: { type: "string" },
          profileUrl: { type: "string" },
        },
        required: ["name"],
      },
    },
  },
  required: ["brands"],
};

// A small, clearly-example set so the discovery flow still completes with no search key.
export function fallbackCandidates(niche: string): BrandCandidate[] {
  return [
    { name: "Evergreen Supply Co.", company: "Evergreen Supply Co.", platform: "Instagram", profileUrl: null },
    { name: "Northline Goods", company: "Northline Goods", platform: "TikTok", profileUrl: null },
    { name: "Baseline Wellness", company: "Baseline Wellness", platform: niche ? "Instagram" : null, profileUrl: null },
  ];
}

// Catches article/listicle headlines ("10 Brands That Need Creators NOW", "Best Skincare
// Brands of 2025", "How to Find Sponsors") so they never get inserted as if they were a
// real company name — applies to both the AI path (as a safety net) and the no-AI fallback.
const LISTICLE_PATTERN = /\b\d+\s+(brands?|companies|creators?|things|ideas|ways|tips)\b/i;
const GENERIC_ARTICLE_PATTERN = /\b(best|top|ultimate|guide to|how to|list of|roundup|review)\b/i;

function looksLikeBrandName(title: string): boolean {
  const t = title.trim();
  if (!t || t.length > 60) return false;
  if (LISTICLE_PATTERN.test(t) || GENERIC_ARTICLE_PATTERN.test(t)) return false;
  if (t.split(/\s+/).length > 7) return false;
  return true;
}

function heuristicCandidates(results: FirecrawlResult[]): BrandCandidate[] {
  return results
    .filter((r) => looksLikeBrandName(r.title))
    .slice(0, 6)
    .map((r) => ({
      name: r.title,
      company: r.title || null,
      platform: null,
      profileUrl: r.url || null,
    }));
}

function systemPrompt(creatorContext: string): string {
  return [
    "You're reviewing web search results to find real brands that sponsor content creators — ones that might sponsor this creator.",
    "From the results below, pick the ones that are clearly actual brand or company names — not blog posts, listicles, or news articles about sponsorships in general.",
    'Skip anything that is an article headline rather than a company name — e.g. "10 Brands That Need Creators NOW", "Best Skincare Brands of 2025", "How to Find Sponsors as a Creator". If a result is a roundup or listicle, ignore its title entirely — it is not a brand name, even if brand names appear inside the article.',
    "For each real brand you keep: a clean brand name, the company name (usually the same as the brand name), the platform it seems most associated with if it's obvious from the result (or omit), and the result's URL as profileUrl.",
    "Skip anything vague, generic, or unclear. Return at most 6 — it's fine to return fewer, or none, if nothing in the results is a real brand.",
    "The creator this is for:",
    creatorContext || "(no Media Kit details provided)",
    "Return ONLY JSON matching the schema.",
  ].join("\n\n");
}

export async function extractBrandCandidates(
  searchResults: FirecrawlResult[],
  creatorContext: string
): Promise<BrandCandidate[]> {
  if (searchResults.length === 0) return [];
  if (!isGeminiConfigured()) return heuristicCandidates(searchResults);

  const system = systemPrompt(creatorContext);
  const turns = [
    {
      role: "user" as const,
      text: searchResults.map((r, i) => `${i + 1}. ${r.title}\n${r.description}\n${r.url}`).join("\n\n"),
    },
  ];
  try {
    const result = await geminiJSON<{ brands: BrandCandidate[] }>(system, turns, CANDIDATES_SCHEMA, {
      maxTokens: 1400,
      temperature: 0.4,
    });
    const brands = (result.brands ?? [])
      .filter((b) => b.name && looksLikeBrandName(b.name))
      .map((b) => ({
        name: b.name.trim(),
        company: (b.company || b.name).trim(),
        platform: b.platform?.trim() || null,
        profileUrl: b.profileUrl?.trim() || null,
      }))
      .slice(0, 6);
    return brands;
  } catch {
    return heuristicCandidates(searchResults);
  }
}
