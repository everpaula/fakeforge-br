import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de CPF em Jest: Fixture, Setup e Snapshot (2026)",
  description: "Fixture Jest com CPF válido usando SDK fakeforge-br. Setup globalSetup, mock de service, snapshot fixture, teste E2E de signup com CPF que passa mod-11. Snippets prontos pra copiar.",
  keywords: "gerador cpf jest, cpf jest fixture, jest cpf brasil, jest setup cpf, mock cpf jest, jest fake data brasil, jest test cpf valido, cpf globalSetup jest",
  alternates: { canonical: "/gerador-cpf-jest" },
  openGraph: {
    title: "Gerador de CPF em Jest",
    description: "Fixture + globalSetup + snapshot fixture. Snippets prontos.",
    type: "article",
    locale: "pt_BR",
  },
};

export default function GeradorCpfJest() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Jest · fixture · globalSetup</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">CPF em Jest</span>
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Setup completo pra usar CPF válido em testes Jest sem gambiarra. Fixture reutilizável, globalSetup pra pré-carregar batch, mock de service que consome CPF, snapshot fixture pra tests determinísticos. Tudo com SDK <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">fakeforge-br</code>.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`npm install --save-dev fakeforge-br

// tests/fixtures/cpf.ts
import { FakeForge } from "fakeforge-br"
export const ff = new FakeForge()`}</code></pre>
        <p className="text-xs text-muted-foreground mt-2">Free 50 chamadas/dia sem cadastro. Cachea entre testes pra economizar.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Fixture reutilizável</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// tests/fixtures/customer-fixture.ts
import { FakeForge } from "fakeforge-br"

const ff = new FakeForge()

// Cachea entre testes pra economizar quota
let cache: string[] | null = null

export async function getCPFs(quantity = 20): Promise<string[]> {
  if (!cache || cache.length < quantity) {
    cache = await ff.cpf(Math.max(quantity, 50))
  }
  return cache.slice(0, quantity)
}

export async function getCustomer(): Promise<{
  nome: string; cpf: string; email: string; telefone: string
}> {
  const [c] = await ff.preset("customer", 1)
  return c
}`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">globalSetup: pré-carrega batch</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
          Se muitos testes usam CPF, faz sentido carregar 1 vez no <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">globalSetup</code> e reusar via arquivo:
        </p>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// jest.config.js
export default {
  globalSetup: "./tests/global-setup.ts",
}

// tests/global-setup.ts
import { FakeForge } from "fakeforge-br"
import fs from "fs"

export default async function globalSetup() {
  const ff = new FakeForge()
  const [cpfs, customers, fintech] = await Promise.all([
    ff.cpf(500),
    ff.preset("customer", 100),
    ff.preset("fintech", 50),
  ])
  fs.writeFileSync(".test-fixtures.json", JSON.stringify({ cpfs, customers, fintech }))
  console.log("Loaded fixtures: 500 CPFs + 100 customers + 50 fintech")
}

// tests/setup.ts
import fs from "fs"
const fixtures = JSON.parse(fs.readFileSync(".test-fixtures.json", "utf-8"))
globalThis.testFixtures = fixtures`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Teste E2E de signup</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// tests/signup.test.ts
import { describe, test, expect, beforeAll } from "@jest/globals"
import request from "supertest"
import app from "../src/app"
import { getCPFs } from "./fixtures/customer-fixture"

describe("POST /signup", () => {
  let cpfs: string[]

  beforeAll(async () => {
    cpfs = await getCPFs(10)
  })

  test.each(cpfs)("aceita CPF válido %s", async (cpf) => {
    const res = await request(app).post("/signup").send({
      cpf,
      email: \`user-\${Date.now()}@test.com\`,
      password: "test1234",
    })
    expect(res.status).toBe(201)
  })

  test("rejeita CPF inválido", async () => {
    const res = await request(app).post("/signup").send({
      cpf: "111.111.111-11",  // sequência inválida
      email: "user@test.com",
    })
    expect(res.status).toBe(400)
  })
})`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Mock de service que consome CPF</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// tests/customer.service.test.ts
import { CustomerService } from "../src/customer.service"
import { getCustomer } from "./fixtures/customer-fixture"

jest.mock("../src/serasa.client", () => ({
  consultarScore: jest.fn().mockResolvedValue({ score: 750 }),
}))

describe("CustomerService", () => {
  test("cria customer com score do Serasa", async () => {
    const dadosFake = await getCustomer()
    const service = new CustomerService()

    const customer = await service.criar(dadosFake)

    expect(customer.cpf).toBe(dadosFake.cpf)
    expect(customer.score).toBe(750)
  })
})`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Snapshot fixture determinística</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
          Se você quer testes 100% reprodutíveis (sem chamada API a cada run), gera fixture uma vez e commita:
        </p>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# scripts/gen-fixtures.js - roda 1 vez, commita output
import { FakeForge } from "fakeforge-br"
import fs from "fs"

const ff = new FakeForge()
const data = {
  cpfs: await ff.cpf(100),
  customers: await ff.preset("customer", 20),
}
fs.writeFileSync("tests/fixtures/snapshot.json", JSON.stringify(data, null, 2))

// tests/fixture-loader.ts
import snapshot from "./fixtures/snapshot.json"
export const { cpfs, customers } = snapshot`}</code></pre>

        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          Trade-off: fixture fica igual pra sempre (ideal pra snapshot tests) mas não capta bug que só aparece com dado diferente.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Próximos passos</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Testar API</Link>
          <Link href="/gerador-cpf-nodejs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Node.js completo</Link>
          <Link href="/gerador-cpf-pytest" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">pytest equivalente</Link>
          <Link href="/docs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">API Docs</Link>
        </div>
      </section>

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Gerador CPF", url: "/gerador-cpf" },
        { name: "Jest", url: "/gerador-cpf-jest" },
      ]} />
    </PageShell>
  );
}
