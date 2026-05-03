# FakeForge Blog Pipeline (MVP)

Pipeline local para gerar posts do blog automaticamente usando o **Claude Code CLI**.

**Sem API key separada.** Usa a sessão já logada do seu Claude Code (assinatura Pro/Max/Teams).

## Setup

1. **Garanta que está logado no Claude Code:**
   ```bash
   claude login
   ```
   (você já está, se está usando Claude Code agora)

2. **Garanta que o `gh` CLI está autenticado:**
   ```bash
   gh auth status
   ```

3. **Pronto.** Não precisa de `ANTHROPIC_API_KEY` no `.env.local`.

## Uso

```bash
# Gerar post + criar PR direto no GitHub
KEYWORD="gerador placa mercosul" INTENT=tutorial npm run gen:blog

# Apenas gerar arquivo, sem PR (review manual antes)
KEYWORD="gerador placa mercosul" INTENT=tutorial SKIP_PR=true npm run gen:blog
```

### Intents

- `tutorial` — passo a passo com código rodável
- `comparison` — comparativo entre ferramentas (code blocks opcionais)
- `informational` — explicação de conceito (code blocks opcionais)
- `news` — atualização regulatória ou de produto

## Como funciona

1. **Outline** (Sonnet via `claude -p --model sonnet`): gera title, slug, meta, categoria, estrutura H2/H3
2. **Draft** (Sonnet): escreve o artigo seguindo o outline (1500-2200 palavras)
3. **FAQs** (Haiku): gera 5 perguntas-resposta em JSON
4. **Quality gate** local: word count, H2s, code blocks, palavras banidas, FAQs
5. **Compile**: gera o `.tsx` com `BlogFeaturedImage` + schema FAQPage
6. **Git**: cria branch `blog/auto-{slug}`, commita, push e abre PR via `gh pr create`

## Custos

Como usa o CLI logado, o custo é coberto pela sua assinatura Claude Code (não precisa adicionar créditos no console.anthropic.com).

Limites: os mesmos da sua assinatura (Pro: ~5h por 5h, Max: muito maior).

## Quality gate

Falha se:
- < 1200 palavras (cap superior 2800)
- < 5 H2s
- < 1 code block (em tutoriais e conceitos)
- < 4 FAQs
- Qualquer palavra banida (lista em `config.ts`)

Drafts que falham são salvos em `/tmp/ff-draft-{slug}.md` para review manual.

## Pre-push hook

`.husky/pre-push` roda `npm run build` antes de cada push e aborta se falhar — previne deploys quebrados. Pra pular: `SKIP_BUILD_HOOK=1 git push`.

## Próximos passos (Fase 3)

- Research via Tavily/SerpAPI antes do outline
- pgvector pra dedup contra posts já publicados
- GitHub Actions com `claude setup-token` rodando 1 post/dia automático
