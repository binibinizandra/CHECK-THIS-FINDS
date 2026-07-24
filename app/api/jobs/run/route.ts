export const runtime = "nodejs";
export const maxDuration = 60;

import { NextResponse } from "next/server";
import { currentUserId } from "@/lib/auth/currentUser";
import { claimQueuedJobs, completeJob, failJob, hasQueuedOrRunning } from "@/lib/jobs/store";
import { getCreatorProfile, profileSummary, creatorDisplayName } from "@/lib/profile/store";
import { getLeadById, updateLeadStatus, updateLeadResearch } from "@/lib/leads/store";
import { saveOutreachDraft, getLatestDraftForLead } from "@/lib/outreach/store";
import { saveProposal } from "@/lib/proposals/store";
import { draftOutreach } from "@/lib/ai/outreach";
import { draftProposal } from "@/lib/ai/proposal";
import { draftFollowup } from "@/lib/ai/followup";
import { draftResearch } from "@/lib/ai/research";
import { logActivity } from "@/lib/activity/store";

export async function POST() {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const profile = await getCreatorProfile(userId);
  const creatorContext = profileSummary(profile);
  const creatorName = (await creatorDisplayName(userId)) || "the creator";

  const claimed = await claimQueuedJobs(userId, 5);

  await Promise.all(
    claimed.map(async (job) => {
      try {
        const params = job.params as { leadId?: string };
        const leadId = params.leadId;
        if (!leadId) throw new Error("Missing leadId");
        const lead = await getLeadById(userId, leadId);
        if (!lead) throw new Error("Brand not found");

        if (job.kind === "outreach") {
          const result = await draftOutreach({ goal: null }, lead, creatorContext, creatorName);
          await saveOutreachDraft(userId, {
            agentId: job.agentId,
            leadId: lead.id,
            subject: result.subject,
            body: result.body,
            rationale: result.rationale,
          });
          await updateLeadStatus(userId, lead.id, result.stage);
          await logActivity(userId, {
            agentId: job.agentId,
            type: "email_drafted",
            leadId: lead.id,
            text: `drafted a pitch for ${lead.company || lead.name}`,
          });
          await completeJob(job.id, { ok: true });
        } else if (job.kind === "proposal") {
          const result = await draftProposal({ goal: null }, lead, creatorContext, creatorName);
          await saveProposal(userId, {
            agentId: job.agentId,
            leadId: lead.id,
            title: result.title,
            body: result.body,
            products: result.packages,
          });
          await logActivity(userId, {
            agentId: job.agentId,
            type: "email_drafted",
            leadId: lead.id,
            text: `wrote a proposal for ${lead.company || lead.name}`,
          });
          await completeJob(job.id, { ok: true });
        } else if (job.kind === "follow-up") {
          const prior = await getLatestDraftForLead(userId, lead.id);
          if (!prior) throw new Error("No prior pitch to follow up on yet");
          const result = await draftFollowup(
            { goal: null },
            lead,
            { subject: prior.subject, body: prior.body },
            creatorContext,
            creatorName
          );
          await saveOutreachDraft(userId, {
            agentId: job.agentId,
            leadId: lead.id,
            subject: result.subject,
            body: result.body,
            rationale: result.rationale,
          });
          await logActivity(userId, {
            agentId: job.agentId,
            type: "email_drafted",
            leadId: lead.id,
            text: `followed up with ${lead.company || lead.name}`,
          });
          await completeJob(job.id, { ok: true });
        } else if (job.kind === "research") {
          const result = await draftResearch({ goal: null }, lead, creatorContext, creatorName);
          await updateLeadResearch(userId, lead.id, result);
          await logActivity(userId, {
            agentId: job.agentId,
            type: "lead_qualified",
            leadId: lead.id,
            text: `wrote a brief on ${lead.company || lead.name}`,
          });
          await completeJob(job.id, { ok: true });
        } else {
          throw new Error(`Unhandled job kind: ${job.kind}`);
        }
      } catch (err) {
        await failJob(job.id, err instanceof Error ? err.message : "Unknown error");
      }
    })
  );

  const remaining = await hasQueuedOrRunning(userId);
  return NextResponse.json({ processed: claimed.length, remaining });
}
