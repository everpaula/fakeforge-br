import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de CNPJ em Node.js: SDK + Alfanumérico 2026",
  description: "Gere CNPJ válido em Node.js/TypeScript (numérico e alfanumérico 2026) com SDK fakeforge-br. Snippets pra Jest, Vitest, NestJS, Express. Zero deps runtime. Grátis 50/dia.",
  keywords: "gerador cnpj nodejs, gerar cnpj node, cnpj typescript, cnpj alfanumerico nodejs 2026, cnpj jest, cnpj nestjs, cnpj express, algoritmo cnpj javascript",
  alternates: { canonical: "/gerador-cnpj-nodejs" },
  openGraph: { title: "Gerador de CNPJ em Node.js", description: "SDK oficial + algoritmo local. CNPJ numérico e alfanumérico 2026.", type: "article", locale: "pt_BR" },
};

export default function GeradorCnpjNodejs() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Node.js · TypeScript · SDK</p>
        <h1 className="text-3xl font-bold tracking-tight">Gerador de <span className="text-primary">CNPJ em Node.js</span></h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          SDK oficial <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">fakeforge-br</code> cobre CNPJ numérico e alfanumérico 2026 (IN RFB 2.229). Snippets pra Jest, Vitest, NestJS, Express. TypeScript types nativos. Grátis 50/dia.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`npm install fakeforge-br

import { FakeForge } from "fakeforge-br"
const ff = new FakeForge()

const cnpjs = await ff.cnpj(100)             // numérico mod-11
const cnpjsAlfa = await ff.cnpjAlfa(50)      // alfanumérico 2026`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">CNPJ alfanumérico 2026</h2>
        <p className="text-sm text-muted-foreground mb-3">A IN RFB 2.229 obriga sistemas a aceitar CNPJ com letras a partir de julho/2026. Testa desde já:</p>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`import { FakeForge } from "fakeforge-br"
import { validarCnpj } from "./validators"

const ff = new FakeForge()
const cnpjsAlfa = await ff.cnpjAlfa(20)

for (const cnpj of cnpjsAlfa) {
  const ok = validarCnpj(cnpj)
  if (!ok) console.error(\`Seu validador quebra em: \${cnpj}\`)
}`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Algoritmo mod-11 local (TypeScript)</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// utils/cnpj.ts - só numérico
export function gerarCnpj(formatado = true): string {
  const n: number[] = [
    ...Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)),
    0, 0, 0, 1  // /0001 (matriz)
  ]

  const p1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const p2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

  const s1 = n.reduce((acc, x, i) => acc + x * p1[i], 0)
  let d1 = s1 % 11
  d1 = d1 < 2 ? 0 : 11 - d1
  n.push(d1)

  const s2 = n.reduce((acc, x, i) => acc + x * p2[i], 0)
  let d2 = s2 % 11
  d2 = d2 < 2 ? 0 : 11 - d2
  n.push(d2)

  if (formatado) {
    return \`\${n[0]}\${n[1]}.\${n[2]}\${n[3]}\${n[4]}.\${n[5]}\${n[6]}\${n[7]}/\${n[8]}\${n[9]}\${n[10]}\${n[11]}-\${n[12]}\${n[13]}\`
  }
  return n.join("")
}`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Uso em Jest</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// tests/empresa.test.ts
import { FakeForge } from "fakeforge-br"
import { EmpresaService } from "../src/empresa.service"

const ff = new FakeForge()

describe("EmpresaService.criar", () => {
  test("aceita CNPJ numérico válido", async () => {
    const [cnpj] = await ff.cnpj(1)
    const res = await EmpresaService.criar({ cnpj, razaoSocial: "Test" })
    expect(res.id).toBeDefined()
  })

  test("aceita CNPJ alfanumérico 2026", async () => {
    const [cnpj] = await ff.cnpjAlfa(1)
    const res = await EmpresaService.criar({ cnpj, razaoSocial: "Test Alfa" })
    expect(res.id).toBeDefined()
  })
})`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Uso em NestJS (seed command)</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// empresa.seed.command.ts
import { Command, CommandRunner } from "nest-commander"
import { FakeForge } from "fakeforge-br"
import { EmpresaService } from "./empresa.service"

@Command({ name: "seed:empresas" })
export class EmpresaSeedCommand extends CommandRunner {
  constructor(private empresas: EmpresaService) { super() }

  async run() {
    const ff = new FakeForge()
    const [cnpjs, cnpjsAlfa] = await Promise.all([
      ff.cnpj(500),
      ff.cnpjAlfa(100),
    ])
    await this.empresas.bulkCreate([...cnpjs, ...cnpjsAlfa])
  }
}`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Próximos passos</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Testar API</Link>
          <Link href="/gerador-cnpj-alfanumerico" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">CNPJ Alfa 2026</Link>
          <Link href="/gerador-cnpj-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Versão Python</Link>
        </div>
      </section>

      <BreadcrumbSchema items={[{ name: "Início", url: "/" }, { name: "Gerador CNPJ", url: "/gerador-cnpj" }, { name: "Node.js", url: "/gerador-cnpj-nodejs" }]} />
    </PageShell>
  );
}
