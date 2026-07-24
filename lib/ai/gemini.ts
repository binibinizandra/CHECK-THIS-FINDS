import "server-only";

const TIMEOUT_MS = 25000;

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

export interface Turn {
  role: "user" | "model";
  text: string;
}

interface CallOpts {
  maxTokens?: number;
  temperature?: number;
  responseSchema?: object;
}

async function callGemini(system: string, turns: Turn[], opts: CallOpts): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("Gemini not configured");
  const model = process.env.GEMINI_MODEL || "gemini-flash-latest";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const body = {
      systemInstruction: { parts: [{ text: system }] },
      contents: turns.map((t) => ({ role: t.role, parts: [{ text: t.text }] })),
      generationConfig: {
        // No thinkingBudget override here — current models charge "thinking" tokens
        // against maxOutputTokens regardless, so headroom matters more than disabling it
        // (and forcing budget:0 gets rejected outright on newer models).
        maxOutputTokens: opts.maxTokens ?? 1200,
        temperature: opts.temperature ?? 0.6,
        ...(opts.responseSchema
          ? { responseMimeType: "application/json", responseSchema: opts.responseSchema }
          : {}),
      },
    };
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      }
    );
    if (!res.ok) throw new Error(`Gemini request failed: ${res.status}`);
    const data = await res.json();
    const text: string = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("") ?? "";
    if (!text) throw new Error("Gemini returned no content");
    return text;
  } finally {
    clearTimeout(timeout);
  }
}

export async function geminiGenerate(
  system: string,
  turns: Turn[],
  opts: { maxTokens?: number; temperature?: number } = {}
): Promise<string> {
  return callGemini(system, turns, opts);
}

export async function geminiJSON<T>(
  system: string,
  turns: Turn[],
  schema: object,
  opts: { maxTokens?: number; temperature?: number } = {}
): Promise<T> {
  const text = await callGemini(system, turns, { ...opts, responseSchema: schema });
  return JSON.parse(text) as T;
}
