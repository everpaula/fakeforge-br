-- ============================================================
-- 014_backfill_missing_keys_sprint5.sql
-- ============================================================
-- Sprint 5 F3: backfill dos 25 users que ainda ficaram sem key ativa
-- apos migration 013.
--
-- Diagnostico audit 13/09/2026:
--   463 users totais
--   438 users_with_api_key (95%)
--   -> 25 users SEM key ativa
--   -> possivel race condition no trigger 013 (falha silenciosa via
--      EXCEPTION WHEN OTHERS), ou users criados antes do trigger
--      existir e desativaram a key depois.
--
-- Solucao: re-rodar backfill idempotente. Mesma logica do 013 mas
-- garante que qualquer user sem key ativa recebe uma nova agora.
--
-- Aplicar em PROD via Supabase SQL Editor.
-- ============================================================

-- Antes: verificar quem sao os 25 sem key
SELECT
  u.id,
  u.email,
  u.created_at,
  u.confirmed_at IS NOT NULL AS confirmed
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.api_keys ak
  WHERE ak.user_id = u.id AND ak.is_active = true
)
ORDER BY u.created_at DESC;

-- Backfill: 1 key ativa por user faltante
INSERT INTO public.api_keys (user_id, key, name, is_active)
SELECT
  u.id,
  'ff_' || encode(gen_random_bytes(16), 'hex'),
  'Default key',
  true
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.api_keys ak
  WHERE ak.user_id = u.id AND ak.is_active = true
);

-- Verificacao pos-migration: deve dar 100% agora
SELECT
  (SELECT COUNT(*) FROM auth.users) AS total_users,
  (SELECT COUNT(DISTINCT user_id) FROM public.api_keys WHERE is_active = true) AS users_with_active_key,
  (SELECT COUNT(*) FROM public.api_keys WHERE is_active = true) AS total_active_keys,
  ROUND(
    (SELECT COUNT(DISTINCT user_id)::numeric FROM public.api_keys WHERE is_active = true)
    / NULLIF((SELECT COUNT(*)::numeric FROM auth.users), 0) * 100, 1
  ) AS pct_with_key;
-- Esperado: pct_with_key = 100.0
