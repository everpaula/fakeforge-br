-- ============================================================
-- 006_security_advisor_fixes.sql
-- ============================================================
-- Aplica os 9 fixes do Supabase Security Advisor (junho 2026):
--
--   2x Exposed Auth Users     (admin_metrics, admin_users_daily)
--   5x Security Definer View  (admin_metrics, admin_usage_by_type,
--                              admin_users_daily, admin_api_daily,
--                              admin_subscribers)
--   2x Auth RLS Init Plan     (api_keys, api_usage)
--
-- Aplicado em PROD em 2026-06-14 via Supabase SQL Editor.
-- O backend admin API usa SERVICE_ROLE_KEY que bypassa estes
-- REVOKEs, então o /api/admin continua funcionando.
-- ============================================================

-- ----- FIX 1: Security Definer Views → Security Invoker
ALTER VIEW public.admin_metrics       SET (security_invoker = true);
ALTER VIEW public.admin_usage_by_type SET (security_invoker = true);
ALTER VIEW public.admin_users_daily   SET (security_invoker = true);
ALTER VIEW public.admin_api_daily     SET (security_invoker = true);
ALTER VIEW public.admin_subscribers   SET (security_invoker = true);

-- ----- FIX 2: Revoke acesso público das admin views
REVOKE ALL ON public.admin_metrics       FROM anon, authenticated;
REVOKE ALL ON public.admin_usage_by_type FROM anon, authenticated;
REVOKE ALL ON public.admin_users_daily   FROM anon, authenticated;
REVOKE ALL ON public.admin_api_daily     FROM anon, authenticated;
REVOKE ALL ON public.admin_subscribers   FROM anon, authenticated;

-- ----- FIX 3: Wrap auth.uid() em (SELECT auth.uid()) pra cache
-- Antes: (auth.uid() = user_id) → reavalia por linha
-- Depois: (user_id = (SELECT auth.uid())) → cacheado por query

DROP POLICY "Users see own api_keys" ON public.api_keys;
CREATE POLICY "Users see own api_keys" ON public.api_keys
  FOR ALL TO authenticated
  USING ( user_id = (SELECT auth.uid()) )
  WITH CHECK ( user_id = (SELECT auth.uid()) );

DROP POLICY "Users see own usage" ON public.api_usage;
CREATE POLICY "Users see own usage" ON public.api_usage
  FOR ALL TO authenticated
  USING ( user_id = (SELECT auth.uid()) )
  WITH CHECK ( user_id = (SELECT auth.uid()) );

-- ----- Verificação
-- SELECT tablename, policyname, cmd, qual, with_check
-- FROM pg_policies
-- WHERE schemaname = 'public' AND tablename IN ('api_keys','api_usage');
