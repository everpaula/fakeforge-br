-- ============================================================
-- 009_subscriptions_stripe.sql
-- ============================================================
-- Adiciona colunas Stripe na tabela subscriptions. Mantém as
-- colunas mp_* existentes por compat (subscriptions históricas do
-- Mercado Pago continuam válidas). Novos subs preenchem as stripe_*.
--
-- Contexto: empresa BR foi fechada, MP-BR não é mais viável.
-- Migramos processador pra Stripe US (Plenor Group LLC).
--
-- Rodar em PROD via Supabase SQL Editor.
-- ============================================================

ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_price_id TEXT;

-- Índices pra lookup rápido por stripe_customer_id em webhooks
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer
  ON public.subscriptions(stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription
  ON public.subscriptions(stripe_subscription_id)
  WHERE stripe_subscription_id IS NOT NULL;

-- Verificação
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'subscriptions'
ORDER BY ordinal_position;
