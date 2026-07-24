"use server";
import { revalidatePath } from "next/cache";
import { currentUserId } from "@/lib/auth/currentUser";
import { saveMessage, listMessages } from "@/lib/chat/store";
import type { ChatMessage } from "@/lib/chat/store";
import { listAgents } from "@/lib/agents/store";
import type { AgentSummary } from "@/lib/agents/types";
import type { CapabilityId } from "@/lib/agentTypes";
import { listLeads, updateLeadStatus, updateLeadResearch } from "@/lib/leads/store";
import { getCreatorProfile, profileSummary, creatorDisplayName } from "@/lib/profile/store";
import { classifyChatIntent } from "@/lib/ai/chatIntent";
import { draftOutreach } from "@/lib/ai/outreach";
import { draftProposal } from "@/lib/ai/proposal";
import { draftFollowup } from "@/lib/ai/followup";
import { draftResearch } from "@/lib/ai/research";
import { saveOutreachDraft, getLatestDraftForLead } from "@/lib/outreach/store";
import { saveProposal } from "@/lib/proposals/store";
import { isFirecrawlConfigured, firecrawlSearch } from "@/lib/discovery/firecrawl";
import { extractBrandCandidates, fallbackCandidates } from "@/lib/ai/discovery";
import { createDiscoveredLeads } from "@/lib/leads/store";
import { quickBookMeeting } from "@/lib/meetings/actions";
import { logActivity } from "@/lib/activity/store";

function findMentionedAgent(text: string, agentsList: AgentSummary[]): AgentSummary | null {
  const match = text.match(/@([A-Za-z.'-]+(?:\s+[A-Za-z.'-]+)?)/);
  const mentioned = match?.[1]?.trim().toLowerCase();
  if (!mentioned) return null;
  return (
    agentsList.find((a) => a.name.toLowerCase() === mentioned) ??
    agentsList.find((a) => a.name.toLowerCase().split(" ")[0] === mentioned.split(" ")[0]) ??
    agentsList.find((a) => a.role.toLowerCase().includes(mentioned)) ??
    agentsList.find((a) => mentioned.includes(a.name.toLowerCase().split(" ")[0])) ??
    null
  );
}

function findLeadByName(name: string | null, leadsList: Awaited<ReturnType<typeof listLeads>>) {
  if (!name) return null;
  const target = name.toLowerCase();
  return (
    leadsList.find((l) => (l.company || l.name).toLowerCase() === target) ??
    leadsList.find((l) => (l.company || l.name).toLowerCase().includes(target) || target.includes((l.company || l.name).toLowerCase())) ??
    null
  );
}

export async function sendChatMessage(text: string): Promise<ChatMessage[]> {
  const userId = await currentUserId();
  if (!userId) return [];
  const trimmed = text.trim();
  if (!trimmed) return [];

  const priorMessages = await listMessages(userId);
  const history = priorMessages.slice(-6).map((m) => ({ who: m.who, text: m.text }));

  const created: ChatMessage[] = [];
  const userMsg = await saveMessage(userId, { agentId: null, who: "me", text: trimmed });
  if (userMsg) created.push(userMsg);

  async function reply(agentId: string | null, msgText: string) {
    const m = await saveMessage(userId!, { agentId, who: "ai", text: msgText });
    if (m) created.push(m);
  }

  const agentsList = await listAgents(userId);
  const leadsList = await listLeads(userId);
  const profile = await getCreatorProfile(userId);
  const creatorContext = profileSummary(profile);
  const creatorName = (await creatorDisplayName(userId)) || "the creator";

  const mentionedAgent = findMentionedAgent(trimmed, agentsList);
  const intent = await classifyChatIntent(trimmed, { leadNames: leadsList.map((l) => l.company || l.name), history });

  if (intent.capability === "unknown") {
    await reply(
      mentionedAgent?.id ?? null,
      "I couldn't quite tell what you'd like done — try something like \"@Research find me skincare brands\" or \"@Otis pitch Acme.\""
    );
    revalidatePath("/chat");
    return created;
  }

  const capability: CapabilityId = intent.capability;

  const actingAgent: AgentSummary | undefined =
    mentionedAgent && mentionedAgent.capabilities.includes(capability)
      ? mentionedAgent
      : agentsList.find((a) => a.capabilities.includes(capability)) ?? mentionedAgent ?? agentsList[0];

  if (!actingAgent) {
    await reply(null, "You don't have any agents set up yet — head to Agents to build your team first.");
    revalidatePath("/chat");
    return created;
  }

  const handoffNote =
    mentionedAgent && actingAgent.id !== mentionedAgent.id ? `${mentionedAgent.name} passed this to me, since I handle that — ` : "";

  try {
    if (intent.capability === "scrape") {
      const niche = intent.topic || profile?.niche || "";
      let candidates;
      if (!isFirecrawlConfigured()) {
        candidates = fallbackCandidates(niche);
      } else {
        const query = niche ? `brands that sponsor ${niche} content creators` : "brands that sponsor content creators";
        const results = await firecrawlSearch(query);
        candidates = results.length > 0 ? await extractBrandCandidates(results, creatorContext) : fallbackCandidates(niche);
      }
      const inserted = await createDiscoveredLeads(userId, actingAgent.id, candidates);
      await reply(
        actingAgent.id,
        `${handoffNote}${
          inserted.length > 0
            ? `found ${inserted.length} brand${inserted.length === 1 ? "" : "s"} and dropped ${inserted.length === 1 ? "it" : "them"} in Pending review — go take a look.`
            : "didn't turn up anything new this time — try a different niche or check back later."
        }`
      );
    } else if (intent.capability === "book-meeting") {
      const result = await quickBookMeeting(trimmed.replace(/@\S+/, "").trim());
      await reply(actingAgent.id, `${handoffNote}${result.message}`);
    } else {
      const lead = findLeadByName(intent.brandName, leadsList);
      if (!lead) {
        await reply(actingAgent.id, `${handoffNote}I couldn't tell which brand you meant — try naming it exactly as it appears in Deals.`);
      } else if (intent.capability === "research") {
        const result = await draftResearch({ goal: null }, lead, creatorContext, creatorName);
        await updateLeadResearch(userId, lead.id, result);
        await logActivity(userId, {
          agentId: actingAgent.id,
          type: "lead_qualified",
          leadId: lead.id,
          text: `wrote a brief on ${lead.company || lead.name}`,
        });
        await reply(actingAgent.id, `${handoffNote}wrote a brief on ${lead.company || lead.name} — check their brand page.`);
      } else if (intent.capability === "outreach") {
        const result = await draftOutreach({ goal: null }, lead, creatorContext, creatorName);
        await saveOutreachDraft(userId, {
          agentId: actingAgent.id,
          leadId: lead.id,
          subject: result.subject,
          body: result.body,
          rationale: result.rationale,
        });
        await updateLeadStatus(userId, lead.id, result.stage);
        await logActivity(userId, {
          agentId: actingAgent.id,
          type: "email_drafted",
          leadId: lead.id,
          text: `drafted a pitch for ${lead.company || lead.name}`,
        });
        await reply(actingAgent.id, `${handoffNote}drafted a pitch for ${lead.company || lead.name} — it's waiting in their Messages.`);
      } else if (intent.capability === "proposal") {
        const result = await draftProposal({ goal: null }, lead, creatorContext, creatorName);
        await saveProposal(userId, {
          agentId: actingAgent.id,
          leadId: lead.id,
          title: result.title,
          body: result.body,
          products: result.packages,
        });
        await logActivity(userId, {
          agentId: actingAgent.id,
          type: "email_drafted",
          leadId: lead.id,
          text: `wrote a proposal for ${lead.company || lead.name}`,
        });
        await reply(actingAgent.id, `${handoffNote}wrote a proposal for ${lead.company || lead.name} — check their brand page.`);
      } else if (intent.capability === "follow-up") {
        const prior = await getLatestDraftForLead(userId, lead.id);
        if (!prior) {
          await reply(
            actingAgent.id,
            `${handoffNote}there's no pitch out to ${lead.company || lead.name} yet, so there's nothing to follow up on — draft a pitch first.`
          );
        } else {
          const result = await draftFollowup(
            { goal: null },
            lead,
            { subject: prior.subject, body: prior.body },
            creatorContext,
            creatorName
          );
          await saveOutreachDraft(userId, {
            agentId: actingAgent.id,
            leadId: lead.id,
            subject: result.subject,
            body: result.body,
            rationale: result.rationale,
          });
          await logActivity(userId, {
            agentId: actingAgent.id,
            type: "email_drafted",
            leadId: lead.id,
            text: `followed up with ${lead.company || lead.name}`,
          });
          await reply(actingAgent.id, `${handoffNote}followed up with ${lead.company || lead.name} — check their Messages.`);
        }
      }
    }
  } catch {
    await reply(actingAgent.id, "Something went wrong on my end running that — try again in a moment.");
  }

  revalidatePath("/chat");
  return created;
}
