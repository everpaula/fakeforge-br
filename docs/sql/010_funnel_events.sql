-- ============================================================
-- 010_funnel_events.sql
-- ============================================================
-- Rastreamento de eventos do funil de conversão. Popula os
-- gráficos e cohortes de análise no /admin.
--
-- Escopo: eventos comportamentais (não substitui anonymous_usage,
-- que rastreia GERAÇÕES). Aqui a gente rastreia CONVERSÃO:
-- clique em signup, cópia de resultado, hit de rate limit, etc.
--
-- Rodar em PROD via Supabase SQL Editor.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.funnel_events (
  id          BIGSERIAL PRIMARY KEY,
  event_type  TEXT NOT NULL,        -- signup_click, copy_button_clicked, rate_limit_hit, nudge_shown/clicked/dismissed, session_start, generator_type_touched, page_view
  session_id  TEXT,                 -- cookie/localStorage hash pra correlacionar anonymous
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  source_page TEXT,                 -- URL relativa (/gerador-cpf, /pricing, etc)
  ip_hash     TEXT,                 -- hash do IP pra unicidade sem PII
  event_data  JSONB DEFAULT '{}'::jsonb,  -- generator_type, format, quantity, etc
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices otimizados pros queries mais comuns
CREATE INDEX IF NOT EXISTS idx_funnel_events_type_created
  ON public.funnel_events(event_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_funnel_events_session
  ON public.funnel_events(session_id, created_at DESC)
  WHERE session_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_funnel_events_user
  ON public.funnel_events(user_id, created_at DESC)
  WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_funnel_events_source
  ON public.funnel_events(source_page, created_at DESC)
  WHERE source_page IS NOT NULL;

-- RLS: só service_role escreve/lê. Client escreve via endpoint /api/events
-- que usa SERVICE_ROLE_KEY (bypass RLS).
ALTER TABLE public.funnel_events ENABLE ROW LEVEL SECURITY;

-- Verificação
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'funnel_events'
ORDER BY ordinal_position;
