import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de Cartão para Testes em Node.js: SDK + Luhn",
  description: "Gere números sintéticos de cartão para testes de checkout em Node.js/TypeScript. SDK fakeforge-br cobre Visa, Mastercard, Elo, Amex com Luhn válido. Snippets Jest, NestJS, Express, Playwright.",
  keywords: "gerador cartao nodejs para testes, cartao credito node testes, luhn nodejs, cartao typescript testes, cartao jest, cartao nestjs, cartao express, cartao playwright",
  alternates: { canonical: "/gerador-cartao-nodejs" },
  openGraph: { title: "Gerador de Cartão para Testes em Node.js", description: "SDK + Luhn TS pra testes de checkout em Jest, NestJS, Playwright.", type: "article", locale: "pt_BR" },
};

export default function GeradorCartaoNodejs() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Node.js · TypeScript · SDK</p>
        <h1 className="text-3xl font-bold tracking-tight">Gerador de <span className="text-primary">Cartão para Testes em Node.js</span></h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          SDK oficial <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">fakeforge-br</code> gera números sintéticos de cartão que passam validação Luhn (mod-10). TypeScript types nativos. Snippets pra Jest, Vitest, NestJS, Express, Playwright E2E. Ambiente de desenvolvimento apenas.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`npm install fakeforge-br

import { FakeForge } from "fakeforge-br"
const cartoes = await new FakeForge().creditCard(100)`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">SDK oficial (com TypeScript types)</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`import { FakeForge, CreditCard } from "fakeforge-br"

const ff = new FakeForge()

// Type-safe
const cartoes: CreditCard[] = await ff.creditCard(100)

for (const c of cartoes) {
  console.log(c.number, c.brand, c.holder, c.expiry, c.cvv)
}

// Preset fintech: cartão + banco + PIX + score coerentes
const [cliente] = await ff.preset("fintech", 1)
// cliente.credit_card já vem correlacionado`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Algoritmo Luhn local (TypeScript)</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// utils/luhn.ts
const BIN_TESTE: Record<string, string> = {
  visa: "4",
  mastercard: "5",
  elo: "6362",
}

function luhnChecksum(numeroSemDv: string): number {
  const digitos = numeroSemDv.split("").reverse().map(Number)
  let total = 0
  for (let i = 0; i < digitos.length; i++) {
    if (i % 2 === 0) {
      const dobrado = digitos[i] * 2
      total += dobrado < 10 ? dobrado : dobrado - 9
    } else {
      total += digitos[i]
    }
  }
  return (10 - (total % 10)) % 10
}

export function gerarCartaoLuhn(bandeira: "visa" | "mastercard" | "elo" = "visa"): string {
  const prefixo = BIN_TESTE[bandeira]
  const tamPrefixo = prefixo.length
  const aleatorios = Array.from({ length: 15 - tamPrefixo }, () =>
    Math.floor(Math.random() * 10)
  ).join("")
  const parcial = prefixo + aleatorios
  const dv = luhnChecksum(parcial)
  return \`\${parcial}\${dv}\`
}`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Uso em Jest — teste de checkout</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// tests/checkout.test.ts
import { FakeForge } from "fakeforge-br"
import { CheckoutService } from "../src/checkout.service"

const ff = new FakeForge()

describe("Checkout — validação Luhn", () => {
  let cartoes: Array<{ number: string; brand: string }>

  beforeAll(async () => {
    cartoes = await ff.creditCard(50)
  })

  test.each([0, 1, 2, 3, 4])("aceita cartão sintético #%i", async (i) => {
    const service = new CheckoutService()
    const resultado = await service.validarCartao(cartoes[i].number)
    expect(resultado.valido).toBe(true)
  })

  test("rejeita Luhn inválido", async () => {
    const service = new CheckoutService()
    expect((await service.validarCartao("1234 5678 9012 3456")).valido).toBe(false)
  })
})`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Playwright E2E — teste de checkout completo</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// e2e/checkout.spec.ts
import { test, expect } from "@playwright/test"
import { FakeForge } from "fakeforge-br"

const ff = new FakeForge()

test("checkout completo em ambiente staging", async ({ page }) => {
  const [cartao] = await ff.creditCard(1)

  await page.goto("https://staging.myapp.com/checkout")
  await page.fill("[data-test=card-number]", cartao.number.replace(/\\s/g, ""))
  await page.fill("[data-test=card-cvv]", cartao.cvv)
  await page.fill("[data-test=card-expiry]", cartao.expiry)
  await page.fill("[data-test=card-holder]", cartao.holder)
  await page.click("[data-test=submit-payment]")

  await expect(page.locator("[data-test=payment-status]")).toHaveText("aprovado")
})`}</code></pre>
      </section>

      <section className="mb-8">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Números gerados são sintéticos, não pertencem a ninguém, não têm saldo real. Passam validação Luhn no client-side. Gateway real (Stripe, Mercado Pago, PagSeguro) vai rejeitar em transação verdadeira — use os cartões de teste oficiais do gateway pra testar aprovação/recusa de transação (ver <Link href="/cartao-credito-teste-stripe" className="text-primary hover:underline">guia Stripe</Link>).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Próximos passos</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Testar API</Link>
          <Link href="/cartao-credito-teste-stripe" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Sandbox Stripe</Link>
          <Link href="/gerador-cartao-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Versão Python</Link>
        </div>
      </section>

      <BreadcrumbSchema items={[{ name: "Início", url: "/" }, { name: "Cartão", url: "/gerador-cartao" }, { name: "Node.js", url: "/gerador-cartao-nodejs" }]} />
    </PageShell>
  );
}
