import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import ApiCtaBanner from "@/components/ApiCtaBanner";
import GeneratorSchema from "@/components/GeneratorSchema";
import RelatedGenerators from "@/components/RelatedGenerators";

export const metadata: Metadata = {
  title: "Geradores de Contas Bancárias: Corrente, Poupança, Digital",
  description: "Gere conta bancária e conta corrente fictícia com banco, agência e número com dígito verificador válido. 17 bancos: Bradesco, Itaú, Nubank, BB, Santander, Inter, C6 e mais. Para testes de pagamento e cadastros. Grátis.",
  keywords: "gerador de conta bancária, gerador de conta corrente, geradores de contas, gerador conta bancaria, dados bancários teste, conta bancária válida, conta corrente fake, banco agência conta, dados bancários desenvolvimento, gerador banco brasil, compe código banco",
  openGraph: {
    title: "Gerador de Conta Bancária e Conta Corrente Brasileira",
    description: "Contas correntes fictícias com banco, agência e dígito verificador válido para testes de pagamento e cadastros.",
    type: "website",
    images: ["/api/og?title=Gerador+de+Conta+Banc%C3%A1ria&subtitle=Banco%2C+ag%C3%AAncia+e+d%C3%ADgito+verificador+v%C3%A1lido+para+testes&category=GERADOR"],
  },
  alternates: { canonical: "/gerador-conta-bancaria" },
};

export default function GeradorContaBancaria() {
  return (
    <PageShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">Conta Bancária</span> e Conta Corrente
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Gere conta corrente e dados bancários fictícios brasileiros com códigos de banco reais
          (Banco do Brasil, Itaú, Bradesco, Santander, Nubank, Inter, C6, BTG e mais 9 instituições),
          número de agência e conta com dígito verificador no formato de cada banco. Ideal para testar
          integração com APIs de pagamento, validar formulários de dados bancários e popular ambientes de staging.
        </p>
      </div>

      <SingleGenerator
        type="bankAccount"
        label="Conta Bancária"
        description="Clique em Gerar para criar dados bancários fictícios"
      />

      <ApiCtaBanner dataType="contas bancárias" />

      {/* SEO content */}
      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">O que é gerado?</h2>
          <p>
            Cada conta bancária fictícia inclui: código do banco (COMPE), nome do banco, número da agência
            e número da conta com dígito. Os bancos usados são reais e incluem as principais instituições
            brasileiras como Banco do Brasil (001), Itaú (341), Bradesco (237), Santander (033),
            Nubank (260) e Inter (077).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Para que usar dados bancários fictícios?</h2>
          <p>
            Testar integração com APIs de pagamento (Mercado Pago, PagSeguro, Stripe), validar formulários
            que coletam dados bancários, popular tabelas de funcionários em sistemas de RH com dados de
            conta para depósito, e testar fluxos de saque e transferência em ambiente de desenvolvimento.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Códigos de compensação (COMPE)</h2>
          <p>
            O código COMPE é o identificador único de cada banco no sistema de compensação brasileiro.
            Ele aparece em TED, DOC e PIX. O FakeForge usa códigos COMPE reais para que os dados
            passem em validações que verificam se o banco existe.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Diferença entre conta corrente, poupança e conta digital</h2>
          <p className="mb-2">
            Conta corrente é a modalidade tradicional usada para movimentação diária, com cheque, débito e
            crédito. Conta poupança rende juros mas tem restrições de saque para manter rendimento.
            Conta digital (Nubank, Inter, C6, BTG) é uma variação moderna da conta corrente, totalmente
            online, geralmente sem tarifas.
          </p>
          <p>
            O FakeForge gera os três tipos. O formato do número da conta varia por banco: Itaú usa 5 dígitos
            + 1 verificador, Bradesco usa 6 + 1, Banco do Brasil usa até 8 + 1, Nubank e Inter usam formato
            próprio com mais dígitos. Cada conta gerada respeita o padrão do banco emissor.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">17 bancos brasileiros cobertos</h2>
          <p className="mb-3">
            Banco do Brasil (001), Bradesco (237), Itaú (341), Santander (033), Caixa Econômica (104),
            Nubank (260), Inter (077), C6 Bank (336), BTG Pactual (208), Original (212), Sicredi (748),
            Sicoob (756), Banco Safra (422), Banco Pan (623), Will Bank (646), Neon (655), Mercado Pago (323).
          </p>
          <p>
            Cada banco tem regras específicas de dígito verificador (mod-10 ou mod-11 com pesos variados).
            O FakeForge gera contas que passam na regra de cada instituição, então o número da conta para
            o Itaú segue o algoritmo do Itaú, e o número da conta para o Bradesco segue o algoritmo do
            Bradesco.
          </p>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {[
              { q: "As contas geradas são reais?", a: "Não. Os números de agência e conta são fictícios. Os códigos de banco (COMPE) são reais para passar em validações, mas as contas em si não existem em nenhuma instituição." },
              { q: "Os bancos usados são reais?", a: "Sim. O FakeForge usa códigos COMPE reais de bancos como Banco do Brasil (001), Itaú (341), Bradesco (237), Santander (033), Nubank (260), Inter (077) e outros." },
              { q: "Posso usar para testar transferências?", a: "Apenas em ambiente de sandbox/homologação. As contas não existem, então qualquer tentativa de transferência real falhará. Use para validar formulários e testar lógica de negócio." },
              { q: "Os dados incluem tipo de conta?", a: "Sim. Cada conta gerada inclui o tipo (corrente ou poupança), além de banco, agência e número da conta." },
              { q: "Posso gerar contas em massa via API?", a: "Sim. Use GET https://fakeforge.com.br/api/generate?type=bankAccount&quantity=100. São 100 chamadas grátis por dia." },
              { q: "O FakeForge armazena os dados gerados?", a: "Não. Os dados são gerados em tempo real e descartados imediatamente. Nenhum dado é armazenado ou rastreado." },
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

      <RelatedGenerators currentSlug="gerador-conta-bancaria" />

      {/* Artigos relacionados */}
      <div className="mt-8">
        <h2 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wider">Artigos relacionados</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/blog/gerador-conta-corrente-nodejs-digito-verificador-banco" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Dígito verificador por banco</Link>
          <Link href="/blog/conta-bancaria-fake-bradesco-itau-nubank-testes" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Bradesco, Itaú e Nubank fake</Link>
          <Link href="/blog/gerar-boleto-febraban-linha-digitavel-nodejs-testes" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Boleto FEBRABAN em Node.js</Link>
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
              { "@type": "Question", name: "As contas geradas são reais?", acceptedAnswer: { "@type": "Answer", text: "Não. Os números de agência e conta são fictícios. Os códigos de banco (COMPE) são reais para passar em validações, mas as contas em si não existem em nenhuma instituição." } },
              { "@type": "Question", name: "Os bancos usados são reais?", acceptedAnswer: { "@type": "Answer", text: "Sim. O FakeForge usa códigos COMPE reais de bancos como Banco do Brasil (001), Itaú (341), Bradesco (237), Santander (033), Nubank (260), Inter (077) e outros." } },
              { "@type": "Question", name: "Posso usar para testar transferências?", acceptedAnswer: { "@type": "Answer", text: "Apenas em ambiente de sandbox/homologação. As contas não existem, então qualquer tentativa de transferência real falhará. Use para validar formulários e testar lógica de negócio." } },
              { "@type": "Question", name: "Os dados incluem tipo de conta?", acceptedAnswer: { "@type": "Answer", text: "Sim. Cada conta gerada inclui o tipo (corrente ou poupança), além de banco, agência e número da conta." } },
              { "@type": "Question", name: "Posso gerar contas em massa via API?", acceptedAnswer: { "@type": "Answer", text: "Sim. Use GET https://fakeforge.com.br/api/generate?type=bankAccount&quantity=100. São 100 chamadas grátis por dia." } },
              { "@type": "Question", name: "O FakeForge armazena os dados gerados?", acceptedAnswer: { "@type": "Answer", text: "Não. Os dados são gerados em tempo real e descartados imediatamente. Nenhum dado é armazenado ou rastreado." } },
            ],
          }),
        }}
      />

      <GeneratorSchema
        name="Gerador de Conta Bancária"
        url="https://fakeforge.com.br/gerador-conta-bancaria"
        description="Gere dados de conta bancária fictícia para testes: banco, agência, conta corrente e dígito verificador. Inclui 17 bancos brasileiros (Nubank, Inter, C6, Itaú, Bradesco, entre outros)."
        features={[
          "17 bancos brasileiros incluindo digitais (Nubank, Inter, C6)",
          "Agência e conta corrente no formato de cada banco",
          "Dígito verificador conforme regra do banco emissor",
          "Geração em lote até 10.000 por chamada",
          "Export JSON, CSV e SQL",
          "API REST gratuita com 100 chamadas/dia",
        ]}
      />
    </PageShell>
  );
}
