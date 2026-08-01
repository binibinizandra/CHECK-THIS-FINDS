"use server";
import { revalidatePath } from "next/cache";
import { currentUserId } from "@/lib/auth/currentUser";
import { isOwner, OWNER_USER_ID } from "@/lib/auth/owner";
import { listCategories, createCategory, updateCategoryLabel, deleteCategory } from "@/lib/categories/store";
import type { CategoryRecord } from "@/lib/categories/store";

export async function fetchCategories(): Promise<CategoryRecord[]> {
  const userId = await currentUserId();
  if (!isOwner(userId)) return [];
  return listCategories(userId);
}

// Used by the public storefront/product pages, which have no logged-in visitor.
export async function fetchPublicCategories(): Promise<CategoryRecord[]> {
  return listCategories(OWNER_USER_ID);
}

export async function addCategory(label: string): Promise<{ ok: true; category: CategoryRecord } | { error: string }> {
  const userId = await currentUserId();
  if (!isOwner(userId)) return { error: "Not authorized." };
  if (!label.trim()) return { error: "Category name is required." };
  const category = await createCategory(userId, label);
  if (!category) return { error: "Could not create category." };
  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true, category };
}

export async function renameCategory(id: string, label: string): Promise<{ ok: true } | { error: string }> {
  const userId = await currentUserId();
  if (!isOwner(userId)) return { error: "Not authorized." };
  if (!label.trim()) return { error: "Category name is required." };
  await updateCategoryLabel(userId, id, label);
  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true };
}

export async function removeCategory(id: string): Promise<{ ok: true } | { error: string }> {
  const userId = await currentUserId();
  if (!isOwner(userId)) return { error: "Not authorized." };
  await deleteCategory(userId, id);
  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true };
}
