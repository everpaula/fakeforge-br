import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de Endereço via curl: API REST | FakeForge",
  description: "Gere endereço brasileiro completo via curl. API REST com JSON/CSV/SQL. Snippets pra bash, GitHub Actions, GitLab CI. Grátis 50/dia sem cadastro.",
  keywords: "gerador endereco curl, endereco api rest bash, endereco github actions, endereco brasileiro api",
  alternates: { canonical: "/gerador-endereco-curl" },
  openGraph: { title: "Gerador de Endereço via curl", description: "API REST + bash + CI/CD.", type: "article", locale: "pt_BR" },
};

export default function GeradorEnderecoCurl() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">curl · bash · CI/CD</p>
        <h1 className="text-3xl font-bold tracking-tight">Gerador de <span className="text-primary">Endereço via curl</span></h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          API REST do FakeForge gera endereço brasileiro completo. Zero SDK, só curl e jq. Snippets pra bash, GitHub Actions, GitLab CI.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`curl "https://fakeforge.com.br/api/generate?type=address&quantity=100"`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Bash + jq</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# Só cidade + UF
curl -s "https://fakeforge.com.br/api/generate?type=address&quantity=20" \\
  | jq -r '.data[] | "\\(.cidade)/\\(.estado)"'

# Filtra apenas endereços SP (client-side)
curl -s "https://fakeforge.com.br/api/generate?type=address&quantity=100" \\
  | jq '.data[] | select(.estado == "SP")'`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">GitHub Actions — seed teste E2E</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# .github/workflows/e2e-checkout.yml
name: E2E checkout com endereço

on: [pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Gera 20 endereços pra fixture
        run: |
          curl -s "https://fakeforge.com.br/api/generate?type=address&quantity=20" \\
            | jq '.data' > tests/fixtures/enderecos.json

      - name: Playwright
        run: npx playwright test tests/checkout-frete.spec.ts`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Bash script — seed banco</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`#!/bin/bash
# seed-enderecos.sh
set -euo pipefail

# 500 endereços + insert direto no Postgres
curl -sH "X-API-Key: $FF_KEY" \\
  "https://fakeforge.com.br/api/generate?type=address&quantity=500&format=sql" \\
  | psql "$STAGING_URL"

echo "500 endereços seeded em staging"`}</code></pre>
      </section>

      <section className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Link href="/docs" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Docs API</Link>
          <Link href="/gerador-endereco" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Endereço básico</Link>
          <Link href="/gerador-endereco-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Python</Link>
        </div>
      </section>

      <BreadcrumbSchema items={[{ name: "Início", url: "/" }, { name: "Endereço", url: "/gerador-endereco" }, { name: "curl", url: "/gerador-endereco-curl" }]} />
    </PageShell>
  );
}
