import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "FakeForge vs 4devs vs Faker.js vs fakerbr — Comparação Completa",
  description: "Comparativo técnico entre FakeForge BR e as principais alternativas para gerar dados brasileiros de teste: 4devs.com.br, Faker.js (locale pt_BR), fakerbr (npm). Recursos, API, validação e quando usar cada um.",
  keywords: "fakeforge vs 4devs, alternativa faker.js brasil, comparação geradores dados brasileiros, fakerbr alternativa, melhor gerador cpf cnpj brasil",
  alternates: { canonical: "/comparacao/fakeforge-vs-alternativas" },
};

const COMPARISON = [
  ["CPF válido (mod-11)", "✓", "✓", "Não nativo", "✓"],
  ["CNPJ válido (mod-11)", "✓", "✓", "Não nativo", "✓"],
  ["CNPJ Alfanumérico (2026)", "✓", "—", "—", "—"],
  ["CIN (novo RG)", "✓", "—", "—", "—"],
  ["CNH válida (DENATRAN)", "✓", "—", "—", "—"],
  ["Chave PIX (4 formatos BACEN)", "✓", "—", "—", "—"],
  ["Cartão de crédito (Luhn)", "✓", "—", "Genérico", "—"],
  ["CEP coerente por estado", "✓", "Parcial", "—", "Parcial"],
  ["Dados correlacionados", "✓", "—", "—", "—"],
  ["API REST", "✓", "—", "—", "—"],
  ["Export SQL/CSV pronto", "✓", "—", "—", "—"],
  ["Interface web grátis", "✓", "✓", "—", "—"],
  ["Zero deps no projeto", "✓", "N/A", "—", "—"],
  ["Open for AI agents (/llms.txt)", "✓", "—", "—", "—"],
  ["Atualização ativa em 2026", "✓", "Sim", "Sim", "Irregular"],
];

export default function Comparacao() {
  return (
    <PageShell>
      <article className="max-w-3xl">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            FakeForge vs <span className="text-primary">4devs</span> vs <span className="text-accent">Faker.js</span> vs fakerbr
          </h1>
          <p className="text-muted-foreground mt-4 text-sm sm:text-base leading-relaxed">
            Comparação técnica e honesta entre os principais geradores de dados brasileiros de teste em 2026.
            Cobre acurácia de validação, formatos suportados, automação via API e quando usar cada um.
          </p>
        </div>

        {/* TLDR Box */}
        <div className="rounded-xl bg-primary/5 border border-primary/20 p-5 mb-10">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">TL;DR</p>
          <ul className="text-sm space-y-1.5 text-foreground">
            <li><strong>Use FakeForge se:</strong> precisa de API REST, dados correlacionados, CNPJ alfanumérico, CIN, ou export SQL pronto.</li>
            <li><strong>Use 4devs se:</strong> só precisa de geração manual rápida, no navegador, sem integração programática.</li>
            <li><strong>Use Faker.js se:</strong> seu projeto é internacional e dados BR não precisam ser válidos no algoritmo oficial.</li>
            <li><strong>Use fakerbr se:</strong> quer biblioteca npm gratuita, projeto Node.js, e não precisa de API hospedada nem PIX.</li>
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
                  <th className="text-center px-4 py-3 text-muted-foreground font-medium">4devs</th>
                  <th className="text-center px-4 py-3 text-muted-foreground font-medium">Faker.js (pt_BR)</th>
                  <th className="text-center px-4 py-3 text-muted-foreground font-medium">fakerbr (npm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {COMPARISON.map(([feature, ff, devs, faker, fbr], i) => (
                  <tr key={i}>
                    <td className="px-4 py-2.5 text-muted-foreground">{feature}</td>
                    <td className="px-4 py-2.5 text-center text-primary font-medium">{ff}</td>
                    <td className="px-4 py-2.5 text-center">{devs}</td>
                    <td className="px-4 py-2.5 text-center">{faker}</td>
                    <td className="px-4 py-2.5 text-center">{fbr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-foreground mb-4">Análise detalhada</h2>

        <section className="prose-custom space-y-6 text-sm text-muted-foreground leading-relaxed">
          <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">FakeForge BR</h3>
          <p>
            Plataforma 100% focada no Brasil. Implementa todos os algoritmos oficiais (mod-11 da Receita
            para CPF/CNPJ, Luhn para cartão, ASCII -48 para CNPJ alfanumérico, mod-11 invertido do DENATRAN
            para CNH). Diferencial principal: <strong className="text-foreground">dados correlacionados</strong> —
            quando você gera uma &quot;pessoa completa&quot;, o email usa o nome, o DDD bate com o estado, o
            CEP corresponde à cidade, o cartão tem o nome do titular.
          </p>
          <p>
            Tem API REST documentada (raro no nicho), export em JSON/CSV/SQL com CREATE TABLE pronto,
            e cobre formatos novos como CNPJ alfanumérico (vigência 01/07/2026) e CIN (substituto do RG).
            Modelo freemium: web ilimitado grátis, API com 100 chamadas grátis por dia.
          </p>
          <p>
            <strong>Pontos fortes:</strong> API REST, dados correlacionados, cobertura ampla, atualização ativa.<br />
            <strong>Pontos fracos:</strong> domínio mais novo que 4devs, menos backlinks ainda.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-8 mb-2">4devs.com.br</h3>
          <p>
            Veterano do nicho, no ar há mais de uma década. Tem dezenas de geradores cobrindo desde CPF
            até gerador de música. Interface web minimalista. <strong className="text-foreground">Sem API</strong> —
            uso exclusivamente manual via browser.
          </p>
          <p>
            <strong>Pontos fortes:</strong> autoridade de domínio alta, indexação consolidada, cobertura ampla de geradores variados.<br />
            <strong>Pontos fracos:</strong> sem API REST, sem dados correlacionados, sem export estruturado, UX desatualizada.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-8 mb-2">Faker.js (locale pt_BR)</h3>
          <p>
            Biblioteca JavaScript mantida pela comunidade. Cobre nomes brasileiros, endereços e telefones
            no locale pt_BR, mas <strong className="text-foreground">não gera CPF/CNPJ válidos nativamente</strong>—
            precisa de complemento de outras libs. Excelente quando o projeto é internacional e o Brasil é apenas
            um dos locais suportados.
          </p>
          <p>
            <strong>Pontos fortes:</strong> ecossistema gigante, suporte multi-idioma, atualização ativa, comunidade enorme.<br />
            <strong>Pontos fracos:</strong> sem CPF/CNPJ válidos, sem PIX, sem CNH, sem cartão Elo/Hipercard, sem dados correlacionados.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-8 mb-2">fakerbr (npm)</h3>
          <p>
            Pacote npm focado em documentos brasileiros. Gera CPF, CNPJ, RG e inscrição estadual. Leve e
            direto, mas escopo limitado a documentos. <strong className="text-foreground">Sem PIX, sem cartão, sem dados de pessoa completa</strong>.
            Manutenção tem sido irregular.
          </p>
          <p>
            <strong>Pontos fortes:</strong> leve, foco em documentos, sem dependências pesadas.<br />
            <strong>Pontos fracos:</strong> escopo estreito, sem API hospedada, manutenção irregular, sem dados correlacionados.
          </p>
        </section>

        <h2 className="text-xl font-semibold text-foreground mt-12 mb-4">Quando escolher cada um</h2>
        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <div className="rounded-lg bg-card border border-border p-5">
            <h3 className="text-base font-semibold text-foreground mb-2">Cenário 1 — App SaaS brasileiro com staging que precisa de seed</h3>
            <p><strong className="text-primary">FakeForge.</strong> A API REST com export SQL gera 1000 clientes correlacionados em uma chamada. Sem código, sem dependência.</p>
          </div>
          <div className="rounded-lg bg-card border border-border p-5">
            <h3 className="text-base font-semibold text-foreground mb-2">Cenário 2 — Teste rápido manual de um formulário</h3>
            <p><strong className="text-foreground">4devs.</strong> Abre o site, copia, cola. Sem setup.</p>
          </div>
          <div className="rounded-lg bg-card border border-border p-5">
            <h3 className="text-base font-semibold text-foreground mb-2">Cenário 3 — App internacional com mercado BR como um entre vários</h3>
            <p><strong className="text-foreground">Faker.js.</strong> Mantém um único stack de fake data para todos os locales.</p>
          </div>
          <div className="rounded-lg bg-card border border-border p-5">
            <h3 className="text-base font-semibold text-foreground mb-2">Cenário 4 — Projeto Node.js que só precisa de CPF/CNPJ no código</h3>
            <p><strong className="text-foreground">fakerbr.</strong> Pacote npm leve, instala e usa.</p>
          </div>
          <div className="rounded-lg bg-card border border-border p-5">
            <h3 className="text-base font-semibold text-foreground mb-2">Cenário 5 — Sistema que precisa migrar para CNPJ alfanumérico em julho/2026</h3>
            <p><strong className="text-primary">FakeForge.</strong> Único da lista que já implementa o novo formato — gere CNPJs alfanuméricos válidos antes da virada.</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-foreground mt-12 mb-4">Comparações detalhadas</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Cada concorrente tem uma página dedicada com tabela de 24 recursos, exemplos de código
          lado a lado e cenários de uso. Vá direto para o que interessa:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
          <Link
            href="/comparacao/fakeforge-vs-mockaroo"
            className="rounded-lg bg-card border border-border p-4 hover:border-primary/40 hover:bg-card-hover transition-all group"
          >
            <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">FakeForge vs Mockaroo</p>
            <p className="text-xs text-muted-foreground mt-1">Mockaroo é internacional com 200+ tipos. FakeForge é BR especialista.</p>
          </Link>
          <Link
            href="/comparacao/fakeforge-vs-fakerjs"
            className="rounded-lg bg-card border border-border p-4 hover:border-primary/40 hover:bg-card-hover transition-all group"
          >
            <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">FakeForge vs Faker.js</p>
            <p className="text-xs text-muted-foreground mt-1">Lib JS internacional com locale pt_BR, CPF/CNPJ sem mod-11 nativo.</p>
          </Link>
          <Link
            href="/comparacao/fakeforge-vs-4devs"
            className="rounded-lg bg-card border border-border p-4 hover:border-primary/40 hover:bg-card-hover transition-all group"
          >
            <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">FakeForge vs 4devs</p>
            <p className="text-xs text-muted-foreground mt-1">4devs é veterano BR sem API. FakeForge é API + correlação + export SQL.</p>
          </Link>
          <Link
            href="/comparacao/fakeforge-vs-faker-py"
            className="rounded-lg bg-card border border-border p-4 hover:border-primary/40 hover:bg-card-hover transition-all group"
          >
            <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">FakeForge vs Faker (Python)</p>
            <p className="text-xs text-muted-foreground mt-1">Faker.py tem CPF/CNPJ válidos. Falta PIX, CNH, CIN e correlação.</p>
          </Link>
        </div>

        <div className="mt-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 p-6 text-center">
          <h2 className="text-lg font-semibold text-foreground">Quer começar agora?</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            Use os geradores grátis no navegador, sem cadastro. Para automação, a API REST tem 100 chamadas grátis por dia.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center mt-4">
            <Link href="/geradores" className="px-5 py-2 rounded-lg text-xs font-medium bg-primary text-white hover:bg-primary-hover transition-colors">
              Ver todos os geradores
            </Link>
            <Link href="/docs" className="px-5 py-2 rounded-lg text-xs font-medium border border-border text-foreground hover:border-border-hover transition-colors">
              Documentação da API
            </Link>
          </div>
        </div>
      </article>

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Comparações", url: "/comparacao/fakeforge-vs-alternativas" },
        { name: "FakeForge vs Alternativas", url: "/comparacao/fakeforge-vs-alternativas" },
      ]} />
    </PageShell>
  );
}
