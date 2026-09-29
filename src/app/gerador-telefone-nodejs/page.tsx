import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de Telefone em Node.js: SDK + Algoritmo + Faker.js",
  description: "Gere telefone brasileiro válido em Node.js/TypeScript com SDK fakeforge-br ou algoritmo local ANATEL. Comparação com Faker.js. Snippets pra Jest, NestJS. Grátis 50/dia.",
  keywords: "gerador telefone nodejs, gerar celular node, telefone typescript, faker telefone brasileiro, faker.js phone br, telefone valido node, ddd nodejs",
  alternates: { canonical: "/gerador-telefone-nodejs" },
  openGraph: { title: "Gerador de Telefone em Node.js", description: "SDK + algoritmo local + comparação com Faker.js.", type: "article", locale: "pt_BR" },
};

export default function GeradorTelefoneNodejs() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Node.js · TypeScript · SDK</p>
        <h1 className="text-3xl font-bold tracking-tight">Gerador de <span className="text-primary">Telefone em Node.js</span></h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Pra gerar telefone brasileiro válido em Node.js, instale <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">npm install fakeforge-br</code> e chame <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">new FakeForge().phone(n)</code>. O número segue o formato ANATEL (DDD válido + 9 + 8 dígitos no celular). Faker.js não garante isso por padrão, já que gera dígitos aleatórios sem checar DDD nem a regra do 9.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`npm install fakeforge-br

import { FakeForge } from "fakeforge-br"
const celulares = await new FakeForge().phone(100)`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Rota 1: SDK oficial fakeforge-br</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`import { FakeForge } from "fakeforge-br"

const ff = new FakeForge()

// 100 celulares formatados
const celulares = await ff.phone(100)
celulares.forEach(c => console.log(c))

// Sem formatação
const celularesRaw = await ff.phone(100, { formatted: false })

// Telefone fixo (10 dígitos, sem o 9)
const fixos = await ff.landline(50)

// Preset customer (telefone + nome + email correlacionados)
const pessoas = await ff.preset("customer", 10)
pessoas.forEach(p => console.log(p.telefone, p.nome))`}</code></pre>
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          TypeScript types nativos, correlação com outros campos, bulk até 10k por chamada. Requer internet.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Rota 2: algoritmo local (offline)</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// telefone.ts - algoritmo local, offline
const DDDS_VALIDOS = [
  11, 12, 13, 14, 15, 16, 17, 18, 19,
  21, 22, 24, 27, 28,
  31, 32, 33, 34, 35, 37, 38,
  41, 42, 43, 44, 45, 46, 47, 48, 49,
  51, 53, 54, 55,
  61, 62, 63, 64, 65, 66, 67, 68, 69,
  71, 73, 74, 75, 77, 79,
  81, 82, 83, 84, 85, 86, 87, 88, 89,
  91, 92, 93, 94, 95, 96, 97, 98, 99,
]

function randomDigits(n: number): string {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join("")
}

export function gerarCelular(formatado = true): string {
  const ddd = DDDS_VALIDOS[Math.floor(Math.random() * DDDS_VALIDOS.length)]
  const resto = randomDigits(8)
  if (formatado) return \`(\${ddd}) 9\${resto.slice(0, 4)}-\${resto.slice(4)}\`
  return \`\${ddd}9\${resto}\`
}

export function gerarFixo(formatado = true): string {
  const ddd = DDDS_VALIDOS[Math.floor(Math.random() * DDDS_VALIDOS.length)]
  const primeiro = 2 + Math.floor(Math.random() * 4)
  const resto = randomDigits(7)
  const numero = \`\${primeiro}\${resto}\`
  if (formatado) return \`(\${ddd}) \${numero.slice(0, 4)}-\${numero.slice(4)}\`
  return \`\${ddd}\${numero}\`
}

export function validarTelefone(numero: string): boolean {
  const d = numero.replace(/[^0-9]/g, "")
  if (d.length !== 10 && d.length !== 11) return false
  const ddd = parseInt(d.slice(0, 2), 10)
  if (!DDDS_VALIDOS.includes(ddd)) return false
  if (d.length === 11) return d[2] === "9"
  return ["2", "3", "4", "5"].includes(d[2])
}`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">FakeForge vs Faker.js pra telefone brasileiro</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
          O módulo <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">faker.phone.number()</code> do @faker-js/faker aceita um formato customizado (ex: <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">{"##"}</code> pra dígitos), mas não valida DDD nem obriga o 9 do celular. Pra ficar correto na regra ANATEL, você precisa montar a lógica de DDD e prefixo na mão:
        </p>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`import { faker } from "@faker-js/faker"
import { FakeForge } from "fakeforge-br"

// Faker.js: sem DDD válido, sem regra do 9 garantida
const telefoneFaker = faker.phone.number({ style: "national" })
console.log(telefoneFaker) // formato genérico, DDD pode não existir

// FakeForge: DDD dos 67 válidos + regra ANATEL do 9 garantida
const [telefoneFF] = await new FakeForge().phone(1)
console.log(telefoneFF) // "(41) 98765-4321"`}</code></pre>

        <div className="overflow-x-auto rounded-lg bg-card border border-border mt-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-3 py-2 text-muted">Critério</th>
                <th className="text-center px-3 py-2 text-muted">FakeForge</th>
                <th className="text-center px-3 py-2 text-muted">Faker.js</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["DDD dentre os 67 válidos", "✅", "❌ precisa montar na mão"],
                ["Regra do 9 no celular", "✅", "❌ precisa montar na mão"],
                ["Correlação com nome/endereço", "✅ via preset", "❌"],
                ["Funciona 100% offline", "❌", "✅"],
              ].map(([c, ff, faker], i) => (
                <tr key={i}>
                  <td className="px-3 py-2 text-muted-foreground">{c}</td>
                  <td className="px-3 py-2 text-center text-foreground">{ff}</td>
                  <td className="px-3 py-2 text-center text-foreground">{faker}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Uso em Jest</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// tests/telefone.test.ts
import { FakeForge } from "fakeforge-br"
import { validarMascaraTelefone } from "../src/validators"

const ff = new FakeForge()

describe("validador de telefone", () => {
  let celulares: string[]

  beforeAll(async () => {
    celulares = await ff.phone(50)
  })

  test.each([0, 1, 2, 3, 4])("aceita celular válido #%i", (i) => {
    expect(validarMascaraTelefone(celulares[i])).toBe(true)
  })

  test("rejeita telefone com DDD inexistente", () => {
    expect(validarMascaraTelefone("(20) 98765-4321")).toBe(false)
  })
})`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Comparação: qual escolher</h2>
        <div className="overflow-x-auto rounded-lg bg-card border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-3 py-2 text-muted">Cenário</th>
                <th className="text-center px-3 py-2 text-muted">SDK fakeforge-br</th>
                <th className="text-center px-3 py-2 text-muted">Algoritmo local</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["Só telefone simples", "✅", "✅"],
                ["Pessoa correlacionada", "✅", "❌"],
                ["100% offline", "❌", "✅"],
                ["Zero deps runtime", "✅", "✅"],
                ["Bulk 10k+", "✅ 1 chamada", "⚠️ loop"],
                ["Custo", "Free 50/dia", "R$0"],
              ].map(([c, sdk, local], i) => (
                <tr key={i}>
                  <td className="px-3 py-2 text-muted-foreground">{c}</td>
                  <td className="px-3 py-2 text-center text-foreground">{sdk}</td>
                  <td className="px-3 py-2 text-center text-foreground">{local}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Perguntas frequentes</h2>
        <div className="space-y-4">
          {[
            { q: "Faker.js gera telefone brasileiro válido?", a: "Não por padrão. O faker.phone.number() do @faker-js/faker gera dígitos aleatórios num formato customizável, mas não valida se o DDD existe nem obriga o 9 do celular. Pra formato ANATEL correto, use o SDK fakeforge-br ou monte a lista de 67 DDDs na mão." },
            { q: "Como gerar telefone válido em Node.js sem SDK externo?", a: "Use o algoritmo local: escolha um DDD da lista dos 67 válidos e monte o número com random.floor(Math.random() * 10) pros dígitos, sempre prefixando 9 no celular." },
            { q: "O SDK fakeforge-br tem tipagem TypeScript?", a: "Sim. Todos os métodos (phone, landline, preset) retornam tipos nativos, sem necessidade de @types adicional." },
            { q: "Dá pra usar o SDK em testes com Jest?", a: "Sim. Gere um lote de celulares válidos com ff.phone(n) numa fixture do beforeAll e itere com test.each pra validar seu parser ou máscara de input." },
          ].map(({ q, a }) => (
            <details key={q} className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">{q}</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Próximos passos</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Testar API</Link>
          <Link href="/gerador-telefone-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Versão Python</Link>
          <Link href="/gerador-telefone-curl" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Versão curl</Link>
          <Link href="/gerador-telefone" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Gerador de Telefone</Link>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Faker.js gera telefone brasileiro válido?", acceptedAnswer: { "@type": "Answer", text: "Não por padrão. O faker.phone.number() gera dígitos aleatórios num formato customizável, mas não valida DDD nem obriga o 9 do celular. Use o SDK fakeforge-br pra formato ANATEL correto." } },
              { "@type": "Question", name: "Como gerar telefone válido em Node.js sem SDK externo?", acceptedAnswer: { "@type": "Answer", text: "Use o algoritmo local: escolha um DDD entre os 67 válidos e monte o número com dígitos aleatórios, prefixando 9 no celular." } },
              { "@type": "Question", name: "O SDK fakeforge-br tem tipagem TypeScript?", acceptedAnswer: { "@type": "Answer", text: "Sim. Todos os métodos retornam tipos nativos, sem necessidade de pacote de tipos adicional." } },
              { "@type": "Question", name: "Dá pra usar o SDK em testes com Jest?", acceptedAnswer: { "@type": "Answer", text: "Sim. Gere um lote de celulares válidos com ff.phone(n) numa fixture e itere com test.each pra validar seu parser ou máscara de input." } },
            ],
          }),
        }}
      />

      <BreadcrumbSchema items={[{ name: "Início", url: "/" }, { name: "Gerador Telefone", url: "/gerador-telefone" }, { name: "Node.js", url: "/gerador-telefone-nodejs" }]} />
    </PageShell>
  );
}
