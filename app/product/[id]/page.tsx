import { notFound } from "next/navigation";
import { getProduct } from "@/lib/products/store";
import { listComments } from "@/lib/comments/store";
import { currentUserId } from "@/lib/auth/currentUser";
import { isOwner } from "@/lib/auth/owner";
import ProductDetail from "@/components/ProductDetail";

export const revalidate = 0;

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  const [comments, userId] = await Promise.all([listComments(product.id), currentUserId()]);

  return <ProductDetail product={product} comments={comments} isAdmin={isOwner(userId)} />;
}
