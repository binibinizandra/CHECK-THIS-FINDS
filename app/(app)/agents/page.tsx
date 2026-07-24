import { currentUser, currentUserId } from "@/lib/auth/currentUser";
import { ensureUser } from "@/lib/users/store";
import { listAgents, listTeams } from "@/lib/agents/store";
import AgentsPageClient from "@/components/agents/AgentsPageClient";

export default async function AgentsPage() {
  const user = await currentUser();
  const userId = await currentUserId();
  if (userId) {
    await ensureUser(userId, user?.primaryEmailAddress?.emailAddress ?? null, user?.fullName ?? user?.firstName ?? null);
  }
  const [agentList, teamList] = userId ? await Promise.all([listAgents(userId), listTeams(userId)]) : [[], []];

  return <AgentsPageClient initialAgents={agentList} initialTeams={teamList} />;
}
