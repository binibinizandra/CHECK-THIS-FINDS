import "server-only";
import { auth, currentUser as clerkCurrentUser } from "@clerk/nextjs/server";

export async function currentUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId;
}

export async function currentUser() {
  return clerkCurrentUser();
}
