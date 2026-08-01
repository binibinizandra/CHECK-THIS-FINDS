CREATE TABLE IF NOT EXISTS about_content (
  user_id text PRIMARY KEY REFERENCES users(id),
  eyebrow text NOT NULL,
  title text NOT NULL,
  intro text NOT NULL,
  mission_text text NOT NULL,
  vision_text text NOT NULL,
  curator_name text NOT NULL,
  curator_bio text NOT NULL,
  faq jsonb NOT NULL DEFAULT '[]',
  updated_at timestamptz NOT NULL DEFAULT now()
);
