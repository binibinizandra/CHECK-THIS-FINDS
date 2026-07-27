import { currentUser, currentUserId } from "@/lib/auth/currentUser";
import { ensureUser } from "@/lib/users/store";
import { listProducts } from "@/lib/products/store";
import ProductManager from "@/components/admin/ProductManager";

export default async function AdminPage() {
  const user = await currentUser();
  const userId = await currentUserId();
  if (userId) {
    await ensureUser(userId, user?.primaryEmailAddress?.emailAddress ?? null, user?.fullName ?? user?.firstName ?? null);
  }
  const initialProducts = userId ? await listProducts(userId) : [];

  return <ProductManager initialProducts={initialProducts} />;
}
