import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de Telefone via curl: API REST + Postman + Insomnia",
  description: "Gere telefone brasileiro válido via curl. API REST + bash + import pra Postman e Insomnia. Algoritmo local em bash pra fallback offline. Grátis 50/dia sem cadastro.",
  keywords: "gerador telefone curl, telefone api rest bash, gerador celular postman, gerador telefone insomnia, telefone valido curl",
  alternates: { canonical: "/gerador-telefone-curl" },
  openGraph: { title: "Gerador de Telefone via curl", description: "API REST + bash + Postman + Insomnia.", type: "article", locale: "pt_BR" },
};

export default function GeradorTelefoneCurl() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">curl · bash · Postman · Insomnia</p>
        <h1 className="text-3xl font-bold tracking-tight">Gerador de <span className="text-primary">Telefone via curl</span></h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          A API REST do FakeForge gera telefone brasileiro no formato ANATEL (DDD válido + 9 no celular) direto via curl, sem SDK. Um GET com type=phone retorna celular; type=landline retorna fixo. Importa fácil pra Postman e Insomnia.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`curl "https://fakeforge.com.br/api/generate?type=phone&quantity=100"`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Rota 1: API REST oficial</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
          Zero SDK, só curl e jq. Suporta celular, fixo, formatação e export CSV/SQL.
        </p>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# 5 celulares formatados
curl "https://fakeforge.com.br/api/generate?type=phone&quantity=5"
# {"type":"phone","quantity":5,"data":["(11) 98765-4321","(41) 97654-3210",...]}

# Telefone fixo
curl "https://fakeforge.com.br/api/generate?type=landline&quantity=5"

# Sem formatação
curl "https://fakeforge.com.br/api/generate?type=phone&quantity=5&formatted=false"

# CSV
curl "https://fakeforge.com.br/api/generate?type=phone&quantity=100&format=csv"

# SQL
curl "https://fakeforge.com.br/api/generate?type=phone&quantity=100&format=sql"`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Rota 2: algoritmo local em bash (offline)</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
          Se você precisa gerar telefone sem depender de rede (ex: dentro de um container isolado em CI), replica o padrão ANATEL direto em bash:
        </p>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`#!/usr/bin/env bash
# telefone.sh - algoritmo local, sem chamar a API

DDDS=(11 12 13 14 15 16 17 18 19 21 22 24 27 28 31 32 33 34 35 37 38 41 42 43 44 45 46 47 48 49 51 53 54 55 61 62 63 64 65 66 67 68 69 71 73 74 75 77 79 81 82 83 84 85 86 87 88 89 91 92 93 94 95 96 97 98 99)

gerar_celular() {
  local ddd=\${DDDS[$((RANDOM % \${#DDDS[@]}))]}
  local resto=""
  for i in {1..8}; do resto+="$((RANDOM % 10))"; done
  echo "($ddd) 9\${resto:0:4}-\${resto:4:4}"
}

for i in $(seq 1 10); do
  gerar_celular
done`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Postman e Insomnia</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
          Não precisa de collection pronta: os dois clientes importam direto a partir de um curl. No Postman, use <em>Import → Raw text</em> e cole o comando abaixo. No Insomnia, <em>Create → Import → From Clipboard</em> faz o mesmo.
        </p>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# Cole isso no Import (Postman ou Insomnia)
curl "https://fakeforge.com.br/api/generate?type=phone&quantity=100&formatted=true"

# Requisição HTTP crua, se preferir montar manualmente
GET /api/generate?type=phone&quantity=100 HTTP/1.1
Host: fakeforge.com.br
Accept: application/json`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Comparação: qual escolher</h2>
        <div className="overflow-x-auto rounded-lg bg-card border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-3 py-2 text-muted">Cenário</th>
                <th className="text-center px-3 py-2 text-muted">API REST</th>
                <th className="text-center px-3 py-2 text-muted">Algoritmo bash local</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["Só telefone simples", "✅", "✅"],
                ["Export CSV/SQL nativo", "✅", "❌"],
                ["100% offline (sem rede)", "❌", "✅"],
                ["Zero deps (jq, curl)", "⚠️ precisa jq", "✅"],
                ["Bulk 10k+", "✅ 1 chamada", "⚠️ loop"],
                ["Custo", "Free 50/dia", "R$0"],
              ].map(([c, api, local], i) => (
                <tr key={i}>
                  <td className="px-3 py-2 text-muted-foreground">{c}</td>
                  <td className="px-3 py-2 text-center text-foreground">{api}</td>
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
            { q: "Como gerar telefone brasileiro via curl?", a: "GET https://fakeforge.com.br/api/generate?type=phone&quantity=100. Retorna JSON com celulares no formato ANATEL. Use type=landline pra telefone fixo. São 100 chamadas grátis por dia." },
            { q: "Dá pra importar direto no Postman ou Insomnia?", a: "Sim. Cole o comando curl em Import → Raw text (Postman) ou Create → Import → From Clipboard (Insomnia). Os dois convertem o comando numa requisição pronta pra editar." },
            { q: "Preciso de API key pra usar a API?", a: "Não pro plano free (50 chamadas/dia). Planos pagos usam header de autenticação, documentado em /docs." },
            { q: "Existe jeito de gerar telefone sem chamar a API?", a: "Sim. O algoritmo local em bash (função gerar_celular) monta o número usando um DDD válido dos 67 existentes, sem depender de rede nem de curl." },
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
          <Link href="/docs" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Docs API</Link>
          <Link href="/gerador-telefone-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Versão Python</Link>
          <Link href="/gerador-telefone-nodejs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Versão Node.js</Link>
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
              { "@type": "Question", name: "Como gerar telefone brasileiro via curl?", acceptedAnswer: { "@type": "Answer", text: "GET https://fakeforge.com.br/api/generate?type=phone&quantity=100. Retorna JSON com celulares no formato ANATEL. Use type=landline para fixo. 100 chamadas grátis por dia." } },
              { "@type": "Question", name: "Dá pra importar direto no Postman ou Insomnia?", acceptedAnswer: { "@type": "Answer", text: "Sim. Cole o comando curl em Import → Raw text (Postman) ou Create → Import → From Clipboard (Insomnia)." } },
              { "@type": "Question", name: "Preciso de API key pra usar a API?", acceptedAnswer: { "@type": "Answer", text: "Não pro plano free (50 chamadas/dia). Planos pagos usam header de autenticação, documentado em /docs." } },
              { "@type": "Question", name: "Existe jeito de gerar telefone sem chamar a API?", acceptedAnswer: { "@type": "Answer", text: "Sim. O algoritmo local em bash monta o número usando um DDD válido dos 67 existentes, sem depender de rede." } },
            ],
          }),
        }}
      />

      <BreadcrumbSchema items={[{ name: "Início", url: "/" }, { name: "Gerador Telefone", url: "/gerador-telefone" }, { name: "curl", url: "/gerador-telefone-curl" }]} />
    </PageShell>
  );
}
