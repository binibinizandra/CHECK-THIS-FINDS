CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS analytics_events_type_idx ON analytics_events (type);
CREATE INDEX IF NOT EXISTS analytics_events_product_idx ON analytics_events (product_id);
