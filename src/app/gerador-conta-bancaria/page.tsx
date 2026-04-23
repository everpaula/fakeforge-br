import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import ApiCtaBanner from "@/components/ApiCtaBanner";

export const metadata: Metadata = {
  title: "Gerador de Conta Bancária Válida — Banco, Agência e Dígito",
  description: "Gere contas bancárias fictícias com banco, agência e número com dígito verificador válido. Itaú, BB, Bradesco, Nubank e outros. Para testes de integração de pagamento. Grátis.",
  keywords: "gerador de conta bancária, dados bancários teste, conta bancária válida, banco agência conta, dados bancários desenvolvimento, gerador banco brasil, compe código banco",
  openGraph: {
    title: "Gerador de Conta Bancária Válida — Agência e Dígito Verificador",
    description: "Contas fictícias com banco, agência e dígito verificador válido para testes de pagamento.",
    type: "website",
  },
  alternates: { canonical: "/gerador-conta-bancaria" },
};

export default function GeradorContaBancaria() {
  return (
    <PageShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">Conta Bancária</span>
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Gere dados bancários fictícios brasileiros com códigos de banco reais (Banco do Brasil, Itaú,
          Bradesco, Santander, Nubank, Inter e outros), número de agência e conta. Ideal para testar
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

      {/* Cross-links */}
      <div className="mt-10 pt-8 border-t border-border">
        <h2 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wider">Ferramentas relacionadas</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/gerador-pix" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Gerador de PIX</Link>
          <Link href="/gerador-cartao" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Gerador de Cartão</Link>
          <Link href="/gerador-cpf" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Gerador de CPF</Link>
          <Link href="/gerador-pessoa" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Gerador de Pessoa</Link>
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
    </PageShell>
  );
}
