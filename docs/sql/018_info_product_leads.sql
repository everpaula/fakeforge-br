-- ============================================================
-- 018_info_product_leads.sql
-- ============================================================
-- Lista de espera do info product em validação (out/2026):
--   micro-saas -> /como-criar-micro-saas
--
-- Meta da validação: 200 leads em 60-90 dias. A coluna product existe
-- pra aceitar um segundo produto depois sem criar outra tabela (basta
-- trocar o CHECK).
--
-- Rodar em PROD via Supabase SQL Editor.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.info_product_leads (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email         TEXT NOT NULL,
  product       TEXT NOT NULL CHECK (product IN ('micro-saas')),
  situation     TEXT,
  budget        TEXT,
  utm_source    TEXT,
  utm_medium    TEXT,
  utm_campaign  TEXT,
  referrer      TEXT,
  landing_path  TEXT,
  ip_hash       TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Um email entra uma vez só por produto
CREATE UNIQUE INDEX IF NOT EXISTS idx_info_product_leads_email_product
  ON public.info_product_leads(email, product);

CREATE INDEX IF NOT EXISTS idx_info_product_leads_created_at
  ON public.info_product_leads(created_at DESC);

-- Sem policies de propósito: só service role (via /api/waitlist) lê e escreve
ALTER TABLE public.info_product_leads ENABLE ROW LEVEL SECURITY;

-- Placar da validação (TZ São Paulo)
-- SELECT product,
--        COALESCE(utm_source, 'direto/orgânico') AS origem,
--        COUNT(*) AS leads,
--        COUNT(*) FILTER (WHERE budget IN ('97-297', '297-997', '997+')) AS dispostos_a_pagar,
--        MIN(created_at AT TIME ZONE 'America/Sao_Paulo')::date AS primeiro,
--        MAX(created_at AT TIME ZONE 'America/Sao_Paulo')::date AS ultimo
-- FROM public.info_product_leads
-- GROUP BY 1, 2
-- ORDER BY 1, 3 DESC;
