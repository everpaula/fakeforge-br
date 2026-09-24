import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de Chave PIX via curl: API REST + 4 tipos BACEN",
  description: "Gere chave PIX válida via curl (CPF, email, telefone, aleatória). API REST + jq. Snippets pra bash, GitHub Actions, GitLab CI, Jenkins. Grátis 50/dia sem cadastro.",
  keywords: "gerador pix curl, chave pix api rest bash, pix github actions, pix bacen curl, pix aleatoria curl",
  alternates: { canonical: "/gerador-pix-curl" },
  openGraph: { title: "Gerador de PIX via curl", description: "API REST + snippets bash, CI/CD.", type: "article", locale: "pt_BR" },
};

export default function GeradorPixCurl() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">curl · bash · CI/CD</p>
        <h1 className="text-3xl font-bold tracking-tight">Gerador de <span className="text-primary">Chave PIX via curl</span></h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          API REST do FakeForge gera os 4 tipos de chave PIX BACEN. Zero SDK, só curl e jq. Snippets pra bash, GitHub Actions, GitLab CI, Jenkins.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`# Chaves aleatórias (mix dos 4 tipos)
curl "https://fakeforge.com.br/api/generate?type=pixKey&quantity=100"

# Preset fintech (customer + PIX + banco + cartão coerentes)
curl "https://fakeforge.com.br/api/generate?preset=fintech&quantity=50"`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">GitHub Actions — teste E2E de PIX</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# .github/workflows/e2e-pix.yml
name: E2E PIX
on: [pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Fetch 20 chaves PIX
        run: |
          curl -s "https://fakeforge.com.br/api/generate?type=pixKey&quantity=20" \\
            | jq '.data' > tests/fixtures/pix-keys.json

      - name: Roda testes de transferência
        run: npm test -- --testPathPattern=pix`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Bash script (seed banco de teste)</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`#!/bin/bash
# seed-pix-keys.sh

set -euo pipefail

# Fetch 100 chaves PIX aleatórias
curl -s "https://fakeforge.com.br/api/generate?type=pixKey&quantity=100" \\
  | jq -r '.data[]' > pix-keys.txt

# Insere no Postgres
while read chave; do
  psql -d myapp_dev -c "INSERT INTO pix_keys(chave) VALUES ('$chave');"
done < pix-keys.txt

echo "100 chaves PIX seeded em myapp_dev"`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Preset fintech (banco + PIX + cartão coerentes)</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# Retorna clientes com PIX correlacionado (CPF do cliente vira chave)
curl -s "https://fakeforge.com.br/api/generate?preset=fintech&quantity=10" \\
  | jq '.data[] | {
      cpf: .customer.cpf,
      email: .customer.email,
      pix_keys: .pix_keys | map(.type + ": " + .value)
    }'

# Output:
# {
#   "cpf": "123.456.789-09",
#   "email": "marina.souza@gmail.com",
#   "pix_keys": [
#     "cpf: 12345678909",
#     "email: marina.souza@gmail.com",
#     "phone: +5511987654321",
#     "aleatoria: 8f4e2c91-a3b7-4d5e-9f2a-1c8b6d0e5a3f"
#   ]
# }`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">GitLab CI</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# .gitlab-ci.yml
seed_pix_staging:
  image: alpine:latest
  before_script:
    - apk add --no-cache curl jq postgresql-client
  script:
    - curl -sH "X-API-Key: $FF_KEY" \\
        "https://fakeforge.com.br/api/generate?preset=fintech&quantity=500" \\
        > fintech.json
    - node scripts/import-fintech.js fintech.json
  only:
    - schedules`}</code></pre>
      </section>

      <section className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Link href="/docs" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Docs API</Link>
          <Link href="/preset-fintech" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Preset fintech</Link>
          <Link href="/gerador-pix-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Versão Python</Link>
        </div>
      </section>

      <BreadcrumbSchema items={[{ name: "Início", url: "/" }, { name: "PIX", url: "/gerador-pix" }, { name: "curl", url: "/gerador-pix-curl" }]} />
    </PageShell>
  );
}
