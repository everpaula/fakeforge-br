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
  title: "Gerador de RG Válido — Registro Geral Formato SP para Testes",
  description: "Gere números de RG fictícios válidos no formato de São Paulo (mod-11). 9 dígitos com dígito verificador correto, podendo terminar em X. Para testes de cadastro e validação. Grátis.",
  keywords: "gerador rg, gerador rg válido, número rg teste, rg fictício, rg formato sp, gerador identidade",
  openGraph: {
    title: "Gerador de RG Válido — FakeForge",
    description: "Gere RGs fictícios válidos no formato SP (mod-11) para testes.",
    type: "website",
  },
  alternates: { canonical: "/gerador-rg" },
};

export default function GeradorRG() {
  return (
    <PageShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">RG</span>
        </h1>
        <p className="text-muted mt-3 text-sm leading-relaxed max-w-2xl">
          Gere números de RG (Registro Geral) fictícios válidos no formato de São Paulo —
          o mais aceito em formulários nacionais. 9 dígitos com dígito verificador
          calculado pelo módulo 11 (pode terminar em X representando 10). Use para testar
          formulários de cadastro, validar máscaras e popular bancos de teste sem usar dados reais.
        </p>
      </div>

      <ApiCtaTop dataType="RGs" />

      <SingleGenerator
        type="rg"
        label="RG"
        description="Clique em Gerar para criar números de RG válidos"
      />

      <ApiCtaBanner dataType="RGs" />

      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">O que é o RG e por que o formato SP?</h2>
          <p>
            O RG (Registro Geral) é o documento de identidade emitido pelos estados brasileiros.
            Cada UF tem seu próprio formato e algoritmo, mas o <strong className="text-foreground">formato de São Paulo</strong>
            (8 dígitos sequenciais + 1 dígito verificador, com mod-11 nos pesos 2 a 9) é o mais usado
            em validações nacionais por ser o mais comum no país.
          </p>
          <p>
            <strong className="text-foreground">Importante:</strong> a partir de 2026 a CIN (Carteira de Identidade Nacional)
            substitui gradualmente o RG. Para testar sistemas que aceitam ambos, veja também o{" "}
            <Link href="/gerador-cin" className="text-primary hover:underline">gerador de CIN</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Algoritmo de validação</h2>
          <ol className="list-decimal list-inside space-y-2 pl-2">
            <li>Multiplique os 8 dígitos pelos pesos 2, 3, 4, 5, 6, 7, 8, 9</li>
            <li>Some os resultados</li>
            <li>Calcule o resto da divisão por 11</li>
            <li>O dígito verificador é (11 − resto) % 11</li>
            <li>Se o dígito for 10, representa-se como <strong>X</strong></li>
          </ol>
          <p>
            <strong className="text-foreground">Exemplos válidos:</strong> 12.345.678-9 ou 12.345.678-X
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {[
              { q: "O RG gerado funciona em consultas oficiais?", a: "Não. O número passa na validação matemática, mas não corresponde a nenhum cidadão registrado em qualquer instituto de identificação estadual." },
              { q: "Por que alguns RGs terminam em X?", a: "Quando o dígito verificador calculado é 10, ele é representado como X (algarismo romano). Isso é padrão do formato SP." },
              { q: "Outros estados usam formato diferente?", a: "Sim. RJ, MG, BA e outros têm formatos próprios. O formato SP é o mais aceito em sistemas nacionais por ser o mais comum no Brasil." },
              { q: "Posso usar para testar um cadastro real?", a: "Não. Apenas para testes em ambiente de desenvolvimento, homologação ou QA. Usar em cadastros reais constitui falsificação ideológica (CP art. 299)." },
              { q: "Posso gerar RGs em massa via API?", a: "Sim. Use GET https://fakeforge.com.br/api/generate?type=rg&quantity=100. São 100 chamadas grátis por dia." },
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

      <RelatedGenerators currentSlug="gerador-rg" />

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Geradores", url: "/geradores" },
        { name: "RG", url: "/gerador-rg" },
      ]} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "O RG gerado funciona em consultas oficiais?", acceptedAnswer: { "@type": "Answer", text: "Não. O número passa na validação matemática, mas não corresponde a nenhum cidadão registrado em qualquer instituto de identificação estadual." } },
              { "@type": "Question", name: "Por que alguns RGs terminam em X?", acceptedAnswer: { "@type": "Answer", text: "Quando o dígito verificador calculado é 10, ele é representado como X. Isso é padrão do formato SP." } },
              { "@type": "Question", name: "Outros estados usam formato diferente?", acceptedAnswer: { "@type": "Answer", text: "Sim. RJ, MG, BA e outros têm formatos próprios. O formato SP é o mais aceito em sistemas nacionais." } },
              { "@type": "Question", name: "Posso gerar RGs em massa via API?", acceptedAnswer: { "@type": "Answer", text: "Sim. Use GET https://fakeforge.com.br/api/generate?type=rg&quantity=100. São 100 chamadas grátis por dia." } },
            ],
          }),
        }}
      />

      <GeneratorSchema
        name="Gerador de RG por Estado"
        url="https://fakeforge.com.br/gerador-rg"
        description="Gere RG (Registro Geral) fictício por estado para testes. Formatos específicos de SP, RJ, MG e outros estados brasileiros. Para uso em ambiente de desenvolvimento."
        features={[
          "Formato específico por estado emissor",
          "Dígito verificador conforme regra de cada SSP",
          "Geração em lote até 10.000 por chamada",
          "Formatado ou apenas dígitos",
          "Export JSON, CSV e SQL",
          "API REST gratuita com 100 chamadas/dia",
        ]}
      />
    </PageShell>
  );
}
