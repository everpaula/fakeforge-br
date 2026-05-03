# FakeForge Blog Pipeline (MVP)

Pipeline local para gerar posts do blog automaticamente via Claude API.

## Setup

1. Adicione no `.env.local`:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```

2. Garanta que tem `gh` CLI instalado e autenticado (`gh auth status`).

## Uso

```bash
# Gerar e criar PR direto
KEYWORD="gerador placa mercosul" INTENT=tutorial npm run gen:blog

# Apenas gerar arquivo, sem PR
KEYWORD="gerador placa mercosul" INTENT=tutorial SKIP_PR=true npm run gen:blog
```

### Intent values

- `tutorial` — passo a passo com código rodável
- `comparison` — comparativo entre ferramentas
- `informational` — explicação de conceito
- `news` — atualização regulatória ou de produto

## Como funciona

1. **Outline** (Claude Sonnet, ~$0.03): gera title, slug, meta, categoria, estrutura H2/H3
2. **Draft** (Claude Sonnet, ~$0.11): escreve o artigo seguindo o outline
3. **FAQs** (Claude Haiku, ~$0.005): gera 5 perguntas-resposta
4. **Quality gate**: valida word count, H2s, code blocks, palavras banidas, FAQs
5. **Compile**: gera o `.tsx` com `BlogFeaturedImage` e schema FAQPage
6. **Git**: cria branch `blog/auto-{slug}`, commita, push e abre PR

**Custo médio: ~$0.15/post** (Sonnet pricing 2026).

## Quality gate

Falha se:
- < 1200 palavras (cap superior 2800)
- < 5 H2s
- < 1 code block (em tutoriais e conceitos)
- < 4 FAQs
- Qualquer palavra banida (lista em `config.ts`)

Drafts que falham são salvos em `/tmp/blog-draft-{slug}.md` para review manual.

## Próximos passos

- Fase 2: research via Tavily/SerpAPI antes do outline
- Fase 2: pgvector pra dedup contra posts já publicados
- Fase 3: Vercel Cron + GitHub Action pra automação completa
