import { notFound } from "next/navigation";
import { getProduct } from "@/lib/products/store";
import ProductDetail from "@/components/ProductDetail";

export const revalidate = 0;

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  return <ProductDetail product={product} />;
}
