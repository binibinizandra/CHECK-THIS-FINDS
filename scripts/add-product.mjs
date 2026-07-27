import fs from "node:fs";

const OWNER_ID = "user_3GtTKgVKA7gxgyyo0MN7SuaS4BI";
const VALID_CATEGORIES = ["home", "digital", "care", "food"];

const jsonPath = process.argv[2];
if (!jsonPath) {
  console.error("Usage: node scripts/add-product.mjs <path-to-product.json>");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

for (const field of ["name", "category", "imageUrl"]) {
  if (!data[field]) {
    console.error(`Missing required field: ${field}`);
    process.exit(1);
  }
}
if (!VALID_CATEGORIES.includes(data.category)) {
  console.error(`Invalid category "${data.category}" — must be one of ${VALID_CATEGORIES.join(", ")}`);
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL not set.");
  process.exit(1);
}

const { neon } = await import("@neondatabase/serverless");
const sql = neon(process.env.DATABASE_URL);

const pros = Array.isArray(data.pros) ? data.pros.join("\n") : data.pros || null;
const cons = Array.isArray(data.cons) ? data.cons.join("\n") : data.cons || null;
const rating = data.rating != null ? Number(data.rating) : 5;
const reviews = data.reviews != null ? Number(data.reviews) : 0;

const minRow = await sql`SELECT COALESCE(MIN(sort_order), 0) AS min FROM products WHERE user_id = ${OWNER_ID}`;
const sortOrder = minRow[0].min - 1;

const inserted = await sql`
  INSERT INTO products (user_id, name, category, rating, reviews, image_url, shopee_link, tiktok_link, pros, cons, sort_order)
  VALUES (${OWNER_ID}, ${data.name}, ${data.category}, ${rating}, ${reviews}, ${data.imageUrl}, ${data.shopeeLink ?? null}, ${data.tiktokLink ?? null}, ${pros}, ${cons}, ${sortOrder})
  RETURNING id
`;

console.log(`Added product: ${data.name}`);
console.log(`ID: ${inserted[0].id}`);
