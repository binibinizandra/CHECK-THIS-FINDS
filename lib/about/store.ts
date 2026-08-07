import "server-only";
import { eq } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/lib/db";
import { aboutContent } from "@/lib/db/schema";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface AboutContentRecord {
  eyebrow: string;
  title: string;
  intro: string;
  missionText: string;
  visionText: string;
  curatorName: string;
  curatorBio: string;
  faq: FaqItem[];
}

const DEFAULTS: AboutContentRecord = {
  eyebrow: "About Check This Finds",
  title: "Welcome to Check This Finds",
  intro:
    "Check This Finds was created for every Filipino shopper who wants complete confidence in every online purchase. We know how overwhelming it is to spend hours scrolling, filtering through endless reviews, and second-guessing whether an item on Shopee is worth your hard-earned money. That's why we do the heavy lifting for you.\n\n" +
    "We curate tested, highly rated, and verified items into one clean, seamless, and easy-to-navigate hub — ranging from everyday budget home essentials to premium, trusted tech finds. No endless scrolling, no wasted time, and zero regret. Just direct access to legitimate, proven products that deliver real value for every peso.",
  missionText:
    "To provide a fast, honest, and reliable shopping shortcut for Filipinos by curating proven, high-quality products from trusted sellers.",
  visionText:
    "To become the #1 preferred and most trusted Affiliate Shopping Hub in the Philippines — the very first destination every shopper visits before checking out for a guaranteed safe, smart, and satisfying online shopping experience.",
  curatorName: "Curated by Kazandra B.",
  curatorBio:
    "As a passionate online shopper and researcher, I created Check This Finds to save you time and money. Every item listed here is handpicked based on high ratings, verified buyer reviews, and real value.",
  faq: [
    {
      question: "How does purchasing work on this site?",
      answer:
        "Check This Finds is a curated recommendation hub. When you click on an item, you'll be redirected directly to the official and verified seller on Shopee or Lazada, where you can securely place your order.",
    },
    {
      question: "How are products selected?",
      answer:
        "We strictly filter items to include only those with high sales volumes, minimum 4.8/5 seller ratings, positive real customer feedback, and proven quality.",
    },
    {
      question: "Will it cost me more to buy through these links?",
      answer:
        "No. The prices are 100% the same as the official store. We highlight items with special discounts and free shipping deals so you get the best price possible.",
    },
    {
      question: "Are the seller links safe and verified?",
      answer: "Yes! We only link to Shopee Mall, LazMall, Preferred sellers, and top-rated merchants so you can shop safely with peace of mind.",
    },
  ],
};

function toRecord(r: typeof aboutContent.$inferSelect): AboutContentRecord {
  return {
    eyebrow: r.eyebrow,
    title: r.title,
    intro: r.intro,
    missionText: r.missionText,
    visionText: r.visionText,
    curatorName: r.curatorName,
    curatorBio: r.curatorBio,
    faq: Array.isArray(r.faq) ? (r.faq as FaqItem[]) : [],
  };
}

export async function getAboutContent(userId: string): Promise<AboutContentRecord> {
  if (!isDbConfigured()) return DEFAULTS;
  const db = getDb();
  if (!db) return DEFAULTS;

  const rows = await db.select().from(aboutContent).where(eq(aboutContent.userId, userId)).limit(1);
  if (rows[0]) return toRecord(rows[0]);

  // First time this owner loads the About page content, seed it as a real
  // row so it behaves the same as anything else they'd edit and save.
  await db
    .insert(aboutContent)
    .values({ userId, ...DEFAULTS })
    .onConflictDoNothing();
  const seeded = await db.select().from(aboutContent).where(eq(aboutContent.userId, userId)).limit(1);
  return seeded[0] ? toRecord(seeded[0]) : DEFAULTS;
}

export async function updateAboutContent(userId: string, patch: Partial<AboutContentRecord>): Promise<void> {
  if (!isDbConfigured()) return;
  const db = getDb();
  if (!db) return;
  await getAboutContent(userId); // ensures the row exists before updating
  await db
    .update(aboutContent)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(aboutContent.userId, userId));
}
