import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BlogFeaturedImage from "@/components/BlogFeaturedImage";
import ShareBar from "@/components/ShareBar";

export const metadata: Metadata = {
  title: "Anonimização vs Pseudonimização LGPD: guia prático para devs",
  description: "Entenda a diferença técnica entre anonimização e pseudonimização pela LGPD, quando cada técnica se aplica e como implementá-las em código TypeScript.",
  openGraph: {
    title: "Anonimização vs Pseudonimização LGPD: guia prático para devs",
    description: "Entenda a diferença técnica entre anonimização e pseudonimização pela LGPD, quando cada técnica se aplica e como implementá-las em código TypeScript.",
    type: "article",
    images: ["/api/og?title=Anonimiza%C3%A7%C3%A3o%20vs%20Pseudonimiza%C3%A7%C3%A3o%20LGPD%3A%20guia%20pr%C3%A1tico%20para%20devs&subtitle=Entenda%20a%20diferen%C3%A7a%20t%C3%A9cnica%20entre%20anonimiza%C3%A7%C3%A3o%20e%20pseudonimiza%C3%A7%C3%A3o%20pela%20LGPD%2C%20quando%20cada%20t%C3%A9cnica%20se%20aplica%20e%20como%20implement%C3%A1-las%20em%20c%C3%B3digo%20Ty&category=LGPD"],
  },
  alternates: { canonical: "/blog/anonimizacao-vs-pseudonimizacao-lgpd-developers" },
};

export default function Post() {
  return (
    <PageShell>
      <article className="max-w-2xl">
        <Link href="/blog" className="text-xs text-primary hover:underline mb-4 inline-block">
          ← Voltar ao blog
        </Link>
        <BlogFeaturedImage category="LGPD" title="Anonimização vs Pseudonimização LGPD: guia prático para devs" className="mb-6" />
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
            Anonimização vs Pseudonimização LGPD: guia prático para devs
          </h1>
          <div className="flex items-center gap-3 text-xs text-muted mt-3">
            <time>26 de maio de 2026</time>
            <span>·</span>
            <span>12 min de leitura</span>
          </div>
        </div>

        <div className="prose-custom space-y-2 text-sm text-muted-foreground leading-relaxed">
          <p className="mb-4">A <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">LGPD</a> trata dado anonimizado e dado pseudonimizado de forma radicalmente diferente, e essa diferença determina se o seu sistema precisa de base legal para processar a informação ou não. Muitos times tratam os dois conceitos como sinônimos e acabam com compliance superficial que não resistiria a uma auditoria da ANPD.</p>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">O que a LGPD diz sobre dado anonimizado e dado pseudonimizado</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Definição legal de dado anonimizado (LGPD Art. 5º, III)</h3>
          <p className="mb-4">O <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm#art5" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Art. 5º, III</a> define dado anonimizado como "dado relativo a titular que não possa ser identificado, considerando a utilização de meios técnicos razoáveis e disponíveis na ocasião de seu tratamento". A consequência prática está no Art. 12: dado verdadeiramente anonimizado sai do escopo da lei e não exige base legal, consentimento nem DPO responsável por ele.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Definição legal de dado pseudonimizado (LGPD Art. 5º, XI)</h3>
          <p className="mb-4">O <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm#art5" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Art. 5º, XI</a> define dado pseudonimizado como "tratamento por meio do qual um dado perde a possibilidade de associação, direta ou indireta, a um indivíduo, senão pelo uso de informação adicional mantida separadamente pelo controlador em ambiente controlado e seguro". O titular ainda existe, a re-identificação é possível com a chave certa.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Por que a distinção importa: dado anonimizado sai do escopo da lei, pseudonimizado não</h3>
          <p className="mb-4">Pseudonimização é uma medida de segurança, não uma saída do regime da LGPD. Um CPF tokenizado com HMAC ainda é dado pessoal porque o controlador detém o segredo. Isso significa base legal obrigatória, direitos do titular aplicáveis e prazo de retenção a justificar.</p>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Critérios técnicos que a ANPD usa para avaliar anonimização</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Irreversibilidade como requisito central</h3>
          <p className="mb-4">A ANPD, nas suas <a href="https://www.gov.br/anpd/pt-br/documentos-e-publicacoes/documentos-de-referencia/guia_anpd_anonimizacao.pdf" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Orientações sobre Anonimização</a> (2023), adota o critério de irreversibilidade técnica com meios razoavelmente disponíveis. "Razoavelmente disponíveis" é deliberadamente vago: o avaliador considera o estado da arte no momento da auditoria, não no momento do desenvolvimento.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Os três testes práticos: singling out, linkability, inference</h3>
          <p className="mb-4">A ANPD segue metodologia alinhada ao <a href="https://ec.europa.eu/justice/article-29/documentation/opinion-recommendation/files/2014/wp216_en.pdf" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Art. 29 WP216</a> da autoridade europeia. Os três testes são:</p>
          <ul className="list-disc list-inside space-y-2 pl-2 my-4"><li><strong className="text-foreground">Singling out</strong>: é possível isolar um registro específico do dataset?</li><li><strong className="text-foreground">Linkability</strong>: é possível correlacionar dois registros distintos referentes ao mesmo indivíduo?</li><li><strong className="text-foreground">Inference</strong>: é possível deduzir atributos sensíveis de um titular a partir dos dados disponíveis?</li></ul>
          <p className="mb-4">Se qualquer um dos três passar, o dado não está devidamente anonimizado.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Quando a ANPD pode reclassificar um "dado anonimizado" como pessoal</h3>
          <p className="mb-4">A reclassificação ocorre quando o controlador detém dados auxiliares (outros datasets, chaves, logs) que, combinados, permitem re-identificação. Um CEP completo + data de nascimento + sexo identifica cerca de 87% das pessoas nos EUA segundo estudo de Latanya Sweeney (Carnegie Mellon, 2000); o cenário brasileiro é comparável dado o desequilíbrio populacional entre municípios.</p>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Técnicas de anonimização aplicáveis em sistemas brasileiros</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Generalização e supressão de atributos</h3>
          <p className="mb-4">Generalização reduz a precisão de um atributo. CEP <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">01310-100</code> vira <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">01310-000</code> (suprime os últimos três dígitos). Data de nascimento <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">1990-03-15</code> vira <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">1990</code> (só o ano). Supressão remove o atributo por completo quando a generalização ainda permite inferência.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Perturbação estatística</h3>
          <p className="mb-4">Adiciona ruído aleatório a valores numéricos dentro de um intervalo que preserva utilidade analítica. Renda de R$ 4.800 pode virar R$ 4.650 ou R$ 5.100, mas o quartil permanece o mesmo. Útil para analytics de BI onde a tendência importa mais que o valor exato.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Agregação</h3>
          <p className="mb-4">Substitui registros individuais por estatísticas de grupo. Em vez de linha por linha com CPF, o dataset exibe "1.240 transações PIX entre R$ 100 e R$ 500 na região Sudeste em março/2025". Nenhum titular é rastreável.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">k-anonimato, l-diversity e t-closeness</h3>
          <div className="my-6 rounded-xl bg-card border border-border overflow-x-auto"><table className="w-full text-sm"><thead className="bg-card-hover"><tr><th className="text-left px-3 py-2 text-muted-foreground font-medium">Técnica</th><th className="text-left px-3 py-2 text-muted-foreground font-medium">O que garante</th><th className="text-left px-3 py-2 text-muted-foreground font-medium">Limitação principal</th></tr></thead><tbody><tr className="border-b border-border"><td className="px-3 py-2">k-anonimato (k=5)</td><td className="px-3 py-2">Cada registro é indistinguível de outros k-1</td><td className="px-3 py-2">Vulnerável a ataques de homogeneidade</td></tr><tr className="border-b border-border"><td className="px-3 py-2">l-diversity (l=3)</td><td className="px-3 py-2">Cada grupo tem ao menos l valores distintos para atributo sensível</td><td className="px-3 py-2">Não resiste a distribuições com skew alto</td></tr><tr className="border-b border-border"><td className="px-3 py-2">t-closeness</td><td className="px-3 py-2">Distribuição do atributo sensível no grupo espelha a do dataset</td><td className="px-3 py-2">Implementação complexa, alto custo computacional</td></tr></tbody></table></div>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Técnicas de pseudonimização e onde cada uma se encaixa</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Tokenização determinística com HMAC-SHA256</h3>
          <p className="mb-4">Produz sempre o mesmo token para o mesmo dado com o mesmo segredo. Útil para joins cross-sistema sem expor o CPF original. O risco: dois sistemas com o mesmo segredo podem correlacionar tokens.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Tokenização com vault</h3>
          <p className="mb-4">Token aleatório (UUID v4) mapeado para o dado real em banco separado. Re-identificação exige acesso explícito ao vault. Mais seguro que HMAC determinístico, porém joins cross-sistema exigem chamada ao vault.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Cifragem com chave segregada (AES-256-GCM)</h3>
          <p className="mb-4">O dado original é cifrado e armazenado. A chave fica em HSM ou KMS separado (AWS KMS, Google Cloud KMS). Reversível com autorização, auditável, rotação de chave viável sem migrar dados.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Hashing com salt por registro vs salt global</h3>
          <p className="mb-4">Salt global é vulnerável a ataques de dicionário se o segredo vazar: o atacante computa hashes de todos os CPFs válidos (aproximadamente 230 milhões de combinações) e cruza com o dataset. Salt por registro elimina o ataque de dicionário mas torna joins impossíveis sem descriptografar primeiro.</p>
          <blockquote className="border-l-4 border-accent pl-4 my-4 text-muted-foreground italic"><strong className="text-foreground">AVISO:</strong> Nunca use MD5 ou SHA-1 sem salt para pseudonimizar CPF. As funções são rápidas demais: hardware comum computa bilhões de hashes por segundo, tornando força bruta trivial contra o espaço de CPFs válidos.</blockquote>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Implementação em TypeScript: pseudonimização de CPF e e-mail</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Tokenização de CPF com HMAC-SHA256</h3>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-ts">{"import { createHmac } from \"node:crypto\";\n\nconst SECRET = process.env.PSEUDONYM_SECRET;\nif (!SECRET) throw new Error(\"PSEUDONYM_SECRET não definido\");\n\nexport function tokenizeCpf(cpf: string): string {\n  const digits = cpf.replace(/\\D/g, \"\");\n  return createHmac(\"sha256\", SECRET).update(digits).digest(\"hex\");\n}\n\n// Uso:\n// tokenizeCpf(\"123.456.789-09\") → \"a3f9c1...\" (64 chars hex, determinístico)"}</code></pre>
          <p className="mb-4">O token tem 64 caracteres hexadecimais, não carrega estrutura de CPF e não permite reversão sem o segredo. Para <Link href="/validar-cpf" className="text-primary hover:underline">validar se um CPF gerado ainda passa no algoritmo da Receita Federal</Link>, use o validador antes de tokenizar, não depois.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Mascaramento reversível de e-mail para logs de suporte</h3>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-ts">{"export function maskEmail(email: string): string {\n  const [local, domain] = email.split(\"@\");\n  if (!local || !domain) return \"***@***\";\n  const visible = local.slice(0, 2);\n  return `${visible}${\"*\".repeat(Math.max(local.length - 2, 3))}@${domain}`;\n}\n\n// maskEmail(\"joao.silva@gmail.com\") → \"jo*********@gmail.com\""}</code></pre>
          <p className="mb-4">Esse mascaramento é suficiente para logs de suporte onde o agente precisa confirmar o domínio mas não o usuário completo. Não é reversível sem o dado original.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Estrutura de vault mínimo com PostgreSQL</h3>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-sql">{"CREATE TABLE tokens (\n  token        VARCHAR(36)  PRIMARY KEY DEFAULT gen_random_uuid()::text,\n  encrypted_value BYTEA     NOT NULL,\n  key_id       VARCHAR(64)  NOT NULL,\n  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()\n);\n\nCREATE INDEX idx_tokens_created_at ON tokens (created_at);"}</code></pre>
          <p className="mb-4"><code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">encrypted_value</code> armazena o dado cifrado com AES-256-GCM. <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">key_id</code> referencia a versão de chave no KMS, viabilizando rotação sem migrar linhas.</p>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Implementação em TypeScript: anonimização de dataset de teste</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Pipeline de anonimização para fixtures de banco</h3>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-ts">{"import { parse } from \"csv-parse/sync\";\nimport { stringify } from \"csv-stringify/sync\";\nimport { createHmac, randomBytes } from \"node:crypto\";\nimport { readFileSync, writeFileSync } from \"node:fs\";\n\nconst SECRET = randomBytes(32).toString(\"hex\"); // efêmero por execução\n\nfunction anonymizeRow(row: Record<string, string>) {\n  return {\n    ...row,\n    cpf: createHmac(\"sha256\", SECRET).update(row.cpf ?? \"\").digest(\"hex\").slice(0, 11),\n    email: row.email ? `user_${Math.floor(Math.random() * 1e6)}@example.com` : \"\",\n    nome: `Usuário ${Math.floor(Math.random() * 1e5)}`,\n    cep: row.cep ? row.cep.slice(0, 5) + \"-000\" : \"\",\n  };\n}\n\nconst input = parse(readFileSync(\"dump_prod.csv\"), { columns: true });\nconst output = input.map(anonymizeRow);\nwriteFileSync(\"fixture_sanitized.csv\", stringify(output, { header: true }));"}</code></pre>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Geração de dados fictícios como alternativa à anonimização</h3>
          <p className="mb-4">Para muitos cenários de teste, gerar dados estruturalmente válidos do zero é mais simples e mais seguro do que anonimizar um dump de produção. A <Link href="/docs" className="text-primary hover:underline">API do FakeForge</Link> entrega datasets prontos:</p>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-ts">{"const response = await fetch(\n  \"https://fakeforge.com.br/api/generate?type=pessoa&quantity=500&format=json\"\n);\nconst pessoas = await response.json();\n// Cada objeto tem nome, CPF, e-mail, telefone, endereço — todos fictícios e válidos"}</code></pre>
          <p className="mb-4">Esse dataset de <Link href="/gerador-pessoa" className="text-primary hover:underline">pessoas fictícias estruturalmente correto</Link> passa em validadores de CPF, tem DDDs válidos e CEPs coerentes com o estado gerado. Para <Link href="/gerador-cpf" className="text-primary hover:underline">CPFs gerados com dígitos verificadores corretos</Link>, o gerador usa o mesmo algoritmo mod-11 da Receita Federal.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Quando usar um gerador em vez de anonimizar produção</h3>
          <p className="mb-4">Use dados gerados quando o objetivo é testar lógica de negócio (validação, formatação, fluxos de pagamento). Use anonimização quando o objetivo é testar com a distribuição real dos seus dados (modelos de ML, análises de coorte, performance com volume real).</p>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Ambientes de desenvolvimento e staging: o risco do dump de produção</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Por que copiar produção para dev viola a LGPD mesmo internamente</h3>
          <p className="mb-4">O acesso de um dev ao banco de staging com dados reais configura tratamento de dado pessoal. Exige base legal (art. 7º), necessidade demonstrável e medidas de segurança proporcionais. A finalidade de desenvolvimento raramente é compatível com a finalidade original de coleta, conflitando com o princípio da finalidade do <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm#art6" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Art. 6º, I</a>.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Fluxo seguro: pipeline de sanitização antes do restore</h3>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-bash">{"# Pipeline exemplo: dump → sanitiza → restore\npg_dump prod_db | python sanitize_pii.py | psql staging_db"}</code></pre>
          <p className="mb-4">O script <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">sanitize_pii.py</code> (ou equivalente TypeScript) executa o pipeline do exemplo anterior antes de qualquer byte chegar ao ambiente não-produtivo.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Dados gerados vs dados anonimizados: qual exige menos manutenção</h3>
          <p className="mb-4">Dados anonimizados exigem re-execução do pipeline a cada refresh do staging, auditorias periódicas para confirmar que novas colunas PII foram incluídas no processo e testes de re-identificação documentados. Dados gerados via API exigem apenas manter o script de seed atualizado com os tipos de dados necessários. Para volumes maiores em pipelines de CI/CD, o <Link href="/pricing" className="text-primary hover:underline">plano de API</Link> cobre chamadas em batch.</p>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Casos de uso práticos e qual técnica aplicar</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Logs de aplicação</h3>
          <p className="mb-4">Pseudonimize identificadores em logs de aplicação (CPF, e-mail, telefone). Onde o dado não é necessário para diagnóstico, anonimize ou não registre. Logs com dado pessoal bruto são o vetor mais comum de vazamento acidental.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Analytics e BI interno</h3>
          <p className="mb-4">Use agregação e generalização. O analista precisa de tendências, não de registros individuais. CEP de 5 dígitos + faixa etária de 10 anos é suficiente para análise demográfica e reduz drasticamente o risco de re-identificação.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Compartilhamento com terceiros (LGPD Art. 7º, IX)</h3>
          <p className="mb-4">O <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm#art7" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Art. 7º, IX</a> exige legítimo interesse como base legal para compartilhamento. Antes de enviar qualquer dataset a parceiros, aplique k-anonimato (k &gt;= 5) e documente no contrato de processamento quais atributos foram suprimidos ou generalizados.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Treinamento de modelos de ML</h3>
          <p className="mb-4">K-anonimato reduz utilidade para ML em datasets pequenos. Para volume acima de 100 mil registros, dados sintéticos gerados a partir da distribuição real (via CTGAN, por exemplo) preservam utilidade estatística sem expor nenhum titular.</p>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Armadilhas comuns que transformam pseudonimização em dado identificável</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Re-identificação por combinação de quasi-identificadores</h3>
          <p className="mb-4">CEP + data de nascimento + sexo combinados identificam indivíduos mesmo sem CPF. Esses atributos são quasi-identificadores: individualmente inócuos, combinados tornam o registro único no dataset.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Logs que gravam o dado original junto com o token</h3>
          <p className="mb-4">Um sistema que registra <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">cpf_original=123.456.789-09 token=a3f9c1...</code> no log de auditoria invalidou a pseudonimização. O token e o original estão no mesmo arquivo, acessível a qualquer pessoa com leitura de log.</p>
          <blockquote className="border-l-4 border-accent pl-4 my-4 text-muted-foreground italic"><strong className="text-foreground">DICA:</strong> Revise os campos logados em frameworks de observabilidade (Datadog, New Relic, OpenTelemetry). Muitos SDKs serializam o objeto de request completo por padrão. Configure blocklists explícitas para campos PII antes de ativar tracing automático.</blockquote>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Salt global compartilhado entre ambientes</h3>
          <p className="mb-4">Um salt idêntico em produção e staging permite que um atacante com acesso a staging derive tokens de produção. Segredos de pseudonimização devem ser únicos por ambiente e rotacionados quando qualquer pessoa com acesso ao ambiente for desligada.</p>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Documentação e evidência para auditoria da ANPD</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">O que registrar no RIPD</h3>
          <p className="mb-4">O Relatório de Impacto à Proteção de Dados deve documentar: qual técnica foi aplicada, quais atributos foram tratados, qual o resultado dos três testes (singling out, linkability, inference) e quem é responsável pela chave de pseudonimização ou pelo processo de anonimização.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Testes de re-identificação como prova de eficácia</h3>
          <p className="mb-4">Execute tentativas de re-identificação com os dados auxiliares que o controlador possui (outros datasets, logs, registros de CRM) e documente o resultado. Se a re-identificação falhar mesmo com esses meios, registre o experimento como evidência de anonimização eficaz.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Retenção mínima de chaves de pseudonimização</h3>
          <p className="mb-4">Mantenha chaves pelo tempo necessário ao exercício de direitos do titular (retificação, exclusão, portabilidade). Após o término da finalidade de tratamento, destrua as chaves com procedimento auditável. Sem a chave, o dado pseudonimizado se torna anonimizado de fato.</p>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Resumo</h2>
          <ul className="list-disc list-inside space-y-2 pl-2 my-4"><li><strong className="text-foreground">Dado anonimizado sai do escopo da LGPD; dado pseudonimizado não.</strong> A distinção é técnica e avaliada pela ANPD com os testes de singling out, linkability e inference.</li><li><strong className="text-foreground">HMAC-SHA256 com salt por ambiente</strong> é o ponto de partida para pseudonimização de CPF e e-mail em logs e bancos de dados. Salt global é vulnerável a ataques de dicionário.</li><li><strong className="text-foreground">Nunca copie dump de produção para staging sem pipeline de sanitização.</strong> O acesso de dev a dados reais configura tratamento sem base legal compatível com a finalidade original.</li><li><strong className="text-foreground">Para fixtures de teste e dados de desenvolvimento, dados gerados são mais seguros e de menor manutenção</strong> que dados anonimizados. O <Link href="/gerador-pessoa" className="text-primary hover:underline">FakeForge gera datasets com CPFs, pessoas e endereços válidos</Link> prontos para CI/CD.</li><li><strong className="text-foreground">Documente no RIPD</strong> a técnica usada, os atributos tratados e os resultados dos testes de re-identificação. Ausência de documentação é, sozinha, fundamento para sanção administrativa.</li><li><strong className="text-foreground">Chaves de pseudonimização únicas por ambiente e rotação programada</strong> são requisitos mínimos. Compartilhar o mesmo segredo entre produção e staging invalida o isolamento.</li></ul>
          <p className="mb-4">---</p>
          <p className="mb-4"><strong className="text-foreground">Leitura complementar:</strong> <Link href="/docs" className="text-primary hover:underline">documentação da API</Link> para integrar geração de dados no pipeline de CI, <Link href="/blog" className="text-primary hover:underline">outros artigos sobre LGPD e boas práticas</Link>, e o <a href="https://www.gov.br/anpd/pt-br/documentos-e-publicacoes/documentos-de-referencia/guia_anpd_anonimizacao.pdf" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">guia oficial da ANPD sobre anonimização</a>.</p>
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">Perguntas frequentes</h2>
          <div className="space-y-3">
            <details key="Se eu usar UUID em vez de CPF " className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">Se eu usar UUID em vez de CPF na API, preciso de base legal?</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">Sim. UUID é mascaramento visual; o controlador continua mapeando UUID → CPF em tabela interna. Não sai do escopo LGPD. Aplicam-se base legal, direitos do titular e prazos de retenção. Use UUID para logs públicos, mas o mapeamento permanece dado pessoal.</p>
            </details>
            <details key="MD5 é aceitável para pseudonim" className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">MD5 é aceitável para pseudonimizar CPF se usar salt global?</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">Não. MD5 é computacionalmente barato; força bruta em 230 milhões de combinações de CPF válidos leva segundos em hardware comum. Mesmo com salt global, é triviável crackear. Use HMAC-SHA256 ou Argon2 para produção. Salt por registro elimina ataques de dicionário, mas quebra joins.</p>
            </details>
            <details key="Posso destruir a chave de pseu" className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">Posso destruir a chave de pseudonimização logo após testar o restore em staging?</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">Não. Mantenha a chave de pseudonimização disponível pelo prazo mínimo legal de retenção dos dados (6 anos) e enquanto direitos do titular se aplicarem. Destruição precoce impede retificação, exclusão e portabilidade. Após finalizar a finalidade de tratamento, destrua com procedimento auditável documentado.</p>
            </details>
            <details key="Se o token HMAC e o CPF origin" className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">Se o token HMAC e o CPF original estão em colunas diferentes da mesma tabela, ainda é pseudonimização?</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">Não. Pseudonimização exige que o dado original não seja acessível sem informação adicional mantida fora do controlador. CPF na mesma tabela do token = re-identificação trivial. Mantenha o CPF original em tabela criptografada e controlada separadamente, com acesso restrito a aplicações específicas.</p>
            </details>
            <details key="Como pipar pg_dump sem deixar " className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">Como pipar pg_dump sem deixar arquivo descriptografado em disco?</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">Use: `pg_dump | openssl enc -aes-256-cbc | python sanitize.py | pg_restore`. Dump nunca persiste descriptografado em disco. Descriptografia ocorre em memória durante o pipe. Configure sanitize.py para tokenizar CPF com HMAC, mascarar e-mail, generalizar CEP a 5 dígitos e remover quasi-identificadores. Pronto para staging.</p>
            </details>
          </div>
        </section>
        <ShareBar title={"Anonimização vs Pseudonimização LGPD: guia prático para devs"} path="/blog/anonimizacao-vs-pseudonimizacao-lgpd-developers" />
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: "{\"@context\":\"https://schema.org\",\"@type\":\"FAQPage\",\"mainEntity\":[{\"@type\":\"Question\",\"name\":\"Se eu usar UUID em vez de CPF na API, preciso de base legal?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Sim. UUID é mascaramento visual; o controlador continua mapeando UUID → CPF em tabela interna. Não sai do escopo LGPD. Aplicam-se base legal, direitos do titular e prazos de retenção. Use UUID para logs públicos, mas o mapeamento permanece dado pessoal.\"}},{\"@type\":\"Question\",\"name\":\"MD5 é aceitável para pseudonimizar CPF se usar salt global?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Não. MD5 é computacionalmente barato; força bruta em 230 milhões de combinações de CPF válidos leva segundos em hardware comum. Mesmo com salt global, é triviável crackear. Use HMAC-SHA256 ou Argon2 para produção. Salt por registro elimina ataques de dicionário, mas quebra joins.\"}},{\"@type\":\"Question\",\"name\":\"Posso destruir a chave de pseudonimização logo após testar o restore em staging?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Não. Mantenha a chave de pseudonimização disponível pelo prazo mínimo legal de retenção dos dados (6 anos) e enquanto direitos do titular se aplicarem. Destruição precoce impede retificação, exclusão e portabilidade. Após finalizar a finalidade de tratamento, destrua com procedimento auditável documentado.\"}},{\"@type\":\"Question\",\"name\":\"Se o token HMAC e o CPF original estão em colunas diferentes da mesma tabela, ainda é pseudonimização?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Não. Pseudonimização exige que o dado original não seja acessível sem informação adicional mantida fora do controlador. CPF na mesma tabela do token = re-identificação trivial. Mantenha o CPF original em tabela criptografada e controlada separadamente, com acesso restrito a aplicações específicas.\"}},{\"@type\":\"Question\",\"name\":\"Como pipar pg_dump sem deixar arquivo descriptografado em disco?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Use: `pg_dump | openssl enc -aes-256-cbc | python sanitize.py | pg_restore`. Dump nunca persiste descriptografado em disco. Descriptografia ocorre em memória durante o pipe. Configure sanitize.py para tokenizar CPF com HMAC, mascarar e-mail, generalizar CEP a 5 dígitos e remover quasi-identificadores. Pronto para staging.\"}}]}",
        }}
      />
    </PageShell>
  );
}
