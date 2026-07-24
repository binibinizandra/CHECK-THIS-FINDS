import "server-only";

const TIMEOUT_MS = 20000;

export function isFirecrawlConfigured(): boolean {
  return Boolean(process.env.FIRECRAWL_API_KEY);
}

export interface FirecrawlResult {
  title: string;
  description: string;
  url: string;
}

export async function firecrawlSearch(query: string, limit = 8): Promise<FirecrawlResult[]> {
  const key = process.env.FIRECRAWL_API_KEY;
  if (!key) return [];
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch("https://api.firecrawl.dev/v2/search", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
      body: JSON.stringify({ query, limit }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Firecrawl request failed: ${res.status}`);
    const data = await res.json();
    const raw = data?.data?.web ?? data?.web ?? data?.data ?? [];
    return (Array.isArray(raw) ? raw : []).map((r: { title?: string; description?: string; url?: string }) => ({
      title: r.title ?? "",
      description: r.description ?? "",
      url: r.url ?? "",
    }));
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}
