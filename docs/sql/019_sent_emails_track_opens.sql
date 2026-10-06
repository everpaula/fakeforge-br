-- 019: Habilita tracking de opens/clicks em sent_emails
--
-- Problema: webhook Resend só atualizava sent_emails.status pra bounced/complained.
-- Opens e clicks só caiam em funnel_events se o template fosse "nurture_*".
-- Resultado: 374 activation_t10 + 119 reactivation_t24h = 493 emails sem tracking
-- de engagement no banco. VC dashboard mostrava 0% open rate mesmo com Resend
-- account marcando 40-51% diário desde 01/out.
--
-- Fix (parte 1 — schema): adiciona colunas opened_at e clicked_at em sent_emails.
-- Webhook atualiza essas colunas pra TODOS os templates, não só nurture_*.

ALTER TABLE public.sent_emails
  ADD COLUMN IF NOT EXISTS opened_at timestamptz,
  ADD COLUMN IF NOT EXISTS clicked_at timestamptz;

-- Índice parcial pra queries do VC dashboard do tipo "opens por template"
CREATE INDEX IF NOT EXISTS idx_sent_emails_opened
  ON public.sent_emails(template, opened_at)
  WHERE opened_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_sent_emails_clicked
  ON public.sent_emails(template, clicked_at)
  WHERE clicked_at IS NOT NULL;

COMMENT ON COLUMN public.sent_emails.opened_at IS
  'Primeiro open rastreado via webhook Resend. NULL = ainda não aberto (ou webhook não configurado antes de 01/out/2026).';
COMMENT ON COLUMN public.sent_emails.clicked_at IS
  'Primeiro click em link rastreado via webhook Resend. NULL = ainda não clicou.';
