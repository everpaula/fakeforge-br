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
          <h2 className="text-lg font-semibold text-foreground mb-2">RG em São Paulo (formato SSP-SP)</h2>
          <p>
            O RG paulista é emitido pelo IIRGD (Instituto de Identificação Ricardo Gumbleton Daunt),
            vinculado à Secretaria de Segurança Pública de São Paulo (SSP-SP). O número tem 8 a 9 dígitos
            sequenciais mais 1 dígito verificador, calculado pelo módulo 11 com pesos de 2 a 9 (o mesmo
            algoritmo já descrito acima). Quando o dígito verificador dá 10, ele é escrito como X.
          </p>
          <p>
            É o formato mais usado como referência em validadores de formulário no Brasil porque São
            Paulo concentra a maior base populacional do país (cerca de 46,6 milhões de habitantes), então
            grande parte dos RGs em circulação segue esse padrão. Formato típico:{" "}
            <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">XX.XXX.XXX-Y</code>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">RG no Rio de Janeiro (formato Detran-RJ / IFP-RJ)</h2>
          <p>
            O RG carioca é emitido pelo IFP (Instituto Félix Pacheco), o instituto de identificação mais
            antigo do Brasil, fundado em 1907, vinculado à Polícia Civil do Rio de Janeiro. O número
            costuma ter até 8 dígitos, também com dígito verificador que pode aparecer como X quando o
            cálculo resulta em 10, seguindo lógica de módulo 11 semelhante à de outros estados, mas com
            variações na aplicação dos pesos em relação ao padrão de SP.
          </p>
          <p>
            Diferente do RG de SP, o carioca é historicamente menos padronizado em sistemas nacionais
            de validação, por isso alguns formulários exigem confirmação manual quando o titular é do RJ.
            Formato típico: <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">XX.XXX.XXX-Y</code>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">RG em Minas Gerais (formato PC-MG)</h2>
          <p>
            O RG mineiro é emitido pelo Instituto de Identificação Prof. Otávio Lord Sales, vinculado à
            Polícia Civil de Minas Gerais (PC-MG / SSP-MG). O número tem até 9 dígitos, com dígito
            verificador calculado por módulo 11. Minas Gerais tem a maior malha de emissão do país, com
            o Detran-MG operando em mais de 850 municípios, o que gera bastante variação de formatação
            entre cartórios e postos de identificação.
          </p>
          <p>
            Formato de referência usado em testes: <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">MG-XX.XXX.XXX</code>,
            com o dígito verificador podendo vir separado por hífen na última posição.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">RG no Rio Grande do Sul (formato IGP-RS)</h2>
          <p>
            O RG gaúcho é emitido pelo Instituto Geral de Perícias (IGP), vinculado à SSP-RS. É um dos
            poucos estados em que o número costuma ter até 10 dígitos, mais longo que o padrão de 8-9
            dígitos comum na maioria das outras UFs, sem separador padronizado entre os grupos. O cálculo
            do dígito verificador segue a mesma lógica de módulo 11, mas a quantidade extra de dígitos
            exige atenção redobrada na hora de validar o tamanho do campo no formulário.
          </p>
          <p>
            Formato típico usado em testes: <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">XXXXXXXXXX-Y</code>{" "}
            (10 dígitos numéricos mais o verificador).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {[
              { q: "O RG é único em todo o Brasil?", a: "Não necessariamente. Como cada estado tem seu próprio instituto de identificação, é possível (embora raro) que números coincidam entre UFs diferentes. Por isso o RG completo, pra fins de identificação civil, sempre inclui o órgão emissor e a UF junto do número, tipo 12.345.678-9 SSP-SP." },
              { q: "Por que o RG de SP é o mais usado em testes?", a: "Porque São Paulo concentra a maior população do país (cerca de 46,6 milhões de habitantes) e seu algoritmo de dígito verificador (módulo 11, pesos 2-9) é o mais documentado e replicado em validadores de formulário. A maioria dos sistemas nacionais usa esse formato como padrão de referência." },
              { q: "A CIN vai substituir o RG?", a: "Sim, gradualmente. A Carteira de Identidade Nacional (CIN) usa o número do CPF como identificador único nacional, substituindo o RG estadual ao longo dos próximos anos. Enquanto a transição não termina, sistemas precisam aceitar RG e CIN em paralelo. Veja o gerador de CIN pra testar esse formato também." },
              { q: "Como validar RG programaticamente?", a: "Depende do estado. Pro formato SP, some os 8 dígitos multiplicados pelos pesos 2 a 9, calcule o resto da divisão por 11, e o dígito verificador é (11 - resto) % 11 (usando X quando o resultado é 10). Outros estados (RJ, MG, RS) têm variações no número de dígitos e na aplicação dos pesos." },
              { q: "Posso usar RG fake em cadastro real?", a: "Não. RGs gerados aqui são fictícios e servem só para testes em ambiente de desenvolvimento, homologação ou QA. Usar em cadastro real com intenção de enganar terceiros configura falsificação ideológica (Código Penal, art. 299)." },
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
        <h2 className="text-lg font-semibold text-foreground mb-3">Gerador de RG por estado</h2>
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
          O RG é responsabilidade estadual — cada UF tem formato próprio, órgão emissor e regra de
          dígito verificador. Escolha seu estado abaixo pra ver o formato específico e casos de uso locais.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          {ESTADOS_BR.map((e) => (
            <Link
              key={e.uf}
              href={`/gerador-rg/${e.slug}`}
              className="px-3 py-2 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors text-center"
            >
              <div className="font-bold text-foreground">{e.uf}</div>
              <div className="text-[10px]">{e.nome}</div>
            </Link>
          ))}
        </div>
      </section>

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
              { "@type": "Question", name: "O RG é único em todo o Brasil?", acceptedAnswer: { "@type": "Answer", text: "Não necessariamente. Como cada estado tem seu próprio instituto de identificação, é possível (embora raro) que números coincidam entre UFs diferentes. Por isso o RG completo, pra fins de identificação civil, sempre inclui o órgão emissor e a UF junto do número, tipo 12.345.678-9 SSP-SP." } },
              { "@type": "Question", name: "Por que o RG de SP é o mais usado em testes?", acceptedAnswer: { "@type": "Answer", text: "Porque São Paulo concentra a maior população do país (cerca de 46,6 milhões de habitantes) e seu algoritmo de dígito verificador (módulo 11, pesos 2-9) é o mais documentado e replicado em validadores de formulário. A maioria dos sistemas nacionais usa esse formato como padrão de referência." } },
              { "@type": "Question", name: "A CIN vai substituir o RG?", acceptedAnswer: { "@type": "Answer", text: "Sim, gradualmente. A Carteira de Identidade Nacional (CIN) usa o número do CPF como identificador único nacional, substituindo o RG estadual ao longo dos próximos anos. Enquanto a transição não termina, sistemas precisam aceitar RG e CIN em paralelo." } },
              { "@type": "Question", name: "Como validar RG programaticamente?", acceptedAnswer: { "@type": "Answer", text: "Depende do estado. Pro formato SP, some os 8 dígitos multiplicados pelos pesos 2 a 9, calcule o resto da divisão por 11, e o dígito verificador é (11 - resto) % 11 (usando X quando o resultado é 10). Outros estados (RJ, MG, RS) têm variações no número de dígitos e na aplicação dos pesos." } },
              { "@type": "Question", name: "Posso usar RG fake em cadastro real?", acceptedAnswer: { "@type": "Answer", text: "Não. RGs gerados são fictícios e servem só para testes em ambiente de desenvolvimento, homologação ou QA. Usar em cadastro real com intenção de enganar terceiros configura falsificação ideológica (Código Penal, art. 299)." } },
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
