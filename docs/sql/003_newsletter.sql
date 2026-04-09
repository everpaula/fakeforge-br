-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  subscribed_at timestamptz DEFAULT now(),
  unsubscribed_at timestamptz
);

-- RLS: only service role can read/write
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anon (the signup form)
CREATE POLICY "Allow newsletter signup" ON newsletter_subscribers
  FOR INSERT TO anon WITH CHECK (true);

-- Allow upsert (on conflict) from anon
CREATE POLICY "Allow newsletter upsert" ON newsletter_subscribers
  FOR UPDATE TO anon USING (true) WITH CHECK (true);
