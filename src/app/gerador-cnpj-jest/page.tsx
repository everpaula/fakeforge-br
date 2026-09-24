import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de CNPJ em Jest: Fixture + Alfanumérico 2026",
  description: "Fixture Jest com CNPJ válido (numérico + alfanumérico 2026) usando SDK fakeforge-br. Setup globalSetup, mock de serviço de validação, teste E2E completo. Snippets prontos.",
  keywords: "gerador cnpj jest, cnpj jest fixture, jest cnpj brasil, cnpj alfanumerico jest, jest globalSetup cnpj, mock cnpj jest",
  alternates: { canonical: "/gerador-cnpj-jest" },
  openGraph: { title: "Gerador de CNPJ em Jest", description: "Fixture + globalSetup + alfanumérico 2026.", type: "article", locale: "pt_BR" },
};

export default function GeradorCnpjJest() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Jest · fixture · alfanumérico 2026</p>
        <h1 className="text-3xl font-bold tracking-tight">Gerador de <span className="text-primary">CNPJ em Jest</span></h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Fixture pra CNPJ válido em testes Jest — cobre numérico e alfanumérico 2026 (IN RFB 2.229). Session fixture pra economizar quota, globalSetup pra batch, mock de serviço de validação. Tudo com SDK <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">fakeforge-br</code>.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`npm install --save-dev fakeforge-br

// tests/fixtures/cnpj.ts
import { FakeForge } from "fakeforge-br"
export const ff = new FakeForge()`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Fixture reutilizável</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// tests/fixtures/cnpj-fixture.ts
import { FakeForge } from "fakeforge-br"

const ff = new FakeForge()
let cache: { numeric: string[]; alfa: string[] } | null = null

async function ensureCache() {
  if (!cache) {
    const [numeric, alfa] = await Promise.all([ff.cnpj(100), ff.cnpjAlfa(50)])
    cache = { numeric, alfa }
  }
  return cache
}

export async function getCNPJs(qty = 20): Promise<string[]> {
  const c = await ensureCache()
  return c.numeric.slice(0, qty)
}

export async function getCNPJsAlfa(qty = 10): Promise<string[]> {
  const c = await ensureCache()
  return c.alfa.slice(0, qty)
}`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Teste E2E — signup B2B com CNPJ</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// tests/b2b-signup.test.ts
import request from "supertest"
import app from "../src/app"
import { getCNPJs, getCNPJsAlfa } from "./fixtures/cnpj-fixture"

describe("POST /b2b/signup", () => {
  let cnpjsNumeric: string[]
  let cnpjsAlfa: string[]

  beforeAll(async () => {
    cnpjsNumeric = await getCNPJs(10)
    cnpjsAlfa = await getCNPJsAlfa(10)
  })

  test.each(0..10)("aceita CNPJ numérico #%i", async (i) => {
    const res = await request(app).post("/b2b/signup").send({
      cnpj: cnpjsNumeric[i],
      razaoSocial: \`Empresa \${i}\`,
    })
    expect(res.status).toBe(201)
  })

  test.each(0..10)("aceita CNPJ alfanumérico 2026 #%i", async (i) => {
    const res = await request(app).post("/b2b/signup").send({
      cnpj: cnpjsAlfa[i],
      razaoSocial: \`Empresa Alfa \${i}\`,
    })
    expect(res.status).toBe(201)  // IN RFB 2.229
  })

  test("rejeita CNPJ inválido", async () => {
    const res = await request(app).post("/b2b/signup").send({
      cnpj: "11.111.111/1111-11",
      razaoSocial: "Test",
    })
    expect(res.status).toBe(400)
  })
})`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">globalSetup pra volume alto</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// jest.config.js
export default {
  globalSetup: "./tests/global-setup.ts",
}

// tests/global-setup.ts
import { FakeForge } from "fakeforge-br"
import fs from "fs"

export default async function () {
  const ff = new FakeForge()
  const [cnpjs, cnpjsAlfa] = await Promise.all([
    ff.cnpj(1000),
    ff.cnpjAlfa(300),
  ])
  fs.writeFileSync(".test-fixtures.json", JSON.stringify({ cnpjs, cnpjsAlfa }))
  console.log(\`Fixtures: \${cnpjs.length} num + \${cnpjsAlfa.length} alfa\`)
}`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Próximos passos</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Testar API</Link>
          <Link href="/gerador-cnpj-nodejs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Node.js completo</Link>
          <Link href="/gerador-cnpj-pytest" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">pytest equivalente</Link>
        </div>
      </section>

      <BreadcrumbSchema items={[{ name: "Início", url: "/" }, { name: "Gerador CNPJ", url: "/gerador-cnpj" }, { name: "Jest", url: "/gerador-cnpj-jest" }]} />
    </PageShell>
  );
}
