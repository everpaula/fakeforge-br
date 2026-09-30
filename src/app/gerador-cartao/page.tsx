import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import ApiCtaBanner from "@/components/ApiCtaBanner";
import ApiCtaTop from "@/components/ApiCtaTop";
import AdBanner from "@/components/AdBanner";
import DevOnlyDisclaimer from "@/components/DevOnlyDisclaimer";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import GeneratorSchema from "@/components/GeneratorSchema";
import RelatedGenerators from "@/components/RelatedGenerators";

export const metadata: Metadata = {
  title: "Gerador de Cartão de Crédito para Testes (Luhn Válido)",
  description: "Gere cartão de crédito sintético para testar checkout e sandbox: Visa, Mastercard, Elo, Hipercard e Amex com Luhn válido. Dados fictícios. Grátis.",
  keywords: "gerador de cartao para testes, gerador de cartão de crédito para testes, gerar cartão de crédito sintético, cartão de crédito para testes de software, cartão de crédito para sandbox, cartão fictício para checkout, cartao de credito para QA, cartão para testes de gateway, cartão sintético Luhn, cartão para desenvolvimento, gerador visa para testes, gerador mastercard para testes, gerador elo para testes, gerador american express para testes, número cartão luhn desenvolvimento",
  openGraph: {
    title: "Gerador de Cartão de Crédito para Testes de Software (Luhn)",
    description: "Cartão sintético Visa, Mastercard, Elo, Hipercard, Amex e débito com Luhn válido. Para testar checkouts e sandbox de pagamento em ambiente de desenvolvimento. Grátis.",
    type: "website",
  },
  alternates: { canonical: "/gerador-cartao" },
};

const BANDEIRAS = [
  ["Visa", "4", "16", "3 dígitos"],
  ["Mastercard", "51, 52, 53, 54, 55", "16", "3 dígitos"],
  ["Elo", "636368, 438935, 504175, 451416, 509048", "16", "3 dígitos"],
  ["Hipercard", "606282, 3841", "16", "3 dígitos"],
  ["American Express", "34, 37", "15", "4 dígitos"],
];

const LINK_CLS = "px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors";

const GUIAS_LINGUAGEM = [
  ["/gerador-cartao-python", "Python"],
  ["/gerador-cartao-nodejs", "Node.js"],
  ["/gerador-cartao-curl", "cURL"],
  ["/gerador-cartao-jest", "Jest"],
  ["/gerador-cartao-pytest", "pytest"],
];

const GATEWAYS_TESTE = [
  ["Stripe", "Visa", "4242 4242 4242 4242", "Aprovado"],
  ["Stripe", "Mastercard", "5555 5555 5555 4444", "Aprovado"],
  ["Stripe", "American Express", "3782 822463 10005", "Aprovado"],
  ["Stripe", "Visa", "4000 0000 0000 0002", "Recusado (card_declined)"],
  ["Mercado Pago", "Mastercard", "5031 4332 1540 6351", "Aprovado (CVV 123, titular APRO)"],
  ["Mercado Pago", "Visa", "4235 6477 2802 5682", "Aprovado (CVV 123, titular APRO)"],
  ["Adyen", "Visa", "4111 1111 4555 1142", "Aprovado (CVV 737, validade 03/30)"],
  ["Adyen", "Mastercard", "5555 3412 4444 1115", "Aprovado (CVV 737, validade 03/30)"],
];

const MII_TABELA = [
  ["4", "Visa", "4", "16 (13 e 19 em emissões antigas)", "Crédito, débito e pré-pago no mundo todo"],
  ["5", "Mastercard", "51 a 55 e 2221 a 2720", "16", "Crédito, débito e pré-pago"],
  ["3", "American Express", "34 e 37", "15", "Crédito e cartão corporativo"],
  ["6", "Elo", "Faixas como 636368, 438935, 504175, 451416, 509048", "16", "Crédito e débito, emissores brasileiros"],
  ["6", "Hipercard", "606282 e 3841", "16", "Crédito, emissão Itaú"],
];

export default function GeradorCartao() {
  return (
    <PageShell>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">Cartão de Crédito</span> para testes
        </h1>
        <p className="text-foreground mt-3 text-sm leading-relaxed max-w-2xl">
          O FakeForge é um gerador de cartão de crédito sintético que cria números de Visa, Mastercard, Elo,
          Hipercard e Amex com dígito verificador Luhn (mod-10, ISO/IEC 7812), CVV e validade. Os números não
          têm conta nem limite, servem só para testes de checkout, grátis sem cadastro, com API REST.
        </p>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Gere números sintéticos de cartão de crédito com validação Luhn (mod-10) para
          bandeiras Visa, Mastercard, Elo, Hipercard e Amex. Inclui nome do titular, data de validade e CVV.
          Ideal para testar checkouts, gateways de pagamento e formulários de cobrança em ambientes de desenvolvimento e QA.
        </p>
      </div>

      <DevOnlyDisclaimer dataType="cartão de crédito" className="mb-6" />

      <ApiCtaTop dataType="cartões de crédito" />

      <SingleGenerator
        type="creditCard"
        label="Cartão de Crédito"
        description="Clique em Gerar para criar cartões fictícios (qualquer bandeira)"
      />

      <div className="mt-6 flex flex-wrap gap-2">
        <span className="text-xs text-muted self-center mr-2">Por bandeira:</span>
        <Link href="/gerador-cartao/visa" className="px-3 py-1.5 rounded-lg text-xs bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors">Visa</Link>
        <Link href="/gerador-cartao/mastercard" className="px-3 py-1.5 rounded-lg text-xs bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors">Mastercard</Link>
        <Link href="/gerador-cartao/elo" className="px-3 py-1.5 rounded-lg text-xs bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors">Elo</Link>
        <Link href="/gerador-cartao/hipercard" className="px-3 py-1.5 rounded-lg text-xs bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors">Hipercard</Link>
        <Link href="/gerador-cartao/amex" className="px-3 py-1.5 rounded-lg text-xs bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors">Amex</Link>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="text-xs text-muted self-center mr-2">Guias específicos:</span>
        <Link href="/cartao-credito-fake" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Cartão fake</Link>
        <Link href="/cartao-credito-valido" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Cartão válido (Luhn)</Link>
        <Link href="/gerar-cartao-credito" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Snippets Node/Python/PHP</Link>
        <Link href="/gerar-cartao-com-cpf" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Cartão + CPF correlacionado</Link>
        <Link href="/cartao-credito-teste-stripe" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Fake vs Stripe test</Link>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="text-xs text-muted self-center mr-2">Guias por linguagem:</span>
        {GUIAS_LINGUAGEM.map(([href, label]) => (
          <Link key={href} href={href} className={LINK_CLS}>{`Cartão em ${label}`}</Link>
        ))}
      </div>

      <ApiCtaBanner dataType="cartões de crédito" />

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Geradores", url: "/geradores" },
        { name: "Cartão de Crédito", url: "/gerador-cartao" },
      ]} />

      {/* SEO content */}
      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Como funciona a validação de cartão?</h2>
          <p>
            Números de cartão de crédito são validados pelo algoritmo de Luhn (mod-10), um checksum
            que detecta erros de digitação. O primeiro dígito identifica a bandeira: 4 para Visa,
            5 para Mastercard. Cartões Elo usam prefixos específicos como 636368 e 438935.
            O FakeForge gera números que passam na validação Luhn para as cinco bandeiras.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Bandeiras, prefixos e tamanho do número</h2>
          <p className="mb-3">
            Todos os números terminam em dígito verificador Luhn. O Amex é o único com 15 dígitos, agrupados em 4-6-5, e CVV de 4 dígitos.
          </p>
          <div className="overflow-x-auto rounded-lg bg-card border border-border">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-3 py-2 text-muted">Bandeira</th>
                  <th className="text-left px-3 py-2 text-muted">Prefixos (BIN) gerados</th>
                  <th className="text-left px-3 py-2 text-muted">Dígitos</th>
                  <th className="text-left px-3 py-2 text-muted">CVV</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {BANDEIRAS.map((r) => (
                  <tr key={r[0]}>
                    <td className="px-3 py-2 text-foreground">{r[0]}</td>
                    <td className="px-3 py-2 text-muted-foreground">{r[1]}</td>
                    <td className="px-3 py-2 text-muted-foreground">{r[2]}</td>
                    <td className="px-3 py-2 text-muted-foreground">{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3">
            A Mastercard também emite a faixa 2221 a 2720, que este gerador não usa. Os prefixos 4 e 51 a 55 cobrem a grande maioria dos formulários.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Para que usar cartões fictícios?</h2>
          <p>
            Testar fluxos de checkout em e-commerce, validar integração com gateways como Mercado Pago,
            PagSeguro, Stripe e Cielo. Verificar se a máscara de input aceita diferentes bandeiras.
            Popular bancos de dados de teste com dados de pagamento realistas sem usar cartões reais.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Esses cartões funcionam para compras?</h2>
          <p>
            Não. Os números passam apenas na validação matemática (Luhn). Eles não estão vinculados
            a nenhuma conta bancária, não têm limite de crédito e serão recusados por qualquer gateway
            de pagamento em ambiente de produção. São exclusivamente para testes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Cartão de crédito vs cartão de débito</h2>
          <p className="mb-2">
            O <strong>número</strong> de cartão de crédito e cartão de débito segue exatamente o mesmo
            padrão ISO/IEC 7812: 16 dígitos, prefixo BIN da bandeira (4 para Visa, 51-55 para Mastercard,
            etc.) e dígito verificador Luhn no final. Visualmente e no algoritmo, são idênticos.
          </p>
          <p className="mb-2">
            A diferença está no <strong>tipo de conta vinculada</strong> ao número (corrente/poupança para
            débito, conta de crédito para crédito) e no <strong>fluxo de autorização</strong> (débito exige
            saldo em tempo real, crédito tem limite pré-aprovado). Para teste de formulário, validação Luhn
            e mock de checkout, o gerador de cartão funciona indistintamente como gerador de cartão de
            crédito ou gerador de número de cartão de débito.
          </p>
          <p>
            Se você precisa diferenciar débito vs crédito no fluxo de teste, use o campo de bandeira/tipo
            do seu formulário. Para testes ponta-a-ponta no gateway, use os cartões de teste oficiais do
            PSP (Stripe, Mercado Pago, Pagar.me, Adyen, Cielo) que já vêm marcados como débito ou crédito
            no sandbox.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Números de teste por gateway</h2>
          <p className="mb-3">
            Para testar ponta a ponta no sandbox, use os números que o próprio gateway publica. Um número gerado
            aqui passa no Luhn, mas o gateway só simula aprovação ou recusa para os números da documentação dele.
          </p>
          <pre className="bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto mb-3">
            <code>{`4242 4242 4242 4242 (Stripe, Visa)
5555 5555 5555 4444 (Stripe, Mastercard)
4000 0000 0000 0002 (Stripe, recusa genérica)`}</code>
          </pre>
          <div className="overflow-x-auto rounded-lg bg-card border border-border">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-3 py-2 text-muted">Gateway</th>
                  <th className="text-left px-3 py-2 text-muted">Bandeira</th>
                  <th className="text-left px-3 py-2 text-muted">Número</th>
                  <th className="text-left px-3 py-2 text-muted">Resultado no sandbox</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {GATEWAYS_TESTE.map((r) => (
                  <tr key={r[0] + r[2]}>
                    <td className="px-3 py-2 text-foreground">{r[0]}</td>
                    <td className="px-3 py-2 text-muted-foreground">{r[1]}</td>
                    <td className="px-3 py-2 text-muted-foreground font-mono whitespace-nowrap">{r[2]}</td>
                    <td className="px-3 py-2 text-muted-foreground">{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3">
            A Cielo também publica cartões de sandbox, em que o último dígito define o retorno simulado. Confira
            sempre a documentação atual de cada gateway, porque esses números mudam. Para entender quando usar
            cartão gerado e quando usar cartão oficial, veja{" "}
            <Link href="/cartao-credito-teste-stripe" className="text-primary hover:underline">Fake vs Stripe test</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Bandeira, BIN e uso (ISO/IEC 7812)</h2>
          <p className="mb-3">
            A norma ISO/IEC 7812 define que os primeiros 6 a 8 dígitos formam o IIN (BIN), que identifica o emissor
            e a bandeira. O primeiro dígito é o MII (Major Industry Identifier): 3 para viagem e entretenimento,
            4 e 5 para bancos, 6 para bancos e varejo.
          </p>
          <div className="overflow-x-auto rounded-lg bg-card border border-border">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-3 py-2 text-muted">MII</th>
                  <th className="text-left px-3 py-2 text-muted">Bandeira</th>
                  <th className="text-left px-3 py-2 text-muted">Faixa de BIN</th>
                  <th className="text-left px-3 py-2 text-muted">Dígitos</th>
                  <th className="text-left px-3 py-2 text-muted">Uso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {MII_TABELA.map((r) => (
                  <tr key={r[1]}>
                    <td className="px-3 py-2 text-foreground">{r[0]}</td>
                    <td className="px-3 py-2 text-foreground">{r[1]}</td>
                    <td className="px-3 py-2 text-muted-foreground">{r[2]}</td>
                    <td className="px-3 py-2 text-muted-foreground">{r[3]}</td>
                    <td className="px-3 py-2 text-muted-foreground">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Por que Luhn?</h2>
          <p className="mb-3">
            Hans Peter Luhn (IBM) criou o algoritmo em 1954 para detectar erros de digitação. Ele pega todo erro de
            um único dígito e quase todas as trocas de dígitos vizinhos, sem consultar nenhuma base. Não é
            criptografia nem prova de que a conta existe.
          </p>
          <ol className="list-decimal pl-5 space-y-1 mb-3">
            <li>Separe o último dígito (o verificador). Nos demais, comece pela direita.</li>
            <li>Dobre um dígito sim, um não, a partir do primeiro da direita. Se o dobro passar de 9, subtraia 9.</li>
            <li>Some todos os dígitos resultantes.</li>
            <li>O verificador é (10 - soma mod 10) mod 10. O número é válido quando a soma total, com o verificador, é múltipla de 10.</li>
          </ol>
          <p className="mb-3">
            Exemplo com 424242424242424: os 8 dígitos 4 dobrados viram 8 cada (soma 64), os 7 dígitos 2 somam 14,
            total 78. O verificador é (10 - 8) mod 10 = 2, o que dá 4242 4242 4242 4242.
          </p>
          <pre className="bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto">
            <code>{`def luhn_valido(numero: str) -> bool:
    digitos = [int(c) for c in numero if c.isdigit()]
    soma = 0
    for i, d in enumerate(reversed(digitos)):
        if i % 2 == 1:
            d = d * 2
            if d > 9:
                d -= 9
        soma += d
    return soma % 10 == 0

print(luhn_valido("4242 4242 4242 4242"))  # True
print(luhn_valido("4242 4242 4242 4243"))  # False`}</code>
          </pre>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {[
              { q: "Os cartões gerados funcionam para compras reais?", a: "Não. Os números passam na validação Luhn (mod-10), mas não estão vinculados a nenhuma conta bancária. Serão recusados por qualquer gateway de pagamento real." },
              { q: "Quais bandeiras são geradas?", a: "Visa (prefixo 4), Mastercard (prefixo 5) e Elo (prefixos específicos como 636368). A bandeira é escolhida aleatoriamente a cada geração." },
              { q: "O CVV e a data de validade são reais?", a: "O CVV é um número aleatório de 3 dígitos e a data de validade é uma data futura aleatória. São fictícios, assim como o número do cartão." },
              { q: "Gerar cartão de crédito fictício é crime?", a: "Não. Gerar números que passam na validação matemática para fins de teste é prática comum em desenvolvimento. Crime seria usar esses números para tentar realizar compras fraudulentas." },
              { q: "Posso gerar cartões em massa via API?", a: "Sim. Use GET https://fakeforge.com.br/api/generate?type=creditCard&quantity=100. São 100 chamadas grátis por dia." },
              { q: "O FakeForge armazena os cartões gerados?", a: "Não. Os cartões são gerados em tempo real e descartados imediatamente. Nenhum dado é armazenado ou rastreado." },
            ].map(({ q, a }) => (
              <details key={q} className="group border border-border rounded-lg">
                <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                  <span className="text-sm font-medium text-foreground">{q}</span>
                  <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
                </summary>
                <p className="px-4 pb-3 text-sm text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>

      <AdBanner label="Publicidade" className="max-w-3xl mx-auto" />

      <RelatedGenerators currentSlug="gerador-cartao" />

      {/* Artigos relacionados */}
      <div className="mt-8">
        <h2 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wider">Artigos relacionados</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/blog/dados-teste-pix-checkout" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Dados de teste para PIX</Link>
        </div>
      </div>

      {/* FAQPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Os cartões gerados funcionam para compras reais?", acceptedAnswer: { "@type": "Answer", text: "Não. Os números passam na validação Luhn (mod-10), mas não estão vinculados a nenhuma conta bancária. Serão recusados por qualquer gateway de pagamento real." } },
              { "@type": "Question", name: "Quais bandeiras são geradas?", acceptedAnswer: { "@type": "Answer", text: "Visa (prefixo 4), Mastercard (prefixo 5) e Elo (prefixos específicos como 636368). A bandeira é escolhida aleatoriamente a cada geração." } },
              { "@type": "Question", name: "O CVV e a data de validade são reais?", acceptedAnswer: { "@type": "Answer", text: "O CVV é um número aleatório de 3 dígitos e a data de validade é uma data futura aleatória. São fictícios, assim como o número do cartão." } },
              { "@type": "Question", name: "Gerar cartão de crédito fictício é crime?", acceptedAnswer: { "@type": "Answer", text: "Não. Gerar números que passam na validação matemática para fins de teste é prática comum em desenvolvimento. Crime seria usar esses números para tentar realizar compras fraudulentas." } },
              { "@type": "Question", name: "Posso gerar cartões em massa via API?", acceptedAnswer: { "@type": "Answer", text: "Sim. Use GET https://fakeforge.com.br/api/generate?type=creditCard&quantity=100. São 100 chamadas grátis por dia." } },
              { "@type": "Question", name: "O FakeForge armazena os cartões gerados?", acceptedAnswer: { "@type": "Answer", text: "Não. Os cartões são gerados em tempo real e descartados imediatamente. Nenhum dado é armazenado ou rastreado." } },
            ],
          }),
        }}
      />

      <GeneratorSchema
        name="Gerador de Cartão de Crédito"
        url="https://fakeforge.com.br/gerador-cartao"
        description="Gere número de cartão de crédito fictício e válido para testes (Visa, Mastercard, Elo, Hipercard, Amex). Algoritmo de Luhn com dígito verificador correto. Para uso exclusivo em desenvolvimento."
        features={[
          "5 bandeiras brasileiras: Visa, Mastercard, Elo, Hipercard, Amex",
          "Algoritmo de Luhn com dígito verificador correto",
          "Inclui CVV e data de validade fictícios",
          "Geração em lote até 10.000 por chamada",
          "Export JSON, CSV e SQL",
          "API REST gratuita com 100 chamadas/dia",
        ]}
      />
    </PageShell>
  );
}
