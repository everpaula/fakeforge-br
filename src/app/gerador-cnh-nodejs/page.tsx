import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de CNH em Node.js: SDK + Algoritmo DENATRAN",
  description: "Gere CNH válida em Node.js/TypeScript com SDK fakeforge-br. Mod-11 DENATRAN. Snippets pra Jest, NestJS, Express. Uso restrito a desenvolvimento e QA.",
  keywords: "gerador cnh nodejs, cnh node, cnh typescript, cnh denatran nodejs, cnh jest, cnh nestjs",
  alternates: { canonical: "/gerador-cnh-nodejs" },
  openGraph: { title: "Gerador de CNH em Node.js", description: "SDK + DENATRAN.", type: "article", locale: "pt_BR" },
};

export default function GeradorCnhNodejs() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Node.js · TypeScript</p>
        <h1 className="text-3xl font-bold tracking-tight">Gerador de <span className="text-primary">CNH em Node.js</span></h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          SDK <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">fakeforge-br</code> gera CNH mod-11 DENATRAN. TypeScript types. Snippets pra Jest, NestJS, Express.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`npm install fakeforge-br

import { FakeForge } from "fakeforge-br"
const cnhs = await new FakeForge().cnh(100)`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">SDK + preset motorista</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`import { FakeForge } from "fakeforge-br"

const ff = new FakeForge()

// 100 CNHs válidas
const cnhs = await ff.cnh(100)

// Combine com customer pra motorista completo
const [motorista] = await Promise.all([
  ff.preset("customer", 1),
  ff.cnh(1),
]).then(([[c], [cnh]]) => [{ ...c, cnh }])`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Uso em Jest — app de motorista (Uber/99)</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// tests/motorista.test.ts
import { FakeForge } from "fakeforge-br"
import { MotoristaService } from "../src/motorista.service"

const ff = new FakeForge()

describe("MotoristaService.cadastrar", () => {
  let motoristasFake: Array<{ cpf: string; nome: string; cnh: string }>

  beforeAll(async () => {
    const [customers, cnhs] = await Promise.all([
      ff.preset("customer", 20),
      ff.cnh(20),
    ])
    motoristasFake = customers.map((c, i) => ({
      cpf: c.cpf, nome: c.nome, cnh: cnhs[i]
    }))
  })

  test.each([0, 1, 2, 3, 4])("cadastra motorista #%i", async (i) => {
    const service = new MotoristaService()
    const result = await service.cadastrar(motoristasFake[i])
    expect(result.aprovado).toBe(true)
  })
})`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Uso em NestJS (seed)</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// motorista.seed.command.ts
@Command({ name: "seed:motoristas" })
export class MotoristaSeedCommand extends CommandRunner {
  async run() {
    const ff = new FakeForge()
    const [customers, cnhs] = await Promise.all([
      ff.preset("customer", 1000),
      ff.cnh(1000),
    ])

    const dados = customers.map((c, i) => ({
      cpf: c.cpf,
      nome: c.nome,
      cnh: cnhs[i],
      categoria: ["A", "B", "AB", "C", "D"][i % 5],
    }))

    await this.motoristas.bulkCreate(dados)
  }
}`}</code></pre>
      </section>

      <section className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Testar API</Link>
          <Link href="/gerador-cnh" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">CNH por estado</Link>
          <Link href="/gerador-cnh-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Versão Python</Link>
        </div>
      </section>

      <BreadcrumbSchema items={[{ name: "Início", url: "/" }, { name: "CNH", url: "/gerador-cnh" }, { name: "Node.js", url: "/gerador-cnh-nodejs" }]} />
    </PageShell>
  );
}
