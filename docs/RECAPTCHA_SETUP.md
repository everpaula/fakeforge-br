# reCAPTCHA v3 Setup

Sprint 7 P1 anti-bot: reCAPTCHA v3 no signup pra bloquear bots que criam contas em massa.

## Status atual (2026-09-22)

- ✅ Endpoint `/api/auth/verify-recaptcha` criado
- ✅ Login page integrada (invisible v3, executa em signup magic link + GitHub OAuth)
- ✅ Feature-flagged: sem env vars, código passa direto (não bloqueia)
- ✅ Fail-open: se Google API estiver fora, permite passar (não bloqueia signup real)

## Passos manuais que você precisa fazer

### 1. Criar site reCAPTCHA (~5 min)

1. Ir em https://www.google.com/recaptcha/admin/create
2. Login com `evertonsilvapaula@gmail.com`
3. Preencher:
   - **Label:** fakeforge.com.br
   - **reCAPTCHA type:** Selecionar **reCAPTCHA v3**
   - **Domains:** adicionar 2 linhas:
     ```
     fakeforge.com.br
     localhost
     ```
4. Aceitar termos → Submit

Google retorna 2 chaves:
- **Site Key** (pública, começa com `6L...`)
- **Secret Key** (privada, começa com `6L...`)

### 2. Configurar env vars no Vercel

Vercel dashboard → fakeforge-br → Settings → Environment Variables

Adicionar:

```
NEXT_PUBLIC_RECAPTCHA_SITE_KEY = 6LXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
RECAPTCHA_SECRET_KEY = 6LXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

Environment: **Production** (só). Não colocar em Preview/Dev pra não gastar quota do reCAPTCHA em builds.

### 3. Redeploy Vercel

Após adicionar env vars, redeploy manual (ou espera próximo push).

## Como funciona

1. User abre `/login`
2. Script do Google carrega em background (invisible)
3. User digita email + clica "Entrar com email"
4. Frontend executa reCAPTCHA silenciosamente → pega token
5. Frontend envia token pro `/api/auth/verify-recaptcha`
6. Backend verifica token com Google API
7. Se score >= 0.5 → passa pro signup Supabase
8. Se score < 0.5 → bloqueia, mostra erro genérico

**Score threshold: 0.5.** Google recomenda esse valor pra maioria dos sites. Se quiser ajustar, editar `SCORE_THRESHOLD` em `src/app/api/auth/verify-recaptcha/route.ts`.

## Monitoramento

Após configurar:
- Dashboard reCAPTCHA (https://www.google.com/recaptcha/admin/) mostra request volume + distribution de scores
- Track event `signup_blocked_bot` no analytics local (via `/api/events`)
- Bot analysis dashboard (`/admin/vc`) mostra número de bots detectados retroativamente

## Rollback rápido

Se reCAPTCHA bloquear muitos users reais (falsos positivos):
1. Remover env vars `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` e `RECAPTCHA_SECRET_KEY` no Vercel
2. Redeploy
3. Signup volta a funcionar sem verificação

Sem código pra reverter — tudo gated por env var.

## Expected impact

Baseado no audit 22/09:
- Base atual 584 users, com ~50-70% suspected bots (score >=3 na análise atual)
- reCAPTCHA v3 bloqueia ~85-95% de bots baseados em headless browsers, iOS shortcut, curl scripts, farming farms
- Bots mais sofisticados (residential proxies + human-solve) passam mas custam caro pro atacante — não escala pra dev tool BR

Após 1 semana com reCAPTCHA ativo, esperamos:
- Signups totais reduzir 20-40% (bloqueio de bots)
- Ativação real subir pra ~15-25% (denominador limpo)
- Métricas do VC dashboard viram confiáveis

## Alternativa se reCAPTCHA falhar

Se Google reCAPTCHA bloquear demais user real ou não pegar bots suficientes:
- **hCaptcha** (https://hcaptcha.com) — drop-in replacement, privacy-friendly, mesmo pricing
- **Cloudflare Turnstile** — free, invisible, sem cognitive tests
- **Custom honeypot** — campo escondido que só bot preenche (menos eficaz)
