import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "FakeForge vs. Alternativas: Guia Completo de Escolha",
  description: "Comparação direta entre FakeForge e as principais alternativas para gerar dados brasileiros em testes: Faker.js, validate-docbr, python-brasilidades, laravel-brasil, Mockaroo, 4devs. Escolha a certa pro seu stack.",
  keywords: "fakeforge vs, gerador de dados brasileiros comparação, alternativa faker js brasil, alternativa validate-docbr, alternativa python-brasilidades, comparativo gerador cpf, melhor api dados fictícios brasileiros",
  alternates: { canonical: "/comparacoes" },
  openGraph: {
    title: "FakeForge vs. Alternativas: Guia Completo",
    description: "Comparação direta com todas as principais opções pra gerar dados brasileiros em testes.",
    type: "website",
    locale: "pt_BR",
  },
};

interface Comparison {
  slug: string;
  competitor: string;
  language: string;
  category: string;
  short: string;
  when: string;
}

const COMPARISONS: Comparison[] = [
  {
    slug: "fakeforge-vs-validate-docbr",
    competitor: "validate-docbr",
    language: "Node.js",
    category: "Biblioteca npm",
    short: "Biblioteca npm que valida (não gera) CPF/CNPJ. Não faz o que FakeForge faz e vice-versa.",
    when: "Use validate-docbr pra CHECAR se input do user é válido. Use FakeForge pra GERAR CPFs/CNPJs válidos em teste.",
  },
  {
    slug: "fakeforge-vs-python-brasilidades",
    competitor: "python-brasilidades",
    language: "Python",
    category: "Biblioteca pip",
    short: "Biblioteca Python com dados brasileiros. Alternativa mais próxima do FakeForge no ecosistema Python.",
    when: "Se você faz Python puro, python-brasilidades cobre básico. Se precisa CNPJ alfanumérico 2026, presets correlacionados ou API HTTP, FakeForge.",
  },
  {
    slug: "fakeforge-vs-fakerjs",
    competitor: "Faker.js",
    language: "Node.js",
    category: "Biblioteca npm",
    short: "Faker.js tem localização pt-BR mas não valida documentos brasileiros. Complementa em vez de competir.",
    when: "Faker.js pra dados neutros (data, cor, texto). FakeForge pra documentos BR que precisam passar validação.",
  },
  {
    slug: "fakeforge-vs-faker-py",
    competitor: "Faker (Python)",
    language: "Python",
    category: "Biblioteca pip",
    short: "Versão Python do Faker. Mesmo trade-off: cobre localização geral mas não valida documentos brasileiros.",
    when: "Faker pra nome/endereço genérico. FakeForge pra CPF/CNPJ com mod-11 real.",
  },
  {
    slug: "fakeforge-vs-mockaroo",
    competitor: "Mockaroo",
    language: "Web/API",
    category: "SaaS internacional",
    short: "Mockaroo é forte em qualquer tipo de dado, mas fraco em documentos brasileiros específicos.",
    when: "Mockaroo pra volume gigante de dados sintéticos genéricos. FakeForge pra especificidade BR (CNPJ alfa, PIX BACEN, DDD ANATEL).",
  },
  {
    slug: "fakeforge-vs-4devs",
    competitor: "4devs",
    language: "Web only",
    category: "Ferramenta web",
    short: "4devs é o gigante em tráfego BR (331K visitas/mês só em CPF) mas não tem API. Só interface web copy-paste.",
    when: "4devs pra 1 CPF pontual no browser. FakeForge pra integrar em CI/CD, seed de banco, bulk via API.",
  },
  {
    slug: "fakeforge-vs-alternativas",
    competitor: "Todas",
    language: "Múltiplas",
    category: "Overview",
    short: "Visão geral de todas as alternativas com árvore de decisão.",
    when: "Se você quer entender o panorama antes de escolher.",
  },
];

export default function ComparacoesHub() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Guia de escolha</p>
        <h1 className="text-3xl font-bold tracking-tight">
          FakeForge vs. <span className="text-primary">as alternativas</span>
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Cada dev BR fazendo teste eventualmente compara FakeForge com faker-js, validate-docbr,
          python-brasilidades ou 4devs. Aqui estão as comparações diretas com cada uma - o que cada
          ferramenta faz de melhor, onde o FakeForge complementa (não substitui) e quando cada uma
          é a escolha certa.
        </p>
      </div>

      {/* Tabela geral rapida */}
      <div className="mb-10 rounded-xl bg-card border border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Recurso × ferramenta</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-3 py-2 text-muted-foreground font-medium">Recurso</th>
                <th className="text-center px-3 py-2 text-primary font-medium">FakeForge</th>
                <th className="text-center px-3 py-2 text-muted-foreground font-medium">Faker.js</th>
                <th className="text-center px-3 py-2 text-muted-foreground font-medium">validate-docbr</th>
                <th className="text-center px-3 py-2 text-muted-foreground font-medium">python-brasilidades</th>
                <th className="text-center px-3 py-2 text-muted-foreground font-medium">4devs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["CPF com mod-11", "✅", "❌", "🔵 valida", "✅", "✅"],
                ["CNPJ com mod-11", "✅", "❌", "🔵 valida", "✅", "✅"],
                ["CNPJ alfanumérico 2026", "✅", "❌", "❌", "❌", "❌"],
                ["Cartão com Luhn", "✅", "❌", "❌", "❌", "✅"],
                ["PIX BACEN (4 formatos)", "✅", "❌", "❌", "❌", "❌"],
                ["Correlação nome ↔ email ↔ DDD", "✅", "❌", "❌", "❌", "❌"],
                ["Presets bundle (customer, employee)", "✅", "❌", "❌", "❌", "❌"],
                ["17 bancos brasileiros com DV", "✅", "❌", "❌", "❌", "Parcial"],
                ["API REST", "✅", "❌", "❌", "❌", "❌"],
                ["SDK Node oficial", "✅ (npm)", "✅", "✅", "❌", "❌"],
                ["SDK Python oficial", "✅ (pip)", "❌", "❌", "✅", "❌"],
                ["Free tier grátis", "✅", "✅", "✅", "✅", "✅"],
                ["Uso pra CI/CD sem instalar dep por linguagem", "✅", "❌", "❌", "❌", "❌"],
              ].map(([recurso, ff, fkr, docbr, brasilidades, devs], i) => (
                <tr key={i}>
                  <td className="px-3 py-2 text-muted-foreground">{recurso}</td>
                  <td className="px-3 py-2 text-center text-foreground font-medium">{ff}</td>
                  <td className="px-3 py-2 text-center text-muted-foreground">{fkr}</td>
                  <td className="px-3 py-2 text-center text-muted-foreground">{docbr}</td>
                  <td className="px-3 py-2 text-center text-muted-foreground">{brasilidades}</td>
                  <td className="px-3 py-2 text-center text-muted-foreground">{devs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-muted px-5 py-3 border-t border-border">
          🔵 = valida input do user (não gera). Complementa geradores em vez de competir.
        </p>
      </div>

      {/* Cards de cada comparacao */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-foreground mb-4">Comparações detalhadas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {COMPARISONS.map((c) => (
            <Link
              key={c.slug}
              href={`/comparacao/${c.slug}`}
              className="group block rounded-xl bg-card border border-border p-5 hover:border-primary/30 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="text-[10px] text-muted uppercase tracking-wider font-bold">{c.category}</p>
                  <h3 className="text-base font-bold text-foreground mt-1 group-hover:text-primary transition-colors">
                    FakeForge vs. {c.competitor}
                  </h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-background border border-border text-muted-foreground shrink-0">
                  {c.language}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                {c.short}
              </p>
              <p className="text-xs text-foreground leading-relaxed">
                <strong className="text-primary text-[10px] uppercase tracking-wider">Quando escolher:</strong><br />
                {c.when}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Arvore de decisao */}
      <div className="mb-10 rounded-xl bg-primary/5 border border-primary/20 p-5 sm:p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Não sabe qual escolher? Árvore de decisão</h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div>
            <p className="text-foreground font-semibold">Você precisa GERAR ou VALIDAR documentos?</p>
            <p className="mt-1 leading-relaxed">
              → <strong className="text-foreground">Validar input do user:</strong> validate-docbr (Node) ou python-brasilidades (Python). Bibliotecas específicas com zero overhead.
            </p>
            <p className="mt-1 leading-relaxed">
              → <strong className="text-foreground">Gerar em teste:</strong> continua abaixo.
            </p>
          </div>

          <div>
            <p className="text-foreground font-semibold">Precisa de correlação entre campos (email deriva do nome, DDD × UF)?</p>
            <p className="mt-1 leading-relaxed">
              → <strong className="text-foreground">Sim:</strong> FakeForge (único com presets correlacionados)
            </p>
            <p className="mt-1 leading-relaxed">
              → <strong className="text-foreground">Não, campos independentes:</strong> continua abaixo.
            </p>
          </div>

          <div>
            <p className="text-foreground font-semibold">Precisa de CNPJ alfanumérico (novo formato 2026)?</p>
            <p className="mt-1 leading-relaxed">
              → <strong className="text-foreground">Sim:</strong> FakeForge (único que cobre IN RFB 2.229)
            </p>
            <p className="mt-1 leading-relaxed">
              → <strong className="text-foreground">Não, só CNPJ numérico tradicional:</strong> continua.
            </p>
          </div>

          <div>
            <p className="text-foreground font-semibold">Faz o quê?</p>
            <p className="mt-1 leading-relaxed">
              → <strong className="text-foreground">Node.js, monolito:</strong> validate-docbr + faker.pt-BR
            </p>
            <p className="mt-1 leading-relaxed">
              → <strong className="text-foreground">Python, monolito:</strong> python-brasilidades
            </p>
            <p className="mt-1 leading-relaxed">
              → <strong className="text-foreground">Stack polyglot (Node + Python + Go + PHP em CI):</strong> FakeForge via API (zero dep por linguagem)
            </p>
            <p className="mt-1 leading-relaxed">
              → <strong className="text-foreground">Só teste manual no browser:</strong> 4devs
            </p>
          </div>
        </div>
      </div>

      {/* Instalacao rapida FakeForge */}
      <div className="mb-8 rounded-xl bg-card border border-border p-5">
        <h2 className="text-sm font-semibold text-foreground mb-3">Instalação rápida do FakeForge</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-2">SDK Node.js</p>
            <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`npm install fakeforge-br

import { FakeForge } from "fakeforge-br";
const ff = new FakeForge();
const cpfs = await ff.cpf(10);`}</code></pre>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-2">SDK Python</p>
            <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`pip install fakeforge-br

from fakeforge import FakeForge
ff = FakeForge()
cpfs = ff.cpf(10)`}</code></pre>
          </div>

          <div className="sm:col-span-2">
            <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-2">Sem SDK (qualquer linguagem)</p>
            <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`curl "https://fakeforge.com.br/api/generate?type=cpf&quantity=10"`}</code></pre>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
