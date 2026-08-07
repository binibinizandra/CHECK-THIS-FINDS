import { redirect } from "next/navigation";
import { currentUser, currentUserId } from "@/lib/auth/currentUser";
import { isOwner } from "@/lib/auth/owner";
import { ensureUser } from "@/lib/users/store";
import { listProducts } from "@/lib/products/store";
import { listCategories } from "@/lib/categories/store";
import { getAboutContent } from "@/lib/about/store";
import { getPageViewCount, getProductClickCountsShopee, getProductClickCountsLazada, getProductViewCounts } from "@/lib/tracking/store";
import { listSubscribers } from "@/lib/newsletter/store";
import ProductManager from "@/components/admin/ProductManager";
import TrendingManager from "@/components/admin/TrendingManager";
import AboutManager from "@/components/admin/AboutManager";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminPage() {
  const userId = await currentUserId();
  if (!isOwner(userId)) {
    redirect("/");
  }

  const user = await currentUser();
  await ensureUser(userId, user?.primaryEmailAddress?.emailAddress ?? null, user?.fullName ?? user?.firstName ?? null);
  const [initialProducts, initialCategories, initialAboutContent, pageViews, productClicksShopee, productClicksLazada, productViews, subscribers] =
    await Promise.all([
      listProducts(userId),
      listCategories(userId),
      getAboutContent(userId),
      getPageViewCount(),
      getProductClickCountsShopee(),
      getProductClickCountsLazada(),
      getProductViewCounts(),
      listSubscribers(),
    ]);

  return (
    <AdminShell
      products={
        <ProductManager
          initialProducts={initialProducts}
          initialCategories={initialCategories}
          pageViews={pageViews}
          productClicksShopee={productClicksShopee}
          productClicksLazada={productClicksLazada}
          productViews={productViews}
          subscribers={subscribers}
        />
      }
      trending={
        <TrendingManager
          initialProducts={initialProducts}
          initialCategories={initialCategories}
          productClicksShopee={productClicksShopee}
          productClicksLazada={productClicksLazada}
          productViews={productViews}
        />
      }
      about={<AboutManager initialContent={initialAboutContent} />}
    />
  );
}
