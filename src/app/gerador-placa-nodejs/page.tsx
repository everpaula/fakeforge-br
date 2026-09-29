import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de Placa Mercosul em Node.js: SDK + Regex + Zod",
  description: "Gere placa de carro brasileira (Mercosul e antiga) em Node.js/TypeScript com SDK fakeforge-br ou regex local. CONTRAN 729/2018. Validação com Zod. Grátis 50/dia.",
  keywords: "gerador de placa nodejs, gerar placa mercosul node, placa carro typescript, contran 729 node, placa regex node, placa zod validacao",
  alternates: { canonical: "/gerador-placa-nodejs" },
  openGraph: { title: "Gerador de Placa Mercosul em Node.js", description: "SDK + regex local + validação Zod.", type: "article", locale: "pt_BR" },
};

export default function GeradorPlacaNodejs() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Node.js · TypeScript · SDK</p>
        <h1 className="text-3xl font-bold tracking-tight">Gerador de <span className="text-primary">Placa Mercosul em Node.js</span></h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          SDK <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">fakeforge-br</code> gera placa Mercosul (LLLNLNN) e formato antigo (LLL-NNNN) válidos pela Resolução CONTRAN 729/2018. TypeScript nativo, com validação de schema pronta pra Zod.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`npm install fakeforge-br

import { FakeForge } from "fakeforge-br"
const placas = await new FakeForge().placa(100)`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Rota 1: SDK oficial fakeforge-br</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`import { FakeForge } from "fakeforge-br"

const ff = new FakeForge()

// 100 placas Mercosul (LLLNLNN)
const placas = await ff.placa(100)
console.log(placas[0]) // "ABC1D23"

// 50 placas no formato antigo (LLL-NNNN)
const placasAntigas = await ff.placaAntiga(50)
console.log(placasAntigas[0]) // "ABC-1234"`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Rota 2: algoritmo local com regex (offline)</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// placa.ts - algoritmo local, offline
const LETRAS_VALIDAS = "ABCDEFGHJKLMNPRSTUVWXYZ".split("") // sem I, O, Q

const REGEX_MERCOSUL = /^[A-HJ-NP-Z]{3}[0-9][A-HJ-NP-Z][0-9]{2}$/
const REGEX_ANTIGA = /^[A-HJ-NP-Z]{3}[0-9]{4}$/

function letraAleatoria(): string {
  return LETRAS_VALIDAS[Math.floor(Math.random() * LETRAS_VALIDAS.length)]
}

export function gerarPlacaMercosul(): string {
  const letras = letraAleatoria() + letraAleatoria() + letraAleatoria()
  const d1 = Math.floor(Math.random() * 10)
  const letraMeio = letraAleatoria()
  const d2 = Math.floor(Math.random() * 10)
  const d3 = Math.floor(Math.random() * 10)
  return \`\${letras}\${d1}\${letraMeio}\${d2}\${d3}\`
}

export function gerarPlacaAntiga(): string {
  const letras = letraAleatoria() + letraAleatoria() + letraAleatoria()
  const numeros = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join("")
  return \`\${letras}-\${numeros}\`
}

export function validarPlaca(placa: string): "mercosul" | "antiga" | null {
  const limpa = placa.replace("-", "")
  if (REGEX_MERCOSUL.test(limpa)) return "mercosul"
  if (REGEX_ANTIGA.test(limpa)) return "antiga"
  return null
}`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Uso com Zod (validação de schema)</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
          Comum em formulários de seguradoras e locadoras: validar a placa antes de aceitar o cadastro, cobrindo os dois formatos.
        </p>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// placa.schema.ts
import { z } from "zod"

const REGEX_PLACA = /^[A-HJ-NP-Z]{3}([0-9]{4}|[0-9][A-HJ-NP-Z][0-9]{2})$/

export const placaSchema = z
  .string()
  .transform(p => p.replace("-", "").toUpperCase())
  .refine(p => REGEX_PLACA.test(p), { message: "Placa inválida" })

// teste rápido com placas do FakeForge
import { FakeForge } from "fakeforge-br"

const ff = new FakeForge()
const placas = await ff.placa(20)

placas.forEach(p => {
  const resultado = placaSchema.safeParse(p)
  console.log(p, resultado.success)
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
                ["Só placa simples", "✅", "✅"],
                ["Validador embutido (retorna tipo)", "✅", "✅"],
                ["100% offline", "❌", "✅"],
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
            { q: "Como gerar placa Mercosul válida em Node.js?", a: "Use new FakeForge().placa(n) do SDK fakeforge-br, ou monte o regex local em TypeScript combinando 3 letras (sem I, O, Q) + dígito + letra + 2 dígitos." },
            { q: "Como validar placa com Zod em Node.js?", a: "Crie um schema z.string().refine() usando a regex que aceita os dois formatos: /^[A-HJ-NP-Z]{3}([0-9]{4}|[0-9][A-HJ-NP-Z][0-9]{2})$/." },
            { q: "O SDK gera placa antiga também?", a: "Sim. Use ff.placaAntiga(n) pra formato legado (LLL-NNNN), separado do ff.placa(n) que gera Mercosul." },
            { q: "Por que a regex usa [A-HJ-NP-Z] em vez de [A-Z]?", a: "Porque exclui I, O e Q nativamente no range, evitando checagem extra. É a mesma regra visual do DENATRAN pra placas." },
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
          <Link href="/gerador-placa-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Versão Python</Link>
          <Link href="/gerador-placa-curl" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Versão curl</Link>
          <Link href="/gerador-placa-mercosul" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Gerador de Placa</Link>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Como gerar placa Mercosul válida em Node.js?", acceptedAnswer: { "@type": "Answer", text: "Use new FakeForge().placa(n) do SDK fakeforge-br, ou monte o regex local combinando 3 letras (sem I, O, Q) + dígito + letra + 2 dígitos." } },
              { "@type": "Question", name: "Como validar placa com Zod em Node.js?", acceptedAnswer: { "@type": "Answer", text: "Crie um schema z.string().refine() usando a regex que aceita os dois formatos de placa brasileira." } },
              { "@type": "Question", name: "O SDK gera placa antiga também?", acceptedAnswer: { "@type": "Answer", text: "Sim. Use ff.placaAntiga(n) pra formato legado, separado do ff.placa(n) que gera Mercosul." } },
              { "@type": "Question", name: "Por que a regex usa [A-HJ-NP-Z] em vez de [A-Z]?", acceptedAnswer: { "@type": "Answer", text: "Porque exclui I, O e Q nativamente no range, seguindo a regra visual do DENATRAN pra placas." } },
            ],
          }),
        }}
      />

      <BreadcrumbSchema items={[{ name: "Início", url: "/" }, { name: "Gerador Placa", url: "/gerador-placa-mercosul" }, { name: "Node.js", url: "/gerador-placa-nodejs" }]} />
    </PageShell>
  );
}
