import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProduct } from "@/lib/products/store";
import { listComments } from "@/lib/comments/store";
import { fetchPublicCategories } from "@/lib/categories/actions";
import { currentUserId } from "@/lib/auth/currentUser";
import { isOwner } from "@/lib/auth/owner";
import ProductDetail from "@/components/ProductDetail";

export const revalidate = 0;

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await getProduct(params.id);
  if (!product) return {};

  const title = `${product.name} | Check This Finds`;
  const description = `${product.name} — tested and approved find from Check This Finds.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: product.imageUrl }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.imageUrl],
    },
  };
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  const [comments, categories, userId] = await Promise.all([listComments(product.id), fetchPublicCategories(), currentUserId()]);
  const isAdmin = isOwner(userId);
  if (!product.published && !isAdmin) notFound();

  return <ProductDetail product={product} comments={comments} categories={categories} isAdmin={isAdmin} />;
}
