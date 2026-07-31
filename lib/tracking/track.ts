const LAST_VIEW_KEY = "ctf_last_view_date";

export function track(type: "page_view" | "product_view" | "product_click", productId?: string) {
  if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("qa") === "1") return;
  if (type === "page_view") {
    try {
      const today = new Date().toISOString().slice(0, 10);
      if (localStorage.getItem(LAST_VIEW_KEY) === today) return;
      localStorage.setItem(LAST_VIEW_KEY, today);
    } catch {}
  }
  try {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, productId }),
      keepalive: true,
    }).catch(() => {});
  } catch {}
}
