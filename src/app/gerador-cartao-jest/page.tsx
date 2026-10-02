import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de Cartão para Testes em Jest: Fixture + Luhn",
  description: "Fixture Jest com cartão sintético válido pelo algoritmo Luhn usando SDK fakeforge-br. Setup globalSetup, mock de gateway, teste E2E completo de checkout. Snippets prontos.",
  keywords: "gerador cartao jest, jest cartao fixture, jest luhn, mock gateway jest, jest checkout fixture, jest cartao testes",
  alternates: { canonical: "/gerador-cartao-jest" },
  openGraph: { title: "Gerador de Cartão para Testes em Jest", description: "Fixture + globalSetup + mock gateway.", type: "article", locale: "pt_BR" },
};

export default function GeradorCartaoJest() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Jest · fixture · Luhn</p>
        <h1 className="text-3xl font-bold tracking-tight">Gerador de <span className="text-primary">Cartão para Testes em Jest</span></h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Fixture pra cartão sintético em testes Jest — Luhn válido, filtro por bandeira, mock de gateway. Session fixture, globalSetup, snapshot fixture. Tudo com SDK <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">fakeforge-br</code>. Ambiente de desenvolvimento apenas.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`npm install --save-dev fakeforge-br

// tests/fixtures/cartao.ts
import { FakeForge } from "fakeforge-br"
export const ff = new FakeForge()`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Fixture com cache</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// tests/fixtures/cartao-fixture.ts
import { FakeForge, CreditCard } from "fakeforge-br"

const ff = new FakeForge()
let cache: Record<string, CreditCard[]> = {}

export async function getCartoes(brand?: string, qty = 10): Promise<CreditCard[]> {
  const key = brand || "any"
  if (!cache[key] || cache[key].length < qty) {
    const url = brand
      ? \`?type=creditCard&brand=\${brand}&quantity=\${Math.max(qty, 50)}\`
      : \`?type=creditCard&quantity=\${Math.max(qty, 50)}\`
    // FakeForge SDK abstrai o URL; passamos brand como opção
    cache[key] = await ff.creditCard(Math.max(qty, 50), true)
  }
  return cache[key].slice(0, qty)
}`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Teste E2E — checkout aprovado</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// tests/checkout.test.ts
import { getCartoes } from "./fixtures/cartao-fixture"
import request from "supertest"
import app from "../src/app"

describe("POST /checkout", () => {
  test("aceita cartão com Luhn válido", async () => {
    const [cartao] = await getCartoes(undefined, 1)
    const res = await request(app).post("/checkout").send({
      cardNumber: cartao.number.replace(/\\s/g, ""),
      cardCvv: cartao.cvv,
      cardExpiry: cartao.expiry,
      cardHolder: cartao.holder,
      amount: 100.00,
    })
    expect(res.status).toBe(200)
    expect(res.body.status).toBe("approved")
  })

  test("rejeita cartão com Luhn inválido", async () => {
    const res = await request(app).post("/checkout").send({
      cardNumber: "1234567890123456",  // Luhn inválido
      cardCvv: "123",
      cardExpiry: "12/28",
    })
    expect(res.status).toBe(400)
  })
})`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Mock de gateway (Stripe)</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// tests/payment.test.ts
import { getCartoes } from "./fixtures/cartao-fixture"

jest.mock("stripe", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    paymentIntents: {
      create: jest.fn().mockResolvedValue({ id: "pi_mock", status: "succeeded" }),
    },
  })),
}))

test("PaymentService cria intent no Stripe", async () => {
  const { PaymentService } = await import("../src/payment.service")
  const [cartao] = await getCartoes(undefined, 1)

  const result = await PaymentService.pay({
    cardNumber: cartao.number,
    amount: 5000,  // R$50
  })

  expect(result.status).toBe("succeeded")
  expect(result.intentId).toBe("pi_mock")
})`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Snapshot fixture determinística</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# scripts/gen-cartoes-snapshot.mjs - roda 1 vez, commita
import { FakeForge } from "fakeforge-br"
import fs from "fs"

const ff = new FakeForge()
const cartoes = await ff.creditCard(50)
fs.writeFileSync("tests/fixtures/cartoes-snapshot.json", JSON.stringify(cartoes, null, 2))

# tests/loader.ts
import snapshot from "./fixtures/cartoes-snapshot.json"
export const cartoesSnapshot = snapshot`}</code></pre>
      </section>

      <section className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Testar API</Link>
          <Link href="/gerador-cartao-nodejs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Node.js completo</Link>
          <Link href="/gerador-cartao-pytest" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">pytest equivalente</Link>
        </div>
      </section>

      <BreadcrumbSchema items={[{ name: "Início", url: "/" }, { name: "Cartão", url: "/gerador-cartao" }, { name: "Jest", url: "/gerador-cartao-jest" }]} />
    </PageShell>
  );
}
