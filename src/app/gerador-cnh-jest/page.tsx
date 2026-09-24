import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de CNH em Jest: Fixture DENATRAN",
  description: "Fixture Jest com CNH válida DENATRAN usando SDK fakeforge-br. Setup globalSetup, mock de DETRAN, teste E2E app de motorista. Snippets prontos.",
  keywords: "gerador cnh jest, jest cnh fixture, cnh denatran jest, mock detran jest",
  alternates: { canonical: "/gerador-cnh-jest" },
  openGraph: { title: "Gerador de CNH em Jest", description: "Fixture + mock DETRAN.", type: "article", locale: "pt_BR" },
};

export default function GeradorCnhJest() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Jest · fixture · DENATRAN</p>
        <h1 className="text-3xl font-bold tracking-tight">Gerador de <span className="text-primary">CNH em Jest</span></h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Fixture pra CNH válida em testes Jest. Session fixture, globalSetup, mock de DETRAN. Ideal pra app de motorista (Uber, 99, iFood entregadores). SDK <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">fakeforge-br</code>.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`npm install --save-dev fakeforge-br

// tests/fixtures/cnh.ts
import { FakeForge } from "fakeforge-br"
export const ff = new FakeForge()`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Fixture com cache</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// tests/fixtures/cnh-fixture.ts
import { FakeForge } from "fakeforge-br"

const ff = new FakeForge()
let cache: string[] | null = null

export async function getCNHs(qty = 20): Promise<string[]> {
  if (!cache || cache.length < qty) {
    cache = await ff.cnh(Math.max(qty, 100))
  }
  return cache.slice(0, qty)
}

export async function getMotoristaCompleto() {
  const [[customer], [cnh]] = await Promise.all([
    ff.preset("customer", 1),
    ff.cnh(1),
  ])
  return { ...customer, cnh }
}`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Teste E2E — cadastro motorista</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// tests/motorista-signup.test.ts
import request from "supertest"
import app from "../src/app"
import { getMotoristaCompleto } from "./fixtures/cnh-fixture"

describe("POST /motoristas", () => {
  test("cadastra motorista com CNH válida", async () => {
    const dados = await getMotoristaCompleto()

    const res = await request(app).post("/motoristas").send({
      cpf: dados.cpf,
      nome: dados.nome,
      cnh: dados.cnh,
      categoria: "B",
    })

    expect(res.status).toBe(201)
    expect(res.body.aprovado).toBe(true)
  })

  test("rejeita CNH inválida", async () => {
    const res = await request(app).post("/motoristas").send({
      cpf: "123.456.789-09",
      nome: "Test",
      cnh: "11111111111",  // Sequência inválida
      categoria: "B",
    })
    expect(res.status).toBe(400)
  })
})`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Mock de DETRAN</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// tests/detran-check.test.ts
import { getCNHs } from "./fixtures/cnh-fixture"

jest.mock("../src/detran.client", () => ({
  DetranClient: jest.fn().mockImplementation(() => ({
    consultarCnh: jest.fn().mockResolvedValue({
      valida: true,
      pontos: 0,
      restricoes: [],
      vencimento: "2028-06-15",
    }),
  })),
}))

test("verifica CNH no DETRAN antes de aprovar motorista", async () => {
  const { MotoristaService } = await import("../src/motorista.service")
  const [cnh] = await getCNHs(1)

  const service = new MotoristaService()
  const result = await service.aprovarCadastro(cnh)

  expect(result.aprovado).toBe(true)
  expect(result.pontos).toBe(0)
})`}</code></pre>
      </section>

      <section className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Testar API</Link>
          <Link href="/gerador-cnh-nodejs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Node.js</Link>
          <Link href="/gerador-cnh-pytest" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">pytest</Link>
        </div>
      </section>

      <BreadcrumbSchema items={[{ name: "Início", url: "/" }, { name: "CNH", url: "/gerador-cnh" }, { name: "Jest", url: "/gerador-cnh-jest" }]} />
    </PageShell>
  );
}
