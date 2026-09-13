import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import GeneratorSchema from "@/components/GeneratorSchema";

export const metadata: Metadata = {
  title: "Gerador de RENAVAM Válido: 11 Dígitos DENATRAN",
  description: "Gerador de RENAVAM (Registro Nacional de Veículos) válido com dígito verificador correto pelo algoritmo do DENATRAN. Para testes de despachante, sistema de multas e integração com API oficial. Grátis, sem cadastro.",
  keywords: "gerador de renavam, renavam valido, gerar renavam, renavam fake, renavam fictício, renavam para testes, gerador renavam denatran, renavam 11 dígitos, gerar renavam válido para teste",
  alternates: { canonical: "/gerador-renavam" },
  openGraph: {
    title: "Gerador de RENAVAM Válido (11 Dígitos DENATRAN)",
    description: "RENAVAM com dígito verificador correto pelo mod-11 do DENATRAN. Grátis, API REST.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function GeradorRenavam() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Ferramenta para desenvolvedores</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">RENAVAM Válido</span>
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          RENAVAM (Registro Nacional de Veículos Automotores) com 11 dígitos e dígito verificador
          calculado corretamente pelo algoritmo mod-11 do DENATRAN. Passa em qualquer validador de
          formato. Ideal para mock de despachante, sistema de multas, integração com API do DENATRAN
          e fixture de QA.
        </p>
      </div>

      <SingleGenerator
        type="renavam"
        label="RENAVAM Válido"
        description="11 dígitos com DV calculado por mod-11 DENATRAN"
      />

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Gerador de RENAVAM", url: "/gerador-renavam" },
      ]} />

      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">O que é o RENAVAM</h2>
          <p>
            RENAVAM é o número único que o DENATRAN atribui a cada veículo automotor registrado no
            Brasil. Tem 11 dígitos e serve como identificador nacional (diferente da placa, que muda
            se o veículo for transferido de estado). Aparece no CRLV, boletos de IPVA, licenciamento,
            multas e qualquer interação com órgão de trânsito.
          </p>
          <p className="mt-2">
            O último dígito é o verificador, calculado por <strong className="text-foreground">mod-11
            com pesos 3, 2, 9, 8, 7, 6, 5, 4, 3, 2</strong> aplicados aos 10 dígitos base. Se seu
            sistema valida RENAVAM antes de bater na API do DENATRAN, ele confere esse checksum.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Como funciona o algoritmo</h2>
          <p>Para gerar um RENAVAM válido:</p>
          <ol className="list-decimal list-inside space-y-2 pl-2 mt-2">
            <li>Gere 10 dígitos aleatórios (posições 1-10)</li>
            <li>Multiplique cada dígito pelos pesos <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded font-mono">3, 2, 9, 8, 7, 6, 5, 4, 3, 2</code> respectivamente</li>
            <li>Some os produtos</li>
            <li>Multiplique a soma por 10</li>
            <li>Calcule o resto da divisão por 11</li>
            <li>Se o resto for 10 ou 11, o dígito verificador é 0. Senão, é o próprio resto.</li>
          </ol>
          <p className="mt-3">
            Implementação de referência em <Link href="/blog/documentos-brasileiros-formatos-algoritmos-validacao" className="text-primary hover:underline">TypeScript no blog</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Uso via API REST</h2>
          <pre className="bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`# Gerar 100 RENAVAMs válidos
curl "https://fakeforge.com.br/api/generate?type=renavam&quantity=100"

# CSV pra importar em fixture de veículo
curl "https://fakeforge.com.br/api/generate?type=renavam&quantity=1000&format=csv" \\
  -o fixtures/renavam.csv`}</code></pre>
          <p className="mt-3">
            Grátis: 50 chamadas/dia, até 100 RENAVAMs por chamada.{" "}
            <Link href="/pricing?plan=dev&ref=gerador_renavam" className="text-primary hover:underline">Plano Dev (R$29/mês)</Link>{" "}
            libera 10.000/dia.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Node.js: seed de banco de veículos</h2>
          <pre className="bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`// 500 veículos com RENAVAM + placa correlacionados
const [renavams, placas] = await Promise.all([
  fetch("https://fakeforge.com.br/api/generate?type=renavam&quantity=500")
    .then(r => r.json()).then(r => r.data),
  fetch("https://fakeforge.com.br/api/generate?type=placa&quantity=500")
    .then(r => r.json()).then(r => r.data),
]);

for (let i = 0; i < 500; i++) {
  await db.veiculo.create({
    data: {
      renavam: renavams[i],
      placa: placas[i],
    }
  });
}`}</code></pre>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Perguntas Frequentes</h2>
          <div className="space-y-3">
            {[
              { q: "O RENAVAM gerado corresponde a algum veículo real?", a: "Não. Nossa geração cria números que passam mod-11 do DENATRAN, mas não estão registrados na base oficial. Se sua aplicação consulta o DENATRAN via API, a resposta vai ser 'veículo não encontrado', o que é o comportamento esperado em ambiente de teste." },
              { q: "Gerar RENAVAM fake é crime?", a: "Não. Gerar números que passam validação de formato para testes de software é prática padrão. Crime é usar RENAVAM (fake ou real) pra emitir documento fraudulento, transferir propriedade indevidamente ou circular sem registro." },
              { q: "Posso testar com API oficial do DENATRAN?", a: "Não. A API oficial só responde pra veículos registrados. Use o RENAVAM fake pra teste de front-end, mock de despachante e validação de formato. Pra teste end-to-end com API oficial, cada estado tem sandbox próprio com números de teste específicos." },
              { q: "RENAVAM tem UF codificada como o CPF?", a: "Não. RENAVAM é nacional e não codifica UF. Se um veículo é transferido de SP pra RJ, o RENAVAM permanece o mesmo, só a placa muda (ou nem isso, com placa Mercosul)." },
              { q: "Qual formato exibir o RENAVAM?", a: "O DENATRAN não define formato oficial de exibição. Documentos e sistemas usam variações: XXXXXXXXXXX (contínuo), XXXX XXXX XXX (com espaços a cada 4) ou X.XXX.XXX.XXXX (com pontos). Nossa API devolve com espaços a cada 4 quando formatted=true, ou contínuo quando formatted=false." },
              { q: "Como validar RENAVAM no meu código?", a: "Extraia só os dígitos, verifique se são 11, aplique o mod-11 com pesos 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 nos 10 primeiros, multiplique por 10, calcule o resto e compare com o 11º dígito. Rejeite sequências repetidas tipo 11111111111." },
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

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Ferramentas relacionadas</h2>
          <div className="flex flex-wrap gap-2">
            <Link href="/gerador-placa-mercosul" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">Placa Mercosul</Link>
            <Link href="/gerador-cnh" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">CNH Válida</Link>
            <Link href="/gerador-cpf" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">CPF Válido</Link>
            <Link href="/gerador-pessoa" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">Pessoa completa</Link>
            <Link href="/blog/documentos-brasileiros-formatos-algoritmos-validacao" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">Guia de algoritmos BR</Link>
          </div>
        </section>
      </div>

      <GeneratorSchema
        name="Gerador de RENAVAM Válido"
        url="https://fakeforge.com.br/gerador-renavam"
        description="Gerador de RENAVAM (Registro Nacional de Veículos) válido com dígito verificador calculado pelo mod-11 do DENATRAN. Para mock de despachante, sistema de multas e integração DENATRAN."
        features={[
          "11 dígitos com DV calculado por mod-11 DENATRAN",
          "Passa validação de qualquer sistema que checa formato",
          "Pesos oficiais 3, 2, 9, 8, 7, 6, 5, 4, 3, 2",
          "Formatação opcional (contínuo ou com espaços)",
          "API REST com 50 chamadas grátis/dia",
          "Export JSON, CSV e SQL com CREATE TABLE",
        ]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "O RENAVAM gerado corresponde a algum veículo real?", acceptedAnswer: { "@type": "Answer", text: "Não. Nossa geração cria números que passam mod-11 do DENATRAN, mas não estão registrados na base oficial. Consulta na API oficial retorna 'veículo não encontrado'." } },
              { "@type": "Question", name: "Gerar RENAVAM fake é crime?", acceptedAnswer: { "@type": "Answer", text: "Não. Gerar números que passam validação de formato para testes é prática padrão. Crime é usar pra fraude ou circular sem registro." } },
              { "@type": "Question", name: "Posso testar com API oficial do DENATRAN?", acceptedAnswer: { "@type": "Answer", text: "Não. A API oficial só responde pra veículos registrados. Use o fake pra teste de front-end, mock e validação de formato." } },
              { "@type": "Question", name: "RENAVAM tem UF codificada como o CPF?", acceptedAnswer: { "@type": "Answer", text: "Não. RENAVAM é nacional e não codifica UF. Transferência entre estados não muda o RENAVAM." } },
              { "@type": "Question", name: "Qual formato exibir o RENAVAM?", acceptedAnswer: { "@type": "Answer", text: "DENATRAN não define oficial. Variações: contínuo, com espaços a cada 4, ou com pontos. Nossa API devolve com espaços quando formatted=true." } },
              { "@type": "Question", name: "Como validar RENAVAM no meu código?", acceptedAnswer: { "@type": "Answer", text: "Extraia 11 dígitos, aplique mod-11 com pesos 3,2,9,8,7,6,5,4,3,2 nos 10 primeiros, multiplique por 10, calcule resto e compare com o 11º dígito." } },
            ],
          }),
        }}
      />
    </PageShell>
  );
}
