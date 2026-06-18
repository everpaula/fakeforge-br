import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BlogFeaturedImage from "@/components/BlogFeaturedImage";
import ShareBar from "@/components/ShareBar";
import BlogPostingSchema from "@/components/BlogPostingSchema";

export const metadata: Metadata = {
  title: "Conta Corrente em Node.js: Dígito Verificador por Banco",
  description: "Implemente validação e geração de contas correntes brasileiras em Node.js com os algoritmos mod-10 e mod-11 dos principais bancos: Bradesco, Itaú, BB, Caixa e Santander.",
  openGraph: {
    title: "Conta Corrente em Node.js: Dígito Verificador por Banco",
    description: "Implemente validação e geração de contas correntes brasileiras em Node.js com os algoritmos mod-10 e mod-11 dos principais bancos: Bradesco, Itaú, BB, Caixa e Santander.",
    type: "article",
    images: ["/api/og?title=Conta%20corrente%20em%20Node.js%3A%20calculando%20o%20d%C3%ADgito%20verificador%20por%20banco&subtitle=Implemente%20valida%C3%A7%C3%A3o%20e%20gera%C3%A7%C3%A3o%20de%20contas%20correntes%20brasileiras%20em%20Node.js%20com%20os%20algoritmos%20mod-10%20e%20mod-11%20dos%20principais%20bancos%20%E2%80%94%20Bradesco&category=TUTORIAIS"],
  },
  alternates: { canonical: "/blog/gerador-conta-corrente-nodejs-digito-verificador-banco" },
};

export default function Post() {
  return (
    <PageShell>
      <article className="max-w-2xl">
        <Link href="/blog" className="text-xs text-primary hover:underline mb-4 inline-block">
          ← Voltar ao blog
        </Link>
        <BlogFeaturedImage category="Tutoriais" title="Conta corrente em Node.js: calculando o dígito verificador por banco" className="mb-6" />
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
            Conta corrente em Node.js: calculando o dígito verificador por banco
          </h1>
          <div className="flex items-center gap-3 text-xs text-muted mt-3">
            <time>02 de junho de 2026</time>
            <span>·</span>
            <span>14 min de leitura</span>
          </div>
        </div>

        <div className="prose-custom space-y-2 text-sm text-muted-foreground leading-relaxed">
          <p className="mb-4">Cada banco brasileiro calcula o dígito verificador de conta corrente com um algoritmo próprio. Sem entender essas regras, qualquer gerador de dados de teste vai produzir contas que parecem válidas mas falham na primeira chamada à API do seu banco. Este guia implementa os cinco bancos mais comuns em TypeScript e monta um dispatcher por código COMPE.</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">O que é o dígito verificador de conta corrente no Brasil</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Por que cada banco tem um algoritmo diferente</h3>
          <p className="mb-4">O Banco Central padroniza o formato de conta via FEBRABAN, mas não impõe o algoritmo do DV. Cada instituição escolhe o método ao definir sua numeração interna. O resultado é uma proliferação de variantes de mod-10 e mod-11 que convivem no mesmo sistema bancário.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Diferença entre dígito da agência e dígito da conta</h3>
          <p className="mb-4">A agência tem seu próprio DV, calculado separadamente da conta. No Itaú, os dois são concatenados antes do cálculo. No Santander, a agência não tem DV próprio. Confundir os dois é a origem de boa parte dos bugs em integrações bancárias.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Formato padrão FEBRABAN: agência / conta + DV</h3>
          <p className="mb-4">O padrão de exibição é <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">AAAA-D / CCCCCCC-D</code>, onde <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">AAAA</code> é a agência, <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">D</code> é o dígito verificador da agência, <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">CCCCCCC</code> é a conta e o <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">D</code> final é o DV da conta. A barra separa agência de conta; o hífen separa conta de DV.</p>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Fundamentos: módulo 10 e módulo 11 aplicados a contas bancárias</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Como funciona o mod-11 (pesos 2-9, base padrão)</h3>
          <p className="mb-4">Multiplica cada dígito, da direita para a esquerda, por pesos sequenciais que começam em 2 e vão até 9, reiniciando em 2 se necessário. Soma os produtos, calcula o resto da divisão por 11 e subtrai de 11. Se o resultado for 10 ou 11, a regra de tratamento varia por banco.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Como funciona o mod-10 (pesos alternados 2-1)</h3>
          <p className="mb-4">Multiplica os dígitos alternando pesos 2 e 1, da direita para a esquerda. Se o produto de um dígito for maior que 9, soma os algarismos do resultado (ex: 14 → 1+4 = 5). Soma tudo, calcula o resto por 10 e subtrai de 10. Resto 0 → DV 0.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Tratamento dos restos 0 e 1 — os casos que derrubam implementações</h3>
          <p className="mb-4">Resto 0 quase sempre vira DV 0, mas resto 1 diverge por banco: Banco do Brasil usa <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">X</code>, Bradesco usa <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">0</code>, Santander usa <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">1</code>. Ignorar essa diferença gera contas com DV errado que passam em testes unitários simples e quebram em validação real.</p>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-ts">{"function mod11(digits: number[], weights: number[]): number {\n  const sum = digits.reduce((acc, digit, i) => acc + digit * weights[i % weights.length], 0);\n  return sum % 11;\n}\n\nfunction mod10(digits: number[]): number {\n  const sum = digits\n    .reverse()\n    .reduce((acc, digit, i) => {\n      const product = digit * (i % 2 === 0 ? 2 : 1);\n      return acc + (product > 9 ? Math.floor(product / 10) + (product % 10) : product);\n    }, 0);\n  return sum % 10;\n}"}</code></pre>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Banco do Brasil (001): mod-11 na conta de 6 dígitos</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Regra oficial: resto 0 → DV 0, resto 1 → DV X</h3>
          <p className="mb-4">O BB aplica mod-11 com pesos de 2 a 9 sobre os dígitos da conta (sem o DV). O resultado <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">11 - resto</code> é o DV — exceto quando o resto é 0 (DV = <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">0</code>) ou 1 (DV = <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">X</code>).</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Contas com 8 dígitos — a variação que a maioria esquece</h3>
          <p className="mb-4">Correntistas mais antigos têm contas de 8 dígitos. A lógica é idêntica; o que muda é o padding com zeros à esquerda antes de calcular. Sempre normalize para 8 dígitos antes de aplicar os pesos.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Implementação em TypeScript com tipos estritos</h3>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-ts">{"export function calcDVBancoDoBrasil(conta: string): string {\n  const digits = conta.padStart(8, '0').split('').map(Number);\n  const weights = [9, 8, 7, 6, 5, 4, 3, 2];\n  const remainder = mod11(digits, weights);\n\n  if (remainder === 0) return '0';\n  if (remainder === 1) return 'X';\n  return String(11 - remainder);\n}"}</code></pre>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Bradesco (237): mod-11 com pesos 2 a 7</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Sequência de pesos e ordem de aplicação</h3>
          <p className="mb-4">O Bradesco usa pesos de 2 a 7 (seis pesos) sobre os seis dígitos da conta, da direita para a esquerda. Se a conta tiver menos de seis dígitos, padeia com zeros à esquerda.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Resto 0 ou 1 → DV 0 (diferente do BB)</h3>
          <p className="mb-4">Quando o resto é 0 ou 1, o DV é <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">0</code>. Para qualquer outro valor, DV = <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">11 - resto</code>. Essa diferença em relação ao BB é sutil e costuma causar regressões quando se reutiliza código de um banco no outro.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Código TypeScript pronto para produção</h3>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-ts">{"export function calcDVBradesco(conta: string): string {\n  const digits = conta.padStart(7, '0').split('').map(Number);\n  const weights = [2, 3, 4, 5, 6, 7, 8];\n  const remainder = mod11(digits, weights);\n\n  if (remainder === 0 || remainder === 1) return '0';\n  return String(11 - remainder);\n}"}</code></pre>
          <blockquote className="border-l-4 border-accent pl-4 my-4 text-muted-foreground italic">DICA: Para testes com o Bradesco, gere também um CNPJ válido para a titularidade PJ. Use o <Link href="/gerador-cnpj" className="text-primary hover:underline">gerador de CNPJ</Link> do FakeForge e combine com a conta gerada aqui.</blockquote>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Itaú (341): mod-10 na conta + agência composta</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Concatenar agência e conta antes de calcular</h3>
          <p className="mb-4">O Itaú é o único entre os cinco grandes que usa mod-10, e faz algo diferente: concatena os quatro dígitos da agência com os cinco dígitos da conta antes de aplicar o algoritmo. O DV calculado é da combinação agência+conta, não da conta isolada.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Por que o Itaú usa mod-10 enquanto os outros usam mod-11</h3>
          <p className="mb-4">Decisão histórica de projeto — mod-10 é o mesmo algoritmo do código de barras FEBRABAN, então reaproveitam a implementação. Não há uma razão técnica que o torne superior ao mod-11 para esse caso de uso.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Implementação e casos de borda</h3>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-ts">{"export function calcDVItau(agencia: string, conta: string): string {\n  const combined = (agencia.padStart(4, '0') + conta.padStart(5, '0')).split('').map(Number);\n  const remainder = mod10(combined);\n\n  return remainder === 0 ? '0' : String(10 - remainder);\n}"}</code></pre>
          <p className="mb-4">Conta <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">00000</code> com qualquer agência é inválida e deve ser rejeitada antes de chegar ao cálculo. Adicione um guard no início da função se estiver validando entrada de usuário.</p>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Caixa Econômica Federal (104): operação específica por tipo de conta</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Contas 001/003/013/023 versus contas Poupança</h3>
          <p className="mb-4">A CEF classifica contas pelo código de operação — os três primeiros dígitos que antecedem o número da conta. Contas correntes (001, 003, 013, 023) e poupança (013, 023 com variações) têm algoritmos distintos. O código de operação precisa ser conhecido antes de calcular o DV.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Algoritmo CAIXA com peso crescente e tabela de substituição</h3>
          <p className="mb-4">Para contas correntes comuns, a CEF aplica mod-11 com pesos de 2 a 9. O ponto diferente é a tabela de substituição para restos específicos quando o tipo de operação é poupança.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Código com mapa de tipo de operação</h3>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-ts">{"const CAIXA_SAVINGS_OPS = new Set(['013', '023', '028', '003']);\n\nexport function calcDVCaixa(operacao: string, conta: string): string {\n  const digits = conta.padStart(11, '0').split('').map(Number);\n  const weights = [8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6];\n  const remainder = mod11(digits, weights);\n\n  if (CAIXA_SAVINGS_OPS.has(operacao)) {\n    if (remainder === 0) return '0';\n    if (remainder === 1) return '1';\n    return String(11 - remainder);\n  }\n\n  if (remainder === 0 || remainder === 1) return '0';\n  return String(11 - remainder);\n}"}</code></pre>
          <blockquote className="border-l-4 border-accent pl-4 my-4 text-muted-foreground italic">AVISO: A CEF atualiza a tabela de operações periodicamente. Antes de usar em produção, valide contra a especificação FEBRABAN vigente ou a documentação da CEF para correspondentes bancários.</blockquote>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Santander (033): mod-11 com pesos 2-9 e dígito fixo para resto 0</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Diferença sutil em relação ao Bradesco</h3>
          <p className="mb-4">O Santander usa mod-11 com pesos de 2 a 9 — igual ao BB — mas trata resto 0 como DV <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">0</code> e resto 1 como DV <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">1</code>. Nenhum DV <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">X</code> aqui.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Validação da agência (sempre 4 dígitos, sem DV próprio no Santander)</h3>
          <p className="mb-4">O Santander não tem DV de agência. A agência é sempre quatro dígitos sem caractere verificador. Se você receber um dado com cinco caracteres na agência, o quinto é provavelmente o DV da conta no formato antigo do banco, antes da migração para o sistema atual.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Implementação TypeScript</h3>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-ts">{"export function calcDVSantander(conta: string): string {\n  const digits = conta.padStart(9, '0').split('').map(Number);\n  const weights = [9, 8, 7, 6, 5, 4, 3, 2, 9];\n  const remainder = mod11(digits, weights);\n\n  if (remainder === 0) return '0';\n  if (remainder === 1) return '1';\n  return String(11 - remainder);\n}"}</code></pre>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Nubank, Inter e C6: contas digitais sem agência física</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Estrutura de conta das fintechs — ISPB em vez de código de compensação</h3>
          <p className="mb-4">Fintechs usam o ISPB (Identificador do Sistema de Pagamentos Brasileiro) como identificador, não o código COMPE de três dígitos. O ISPB do Nubank é <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">18236120</code>, do Inter é <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">00416968</code>, do C6 é <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">31872495</code>. Em integrações via PIX ou TED, o ISPB é o identificador correto.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Por que o dígito verificador é opcional ou inexistente nessas APIs</h3>
          <p className="mb-4">Contas digitais usam numeração sequencial interna sem algoritmo de verificação público documentado. O DV, quando presente, é apenas um campo de controle interno sem especificação aberta.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Como gerar dados de teste realistas para essas instituições</h3>
          <p className="mb-4">Para testes, gere um número de conta com 7 a 10 dígitos, use <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">0001</code> como agência (padrão dessas instituições) e deixe o campo de DV vazio ou <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">0</code>. O endpoint <Link href="/gerador-conta-bancaria" className="text-primary hover:underline">/gerador-conta-bancaria</Link> do FakeForge já inclui Nubank, Inter e C6 com essa estrutura.</p>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Montando um gerador unificado por código de banco (COMPE)</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Mapa de estratégia por banco — o padrão Strategy em TypeScript</h3>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-ts">{"interface BankAccountStrategy {\n  calcDV(agencia: string, conta: string): string;\n  agenciaDigits: number;\n  contaDigits: number;\n}\n\nconst STRATEGIES: Record<string, BankAccountStrategy> = {\n  '001': { calcDV: (_, c) => calcDVBancoDoBrasil(c), agenciaDigits: 4, contaDigits: 8 },\n  '237': { calcDV: (_, c) => calcDVBradesco(c), agenciaDigits: 4, contaDigits: 7 },\n  '341': { calcDV: calcDVItau, agenciaDigits: 4, contaDigits: 5 },\n  '033': { calcDV: (_, c) => calcDVSantander(c), agenciaDigits: 4, contaDigits: 9 },\n};"}</code></pre>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Gerando agência, conta e DV coerentes em uma só chamada</h3>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-ts">{"interface BankAccount {\n  bankCode: string;\n  agencia: string;\n  conta: string;\n  dv: string;\n}\n\nfunction randomDigits(n: number): string {\n  return Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join('');\n}\n\nexport function generateBankAccount(bankCode: string): BankAccount {\n  const strategy = STRATEGIES[bankCode];\n  if (!strategy) throw new Error(`Banco ${bankCode} sem estratégia registrada`);\n\n  const agencia = randomDigits(strategy.agenciaDigits);\n  const conta = randomDigits(strategy.contaDigits);\n  const dv = strategy.calcDV(agencia, conta);\n\n  return { bankCode, agencia, conta, dv };\n}"}</code></pre>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Fallback para bancos sem algoritmo documentado</h3>
          <p className="mb-4">Para bancos fora do mapa, gere um DV aleatório de um dígito e marque o objeto com <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">dvVerified: false</code>. Isso mantém a interface consistente sem gerar dados que pareçam válidos quando não são.</p>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Validando contas geradas: testes com Jest</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Casos felizes por banco e casos de borda</h3>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-ts">{"import { calcDVBancoDoBrasil, calcDVBradesco, calcDVItau, calcDVSantander } from './bank-dv';\n\ndescribe('Banco do Brasil', () => {\n  it.each([\n    ['12345678', '4'],\n    ['00000001', 'X'],\n    ['99999999', '0'],\n  ])('conta %s → DV %s', (conta, expected) => {\n    expect(calcDVBancoDoBrasil(conta)).toBe(expected);\n  });\n});\n\ndescribe('Itaú — agência + conta concatenados', () => {\n  it('agência com zero à esquerda não altera resultado', () => {\n    expect(calcDVItau('0340', '12345')).toBe(calcDVItau('340', '12345'));\n  });\n});"}</code></pre>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Integração com o endpoint da FakeForge para geração em volume</h3>
          <p className="mb-4">Para gerar mil contas em batch sem implementar o gerador localmente, use a <Link href="/docs" className="text-primary hover:underline">API REST do FakeForge</Link>:</p>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-bash">{"curl \"https://fakeforge.com.br/api/generate?type=bankAccount&quantity=1000&format=csv\" \\\n  -H \"x-api-key: SEU_TOKEN\""}</code></pre>
          <p className="mb-4">O CSV retornado inclui <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">bankCode</code>, <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">agencia</code>, <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">conta</code> e <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">dv</code> prontos para seed de banco de dados. Para mais de 100 chamadas por dia, veja os <Link href="/pricing" className="text-primary hover:underline">planos disponíveis</Link>.</p>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Uso com LGPD: quando dados bancários fictícios são necessários</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">LGPD Art. 7º, IX — legítimo interesse e dados de teste</h3>
          <p className="mb-4">A <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">LGPD Art. 7º, IX</a> permite o tratamento de dados pessoais quando necessário para atender interesses legítimos do controlador. Para testes de integração bancária, o interesse legítimo é claro — mas o caminho mais limpo é não usar dados reais. Dados sintéticos gerados com algoritmos corretos eliminam o risco de exposição de titulares.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Diferença entre dado sintético e dado real anonimizado</h3>
          <p className="mb-4">Dado sintético nunca existiu. Dado anonimizado existiu e passou por processo de remoção de identificadores. Para fins de teste, dados sintéticos são superiores: sem risco residual de re-identificação, sem obrigação de registrar o tratamento como dado pessoal.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Por que gerar dados inválidos é pior do que usar dados reais (falha silenciosa)</h3>
          <p className="mb-4">Contas com DV errado passam em testes de formato mas falham silenciosamente em validações de negócio dos bancos. O sistema registra a transação, não retorna erro imediato, e o problema aparece horas depois na reconciliação. Dados sintéticos com DV correto detectam esses bugs no ambiente de desenvolvimento, onde o custo é zero.</p>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Resumo</h2>
          <ul className="list-disc list-inside space-y-2 pl-2 my-4"><li><strong className="text-foreground">Mod-11 é o padrão</strong>, mas cada banco trata restos 0 e 1 de forma diferente: BB usa <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">X</code> para resto 1, Bradesco usa <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">0</code>, Santander usa <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">1</code>.</li><li><strong className="text-foreground">Itaú é o único</strong> entre os cinco grandes que usa mod-10 e concatena agência+conta antes de calcular.</li><li><strong className="text-foreground">CEF exige o código de operação</strong> antes do cálculo — sem ele, não é possível determinar o algoritmo correto.</li><li><strong className="text-foreground">Fintechs (Nubank, Inter, C6)</strong> não têm algoritmo de DV público; use agência <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">0001</code> e DV <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">0</code> em dados de teste.</li><li><strong className="text-foreground">O padrão Strategy</strong> (interface <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">BankAccountStrategy</code> + mapa por código COMPE) permite adicionar novos bancos sem alterar a função geradora.</li><li>Para geração em volume sem manter o código localmente, o endpoint <Link href="/docs" className="text-primary hover:underline">/api/generate</Link> exporta contas em JSON, CSV ou SQL com o <Link href="/gerador-conta-bancaria" className="text-primary hover:underline">gerador de conta bancária</Link> do FakeForge. Para CPF e CNPJ de titulares, use os geradores <Link href="/gerador-cpf" className="text-primary hover:underline">/gerador-cpf</Link> e <Link href="/gerador-cnpj" className="text-primary hover:underline">/gerador-cnpj</Link>.</li></ul>
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">Perguntas frequentes</h2>
          <div className="space-y-3">
            <details key="Como validar uma conta bancári" className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">Como validar uma conta bancária existente em vez de gerar uma nova?</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">Implemente a validação invertida: dado agência, conta e DV, recalcule o DV com a mesma estratégia e compare com o informado. Para Banco do Brasil, `calcDVBancoDoBrasil(conta) === dvInformado`. Se não baterem, rejeite. O padrão Strategy funciona em ambas direções — geração e validação.</p>
            </details>
            <details key="Posso reutilizar o mesmo dígit" className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">Posso reutilizar o mesmo dígito verificador para múltiplas contas da mesma agência?</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">Não. O DV é calculado a partir da sequência específica de dígitos da conta. Contas diferentes, mesmo agência, produzem DVs diferentes. Usar o mesmo DV viola a integridade do esquema. No padrão Strategy, DV é função pura da conta — sem nenhuma reutilização possível entre registros.</p>
            </details>
            <details key="Como testo conta bancária de u" className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">Como testo conta bancária de um banco fora da lista (ex: Banco Safra)?</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">Gere agência e conta com dígitos aleatórios, deixe DV `0` ou fictício, marque com `dvVerified: false`. Em testes, mocke a validação ou pule. Para cobertura real, solicite especificação ao Banco Central. FakeForge inclui os cinco maiores; bancos menores requerem algoritmos específicos.</p>
            </details>
            <details key="Qual a diferença entre validar" className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">Qual a diferença entre validar DV isolado e validar a conta inteira no backend?</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">Validar DV é verificação de formato local — confirma que segue o algoritmo. Validar conta inteira requer chamar a API do banco para confirmar existência, saldo, titularidade. São camadas distintas. Use DV para rejeitar dados inválidos antes de contatar o banco.</p>
            </details>
            <details key="Se o FakeForge gera conta váli" className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">Se o FakeForge gera conta válida, posso depositar nela ou usar em produção?</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">Não. Dados sintéticos passam na verificação matemática de DV mas são fictícios — não existem no banco. Usar em produção causará erro na transação. Use para testes locais, mocks, fixtures. Dados reais vêm de contas sandbox do banco, não do FakeForge.</p>
            </details>
          </div>
        </section>
        <ShareBar title={"Conta Corrente em Node.js: Dígito Verificador por Banco"} path="/blog/gerador-conta-corrente-nodejs-digito-verificador-banco" />
        <BlogPostingSchema
          title={"Conta Corrente em Node.js: Dígito Verificador por Banco"}
          slug="gerador-conta-corrente-nodejs-digito-verificador-banco"
          description={"Implemente validação e geração de contas correntes brasileiras em Node.js com os algoritmos mod-10 e mod-11 dos principais bancos: Bradesco, Itaú, BB, Caixa e Santander."}
          datePublished="2026-05-26"
          image="https://fakeforge.com.br/api/og?title=Conta%20corrente%20em%20Node.js%3A%20calculando%20o%20d%C3%ADgito%20verificador%20por%20banco&subtitle=Implemente%20valida%C3%A7%C3%A3o%20e%20gera%C3%A7%C3%A3o%20de%20contas%20correntes%20brasileiras%20em%20Node.js%20com%20os%20algoritmos%20mod-10%20e%20mod-11%20dos%20principais%20bancos%20%E2%80%94%20Bradesco&category=TUTORIAIS"
        />
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: "{\"@context\":\"https://schema.org\",\"@type\":\"FAQPage\",\"mainEntity\":[{\"@type\":\"Question\",\"name\":\"Como validar uma conta bancária existente em vez de gerar uma nova?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Implemente a validação invertida: dado agência, conta e DV, recalcule o DV com a mesma estratégia e compare com o informado. Para Banco do Brasil, `calcDVBancoDoBrasil(conta) === dvInformado`. Se não baterem, rejeite. O padrão Strategy funciona em ambas direções — geração e validação.\"}},{\"@type\":\"Question\",\"name\":\"Posso reutilizar o mesmo dígito verificador para múltiplas contas da mesma agência?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Não. O DV é calculado a partir da sequência específica de dígitos da conta. Contas diferentes, mesmo agência, produzem DVs diferentes. Usar o mesmo DV viola a integridade do esquema. No padrão Strategy, DV é função pura da conta — sem nenhuma reutilização possível entre registros.\"}},{\"@type\":\"Question\",\"name\":\"Como testo conta bancária de um banco fora da lista (ex: Banco Safra)?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Gere agência e conta com dígitos aleatórios, deixe DV `0` ou fictício, marque com `dvVerified: false`. Em testes, mocke a validação ou pule. Para cobertura real, solicite especificação ao Banco Central. FakeForge inclui os cinco maiores; bancos menores requerem algoritmos específicos.\"}},{\"@type\":\"Question\",\"name\":\"Qual a diferença entre validar DV isolado e validar a conta inteira no backend?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Validar DV é verificação de formato local — confirma que segue o algoritmo. Validar conta inteira requer chamar a API do banco para confirmar existência, saldo, titularidade. São camadas distintas. Use DV para rejeitar dados inválidos antes de contatar o banco.\"}},{\"@type\":\"Question\",\"name\":\"Se o FakeForge gera conta válida, posso depositar nela ou usar em produção?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Não. Dados sintéticos passam na verificação matemática de DV mas são fictícios — não existem no banco. Usar em produção causará erro na transação. Use para testes locais, mocks, fixtures. Dados reais vêm de contas sandbox do banco, não do FakeForge.\"}}]}",
        }}
      />
    </PageShell>
  );
}
