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
  title: "Gerador de Placa Mercosul e Antiga para Testes",
  description: "Gere placas brasileiras nos formatos Mercosul (LLLNLNN) e antigo (LLL-NNNN) válidos pela Resolução CONTRAN 729/2018. Letras sem I/O/Q. Para testes de OCR, sistemas de tráfego e seguradoras.",
  keywords: "gerador placa mercosul, gerador placa antiga, placa fictícia teste, placa lllnlnn, contran 729, placa válida software",
  openGraph: {
    title: "Gerador de Placa Mercosul: FakeForge BR",
    description: "Placas brasileiras válidas (Mercosul + antiga) para testes de software.",
    type: "website",
  },
  alternates: { canonical: "/gerador-placa-mercosul" },
};

export default function GeradorPlaca() {
  return (
    <PageShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">Placa Mercosul</span>
        </h1>
        <p className="text-muted mt-3 text-sm leading-relaxed max-w-2xl">
          Gere placas brasileiras nos dois formatos válidos: <strong className="text-foreground">Mercosul (LLLNLNN)</strong>,
          obrigatório para veículos novos desde novembro/2018, e <strong className="text-foreground">antigo (LLL-NNNN)</strong>
          ainda comum em frotas mais antigas. Letras seguem a tabela do DENATRAN (sem I, O e Q por confusão visual).
          Use para testar OCR, ALPR, sistemas de tráfego, seguradoras e backoffice de locadoras.
        </p>
      </div>

      <ApiCtaTop dataType="placas" />

      <div className="space-y-6">
        <SingleGenerator
          type="placa"
          label="Placa Mercosul"
          description="Formato novo (LLLNLNN) — obrigatório para veículos novos desde nov/2018"
        />
        <SingleGenerator
          type="placaAntiga"
          label="Placa Antiga"
          description="Formato legado (LLL-NNNN) — ainda em circulação na frota nacional"
        />
      </div>

      <ApiCtaBanner dataType="placas" />

      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">A diferença entre Mercosul e antiga</h2>
          <p>
            O formato Mercosul foi instituído pela <strong className="text-foreground">Resolução CONTRAN nº 729/2018</strong>{" "}
            e tornou-se obrigatório para veículos novos a partir de novembro/2018. A diferença está na 5ª posição:
            no formato antigo as quatro últimas posições são sempre dígitos (LLLNNNN), enquanto no Mercosul a
            5ª posição é uma letra (LLLNLNN).
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2 mt-3">
            <li><strong className="text-foreground">Antigo:</strong> ABC-1234 (3 letras + 4 dígitos)</li>
            <li><strong className="text-foreground">Mercosul:</strong> ABC1D23 (3 letras + dígito + letra + 2 dígitos)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Letras válidas (sem I, O, Q)</h2>
          <p>
            O DENATRAN exclui as letras I, O e Q do alfabeto de placas para evitar confusão visual com os dígitos
            1, 0 e 0 em fontes impressas e leitura por câmera. O alfabeto válido é:
          </p>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4">A B C D E F G H J K L M N P R S T U V W X Y Z</pre>
          <p>São <strong className="text-foreground">23 letras</strong>. Dígitos usam o range completo 0-9.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Validação por regex</h2>
          <p>
            Sistemas que aceitam apenas o formato antigo rejeitam placas Mercosul válidas — esse é um dos bugs
            mais comuns em formulários de seguradoras legadas. Use a regex que cobre os dois:
          </p>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto">{`// TypeScript / JavaScript — aceita Mercosul OU antiga
const REGEX_PLACA = /^[A-HJ-NP-Z]{3}([0-9]{4}|[0-9][A-HJ-NP-Z][0-9]{2})$/;

REGEX_PLACA.test("ABC1234"); // true (antiga)
REGEX_PLACA.test("ABC1D23"); // true (Mercosul)
REGEX_PLACA.test("ABI1234"); // false (I não permitido)`}</pre>
          <p>
            O range <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">[A-HJ-NP-Z]</code>{" "}
            exclui I, O e Q nativamente.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Tutorial completo</h2>
          <p>
            Veja o tutorial passo a passo no blog: <Link href="/blog/gerador-placa-mercosul-teste-software" className="text-primary hover:underline">Gerador de Placa Mercosul para Testes — Algoritmo e Validação</Link>{" "}
            (TypeScript, Zod, Vitest, GitHub Actions e seed de banco).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {[
              { q: "A placa gerada existe de verdade?", a: "Não. A placa segue o formato sintático correto (regex válida), mas o número não corresponde a nenhum veículo emplacado no DETRAN. Qualquer consulta na base do DETRAN, SINESP ou seguradoras retornará 'não encontrado'." },
              { q: "A placa antiga ainda é válida no Brasil?", a: "Sim. Veículos emplacados antes de novembro/2018 continuam com placas no formato antigo (LLL-NNNN) e não precisam migrar — só perde validade quando o veículo é transferido entre estados ou tem placa danificada." },
              { q: "Por que I, O e Q não aparecem?", a: "Por confusão visual: I parece 1, O parece 0, e Q parece 0 ou ø em fontes pequenas. O DENATRAN excluiu essas três letras para reduzir erros em câmeras de OCR e leitura humana." },
              { q: "Posso usar para testar sistema de pedágio ou estacionamento?", a: "Para validação local (formato, máscara, regex), sim. Para teste ponta-a-ponta com integração real de DETRAN ou SINESP, use placas reais autorizadas — placas fictícias falham na consulta de cadastro." },
              { q: "Posso gerar placas em massa via API?", a: "Sim. Use GET https://fakeforge.com.br/api/generate?type=placa&quantity=100 para Mercosul ou type=placaAntiga para o formato antigo. São 100 chamadas grátis por dia." },
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

      <RelatedGenerators currentSlug="gerador-placa-mercosul" />

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Geradores", url: "/geradores" },
        { name: "Placa Mercosul", url: "/gerador-placa-mercosul" },
      ]} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "A placa gerada existe de verdade?", acceptedAnswer: { "@type": "Answer", text: "Não. A placa segue o formato sintático correto, mas não corresponde a nenhum veículo emplacado no DETRAN." } },
              { "@type": "Question", name: "A placa antiga ainda é válida no Brasil?", acceptedAnswer: { "@type": "Answer", text: "Sim. Veículos emplacados antes de novembro/2018 continuam com placas no formato antigo e não precisam migrar." } },
              { "@type": "Question", name: "Por que I, O e Q não aparecem?", acceptedAnswer: { "@type": "Answer", text: "Por confusão visual com os dígitos 1, 0 e 0. O DENATRAN excluiu essas letras para reduzir erros em OCR e leitura humana." } },
              { "@type": "Question", name: "Posso gerar placas em massa via API?", acceptedAnswer: { "@type": "Answer", text: "Sim. Use GET /api/generate?type=placa&quantity=100 para Mercosul ou type=placaAntiga para o formato antigo." } },
            ],
          }),
        }}
      />

      <GeneratorSchema
        name="Gerador de Placa Mercosul"
        url="https://fakeforge.com.br/gerador-placa-mercosul"
        description="Gere placa veicular Mercosul (LLLNLNN) ou formato antigo (LLL-NNNN) válida e fictícia para testes. Respeita as regras do DENATRAN (sem letras I, O, Q)."
        features={[
          "Formato Mercosul (LLLNLNN) e formato antigo (LLL-NNNN)",
          "Exclui letras I, O e Q conforme regra do DENATRAN",
          "Validador integrado de placa",
          "Geração em lote até 10.000 por chamada",
          "Export JSON, CSV e SQL",
          "API REST gratuita com 100 chamadas/dia",
        ]}
      />
    </PageShell>
  );
}
