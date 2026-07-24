import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { currentUser, currentUserId } from "@/lib/auth/currentUser";
import { ensureUser } from "@/lib/users/store";
import { getCreatorProfile, hasEssentials } from "@/lib/profile/store";
import { isDbConfigured } from "@/lib/db";
import { EMPTY_PROFILE } from "@/lib/profile/types";
import OnboardingWizard from "@/components/profile/OnboardingWizard";

export default async function OnboardingPage() {
  const user = await currentUser();
  const userId = await currentUserId();
  if (userId) {
    await ensureUser(userId, user?.primaryEmailAddress?.emailAddress ?? null, user?.fullName ?? user?.firstName ?? null);
  }

  const profile = userId ? await getCreatorProfile(userId) : null;
  if (isDbConfigured() && hasEssentials(profile)) {
    redirect("/dashboard");
  }

  return (
    <div style={{ minHeight: "100dvh" }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 26px",
          maxWidth: 1000,
          margin: "0 auto",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: 17,
            color: "var(--color-ink)",
            letterSpacing: "-0.01em",
          }}
        >
          Agentic Sales Team
        </span>
        <UserButton afterSignOutUrl="/" />
      </header>
      <OnboardingWizard initial={profile ?? EMPTY_PROFILE} />
    </div>
  );
}
