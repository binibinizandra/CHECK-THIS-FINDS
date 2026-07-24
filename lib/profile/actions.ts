"use server";
import { revalidatePath } from "next/cache";
import { currentUserId } from "@/lib/auth/currentUser";
import { saveCreatorProfile } from "@/lib/profile/store";
import type { CreatorProfileData } from "@/lib/profile/types";

export async function saveProfile(data: CreatorProfileData): Promise<void> {
  const userId = await currentUserId();
  if (!userId) return;
  await saveCreatorProfile(userId, data);
  revalidatePath("/profile");
  revalidatePath("/onboarding");
  revalidatePath("/dashboard");
}
