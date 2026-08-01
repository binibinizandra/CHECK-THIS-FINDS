"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
    <Image
      src="/images/logo.png"
      alt="Check This Finds"
      width={size}
      height={size}
      style={{ width: size, height: size, objectFit: "contain", flexShrink: 0 }}
    />
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

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 5.5h14M3 10h14M3 14.5h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
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

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <rect x="2" y="2" width="7" height="7" rx="1.5" />
      <rect x="11" y="2" width="7" height="7" rx="1.5" />
      <rect x="2" y="11" width="7" height="7" rx="1.5" />
      <rect x="11" y="11" width="7" height="7" rx="1.5" />
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
          <Image
            src={p.imageUrl}
            alt={p.name}
            fill
            sizes="(min-width: 1080px) 20vw, (min-width: 800px) 25vw, (min-width: 560px) 33vw, 50vw"
          />
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
          {p.price != null && (
            <div className="sf-rating-row">
              <span className="sf-card-price">₱{p.price.toLocaleString()}</span>
            </div>
          )}
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
            <ArrowRightIcon />
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
        id="sf-newsletter-input"
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setCategoriesOpen(false);
        setMobileMenuOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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

  function focusNewsletter() {
    const el = document.getElementById("sf-newsletter-input") as HTMLInputElement | null;
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus();
  }

  return (
    <>
      <style>{`
        .sf-wrap { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

        .sf-hero { position: relative; overflow: hidden; }
        .sf-hero-bg { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; }
        .sf-hero-bg-wide { display: none; }
        @media (min-width: 1440px) { .sf-hero-bg-wide { display: block; } }

        .sfw-glow { opacity: 0.85; }
        .sfw-emerald path, .sfw-gold path { stroke-dasharray: 64 26; stroke-dashoffset: 0; }
        @media (prefers-reduced-motion: no-preference) {
          .sfw-emerald path { animation: sfwFlow 36s linear infinite; }
          .sfw-gold path { animation: sfwFlow 44s linear infinite; }
          .sfw-glow-a { animation: sfwGlowPulse 20s ease-in-out infinite; }
          .sfw-glow-b { animation: sfwGlowPulse 24s ease-in-out infinite; animation-delay: -11s; }
          .sfw-particle { animation: sfwTwinkle 7s ease-in-out infinite; }
          .sfw-particle:nth-child(2) { animation-delay: -1.1s; }
          .sfw-particle:nth-child(3) { animation-delay: -2.3s; }
          .sfw-particle:nth-child(4) { animation-delay: -3.4s; }
          .sfw-particle:nth-child(5) { animation-delay: -4.6s; }
          .sfw-particle:nth-child(6) { animation-delay: -0.6s; }
          .sfw-particle:nth-child(7) { animation-delay: -5.2s; }
          .sfw-particle:nth-child(8) { animation-delay: -2.8s; }
        }
        @keyframes sfwFlow { to { stroke-dashoffset: -900; } }
        @keyframes sfwGlowPulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
        @keyframes sfwTwinkle { 0%, 100% { opacity: 0.25; } 50% { opacity: 0.9; } }

        .sf-header { position: sticky; top: 0; z-index: 20; background: rgba(250,250,247,.85); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border-bottom: 1px solid var(--sf-border); }
        .sf-nav-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 16px 0; }
        .sf-brand-block { display: flex; align-items: center; gap: 11px; }
        .sf-brand-text { display: flex; flex-direction: column; gap: 1px; }
        .sf-brand-name { font-weight: 800; font-size: 19px; letter-spacing: -0.01em; color: var(--sf-ink); line-height: 1.1; }
        @media (min-width: 600px) { .sf-brand-name { font-size: 22px; } }
        .sf-brand-name em { font-style: normal; color: var(--sf-accent); }
        .sf-brand-tagline { font-size: 8.5px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--sf-muted); }

        .sf-nav-links { display: none; align-items: center; gap: 30px; margin-left: 28px; }
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
        .sf-nav-search-btn { width: 44px; height: 44px; border-radius: 50%; background: var(--sf-card); border: 1px solid var(--sf-border); display: flex; align-items: center; justify-content: center; color: var(--sf-ink); cursor: pointer; flex-shrink: 0; }
        .sf-nav-search-btn svg { width: 16px; height: 16px; }
        .sf-admin-link { flex-shrink: 0; display: inline-flex; align-items: center; min-height: 44px; font-size: 12px; font-weight: 700; color: var(--sf-white); background: var(--sf-primary); border: none; border-radius: 999px; padding: 9px 20px; text-decoration: none; white-space: nowrap; }
        @media (prefers-reduced-motion: no-preference) { .sf-admin-link { transition: background .2s ease; } .sf-admin-link:hover { background: var(--sf-secondary); } }

        .sf-mobile-menu-btn { width: 44px; height: 44px; border-radius: 50%; background: var(--sf-card); border: 1px solid var(--sf-border); display: flex; align-items: center; justify-content: center; color: var(--sf-ink); cursor: pointer; flex-shrink: 0; }
        .sf-mobile-menu-btn svg { width: 17px; height: 17px; }
        @media (min-width: 920px) { .sf-mobile-menu-btn { display: none; } }
        .sf-mobile-menu { display: none; }
        .sf-mobile-menu.open { display: block; border-top: 1px solid var(--sf-border); background: var(--sf-card); }
        @media (min-width: 920px) { .sf-mobile-menu.open { display: none; } }
        .sf-mobile-menu-list { display: flex; flex-direction: column; padding: 8px 0; }
        .sf-mobile-menu-list a, .sf-mobile-menu-list button { display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; padding: 13px 20px; border: none; background: none; font-family: inherit; font-size: 14.5px; font-weight: 600; color: var(--sf-ink); text-decoration: none; cursor: pointer; }
        .sf-mobile-menu-list a:hover, .sf-mobile-menu-list button:hover { background: var(--sf-bg); }
        .sf-mobile-menu-list svg { width: 16px; height: 16px; color: var(--sf-primary); flex-shrink: 0; }
        .sf-mobile-menu-sub { padding-left: 20px; }
        .sf-mobile-menu-sub a, .sf-mobile-menu-sub button { padding-left: 40px; font-size: 13.5px; font-weight: 500; }

        .sf-hero-grid { position: relative; z-index: 2; padding: 28px 0 48px; }
        @media (min-width: 900px) { .sf-hero-grid { padding: 48px 0 68px; } }
        @media (min-width: 1440px) { .sf-hero-grid { padding: 72px 0 88px; } }
        .sf-hero-grid-inner { display: flex; justify-content: center; }
        .sf-hero-copy { max-width: 880px; text-align: center; }
        @media (min-width: 1440px) { .sf-hero-copy { max-width: 980px; } }

        .sf-hero-eyebrow { display: inline-flex; align-items: center; gap: 7px; font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--sf-primary); margin: 0 0 16px; }
        .sf-hero-eyebrow::before, .sf-hero-eyebrow::after { content: ""; display: inline-block; width: 16px; height: 1px; background: var(--sf-accent); }

        .sf-hero-headline { font-weight: 800; font-size: 32px; line-height: 1.16; letter-spacing: -0.01em; margin: 0 0 14px; }
        @media (min-width: 640px) { .sf-hero-headline { font-size: 44px; } }
        @media (min-width: 1440px) { .sf-hero-headline { font-size: 54px; letter-spacing: -0.02em; } }
        .sf-hero-headline span { display: block; }
        .sf-hero-headline-l1 { color: var(--sf-primary); }
        .sf-hero-headline-l2 { color: var(--sf-accent); }
        .sf-hero-sub { font-size: 14.5px; line-height: 1.65; color: var(--sf-muted); max-width: 440px; margin: 0 auto 28px; }
        .sf-hero-sub-short { display: block; }
        .sf-hero-sub-long { display: none; }
        @media (min-width: 480px) { .sf-hero-sub-short { display: none; } .sf-hero-sub-long { display: block; } }

        .sf-search-row { position: relative; margin: 0 auto 18px; max-width: 480px; }
        .sf-search-icon { position: absolute; left: 22px; top: 50%; transform: translateY(-50%); width: 17px; height: 17px; color: var(--sf-muted); pointer-events: none; }
        .sf-search-input { width: 100%; font-size: 14.5px; font-weight: 500; padding: 18px 48px 18px 50px; border: 1.5px solid var(--sf-border); border-radius: 999px; background: var(--sf-card); color: var(--sf-ink); font-family: inherit; box-shadow: 0 12px 34px -14px rgba(31,41,55,.13); transition: border-color .2s ease, box-shadow .2s ease, transform .2s ease; }
        .sf-search-input::placeholder { color: var(--sf-muted); font-weight: 400; }
        .sf-search-input:focus { outline: none; border-color: var(--sf-primary); box-shadow: 0 12px 34px -14px rgba(31,41,55,.13), 0 0 0 4px rgba(11,107,87,.12); }
        .sf-search-input:focus-visible { outline: 2px solid var(--sf-primary); outline-offset: 3px; }
        @media (prefers-reduced-motion: no-preference) { .sf-search-input:focus { transform: translateY(-1px); } }
        .sf-search-sparkle { position: absolute; right: 22px; top: 50%; transform: translateY(-50%); width: 15px; height: 15px; color: var(--sf-accent); pointer-events: none; }
        .sf-search-clear { position: absolute; right: 46px; top: 50%; transform: translateY(-50%); width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; background: var(--sf-border); border: none; border-radius: 999px; color: var(--sf-ink); font-size: 10px; cursor: pointer; }

        .sf-tabs-row { display: flex; justify-content: flex-start; flex-wrap: nowrap; gap: 8px; overflow-x: auto; -webkit-overflow-scrolling: touch; padding: 2px 4px 6px; scrollbar-width: none; mask-image: linear-gradient(to right, black calc(100% - 24px), transparent); -webkit-mask-image: linear-gradient(to right, black calc(100% - 24px), transparent); }
        @media (min-width: 900px) { .sf-tabs-row { justify-content: center; mask-image: none; -webkit-mask-image: none; } }
        .sf-tabs-row::-webkit-scrollbar { display: none; }
        .sf-tab-btn { flex-shrink: 0; display: inline-flex; align-items: center; gap: 6px; min-height: 44px; border: 1px solid var(--sf-border); background: var(--sf-card); color: var(--sf-ink); font-weight: 600; font-size: 12.5px; padding: 10px 20px; border-radius: 999px; transition: background .2s ease, color .2s ease, border-color .2s ease, transform .2s ease, box-shadow .2s ease; cursor: pointer; }
        .sf-tab-btn svg { width: 14px; height: 14px; }
        @media (prefers-reduced-motion: no-preference) {
          .sf-tab-btn:hover { background: var(--sf-bg); border-color: var(--sf-primary); transform: translateY(-1.5px); }
          .sf-tab-btn[aria-pressed=true]:hover { background: var(--sf-secondary); }
        }
        .sf-tab-btn[aria-pressed=true] { background: var(--sf-primary); border-color: var(--sf-primary); color: var(--sf-white); box-shadow: 0 8px 18px -8px rgba(11,107,87,.5); }

        .sf-trust-wrap { background: var(--sf-card); border: 1px solid var(--sf-border); border-radius: 18px; padding: 20px 0 20px 16px; margin: 16px 0 40px; box-shadow: 0 20px 48px -28px rgba(31,41,55,.16); }
        @media (min-width: 640px) { .sf-trust-wrap { border-radius: 24px; padding: 38px 30px; margin: 16px 0 56px; } }
        .sf-trust-title { display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 11px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; color: var(--sf-primary); text-align: center; margin: 0 16px 16px 0; }
        @media (min-width: 640px) { .sf-trust-title { gap: 10px; font-size: 14px; letter-spacing: 0.06em; margin: 0 0 32px; } }
        .sf-trust-title svg { width: 11px; height: 11px; color: var(--sf-accent); flex-shrink: 0; }
        @media (min-width: 640px) { .sf-trust-title svg { width: 14px; height: 14px; } }

        .sf-trust-grid { display: flex; gap: 12px; overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; padding: 2px 16px 6px 0; scrollbar-width: none; }
        .sf-trust-grid::-webkit-scrollbar { display: none; }
        @media (min-width: 640px) { .sf-trust-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 26px; overflow-x: visible; scroll-snap-type: none; padding: 0; } }
        @media (min-width: 720px) { .sf-trust-grid { grid-template-columns: repeat(5, 1fr); gap: 18px; } }
        .sf-trust-item { position: relative; flex: 0 0 128px; scroll-snap-align: start; text-align: center; }
        @media (min-width: 640px) { .sf-trust-item { flex: none; } }
        @media (min-width: 720px) { .sf-trust-item:not(:last-child)::after { content: ""; position: absolute; top: 4px; bottom: 4px; right: -9px; width: 1px; background: var(--sf-border); } }
        .sf-trust-icon { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(155deg, #fff, var(--sf-bg)); box-shadow: inset 0 0 0 1px var(--sf-border); display: flex; align-items: center; justify-content: center; color: var(--sf-primary); margin: 0 auto 8px; }
        @media (min-width: 640px) { .sf-trust-icon { width: 48px; height: 48px; margin: 0 auto 16px; } }
        .sf-trust-icon svg { width: 15px; height: 15px; }
        @media (min-width: 640px) { .sf-trust-icon svg { width: 21px; height: 21px; } }
        .sf-trust-item-title { font-size: 11px; font-weight: 800; color: var(--sf-ink); margin-bottom: 3px; }
        @media (min-width: 640px) { .sf-trust-item-title { font-size: 12.5px; margin-bottom: 6px; } }
        .sf-trust-item-text { font-size: 9.5px; line-height: 1.4; color: var(--sf-muted); }
        @media (min-width: 640px) { .sf-trust-item-text { font-size: 11.5px; line-height: 1.5; } }

        .sf-trust-dots { display: flex; justify-content: center; gap: 6px; margin-top: 4px; }
        @media (min-width: 640px) { .sf-trust-dots { display: none; } }
        .sf-trust-dots span { width: 5px; height: 5px; border-radius: 50%; background: var(--sf-border); }
        .sf-trust-dots span:first-child { width: 14px; border-radius: 3px; background: var(--sf-primary); }

        .sf-grid-section { padding: 0 0 56px; }
        .sf-cat-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin: 40px 0 18px; }
        .sf-cat-header:first-child { margin-top: 0; }
        .sf-cat-label { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase; color: var(--sf-ink); }
        .sf-cat-label svg { width: 16px; height: 16px; color: var(--sf-primary); }
        .sf-cat-viewall { font-size: 12px; font-weight: 700; color: var(--sf-primary); background: none; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 3px; }
        .sf-cat-viewall:hover { text-decoration: underline; }

        .sf-product-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
        @media (min-width: 640px) { .sf-product-grid { gap: 20px; } }
        @media (min-width: 560px) { .sf-product-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 800px) { .sf-product-grid { grid-template-columns: repeat(4, 1fr); } }
        @media (min-width: 1080px) { .sf-product-grid { grid-template-columns: repeat(5, 1fr); } }

        .sf-load-more { display: block; margin: 28px auto 0; font-size: 12.5px; font-weight: 700; color: var(--sf-primary); background: var(--sf-card); border: 1px solid var(--sf-primary); border-radius: 999px; padding: 10px 24px; cursor: pointer; }
        @media (prefers-reduced-motion: no-preference) { .sf-load-more { transition: background .25s ease, color .25s ease; } .sf-load-more:hover { background: var(--sf-primary); color: var(--sf-white); } }

        .sf-card { background: var(--sf-card); border-radius: 14px; overflow: hidden; display: flex; flex-direction: column; height: 100%; box-shadow: 0 4px 16px -10px rgba(31,41,55,.18); transition: box-shadow .3s ease, transform .3s ease; }
        @media (min-width: 640px) { .sf-card { border-radius: 20px; box-shadow: 0 8px 24px -14px rgba(31,41,55,.18); } }
        @media (prefers-reduced-motion: no-preference) { .sf-card:hover { box-shadow: 0 28px 48px -20px rgba(31,41,55,.28); transform: translateY(-6px); } }
        .sf-card-link { display: flex; flex-direction: column; flex: 1; text-decoration: none; color: inherit; min-width: 0; }
        .sf-card-media { position: relative; aspect-ratio: 1; background: var(--sf-border); overflow: hidden; }
        .sf-card-media img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .3s ease; }
        @media (prefers-reduced-motion: no-preference) { .sf-card:hover .sf-card-media img { transform: scale(1.06); } }
        .sf-badge-stack { position: absolute; top: 6px; left: 6px; display: flex; flex-direction: column; gap: 4px; align-items: flex-start; }
        @media (min-width: 640px) { .sf-badge-stack { top: 10px; left: 10px; gap: 5px; } }
        .sf-badge { display: inline-flex; align-items: center; gap: 3px; font-size: 7.5px; font-weight: 800; letter-spacing: 0.02em; border-radius: 999px; padding: 3px 7px 3px 5px; box-shadow: 0 3px 10px -3px rgba(0,0,0,.35); }
        @media (min-width: 640px) { .sf-badge { gap: 4px; font-size: 9px; padding: 5px 10px 5px 8px; } }
        .sf-badge-icon { width: 8px; height: 8px; flex-shrink: 0; }
        @media (min-width: 640px) { .sf-badge-icon { width: 10px; height: 10px; } }
        .sf-voucher-badge { font-size: 7px; font-weight: 800; letter-spacing: 0.02em; color: var(--sf-white); background: #C6603F; border-radius: 999px; padding: 3px 6px; }
        @media (min-width: 640px) { .sf-voucher-badge { font-size: 8.5px; padding: 4px 9px; } }
        .sf-wishlist-btn { position: absolute; top: 6px; right: 6px; width: 22px; height: 22px; border-radius: 50%; background: rgba(255,255,255,.94); border: none; display: flex; align-items: center; justify-content: center; color: var(--sf-muted); cursor: pointer; box-shadow: 0 3px 10px -3px rgba(0,0,0,.3); }
        .sf-wishlist-btn::before { content: ""; position: absolute; inset: -11px; }
        @media (min-width: 640px) { .sf-wishlist-btn { top: 10px; right: 10px; width: 30px; height: 30px; } .sf-wishlist-btn::before { inset: -7px; } }
        .sf-wishlist-btn svg { width: 11px; height: 11px; }
        @media (min-width: 640px) { .sf-wishlist-btn svg { width: 15px; height: 15px; } }
        .sf-wishlist-btn[aria-pressed=true] { color: #C6603F; }
        @media (prefers-reduced-motion: no-preference) {
          .sf-wishlist-btn { transition: transform .2s ease; }
          .sf-wishlist-btn[aria-pressed=true] { animation: sfPop .3s ease; }
        }
        @keyframes sfPop { 0% { transform: scale(1); } 40% { transform: scale(1.25); } 100% { transform: scale(1); } }
        .sf-card-body { padding: 8px 9px 6px; display: flex; flex-direction: column; gap: 4px; flex: 1; }
        @media (min-width: 640px) { .sf-card-body { padding: 14px 15px 11px; gap: 8px; } }
        .sf-card-name { font-size: 10.5px; font-weight: 700; line-height: 1.3; color: var(--sf-ink); min-height: 27px; }
        @media (min-width: 640px) { .sf-card-name { font-size: 12.5px; line-height: 1.35; min-height: 34px; } }
        .sf-rating-row { display: flex; align-items: center; gap: 5px; }
        .sf-card-price { font-size: 12px; font-weight: 800; letter-spacing: -0.01em; color: var(--sf-accent); font-variant-numeric: tabular-nums; }
        @media (min-width: 640px) { .sf-card-price { font-size: 14.5px; } }
        .sf-card-actions { display: flex; flex-direction: column; gap: 4px; padding: 0 9px 9px; }
        @media (min-width: 640px) { .sf-card-actions { gap: 5px; padding: 0 15px 15px; } }
        .sf-btn-store { display: flex; align-items: center; justify-content: center; gap: 4px; font-size: 9px; font-weight: 700; min-height: 44px; padding: 7px 6px; border-radius: 999px; border: none; color: var(--sf-white); cursor: pointer; background: var(--sf-primary); }
        @media (min-width: 640px) { .sf-btn-store { font-size: 10.5px; min-height: 0; padding: 10px 8px; } }
        .sf-btn-store svg { width: 9px; height: 9px; flex-shrink: 0; }
        @media (prefers-reduced-motion: no-preference) {
          .sf-btn-store { transition: background .2s ease, transform .2s ease; }
          .sf-btn-store:hover { background: var(--sf-secondary); transform: translateY(-1px); }
        }

        .sf-cta { background: var(--sf-primary); border-radius: 16px; margin: 0 0 40px; padding: 18px 16px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 12px; box-shadow: 0 16px 32px -20px rgba(11,107,87,.4); }
        @media (min-width: 640px) { .sf-cta { flex-direction: row; text-align: left; justify-content: space-between; padding: 36px 44px; border-radius: 26px; margin: 0 0 56px; gap: 18px; box-shadow: 0 24px 48px -24px rgba(11,107,87,.4); } }
        .sf-cta-left { display: flex; align-items: center; gap: 10px; }
        @media (min-width: 640px) { .sf-cta-left { gap: 14px; } }
        .sf-cta-left img { width: 28px !important; height: 28px !important; }
        @media (min-width: 640px) { .sf-cta-left img { width: 40px !important; height: 40px !important; } }
        .sf-cta-headline { font-size: 16px; font-weight: 700; color: var(--sf-white); margin: 0 0 3px; }
        @media (min-width: 640px) { .sf-cta-headline { font-size: 22px; margin: 0 0 4px; } }
        .sf-cta-headline em { font-style: normal; color: var(--sf-accent); }
        .sf-cta-sub { font-size: 10.5px; color: rgba(255,255,255,.78); margin: 0; }
        @media (min-width: 640px) { .sf-cta-sub { font-size: 12.5px; } }
        .sf-cta-btn { flex-shrink: 0; display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 800; color: #1F2937; background: var(--sf-accent); border: none; border-radius: 999px; padding: 10px 18px; cursor: pointer; text-decoration: none; }
        @media (min-width: 640px) { .sf-cta-btn { gap: 8px; font-size: 13px; padding: 14px 28px; } }
        .sf-cta-btn svg { width: 12px; height: 12px; }
        @media (min-width: 640px) { .sf-cta-btn svg { width: 15px; height: 15px; } }
        @media (prefers-reduced-motion: no-preference) { .sf-cta-btn { transition: transform .2s ease; } .sf-cta-btn:hover { transform: translateY(-2px); } }

        .sf-faq { margin: 6px 0 40px; }
        .sf-faq-title { font-size: 19px; font-weight: 800; color: var(--sf-ink); margin: 0 0 16px; }
        .sf-faq-item { background: var(--sf-card); border: 1px solid var(--sf-border); border-radius: 16px; padding: 4px 20px; margin-bottom: 10px; }
        .sf-faq-item summary { list-style: none; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 15px 0; font-size: 13.5px; font-weight: 700; color: var(--sf-ink); cursor: pointer; }
        .sf-faq-item summary::-webkit-details-marker { display: none; }
        .sf-faq-item summary::after { content: "+"; flex-shrink: 0; font-size: 19px; font-weight: 400; color: var(--sf-primary); transition: transform .2s ease; }
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

        a:focus-visible, button:focus-visible, input:focus-visible, [tabindex]:focus-visible { outline: 2px solid var(--sf-primary); outline-offset: 2px; border-radius: 4px; }
        .sf-cta-btn:focus-visible { outline-color: var(--sf-white); }

        :root {
          --sf-bg: #FAFAF7;
          --sf-card: #FFFFFF;
          --sf-border: #E7E3D9;
          --sf-ink: #1F2937;
          --sf-muted: #5B6472;
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
        <header className="sf-header">
          <div className="sf-wrap sf-nav-row">
            <div className="sf-brand-block">
              <LogoMark size={42} />
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
              <Link href="/wishlist" className="sf-nav-link">Wishlist</Link>
              <Link href="/about" className="sf-nav-link">About</Link>
              <Link href="/contact" className="sf-nav-link">Contact</Link>
            </nav>

            <div className="sf-nav-right">
              <button type="button" className="sf-nav-search-btn" onClick={focusSearch} aria-label="Search">
                <SearchIcon />
              </button>
              {isAdmin && <a href="/admin" className="sf-admin-link">Manage</a>}
              <button
                type="button"
                className="sf-mobile-menu-btn"
                onClick={() => setMobileMenuOpen((v) => !v)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>

          <div className={`sf-mobile-menu${mobileMenuOpen ? " open" : ""}`}>
            <nav className="sf-mobile-menu-list" aria-label="Mobile navigation">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  setFilter("all");
                  setSearch("");
                  setDealsOnly(false);
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <HomeIcon />
                Home
              </a>
              <div className="sf-mobile-menu-sub">
                {Object.keys(CATEGORIES).map((key) => {
                  const Icon = CATEGORY_ICON[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        goToCategory(key);
                        setMobileMenuOpen(false);
                      }}
                    >
                      <Icon />
                      {CATEGORIES[key]}
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => {
                  setDealsOnly(true);
                  setSearch("");
                  setMobileMenuOpen(false);
                  goToProducts();
                }}
              >
                <SparkleIcon />
                Deals
              </button>
              <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)}>
                <HeartIcon />
                Wishlist
              </Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)}>About</Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            </nav>
          </div>
        </header>

        <div className="sf-hero">
          <svg className="sf-hero-bg" viewBox="0 0 1400 620" preserveAspectRatio="xMidYMin slice" fill="none" aria-hidden="true">
            <defs>
              <radialGradient id="sfwGlowEmerald" cx="26%" cy="18%" r="55%">
                <stop offset="0%" stopColor="#0B6B57" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#0B6B57" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="sfwGlowGold" cx="82%" cy="72%" r="50%">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.10" />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
              </radialGradient>
            </defs>

            <rect className="sfw-glow sfw-glow-a" x="0" y="0" width="1400" height="620" fill="url(#sfwGlowEmerald)" />
            <rect className="sfw-glow sfw-glow-b" x="0" y="0" width="1400" height="620" fill="url(#sfwGlowGold)" />

            <g className="sfw-emerald">
              <path d="M-50 260 C 250 150, 450 350, 700 220 S 1150 80, 1450 180" stroke="#0B6B57" strokeWidth="1.6" opacity="0.22" />
              <path d="M-50 200 C 280 320, 480 100, 760 260 S 1180 380, 1450 260" stroke="#0F766E" strokeWidth="1.3" opacity="0.16" />
              <path d="M-50 120 C 220 60, 420 200, 680 100 S 1080 20, 1450 100" stroke="#A8B79A" strokeWidth="1" opacity="0.16" />
              <path d="M-50 400 C 260 480, 500 320, 780 420 S 1160 520, 1450 400" stroke="#0B6B57" strokeWidth="1" opacity="0.12" />
              <path d="M-50 500 C 240 440, 460 560, 740 480 S 1140 400, 1450 500" stroke="#0F766E" strokeWidth="1" opacity="0.1" />
              <g className="sf-hero-bg-wide">
                <path d="M950 -30 C 1100 60, 1000 180, 1180 240 S 1250 400, 1400 460" stroke="#0B6B57" strokeWidth="1.2" opacity="0.14" />
                <path d="M900 300 C 1050 260, 1150 340, 1300 300 S 1400 260, 1450 280" stroke="#A8B79A" strokeWidth="0.9" opacity="0.12" />
              </g>
            </g>

            <g className="sfw-gold">
              <path d="M-50 340 C 300 220, 520 420, 820 300 S 1200 180, 1450 320" stroke="#D4AF37" strokeWidth="1.1" opacity="0.28" />
              <path d="M-50 40 C 200 -20, 380 90, 620 20 S 980 -30, 1300 40" stroke="#D4AF37" strokeWidth="0.9" opacity="0.18" />
              <g className="sf-hero-bg-wide">
                <path d="M980 620 C 1120 520, 1050 400, 1220 340 S 1300 160, 1420 90" stroke="#D4AF37" strokeWidth="1" opacity="0.16" />
              </g>
            </g>

            <g className="sfw-particles">
              <circle className="sfw-particle" cx="180" cy="90" r="1.4" fill="#D4AF37" opacity="0.5" />
              <circle className="sfw-particle" cx="520" cy="55" r="1.7" fill="#D4AF37" opacity="0.45" />
              <circle className="sfw-particle" cx="860" cy="130" r="1.2" fill="#D4AF37" opacity="0.5" />
              <circle className="sfw-particle" cx="1120" cy="75" r="1.9" fill="#D4AF37" opacity="0.4" />
              <circle className="sfw-particle" cx="1300" cy="310" r="1.4" fill="#D4AF37" opacity="0.5" />
              <circle className="sfw-particle" cx="980" cy="470" r="1.6" fill="#D4AF37" opacity="0.4" />
              <circle className="sfw-particle" cx="240" cy="410" r="1.2" fill="#D4AF37" opacity="0.45" />
              <circle className="sfw-particle" cx="650" cy="530" r="1.5" fill="#D4AF37" opacity="0.4" />
            </g>
          </svg>

          <div className="sf-wrap sf-hero-grid">
            <div className="sf-hero-grid-inner">
              <div className="sf-hero-copy">
                <span className="sf-hero-eyebrow">Curated Online Shopping</span>
                <h1 className={`sf-hero-headline ${playfair.className}`}>
                  <span className="sf-hero-headline-l1">We do the research</span>
                  <span className="sf-hero-headline-l2">so you don&apos;t have to.</span>
                </h1>
                <p className="sf-hero-sub">
                  <span className="sf-hero-sub-short">Trusted, tested products you&apos;ll love.</span>
                  <span className="sf-hero-sub-long">Discover trusted, tested, high-quality products you&apos;ll actually love.</span>
                </p>

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
                    const Icon = t.key === "all" ? GridIcon : CATEGORY_ICON[t.key];
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
            </div>
          </div>
        </div>

        <div className="sf-wrap">
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
            <div className="sf-trust-dots" aria-hidden="true">
              {TRUST_ITEMS.map((item) => (
                <span key={item.title} />
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
                <>
                  <div className="sf-cat-header">
                    <span className="sf-cat-label">
                      <HomeIcon />
                      Featured Finds For You
                    </span>
                    <button type="button" className="sf-cat-viewall" onClick={goToProducts}>
                      View all finds →
                    </button>
                  </div>
                  <ProductGrid items={products} isAdmin={isAdmin} wishlist={wishlist} onToggleWishlist={toggleWishlist} />
                </>
              ) : (
                <>
                  <div className="sf-cat-header">
                    <span className="sf-cat-label">
                      {(() => { const Icon = CATEGORY_ICON[filter]; return Icon ? <Icon /> : null; })()}
                      {CATEGORIES[filter] ?? filter}
                    </span>
                  </div>
                  <ProductGrid
                    items={products.filter((p) => p.category === filter)}
                    isAdmin={isAdmin}
                    wishlist={wishlist}
                    onToggleWishlist={toggleWishlist}
                  />
                </>
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
            <button type="button" onClick={focusNewsletter} className="sf-cta-btn">
              <BagIcon />
              Get Notified of New Finds
            </button>
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
