import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BlogFeaturedImage from "@/components/BlogFeaturedImage";
import ShareBar from "@/components/ShareBar";
import BlogPostingSchema from "@/components/BlogPostingSchema";

export const metadata: Metadata = {
  title: "FakeForge pra QA Engineer: Massa de Dados BR LGPD-safe",
  description:
    "Automação de testes com massa de dados brasileira: CPF/CNPJ válidos, correlação de campos, BDD, Selenium, Cypress. API REST + CSV/SQL/JSON export. Grátis.",
  keywords:
    "massa de dados para teste, test data management brasileiro, automação testes dados, bdd massa de dados, selenium dados brasileiros, cypress dados br, playwright test data",
  openGraph: {
    title: "FakeForge pra QA Engineer: Massa de Dados BR LGPD-safe",
    description:
      "Gera CPF/CNPJ válidos, CEP por estado, endereço coerente. Integra Selenium, Cypress, Playwright, BDD. API REST + grátis.",
    type: "article",
    images: [
      "/api/og?title=FakeForge%20pra%20QA&subtitle=Massa%20de%20Dados%20BR%20LGPD-safe&category=GUIA",
    ],
  },
  alternates: {
    canonical: "/para-qa-engineers",
  },
};

export default function Page() {
  return (
    <PageShell>
      <article className="max-w-2xl">
        <Link
          href="/"
          className="text-xs text-primary hover:underline mb-4 inline-block"
        >
          ← Voltar ao início
        </Link>
        <BlogFeaturedImage
          category="Guia"
          title="FakeForge pra QA Engineer: Massa de Dados BR LGPD-safe"
          className="mb-6"
        />
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
            FakeForge pra QA Engineer: Massa de Dados BR LGPD-safe
          </h1>
          <div className="flex items-center gap-3 text-xs text-muted mt-3">
            <time>1º de outubro de 2026</time>
            <span>·</span>
            <span>8 min de leitura</span>
          </div>
        </div>

        <div className="prose-custom space-y-2 text-sm text-muted-foreground leading-relaxed">
          <p className="mb-4">
            FakeForge gera massa de dados brasileira (CPF, CNPJ, CEP, endereço, telefone) com validação real pelo mod-11 da Receita Federal, correlação entre campos e API REST pra integrar em pipelines Selenium, Cypress, Playwright e BDD. Grátis 50 chamadas por dia, sem cadastro.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            Por que QA brasileira precisa de ferramenta BR
          </h2>

          <p className="mb-4">
            A automação de testes enfrenta um problema recorrente: dado inválido quebra o teste, mas não por culpa da sua aplicação. É culpa da ferramenta.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            1. Faker genérico não gera CPF válido
          </h3>

          <p className="mb-4">
            Faker.js, Faker.py, Faker.rb — nenhum deles sabe que mod-11 da Receita Federal existe. Geram "123.456.789-09" com dígito verificador aleatório. Seu teste passa em development porque você não roda validação de CPF. Sobe pra staging ou produção, o validador da Receita rejeita, e você fica 3 horas debugando dados que parecem válidos.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            2. Mockaroo e Tonic.ai não entendem geografia BR
          </h3>

          <p className="mb-4">
            Mockaroo gera "CEP: 12345-678, Cidade: Belo Horizonte, Estado: São Paulo". É não-sense. DDD de estado errado, CEP que não existe em nenhuma região. FakeForge correlaciona: CEP 01311-100 sempre vai vir com São Paulo, bairro Centro, rua real, telefone com DDD 11.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            3. Copiar dados de produção pra teste = multa LGPD
          </h3>

          <p className="mb-4">
            Cópia de dados reais de usuários em staging viola a LGPD. Multa R$50 mil a R$50 milhões. Dados sintéticos gerados algoritmicamente não têm risco legal. FakeForge gera tudo que é sintético, auditável, e pronto pra documentação de DPO.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            Casos de uso específicos de QA
          </h2>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            BDD (Cucumber/Gherkin)
          </h3>

          <p className="mb-4">
            Integra com fixtures do seu projeto de testes BDD. Gere dados antes de rodar Cucumber, use como background.
          </p>

          <pre className="text-xs bg-background border border-border rounded-lg p-4 overflow-x-auto mb-4 font-mono">
            <code>{`Scenario: Cadastro válido com dados BR
  Given eu tenha 100 CPFs válidos gerados via FakeForge
  When eu cadastrar cada um via POST /api/cadastro
  Then todos devem retornar 201 Created
  And cada CPF deve passar em validador da Receita`}</code>
          </pre>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Selenium com Python
          </h3>

          <p className="mb-4">
            Chamada rápida antes do teste, dados prontos pro form de cadastro.
          </p>

          <pre className="text-xs bg-background border border-border rounded-lg p-4 overflow-x-auto mb-4 font-mono">
            <code>{`import requests
from selenium import webdriver

# Gerar 1 CPF válido
response = requests.get(
  'https://fakeforge.com.br/api/generate?type=cpf&quantity=1'
)
cpf = response.json()['data'][0]['cpf']

# Usar no Selenium
driver = webdriver.Chrome()
driver.get('https://app.exemplo/cadastro')
driver.find_element('id', 'cpf').send_keys(cpf)
driver.find_element('id', 'submit').click()`}</code>
          </pre>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Cypress com JavaScript
          </h3>

          <p className="mb-4">
            Fixture simplificada, sem chamadas externas durante teste.
          </p>

          <pre className="text-xs bg-background border border-border rounded-lg p-4 overflow-x-auto mb-4 font-mono">
            <code>{`beforeEach(() => {
  cy.request({
    method: 'GET',
    url: 'https://fakeforge.com.br/api/generate?type=pessoa&quantity=1&format=json',
  }).then((response) => {
    const pessoa = response.body.data[0];
    cy.visit('/cadastro');
    cy.get('#cpf').type(pessoa.cpf);
    cy.get('#nome').type(pessoa.nome);
    cy.get('#email').type(pessoa.email);
  });
});`}</code>
          </pre>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Playwright com TypeScript
          </h3>

          <p className="mb-4">
            Tipo mais moderno, com tipagem full.
          </p>

          <pre className="text-xs bg-background border border-border rounded-lg p-4 overflow-x-auto mb-4 font-mono">
            <code>{`import { test } from '@playwright/test';

test('Cadastro com CPF válido', async ({ page, request }) => {
  const response = await request.get(
    'https://fakeforge.com.br/api/generate?type=pessoa&quantity=1'
  );
  const { cpf, email, nome } = (await response.json()).data[0];

  await page.goto('/cadastro');
  await page.fill('#cpf', cpf);
  await page.fill('#email', email);
  await page.fill('#nome', nome);
  await page.click('button[type="submit"]');
});`}</code>
          </pre>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            Edge cases que FakeForge cobre
          </h2>

          <ul className="text-sm text-muted-foreground space-y-2 mb-8 list-disc list-inside">
            <li>
              <strong className="text-foreground">CPF com dígitos repetidos:</strong> "111.111.111-11" vai ser rejeitado (é rule da Receita). FakeForge garante que não gera.
            </li>
            <li>
              <strong className="text-foreground">CNPJ alfanumérico 2026:</strong> Instrução Normativa permite letras desde 01/julho/2026. FakeForge já gera "AB123456000177".
            </li>
            <li>
              <strong className="text-foreground">CEP de todas as 27 UFs:</strong> Cobertura completa com correlação estado-cidade-bairro.
            </li>
            <li>
              <strong className="text-foreground">Telefone com 9 na frente:</strong> Celular moderno é 11987654321 (11 DDD + 9 + 8 dígitos). FakeForge sabe.
            </li>
            <li>
              <strong className="text-foreground">Nome com acentos vs sem:</strong> Gera dados como aparecem em documento real.
            </li>
          </ul>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            Comparação pra time QA
          </h2>

          <div className="rounded-lg bg-card border border-border overflow-x-auto my-4">
            <table className="w-full text-sm">
              <thead className="bg-card-hover">
                <tr>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                    Feature
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                    Faker.js
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                    Mockaroo
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                    FakeForge
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-3 py-2 text-muted-foreground">
                    CPF com mod-11
                  </td>
                  <td className="px-3 py-2">Não</td>
                  <td className="px-3 py-2">Não</td>
                  <td className="px-3 py-2">✓</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-muted-foreground">
                    CNPJ checksum
                  </td>
                  <td className="px-3 py-2">Não</td>
                  <td className="px-3 py-2">Não</td>
                  <td className="px-3 py-2">✓</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-muted-foreground">
                    Correlação CEP-Estado
                  </td>
                  <td className="px-3 py-2">Não</td>
                  <td className="px-3 py-2">Não</td>
                  <td className="px-3 py-2">✓</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-muted-foreground">
                    API sem setup
                  </td>
                  <td className="px-3 py-2">Requer npm</td>
                  <td className="px-3 py-2">✓</td>
                  <td className="px-3 py-2">✓</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-muted-foreground">
                    Preço
                  </td>
                  <td className="px-3 py-2">Grátis</td>
                  <td className="px-3 py-2">USD 60/ano</td>
                  <td className="px-3 py-2">Grátis + R$ 29/mês</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            Integração pipeline CI/CD
          </h2>

          <p className="text-sm text-muted-foreground mb-4">
            Gere dados antes de rodar testes automatizados. Exemplo com GitHub Actions:
          </p>

          <pre className="text-xs bg-background border border-border rounded-lg p-4 overflow-x-auto mb-4 font-mono">
            <code>{`name: Testes QA com dados FakeForge

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Gerar dados de teste
        run: |
          curl -s https://fakeforge.com.br/api/generate \\
            --data "type=pessoa&quantity=100&format=json" \\
            > /tmp/test-data.json

      - name: Rodar Cypress
        env:
          TEST_DATA: /tmp/test-data.json
        run: npx cypress run

      - name: Relatório
        if: always()
        run: npm run report`}</code>
          </pre>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            FAQ
          </h2>

          <div className="space-y-3">
            <details className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">
                  FakeForge serve pra testes de integração E2E?
                </span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">
                  +
                </span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">
                Sim. Qualquer teste que valida dados brasileiros no backend: CPF, CNPJ, CEP, telefone. FakeForge gera dados que passam em validação real da Receita Federal.
              </p>
            </details>

            <details className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">
                  Como gerar massa de dados em bulk pra teste de carga?
                </span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">
                  +
                </span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">
                Limite por chamada é 10 mil registros. Para teste de carga com 100 mil registros, rode 10 chamadas. FakeForge é otimizado pra isso — 10 chamadas síncronas demoram menos de 2 segundos.
              </p>
            </details>

            <details className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">
                  FakeForge integra com minha ferramenta de BDD?
                </span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">
                  +
                </span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">
                API REST, sem dependência de linguagem. Cucumber (Ruby), Behave (Python), Gherkin em qualquer framework — todos conseguem fazer HTTP request pra FakeForge.
              </p>
            </details>

            <details className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">
                  Posso usar os mesmos dados entre runs de teste?
                </span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">
                  +
                </span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">
                Sim. Gere uma vez, salve em arquivo JSON, reutilize entre runs. Ou passe seed pra FakeForge pra garantir determinismo — mesma seed gera mesmos dados.
              </p>
            </details>

            <details className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">
                  FakeForge compensa biblioteca BR + Faker?
                </span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">
                  +
                </span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">
                Se você já instalou Faker.js + cpf-cnpj-validator + geocoding BR, FakeForge elimina essa complexidade: uma API, dados garantidamente válidos, sem setup. Economiza tempo de desenvolvimento e erros em produção.
              </p>
            </details>
          </div>

          <div className="rounded-lg bg-primary/5 border border-primary/20 p-5 mt-10">
            <p className="text-sm font-semibold text-foreground mb-2">
              Comece agora
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Teste sem cadastro. 50 chamadas grátis por dia.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/gerador-cpf"
                className="inline-block px-4 py-2 rounded-lg text-sm bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Gerar CPF validado
              </Link>
              <Link
                href="/docs"
                className="inline-block px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground font-medium hover:border-border-hover transition-colors"
              >
                Ver API docs
              </Link>
              <Link
                href="/blog/massa-de-dados-qa-brasileira-guia-pratico-automacao"
                className="inline-block px-4 py-2 rounded-lg text-sm bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors"
              >
                Guia completo
              </Link>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-8 italic">
            Everton, fundador do FakeForge
          </p>
        </div>

        <ShareBar
          title="FakeForge pra QA Engineer: Massa de Dados BR LGPD-safe"
          path="/para-qa-engineers"
        />

        <BlogPostingSchema
          title="FakeForge pra QA Engineer: Massa de Dados BR LGPD-safe"
          slug="para-qa-engineers"
          description="Gera CPF/CNPJ/CEP válidos com correlação geográfica. Integra Selenium, Cypress, Playwright, BDD, CI/CD. LGPD-safe, grátis."
          datePublished="2026-10-01"
          image="https://fakeforge.com.br/api/og?title=FakeForge%20pra%20QA&subtitle=Massa%20de%20Dados%20BR%20LGPD-safe&category=GUIA"
        />
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "FakeForge serve pra testes de integração E2E?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Sim. Qualquer teste que valida dados brasileiros no backend: CPF, CNPJ, CEP, telefone. FakeForge gera dados que passam em validação real da Receita Federal.",
                },
              },
              {
                "@type": "Question",
                name: "Como gerar massa de dados em bulk pra teste de carga?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Limite por chamada é 10 mil registros. Para teste de carga com 100 mil registros, rode 10 chamadas. FakeForge é otimizado pra isso.",
                },
              },
              {
                "@type": "Question",
                name: "FakeForge integra com minha ferramenta de BDD?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "API REST, sem dependência de linguagem. Cucumber, Behave, Gherkin em qualquer framework conseguem fazer HTTP request pra FakeForge.",
                },
              },
              {
                "@type": "Question",
                name: "Posso usar os mesmos dados entre runs de teste?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Sim. Gere uma vez e salve em arquivo JSON, ou passe seed pra FakeForge pra garantir determinismo.",
                },
              },
              {
                "@type": "Question",
                name: "FakeForge compensa biblioteca BR + Faker?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Se você já instalou Faker.js + cpf-cnpj-validator + geocoding BR, FakeForge elimina essa complexidade com uma API.",
                },
              },
            ],
          }),
        }}
      />
    </PageShell>
  );
}
