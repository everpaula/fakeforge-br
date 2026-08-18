-- ============================================================
-- 011_sent_emails.sql
-- ============================================================
-- Log de emails automatizados enviados. Serve pra:
-- 1) Não reenviar o mesmo template pro mesmo user (dedup)
-- 2) Rastreio de deliverability (resend_id linka ao dashboard Resend)
-- 3) Base pra futuras métricas de open/click rate
--
-- Rodar em PROD via Supabase SQL Editor.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.sent_emails (
  id             BIGSERIAL PRIMARY KEY,
  user_id        UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  template       TEXT NOT NULL,     -- "activation_t10", "activation_t72h", "upsell_t14d", etc
  recipient      TEXT NOT NULL,     -- email do destinatário (redundante mas útil pra debug)
  resend_id      TEXT,              -- ID retornado pela Resend API
  status         TEXT DEFAULT 'sent', -- sent, failed, bounced
  metadata       JSONB DEFAULT '{}'::jsonb,
  sent_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Unicidade: mesmo user + mesmo template só uma vez (evita duplicata em cron retries)
CREATE UNIQUE INDEX IF NOT EXISTS idx_sent_emails_user_template
  ON public.sent_emails(user_id, template);

CREATE INDEX IF NOT EXISTS idx_sent_emails_sent_at
  ON public.sent_emails(sent_at DESC);

ALTER TABLE public.sent_emails ENABLE ROW LEVEL SECURITY;

-- Verificação
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'sent_emails'
ORDER BY ordinal_position;
