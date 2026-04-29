-- Track anonymous usage (web UI and unauthenticated API calls)
-- IP is hashed (SHA256) for privacy — only used to count unique visitors

CREATE TABLE IF NOT EXISTS anonymous_usage (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  client_type text NOT NULL CHECK (client_type IN ('web', 'api_anon')),
  ip_hash text NOT NULL,
  data_type text NOT NULL,
  quantity int NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_anon_usage_created
  ON anonymous_usage (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_anon_usage_ip_day
  ON anonymous_usage (ip_hash, created_at);

CREATE INDEX IF NOT EXISTS idx_anon_usage_type
  ON anonymous_usage (data_type, created_at DESC);

-- RLS: only service role can read/write (admin queries via service key)
ALTER TABLE anonymous_usage ENABLE ROW LEVEL SECURITY;