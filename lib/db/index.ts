import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/lib/db/schema";

export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

let cached: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (!isDbConfigured()) return null;
  if (!cached) {
    const sql = neon(process.env.DATABASE_URL as string);
    cached = drizzle(sql, { schema });
  }
  return cached;
}
