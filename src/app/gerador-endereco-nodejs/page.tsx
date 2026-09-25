import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de Endereço em Node.js: SDK + TypeScript | FakeForge",
  description: "Gere endereço brasileiro completo em Node.js/TypeScript com SDK fakeforge-br. Snippets Jest, NestJS, Express. TypeScript types nativos. Grátis 50/dia.",
  keywords: "gerador endereco nodejs, endereco brasileiro node, endereco typescript, endereco jest, endereco nestjs",
  alternates: { canonical: "/gerador-endereco-nodejs" },
  openGraph: { title: "Gerador de Endereço em Node.js", description: "SDK + TypeScript types nativos.", type: "article", locale: "pt_BR" },
};

export default function GeradorEnderecoNodejs() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Node.js · TypeScript</p>
        <h1 className="text-3xl font-bold tracking-tight">Gerador de <span className="text-primary">Endereço em Node.js</span></h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          SDK <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">fakeforge-br</code> gera endereço brasileiro completo. TypeScript types nativos. Snippets Jest, NestJS, Express.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`npm install fakeforge-br

import { FakeForge } from "fakeforge-br"
const enderecos = await new FakeForge().address(100)`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">SDK oficial (TypeScript)</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`import { FakeForge, Address } from "fakeforge-br"

const ff = new FakeForge()

// Type-safe
const enderecos: Address[] = await ff.address(100)

for (const e of enderecos.slice(0, 3)) {
  console.log(\`\${e.logradouro}, \${e.bairro}, \${e.cidade}/\${e.estado} — CEP \${e.cep}\`)
}

// Preset customer com endereço correlacionado
const pessoas = await ff.preset("customer", 10)
pessoas.forEach(p => {
  console.log(\`\${p.nome}: \${p.endereco.cidade}/\${p.endereco.estado}\`)
})`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">NestJS seed</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`@Command({ name: "seed:enderecos" })
export class EnderecoSeedCommand extends CommandRunner {
  async run() {
    const ff = new FakeForge()
    const pessoas = await ff.preset("customer", 1000)

    await this.enderecos.bulkCreate(
      pessoas.map(p => ({
        cep: p.endereco.cep,
        logradouro: p.endereco.logradouro,
        bairro: p.endereco.bairro,
        cidade: p.endereco.cidade,
        uf: p.endereco.estado,
        nome_destinatario: p.nome,
      }))
    )
  }
}`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Jest E2E — checkout com endereço</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// tests/checkout-endereco.test.ts
import { FakeForge } from "fakeforge-br"

const ff = new FakeForge()

describe("Checkout /calcular-frete", () => {
  test("aceita endereço válido de qualquer UF", async () => {
    const enderecos = await ff.address(20)
    for (const e of enderecos.slice(0, 5)) {
      const res = await request(app).post("/calcular-frete").send({
        cep: e.cep, peso_kg: 2.5,
      })
      expect(res.status).toBe(200)
      expect(res.body.valor).toBeGreaterThan(0)
    }
  })
})`}</code></pre>
      </section>

      <section className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Testar API</Link>
          <Link href="/gerador-endereco" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Endereço básico</Link>
          <Link href="/gerador-endereco-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Python</Link>
        </div>
      </section>

      <BreadcrumbSchema items={[{ name: "Início", url: "/" }, { name: "Endereço", url: "/gerador-endereco" }, { name: "Node.js", url: "/gerador-endereco-nodejs" }]} />
    </PageShell>
  );
}
