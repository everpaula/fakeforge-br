# FakeForge — Brainstorming de Expansão (01/out/2026)

**Autor:** Everton + Claude Opus 4.7
**Base de dados:** Ubersuggest MCP (3 queries ao vivo em 01/out) + conhecimento tendências BR tech
**Pergunta investigada:** Como potencializar visits + atrair personas além de devs + atacar trending

---

## Part A — Como potencializar visits (growth hacking)

### A1. Reposicionamento como "Synthetic Data"

**Descoberta Ubersuggest (01/out):** o termo "dados sintéticos" tem autoridades globais (AWS, Microsoft Azure, Snowflake) documentando categoria em PT-BR, mas:
- httpdrop.com acabou de lançar "Faker BR: Dados Sintéticos Brasileiros" (concorrente novo, 5 visits estimados)
- ESPM tem curso "personas sintéticas vivas com IA" (research market)
- IPSOS fala sobre "testes de produto com dados sintéticos"
- Syntho.ai (ferramenta global) tem página pt-BR "pseudonymization vs anonymization"

**Oportunidade:** FakeForge é um synthetic data tool mas se vende como "gerador de CPF". Reposicionar amplia audience de "dev brasileiro" pra "data scientist, pesquisador, QA, ML engineer" sem mudar o produto.

**Ação:**
1. Blog pillar: "O que são dados sintéticos e por que o mercado BR precisa adotar" (~3000 palavras)
2. Landing nova `/dados-sinteticos` (categoria premium, não substitui `/gerador-cpf`)
3. Hero da home ganha linha secundária: "Primeiro synthetic data tool brasileiro"
4. Blog comparativo "Dados sintéticos vs Mascaramento vs Anonimização: guia LGPD"

### A2. Explorar whitespace SERP "massa de dados para teste"

**Descoberta Ubersuggest SERP analysis:**
- #1 é AI Overview
- #2 Base dos Dados (open datasets, autoridade DA 41)
- #3 Celcoin developers (fintech)
- #4 TCC Anima Educação
- #8 Prime Control (consultoria QA)
- #11 Kaggle (datasets)

**Insight crítico:** NENHUMA ferramenta brasileira de geração aparece nesse SERP. Prime Control (consultoria) vai pra #8. Oportunidade pra FakeForge rankear com conteúdo QA-focused.

**Ação:**
1. Landing `/massa-de-dados-para-teste` focada em QA Engineer (não dev)
2. Blog pillar: "Massa de dados pra teste: guia completo pra QA Engineer brasileira"
3. Angular diferente: Test Data Management (TDM) é terminologia QA, não dev

### A3. AI Overviews — otimização agressiva

**Já temos:** 15,657 impressões AI em 3 meses, crescendo 3x MoM, top 5 páginas somam 14k.

**Próximo passo:** entrar em prompts onde Mockaroo/WireMock/Tonic.ai dominam. Já atacamos com blog Mockaroo vs FakeForge. Falta:
1. Blog "FakeForge vs WireMock: APIs mock pra testes BR" (whitespace #1)
2. Blog "Tonic.ai alternativa brasileira: synthetic data com validação BR"
3. Blog "SAS Synthetic Data Studio vs ferramentas open-source BR"

### A4. Link building agressivo

**Problema:** Autoridade de domínio ~20-30, concorrentes 40-100. SERP já mostra DA 92 (Reddit), 95 (Wikipedia), 98 (Microsoft).

**Táticas:**
1. **Base dos Dados mention** — editorial pitch pra Base dos Dados "ferramenta BR complementar pra testes com dados fictícios"
2. **Celcoin developer portal** — eles usam synthetic data pros devs. Pitch: FakeForge como add-on
3. **TabNews post** — único canal dev BR com DR 60+ onde user ainda não publicou
4. **Dev.to/Hashnode cross-post** — reposting dos blog pillars (não dup content, backlinks)
5. **GitHub README SEO** — repositório `fakeforge-br` (SDK Python/Node se shippar) ranqueia alto

### A5. Programmatic SEO Fase 4B+

Já shipamos Fase 4A (Validator Hub 15 landings). Continuar:
- **Fase 4B**: Validator Hub por estado (CPF SP/RJ/MG, RG SP/RJ/MG = 27 UFs × 2 = 54 landings — como fizemos pra CEP cities)
- **Fase 5**: Converter/Formatter hub (`/formatar-cpf`, `/formatar-cnpj`, `/formatar-cep`)
- **Fase 6**: Mock API hub (`/mock-api-brasileira`, `/mock-cpf-postman`)

---

## Part B — Personas além de devs

### B1. QA Engineer (prioridade 1 — adjacente mas separada)

**Por quê:** Vocabulário diferente de dev (eles falam "massa de dados" não "gerador de"), SERP mostrada acima tem spot vazio pra ferramenta BR.

**Keywords alvo:**
- "massa de dados para teste" (vol 10 Ubersuggest, mais real no SERP)
- "test data management brasileiro"
- "automação de testes dados brasileiros"
- "bdd geração massa dados"
- "selenium dados brasileiros fake"

**Landing nova:** `/para-qa-engineers` com angle TDM
**Blog pillar:** "QA brasileira: guia massa de dados automação sem LGPD risk"

### B2. Data Scientist / ML Engineer (prioridade 1 — categoria premium)

**Por quê:** Synthetic data pra training de ML é tendência global. BR tem demanda crescente. Mercado paga mais (ML engineer salário 2x dev).

**Keywords alvo:**
- "dados sintéticos machine learning brasil"
- "treinar modelo IA dados fictícios"
- "data augmentation BR"
- "sampling training set LGPD"

**Landing nova:** `/dados-sinteticos-machine-learning`
**Blog pillar:** "Treinar LLM/CV com dados sintéticos BR: by-pass LGPD + ganhar diversidade"

### B3. Pesquisador de mercado / Research (prioridade 2)

**Descoberta Ubersuggest:** ESPM e IPSOS falam de "personas sintéticas". Nicho premium.

**Keywords alvo:**
- "personas sintéticas pesquisa mercado"
- "survey com dados fictícios"
- "amostra sintética pesquisa qualitativa"

**Landing nova:** `/pesquisa-mercado-dados-sinteticos`
**Blog pillar:** "Personas sintéticas: nova fronteira da pesquisa de mercado BR"

### B4. Compliance / Privacy Officer (prioridade 2)

**Por quê:** LGPD multa crescente (ANPD atuando). Alvo decisor com budget.

**Keywords alvo:**
- "LGPD dados teste software"
- "DPO ferramenta synthetic data"
- "ANPD multa dado teste"
- "mascaramento vs anonimização LGPD"

**Já temos:** Blog LGPD guia completo (shipado hoje).
**Falta:** Landing B2B `/para-dpo-compliance` com case study + enterprise CTA

### B5. Product Manager / UX Designer (prioridade 3)

**Por quê:** Volume gigante (todo PM/UX já procurou dados fake pra protótipo). Mas conversion pro dev plan é baixa.

**Keywords alvo:**
- "dados realistas Figma protótipo"
- "placeholder BR Sketch InVision"
- "popular dashboard dados simulados"
- "demo clientes CRM fake"

**Landing nova:** `/dados-para-prototipo-figma`
**Blog pillar:** "Figma + dados BR realistas: parar de usar 'João da Silva' em todos os mockups"

### B6. Startup Founder pré-MVP (prioridade 3)

**Por quê:** Alto intent (pré-ventas), audience caloroso. Pode virar Dev plan rapidamente.

**Keywords alvo:**
- "popular banco MVP demo investidor"
- "dados fictícios startup pré-produto"
- "demo investidor sem base real"

**Landing nova:** `/dados-mvp-demo-investidor`
**Blog pillar:** "7 formas de impressionar investidor com demo pré-MVP (sem base real)"

### B7. Educador / Professor TI (prioridade 4 — low commercial but high backlink potential)

**Por quê:** Baixo conversion mas educators geram backlinks (`.edu`, `.br`, universidades).

**Keywords alvo:**
- "exemplo CPF para aula programação"
- "material didático API testes"
- "projeto escolar validador CPF"

**Landing nova:** `/para-professores-estudantes`
**Blog pillar:** "Como ensinar validação de documentos BR em sala de aula: código + API grátis"

### B8. Growth Marketing (prioridade 4)

**Por quê:** Audience usa mas raramente paga. Força de bateria quando volume alto.

**Keywords alvo:**
- "popular lista email teste"
- "dados demo campanha marketing"
- "A/B test audiência fake"

**Landing nova:** `/populacao-dados-marketing-growth`

---

## Part C — Trending agora e provavelmente

### C1. Tier S (ship conteúdo essa semana — vigência próxima)

**CNPJ Alfanumérico 01/07/2026** ⭐⭐⭐
- **Status:** 9 meses pra implementação. Devs e sistemas desesperados.
- **Volume Ubersuggest:** `gerador cnpj alfanumerico` já aparece em suas keywords tracked.
- **Já temos:** `/gerador-cnpj-alfanumerico` + blog checklist migração.
- **Expandir:**
  - Blog: "SAP + CNPJ alfanumérico: calendário de migração enterprise"
  - Blog: "ERP legado e CNPJ alfanumérico: 10 cuidados pra 2026"
  - Blog: "Testar NFSe com CNPJ alfanumérico antes de julho/2026"
  - Vídeo YouTube (se tiver banda): "CNPJ Alfanumérico em 10 minutos pra dev BR"

### C2. Tier A (ship próximas 2-4 semanas)

**AI Synthetic Data pra Training** ⭐⭐⭐
- **Status:** Global trend 2024-2026. SAS, AWS, Snowflake investindo pesado.
- **Oportunidade BR:** pouco conteúdo em PT-BR. Ser referência cedo.
- **Ação:** Blog pillar "LLM training com synthetic data: cenário BR 2026"

**Pix Automático (recorrência)** ⭐⭐
- **Status:** Lançado 2025, adoção crescente 2026. Devs precisam testar.
- **Keywords:** "testar pix automático", "mock pix recorrência"
- **Ação:** Landing `/pix-automatico-dados-teste` + blog "Pix Automático: como testar antes de ir pra prod"

**Carteira de Identidade Nacional (CIN)** ⭐⭐
- **Status:** Substituindo RG gradualmente desde 2023.
- **Já temos:** `/gerador-cin`.
- **Expandir:** Blog "CIN vs RG: calendário de migração + impacto nos sistemas"

### C3. Tier B (research mais fundo antes de ship)

**Reforma Tributária 2026-2033** ⭐⭐
- **Impacto:** NFSe nacional, CBS/IBS, DIFAL mudanças
- **Oportunidade:** poderia virar vertical nova (`/gerador-nfse-nacional`)
- **Risco:** especialização alta, demanda pode não materializar

**Open Finance + Open Insurance** ⭐
- **Status:** Expansão regulatória contínua
- **Oportunidade:** APIs com dados sintéticos pra testar integrações
- **Ação:** avaliar após medir Fase 3 performance

**PIX Fraud / anti-fraude testing** ⭐
- **Status:** Crescente desde 2023. Bancos investindo em testes.
- **Oportunidade:** Preset "pix_fraud_scenario" + landing B2B
- **Ação:** investigar demanda via Ubersuggest

---

## Plano priorizável

### Sprint próximo (próximas 2 semanas, ship no roadmap Q4 existente)

**Alta prioridade (ROI claro):**
1. Landing `/dados-sinteticos` + blog pillar sobre synthetic data (reposicionamento categoria)
2. Landing `/para-qa-engineers` + blog Test Data Management QA brasileira
3. Blog CNPJ Alfanumérico "ERP legado e migração 2026"
4. Blog Mockaroo FakeForge (JÁ SHIPADO 30/set)

**Média prioridade (validar antes):**
5. Landing `/dados-sinteticos-machine-learning` (data scientist persona)
6. Blog "Pix Automático: como testar antes de prod"
7. Landing `/para-dpo-compliance` (enterprise CTA)

### Sprint seguinte (semanas 3-4)

8. Fase 4B: Validator por estado (27 UFs × 2 verticais = 54 landings — pattern programático)
9. Landing `/dados-para-prototipo-figma` (PM/UX persona)
10. Blog pillar synthetic data pra ML training BR

### Backlog pra validar antes

- Partnerships Base dos Dados, Celcoin
- Landing educador/estudante (baixo ROI mas backlinks potential)
- Vertical Reforma Tributária (research primeiro)
- Open Insurance landing

---

## Como validar essas apostas

**Rolling 2 semanas:**
- Depois de shipar cada landing, Request Indexing GSC
- Após 14 dias, checa impressions no GSC Performance por URL nova
- Se >50 impressions/semana + CTR >1%, double down na persona
- Se <10 impressions, kill ou reescrever

**Métricas por persona:**
- Signup source URL (tag query param `?from=qa` nas CTAs das landings nicho)
- Conversion por source → Dev plan
- LTV por persona (quando houver volume)

---

## O que NÃO fazer agora

- **Não** sair construindo todas as 10 personas de uma vez. Dilui foco.
- **Não** gastar tempo em verticais trending especulativos (Open Insurance, Reforma Tributária) antes de validar com 2-3 blog posts primeiro.
- **Não** reposicionar o produto principal — adicionar camada "synthetic data" como narrativa paralela, não substituir "gerador BR".
- **Não** parar o foco em dev. Dev continua core persona com maior volume e intent. Expansão é + não ×.

---

## Decisão requerida de você

Quais dessas 3 apostas você quer shippar essa semana (eu disparo agents)?

**A)** Landing `/dados-sinteticos` + blog pillar "Synthetic data: o que é e por que BR precisa"
**B)** Landing `/para-qa-engineers` + blog "Massa de dados QA brasileira: guia prático"
**C)** Blog "ERP legado + CNPJ alfanumérico: 10 cuidados pra julho/2026" (sprint CNPJ Tier S)

Qualquer combinação. Ou todas as 3. Me diz quais e disparo paralelo.
