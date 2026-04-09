-- Tabela de admins
CREATE TABLE admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins see own record" ON admins
  FOR SELECT USING (auth.uid() = user_id);

-- Inserir admin master (será preenchido após login)
-- Execute depois de fazer login com evertonsilvapaula@gmail.com:
-- INSERT INTO admins (user_id) SELECT id FROM auth.users WHERE email = 'evertonsilvapaula@gmail.com';

-- View: métricas gerais
CREATE OR REPLACE VIEW admin_metrics AS
SELECT
  (SELECT COUNT(*) FROM auth.users) AS total_users,
  (SELECT COUNT(*) FROM auth.users WHERE created_at > NOW() - INTERVAL '24 hours') AS users_today,
  (SELECT COUNT(*) FROM auth.users WHERE created_at > NOW() - INTERVAL '7 days') AS users_7d,
  (SELECT COUNT(*) FROM auth.users WHERE created_at > NOW() - INTERVAL '30 days') AS users_30d,
  (SELECT COUNT(*) FROM api_keys WHERE is_active = true) AS active_api_keys,
  (SELECT COUNT(*) FROM api_usage WHERE created_at > NOW() - INTERVAL '24 hours') AS api_calls_today,
  (SELECT COUNT(*) FROM api_usage WHERE created_at > NOW() - INTERVAL '7 days') AS api_calls_7d,
  (SELECT COUNT(*) FROM api_usage WHERE created_at > NOW() - INTERVAL '30 days') AS api_calls_30d,
  (SELECT COUNT(*) FROM subscriptions WHERE plan = 'dev' AND status = 'active') AS paying_dev,
  (SELECT COUNT(*) FROM subscriptions WHERE plan = 'team' AND status = 'active') AS paying_team,
  (SELECT COALESCE(SUM(CASE WHEN plan = 'dev' THEN 29 WHEN plan = 'team' THEN 79 ELSE 0 END), 0)
   FROM subscriptions WHERE status = 'active') AS mrr;

-- View: uso por tipo de dado (top 10)
CREATE OR REPLACE VIEW admin_usage_by_type AS
SELECT
  data_type,
  COUNT(*) AS total_calls,
  SUM(quantity) AS total_items,
  COUNT(DISTINCT user_id) AS unique_users
FROM api_usage
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY data_type
ORDER BY total_calls DESC
LIMIT 10;

-- View: novos usuários por dia (últimos 30 dias)
CREATE OR REPLACE VIEW admin_users_daily AS
SELECT
  DATE(created_at) AS day,
  COUNT(*) AS new_users
FROM auth.users
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY day DESC;

-- View: chamadas API por dia (últimos 30 dias)
CREATE OR REPLACE VIEW admin_api_daily AS
SELECT
  DATE(created_at) AS day,
  COUNT(*) AS total_calls,
  SUM(quantity) AS total_items
FROM api_usage
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY day DESC;

-- View: últimos pagantes
CREATE OR REPLACE VIEW admin_subscribers AS
SELECT
  s.plan,
  s.status,
  s.mp_payer_email,
  s.created_at,
  s.current_period_end
FROM subscriptions s
ORDER BY s.created_at DESC
LIMIT 20;

-- Permitir que admin leia as views (via service_role, não via anon)
-- As views usam service_role key no backend, então não precisam de RLS
