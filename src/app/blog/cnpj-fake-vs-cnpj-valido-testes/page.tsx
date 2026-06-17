import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BlogFeaturedImage from "@/components/BlogFeaturedImage";
import ShareBar from "@/components/ShareBar";

export const metadata: Metadata = {
  title: "CNPJ fake vs CNPJ válido: diferença e uso em testes",
  description: "Entenda a diferença entre CNPJ fake e CNPJ válido, como o algoritmo mod-11 funciona e qual usar em cada camada de teste sem violar a LGPD.",
  openGraph: {
    title: "CNPJ fake vs CNPJ válido: diferença e uso em testes",
    description: "Entenda a diferença entre CNPJ fake e CNPJ válido, como o algoritmo mod-11 funciona e qual usar em cada camada de teste sem violar a LGPD.",
    type: "article",
    images: ["/api/og?title=CNPJ%20fake%20vs%20CNPJ%20v%C3%A1lido%3A%20diferen%C3%A7a%20e%20uso%20em%20testes&subtitle=Entenda%20a%20diferen%C3%A7a%20entre%20CNPJ%20fake%20e%20CNPJ%20v%C3%A1lido%2C%20como%20o%20algoritmo%20mod-11%20funciona%20e%20qual%20usar%20em%20cada%20camada%20de%20teste%20sem%20violar%20a%20LGPD.&category=CONCEITOS"],
  },
  alternates: { canonical: "/blog/cnpj-fake-vs-cnpj-valido-testes" },
};

export default function Post() {
  return (
    <PageShell>
      <article className="max-w-2xl">
        <Link href="/blog" className="text-xs text-primary hover:underline mb-4 inline-block">
          ← Voltar ao blog
        </Link>
        <BlogFeaturedImage category="Conceitos" title="CNPJ fake vs CNPJ válido: diferença e uso em testes" className="mb-6" />
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
            CNPJ fake vs CNPJ válido: diferença e uso em testes
          </h1>
          <div className="flex items-center gap-3 text-xs text-muted mt-3">
            <time>02 de junho de 2026</time>
            <span>·</span>
            <span>9 min de leitura</span>
          </div>
        </div>

        <div className="prose-custom space-y-2 text-sm text-muted-foreground leading-relaxed">
          <p className="mb-4">CNPJ fake aparece em todo repositório de teste que cresceu rápido demais. Alguém hardcodou <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">11.222.333/0001-81</code>, o CI passou, a feature foi para staging, e a integração com o gateway de pagamento devolveu 422 porque o dígito verificador estava errado. Não é um problema raro: é a regra.</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Os dois tipos de CNPJ que aparecem em suítes de teste</h2>
          <p className="mb-4">Toda vez que uma fixture de teste contém um CNPJ, ele pertence a uma de três categorias.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">CNPJ aleatório (falha no dígito verificador)</h3>
          <p className="mb-4">Sequências como <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">12.345.678/0001-00</code> têm formato visual de CNPJ mas falham no algoritmo mod-11. Qualquer validador de formulário, biblioteca de entrada de dados ou API externa detecta o problema no primeiro campo de validação. Fixtures assim quebram antes de chegar ao banco.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">CNPJ matematicamente válido (passa mod-11, não existe na Receita)</h3>
          <p className="mb-4">Um CNPJ gerado por algoritmo respeita os dois dígitos verificadores. Passa em todos os validadores de formato. Não existe na base pública da Receita Federal porque foi construído proceduralmente. É a escolha correta para quase todos os cenários de teste. O <Link href="/gerador-cnpj" className="text-primary hover:underline">gerador de CNPJ</Link> do FakeForge produz esse tipo.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">CNPJ real ativo (existe na base pública da Receita Federal)</h3>
          <p className="mb-4">CNPJs de empresas reais retornam dados quando consultados em APIs como ReceitaWS ou CNPJ.ws. São necessários apenas quando o teste exercita uma consulta externa real, não a lógica interna da aplicação.</p>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Como o algoritmo mod-11 determina validade</h2>
          <p className="mb-4">O CNPJ tem 14 dígitos: 12 de base e 2 verificadores. Os dígitos verificadores derivam da base via duas rodadas de mod-11.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Pesos e cálculo do primeiro dígito verificador</h3>
          <p className="mb-4">Multiplica-se cada dígito da base pela sequência de pesos <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">[5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]</code>. Soma os produtos, divide por 11 e pega o resto. Se o resto for menor que 2, o dígito é 0. Caso contrário, o dígito é <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">11 - resto</code>.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Pesos e cálculo do segundo dígito verificador</h3>
          <p className="mb-4">O segundo dígito usa os 13 caracteres anteriores (12 de base + primeiro verificador) com pesos <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">[6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]</code>. A mesma regra de mod-11 se aplica.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Casos especiais: resultado 0 e 1</h3>
          <p className="mb-4">Quando o resto da divisão é 0 ou 1, o dígito verificador é 0. CNPJs com todos os dígitos iguais (ex: <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">11.111.111/1111-11</code>) são inválidos por convenção, mesmo que matematicamente produzam um resultado.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Exemplo de implementação em TypeScript</h3>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-ts">{"function calcDigit(base: number[], weights: number[]): number {\n  const sum = base.reduce((acc, digit, i) => acc + digit * weights[i], 0);\n  const remainder = sum % 11;\n  return remainder < 2 ? 0 : 11 - remainder;\n}\n\nexport function validateCNPJ(raw: string): boolean {\n  const digits = raw.replace(/\\D/g, \"\");\n  if (digits.length !== 14) return false;\n\n  if (/^(\\d)\\1+$/.test(digits)) return false;\n\n  const base = digits.split(\"\").map(Number);\n\n  const firstWeights  = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];\n  const d1 = calcDigit(base.slice(0, 12), firstWeights);\n  if (d1 !== base[12]) return false;\n\n  const secondWeights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];\n  const d2 = calcDigit(base.slice(0, 13), secondWeights);\n  return d2 === base[13];\n}"}</code></pre>
          <blockquote className="border-l-4 border-accent pl-4 my-4 text-muted-foreground italic">DICA: a função aceita CNPJ com ou sem máscara. <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">replace(/\D/g, "")</code> remove pontos, barras e hifens antes de qualquer cálculo.</blockquote>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Por que CNPJ aleatório quebra testes antes mesmo de chegar ao banco</h2>
          <p className="mb-4">Falhas em CNPJ aleatório não ocorrem no banco de dados: ocorrem nas camadas anteriores.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Validators de formulário rejeitam na camada de UI</h3>
          <p className="mb-4">Componentes React com <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">cpf-cnpj-validator</code>, campos de formulário com schema Zod ou validação customizada via <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">react-hook-form</code> rejeitam o valor na entrada. O dado nunca é submetido.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Bibliotecas como <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">cpf-cnpj-validator</code> e <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">validate-br</code> bloqueiam na entrada</h3>
          <p className="mb-4">Ambas as bibliotecas implementam o algoritmo mod-11 e retornam <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">false</code> para qualquer sequência que não passe. Integrar um CNPJ aleatório em um teste de unidade que usa essas bibliotecas garante falha determinística.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">APIs de terceiros (gateways de pagamento, NFe) retornam 422 imediato</h3>
          <p className="mb-4">Gateways como PagSeguro, Cielo e sistemas de emissão de NFe validam o CNPJ no payload antes de qualquer processamento. Um CNPJ inválido resulta em HTTP 422 com corpo descrevendo o campo. O teste falha na chamada, não no comportamento que deveria ser testado.</p>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Quando o CNPJ válido (fictício) é a escolha correta</h2>
          <p className="mb-4">A maioria dos cenários de teste funciona com CNPJs gerados por algoritmo.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Testes unitários de regra de negócio</h3>
          <p className="mb-4">Qualquer teste que exercita lógica interna (cálculo de imposto, classificação de porte, regras de crédito) precisa apenas de um CNPJ que passe no validador de formato. O CNPJ não precisa existir na Receita.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Testes de integração contra banco de dados próprio</h3>
          <p className="mb-4">Fixtures de banco de dados, factories do Faker, seeds de staging: todos funcionam com CNPJs fictícios. O banco armazena a string; nenhuma consulta externa é feita.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Seeds e fixtures de staging</h3>
          <p className="mb-4">Ambientes de staging não devem conter dados reais. Seeds com CNPJs gerados por algoritmo cumprem os requisitos de formato e não expõem nenhuma empresa real.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Demonstrações de produto e treinamento interno</h3>
          <p className="mb-4">Demos com CNPJs reais de clientes existentes violam a LGPD mesmo que o CNPJ seja tecnicamente público. CNPJs fictícios eliminam esse risco sem comprometer o realismo visual da demo.</p>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Quando você precisa de um CNPJ real ativo</h2>
          <p className="mb-4">Alguns cenários exigem um CNPJ que exista na Receita Federal.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Testes de consulta à API da Receita Federal (ReceitaWS, CNPJ.ws)</h3>
          <p className="mb-4">Se o teste valida a integração com uma API externa de consulta, o CNPJ precisa existir. Um CNPJ fictício retornará "CNPJ não encontrado" e o teste falhará por motivo errado.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Validação de crédito ou onboarding B2B em sandbox de parceiro</h3>
          <p className="mb-4">Alguns parceiros financeiros disponibilizam CNPJs de teste específicos em seus ambientes sandbox. Use os CNPJs fornecidos pela documentação do parceiro.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">CNPJs públicos aceitáveis: órgãos federais com CNPJ publicado no DOU</h3>
          <p className="mb-4">CNPJs de órgãos públicos federais (Banco do Brasil: <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">00.000.000/0001-91</code>) são publicados no Diário Oficial da União e podem ser usados em testes de integração que precisam de um CNPJ real, desde que o contexto não associe esses CNPJs a dados fictícios sensíveis.</p>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">LGPD e o uso de CNPJ de empresa real em testes</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">CNPJ de pessoa jurídica não é dado pessoal, mas o contexto importa</h3>
          <p className="mb-4">O CNPJ em si identifica a empresa, não a pessoa física. A LGPD (Lei 13.709/2018) define dado pessoal em seu <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Art. 5º, I</a> como informação relacionada a pessoa natural identificada ou identificável. CNPJ de PJ, isolado, não se enquadra.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Quando o CNPJ aparece vinculado a sócio (CPF + CNPJ): LGPD Art. 5º, I entra em cena</h3>
          <p className="mb-4">O quadro societário da empresa vincula CPF de sócios ao CNPJ. Usar CNPJ real em um dataset de teste que inclua nome de sócio, CPF ou endereço residencial cria um conjunto de dados coberto pela LGPD Art. 5º, I. O tratamento precisa de base legal (LGPD <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Art. 7º, IX</a>: legítimo interesse, com avaliação de impacto).</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Regra prática: dado sintético em todo ambiente que não seja produção</h3>
          <p className="mb-4">Qualquer ambiente acessível por desenvolvedores, equipes de QA ou parceiros externos deve usar exclusivamente dados sintéticos. Isso inclui staging, homologação, dev, demos gravadas e documentação.</p>
          <blockquote className="border-l-4 border-accent pl-4 my-4 text-muted-foreground italic">AVISO: um dump de produção carregado em staging para "facilitar os testes" viola a LGPD mesmo que o banco de dados não seja público. O acesso interno não-autorizado ao dado real já configura tratamento sem base legal adequada.</blockquote>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">CNPJ Alfanumérico a partir de julho de 2026</h2>
          <p className="mb-4">A Receita Federal publicou a Instrução Normativa RFB 2.229/2024 estabelecendo o CNPJ alfanumérico com vigência a partir de 01/07/2026.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">O que muda no formato: posições 1 a 12 aceitam A-Z e 0-9</h3>
          <p className="mb-4">As 8 posições da raiz e as 4 posições do sufixo passam a aceitar letras maiúsculas de A a Z além dos dígitos 0 a 9. Os 2 dígitos verificadores continuam sendo numéricos.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">O algoritmo mod-11 permanece, apenas o alfabeto do input expande</h3>
          <p className="mb-4">Para calcular os dígitos verificadores de um CNPJ alfanumérico, converte-se cada caractere para seu valor numérico: dígitos mantêm seu valor; letras usam <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">charCode - 48</code> (A = 17, B = 18, Z = 42). O restante do cálculo mod-11 é idêntico.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Impacto nos validadores e geradores existentes</h3>
          <p className="mb-4">Validadores que usam <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">replace(/\D/g, "")</code> antes de processar vão remover as letras e produzir resultados incorretos. É necessário atualizar a regex de sanitização e a lógica de conversão de caractere para valor numérico. O <Link href="/gerador-cnpj-alfanumerico" className="text-primary hover:underline">gerador de CNPJ Alfanumérico</Link> do FakeForge já implementa o formato novo.</p>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Gerando CNPJ válido fictício no seu pipeline de testes</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Usando a API FakeForge (<code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">/api/generate?type=cnpj&amp;quantity=50&amp;format=json</code>)</h3>
          <p className="mb-4">A <Link href="/docs" className="text-primary hover:underline">API REST do FakeForge</Link> gera CNPJs matematicamente válidos em lote. A camada gratuita permite 100 chamadas por dia sem autenticação. Planos pagos estão disponíveis em <Link href="/pricing" className="text-primary hover:underline">/pricing</Link>.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Gerando via linha de comando com <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">curl</code> e <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">jq</code></h3>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-bash">{"curl -s \"https://fakeforge.com.br/api/generate?type=cnpj&quantity=20&format=json\" \\\n  | jq '.data' \\\n  > fixtures/cnpjs.json"}</code></pre>
          <p className="mb-4">O arquivo <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">fixtures/cnpjs.json</code> conterá um array de 20 CNPJs prontos para uso em seeds ou testes.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Exportando fixtures prontos em SQL com <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">CREATE TABLE</code> incluído</h3>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-bash">{"curl -s \"https://fakeforge.com.br/api/generate?type=cnpj&quantity=100&format=sql\" \\\n  > fixtures/seed_cnpjs.sql\n\npsql \"$DATABASE_URL\" < fixtures/seed_cnpjs.sql"}</code></pre>
          <p className="mb-4">O output SQL inclui a instrução <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">CREATE TABLE IF NOT EXISTS</code> e os <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">INSERT</code> correspondentes. Pode ser aplicado diretamente em PostgreSQL, MySQL ou SQLite sem ajustes.</p>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Implementar a validação mod-11 internamente: prós e contras</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Vantagem: zero dependência externa, funciona offline</h3>
          <p className="mb-4">A lógica de mod-11 cabe em menos de 20 linhas de TypeScript. Sem <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">npm install</code>, sem CVEs de dependência transitiva, sem latência de rede. O código da seção anterior é suficiente para produção.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Desvantagem: manter para o CNPJ alfanumérico exige atualização em julho de 2026</h3>
          <p className="mb-4">Implementações que assumem entrada numérica vão precisar de refatoração antes de 01/07/2026. Quem mantiver a função <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">validateCNPJ</code> acima precisará adicionar a conversão de letra para valor numérico e ajustar a regex de sanitização.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Alternativa: delegar validação e geração a serviço dedicado</h3>
          <p className="mb-4">Para geração de fixtures em quantidade, delegar ao FakeForge via API reduz manutenção: quando o formato alfanumérico entrar em vigor, o serviço atualiza centralmente. O gerador mínimo abaixo ilustra a mecânica sem dependências externas:</p>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-ts">{"function randomDigit(): number {\n  return Math.floor(Math.random() * 10);\n}\n\nfunction calcCNPJDigit(base: number[], weights: number[]): number {\n  const sum = base.reduce((acc, d, i) => acc + d * weights[i], 0);\n  const r = sum % 11;\n  return r < 2 ? 0 : 11 - r;\n}\n\nexport function generateCNPJ(): string {\n  const base = Array.from({ length: 8 }, randomDigit);\n  const suffix = [0, 0, 0, 1]; // filial padrão\n  const all12 = [...base, ...suffix];\n\n  const d1 = calcCNPJDigit(all12, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);\n  const d2 = calcCNPJDigit([...all12, d1], [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);\n\n  const d = [...all12, d1, d2];\n  return `${d.slice(0,2).join(\"\")}.${d.slice(2,5).join(\"\")}.${d.slice(5,8).join(\"\")}/${d.slice(8,12).join(\"\")}-${d.slice(12).join(\"\")}`;\n}"}</code></pre>
          <p className="mb-4">Exemplo de seed Prisma usando CNPJs gerados:</p>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-ts">{"import { PrismaClient } from \"@prisma/client\";\nimport { generateCNPJ } from \"./utils/cnpj\";\n\nconst prisma = new PrismaClient();\n\nasync function seed() {\n  const companies = Array.from({ length: 50 }, (_, i) => ({\n    cnpj: generateCNPJ(),\n    razaoSocial: `Empresa Fictícia ${i + 1} Ltda`,\n    ativo: true,\n  }));\n\n  await prisma.company.createMany({ data: companies, skipDuplicates: true });\n  await prisma.$disconnect();\n}\n\nseed();"}</code></pre>
          <p className="mb-4">Para CNPJs já correlacionados com razão social, endereço e contato, o <Link href="/gerador-empresa" className="text-primary hover:underline">gerador de empresa</Link> entrega o conjunto completo em uma chamada.</p>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Resumo</h2>
          <p className="mb-4">Tabela de decisão por camada de teste:</p>
          <div className="my-6 rounded-xl bg-card border border-border overflow-x-auto"><table className="w-full text-sm"><thead className="bg-card-hover"><tr><th className="text-left px-3 py-2 text-muted-foreground font-medium">Camada de teste</th><th className="text-left px-3 py-2 text-muted-foreground font-medium">Tipo de CNPJ recomendado</th></tr></thead><tbody><tr className="border-b border-border"><td className="px-3 py-2">Testes unitários de regra de negócio</td><td className="px-3 py-2">CNPJ fictício (mod-11 válido)</td></tr><tr className="border-b border-border"><td className="px-3 py-2">Testes de integração contra banco próprio</td><td className="px-3 py-2">CNPJ fictício (mod-11 válido)</td></tr><tr className="border-b border-border"><td className="px-3 py-2">Seeds e fixtures de staging</td><td className="px-3 py-2">CNPJ fictício (mod-11 válido)</td></tr><tr className="border-b border-border"><td className="px-3 py-2">Integração com API da Receita Federal</td><td className="px-3 py-2">CNPJ real ativo</td></tr><tr className="border-b border-border"><td className="px-3 py-2">Sandbox de parceiro financeiro</td><td className="px-3 py-2">CNPJ fornecido pelo parceiro</td></tr><tr className="border-b border-border"><td className="px-3 py-2">Demos e documentação</td><td className="px-3 py-2">CNPJ fictício (mod-11 válido)</td></tr></tbody></table></div>
          <p className="mb-4">Checklist antes de commitar fixtures com CNPJ:</p>
          <ul className="list-disc list-inside space-y-2 pl-2 my-4"><li>Use <Link href="/validar-cnpj" className="text-primary hover:underline">/validar-cnpj</Link> ou <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">validateCNPJ()</code> para confirmar que cada CNPJ passa no dígito verificador.</li><li>Confirme que nenhum CNPJ pertence a uma empresa real: consulte via ReceitaWS; se retornar dados, substitua.</li><li>Ambientes não-produtivos não devem conter nenhum CNPJ associado a CPF, nome de sócio ou endereço real.</li><li>Se o repositório for público, gere novos CNPJs a cada ciclo de CI em vez de commitar fixtures estáticas.</li><li>Planeje a atualização dos validadores para suportar caracteres alfanuméricos antes de 01/07/2026.</li><li>Para geração em lote, a <Link href="/docs" className="text-primary hover:underline">API FakeForge</Link> elimina manutenção local e já cobre o formato alfanumérico.</li></ul>
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">Perguntas frequentes</h2>
          <div className="space-y-3">
            <details key="Devo gerar um novo CNPJ fictíc" className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">Devo gerar um novo CNPJ fictício para cada teste ou posso reutilizar o mesmo?</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">Reutilizar economiza tempo, mas dificulta isolamento para debug. Melhor prática: fixe um CNPJ por suite de testes via seed do Faker (--seed 12345), ou use factories com dados estáticos. CI roda com seed idêntica toda run. Testes end-to-end devem gerar novo a cada execução para cobertura de edge cases.</p>
            </details>
            <details key="Como preparar meu validador de" className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">Como preparar meu validador de CNPJ para alfanumérico sem quebrar os testes atuais?</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">Crie uma função paralela validateCNPJAlpha() em ramo feature. Teste com entrada mista (A1B2C3D4) em staging. Mantenha a função antiga funcionando até julho de 2026. Na produção, route por versão da API ou header. Evita migração de emergência e permite rollback.</p>
            </details>
            <details key="Qual a chance real de um CNPJ " className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">Qual a chance real de um CNPJ fictício gerado aleatoriamente já existir na Receita Federal?</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">Negligenciável. 8 dígitos da raiz = 100M combinações possíveis. Receita Federal tem ~60M CNPJs ativos. Sobreposição = ~0,06% mesmo sem mod-11. Com verificadores, cai mais. Risco aceitável para testes. Consulte via ReceitaWS apenas em prod.</p>
            </details>
            <details key="CNPJ fictício válido passa em " className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">CNPJ fictício válido passa em meu validador, mas pode quebrar em APIs de terceiros?</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">Sim. Gateways de pagamento, NFe, consulta de crédito consultam a Receita Federal e retornam 'CNPJ inválido' se não encontrarem. Mock a API externa em testes unitários. Em testes de integração real, use CNPJ do sandbox do parceiro. Nunca assuma que fictício=seguro.</p>
            </details>
            <details key="O gerador FakeForge me garante" className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">O gerador FakeForge me garante que os CNPJs gerados não existem na Receita Federal?</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">Não há garantia 100%, mas probabilidade é negligenciável (&lt;0,0001%). Se precisa de garantia absoluta, consulte a API pública da Receita contra o CNPJ antes de usar. Para testes e staging, o risco é aceitável e não justifica overhead.</p>
            </details>
          </div>
        </section>
        <ShareBar title={"CNPJ fake vs CNPJ válido: diferença e uso em testes"} path="/blog/cnpj-fake-vs-cnpj-valido-testes" />
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: "{\"@context\":\"https://schema.org\",\"@type\":\"FAQPage\",\"mainEntity\":[{\"@type\":\"Question\",\"name\":\"Devo gerar um novo CNPJ fictício para cada teste ou posso reutilizar o mesmo?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Reutilizar economiza tempo, mas dificulta isolamento para debug. Melhor prática: fixe um CNPJ por suite de testes via seed do Faker (--seed 12345), ou use factories com dados estáticos. CI roda com seed idêntica toda run. Testes end-to-end devem gerar novo a cada execução para cobertura de edge cases.\"}},{\"@type\":\"Question\",\"name\":\"Como preparar meu validador de CNPJ para alfanumérico sem quebrar os testes atuais?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Crie uma função paralela validateCNPJAlpha() em ramo feature. Teste com entrada mista (A1B2C3D4) em staging. Mantenha a função antiga funcionando até julho de 2026. Na produção, route por versão da API ou header. Evita migração de emergência e permite rollback.\"}},{\"@type\":\"Question\",\"name\":\"Qual a chance real de um CNPJ fictício gerado aleatoriamente já existir na Receita Federal?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Negligenciável. 8 dígitos da raiz = 100M combinações possíveis. Receita Federal tem ~60M CNPJs ativos. Sobreposição = ~0,06% mesmo sem mod-11. Com verificadores, cai mais. Risco aceitável para testes. Consulte via ReceitaWS apenas em prod.\"}},{\"@type\":\"Question\",\"name\":\"CNPJ fictício válido passa em meu validador, mas pode quebrar em APIs de terceiros?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Sim. Gateways de pagamento, NFe, consulta de crédito consultam a Receita Federal e retornam 'CNPJ inválido' se não encontrarem. Mock a API externa em testes unitários. Em testes de integração real, use CNPJ do sandbox do parceiro. Nunca assuma que fictício=seguro.\"}},{\"@type\":\"Question\",\"name\":\"O gerador FakeForge me garante que os CNPJs gerados não existem na Receita Federal?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Não há garantia 100%, mas probabilidade é negligenciável (<0,0001%). Se precisa de garantia absoluta, consulte a API pública da Receita contra o CNPJ antes de usar. Para testes e staging, o risco é aceitável e não justifica overhead.\"}}]}",
        }}
      />
    </PageShell>
  );
}
