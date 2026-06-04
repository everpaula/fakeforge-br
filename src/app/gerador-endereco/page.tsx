import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import ApiCtaBanner from "@/components/ApiCtaBanner";
import GeneratorSchema from "@/components/GeneratorSchema";
import RelatedGenerators from "@/components/RelatedGenerators";

export const metadata: Metadata = {
  title: "Gerador de Endereço Brasileiro Aleatório (Rua, Bairro, Cidade, CEP)",
  description: "Gere endereço brasileiro aleatório e fictício completo: rua, bairro, cidade, estado e CEP coerentes. Para testes de cadastro, validação de formulário, seed de banco e checkout. Grátis e sem cadastro.",
  keywords: "gerador de endereço, gerar endereço, endereço fictício, endereços aleatorios, gerador de endereço brasileiro, endereço para testes, cep válido, endereço fake brasil, gerador endereco aleatorio, endereco brasileiro fake, gerador endereco completo",
  openGraph: {
    title: "Gerador de Endereço Brasileiro Aleatório",
    description: "Endereços brasileiros fictícios com rua, bairro, cidade, estado e CEP coerentes. Para testes e seed de banco.",
    type: "website",
    images: ["/api/og?title=Gerador+de+Endere%C3%A7o+Brasileiro&subtitle=Endere%C3%A7os+fict%C3%ADcios+com+CEP+coerente+por+estado+para+testes&category=GERADOR"],
  },
  alternates: { canonical: "/gerador-endereco" },
};

export default function GeradorEndereco() {
  return (
    <PageShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">Endereço</span> Brasileiro Aleatório
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Gere endereços brasileiros aleatórios e fictícios completos com CEP, logradouro,
          número, bairro, cidade e estado. Os CEPs seguem os prefixos corretos de cada estado
          (01xxx para SP, 20xxx para RJ, 30xxx para MG, etc.) e os nomes de ruas e bairros são
          realistas. Ideal para gerar endereços aleatórios em testes de formulários de frete,
          cadastros, validação de checkout e integração com APIs de endereço como ViaCEP e
          BrasilAPI (no formato).
        </p>
      </div>

      <div className="space-y-6">
        <SingleGenerator
          type="address"
          label="Endereço Completo"
          description="Clique em Gerar para criar endereços fictícios"
        />
        <SingleGenerator
          type="cep"
          label="CEP"
          description="Apenas o CEP formatado"
        />
      </div>

      <ApiCtaBanner dataType="endereços" />

      {/* SEO content */}
      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Como funciona o CEP no Brasil?</h2>
          <p>
            O CEP (Código de Endereçamento Postal) tem 8 dígitos no formato XXXXX-XXX. O primeiro dígito
            identifica a região: 0 e 1 para SP, 2 para RJ e ES, 3 para MG, 4 para BA e SE, 5 para PE, AL,
            PB e RN, 6 para CE, PI, MA, PA e AP, 7 para DF, GO, TO, MT e MS, 8 para PR e SC, 9 para RS.
            O FakeForge gera CEPs com prefixos corretos para cada estado.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">O que está incluído no endereço?</h2>
          <p>
            Cada endereço gerado inclui: CEP formatado, tipo de logradouro (Rua, Avenida, Travessa),
            nome do logradouro, número, bairro, cidade e estado (UF). Os dados são coerentes entre si —
            um endereço de São Paulo terá CEP começando com 0 ou 1, bairros paulistanos e DDD 11.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Casos de uso</h2>
          <p>
            Testar cálculo de frete em e-commerce, validar integração com APIs dos Correios ou ViaCEP,
            popular bancos de dados com endereços regionalmente corretos, testar formulários com máscara
            de CEP, e criar cenários de teste que dependem de localização geográfica.
          </p>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {[
              { q: "Os endereços gerados são reais?", a: "Não. Os endereços são fictícios, mas seguem padrões realistas: CEPs com prefixos corretos do estado, nomes de ruas e bairros comuns, e cidades reais. O endereço completo, porém, não existe." },
              { q: "O CEP corresponde ao estado correto?", a: "Sim. Os prefixos de CEP seguem as faixas reais dos Correios. Um endereço de São Paulo sempre terá CEP começando com 01-19, Rio de Janeiro com 20-28, e assim por diante." },
              { q: "Posso usar para testar cálculo de frete?", a: "Sim, para validar a lógica do formulário e a máscara de CEP. Para testar cálculo de frete real com APIs dos Correios, use CEPs reais, pois o CEP fictício não será encontrado na base dos Correios." },
              { q: "Quais estados são cobertos?", a: "O FakeForge gera endereços dos 10 principais estados: SP, RJ, MG, RS, PR, BA, PE, CE, DF e SC. Cada estado tem CEPs, cidades e bairros próprios." },
              { q: "Posso gerar endereços em massa via API?", a: "Sim. Use GET https://fakeforge.com.br/api/generate?type=address&quantity=100&format=sql para receber INSERT statements prontos. São 100 chamadas grátis por dia." },
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

      <RelatedGenerators currentSlug="gerador-endereco" />

      {/* FAQPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Os endereços gerados são reais?", acceptedAnswer: { "@type": "Answer", text: "Não. Os endereços são fictícios, mas seguem padrões realistas: CEPs com prefixos corretos do estado, nomes de ruas e bairros comuns, e cidades reais. O endereço completo, porém, não existe." } },
              { "@type": "Question", name: "O CEP corresponde ao estado correto?", acceptedAnswer: { "@type": "Answer", text: "Sim. Os prefixos de CEP seguem as faixas reais dos Correios. Um endereço de São Paulo sempre terá CEP começando com 01-19, Rio de Janeiro com 20-28, e assim por diante." } },
              { "@type": "Question", name: "Posso usar para testar cálculo de frete?", acceptedAnswer: { "@type": "Answer", text: "Sim, para validar a lógica do formulário e a máscara de CEP. Para testar cálculo de frete real com APIs dos Correios, use CEPs reais, pois o CEP fictício não será encontrado na base dos Correios." } },
              { "@type": "Question", name: "Quais estados são cobertos?", acceptedAnswer: { "@type": "Answer", text: "O FakeForge gera endereços dos 10 principais estados: SP, RJ, MG, RS, PR, BA, PE, CE, DF e SC. Cada estado tem CEPs, cidades e bairros próprios." } },
              { "@type": "Question", name: "Posso gerar endereços em massa via API?", acceptedAnswer: { "@type": "Answer", text: "Sim. Use GET https://fakeforge.com.br/api/generate?type=address&quantity=100&format=sql para receber INSERT statements prontos. São 100 chamadas grátis por dia." } },
              { "@type": "Question", name: "O FakeForge armazena os dados gerados?", acceptedAnswer: { "@type": "Answer", text: "Não. Os dados são gerados em tempo real e descartados imediatamente. Nenhum dado é armazenado ou rastreado." } },
            ],
          }),
        }}
      />

      <GeneratorSchema
        name="Gerador de Endereço Brasileiro"
        url="https://fakeforge.com.br/gerador-endereco"
        description="Gere endereço brasileiro fictício e coerente para testes: logradouro, número, bairro, cidade, estado e CEP. Bairros e cidades reais, CEP coerente por estado."
        features={[
          "Logradouro, bairro, cidade, estado e CEP coerentes",
          "10 estados cobertos com bairros e cidades reais",
          "CEP no formato XXXXX-XXX com prefixo correto por estado",
          "Geração em lote até 10.000 por chamada",
          "Export JSON, CSV e SQL",
          "API REST gratuita com 100 chamadas/dia",
        ]}
      />
    </PageShell>
  );
}