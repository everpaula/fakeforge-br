import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de CEP em Jest: Fixture BR | FakeForge",
  description: "Fixture Jest com CEP brasileiro válido usando SDK fakeforge-br. Setup globalSetup, mock ViaCEP, teste E2E de frete. Snippets prontos.",
  keywords: "gerador cep jest, jest cep fixture, cep brasileiro jest, mock viacep jest",
  alternates: { canonical: "/gerador-cep-jest" },
  openGraph: { title: "Gerador de CEP em Jest", description: "Fixture + mock ViaCEP.", type: "article", locale: "pt_BR" },
};

export default function GeradorCepJest() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Jest · fixture · ViaCEP mock</p>
        <h1 className="text-3xl font-bold tracking-tight">Gerador de <span className="text-primary">CEP em Jest</span></h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Fixture pra CEP brasileiro em testes Jest. globalSetup, mock ViaCEP API, teste E2E de frete.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`npm install --save-dev fakeforge-br`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Fixture com cache</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// tests/fixtures/cep-fixture.ts
import { FakeForge } from "fakeforge-br"

const ff = new FakeForge()
let cache: string[] | null = null

export async function getCEPs(qty = 20): Promise<string[]> {
  if (!cache || cache.length < qty) {
    cache = await ff.cep(Math.max(qty, 100))
  }
  return cache.slice(0, qty)
}

// Retorna CEP + endereço completo
export async function getCEPComEndereco() {
  const [e] = await ff.address(1)
  return e
}`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Teste — validador CEP</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// tests/cep-validator.test.ts
import { getCEPs } from "./fixtures/cep-fixture"
import { validarCEP } from "../src/validators"

describe("CEP validator", () => {
  test.each(await getCEPs(10))("aceita %s", (cep) => {
    expect(validarCEP(cep)).toBe(true)
  })

  test("rejeita CEPs inválidos", () => {
    expect(validarCEP("00000-000")).toBe(false)
    expect(validarCEP("")).toBe(false)
    expect(validarCEP("abc")).toBe(false)
  })
})`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Mock ViaCEP</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// tests/viacep.test.ts
import { getCEPComEndereco } from "./fixtures/cep-fixture"

// Mock global do fetch pra ViaCEP
global.fetch = jest.fn().mockImplementation((url) => {
  const match = url.match(/viacep\\.com\\.br\\/ws\\/(\\d+)/)
  const cep = match?.[1] || ""
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      cep, logradouro: "Rua Mock", bairro: "Mock", localidade: "Cidade", uf: "SP",
    }),
  })
})

test("consulta ViaCEP com CEP do fakeforge", async () => {
  const endereco = await getCEPComEndereco()
  const res = await fetch(\`https://viacep.com.br/ws/\${endereco.cep.replace(/\\D/g, '')}/json/\`)
  const data = await res.json()
  expect(data.uf).toBe("SP")
})`}</code></pre>
      </section>

      <section className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Testar API</Link>
          <Link href="/gerador-cep-nodejs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Node.js</Link>
          <Link href="/gerador-cep-pytest" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">pytest</Link>
        </div>
      </section>

      <BreadcrumbSchema items={[{ name: "Início", url: "/" }, { name: "CEP", url: "/gerador-cep" }, { name: "Jest", url: "/gerador-cep-jest" }]} />
    </PageShell>
  );
}
