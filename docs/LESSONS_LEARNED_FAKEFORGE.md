# FakeForge — Lessons Learned

**Escrito pra:** Everton, referência pra próximos projetos SaaS
**Data:** 2026-09-28
**Contexto:** ~2 meses de projeto ativo, 656 users, R$29 MRR, várias descobertas de infra e crescimento que valem transportar

---

## TL;DR — se ler só uma coisa

1. **Free tier de qualquer serviço é armadilha em produção**. Orça $50-100/mês upfront (Supabase Pro + Resend + domínio).
2. **Data-driven diagnostic vence intuição**. Rode query SQL antes de teorizar sobre queda de crescimento.
3. **Programmatic SEO com vertical presets** foi o único canal que escalou tráfego previsivelmente.
4. **Email funnel só funciona com estrutura de venda**, não nurture "educacional".
5. **Self-service > formulário de contato** em enterprise. Assinar em 3 cliques > "fala com sales".
6. **Infra silenciosa te sabota**. SMTP cap, cache CDN, whitelist de analytics — nada avisa quando quebra.

---

## 1. Growth & aquisição

### 1.1 O que funcionou

**Programmatic SEO com presets verticais**
- 60+ landings dev-specific (Fase 1 CPF/CNPJ/RG + Fase 2 endereço/CEP)
- Cada landing ataca 1 long-tail keyword específica ("gerador cpf python", "cnpj alfanumérico 2026")
- Estrutura repetível: hero + preset code + "copy as..." + FAQ
- Ubersuggest audit mostrou 164% traffic growth em 30 dias

**Email funnel D3-D30 com estrutura de venda**
- 5 emails: Hook (D3) → Value (D7) → Objection (D14) → Urgency+Offer (D16) → Retention (D30)
- Cupom CNPJ2026 = 30% off primeiro mês, válido 48h após D14
- Validação de sucesso: R$20,30 checkout completado via Stripe

**B2B enterprise motion (novo esta semana)**
- Landing /empresa + 3 tiers self-service (Starter R$500 / Growth R$1500 / Scale R$5000)
- Assinar direto no Stripe. Form de contato como último recurso (on-premise, contrato BR)
- Docs: B2B_ICP, B2B_OUTREACH_TEMPLATES, B2B_TARGETS

### 1.2 O que NÃO funcionou

**AdSense**
- 2 rejections seguidas mesmo depois de sanitizar linguagem "fake/falso"
- Google não explica motivo. Não insistir. Pivô pra EthicalAds (precisa 50k pageviews)

**Nurture "educacional" sem venda**
- Primeira versão do funnel era educacional, sem CTA claro
- Zero conversão. Reescrever com Hook/Value/Objection/Urgency/Close estrutura Hopkins/Cialdini/Sugarman

**Pretender que bots eram o problema**
- Análise inicial esperava 50-70% bot ratio
- Real: 20% bots
- Ajuste: parar de filtrar, começar a escalar tráfego. Volume > qualidade nesse estágio.

### 1.3 Playbook sequenciado que funcionou

```
Semana 1-2: 1 landing hero + SDK básico
Semana 3-4: Sistema de presets (fintech, ecom, customer)
Semana 5-6: Fase 1 landings (5 verticais × top-of-funnel keywords)
Semana 7-8: Fase 2 landings (endereço, CEP, deep dive)
Semana 9-10: Email funnel D3-D30 + Stripe cupom
Semana 11-12: B2B enterprise motion self-service
Sempre: monitorar Ubersuggest, GSC, dashboard admin
```

---

## 2. Infra & stack técnica

### 2.1 Stack que funcionou

| Camada | Ferramenta | Custo/mês | Motivo |
|---|---|---|---|
| Frontend | Next.js 16 (App Router) + Turbopack | 0 | Server components + edge routing |
| Hosting | Vercel Pro | $20 | Deploy automático + cron jobs + edge functions |
| DB + Auth | Supabase Pro | $25 | Postgres + PostgREST + Auth em 1 stack |
| Email | Resend | 0-$20 | 3k grátis/dia, Custom SMTP pra Supabase Auth |
| Pagamentos | Stripe | 3.99% | BRL nativo + coupons + subscription billing |
| Analytics | Supabase table + admin dashboard próprio | 0 | Sem GA, controle total |
| SEO tools | Ubersuggest | $12 | Audit + keyword tracking |
| Domínio | Registro.br | R$40/ano | .com.br |

**Total mensal:** $57-77 USD (~R$285-385)

### 2.2 Gotchas que descobrimos (documentar sempre)

**Supabase Auth built-in SMTP tem cap severo**
- Free tier: ~9-10 emails/dia
- Sintoma: dashboard mostra exatamente o mesmo número de novos usuários por vários dias seguidos
- Fix: Custom SMTP via Resend obrigatório antes de escalar

**Analytics whitelist gotcha**
- Todo `track()` novo no frontend precisa entrar no ALLOWED_TYPES do `/api/events/route.ts`
- Se esquecer: evento descartado silenciosamente, sem erro

**Vercel CSS cache**
- styles.css/nav.js não são immutable
- Precisa cache-bust com `?v=N` + `Cache-Control: must-revalidate`

**Supabase views com security_invoker**
- Views que acessam auth.users quebram com security_invoker=true
- Fix: usar REVOKE explícito + Ignore no Advisor

**"Needs Attention" em env var da Vercel**
- Feature roda em fail-open (não bloqueia mas também não protege)
- Não gera erro visível — só descobri porque olhei o dashboard

**Domain verified em conta errada do Resend**
- 2 contas Resend = fácil configurar API key da errada
- Erro Gomail 550 "domain not verified" quando deveria estar
- Fix: reusa a conta antiga em vez de criar nova

### 2.3 Padrão de env vars pra qualquer SaaS BR

```
NEXT_PUBLIC_BASE_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PRICE_[TIER1|TIER2|...]  # 1 por plano
RESEND_API_KEY
CRON_SECRET
NEXT_PUBLIC_RECAPTCHA_SITE_KEY  # opcional
RECAPTCHA_SECRET_KEY            # opcional
```

Sempre marca Production separado de Preview. Custom SMTP no Supabase evita cap.

---

## 3. Diagnóstico & data — o pattern que ganhou

### 3.1 Framework: SQL → Hypothesis → Confirm → Act

Descobrimos o SMTP cap de 9/dia assim:

1. **Sintoma** (dashboard admin): "novos usuários parou de crescer"
2. **Query 1** (sanity check): `SELECT day, COUNT(*) FROM auth.users GROUP BY day LIMIT 14`
   - Resultado: exatamente 9 por 4 dias seguidos
3. **Query 2** (isolar variável): checar signup_blocked_bot events
   - Resultado: 0 blocks → reCAPTCHA fail-open, não era ele
4. **Query 3** (funil completo): signup_click vs users_criados vs bloqueados
   - Resultado: 235 → 97 → 0 = 138 users perdidos silenciosamente
5. **Repro manual**: aba anônima → /login → erro "email rate limit exceeded"
6. **Confirmação estrutural**: Supabase Auth Logs → "Gomail: could not send email"
7. **Fix**: Custom SMTP + upgrade Pro

**Lesson**: em vez de teorizar "deve ser reCAPTCHA/deve ser bot/deve ser SEO", rodar SQL primeiro. 20 min de diagnóstico > 2 semanas de guessing.

### 3.2 Dashboard admin sempre com essas seções

- Metrics: users total, MAU, MRR, pagantes
- Chart daily: novos usuários (90d) + API calls (90d) — timezone São Paulo
- Tipos de uso (30d) por preset
- Usuários recentes (30 mais recentes com metadata)
- Funil de conversão (últimos 30d): geração → copy → signup → upgrade
- Eventos brutos (30d) — tudo que passa pelo /api/events
- Bot ratio (sample de anon usage)

### 3.3 Queries salvas que valem manter

Todas em `docs/sql/` versionadas no git:
- 008_admin_views_90d.sql (dashboards)
- 012_admin_views_timezone_fix.sql (São Paulo TZ)
- Weekly backup automation

---

## 4. Copywriting & landings

### 4.1 Framework direct-response que funcionou

**Hero de landing SEO específica:**
1. **Headline com keyword exato** ("Gerador de CPF em Python")
2. **Subheadline com reason-why** (Hopkins: "porque nossa API faz X sem Y")
3. **Card de exemplo com código pronto** (copiar-cola em 3 seg)
4. **"Copy as" dropdown** (curl, python, js, csv, json, sql, postman)
5. **FAQ com objeções reais** (Cialdini: reciprocity + authority)
6. **CTA duplo**: signup (upsell soft) + tentar sem cadastro (activation)

**Email de sales:**
- **D3 Hook**: dor específica ("seus testes ainda usam CPF fake?")
- **D7 Value**: 1 novidade técnica sem pitch
- **D14 Objection**: destrava dúvida comum + cupom com scarcity
- **D16 Close**: urgência real (48h pra usar cupom)
- **D30 Retention**: check-in ou digest

### 4.2 Voice guidelines

- PT-BR com acentos sempre
- Sem em-dashes (usa vírgula ou parênteses)
- Banidos: leverage, optimize, robusto, seamless, empower, escalável, sinergia
- Assinatura: "Everton, fundador do FakeForge"
- Sem menção a empregador atual (SafeRide etc.)

### 4.3 Anti-pattern de landing que não funcionou

**Landing genérica cobrindo N verticais**
- "Gerador de dados fake" tenta rankear tudo, rankeia nada
- Fix: 1 landing por preset × 1 keyword long-tail
- 60+ páginas > 1 mega-página

**Título longo demais no SEO**
- Ubersuggest audit flagou títulos > 60 chars em CNH/RG/preset-ecom
- Google trunca. CTR cai. Corrigir sempre pra 50-58 chars

---

## 5. Anti-patterns & mistakes

### 5.1 O que eu (Claude) recomendei que NÃO funcionou

- **AdSense retry**: 2 rejections, insisti, deveria ter pivotado antes
- **Filtrar bots como priority #1**: bots eram 20%, não 50-70%, gastei tempo demais nisso
- **Nurture educacional**: primeira versão do funnel sem estrutura de venda, zero conversão

### 5.2 Ações que valeram cada minuto

- SQL diagnostic primeiro (não teoriza)
- Upgrade Supabase Pro depois do cap descoberto
- Enterprise self-service ao invés de contact form
- Email typo validation no client (bounce rate mitigation)
- Documentar gotchas na hora que descobre

### 5.3 Priorização com escassez de tempo

Quando tem 3 alavancas competindo:
1. Se uma tem gate estrutural (SMTP cap, quota estourada): resolve primeiro
2. Se todas dependem de tráfego: SEO
3. Se SEO já saturado no curto prazo: B2B outreach
4. Ads pagos = último recurso (queima capital que founder solo não tem)

---

## 6. Cost breakdown pra próximo SaaS BR

### 6.1 Mês 1 (validação)

- Vercel Hobby: $0
- Supabase Free: $0
- Resend Free: $0 (100 emails/dia)
- Domínio .com.br: R$40/ano
- **Total: R$3-5/mês**

Suficiente pra 0-100 usuários validando produto.

### 6.2 Mês 2-6 (crescimento)

- Vercel Pro: $20/mês
- Supabase Pro: $25/mês
- Resend $20/mês (50k emails)
- Domínio: R$3/mês pro rata
- Ubersuggest: $12/mês
- **Total: ~R$400/mês**

Suporta 100-2k usuários ativos.

### 6.3 Sinais de que precisa upgradar

- Supabase: signups exatos por vários dias (SMTP cap) ou "usage exceeded" banner
- Vercel: build minutes esgotando ou preview deploys sem funcionar
- Resend: bounce rate > 5% ou domain sending limit warning
- Domain: expiração (setup auto-renew SEMPRE)

---

## 7. Checklist pro próximo SaaS BR (dia 1)

Se eu começasse do zero amanhã:

**Setup infra (dia 1, 3h):**
- [ ] Registra domínio .com.br + configura auto-renew
- [ ] Verifica domain no Resend (root + subdomain send.)
- [ ] Cria projeto Supabase Free (upgrade Pro quando 500 users)
- [ ] Cria projeto Vercel + conecta GitHub repo
- [ ] Custom SMTP no Supabase apontando pro Resend (não usa built-in NUNCA)
- [ ] Env vars pattern padrão em Production + Preview
- [ ] Google Search Console + sitemap.xml

**Setup produto (semana 1):**
- [ ] Next.js 16 App Router + Tailwind + TypeScript
- [ ] Supabase Auth (magic link, sem senha)
- [ ] Stripe subscription + webhook
- [ ] Table `funnel_events` + `/api/events` com whitelist
- [ ] Dashboard admin básico (metrics, chart daily, funil)
- [ ] Sistema de landings programmatic (1 preset = 1 landing)

**Growth (semana 2+):**
- [ ] Direct response landings com keyword long-tail
- [ ] Email funnel 5-step com estrutura de venda
- [ ] Cupom de urgência com expiração real
- [ ] B2B tier self-service via Stripe (não contact form)
- [ ] Weekly Ubersuggest audit

**Sempre:**
- [ ] Documentar gotchas na hora que descobre
- [ ] Query SQL antes de teorizar sobre queda
- [ ] Testar signup em aba anônima após qualquer deploy no /login
- [ ] Monitorar bounce rate no Resend semanalmente

---

## Referências no próprio projeto

- Landings: `src/app/(landings)/*/page.tsx`
- Email funnel: `docs/EMAIL_FUNNEL_SPEC.md`
- B2B: `docs/B2B_ICP.md`, `docs/B2B_OUTREACH_TEMPLATES.md`
- SQL views: `docs/sql/012_admin_views_timezone_fix.sql`
- Admin dashboard: `src/app/admin/AdminDashboard.tsx`
- Checkout flow: `src/app/checkout/` + `src/app/api/checkout/route.ts`
- Login validation: `src/app/login/page.tsx` (typo + disposable check)
