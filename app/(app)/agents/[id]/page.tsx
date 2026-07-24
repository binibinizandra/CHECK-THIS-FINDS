import { notFound } from "next/navigation";
import { currentUser, currentUserId } from "@/lib/auth/currentUser";
import { ensureUser } from "@/lib/users/store";
import { getAgent } from "@/lib/agents/store";
import AgentDetailClient from "@/components/agents/AgentDetailClient";

export default async function AgentDetailPage({ params }: { params: { id: string } }) {
  const user = await currentUser();
  const userId = await currentUserId();
  if (userId) {
    await ensureUser(userId, user?.primaryEmailAddress?.emailAddress ?? null, user?.fullName ?? user?.firstName ?? null);
  }
  const agent = userId ? await getAgent(userId, params.id) : null;
  if (!agent) notFound();

  return <AgentDetailClient agent={agent} />;
}
