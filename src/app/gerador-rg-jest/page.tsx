import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de RG em Jest: Fixture + Formato UF",
  description: "Fixture Jest com RG válido por UF usando SDK fakeforge-br. Setup globalSetup, mock de instituto identificação. Snippets prontos.",
  keywords: "gerador rg jest, jest rg fixture, rg por estado jest",
  alternates: { canonical: "/gerador-rg-jest" },
  openGraph: { title: "Gerador de RG em Jest", description: "Fixture + formato UF.", type: "article", locale: "pt_BR" },
};

export default function GeradorRgJest() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Jest · fixture · UF</p>
        <h1 className="text-3xl font-bold tracking-tight">Gerador de <span className="text-primary">RG em Jest</span></h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Fixture pra RG válido em testes Jest — formato por UF via SDK <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">fakeforge-br</code>.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`npm install --save-dev fakeforge-br`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Fixture</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// tests/fixtures/rg-fixture.ts
import { FakeForge } from "fakeforge-br"

const ff = new FakeForge()
let cache: string[] | null = null

export async function getRGs(qty = 20): Promise<string[]> {
  if (!cache || cache.length < qty) {
    cache = await ff.rg(Math.max(qty, 100))
  }
  return cache.slice(0, qty)
}

export async function getPessoaCompleta() {
  const [customer] = await ff.preset("customer", 1)
  const [rg] = await ff.rg(1)
  return { ...customer, rg, ufEmissor: customer.endereco.estado }
}`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Teste E2E — cadastro com RG</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// tests/rg-signup.test.ts
import request from "supertest"
import app from "../src/app"
import { getPessoaCompleta } from "./fixtures/rg-fixture"

describe("POST /identidades", () => {
  test("aceita cadastro com RG válido", async () => {
    const pessoa = await getPessoaCompleta()

    const res = await request(app).post("/identidades").send({
      cpf: pessoa.cpf,
      nome: pessoa.nome,
      rg: pessoa.rg,
      ufEmissor: pessoa.ufEmissor,
    })

    expect(res.status).toBe(201)
  })
})`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">globalSetup</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// tests/global-setup.ts
import { FakeForge } from "fakeforge-br"
import fs from "fs"

export default async function () {
  const ff = new FakeForge()
  const [rgs, customers] = await Promise.all([
    ff.rg(500),
    ff.preset("customer", 500),
  ])
  fs.writeFileSync(".fixtures.json", JSON.stringify({ rgs, customers }))
}`}</code></pre>
      </section>

      <section className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Testar API</Link>
          <Link href="/gerador-rg-nodejs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Node.js</Link>
          <Link href="/gerador-rg-pytest" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">pytest</Link>
        </div>
      </section>

      <BreadcrumbSchema items={[{ name: "Início", url: "/" }, { name: "RG", url: "/gerador-rg" }, { name: "Jest", url: "/gerador-rg-jest" }]} />
    </PageShell>
  );
}
