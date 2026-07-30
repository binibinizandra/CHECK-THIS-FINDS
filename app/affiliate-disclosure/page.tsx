import type { Metadata } from "next";
import SimplePage from "@/components/SimplePage";

export const metadata: Metadata = {
  title: "Affiliate Disclosure | Check This Finds",
  description: "How Check This Finds earns from the products it features.",
};

export default function AffiliateDisclosurePage() {
  return (
    <SimplePage eyebrow="Transparency" title="Affiliate Disclosure">
      <p>
        Check This Finds participates in the Shopee affiliate program. This means that when you click a
        &quot;Buy on Shopee&quot; link and make a purchase, we may earn a small commission — at absolutely no
        extra cost to you. The price you pay is the exact same official price you&apos;d pay by visiting Shopee
        directly.
      </p>

      <h2>Our recommendations stay independent</h2>
      <p>
        Every product featured here is chosen based on genuine research, ratings, and verified reviews — never
        based on which item pays the highest commission. If something doesn&apos;t meet our standard, it doesn&apos;t
        get featured, regardless of commission rate.
      </p>

      <h2>Why we do this</h2>
      <p>
        Running and maintaining Check This Finds takes real time and research. Affiliate commissions are how we
        keep the site free for you to use, while staying honest about how it&apos;s funded.
      </p>
    </SimplePage>
  );
}
