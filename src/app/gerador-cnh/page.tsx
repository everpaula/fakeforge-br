import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import ApiCtaBanner from "@/components/ApiCtaBanner";
import ApiCtaTop from "@/components/ApiCtaTop";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import GeneratorSchema from "@/components/GeneratorSchema";
import RelatedGenerators from "@/components/RelatedGenerators";
import { ESTADOS_BR } from "@/lib/data/estados-br";

export const metadata: Metadata = {
  title: "Gerador de CNH Válida com Algoritmo DENATRAN",
  description: "Gere número de CNH válido para testes de software. Implementa o algoritmo oficial do DENATRAN (mod-11 com pesos invertidos). 11 dígitos, formatado ou puro. Grátis.",
  keywords: "gerador cnh, gerador cnh válida, número cnh teste, denatran algoritmo, cnh fictícia, validador cnh",
  openGraph: {
    title: "Gerador de CNH Válida: FakeForge",
    description: "Números de CNH com algoritmo DENATRAN para testes de software.",
    type: "website",
  },
  alternates: { canonical: "/gerador-cnh" },
};

export default function GeradorCNH() {
  return (
    <PageShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">CNH</span>
        </h1>
        <p className="text-muted mt-3 text-sm leading-relaxed max-w-2xl">
          Gere números de CNH (Carteira Nacional de Habilitação) válidos pelo algoritmo oficial
          do DENATRAN. Os 11 dígitos passam em qualquer validador que use o módulo 11 com pesos
          invertidos, mas não correspondem a nenhuma habilitação emitida.
        </p>
      </div>

      <ApiCtaTop dataType="CNHs" />

      <SingleGenerator
        type="cnh"
        label="CNH"
        description="Clique em Gerar para criar números de CNH válidos"
      />

      <ApiCtaBanner dataType="CNHs" />

      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">O que é o número da CNH</h2>
          <p>
            A CNH brasileira tem 11 dígitos numéricos. Os 9 primeiros identificam o registro nacional
            do condutor (RENACH), e os 2 últimos são dígitos verificadores calculados pelo algoritmo
            do DENATRAN. Diferente de outros documentos, o algoritmo da CNH usa pesos descrescentes
            (9 a 1) e crescentes (1 a 9) sobre o número base.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Quando usar CNHs fictícias</h2>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>Testar formulários de cadastro em sistemas de govtech</li>
            <li>Validar máscara de input que aceita CNH</li>
            <li>Popular bancos de teste para sistemas de motoristas (Uber, 99, iFood, telemetria)</li>
            <li>Demos de aplicações para autoescolas e DETRAN</li>
            <li>Testes de integração com APIs de consulta de habilitação (Serasa, SPC)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {[
              { q: "A CNH gerada é válida?", a: "Os dígitos verificadores passam no algoritmo do DENATRAN, mas o número não corresponde a nenhuma habilitação emitida. Use apenas para testes." },
              { q: "Posso consultar essa CNH no DETRAN?", a: "Não. Como o número é fictício, qualquer consulta na base do DETRAN, Serasa ou SPC retornará 'não encontrado'. Use apenas para testar a validação local do seu sistema." },
              { q: "Qual algoritmo é usado?", a: "Módulo 11 com pesos invertidos. O 1º dígito usa pesos 9..1 sobre os 9 primeiros dígitos. O 2º dígito usa pesos 1..9. Quando o resto é >= 10, ajusta-se conforme regra do DENATRAN (subtrai 2 do segundo dígito)." },
              { q: "É crime gerar CNH fictícia?", a: "Não. Gerar números que passam na validação matemática para testes é prática legítima de desenvolvimento. Crime seria usar para se passar por habilitado ou fraudar autoescola/DETRAN." },
              { q: "Posso gerar CNHs em massa via API?", a: "Sim. Use GET https://fakeforge.com.br/api/generate?type=cnh&quantity=100. São 100 chamadas grátis por dia." },
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

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-foreground mb-3">Gerador de CNH por estado</h2>
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
          O algoritmo do DENATRAN é federal e uniforme, mas cada estado tem contexto próprio de operação
          do DETRAN. Escolha seu estado abaixo pra ver informações específicas de frota, DDDs e casos de
          uso locais.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          {ESTADOS_BR.map((e) => (
            <Link
              key={e.uf}
              href={`/gerador-cnh/${e.slug}`}
              className="px-3 py-2 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors text-center"
            >
              <div className="font-bold text-foreground">{e.uf}</div>
              <div className="text-[10px]">{e.nome}</div>
            </Link>
          ))}
        </div>
      </section>

      <RelatedGenerators currentSlug="gerador-cnh" />

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Geradores", url: "/geradores" },
        { name: "CNH", url: "/gerador-cnh" },
      ]} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "A CNH gerada é válida?", acceptedAnswer: { "@type": "Answer", text: "Os dígitos verificadores passam no algoritmo do DENATRAN, mas o número não corresponde a nenhuma habilitação emitida. Use apenas para testes." } },
              { "@type": "Question", name: "Posso consultar essa CNH no DETRAN?", acceptedAnswer: { "@type": "Answer", text: "Não. Como o número é fictício, qualquer consulta na base do DETRAN, Serasa ou SPC retornará 'não encontrado'." } },
              { "@type": "Question", name: "Qual algoritmo é usado?", acceptedAnswer: { "@type": "Answer", text: "Módulo 11 com pesos invertidos. O 1º dígito usa pesos 9..1, o 2º dígito usa pesos 1..9. Quando o resto é >= 10, ajusta-se conforme regra do DENATRAN." } },
              { "@type": "Question", name: "É crime gerar CNH fictícia?", acceptedAnswer: { "@type": "Answer", text: "Não. Gerar números que passam na validação matemática para testes é prática legítima de desenvolvimento." } },
            ],
          }),
        }}
      />

      <GeneratorSchema
        name="Gerador de CNH Válida"
        url="https://fakeforge.com.br/gerador-cnh"
        description="Gere CNH (Carteira Nacional de Habilitação) válida e fictícia para testes. Algoritmo mod-11 invertido do DENATRAN com dígitos verificadores corretos. Para uso exclusivo em desenvolvimento e QA."
        features={[
          "Algoritmo mod-11 invertido DENATRAN com dígitos verificadores corretos",
          "Categoria (A, B, AB, etc.) configurável",
          "Validador integrado de CNH",
          "Geração em lote até 10.000 por chamada",
          "Export JSON, CSV e SQL",
          "API REST gratuita com 100 chamadas/dia",
        ]}
      />
    </PageShell>
  );
}
