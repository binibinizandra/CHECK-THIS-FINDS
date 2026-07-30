"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Poppins, Playfair_Display } from "next/font/google";
import type { ProductRecord } from "@/lib/products/store";
import { track } from "@/lib/tracking/track";
import { subscribeNewsletter } from "@/lib/newsletter/actions";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["600", "700", "800"] });

const CATEGORIES: Record<string, string> = {
  home: "Home Needs & Appliances",
  digital: "Digital Finds",
  care: "Personal Care",
  food: "Food & Treats",
};

const TABS = [
  { key: "all", label: "All Finds" },
  { key: "home", label: "Home Needs & Appliances" },
  { key: "digital", label: "Digital Finds" },
  { key: "care", label: "Personal Care" },
  { key: "food", label: "Food & Treats" },
];

const BADGE_INFO: Record<string, { label: string; bg: string; color: string; icon: (p: { className?: string }) => JSX.Element }> = {
  best_pick: { label: "Best Pick", bg: "var(--sf-primary)", color: "#FFFFFF", icon: BadgeCheckIcon },
  trending: { label: "Trending", bg: "#C6603F", color: "#FFFFFF", icon: FlameIcon },
  editors_choice: { label: "Editor's Choice", bg: "var(--sf-accent)", color: "#1F2937", icon: StarIcon },
  worth_every_peso: { label: "Worth Every Peso", bg: "var(--sf-secondary)", color: "#FFFFFF", icon: CoinIcon },
};

function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="16.25" stroke="#0B6B57" strokeWidth="3" />
      <path d="M20.5 3.75A16.25 16.25 0 0 1 34.9 13.1" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" />
      <path d="M13 20.5l4.5 4.5 9.5-10.5" stroke="#0B6B57" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M18 18L14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2z" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BagIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 8h14l-1.2 12.5a2 2 0 0 1-2 1.5H8.2a2 2 0 0 1-2-1.5L5 8z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M8.5 8V6a3.5 3.5 0 0 1 7 0v2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function HeartIcon({ className, filled }: { className?: string; filled?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} aria-hidden="true">
      <path
        d="M12 20.5s-7.5-4.6-9.9-9.1C.6 7.7 2.3 4 6 4c2.1 0 3.6 1.2 6 3.6C14.4 5.2 15.9 4 18 4c3.7 0 5.4 3.7 3.9 7.4C19.5 15.9 12 20.5 12 20.5z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 11l9-7 9 7M5.5 9.5V20h5v-6h3v6h5V9.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DigitalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="5" width="16" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M2 19.5h20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function CareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 20s-7.2-4.4-9.6-8.7C.7 8 2.4 4.7 5.9 4.7c1.9 0 3.4 1 4.3 2.4 0.9-1.4 2.4-2.4 4.3-2.4 3.5 0 5.2 3.3 3.5 6.6C19.2 15.6 12 20 12 20z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FoodIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 3v7a2 2 0 0 0 4 0V3M8 10v11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 3c-1.6 0-2.8 2.2-2.8 5s1.2 5 2.8 5v8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.5l2.9 6.2 6.6.7-4.9 4.6 1.3 6.6L12 17.5l-5.9 3.1 1.3-6.6-4.9-4.6 6.6-.7L12 2.5z" />
    </svg>
  );
}

function FlameIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2s4.2 3.9 4.2 8.2a4.2 4.2 0 0 1-8.4 0c0-1 .5-2 .5-2S6 9.9 6 12.4a6 6 0 0 0 12 0C18 6.9 12 2 12 2z" />
    </svg>
  );
}

function BadgeCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2.5l6.5 2.8v5.4c0 4.6-2.9 8.2-6.5 10-3.6-1.8-6.5-5.4-6.5-10V5.3L12 2.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 12l2.2 2.2L15.5 9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CoinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="1.7" />
      <text x="12" y="16.3" textAnchor="middle" fontSize="11" fontWeight="800" fill="currentColor" stroke="none">
        ₱
      </text>
    </svg>
  );
}

function HandshakeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M2.5 12.5l4-4 3.3 3.3a1.6 1.6 0 0 0 2.4-2.1L9.5 7 12 4.5a2.3 2.3 0 0 1 3 0l6.5 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M6 15l3 3a2 2 0 0 0 2.8 0l4.7-4.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 11V7.5a4 4 0 0 1 8 0V11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1.6" fill="currentColor" />
    </svg>
  );
}

const CATEGORY_ICON: Record<string, (p: { className?: string }) => JSX.Element> = {
  home: HomeIcon,
  digital: DigitalIcon,
  care: CareIcon,
  food: FoodIcon,
};

const TRUST_ITEMS = [
  { icon: BadgeCheckIcon, title: "Personally Curated", text: "Every product is carefully researched and selected by me." },
  { icon: StarIcon, title: "Top Rated", text: "Only highly rated and recommended products make it here." },
  { icon: CoinIcon, title: "Worth Every Peso", text: "Great value, quality, and performance you can count on." },
  { icon: HandshakeIcon, title: "Honest Recommendations", text: "No hype, no push — just real reviews and honest opinions." },
  { icon: LockIcon, title: "Safe & Trusted", text: "Your trust is my priority. Shop with confidence every time." },
];

function HeroIllustration() {
  return (
    <svg viewBox="0 0 520 420" fill="none" aria-hidden="true" className="sf-hero-illustration">
      <defs>
        <linearGradient id="sfWaveGrad2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0B6B57" />
          <stop offset="100%" stopColor="#D4AF37" />
        </linearGradient>
        <radialGradient id="sfPlatform" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E7E3D9" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#E7E3D9" stopOpacity="0" />
        </radialGradient>
      </defs>

      <path d="M10 110 C 120 50, 200 150, 320 70 S 500 30, 510 5" stroke="url(#sfWaveGrad2)" strokeWidth="2" opacity="0.2" fill="none" />
      <ellipse cx="270" cy="378" rx="220" ry="28" fill="url(#sfPlatform)" />

      <g transform="translate(15,225)" stroke="#0B6B57" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M0 0h16l13 88h95" />
        <rect x="29" y="0" width="112" height="60" rx="4" />
        <circle cx="55" cy="112" r="9" fill="#FAFAF7" />
        <circle cx="118" cy="112" r="9" fill="#FAFAF7" />
      </g>

      <g transform="translate(175,175)">
        <rect x="0" y="58" width="128" height="88" rx="6" fill="#C9A876" />
        <line x1="0" y1="88" x2="128" y2="88" stroke="#A9895E" strokeWidth="2" />
        <rect x="14" y="0" width="100" height="68" rx="6" fill="#D8B98C" />
        <line x1="14" y1="28" x2="114" y2="28" stroke="#B79968" strokeWidth="2" />
        <circle cx="64" cy="6" r="25" fill="#0B6B57" />
        <path d="M53 6l7.5 7.5L75 -2" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <text x="64" y="40" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="#0B6B57" letterSpacing="0.5">
          CHECKED
        </text>
      </g>

      <g transform="translate(140,258)">
        <path d="M-12 42h44l-6 32h-30z" fill="#FAFAF7" stroke="#E7E3D9" strokeWidth="2" />
        <path d="M10 42C10 8 -12 -4 -24 -16" stroke="#0F766E" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M10 42C10 2 22 -8 34 -18" stroke="#0B6B57" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M10 42C10 14 4 -8 -2 -22" stroke="#0F766E" strokeWidth="4" fill="none" strokeLinecap="round" />
      </g>

      <g transform="translate(355,145)">
        <path d="M8 42h104l11 128H-3z" fill="#0B6B57" />
        <path d="M28 42C28 15 44 0 60 0s32 15 32 42" stroke="#0B6B57" strokeWidth="5" fill="none" />
        <circle cx="60" cy="100" r="23" fill="#D4AF37" />
        <path d="M50 100l7 7 13-15" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>

      <circle cx="465" cy="65" r="2.5" fill="#D4AF37" opacity="0.7" />
      <circle cx="420" cy="35" r="1.8" fill="#D4AF37" opacity="0.5" />
      <circle cx="55" cy="55" r="2" fill="#D4AF37" opacity="0.5" />
      <circle cx="480" cy="200" r="1.8" fill="#0B6B57" opacity="0.35" />
    </svg>
  );
}

function Stars({ rating }: { rating: number }) {
  const pct = Math.round((rating / 5) * 100);
  return (
    <span className="sf-stars" aria-hidden="true">
      ★★★★★
      <span className="sf-stars-fill" style={{ width: `${pct}%` }}>
        ★★★★★
      </span>
    </span>
  );
}

function ProductCard({
  p,
  isAdmin,
  wishlisted,
  onToggleWishlist,
}: {
  p: ProductRecord;
  isAdmin: boolean;
  wishlisted: boolean;
  onToggleWishlist: (id: string) => void;
}) {
  const badge = p.badge ? BADGE_INFO[p.badge] : null;
  return (
    <article className="sf-card">
      <Link href={`/product/${p.id}`} className="sf-card-link">
        <div className="sf-card-media">
          <img src={p.imageUrl} alt={p.name} loading="lazy" />
          <div className="sf-badge-stack">
            {badge && (
              <span className="sf-badge" style={{ background: badge.bg, color: badge.color }}>
                <badge.icon className="sf-badge-icon" />
                {badge.label}
              </span>
            )}
            {p.voucherNote && <span className="sf-voucher-badge">Voucher</span>}
          </div>
          <button
            type="button"
            className="sf-wishlist-btn"
            aria-pressed={wishlisted}
            aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleWishlist(p.id);
            }}
          >
            <HeartIcon filled={wishlisted} />
          </button>
        </div>
        <div className="sf-card-body">
          <div className="sf-card-name">{p.name}</div>
          <div className="sf-rating-row">
            <Stars rating={p.rating} />
            <span className="sf-rating-num">{p.rating.toFixed(1)} ({p.reviews})</span>
            {p.price != null && <span className="sf-card-price">₱{p.price.toLocaleString()}</span>}
          </div>
        </div>
      </Link>
      <div className="sf-card-actions">
        {p.shopeeLink && (
          <a
            className="sf-btn-store"
            href={p.shopeeLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => { if (!isAdmin) track("product_click", p.id); }}
          >
            Buy on Shopee
          </a>
        )}
      </div>
    </article>
  );
}

const PAGE_SIZE = 6;

function ProductGrid({
  items,
  isAdmin,
  wishlist,
  onToggleWishlist,
}: {
  items: ProductRecord[];
  isAdmin: boolean;
  wishlist: Set<string>;
  onToggleWishlist: (id: string) => void;
}) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const shown = items.slice(0, visible);
  const remaining = items.length - shown.length;

  return (
    <>
      <div className="sf-product-grid">
        {shown.map((p) => (
          <ProductCard key={p.id} p={p} isAdmin={isAdmin} wishlisted={wishlist.has(p.id)} onToggleWishlist={onToggleWishlist} />
        ))}
      </div>
      {remaining > 0 && (
        <button type="button" className="sf-load-more" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
          Load more ({remaining} more)
        </button>
      )}
    </>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    subscribeNewsletter(email).then((result) => {
      if ("error" in result) {
        setStatus("error");
        setMessage(result.error);
        return;
      }
      setStatus("done");
      setMessage("You're in! We'll keep you posted on new finds.");
      setEmail("");
    });
  }

  if (status === "done") {
    return <p className="sf-newsletter-done">{message}</p>;
  }

  return (
    <form className="sf-newsletter-form" onSubmit={handleSubmit}>
      <input
        type="email"
        required
        className="sf-newsletter-input"
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Email address"
      />
      <button type="submit" className="sf-newsletter-btn" disabled={status === "loading"}>
        {status === "loading" ? "..." : "Subscribe"}
      </button>
      {status === "error" && <p className="sf-newsletter-error">{message}</p>}
    </form>
  );
}

const WISHLIST_KEY = "ctf_wishlist";

export default function StorefrontClient({ products, isAdmin }: { products: ProductRecord[]; isAdmin: boolean }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [dealsOnly, setDealsOnly] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isAdmin) track("page_view");
  }, [isAdmin]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");
      setWishlist(new Set(saved));
    } catch {}
  }, []);

  function toggleWishlist(id: string) {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  }

  const searchQuery = search.trim().toLowerCase();
  const searchActive = searchQuery.length > 0;
  const searchResults = searchActive ? products.filter((p) => p.name.toLowerCase().includes(searchQuery)) : [];
  const dealsResults = dealsOnly ? products.filter((p) => p.voucherNote) : [];

  function goToProducts() {
    document.getElementById("sf-products")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function goToCategory(key: string) {
    setFilter(key);
    setSearch("");
    setDealsOnly(false);
    setCategoriesOpen(false);
    goToProducts();
  }

  function focusSearch() {
    const el = document.getElementById("sf-hero-search") as HTMLInputElement | null;
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus();
  }

  return (
    <>
      <style>{`
        .sf-wrap { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

        .sf-hero { position: relative; overflow: hidden; }

        .sf-nav-row { position: relative; z-index: 3; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 22px 0; }
        .sf-brand-block { display: flex; align-items: center; gap: 11px; }
        .sf-brand-text { display: flex; flex-direction: column; gap: 1px; }
        .sf-brand-name { font-weight: 800; font-size: 19px; letter-spacing: -0.01em; color: var(--sf-ink); line-height: 1.1; }
        @media (min-width: 600px) { .sf-brand-name { font-size: 22px; } }
        .sf-brand-name em { font-style: normal; color: var(--sf-accent); }
        .sf-brand-tagline { font-size: 8.5px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--sf-muted); }

        .sf-nav-links { display: none; align-items: center; gap: 30px; }
        @media (min-width: 920px) { .sf-nav-links { display: flex; } }
        .sf-nav-link { background: none; border: none; font-family: inherit; font-size: 13.5px; font-weight: 600; color: var(--sf-ink); cursor: pointer; display: inline-flex; align-items: center; gap: 4px; text-decoration: none; padding: 0; }
        .sf-nav-link:hover { color: var(--sf-primary); }
        .sf-nav-link svg { width: 13px; height: 13px; }
        .sf-nav-cat-wrap { position: relative; }
        .sf-nav-dropdown { position: absolute; top: calc(100% + 14px); left: 50%; transform: translateX(-50%); background: var(--sf-card); border: 1px solid var(--sf-border); border-radius: 14px; box-shadow: 0 16px 34px -12px rgba(31,41,55,.22); padding: 8px; min-width: 210px; z-index: 30; }
        .sf-nav-dropdown button { display: flex; align-items: center; gap: 9px; width: 100%; text-align: left; padding: 9px 11px; border-radius: 9px; border: none; background: none; font-size: 12.5px; font-weight: 600; color: var(--sf-ink); cursor: pointer; font-family: inherit; }
        .sf-nav-dropdown button:hover { background: var(--sf-bg); }
        .sf-nav-dropdown svg { width: 14px; height: 14px; color: var(--sf-primary); flex-shrink: 0; }

        .sf-nav-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        .sf-nav-search-btn { width: 38px; height: 38px; border-radius: 50%; background: var(--sf-card); border: 1px solid var(--sf-border); display: flex; align-items: center; justify-content: center; color: var(--sf-ink); cursor: pointer; flex-shrink: 0; }
        .sf-nav-search-btn svg { width: 16px; height: 16px; }
        .sf-admin-link { flex-shrink: 0; font-size: 12px; font-weight: 700; color: var(--sf-white); background: var(--sf-primary); border: none; border-radius: 999px; padding: 9px 20px; text-decoration: none; white-space: nowrap; }
        @media (prefers-reduced-motion: no-preference) { .sf-admin-link { transition: background .15s ease; } .sf-admin-link:hover { background: var(--sf-secondary); } }

        .sf-hero-grid { position: relative; z-index: 2; display: grid; grid-template-columns: 1fr; gap: 28px; align-items: center; padding: 14px 0 40px; }
        @media (min-width: 900px) { .sf-hero-grid { grid-template-columns: 1fr 1fr; gap: 40px; padding: 24px 0 56px; } }

        .sf-hero-headline { font-weight: 800; font-size: 32px; line-height: 1.16; margin: 0 0 14px; }
        @media (min-width: 640px) { .sf-hero-headline { font-size: 44px; } }
        .sf-hero-headline span { display: block; }
        .sf-hero-headline-l1 { color: var(--sf-primary); }
        .sf-hero-headline-l2 { color: var(--sf-accent); }
        .sf-hero-sub { font-size: 14.5px; line-height: 1.65; color: var(--sf-muted); max-width: 440px; margin: 0 0 28px; }

        .sf-search-row { position: relative; margin-bottom: 18px; }
        .sf-search-icon { position: absolute; left: 20px; top: 50%; transform: translateY(-50%); width: 17px; height: 17px; color: var(--sf-muted); pointer-events: none; }
        .sf-search-input { width: 100%; font-size: 14px; padding: 16px 46px 16px 48px; border: 1px solid var(--sf-border); border-radius: 999px; background: var(--sf-card); color: var(--sf-ink); font-family: inherit; box-shadow: 0 8px 24px -10px rgba(31,41,55,.16); }
        .sf-search-input::placeholder { color: var(--sf-muted); }
        .sf-search-input:focus { outline: none; border-color: var(--sf-primary); }
        .sf-search-sparkle { position: absolute; right: 20px; top: 50%; transform: translateY(-50%); width: 15px; height: 15px; color: var(--sf-accent); pointer-events: none; }
        .sf-search-clear { position: absolute; right: 44px; top: 50%; transform: translateY(-50%); width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; background: var(--sf-border); border: none; border-radius: 999px; color: var(--sf-ink); font-size: 10px; cursor: pointer; }

        .sf-tabs-row { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; }
        .sf-tabs-row::-webkit-scrollbar { display: none; }
        .sf-tab-btn { flex-shrink: 0; display: inline-flex; align-items: center; gap: 6px; border: 1px solid var(--sf-border); background: var(--sf-card); color: var(--sf-ink); font-weight: 600; font-size: 12.5px; padding: 9px 16px; border-radius: 999px; transition: background .15s ease, color .15s ease, border-color .15s ease; cursor: pointer; }
        .sf-tab-btn svg { width: 14px; height: 14px; }
        .sf-tab-btn[aria-pressed=true] { background: var(--sf-primary); border-color: var(--sf-primary); color: var(--sf-white); }

        .sf-hero-illustration-wrap { display: none; }
        @media (min-width: 900px) { .sf-hero-illustration-wrap { display: block; } }
        .sf-hero-illustration { width: 100%; height: auto; }

        .sf-curator { display: grid; grid-template-columns: 1fr; background: var(--sf-card); border: 1px solid var(--sf-border); border-radius: 22px; margin: 8px 0 28px; box-shadow: 0 10px 30px -14px rgba(31,41,55,.14); overflow: hidden; }
        @media (min-width: 720px) { .sf-curator { grid-template-columns: 1fr auto 220px; } }
        .sf-curator-main { display: flex; gap: 16px; padding: 24px; }
        .sf-curator-avatar { flex-shrink: 0; display: flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: 50%; background: var(--sf-primary); color: var(--sf-white); font-weight: 800; font-size: 14px; }
        .sf-curator-name { font-size: 14px; font-weight: 800; color: var(--sf-ink); margin-bottom: 6px; }
        .sf-curator-name .sf-sparkle-inline { width: 13px; height: 13px; color: var(--sf-accent); display: inline-block; vertical-align: -1px; margin-left: 4px; }
        .sf-curator-text { margin: 0; font-size: 13.5px; line-height: 1.6; color: var(--sf-ink); }
        .sf-curator-linkedin { display: inline-flex; align-items: center; gap: 6px; margin-top: 12px; font-size: 12px; font-weight: 700; color: var(--sf-primary); text-decoration: none; }
        .sf-curator-linkedin svg { width: 14px; height: 14px; flex-shrink: 0; }
        .sf-curator-linkedin:hover { color: #0A66C2; }
        .sf-curator-divider { display: none; }
        @media (min-width: 720px) { .sf-curator-divider { display: block; width: 1px; background: var(--sf-border); margin: 24px 0; } }
        .sf-curator-stat { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 6px; padding: 20px 24px 24px; border-top: 1px solid var(--sf-border); }
        @media (min-width: 720px) { .sf-curator-stat { border-top: none; padding: 24px; } }
        .sf-curator-stat-icon { width: 34px; height: 34px; border-radius: 50%; background: var(--sf-bg); display: flex; align-items: center; justify-content: center; color: var(--sf-accent); }
        .sf-curator-stat-icon svg { width: 17px; height: 17px; }
        .sf-curator-stat-num { font-size: 26px; font-weight: 800; color: var(--sf-primary); line-height: 1; }
        .sf-curator-stat-label { font-size: 12px; font-weight: 700; color: var(--sf-ink); }
        .sf-curator-stat-sub { font-size: 11px; color: var(--sf-muted); line-height: 1.4; }

        .sf-trust-wrap { background: var(--sf-card); border: 1px solid var(--sf-border); border-radius: 24px; padding: 30px 24px; margin: 0 0 32px; box-shadow: 0 10px 30px -16px rgba(31,41,55,.14); }
        .sf-trust-title { display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 14px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: var(--sf-primary); text-align: center; margin: 0 0 26px; }
        .sf-trust-title svg { width: 14px; height: 14px; color: var(--sf-accent); }
        .sf-trust-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 22px; }
        @media (min-width: 720px) { .sf-trust-grid { grid-template-columns: repeat(5, 1fr); gap: 16px; } }
        .sf-trust-item { text-align: center; }
        .sf-trust-icon { width: 46px; height: 46px; border-radius: 50%; background: var(--sf-bg); display: flex; align-items: center; justify-content: center; color: var(--sf-primary); margin: 0 auto 14px; }
        .sf-trust-icon svg { width: 21px; height: 21px; }
        .sf-trust-item-title { font-size: 12.5px; font-weight: 800; color: var(--sf-ink); margin-bottom: 6px; }
        .sf-trust-item-text { font-size: 11.5px; line-height: 1.5; color: var(--sf-muted); }

        .sf-grid-section { padding: 0 0 40px; }
        .sf-cat-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin: 30px 0 14px; }
        .sf-cat-header:first-child { margin-top: 0; }
        .sf-cat-label { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase; color: var(--sf-ink); }
        .sf-cat-label svg { width: 16px; height: 16px; color: var(--sf-primary); }
        .sf-cat-viewall { font-size: 12px; font-weight: 700; color: var(--sf-primary); background: none; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 3px; }
        .sf-cat-viewall:hover { text-decoration: underline; }

        .sf-product-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        @media (min-width: 560px) { .sf-product-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 800px) { .sf-product-grid { grid-template-columns: repeat(4, 1fr); } }
        @media (min-width: 1080px) { .sf-product-grid { grid-template-columns: repeat(5, 1fr); } }

        .sf-load-more { display: block; margin: 20px auto 0; font-size: 12.5px; font-weight: 700; color: var(--sf-primary); background: var(--sf-card); border: 1px solid var(--sf-primary); border-radius: 999px; padding: 10px 24px; cursor: pointer; }
        @media (prefers-reduced-motion: no-preference) { .sf-load-more { transition: background .15s ease, color .15s ease; } .sf-load-more:hover { background: var(--sf-primary); color: var(--sf-white); } }

        .sf-card { background: var(--sf-card); border-radius: 20px; overflow: hidden; display: flex; flex-direction: column; height: 100%; box-shadow: 0 12px 28px -16px rgba(31,41,55,.22); transition: box-shadow .2s ease, transform .2s ease; }
        @media (prefers-reduced-motion: no-preference) { .sf-card:hover { box-shadow: 0 20px 36px -14px rgba(31,41,55,.3); transform: translateY(-5px); } }
        .sf-card-link { display: flex; flex-direction: column; flex: 1; text-decoration: none; color: inherit; min-width: 0; }
        .sf-card-media { position: relative; aspect-ratio: 1; background: var(--sf-border); }
        .sf-card-media img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .sf-badge-stack { position: absolute; top: 10px; left: 10px; display: flex; flex-direction: column; gap: 5px; align-items: flex-start; }
        .sf-badge { display: inline-flex; align-items: center; gap: 4px; font-size: 9px; font-weight: 800; letter-spacing: 0.02em; border-radius: 999px; padding: 5px 10px 5px 8px; box-shadow: 0 3px 10px -3px rgba(0,0,0,.35); }
        .sf-badge-icon { width: 10px; height: 10px; flex-shrink: 0; }
        .sf-voucher-badge { font-size: 8.5px; font-weight: 800; letter-spacing: 0.02em; color: var(--sf-white); background: #C6603F; border-radius: 999px; padding: 4px 9px; }
        .sf-wishlist-btn { position: absolute; top: 10px; right: 10px; width: 30px; height: 30px; border-radius: 50%; background: rgba(255,255,255,.94); border: none; display: flex; align-items: center; justify-content: center; color: var(--sf-muted); cursor: pointer; box-shadow: 0 3px 10px -3px rgba(0,0,0,.3); }
        .sf-wishlist-btn svg { width: 15px; height: 15px; }
        .sf-wishlist-btn[aria-pressed=true] { color: #C6603F; }
        .sf-card-body { padding: 14px 15px 11px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
        .sf-card-name { font-size: 12.5px; font-weight: 700; line-height: 1.35; color: var(--sf-ink); min-height: 34px; }
        .sf-stars { position: relative; display: inline-block; font-size: 10px; line-height: 1; letter-spacing: 1px; color: var(--sf-border); }
        .sf-stars-fill { position: absolute; inset: 0; overflow: hidden; color: var(--sf-accent); white-space: nowrap; }
        .sf-rating-row { display: flex; align-items: center; gap: 5px; }
        .sf-rating-num { font-size: 10px; font-weight: 700; color: var(--sf-muted); font-variant-numeric: tabular-nums; }
        .sf-card-price { margin-left: auto; font-size: 12.5px; font-weight: 800; color: var(--sf-accent); font-variant-numeric: tabular-nums; }
        .sf-card-actions { display: flex; flex-direction: column; gap: 5px; padding: 0 15px 15px; }
        .sf-btn-store { display: flex; align-items: center; justify-content: center; font-size: 10.5px; font-weight: 700; padding: 10px 8px; border-radius: 999px; border: none; color: var(--sf-white); cursor: pointer; background: var(--sf-primary); }
        @media (prefers-reduced-motion: no-preference) { .sf-btn-store { transition: background .15s ease; } .sf-btn-store:hover { background: var(--sf-secondary); } }

        .sf-cta { background: var(--sf-primary); border-radius: 26px; margin: 0 0 44px; padding: 32px 26px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 18px; }
        @media (min-width: 640px) { .sf-cta { flex-direction: row; text-align: left; justify-content: space-between; padding: 36px 44px; } }
        .sf-cta-left { display: flex; align-items: center; gap: 14px; }
        .sf-cta-headline { font-size: 22px; font-weight: 700; color: var(--sf-white); margin: 0 0 4px; }
        .sf-cta-headline em { font-style: normal; color: var(--sf-accent); }
        .sf-cta-sub { font-size: 12.5px; color: rgba(255,255,255,.78); margin: 0; }
        .sf-cta-btn { flex-shrink: 0; display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 800; color: #1F2937; background: var(--sf-accent); border: none; border-radius: 999px; padding: 14px 28px; cursor: pointer; text-decoration: none; }
        .sf-cta-btn svg { width: 15px; height: 15px; }
        @media (prefers-reduced-motion: no-preference) { .sf-cta-btn { transition: transform .15s ease; } .sf-cta-btn:hover { transform: translateY(-2px); } }

        .sf-faq { margin: 6px 0 40px; }
        .sf-faq-title { font-size: 19px; font-weight: 800; color: var(--sf-ink); margin: 0 0 16px; }
        .sf-faq-item { background: var(--sf-card); border: 1px solid var(--sf-border); border-radius: 16px; padding: 4px 20px; margin-bottom: 10px; }
        .sf-faq-item summary { list-style: none; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 15px 0; font-size: 13.5px; font-weight: 700; color: var(--sf-ink); cursor: pointer; }
        .sf-faq-item summary::-webkit-details-marker { display: none; }
        .sf-faq-item summary::after { content: "+"; flex-shrink: 0; font-size: 19px; font-weight: 400; color: var(--sf-primary); transition: transform .15s ease; }
        .sf-faq-item[open] summary::after { transform: rotate(45deg); }
        .sf-faq-item p { margin: 0 0 16px; font-size: 13px; line-height: 1.6; color: var(--sf-muted); }

        .sf-footer { border-top: 1px solid var(--sf-border); padding: 40px 0 32px; }
        .sf-footer-top { display: flex; flex-direction: column; gap: 24px; padding-bottom: 28px; border-bottom: 1px solid var(--sf-border); margin-bottom: 20px; }
        @media (min-width: 720px) { .sf-footer-top { flex-direction: row; justify-content: space-between; align-items: flex-start; } }
        .sf-footer-brand { display: flex; align-items: center; gap: 10px; }
        .sf-footer-brand-name { font-weight: 800; font-size: 15px; color: var(--sf-ink); }
        .sf-footer-links { display: flex; flex-wrap: wrap; gap: 6px 18px; }
        .sf-footer-link { font-size: 12.5px; font-weight: 600; color: var(--sf-muted); text-decoration: none; }
        .sf-footer-link:hover { color: var(--sf-primary); }
        .sf-newsletter-label { font-size: 11px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: var(--sf-ink); margin-bottom: 8px; }
        .sf-newsletter-form { display: flex; gap: 8px; }
        .sf-newsletter-input { font-size: 12.5px; padding: 10px 14px; border: 1px solid var(--sf-border); border-radius: 999px; background: var(--sf-card); color: var(--sf-ink); min-width: 0; flex: 1; }
        .sf-newsletter-input:focus { outline: none; border-color: var(--sf-primary); }
        .sf-newsletter-btn { flex-shrink: 0; font-size: 12.5px; font-weight: 700; color: var(--sf-white); background: var(--sf-primary); border: none; border-radius: 999px; padding: 10px 18px; cursor: pointer; }
        .sf-newsletter-done, .sf-newsletter-error { font-size: 12px; margin: 0; }
        .sf-newsletter-done { color: var(--sf-primary); font-weight: 600; }
        .sf-newsletter-error { color: #B4483A; margin-top: 6px; }
        .sf-footer-social { display: flex; align-items: center; gap: 10px; margin-top: 10px; }
        .sf-footer-social a { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; background: var(--sf-bg); color: var(--sf-muted); }
        .sf-footer-social a:hover { color: #0A66C2; }
        .sf-footer-social svg { width: 15px; height: 15px; }
        .sf-footer-copy { font-size: 11.5px; color: var(--sf-muted); }

        .sf-empty { text-align: center; padding: 60px 20px; color: var(--sf-muted); font-size: 14px; }

        :root {
          --sf-bg: #FAFAF7;
          --sf-card: #FFFFFF;
          --sf-border: #E7E3D9;
          --sf-ink: #1F2937;
          --sf-muted: #6B7280;
          --sf-primary: #0B6B57;
          --sf-secondary: #0F766E;
          --sf-accent: #D4AF37;
          --sf-white: #FFFFFF;
        }
      `}</style>

      <div
        className={poppins.className}
        style={{
          background: "var(--sf-bg)",
          color: "var(--sf-ink)",
          minHeight: "100dvh",
        }}
      >
        <div className="sf-hero">
          <div className="sf-wrap sf-nav-row">
            <div className="sf-brand-block">
              <LogoMark size={36} />
              <div className="sf-brand-text">
                <span className={`sf-brand-name ${playfair.className}`}>
                  Check <em>This</em> Finds
                </span>
                <span className="sf-brand-tagline">Only Tested &amp; High-Quality Items</span>
              </div>
            </div>

            <nav className="sf-nav-links" aria-label="Main navigation">
              <a
                href="/"
                className="sf-nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  setFilter("all");
                  setSearch("");
                  setDealsOnly(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Home
              </a>
              <div className="sf-nav-cat-wrap">
                <button type="button" className="sf-nav-link" onClick={() => setCategoriesOpen((v) => !v)}>
                  Categories
                  <ChevronIcon />
                </button>
                {categoriesOpen && (
                  <div className="sf-nav-dropdown">
                    {Object.keys(CATEGORIES).map((key) => {
                      const Icon = CATEGORY_ICON[key];
                      return (
                        <button key={key} type="button" onClick={() => goToCategory(key)}>
                          <Icon />
                          {CATEGORIES[key]}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <button
                type="button"
                className="sf-nav-link"
                onClick={() => {
                  setDealsOnly(true);
                  setSearch("");
                  setCategoriesOpen(false);
                  goToProducts();
                }}
              >
                Deals
              </button>
              <Link href="/about" className="sf-nav-link">About</Link>
              <Link href="/contact" className="sf-nav-link">Contact</Link>
            </nav>

            <div className="sf-nav-right">
              <button type="button" className="sf-nav-search-btn" onClick={focusSearch} aria-label="Search">
                <SearchIcon />
              </button>
              {isAdmin && <a href="/admin" className="sf-admin-link">Manage</a>}
            </div>
          </div>

          <div className="sf-wrap sf-hero-grid">
            <div>
              <h1 className={`sf-hero-headline ${playfair.className}`}>
                <span className="sf-hero-headline-l1">We do the research</span>
                <span className="sf-hero-headline-l2">so you don&apos;t have to.</span>
              </h1>
              <p className="sf-hero-sub">Discover trusted, tested, high-quality products you&apos;ll actually love.</p>

              <div className="sf-search-row">
                <SearchIcon className="sf-search-icon" />
                <input
                  id="sf-hero-search"
                  type="text"
                  className="sf-search-input"
                  placeholder="Search products, brands, or categories..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setDealsOnly(false);
                  }}
                  aria-label="Search products"
                />
                {searchActive ? (
                  <button type="button" className="sf-search-clear" onClick={() => setSearch("")} aria-label="Clear search">
                    ✕
                  </button>
                ) : (
                  <SparkleIcon className="sf-search-sparkle" />
                )}
              </div>

              <div className="sf-tabs-row" role="tablist" aria-label="Product categories">
                {TABS.map((t) => {
                  const Icon = t.key === "all" ? SparkleIcon : CATEGORY_ICON[t.key];
                  return (
                    <button
                      key={t.key}
                      type="button"
                      className="sf-tab-btn"
                      aria-pressed={!dealsOnly && filter === t.key}
                      onClick={() => {
                        setFilter(t.key);
                        setSearch("");
                        setDealsOnly(false);
                      }}
                    >
                      <Icon />
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="sf-hero-illustration-wrap">
              <HeroIllustration />
            </div>
          </div>
        </div>

        <div className="sf-wrap">
          <section className="sf-curator">
            <div className="sf-curator-main">
              <span className="sf-curator-avatar" aria-hidden="true">KB</span>
              <div>
                <div className="sf-curator-name">
                  Curated by Kazandra B.
                  <SparkleIcon className="sf-sparkle-inline" />
                </div>
                <p className="sf-curator-text">
                  Handpicking tested, top-rated, and no-budol items so you can shop with confidence.
                </p>
                <a
                  href="https://www.linkedin.com/in/binibinizandra/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sf-curator-linkedin"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z" />
                  </svg>
                  Verified Curator
                </a>
              </div>
            </div>
            <div className="sf-curator-divider" aria-hidden="true" />
            <div className="sf-curator-stat">
              <span className="sf-curator-stat-icon">
                <StarIcon />
              </span>
              <span className={`sf-curator-stat-num ${playfair.className}`}>100%</span>
              <span className="sf-curator-stat-label">Tested &amp; Trusted</span>
              <span className="sf-curator-stat-sub">Quality finds you can rely on.</span>
            </div>
          </section>

          <section className="sf-trust-wrap">
            <div className="sf-trust-title">
              <SparkleIcon />
              Why Trust Check This Finds?
              <SparkleIcon />
            </div>
            <div className="sf-trust-grid">
              {TRUST_ITEMS.map((item) => (
                <div className="sf-trust-item" key={item.title}>
                  <span className="sf-trust-icon">
                    <item.icon />
                  </span>
                  <div className="sf-trust-item-title">{item.title}</div>
                  <div className="sf-trust-item-text">{item.text}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {products.length === 0 ? (
          <div className="sf-empty">No products yet. Check back soon!</div>
        ) : (
          <main className="sf-wrap" id="sf-products">
            <section className="sf-grid-section">
              {searchActive ? (
                searchResults.length > 0 ? (
                  <ProductGrid items={searchResults} isAdmin={isAdmin} wishlist={wishlist} onToggleWishlist={toggleWishlist} />
                ) : (
                  <div className="sf-empty">No products match &quot;{search}&quot;.</div>
                )
              ) : dealsOnly ? (
                dealsResults.length > 0 ? (
                  <>
                    <div className="sf-cat-header">
                      <span className="sf-cat-label">
                        <SparkleIcon />
                        Today&apos;s Deals
                      </span>
                      <button type="button" className="sf-cat-viewall" onClick={() => setDealsOnly(false)}>
                        Show all →
                      </button>
                    </div>
                    <ProductGrid items={dealsResults} isAdmin={isAdmin} wishlist={wishlist} onToggleWishlist={toggleWishlist} />
                  </>
                ) : (
                  <div className="sf-empty">No active deals right now — check back soon!</div>
                )
              ) : filter === "all" ? (
                Object.keys(CATEGORIES).map((key) => {
                  const items = products.filter((p) => p.category === key);
                  if (!items.length) return null;
                  const Icon = CATEGORY_ICON[key];
                  return (
                    <div key={key}>
                      <div className="sf-cat-header">
                        <span className="sf-cat-label">
                          <Icon />
                          {CATEGORIES[key]}
                        </span>
                        <button type="button" className="sf-cat-viewall" onClick={() => goToCategory(key)}>
                          View all →
                        </button>
                      </div>
                      <ProductGrid items={items} isAdmin={isAdmin} wishlist={wishlist} onToggleWishlist={toggleWishlist} />
                    </div>
                  );
                })
              ) : (
                <ProductGrid
                  items={products.filter((p) => p.category === filter)}
                  isAdmin={isAdmin}
                  wishlist={wishlist}
                  onToggleWishlist={toggleWishlist}
                />
              )}
            </section>
          </main>
        )}

        <div className="sf-wrap">
          <section className="sf-cta">
            <div className="sf-cta-left">
              <LogoMark size={40} />
              <div>
                <div className={`sf-cta-headline ${playfair.className}`}>
                  Find it. Love it. <em>Check it.</em>
                </div>
                <p className="sf-cta-sub">Quality finds you can trust, every time. ✨</p>
              </div>
            </div>
            <a href="#sf-products" className="sf-cta-btn">
              <BagIcon />
              Explore Today&apos;s Best Finds
            </a>
          </section>

          <section className="sf-faq">
            <h2 className={`sf-faq-title ${playfair.className}`}>Frequently Asked Questions</h2>

            <details className="sf-faq-item">
              <summary>How does ordering work?</summary>
              <p>Every &quot;Buy on Shopee&quot; button takes you straight to the real, verified listing on Shopee. We never process payments or hold your money — you check out directly with Shopee, the same as always.</p>
            </details>

            <details className="sf-faq-item">
              <summary>How are products chosen?</summary>
              <p>Every item featured here is checked against seller ratings, verified reviews, and trusted seller badges before it gets listed — no random picks, no guesswork.</p>
            </details>

            <details className="sf-faq-item">
              <summary>Do I pay extra for shopping through this site?</summary>
              <p>No. You pay the exact same official Shopee price — zero extra cost to you. We may earn a small commission from Shopee, but it never changes what you pay.</p>
            </details>
          </section>
        </div>

        <footer className="sf-footer">
          <div className="sf-wrap">
            <div className="sf-footer-top">
              <div>
                <div className="sf-footer-brand">
                  <LogoMark size={26} />
                  <span className={`sf-footer-brand-name ${playfair.className}`}>Check This Finds</span>
                </div>
                <div className="sf-footer-links" style={{ marginTop: 14 }}>
                  <Link href="/about" className="sf-footer-link">About</Link>
                  <Link href="/privacy" className="sf-footer-link">Privacy</Link>
                  <Link href="/affiliate-disclosure" className="sf-footer-link">Affiliate Disclosure</Link>
                  <Link href="/contact" className="sf-footer-link">Contact</Link>
                </div>
                <div className="sf-footer-social">
                  <a href="https://www.linkedin.com/in/binibinizandra/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z" />
                    </svg>
                  </a>
                </div>
              </div>

              <div>
                <div className="sf-newsletter-label">Stay in the loop</div>
                <NewsletterForm />
              </div>
            </div>

            <div className="sf-footer-copy">© {new Date().getFullYear()} Check This Finds. This site contains affiliate links — we may earn a commission at no extra cost to you.</div>
          </div>
        </footer>
      </div>
    </>
  );
}
