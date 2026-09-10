import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "FakeForge vs Mockaroo: Qual Usar para Dados Brasileiros",
  description:
    "Comparativo técnico entre FakeForge e Mockaroo para gerar dados brasileiros de teste. CPF mod-11 nativo, CNPJ alfanumérico, PIX BACEN, preço, API REST. Quando usar cada um.",
  keywords:
    "fakeforge vs mockaroo, alternativa mockaroo brasil, mockaroo cpf cnpj, mockaroo brasileiro, gerador dados brasil sem mockaroo, mockaroo grátis brasileiro",
  alternates: { canonical: "/comparacao/fakeforge-vs-mockaroo" },
  openGraph: {
    title: "FakeForge vs Mockaroo: Comparação para dados brasileiros",
    description:
      "Mockaroo é internacional, FakeForge é especialista BR. Comparativo de validações, API, preço e quando usar cada um.",
    type: "article",
    images: ["/api/og?title=FakeForge+vs+Mockaroo&subtitle=Mockaroo+%C3%A9+internacional%2C+FakeForge+%C3%A9+BR+especialista&category=COMPARATIVO"],
  },
};

const COMPARISON = [
  ["CPF válido (algoritmo mod-11)", "✓ nativo", "Apenas formato"],
  ["CNPJ válido (algoritmo mod-11)", "✓ nativo", "Apenas formato"],
  ["CNPJ Alfanumérico (2026)", "✓", "—"],
  ["CIN (novo RG biométrico)", "✓", "—"],
  ["CNH válida (DENATRAN)", "✓", "—"],
  ["Chave PIX (4 formatos BACEN)", "✓", "—"],
  ["RG por estado", "✓", "—"],
  ["Cartão de crédito (Luhn + bandeira BR)", "✓ Visa/Master/Elo/Hiper/Amex", "Genérico internacional"],
  ["CEP coerente por estado", "✓ 10 estados cobertos", "Aleatório, não coerente"],
  ["Bairros e cidades reais", "✓", "Genéricos"],
  ["Nomes brasileiros típicos", "✓ 125+ nomes", "Lista internacional"],
  ["Telefone com DDD válido", "✓ 67 DDDs do Brasil", "Formato genérico"],
  ["Dados correlacionados (nome+email)", "✓ via presets", "✓ via formulas"],
  ["Interface em português", "✓", "Apenas inglês"],
  ["API REST grátis", "✓ 100 chamadas/dia", "1.000 linhas/dia"],
  ["Plano gratuito API", "100 chamadas/dia", "1.000 linhas/dia"],
  ["Plano pago a partir de", "R$ 29/mês (Dev)", "$60 USD/ano"],
  ["Export SQL pronto", "✓ INSERT INTO direto", "✓"],
  ["Export JSON e CSV", "✓", "✓"],
  ["Geração em lote (max)", "10.000 por chamada", "100.000 por chamada (plano pago)"],
  ["Zero dependências no projeto", "✓", "✓ (API SaaS)"],
  ["Open for AI agents (/llms.txt)", "✓", "—"],
  ["Hospedagem", "Brasil (latência baixa)", "EUA (latência maior)"],
  ["LGPD-friendly (sem armazenamento)", "✓", "Política internacional"],
];

export default function ComparacaoMockaroo() {
  return (
    <PageShell>
      <article className="max-w-3xl">
        <div className="mb-10">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Comparativo · 2026
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            FakeForge vs <span className="text-primary">Mockaroo</span>
          </h1>
          <p className="text-muted-foreground mt-4 text-sm sm:text-base leading-relaxed">
            Mockaroo é o gerador de dados de teste mais usado internacionalmente, com mais de 200 tipos de
            dados e milhares de usuários em times de QA e dev no mundo todo. FakeForge é especialista no
            mercado brasileiro, com validações algorítmicas nativas para CPF, CNPJ, PIX, CNH e CIN.
            Este comparativo cobre quando vale usar cada um.
          </p>
        </div>

        <div className="rounded-xl bg-primary/5 border border-primary/20 p-5 mb-10">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">TL;DR</p>
          <ul className="text-sm space-y-1.5 text-foreground">
            <li>
              <strong>Use FakeForge se:</strong> seu sistema valida CPF/CNPJ via mod-11, precisa de CNPJ alfanumérico, PIX BACEN ou CIN. Latência BR menor.
            </li>
            <li>
              <strong>Use Mockaroo se:</strong> seu sistema é internacional, precisa de 200+ tipos de dados genéricos, ou já tem assinatura para mais de 10.000 linhas por chamada.
            </li>
            <li>
              <strong>Use os dois juntos:</strong> Mockaroo para o esquema geral do banco (datas, números aleatórios, foreign keys), FakeForge para os campos brasileiros validados.
            </li>
          </ul>
        </div>

        <h2 className="text-xl font-semibold text-foreground mb-4">Tabela comparativa</h2>
        <div className="rounded-xl bg-card border border-border overflow-hidden mb-10">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-card-hover">
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Recurso</th>
                  <th className="text-center px-4 py-3 text-primary font-semibold">FakeForge</th>
                  <th className="text-center px-4 py-3 text-muted-foreground font-medium">Mockaroo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {COMPARISON.map(([feature, ff, mock], i) => (
                  <tr key={i}>
                    <td className="px-4 py-2.5 text-muted-foreground">{feature}</td>
                    <td className="px-4 py-2.5 text-center text-primary font-medium">{ff}</td>
                    <td className="px-4 py-2.5 text-center">{mock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-foreground mt-12 mb-4">
          Quando o Mockaroo é melhor
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Mockaroo brilha em três cenários onde o FakeForge não pretende competir:
        </p>
        <ul className="text-sm text-muted-foreground space-y-2 mb-8 list-disc list-inside">
          <li>
            <strong className="text-foreground">Esquemas complexos com 50+ colunas mistas.</strong>{" "}
            Mockaroo tem 200+ tipos de dados (UUID, IP, JSON, custom formulas, foreign keys). O FakeForge
            foca no que importa no Brasil, não em quantidade total de tipos.
          </li>
          <li>
            <strong className="text-foreground">Times internacionais com QA fora do Brasil.</strong>{" "}
            A interface em inglês e a documentação extensiva do Mockaroo são vantagens para times
            distribuídos onde nem todos leem português.
          </li>
          <li>
            <strong className="text-foreground">Volume muito alto (100k+ linhas por chamada).</strong>{" "}
            O plano pago do Mockaroo permite chamadas maiores. O FakeForge limita a 10.000 por chamada,
            adequado para ciclos de QA mas não para popular DWs gigantes.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground mt-12 mb-4">
          Quando o FakeForge é melhor
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Cinco cenários onde a especialização BR do FakeForge faz diferença real:
        </p>
        <ul className="text-sm text-muted-foreground space-y-2 mb-8 list-disc list-inside">
          <li>
            <strong className="text-foreground">Validação algorítmica nativa.</strong> Seu sistema
            roda algoritmo mod-11 no CPF/CNPJ. Mockaroo gera formato XX.XXX.XXX-XX, mas os dígitos
            verificadores são aleatórios. O FakeForge gera CPF/CNPJ que passa em qualquer validador
            oficial brasileiro.
          </li>
          <li>
            <strong className="text-foreground">CNPJ Alfanumérico de 2026.</strong> A Receita
            Federal vai introduzir CNPJ alfanumérico em 2026. Mockaroo ainda não cobre o formato.
            FakeForge gera o novo formato hoje, alinhado com a IN da Receita.
          </li>
          <li>
            <strong className="text-foreground">PIX no formato BACEN.</strong> 4 tipos de chave
            (CPF, email, telefone +55, EVP UUID v4) com formato exato que passa em validação de PSPs
            como Mercado Pago, PagBank, Stripe Brasil.
          </li>
          <li>
            <strong className="text-foreground">Latência menor no Brasil.</strong> FakeForge hospeda
            no Brasil. Mockaroo nos EUA. Em pipelines de CI/CD que rodam dezenas de chamadas seguidas,
            a diferença de latência por requisição se acumula.
          </li>
          <li>
            <strong className="text-foreground">Preço.</strong> 100 chamadas grátis/dia cobre a
            maioria dos casos de QA. Plano Dev R$29/mês desbloqueia 10.000 chamadas/dia. Mockaroo
            cobra $60 USD/ano ($300+/ano para limites equivalentes em volume).
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground mt-12 mb-4">
          Exemplo prático: gerar 100 customers brasileiros
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Cenário comum: você quer popular o banco de staging com 100 customers que tenham CPF
          válido, email coerente com o nome, CEP que bate com o estado, e telefone com DDD certo.
        </p>

        <p className="text-sm text-foreground font-semibold mt-6 mb-2">FakeForge:</p>
        <pre className="text-xs bg-card border border-border rounded-lg p-4 overflow-x-auto mb-6">
          <code>{`POST https://fakeforge.com.br/api/generate
{
  "preset": "customer",
  "quantity": 100,
  "format": "sql"
}

// Retorna INSERT INTO customers ... pronto pra executar
// CPF passa em validação mod-11
// Email = primeironome.sobrenome@gmail.com (acentos removidos)
// CEP bate com estado, bairro bate com cidade
// Telefone +55(DDD)(9XXXX-XXXX) com DDD válido`}</code>
        </pre>

        <p className="text-sm text-foreground font-semibold mt-6 mb-2">Mockaroo:</p>
        <pre className="text-xs bg-card border border-border rounded-lg p-4 overflow-x-auto mb-6">
          <code>{`// Mockaroo: precisa configurar campo a campo
// 1. Field "cpf" = Random String com mask "###.###.###-##"
//    PROBLEMA: dígitos verificadores aleatórios, não passam em mod-11
// 2. Field "email" = First Name + Last Name + email
//    OK: usa fórmula concatenar
// 3. Field "address" = Brazilian Address (genérico)
//    PROBLEMA: estado/cidade/CEP nem sempre coerentes
// 4. Field "phone" = Phone (genérico) ou Custom List de DDDs
//    PROBLEMA: precisa manter lista de DDDs válidos
// Total: 30-45 min de configuração inicial, depois reusável`}</code>
        </pre>

        <p className="text-sm text-muted-foreground leading-relaxed mb-8">
          Para o caso BR, o FakeForge entrega em uma chamada o que o Mockaroo entrega em uma
          configuração manual de 30 minutos. Para o caso internacional, vale o esforço inicial
          do Mockaroo porque ele cobre dezenas de países.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-12 mb-4">
          Veredicto honesto
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Não é "FakeForge melhor" ou "Mockaroo melhor" no absoluto. São ferramentas com escopos
          diferentes que podem coexistir no mesmo projeto.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Se o seu produto opera principalmente no Brasil e seu QA roda em pt-BR, FakeForge resolve
          os campos brasileiros validados sem precisar de configuração. Se o seu produto é global e
          o BR é só um mercado entre vários, Mockaroo cobre tudo razoavelmente bem, mas pode falhar
          em validações específicas BR (e quando falhar, FakeForge é o fallback óbvio).
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-8">
          A combinação que vejo funcionar melhor em times BR é: Mockaroo para o esquema geral do
          banco (foreign keys, datas, números aleatórios, custom formulas), FakeForge para qualquer
          campo brasileiro que precise passar em validação real.
        </p>

        <div className="rounded-xl bg-primary/5 border border-primary/20 p-5 mt-10">
          <p className="text-sm font-semibold text-foreground mb-2">Próximo passo</p>
          <p className="text-sm text-muted-foreground mb-3">
            Teste o FakeForge agora gratuitamente. Sem cadastro, sem cartão.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/gerador-cpf"
              className="inline-block px-4 py-2 rounded-lg text-sm bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Gerar CPF agora
            </Link>
            <Link
              href="/docs"
              className="inline-block px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground font-medium hover:border-border-hover transition-colors"
            >
              Documentação da API REST
            </Link>
            <Link
              href="/comparacao/fakeforge-vs-alternativas"
              className="inline-block px-4 py-2 rounded-lg text-sm bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors"
            >
              Comparar com Faker.js, 4devs, Faker (Python)
            </Link>
          </div>
        </div>
      </article>

      <BreadcrumbSchema
        items={[
          { name: "Início", url: "/" },
          { name: "Comparações", url: "/comparacao/fakeforge-vs-alternativas" },
          { name: "FakeForge vs Mockaroo", url: "/comparacao/fakeforge-vs-mockaroo" },
        ]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "FakeForge vs Mockaroo — Qual usar para gerar dados brasileiros em 2026?",
            description:
              "Comparativo técnico entre FakeForge e Mockaroo para gerar dados brasileiros de teste.",
            author: {
              "@type": "Organization",
              name: "FakeForge",
              url: "https://fakeforge.com.br",
            },
            publisher: {
              "@type": "Organization",
              name: "FakeForge",
              url: "https://fakeforge.com.br",
            },
            datePublished: "2026-05-23",
            dateModified: "2026-05-23",
            inLanguage: "pt-BR",
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": "https://fakeforge.com.br/comparacao/fakeforge-vs-mockaroo",
            },
          }),
        }}
      />
    </PageShell>
  );
}
