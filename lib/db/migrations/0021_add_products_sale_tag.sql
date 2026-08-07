ALTER TABLE products ADD COLUMN IF NOT EXISTS sale_tag text;
CREATE INDEX IF NOT EXISTS products_sale_tag_idx ON products (sale_tag);
