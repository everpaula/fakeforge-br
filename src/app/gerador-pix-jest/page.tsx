import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de Chave PIX em Jest: Fixture + 4 tipos BACEN",
  description: "Fixture Jest com chave PIX válida BACEN usando SDK fakeforge-br. Setup globalSetup, mock de banco central, teste E2E de QR Code PIX. Snippets prontos.",
  keywords: "gerador pix jest, jest pix fixture, pix bacen jest, mock pix jest, jest qr code pix",
  alternates: { canonical: "/gerador-pix-jest" },
  openGraph: { title: "Gerador de PIX em Jest", description: "Fixture + globalSetup + 4 tipos BACEN.", type: "article", locale: "pt_BR" },
};

export default function GeradorPixJest() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Jest · fixture · BACEN</p>
        <h1 className="text-3xl font-bold tracking-tight">Gerador de <span className="text-primary">Chave PIX em Jest</span></h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Fixture pra chave PIX válida em testes Jest — cobre os 4 tipos BACEN (CPF, email, telefone, aleatória). Session fixture, globalSetup, mock de banco central. SDK <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">fakeforge-br</code>.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`npm install --save-dev fakeforge-br

// tests/fixtures/pix.ts
import { FakeForge } from "fakeforge-br"
export const ff = new FakeForge()`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Fixture — chaves por tipo</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// tests/fixtures/pix-fixture.ts
import { FakeForge } from "fakeforge-br"

const ff = new FakeForge()

interface PixKey { type: "cpf" | "email" | "phone" | "aleatoria"; value: string }

let cache: PixKey[] | null = null

export async function getPixKeys(qty = 20): Promise<PixKey[]> {
  if (!cache || cache.length < qty) {
    // Usa preset fintech que traz 3-4 chaves por cliente correlacionadas
    const clientes = await ff.preset("fintech", Math.ceil(qty / 3))
    cache = clientes.flatMap(c => c.pix_keys)
  }
  return cache.slice(0, qty)
}

export async function getPixKeyByType(type: PixKey["type"]): Promise<PixKey> {
  const keys = await getPixKeys(50)
  const found = keys.find(k => k.type === type)
  if (!found) throw new Error(\`Nenhuma chave tipo \${type}\`)
  return found
}`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Teste — validador de chave PIX</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// tests/pix-validator.test.ts
import { getPixKeys, getPixKeyByType } from "./fixtures/pix-fixture"
import { PixValidator } from "../src/pix.validator"

describe("PixValidator", () => {
  const validator = new PixValidator()

  test.each(["cpf", "email", "phone", "aleatoria"] as const)(
    "aceita chave tipo %s",
    async (type) => {
      const chave = await getPixKeyByType(type)
      expect(validator.isValid(chave.type, chave.value)).toBe(true)
    }
  )

  test("rejeita CPF inválido", () => {
    expect(validator.isValid("cpf", "111.111.111-11")).toBe(false)
  })

  test("rejeita email malformado", () => {
    expect(validator.isValid("email", "not-an-email")).toBe(false)
  })

  test("rejeita phone sem +55", () => {
    expect(validator.isValid("phone", "11987654321")).toBe(false)
  })
})`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Teste E2E — transferência PIX</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// tests/pix-transfer.test.ts
import request from "supertest"
import app from "../src/app"
import { getPixKeys } from "./fixtures/pix-fixture"

describe("POST /pix/transferir", () => {
  test("transfere entre 2 chaves", async () => {
    const [chaveOrigem, chaveDestino] = await getPixKeys(2)

    const res = await request(app)
      .post("/pix/transferir")
      .send({
        chaveOrigem: chaveOrigem.value,
        chaveDestino: chaveDestino.value,
        valorCentavos: 10000,
        descricao: "Test transfer",
      })

    expect(res.status).toBe(200)
    expect(res.body.status).toBe("concluido")
    expect(res.body.id_end2end).toMatch(/^E\\d{8}\\d{20}$/)  // formato BACEN
  })
})`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Mock de banco central</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// tests/pix-service.test.ts
import { getPixKeys } from "./fixtures/pix-fixture"

jest.mock("../src/bacen.client", () => ({
  BacenClient: jest.fn().mockImplementation(() => ({
    consultarChave: jest.fn().mockResolvedValue({
      nome: "MARINA SOUZA OLIVEIRA",
      cpf: "***.789.***",
      banco: "260",
    }),
  })),
}))

test("PixService consulta chave no BACEN antes de transferir", async () => {
  const { PixService } = await import("../src/pix.service")
  const [chave] = await getPixKeys(1)

  const service = new PixService()
  const info = await service.consultarChave(chave.value)

  expect(info.nome).toBe("MARINA SOUZA OLIVEIRA")
})`}</code></pre>
      </section>

      <section className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Testar API</Link>
          <Link href="/gerador-pix-nodejs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Node.js completo</Link>
          <Link href="/gerador-pix-pytest" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">pytest equivalente</Link>
        </div>
      </section>

      <BreadcrumbSchema items={[{ name: "Início", url: "/" }, { name: "PIX", url: "/gerador-pix" }, { name: "Jest", url: "/gerador-pix-jest" }]} />
    </PageShell>
  );
}
