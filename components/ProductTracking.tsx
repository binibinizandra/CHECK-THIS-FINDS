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
  lazadaLink,
  isAdmin,
}: {
  productId: string;
  shopeeLink: string | null;
  lazadaLink?: string | null;
  isAdmin: boolean;
}) {
  return (
    <>
      {shopeeLink && (
        <a
          className="pd-btn-store"
          href={shopeeLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => { if (!isAdmin) track("product_click_shopee", productId); }}
        >
          Buy on Shopee
        </a>
      )}
      {lazadaLink && (
        <a
          className="pd-btn-store pd-btn-store-lazada"
          href={lazadaLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => { if (!isAdmin) track("product_click_lazada", productId); }}
        >
          Buy on Lazada
        </a>
      )}
    </>
  );
}
