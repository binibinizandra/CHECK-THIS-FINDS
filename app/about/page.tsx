import type { Metadata } from "next";
import About from "@/components/About";

export const metadata: Metadata = {
  title: "About | Check This Finds",
  description: "Curated, tested, and verified Shopee finds for every Filipino shopper.",
};

export default function AboutPage() {
  return <About />;
}
