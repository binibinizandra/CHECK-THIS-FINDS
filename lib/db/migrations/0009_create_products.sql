CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL REFERENCES users(id),
  name text NOT NULL,
  category text NOT NULL,
  rating double precision NOT NULL DEFAULT 5,
  reviews integer NOT NULL DEFAULT 0,
  image_url text NOT NULL,
  shopee_link text,
  tiktok_link text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS products_user_category_idx ON products (user_id, category);
