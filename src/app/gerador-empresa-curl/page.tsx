import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de Empresa via curl: API REST + Shell Scripts",
  description: "Gere empresa fictícia (CNPJ, razão social, endereço) via curl. API REST + shell scripts pra seed de banco. Algoritmo mod-11 em bash pra fallback offline. Grátis 50/dia.",
  keywords: "gerador empresa curl, cnpj api rest bash, empresa fake shell script, gerador cnpj curl, seed banco empresa bash",
  alternates: { canonical: "/gerador-empresa-curl" },
  openGraph: { title: "Gerador de Empresa via curl", description: "API REST + shell scripts + algoritmo bash local.", type: "article", locale: "pt_BR" },
};

export default function GeradorEmpresaCurl() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">curl · bash · shell scripts</p>
        <h1 className="text-3xl font-bold tracking-tight">Gerador de <span className="text-primary">Empresa via curl</span></h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          A API REST do FakeForge gera empresa fictícia completa (CNPJ, razão social, endereço, telefone) direto via curl. Um GET com type=company retorna o objeto todo; combinado com jq, monta CSV ou SQL pra seed de banco.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`curl "https://fakeforge.com.br/api/generate?type=company&quantity=50"`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Rota 1: API REST oficial</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# 5 empresas em JSON
curl "https://fakeforge.com.br/api/generate?type=company&quantity=5"

# 500 empresas em SQL, pronto pra seed
curl -X POST https://fakeforge.com.br/api/generate \\
  -H "Content-Type: application/json" \\
  -d '{"type":"company","quantity":500,"format":"sql"}' \\
  > seed_empresas.sql

# 500 empresas em CSV
curl -X POST https://fakeforge.com.br/api/generate \\
  -H "Content-Type: application/json" \\
  -d '{"type":"company","quantity":500,"format":"csv"}' \\
  > empresas.csv`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Rota 2: algoritmo local em bash (offline)</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
          Pra gerar CNPJ sem chamar a API (útil em pipelines isolados), o mod-11 dá pra fazer com aritmética pura de bash:
        </p>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`#!/usr/bin/env bash
# empresa.sh - gera CNPJ mod-11 localmente, sem API

gerar_cnpj() {
  local n=()
  for i in {1..8}; do n+=($((RANDOM % 10))); done
  n+=(0 0 0 1)  # sufixo /0001 (matriz)

  local pesos1=(5 4 3 2 9 8 7 6 5 4 3 2)
  local soma=0
  for i in "\${!pesos1[@]}"; do soma=$((soma + n[i] * pesos1[i])); done
  local resto=$((soma % 11))
  local d1=$((resto < 2 ? 0 : 11 - resto))
  n+=($d1)

  local pesos2=(6 5 4 3 2 9 8 7 6 5 4 3 2)
  soma=0
  for i in "\${!pesos2[@]}"; do soma=$((soma + n[i] * pesos2[i])); done
  resto=$((soma % 11))
  local d2=$((resto < 2 ? 0 : 11 - resto))
  n+=($d2)

  local cnpj="\${n[0]}\${n[1]}.\${n[2]}\${n[3]}\${n[4]}.\${n[5]}\${n[6]}\${n[7]}/\${n[8]}\${n[9]}\${n[10]}\${n[11]}-\${n[12]}\${n[13]}"
  echo "$cnpj"
}

for i in $(seq 1 5); do
  gerar_cnpj
done`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Shell script — CSV de empresas pronto pro seed</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`#!/usr/bin/env bash
# seed-empresas.sh - popula staging com 1000 empresas fictícias

curl -s -X POST https://fakeforge.com.br/api/generate \\
  -H "Content-Type: application/json" \\
  -d '{"type":"company","quantity":1000,"format":"csv"}' \\
  > empresas.csv

echo "COPY empresas(razao_social, cnpj, estado, telefone) FROM 'empresas.csv' CSV HEADER;" \\
  | psql "$DATABASE_URL"

echo "1000 empresas importadas pra staging"`}</code></pre>
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
                ["Só CNPJ simples", "✅", "✅"],
                ["Empresa completa correlacionada", "✅", "❌ só CNPJ"],
                ["Export CSV/SQL nativo", "✅", "❌"],
                ["100% offline", "❌", "✅"],
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
            { q: "Como gerar empresa fictícia completa via curl?", a: "GET https://fakeforge.com.br/api/generate?type=company&quantity=50 retorna CNPJ, razão social, endereço e telefone correlacionados em JSON. 100 chamadas grátis por dia." },
            { q: "Dá pra exportar direto em SQL pra popular banco de staging?", a: "Sim. Use POST com {\"type\":\"company\",\"format\":\"sql\"} no body e o retorno já vem como INSERT pronto pra rodar." },
            { q: "Existe jeito de gerar CNPJ sem chamar a API?", a: "Sim. O algoritmo local em bash implementa o mod-11 da Receita direto em aritmética de shell, sem depender de rede." },
            { q: "Preciso de autenticação pra usar a API de empresa?", a: "Não pro plano free (50 chamadas/dia). Planos pagos usam header de API key, documentado em /docs." },
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
          <Link href="/gerador-empresa-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Versão Python</Link>
          <Link href="/gerador-empresa-nodejs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Versão Node.js</Link>
          <Link href="/gerador-empresa" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Gerador de Empresa</Link>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Como gerar empresa fictícia completa via curl?", acceptedAnswer: { "@type": "Answer", text: "GET https://fakeforge.com.br/api/generate?type=company&quantity=50 retorna CNPJ, razão social, endereço e telefone correlacionados em JSON." } },
              { "@type": "Question", name: "Dá pra exportar direto em SQL pra popular banco de staging?", acceptedAnswer: { "@type": "Answer", text: "Sim. Use POST com format sql no body e o retorno já vem como INSERT pronto pra rodar." } },
              { "@type": "Question", name: "Existe jeito de gerar CNPJ sem chamar a API?", acceptedAnswer: { "@type": "Answer", text: "Sim. O algoritmo local em bash implementa o mod-11 da Receita direto em aritmética de shell." } },
              { "@type": "Question", name: "Preciso de autenticação pra usar a API de empresa?", acceptedAnswer: { "@type": "Answer", text: "Não pro plano free (50 chamadas/dia). Planos pagos usam header de API key." } },
            ],
          }),
        }}
      />

      <BreadcrumbSchema items={[{ name: "Início", url: "/" }, { name: "Gerador Empresa", url: "/gerador-empresa" }, { name: "curl", url: "/gerador-empresa-curl" }]} />
    </PageShell>
  );
}
