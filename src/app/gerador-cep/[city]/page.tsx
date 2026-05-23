import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import ApiCtaBanner from "@/components/ApiCtaBanner";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import GeneratorSchema from "@/components/GeneratorSchema";
import { CEP_CITIES, getCity, getAllCitySlugs } from "@/lib/cep-cities";

type Params = Promise<{ city: string }>;

export async function generateStaticParams() {
  return getAllCitySlugs().map((city) => ({ city }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { city: slug } = await params;
  const city = getCity(slug);
  if (!city) return { title: "Cidade não encontrada | FakeForge BR" };

  return {
    title: `Gerador de CEP ${city.name} — Endereços ${city.stateCode} válidos para testes | FakeForge BR`,
    description: `Gere CEP e endereço fictício de ${city.name} (${city.stateCode}) para testes de software. Prefixo ${city.cepPrefix}, bairros reais (${city.neighborhoods.slice(0, 3).join(", ")}), formato Correios válido. Grátis e sem cadastro.`,
    keywords: `gerador de cep ${city.name.toLowerCase()}, cep ${city.stateCode.toLowerCase()} válido, gerador endereço ${city.name.toLowerCase()}, cep fictício ${city.stateCode.toLowerCase()}, cep para testes ${city.name.toLowerCase()}`,
    alternates: { canonical: `/gerador-cep/${slug}` },
    openGraph: {
      title: `Gerador de CEP ${city.name} — FakeForge BR`,
      description: `Gere CEP e endereço fictício de ${city.name} (${city.stateCode}) para testes. Prefixo ${city.cepPrefix}, bairros reais, sem cadastro.`,
      type: "website",
    },
  };
}

export default async function GeradorCepCity({ params }: { params: Params }) {
  const { city: slug } = await params;
  const city = getCity(slug);
  if (!city) notFound();

  return (
    <PageShell>
      <div className="mb-6">
        <Link
          href="/gerador-cep"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Voltar para o gerador de CEP geral
        </Link>
      </div>

      <div className="mb-8">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Gerador de CEP · {city.stateCode}
        </p>
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de CEP <span className="text-primary">{city.name}</span>
        </h1>
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed max-w-2xl">
          Gere CEP e endereço fictício de {city.name} ({city.stateCode}) para testes de software.
          Bairros e prefixos reais da cidade, formato Correios válido, sem armazenamento de dados.
        </p>
      </div>

      <SingleGenerator
        type="address"
        label="Endereço"
        description="Clique em Gerar para criar endereços fictícios"
      />

      <ApiCtaBanner dataType="endereços" />

      {/* Hero context */}
      <div className="mt-12 rounded-xl bg-primary/5 border border-primary/20 p-6">
        <h2 className="text-lg font-semibold text-foreground mb-3">
          CEPs de {city.name}: o que você precisa saber
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{city.intro}</p>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-md text-xs bg-primary/10 border border-primary/20 text-primary font-medium">
            Prefixo {city.cepPrefix}
          </span>
          <span className="px-3 py-1 rounded-md text-xs bg-card border border-border text-muted-foreground">
            {city.stateCode} · {city.state}
          </span>
        </div>
      </div>

      {/* SEO content */}
      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">
            Bairros de {city.name} usados na geração
          </h2>
          <p className="mb-3">
            O gerador do FakeForge usa uma base de bairros reais de {city.name}, mantendo
            coerência entre bairro, cidade e CEP. Os bairros incluídos:
          </p>
          <div className="flex flex-wrap gap-2">
            {city.neighborhoods.map((b) => (
              <span
                key={b}
                className="px-3 py-1.5 rounded-md text-xs bg-card border border-border text-foreground"
              >
                {b}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Por que usar CEP específico de {city.name} em testes?
          </h2>
          <p>
            Sistemas que validam CEP por região (e-commerce com frete por estado, planos de
            saúde, marketplaces com restrição geográfica) precisam de dados de teste coerentes
            geograficamente. CEP genérico aleatório pode não corresponder à cidade ou estado
            esperado pelo sistema. O gerador filtrado por cidade garante que estado, cidade,
            bairro e CEP estejam alinhados com a realidade dos Correios.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Estado de {city.state} no contexto de CEPs
          </h2>
          <p>{city.stateContext}</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Como integrar com seus testes automatizados
          </h2>
          <p>
            Use a API REST do FakeForge para gerar endereços de {city.name} em testes Cypress,
            Playwright, Jest ou Vitest. A API retorna JSON estruturado com cep, street,
            neighborhood, city, state e stateCode separados, fáceis de mapear para qualquer
            schema de formulário.
          </p>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Perguntas frequentes</h2>
          <div className="space-y-4">
            {[
              {
                q: `Os CEPs gerados de ${city.name} existem de verdade?`,
                a: `Os prefixos e bairros são reais, mas as combinações completas (CEP + rua + número) são geradas algoritmicamente. O CEP gerado segue o formato dos Correios e passa em validação de formato, mas não corresponde a um endereço cadastrado existente. É ideal para testes sem violar LGPD.`,
              },
              {
                q: `Posso confiar que o CEP gerado bate com ${city.name}?`,
                a: `Sim. O gerador usa o prefixo ${city.cepPrefix} para ${city.name} e mantém o estado (${city.stateCode}) e cidade coerentes. Qualquer sistema que valida CEP por região aceitará o endereço como pertencente a ${city.name}.`,
              },
              {
                q: `O gerador inclui zonas como CEP 0 (caixa postal)?`,
                a: `Não. O FakeForge gera apenas CEPs residenciais ou comerciais regulares. Caixas postais, grandes usuários (CEP terminando em 999) e CEPs especiais não estão incluídos por padrão.`,
              },
              {
                q: `Posso gerar endereços em massa de ${city.name} via API?`,
                a: `Sim. Use a API com filtro de cidade: POST https://fakeforge.com.br/api/generate com {"type": "address", "filters": {"city": "${city.name}"}, "quantity": 100}. São 100 chamadas grátis por dia no plano Free.`,
              },
              {
                q: `O FakeForge cobre todos os bairros de ${city.name}?`,
                a: `Atualmente cobrimos os ${city.neighborhoods.length} bairros mais conhecidos de ${city.name}, escolhidos por relevância e cobertura representativa da cidade. Outros bairros podem ser incluídos conforme demanda — abra uma issue no GitHub se precisar de um específico.`,
              },
            ].map(({ q, a }) => (
              <details key={q} className="group border border-border rounded-lg">
                <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                  <span className="text-sm font-medium text-foreground">{q}</span>
                  <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">
                    +
                  </span>
                </summary>
                <p className="px-4 pb-3 text-sm text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>

      {/* Cross-links: other cities */}
      <div className="mt-12 pt-8 border-t border-border">
        <h2 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wider">
          Outras cidades
        </h2>
        <div className="flex flex-wrap gap-2">
          {CEP_CITIES.filter((c) => c.slug !== slug)
            .slice(0, 8)
            .map((c) => (
              <Link
                key={c.slug}
                href={`/gerador-cep/${c.slug}`}
                className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors"
              >
                Gerador CEP {c.name}
              </Link>
            ))}
          <Link
            href="/gerador-cep"
            className="px-3 py-1.5 rounded-lg text-xs bg-primary/10 border border-primary/30 text-primary font-medium hover:bg-primary/20 transition-colors"
          >
            Todos os CEPs
          </Link>
        </div>
      </div>

      <BreadcrumbSchema
        items={[
          { name: "Início", url: "/" },
          { name: "Geradores", url: "/geradores" },
          { name: "CEP", url: "/gerador-cep" },
          { name: city.name, url: `/gerador-cep/${slug}` },
        ]}
      />

      <GeneratorSchema
        name={`Gerador de CEP ${city.name}`}
        url={`https://fakeforge.com.br/gerador-cep/${slug}`}
        description={`Gere CEP e endereço fictício de ${city.name} (${city.stateCode}) para testes de software. Prefixo ${city.cepPrefix}, bairros reais como ${city.neighborhoods.slice(0, 3).join(", ")}, formato Correios válido.`}
        features={[
          `Prefixo CEP ${city.cepPrefix} usado em ${city.name}`,
          `${city.neighborhoods.length} bairros reais cobertos`,
          "Coerência entre cidade, bairro, estado e CEP",
          "Formato Correios padrão (XXXXX-XXX)",
          "Geração em lote até 10.000 endereços",
          "Export JSON, CSV e SQL",
          "API REST gratuita com 100 chamadas/dia",
        ]}
      />
    </PageShell>
  );
}
