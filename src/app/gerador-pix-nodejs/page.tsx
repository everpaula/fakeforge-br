import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de Chave PIX em Node.js: SDK + 4 tipos BACEN",
  description: "Gere chave PIX válida em Node.js/TypeScript (CPF, email, telefone, aleatória) com SDK fakeforge-br. Snippets pra Jest, NestJS, Express, Playwright. Formato BACEN. Grátis 50/dia.",
  keywords: "gerador pix nodejs, chave pix node, pix typescript, pix jest, pix nestjs, pix express, gerar chave pix aleatoria node",
  alternates: { canonical: "/gerador-pix-nodejs" },
  openGraph: { title: "Gerador de PIX em Node.js", description: "SDK + 4 tipos BACEN. Pra Jest, NestJS, Playwright.", type: "article", locale: "pt_BR" },
};

export default function GeradorPixNodejs() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Node.js · TypeScript · SDK</p>
        <h1 className="text-3xl font-bold tracking-tight">Gerador de <span className="text-primary">Chave PIX em Node.js</span></h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          SDK oficial <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">fakeforge-br</code> gera os 4 tipos de chave PIX BACEN. TypeScript types nativos. Snippets pra Jest, Vitest, NestJS, Express, Playwright E2E.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`npm install fakeforge-br

import { FakeForge } from "fakeforge-br"
const chaves = await new FakeForge().pixKey(100)`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Os 4 tipos de chave PIX BACEN</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`import { FakeForge } from "fakeforge-br"

const ff = new FakeForge()

// Aleatório entre 4 tipos
const chaves = await ff.pixKey(20)

// Preset fintech tem cliente + 3-4 chaves por cliente correlacionadas
const [cliente] = await ff.preset("fintech", 1)
cliente.pix_keys.forEach(chave => {
  console.log(\`\${chave.type}: \${chave.value}\`)
})

// Output típico:
// cpf: 12345678909  (só dígitos)
// email: marina.souza@gmail.com
// phone: +5511987654321
// aleatoria: 8f4e2c91-a3b7-4d5e-9f2a-1c8b6d0e5a3f`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Uso em Jest — teste de transferência PIX</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// tests/pix-transfer.test.ts
import { FakeForge } from "fakeforge-br"
import { PixService } from "../src/pix.service"

const ff = new FakeForge()

describe("PixService.transferir", () => {
  let clientes: Array<{ pix_keys: Array<{ type: string; value: string }> }>

  beforeAll(async () => {
    clientes = await ff.preset("fintech", 10)
  })

  test("aceita transferência entre 2 CPFs", async () => {
    const origem = clientes[0].pix_keys.find(c => c.type === "cpf")!
    const destino = clientes[1].pix_keys.find(c => c.type === "cpf")!

    const service = new PixService()
    const result = await service.transferir({
      chaveOrigem: origem.value,
      chaveDestino: destino.value,
      valor: 100.00,
    })

    expect(result.status).toBe("concluido")
  })

  test.each(["cpf", "email", "phone", "aleatoria"])(
    "valida chave tipo %s",
    (tipo) => {
      const chave = clientes[0].pix_keys.find(c => c.type === tipo)!
      const service = new PixService()
      expect(service.validarChave(chave.type, chave.value)).toBe(true)
    }
  )
})`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Uso em NestJS (seed command)</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// pix.seed.command.ts
import { Command, CommandRunner } from "nest-commander"
import { FakeForge } from "fakeforge-br"
import { PixKeyService } from "./pix-key.service"

@Command({ name: "seed:pix-keys" })
export class PixKeySeedCommand extends CommandRunner {
  constructor(private pix: PixKeyService) { super() }

  async run(): Promise<void> {
    const ff = new FakeForge()
    const clientes = await ff.preset("fintech", 200)

    const chaves = clientes.flatMap(c =>
      c.pix_keys.map(k => ({
        cpf: c.customer.cpf,
        tipo: k.type,
        valor: k.value,
      }))
    )

    await this.pix.bulkCreate(chaves)
    console.log(\`\${chaves.length} chaves PIX seeded\`)
  }
}`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Playwright E2E — teste de QR Code PIX</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// e2e/pix-qr.spec.ts
import { test, expect } from "@playwright/test"
import { FakeForge } from "fakeforge-br"

const ff = new FakeForge()

test("gera QR Code PIX no checkout", async ({ page }) => {
  const [cliente] = await ff.preset("fintech", 1)
  const chavePix = cliente.pix_keys.find(k => k.type === "cpf")!

  await page.goto("https://staging.myapp.com/checkout")
  await page.selectOption("[data-test=payment-method]", "pix")
  await page.fill("[data-test=pix-key]", chavePix.value)
  await page.click("[data-test=generate-qr]")

  await expect(page.locator("[data-test=qr-code-image]")).toBeVisible()
  await expect(page.locator("[data-test=qr-code-copy-paste]")).toContainText("00020126")
})`}</code></pre>
      </section>

      <section className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Testar API</Link>
          <Link href="/preset-fintech" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Preset fintech</Link>
          <Link href="/gerador-pix-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Versão Python</Link>
        </div>
      </section>

      <BreadcrumbSchema items={[{ name: "Início", url: "/" }, { name: "PIX", url: "/gerador-pix" }, { name: "Node.js", url: "/gerador-pix-nodejs" }]} />
    </PageShell>
  );
}
