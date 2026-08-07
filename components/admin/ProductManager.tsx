"use client";
import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { uploadProductImage, saveProduct, removeProduct, togglePublished } from "@/lib/products/actions";
import { addCategory, renameCategory, removeCategory } from "@/lib/categories/actions";
import { sendNewsletterUpdate } from "@/lib/newsletter/actions";
import type { ProductRecord } from "@/lib/products/store";
import type { CategoryRecord } from "@/lib/categories/store";
import type { SubscriberRecord } from "@/lib/newsletter/store";

const BADGES = [
  { key: "", label: "No badge" },
  { key: "best_pick", label: "Best Pick" },
  { key: "trending", label: "Trending" },
  { key: "editors_choice", label: "Editor's Choice" },
  { key: "worth_every_peso", label: "Worth Every Peso" },
];

const EMPTY_FORM = {
  id: null as string | null,
  name: "",
  category: "",
  imageUrl: "",
  shopeeLink: "",
  price: "",
  pros: "",
  cons: "",
  voucherNote: "",
  badge: "",
  saleTag: "",
  published: true,
};

export default function ProductManager({
  initialProducts,
  initialCategories,
  pageViews,
  productClicks,
  productViews,
  subscribers,
}: {
  initialProducts: ProductRecord[];
  initialCategories: CategoryRecord[];
  pageViews: number;
  productClicks: Record<string, number>;
  productViews: Record<string, number>;
  subscribers: SubscriberRecord[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [form, setForm] = useState({ ...EMPTY_FORM, category: initialCategories[0]?.key ?? "" });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newCategoryLabel, setNewCategoryLabel] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const [categoryError, setCategoryError] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryLabel, setEditingCategoryLabel] = useState("");
  const [categoryPending, startCategoryTransition] = useTransition();

  function handleAddCategory() {
    setCategoryError("");
    if (!newCategoryLabel.trim()) return;
    setAddingCategory(true);
    addCategory(newCategoryLabel).then((result) => {
      setAddingCategory(false);
      if ("error" in result) {
        setCategoryError(result.error);
        return;
      }
      setCategories((prev) => [...prev, result.category]);
      setNewCategoryLabel("");
    });
  }

  function startEditCategory(c: CategoryRecord) {
    setEditingCategoryId(c.id);
    setEditingCategoryLabel(c.label);
    setCategoryError("");
  }

  function saveEditCategory() {
    if (!editingCategoryId || !editingCategoryLabel.trim()) return;
    const id = editingCategoryId;
    const label = editingCategoryLabel.trim();
    startCategoryTransition(async () => {
      const result = await renameCategory(id, label);
      if ("error" in result) {
        setCategoryError(result.error);
        return;
      }
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, label } : c)));
      setEditingCategoryId(null);
    });
  }

  function handleDeleteCategory(c: CategoryRecord) {
    const inUse = products.filter((p) => p.category === c.key).length;
    const warning = inUse > 0
      ? `Delete "${c.label}"? ${inUse} product(s) are still assigned to it — they'll keep that category until you move them.`
      : `Delete "${c.label}"?`;
    if (!window.confirm(warning)) return;
    startCategoryTransition(async () => {
      await removeCategory(c.id);
      setCategories((prev) => prev.filter((x) => x.id !== c.id));
    });
  }

  const [composeSubject, setComposeSubject] = useState("");
  const [composeMessage, setComposeMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState("");
  const [sendError, setSendError] = useState("");

  function handleSendUpdate() {
    if (!window.confirm(`Send this update to all ${subscribers.length} subscriber(s)? This can't be undone.`)) return;
    setSending(true);
    setSendError("");
    setSendResult("");
    sendNewsletterUpdate(composeSubject, composeMessage).then((result) => {
      setSending(false);
      if ("error" in result) {
        setSendError(result.error);
        return;
      }
      setSendResult(`Sent to ${result.sent} of ${result.total} subscriber(s).${result.failed ? ` ${result.failed} failed.` : ""}`);
      setComposeSubject("");
      setComposeMessage("");
    });
  }

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
      badge: p.badge ?? "",
      saleTag: p.saleTag ?? "",
      published: p.published,
    });
    setSaved(false);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setForm({ ...EMPTY_FORM, category: categories[0]?.key ?? "" });
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
    const ratingNum = 5;
    const reviewsNum = 0;
    const priceNum = form.price.trim() ? parseFloat(form.price) : null;
    startTransition(async () => {
      const result = await saveProduct(form.id, {
        name: form.name.trim(),
        category: form.category,
        rating: ratingNum,
        reviews: reviewsNum,
        imageUrl: form.imageUrl,
        shopeeLink: form.shopeeLink.trim() || null,
        tiktokLink: null,
        price: priceNum != null && Number.isFinite(priceNum) ? priceNum : null,
        pros: form.pros.trim() || null,
        cons: form.cons.trim() || null,
        voucherNote: form.voucherNote.trim() || null,
        badge: form.badge || null,
        saleTag: form.saleTag.trim() || null,
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
              ? { ...p, name: form.name, category: form.category, rating: ratingNum, reviews: reviewsNum, imageUrl: form.imageUrl, shopeeLink: form.shopeeLink || null, price: priceNum, pros: form.pros || null, cons: form.cons || null, voucherNote: form.voucherNote || null, badge: form.badge || null, saleTag: form.saleTag.trim() || null, published: form.published }
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
            price: priceNum,
            pros: form.pros || null,
            cons: form.cons || null,
            voucherNote: form.voucherNote || null,
            badge: form.badge || null,
            saleTag: form.saleTag.trim() || null,
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
        .am-title { font-weight: 800; font-size: 20px; color: #1F2937; }
        .am-sub { font-size: 12.5px; color: #6B7280; margin-top: 2px; }
        .am-back { font-size: 13px; font-weight: 600; color: #0B6B57; }
        .am-card { background: #fff; border: 1px solid #E7E3D9; border-radius: 14px; padding: 20px; margin-bottom: 24px; }
        .am-field { margin-bottom: 14px; }
        .am-label { display: block; font-size: 12.5px; font-weight: 700; color: #1F2937; margin-bottom: 5px; }
        .am-input, .am-select { width: 100%; font-size: 14px; padding: 9px 11px; border: 1px solid #E7E3D9; border-radius: 8px; color: #1F2937; background: #FAFAF7; }
        .am-row { display: flex; gap: 12px; }
        .am-row > * { flex: 1; }
        .am-preview { width: 100px; height: 100px; border-radius: 10px; object-fit: cover; border: 1px solid #E7E3D9; margin-top: 8px; }
        .am-btn { font-weight: 700; font-size: 13.5px; padding: 10px 18px; border-radius: 999px; border: none; cursor: pointer; }
        .am-btn-primary { background: #0B6B57; color: #FFFFFF; }
        .am-btn-ghost { background: #fff; color: #6B7280; border: 1px solid #E7E3D9; }
        .am-error { color: #B4483A; font-size: 13px; margin-top: 8px; }
        .am-saved { color: #0B6B57; font-size: 13px; margin-top: 8px; }
        .am-list-item { display: flex; align-items: center; gap: 12px; padding: 10px; border: 1px solid #E7E3D9; border-radius: 10px; margin-bottom: 8px; }
        .am-list-item img { width: 48px; height: 48px; object-fit: cover; border-radius: 8px; flex-shrink: 0; }
        .am-list-name { font-weight: 700; font-size: 13.5px; color: #1F2937; }
        .am-list-meta { font-size: 11.5px; color: #6B7280; }
        .am-list-actions { display: flex; gap: 6px; margin-left: auto; }
        .am-list-actions button { font-size: 12px; font-weight: 600; padding: 6px 10px; border-radius: 6px; border: 1px solid #E7E3D9; background: #fff; cursor: pointer; }
        .am-cat-row { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-top: 1px solid #F0EDE4; }
        .am-cat-row:first-of-type { border-top: none; }
        .am-cat-row input.am-input { flex: 1; padding: 6px 9px; }
        .am-cat-label { font-weight: 600; font-size: 13.5px; color: #1F2937; }
        .am-cat-count { font-size: 11.5px; color: #6B7280; margin-left: auto; white-space: nowrap; }
        .am-cat-row button { font-size: 12px; font-weight: 600; padding: 6px 10px; border-radius: 6px; border: 1px solid #E7E3D9; background: #fff; cursor: pointer; flex-shrink: 0; }
        .am-checkbox-label { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: #1F2937; cursor: pointer; }
        .am-hint { font-size: 11.5px; color: #6B7280; margin-top: 4px; }
        .am-badge-hidden { display: inline-block; font-size: 10px; font-weight: 700; color: #8A6D1F; background: #F5EAC8; border-radius: 999px; padding: 2px 8px; margin-left: 6px; vertical-align: middle; }
        .am-stats-card { display: flex; align-items: center; gap: 8px; background: #fff; border: 1px solid #E7E3D9; border-radius: 14px; padding: 14px 18px; margin-bottom: 20px; }
        .am-stats-num { font-weight: 800; font-size: 22px; color: #1F2937; }
        .am-stats-label { font-size: 12px; color: #6B7280; font-weight: 600; }
        .am-list-clicks { font-size: 11px; font-weight: 700; color: #0F766E; }
        .am-stats-row { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 20px; }
        .am-stats-row .am-stats-card { margin-bottom: 0; flex: 1; min-width: 160px; }
        .am-subs-details { background: #fff; border: 1px solid #E7E3D9; border-radius: 14px; padding: 4px 18px; margin-bottom: 24px; }
        .am-subs-details summary { list-style: none; display: flex; align-items: center; justify-content: space-between; padding: 14px 0; font-size: 13px; font-weight: 700; color: #1F2937; cursor: pointer; }
        .am-subs-details summary::-webkit-details-marker { display: none; }
        .am-subs-details summary::after { content: "+"; font-size: 18px; font-weight: 400; color: #0B6B57; }
        .am-subs-details[open] summary::after { content: "−"; }
        .am-subs-list { max-height: 260px; overflow-y: auto; padding-bottom: 14px; }
        .am-subs-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 8px 0; border-top: 1px solid #F0EDE4; font-size: 12.5px; }
        .am-subs-email { color: #1F2937; font-weight: 600; word-break: break-all; }
        .am-subs-date { color: #6B7280; font-size: 11.5px; flex-shrink: 0; }
        .am-subs-empty { font-size: 12.5px; color: #6B7280; padding: 4px 0 14px; }
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

        <div className="am-stats-row">
          <div className="am-stats-card">
            <span className="am-stats-num">{pageViews.toLocaleString()}</span>
            <span className="am-stats-label">total site views</span>
          </div>
          <div className="am-stats-card">
            <span className="am-stats-num">{subscribers.length.toLocaleString()}</span>
            <span className="am-stats-label">newsletter subscribers</span>
          </div>
        </div>

        <details className="am-subs-details">
          <summary>View newsletter subscribers</summary>
          {subscribers.length === 0 ? (
            <div className="am-subs-empty">No one has subscribed yet.</div>
          ) : (
            <div className="am-subs-list">
              {subscribers.map((s) => (
                <div className="am-subs-row" key={s.id}>
                  <span className="am-subs-email">{s.email}</span>
                  <span className="am-subs-date">{new Date(s.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </details>

        <div className="am-card">
          <div style={{ fontWeight: 700, fontSize: 14, color: "#1F2937", marginBottom: 4 }}>
            Compose an update
          </div>
          <div className="am-sub" style={{ marginBottom: 12 }}>
            Emails every subscriber ({subscribers.length}) with the message below.
          </div>
          <div className="am-field">
            <label className="am-label">Subject</label>
            <input
              className="am-input"
              value={composeSubject}
              onChange={(e) => setComposeSubject(e.target.value)}
              placeholder="e.g. New finds this week 🎉"
            />
          </div>
          <div className="am-field">
            <label className="am-label">Message</label>
            <textarea
              className="am-input"
              rows={5}
              value={composeMessage}
              onChange={(e) => setComposeMessage(e.target.value)}
              placeholder="Write your update here..."
            />
          </div>
          <button
            className="am-btn am-btn-primary"
            type="button"
            onClick={handleSendUpdate}
            disabled={sending || subscribers.length === 0 || !composeSubject.trim() || !composeMessage.trim()}
          >
            {sending ? "Sending…" : `Send to ${subscribers.length} subscriber(s)`}
          </button>
          {sendResult && <div className="am-saved">{sendResult}</div>}
          {sendError && <div className="am-error">{sendError}</div>}
        </div>

        <div className="am-card">
          <div style={{ fontWeight: 700, fontSize: 14, color: "#1F2937", marginBottom: 4 }}>
            Categories
          </div>
          <div className="am-sub" style={{ marginBottom: 12 }}>
            Add new categories or rename existing ones. To move a product, edit it below and pick a different category.
          </div>

          {categories.map((c) => (
            <div className="am-cat-row" key={c.id}>
              {editingCategoryId === c.id ? (
                <>
                  <input
                    className="am-input"
                    value={editingCategoryLabel}
                    onChange={(e) => setEditingCategoryLabel(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") saveEditCategory(); if (e.key === "Escape") setEditingCategoryId(null); }}
                    autoFocus
                  />
                  <button type="button" onClick={saveEditCategory} disabled={categoryPending || !editingCategoryLabel.trim()}>Save</button>
                  <button type="button" onClick={() => setEditingCategoryId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <span className="am-cat-label">{c.label}</span>
                  <span className="am-cat-count">{products.filter((p) => p.category === c.key).length} product(s)</span>
                  <button type="button" onClick={() => startEditCategory(c)}>Edit</button>
                  <button type="button" onClick={() => handleDeleteCategory(c)} disabled={categoryPending}>Delete</button>
                </>
              )}
            </div>
          ))}

          <div className="am-row" style={{ marginTop: 12 }}>
            <input
              className="am-input"
              value={newCategoryLabel}
              onChange={(e) => setNewCategoryLabel(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleAddCategory(); }}
              placeholder="e.g. Skin Care"
            />
            <button
              className="am-btn am-btn-primary"
              type="button"
              style={{ flex: "0 0 auto" }}
              onClick={handleAddCategory}
              disabled={addingCategory || !newCategoryLabel.trim()}
            >
              {addingCategory ? "Adding…" : "Add category"}
            </button>
          </div>
          {categoryError && <div className="am-error">{categoryError}</div>}
        </div>

        <div className="am-card">
          <div style={{ fontWeight: 700, fontSize: 14, color: "#1F2937", marginBottom: 12 }}>
            {form.id ? "Edit product" : "Add a product"}
          </div>

          <div className="am-field">
            <label className="am-label">Product name</label>
            <input className="am-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Electric Kettle" />
          </div>

          <div className="am-field">
            <label className="am-label">Category</label>
            <select className="am-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {categories.map((c) => (
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
            <label className="am-label">Badge (optional)</label>
            <select className="am-select" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })}>
              {BADGES.map((b) => (
                <option key={b.key} value={b.key}>{b.label}</option>
              ))}
            </select>
            <div className="am-hint">Only tag a product as Best Pick / Trending / etc. if it genuinely earns it.</div>
          </div>

          <div className="am-field">
            <label className="am-label">Menu tag (optional)</label>
            <input
              className="am-input"
              value={form.saleTag}
              onChange={(e) => setForm({ ...form, saleTag: e.target.value })}
              placeholder="e.g. Trending or 8.8 Sale"
            />
            <div className="am-hint">
              Products sharing the same tag automatically get their own menu item on the site — clear it and the menu item
              disappears once no published products use it anymore. Leave blank for normal products.
            </div>
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

        <div style={{ fontWeight: 700, fontSize: 14, color: "#1F2937", marginBottom: 4 }}>
          Current products ({products.filter((p) => !p.saleTag).length})
        </div>
        <div className="am-sub" style={{ marginBottom: 12 }}>
          Tagged products (Trending, 8.8 Sale, etc.) are managed separately in the Trending / Sale tab above.
        </div>
        {products.filter((p) => !p.saleTag).length === 0 && (
          <div style={{ fontSize: 13, color: "#6B7280" }}>No products yet — add your first one above.</div>
        )}
        {products.filter((p) => !p.saleTag).map((p) => (
          <div className="am-list-item" key={p.id}>
            <Image src={p.imageUrl} alt={p.name} width={48} height={48} />
            <div style={{ minWidth: 0 }}>
              <div className="am-list-name">
                {p.name} {!p.published && <span className="am-badge-hidden">Hidden</span>}
              </div>
              <div className="am-list-meta">
                {categories.find((c) => c.key === p.category)?.label ?? p.category}
                {p.price != null && ` · ₱${p.price.toLocaleString()}`}
              </div>
              <div className="am-list-clicks">{productViews[p.id] ?? 0} views · {productClicks[p.id] ?? 0} Shopee clicks</div>
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
