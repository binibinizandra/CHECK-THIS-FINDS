import { redirect } from "next/navigation";
import { currentUser, currentUserId } from "@/lib/auth/currentUser";
import { isOwner } from "@/lib/auth/owner";
import { ensureUser } from "@/lib/users/store";
import { listProducts } from "@/lib/products/store";
import { getPageViewCount, getProductClickCounts, getProductViewCounts } from "@/lib/tracking/store";
import ProductManager from "@/components/admin/ProductManager";

export default async function AdminPage() {
  const userId = await currentUserId();
  if (!isOwner(userId)) {
    redirect("/");
  }

  const user = await currentUser();
  await ensureUser(userId, user?.primaryEmailAddress?.emailAddress ?? null, user?.fullName ?? user?.firstName ?? null);
  const [initialProducts, pageViews, productClicks, productViews] = await Promise.all([
    listProducts(userId),
    getPageViewCount(),
    getProductClickCounts(),
    getProductViewCounts(),
  ]);

  return (
    <ProductManager
      initialProducts={initialProducts}
      pageViews={pageViews}
      productClicks={productClicks}
      productViews={productViews}
    />
  );
}
