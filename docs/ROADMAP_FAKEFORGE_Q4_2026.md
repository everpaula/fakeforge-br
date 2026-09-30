# Roadmap FakeForge — Q4 2026 e além

**Escrito pra:** Everton, referência estratégica pra próximos 90 dias
**Data:** 2026-09-30
**Meta declarada:** 200 paying customers até dezembro/2026
**Estado atual:** 656 users, 1 paying, R$29 MRR

---

## 1. Reality check matemático

**Meta:** 200 pagantes em ~90 dias = 2,2 novos pagantes/dia = ~15/semana

**Path A — Maintain 0,15% conversion:**
- Precisa 133.000 usuários em 90d
- Impossível organicamente

**Path B — Aggressive conversion + volume (viável):**
- Signup pós-SMTP unblock: 30-50/dia (validar em 24-48h)
- 90 dias × 40 avg = 3.600 novos usuários
- Se conversion Free → Dev sobe pra 3-5% = 108-180 pagantes
- Enterprise adiciona 5-15 = 5-15 pagantes B2B
- **Total realista: 120-195 pagantes até Dec 2026**

**Path C — Miss meta mas mantém trajetória:**
- Signups estagnam em 15-20/dia
- Conversion melhora só pra 1-2%
- Total: 30-60 pagantes até Dec 2026, atinge 200 em Q1-Q2 2027

**Meu read:** Path B é atingível se você shippar as 3 alavancas certas nas próximas 4 semanas. Path C é o piso.

---

## 2. Três tracks em paralelo (Q4 2026)

### TRACK A — SCALE (aumentar volume de entrada)

**Alavancas:**
1. **AEO push** — AI visibility cresceu 3x MoM em setembro (top 5 páginas somam 14k impressions AI). Multiplicar.
2. **Programmatic SEO Fase 4** — Validator Hub ou vertical completion
3. **Continued Fase 3 pattern** — replicar em 3-5 verticais novos

**Framework AEO (skill loaded):** 5 patterns que geram citação:
- ✅ Comparative tables (você já usa)
- ✅ Step-by-step procedures (algoritmos)
- ✅ Definitional content (páginas root)
- ⚠️ Statistics with sources (falta)
- ⚠️ Lists with explanations (falta)

**Framework Programmatic SEO (skill loaded):** 6-zone template + 3-of-5 uniqueness rule + hub-and-spoke linking. FakeForge já opera esse padrão bem.

**Ação track A (próximos 60 dias):**

| Semana | Entrega | Impacto esperado |
|---|---|---|
| 1-2 | Request Indexing 13 URLs no GSC | +5-10% indexação |
| 1-2 | Retrofit "statistics with sources" em top 5 landings | +10-20% AI citation |
| 3-4 | Validator Hub Fase 4A: 15 landings (validar CPF/CNPJ/CEP/CNH/RG por linguagem) | +20-30% tráfego |
| 5-6 | Verticais novos: RENAVAM, título eleitor, boleto | +15-20% tráfego |
| 7-8 | Blog pillar: "Guia completo LGPD pra devs BR" (3000 palavras + FAQ + HowTo schemas) | +5-10% autoridade |

**Métricas track A:**
- Signups/dia: 9 → 30-50 → 50-80
- Impressions GSC AI: 654/dia atual → 1500-2000/dia
- Landings indexadas: 40 → 70+

### TRACK B — CONVERT (Free → Paid)

**Estado:** 0,15% conversion (1/656). Benchmark SaaS early = 2-5%. **Aqui está o maior gap.**

**Framework Paywall-Upgrade-CRO (skill loaded):**

Diagnóstico rápido baseado em dados do admin (30d):
- `quota_offer_shown` 626 → clicks 13 (2,1% CTR) → conversão ~zero
- `dashboard_upsell_shown` 259 → clicks 6 (2,3% CTR)
- `nudge_shown` 2093 → clicks 37 (1,8% CTR)
- **Todos os triggers estão em CTR normal (2-3%) mas conversion pós-click = zero**

**Isso significa:** paywall UI/copy funciona OK, o problema é na página de checkout ou depois. Ou o value proposition não bate.

**Hipóteses ranqueadas:**
1. **Aha moment não claro** — user gera 1 CPF, copia, sai. Não experimentou "eu preciso disso repetidas vezes"
2. **Price anchor R$29 sem contexto de valor** — user não sabe quanto vale R$29 pra ele
3. **Free tier generoso demais** — 50 chamadas/dia = suficiente pra 90% dos casos casuais

**Ações track B (próximos 30 dias):**

| Semana | Entrega | Impacto esperado |
|---|---|---|
| 1 | Adicionar "success metric" no dashboard: "Você gerou X dados no seu último mês. No plano free você teria bloqueado em Y horas." Frame value pré-upgrade | +30-50% CTR upsell |
| 2 | A/B test paywall copy: "Você já economizou X horas escrevendo geradores locais" vs current | Baseline |
| 2-3 | Milestone-based trigger: após 5º dia consecutivo de uso, mostra upgrade card personalizado | +1-2% conversion |
| 3-4 | Reduce free tier de 50/dia pra 30/dia (após medir baseline) | +50-100% conversion (mas -20% signups?) |
| 4 | Feature gate: "Copy as SQL" agora Pro-only (era free). Aumenta valor Dev | +5-10% conversion |

**Métricas track B:**
- Free → Dev conversion: 0,15% → 1-2% em 30d, 2-3% em 60d
- Upgrade CTR: 2% → 5%+
- Completion rate paywall → checkout: medir baseline

### TRACK C — SELL (B2B Enterprise motion)

**Estado:** Landing /empresa shipped, 3 tiers self-service, docs B2B prontos. Zero outreach ativo.

**Ações track C (próximos 90 dias):**

| Semana | Entrega | Impacto esperado |
|---|---|---|
| 1 | LinkedIn outreach Tier 1: 10 connects/semana (Belvo, Pluggy, Banco Inter, Nubank Devs, Stone/Pagar.me) | 2-3 conversas quentes/semana |
| 3 | Primeiras Discovery calls (30 min) | 1-2 POC/mês |
| 4-6 | Contract via Plenor LLC pros primeiros deals | 1-2 Enterprise Starter (R$500) |
| 7-12 | Case studies dos primeiros 3 clientes B2B (com permissão) | Warmer inbound |
| 8-12 | Expandir outreach pra Tier 2 (fintechs médias, cartório digital, insurtech) | 5-10 conversas/semana |

**Métricas track C:**
- LinkedIn conversas: 0 → 10/semana
- POCs iniciados: 0 → 5+
- Enterprise contracts fechados: 0 → 3-8 até Dec 2026
- MRR Enterprise: R$0 → R$1.500-8.000/mês

---

## 3. Sequência semana-a-semana Q4 2026

### Semanas 1-2 (30/set - 13/out)
- [ ] Monitor signup rate pós-SMTP (validar 30-50/dia)
- [ ] Request Indexing 13 URLs GSC
- [ ] Retrofit AEO patterns em top 5 landings
- [ ] LinkedIn outreach start: 5 connects Tier 1
- [ ] Ship "success metric" dashboard pra Track B

### Semanas 3-4 (14/out - 27/out)
- [ ] Ship Validator Hub Fase 4A (15 landings)
- [ ] A/B test paywall copy novo
- [ ] LinkedIn: 10 connects/semana, primeiras discovery calls
- [ ] Ship milestone-based upgrade trigger

### Semanas 5-6 (28/out - 10/nov)
- [ ] Ship 3 verticais novos (RENAVAM/título/boleto × Python)
- [ ] Baseline Q4 metrics review
- [ ] Reduce free tier 50 → 30/dia (se conversion não subiu)
- [ ] Primeira POC B2B com Belvo ou similar

### Semanas 7-8 (11/nov - 24/nov)
- [ ] Ship blog pillar LGPD (3000 palavras)
- [ ] Ship feature gate "Copy as SQL" Pro-only
- [ ] LinkedIn: expandir pra Tier 2, 15 connects/semana
- [ ] Fechar 1-2 primeiros deals Enterprise

### Semanas 9-10 (25/nov - 8/dez)
- [ ] Ship 5 landings adicionais (backlog vertical)
- [ ] Review conversion metrics (target 1-2%)
- [ ] Primeiros case studies B2B
- [ ] Prep annual plan (20% discount pra converter Dev/Team)

### Semanas 11-13 (9/dez - 31/dez)
- [ ] Ship annual plan option
- [ ] Retention email nurture upgrade (D45/D60/D90)
- [ ] Q4 review: MRR, users pagantes, trajetória Q1 2027
- [ ] Escrever "State of FakeForge" LinkedIn post (transparency, atrai devs BR)

---

## 4. Skills a invocar por fase

**Ativa hoje:**
- `/aeo` — AI visibility optimization (rodar antes de shippar cada landing)
- `/programmatic-seo` — planning Fase 4 Validator Hub
- `/paywall-upgrade-cro` — otimização conversion Free → Dev

**Próximas 4 semanas:**
- `/schema-markup` — audit completo do site pra Article/HowTo/SoftwareApplication schemas
- `/signup-flow-cro` — otimização fina pós-SMTP unblock
- `/pricing-strategy` — validar tiers R$29/79/500/1500/5000 (podem estar mal calibrados)

**Próximas 8 semanas:**
- `/free-tool-strategy` — sanity check do FakeForge model como lead magnet
- `/content-strategy` — planejar blog pillars e distribuição

**Skills pra reabrir affiliate depois (parkeado):**
- `/partnerships-architect`
- `/channel-economics`
- `/referral-program`

**Deprioritário Q4:**
- `/api-design-reviewer` — quando shippar SDK público npm/pypi
- `/seo-audit` — Ubersuggest cobre, só rodar se ficar bugado

---

## 5. Métricas a trackear semanalmente

**Dashboard admin (você já tem):**
- Signups/dia
- API calls/dia
- Conversion Free → Dev
- MRR + pagantes
- Bot ratio

**GSC (semanal):**
- Impressions AI
- Impressions Web
- Top queries + click-through
- Coverage issues

**Resend (semanal):**
- Deliverability rate
- Bounce rate (manter < 3%)
- Suppressions

**LinkedIn (semanal):**
- Connects sent
- Reply rate
- Discovery calls agendadas

---

## 6. Decisões estratégicas pré-tomadas

**SIM:**
- Programmatic SEO como canal principal
- Custom SMTP Resend sempre
- Enterprise self-service > contact form
- Direct response copy (Hopkins/Cialdini/Sugarman)

**NÃO agora:**
- AdSense (rejeitado 2x, pivot pra EthicalAds quando 50k pageviews)
- Affiliate como lane principal (parkeado)
- SDK npm/pypi público (esperar demand claro)
- Vertical internacional (foco 100% BR até 200 pagantes)

**Reavaliar em Jan/2027:**
- Se atingir 100+ pagantes: SDK público
- Se AI visibility mantém 3x MoM: press outreach (TechCrunch BR, TabNews)
- Se conversion continua < 1%: pivot free tier model
- Se Enterprise pipeline forte: hire junior dev part-time

---

## 7. O que tem que dar errado pra não bater a meta

- Signup rate ficar em 15-20/dia (SMTP fix não escalou)
- Conversion não subir de 0,5% em 60 dias
- Google Dance pós-Fase 3 se prolonga > 30 dias
- Zero fecha B2B até fim de out
- Bounce rate volta pra > 5% (Resend suspende conta)

**Se qualquer 2 desses acontecerem simultaneamente:** ajustar meta pra Q1 2027, focar em profundidade sobre volume.

---

## Referências

- `docs/LESSONS_LEARNED_FAKEFORGE.md` — o que já validamos
- `docs/EMAIL_FUNNEL_SPEC.md` — funil D3-D30
- `docs/B2B_ICP.md` — quem prospectar
- `docs/B2B_OUTREACH_TEMPLATES.md` — templates LinkedIn
- Skills carregadas: aeo, programmatic-seo, paywall-upgrade-cro (referência)
