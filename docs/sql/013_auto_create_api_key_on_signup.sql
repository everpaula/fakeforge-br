-- ============================================================
-- 013_auto_create_api_key_on_signup.sql
-- ============================================================
-- Cria API key ativa automaticamente pra cada novo user no signup.
--
-- Diagnostico audit 10/09/2026:
--   233 novos users em 30d
--   25 API keys ativas TOTAL (nem todas dos novos)
--   -> ~10% signup -> API key. Users cadastram mas nao clicam
--   em "+ Nova key" no dashboard.
--
-- Consequencia: FirstCallActivation card so renderiza quando
--   apiKeys.length > 0. Users sem key nunca veem o card. Weekend 3
--   fix nao consegue subir activation rate.
--
-- Solucao: gerar 1 key pra cada novo user via trigger AFTER INSERT
--   em auth.users. User cadastra e ja sai com "Default key" pronta.
--   FirstCallActivation aparece pra todos = ativacao forcada.
--
-- Aplicar em PROD via Supabase SQL Editor.
-- ============================================================

CREATE OR REPLACE FUNCTION public.create_default_api_key()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  random_suffix TEXT;
BEGIN
  -- Gera 32 chars random pro suffix da key (formato ff_<32 chars>)
  -- Usa encode + gen_random_bytes que sao built-in do Postgres.
  random_suffix := encode(gen_random_bytes(16), 'hex');

  INSERT INTO public.api_keys (user_id, key, name, is_active)
  VALUES (
    NEW.id,
    'ff_' || random_suffix,
    'Default key',
    true
  );

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Nao bloqueia signup se create key falhar (RLS, race condition, etc).
  -- Log via NOTICE pro Postgres log.
  RAISE NOTICE 'create_default_api_key failed for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_default_key ON auth.users;

CREATE TRIGGER on_auth_user_created_default_key
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.create_default_api_key();

-- Backfill: cria key pra users EXISTENTES que ainda nao tem key ativa.
-- Isso destrava os 200+ users cadastrados que nunca criaram key manualmente.
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

-- Verificacao pos-migration
SELECT
  (SELECT COUNT(*) FROM auth.users) AS total_users,
  (SELECT COUNT(DISTINCT user_id) FROM public.api_keys WHERE is_active = true) AS users_with_active_key,
  (SELECT COUNT(*) FROM public.api_keys WHERE is_active = true) AS total_active_keys;
-- Esperado: total_users == users_with_active_key (todos tem pelo menos 1 key)
