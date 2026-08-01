import type { Metadata } from "next";
import About from "@/components/About";
import { fetchPublicAboutContent } from "@/lib/about/actions";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "About | Check This Finds",
  description: "Curated, tested, and verified Shopee finds for every Filipino shopper.",
};

export default async function AboutPage() {
  const content = await fetchPublicAboutContent();
  return <About content={content} />;
}
