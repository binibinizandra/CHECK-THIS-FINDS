"use client";
import { useEffect } from "react";
import { track } from "@/lib/tracking/track";

export function ProductViewTracker({ productId, isAdmin }: { productId: string; isAdmin: boolean }) {
  useEffect(() => {
    if (!isAdmin) track("product_view", productId);
  }, [productId, isAdmin]);
  return null;
}

export function TrackedBuyButton({
  productId,
  shopeeLink,
  isAdmin,
}: {
  productId: string;
  shopeeLink: string;
  isAdmin: boolean;
}) {
  return (
    <a
      className="pd-btn-store"
      href={shopeeLink}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => { if (!isAdmin) track("product_click", productId); }}
    >
      Buy on Shopee
    </a>
  );
}
