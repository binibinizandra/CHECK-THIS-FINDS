import { listAllProducts } from "@/lib/products/store";
import StorefrontClient from "@/components/StorefrontClient";

export const revalidate = 0;

export default async function Home() {
  const products = await listAllProducts();
  return <StorefrontClient products={products} />;
}
