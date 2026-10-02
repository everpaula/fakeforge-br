-- ============================================================
-- 017_add_email_marketing_flag.sql
-- ============================================================
-- Lista local de supressão de email. O código (src/lib/email-suppression.ts)
-- consulta esta tabela antes de qualquer envio dos crons, e o webhook do
-- Resend grava aqui todo bounce/complaint (inclusive de magic link e
-- confirmação de signup, que não têm linha em sent_emails).
--
-- Por que tabela em public e não coluna em auth.users: o schema auth é
-- gerenciado pelo Supabase, e ALTER TABLE nele pode quebrar em upgrades.
--
-- Rodar em PROD via Supabase SQL Editor. Seguro rodar mais de uma vez.
-- Sem esta tabela o código continua funcionando (só perde a lista local).
-- ============================================================

CREATE TABLE IF NOT EXISTS public.email_suppressions (
  email       TEXT PRIMARY KEY,                      -- sempre em minúsculas
  reason      TEXT NOT NULL,                         -- bounced, complained, bot, manual
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  detail      JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_suppressions_user
  ON public.email_suppressions(user_id)
  WHERE user_id IS NOT NULL;

-- Só service_role acessa (bypass RLS). Nenhuma policy = nenhum acesso anon/authenticated.
ALTER TABLE public.email_suppressions ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------
-- Backfill 1: quem já bounceou ou reclamou no funil
-- ------------------------------------------------------------
INSERT INTO public.email_suppressions (email, reason, user_id, detail)
SELECT DISTINCT ON (lower(recipient))
  lower(recipient), status, user_id, jsonb_build_object('source', 'sent_emails_backfill', 'template', template)
FROM public.sent_emails
WHERE status IN ('bounced', 'complained')
ORDER BY lower(recipient), sent_at DESC
ON CONFLICT (email) DO NOTHING;

-- ------------------------------------------------------------
-- Backfill 2: emails com typo de provedor ou 5+ dígitos (mesma regra do código)
-- ------------------------------------------------------------
INSERT INTO public.email_suppressions (email, reason, user_id, detail)
SELECT lower(email), 'bot', id, jsonb_build_object('source', 'pattern_backfill')
FROM auth.users
WHERE email ~* '@(gmil|gmial|gamil|gnail|hotnail|hotmial|yahho|yaho|outlok|outloook)\.(com|com\.br)$'
   OR email ~* '[0-9]{5,}@'
ON CONFLICT (email) DO NOTHING;

-- ------------------------------------------------------------
-- Backfill 3 (OPCIONAL): bots com score >= 3 da query 7 do arquivo 016.
-- Revise a lista da query 7 ANTES. Se estiver ok, descomente e rode.
-- ------------------------------------------------------------
-- INSERT INTO public.email_suppressions (email, reason, user_id, detail)
-- SELECT lower(s.email), 'bot', s.id, jsonb_build_object('source', 'bot_score', 'score', s.bot_score)
-- FROM ( ...cole aqui o SELECT da query 7 do 016... ) s
-- ON CONFLICT (email) DO NOTHING;

-- Verificação
SELECT reason, COUNT(*) AS total
FROM public.email_suppressions
GROUP BY reason
ORDER BY total DESC;
