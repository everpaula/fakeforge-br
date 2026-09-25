import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de CEP via curl: API REST | FakeForge",
  description: "Gere CEP brasileiro válido via curl. API REST + jq. Snippets pra bash, GitHub Actions, GitLab CI. Grátis 50/dia sem cadastro.",
  keywords: "gerador cep curl, cep api rest bash, cep github actions, cep valido curl",
  alternates: { canonical: "/gerador-cep-curl" },
  openGraph: { title: "Gerador de CEP via curl", description: "API REST + bash + CI/CD.", type: "article", locale: "pt_BR" },
};

export default function GeradorCepCurl() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">curl · bash · CI/CD</p>
        <h1 className="text-3xl font-bold tracking-tight">Gerador de <span className="text-primary">CEP via curl</span></h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          API REST do FakeForge gera CEP no formato oficial dos Correios. Zero SDK, só curl e jq.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`curl "https://fakeforge.com.br/api/generate?type=cep&quantity=100"`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Formatos</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# JSON default
curl "https://fakeforge.com.br/api/generate?type=cep&quantity=5"
# {"type":"cep","quantity":5,"data":["01310-100","22440-000",...]}

# Sem formatação
curl "https://fakeforge.com.br/api/generate?type=cep&quantity=5&formatted=false"

# CSV
curl "https://fakeforge.com.br/api/generate?type=cep&quantity=100&format=csv"

# SQL
curl "https://fakeforge.com.br/api/generate?type=cep&quantity=100&format=sql"`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">GitHub Actions</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# .github/workflows/test-cep-validator.yml
name: Test validador CEP

on: [pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Fetch 100 CEPs válidos
        run: |
          curl -s "https://fakeforge.com.br/api/generate?type=cep&quantity=100" \\
            | jq -r '.data[]' > ceps.txt

      - name: Testa validador
        run: |
          while read cep; do
            ./scripts/validar-cep.sh "$cep" || { echo "FALHOU: $cep"; exit 1; }
          done < ceps.txt`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Bash — filtrar CEP por região</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# CEPs de SP começam com 01-19
curl -s "https://fakeforge.com.br/api/generate?type=cep&quantity=500" \\
  | jq -r '.data[] | select(startswith("0") or startswith("1"))' \\
  > ceps-sp.txt

# CEPs do RJ começam com 20-28
curl -s "https://fakeforge.com.br/api/generate?type=address&quantity=500" \\
  | jq '.data[] | select(.estado == "RJ") | .cep' \\
  > ceps-rj.txt`}</code></pre>
      </section>

      <section className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Link href="/docs" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Docs API</Link>
          <Link href="/gerador-cep" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">CEP por cidade</Link>
          <Link href="/gerador-cep-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Python</Link>
        </div>
      </section>

      <BreadcrumbSchema items={[{ name: "Início", url: "/" }, { name: "CEP", url: "/gerador-cep" }, { name: "curl", url: "/gerador-cep-curl" }]} />
    </PageShell>
  );
}
