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
  title: "Gerador de Título de Eleitor Válido — Algoritmo TSE para Testes",
  description: "Gere números de título de eleitor fictícios com 12 dígitos válidos pelo algoritmo oficial do TSE. UF + dígitos verificadores corretos. Para testes de cadastro e sistemas eleitorais. Grátis.",
  keywords: "gerador título eleitor, título eleitor válido, número título tse, título eleitoral teste, validador título eleitor",
  openGraph: {
    title: "Gerador de Título de Eleitor Válido — FakeForge",
    description: "12 dígitos válidos pelo algoritmo oficial do TSE para testes.",
    type: "website",
  },
  alternates: { canonical: "/gerador-titulo-eleitor" },
};

export default function GeradorTituloEleitor() {
  return (
    <PageShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">Título de Eleitor</span>
        </h1>
        <p className="text-muted mt-3 text-sm leading-relaxed max-w-2xl">
          Gere números de título de eleitor fictícios válidos pelo algoritmo oficial do TSE.
          12 dígitos no formato &ldquo;NNNN NNNN UU DD&rdquo; — 8 sequenciais + 2 dígitos da UF (01-28) +
          2 dígitos verificadores via mod-11. Use para testes de sistemas eleitorais,
          cadastros que pedem título e validação de máscara.
        </p>
      </div>

      <ApiCtaTop dataType="títulos de eleitor" />

      <SingleGenerator
        type="tituloEleitor"
        label="Título de Eleitor"
        description="Clique em Gerar para criar títulos de eleitor válidos"
      />

      <ApiCtaBanner dataType="títulos de eleitor" />

      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Estrutura do título de eleitor</h2>
          <p>
            O título tem 12 dígitos divididos em 3 grupos:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li><strong className="text-foreground">Posições 1-8:</strong> número sequencial do eleitor</li>
            <li><strong className="text-foreground">Posições 9-10:</strong> código da UF (01 = SP, 02 = MG, 03 = RJ... 28 = exterior)</li>
            <li><strong className="text-foreground">Posições 11-12:</strong> dois dígitos verificadores calculados via mod-11</li>
          </ul>
          <p>
            <strong className="text-foreground">Formato:</strong> 1234 5678 9012 (com espaços)
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Algoritmo de validação</h2>
          <p>
            O TSE usa mod-11 com pesos específicos:
          </p>
          <ol className="list-decimal list-inside space-y-2 pl-2">
            <li><strong>1º dígito verificador:</strong> pesos 2..9 sobre os 8 dígitos sequenciais</li>
            <li><strong>2º dígito verificador:</strong> pesos 7, 8, 9 sobre o código da UF + 1º dígito verificador</li>
            <li>Quando o resto é 10, o dígito vira 0</li>
            <li><strong>Regra especial:</strong> para SP (01) e MG (02), se o dígito calculado for 0, ele vira 1</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {[
              { q: "O título gerado existe na base do TSE?", a: "Não. O número passa na validação matemática (mod-11), mas não corresponde a nenhum eleitor real cadastrado. Qualquer consulta no site do TSE retornará 'não encontrado'." },
              { q: "Por que SP e MG têm regra especial?", a: "São as duas UFs com mais eleitores. Por convenção histórica do TSE, quando o dígito calculado é 0 nessas UFs, ele é forçado a 1 — provavelmente por padronização adotada nos primeiros sistemas eletrônicos." },
              { q: "Os códigos de UF são reais?", a: "Sim. O FakeForge usa os 28 códigos oficiais do TSE: 01 SP, 02 MG, 03 RJ, 04 RS... 27 TO, 28 ZZ (eleitores no exterior)." },
              { q: "Posso usar para votar?", a: "Não. O título é exclusivamente para testes de sistema. Tentativa de uso em eleição configura crime eleitoral (art. 309 do Código Eleitoral)." },
              { q: "Posso gerar títulos em massa via API?", a: "Sim. Use GET https://fakeforge.com.br/api/generate?type=tituloEleitor&quantity=100. São 100 chamadas grátis por dia." },
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

      <RelatedGenerators currentSlug="gerador-titulo-eleitor" />

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Geradores", url: "/geradores" },
        { name: "Título de Eleitor", url: "/gerador-titulo-eleitor" },
      ]} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "O título gerado existe na base do TSE?", acceptedAnswer: { "@type": "Answer", text: "Não. O número passa na validação matemática (mod-11), mas não corresponde a nenhum eleitor real." } },
              { "@type": "Question", name: "Os códigos de UF são reais?", acceptedAnswer: { "@type": "Answer", text: "Sim. O FakeForge usa os 28 códigos oficiais do TSE: 01 SP, 02 MG, 03 RJ até 28 ZZ (exterior)." } },
              { "@type": "Question", name: "Posso usar para votar?", acceptedAnswer: { "@type": "Answer", text: "Não. Apenas para testes de sistema. Uso em eleição configura crime eleitoral." } },
            ],
          }),
        }}
      />

      <GeneratorSchema
        name="Gerador de Título de Eleitor"
        url="https://fakeforge.com.br/gerador-titulo-eleitor"
        description="Gere título de eleitor fictício para testes. Algoritmo do TSE com dígitos verificadores corretos e zona eleitoral por estado. Para uso em desenvolvimento e QA."
        features={[
          "Algoritmo oficial do TSE com dígitos verificadores corretos",
          "Zona eleitoral coerente com o estado emissor",
          "Geração em lote até 10.000 por chamada",
          "Formatado ou apenas dígitos",
          "Export JSON, CSV e SQL",
          "API REST gratuita com 100 chamadas/dia",
        ]}
      />
    </PageShell>
  );
}
