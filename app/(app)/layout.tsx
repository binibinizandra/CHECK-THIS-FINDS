import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import AppFrame from "@/components/AppFrame";
import { currentUser, currentUserId } from "@/lib/auth/currentUser";
import { ensureUser } from "@/lib/users/store";
import { getCreatorProfile, hasEssentials } from "@/lib/profile/store";
import { isDbConfigured } from "@/lib/db";

export default async function AppSectionLayout({ children }: { children: ReactNode }) {
  const user = await currentUser();
  const userId = await currentUserId();
  if (userId) {
    await ensureUser(userId, user?.primaryEmailAddress?.emailAddress ?? null, user?.fullName ?? user?.firstName ?? null);
    if (isDbConfigured()) {
      const profile = await getCreatorProfile(userId);
      if (!hasEssentials(profile)) {
        redirect("/onboarding");
      }
    }
  }
  return <AppFrame>{children}</AppFrame>;
}
