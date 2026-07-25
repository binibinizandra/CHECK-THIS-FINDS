import { currentUser, currentUserId } from "@/lib/auth/currentUser";
import { ensureUser } from "@/lib/users/store";
import { getLiveDashboardData } from "@/lib/dashboard/store";
import { getTikTokConnection } from "@/lib/tiktok/store";
import LiveDashboard from "@/components/dashboard/LiveDashboard";
import WidgetDashboard from "@/components/dashboard/WidgetDashboard";

export default async function DashboardPage() {
  const user = await currentUser();
  const userId = await currentUserId();
  if (userId) {
    await ensureUser(userId, user?.primaryEmailAddress?.emailAddress ?? null, user?.fullName ?? user?.firstName ?? null);
  }

  if (!userId) return <WidgetDashboard />;

  const [liveData, tiktokConnection] = await Promise.all([getLiveDashboardData(userId), getTikTokConnection(userId)]);

  return <LiveDashboard initial={liveData} tiktokConnection={tiktokConnection} />;
}
