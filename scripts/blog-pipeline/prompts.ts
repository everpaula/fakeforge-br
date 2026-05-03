// Prompts para cada etapa do pipeline.
import { FAKEFORGE_CONTEXT, TONE_RULES } from "./config.js";

export type Intent = "tutorial" | "comparison" | "informational" | "news";
export type Category = "Tutoriais" | "LGPD" | "Conceitos" | "Comparativos" | "News";

export function outlinePrompt(keyword: string, intent: Intent): string {
  return `Você é redator técnico do blog FakeForge BR.

${FAKEFORGE_CONTEXT}

${TONE_RULES}

TAREFA: gerar outline detalhado de artigo SEO sobre "${keyword}" com intenção ${intent}.

Retorne markdown estruturado:

# Title: ...
(max 65 chars, keyword no início ou natural, sem clickbait)

# Slug: ...
(kebab-case, max 60 chars)

# Meta: ...
(max 155 chars, com benefício claro)

# Category: Tutoriais|LGPD|Conceitos|Comparativos|News

# ReadTime: X min de leitura

## Outline
- H2: Definição/contexto inicial
  - H3: ...
- H2: ... (8-10 H2s no total)
  ...
- H2: Resumo / próximos passos

## Code blocks needed
- [linguagem] propósito
- ...

## Internal links suggested
- /url-interno : âncora natural
- ...

Sem fluff. Comece já com o título.`;
}

export function draftPrompt(keyword: string, intent: Intent, outline: string): string {
  return `Você é redator técnico do blog FakeForge BR.

${FAKEFORGE_CONTEXT}

${TONE_RULES}

OUTLINE APROVADO (siga exatamente):
${outline}

TAREFA: gerar o artigo completo em markdown.

REQUISITOS:
- 1500-2200 palavras (cap rígido).
- Code blocks com linguagem (\`\`\`ts, \`\`\`bash, \`\`\`python). Mínimo 1 bloco rodável.
- Pelo menos 1 tabela (formato markdown ou texto estruturado).
- Pelo menos 1 callout em quote: "> AVISO:" ou "> DICA:".
- Última seção H2 deve ser "Resumo" com 4-6 bullets acionáveis.
- NÃO inclua FAQ no artigo (geramos depois separadamente).
- NÃO use frase de fechamento marketeira ("agora você está pronto").
- Use Link interno do FakeForge quando fizer sentido (formato: [texto](/url)).
- NÃO escreva o frontmatter — só o corpo do artigo a partir do primeiro parágrafo.

Comece já com o primeiro parágrafo do artigo (sem cabeçalho, sem H1 — o H1 é injetado pelo template).`;
}

export function faqPrompt(title: string, body: string): string {
  return `Você é redator do blog FakeForge BR.

ARTIGO:
${body}

TAREFA: gerar 5 FAQs realistas que devs brasileiros buscariam após ler este artigo.

REGRAS:
- Cada pergunta concreta, NÃO retórica.
- Resposta de 40-90 palavras, técnica, com exemplo concreto se aplicável.
- Tom: ${TONE_RULES.split("\n")[2]}
- NÃO repita conteúdo idêntico do artigo — complemente.

FORMATO DE SAÍDA — JSON puro, sem markdown, sem comentários, exatamente:
{
  "faqs": [
    { "q": "...", "a": "..." },
    ...
  ]
}`;
}
