export const runtime = "nodejs";
export const maxDuration = 60;

import { NextResponse } from "next/server";
import { currentUserId } from "@/lib/auth/currentUser";
import { getCreatorProfile, profileSummary } from "@/lib/profile/store";
import { isFirecrawlConfigured, firecrawlSearch } from "@/lib/discovery/firecrawl";
import { extractBrandCandidates, fallbackCandidates } from "@/lib/ai/discovery";
import { createDiscoveredLeads } from "@/lib/leads/store";

export async function POST() {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const profile = await getCreatorProfile(userId);
  const niche = profile?.niche ?? "";
  const creatorContext = profileSummary(profile);

  let candidates;
  if (!isFirecrawlConfigured()) {
    candidates = fallbackCandidates(niche);
  } else {
    const query = niche ? `brands that sponsor ${niche} content creators` : "brands that sponsor content creators";
    const results = await firecrawlSearch(query);
    candidates = results.length > 0 ? await extractBrandCandidates(results, creatorContext) : fallbackCandidates(niche);
  }

  const created = await createDiscoveredLeads(userId, "discovery", candidates);
  return NextResponse.json({ found: created.length, leads: created });
}
