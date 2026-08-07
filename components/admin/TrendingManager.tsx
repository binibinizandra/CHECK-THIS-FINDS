"use client";
import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { uploadProductImage, saveProduct, removeProduct, togglePublished } from "@/lib/products/actions";
import type { ProductRecord } from "@/lib/products/store";
import type { CategoryRecord } from "@/lib/categories/store";

const EMPTY_FORM = {
  id: null as string | null,
  name: "",
  category: "",
  imageUrl: "/images/placeholder-product.svg",
  shopeeLink: "",
  price: "",
  pros: "",
  cons: "",
  voucherNote: "",
  saleTag: "",
  published: false,
};

export default function TrendingManager({
  initialProducts,
  initialCategories,
}: {
  initialProducts: ProductRecord[];
  initialCategories: CategoryRecord[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [form, setForm] = useState({ ...EMPTY_FORM, category: initialCategories[0]?.key ?? "" });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tagged = products.filter((p) => p.saleTag);
  const existingTags = Array.from(new Set(tagged.map((p) => p.saleTag as string)));
  const grouped = existingTags.map((tag) => ({ tag, items: tagged.filter((p) => p.saleTag === tag) }));

  function startEdit(p: ProductRecord) {
    setForm({
      id: p.id,
      name: p.name,
      category: p.category,
      imageUrl: p.imageUrl,
      shopeeLink: p.shopeeLink ?? "",
      price: p.price != null ? String(p.price) : "",
      pros: p.pros ?? "",
      cons: p.cons ?? "",
      voucherNote: p.voucherNote ?? "",
      saleTag: p.saleTag ?? "",
      published: p.published,
    });
    setSaved(false);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setForm({ ...EMPTY_FORM, category: initialCategories[0]?.key ?? "", saleTag: existingTags[0] ?? "" });
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
    if (!form.saleTag.trim()) {
      setError("A tag (e.g. Trending, 8.8 Sale) is required here — untagged products belong in the Products tab.");
      return;
    }
    const priceNum = form.price.trim() ? parseFloat(form.price) : null;
    startTransition(async () => {
      const result = await saveProduct(form.id, {
        name: form.name.trim(),
        category: form.category,
        rating: 5,
        reviews: 0,
        imageUrl: form.imageUrl,
        shopeeLink: form.shopeeLink.trim() || null,
        tiktokLink: null,
        price: priceNum != null && Number.isFinite(priceNum) ? priceNum : null,
        pros: form.pros.trim() || null,
        cons: form.cons.trim() || null,
        voucherNote: form.voucherNote.trim() || null,
        badge: null,
        saleTag: form.saleTag.trim(),
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
              ? {
                  ...p,
                  name: form.name,
                  category: form.category,
                  imageUrl: form.imageUrl,
                  shopeeLink: form.shopeeLink || null,
                  price: priceNum,
                  pros: form.pros || null,
                  cons: form.cons || null,
                  voucherNote: form.voucherNote || null,
                  saleTag: form.saleTag.trim(),
                  published: form.published,
                }
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
            rating: 5,
            reviews: 0,
            imageUrl: form.imageUrl,
            shopeeLink: form.shopeeLink || null,
            tiktokLink: null,
            price: priceNum,
            pros: form.pros || null,
            cons: form.cons || null,
            voucherNote: form.voucherNote || null,
            badge: null,
            saleTag: form.saleTag.trim(),
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
    <div className="am-wrap">
      <style>{`
        .am-trending-group { margin-bottom: 24px; }
        .am-trending-group-title { display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 14px; color: #0B6B57; margin-bottom: 10px; }
        .am-trending-group-count { font-weight: 600; font-size: 12px; color: #6B7280; }
      `}</style>

      <div style={{ fontWeight: 800, fontSize: 20, color: "#1F2937", marginBottom: 4 }}>Trending / Sale Products</div>
      <div className="am-sub" style={{ marginBottom: 20 }}>
        Products tagged with a menu label (Trending, 8.8 Sale, etc.) live here, separate from your regular product list.
        Add photos and links, then Publish — the matching menu item appears on the site automatically.
      </div>

      <div className="am-card">
        <div style={{ fontWeight: 700, fontSize: 14, color: "#1F2937", marginBottom: 12 }}>
          {form.id ? "Edit tagged product" : "Add a tagged product"}
        </div>

        <div className="am-field">
          <label className="am-label">Tag</label>
          <input
            className="am-input"
            list="am-existing-tags"
            value={form.saleTag}
            onChange={(e) => setForm({ ...form, saleTag: e.target.value })}
            placeholder="e.g. Trending or 8.8 Sale"
          />
          <datalist id="am-existing-tags">
            {existingTags.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
          <div className="am-hint">This is required here. Reuse an existing tag to group it with the others, or type a new one.</div>
        </div>

        <div className="am-field">
          <label className="am-label">Product name</label>
          <input className="am-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Rechargeable Neck Fan" />
        </div>

        <div className="am-field">
          <label className="am-label">Category</label>
          <select className="am-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {initialCategories.map((c) => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>
        </div>

        <div className="am-field">
          <label className="am-label">Product photo</label>
          <input ref={fileInputRef} className="am-input" type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
          {uploading && <div style={{ fontSize: 12.5, color: "#6B7280", marginTop: 6 }}>Uploading…</div>}
          {form.imageUrl && <Image className="am-preview" src={form.imageUrl} alt="Preview" width={100} height={100} />}
          {form.imageUrl.includes("placeholder-product") && (
            <div className="am-hint">This is still the placeholder image — you can Publish now and swap in the real photo anytime later.</div>
          )}
        </div>

        <div className="am-field">
          <label className="am-label">Shopee link</label>
          <input className="am-input" value={form.shopeeLink} onChange={(e) => setForm({ ...form, shopeeLink: e.target.value })} placeholder="https://shopee.ph/..." />
        </div>

        <div className="am-field">
          <label className="am-label">Price (₱, optional)</label>
          <input
            className="am-input"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="e.g. 699"
          />
          <div className="am-hint">Use the real, current price on the Shopee listing.</div>
        </div>

        <div className="am-field">
          <label className="am-label">Voucher / promo (optional)</label>
          <input
            className="am-input"
            value={form.voucherNote}
            onChange={(e) => setForm({ ...form, voucherNote: e.target.value })}
            placeholder="e.g. ₱50 off voucher on this listing"
          />
          <div className="am-hint">Only fill this in if there&apos;s a real, currently active voucher on the actual Shopee listing.</div>
        </div>

        <div className="am-row am-field">
          <div>
            <label className="am-label">Pros (one per line)</label>
            <textarea className="am-input" rows={4} value={form.pros} onChange={(e) => setForm({ ...form, pros: e.target.value })} />
          </div>
          <div>
            <label className="am-label">Cons (one per line)</label>
            <textarea className="am-input" rows={4} value={form.cons} onChange={(e) => setForm({ ...form, cons: e.target.value })} />
          </div>
        </div>

        <div className="am-field">
          <label className="am-checkbox-label">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
            Visible on public site
          </label>
          {!form.published && <div className="am-hint">Hidden — and its menu item stays hidden too — until you check this back on.</div>}
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 4 }}>
          <button className="am-btn am-btn-primary" type="button" onClick={handleSave} disabled={pending || uploading || !form.name.trim() || !form.imageUrl}>
            {pending ? "Saving…" : form.id ? "Save changes" : "Add tagged product"}
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

      {grouped.length === 0 && (
        <div style={{ fontSize: 13, color: "#6B7280" }}>No tagged products yet — add one above.</div>
      )}

      {grouped.map(({ tag, items }) => (
        <div className="am-trending-group" key={tag}>
          <div className="am-trending-group-title">
            {tag}
            <span className="am-trending-group-count">({items.length})</span>
          </div>
          {items.map((p) => (
            <div className="am-list-item" key={p.id}>
              <Image src={p.imageUrl} alt={p.name} width={48} height={48} />
              <div style={{ minWidth: 0 }}>
                <div className="am-list-name">
                  {p.name} {!p.published && <span className="am-badge-hidden">Hidden</span>}
                </div>
                <div className="am-list-meta">
                  {initialCategories.find((c) => c.key === p.category)?.label ?? p.category}
                  {p.price != null && ` · ₱${p.price.toLocaleString()}`}
                </div>
              </div>
              <div className="am-list-actions">
                <button type="button" onClick={() => handleTogglePublished(p)}>{p.published ? "Hide" : "Publish"}</button>
                <button type="button" onClick={() => startEdit(p)}>Edit</button>
                <button type="button" onClick={() => handleDelete(p.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
