# FakeForge BR — SEO + Marketing Roadmap

**Status atual (auditoria 2026-05-23):** SEO foundation está em ~80% maturity. Sitemap, robots, metadata template, Schema.org SoftwareApplication, llms.txt, OG/Twitter, 17 blog posts long-tail, comparison page, multi-currency Offers no JSON-LD. **Esse projeto está mais maduro que CalculaHub e toolkit.**

Este doc lista os 20% restantes em ordem de ROI. Foco em ROI sobre o esforço, não em listar tudo possível.

---

## SEO: top 5 wins ranqueados

### 1. Internal linking entre geradores (impacto: alto · esforço: baixo)

Cada gerador page deve fechar com uma seção "Geradores relacionados" linkando 4-6 outros geradores semanticamente próximos:

- **gerador-cpf** → gerador-cnpj, gerador-pessoa, gerador-rg, validar-cpf
- **gerador-cnpj** → gerador-cpf, gerador-empresa, gerador-cnpj-alfanumerico, validar-cnpj
- **gerador-cep** → gerador-endereco, gerador-telefone, gerador-pessoa
- **gerador-pix** → gerador-cartao, gerador-conta-bancaria, gerador-cpf

Padrão: componente `RelatedGenerators` recebendo array de slugs + categoria.

**Por quê:** internal linking spread PageRank entre geradores (cada gerador hoje recebe link só do `/geradores` hub + sitemap). Spread = todos sobem juntos.

**Esforço:** 1 componente reutilizável + 15-20 minutos por gerador adicionar. Total ~3h.

### 2. Schema enrichment per-gerador (impacto: médio · esforço: baixo)

Cada gerador hoje herda só o SoftwareApplication do root layout. Adicionar per-page schema enriquecido:

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Gerador de CPF Válido",
  "url": "https://fakeforge.com.br/gerador-cpf",
  "applicationCategory": "DeveloperApplication",
  "browserRequirements": "Requires JavaScript",
  "isPartOf": {"@type": "WebSite", "name": "FakeForge BR"},
  "audience": {"@type": "Audience", "audienceType": "Software Developers"},
  "featureList": [
    "Gerador em lote (até 10.000 CPFs)",
    "Validação algoritmo mod-11",
    "Export JSON/CSV/SQL",
    "API REST gratuita"
  ]
}
```

**Por quê:** Google e AI Overviews entregam featureList em rich snippets pra geradores. Aumenta CTR.

**NÃO fazer:** HowTo schema (deprecated Set/2023), FAQPage (restricted to government/healthcare per Google Aug/2023 update).

**Esforço:** template + 5 min por gerador. Total ~2h.

### 3. Programmatic SEO: variações city-specific (impacto: alto · esforço: médio)

`/gerador-cep` é genérico. Crie variações city-specific aproveitando o coherent address generator que já existe:

- `/gerador-cep/sao-paulo` — "Gerador de CEP São Paulo válido"
- `/gerador-cep/rio-de-janeiro`
- `/gerador-cep/belo-horizonte`
- `/gerador-cep/porto-alegre`
- `/gerador-cep/curitiba`
- `/gerador-cep/salvador`
- `/gerador-cep/brasilia`
- `/gerador-cep/fortaleza`
- `/gerador-cep/recife`
- `/gerador-cep/manaus`

10 cidades = 10 long-tail pages. Cada uma com:
- H1 city-specific
- Conteúdo de 300-400 palavras (estados, bairros típicos da cidade, exemplos)
- Gerador filtrado por cidade
- Internal link pra gerador-cep genérico

Mesmo padrão pode aplicar pra:
- `/gerador-telefone/[ddd]` (11 SP, 21 RJ, 31 BH, etc) — 27 DDDs
- `/gerador-cnh/[categoria]` (A, B, C, D, E, AB)

**Per claude-seo SKILL warning:** "HARD STOP at 50+ location pages." Mantenha em 10 cidades CEP + 5 DDDs principais por enquanto = 15 pages. Cada uma com 60%+ conteúdo único.

**Por quê:** "gerador cep são paulo" tem volume de busca alto, dificuldade média. 10 pages = 10 long-tail wins.

**Esforço:** template + 1h por categoria (10 cidades em ~3h, 5 DDDs em ~2h). Total ~5h.

### 4. Content marketing: 1 blog post novo por semana (impacto: alto · esforço: contínuo)

Você já tem 17 posts. Cadência futura focada em:

**Buckets de conteúdo prioritários:**
- **"Como gerar X em Y linguagem"** (Python, Node, PHP, Ruby) — 4 posts/linguagem
- **"Validar X em Y framework"** (Cypress, Playwright, Jest, Vitest) — 4 posts/framework
- **"X vs Y" (comparativos)** — Mockaroo, Faker.js, 4Devs, GeradorDeCNPJ.com
- **"Por que evitar dados reais em staging"** (LGPD angle, aparece em sitemap já)
- **"Padronização de dados de teste em CI/CD"** (DevOps angle)

**Padrão de post (cada um):**
- 1500-2500 palavras
- 1 frase-thesis no início (não "ChatGPT-warm-up")
- 2-3 code snippets executáveis
- Link 3-5 vezes pra geradores relevantes
- Schema Article + Author (Everton Paula)
- Internal link pra 3-4 outros blog posts

**Esforço:** 2-3h por post. Sustentável em 1/semana = ~10h/mês.

### 5. Backlink + dev community outreach (impacto: alto · esforço: médio)

FakeForge tá invisível em 3 lugares onde devs BR procuram:

1. **Reddit /r/brdev** — fazer 1 post mensal: tutorial + link no final. Não promocional, valor-first.
2. **Dev.to BR community** — repostar os melhores blog posts em dev.to com canonical apontando pro FakeForge.
3. **Awesome lists no GitHub** — submeter PR pra awesome-brazil-developer-resources, awesome-fake-data, etc.

**Não fazer:** comprar backlinks, spam guest posts, link farms. Tudo isso é detectado e penaliza.

**Esforço:** 2h/mês de outreach contínuo.

---

## Marketing skills: top 3 plays

### 1. Conversion funnel hardening (impacto: alto · esforço: médio)

Você já tem a estrutura: free generator → API discovery → API integration → pricing → upgrade.

**O gap atual:** falta tracking + nudges no ponto certo da jornada.

**Mover agora:**
- Event tracking via Umami (already configured): `api_cta_shown`, `api_cta_clicked`, `api_docs_visited`, `rate_limit_hit`, `pricing_viewed`, `upgrade_clicked`
- A/B test no `ApiCtaBanner`: variant A = mostra após primeira geração (current), variant B = mostra após 3ª geração. Hipótese: B converte melhor (user já investido).
- Email capture suave em `/blog` posts: 1 lead magnet ("Cheatsheet: 50 dados BR pra teste em PDF") em troca de email. Onboarding sequence de 5 emails apresentando geradores + casos de uso.

**Esforço:** 4-6h.

### 2. Comparison play expansion (impacto: alto · esforço: baixo)

`/comparacao/fakeforge-vs-alternativas` já existe (priority 0.85 no sitemap). Expandir pra páginas de comparação 1-vs-1:

- `/comparacao/fakeforge-vs-mockaroo`
- `/comparacao/fakeforge-vs-fakerjs`
- `/comparacao/fakeforge-vs-4devs`
- `/comparacao/fakeforge-vs-faker-py`
- `/comparacao/fakeforge-vs-bogus-net`

Padrão de página:
- Tabela head-to-head (BR-specificity, API gratuita, formato output, validações, preço, language support)
- Veredito honesto (não trash competitors)
- Use case onde FakeForge ganha + use case onde concorrente ganha
- 800-1200 palavras

**Por quê:** searches "X vs Y" tem alta intent + baixa concorrência específica.

**Esforço:** 1.5h por página, 5 páginas = 7-8h. 1 página/semana.

### 3. Developer marketing: parcerias estratégicas (impacto: alto · esforço: alto)

Página `/parceiros` já existe (priority 0.4). Reescrever pra **active partnership outreach**:

- **Bootcamps BR**: Rocketseat, Alura, Trybe, Kenzie, Awari, Driven. Pitch: "vocês mencionam dados de teste em currículo? Nós podemos ser o gerador padrão dos seus exercícios, com créditos especiais pra alunos."
- **Comunidades dev BR**: He4rt, Codigo Fonte, brazilJS, RubyConfBR. Pitch: "sponsor de meetup ou content + free Dev tier pros membros."
- **Open source BR**: contribuidores ativos em projetos open source BR (e-commerce, gov, fintech) frequentemente precisam de dados de teste. Outreach 1-1.

**Esforço:** 8-12h pra primeira leva de outreach (10 contatos qualificados), depois 2-3h/mês de manutenção.

---

## Cronograma sugerido pra próximas 4 semanas

| Semana | Foco | Entregas |
|---|---|---|
| Sem 1 (atual) | SEO foundation | 1) Internal linking componente + 5 geradores principais. 2) Per-gerador schema. |
| Sem 2 | Programmatic SEO | 10 city-specific CEP pages + componente reusável |
| Sem 3 | Comparison expansion | 3 comparison pages novas (Mockaroo, Faker.js, 4Devs) |
| Sem 4 | Marketing | Tracking implementation + lead magnet PDF + dev community outreach (3 communities) |

**Total ~25-30h spread em 4 semanas (~7h/semana sustentável).**

---

## O que NÃO mexer

- ❌ Não toque no `next.config.ts` sem cuidado (Turbopack 16 breaking changes)
- ❌ Não adicione HowTo schema (deprecated Set/2023)
- ❌ Não adicione FAQPage schema em sites comerciais (Google Aug/2023 restriction)
- ❌ Não compre backlinks ou submeta a directory farms (penaliza)
- ❌ Não force keyword stuffing nos blog posts (penaliza E-E-A-T)
- ❌ Não traduza pra outras línguas ainda (foco BR primeiro, dilui authority)

---

## Como medir

Métricas pra acompanhar mensalmente:
- Organic traffic from Google Search Console (target: +20% mês a mês primeiro 3 meses)
- Rankings top 10 keywords (target: 5 keywords no top 3 em 90 dias)
- API conversion rate (free → paid)
- Email list size (lead magnet sign-ups)
- Backlinks novos via Ahrefs/Moz (target: +5/mês)

---

*Roadmap gerado 2026-05-23 com base em claude-seo + marketingskills patterns aplicados ao stack atual do FakeForge. Re-avaliar a cada 4 semanas.*
