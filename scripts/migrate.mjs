import fs from "node:fs";
import path from "node:path";

const migrationsDir = path.join(process.cwd(), "lib", "db", "migrations");

if (!process.env.DATABASE_URL) {
  console.log("No DATABASE_URL set yet — nothing to migrate. This is fine for now.");
  process.exit(0);
}

if (!fs.existsSync(migrationsDir)) {
  console.log("No migrations yet — nothing to do.");
  process.exit(0);
}

const files = fs
  .readdirSync(migrationsDir)
  .filter((f) => f.endsWith(".sql"))
  .sort();

if (files.length === 0) {
  console.log("No migrations yet — nothing to do.");
  process.exit(0);
}

const { neon } = await import("@neondatabase/serverless");
const sql = neon(process.env.DATABASE_URL);

await sql`CREATE TABLE IF NOT EXISTS _migrations (id text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())`;
const appliedRows = await sql`SELECT id FROM _migrations`;
const applied = new Set(appliedRows.map((r) => r.id));

let ranAny = false;
for (const file of files) {
  if (applied.has(file)) continue;
  ranAny = true;
  const text = fs.readFileSync(path.join(migrationsDir, file), "utf8");
  console.log(`Applying ${file}...`);
  // Neon's driver rejects multiple commands in one query, so a migration
  // file with several statements has to run one at a time.
  const statements = text
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const statement of statements) {
    await sql.query(statement);
  }
  await sql`INSERT INTO _migrations (id) VALUES (${file})`;
  console.log(`Applied ${file}`);
}

console.log(ranAny ? "All migrations applied." : "Already up to date — nothing new to apply.");
