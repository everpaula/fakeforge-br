import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de Empresa em Node.js: SDK + Seed Prisma e Sequelize",
  description: "Gere empresa fictícia completa em Node.js/TypeScript (CNPJ, razão social, endereço) com SDK fakeforge-br. Seed pronto pra Prisma e Sequelize. Grátis 50/dia.",
  keywords: "gerador de empresa nodejs, gerar cnpj node, empresa fake typescript, prisma seed empresa, sequelize seed empresa, cnpj node preset company",
  alternates: { canonical: "/gerador-empresa-nodejs" },
  openGraph: { title: "Gerador de Empresa em Node.js", description: "SDK + seed Prisma e Sequelize.", type: "article", locale: "pt_BR" },
};

export default function GeradorEmpresaNodejs() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Node.js · TypeScript · SDK</p>
        <h1 className="text-3xl font-bold tracking-tight">Gerador de <span className="text-primary">Empresa em Node.js</span></h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          SDK <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">fakeforge-br</code> gera empresa fictícia completa com CNPJ válido, razão social, endereço e telefone correlacionados. TypeScript nativo, seed pronto pra Prisma e Sequelize.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`npm install fakeforge-br

import { FakeForge } from "fakeforge-br"
const empresas = await new FakeForge().company(50)`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Rota 1: SDK oficial fakeforge-br</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`import { FakeForge } from "fakeforge-br"

const ff = new FakeForge()

// 50 empresas fictícias completas
const empresas = await ff.company(50)
empresas.forEach(e => console.log(e.razaoSocial, e.cnpj, e.endereco.estado))

// Só o CNPJ, sem os outros campos
const cnpjs = await ff.cnpj(1000)`}</code></pre>
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          CNPJ, razão social, endereço e telefone já correlacionados, bulk até 10k por chamada. Requer internet.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Rota 2: algoritmo local (offline)</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// empresa.ts - algoritmo local, offline
const SUFIXOS = ["LTDA", "S.A.", "ME", "EIRELI"]
const DDD_PARA_ESTADO: Record<number, string> = {
  11: "SP", 21: "RJ", 31: "MG", 41: "PR",
  51: "RS", 61: "DF", 71: "BA", 81: "PE", 91: "PA",
}

function gerarCnpj(formatado = true): string {
  const n = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).concat([0, 0, 0, 1])

  const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

  const s1 = n.reduce((acc, v, i) => acc + v * pesos1[i], 0)
  const d1 = s1 % 11 < 2 ? 0 : 11 - (s1 % 11)
  n.push(d1)

  const s2 = n.reduce((acc, v, i) => acc + v * pesos2[i], 0)
  const d2 = s2 % 11 < 2 ? 0 : 11 - (s2 % 11)
  n.push(d2)

  if (!formatado) return n.join("")
  return \`\${n[0]}\${n[1]}.\${n[2]}\${n[3]}\${n[4]}.\${n[5]}\${n[6]}\${n[7]}/\${n[8]}\${n[9]}\${n[10]}\${n[11]}-\${n[12]}\${n[13]}\`
}

export function gerarEmpresa() {
  const ddds = Object.keys(DDD_PARA_ESTADO).map(Number)
  const ddd = ddds[Math.floor(Math.random() * ddds.length)]

  return {
    razaoSocial: \`Comercial \${Math.floor(100 + Math.random() * 900)} \${SUFIXOS[Math.floor(Math.random() * SUFIXOS.length)]}\`,
    cnpj: gerarCnpj(),
    estado: DDD_PARA_ESTADO[ddd],
    telefone: \`(\${ddd}) 9\${Math.floor(1000 + Math.random() * 9000)}-\${Math.floor(1000 + Math.random() * 9000)}\`,
  }
}`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Uso em Prisma (seed)</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// prisma/seed.ts
import { PrismaClient } from "@prisma/client"
import { FakeForge } from "fakeforge-br"

const prisma = new PrismaClient()
const ff = new FakeForge()

async function main() {
  const empresas = await ff.company(500)

  await prisma.empresa.createMany({
    data: empresas.map(e => ({
      razaoSocial: e.razaoSocial,
      cnpj: e.cnpj,
      estado: e.endereco.estado,
      telefone: e.telefone,
    })),
  })

  console.log(\`\${empresas.length} empresas seeded\`)
}

main().finally(() => prisma.$disconnect())`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Uso em Sequelize (bulk seed)</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// seeders/20260101000000-empresas.js
const { FakeForge } = require("fakeforge-br")

module.exports = {
  async up(queryInterface) {
    const ff = new FakeForge()
    const empresas = await ff.company(500)

    await queryInterface.bulkInsert(
      "Empresas",
      empresas.map(e => ({
        razaoSocial: e.razaoSocial,
        cnpj: e.cnpj,
        estado: e.endereco.estado,
        telefone: e.telefone,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    )
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Empresas", null, {})
  },
}`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Comparação: qual escolher</h2>
        <div className="overflow-x-auto rounded-lg bg-card border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-3 py-2 text-muted">Cenário</th>
                <th className="text-center px-3 py-2 text-muted">SDK fakeforge-br</th>
                <th className="text-center px-3 py-2 text-muted">Algoritmo local</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["Só CNPJ simples", "✅", "✅"],
                ["Empresa completa correlacionada", "✅", "⚠️ simplificado"],
                ["100% offline", "❌", "✅"],
                ["Bulk 10k+", "✅ 1 chamada", "⚠️ loop"],
                ["Custo", "Free 50/dia", "R$0"],
              ].map(([c, sdk, local], i) => (
                <tr key={i}>
                  <td className="px-3 py-2 text-muted-foreground">{c}</td>
                  <td className="px-3 py-2 text-center text-foreground">{sdk}</td>
                  <td className="px-3 py-2 text-center text-foreground">{local}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Perguntas frequentes</h2>
        <div className="space-y-4">
          {[
            { q: "Como gerar CNPJ válido em Node.js?", a: "Use new FakeForge().cnpj(n) do SDK fakeforge-br, ou implemente o algoritmo mod-11 local em TypeScript puro, sem dependência externa." },
            { q: "O SDK tem seed pronto pra Prisma?", a: "O SDK retorna objetos JS normais, então basta mapear os campos pra createMany do Prisma ou bulkInsert do Sequelize, como nos exemplos desta página." },
            { q: "Dá pra gerar empresa correlacionada com estado do telefone em Node.js?", a: "Sim. Tanto o SDK (ff.company) quanto o algoritmo local usam um DDD que corresponde ao estado do endereço, mantendo os dados coerentes entre si." },
            { q: "Preciso de tipos extras pra usar o SDK em TypeScript?", a: "Não. O pacote fakeforge-br já inclui tipagem nativa pra todos os métodos, incluindo company()." },
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

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Próximos passos</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Testar API</Link>
          <Link href="/gerador-empresa-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Versão Python</Link>
          <Link href="/gerador-empresa-curl" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Versão curl</Link>
          <Link href="/gerador-empresa" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Gerador de Empresa</Link>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Como gerar CNPJ válido em Node.js?", acceptedAnswer: { "@type": "Answer", text: "Use new FakeForge().cnpj(n) do SDK fakeforge-br, ou implemente o algoritmo mod-11 local em TypeScript puro." } },
              { "@type": "Question", name: "O SDK tem seed pronto pra Prisma?", acceptedAnswer: { "@type": "Answer", text: "O SDK retorna objetos JS normais, então basta mapear pra createMany do Prisma ou bulkInsert do Sequelize." } },
              { "@type": "Question", name: "Dá pra gerar empresa correlacionada com estado do telefone em Node.js?", acceptedAnswer: { "@type": "Answer", text: "Sim. O SDK e o algoritmo local usam um DDD que corresponde ao estado do endereço, mantendo os dados coerentes." } },
              { "@type": "Question", name: "Preciso de tipos extras pra usar o SDK em TypeScript?", acceptedAnswer: { "@type": "Answer", text: "Não. O pacote fakeforge-br já inclui tipagem nativa pra todos os métodos, incluindo company()." } },
            ],
          }),
        }}
      />

      <BreadcrumbSchema items={[{ name: "Início", url: "/" }, { name: "Gerador Empresa", url: "/gerador-empresa" }, { name: "Node.js", url: "/gerador-empresa-nodejs" }]} />
    </PageShell>
  );
}
