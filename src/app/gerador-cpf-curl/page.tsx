import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de CPF via curl: API REST + CI/CD (2026)",
  description: "Gere CPF válido via curl com API REST do FakeForge. Snippets prontos pra bash, GitHub Actions, GitLab CI, CircleCI e Jenkins. Ideal pra pipelines sem SDK. Free 50/dia sem cadastro.",
  keywords: "gerador cpf curl, cpf api rest bash, cpf github actions, cpf gitlab ci, cpf jenkins pipeline, cpf circleci, cpf bash script, cpf shell script, api gerar cpf curl",
  alternates: { canonical: "/gerador-cpf-curl" },
  openGraph: {
    title: "Gerador de CPF via curl — API REST",
    description: "Snippets curl pra GitHub Actions, GitLab CI, Jenkins e CircleCI. Free.",
    type: "article",
    locale: "pt_BR",
  },
};

export default function GeradorCpfCurl() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">curl · bash · CI/CD</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">CPF via curl</span>
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Se seu pipeline não tem Node ou Python, ou você prefere ficar em bash puro, a API REST do FakeForge cobre. curl retorna JSON pronto pra <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">jq</code>. Sem SDK, sem instalação, sem dep. Ideal pra scripts, GitHub Actions, GitLab CI, Jenkins e CircleCI.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`# 10 CPFs formatados
curl "https://fakeforge.com.br/api/generate?type=cpf&quantity=10"

# Só o array de CPFs (com jq)
curl -s "https://fakeforge.com.br/api/generate?type=cpf&quantity=10" | jq -r '.data[]'`}</code></pre>
        <p className="text-xs text-muted-foreground mt-2">Free 50 chamadas/dia por IP. Sem cadastro.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Todos os tipos suportados via curl</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# CPF válido mod-11
curl "https://fakeforge.com.br/api/generate?type=cpf&quantity=100"

# CNPJ válido mod-11
curl "https://fakeforge.com.br/api/generate?type=cnpj&quantity=50"

# CNPJ alfanumérico 2026 (IN RFB 2.229)
curl "https://fakeforge.com.br/api/generate?type=cnpjAlfa&quantity=20"

# CEP + endereço
curl "https://fakeforge.com.br/api/generate?type=address&quantity=10"

# Preset customer (pessoa correlacionada)
curl "https://fakeforge.com.br/api/generate?preset=customer&quantity=100"

# Preset fintech (cliente + PIX + banco + cartão + score)
curl "https://fakeforge.com.br/api/generate?preset=fintech&quantity=50"`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Com autenticação (plano Dev)</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# Header X-API-Key libera 10k chamadas/dia (plano Dev R$29/mês)
curl -H "X-API-Key: ff_sua_key_aqui" \\
  "https://fakeforge.com.br/api/generate?type=cpf&quantity=10000"`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">GitHub Actions</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# .github/workflows/seed-staging.yml
name: Seed staging with fresh CPFs
on:
  schedule:
    - cron: "0 3 * * *"  # 3h AM UTC daily
  workflow_dispatch:

jobs:
  seed:
    runs-on: ubuntu-latest
    steps:
      - name: Fetch 1000 CPFs from FakeForge
        env:
          FF_KEY: \${{ secrets.FAKEFORGE_KEY }}
        run: |
          curl -sH "X-API-Key: $FF_KEY" \\
            "https://fakeforge.com.br/api/generate?type=cpf&quantity=1000" \\
            > cpfs.json

      - name: Import to staging DB
        run: psql $STAGING_URL -c "COPY users(cpf) FROM 'cpfs.json' WITH (FORMAT csv);"`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">GitLab CI</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# .gitlab-ci.yml
seed_staging:
  stage: test
  image: alpine:latest
  before_script:
    - apk add --no-cache curl jq
  script:
    - curl -s "https://fakeforge.com.br/api/generate?preset=customer&quantity=500" | jq '.data' > customers.json
    - ./scripts/import-customers.sh customers.json
  only:
    - schedules`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Jenkins Pipeline</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// Jenkinsfile
pipeline {
  agent any
  stages {
    stage('Seed staging') {
      steps {
        withCredentials([string(credentialsId: 'FF_KEY', variable: 'FF_KEY')]) {
          sh '''
            curl -sH "X-API-Key: $FF_KEY" \\
              "https://fakeforge.com.br/api/generate?preset=fintech&quantity=1000" \\
              > fintech.json

            python3 scripts/import_fintech.py fintech.json
          '''
        }
      }
    }
  }
}`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Bash puro (script local)</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`#!/bin/bash
# seed-local.sh - gera dados e importa em Postgres local

set -euo pipefail

# 1. Gera 500 CPFs
CPFS=$(curl -s "https://fakeforge.com.br/api/generate?type=cpf&quantity=500" | jq -r '.data[]')

# 2. Importa via psql
psql -d myapp_dev -c "TRUNCATE users;"
echo "$CPFS" | while read cpf; do
  psql -d myapp_dev -c "INSERT INTO users(cpf) VALUES ('$cpf');"
done

echo "Seeded $(echo "$CPFS" | wc -l) CPFs em myapp_dev"`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Formatos de resposta</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# JSON (default)
curl "https://fakeforge.com.br/api/generate?type=cpf&quantity=3"
# {"type":"cpf","quantity":3,"data":["123.456.789-09","234.567.890-10","345.678.901-21"]}

# CSV (útil pra importar em DB direto)
curl "https://fakeforge.com.br/api/generate?type=cpf&quantity=100&format=csv"

# SQL INSERT statements
curl "https://fakeforge.com.br/api/generate?type=cpf&quantity=100&format=sql"`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Rate limit e headers</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# Response headers incluem quota atual
curl -I "https://fakeforge.com.br/api/generate?type=cpf&quantity=1"

# X-RateLimit-Limit: 50
# X-RateLimit-Remaining: 47
# X-RateLimit-Reset: 1734589200

# Se estourou quota (HTTP 429), response body traz upgrade URL
# {"error":"rate_limit","upgrade":"https://fakeforge.com.br/pricing"}`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Próximos passos</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/docs" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">API Docs</Link>
          <Link href="/gerador-cpf-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Versão Python</Link>
          <Link href="/gerador-cpf-nodejs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Versão Node</Link>
          <Link href="/pricing" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Plano Dev</Link>
        </div>
      </section>

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Gerador CPF", url: "/gerador-cpf" },
        { name: "curl / API REST", url: "/gerador-cpf-curl" },
      ]} />
    </PageShell>
  );
}
