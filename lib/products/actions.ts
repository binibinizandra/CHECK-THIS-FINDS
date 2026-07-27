"use server";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";
import { currentUserId } from "@/lib/auth/currentUser";
import { listProducts, createProduct, updateProduct, deleteProduct } from "@/lib/products/store";
import type { ProductRecord, ProductInput } from "@/lib/products/store";

export async function fetchProducts(): Promise<ProductRecord[]> {
  const userId = await currentUserId();
  if (!userId) return [];
  return listProducts(userId);
}

export async function uploadProductImage(formData: FormData): Promise<{ url: string } | { error: string }> {
  const userId = await currentUserId();
  if (!userId) return { error: "Not signed in." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "No file selected." };
  if (!file.type.startsWith("image/")) return { error: "Please choose an image file." };
  if (file.size > 8 * 1024 * 1024) return { error: "Image is too large (max 8MB)." };

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return { error: "Image uploads aren't set up yet on this deployment. See setup instructions." };
  }

  try {
    const blob = await put(`products/${userId}/${Date.now()}-${file.name}`, file, {
      access: "public",
      addRandomSuffix: true,
    });
    return { url: blob.url };
  } catch {
    return { error: "Upload failed. Please try again." };
  }
}

export async function saveProduct(id: string | null, data: ProductInput): Promise<{ ok: true } | { error: string }> {
  const userId = await currentUserId();
  if (!userId) return { error: "Not signed in." };
  if (!data.name.trim()) return { error: "Product name is required." };
  if (!data.imageUrl.trim()) return { error: "An image is required." };

  if (id) {
    await updateProduct(userId, id, data);
  } else {
    await createProduct(userId, data);
  }
  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true };
}

export async function removeProduct(id: string): Promise<void> {
  const userId = await currentUserId();
  if (!userId) return;
  await deleteProduct(userId, id);
  revalidatePath("/");
  revalidatePath("/admin");
}
