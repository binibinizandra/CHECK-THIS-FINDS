CREATE TABLE IF NOT EXISTS tiktok_connections (
  user_id text PRIMARY KEY REFERENCES users(id),
  open_id text NOT NULL,
  display_name text,
  avatar_url text,
  follower_count integer,
  access_token text NOT NULL,
  refresh_token text,
  expires_at timestamptz,
  connected_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
