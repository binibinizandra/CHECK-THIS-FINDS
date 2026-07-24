import { currentUser, currentUserId } from "@/lib/auth/currentUser";
import { ensureUser } from "@/lib/users/store";
import { listLeads, listPendingLeads } from "@/lib/leads/store";
import { listAgents } from "@/lib/agents/store";
import DealsPageClient from "@/components/deals/DealsPageClient";

export default async function DealsPage() {
  const user = await currentUser();
  const userId = await currentUserId();
  if (userId) {
    await ensureUser(userId, user?.primaryEmailAddress?.emailAddress ?? null, user?.fullName ?? user?.firstName ?? null);
  }
  const [leadList, pendingList, agentList] = userId
    ? await Promise.all([listLeads(userId), listPendingLeads(userId), listAgents(userId)])
    : [[], [], []];

  return <DealsPageClient initialLeads={leadList} initialPending={pendingList} agents={agentList} />;
}
