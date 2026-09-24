import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de RG via curl: API REST + Formato UF",
  description: "Gere RG válido via curl com formato específico por UF. API REST + jq. Snippets pra bash, GitHub Actions, GitLab CI. Grátis 50/dia.",
  keywords: "gerador rg curl, rg api rest bash, rg github actions, rg por estado curl",
  alternates: { canonical: "/gerador-rg-curl" },
  openGraph: { title: "Gerador de RG via curl", description: "API REST + bash + CI/CD.", type: "article", locale: "pt_BR" },
};

export default function GeradorRgCurl() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">curl · bash · CI/CD</p>
        <h1 className="text-3xl font-bold tracking-tight">Gerador de <span className="text-primary">RG via curl</span></h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          API REST do FakeForge gera RG com formato específico por UF. Zero SDK, só curl e jq. Snippets pra bash, GitHub Actions, GitLab CI.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`curl "https://fakeforge.com.br/api/generate?type=rg&quantity=100"`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">GitHub Actions</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# .github/workflows/seed-identidades.yml
name: Seed identidades

on:
  schedule:
    - cron: "0 3 * * *"

jobs:
  seed:
    runs-on: ubuntu-latest
    steps:
      - name: Gera 500 pessoas + RG
        run: |
          curl -s "https://fakeforge.com.br/api/generate?preset=customer&quantity=500" > pessoas.json
          curl -s "https://fakeforge.com.br/api/generate?type=rg&quantity=500" | jq -r '.data[]' > rgs.txt

      - name: Import
        run: node scripts/import-identidades.js pessoas.json rgs.txt`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Bash script</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`#!/bin/bash
# seed-rgs.sh
set -euo pipefail

curl -s "https://fakeforge.com.br/api/generate?type=rg&quantity=1000&format=sql" \\
  | psql "$STAGING_URL"

echo "1000 RGs inseridos em staging"`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Formatos</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# JSON
curl "https://fakeforge.com.br/api/generate?type=rg&quantity=3"

# CSV
curl "https://fakeforge.com.br/api/generate?type=rg&quantity=100&format=csv"

# SQL INSERT
curl "https://fakeforge.com.br/api/generate?type=rg&quantity=100&format=sql"`}</code></pre>
      </section>

      <section className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Link href="/docs" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Docs API</Link>
          <Link href="/gerador-rg" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">RG por estado</Link>
          <Link href="/gerador-rg-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Python</Link>
        </div>
      </section>

      <BreadcrumbSchema items={[{ name: "Início", url: "/" }, { name: "RG", url: "/gerador-rg" }, { name: "curl", url: "/gerador-rg-curl" }]} />
    </PageShell>
  );
}
