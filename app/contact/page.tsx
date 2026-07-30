import type { Metadata } from "next";
import SimplePage from "@/components/SimplePage";

export const metadata: Metadata = {
  title: "Contact | Check This Finds",
  description: "Get in touch with Check This Finds.",
};

export default function ContactPage() {
  return (
    <SimplePage eyebrow="Get in touch" title="Contact Us">
      <p>
        We&apos;d love to hear from you — questions, product suggestions, or feedback about your experience with
        Check This Finds.
      </p>

      <h2>Reach the founder</h2>
      <p>
        Right now, the best way to reach us directly is through our founder&apos;s LinkedIn:{" "}
        <a href="https://www.linkedin.com/in/binibinizandra/" target="_blank" rel="noopener noreferrer">
          Connect with Kazandra B. on LinkedIn
        </a>
        .
      </p>

      <h2>Order questions</h2>
      <p>
        For anything related to an order, delivery, or refund, please contact Shopee directly — all purchases
        and transactions happen entirely on their platform, and they&apos;ll have the fastest, most accurate
        answer.
      </p>
    </SimplePage>
  );
}
