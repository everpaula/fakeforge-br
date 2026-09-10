import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BlogFeaturedImage from "@/components/BlogFeaturedImage";
import ShareBar from "@/components/ShareBar";
import BlogPostingSchema from "@/components/BlogPostingSchema";

export const metadata: Metadata = {
  title: "CNPJ Alfanumérico 2026: Checklist de Migração",
  description: "O CNPJ passa a aceitar letras em 01/07/2026. Veja o checklist técnico completo: banco de dados, APIs, validações e bibliotecas que precisam mudar.",
  openGraph: {
    title: "CNPJ Alfanumérico 2026: Checklist de Migração",
    description: "O CNPJ passa a aceitar letras em 01/07/2026. Veja o checklist técnico completo: banco de dados, APIs, validações e bibliotecas que precisam mudar.",
    type: "article",
    images: ["/api/og?title=CNPJ%20Alfanum%C3%A9rico%3A%20checklist%20completo%20para%20migrar%20antes%20de%2001%2F07%2F2026&subtitle=O%20CNPJ%20passa%20a%20aceitar%20letras%20em%2001%2F07%2F2026.%20Veja%20o%20checklist%20t%C3%A9cnico%20completo%3A%20banco%20de%20dados%2C%20APIs%2C%20valida%C3%A7%C3%B5es%20e%20bibliotecas%20que%20precisam%20&category=NEWS"],
  },
  alternates: { canonical: "/blog/cnpj-alfanumerico-checklist-migracao-2026" },
};

export default function Post() {
  return (
    <PageShell>
      <article className="max-w-2xl">
        <Link href="/blog" className="text-xs text-primary hover:underline mb-4 inline-block">
          ← Voltar ao blog
        </Link>
        <BlogFeaturedImage category="News" title="CNPJ Alfanumérico: checklist completo para migrar antes de 01/07/2026" className="mb-6" />
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
            CNPJ Alfanumérico: checklist completo para migrar antes de 01/07/2026
          </h1>
          <div className="flex items-center gap-3 text-xs text-muted mt-3">
            <time>06 de maio de 2026</time>
            <span>·</span>
            <span>9 min de leitura</span>
          </div>
        </div>

        <div className="prose-custom space-y-2 text-sm text-muted-foreground leading-relaxed">
          <p className="mb-4">Em 01/07/2026, o CNPJ passa a aceitar caracteres alfanuméricos. A mudança vem da Instrução Normativa RFB nº 2229/2024 e afeta qualquer sistema que valida, armazena ou processa CNPJ — banco de dados, APIs, formulários, ERPs. Este checklist cobre os pontos técnicos que precisam de atenção antes da virada.</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">O que muda no CNPJ a partir de 01/07/2026</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Formato atual vs. formato alfanumérico</h3>
          <p className="mb-4">O CNPJ tem 14 posições: 8 dígitos de raiz, 4 de ordem e 2 dígitos verificadores. No formato atual, todas as 14 posições são numéricas. A partir de julho de 2026, as 8 posições da raiz podem conter letras maiúsculas além de números. Os 4 dígitos de ordem e os 2 verificadores continuam numéricos.</p>
          <div className="my-6 rounded-xl bg-card border border-border overflow-x-auto"><table className="w-full text-sm"><thead className="bg-card-hover"><tr><th className="text-left px-3 py-2 text-muted-foreground font-medium">Posição</th><th className="text-left px-3 py-2 text-muted-foreground font-medium">Descrição</th><th className="text-left px-3 py-2 text-muted-foreground font-medium">Formato atual</th><th className="text-left px-3 py-2 text-muted-foreground font-medium">Formato novo</th></tr></thead><tbody><tr className="border-b border-border"><td className="px-3 py-2">1–8</td><td className="px-3 py-2">CNPJ raiz</td><td className="px-3 py-2">0–9</td><td className="px-3 py-2">0–9, A–Z</td></tr><tr className="border-b border-border"><td className="px-3 py-2">9–12</td><td className="px-3 py-2">Ordem</td><td className="px-3 py-2">0–9</td><td className="px-3 py-2">0–9</td></tr><tr className="border-b border-border"><td className="px-3 py-2">13–14</td><td className="px-3 py-2">Dígitos verificadores</td><td className="px-3 py-2">0–9</td><td className="px-3 py-2">0–9</td></tr></tbody></table></div>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Quais caracteres serão permitidos</h3>
          <p className="mb-4">A IN RFB nº 2229/2024 prevê letras maiúsculas de A a Z nas posições da raiz. À data de publicação deste artigo, a Receita Federal não excluiu explicitamente vogais — portanto, trate todos os 26 caracteres como possíveis e implemente validação para <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">[A-Z0-9]</code>. Monitore o portal da Receita para atualizações antes de maio de 2026.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Retrocompatibilidade: CNPJs numéricos existentes não mudam</h3>
          <p className="mb-4">CNPJs emitidos antes da mudança permanecem válidos e não são renumerados. A base de CNPJs ativos estimada em 58 milhões (Receita Federal, 2024) continua intacta. O novo formato se aplica apenas a CNPJs emitidos a partir de julho de 2026.</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Quem é obrigado a se adequar e até quando</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Empresas que emitem ou recebem NF-e, NFS-e, CT-e</h3>
          <p className="mb-4">O leiaute de NF-e 4.0 aceita o CNPJ como string. Porém, sistemas que fazem parse do XML e armazenam o CNPJ em campo numérico quebram na primeira nota com letra. A SEFAZ publica cronograma próprio — acompanhe o Portal NF-e para atualizações de schema.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Instituições financeiras e o prazo BACEN</h3>
          <p className="mb-4">O BACEN exige adequação dos sistemas SPB e PIX até 01/07/2026. Isso inclui chaves PIX do tipo CNPJ, TED corporativa e registros de boleto. Consulte a Circular BACEN nº 3.978/2020 e os comunicados subsequentes para o cronograma detalhado.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Sistemas internos que validam CNPJ em cadastros</h3>
          <p className="mb-4">Qualquer sistema com campo de CNPJ em cadastro de cliente, fornecedor, funcionário (MEI) ou parceiro precisa ser revisado. Isso inclui CRMs, ERPs legados, sistemas de cobrança e pipelines de ETL.</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Banco de dados — o que revisar</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Colunas definidas como NUMERIC, INT ou BIGINT quebram primeiro</h3>
          <p className="mb-4">CNPJ armazenado como número é o erro mais comum em bases legadas. Uma coluna <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">BIGINT</code> não aceita <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">AB00000000134</code> e lança exceção no INSERT. Audite com:</p>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-sql">{"-- PostgreSQL: encontrar colunas com nome sugestivo e tipo numérico\nSELECT table_name, column_name, data_type\nFROM information_schema.columns\nWHERE column_name ILIKE '%cnpj%'\n  AND data_type IN ('integer', 'bigint', 'numeric', 'decimal');"}</code></pre>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Migração de tipo: VARCHAR(14) com CHECK constraint</h3>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-sql">{"-- PostgreSQL\nALTER TABLE empresas\n  ALTER COLUMN cnpj TYPE VARCHAR(14) USING cnpj::text;\n\nALTER TABLE empresas\n  ADD CONSTRAINT cnpj_formato\n  CHECK (cnpj ~ '^[A-Z0-9]{12}[0-9]{2}$');\n\n-- MySQL 8\nALTER TABLE empresas\n  MODIFY COLUMN cnpj VARCHAR(14) NOT NULL,\n  ADD CONSTRAINT chk_cnpj\n  CHECK (cnpj REGEXP '^[A-Z0-9]{12}[0-9]{2}$');\n\n-- SQL Server\nALTER TABLE empresas\n  ALTER COLUMN cnpj NVARCHAR(14) NOT NULL;\n\nALTER TABLE empresas\n  ADD CONSTRAINT chk_cnpj\n  CHECK (cnpj LIKE '[A-Z0-9][A-Z0-9][A-Z0-9][A-Z0-9][A-Z0-9][A-Z0-9][A-Z0-9][A-Z0-9][0-9][0-9][0-9][0-9][0-9][0-9]');"}</code></pre>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Índices e performance após mudança de tipo</h3>
          <p className="mb-4">Índices em colunas numéricas são mais compactos que em VARCHAR. Após a migração, monitore o plano de execução das queries que filtram por CNPJ. Em PostgreSQL, use <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">btree</code> com <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">COLLATION "C"</code> para evitar overhead de locale em strings.</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Validação de CNPJ — o algoritmo muda</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Como funciona o módulo-11 atual</h3>
          <p className="mb-4">O algoritmo multiplica cada dígito da raiz e da ordem por pesos decrescentes, soma os produtos, calcula o resto da divisão por 11 e deriva o dígito verificador. Funciona exclusivamente com valores numéricos.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Como o dígito verificador se comporta com alfanuméricos</h3>
          <p className="mb-4">No novo formato, cada caractere é convertido para um valor numérico antes do cálculo: dígitos mantêm seu valor (<code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">'0'</code> = 0, <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">'9'</code> = 9) e letras recebem <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">código ASCII - 48</code> (<code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">'A'</code> = 17, <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">'B'</code> = 18, ..., <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">'Z'</code> = 42). O restante do algoritmo é idêntico ao atual.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Bibliotecas populares que ainda não suportam o novo formato</h3>
          <div className="my-6 rounded-xl bg-card border border-border overflow-x-auto"><table className="w-full text-sm"><thead className="bg-card-hover"><tr><th className="text-left px-3 py-2 text-muted-foreground font-medium">Biblioteca</th><th className="text-left px-3 py-2 text-muted-foreground font-medium">Versão atual</th><th className="text-left px-3 py-2 text-muted-foreground font-medium">Suporte alfanumérico</th><th className="text-left px-3 py-2 text-muted-foreground font-medium">Observação</th></tr></thead><tbody><tr className="border-b border-border"><td className="px-3 py-2"><code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">cpf-cnpj-validator</code></td><td className="px-3 py-2">1.0.3</td><td className="px-3 py-2">Não</td><td className="px-3 py-2">Valida apenas dígitos</td></tr><tr className="border-b border-border"><td className="px-3 py-2"><code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">cpfcnpj</code></td><td className="px-3 py-2">1.0.2</td><td className="px-3 py-2">Não</td><td className="px-3 py-2">Remove não-dígitos antes</td></tr><tr className="border-b border-border"><td className="px-3 py-2"><code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">brvalidador</code></td><td className="px-3 py-2">2.1.0</td><td className="px-3 py-2">Não</td><td className="px-3 py-2">Falha silenciosa com letras</td></tr><tr className="border-b border-border"><td className="px-3 py-2"><code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">@viannas/cnpj</code></td><td className="px-3 py-2">0.x</td><td className="px-3 py-2">Não</td><td className="px-3 py-2">Regex exclui A–Z</td></tr></tbody></table></div>
          <p className="mb-4">Veja a comparação completa em <Link href="/comparacao/fakeforge-vs-alternativas" className="text-primary hover:underline">/comparacao/fakeforge-vs-alternativas</Link>.</p>
          <blockquote className="border-l-4 border-accent pl-4 my-4 text-muted-foreground italic">AVISO: não confie em atualizações automáticas dessas bibliotecas antes de testar. Uma lib que "suporta alfanumérico" pode validar o formato mas usar o algoritmo errado para os dígitos verificadores.</blockquote>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Como escrever sua própria validação até as libs atualizarem</h3>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-ts">{"// cnpj-alfanumerico.ts — compatível com Node.js 18+ e browsers modernos\n\nfunction charToValue(c: string): number {\n  // '0'–'9': ASCII 48–57 → valores 0–9\n  // 'A'–'Z': ASCII 65–90 → valores 17–42\n  return c.charCodeAt(0) - 48;\n}\n\nfunction calcDigit(cnpj: string, weights: number[]): number {\n  let sum = 0;\n  for (let i = 0; i < weights.length; i++) {\n    sum += charToValue(cnpj[i]) * weights[i];\n  }\n  const remainder = sum % 11;\n  return remainder < 2 ? 0 : 11 - remainder;\n}\n\nexport function validarCNPJAlfanumerico(raw: string): boolean {\n  const cnpj = raw.replace(/[.\\-/]/g, '').toUpperCase();\n\n  if (cnpj.length !== 14) return false;\n  if (!/^[A-Z0-9]{12}[0-9]{2}$/.test(cnpj)) return false;\n\n  // Rejeita sequências homogêneas\n  if (/^(.)\\1+$/.test(cnpj)) return false;\n\n  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];\n  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];\n\n  const d1 = calcDigit(cnpj, weights1);\n  const d2 = calcDigit(cnpj, weights2);\n\n  return parseInt(cnpj[12]) === d1 && parseInt(cnpj[13]) === d2;\n}"}</code></pre>
          <p className="mb-4">Use o <Link href="/validar-cnpj" className="text-primary hover:underline">validador de CNPJ</Link> do FakeForge para conferir resultados enquanto você desenvolve a função.</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">APIs e integrações — pontos de falha mais comuns</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Regex de validação em campos de formulário e payloads JSON</h3>
          <p className="mb-4">O regex <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">^\d&#123;14&#125;$</code> falha em CNPJs alfanuméricos. Substitua:</p>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-ts">{"// Antes (numérico apenas)\nconst cnpjRegex = /^\\d{2}\\.\\d{3}\\.\\d{3}\\/\\d{4}-\\d{2}$/;\n\n// Depois (alfanumérico)\nconst cnpjRegex = /^[A-Z0-9]{2}\\.[A-Z0-9]{3}\\.[A-Z0-9]{3}\\/[0-9]{4}-[0-9]{2}$/i;"}</code></pre>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Serviços de terceiros: gateways de pagamento, ERPs, Receita Federal WS</h3>
          <p className="mb-4">Gateways como PagSeguro, Mercado Pago e Cielo têm validadores server-side próprios. Abra chamados com cada parceiro para confirmar a data de suporte. O WebService da Receita Federal retorna CNPJs como string — mas a maioria dos clientes HTTP dessa API faz parse numérico no lado do consumidor.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Headers e query params que truncam ou sanitizam o CNPJ</h3>
          <p className="mb-4">WAFs configurados para bloquear <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">[A-Z]</code> em query params de CNPJ vão rejeitar requisições legítimas após julho. Revise as regras de sanitização e whitelists antes do prazo.</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Frontend — inputs, máscaras e formatação</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Máscaras numéricas que bloqueiam letras</h3>
          <p className="mb-4">Bibliotecas como <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">react-input-mask</code>, <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">cleave.js</code> e <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">imask</code> usam padrões numéricos por padrão. Atualize:</p>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-ts">{"// imask — padrão atualizado para alfanumérico\nconst cnpjMask = {\n  mask: 'AA.AAA.AAA/0000-00',\n  definitions: {\n    A: /[A-Z0-9]/i,\n  },\n};"}</code></pre>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Validação client-side com Zod</h3>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-ts">{"import { z } from 'zod';\nimport { validarCNPJAlfanumerico } from './cnpj-alfanumerico';\n\nconst schemaCNPJ = z\n  .string()\n  .transform((val) => val.replace(/[.\\-/]/g, '').toUpperCase())\n  .refine(validarCNPJAlfanumerico, {\n    message: 'CNPJ inválido (numérico ou alfanumérico)',\n  });"}</code></pre>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">UX: exibição formatada com letras</h3>
          <p className="mb-4">O formato visual <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">XX.XXX.XXX/XXXX-XX</code> mantém a estrutura familiar. Não invente novos separadores para a versão alfanumérica — a Receita Federal usa o mesmo padrão de pontuação.</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Testes automatizados — o que adicionar ao seu suite</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Casos de teste obrigatórios</h3>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-ts">{"// cnpj-alfanumerico.test.ts — Vitest\nimport { describe, it, expect } from 'vitest';\nimport { validarCNPJAlfanumerico } from './cnpj-alfanumerico';\n\ndescribe('CNPJ alfanumérico', () => {\n  it('valida CNPJ numérico convencional', () => {\n    expect(validarCNPJAlfanumerico('11.222.333/0001-81')).toBe(true);\n  });\n\n  it('rejeita CNPJ com dígito verificador errado', () => {\n    expect(validarCNPJAlfanumerico('AB.CDE.FGH/0001-00')).toBe(false);\n  });\n\n  it('rejeita sequência homogênea', () => {\n    expect(validarCNPJAlfanumerico('AA.AAA.AAA/AAAA-AA')).toBe(false);\n  });\n\n  it('rejeita comprimento errado', () => {\n    expect(validarCNPJAlfanumerico('AB.CDE.FG/0001-34')).toBe(false);\n  });\n\n  it('rejeita caracteres fora do conjunto permitido', () => {\n    expect(validarCNPJAlfanumerico('AB!CDE.FGH/0001-34')).toBe(false);\n  });\n\n  it('valida CNPJ alfanumérico gerado pelo FakeForge', () => {\n    // Gere fixtures em /gerador-cnpj-alfanumerico — nunca use CNPJs reais\n    const fixtures = ['/* insira aqui valores gerados */'];\n    fixtures.forEach((cnpj) => expect(validarCNPJAlfanumerico(cnpj)).toBe(true));\n  });\n});"}</code></pre>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Geração de CNPJs alfanuméricos fictícios para testes</h3>
          <p className="mb-4">Use o <Link href="/gerador-cnpj-alfanumerico" className="text-primary hover:underline">gerador de CNPJ alfanumérico</Link> do FakeForge para obter valores com dígitos verificadores corretos. Via API:</p>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-bash">{"curl \"https://fakeforge.com.br/api/generate?type=cnpj_alfanumerico&quantity=10&format=json\""}</code></pre>
          <p className="mb-4">Nunca use CNPJs reais em fixtures — mesmo que "públicos", o CNPJ de MEI contém dados do sócio e pode enquadrar o sistema nas obrigações da LGPD.</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">LGPD e o novo formato — riscos de conformidade</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">CNPJ como dado de pessoa jurídica vs. dado de sócio (MEI)</h3>
          <p className="mb-4">O CNPJ de pessoa jurídica não é, por si só, dado pessoal. Porém, o CNPJ de MEI está vinculado ao CPF e ao nome do titular — é dado pessoal nos termos da <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">LGPD Art. 5º, I</a>. Pipelines que processam CNPJs em massa devem identificar e tratar MEIs de forma diferenciada.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">LGPD Art. 7º, IX e o tratamento em pipelines de validação</h3>
          <p className="mb-4">O tratamento de CNPJ de MEI em pipelines de validação pode enquadrar-se no legítimo interesse (<a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">LGPD Art. 7º, IX</a>), mas exige registro no ROPA e avaliação de impacto se o volume for significativo.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Logs que armazenam CNPJ precisam de revisão de retenção</h3>
          <p className="mb-4">Logs de requisição com CNPJ no path ou body precisam de política de retenção definida. A Resolução CD/ANPD nº 2/2022 orienta prazos mínimos para incidentes — mas não justifica retenção indefinida de logs com dados pessoais. Mascare o CNPJ em logs de produção: exiba apenas os 4 primeiros caracteres.</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Checklist consolidado — o que fazer semana a semana até julho</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Semanas 1–2: auditoria de banco de dados e APIs internas</h3>
          <ul className="list-disc list-inside space-y-2 pl-2 my-4"><li>Mapear todas as colunas de CNPJ com o script de auditoria SQL acima.</li><li>Listar endpoints que recebem ou retornam CNPJ.</li><li>Identificar regex de validação em middlewares e schemas de API.</li></ul>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Semanas 3–4: atualizar bibliotecas e escrever validações próprias</h3>
          <ul className="list-disc list-inside space-y-2 pl-2 my-4"><li>Verificar release notes das libs de validação usadas.</li><li>Implementar <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">validarCNPJAlfanumerico()</code> com os testes unitários.</li><li>Atualizar schemas Zod, Yup ou valibot.</li></ul>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Semanas 5–6: atualizar testes automatizados e frontend</h3>
          <ul className="list-disc list-inside space-y-2 pl-2 my-4"><li>Adicionar casos de teste para CNPJ alfanumérico no suite existente.</li><li>Atualizar máscaras de input e exibição.</li><li>Gerar fixtures com o <Link href="/gerador-cnpj-alfanumerico" className="text-primary hover:underline">gerador de CNPJ alfanumérico</Link>.</li></ul>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Semanas 7–8: homologar com parceiros e gateways</h3>
          <ul className="list-disc list-inside space-y-2 pl-2 my-4"><li>Abrir chamados com gateways de pagamento e ERPs.</li><li>Testar fluxo completo de emissão de NF-e com CNPJ alfanumérico em sandbox.</li><li>Revisar regras de WAF e proxies reversos.</li></ul>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Semana final: smoke test em produção com CNPJ alfanumérico de teste</h3>
          <p className="mb-4">Gere um CNPJ alfanumérico fictício com o FakeForge e execute o fluxo completo em produção com feature flag. Monitore logs de erro por 48 horas antes de 01/07/2026. Consulte a <Link href="/docs" className="text-primary hover:underline">documentação da API</Link> para geração em lote via endpoint.</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Resumo</h2>
          <ul className="list-disc list-inside space-y-2 pl-2 my-4"><li><strong className="text-foreground">Banco de dados primeiro:</strong> colunas <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">NUMERIC</code> e <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">BIGINT</code> com CNPJ quebram na primeira inserção após julho. Migre para <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">VARCHAR(14)</code> com CHECK constraint — é a mudança de maior impacto e menor reversibilidade.</li><li><strong className="text-foreground">Escreva sua própria validação agora:</strong> <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">cpf-cnpj-validator</code>, <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">cpfcnpj</code> e <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">brvalidador</code> não suportam o novo formato. Use a função <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">charToValue()</code> com módulo-11 adaptado apresentada acima e adicione ao suite de testes antes de confiar em qualquer lib atualizada.</li><li><strong className="text-foreground">MEI é dado pessoal:</strong> o CNPJ de MEI contém CPF e nome do titular. Pipelines que processam CNPJs em massa precisam de avaliação de impacto LGPD e registro no ROPA.</li><li><strong className="text-foreground">Parceiros não estarão prontos automaticamente:</strong> gateways, ERPs e integrações com a Receita Federal precisam de confirmação explícita de suporte. Abra chamados com SLA definido nas semanas 7–8.</li><li><strong className="text-foreground">Use dados fictícios nos testes:</strong> o <Link href="/gerador-cnpj-alfanumerico" className="text-primary hover:underline">gerador de CNPJ alfanumérico</Link> do FakeForge gera valores com dígitos verificadores corretos via web ou <Link href="/docs" className="text-primary hover:underline">via API</Link> — sem risco de usar CNPJ real de MEI em fixtures.</li><li><strong className="text-foreground">Monitor pós-virada:</strong> a curva de CNPJs alfanuméricos em circulação cresce gradualmente após julho, mas escala. Configure alertas para erros de validação e revise-os semanalmente nos primeiros 30 dias.</li></ul>
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">Perguntas frequentes</h2>
          <div className="space-y-3">
            <details key="Se não migrar coluna CNPJ de B" className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">Se não migrar coluna CNPJ de BIGINT antes de julho, o que exatamente acontece?</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">A primeira inserção com alfanumérico falha com erro de tipo (integer overflow ou invalid input). Se você usar CAST::NUMERIC, as letras são truncadas ou geram erro. O bloqueio pode ser silencioso em alguns ORMs — registro não é criado, sem log explícito. Teste ALTER COLUMN em staging antes.</p>
            </details>
            <details key="Como gerar CNPJs alfanuméricos" className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">Como gerar CNPJs alfanuméricos válidos para testes sem usar dados reais?</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">Use o endpoint /api/generate?type=cnpj_alfanumerico do FakeForge — retorna valores com dígitos verificadores corretos. Ou implemente charToValue() em test fixtures. Nunca commit CNPJ real de MEI em código: mesmo que 'público', incide LGPD. Dados fictícios protegem você de auditoria.</p>
            </details>
            <details key="CNPJs puramente numéricos emit" className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">CNPJs puramente numéricos emitidos antes de julho continuam validando no novo algoritmo?</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">Sim. O novo algoritmo trata '0' = 0, '9' = 9, logo mantém o cálculo original para numéricos. Porém regex ^[A-Z0-9]&#123;12&#125;[0-9]&#123;2&#125;$ rejeita CNPJ 100% numérico. Use ^([A-Z0-9]|\d)&#123;12&#125;[0-9]&#123;4&#125;[0-9]&#123;2&#125;$ ou trate formatos explicitamente no IF.</p>
            </details>
            <details key="Se meu gateway de pagamento nã" className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">Se meu gateway de pagamento não suportar CNPJ alfanumérico em julho, o que faço?</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">Abra chamado com SLA definido agora — não em junho. Se rejeitar, use feature flag: rota requisições com alfanumérico para fluxo alternativo ou bloqueia cadastro até suporte. Não tente contornar server-side validação — o gargalo crítico é downstream. Comunique prazo ao PO.</p>
            </details>
            <details key="Qual é a ordem correta: databa" className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">Qual é a ordem correta: database, validação client ou integração com parceiros?</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">Database first — é irreversível e bloqueia tudo. Depois validação server (Zod, CHECK constraint, módulo-11). Client-side (máscaras) é apenas cosmético. Parceiros em paralelo com feature flag. Banco é o gargalo crítico; não deixe para última semana antes de julho.</p>
            </details>
          </div>
        </section>
        <ShareBar title={"CNPJ Alfanumérico 2026: Checklist de Migração"} path="/blog/cnpj-alfanumerico-checklist-migracao-2026" />
        <BlogPostingSchema
          title={"CNPJ Alfanumérico 2026: Checklist de Migração"}
          slug="cnpj-alfanumerico-checklist-migracao-2026"
          description={"O CNPJ passa a aceitar letras em 01/07/2026. Veja o checklist técnico completo: banco de dados, APIs, validações e bibliotecas que precisam mudar."}
          datePublished="2026-06-13"
          image="https://fakeforge.com.br/api/og?title=CNPJ%20Alfanum%C3%A9rico%3A%20checklist%20completo%20para%20migrar%20antes%20de%2001%2F07%2F2026&subtitle=O%20CNPJ%20passa%20a%20aceitar%20letras%20em%2001%2F07%2F2026.%20Veja%20o%20checklist%20t%C3%A9cnico%20completo%3A%20banco%20de%20dados%2C%20APIs%2C%20valida%C3%A7%C3%B5es%20e%20bibliotecas%20que%20precisam%20&category=NEWS"
        />
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: "{\"@context\":\"https://schema.org\",\"@type\":\"FAQPage\",\"mainEntity\":[{\"@type\":\"Question\",\"name\":\"Se não migrar coluna CNPJ de BIGINT antes de julho, o que exatamente acontece?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"A primeira inserção com alfanumérico falha com erro de tipo (integer overflow ou invalid input). Se você usar CAST::NUMERIC, as letras são truncadas ou geram erro. O bloqueio pode ser silencioso em alguns ORMs — registro não é criado, sem log explícito. Teste ALTER COLUMN em staging antes.\"}},{\"@type\":\"Question\",\"name\":\"Como gerar CNPJs alfanuméricos válidos para testes sem usar dados reais?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Use o endpoint /api/generate?type=cnpj_alfanumerico do FakeForge — retorna valores com dígitos verificadores corretos. Ou implemente charToValue() em test fixtures. Nunca commit CNPJ real de MEI em código: mesmo que 'público', incide LGPD. Dados fictícios protegem você de auditoria.\"}},{\"@type\":\"Question\",\"name\":\"CNPJs puramente numéricos emitidos antes de julho continuam validando no novo algoritmo?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Sim. O novo algoritmo trata '0' = 0, '9' = 9, logo mantém o cálculo original para numéricos. Porém regex ^[A-Z0-9]{12}[0-9]{2}$ rejeita CNPJ 100% numérico. Use ^([A-Z0-9]|\\\\d){12}[0-9]{4}[0-9]{2}$ ou trate formatos explicitamente no IF.\"}},{\"@type\":\"Question\",\"name\":\"Se meu gateway de pagamento não suportar CNPJ alfanumérico em julho, o que faço?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Abra chamado com SLA definido agora — não em junho. Se rejeitar, use feature flag: rota requisições com alfanumérico para fluxo alternativo ou bloqueia cadastro até suporte. Não tente contornar server-side validação — o gargalo crítico é downstream. Comunique prazo ao PO.\"}},{\"@type\":\"Question\",\"name\":\"Qual é a ordem correta: database, validação client ou integração com parceiros?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Database first — é irreversível e bloqueia tudo. Depois validação server (Zod, CHECK constraint, módulo-11). Client-side (máscaras) é apenas cosmético. Parceiros em paralelo com feature flag. Banco é o gargalo crítico; não deixe para última semana antes de julho.\"}}]}",
        }}
      />
    </PageShell>
  );
}
