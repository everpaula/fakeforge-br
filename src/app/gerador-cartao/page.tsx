import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import ApiCtaBanner from "@/components/ApiCtaBanner";
import ApiCtaTop from "@/components/ApiCtaTop";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import GeneratorSchema from "@/components/GeneratorSchema";
import RelatedGenerators from "@/components/RelatedGenerators";

export const metadata: Metadata = {
  title: "Gerador de Cartões de Crédito Válidos para Testes (Luhn)",
  description: "Gere cartão de crédito falso, fake ou teste para checkout. Visa, Mastercard, Elo, Hipercard, Amex e débito com algoritmo Luhn válido. Cartão fictício para sandbox de pagamento. Grátis e sem cadastro.",
  keywords: "gerador de cartao, gerador de cartão, gerador de cartões de crédito, gerador de cartoes de credito, gerador de cartoes de credito validos, gerador cartao de credito, gerar cartão de crédito, gerar cartao, cartao de credito numeros validos, numero de cartao de credito valido, gerador de cc, cartão fake, cartão falso, cartão teste, cartão de crédito falso, cartão de crédito teste, cartao de credito ficticio, gerador de número de cartão de débito, cartão de débito fake, cartão válido teste, gerador visa, gerador mastercard, gerador elo, gerador american express, cartão fictício checkout, número cartão luhn",
  openGraph: {
    title: "Gerador de Cartão de Crédito Falso para Testes (Luhn)",
    description: "Cartão fake Visa, Mastercard, Elo, Hipercard, Amex e débito com Luhn válido. Para testar checkouts e sandbox de pagamento. Grátis.",
    type: "website",
  },
  alternates: { canonical: "/gerador-cartao" },
};

export default function GeradorCartao() {
  return (
    <PageShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">Cartão de Crédito</span>
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Gere números de cartão de crédito fictícios com validação Luhn (mod-10) para
          bandeiras Visa, Mastercard e Elo. Inclui nome do titular, data de validade e CVV.
          Ideal para testar checkouts, gateways de pagamento e formulários de cobrança em ambientes de desenvolvimento.
        </p>
      </div>

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
            O FakeForge gera números que passam na validação Luhn para todas as três bandeiras.
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
