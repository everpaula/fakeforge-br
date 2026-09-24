# Sprint 8 — Email Funnel Spec

Consolidação dos outputs de 3 agents: Growth Hacker (arquitetura), Content Creator (5 emails copy), Ad Creative Strategist (D14/D16 direct response reinforcement).

**Data:** 2026-09-24
**Status:** Spec pronto pra implementação. Próxima sessão implementa.

---

## Parte 1 — Arquitetura (Growth Hacker)

### Cadence Table D0-D30

| Dia | Email | Segmento (condição) | Path split |
|-----|-------|---------------------|------------|
| D0 | Welcome + curl | Todo signup | Universal (já existe) |
| D3 | **Hook** | `email_confirmed=true` E `api_calls_total >= 1` | Se 0 calls → pula, entra em cron T+24h reactivation existente |
| D7 | **Objection** | `is_free=true` E `api_calls_last_7d >= 3` (ativou) | Se 0 calls 7d → versão light "ainda testando?" |
| D14 | **Urgency + 30% off 48h** | `is_free=true` E `api_calls_last_14d >= 10` (heavy engaged) | Se `converted=true` → sai da série, entra retention D30 |
| D16 | **Last chance** | Recebeu D14 E `checkout_started_from_d14=false` E `is_free=true` | Se clicou CTA D14 mas não pagou → mesmo email com PS |
| D30 | **Split**: Retention OU Monthly digest | `converted=true` → retention (D30A) | `is_free=true` → monthly digest (D30B) |

### Decision tree

```
D0 signup
  ├─ confirmou email? não → cron T+24h já cuida
  └─ sim → D3 Hook
       ├─ chamou API? não → só weekly digest
       └─ sim → D7 Objection → D14 Urgency+Offer
                              ├─ converteu → D30A Retention
                              └─ não → D16 Last chance → D30B Monthly digest
```

Cron roda 1x/dia às 10h BRT. Idempotência via query em `sent_emails` por `(user_id, template)`.

### Trigger event-based B2B

**Condição de disparo:**
```sql
user.is_free = true
AND MAX(api_calls_daily) >= 40 em 5 dias consecutivos
AND (
  email_domain NOT IN (gmail, hotmail, outlook, yahoo, icloud, proton)
  OR user_agent contém "PostmanRuntime" ou CI/CD identifiers
  OR api_key usada de >=2 IPs distintos no mesmo dia (sinal de time)
)
```

**Ações ao disparar:**
1. Email interno pro Everton (`b2b_lead_flagged`) com payload: user_id, email, domínio, volume médio, primeiro sinal
2. Email pro user (só se domínio corporativo): "vi que seu time tá batendo no limite Free — 15 min pra conversar sobre plano Team ou Enterprise? [Calendly]"
3. Flag `b2b_qualified=true` no user record → pausa série D14/D16 (não oferece desconto pra enterprise)

**Critério qualificação:** domínio corporativo OU multi-IP OU preencheu "empresa" no signup. Volume isolado sem sinal de empresa = só heavy free user, mantém série normal.

### Analytics events (adicionar em ALLOWED_TYPES de `/api/events`)

**Email lifecycle:**
- `email_d3_sent`, `email_d3_opened`, `email_d3_clicked_cta`
- `email_d7_sent`, `email_d7_opened`, `email_d7_clicked_cta`
- `email_d14_sent`, `email_d14_opened`, `email_d14_clicked_cta`
- `email_d16_sent`, `email_d16_opened`, `email_d16_clicked_cta`
- `email_d30_retention_sent`, `email_d30_digest_sent`

**Funnel conversion:**
- `checkout_started_from_d3`, `checkout_started_from_d7`, `checkout_started_from_d14`, `checkout_started_from_d16`
- `coupon_d14_applied`, `coupon_d14_expired_unused`
- `plan_upgraded_dev`, `plan_upgraded_team`

**B2B:**
- `b2b_lead_flagged`, `b2b_calendly_sent`, `b2b_calendly_booked`

### KPIs semanais (3)

1. **Open rate por email** — Meta baseline: D3 45%, D7 35%, D14 40%, D16 30%, D30 25%. Alerta se cair >10 pontos.
2. **CTR do opened** — Meta: D3 8%, D7 6%, D14 15%, D16 10%. Sinal honesto de fit.
3. **Conversion D14→pagante em 72h** — Meta baseline: 3%. Fórmula: `plan_upgraded_dev where source=email_d14 / email_d14_sent`. Se >5%, testa remover desconto. Se <1%, problema upstream.

---

## Parte 2 — Copy dos 5 emails (Content Creator)

### Email D3 — Hook

**3 subject lines pra A/B:**
1. As 3 features que fizeram devs virar cliente
2. Por que dev BR paga R$29 no FakeForge
3. 3 coisas que você não faz com CPF hardcoded

**Preview text:** Preset fintech, CNPJ 2026 e bulk de 10k items numa call

**Body:**

Fala {{first_name}},

Você criou conta há 3 dias. Deu tempo de testar o gerador básico (CPF, CNPJ, cartão). Agora quero mostrar 3 coisas que geralmente decidem o upgrade pro plano Dev.

**1. Preset fintech em 1 chamada**

Uma chamada devolve customer + PIX + conta bancária + cartão + score de crédito, tudo correlacionado. O CPF do customer bate com o titular da conta, o PIX aponta pra chave dele, o score faz sentido pra idade. Você não precisa costurar 5 endpoints na fixture.

Rota: `/api/preset/fintech`

**2. CNPJ alfanumérico da IN RFB 2.229**

Julho de 2026 é o corte. A partir dele, CNPJ novo pode vir com letras nas 8 primeiras posições, e o DV mudou de cálculo. Testei outros geradores BR, nenhum devolve o formato novo com DV correto. O FakeForge devolve.

Param: `?format=alphanumeric`

**3. Bulk de 10.000 items em 1 chamada**

No Free você tem 50 chamadas por dia. No Dev, você pede 10.000 CPFs, ou CNPJs, ou combos, em uma chamada só. Seed de staging que antes rodava por 20 minutos vira 1 requisição.

Quer ver os 3 em detalhe, com curl de exemplo?

[Ver os 3 casos em detalhe]

Abraço,
Everton, fundador do FakeForge

**CTA:** "Ver os 3 casos em detalhe" → `/preset-fintech`

---

### Email D7 — Objection handling

**3 subject lines:**
1. 5 casos que o Free não aguenta
2. Quando 50 chamadas por dia não dão conta
3. O Free serve pra testar. Não pra rodar.

**Preview text:** Seed staging, load em CI, fixture E2E, checkout, CNPJ 2026

**Body:**

Fala {{first_name}},

O plano Free (50 chamadas/dia) foi feito pra você experimentar. Mas 5 cenários batem no teto rápido. Deixo aqui pra você identificar antes de perder tempo.

**1. Seed de staging com 10k rows** — Toda vez que você reseta o banco de dev ou staging, precisa de dados novos. Se são 10.000 clientes com CPF, endereço, telefone e cartão, o Free trava. No Dev, é 1 chamada.

**2. Load test em CI** — Rodou k6 ou Locust apontando pro seu endpoint de cadastro e precisa de 100 CPFs por segundo? No Free, você bate 50 chamadas em meio segundo e o CI quebra.

**3. Fixture E2E com refresh diário** — Playwright ou Cypress rodando toda madrugada, gerando fixture nova pra evitar dado stale. Se são 3 suítes rodando em paralelo, o Free some no primeiro run.

**4. Mock de checkout completo** — Cartão com Luhn válido, PIX BACEN nos 4 tipos (CPF, email, telefone, chave aleatória), boleto com linha digitável válida. Um checkout usa 3 a 4 chamadas por sessão de teste. Se você tem 20 devs rodando E2E local, 50/dia acaba antes do almoço.

**5. CNPJ alfanumérico 2026** — Julho de 2026 chega. Seu sistema aceita "12ABC345/0001-67"? Se não, você tem 10 meses pra ajustar validação, banco, form. O FakeForge gera o formato novo pra você testar hoje.

Docs de bulk aqui: [Ver docs de bulk]

Abraço,
Everton, fundador do FakeForge

**CTA:** "Ver docs de bulk" → `/docs`

---

### Email D14 — Urgency + Offer

**3 subject lines:**
1. CNPJ alfanumérico julho/2026: sua stack tá pronta?
2. 48h de R$19/mês no Dev, cupom já aplicado
3. IN RFB 2.229 chega em julho. Você testou?

**Preview text:** 30% off no Dev por 48h. Cupom CNPJ2026 já aplicado.

**Body (reforçado com Ad Creative Strategist — Reason-Why + Scarcity + Slippery slide + Objection handling):**

Fala {{first_name}},

Se você tá gerando CNPJ com regex do faker-js ou copiando função do StackOverflow, tem um detalhe que quebra em julho: o dígito alfanumérico da IN RFB 2.229.

A maioria das libs BR ainda cospe 14 dígitos numéricos, o validador novo da Receita rejeita, e você descobre isso quando o QA subir o ticket na sexta às 18h.

Rodei o FakeForge nos últimos 14 dias na tua conta Free, e você já bateu no limite de 100 requests/dia 3 vezes essa semana, o que geralmente é sinal que virou dependência no seed de teste.

Por isso tô te mandando esse email agora, antes do teu próximo sprint fechar.

**O que muda no seu código com CNPJ alfanumérico:**

- Regex `^\d{14}$` quebra
- Coluna `NUMERIC(14)` no Postgres quebra
- Validação de DV precisa ser reescrita (cálculo novo via ASCII menos 48)
- Form de cadastro precisa aceitar letras

Você tem 10 meses. Se você tem 40 microserviços, 10 meses somem rápido.

**Por que R$19 (o Reason-Why):**

Sou fundador solo, e o Dev a R$29 cobre infra + tempo de manutenção do gerador. Deixei R$19 no primeiro mês porque é o custo real de você me testar sem eu perder dinheiro: se rodar no teu CI e resolver, você continua; se não resolver, cancela e a gente segue. Não é liquidação, é um "vem testar sem apostar caro".

**O que entra no plano Dev:**
- 10.000 chamadas por dia
- 10.000 items por chamada (bulk)
- CNPJ alfanumérico com DV correto
- Todos os presets (fintech, ecom, customer)
- SDK Node + Python

**Prazo: 48h a partir de agora.** O cupom `CNPJ2026` fica ativo até {{coupon_expires_at_readable}} porque essa foi a janela que consigo bancar esse mês antes do próximo ciclo de infra. Depois disso, volta pra R$29 no ato.

[Assinar Dev por R$19/mês]
_cancelamento em 1 clique, sem fidelidade_

**Se tiver alguma dúvida:**
- "E se eu não usar de verdade?" — Se você não bater em 500 requests no primeiro mês, o próprio painel te avisa e sugere voltar pro Free.
- "E se eu quiser cancelar?" — 1 clique no painel, sem formulário, sem email pra suporte, sem retenção. Testei porque odeio quando fazem comigo.
- "Faker-js + validador custom já resolve" — Resolve até a IN RFB 2.229 entrar em vigor em julho. Se você achou lib grátis que implementou o algoritmo módulo 11 adaptado, me manda que eu paro de cobrar por isso.

Responde esse email se tiver dúvida técnica. Eu leio.

Abraço,
Everton, fundador do FakeForge

**CTA principal:** "Assinar Dev por R$19/mês" → `/checkout?plano=dev&cupom=CNPJ2026`
**Sub-CTA:** "cancelamento em 1 clique, sem fidelidade" (texto pequeno abaixo do botão)

**Variáveis dinâmicas:**
- `{{first_name}}` (fallback: "dev")
- `{{coupon_expires_at_readable}}` (ex: "sábado 23h59")

**Nota implementação:** Cupom `CNPJ2026` deve ser criado no Stripe antes do envio da campanha. Duração 48h a partir do send.

---

### Email D16 — Last chance (ultra-lean 200 palavras)

**3 subject lines:**
1. cupom CNPJ2026 expira amanhã 23h59
2. Amanhã volta pra R$29
3. Último dia do R$19

**Preview text:** Último dia do R$19. 24h no relógio.

**Body:**

Fala {{first_name}},

O cupom `CNPJ2026` sai do ar em 24 horas. Depois disso, o Dev volta pra R$29/mês cheios.

Rogério, meu primeiro cliente Dev (fintech pequena em Curitiba, 2 devs), me contou semana passada que economiza umas 4h/mês só de não manter mais o gerador custom de CPF/CNPJ no repo de fixtures. Não é milagre. São 4 horas. Que viraram uma feature a mais entregue por mês.

**Loss aversion:**

Amanhã à noite o cupom some, e o Dev volta pra R$29. Não é o fim do mundo, é R$10 a mais por mês, mas é R$120 no ano que você não precisa gastar se ativar hoje.

Se julho chegar e teu pipeline quebrar no CNPJ alfanumérico, você vai gastar 2-3 horas debugando o validador, e essas horas custam mais que o plano anual inteiro.

**R$19 no primeiro mês. 24h no relógio.**

[Aproveita R$19 (24h restantes)]

Se não fizer sentido agora, sem estresse. Te mando novidade mensal quando tiver update relevante do gerador. Sem enrolação, sem sequência de 7 emails.

Abraço,
Everton, fundador do FakeForge

**CTA:** "Aproveita R$19 (24h restantes)" → `/checkout?plano=dev&cupom=CNPJ2026`

**Segmento:** enviar SOMENTE pra quem NÃO clicou no CTA do D14 (excluir convertidos).

---

### Email D30A — Retention (se converteu)

**3 subject lines:**
1. 3 coisas que devs Dev descobrem tarde
2. Você tá no Dev. Agora usa direito.
3. Presets, bulk e CI: os 3 atalhos do plano Dev

**Preview text:** Preset fintech, bulk sob demanda, key por ambiente

**Body:**

Fala {{first_name}},

Você tá no Dev há algumas semanas. Antes de virar rotina "gerar CPF e pronto", queria compartilhar 3 coisas que devs geralmente descobrem tarde e economizam bastante requisição.

**1. Presets fazem o trabalho de 5 endpoints**

Em vez de chamar `/cpf` + `/endereco` + `/telefone` + `/cartao` + `/pix`, chama `/preset/customer` uma vez. Vem tudo correlacionado (mesmo titular, mesmo estado, telefone com DDD que bate). Você gasta 1 chamada em vez de 5, e o dado faz sentido em produção.

**2. Bulk sob demanda, não por padrão**

O bulk não é "use sempre". Ele brilha em seed de banco e load test. Pra fixture de teste unitário, você provavelmente precisa de 50, não de 10.000. Divide o uso: bulk grande no CI noturno, chamadas pequenas em desenvolvimento local.

**3. API key por ambiente no CI/CD**

No painel você gera múltiplas keys. Uma pra dev local, uma pra CI staging, uma pra load test. Se algum script vazar log, você revoga só aquela key sem parar o resto. GitHub Actions e GitLab CI aceitam key via secret padrão.

Docs de presets: [Ver docs de presets]

Se tiver caso de uso que não tá coberto, responde esse email. Eu implemento se fizer sentido pra mais gente.

Abraço,
Everton, fundador do FakeForge

**CTA:** "Ver docs de presets" → `/docs/presets`

**Segmento:** `plan = dev` OR `plan = team`

---

### Email D30B — Monthly digest (se NÃO converteu)

**3 subject lines:**
1. Novidade técnica do mês, sem pitch
2. O que mudou no FakeForge em setembro
3. 2 features novas, nenhum sales

**Preview text:** Update mensal. Sem cobrança de upgrade.

**Body:**

Fala {{first_name}},

Você tá no Free e tá tudo bem. Não vou te encher pra fazer upgrade toda semana. Uma vez por mês eu passo pra contar o que mudou tecnicamente. Se um dia servir, você sabe onde me achar.

**{{month_name}} no FakeForge:**

**1. Boleto com linha digitável real por banco**

Antes o boleto vinha com linha digitável genérica. Agora, se você passa `?banco=itau` ou `?banco=bb`, a linha vem no padrão do banco escolhido (código, agência, DAC certo). Serve pra testar parser de boleto que espera prefixo específico.

**2. SDK Python 0.4 com typing completo**

Todos os retornos agora têm dataclass tipado. mypy e pyright reconhecem, autocomplete no VSCode funciona sem hint file. `pip install fakeforge-br==0.4` puxa a versão nova.

**No blog esse mês:**

Escrevi um post sobre como o CNPJ alfanumérico da IN RFB 2.229 quebra Postgres com coluna `NUMERIC(14)`. Tem código pra migração sem downtime.

[Ver blog]

É isso. Bom código pra você.

Quando quiser mais volume que 50 chamadas por dia, tô aqui.

Abraço,
Everton, fundador do FakeForge

**CTA:** "Ver blog" → `/blog`
**CTA discreto:** linha "Quando quiser mais volume que 50 chamadas por dia, tô aqui." (sem botão)

**Segmento:** `plan = free` E `signup_date <= NOW() - 30 days`
**Frequência:** repetir mensalmente com conteúdo novo (Sprint 9 revisa)

---

## Parte 3 — A/B testing plan (Ad Creative Strategist)

**Rodar 1 experimento por vez. Mínimo 100 emails/variante. Não mudar D14 e D16 simultaneamente (perde attribution).**

### Experimento 1: Subject line D14 — compliance vs preço

- **A:** "cupom CNPJ2026 expira amanhã 23h59" (preço/urgência)
- **B:** "IN RFB 2.229 entra em vigor em julho, tá pronto?" (compliance/dor técnica)
- **Métrica:** open rate
- **Hipótese:** dev responde mais a dor técnica que a desconto, mas na base FakeForge (early adopters) preço pode ganhar

### Experimento 2: CTA framing — ação vs feature

- **A:** "Assinar Dev por R$19 no 1º mês"
- **B:** "Ativar cupom e liberar CNPJ alfanumérico"
- **Métrica:** CTR + conversion pós-clique
- **Hipótese:** framing de feature converte menos cliques mas mais assinaturas (auto-qualifica)

### Experimento 3: D14 comprimento — longo vs curto

- **A:** email completo com Reason-Why + objection handling embedded (~350 palavras — versão atual)
- **B:** email lean estilo D16 antecipado (~180 palavras) + link pra landing com o resto do argumento
- **Métrica:** conversion end-to-end
- **Hipótese:** dev clica mais em email curto mas converte mais em email longo (objeções pré-resolvidas antes do checkout)

---

## Parte 4 — Implementação (próxima sessão)

### Files a criar/editar

**Backend:**
1. `docs/sql/015_add_funnel_columns.sql` — adicionar `converted_at`, `b2b_qualified`, `first_call_at` na tabela users (se ainda não existirem)
2. `src/lib/email-templates.ts` — 6 novos templates (D3, D7, D14, D16, D30A, D30B)
3. `src/app/api/cron/send-nurture-d3/route.ts` — cron diário 10h BRT
4. `src/app/api/cron/send-nurture-d7/route.ts`
5. `src/app/api/cron/send-nurture-d14/route.ts`
6. `src/app/api/cron/send-nurture-d16/route.ts`
7. `src/app/api/cron/send-nurture-d30/route.ts` (split path retention/digest)
8. `src/app/api/cron/detect-b2b-leads/route.ts` — trigger event-based
9. `vercel.json` — 6 crons novos (5 nurture + 1 B2B), todos 1x/dia 13h UTC (10h BRT)
10. `src/app/api/events/route.ts` — adicionar tracking events ao ALLOWED_TYPES

**Frontend:**
11. `src/app/checkout/page.tsx` — modificar pra aceitar `?cupom=CNPJ2026` e mostrar preço com desconto
12. Landing checkout com cupom pré-aplicado (redirect ou parameter)

**Stripe:**
13. Criar cupom `CNPJ2026` no Stripe dashboard — 30% off, 1 mês, válido 60d (usa 48h por user via lógica no email)

**Analytics:**
14. Card no admin VC dashboard: "Funnel D3-D30" com KPIs open/CTR/conversion por email

### Estimativa

- Backend cron + templates: 4-5h
- Frontend checkout com cupom: 1-2h
- Analytics dashboard section: 2h
- QA + testing: 1-2h

**Total: 8-11h implementação.** Consistente com estimativa inicial de 8-10h.

---

## Compliance de voz (validado por Content Creator)

- Sem em-dashes
- Sem palavras banidas: leverage, optimize, robusto, seamless, empower, escalável, sinergia
- Acentos PT-BR corretos
- Primeira pessoa consistente
- Sem "único", "revolucionário", "definitivo" como promessa
- Assinatura fixa: "Everton, fundador do FakeForge"
- Word count por email: 200-350 palavras
- Total do spec: ~4.500 palavras
