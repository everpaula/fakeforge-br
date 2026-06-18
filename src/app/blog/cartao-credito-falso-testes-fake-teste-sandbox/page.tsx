import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BlogFeaturedImage from "@/components/BlogFeaturedImage";
import ShareBar from "@/components/ShareBar";
import BlogPostingSchema from "@/components/BlogPostingSchema";

export const metadata: Metadata = {
  title: "Cartão de Crédito Falso para Testes: Fake, Teste ou Sandbox?",
  description: "Entenda a diferença entre número fake com Luhn válido, cartões de teste de gateway e sandbox de pagamento — com exemplos rodáveis em TypeScript.",
  openGraph: {
    title: "Cartão de Crédito Falso para Testes: Fake, Teste ou Sandbox?",
    description: "Entenda a diferença entre número fake com Luhn válido, cartões de teste de gateway e sandbox de pagamento — com exemplos rodáveis em TypeScript.",
    type: "article",
    images: ["/api/og?title=Cart%C3%A3o%20de%20Cr%C3%A9dito%20Falso%20para%20Testes%3A%20Fake%2C%20Teste%20ou%20Sandbox%3F&subtitle=Entenda%20a%20diferen%C3%A7a%20entre%20n%C3%BAmero%20fake%20com%20Luhn%20v%C3%A1lido%2C%20cart%C3%B5es%20de%20teste%20de%20gateway%20e%20sandbox%20de%20pagamento%20%E2%80%94%20com%20exemplos%20rod%C3%A1veis%20em%20TypeScr&category=CONCEITOS"],
  },
  alternates: { canonical: "/blog/cartao-credito-falso-testes-fake-teste-sandbox" },
};

export default function Post() {
  return (
    <PageShell>
      <article className="max-w-2xl">
        <Link href="/blog" className="text-xs text-primary hover:underline mb-4 inline-block">
          ← Voltar ao blog
        </Link>
        <BlogFeaturedImage category="Conceitos" title="Cartão de Crédito Falso para Testes: Fake, Teste ou Sandbox?" className="mb-6" />
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
            Cartão de Crédito Falso para Testes: Fake, Teste ou Sandbox?
          </h1>
          <div className="flex items-center gap-3 text-xs text-muted mt-3">
            <time>12 de junho de 2026</time>
            <span>·</span>
            <span>9 min de leitura</span>
          </div>
        </div>

        <div className="prose-custom space-y-2 text-sm text-muted-foreground leading-relaxed">
          <p className="mb-4">"Número de cartão falso" aparece em tickets de QA, README de projetos e issues do GitHub toda semana. O problema: "falso" pode significar três coisas diferentes dependendo do contexto — um número gerado matematicamente, um cartão fornecido pelo gateway para ambiente sandbox, ou o próprio ambiente sandbox. Usar o tipo errado no momento errado gera testes que passam localmente e quebram em homologação, ou chamadas desnecessárias à API de pagamento durante testes de formulário.</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Número de cartão "falso" não é fraude — é estrutura válida sem vínculo financeiro</h2>
          <p className="mb-4">Todo número de cartão segue duas regras estruturais: prefixo de BIN (Bank Identification Number, os primeiros 6 a 8 dígitos) e dígito verificador calculado pelo algoritmo de Luhn. Um número fake respeita essas duas regras sem pertencer a nenhuma conta bancária real.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">O que faz um número de cartão ser estruturalmente válido (BIN + Luhn)</h3>
          <p className="mb-4">O BIN identifica a instituição emissora e a bandeira. Visa começa com 4, Mastercard com 51–55 ou 2221–2720, Elo cobre faixas específicas como 636368, 438935 e 504175. O Luhn é o dígito verificador que garante integridade de digitação, não autenticidade financeira.</p>
          <p className="mb-4"><code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">4111 1111 1111 1111</code> é estruturalmente válido: começa com 4 (Visa) e passa no Luhn. Não existe em nenhum banco. Qualquer formulário que valida apenas o Luhn vai aceitá-lo.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Por que dados fake passam na validação de formulário mas falham no gateway</h3>
          <p className="mb-4">A validação de formulário verifica Luhn e comprimento. O gateway vai além: consulta o BIN em tabelas de emissores, envia o PAN para autorização junto à bandeira e aguarda resposta do banco emissor. Um número fake não tem banco emissor — a autorização é recusada imediatamente.</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Algoritmo de Luhn: a única regra que número fake precisa respeitar</h2>
          <p className="mb-4">O Luhn (ISO/IEC 7812-1) foi criado por Hans Peter Luhn na IBM em 1954. É um checksum simples para detectar erros de digitação, não criptografia nem autenticação.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Como o dígito verificador é calculado (passo a passo com código)</h3>
          <p className="mb-4">Partindo do último dígito para o primeiro, dobre cada segundo dígito. Se o resultado for maior que 9, subtraia 9. Some todos os dígitos. Se a soma for divisível por 10, o número é válido.</p>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-ts">{"function isValidLuhn(pan: string): boolean {\n  const digits = pan.replace(/\\D/g, '').split('').map(Number);\n  let sum = 0;\n  let double = false;\n\n  for (let i = digits.length - 1; i >= 0; i--) {\n    let d = digits[i];\n    if (double) {\n      d *= 2;\n      if (d > 9) d -= 9;\n    }\n    sum += d;\n    double = !double;\n  }\n\n  return sum % 10 === 0;\n}\n\nconsole.log(isValidLuhn('4111111111111111')); // true\nconsole.log(isValidLuhn('4111111111111112')); // false"}</code></pre>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Por que Visa, Mastercard, Elo e Hipercard usam o mesmo algoritmo</h3>
          <p className="mb-4">O Luhn é mandatório para todos os PANs (Primary Account Numbers) segundo ISO/IEC 7812. Nenhuma bandeira pode dispensá-lo. A lógica de validação é idêntica independente da bandeira — o que muda é apenas prefixo e comprimento.</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Três categorias distintas de dados de cartão em ambiente de desenvolvimento</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Fake — número matematicamente válido, sem BIN real registrado</h3>
          <p className="mb-4">Gerado localmente ou via ferramenta como o <Link href="/gerador-cartao" className="text-primary hover:underline">gerador de cartão</Link> do FakeForge BR. Passa no Luhn, tem prefixo de bandeira correto, mas não existe no sistema de autorização de nenhum gateway.</p>
          <p className="mb-4"><strong className="text-foreground">Uso adequado:</strong> testar máscara de input, detecção de bandeira, validação client-side, fixtures de banco de dados de teste.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Teste — número fornecido pelo gateway, com BIN real apontando para ambiente sandbox</h3>
          <p className="mb-4">Cada gateway publica uma lista de números de cartão de teste. Esses números têm BINs registrados internamente pela própria gateway, mas apontam para um ambiente de autorização que nunca debita conta real.</p>
          <p className="mb-4"><strong className="text-foreground">Uso adequado:</strong> testar fluxo completo de pagamento, webhooks, estornos, falhas de autorização por cenário.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Sandbox — ambiente completo da gateway com chaves separadas de produção</h3>
          <p className="mb-4">O sandbox é a infraestrutura, não o número do cartão. Você usa chaves de API separadas (<code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">sk_test_...</code> no Stripe, credenciais de homologação no Cielo) que roteiam todas as chamadas para servidores de teste da gateway.</p>
          <p className="mb-4"><strong className="text-foreground">Uso adequado:</strong> integração de ponta a ponta, CI/CD, testes de regressão de pagamento.</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Quando usar número fake e quando usar o cartão de teste do gateway</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Validação de formulário, máscaras e detecção de bandeira (fake suficiente)</h3>
          <p className="mb-4">Se o teste cobre apenas o front-end — formatação <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">4111 1111 1111 1111</code>, ícone da bandeira aparecendo, campo de CVV com 3 ou 4 dígitos — número fake é suficiente. Chamar a API da gateway para isso é overhead desnecessário e consome cota.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Fluxo de autorização, webhook, estorno e 3DS (exige cartão de teste do gateway)</h3>
          <p className="mb-4">Para testar o que acontece após o submit — resposta de autorização, webhook <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">payment.authorized</code>, tratamento de recusa por saldo insuficiente, fluxo de 3DS 2.0 — você precisa dos cartões de teste publicados pelo gateway. Número fake retorna erro imediato de BIN desconhecido.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Testes de carga contra o próprio back-end (fake + mock do client gateway)</h3>
          <p className="mb-4">Testes de carga no seu back-end de pagamento não devem chamar o gateway de verdade. Use número fake junto com um mock do client HTTP do gateway. O objetivo é medir throughput do seu código, não da infraestrutura do gateway.</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Cartões de teste das principais gateways brasileiras</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Mercado Pago — números, CVV e validade documentados</h3>
          <div className="my-6 rounded-xl bg-card border border-border overflow-x-auto"><table className="w-full text-sm"><thead className="bg-card-hover"><tr><th className="text-left px-3 py-2 text-muted-foreground font-medium">Cenário</th><th className="text-left px-3 py-2 text-muted-foreground font-medium">Número</th><th className="text-left px-3 py-2 text-muted-foreground font-medium">CVV</th><th className="text-left px-3 py-2 text-muted-foreground font-medium">Validade</th></tr></thead><tbody><tr className="border-b border-border"><td className="px-3 py-2">Aprovado</td><td className="px-3 py-2">5031 4332 1540 6351</td><td className="px-3 py-2">123</td><td className="px-3 py-2">11/25</td></tr><tr className="border-b border-border"><td className="px-3 py-2">Recusado (saldo)</td><td className="px-3 py-2">5031 4332 1540 6369</td><td className="px-3 py-2">123</td><td className="px-3 py-2">11/25</td></tr><tr className="border-b border-border"><td className="px-3 py-2">Pendente</td><td className="px-3 py-2">5031 4332 1540 6377</td><td className="px-3 py-2">123</td><td className="px-3 py-2">11/25</td></tr></tbody></table></div>
          <p className="mb-4">Fonte: documentação do Mercado Pago (2024). Para o campo de titular, use qualquer nome com CPF válido — o <Link href="/gerador-cpf" className="text-primary hover:underline">gerador de CPF</Link> do FakeForge BR gera um instantaneamente.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">PagSeguro / PagBank — conjunto de cartões por cenário</h3>
          <p className="mb-4">O PagBank publica números Visa e Mastercard para cada cenário. Aprovado: <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">4111 1111 1111 1111</code> com CVV <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">123</code> e validade <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">12/26</code>. Para recusa, o conjunto varia por tipo de erro — consulte a documentação oficial do PagBank Sandbox antes de fixar valores em CI.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Stripe no Brasil — <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">pm_card_visa</code> e equivalentes para rejeição e 3DS</h3>
          <p className="mb-4">O Stripe usa Payment Method IDs em testes, não PANs. Você passa <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">pm_card_visa</code> (aprovação), <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">pm_card_visa_chargeDeclined</code> (recusa) ou <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">pm_card_threeDSecure2Required</code> (3DS obrigatório). Isso evita lidar com PAN em testes de integração Stripe.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Cielo e Rede — ambiente de homologação com credenciais separadas</h3>
          <p className="mb-4">Cielo tem ambiente em <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">apisandbox.cieloecommerce.cielo.com.br</code> com credenciais distintas das de produção. Número de cartão Visa publicado pela Cielo para testes: <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">4000000000000010</code>. Rede segue padrão similar com endpoint próprio.</p>
          <blockquote className="border-l-4 border-accent pl-4 my-4 text-muted-foreground italic"><strong className="text-foreground">AVISO:</strong> Os números de cartão de teste de cada gateway mudam com atualizações de documentação. Sempre consulte a fonte oficial antes de fixar um número em fixture de CI.</blockquote>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">O que a gateway verifica além do número</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">BIN lookup — emissor, país, tipo (crédito/débito/pré-pago)</h3>
          <p className="mb-4">Ao receber um PAN, o gateway consulta tabelas de BIN para identificar banco emissor, país de emissão e tipo do produto. Um número fake com BIN não registrado retorna erro antes mesmo da tentativa de autorização.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">CVV e data de validade — não são validados pelo Luhn</h3>
          <p className="mb-4">O CVV é calculado com chave criptográfica do emissor — o Luhn não cobre isso. A data de validade é verificada diretamente no emissor. Para testes que chegam ao gateway, use os valores de CVV e validade publicados na documentação oficial.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Tokenização e 3DS 2.0 — exigem chamada real à rede do cartão</h3>
          <p className="mb-4">Tokenização e 3DS 2.0 exigem comunicação com a rede da bandeira (Visa, Mastercard). Isso só funciona com cartões de teste em ambiente sandbox real do gateway — número fake não serve aqui.</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">LGPD e dados de cartão em testes</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">PCI-DSS scope: por que dados reais de cartão nunca devem entrar em ambiente de dev</h3>
          <p className="mb-4">O PCI-DSS v4.0, requisito 6.3.2, proíbe explicitamente o uso de PANs reais em ambientes de desenvolvimento e teste. Qualquer sistema que armazena, processa ou transmite PANs reais entra no escopo PCI, com obrigações de auditoria, segmentação de rede e relatórios anuais.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">LGPD Art. 7º, IX — tratamento legítimo de dados sintéticos sem titular identificável</h3>
          <p className="mb-4">Dados sintéticos gerados sem relação com pessoa real não são dados pessoais segundo a <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">LGPD Art. 5º, I</a>. O Art. 7º, IX permite o tratamento com base em legítimo interesse do controlador, mas dados que não identificam titular saem do escopo da lei. Número fake gerado pelo FakeForge BR não tem titular — não há tratamento de dados pessoais.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">O que configura infração: capturar PAN real em log, banco de dados de dev ou fixture de teste</h3>
          <p className="mb-4">Capturar um PAN real em log de aplicação, inserir em banco de dados de desenvolvimento ou incluir em fixture de teste é infração ao PCI-DSS e potencialmente à LGPD se o cartão pertence a pessoa identificável. A ANPD pode aplicar multa de até 2% do faturamento (LGPD Art. 52).</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Detectando a bandeira a partir do BIN em TypeScript</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Prefixos de BIN para Visa, Mastercard, Elo, Hipercard e Amex</h3>
          <div className="my-6 rounded-xl bg-card border border-border overflow-x-auto"><table className="w-full text-sm"><thead className="bg-card-hover"><tr><th className="text-left px-3 py-2 text-muted-foreground font-medium">Bandeira</th><th className="text-left px-3 py-2 text-muted-foreground font-medium">Prefixos</th><th className="text-left px-3 py-2 text-muted-foreground font-medium">Comprimento</th></tr></thead><tbody><tr className="border-b border-border"><td className="px-3 py-2">Visa</td><td className="px-3 py-2">4</td><td className="px-3 py-2">13 ou 16 dígitos</td></tr><tr className="border-b border-border"><td className="px-3 py-2">Mastercard</td><td className="px-3 py-2">51–55, 2221–2720</td><td className="px-3 py-2">16 dígitos</td></tr><tr className="border-b border-border"><td className="px-3 py-2">Elo</td><td className="px-3 py-2">636368, 438935, 504175, 451416, 636297, 5067, 4576, 4011</td><td className="px-3 py-2">16 dígitos</td></tr><tr className="border-b border-border"><td className="px-3 py-2">Hipercard</td><td className="px-3 py-2">606282, 3841</td><td className="px-3 py-2">13–19 dígitos</td></tr><tr className="border-b border-border"><td className="px-3 py-2">Amex</td><td className="px-3 py-2">34, 37</td><td className="px-3 py-2">15 dígitos</td></tr></tbody></table></div>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Implementação de <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">detectBrand(pan: string): Brand</code> sem dependência externa</h3>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-ts">{"type Brand = 'visa' | 'mastercard' | 'elo' | 'hipercard' | 'amex' | 'unknown';\n\nfunction detectBrand(pan: string): Brand {\n  const p = pan.replace(/\\D/g, '');\n\n  if (/^4/.test(p)) return 'visa';\n\n  if (/^(5[1-5]|2(2[2-9][1-9]|[3-6]\\d{2}|7[01]\\d|720))/.test(p)) return 'mastercard';\n\n  const eloPrefixes = ['636368', '438935', '504175', '451416', '636297', '5067', '4576', '4011'];\n  if (eloPrefixes.some(prefix => p.startsWith(prefix))) return 'elo';\n\n  if (/^(606282|3841)/.test(p)) return 'hipercard';\n\n  if (/^3[47]/.test(p)) return 'amex';\n\n  return 'unknown';\n}"}</code></pre>
          <blockquote className="border-l-4 border-accent pl-4 my-4 text-muted-foreground italic"><strong className="text-foreground">DICA:</strong> A detecção de bandeira deve ocorrer enquanto o usuário digita, não apenas no submit. Isso permite exibir o ícone correto e ajustar o comprimento esperado do CVV (3 dígitos para a maioria, 4 para Amex) antes da validação final.</blockquote>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Integrando cartão fake em testes automatizados com Jest e Playwright</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Factory de cartão fake tipada — <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">generateCard(brand: Brand): CardFixture</code></h3>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-ts">{"type Brand = 'visa' | 'mastercard' | 'elo' | 'hipercard' | 'amex';\n\ninterface CardFixture {\n  pan: string;\n  cvv: string;\n  expiry: string;\n  holderName: string;\n  brand: Brand;\n}\n\nconst FAKE_PANS: Record<Brand, string> = {\n  visa:       '4111111111111111',\n  mastercard: '5500005555555559',\n  elo:        '6362970000457013',\n  hipercard:  '6062826786276634',\n  amex:       '378282246310005',\n};\n\nfunction generateCard(brand: Brand): CardFixture {\n  return {\n    pan:        FAKE_PANS[brand],\n    cvv:        brand === 'amex' ? '1234' : '123',\n    expiry:     '12/28',\n    holderName: 'JOAO SILVA',\n    brand,\n  };\n}"}</code></pre>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Exemplo de teste Jest cobrindo Luhn válido e CVV com comprimento esperado</h3>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-ts">{"import { isValidLuhn } from './card-utils';\nimport { generateCard } from './card-factory';\n\ndescribe('card fixtures', () => {\n  const brands = ['visa', 'mastercard', 'elo', 'hipercard', 'amex'] as const;\n\n  brands.forEach(brand => {\n    it(`${brand}: PAN passa no Luhn`, () => {\n      const card = generateCard(brand);\n      expect(isValidLuhn(card.pan)).toBe(true);\n    });\n\n    it(`${brand}: CVV tem comprimento correto`, () => {\n      const card = generateCard(brand);\n      const expectedLength = brand === 'amex' ? 4 : 3;\n      expect(card.cvv).toHaveLength(expectedLength);\n    });\n  });\n});"}</code></pre>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Exemplo Playwright: preencher formulário de checkout com cartão fake e validar máscara</h3>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-ts">{"import { test, expect } from '@playwright/test';\nimport { generateCard } from '../fixtures/card-factory';\n\ntest('checkout aceita Visa fake e formata PAN com espaços', async ({ page }) => {\n  const card = generateCard('visa');\n  await page.goto('/checkout');\n\n  await page.fill('[data-testid=\"pan\"]', card.pan);\n  await page.fill('[data-testid=\"cvv\"]', card.cvv);\n  await page.fill('[data-testid=\"expiry\"]', card.expiry);\n  await page.fill('[data-testid=\"holder\"]', card.holderName);\n\n  const displayedPan = await page.inputValue('[data-testid=\"pan\"]');\n  expect(displayedPan).toBe('4111 1111 1111 1111');\n});"}</code></pre>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Separando fixtures de cartão fake dos cartões de teste do gateway no mesmo repositório</h3>
          <p className="mb-4">Organize em diretórios distintos para deixar o escopo de cada fixture evidente:</p>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-">{"tests/\n  fixtures/\n    fake-cards.ts        # PANs sintéticos — UI e testes unitários\n    gateway-cards.ts     # Cartões de teste do Stripe/Mercado Pago — integração\n  unit/\n    card-validation.test.ts\n  integration/\n    payment-flow.test.ts\n  e2e/\n    checkout.test.ts"}</code></pre>
          <p className="mb-4">A separação evita que um teste de unidade acidentalmente chame a API do gateway, e torna óbvio qual conjunto de dados usar por escopo.</p>
          <p className="mb-4">Para gerar cartões via API do FakeForge BR:</p>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-bash">{"# 5 cartões Visa em JSON\ncurl \"https://fakeforge.com.br/api/generate?type=cartao-visa&quantity=5&format=json\"\n\n# 10 cartões Mastercard em CSV\ncurl \"https://fakeforge.com.br/api/generate?type=cartao-mastercard&quantity=10&format=csv\"\n\n# Cartão Elo com export SQL\ncurl \"https://fakeforge.com.br/api/generate?type=cartao-elo&quantity=1&format=sql\""}</code></pre>
          <p className="mb-4">Veja os parâmetros completos na <Link href="/docs" className="text-primary hover:underline">referência da API</Link>. Para volume acima de 100 chamadas por dia, consulte os <Link href="/pricing" className="text-primary hover:underline">planos disponíveis</Link>.</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Resumo</h2>
          <ul className="list-disc list-inside space-y-2 pl-2 my-4"><li>Número fake passa no Luhn e tem prefixo de bandeira correto, mas não tem emissor — use para testes de formulário, máscaras e fixtures de banco de dados de teste.</li><li>Cartão de teste do gateway tem BIN registrado no sandbox — use para fluxo de autorização, webhooks, estornos e 3DS 2.0.</li><li>Sandbox é o ambiente (chaves de API separadas), não o número do cartão — os dois conceitos são independentes.</li><li>PCI-DSS v4.0 req. 6.3.2 proíbe PANs reais em dev — dados sintéticos eliminam esse risco sem reduzir cobertura de testes.</li><li>Implemente <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">isValidLuhn</code> e <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">detectBrand</code> localmente para testes de UI sem dependência externa de biblioteca de cartão.</li><li>Gere <Link href="/gerador-cartao/visa" className="text-primary hover:underline">números Visa</Link>, <Link href="/gerador-cartao/mastercard" className="text-primary hover:underline">Mastercard</Link>, <Link href="/gerador-cartao/elo" className="text-primary hover:underline">Elo</Link> e <Link href="/gerador-cartao/hipercard" className="text-primary hover:underline">Hipercard</Link> com Luhn válido via <Link href="/gerador-cartao" className="text-primary hover:underline">/gerador-cartao</Link> ou via API REST.</li></ul>
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">Perguntas frequentes</h2>
          <div className="space-y-3">
            <details key="Se um teste passa com número f" className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">Se um teste passa com número fake localmente mas falha em staging com 'BIN não registrado', onde errei?</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">Você misturou escopos de teste. Testes unitários devem usar número fake (Luhn passa localmente), testes de integração usam cartão de teste da gateway (BIN registrado no sandbox). Seu CI está testando a gateway de verdade sem perceber. Separe fixtures em diretórios distintos: fake-cards.ts para client-side, gateway-cards.ts para e2e.</p>
            </details>
            <details key="Como gerar múltiplos cartões f" className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">Como gerar múltiplos cartões fake sem gerenciar factory complexa?</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">Use /api/generate?quantity=5 do FakeForge BR ou execute factory.ts tipada localmente. Para testes, reutilize 5 PANs fixos em fixtures — reduz churn e aumenta determinismo dos testes. Randomizar em testes de formulário é overhead desnecessário. Guarde os 5 em JSON e importe.</p>
            </details>
            <details key="Cartão de teste publicado reto" className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">Cartão de teste publicado retorna erro mesmo que PAN, CVV, validade estejam corretos. Checkar quê?</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">Validar: credenciais sandbox (chave test vs live?), versão da API, endpoint correto (apisandbox vs api?). Documentação de teste das gateways muda frequentemente — compare seu número versus documento atual na console da gateway. Capture o transaction ID e envie para support com contexto.</p>
            </details>
            <details key="Posso usar mesma fixture de ca" className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">Posso usar mesma fixture de cartão fake em testes unitários, integração e Playwright?</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">Sim, mas com cuidado de escopo. Número fake é válido em testes client-side (formulário, máscara, Luhn). Para integração contra sua API mockada, use fake. Se integração hit sandbox real da gateway, swap para cartão de teste publicado. Organize em: fake-cards.ts para UI, gateway-cards.ts para integração.</p>
            </details>
            <details key="Qual probabilidade de número f" className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">Qual probabilidade de número fake ser real e debitar alguém?</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">Praticamente impossível. Existem ~280M números reais emitidos versus ~10B combinações fake com Luhn válido. A gateway verifica BIN em tabela de emissores registrados; BIN fake é rejeitado antes da autorização. Riscos teóricos não se materializam operacionalmente. Sua fixture é segura.</p>
            </details>
          </div>
        </section>
        <ShareBar title={"Cartão de Crédito Falso para Testes: Fake, Teste ou Sandbox?"} path="/blog/cartao-credito-falso-testes-fake-teste-sandbox" />
        <BlogPostingSchema
          title={"Cartão de Crédito Falso para Testes: Fake, Teste ou Sandbox?"}
          slug="cartao-credito-falso-testes-fake-teste-sandbox"
          description={"Entenda a diferença entre número fake com Luhn válido, cartões de teste de gateway e sandbox de pagamento — com exemplos rodáveis em TypeScript."}
          datePublished="2026-05-26"
          image="https://fakeforge.com.br/api/og?title=Cart%C3%A3o%20de%20Cr%C3%A9dito%20Falso%20para%20Testes%3A%20Fake%2C%20Teste%20ou%20Sandbox%3F&subtitle=Entenda%20a%20diferen%C3%A7a%20entre%20n%C3%BAmero%20fake%20com%20Luhn%20v%C3%A1lido%2C%20cart%C3%B5es%20de%20teste%20de%20gateway%20e%20sandbox%20de%20pagamento%20%E2%80%94%20com%20exemplos%20rod%C3%A1veis%20em%20TypeScr&category=CONCEITOS"
        />
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: "{\"@context\":\"https://schema.org\",\"@type\":\"FAQPage\",\"mainEntity\":[{\"@type\":\"Question\",\"name\":\"Se um teste passa com número fake localmente mas falha em staging com 'BIN não registrado', onde errei?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Você misturou escopos de teste. Testes unitários devem usar número fake (Luhn passa localmente), testes de integração usam cartão de teste da gateway (BIN registrado no sandbox). Seu CI está testando a gateway de verdade sem perceber. Separe fixtures em diretórios distintos: fake-cards.ts para client-side, gateway-cards.ts para e2e.\"}},{\"@type\":\"Question\",\"name\":\"Como gerar múltiplos cartões fake sem gerenciar factory complexa?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Use /api/generate?quantity=5 do FakeForge BR ou execute factory.ts tipada localmente. Para testes, reutilize 5 PANs fixos em fixtures — reduz churn e aumenta determinismo dos testes. Randomizar em testes de formulário é overhead desnecessário. Guarde os 5 em JSON e importe.\"}},{\"@type\":\"Question\",\"name\":\"Cartão de teste publicado retorna erro mesmo que PAN, CVV, validade estejam corretos. Checkar quê?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Validar: credenciais sandbox (chave test vs live?), versão da API, endpoint correto (apisandbox vs api?). Documentação de teste das gateways muda frequentemente — compare seu número versus documento atual na console da gateway. Capture o transaction ID e envie para support com contexto.\"}},{\"@type\":\"Question\",\"name\":\"Posso usar mesma fixture de cartão fake em testes unitários, integração e Playwright?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Sim, mas com cuidado de escopo. Número fake é válido em testes client-side (formulário, máscara, Luhn). Para integração contra sua API mockada, use fake. Se integração hit sandbox real da gateway, swap para cartão de teste publicado. Organize em: fake-cards.ts para UI, gateway-cards.ts para integração.\"}},{\"@type\":\"Question\",\"name\":\"Qual probabilidade de número fake ser real e debitar alguém?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Praticamente impossível. Existem ~280M números reais emitidos versus ~10B combinações fake com Luhn válido. A gateway verifica BIN em tabela de emissores registrados; BIN fake é rejeitado antes da autorização. Riscos teóricos não se materializam operacionalmente. Sua fixture é segura.\"}}]}",
        }}
      />
    </PageShell>
  );
}
