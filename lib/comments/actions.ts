"use server";
import { revalidatePath } from "next/cache";
import { currentUserId } from "@/lib/auth/currentUser";
import { isOwner } from "@/lib/auth/owner";
import { listComments, addComment, deleteComment } from "@/lib/comments/store";
import type { CommentRecord } from "@/lib/comments/store";

export async function fetchComments(productId: string): Promise<CommentRecord[]> {
  return listComments(productId);
}

export async function postComment(productId: string, body: string): Promise<{ ok: true; comment: CommentRecord } | { error: string }> {
  const userId = await currentUserId();
  if (!isOwner(userId)) return { error: "Not authorized." };
  const trimmed = body.trim();
  if (!trimmed) return { error: "Comment can't be empty." };

  const comment = await addComment(productId, trimmed);
  revalidatePath(`/product/${productId}`);
  return { ok: true, comment };
}

export async function removeComment(id: string, productId: string): Promise<void> {
  const userId = await currentUserId();
  if (!isOwner(userId)) return;
  await deleteComment(id);
  revalidatePath(`/product/${productId}`);
}
