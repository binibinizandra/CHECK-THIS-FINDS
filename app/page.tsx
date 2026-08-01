import { listAllProducts } from "@/lib/products/store";
import { fetchPublicCategories } from "@/lib/categories/actions";
import StorefrontClient from "@/components/StorefrontClient";
import { currentUserId } from "@/lib/auth/currentUser";
import { isOwner } from "@/lib/auth/owner";

export const revalidate = 0;

export default async function Home() {
  const [products, categories, userId] = await Promise.all([listAllProducts(), fetchPublicCategories(), currentUserId()]);
  return <StorefrontClient products={products} categories={categories} isAdmin={isOwner(userId)} />;
}
