-- Affiliate / Referral program
-- Each user automatically gets a unique referral code = their user_id (or short hash).
-- Referrals are tracked from URL ?ref=<code> through cookie until signup.
-- Commission: 30% of MRR (Dev R$29 → R$8.70/mo, Team R$79 → R$23.70/mo) recurring.

CREATE TABLE IF NOT EXISTS referrals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Who referred (the affiliate)
  referrer_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Who was referred (signed up via ?ref=)
  referred_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Status
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'converted', 'churned')),
  -- Commission tracking
  plan text, -- dev | team | null
  monthly_commission_brl numeric(10,2) DEFAULT 0,
  total_paid_brl numeric(10,2) DEFAULT 0,
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  converted_at timestamptz, -- when the referred user first paid
  churned_at timestamptz,   -- when the referred user cancelled
  UNIQUE (referred_user_id) -- a user can only be referred once
);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals (referrer_user_id, status);
CREATE INDEX IF NOT EXISTS idx_referrals_referred ON referrals (referred_user_id);

-- Affiliate payouts ledger (record of paid commissions)
CREATE TABLE IF NOT EXISTS affiliate_payouts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount_brl numeric(10,2) NOT NULL,
  pix_key text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
  reference_period text, -- e.g. "2026-04"
  created_at timestamptz DEFAULT now(),
  paid_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_payouts_user ON affiliate_payouts (user_id, status);

-- RLS
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_payouts ENABLE ROW LEVEL SECURITY;

-- Users can read their own referrals (as referrer)
CREATE POLICY "Users see own referrals"
  ON referrals FOR SELECT
  TO authenticated
  USING (referrer_user_id = auth.uid());

-- Users can read their own payouts
CREATE POLICY "Users see own payouts"
  ON affiliate_payouts FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Service role can do everything (the inserts happen server-side)
