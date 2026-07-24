CREATE TABLE IF NOT EXISTS messages (
  id serial PRIMARY KEY,
  user_id text NOT NULL REFERENCES users(id),
  agent_id text,
  who text NOT NULL,
  text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS messages_user_id_idx ON messages (user_id, id);
