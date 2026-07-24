import { currentUser, currentUserId } from "@/lib/auth/currentUser";
import { ensureUser } from "@/lib/users/store";
import { listMessages } from "@/lib/chat/store";
import { listAgents } from "@/lib/agents/store";
import ChatPageClient from "@/components/chat/ChatPageClient";

export default async function ChatPage() {
  const user = await currentUser();
  const userId = await currentUserId();
  if (userId) {
    await ensureUser(userId, user?.primaryEmailAddress?.emailAddress ?? null, user?.fullName ?? user?.firstName ?? null);
  }
  const [messageList, agentList] = userId
    ? await Promise.all([listMessages(userId), listAgents(userId)])
    : [[], []];

  return <ChatPageClient initialMessages={messageList} agents={agentList} />;
}
