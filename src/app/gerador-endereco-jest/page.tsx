import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de Endereço em Jest: Fixture BR | FakeForge",
  description: "Fixture Jest com endereço brasileiro válido usando SDK fakeforge-br. globalSetup, mock de correios, teste E2E checkout com frete. Snippets prontos.",
  keywords: "gerador endereco jest, jest endereco fixture, endereco brasileiro jest, mock correios jest",
  alternates: { canonical: "/gerador-endereco-jest" },
  openGraph: { title: "Gerador de Endereço em Jest", description: "Fixture + mock correios.", type: "article", locale: "pt_BR" },
};

export default function GeradorEnderecoJest() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Jest · fixture · Correios</p>
        <h1 className="text-3xl font-bold tracking-tight">Gerador de <span className="text-primary">Endereço em Jest</span></h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Fixture pra endereço brasileiro em testes Jest. Session fixture, globalSetup, mock de Correios pra teste de frete E2E.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`npm install --save-dev fakeforge-br

// tests/fixtures/endereco.ts
import { FakeForge } from "fakeforge-br"
export const ff = new FakeForge()`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Fixture com filtro por UF</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// tests/fixtures/endereco-fixture.ts
import { FakeForge, Address } from "fakeforge-br"

const ff = new FakeForge()
let cache: Address[] | null = null

async function ensureCache() {
  if (!cache || cache.length < 100) {
    cache = await ff.address(200)
  }
  return cache
}

export async function getEnderecos(qty = 20): Promise<Address[]> {
  const c = await ensureCache()
  return c.slice(0, qty)
}

export async function getEnderecoPorUF(uf: string): Promise<Address> {
  const c = await ensureCache()
  const found = c.find(e => e.estado === uf)
  if (found) return found
  // Se cache não tem, chama API 5x pra achar
  for (let i = 0; i < 5; i++) {
    const [e] = await ff.address(20)
    if (e.estado === uf) return e
  }
  throw new Error(\`Nenhum endereço \${uf}\`)
}`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Teste — frete por CEP</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// tests/frete.test.ts
import { getEnderecos, getEnderecoPorUF } from "./fixtures/endereco-fixture"
import { CalculadoraFrete } from "../src/frete"

describe("CalculadoraFrete", () => {
  test("calcula frete pra endereço SP", async () => {
    const e = await getEnderecoPorUF("SP")
    const valor = await CalculadoraFrete.calcular({ cep: e.cep, peso_kg: 2 })
    expect(valor).toBeGreaterThan(0)
    expect(valor).toBeLessThan(50) // SP tem frete barato
  })

  test("calcula frete pra endereço AM (mais caro)", async () => {
    const e = await getEnderecoPorUF("AM")
    const valor = await CalculadoraFrete.calcular({ cep: e.cep, peso_kg: 2 })
    expect(valor).toBeGreaterThan(30) // Amazonas tem frete mais caro
  })
})`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Mock de Correios API</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// tests/correios-mock.test.ts
import { getEnderecos } from "./fixtures/endereco-fixture"

jest.mock("../src/correios.client", () => ({
  CorreiosClient: jest.fn(() => ({
    consultarCep: jest.fn().mockImplementation((cep) => Promise.resolve({
      cep,
      logradouro: "Rua Mock",
      cidade: "Cidade Mock",
      uf: "SP",
    })),
  })),
}))

test("service consulta Correios API", async () => {
  const { EnderecoService } = await import("../src/endereco.service")
  const [e] = await getEnderecos(1)

  const service = new EnderecoService()
  const result = await service.consultar(e.cep)
  expect(result.cep).toBe(e.cep)
})`}</code></pre>
      </section>

      <section className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Testar API</Link>
          <Link href="/gerador-endereco-nodejs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Node.js</Link>
          <Link href="/gerador-endereco-pytest" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">pytest</Link>
        </div>
      </section>

      <BreadcrumbSchema items={[{ name: "Início", url: "/" }, { name: "Endereço", url: "/gerador-endereco" }, { name: "Jest", url: "/gerador-endereco-jest" }]} />
    </PageShell>
  );
}
