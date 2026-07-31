import { listAllProducts } from "@/lib/products/store";
import { currentUserId } from "@/lib/auth/currentUser";
import { isOwner } from "@/lib/auth/owner";
import WishlistClient from "@/components/WishlistClient";

export const revalidate = 0;

export const metadata = {
  title: "Your Wishlist | Check This Finds",
  description: "Products you've saved from Check This Finds.",
};

export default async function WishlistPage() {
  const [products, userId] = await Promise.all([listAllProducts(), currentUserId()]);
  return <WishlistClient products={products} isAdmin={isOwner(userId)} />;
}
