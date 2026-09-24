import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de CPF em Node.js: SDK + Algoritmo mod-11 (2026)",
  description: "Gere CPF válido em Node.js com o SDK fakeforge-br (npm install) ou implementação local do algoritmo mod-11. Snippets pra Jest, Vitest, NestJS, Express e Fastify. Grátis 50/dia.",
  keywords: "gerador de cpf nodejs, gerar cpf node, cpf valido node.js, algoritmo mod-11 javascript, cpf jest node, cpf typescript, cpf nestjs, cpf express, cpf faker javascript, node cpf teste",
  alternates: { canonical: "/gerador-cpf-nodejs" },
  openGraph: {
    title: "Gerador de CPF em Node.js — SDK oficial + algoritmo local",
    description: "SDK oficial fakeforge-br + mod-11 puro. Pra Jest, Vitest, NestJS, Express. Grátis.",
    type: "article",
    locale: "pt_BR",
  },
};

export default function GeradorCpfNodejs() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Node.js · SDK + algoritmo</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">CPF em Node.js</span>
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Duas rotas em Node/TypeScript: SDK oficial <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">fakeforge-br</code> (via <code className="text-xs">npm</code>) ou implementação local do mod-11 puro. Snippets pra Jest, Vitest, NestJS, Express e Fastify.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`npm install fakeforge-br

import { FakeForge } from "fakeforge-br"
const cpfs = await new FakeForge().cpf(100)`}</code></pre>
        <p className="text-xs text-muted-foreground mt-2">Zero deps runtime. TypeScript nativo. Free 50/dia.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Rota 1: SDK oficial fakeforge-br</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// npm install fakeforge-br
import { FakeForge } from "fakeforge-br"

const ff = new FakeForge()

// 1 CPF formatado
const [cpf] = await ff.cpf(1)
console.log(cpf) // "123.456.789-09"

// 1000 CPFs sem formatação
const cpfs = await ff.cpf(1000, false)

// Preset customer com TypeScript types
const pessoas = await ff.preset("customer", 10)
pessoas.forEach(p => {
  console.log(p.nome, p.cpf, p.email)
})`}</code></pre>

        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          TypeScript types incluídos (interface <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">FintechPresetItem</code>, <code className="text-xs">EcomPresetItem</code>). Autocomplete no VS Code funciona out-of-box.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Rota 2: algoritmo mod-11 local (TypeScript)</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// utils/cpf.ts
export function gerarCpf(formatado = true): string {
  const n: number[] = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10))

  // Primeiro dígito verificador
  const s1 = n.reduce((acc, digit, i) => acc + digit * (10 - i), 0)
  let d1 = (s1 * 10) % 11
  d1 = d1 === 10 ? 0 : d1
  n.push(d1)

  // Segundo dígito verificador
  const s2 = n.reduce((acc, digit, i) => acc + digit * (11 - i), 0)
  let d2 = (s2 * 10) % 11
  d2 = d2 === 10 ? 0 : d2
  n.push(d2)

  if (formatado) {
    return \`\${n[0]}\${n[1]}\${n[2]}.\${n[3]}\${n[4]}\${n[5]}.\${n[6]}\${n[7]}\${n[8]}-\${n[9]}\${n[10]}\`
  }
  return n.join("")
}

export function validarCpf(cpf: string): boolean {
  const d = cpf.replace(/\\D/g, "").split("").map(Number)
  if (d.length !== 11 || new Set(d).size === 1) return false

  const s1 = d.slice(0, 9).reduce((acc, x, i) => acc + x * (10 - i), 0)
  let v1 = (s1 * 10) % 11
  v1 = v1 === 10 ? 0 : v1
  if (v1 !== d[9]) return false

  const s2 = d.slice(0, 10).reduce((acc, x, i) => acc + x * (11 - i), 0)
  let v2 = (s2 * 10) % 11
  v2 = v2 === 10 ? 0 : v2
  return v2 === d[10]
}`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Uso em Jest</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// tests/signup.test.ts
import { FakeForge } from "fakeforge-br"

const ff = new FakeForge()
let cpfs: string[]

beforeAll(async () => {
  cpfs = await ff.cpf(50)
})

test("signup aceita CPF válido", async () => {
  for (const cpf of cpfs.slice(0, 10)) {
    const res = await request(app).post("/signup").send({ cpf, email: "test@test.com" })
    expect(res.status).toBe(201)
  }
})`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Uso em Vitest</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// tests/customer.test.ts
import { describe, test, expect, beforeAll } from "vitest"
import { FakeForge } from "fakeforge-br"

const ff = new FakeForge()

describe("Customer model", () => {
  let customers: Array<{ nome: string; cpf: string; email: string }>

  beforeAll(async () => {
    customers = await ff.preset("customer", 100)
  })

  test("todos CPFs passam validação", () => {
    for (const c of customers) {
      expect(validarCpf(c.cpf)).toBe(true)
    }
  })
})`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Uso em NestJS</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// customer.seed.ts - seed via NestJS command
import { Command, CommandRunner } from "nest-commander"
import { FakeForge } from "fakeforge-br"
import { CustomerService } from "./customer.service"

@Command({ name: "seed:customers" })
export class CustomerSeedCommand extends CommandRunner {
  constructor(private readonly customers: CustomerService) { super() }

  async run(): Promise<void> {
    const ff = new FakeForge()
    const dados = await ff.preset("customer", 1000)
    await this.customers.bulkCreate(dados)
    console.log(\`\${dados.length} customers seeded\`)
  }
}`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Uso em Express</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// routes/dev.ts - endpoint só em dev
import { Router } from "express"
import { FakeForge } from "fakeforge-br"

const router = Router()
const ff = new FakeForge()

router.get("/dev/fake-cpfs", async (req, res) => {
  if (process.env.NODE_ENV === "production") return res.sendStatus(404)
  const qty = Number(req.query.qty || 10)
  const cpfs = await ff.cpf(qty)
  res.json({ cpfs })
})`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Próximos passos</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Testar API</Link>
          <Link href="/gerador-cpf-jest" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Jest fixture</Link>
          <Link href="/gerador-cpf-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Versão Python</Link>
          <Link href="/docs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Docs completas</Link>
        </div>
      </section>

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Gerador CPF", url: "/gerador-cpf" },
        { name: "Node.js", url: "/gerador-cpf-nodejs" },
      ]} />
    </PageShell>
  );
}
