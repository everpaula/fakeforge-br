import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import ApiCtaBanner from "@/components/ApiCtaBanner";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import GeneratorSchema from "@/components/GeneratorSchema";
import DevOnlyDisclaimer from "@/components/DevOnlyDisclaimer";
import { ESTADOS_BR, getEstado, getAllEstadoSlugs, getEstadosVizinhos } from "@/lib/data/estados-br";

interface PageProps {
  params: Promise<{ uf: string }>;
}

export async function generateStaticParams() {
  return getAllEstadoSlugs().map((uf) => ({ uf }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { uf } = await params;
  const estado = getEstado(uf);
  if (!estado) return { title: "Estado não encontrado" };

  return {
    title: `Gerador de CNH ${estado.uf} - Carteira Nacional de Habilitação para Testes | ${estado.nome}`,
    description: `Gere CNH sintética para testes de software no ${estado.nome} (${estado.uf}). Algoritmo DENATRAN mod-11 com dígitos verificadores corretos. Frota do estado: ${estado.frotaMilhoes} milhões de veículos. Grátis e sem cadastro.`,
    keywords: `gerador de cnh ${estado.uf.toLowerCase()}, gerador cnh ${estado.nome.toLowerCase()}, cnh para testes ${estado.uf.toLowerCase()}, detran ${estado.uf.toLowerCase()} cnh, cnh ${estado.nome.toLowerCase()} desenvolvimento, cnh sintética ${estado.uf.toLowerCase()}`,
    alternates: { canonical: `/gerador-cnh/${estado.slug}` },
    openGraph: {
      title: `Gerador de CNH ${estado.uf} para Testes (${estado.nome})`,
      description: `CNH válida pelo algoritmo DENATRAN para testes de software no ${estado.nome}. Zero uso real, apenas desenvolvimento.`,
      type: "website",
      locale: "pt_BR",
    },
  };
}

export default async function GeradorCNHPorEstado({ params }: PageProps) {
  const { uf } = await params;
  const estado = getEstado(uf);
  if (!estado) notFound();

  const vizinhos = getEstadosVizinhos(estado.uf);

  return (
    <PageShell>
      <div className="mb-6">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">
          {estado.regiao} · DDDs {estado.ddds.join(", ")}
        </p>
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">CNH</span> {estado.uf}
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Gere números sintéticos de CNH (Carteira Nacional de Habilitação) para testes de software
          no {estado.nome}. Como o algoritmo do DENATRAN é federal, o formato é o mesmo em todo o
          Brasil — 11 dígitos com verificadores mod-11 com pesos invertidos. A diferença está no
          contexto operacional do DETRAN-{estado.uf}.
        </p>
      </div>

      <DevOnlyDisclaimer dataType="documentos brasileiros" className="mb-6" />

      <SingleGenerator
        type="cnh"
        label={`CNH ${estado.uf}`}
        description={`Números sintéticos de CNH pra testes no ${estado.nome}. Passa validação DENATRAN.`}
      />

      <ApiCtaBanner dataType="CNHs" />

      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Contexto: CNH no {estado.nome}</h2>
          <p>{estado.cnh_contexto}</p>
          <p className="mt-2">
            Estado com <strong className="text-foreground">{estado.populacao_milhoes} milhões</strong> de
            habitantes e frota de <strong className="text-foreground">{estado.frotaMilhoes} milhões</strong> de
            veículos. Os principais DDDs são {estado.ddds.join(", ")}. Capital: {estado.capital}.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Como funciona o algoritmo do DENATRAN</h2>
          <p>
            A CNH brasileira tem 11 dígitos: os 9 primeiros são o registro nacional do condutor
            (RENACH), e os 2 últimos são dígitos verificadores calculados pelo módulo 11 com pesos
            invertidos. O 1º dígito verificador usa pesos de 9 a 1 sobre os 9 dígitos base.
            O 2º dígito usa pesos de 1 a 9. Se o resto for maior ou igual a 10, ajusta conforme
            regra específica do DENATRAN (subtrai 2 no segundo dígito). O algoritmo é federal —
            uma CNH gerada aqui passa validação de qualquer sistema, independente da UF de emissão.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Casos de uso no {estado.nome}</h2>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>Testar cadastro em app de mobilidade (Uber, 99, iFood entregadores) em {estado.capital} e outras cidades</li>
            <li>Popular banco de dados de sistema de locação de veículos ({estado.frotaMilhoes}M de frota = mercado relevante)</li>
            <li>Validar integração com sistema do DETRAN-{estado.uf} em ambiente de homologação</li>
            <li>Fixtures de testes E2E de app de motorista ou de multa</li>
            <li>Seed de banco de teste em app corporativo de gestão de frota</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {[
              {
                q: `A CNH gerada é válida no DETRAN-${estado.uf}?`,
                a: `Não. Os dígitos passam na validação matemática mod-11 do DENATRAN, mas o número não corresponde a nenhuma habilitação real emitida no ${estado.nome} nem em qualquer outra UF. Consulta no DETRAN-${estado.uf}, Serasa ou SPC retorna "não encontrado".`,
              },
              {
                q: `Existe algoritmo diferente por estado?`,
                a: `Não. O algoritmo do DENATRAN é federal e uniforme. Uma CNH gerada pra testes no ${estado.nome} tem o mesmo formato e passa nos mesmos validadores que uma CNH gerada pra ${vizinhos[0]?.nome || "outra UF"}. A UF é usada só pra contexto/organização, não muda o número.`,
              },
              {
                q: `Posso usar essas CNHs no meu app rodando em ${estado.capital}?`,
                a: `Sim, para testes. Se seu app valida CNH via mod-11 (client-side ou back-end), essas CNHs passam. Se seu app consulta a base do DENATRAN-${estado.uf} em tempo real, retorna erro porque as CNHs sintéticas não existem lá. Para teste de integração, use mock ou stub da API do DETRAN.`,
              },
              {
                q: `É crime gerar CNH sintética pra testes?`,
                a: `Não. Gerar números que passam validação matemática pra popular banco de teste é prática legítima de desenvolvimento em qualquer UF. Crime é apresentar CNH sintética como real (falsidade ideológica art. 299 CP), usar em fiscalização de trânsito ou tentar consultar como se fosse verdadeira.`,
              },
              {
                q: `Como gerar CNHs em massa via API para meu app em ${estado.uf}?`,
                a: `Use GET https://fakeforge.com.br/api/generate?type=cnh&quantity=100. Free tier libera 50 chamadas/dia sem cadastro. Plano Dev (R$29/mês) libera 10.000 chamadas/dia com até 10.000 CNHs por chamada — suficiente pra popular banco de teste em qualquer projeto.`,
              },
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

        {vizinhos.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Geradores de CNH em outros estados do {estado.regiao}</h2>
            <div className="flex flex-wrap gap-2">
              {vizinhos.map((v) => (
                <Link
                  key={v.uf}
                  href={`/gerador-cnh/${v.slug}`}
                  className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors"
                >
                  CNH {v.uf} · {v.nome}
                </Link>
              ))}
              <Link
                href="/gerador-cnh"
                className="px-3 py-1.5 rounded-lg text-xs bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors"
              >
                Ver todos os estados
              </Link>
            </div>
          </section>
        )}
      </div>

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Geradores", url: "/geradores" },
        { name: "CNH", url: "/gerador-cnh" },
        { name: `CNH ${estado.uf}`, url: `/gerador-cnh/${estado.slug}` },
      ]} />

      <GeneratorSchema
        name={`Gerador de CNH para Testes - ${estado.nome} (${estado.uf})`}
        url={`https://fakeforge.com.br/gerador-cnh/${estado.slug}`}
        description={`Gere números sintéticos de CNH para testes de software no ${estado.nome} (${estado.uf}). Algoritmo mod-11 do DENATRAN com dígitos verificadores corretos. Uso restrito a desenvolvimento e QA.`}
        features={[
          "Algoritmo DENATRAN mod-11 com pesos invertidos",
          `Contexto operacional DETRAN-${estado.uf}`,
          "Validador integrado",
          "Geração em lote até 10.000 por chamada",
          "Export JSON, CSV e SQL",
          "API REST gratuita com 50 chamadas/dia",
        ]}
      />
    </PageShell>
  );
}
