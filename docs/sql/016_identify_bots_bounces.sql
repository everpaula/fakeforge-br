-- ============================================================
-- 016_identify_bots_bounces.sql
-- ============================================================
-- SOMENTE LEITURA. Diagnóstico de bounce rate (Resend: risco >5%, suspensão >10%).
-- Rodar no Supabase SQL Editor, query por query.
--
-- Nota sobre reCAPTCHA: o score NÃO é gravado por usuário. Signups bloqueados
-- (signup_blocked_bot) nem chegam a criar linha em auth.users, então não dá
-- pra juntar evento com user. Os "bots" que passaram são identificados pela
-- mesma heurística de src/app/api/admin/bot-analysis/route.ts (score >= 3).
-- ============================================================

-- ------------------------------------------------------------
-- Query 1: usuários com cara de bot (heurística score >= 3)
-- Mesma lógica do endpoint /api/admin/bot-analysis.
-- ------------------------------------------------------------
WITH base AS (
  SELECT
    u.id,
    u.email,
    u.created_at,
    u.last_sign_in_at,
    (u.email_confirmed_at IS NOT NULL) AS confirmed,
    split_part(lower(u.email), '@', 1) AS local_part,
    split_part(lower(u.email), '@', 2) AS domain,
    EXISTS (SELECT 1 FROM public.api_keys k WHERE k.user_id = u.id AND k.is_active) AS has_key,
    (SELECT COUNT(*) FROM public.api_usage a WHERE a.user_id = u.id) AS calls
  FROM auth.users u
),
scored AS (
  SELECT *,
    (CASE
       WHEN local_part ~ '\d{4,}$' THEN 2
       WHEN local_part ~ '\d{2,3}$'
            AND domain IN ('gmail.com','outlook.com','yahoo.com','hotmail.com') THEN 1
       ELSE 0
     END)
    + (CASE WHEN has_key AND calls = 0 THEN 1 ELSE 0 END)
    + (CASE WHEN created_at > NOW() - INTERVAL '7 days' AND NOT confirmed THEN 1 ELSE 0 END)
    + (CASE WHEN confirmed AND last_sign_in_at IS NULL THEN 1 ELSE 0 END)
    AS bot_score
  FROM base
)
SELECT id, email, created_at, confirmed, last_sign_in_at, has_key, calls, bot_score
FROM scored
WHERE bot_score >= 3
ORDER BY bot_score DESC, created_at DESC;

-- ------------------------------------------------------------
-- Query 1b: signups barrados pelo reCAPTCHA (contexto, sem user_id)
-- ------------------------------------------------------------
SELECT
  date_trunc('day', created_at) AS dia,
  event_type,
  COUNT(*) AS eventos,
  ROUND(AVG((event_data->>'score')::numeric), 2) AS score_medio
FROM public.funnel_events
WHERE event_type IN ('signup_blocked_bot', 'signup_blocked_disposable')
  AND created_at > NOW() - INTERVAL '30 days'
GROUP BY 1, 2
ORDER BY 1 DESC, 2;

-- ------------------------------------------------------------
-- Query 2: emails que já bouncearam ou reclamaram (funil)
-- ------------------------------------------------------------
SELECT DISTINCT ON (lower(se.recipient))
  se.user_id, se.recipient AS email, se.status, se.template, se.sent_at
FROM public.sent_emails se
WHERE se.status IN ('bounced', 'complained')
ORDER BY lower(se.recipient), se.sent_at DESC;

-- ------------------------------------------------------------
-- Query 3: padrões de email suspeitos ainda na base
-- Mesma regra usada em src/lib/email-suppression.ts (isSuspiciousEmail).
-- ------------------------------------------------------------
SELECT id, email, created_at, email_confirmed_at IS NOT NULL AS confirmed
FROM auth.users
WHERE email ~* '@(gmil|gmial|gamil|gnail|hotnail|hotmial|yahho|yaho|outlok|outloook)\.(com|com\.br)$'
   OR email ~* '[0-9]{5,}@'
ORDER BY created_at DESC;

-- ------------------------------------------------------------
-- Query 4: baseline de bounce nos últimos 30 dias (só emails do funil)
-- Magic link e confirmação de signup NÃO aparecem aqui. Pra esses, o
-- número vem do dashboard do Resend.
-- ------------------------------------------------------------
SELECT
  COUNT(DISTINCT user_id) FILTER (WHERE status = 'bounced')    AS users_bounced,
  COUNT(DISTINCT user_id) FILTER (WHERE status = 'complained') AS users_complained,
  COUNT(*)                                                     AS total_sends,
  ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'bounced') / NULLIF(COUNT(*), 0), 2) AS pct_bounced
FROM public.sent_emails
WHERE sent_at > NOW() - INTERVAL '30 days';

-- ------------------------------------------------------------
-- Query 5: bounces por template (onde o dano está concentrado)
-- ------------------------------------------------------------
SELECT
  template,
  COUNT(*) AS enviados,
  COUNT(*) FILTER (WHERE status = 'bounced') AS bounced,
  ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'bounced') / NULLIF(COUNT(*), 0), 2) AS pct
FROM public.sent_emails
WHERE sent_at > NOW() - INTERVAL '30 days'
GROUP BY template
ORDER BY bounced DESC;

-- ------------------------------------------------------------
-- Query 6: lista pra colar em Resend > Suppressions (um email por linha)
-- Bounced + complained do funil.
-- ------------------------------------------------------------
SELECT DISTINCT lower(recipient) AS email
FROM public.sent_emails
WHERE status IN ('bounced', 'complained')
ORDER BY 1;

-- ------------------------------------------------------------
-- Query 7: bots que ainda receberiam email nos próximos dias
-- (confirmados, sem bounce, com score >= 3). Candidatos a suppression.
-- ------------------------------------------------------------
WITH base AS (
  SELECT
    u.id, u.email, u.created_at, u.last_sign_in_at,
    (u.email_confirmed_at IS NOT NULL) AS confirmed,
    split_part(lower(u.email), '@', 1) AS local_part,
    split_part(lower(u.email), '@', 2) AS domain,
    EXISTS (SELECT 1 FROM public.api_keys k WHERE k.user_id = u.id AND k.is_active) AS has_key,
    (SELECT COUNT(*) FROM public.api_usage a WHERE a.user_id = u.id) AS calls
  FROM auth.users u
),
scored AS (
  SELECT *,
    (CASE
       WHEN local_part ~ '\d{4,}$' THEN 2
       WHEN local_part ~ '\d{2,3}$'
            AND domain IN ('gmail.com','outlook.com','yahoo.com','hotmail.com') THEN 1
       ELSE 0
     END)
    + (CASE WHEN has_key AND calls = 0 THEN 1 ELSE 0 END)
    + (CASE WHEN created_at > NOW() - INTERVAL '7 days' AND NOT confirmed THEN 1 ELSE 0 END)
    + (CASE WHEN confirmed AND last_sign_in_at IS NULL THEN 1 ELSE 0 END)
    AS bot_score
  FROM base
)
SELECT s.id, s.email, s.created_at, s.bot_score
FROM scored s
WHERE s.bot_score >= 3
  AND s.confirmed
  AND NOT EXISTS (
    SELECT 1 FROM public.sent_emails se
    WHERE se.user_id = s.id AND se.status IN ('bounced', 'complained')
  )
ORDER BY s.created_at DESC;
