-- ============================================================
-- 012_admin_views_timezone_fix.sql
-- ============================================================
-- Fix: card "Novos hoje" (rolling 24h) descasava do grafico "Novos
-- usuarios ao longo do tempo" (DATE calendar em UTC). Card contava
-- ~24h de janela deslizante, grafico so o dia calendario em UTC.
-- Além do descasamento de janela, ambos ignoravam o fuso BR - user
-- criando conta as 21h BR aparecia no dia seguinte no grafico.
--
-- Solucao: usar sempre o fuso America/Sao_Paulo (onde os users
-- criam conta) e usar CALENDAR DAY nao rolling window pra "hoje".
-- Assim card = "usuarios criados desde 00:00 BR hoje" = mesmo
-- ultimo ponto do grafico. Consistencia visual restaurada.
--
-- Aplica pra 3 metricas em admin_metrics e as 3 views daily 90d.
--
-- Aplicar em PROD via Supabase SQL Editor.
-- ============================================================

-- 1. admin_metrics: users_today, api_calls_today usam calendar day BR
-- IMPORTANTE: preservar TODAS as colunas existentes (paying_dev, paying_team, mrr)
-- que foram adicionadas em migrations posteriores. Se dropar sem elas, o card MRR
-- do dashboard quebra silenciosamente.
CREATE OR REPLACE VIEW public.admin_metrics AS
SELECT
  (SELECT COUNT(*) FROM auth.users) AS total_users,
  (SELECT COUNT(*) FROM auth.users
    WHERE (created_at AT TIME ZONE 'America/Sao_Paulo')::date =
          (NOW()        AT TIME ZONE 'America/Sao_Paulo')::date
  ) AS users_today,
  (SELECT COUNT(*) FROM auth.users
    WHERE created_at > NOW() - INTERVAL '7 days'
  ) AS users_7d,
  (SELECT COUNT(*) FROM auth.users
    WHERE created_at > NOW() - INTERVAL '30 days'
  ) AS users_30d,
  (SELECT COUNT(*) FROM public.api_keys WHERE is_active = true) AS active_api_keys,
  (SELECT COUNT(*) FROM public.api_usage
    WHERE (created_at AT TIME ZONE 'America/Sao_Paulo')::date =
          (NOW()        AT TIME ZONE 'America/Sao_Paulo')::date
  ) AS api_calls_today,
  (SELECT COUNT(*) FROM public.api_usage
    WHERE created_at > NOW() - INTERVAL '7 days'
  ) AS api_calls_7d,
  (SELECT COUNT(*) FROM public.api_usage
    WHERE created_at > NOW() - INTERVAL '30 days'
  ) AS api_calls_30d,
  (SELECT COUNT(*) FROM public.subscriptions
    WHERE plan = 'dev' AND status = 'active') AS paying_dev,
  (SELECT COUNT(*) FROM public.subscriptions
    WHERE plan = 'team' AND status = 'active') AS paying_team,
  (SELECT COALESCE(SUM(
    CASE
      WHEN plan = 'dev' THEN 29
      WHEN plan = 'team' THEN 79
      ELSE 0
    END), 0)
    FROM public.subscriptions WHERE status = 'active') AS mrr;

-- 2. admin_users_daily_90d: usa DATE em fuso BR
CREATE OR REPLACE VIEW public.admin_users_daily_90d AS
SELECT
  (created_at AT TIME ZONE 'America/Sao_Paulo')::date AS day,
  COUNT(*) AS new_users
FROM auth.users
WHERE created_at > NOW() - INTERVAL '90 days'
GROUP BY (created_at AT TIME ZONE 'America/Sao_Paulo')::date
ORDER BY day DESC;

-- 3. admin_api_daily_90d: usa DATE em fuso BR
CREATE OR REPLACE VIEW public.admin_api_daily_90d AS
SELECT
  (created_at AT TIME ZONE 'America/Sao_Paulo')::date AS day,
  COUNT(*) AS total_calls,
  SUM(quantity) AS total_items
FROM public.api_usage
WHERE created_at > NOW() - INTERVAL '90 days'
GROUP BY (created_at AT TIME ZONE 'America/Sao_Paulo')::date
ORDER BY day DESC;

-- 4. admin_anon_daily_90d: usa DATE em fuso BR
CREATE OR REPLACE VIEW public.admin_anon_daily_90d AS
SELECT
  (created_at AT TIME ZONE 'America/Sao_Paulo')::date AS day,
  COUNT(*) AS total_calls,
  SUM(quantity) AS total_items,
  COUNT(DISTINCT ip_hash) AS unique_visitors
FROM public.anonymous_usage
WHERE created_at > NOW() - INTERVAL '90 days'
GROUP BY (created_at AT TIME ZONE 'America/Sao_Paulo')::date
ORDER BY day DESC;

-- 5. Reforcar REVOKE apos CREATE OR REPLACE (Postgres reseta grants)
REVOKE ALL ON public.admin_metrics          FROM anon, authenticated;
REVOKE ALL ON public.admin_anon_daily_90d   FROM anon, authenticated;
REVOKE ALL ON public.admin_users_daily_90d  FROM anon, authenticated;
REVOKE ALL ON public.admin_api_daily_90d    FROM anon, authenticated;

-- 6. Verificacao rapida: os 2 numeros abaixo devem bater
--    (card users_today vs ultimo dia do grafico admin_users_daily_90d)
SELECT
  (SELECT users_today FROM public.admin_metrics) AS card_users_today,
  (SELECT new_users FROM public.admin_users_daily_90d
    WHERE day = (NOW() AT TIME ZONE 'America/Sao_Paulo')::date
  ) AS grafico_users_hoje;
