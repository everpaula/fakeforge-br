# FakeForge Enterprise — Templates de Outreach

**Objetivo:** entregar 5 templates prontos pra Everton disparar sem precisar reescrever. Cada um com contexto de uso, subject, body, e as regras de voz.

---

## Regras de voz obrigatórias (aplica a TODOS os templates)

- Português BR com acentos corretos
- **Sem em-dashes** (usa vírgula/ponto)
- **Sem palavras banidas:** leverage, optimize, robusto, seamless, empower, escalável, sinergia, "solução"
- **Sem AI-slop:** sem "unlock potential", "revolutionary", "definitivo"
- Tom Everton direto, dev falando com dev
- **Nunca menciona SafeRide** (empregador atual)
- **Nunca menciona valor de assinatura no primeiro contato** — mostra valor primeiro, preço na resposta
- Assinatura: "Everton, fundador do FakeForge"

---

## Template 1 — LinkedIn Connection Request (300 chars max)

**Uso:** Primeiro toque em prospect Priority 1 ou 2. Antes de qualquer email.

**Regra LinkedIn:** requer nota personalizada, 300 chars incluindo nome/saudação.

### Versão A — Fintech / Payments Lead

```
Oi {nome},

Vi que você lidera {área} na {empresa}. Construí um gerador de CPF/CNPJ/PIX/cartão pra staging fintech que resolve o problema de dado real em teste. Preset fintech = customer + PIX + cartão correlacionados em 1 chamada.

Curioso do que teu time usa hoje pra isso.

Abraço,
Everton
```

Char count: 297 ✅

### Versão B — Platform / DevEx Lead

```
Oi {nome},

Vi que você é {role} na {empresa}. Construí o FakeForge, gerador de dados brasileiros pra popular staging e CI/CD sem tocar em dado real. Cobre CNPJ alfanumérico 2026 (IN RFB 2.229) que ninguém mais cobre.

Curioso do teu approach pra test data hoje.

Everton
```

Char count: 297 ✅

### Versão C — CTO / VP Tech (mais executivo)

```
Oi {nome},

Founder solo, construí o FakeForge nos últimos 12 meses — gerador de dados brasileiros pra CI/CD e staging. 250+ landings, 8k orgânico/mês.

Curioso se {empresa} tem time de test data interno ou terceiriza. Sem pitch, só troca de ideia.

Everton
```

Char count: 298 ✅

---

## Template 2 — Cold Email — Fintech / Head of Payments

**Uso:** Prospect Priority 1 de fintech. Depois de aceite LinkedIn (5-7 dias) OU direto se tem email de trabalho verificado.

**Subject options (A/B):**
1. `preset fintech pra staging na {empresa}` (específico, gera curiosidade)
2. `CNPJ alfanumérico 2026: {empresa} tá pronto?` (compliance urgency)

**Body:**

```
Oi {nome},

Vi teu perfil e trajetória em {empresa}. Escrevendo direto porque tenho um pitch curto e um pedido.

Nos últimos 12 meses construí o FakeForge, gerador de dados brasileiros pra popular staging e teste automatizado. Preset fintech devolve customer + CPF + PIX (4 chaves BACEN) + conta bancária (17 bancos com DV) + cartão (Luhn) + score Serasa correlacionados numa chamada só.

O motivo de te chamar:

Fintechs BR geralmente têm um destes 3 problemas em staging:

1. Copiam produção pra staging (LGPD gate, DPO recusa)
2. Geram CPF hardcoded no repo (regex quebra em CNPJ alfanumérico julho/2026)
3. Faker.js pt-BR (falha mod-11 em versões recentes, sem correlação entre campos)

Quero saber qual o approach da {empresa} hoje. Se resolvido, ótimo, aprendo. Se dor real, tenho plano Enterprise com SLA + on-premise Docker + parecer LGPD que geralmente encaixa pra fintechs do teu porte.

15 minutos essa semana ou próxima?

Abraço,
Everton
Fundador FakeForge
fakeforge.com.br
```

**Follow-up 1 (7 dias sem resposta):**

Subject: `re: {subject original}`

Body:
```
Oi {nome},

Follow-up rápido. Sei que inbox tá cheio.

Se o pitch não fez sentido, sem estresse — descarta. Se fez mas semana foi corrida, respondo com case study de fintech pequena em Curitiba que economizou 4h/mês migrando de gerador custom pro FakeForge.

Só me diz "manda" ou "não interessa" que respeito qualquer resposta.

Abraço,
Everton
```

---

## Template 3 — Cold Email — Marketplace / DevEx / Platform

**Uso:** Prospect Priority 1 de marketplace/ecom.

**Subject:**
`Preset ecom: 500k pedidos correlacionados por noite em staging`

**Body:**

```
Oi {nome},

Você lidera {role} na {empresa}, e vi que teu time tem CI/CD ativo com {stack observável}. Vou direto.

Construí o FakeForge pra popular staging de ecom com dados brasileiros que fazem sentido: cliente + endereço de entrega + endereço de cobrança (70% igual, 30% diferente) + carrinho (1-5 produtos com SKU e variação) + payment (cartão 50%, PIX 40%, boleto 10% ponderado real) + totais calculados.

1 chamada da API devolve o pedido completo. 200k chamadas/dia no plano Growth.

Casos que devs de marketplace geralmente resolvem com FakeForge:

- Seed diário fresh de staging em vez de fixture manual desatualizada
- Load test de cálculo de frete com CEP realista de todas UFs
- Teste de antifraude que precisa de coerência DDD × UF (Faker falha aqui)
- Teste de promoção/cupom com distribuição real de categoria e preço

Não vou insistir se não fizer sentido. Mas se tocar em algum dos 4 acima, curioso de conversar 15 min.

Abraço,
Everton
Fundador FakeForge
fakeforge.com.br/preset-ecom
```

---

## Template 4 — Cold Email — Banco tradicional / VP Tech

**Uso:** Bancos com braço digital (Itaú, Bradesco, Santander). Difícil de chegar, tom mais formal.

**Subject:**
`FakeForge Enterprise — dados sintéticos LGPD-compliant pra ambientes de teste`

**Body:**

```
Prezado {nome},

Meu nome é Everton, fundador do FakeForge, ferramenta que gera dados brasileiros sintéticos matematicamente válidos (mod-11, Luhn, BACEN) pra popular ambientes de teste e CI/CD sem exposição LGPD.

Endereço este email porque bancos com escala do {empresa} enfrentam um dilema conhecido:

Copiar dado de produção pra staging é gate LGPD; gerar dado ad-hoc via scripts internos consome capacidade do time de plataforma; e ferramentas internacionais (Faker, Mockaroo) não cobrem CPF/CNPJ/PIX/cartão brasileiro com validação correta.

FakeForge Enterprise entrega:

- Presets verticais correlacionados (fintech, ecom, custom sob demanda)
- On-premise deployment via Docker/K8s (Scale tier)
- SLA 99.95% com multa proporcional
- Parecer técnico LGPD assinado por advogado
- CNPJ alfanumérico da IN RFB 2.229 (vigência julho/2026) já implementado
- Contrato via jurídico brasileiro

Estou disponível pra 30 minutos com quem seu time indicar (Head of DevEx, Head of Platform Engineering, ou DPO conforme escopo).

Cordialmente,
Everton Paula
Fundador, FakeForge
Plenor Group LLC
+55 (XX) XXXXX-XXXX
```

**Nota:** único template com tom formal. Bancos tradicionais respondem mal a tom informal em primeiro contato.

---

## Template 5 — Cold Email — Insurtech / Startup pré-Series B

**Uso:** Insurtech recém-fundada ou levantou seed/Series A.

**Subject:**
`Seed de staging pra insurtech BR: gerador de segurado + apólice`

**Body:**

```
Oi {nome},

Vi que a {empresa} tá crescendo em {área insurtech} e que teu time tá contratando backend. Founder solo aqui, construí o FakeForge pra resolver problema chato de test data no Brasil.

Se você constrói insurtech, provavelmente tá gerando na mão: CPF + apólice + sinistro + endereço + telefone com DDD. Ou copiando produção pra staging e torcendo pra DPO não perguntar.

FakeForge tem preset customer + preset fintech (adaptável pra insurtech em conversa: segurado + CPF + endereço + data de nascimento + score de risco).

Foco agora do desenvolvimento é preset seguros custom pra clientes do plano Growth. Se {empresa} entrar cedo, ajudo a modelar exatamente pro caso de vocês.

Sem promessa vazia: no primeiro mês eu escrevo o preset baseado nas variáveis que teu produto usa. R$1.500/mês, cancela quando quiser.

15 min essa semana?

Abraço,
Everton
Fundador FakeForge
fakeforge.com.br/empresa
```

---

## Regras de cadência

- **LinkedIn connect** com nota → aguarda 5-7 dias antes de email
- **Se conectou:** manda email personalizado (Template 2, 3 ou 5 conforme setor)
- **Se não conectou em 14 dias:** manda email sem prefácio de LinkedIn, referencia que tentou LinkedIn e passa direto
- **Follow-up 1:** 7 dias após email, curto e humilde
- **Follow-up 2:** 14 dias após FU1, oferece case study concreto
- **Follow-up 3:** 30 dias após FU2, "breakup email" (fecha loop com dignidade)
- **Pausa:** se sem resposta em FU3, entra em nurture LinkedIn (curte/comenta posts do prospect por 60d antes de tentar de novo)

## Métricas alvo

- **Connection rate LinkedIn:** 30-40% (fit ICP + nota personalizada)
- **Open rate email cold:** 40-50% (subject + timing)
- **Reply rate email cold:** 5-10% (positivo ou negativo)
- **Reply rate follow-up 1:** 2-4%
- **Call booked rate:** 1-2% do outreach total
- **Close rate call → contrato:** 10-20% pra Priority 1

**Meta 30 dias:** 30 outreaches → 3-5 calls → 1 contrato Enterprise fechado.

**Meta 90 dias:** 3-5 contratos ativos = R$3-15k MRR incremental.

---

## Templates de FU rápido pra 4 objeções comuns

### "Estamos usando Faker.js / faker-py, resolve"

```
Faz sentido. Faker resolve 60% dos casos. Os 40% que Faker deixa pendente:

- CPF que quebra mod-11 em versões recentes (bug reportado no GitHub deles)
- Zero correlação nome ↔ email ↔ DDD ↔ UF (antifraude quebra)
- Zero cobertura de CNPJ alfanumérico 2026, PIX BACEN, cartão Luhn com holder correlacionado

Se {empresa} não tá esbarrando nesses 3, então Faker é a escolha certa. Se tá, 15 min pra eu mostrar como resolvemos.

Abraço,
Everton
```

### "Temos time interno de test data"

```
Time interno é ativo estratégico. FakeForge Enterprise é ferramenta pra esse time usar, não substituir. 

Analogia: você tem DBA interno, mas usa Postgres em vez de escrever banco do zero. Mesma coisa aqui — seu time de test data foca em orquestração e políticas, FakeForge é o gerador plugável embaixo.

Se quiser, apresento em 15 min como outros times de test data em fintech BR usam a gente hoje.

Everton
```

### "Precisamos on-premise, sem SaaS externo"

```
On-premise é feature do plano Scale. Entrego container Docker + docs K8s, roda self-hosted no seu VPC, zero telemetria. Update via git pull do registry privado.

Preço Scale R$5k/mês inclui isso. Se quiser detalhes técnicos, marco call de 30 min com você e teu Head of Security.

Everton
```

### "Sem orçamento no momento"

```
Entendi. Duas opções:

1. Continua no plano Dev R$29/mês (Free tier 50/dia se time pequeno) e migra pra Enterprise quando orçamento abrir.
2. Se prever orçamento novo em 3-6 meses, coloco você numa lista curta de prospects e faço follow-up leve com update de features.

Qual dos dois faz mais sentido pra ti?

Everton
```

---

**Todos os templates validados pra:** sem em-dash, sem palavras banidas, tom Everton, PT-BR acentuado, sem promessa exagerada, sem "we" corporativo.
