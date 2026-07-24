import { notFound } from "next/navigation";
import Link from "next/link";
import { currentUser, currentUserId } from "@/lib/auth/currentUser";
import { ensureUser } from "@/lib/users/store";
import { getLeadById } from "@/lib/leads/store";
import { listAgents } from "@/lib/agents/store";
import { listDraftsForLead } from "@/lib/outreach/store";
import { listProposalsForLead } from "@/lib/proposals/store";
import { STAGES } from "@/lib/leads/types";
import RunJobButton from "@/components/deals/RunJobButton";
import DraftMessageCard from "@/components/deals/DraftMessageCard";
import ProposalCard from "@/components/deals/ProposalCard";
import BriefCard from "@/components/deals/BriefCard";
import BookCallForm from "@/components/deals/BookCallForm";

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const user = await currentUser();
  const userId = await currentUserId();
  if (userId) {
    await ensureUser(userId, user?.primaryEmailAddress?.emailAddress ?? null, user?.fullName ?? user?.firstName ?? null);
  }
  const lead = userId ? await getLeadById(userId, params.id) : null;
  if (!lead) notFound();

  const [agentList, drafts, proposalList] = await Promise.all([
    listAgents(userId!),
    listDraftsForLead(userId!, lead.id),
    listProposalsForLead(userId!, lead.id),
  ]);
  const agent = agentList.find((a) => a.id === lead.agentId);
  const stageLabel = STAGES.find((s) => s.id === lead.status)?.label ?? lead.status;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 26px 90px" }}>
      <Link href="/deals" style={{ fontFamily: "var(--font-body)", fontSize: 13.5, color: "var(--color-muted)" }}>
        ← Back to Deals
      </Link>

      <div style={{ margin: "18px 0 32px" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: 26,
            letterSpacing: "-0.012em",
            margin: "0 0 6px",
            color: "var(--color-ink)",
          }}
        >
          {lead.name}
        </h1>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--color-muted)" }}>
          {[lead.company, lead.platform, lead.email, stageLabel].filter(Boolean).join(" · ")}
          {agent && ` · assigned to ${agent.name}`}
        </div>
      </div>

      <section style={{ marginBottom: 44 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14, gap: 12 }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: 18,
              letterSpacing: "-0.01em",
              margin: 0,
              color: "var(--color-ink)",
            }}
          >
            Brand brief
          </h2>
          <RunJobButton
            leadId={lead.id}
            agentId={lead.agentId}
            kind="research"
            label={lead.research ? "Refresh brief" : "Write brief"}
            workingLabel="Researching…"
          />
        </div>
        {lead.research ? (
          <BriefCard research={lead.research} />
        ) : (
          <div style={{ fontFamily: "var(--font-body)", fontSize: 13.5, color: "var(--color-muted)" }}>
            No brief yet — write one so your pitches and proposals for this brand hit harder.
          </div>
        )}
      </section>

      <section style={{ marginBottom: 44 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14, gap: 12 }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: 18,
              letterSpacing: "-0.01em",
              margin: 0,
              color: "var(--color-ink)",
            }}
          >
            Messages
          </h2>
          <div style={{ display: "flex", gap: 12 }}>
            <RunJobButton
              leadId={lead.id}
              agentId={lead.agentId}
              kind="outreach"
              label="Draft pitch"
              workingLabel="Writing…"
            />
            <RunJobButton
              leadId={lead.id}
              agentId={lead.agentId}
              kind="follow-up"
              label="Follow up"
              workingLabel="Writing…"
              disabled={drafts.length === 0}
              disabledReason="Draft a pitch first so there's something to follow up on."
            />
          </div>
        </div>
        {drafts.length === 0 ? (
          <div style={{ fontFamily: "var(--font-body)", fontSize: 13.5, color: "var(--color-muted)" }}>
            No messages drafted for this brand yet.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {drafts.map((draft, i) => (
              <DraftMessageCard
                key={draft.id}
                draft={draft}
                label={i === drafts.length - 1 ? "Pitch" : "Follow-up"}
                toEmail={lead.email}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14, gap: 12 }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: 18,
              letterSpacing: "-0.01em",
              margin: 0,
              color: "var(--color-ink)",
            }}
          >
            Proposals
          </h2>
          <RunJobButton
            leadId={lead.id}
            agentId={lead.agentId}
            kind="proposal"
            label="Draft proposal"
            workingLabel="Pricing…"
          />
        </div>
        {proposalList.length === 0 ? (
          <div style={{ fontFamily: "var(--font-body)", fontSize: 13.5, color: "var(--color-muted)" }}>
            No proposals for this brand yet.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {proposalList.map((p) => (
              <ProposalCard key={p.id} proposal={p} />
            ))}
          </div>
        )}
      </section>

      <section style={{ marginTop: 44 }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: 18,
            letterSpacing: "-0.01em",
            margin: "0 0 14px",
            color: "var(--color-ink)",
          }}
        >
          Book a call
        </h2>
        <BookCallForm leadId={lead.id} />
      </section>
    </div>
  );
}
