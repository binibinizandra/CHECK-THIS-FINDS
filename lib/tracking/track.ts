export function track(type: "page_view" | "product_view" | "product_click", productId?: string) {
  try {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, productId }),
      keepalive: true,
    }).catch(() => {});
  } catch {}
}
