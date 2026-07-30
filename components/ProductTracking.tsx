"use client";
import { useEffect } from "react";
import { track } from "@/lib/tracking/track";

export function ProductViewTracker({ productId }: { productId: string }) {
  useEffect(() => {
    track("product_view", productId);
  }, [productId]);
  return null;
}

export function TrackedBuyButton({ productId, shopeeLink }: { productId: string; shopeeLink: string }) {
  return (
    <a
      className="pd-btn-store"
      href={shopeeLink}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("product_click", productId)}
    >
      Buy on Shopee
    </a>
  );
}
