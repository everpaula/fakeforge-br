import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BlogFeaturedImage from "@/components/BlogFeaturedImage";
import AffiliateBanner from "@/components/AffiliateBanner";

export const metadata: Metadata = {
  title: "Como automatizar dados de teste no CI/CD com API",
  description: "Integre geração de dados brasileiros fictícios no seu pipeline de testes. Exemplos práticos com GitHub Actions, Node.js e Python.",
  keywords: "dados teste ci cd, automatizar teste, seed banco teste, api dados teste, github actions dados teste",
  openGraph: {
    title: "Como automatizar dados de teste no CI/CD com API",
    description: "Exemplos práticos para integrar geração de dados brasileiros no seu pipeline.",
    type: "article",
  },
};

export default function Post() {
  return (
    <PageShell>
      <article className="max-w-2xl">
        <Link href="/blog" className="text-xs text-primary hover:underline mb-4 inline-block">
          ← Voltar ao blog
        </Link>
        <BlogFeaturedImage category="Tutoriais" title="Automatizar dados de teste no CI/CD" className="mb-6" />
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
            Como automatizar dados de teste no CI/CD com API
          </h1>
          <div className="flex items-center gap-3 text-xs text-muted mt-3">
            <time>08 de abril de 2026</time>
            <span>·</span>
            <span>4 min de leitura</span>
          </div>
        </div>

        <div className="prose-custom space-y-6 text-sm text-muted-foreground leading-relaxed">
          <p>
            Testes automatizados precisam de dados. Se o seu sistema valida CPF, endereço ou dados bancários,
            você precisa de dados brasileiros no formato correto para que os testes passem. Em vez de manter
            fixtures estáticas que ficam desatualizadas, use uma API para gerar dados frescos a cada execução.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">O problema com fixtures estáticas</h2>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>Fixtures de JSON hardcodadas ficam defasadas quando o schema muda</li>
            <li>Poucos registros de teste não cobrem edge cases</li>
            <li>Dados copiados de produção violam a LGPD</li>
            <li>Manter arquivos de seed atualizados é trabalho manual repetitivo</li>
          </ul>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Solução: API de dados no pipeline</h2>
          <p>
            A API do FakeForge gera dados brasileiros fictícios sob demanda, com formatação válida e campos
            correlacionados. Integra em qualquer linguagem via HTTP.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Exemplo 1: Node.js (Jest / Vitest)</h2>
          <div className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4">
            <pre className="text-foreground">{`// test/helpers/seed.ts
export async function seedCustomers(count = 50) {
  const res = await fetch("https://fakeforge.com.br/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ preset: "customer", quantity: count }),
  });
  const { data } = await res.json();

  // Inserir no banco de teste
  for (const customer of data) {
    await db.customer.create({
      data: {
        name: customer.nome,
        cpf: customer.cpf,
        email: customer.email,
        phone: customer.telefone,
      },
    });
  }

  return data;
}`}</pre>
          </div>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Exemplo 2: Python (pytest)</h2>
          <div className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4">
            <pre className="text-foreground">{`# conftest.py
import requests
import pytest

@pytest.fixture
def customers():
    resp = requests.post(
        "https://fakeforge.com.br/api/generate",
        json={"preset": "customer", "quantity": 20}
    )
    return resp.json()["data"]

def test_customer_registration(customers, client):
    for c in customers:
        response = client.post("/api/register", json={
            "name": c["nome"],
            "cpf": c["cpf"],
            "email": c["email"],
        })
        assert response.status_code == 201`}</pre>
          </div>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Exemplo 3: GitHub Actions</h2>
          <div className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4">
            <pre className="text-foreground">{`# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: test
          POSTGRES_PASSWORD: test
        ports: ["5432:5432"]
    steps:
      - uses: actions/checkout@v4

      - name: Seed test database
        run: |
          curl -s -X POST https://fakeforge.com.br/api/generate \\
            -H "Content-Type: application/json" \\
            -d '{"preset":"customer","quantity":100,"format":"sql"}' \\
            | PGPASSWORD=test psql -h localhost -U postgres -d test

      - name: Run tests
        run: npm test`}</pre>
          </div>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Schema customizado</h2>
          <p>
            Se os presets não atendem sua estrutura, defina um schema customizado:
          </p>
          <div className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4">
            <pre className="text-foreground">{`curl -X POST https://fakeforge.com.br/api/generate \\
  -H "Content-Type: application/json" \\
  -d '{
    "schema": [
      {"name": "documento", "type": "cpf"},
      {"name": "titular", "type": "fullName"},
      {"name": "contato", "type": "email"},
      {"name": "cep", "type": "cep"},
      {"name": "cartao", "type": "creditCard"}
    ],
    "quantity": 50,
    "format": "json"
  }'`}</pre>
          </div>
          <p>
            O nome no campo <code className="text-primary">contato</code> (email) vai corresponder ao nome no campo{" "}
            <code className="text-primary">titular</code> — dados correlacionados automaticamente.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Limites e planos</h2>
          <p>
            O tier gratuito permite 100 requests por dia — suficiente para desenvolvimento local.
            Para CI/CD que roda em cada commit, o{" "}
            <Link href="/pricing" className="text-primary hover:underline">plano Dev (R$29/mês)</Link>{" "}
            oferece 10.000 requests por dia com API key dedicada.
          </p>
        </div>

        <AffiliateBanner variant="digitalocean" />
      </article>
    </PageShell>
  );
}
