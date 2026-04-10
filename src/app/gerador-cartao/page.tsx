import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import ApiCtaBanner from "@/components/ApiCtaBanner";

export const metadata: Metadata = {
  title: "Gerador de Cartão de Crédito - Números Válidos para Testes | FakeForge BR",
  description: "Gere números de cartão de crédito fictícios (Visa, Mastercard, Elo) com validação Luhn. Ideal para testes de checkout e integração com gateways de pagamento. Grátis.",
  keywords: "gerador de cartão de crédito, cartão de crédito para testes, número de cartão válido, cartão fictício, gerador visa mastercard, cartão teste checkout",
  openGraph: {
    title: "Gerador de Cartão de Crédito - FakeForge BR",
    description: "Gere cartões fictícios Visa, Mastercard e Elo com validação Luhn para testes de checkout. Grátis.",
    type: "website",
  },
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

      <SingleGenerator
        type="creditCard"
        label="Cartão de Crédito"
        description="Clique em Gerar para criar cartões fictícios"
      />

      <ApiCtaBanner dataType="cartões de crédito" />

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

      {/* Cross-links */}
      <div className="mt-10 pt-8 border-t border-border">
        <h2 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wider">Ferramentas relacionadas</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/gerador-pix" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Gerador de PIX</Link>
          <Link href="/gerador-cpf" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Gerador de CPF</Link>
          <Link href="/gerador-cnpj" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Gerador de CNPJ</Link>
          <Link href="/gerador-telefone" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Gerador de Telefone</Link>
          <Link href="/docs" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">API REST</Link>
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
    </PageShell>
  );
}
