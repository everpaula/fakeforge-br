import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import ApiCtaBanner from "@/components/ApiCtaBanner";
import ApiCtaTop from "@/components/ApiCtaTop";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import GeneratorSchema from "@/components/GeneratorSchema";

export const metadata: Metadata = {
  title: "Gerador de Chave PIX para Testes — CPF, CNPJ, Email, Celular",
  description: "Gere chaves PIX válidas nos 4 formatos aceitos pelo Banco Central: CPF, CNPJ, email, celular e chave aleatória (EVP). Para testes de integração e homologação. Grátis.",
  keywords: "gerador de pix, chave pix para testes, pix fictício, gerador chave pix, pix teste, chave pix aleatória, evp pix, pix homologação",
  openGraph: {
    title: "Gerador de Chave PIX — CPF, CNPJ, Email, Celular",
    description: "Chaves PIX válidas nos 4 formatos do BACEN para testes de integração. Grátis.",
    type: "website",
  },
  alternates: { canonical: "/gerador-pix" },
};

export default function GeradorPIX() {
  return (
    <PageShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">Chave PIX</span>
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Gere chaves PIX fictícias nos quatro formatos aceitos pelo Banco Central:
          CPF, email, telefone e chave aleatória (EVP). Ideal para testar integração com APIs
          de pagamento, simular transferências em staging e popular bancos de dados de desenvolvimento.
        </p>
      </div>

      <ApiCtaTop dataType="chaves PIX" />

      <SingleGenerator
        type="pixKey"
        label="Chave PIX"
        description="Clique em Gerar para criar chaves PIX fictícias"
      />

      <ApiCtaBanner dataType="chaves PIX" />

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Geradores", url: "/geradores" },
        { name: "Chave PIX", url: "/gerador-pix" },
      ]} />

      {/* SEO content */}
      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">O que é o PIX?</h2>
          <p>
            O PIX é o sistema de pagamentos instantâneos do Banco Central do Brasil, lançado em novembro de 2020.
            Permite transferências 24h por dia, 7 dias por semana, em até 10 segundos. As chaves PIX são
            identificadores únicos que substituem dados bancários tradicionais (agência, conta, banco).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Tipos de chave PIX</h2>
          <p>
            Existem quatro tipos de chave PIX: CPF/CNPJ (documento), email, telefone (+55...) e chave aleatória
            (EVP — Endereço Virtual de Pagamento, um UUID v4). O FakeForge gera todos os quatro tipos
            aleatoriamente, cada um no formato correto exigido pelo BACEN.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Para que usar chaves PIX fictícias?</h2>
          <p>
            Testar integração com PSPs (provedores de serviço de pagamento) como Mercado Pago, PagSeguro,
            Gerencianet e outros. Simular fluxos de pagamento em ambiente de desenvolvimento sem usar dados
            reais. Popular bancos de dados de teste com chaves nos formatos corretos para validação.
          </p>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {[
              { q: "As chaves PIX geradas são reais?", a: "Não. São chaves fictícias que seguem o formato correto do BACEN, mas não estão registradas no DICT (Diretório de Identificadores de Contas Transacionais). Não recebem transferências." },
              { q: "Quais tipos de chave o gerador cria?", a: "Os quatro tipos: CPF (11 dígitos válidos), email (usuario@dominio.com), telefone (+5511999999999) e chave aleatória EVP (UUID v4). O tipo é escolhido aleatoriamente a cada geração." },
              { q: "Posso usar para testar integração com gateway de pagamento?", a: "Sim. As chaves seguem os formatos exigidos pelos PSPs, então passam na validação de formato. O pagamento em si não será processado, já que as chaves não existem no DICT." },
              { q: "A chave aleatória (EVP) é um UUID válido?", a: "Sim. A chave EVP é gerada como UUID v4, exatamente como o BACEN especifica. O formato é xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx." },
              { q: "Posso gerar chaves PIX em massa via API?", a: "Sim. Use GET https://fakeforge.com.br/api/generate?type=pixKey&quantity=100. São 100 chamadas grátis por dia." },
              { q: "O FakeForge armazena as chaves geradas?", a: "Não. As chaves são geradas em tempo real e descartadas imediatamente. Nenhum dado é armazenado ou rastreado." },
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
          <Link href="/gerador-cartao" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Gerador de Cartão</Link>
          <Link href="/gerador-cpf" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Gerador de CPF</Link>
          <Link href="/gerador-cnpj" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Gerador de CNPJ</Link>
          <Link href="/gerador-telefone" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Gerador de Telefone</Link>
          <Link href="/docs" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">API REST</Link>
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
              { "@type": "Question", name: "As chaves PIX geradas são reais?", acceptedAnswer: { "@type": "Answer", text: "Não. São chaves fictícias que seguem o formato correto do BACEN, mas não estão registradas no DICT (Diretório de Identificadores de Contas Transacionais). Não recebem transferências." } },
              { "@type": "Question", name: "Quais tipos de chave o gerador cria?", acceptedAnswer: { "@type": "Answer", text: "Os quatro tipos: CPF (11 dígitos válidos), email (usuario@dominio.com), telefone (+5511999999999) e chave aleatória EVP (UUID v4). O tipo é escolhido aleatoriamente a cada geração." } },
              { "@type": "Question", name: "Posso usar para testar integração com gateway de pagamento?", acceptedAnswer: { "@type": "Answer", text: "Sim. As chaves seguem os formatos exigidos pelos PSPs, então passam na validação de formato. O pagamento em si não será processado, já que as chaves não existem no DICT." } },
              { "@type": "Question", name: "A chave aleatória (EVP) é um UUID válido?", acceptedAnswer: { "@type": "Answer", text: "Sim. A chave EVP é gerada como UUID v4, exatamente como o BACEN especifica. O formato é xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx." } },
              { "@type": "Question", name: "Posso gerar chaves PIX em massa via API?", acceptedAnswer: { "@type": "Answer", text: "Sim. Use GET https://fakeforge.com.br/api/generate?type=pixKey&quantity=100. São 100 chamadas grátis por dia." } },
              { "@type": "Question", name: "O FakeForge armazena as chaves geradas?", acceptedAnswer: { "@type": "Answer", text: "Não. As chaves são geradas em tempo real e descartadas imediatamente. Nenhum dado é armazenado ou rastreado." } },
            ],
          }),
        }}
      />

      <GeneratorSchema
        name="Gerador de Chave PIX para Testes"
        url="https://fakeforge.com.br/gerador-pix"
        description="Gere chaves PIX fictícias nos quatro tipos do BACEN: CPF, email, telefone e EVP (UUID v4). Formato válido sem registro no DICT. Ideal para testes de integração com PSPs."
        features={[
          "4 tipos de chave: CPF, email, telefone (+5511...), EVP UUID v4",
          "Formato BACEN-compatível, passa em validação de PSPs",
          "Não está registrada no DICT (não recebe transferências)",
          "Geração em lote até 10.000 chaves por chamada",
          "Export JSON, CSV e SQL",
          "API REST gratuita com 100 chamadas/dia",
        ]}
      />
    </PageShell>
  );
}
