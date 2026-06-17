-- ============================================================
-- 008_admin_views_90d.sql
-- ============================================================
-- Adiciona views agregadas de 90 dias para o painel admin.
-- As views atuais (admin_users_daily, admin_api_daily) cobrem
-- 30 dias e são usadas pelos contadores agregados. Estas novas
-- views fornecem janela mais longa pro line chart com toggle
-- Dia/Semana/Mês — o toggle "Mês" só faz sentido com 90d+.
--
-- Decisão de privilégios (lição da migration 006/007):
-- admin_users_daily_90d toca auth.users → SECURITY DEFINER
-- (default), REVOKE público + ignore no Advisor.
-- As outras só tocam tabelas public.* → também ficam DEFINER
-- por consistência. Risco mitigado pelo REVOKE.
--
-- Aplicar em PROD via Supabase SQL Editor.
-- ============================================================

CREATE OR REPLACE VIEW public.admin_anon_daily_90d AS
SELECT
  DATE(created_at) AS day,
  COUNT(*) AS total_calls,
  SUM(quantity) AS total_items,
  COUNT(DISTINCT ip_hash) AS unique_visitors
FROM public.anonymous_usage
WHERE created_at > NOW() - INTERVAL '90 days'
GROUP BY DATE(created_at)
ORDER BY day DESC;

CREATE OR REPLACE VIEW public.admin_users_daily_90d AS
SELECT
  DATE(created_at) AS day,
  COUNT(*) AS new_users
FROM auth.users
WHERE created_at > NOW() - INTERVAL '90 days'
GROUP BY DATE(created_at)
ORDER BY day DESC;

CREATE OR REPLACE VIEW public.admin_api_daily_90d AS
SELECT
  DATE(created_at) AS day,
  COUNT(*) AS total_calls,
  SUM(quantity) AS total_items
FROM public.api_usage
WHERE created_at > NOW() - INTERVAL '90 days'
GROUP BY DATE(created_at)
ORDER BY day DESC;

-- REVOKE público: nenhuma das views deve ser exposta a anon/authenticated
REVOKE ALL ON public.admin_anon_daily_90d   FROM anon, authenticated;
REVOKE ALL ON public.admin_users_daily_90d  FROM anon, authenticated;
REVOKE ALL ON public.admin_api_daily_90d    FROM anon, authenticated;

-- Verificação
SELECT viewname, has_table_privilege('anon', 'public.'||viewname, 'SELECT') AS anon_can_select
FROM pg_views
WHERE schemaname = 'public' AND viewname LIKE 'admin_%_90d';
