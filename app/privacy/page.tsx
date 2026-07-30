import type { Metadata } from "next";
import SimplePage from "@/components/SimplePage";

export const metadata: Metadata = {
  title: "Privacy Policy | Check This Finds",
  description: "How Check This Finds handles your data.",
};

export default function PrivacyPage() {
  return (
    <SimplePage eyebrow="Legal" title="Privacy Policy">
      <p>
        Check This Finds (&quot;we,&quot; &quot;us&quot;) respects your privacy. This page explains what
        information we collect when you visit this site, and how it&apos;s used.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li>Basic, anonymous site analytics — which pages you view, and whether you click through to a listed product. No personal identifying information is collected as part of this.</li>
        <li>Your email address, only if you voluntarily subscribe to our newsletter.</li>
      </ul>

      <h2>How we use it</h2>
      <p>
        Site analytics help us understand which products people find useful, so we can feature better finds. If
        you&apos;ve subscribed to our newsletter, we&apos;ll use your email to send occasional updates about new
        products — nothing else, and never sold to third parties.
      </p>

      <h2>Third-party links</h2>
      <p>
        When you click &quot;Buy on Shopee,&quot; you&apos;re taken directly to Shopee&apos;s own website, which
        has its own privacy policy and handles your data independently. We never process payments or see your
        checkout information — that happens entirely on Shopee&apos;s platform.
      </p>

      <h2>Your choices</h2>
      <p>
        You can unsubscribe from our newsletter at any time. If you have questions about this policy, you can
        reach us through the founder&apos;s LinkedIn — see our <a href="/contact">Contact</a> page.
      </p>

      <h2>Updates</h2>
      <p>This policy may be updated occasionally as the site grows. Check back periodically for changes.</p>
    </SimplePage>
  );
}
