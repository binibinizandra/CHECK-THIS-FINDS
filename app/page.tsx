import { listAllProducts } from "@/lib/products/store";
import StorefrontClient from "@/components/StorefrontClient";
import { currentUserId } from "@/lib/auth/currentUser";
import { isOwner } from "@/lib/auth/owner";

export const revalidate = 0;

export default async function Home() {
  const [products, userId] = await Promise.all([listAllProducts(), currentUserId()]);
  return <StorefrontClient products={products} isAdmin={isOwner(userId)} />;
}
