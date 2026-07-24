import { currentUser, currentUserId } from "@/lib/auth/currentUser";
import { ensureUser } from "@/lib/users/store";
import { listMeetings } from "@/lib/meetings/store";
import { listAgents } from "@/lib/agents/store";
import CalendarPageClient from "@/components/calendar/CalendarPageClient";

export default async function CalendarPage() {
  const user = await currentUser();
  const userId = await currentUserId();
  if (userId) {
    await ensureUser(userId, user?.primaryEmailAddress?.emailAddress ?? null, user?.fullName ?? user?.firstName ?? null);
  }
  const [meetingList, agentList] = userId
    ? await Promise.all([listMeetings(userId), listAgents(userId)])
    : [[], []];

  return <CalendarPageClient initialMeetings={meetingList} agents={agentList} />;
}
