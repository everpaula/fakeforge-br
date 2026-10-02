import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de Cartão para Testes via curl: API REST + Luhn",
  description: "Gere números sintéticos de cartão via curl. API REST com Luhn válido, formato JSON/CSV/SQL. Snippets pra bash, GitHub Actions, Jenkins. Ambiente de desenvolvimento apenas.",
  keywords: "gerador cartao curl testes, cartao api rest bash testes, cartao github actions testes, cartao gitlab ci testes",
  alternates: { canonical: "/gerador-cartao-curl" },
  openGraph: { title: "Gerador de Cartão para Testes via curl", description: "API REST + snippets bash, CI/CD.", type: "article", locale: "pt_BR" },
};

export default function GeradorCartaoCurl() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">curl · bash · CI/CD</p>
        <h1 className="text-3xl font-bold tracking-tight">Gerador de <span className="text-primary">Cartão para Testes via curl</span></h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          API REST do FakeForge gera números sintéticos de cartão com Luhn válido. Zero SDK, só curl e jq. Snippets pra bash puro, GitHub Actions, GitLab CI, Jenkins. Ambiente de desenvolvimento apenas.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`# 10 cartões sintéticos (Luhn válido)
curl "https://fakeforge.com.br/api/generate?type=creditCard&quantity=10"

# Só o número (com jq)
curl -s "https://fakeforge.com.br/api/generate?type=creditCard&quantity=10" | jq -r '.data[].number'`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">GitHub Actions — teste E2E com Playwright</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# .github/workflows/e2e-checkout.yml
name: E2E checkout com cartão sintético

on: [pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Gera 5 cartões pra testar
        run: |
          curl -s "https://fakeforge.com.br/api/generate?type=creditCard&quantity=5" \\
            | jq '.data' > tests/fixtures/cartoes.json

      - name: Instala Playwright
        run: npm ci && npx playwright install --with-deps

      - name: Roda testes E2E
        run: npx playwright test tests/checkout.spec.ts`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Bash script (populate staging)</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`#!/bin/bash
# seed-cartoes-staging.sh - só rodar em staging

set -euo pipefail

if [ "$ENV" != "staging" ] && [ "$ENV" != "dev" ]; then
  echo "Ambiente inválido pra seed de cartão. Aborting."
  exit 1
fi

# Gera 100 cartões e formata como SQL INSERT
curl -sH "X-API-Key: $FF_KEY" \\
  "https://fakeforge.com.br/api/generate?type=creditCard&quantity=100&format=sql" \\
  | psql "$STAGING_DB_URL"

echo "100 cartões sintéticos inseridos em staging"`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Filtro por bandeira</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# Só Visa
curl "https://fakeforge.com.br/api/generate?type=creditCard&brand=visa&quantity=20"

# Só Mastercard
curl "https://fakeforge.com.br/api/generate?type=creditCard&brand=mastercard&quantity=20"

# Elo
curl "https://fakeforge.com.br/api/generate?type=creditCard&brand=elo&quantity=20"

# Amex
curl "https://fakeforge.com.br/api/generate?type=creditCard&brand=amex&quantity=20"

# Aleatório (default: qualquer bandeira)
curl "https://fakeforge.com.br/api/generate?type=creditCard&quantity=20"`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Formatos de resposta</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# JSON default
curl "https://fakeforge.com.br/api/generate?type=creditCard&quantity=1"
# {"type":"creditCard","quantity":1,"data":[{"number":"4532...","brand":"visa",...}]}

# CSV
curl "https://fakeforge.com.br/api/generate?type=creditCard&quantity=100&format=csv"

# SQL INSERT
curl "https://fakeforge.com.br/api/generate?type=creditCard&quantity=100&format=sql"`}</code></pre>
      </section>

      <section className="mb-8">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Números sintéticos passam Luhn mas gateway real (Stripe/Mercado Pago/PagSeguro/Cielo) rejeita em transação real. Pra testar aprovação/recusa em sandbox de gateway, use os cartões oficiais publicados por eles. Ver <Link href="/cartao-credito-teste-stripe" className="text-primary hover:underline">guia Stripe + BR gateways</Link>.
        </p>
      </section>

      <section className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Link href="/docs" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Docs API</Link>
          <Link href="/gerador-cartao-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Versão Python</Link>
          <Link href="/gerador-cartao-nodejs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Versão Node</Link>
        </div>
      </section>

      <BreadcrumbSchema items={[{ name: "Início", url: "/" }, { name: "Cartão", url: "/gerador-cartao" }, { name: "curl", url: "/gerador-cartao-curl" }]} />
    </PageShell>
  );
}
