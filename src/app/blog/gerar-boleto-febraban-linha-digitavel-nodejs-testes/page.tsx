import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BlogFeaturedImage from "@/components/BlogFeaturedImage";
import ShareBar from "@/components/ShareBar";

export const metadata: Metadata = {
  title: "Boleto FEBRABAN em Node.js: gerar linha digitável para testes",
  description: "Aprenda a gerar boletos bancários FEBRABAN válidos para testes em Node.js, com cálculo de dígito verificador, linha digitável e código de barras, sem tocar em dados reais.",
  openGraph: {
    title: "Boleto FEBRABAN em Node.js: gerar linha digitável para testes",
    description: "Aprenda a gerar boletos bancários FEBRABAN válidos para testes em Node.js, com cálculo de dígito verificador, linha digitável e código de barras, sem tocar em dados reais.",
    type: "article",
    images: ["/api/og?title=Boleto%20FEBRABAN%20em%20Node.js%3A%20gerar%20linha%20digit%C3%A1vel%20para%20testes&subtitle=Aprenda%20a%20gerar%20boletos%20banc%C3%A1rios%20FEBRABAN%20v%C3%A1lidos%20para%20testes%20em%20Node.js%2C%20com%20c%C3%A1lculo%20de%20d%C3%ADgito%20verificador%2C%20linha%20digit%C3%A1vel%20e%20c%C3%B3digo%20de%20ba&category=TUTORIAIS"],
  },
  alternates: { canonical: "/blog/gerar-boleto-febraban-linha-digitavel-nodejs-testes" },
};

export default function Post() {
  return (
    <PageShell>
      <article className="max-w-2xl">
        <Link href="/blog" className="text-xs text-primary hover:underline mb-4 inline-block">
          ← Voltar ao blog
        </Link>
        <BlogFeaturedImage category="Tutoriais" title="Boleto FEBRABAN em Node.js: gerar linha digitável para testes" className="mb-6" />
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
            Boleto FEBRABAN em Node.js: gerar linha digitável para testes
          </h1>
          <div className="flex items-center gap-3 text-xs text-muted mt-3">
            <time>26 de maio de 2026</time>
            <span>·</span>
            <span>12 min de leitura</span>
          </div>
        </div>

        <div className="prose-custom space-y-2 text-sm text-muted-foreground leading-relaxed">
          <p className="mb-4">Boleto bancário é parte obrigatória de qualquer suite de testes que toque pagamentos brasileiros. O problema: a maioria das equipes copia números reais de produção para fixtures — o que viola a LGPD e cria dependências frágeis de dados externos. Este tutorial mostra como gerar uma linha digitável FEBRABAN válida do zero, em TypeScript, sem tocar em dados reais.</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">O que é a linha digitável e por que ela importa em testes</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Diferença entre código de barras e linha digitável (FEBRABAN Manual de Normas 003.008)</h3>
          <p className="mb-4">O código de barras tem 44 dígitos e é lido opticamente. A linha digitável tem 47 dígitos (incluindo três dígitos verificadores de campo) e é o que o usuário digita quando o código de barras não escaneia. O Manual de Normas FEBRABAN 003.008 define os dois formatos e exige que ambos representem os mesmos dados — qualquer divergência entre eles deve ser rejeitada pelo banco cobrador.</p>
          <p className="mb-4">Em testes, você precisa dos dois. Parsers de gateway geralmente aceitam qualquer um. Sistemas bancários legados aceitam só a linha digitável.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Campos obrigatórios: banco, agência, nosso número, vencimento, valor, dígito verificador</h3>
          <div className="my-6 rounded-xl bg-card border border-border overflow-x-auto"><table className="w-full text-sm"><thead className="bg-card-hover"><tr><th className="text-left px-3 py-2 text-muted-foreground font-medium">Campo</th><th className="text-left px-3 py-2 text-muted-foreground font-medium">Posição no código de barras</th><th className="text-left px-3 py-2 text-muted-foreground font-medium">Tamanho</th><th className="text-left px-3 py-2 text-muted-foreground font-medium">Exemplo</th></tr></thead><tbody><tr className="border-b border-border"><td className="px-3 py-2">Código do banco</td><td className="px-3 py-2">1-3</td><td className="px-3 py-2">3</td><td className="px-3 py-2"><code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">341</code> (Itaú)</td></tr><tr className="border-b border-border"><td className="px-3 py-2">Código da moeda</td><td className="px-3 py-2">4</td><td className="px-3 py-2">1</td><td className="px-3 py-2"><code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">9</code> (Real)</td></tr><tr className="border-b border-border"><td className="px-3 py-2">Dígito verificador geral</td><td className="px-3 py-2">5</td><td className="px-3 py-2">1</td><td className="px-3 py-2">calculado</td></tr><tr className="border-b border-border"><td className="px-3 py-2">Fator de vencimento</td><td className="px-3 py-2">6-9</td><td className="px-3 py-2">4</td><td className="px-3 py-2"><code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">9999</code></td></tr><tr className="border-b border-border"><td className="px-3 py-2">Valor nominal</td><td className="px-3 py-2">10-19</td><td className="px-3 py-2">10</td><td className="px-3 py-2"><code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">0000015000</code> (R$ 150,00)</td></tr><tr className="border-b border-border"><td className="px-3 py-2">Campo livre</td><td className="px-3 py-2">20-44</td><td className="px-3 py-2">25</td><td className="px-3 py-2">varia por banco</td></tr></tbody></table></div>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Por que testar com boletos reais é LGPD Art. 7º, IX — e quando deixa de ser</h3>
          <p className="mb-4"><a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">LGPD Art. 7º, IX</a> permite tratamento de dados pessoais quando necessário para atender interesses legítimos do controlador. Isso não cobre fixtures de CI/CD: o CPF real do João está no seu banco de testes sem necessidade, sem base legal, e exposto a todos que têm acesso ao repositório. Use dados fictícios gerados algoritmicamente e a questão deixa de existir.</p>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Estrutura do boleto FEBRABAN campo a campo</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Campo livre e campos 1-2-3 (blocos 9.10 e 10.10 do Manual)</h3>
          <p className="mb-4">O campo livre (posições 20-44 do código de barras) é onde cada banco coloca seus dados internos: agência, conta, nosso número, carteira. Para montar a linha digitável, esse campo de 25 dígitos é dividido em três blocos:</p>
          <ul className="list-disc list-inside space-y-2 pl-2 my-4"><li><strong className="text-foreground">Campo 1:</strong> banco(3) + moeda(1) + campo livre posições 1-5 = 9 dígitos + dígito verificador mod10</li><li><strong className="text-foreground">Campo 2:</strong> campo livre posições 6-15 = 10 dígitos + dígito verificador mod10</li><li><strong className="text-foreground">Campo 3:</strong> campo livre posições 16-25 = 10 dígitos + dígito verificador mod10</li></ul>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Fator de vencimento: cálculo a partir de 07/10/1997 (data base FEBRABAN)</h3>
          <p className="mb-4">O fator de vencimento é o número de dias corridos entre 07/10/1997 e a data de vencimento do boleto, com 4 dígitos. O valor máximo é 9999 (que corresponde a 18/02/2025 — data em que o ciclo recomeçou, passando a contar do fator 1000 de novo segundo atualização FEBRABAN de 2025). Boleto sem vencimento usa <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">0000</code>.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Valor nominal: 10 dígitos sem separador decimal</h3>
          <p className="mb-4">R$ 150,00 vira <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">0000015000</code>. R$ 1.234,56 vira <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">0000123456</code>. Zero vírgulas, zero pontos, sempre 10 dígitos com padding esquerdo.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Dígito verificador geral: módulo 11 com pesos 2-9</h3>
          <p className="mb-4">O dígito geral (posição 5 do código de barras) é calculado sobre os outros 43 dígitos do código de barras (excluindo a própria posição 5). Os pesos ciclam de 2 a 9, da direita para a esquerda. Resto 0 e resto 1 retornam dígito 1 — essa é a exceção da spec FEBRABAN, diferente de outras implementações de módulo 11.</p>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Algoritmo do dígito verificador passo a passo</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Módulo 10 nos campos 1, 2 e 3</h3>
          <p className="mb-4">Cada campo da linha digitável termina com um dígito calculado via módulo 10:</p>
          <p className="mb-4">1. Multiplique os dígitos alternando entre peso 2 (da direita) e peso 1. 2. Se o produto for maior que 9, some os algarismos do produto. 3. Some todos os resultados. 4. Dígito = <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">10 - (soma % 10)</code>. Se o resultado for 10, dígito = 0.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Módulo 11 no campo 4 (dígito geral do código de barras)</h3>
          <p className="mb-4">1. Concatene o código de barras sem a posição 5 (43 dígitos). 2. Multiplique da direita com pesos ciclando 2,3,4,5,6,7,8,9,2,3... 3. Some todos os produtos. 4. Resto = <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">soma % 11</code>. 5. Se resto == 0 ou resto == 1, dígito verificador = 1. 6. Caso contrário, dígito verificador = <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">11 - resto</code>.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Casos especiais: resto 0 e resto 1 retornam dígito 1 (spec FEBRABAN)</h3>
          <p className="mb-4">Diferente do módulo 11 usado em CPF/CNPJ (onde resto 0 e 1 retornam 0), a spec do código de barras bancário retorna 1 nesses casos. Misturar as duas implementações é a fonte de erro mais comum.</p>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Implementação em TypeScript: gerador de linha digitável</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Tipos e interface <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">BoletoParams</code></h3>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-ts">{"interface BoletoParams {\n  bankCode: string;       // 3 dígitos: '001', '237', '341'\n  currencyCode: string;   // sempre '9'\n  freeField: string;      // 25 dígitos, específico por banco\n  maturityFactor: string; // 4 dígitos, '0000' = sem vencimento\n  value: string;          // 10 dígitos sem separador decimal\n}"}</code></pre>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Função <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">calcMod10(block: string): string</code></h3>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-ts">{"function calcMod10(block: string): string {\n  let sum = 0;\n  let weight = 2;\n  for (let i = block.length - 1; i >= 0; i--) {\n    let product = parseInt(block[i]) * weight;\n    if (product > 9) product = Math.floor(product / 10) + (product % 10);\n    sum += product;\n    weight = weight === 2 ? 1 : 2;\n  }\n  const remainder = sum % 10;\n  return remainder === 0 ? '0' : String(10 - remainder);\n}"}</code></pre>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Função <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">calcMod11Febraban(barcode: string): number</code></h3>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-ts">{"function calcMod11Febraban(barcode: string): number {\n  // barcode aqui já exclui a posição 5 (43 dígitos)\n  const weights = [2, 3, 4, 5, 6, 7, 8, 9];\n  let sum = 0;\n  let wi = 0;\n  for (let i = barcode.length - 1; i >= 0; i--) {\n    sum += parseInt(barcode[i]) * weights[wi % 8];\n    wi++;\n  }\n  const remainder = sum % 11;\n  if (remainder === 0 || remainder === 1) return 1;\n  return 11 - remainder;\n}"}</code></pre>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Função <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">buildBarcode(params: BoletoParams): string</code></h3>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-ts">{"function buildBarcode(params: BoletoParams): string {\n  const { bankCode, currencyCode, freeField, maturityFactor, value } = params;\n  const withoutCheckDigit =\n    bankCode + currencyCode + maturityFactor + value + freeField;\n  const checkDigit = calcMod11Febraban(withoutCheckDigit);\n  return bankCode + currencyCode + checkDigit + maturityFactor + value + freeField;\n}"}</code></pre>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Função <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">barcodeToDigitableLine(barcode: string): string</code></h3>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-ts">{"function barcodeToDigitableLine(barcode: string): string {\n  const bank = barcode.slice(0, 3);\n  const currency = barcode.slice(3, 4);\n  const freeField = barcode.slice(19, 44);\n\n  const block1Raw = bank + currency + freeField.slice(0, 5);\n  const block1 = block1Raw + calcMod10(block1Raw);\n\n  const block2Raw = freeField.slice(5, 15);\n  const block2 = block2Raw + calcMod10(block2Raw);\n\n  const block3Raw = freeField.slice(15, 25);\n  const block3 = block3Raw + calcMod10(block3Raw);\n\n  const checkDigit = barcode.slice(4, 5);\n  const maturityAndValue = barcode.slice(5, 19);\n\n  const f1 = `${block1.slice(0, 5)}.${block1.slice(5)}`;\n  const f2 = `${block2.slice(0, 5)}.${block2.slice(5)}`;\n  const f3 = `${block3.slice(0, 5)}.${block3.slice(5)}`;\n\n  return `${f1} ${f2} ${f3} ${checkDigit} ${maturityAndValue}`;\n}"}</code></pre>
          <p className="mb-4"><strong className="text-foreground">Exemplo completo end-to-end:</strong></p>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-ts">{"const params: BoletoParams = {\n  bankCode: '341',\n  currencyCode: '9',\n  freeField: '1234567890123456789012345',\n  maturityFactor: '9999',\n  value: '0000015000',\n};\n\nconst barcode = buildBarcode(params);\nconst digitableLine = barcodeToDigitableLine(barcode);\n\nconsole.log('Código de barras:', barcode);\nconsole.log('Linha digitável: ', digitableLine);\n// Linha digitável: 34191.23456 67890.123456 78901.234567 X 99990000015000"}</code></pre>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Gerando dados de suporte LGPD-safe para o boleto</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">CNPJ do cedente com <Link href="/gerador-cnpj" className="text-primary hover:underline">/gerador-cnpj</Link></h3>
          <p className="mb-4">O cedente precisa de CNPJ válido no campo livre de muitos bancos. Use a <Link href="/docs" className="text-primary hover:underline">API REST do FakeForge</Link> para pegar um CNPJ fictício que passa no módulo 11:</p>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-bash">{"curl \"https://fakeforge.com.br/api/generate?type=cnpj&quantity=1&format=json\""}</code></pre>
          <p className="mb-4">A resposta inclui <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">_meta.source</code> e o CNPJ já validado. Passe direto para o campo livre do boleto sem nenhum pós-processamento.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">CPF do pagador com <Link href="/gerador-cpf" className="text-primary hover:underline">/gerador-cpf</Link></h3>
          <p className="mb-4">O nome e CPF do pagador aparecem no slip impresso mas não entram no cálculo do dígito verificador. Use <Link href="/gerador-pessoa" className="text-primary hover:underline">/gerador-pessoa</Link> para gerar nome + CPF correlacionados — o mesmo endpoint gera primeiro nome, sobrenome e CPF coerentes com gênero e região.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Conta bancária e código de banco com <Link href="/gerador-conta-bancaria" className="text-primary hover:underline">/gerador-conta-bancaria</Link></h3>
          <p className="mb-4">O campo livre varia por banco. Para Itaú (341), o campo livre inclui agência e conta no formato específico Itaú. Para Bradesco (237), é diferente. Use <Link href="/gerador-conta-bancaria" className="text-primary hover:underline">/gerador-conta-bancaria</Link> para obter agência, conta e código COMPE aleatórios de um dos 17 bancos reais suportados.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Por que usar dados fictícios correlacionados evita falsos positivos em CI</h3>
          <p className="mb-4">Um CNPJ aleatório inválido faz o validador de gateway rejeitar o boleto antes de chegar ao teste de pagamento. Um CPF real de produção faz o banco de dados de fraude sinalizar a transação em ambiente de staging. Dados fictícios válidos eliminam as duas falhas.</p>
          <blockquote className="border-l-4 border-accent pl-4 my-4 text-muted-foreground italic"><strong className="text-foreground">DICA:</strong> Gere os dados de suporte uma vez, commite no repositório como fixture JSON, e referencia o arquivo nos testes. Não faça chamada HTTP em tempo de teste — quebre o CI quando a rede não está disponível.</blockquote>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Validando a linha digitável gerada</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Verificação manual via banco de testes (Banco do Brasil Sandbox, Sicoob Sandbox)</h3>
          <p className="mb-4">O Banco do Brasil disponibiliza sandbox em <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">api.sandbox.bb.com.br</code>. O Sicoob tem ambiente de homologação com documentação pública. Ambos aceitam boletos fictícios e retornam <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">200</code> se a linha digitável estiver correta.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Biblioteca <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">boleto-utils</code> como referência cruzada (sem dependência obrigatória)</h3>
          <p className="mb-4">O pacote <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">boleto-utils</code> (npm) implementa validação independente. Use como oráculo nos testes, não como dependência de produção:</p>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-ts">{"describe('boleto gerado', () => {\n  it('dígito verificador está correto', () => {\n    const params: BoletoParams = {\n      bankCode: '341',\n      currencyCode: '9',\n      freeField: '1234567890123456789012345',\n      maturityFactor: '9999',\n      value: '0000015000',\n    };\n    const barcode = buildBarcode(params);\n    const line = barcodeToDigitableLine(barcode);\n\n    // formato esperado: NNNNN.NNNNN NNNNN.NNNNNN NNNNN.NNNNNN N NNNNNNNNNNNNNN\n    expect(line).toMatch(\n      /^\\d{5}\\.\\d{6} \\d{5}\\.\\d{7} \\d{5}\\.\\d{7} \\d \\d{14}$/\n    );\n\n    const checkDigit = parseInt(barcode[4]);\n    const barcodeWithout = barcode.slice(0, 4) + barcode.slice(5);\n    expect(calcMod11Febraban(barcodeWithout)).toBe(checkDigit);\n  });\n});"}</code></pre>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Integrando o gerador numa fixture de testes Node.js</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Fixture com 3 boletos usando CNPJ/CPF fictícios + exportação JSON</h3>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-ts">{"const fixtures = [\n  { bankCode: '341', value: '0000015000', maturityFactor: '9999' },\n  { bankCode: '237', value: '0000250000', maturityFactor: '0000' }, // sem vencimento\n  { bankCode: '001', value: '0000000000', maturityFactor: '9998' }, // valor livre\n].map((params, i) => {\n  const freeField = String(i + 1).padStart(25, '0');\n  const full: BoletoParams = { ...params, currencyCode: '9', freeField };\n  const barcode = buildBarcode(full);\n  return {\n    barcode,\n    digitableLine: barcodeToDigitableLine(barcode),\n    cnpjCedente: '11222333000181', // gerado via /gerador-cnpj\n    cpfPagador:  '529.982.247-25', // gerado via /gerador-cpf\n  };\n});\n\nconsole.log(JSON.stringify(fixtures, null, 2));"}</code></pre>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Seed determinístico: passando <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">seed</code> para reproduzir o mesmo conjunto em CI</h3>
          <p className="mb-4">O campo livre é derivado do índice no exemplo acima — determinístico por definição. Para dados de suporte (CNPJ, CPF), passe <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">?seed=42</code> na chamada à <Link href="/docs" className="text-primary hover:underline">FakeForge API</Link> quando o endpoint suportar. Commite o resultado como arquivo <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">.json</code> em <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">__fixtures__/boletos.json</code>.</p>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Casos de borda que quebram parsers de boleto</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Fator de vencimento 0000 (boleto sem vencimento, FEBRABAN admite)</h3>
          <p className="mb-4"><code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">0000</code> é válido pela spec. Parsers que esperam fator &gt;= 1000 rejeitam esse boleto silenciosamente. Inclua um caso com <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">maturityFactor: '0000'</code> na suite.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Valor 0000000000 (cobrança de valor livre)</h3>
          <p className="mb-4">Usado em carnês onde o pagador preenche o valor. Parsers que validam valor &gt; 0 quebram aqui. Teste explicitamente.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Banco 001 vs 237 vs 341: variações no campo livre por instituição</h3>
          <p className="mb-4">O campo livre de 25 dígitos tem estrutura interna diferente por banco. Itaú usa os primeiros 3 dígitos para carteira. Bradesco usa os primeiros 3 para agência. Para testes de integração contra um gateway específico, construa o campo livre seguindo o manual do banco-alvo.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Boleto de convênio (campo livre diferente do modelo padrão)</h3>
          <p className="mb-4">Boletos de convênio (tributos, concessionárias) seguem o padrão <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">9NNNN</code>, não o bancário. O cálculo do dígito verificador é diferente. Não misture os dois parsers.</p>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Limites legais ao usar dados fictícios em testes</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">LGPD Art. 13 — anonimização como base legal para uso em pesquisa e teste</h3>
          <p className="mb-4"><a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">LGPD Art. 13</a> permite uso de dados anonimizados para pesquisa e desenvolvimento sem necessidade de consentimento. Dados gerados algoritmicamente (nunca associados a uma pessoa real) satisfazem esse critério. CPF gerado via <Link href="/gerador-cpf" className="text-primary hover:underline">/gerador-cpf</Link> não é dado pessoal — é um número que passa na validação de formato sem corresponder a nenhum titular.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Circular BACEN 3.952/2019 e o que ela diz sobre dados de pagamento em sandbox</h3>
          <p className="mb-4">A Circular BACEN 3.952/2019 regula o uso de dados de pagamento em ambiente de produção. Ambientes de sandbox com dados fictícios ficam fora do escopo — desde que os dados nunca transitem por infra de produção e não haja risco de confusão com transações reais.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">O que não fazer: nunca usar CPF/CNPJ real em fixture de CI/CD</h3>
          <p className="mb-4">Um CPF real em um repositório Git é um dado pessoal exposto. Se o repo é público, é vazamento. Se é privado, ainda é tratamento sem base legal. Use <Link href="/validar-cpf" className="text-primary hover:underline">/validar-cpf</Link> para confirmar que o CPF fictício passa na validação antes de commitar — e mantenha a origem fictícia documentada no próprio arquivo de fixture.</p>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Resumo</h2>
          <ul className="list-disc list-inside space-y-2 pl-2 my-4"><li>Gere o código de barras com <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">buildBarcode()</code> e converta para linha digitável com <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">barcodeToDigitableLine()</code> — são funções puras, sem dependência externa.</li><li>Módulo 10 vai nos campos 1, 2 e 3 da linha digitável; módulo 11 com pesos 2-9 vai no dígito verificador geral (posição 5 do código de barras).</li><li>Resto 0 e resto 1 no módulo 11 FEBRABAN retornam dígito 1 — diferente de CPF/CNPJ.</li><li>Teste os três casos de borda obrigatórios: fator de vencimento <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">0000</code>, valor <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">0000000000</code>, e pelo menos dois bancos diferentes.</li><li>Use <Link href="/gerador-cnpj" className="text-primary hover:underline">/gerador-cnpj</Link>, <Link href="/gerador-cpf" className="text-primary hover:underline">/gerador-cpf</Link> e <Link href="/gerador-conta-bancaria" className="text-primary hover:underline">/gerador-conta-bancaria</Link> para preencher CNPJ do cedente, CPF do pagador e campo livre sem tocar em dados reais.</li><li>Commite fixtures como JSON estático gerado com seed fixo — não faça chamadas HTTP durante a execução dos testes.</li></ul>
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">Perguntas frequentes</h2>
          <div className="space-y-3">
            <details key="Como debugar se minha linha di" className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">Como debugar se minha linha digitável foi rejeitada — erro no módulo 10 ou 11?</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">Isolate. Se o gateway retornar 'invalid check digit', valide o módulo 11 do código de barras primeiro (posição 5). Se passar, erro está nos módulos 10 dos campos 1-2-3. Log cada componente antes de concatenar. Use parser online ou boleto-utils para cotejar.</p>
            </details>
            <details key="Posso usar a mesma linha digit" className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">Posso usar a mesma linha digitável em staging e produção?</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">Não. Cada ambiente deve gerar boletos novos. Hardcodar linha em produção vincula ao cedente de staging ou expira. Gere dados por ambiente. Se reproduz em testes, passe os parâmetros e rederive localmente com seed fixo para reproducibilidade.</p>
            </details>
            <details key="Minha linha digitável precisa " className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">Minha linha digitável precisa bater com a do banco?</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">Sim. Se discordam, há erro no campo livre ou dígito verificador. Teste contra sandbox do banco — retorna qual campo errou. Sem sandbox, coteje com boleto-utils. Se ambos divergem do seu cálculo, debug módulo 11 ou estrutura do campo livre.</p>
            </details>
            <details key="Como construir o campo livre s" className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">Como construir o campo livre se o banco não está documentado?</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">Consulte FEBRABAN 003.008 banco-específico. Se indisponível, reverta a engenharia observando boletos reais em SPED ou extratos. Campo livre contém agência, conta, carteira — varia por instituição. Último recurso: contacte suporte técnico do banco.</p>
            </details>
            <details key="Se o vencimento for daqui 10 a" className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">Se o vencimento for daqui 10 anos, qual fator uso?</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">Máximo fator é 9999 (vence 18/fev/2025). Vencimentos posteriores usam `0000` com data em observação fiscal. FEBRABAN permite; bancos modernos aceitam. Ciclo reinicia conforme resoluções BACEN. Valide sempre contra documentação do banco-alvo.</p>
            </details>
          </div>
        </section>
        <ShareBar title={"Boleto FEBRABAN em Node.js: gerar linha digitável para testes"} path="/blog/gerar-boleto-febraban-linha-digitavel-nodejs-testes" />
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: "{\"@context\":\"https://schema.org\",\"@type\":\"FAQPage\",\"mainEntity\":[{\"@type\":\"Question\",\"name\":\"Como debugar se minha linha digitável foi rejeitada — erro no módulo 10 ou 11?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Isolate. Se o gateway retornar 'invalid check digit', valide o módulo 11 do código de barras primeiro (posição 5). Se passar, erro está nos módulos 10 dos campos 1-2-3. Log cada componente antes de concatenar. Use parser online ou boleto-utils para cotejar.\"}},{\"@type\":\"Question\",\"name\":\"Posso usar a mesma linha digitável em staging e produção?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Não. Cada ambiente deve gerar boletos novos. Hardcodar linha em produção vincula ao cedente de staging ou expira. Gere dados por ambiente. Se reproduz em testes, passe os parâmetros e rederive localmente com seed fixo para reproducibilidade.\"}},{\"@type\":\"Question\",\"name\":\"Minha linha digitável precisa bater com a do banco?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Sim. Se discordam, há erro no campo livre ou dígito verificador. Teste contra sandbox do banco — retorna qual campo errou. Sem sandbox, coteje com boleto-utils. Se ambos divergem do seu cálculo, debug módulo 11 ou estrutura do campo livre.\"}},{\"@type\":\"Question\",\"name\":\"Como construir o campo livre se o banco não está documentado?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Consulte FEBRABAN 003.008 banco-específico. Se indisponível, reverta a engenharia observando boletos reais em SPED ou extratos. Campo livre contém agência, conta, carteira — varia por instituição. Último recurso: contacte suporte técnico do banco.\"}},{\"@type\":\"Question\",\"name\":\"Se o vencimento for daqui 10 anos, qual fator uso?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Máximo fator é 9999 (vence 18/fev/2025). Vencimentos posteriores usam `0000` com data em observação fiscal. FEBRABAN permite; bancos modernos aceitam. Ciclo reinicia conforme resoluções BACEN. Valide sempre contra documentação do banco-alvo.\"}}]}",
        }}
      />
    </PageShell>
  );
}
