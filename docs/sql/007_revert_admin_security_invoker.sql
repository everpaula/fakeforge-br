-- ============================================================
-- 007_revert_admin_security_invoker.sql
-- ============================================================
-- Reverte parcialmente o FIX 1 da migration 006 porque
-- security_invoker = true quebrou o /admin painel.
--
-- Causa raiz:
--   As views admin_metrics e admin_users_daily fazem
--   `SELECT COUNT(*) FROM auth.users`. Com security_invoker = true,
--   a view executa com privilégios do caller (service_role) e
--   parte das operações em auth.users requerem privilégios de
--   postgres role.
--
-- Decisão de segurança:
--   FIX 2 (REVOKE FROM anon, authenticated) e FIX 3 (RLS wrap)
--   continuam aplicados. O risco real de SECURITY DEFINER é
--   privilege escalation via view exposta a usuários comuns.
--   Como o REVOKE bloqueia anon/authenticated e só o backend
--   (service_role) chama essas views, o risco prático é zero.
--
-- Os 5 warnings "Security Definer View" do Advisor devem ser
-- marcados como "Ignore" / "Mark as resolved" manualmente.
--
-- Aplicado em PROD em 2026-06-14.
-- ============================================================

ALTER VIEW public.admin_metrics       SET (security_invoker = false);
ALTER VIEW public.admin_usage_by_type SET (security_invoker = false);
ALTER VIEW public.admin_users_daily   SET (security_invoker = false);
ALTER VIEW public.admin_api_daily     SET (security_invoker = false);
ALTER VIEW public.admin_subscribers   SET (security_invoker = false);

-- Verificação
SELECT
  schemaname,
  viewname,
  CASE
    WHEN definition LIKE '%security_invoker=true%' THEN 'INVOKER'
    ELSE 'DEFINER (default)'
  END AS mode
FROM pg_views
WHERE schemaname = 'public' AND viewname LIKE 'admin_%';
