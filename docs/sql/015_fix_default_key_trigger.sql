-- ============================================================
-- 015_fix_default_key_trigger.sql
-- ============================================================
-- Corrige o trigger da migration 013, que falha em silêncio.
--
-- Causa provável: a função 013 roda com SET search_path = public e chama
-- gen_random_bytes(), que no Supabase vive no schema "extensions" (pgcrypto).
-- Dentro do trigger a função não é encontrada, o bloco
-- EXCEPTION WHEN OTHERS engole o erro e o signup segue sem key.
-- O backfill da 013/014 funciona porque roda no SQL Editor, onde o
-- search_path inclui "extensions". Por isso: 95% em 13/09 (backfill) e
-- queda pra 68% com os ~230 signups novos depois.
--
-- Solução: gen_random_uuid() é nativa do Postgres 13+ (sem pgcrypto) e
-- o erro agora aparece como WARNING no log em vez de NOTICE.
--
-- Aplicar em PROD via Supabase SQL Editor.
-- ============================================================

-- 1. Diagnóstico ANTES: confirma a causa (deve falhar no trigger context)
-- SELECT proname, prosrc ILIKE '%gen_random_bytes%' AS usa_pgcrypto
-- FROM pg_proc WHERE proname = 'create_default_api_key';
--
-- SELECT date_trunc('week', u.created_at) AS semana,
--        COUNT(*) AS signups,
--        COUNT(ak.user_id) AS com_key
-- FROM auth.users u
-- LEFT JOIN (SELECT DISTINCT user_id FROM public.api_keys) ak ON ak.user_id = u.id
-- GROUP BY 1 ORDER BY 1 DESC;

-- 2. Função corrigida
CREATE OR REPLACE FUNCTION public.create_default_api_key()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.api_keys (user_id, key, name, is_active)
  VALUES (
    NEW.id,
    'ff_' || replace(gen_random_uuid()::text, '-', ''),
    'my-first-key',
    true
  );

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Não bloqueia o signup, mas deixa rastro visível no log do Postgres.
  RAISE WARNING 'create_default_api_key failed for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_default_key ON auth.users;

CREATE TRIGGER on_auth_user_created_default_key
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.create_default_api_key();

-- 3. Backfill idempotente: 1 key ativa pra todo user que não tem
INSERT INTO public.api_keys (user_id, key, name, is_active)
SELECT
  u.id,
  'ff_' || replace(gen_random_uuid()::text, '-', ''),
  'my-first-key',
  true
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.api_keys ak
  WHERE ak.user_id = u.id AND ak.is_active = true
);

-- 4. Verificação (esperado: total_users == users_with_active_key)
SELECT
  (SELECT COUNT(*) FROM auth.users) AS total_users,
  (SELECT COUNT(DISTINCT user_id) FROM public.api_keys WHERE is_active = true) AS users_with_active_key;
