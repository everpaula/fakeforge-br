import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import ApiCtaBanner from "@/components/ApiCtaBanner";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import GeneratorSchema from "@/components/GeneratorSchema";
import DevOnlyDisclaimer from "@/components/DevOnlyDisclaimer";
import { getEstado, getAllEstadoSlugs, getEstadosVizinhos } from "@/lib/data/estados-br";

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
    // Title <60 chars (SEO fix Ubersuggest 2026-09-24)
    title: `Gerador de RG ${estado.uf} para Testes | ${estado.nome}`,
    description: `Gere RG sintético para testes de software no ${estado.nome} (${estado.uf}). Formato ${estado.rg_orgao_emissor} conforme padrão do estado. Números fictícios que passam validação básica, uso restrito a desenvolvimento e QA. Grátis.`,
    keywords: `gerador de rg ${estado.uf.toLowerCase()}, gerador rg ${estado.nome.toLowerCase()}, rg ${estado.uf.toLowerCase()} para testes, ${estado.rg_orgao_emissor.toLowerCase()} rg, rg sintético ${estado.uf.toLowerCase()}, rg desenvolvimento ${estado.uf.toLowerCase()}`,
    alternates: { canonical: `/gerador-rg/${estado.slug}` },
    openGraph: {
      title: `Gerador de RG ${estado.uf} para Testes (${estado.nome})`,
      description: `RG sintético com formato ${estado.rg_orgao_emissor} para testes de software. Zero uso real, apenas desenvolvimento.`,
      type: "website",
      locale: "pt_BR",
    },
  };
}

export default async function GeradorRGPorEstado({ params }: PageProps) {
  const { uf } = await params;
  const estado = getEstado(uf);
  if (!estado) notFound();

  const vizinhos = getEstadosVizinhos(estado.uf);

  return (
    <PageShell>
      <div className="mb-6">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">
          {estado.regiao} · Órgão emissor {estado.rg_orgao_emissor}
        </p>
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">RG</span> {estado.uf}
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Gere números sintéticos de RG para testes de software no {estado.nome}. Cada estado brasileiro
          tem seu próprio formato de RG — no {estado.uf} o padrão é <strong className="text-foreground">{estado.rg_formato}</strong>,
          emitido pelo {estado.rg_orgao_emissor}. Ideal para popular banco de teste, validador de
          formulário e fixtures de QA.
        </p>
      </div>

      <DevOnlyDisclaimer dataType="documentos brasileiros" className="mb-6" />

      <SingleGenerator
        type="rg"
        label={`RG ${estado.uf}`}
        description={`Números sintéticos de RG no formato ${estado.rg_orgao_emissor} para testes.`}
      />

      <ApiCtaBanner dataType="RGs" />

      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Formato do RG no {estado.nome}</h2>
          <p>{estado.rg_contexto}</p>
          <p className="mt-2">
            Formato oficial: <strong className="text-foreground">{estado.rg_formato}</strong>. Órgão emissor:{" "}
            <strong className="text-foreground">{estado.rg_orgao_emissor}</strong>. Como o RG é
            responsabilidade estadual (diferente do CPF que é federal), cada estado tem regra própria
            de numeração, dígito verificador e órgão responsável.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Por que RG varia por estado</h2>
          <p>
            O RG (Registro Geral) foi criado pelo decreto-lei 4.500/1942 como documento de identidade
            emitido pelos estados. Cada UF define seu próprio padrão de numeração, órgão emissor,
            algoritmo de dígito verificador e formato de apresentação. Isso significa que um RG
            emitido no {estado.nome} tem formato diferente de um emitido em São Paulo, Rio de Janeiro
            ou qualquer outra UF. A CIN (Carteira de Identidade Nacional, implantada em 2022) padroniza
            o número em cima do CPF, mas o RG estadual continua sendo emitido paralelamente.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Casos de uso no {estado.nome}</h2>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>Testar cadastro de cliente em app com validação de RG por estado ({estado.capital} e demais cidades)</li>
            <li>Popular banco de teste de sistema de saúde, educação ou govtech no {estado.uf}</li>
            <li>Validar máscara de input que aceita formato {estado.rg_orgao_emissor}</li>
            <li>Fixtures pra teste E2E de fluxo de KYC em plataforma que serve o {estado.nome}</li>
            <li>Seed de banco de teste em CRM ou ERP com base de clientes do {estado.uf}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {[
              {
                q: `O RG gerado passa em validador de ${estado.uf}?`,
                a: `Passa se o validador só checa formato e dígito verificador matemático. Não passa se o sistema consulta a base do ${estado.rg_orgao_emissor} em tempo real — como o número é sintético, não existe no sistema estadual e retorna "não encontrado". Para testes de UI e persistência, funciona. Para teste de integração real, precisa de mock.`,
              },
              {
                q: `Qual a diferença entre RG ${estado.uf} e outros estados?`,
                a: `Cada estado tem formato próprio. No ${estado.nome}, o padrão é ${estado.rg_formato}. Em outros estados varia — São Paulo tem 8-9 dígitos + DV, Rio de Janeiro segue padrão IFP, Minas Gerais tem 9 dígitos. Sistemas que aceitam RG multi-estado precisam suportar todos os formatos. Para testes multi-região, gere RGs de vários estados diferentes.`,
              },
              {
                q: `Posso usar esse RG em cadastro real?`,
                a: `Não. Usar RG sintético em cadastro real, contrato, ou apresentar como documento verdadeiro é falsidade ideológica (art. 299 do Código Penal). O RG gerado aqui serve exclusivamente para preencher banco de dados de desenvolvimento, teste automatizado ou fixture de QA em ambiente controlado.`,
              },
              {
                q: `O RG gerado é de alguém real no ${estado.nome}?`,
                a: `Não. Todos os RGs são gerados algoritmicamente a partir de números aleatórios. Não usamos base de dados de pessoas reais, não consultamos ${estado.rg_orgao_emissor} nem qualquer outra fonte oficial. Estatisticamente pode coincidir com algum RG real por acaso, mas isso é aleatório — não há intenção nem meio de identificar pessoa real.`,
              },
              {
                q: `Como gerar RGs em massa via API para meu app em ${estado.uf}?`,
                a: `Use GET https://fakeforge.com.br/api/generate?type=rg&quantity=100. Free tier libera 50 chamadas/dia sem cadastro. Plano Dev (R$29/mês) libera 10.000 chamadas/dia com até 10.000 RGs por chamada — suficiente pra popular banco de teste em qualquer projeto que atenda ${estado.populacao_milhoes} milhões de habitantes do ${estado.nome}.`,
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
            <h2 className="text-lg font-semibold text-foreground mb-3">Geradores de RG em outros estados do {estado.regiao}</h2>
            <div className="flex flex-wrap gap-2">
              {vizinhos.map((v) => (
                <Link
                  key={v.uf}
                  href={`/gerador-rg/${v.slug}`}
                  className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors"
                >
                  RG {v.uf} · {v.nome}
                </Link>
              ))}
              <Link
                href="/gerador-rg"
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
        { name: "RG", url: "/gerador-rg" },
        { name: `RG ${estado.uf}`, url: `/gerador-rg/${estado.slug}` },
      ]} />

      <GeneratorSchema
        name={`Gerador de RG para Testes - ${estado.nome} (${estado.uf})`}
        url={`https://fakeforge.com.br/gerador-rg/${estado.slug}`}
        description={`Gere números sintéticos de RG para testes de software no ${estado.nome} (${estado.uf}). Formato ${estado.rg_formato} conforme padrão do ${estado.rg_orgao_emissor}. Uso restrito a desenvolvimento e QA.`}
        features={[
          `Formato oficial ${estado.rg_orgao_emissor}`,
          `Dígito verificador conforme regra do ${estado.uf}`,
          "Validador integrado",
          "Geração em lote até 10.000 por chamada",
          "Export JSON, CSV e SQL",
          "API REST gratuita com 50 chamadas/dia",
        ]}
      />
    </PageShell>
  );
}
