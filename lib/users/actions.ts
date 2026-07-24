"use server";
import { revalidatePath } from "next/cache";
import { currentUserId } from "@/lib/auth/currentUser";
import { setNotificationPreference } from "@/lib/users/store";

export async function toggleNotification(key: string, value: boolean): Promise<void> {
  const userId = await currentUserId();
  if (!userId) return;
  await setNotificationPreference(userId, key, value);
  revalidatePath("/settings");
}
