import { currentUser, currentUserId } from "@/lib/auth/currentUser";
import { ensureUser, getUser } from "@/lib/users/store";
import NotificationSettings from "@/components/NotificationSettings";

export default async function SettingsPage() {
  const user = await currentUser();
  const userId = await currentUserId();
  if (userId) {
    await ensureUser(userId, user?.primaryEmailAddress?.emailAddress ?? null, user?.fullName ?? user?.firstName ?? null);
  }
  const row = userId ? await getUser(userId) : null;
  const notifications = (row?.notifications as Record<string, boolean>) ?? {};

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 26px 90px" }}>
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
        Settings
      </h1>
      <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--color-muted)", margin: "0 0 32px" }}>
        Choose what you want to hear about.
      </p>
      <NotificationSettings initial={notifications} />
    </div>
  );
}
