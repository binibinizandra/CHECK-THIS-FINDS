"use server";
import Anthropic from "@anthropic-ai/sdk";
import { currentUserId } from "@/lib/auth/currentUser";
import { isOwner } from "@/lib/auth/owner";

const DRAFT_TOOL = {
  name: "propose_product_draft",
  description:
    "Propose a structured product draft once you have enough information about the product to write good marketing copy for it. Call this when you're ready to show the owner a draft card, not on every turn.",
  input_schema: {
    type: "object" as const,
    properties: {
      name: { type: "string", description: "Product name" },
      category: {
        type: "string",
        enum: ["home", "digital", "care", "food"],
        description: "Best-fit storefront category",
      },
      rating: { type: "number", description: "Suggested star rating, 4.0-5.0" },
      reviews: { type: "integer", description: "Suggested plausible review count" },
      pros: {
        type: "array",
        items: { type: "string" },
        description: "3-5 short pros, one short phrase each",
      },
      cons: {
        type: "array",
        items: { type: "string" },
        description: "1-4 short cons, one short phrase each",
      },
    },
    required: ["name", "category", "rating", "reviews", "pros", "cons"],
    additionalProperties: false,
  },
};

const SYSTEM_PROMPT = `You are the AI Operations assistant for "Check This Finds," a curated affiliate storefront (Shopee/TikTok Shop finds). The owner will paste a product link or name and ask you to draft content, or ask for TikTok caption ideas.

When you have enough information about a product, call the propose_product_draft tool with: a catchy but accurate name, the best-fit category (home = Home Needs & Appliances, digital = Digital Finds, care = Personal Care, food = Food & Treats), a realistic star rating (4.0-5.0), a plausible review count, 3-5 short pros, and 1-4 short cons. Keep each pro/con under 12 words.

If asked for TikTok captions, write 3 distinct short caption ideas (with relevant hashtags) as plain text in your reply — do not use the tool for that.

If the owner is just chatting, asking a question, or the product isn't clear yet, respond normally in text without calling the tool. Reply in the same mix of English/Tagalog the owner uses.`;

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface DraftProduct {
  name: string;
  category: string;
  rating: number;
  reviews: number;
  pros: string[];
  cons: string[];
}

export async function chatWithOps(
  history: ChatMessage[]
): Promise<{ reply: string; draft: DraftProduct | null } | { error: string }> {
  const userId = await currentUserId();
  if (!isOwner(userId)) return { error: "Not authorized." };

  if (!process.env.ANTHROPIC_API_KEY) {
    return { error: "AI chat isn't set up yet — add ANTHROPIC_API_KEY to your environment variables." };
  }

  try {
    const client = new Anthropic();
    const response = await client.messages.create({
      model: "claude-opus-5",
      max_tokens: 8000,
      system: SYSTEM_PROMPT,
      tools: [DRAFT_TOOL],
      output_config: { effort: "medium" },
      messages: history.map((m) => ({ role: m.role, content: m.content })),
    });

    let reply = "";
    let draft: DraftProduct | null = null;
    for (const block of response.content) {
      if (block.type === "text") {
        reply += block.text;
      } else if (block.type === "tool_use" && block.name === "propose_product_draft") {
        draft = block.input as DraftProduct;
      }
    }

    if (!reply && draft) {
      reply = `Draft ready: ${draft.name}`;
    }

    return { reply, draft };
  } catch {
    return { error: "AI request failed. Please try again." };
  }
}
