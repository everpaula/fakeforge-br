import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de CNH via curl: API REST + DENATRAN",
  description: "Gere CNH válida via curl com algoritmo DENATRAN. API REST + jq. Snippets pra bash, GitHub Actions, GitLab CI. Grátis 50/dia sem cadastro.",
  keywords: "gerador cnh curl, cnh api rest bash, cnh github actions, cnh jenkins",
  alternates: { canonical: "/gerador-cnh-curl" },
  openGraph: { title: "Gerador de CNH via curl", description: "API REST + bash + CI/CD.", type: "article", locale: "pt_BR" },
};

export default function GeradorCnhCurl() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">curl · bash · CI/CD</p>
        <h1 className="text-3xl font-bold tracking-tight">Gerador de <span className="text-primary">CNH via curl</span></h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          API REST do FakeForge gera CNH mod-11 DENATRAN. Zero SDK, só curl e jq. Snippets pra bash, GitHub Actions, GitLab CI.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`curl "https://fakeforge.com.br/api/generate?type=cnh&quantity=100"`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">GitHub Actions — teste validador CNH</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# .github/workflows/test-cnh.yml
name: Test validador CNH DENATRAN

on: [pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Gera 100 CNHs válidas
        run: |
          curl -s "https://fakeforge.com.br/api/generate?type=cnh&quantity=100" \\
            | jq -r '.data[]' > cnhs.txt

      - name: Testa validador
        run: |
          while read cnh; do
            if ! ./scripts/validar-cnh.sh "$cnh"; then
              echo "❌ FALHOU pra CNH: $cnh"
              exit 1
            fi
          done < cnhs.txt`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Bash — seed app de mobilidade</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`#!/bin/bash
# seed-motoristas.sh

set -euo pipefail

# 500 motoristas com CPF + nome + endereço correlacionado
curl -s "https://fakeforge.com.br/api/generate?preset=customer&quantity=500" \\
  > customers.json

# 500 CNHs
curl -s "https://fakeforge.com.br/api/generate?type=cnh&quantity=500" \\
  | jq -r '.data[]' > cnhs.txt

# Combina e insere no Postgres
paste <(jq -r '.data[] | [.cpf, .nome] | @tsv' customers.json) cnhs.txt \\
  | while IFS=$'\\t' read cpf nome cnh; do
      psql -d myapp -c "INSERT INTO motoristas(cpf, nome, cnh) VALUES ('$cpf', '$nome', '$cnh');"
    done`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Formatos de resposta</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# JSON default
curl "https://fakeforge.com.br/api/generate?type=cnh&quantity=3"
# {"type":"cnh","quantity":3,"data":["12345678900","98765432100","..."]}

# CSV
curl "https://fakeforge.com.br/api/generate?type=cnh&quantity=100&format=csv"

# SQL
curl "https://fakeforge.com.br/api/generate?type=cnh&quantity=100&format=sql"`}</code></pre>
      </section>

      <section className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Link href="/docs" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Docs API</Link>
          <Link href="/gerador-cnh" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">CNH por estado</Link>
          <Link href="/gerador-cnh-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Python</Link>
        </div>
      </section>

      <BreadcrumbSchema items={[{ name: "Início", url: "/" }, { name: "CNH", url: "/gerador-cnh" }, { name: "curl", url: "/gerador-cnh-curl" }]} />
    </PageShell>
  );
}
