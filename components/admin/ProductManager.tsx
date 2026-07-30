"use client";
import { useRef, useState, useTransition } from "react";
import { UserButton } from "@clerk/nextjs";
import { uploadProductImage, saveProduct, removeProduct, togglePublished } from "@/lib/products/actions";
import type { ProductRecord } from "@/lib/products/store";

const CATEGORIES = [
  { key: "home", label: "Home Needs & Appliances" },
  { key: "digital", label: "Digital Finds" },
  { key: "care", label: "Personal Care" },
  { key: "food", label: "Food & Treats" },
];

const EMPTY_FORM = {
  id: null as string | null,
  name: "",
  category: "home",
  rating: "4.8",
  reviews: "0",
  imageUrl: "",
  shopeeLink: "",
  pros: "",
  cons: "",
  published: true,
};

export default function ProductManager({
  initialProducts,
  pageViews,
  productClicks,
}: {
  initialProducts: ProductRecord[];
  pageViews: number;
  productClicks: Record<string, number>;
}) {
  const [products, setProducts] = useState(initialProducts);
  const [form, setForm] = useState(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function startEdit(p: ProductRecord) {
    setForm({
      id: p.id,
      name: p.name,
      category: p.category,
      rating: String(p.rating),
      reviews: String(p.reviews),
      imageUrl: p.imageUrl,
      shopeeLink: p.shopeeLink ?? "",
      pros: p.pros ?? "",
      cons: p.cons ?? "",
      published: p.published,
    });
    setSaved(false);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setError("");
    setSaved(false);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    const result = await uploadProductImage(fd);
    setUploading(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setForm((f) => ({ ...f, imageUrl: result.url }));
  }

  function handleSave() {
    setError("");
    setSaved(false);
    const ratingNum = parseFloat(form.rating);
    const reviewsNum = parseInt(form.reviews, 10);
    startTransition(async () => {
      const result = await saveProduct(form.id, {
        name: form.name.trim(),
        category: form.category,
        rating: Number.isFinite(ratingNum) ? ratingNum : 5,
        reviews: Number.isFinite(reviewsNum) ? reviewsNum : 0,
        imageUrl: form.imageUrl,
        shopeeLink: form.shopeeLink.trim() || null,
        tiktokLink: null,
        pros: form.pros.trim() || null,
        cons: form.cons.trim() || null,
        published: form.published,
      });
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setSaved(true);
      if (form.id) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === form.id
              ? { ...p, name: form.name, category: form.category, rating: ratingNum, reviews: reviewsNum, imageUrl: form.imageUrl, shopeeLink: form.shopeeLink || null, pros: form.pros || null, cons: form.cons || null, published: form.published }
              : p
          )
        );
      } else {
        setProducts((prev) => [
          ...prev,
          {
            id: `temp-${Date.now()}`,
            name: form.name,
            category: form.category,
            rating: ratingNum,
            reviews: reviewsNum,
            imageUrl: form.imageUrl,
            shopeeLink: form.shopeeLink || null,
            tiktokLink: null,
            pros: form.pros || null,
            cons: form.cons || null,
            published: form.published,
            sortOrder: prev.length,
          },
        ]);
      }
      resetForm();
    });
  }

  function handleDelete(id: string) {
    if (!window.confirm("Delete this product? This can't be undone.")) return;
    startTransition(async () => {
      await removeProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    });
  }

  function handleTogglePublished(p: ProductRecord) {
    const next = !p.published;
    startTransition(async () => {
      await togglePublished(p.id, next);
      setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, published: next } : x)));
    });
  }

  return (
    <>
      <style>{`
        .am-wrap { max-width: 720px; margin: 0 auto; padding: 24px 20px 80px; font-family: -apple-system, "Segoe UI", Helvetica, Arial, sans-serif; }
        .am-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
        .am-title { font-weight: 800; font-size: 20px; color: #0A192F; }
        .am-sub { font-size: 12.5px; color: #5B6472; margin-top: 2px; }
        .am-back { font-size: 13px; font-weight: 600; color: #A87B00; }
        .am-card { background: #fff; border: 1px solid #ECE7DC; border-radius: 14px; padding: 20px; margin-bottom: 24px; }
        .am-field { margin-bottom: 14px; }
        .am-label { display: block; font-size: 12.5px; font-weight: 700; color: #0A192F; margin-bottom: 5px; }
        .am-input, .am-select { width: 100%; font-size: 14px; padding: 9px 11px; border: 1px solid #ECE7DC; border-radius: 8px; color: #0A192F; background: #FFFCF6; }
        .am-row { display: flex; gap: 12px; }
        .am-row > * { flex: 1; }
        .am-preview { width: 100px; height: 100px; border-radius: 10px; object-fit: cover; border: 1px solid #ECE7DC; margin-top: 8px; }
        .am-btn { font-weight: 700; font-size: 13.5px; padding: 10px 18px; border-radius: 999px; border: none; cursor: pointer; }
        .am-btn-primary { background: #FFC700; color: #0A192F; }
        .am-btn-ghost { background: #fff; color: #5B6472; border: 1px solid #ECE7DC; }
        .am-error { color: #EE4D2D; font-size: 13px; margin-top: 8px; }
        .am-saved { color: #1a7a3c; font-size: 13px; margin-top: 8px; }
        .am-list-item { display: flex; align-items: center; gap: 12px; padding: 10px; border: 1px solid #ECE7DC; border-radius: 10px; margin-bottom: 8px; }
        .am-list-item img { width: 48px; height: 48px; object-fit: cover; border-radius: 8px; flex-shrink: 0; }
        .am-list-name { font-weight: 700; font-size: 13.5px; color: #0A192F; }
        .am-list-meta { font-size: 11.5px; color: #8B92A3; }
        .am-list-actions { display: flex; gap: 6px; margin-left: auto; }
        .am-list-actions button { font-size: 12px; font-weight: 600; padding: 6px 10px; border-radius: 6px; border: 1px solid #ECE7DC; background: #fff; cursor: pointer; }
        .am-checkbox-label { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: #0A192F; cursor: pointer; }
        .am-hint { font-size: 11.5px; color: #8B92A3; margin-top: 4px; }
        .am-badge-hidden { display: inline-block; font-size: 10px; font-weight: 700; color: #A87B00; background: #FFF3D6; border-radius: 999px; padding: 2px 8px; margin-left: 6px; vertical-align: middle; }
        .am-stats-card { display: flex; align-items: center; gap: 8px; background: #fff; border: 1px solid #ECE7DC; border-radius: 14px; padding: 14px 18px; margin-bottom: 20px; }
        .am-stats-num { font-weight: 800; font-size: 22px; color: #0A192F; }
        .am-stats-label { font-size: 12px; color: #8B92A3; font-weight: 600; }
        .am-list-clicks { font-size: 11px; font-weight: 700; color: #A87B00; }
      `}</style>

      <div className="am-wrap">
        <div className="am-header">
          <div>
            <div className="am-title">Manage Products</div>
            <div className="am-sub">Add, edit, or remove items on Check This Finds</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <a className="am-back" href="/">View live site</a>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>

        <div className="am-stats-card">
          <span className="am-stats-num">{pageViews.toLocaleString()}</span>
          <span className="am-stats-label">total site views</span>
        </div>

        <div className="am-card">
          <div style={{ fontWeight: 700, fontSize: 14, color: "#0A192F", marginBottom: 12 }}>
            {form.id ? "Edit product" : "Add a product"}
          </div>

          <div className="am-field">
            <label className="am-label">Product name</label>
            <input className="am-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Electric Kettle" />
          </div>

          <div className="am-row am-field">
            <div>
              <label className="am-label">Category</label>
              <select className="am-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="am-label">Rating (1–5)</label>
              <input className="am-input" type="number" min="1" max="5" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
            </div>
            <div>
              <label className="am-label">Review count</label>
              <input className="am-input" type="number" min="0" value={form.reviews} onChange={(e) => setForm({ ...form, reviews: e.target.value })} />
            </div>
          </div>

          <div className="am-field">
            <label className="am-label">Product photo</label>
            <input ref={fileInputRef} className="am-input" type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
            {uploading && <div style={{ fontSize: 12.5, color: "#5B6472", marginTop: 6 }}>Uploading…</div>}
            {form.imageUrl && <img className="am-preview" src={form.imageUrl} alt="Preview" />}
          </div>

          <div className="am-field">
            <label className="am-label">Shopee link</label>
            <input className="am-input" value={form.shopeeLink} onChange={(e) => setForm({ ...form, shopeeLink: e.target.value })} placeholder="https://shopee.ph/..." />
          </div>

          <div className="am-row am-field">
            <div>
              <label className="am-label">Pros (one per line)</label>
              <textarea className="am-input" rows={4} value={form.pros} onChange={(e) => setForm({ ...form, pros: e.target.value })} placeholder={"Lightweight and portable\nFast charging\nGreat battery life"} />
            </div>
            <div>
              <label className="am-label">Cons (one per line)</label>
              <textarea className="am-input" rows={4} value={form.cons} onChange={(e) => setForm({ ...form, cons: e.target.value })} placeholder={"A bit pricier than similar items\nOnly one color available"} />
            </div>
          </div>

          <div className="am-field">
            <label className="am-checkbox-label">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
              Visible on public site
            </label>
            {!form.published && <div className="am-hint">Hidden from visitors until you check this back on.</div>}
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 4 }}>
            <button className="am-btn am-btn-primary" type="button" onClick={handleSave} disabled={pending || uploading || !form.name.trim() || !form.imageUrl}>
              {pending ? "Saving…" : form.id ? "Save changes" : "Add product"}
            </button>
            {form.id && (
              <button className="am-btn am-btn-ghost" type="button" onClick={resetForm}>
                Cancel edit
              </button>
            )}
            {saved && !pending && <span className="am-saved">Saved.</span>}
          </div>
          {error && <div className="am-error">{error}</div>}
        </div>

        <div style={{ fontWeight: 700, fontSize: 14, color: "#0A192F", marginBottom: 12 }}>
          Current products ({products.length})
        </div>
        {products.length === 0 && (
          <div style={{ fontSize: 13, color: "#8B92A3" }}>No products yet — add your first one above.</div>
        )}
        {products.map((p) => (
          <div className="am-list-item" key={p.id}>
            <img src={p.imageUrl} alt={p.name} />
            <div style={{ minWidth: 0 }}>
              <div className="am-list-name">
                {p.name} {!p.published && <span className="am-badge-hidden">Hidden</span>}
              </div>
              <div className="am-list-meta">
                {CATEGORIES.find((c) => c.key === p.category)?.label ?? p.category} · {p.rating.toFixed(1)}★ ({p.reviews})
              </div>
              <div className="am-list-clicks">{productClicks[p.id] ?? 0} Shopee clicks</div>
            </div>
            <div className="am-list-actions">
              <button type="button" onClick={() => handleTogglePublished(p)}>{p.published ? "Hide" : "Publish"}</button>
              <button type="button" onClick={() => startEdit(p)}>Edit</button>
              <button type="button" onClick={() => handleDelete(p.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
