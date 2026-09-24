import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de CNPJ via curl: API REST + Alfanumérico 2026",
  description: "Gere CNPJ válido (numérico e alfanumérico 2026) via curl. Snippets pra bash, GitHub Actions, GitLab CI, Jenkins. Zero dep, ideal pra pipelines sem SDK. Grátis 50/dia.",
  keywords: "gerador cnpj curl, cnpj api rest bash, cnpj github actions, cnpj gitlab ci, cnpj jenkins, cnpj alfanumerico curl 2026",
  alternates: { canonical: "/gerador-cnpj-curl" },
  openGraph: { title: "Gerador de CNPJ via curl", description: "API REST + snippets pra GitHub Actions, GitLab, Jenkins.", type: "article", locale: "pt_BR" },
};

export default function GeradorCnpjCurl() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">curl · bash · CI/CD</p>
        <h1 className="text-3xl font-bold tracking-tight">Gerador de <span className="text-primary">CNPJ via curl</span></h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          API REST do FakeForge cobre CNPJ numérico + alfanumérico 2026. Snippets pra bash puro, GitHub Actions, GitLab CI, Jenkins. Zero SDK, zero instalação — só curl e jq. Grátis 50/dia.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`# CNPJ numérico
curl "https://fakeforge.com.br/api/generate?type=cnpj&quantity=100"

# CNPJ alfanumérico 2026 (IN RFB 2.229)
curl "https://fakeforge.com.br/api/generate?type=cnpjAlfa&quantity=50"`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">GitHub Actions — teste do validador 2026</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# .github/workflows/test-cnpj-2026.yml
name: Test CNPJ alfanumérico 2026

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Gera 100 CNPJs alfanuméricos
        run: |
          curl -s "https://fakeforge.com.br/api/generate?type=cnpjAlfa&quantity=100" \\
            | jq -r '.data[]' > cnpjs-2026.txt

      - name: Testa validador
        run: |
          while read cnpj; do
            if ! ./scripts/validar-cnpj.sh "$cnpj"; then
              echo "❌ FALHOU pro CNPJ: $cnpj"
              exit 1
            fi
          done < cnpjs-2026.txt
          echo "✅ Validador OK pra formato 2026"`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Bash puro (seed local)</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`#!/bin/bash
# seed-empresas.sh

set -euo pipefail

# 500 CNPJs numéricos + 100 alfanuméricos
curl -s "https://fakeforge.com.br/api/generate?type=cnpj&quantity=500" | jq -r '.data[]' > empresas-num.txt
curl -s "https://fakeforge.com.br/api/generate?type=cnpjAlfa&quantity=100" | jq -r '.data[]' > empresas-alfa.txt

# Insere no Postgres
{
  cat empresas-num.txt | while read cnpj; do
    echo "INSERT INTO empresas(cnpj) VALUES ('$cnpj');"
  done
  cat empresas-alfa.txt | while read cnpj; do
    echo "INSERT INTO empresas(cnpj) VALUES ('$cnpj');"
  done
} | psql -d myapp_dev

echo "600 empresas seeded (500 numéricas + 100 alfanuméricas 2026)"`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">GitLab CI</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# .gitlab-ci.yml
seed_empresas:
  image: alpine:latest
  before_script:
    - apk add --no-cache curl jq
  script:
    - curl -sH "X-API-Key: $FF_KEY" \\
        "https://fakeforge.com.br/api/generate?type=cnpj&quantity=1000&format=sql" \\
        | psql $STAGING_URL
  only:
    - schedules`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Formatos de resposta</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# JSON default
curl "https://fakeforge.com.br/api/generate?type=cnpj&quantity=3"
# {"type":"cnpj","quantity":3,"data":["12.345.678/0001-90",...]}

# CSV
curl "https://fakeforge.com.br/api/generate?type=cnpj&quantity=100&format=csv"

# SQL INSERT
curl "https://fakeforge.com.br/api/generate?type=cnpj&quantity=100&format=sql"

# Sem formatação (14 dígitos puros)
curl "https://fakeforge.com.br/api/generate?type=cnpj&quantity=10&formatted=false"`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Próximos passos</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/docs" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Docs API</Link>
          <Link href="/gerador-cnpj-alfanumerico" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">CNPJ Alfa 2026</Link>
          <Link href="/blog/cnpj-alfanumerico-checklist-migracao-2026" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Checklist migração</Link>
        </div>
      </section>

      <BreadcrumbSchema items={[{ name: "Início", url: "/" }, { name: "Gerador CNPJ", url: "/gerador-cnpj" }, { name: "curl", url: "/gerador-cnpj-curl" }]} />
    </PageShell>
  );
}
