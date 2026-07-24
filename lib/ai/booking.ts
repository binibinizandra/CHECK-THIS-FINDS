import "server-only";
import { geminiJSON, isGeminiConfigured } from "@/lib/ai/gemini";

export interface BookingParseResult {
  matchedBrand: string | null;
  whenAt: string | null;
  whenLabel: string | null;
  confident: boolean;
}

const BOOKING_SCHEMA = {
  type: "object",
  properties: {
    matchedBrand: { type: "string" },
    whenAt: { type: "string" },
    whenLabel: { type: "string" },
    confident: { type: "boolean" },
  },
  required: ["confident"],
};

export function isBookingParserConfigured(): boolean {
  return isGeminiConfigured();
}

export async function parseBookingRequest(
  text: string,
  candidateBrands: string[],
  now: Date
): Promise<BookingParseResult | null> {
  if (!isGeminiConfigured()) return null;
  const system = [
    `You're parsing a request to book a brand call. Today's date and time is ${now.toISOString()} — resolve relative phrases like "next Tuesday" or "tomorrow at 3" against that.`,
    `Here are the brands this person is currently working with — match the one mentioned, returned verbatim from this list, or leave matchedBrand empty if none clearly match:`,
    candidateBrands.length ? candidateBrands.join(", ") : "(no brands yet)",
    `Return the resolved date/time in ISO 8601 with timezone as whenAt, a short human label like "Thursday, Aug 14 at 2:00 PM" as whenLabel, the matched brand name as matchedBrand, and confident:true only if both a brand and a clear date/time were found.`,
    `Return ONLY JSON matching the schema.`,
  ].join("\n\n");
  const turns = [{ role: "user" as const, text }];
  try {
    return await geminiJSON<BookingParseResult>(system, turns, BOOKING_SCHEMA, { maxTokens: 800, temperature: 0.2 });
  } catch {
    return null;
  }
}
