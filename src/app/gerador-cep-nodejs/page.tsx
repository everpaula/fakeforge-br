import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de CEP em Node.js: SDK + TypeScript | FakeForge",
  description: "Gere CEP brasileiro válido em Node.js/TypeScript com SDK fakeforge-br. Cobre todas 27 capitais. Snippets Jest, NestJS, Express. Grátis 50/dia.",
  keywords: "gerador cep nodejs, cep valido node, cep typescript, cep jest, cep nestjs",
  alternates: { canonical: "/gerador-cep-nodejs" },
  openGraph: { title: "Gerador de CEP em Node.js", description: "SDK + TypeScript nativo.", type: "article", locale: "pt_BR" },
};

export default function GeradorCepNodejs() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Node.js · TypeScript</p>
        <h1 className="text-3xl font-bold tracking-tight">Gerador de <span className="text-primary">CEP em Node.js</span></h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          SDK <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">fakeforge-br</code> gera CEP no formato oficial dos Correios. TypeScript types nativos.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`npm install fakeforge-br

import { FakeForge } from "fakeforge-br"
const ceps = await new FakeForge().cep(100)`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">SDK oficial</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`import { FakeForge } from "fakeforge-br"

const ff = new FakeForge()

// 100 CEPs formatados
const ceps = await ff.cep(100)
ceps.forEach(c => console.log(c))

// Endereço completo com CEP
const enderecos = await ff.address(10)
enderecos.forEach(e => console.log(\`\${e.cep} — \${e.cidade}/\${e.estado}\`))`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Jest — teste de validador</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// tests/cep.test.ts
import { FakeForge } from "fakeforge-br"
import { validarCEP } from "../src/validators"

const ff = new FakeForge()

describe("CEP validator", () => {
  let ceps: string[]

  beforeAll(async () => {
    ceps = await ff.cep(50)
  })

  test.each([0, 1, 2, 3, 4])("aceita CEP válido #%i", (i) => {
    expect(validarCEP(ceps[i])).toBe(true)
  })

  test("rejeita CEP inválido", () => {
    expect(validarCEP("00000-000")).toBe(false)
  })
})`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">NestJS — validador pipe</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// cep.pipe.ts
import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common"

const CEP_REGEX = /^\\d{5}-?\\d{3}$/

@Injectable()
export class CEPPipe implements PipeTransform {
  transform(value: string) {
    if (!CEP_REGEX.test(value)) {
      throw new BadRequestException("CEP inválido")
    }
    return value.replace(/\\D/g, "")  // normaliza
  }
}

// Teste em Jest com fakeforge:
test("pipe aceita CEPs do FakeForge", async () => {
  const ff = new FakeForge()
  const ceps = await ff.cep(30)
  const pipe = new CEPPipe()
  ceps.forEach(c => expect(pipe.transform(c)).toBeTruthy())
})`}</code></pre>
      </section>

      <section className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Testar API</Link>
          <Link href="/gerador-cep" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">CEP por cidade</Link>
          <Link href="/gerador-cep-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Python</Link>
        </div>
      </section>

      <BreadcrumbSchema items={[{ name: "Início", url: "/" }, { name: "CEP", url: "/gerador-cep" }, { name: "Node.js", url: "/gerador-cep-nodejs" }]} />
    </PageShell>
  );
}
