import { currentUser, currentUserId } from "@/lib/auth/currentUser";
import { ensureUser } from "@/lib/users/store";
import { getCreatorProfile } from "@/lib/profile/store";
import { getTikTokConnection } from "@/lib/tiktok/store";
import { EMPTY_PROFILE } from "@/lib/profile/types";
import ProfileForm from "@/components/profile/ProfileForm";

export default async function ProfilePage() {
  const user = await currentUser();
  const userId = await currentUserId();
  if (userId) {
    await ensureUser(userId, user?.primaryEmailAddress?.emailAddress ?? null, user?.fullName ?? user?.firstName ?? null);
  }
  const profile = userId ? await getCreatorProfile(userId) : null;
  const tiktokConnection = userId ? await getTikTokConnection(userId) : null;

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
        Your Media Kit
      </h1>
      <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--color-muted)", margin: "0 0 32px" }}>
        Who you are, who you reach, and what you charge — every agent grounds its work in this.
      </p>
      <ProfileForm initial={profile ?? EMPTY_PROFILE} tiktokConnection={tiktokConnection} />
    </div>
  );
}
