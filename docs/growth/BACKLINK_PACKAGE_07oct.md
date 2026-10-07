# Backlink Package — 07/out/2026

Pacote completo dos níveis A, B e C do roadmap de backlinks. Executar na ordem: disavow urgente → diretórios → guest post → monitoring.

---

## 🚨 Urgente: Disavow PBN spam

### Diagnóstico

Ubersuggest flagou 70 ref domains apontando pra fakeforge.com.br com **anchor text spam de PBN** (Private Blog Network):

> `"high quality dofollow backlinks da 50 pa 40 premium pbn network service fakeforge.com.br rank first page google fast seo link building buy backlinks online cheap"`

Isso é vendedor de SEO blackhat usando o nome do site como keyword de serviço. Google pode penalizar como manipulação de ranking se não limpar.

### Ação manual (10-15 min)

1. **Entrar em GSC** → https://search.google.com/search-console
2. Property `fakeforge.com.br` → menu lateral **Links** → **External links**
3. Baixar lista completa (ou usar Ubersuggest em dash `/backlinks/fakeforge.com.br` pra confirmar nomes dos 70 domains)
4. Criar arquivo `disavow.txt` local no formato:

```
# Disavow PBN spam detectado 07/10/2026
# Anchor: "high quality dofollow backlinks da 50 pa 40..."
domain:exemplo1.com
domain:exemplo2.net
...
```

Uma linha por domain. Prefixo `domain:` disavow todos os paths daquele domain.

5. Upload em **Disavow Links tool**: https://search.google.com/search-console/disavow-links
6. Google demora 2-6 semanas pra processar. Depois disso, re-audit no Ubersuggest.

### Alternativa parcial

Se quiser skipar manual: ignora o PBN, foca em acumular backlinks LEGÍTIMOS (próximos passos). PBN sozinho não necessariamente penaliza — Google ignora se detectar automaticamente. Mas disavow é hygiene preventiva.

---

## Nível A1 — Backlink audit atual

### Métricas confirmadas

| Métrica | Valor | Fonte |
|---|---|---|
| Domain Authority | 10 | Ubersuggest 06/out |
| Backlinks totais | 73 | Ubersuggest |
| Ref domains | 56 | Ubersuggest |
| Dofollow / Nofollow | 70 / 3 | Ubersuggest |
| Anchor text #1 (70 domains) | PBN spam | ⚠️ needs disavow |

### Gap vs competidores

| Site | DA | Backlinks | Ref Domains |
|---|---|---|---|
| **FakeForge** | 10 | 73 | 56 |
| BrasilAPI | 19 | 4.346 | 402 |
| 4devs | 43 | 10.977 | 1.603 |
| Mockaroo | 47 | 18.212 | 3.040 |

**Realidade:** levar FakeForge de DA 10 → DA 30 em 12 meses exige **~500-800 novos ref domains legítimos**. ~10-15/semana sustentado. Não é 1 campanha, é cadência.

---

## Nível A2 — Dev blogs BR priorizados

Lista research 07/out via WebSearch + conhecimento prévio. Classificação por fit, não por DA.

### Tier 1 — Dev influencers com blog ativo

| Pessoa | Site | DA (est) | Audiência | Status |
|---|---|---|---|---|
| **Filipe Deschamps** | brasilapi.com.br / YouTube | 19 (BrasilAPI) | 1M+ YouTube | ✅ Draft #1 pending |
| **Fabio Akita** | akitaonrails.com | 40+ | Dev senior Ruby/Go | ✅ Draft #2 pending |
| **Felipe Fialho** | felipefialho.com | 30+ | Dev community curator | ✅ Draft #3 pending |

### Tier 2 — Publicações / comunidades BR

| Site | DA | Audiência | Status |
|---|---|---|---|
| **TabNews** | 50+ | 50K+ devs ativos | ✅ Draft #4 pending |
| **Dev.to tag #braziliandevs** | 90+ (dev.to global) | Dev BR Dev.to | Pending next round |
| **Hashnode BR community** | 70+ | Dev BR Hashnode | Pending next round |
| **BrazilJS** | 40+ | Dev JS BR | Pending next round |
| **React Brasil** | 30+ | Dev React BR | Pending next round |
| **Comunidade Python Brasil** | 50+ | Dev Python BR | Pending next round |

### Tier 3 — Ed-tech BR (brand compound)

| Org | DA | Audience/ano | Status |
|---|---|---|---|
| **Rocketseat** | 60+ | 100K+ alunos | ✅ Draft #5 pending |
| **Alura** | 70+ | 500K+ alunos | Pending next round |
| **DIO (Digital Innovation One)** | 55+ | 1M+ alunos | Pending next round |
| **Treina Web** | 40+ | 200K+ alunos | Pending next round |

### Tier 4 — Blogs técnicos de empresas BR

| Blog | DA | Audiência | Status |
|---|---|---|---|
| **Nubank Engineering** | 90+ | Dev senior | Precisa referência interna |
| **iFood Engineering** | 85+ | Dev senior | Precisa referência interna |
| **Mercado Livre tech** | 85+ | Dev senior | Precisa referência interna |
| **Nextel/Gympass** | 70+ | Dev senior | Precisa referência interna |

Blogs corporativos só aceitam contribuição se tiver relação interna. Deixa pra depois.

---

## Nível A3 — Competitor backlink mapping

Objetivo: achar sites que linkam pra 2+ competidores mas NÃO pra FakeForge = "link intersect" = alvos óbvios.

### Status research

Ubersuggest `backlink_opportunity` com positive_targets 4devs + BrasilAPI + Datafaker e negative_targets FakeForge retornou **lista vazia** no primeiro pull. Pode ser throttle de API ou plano Lite não libera. Dois caminhos:

**Caminho 1 — Fonte alternativa (recomendado):**
- Semrush MCP: `backlinks_research` com mesma config → dado mais robusto
- Executar na próxima sessão, custa 1-2 reports Semrush

**Caminho 2 — Research manual (zero MCP):**
- Olhar top 50 ref domains do BrasilAPI (via Ubersuggest) manualmente
- Cruzar com top 50 do 4devs manualmente
- Identificar overlap = alvos

### Hipótese sem dado completo

Com base nos top pages dos competidores já pullados (`domain_top_pages` em sessão 06/out):

- **GitHub repos** linkam muito pro 4devs e BrasilAPI (ambos têm milhares de backlinks dessa fonte)
- **Blog posts tutoriais** linkam ambos
- **Awesome lists** (já estamos em algumas, falta mais)
- **Dev.to e Hashnode posts** mencionam ambos

Hipótese: top overlap vem de **awesome lists dev + repos educacionais no GitHub**. Isso bate com o Nível B que já executamos (3 PRs em awesome lists em 06-07/out).

---

## Nível A4 — Diretórios dev tools

Lista research 07/out. Ordem por facilidade de aceitação + autoridade.

### Submissão imediata (grátis, 15-30min cada)

| Diretório | DA | Link submission | Esforço |
|---|---|---|---|
| **SaaSHub** | 60+ | https://www.saashub.com/submit-software | 15min, dofollow garantido |
| **AlternativeTo** | 85+ | https://alternativeto.net/software/new/ | 20min, precisa listar alternatives |
| **StackShare** | 90+ | https://stackshare.io/submit | 20min, categoria "Testing & QA" |
| **Indie Hackers Products** | 85+ | https://www.indiehackers.com/post/products/new | 15min, parte do profile |
| **BetaList** | 65+ | https://betalist.com/submit | 20min, waitlist pra listing |
| **ListMySaaS** | 30 | https://listmysaas.com/submit | 10min, free tier |
| **Product Hunt** | 90+ | https://www.producthunt.com/products/new | 60min + lançamento coordenado em 1 dia |
| **Toolify** | 50+ | https://www.toolify.ai/submit | 15min |
| **StartupLister** | 40+ | https://startuplister.com/submit | 15min |
| **Softpedia** | 85+ | https://submit.softpedia.com/ | 30min, categoria Developer Tools |

### Diretórios BR específicos

| Diretório | DA | Link | Esforço |
|---|---|---|---|
| **Startups.com.br diretório** | 50+ | https://startups.com.br/empresas/cadastrar | 10min |
| **Startupi** | 55+ | https://startupi.com.br/ (mandar press release) | 20min |
| **StartSe** | 50+ | Suas listas comunitárias | 15min |

### Diretórios dev-specific

| Diretório | DA | Link | Nicho |
|---|---|---|---|
| **DEV.to listed products** | 90+ | listed.dev integração | Dev tools |
| **Hacker News "Show HN"** | 90+ | https://news.ycombinator.com/submit | 1 shot post, big impact se der traction |
| **Reddit r/webdev showcase** | — | Weekly thread showcase | Dev community |
| **Reddit r/brdev** | — | Direct post | BR dev community |

### Submissões que NÃO valem

Pularia:
- G2 e Capterra: só vale com 5+ reviews reais
- Trustpilot: generalista demais
- Pagas tipo PromoteSaaS, SubmitSaaS: ROI ruim pré-tração

---

## Nível C — Monitoring de menções (setup)

### Approach escolhido

Alertas automáticos de novas menções do FakeForge na web. 2 fontes:

### Opção 1 — Google Alerts (grátis, manual setup)

1. Vai em https://www.google.com/alerts
2. Cria 5 alertas:
   - `"fakeforge"`
   - `"fakeforge.com.br"`
   - `"fakeforge-br" npm`
   - `"fakeforge-br" pypi`
   - `"everpaula/fakeforge-br"` site:github.com
3. Frequency: as-it-happens
4. Delivery: `contato@fakeforge.com.br`
5. 5-10min setup, 0 manutenção

### Opção 2 — Mention.com (grátis até 1000 menções/mês)

Mais sofisticado, inclui social media. Setup 10min, $0 até volume alto.

### Opção 3 — Build custom (não recomendo pré-tração)

Cron rodando WebSearch "fakeforge" semanal, grava em novas rows numa tabela `mentions`, email de digest. Overkill agora.

### Processo quando menção aparece

Alert → você olha → se linka sem backlink, usa o workflow de outreach pra pedir link educadamente. Draft automatizado:

```
Oi [nome],

Vi que você mencionou FakeForge no seu post sobre [tópico]. Valeu pela mention!

Se fizer sentido, agradeceria se pudesse adicionar o link https://fakeforge.com.br quando mencionar — ajuda outros devs a encontrar.

Sem pressão. Se não couber, de boa.

Abraço,
Everton
```

Posso automatizar esse draft via workflow approval quando a tabela `mentions` tiver dados.

---

## O que já foi executado nessa sessão

- ✅ Infra outreach approval workflow deployed (commit ce8279d)
  - Tabela `outreach_drafts` com RLS
  - API `/api/admin/outreach-drafts` com GET/POST/PATCH
  - UI `OutreachInbox` no admin dashboard com Approve/Edit/Reject
- ✅ 5 drafts REAIS seeded pending approval:
  - #1 Filipe Deschamps (BrasilAPI) — prio 10, partnership
  - #2 Fabio Akita — prio 9, guest post review
  - #3 Felipe Fialho — prio 7, relationship followup
  - #4 TabNews — prio 8, guest post pitch LGPD+CI/CD
  - #5 Rocketseat — prio 9, partnership ed-tech

## Suas ações manuais

**Hoje (30-45min):**
1. Disavow PBN spam (10min + aguardar 2-6 semanas)
2. Revisar 5 drafts no admin dashboard `/admin` → Outreach Inbox
3. Aprovar/editar/rejeitar cada um (10s/draft × 5)

**Essa semana (2h total):**
4. Submeter em 5 diretórios Nível A4 top (SaaSHub, AlternativeTo, StackShare, Indie Hackers, Toolify)
5. Configurar Google Alerts (5min)

**Próxima sessão (eu rodo):**
6. Mais 10-15 drafts personalizados do Tier 2/3 de dev blogs BR
7. Research backlink intersect via Semrush se autorizar
8. Templates pra submissão em Hacker News "Show HN" (coordenar lançamento 1 dia)
