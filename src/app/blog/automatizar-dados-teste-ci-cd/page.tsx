import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BlogFeaturedImage from "@/components/BlogFeaturedImage";
import ShareBar from "@/components/ShareBar";
import BlogPostingSchema from "@/components/BlogPostingSchema";

export const metadata: Metadata = {
  title: "Dados de Teste no CI/CD: GitHub Actions, pytest, Jest",
  description: "Pipeline completo de geração de dados BR via API no CI/CD: GitHub Actions com cache + secrets, pytest fixtures, Jest beforeAll, seed pre-deploy, e estratégia de invalidação entre runs.",
  openGraph: {
    title: "Dados de Teste no CI/CD: GitHub Actions, pytest, Jest",
    description: "Pipeline completo de geração de dados BR via API no CI/CD: GitHub Actions com cache + secrets, pytest fixtures, Jest beforeAll, seed pre-deploy, e estratégia de invalidação entre runs.",
    type: "article",
    images: ["/api/og?title=Dados%20de%20teste%20no%20CI%2FCD&subtitle=GitHub%20Actions%2C%20pytest%2C%20Jest%20e%20seed%20automatizado&category=TUTORIAIS"],
  },
  alternates: { canonical: "/blog/automatizar-dados-teste-ci-cd" },
};

export default function Post() {
  return (
    <PageShell>
      <article className="max-w-2xl">
        <Link href="/blog" className="text-xs text-primary hover:underline mb-4 inline-block">
          ← Voltar ao blog
        </Link>
        <BlogFeaturedImage category="Tutoriais" title="Dados de teste no CI/CD: GitHub Actions, pytest, Jest e seed automatizado" className="mb-6" />
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
            Dados de teste no CI/CD: GitHub Actions, pytest, Jest e seed automatizado
          </h1>
          <div className="flex items-center gap-3 text-xs text-muted mt-3">
            <time>18 de junho de 2026</time>
            <span>·</span>
            <span>14 min de leitura</span>
          </div>
        </div>

        <div className="prose-custom space-y-2 text-sm text-muted-foreground leading-relaxed">
          <p className="mb-4">
            Dados de teste no CI/CD costumam ser commitados em fixtures estáticos (.json, .sql, .csv) e copiados de uma máquina pra outra até alguém esquecer que existem, vazá-los em um screenshot, ou descobrir que metade quebrou depois de uma atualização de schema. Este guia mostra como substituir esse padrão por geração on-demand via API durante o pipeline, com 3 stacks práticas: <strong className="text-foreground">GitHub Actions + secrets + cache</strong>, <strong className="text-foreground">pytest com fixtures dinâmicos</strong>, e <strong className="text-foreground">Jest com beforeAll para suite Node</strong>. No fim, estratégia pra seed pre-deploy em staging sem deixar lixo entre runs.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Por que gerar em vez de commitar</h2>
          <p className="mb-4">
            Fixture commitado tem 3 problemas. <strong className="text-foreground">Primeiro</strong>, vira IP morto: ninguém atualiza, ninguém entende, ninguém pode mexer com confiança. <strong className="text-foreground">Segundo</strong>, vaza dado pessoal: CPF, telefone e email reais entram em log de erro, screenshot de Slack, PR de novato. Mesmo dado fictício &quot;parecido com real&quot; causa risco regulatório (LGPD Art. 5º trata como dado pessoal qualquer informação que identifique pessoa física). <strong className="text-foreground">Terceiro</strong>, fica desatualizado: você adiciona campo CNPJ alfanumérico (vigência 01/07/2026), seu fixture de 2024 tem só formato numérico, o teste passa mas a integração no checkout quebra.
          </p>
          <p className="mb-4">
            Geração on-demand resolve os 3. Você chama a API no <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">setup</code> de cada job, recebe dados frescos com a regra atual, e nada fica em disco depois do run. Custo: latência adicional de ~200ms por chamada (1 chamada por job, geralmente).
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Stack 1: GitHub Actions com cache + secrets</h2>
          <p className="mb-4">
            Workflow completo que gera 100 customers (pessoa + endereço + cartão correlacionados) antes de rodar a suite de integração. Usa cache pra evitar regenerar dados em jobs que dependem do mesmo dataset, e secrets pra mascarar a API key (mesmo sendo plano gratuito, manda mensagem certa pro time):
          </p>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto">{`# .github/workflows/test.yml
name: Test with BR fixtures

on:
  pull_request:
    branches: [main]

jobs:
  generate-fixtures:
    runs-on: ubuntu-latest
    outputs:
      cache-key: \${{ steps.cache-key.outputs.key }}
    steps:
      - uses: actions/checkout@v4

      - id: cache-key
        run: echo "key=fixtures-\${{ github.run_id }}" >> $GITHUB_OUTPUT

      - name: Generate Brazilian customers
        env:
          FAKEFORGE_KEY: \${{ secrets.FAKEFORGE_API_KEY }}
        run: |
          mkdir -p .test-fixtures
          curl -sS -H "X-API-Key: $FAKEFORGE_KEY" \\
            "https://fakeforge.com.br/api/generate?preset=customer&quantity=100" \\
            > .test-fixtures/customers.json
          curl -sS -H "X-API-Key: $FAKEFORGE_KEY" \\
            "https://fakeforge.com.br/api/generate?type=cnpj&quantity=50" \\
            > .test-fixtures/cnpjs.json
          curl -sS -H "X-API-Key: $FAKEFORGE_KEY" \\
            "https://fakeforge.com.br/api/generate?type=pixKey&quantity=20" \\
            > .test-fixtures/pix.json

      - name: Cache fixtures for downstream jobs
        uses: actions/cache/save@v4
        with:
          path: .test-fixtures
          key: \${{ steps.cache-key.outputs.key }}

  integration-tests:
    needs: generate-fixtures
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Restore fixtures
        uses: actions/cache/restore@v4
        with:
          path: .test-fixtures
          key: \${{ needs.generate-fixtures.outputs.cache-key }}
          fail-on-cache-miss: true

      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci
      - run: npm run test:integration`}</pre>

          <p className="mb-4">
            Três coisas que esse workflow faz certo. <strong className="text-foreground">Job split</strong>: o job <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">generate-fixtures</code> roda uma vez e populariza cache; os jobs de teste (você pode ter N: unit, integration, e2e) restauram do cache em vez de chamar a API de novo. Reduz chamadas por PR de N pra 1. <strong className="text-foreground">Cache key dinâmica</strong>: usa <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">github.run_id</code> como chave. Cada PR run tem fixtures novos; nada de cache estagnado entre PRs distintos. <strong className="text-foreground">Secret pra API key</strong>: hábito profissional. Se um dia migrar pro plano Dev (R$29/mês, 10.000 chamadas/dia) ou Team, a key paga vai pelo mesmo caminho, sem refactor.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Stack 2: pytest com fixtures dinâmicos</h2>
          <p className="mb-4">
            pytest tem <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">@pytest.fixture</code> com escopo (function, class, module, session). Pra suite de integração, escopo <strong className="text-foreground">session</strong> garante que você gera os dados uma vez por <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">pytest</code> run inteiro, e todos os testes compartilham:
          </p>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto">{`# tests/conftest.py
import os
import pytest
import requests
from typing import TypedDict

API = "https://fakeforge.com.br/api/generate"
KEY = os.getenv("FAKEFORGE_API_KEY")  # None em local, valor em CI

class Customer(TypedDict):
    name: str
    cpf: str
    email: str
    phone: str
    address: dict

@pytest.fixture(scope="session")
def br_customers() -> list[Customer]:
    """100 customers BR correlacionados, gerados uma vez por suite."""
    headers = {"X-API-Key": KEY} if KEY else {}
    res = requests.get(
        API,
        params={"preset": "customer", "quantity": 100},
        headers=headers,
        timeout=10,
    )
    res.raise_for_status()
    return res.json()["data"]

@pytest.fixture(scope="session")
def br_cnpjs() -> list[str]:
    res = requests.get(
        API,
        params={"type": "cnpj", "quantity": 50},
        timeout=10,
    )
    return res.json()["data"]

@pytest.fixture
def random_customer(br_customers):
    """Pega 1 customer aleatório por test function."""
    import random
    return random.choice(br_customers)`}</pre>
          <p className="mb-4">
            Uso no teste:
          </p>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto">{`# tests/test_checkout.py
def test_create_order_with_brazilian_customer(random_customer, client):
    response = client.post("/orders", json={
        "customer_cpf": random_customer["cpf"],
        "customer_email": random_customer["email"],
        "shipping_address": random_customer["address"],
        "total": 199.90,
    })
    assert response.status_code == 201
    assert response.json()["customer_cpf"] == random_customer["cpf"]

def test_create_business_account(br_cnpjs, client):
    cnpj = br_cnpjs[0]
    response = client.post("/business-accounts", json={"cnpj": cnpj})
    assert response.status_code == 201`}</pre>
          <p className="mb-4">
            Pontos de atenção. <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">scope=&quot;session&quot;</code> é caro se a chamada falhar (1 falha derruba toda a suite). Em pipeline de produção, vale envelopar com retry exponential backoff (<code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">tenacity</code> resolve com 5 linhas). E se você roda pytest local sem internet, use marcador: <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">@pytest.mark.online</code> nos testes que dependem, com <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">pytest -m &quot;not online&quot;</code> pra rodar offline.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Stack 3: Jest com beforeAll no Node</h2>
          <p className="mb-4">
            Jest não tem escopo de session nativo, mas <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">beforeAll</code> no nível do test file dá comportamento equivalente. Pra compartilhar entre arquivos, use <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">globalSetup</code>:
          </p>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto">{`// jest.global-setup.ts
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const TMP = join(process.cwd(), ".jest-fixtures");

export default async () => {
  mkdirSync(TMP, { recursive: true });

  const customers = await fetch(
    "https://fakeforge.com.br/api/generate?preset=customer&quantity=100",
    { headers: { "X-API-Key": process.env.FAKEFORGE_API_KEY || "" } }
  ).then(r => r.json());

  const cards = await fetch(
    "https://fakeforge.com.br/api/generate?type=creditCardVisa&quantity=30"
  ).then(r => r.json());

  writeFileSync(join(TMP, "customers.json"), JSON.stringify(customers.data));
  writeFileSync(join(TMP, "cards.json"), JSON.stringify(cards.data));
};`}</pre>
          <p className="mb-4">
            E no <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">jest.config.ts</code>:
          </p>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto">{`export default {
  globalSetup: "<rootDir>/jest.global-setup.ts",
  globalTeardown: "<rootDir>/jest.global-teardown.ts",
  testEnvironment: "node",
};

// jest.global-teardown.ts
import { rmSync } from "node:fs";
import { join } from "node:path";

export default async () => {
  rmSync(join(process.cwd(), ".jest-fixtures"), { recursive: true, force: true });
};`}</pre>
          <p className="mb-4">
            Cada test file lê o JSON de <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">.jest-fixtures</code> no <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">beforeAll</code>:
          </p>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto">{`// checkout.test.ts
import { readFileSync } from "node:fs";
import { join } from "node:path";

let customers: Array<{ cpf: string; email: string }>;

beforeAll(() => {
  customers = JSON.parse(
    readFileSync(join(process.cwd(), ".jest-fixtures/customers.json"), "utf-8")
  );
});

test("creates order with BR customer", async () => {
  const c = customers[0];
  const res = await fetch("/api/orders", {
    method: "POST",
    body: JSON.stringify({ cpf: c.cpf, email: c.email, total: 99 }),
  });
  expect(res.status).toBe(201);
});`}</pre>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Seed pre-deploy em staging</h2>
          <p className="mb-4">
            Diferente do CI (dados de teste consumidos in-memory ou em DB efêmero), o staging é um ambiente persistente que precisa de dados &quot;humanos&quot; pra QA manual, demos pra stakeholders, ou testes exploratórios. Aqui o desafio é diferente: você quer popular uma vez por deploy, e ter como limpar entre versões.
          </p>
          <p className="mb-4">
            Padrão que funciona bem:
          </p>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto">{`# .github/workflows/deploy-staging.yml
jobs:
  deploy:
    steps:
      - run: ./deploy.sh staging

      - name: Reset and seed staging DB
        env:
          STAGING_DB: \${{ secrets.STAGING_DB_URL }}
          FAKEFORGE_KEY: \${{ secrets.FAKEFORGE_API_KEY }}
        run: |
          # 1. Trunca tabelas com dados de teste anteriores
          psql "$STAGING_DB" -c "TRUNCATE customers, orders, addresses RESTART IDENTITY CASCADE;"

          # 2. Pede SQL direto da API (formato CREATE TABLE + INSERT)
          curl -sS -H "X-API-Key: $FAKEFORGE_KEY" \\
            -X POST "https://fakeforge.com.br/api/generate" \\
            -H "Content-Type: application/json" \\
            -d '{"preset":"customer","quantity":500,"format":"sql"}' \\
            | psql "$STAGING_DB"`}</pre>
          <p className="mb-4">
            O endpoint <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">format=sql</code> retorna <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">CREATE TABLE IF NOT EXISTS ... + INSERT INTO ...</code> pronto pra psql. É a forma mais direta pra reset + seed em uma única passada. Pra MySQL substitua <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">psql</code> por <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">mysql</code> e ajuste o TRUNCATE.
          </p>
          <p className="mb-4">
            Importante: nunca rode esse mesmo workflow contra produção. Truncate cascade em prod é incidente. Garanta isso com <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">environment: staging</code> no GitHub Actions e branch protection que só permite deploy via PR aprovado.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Quanto custa esse padrão</h2>
          <p className="mb-4">
            Free tier do FakeForge tem 50 chamadas/dia. Quanto isso aguenta? Suponha equipe de 5 devs, 4 PRs por dia em média, com 1 chamada de geração por PR (cache rebate o resto): 20 chamadas/dia. Sobram 30 pra deploys em staging e ad-hoc. Funciona por bastante tempo.
          </p>
          <p className="mb-4">
            Equipe maior ou monorepo com várias suites: plano Dev (R$29/mês, 10.000 chamadas/dia) cobre fácil 50 devs ativos. Team plan (R$79/mês, 100.000 chamadas/dia) é pra org que tá com seed-per-deploy em ambientes paralelos (preview, staging, demo-1, demo-2). <Link href="/pricing" className="text-primary hover:underline">Comparação completa no /pricing</Link>.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Erros comuns e como evitar</h2>
          <ul className="list-disc list-inside space-y-2 pl-2 mt-3 mb-4">
            <li>
              <strong className="text-foreground">Chamar a API em todo teste, não no setup.</strong> 200 testes × 200ms = 40 segundos de overhead por suite. Use <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">scope=&quot;session&quot;</code> (pytest), <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">globalSetup</code> (Jest), ou job dedicado (Actions).
            </li>
            <li>
              <strong className="text-foreground">Commitar a saída em vez de regenerar.</strong> Defeat the purpose. Coloca <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">.test-fixtures/</code> e <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">.jest-fixtures/</code> no <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">.gitignore</code>.
            </li>
            <li>
              <strong className="text-foreground">Esquecer de tratar falha de rede.</strong> CI sem internet = suite vermelha por motivo errado. Retry + fallback pra fixture local mínimo (10 customers genéricos commitados) cobre caso degenerado.
            </li>
            <li>
              <strong className="text-foreground">Não validar shape do response.</strong> A API mudar de campo silenciosamente quebra teste com erro confuso. TypedDict (Python) ou type guard (TypeScript) no <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">conftest</code>/<code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">globalSetup</code> falha cedo.
            </li>
            <li>
              <strong className="text-foreground">Seed em produção por engano.</strong> Vide seção anterior. Environment protection no Actions, e variável de ambiente <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">SEED_ALLOWED=true</code> que só o staging tem.
            </li>
          </ul>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Próximos passos</h2>
          <p className="mb-4">
            Pra continuar: a{" "}
            <Link href="/docs" className="text-primary hover:underline">documentação completa da API</Link>{" "}
            tem os endpoints, presets (<code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">customer</code>,{" "}
            <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">employee</code>,{" "}
            <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">ecommerce_order</code>,{" "}
            <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">contact_list</code>) e os formatos de export (JSON, CSV, SQL). Pros stacks específicos de seed: tutorial dedicado de{" "}
            <Link href="/blog/popular-postgresql-dados-brasileiros-staging" className="text-primary hover:underline">PostgreSQL</Link>,{" "}
            <Link href="/blog/popular-mysql-dados-brasileiros-fake-staging" className="text-primary hover:underline">MySQL</Link>, e{" "}
            <Link href="/blog/mockar-cep-cypress-dados-brasileiros-falsos" className="text-primary hover:underline">Cypress com mock de CEP</Link>.
          </p>
          <p className="mb-4">
            Se você ainda commit fixtures estáticos, este é o momento. Em 2 horas você porta um workflow pra geração on-demand e a próxima atualização de schema brasileiro (CNPJ alfanumérico em julho/2026, qualquer mudança em PIX, novas regras BACEN) chega aos testes sem você precisar mexer nos fixtures.
          </p>
        </div>

        <ShareBar title={"Dados de teste no CI/CD: GitHub Actions, pytest, Jest e seed automatizado"} path="/blog/automatizar-dados-teste-ci-cd" />
        <BlogPostingSchema
          title={"Dados de teste no CI/CD: GitHub Actions, pytest, Jest e seed automatizado"}
          slug="automatizar-dados-teste-ci-cd"
          description={"Pipeline completo de geração de dados BR via API no CI/CD: GitHub Actions com cache + secrets, pytest fixtures, Jest beforeAll, seed pre-deploy, e estratégia de invalidação entre runs."}
          datePublished="2026-06-18"
        />
      </article>
    </PageShell>
  );
}
