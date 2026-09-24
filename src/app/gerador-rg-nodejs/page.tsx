import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de RG em Node.js: SDK + Formato por Estado",
  description: "Gere RG válido em Node.js/TypeScript com SDK fakeforge-br. Formato específico por UF. Snippets Jest, NestJS, Express. Grátis 50/dia.",
  keywords: "gerador rg nodejs, rg node, rg typescript, rg jest, rg nestjs, rg por estado node",
  alternates: { canonical: "/gerador-rg-nodejs" },
  openGraph: { title: "Gerador de RG em Node.js", description: "SDK + formato por estado.", type: "article", locale: "pt_BR" },
};

export default function GeradorRgNodejs() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Node.js · TypeScript · UF</p>
        <h1 className="text-3xl font-bold tracking-tight">Gerador de <span className="text-primary">RG em Node.js</span></h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          SDK <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">fakeforge-br</code> gera RG com formato específico por UF. TypeScript types nativos. Snippets Jest, NestJS, Express.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`npm install fakeforge-br

import { FakeForge } from "fakeforge-br"
const rgs = await new FakeForge().rg(100)`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">SDK oficial</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`import { FakeForge } from "fakeforge-br"

const ff = new FakeForge()

// 100 RGs
const rgs = await ff.rg(100)

// Preset customer com RG + estado emissor coerente
const pessoas = await ff.preset("customer", 10)
pessoas.forEach(p => {
  console.log(\`\${p.nome}: RG \${(p as any).rg} — emitido \${p.endereco.estado}\`)
})`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Uso em Jest — identidade validator</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// tests/rg-validator.test.ts
import { FakeForge } from "fakeforge-br"
import { validarRG } from "../src/validators"

const ff = new FakeForge()

describe("RG validator", () => {
  let rgs: string[]

  beforeAll(async () => {
    rgs = await ff.rg(50)
  })

  test.each([0, 1, 2, 3, 4])("aceita RG válido #%i", (i) => {
    expect(validarRG(rgs[i])).toBe(true)
  })

  test("rejeita RG inválido", () => {
    expect(validarRG("00.000.000-0")).toBe(false)
  })
})`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">NestJS seed command</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`@Command({ name: "seed:identidades" })
export class IdentidadeSeedCommand extends CommandRunner {
  async run() {
    const ff = new FakeForge()
    const [pessoas, rgs] = await Promise.all([
      ff.preset("customer", 500),
      ff.rg(500),
    ])

    await this.identidades.bulkCreate(
      pessoas.map((p, i) => ({
        cpf: p.cpf,
        nome: p.nome,
        rg: rgs[i],
        ufEmissor: p.endereco.estado,
      }))
    )
  }
}`}</code></pre>
      </section>

      <section className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Testar API</Link>
          <Link href="/gerador-rg" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">RG por estado</Link>
          <Link href="/gerador-rg-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Python</Link>
        </div>
      </section>

      <BreadcrumbSchema items={[{ name: "Início", url: "/" }, { name: "RG", url: "/gerador-rg" }, { name: "Node.js", url: "/gerador-rg-nodejs" }]} />
    </PageShell>
  );
}
