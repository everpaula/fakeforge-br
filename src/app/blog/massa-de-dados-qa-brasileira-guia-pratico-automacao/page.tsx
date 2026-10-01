import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BlogFeaturedImage from "@/components/BlogFeaturedImage";
import ShareBar from "@/components/ShareBar";
import BlogPostingSchema from "@/components/BlogPostingSchema";

export const metadata: Metadata = {
  title: "Massa de Dados pra QA Brasileira: Guia Prático de Automação",
  description:
    "Como gerar massa de dados BR pra automação de testes: Selenium, Cypress, Playwright, BDD. CPF/CNPJ válidos, correlação campos, LGPD-safe. Com exemplos de código.",
  keywords:
    "massa de dados teste brasil, test data management, gerador cpf cnpj valido, selenium dados br, cypress test data, playwright dados brasileiros, bdd massa dados, automação testes brasileiro",
  openGraph: {
    title: "Massa de Dados pra QA Brasileira: Guia Prático de Automação",
    description:
      "Guia completo de test data management pra QA brasileira: sintética vs produção, arquitetura TDM, ferramentas, exemplos código, edge cases, CI/CD, LGPD.",
    type: "article",
    images: [
      "/api/og?title=Massa%20de%20Dados%20QA&subtitle=Guia%20Pr%C3%A1tico%20Automa%C3%A7%C3%A3o&category=TUTORIAL",
    ],
  },
  alternates: {
    canonical: "/blog/massa-de-dados-qa-brasileira-guia-pratico-automacao",
  },
};

export default function Post() {
  return (
    <PageShell>
      <article className="max-w-2xl">
        <Link
          href="/blog"
          className="text-xs text-primary hover:underline mb-4 inline-block"
        >
          ← Voltar ao blog
        </Link>
        <BlogFeaturedImage
          category="Tutorial"
          title="Massa de Dados pra QA Brasileira: Guia Prático de Automação"
          className="mb-6"
        />
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
            Massa de Dados pra QA Brasileira: Guia Prático de Automação
          </h1>
          <div className="flex items-center gap-3 text-xs text-muted mt-3">
            <time>1º de outubro de 2026</time>
            <span>·</span>
            <span>15 min de leitura</span>
          </div>
        </div>

        <div className="prose-custom space-y-2 text-sm text-muted-foreground leading-relaxed">
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 my-4 text-sm">
            <p className="mb-2">
              <strong className="text-foreground">TL;DR:</strong> Dados sintéticos gerados via API (não copiar produção) respeitam LGPD, economizam horas de setup e garantem testes que funcionam. Use FakeForge pra dados brasileiros validados, integre em Selenium/Cypress/Playwright/BDD, rode em CI/CD.
            </p>
          </div>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            1. O que é Test Data Management (TDM)
          </h2>

          <p className="mb-4">
            Test Data Management é a prática de gerar, manter e distribuir dados para testes de software. Não é copiar produção (risco legal + LGPD), nem rodar testes sem dados (cobertura fake).
          </p>

          <p className="mb-4">
            TDM bem feito significa: dados que passam em validação real do sistema, reproduzíveis entre runs de teste, conformes com leis de proteção de dados, e fáceis de integrar em pipelines automatizados.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Três problemas que TDM ruim causa
          </h3>

          <p className="text-sm text-muted-foreground mb-4">
            <strong className="text-foreground">Testes lentos:</strong> Você cria dados manualmente no banco antes de rodar suite. 5 minutos de setup pra cada run. Em CI/CD, rodas testes 50 vezes por dia? São 250 minutos desperdiçados.
          </p>

          <p className="text-sm text-muted-foreground mb-4">
            <strong className="text-foreground">Testes flaky:</strong> Dados inválidos (CPF com checksum errado, CEP que não existe, estado desatualizado). Teste passa hoje, quebra amanhã. Você fica debugando se é culpa da sua aplicação ou do dado.
          </p>

          <p className="text-sm text-muted-foreground mb-4">
            <strong className="text-foreground">Risco legal:</strong> Cópia de dados reais de clientes em staging é viola LGPD. Multa vai de R$50 mil a R$50 milhões. Uma auditoria descobre, e você explica pra diretor por que copiou CPF de clientes reais pra teste.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            2. Massa de dados sintética vs cópia de produção
          </h2>

          <p className="mb-4">
            A confusão acontece aqui: "precisamos de dados reais de clientes pra testar o sistema como ele realmente será". Essa lógica é perigosa.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Dados sintéticos (recomendado)
          </h3>

          <ul className="text-sm text-muted-foreground space-y-2 mb-4 list-disc list-inside">
            <li>Gerados algoritmicamente, não extraídos de clientes reais</li>
            <li>Passam em validação real (CPF mod-11, CNPJ checksum, CEP geográfico)</li>
            <li>LGPD-compliant: nenhum dado pessoal real é copiado</li>
            <li>Reproduzíveis: mesma seed gera mesmos dados</li>
            <li>Rápidos de gerar: 1 chamada de API por test run</li>
          </ul>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Cópia de produção (evitar sempre)
          </h3>

          <ul className="text-sm text-muted-foreground space-y-2 mb-8 list-disc list-inside">
            <li>Expõe dados pessoais reais em staging (CPF, email, endereço de clientes)</li>
            <li>LGPD multa R$50 mil a R$50 milhões se auditoria descobre</li>
            <li>Não é reproduzível: dados mudam em produção, seu teste fica incoerente</li>
            <li>Risco de: erro SQL que deleta cliente real, ou teste corrompe produção</li>
          </ul>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            3. Arquitetura TDM pra time QA brasileiro
          </h2>

          <p className="mb-4">
            Existem padrões de design que time QA usa pra organizar geração de dados. Aqui estão os principais:
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Pattern 1: Factory Pattern
          </h3>

          <p className="text-sm text-muted-foreground mb-4">
            Você cria uma classe que centraliza geração de dados:
          </p>

          <pre className="text-xs bg-background border border-border rounded-lg p-4 overflow-x-auto mb-4 font-mono">
            <code>{`class PessoaFactory {
  static async gerar(sobrescritas = {}) {
    const response = await fetch(
      'https://fakeforge.com.br/api/generate?type=pessoa&quantity=1'
    );
    const pessoa = (await response.json()).data[0];
    return { ...pessoa, ...sobrescritas };
  }
}

// No seu teste:
test('Cadastro com dados factory', async () => {
  const pessoa = await PessoaFactory.gerar({
    email: 'custom@example.com'
  });

  await cadastrar(pessoa);
  expect(resultado).toBe('sucesso');
});`}</code>
          </pre>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Pattern 2: Builder Pattern
          </h3>

          <p className="text-sm text-muted-foreground mb-4">
            Mais flexível, permite chain de métodos:
          </p>

          <pre className="text-xs bg-background border border-border rounded-lg p-4 overflow-x-auto mb-4 font-mono">
            <code>{`class PessoaBuilder {
  constructor() {
    this.data = {};
  }

  async comCPF(cpf = null) {
    if (!cpf) {
      const resp = await fetch(
        'https://fakeforge.com.br/api/generate?type=cpf&quantity=1'
      );
      cpf = (await resp.json()).data[0].cpf;
    }
    this.data.cpf = cpf;
    return this;
  }

  comEmail(email) {
    this.data.email = email;
    return this;
  }

  async build() {
    return this.data;
  }
}

// No seu teste:
test('Cadastro com builder', async () => {
  const pessoa = await new PessoaBuilder()
    .comEmail('custom@example.com')
    .build();

  await cadastrar(pessoa);
});`}</code>
          </pre>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Pattern 3: API-first (recomendado)
          </h3>

          <p className="text-sm text-muted-foreground mb-4">
            Você chama a API antes de rodar suite inteira. Fixture gerada uma vez, reutilizada em todos os testes:
          </p>

          <pre className="text-xs bg-background border border-border rounded-lg p-4 overflow-x-auto mb-4 font-mono">
            <code>{`// setup.js - roda antes de todos os testes
import fs from 'fs/promises';

export async function setupTestData() {
  const response = await fetch(
    'https://fakeforge.com.br/api/generate?type=pessoa&quantity=50&format=json'
  );
  const dados = (await response.json()).data;

  await fs.writeFile(
    './fixtures/pessoas.json',
    JSON.stringify(dados, null, 2)
  );

  return dados;
}

// Em cada teste:
import { readFileSync } from 'fs';
const pessoas = JSON.parse(
  readFileSync('./fixtures/pessoas.json', 'utf8')
);

test('Cadastro', () => {
  cadastrar(pessoas[0]);
})

test('Atualização', () => {
  atualizar(pessoas[1]);
});`}</code>
          </pre>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            4. Ferramentas e integrações
          </h2>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            FakeForge + Selenium
          </h3>

          <p className="text-sm text-muted-foreground mb-4">
            Selenium é browser automation. FakeForge gera dados. Integração simples:
          </p>

          <pre className="text-xs bg-background border border-border rounded-lg p-4 overflow-x-auto mb-4 font-mono">
            <code>{`from selenium import webdriver
import requests

# Gerar dados
res = requests.get(
  'https://fakeforge.com.br/api/generate?type=pessoa&quantity=1'
)
pessoa = res.json()['data'][0]

# Usar no browser
driver = webdriver.Chrome()
driver.get('https://app/cadastro')
driver.find_element('id', 'cpf').send_keys(pessoa['cpf'])
driver.find_element('id', 'email').send_keys(pessoa['email'])
driver.find_element('id', 'submit').click()

# Validar
assert driver.find_element('class', 'sucesso').text == 'Cadastro realizado'`}</code>
          </pre>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            FakeForge + Cypress
          </h3>

          <p className="text-sm text-muted-foreground mb-4">
            Cypress é mais moderno, built-in request, melhor pra dados br:
          </p>

          <pre className="text-xs bg-background border border-border rounded-lg p-4 overflow-x-auto mb-4 font-mono">
            <code>{`describe('Cadastro E2E', () => {
  it('Cadastro com CPF válido', () => {
    cy.request({
      method: 'GET',
      url: 'https://fakeforge.com.br/api/generate',
      qs: {
        type: 'pessoa',
        quantity: 1,
        format: 'json'
      }
    }).then((response) => {
      const pessoa = response.body.data[0];

      cy.visit('/cadastro');
      cy.get('input[name="cpf"]').type(pessoa.cpf);
      cy.get('input[name="email"]').type(pessoa.email);
      cy.get('input[name="nome"]').type(pessoa.nome);
      cy.get('button[type="submit"]').click();

      cy.get('.sucesso').should('be.visible');
    });
  });
});`}</code>
          </pre>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            FakeForge + Playwright
          </h3>

          <p className="text-sm text-muted-foreground mb-4">
            Playwright é cross-browser, mais rápido que Cypress:
          </p>

          <pre className="text-xs bg-background border border-border rounded-lg p-4 overflow-x-auto mb-4 font-mono">
            <code>{`import { test, expect } from '@playwright/test';

test('E2E Ecommerce com dados completos', async ({ page, request }) => {
  // Gerar dados da FakeForge
  const response = await request.get(
    'https://fakeforge.com.br/api/generate?type=compra&quantity=1'
  );
  const compra = (await response.json()).data[0];

  // Navegar e preencher
  await page.goto('/checkout');
  await page.fill('input[name="cpf"]', compra.cpf);
  await page.fill('input[name="endereco"]', compra.endereco);
  await page.fill('input[name="cartao"]', compra.cartao);

  // Confirmar
  await page.click('button:has-text("Confirmar")');
  await page.waitForURL('/confirmacao');

  // Validar
  const sucesso = await page.isVisible('.pedido-confirmado');
  expect(sucesso).toBeTruthy();
});`}</code>
          </pre>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            FakeForge + Cucumber/Gherkin (BDD)
          </h3>

          <p className="text-sm text-muted-foreground mb-4">
            BDD integra linguagem natural com teste. FakeForge em step definitions:
          </p>

          <pre className="text-xs bg-background border border-border rounded-lg p-4 overflow-x-auto mb-4 font-mono">
            <code>{`# features/cadastro.feature
Feature: Cadastro de usuários
  Scenario: Cadastro com CPF válido
    Given tenho um CPF válido gerado
    When submeto o formulário de cadastro
    Then vejo mensagem de sucesso

// stepDefinitions.js
import { Given, When, Then } from '@cucumber/cucumber';
import fetch from 'node-fetch';

let usuario = {};

Given('tenho um CPF válido gerado', async () => {
  const res = await fetch(
    'https://fakeforge.com.br/api/generate?type=pessoa&quantity=1'
  );
  usuario = (await res.json()).data[0];
});

When('submeto o formulário de cadastro', async () => {
  await page.fill('#cpf', usuario.cpf);
  await page.fill('#email', usuario.email);
  await page.click('button[type="submit"]');
});

Then('vejo mensagem de sucesso', async () => {
  const msg = await page.textContent('.sucesso');
  expect(msg).toContain('Cadastro realizado');
});`}</code>
          </pre>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            5. Exemplos de código completos
          </h2>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Exemplo 1: Teste cadastro com Python + Selenium
          </h3>

          <pre className="text-xs bg-background border border-border rounded-lg p-4 overflow-x-auto mb-4 font-mono">
            <code>{`#!/usr/bin/env python3
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_cadastro_cpf_valido():
    # 1. Gerar CPF válido via FakeForge
    response = requests.get(
        'https://fakeforge.com.br/api/generate',
        params={'type': 'cpf', 'quantity': 1, 'format': 'json'}
    )
    cpf = response.json()['data'][0]['cpf']

    # 2. Abrir browser e acessar cadastro
    driver = webdriver.Chrome()
    driver.get('https://staging.app/cadastro')

    # 3. Preencher formulário
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, 'cpf'))
    )
    driver.find_element(By.ID, 'cpf').send_keys(cpf)
    driver.find_element(By.ID, 'nome').send_keys('João Silva')
    driver.find_element(By.ID, 'email').send_keys('joao@example.com')

    # 4. Submeter
    driver.find_element(By.XPATH, '//button[@type="submit"]').click()

    # 5. Validar sucesso
    sucesso = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CLASS_NAME, 'sucesso'))
    )
    assert 'Cadastro realizado' in sucesso.text

    driver.quit()
    print(f'✓ Teste passou com CPF: {cpf}')

if __name__ == '__main__':
    test_cadastro_cpf_valido()`}</code>
          </pre>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Exemplo 2: E2E Ecommerce com TypeScript + Playwright
          </h3>

          <pre className="text-xs bg-background border border-border rounded-lg p-4 overflow-x-auto mb-4 font-mono">
            <code>{`import { test, expect } from '@playwright/test';

interface Compra {
  cpf: string;
  cnpj: string;
  nome: string;
  endereco: string;
  cep: string;
  telefone: string;
  email: string;
}

async function gerarDados(): Promise<Compra> {
  const response = await fetch(
    'https://fakeforge.com.br/api/generate?type=compra&quantity=1&format=json'
  );
  const { data } = await response.json();
  return data[0];
}

test('Compra E2E com dados BR validados', async ({ page, request }) => {
  const compra = await gerarDados();

  // Acessar site
  await page.goto('/');

  // Adicionar produto
  await page.click('button:has-text("Adicionar ao carrinho")');

  // Ir pra checkout
  await page.click('a[href="/checkout"]');

  // Preencher dados pessoais
  await page.fill('#cpf', compra.cpf);
  await page.fill('#email', compra.email);
  await page.fill('#telefone', compra.telefone);

  // Preencher endereço (CEP já correlaciona estado-cidade)
  await page.fill('#cep', compra.cep);
  await page.fill('#endereco', compra.endereco);

  // Confirmar
  await page.click('button:has-text("Confirmar compra")');

  // Esperar redirecionamento
  await page.waitForURL('**/pedido-confirmado');

  // Validar
  const pedidoNum = await page.textContent('#pedido-numero');
  expect(pedidoNum).toMatch(/^PED-\d{10}$/);

  console.log(\`✓ Pedido \${pedidoNum} criado com CPF \${compra.cpf}\`);
});`}</code>
          </pre>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Exemplo 3: BDD + Cypress com fixture
          </h3>

          <pre className="text-xs bg-background border border-border rounded-lg p-4 overflow-x-auto mb-4 font-mono">
            <code>{`// cypress/fixtures/dados.json
// Pré-gerado via: curl https://fakeforge.com.br/api/generate?type=pessoa&quantity=50&format=json > dados.json

describe('BDD - Cadastro com dados fixture', () => {
  before(() => {
    cy.fixture('dados.json').then((dados) => {
      Cypress.env('pessoas', dados.data);
    });
  });

  it('Cadastro primeira pessoa', () => {
    const pessoa = Cypress.env('pessoas')[0];

    cy.visit('/cadastro');
    cy.get('#cpf').type(pessoa.cpf);
    cy.get('#email').type(pessoa.email);
    cy.get('#nome').type(pessoa.nome);
    cy.get('button[type="submit"]').click();

    cy.get('.sucesso').should('contain', 'Cadastro realizado');
  });

  it('Cadastro segunda pessoa', () => {
    const pessoa = Cypress.env('pessoas')[1];

    cy.visit('/cadastro');
    cy.get('#cpf').type(pessoa.cpf);
    cy.get('#email').type(pessoa.email);
    cy.get('#nome').type(pessoa.nome);
    cy.get('button[type="submit"]').click();

    cy.get('.sucesso').should('contain', 'Cadastro realizado');
  });
});`}</code>
          </pre>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            6. Edge cases importantes do Brasil
          </h2>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Edge Case 1: CPF inválido pra testar front-end
          </h3>

          <p className="text-sm text-muted-foreground mb-4">
            Quando você quer testar se o front-end rejeita CPF inválido, FakeForge pode gerar CPFs propositalmente inválidos:
          </p>

          <pre className="text-xs bg-background border border-border rounded-lg p-4 overflow-x-auto mb-4 font-mono">
            <code>{`// Teste que front-end rejeita CPF
test('Front rejeita CPF inválido', async () => {
  const cpfInvalido = '111.111.111-11'; // Repetido, sempre inválido

  cy.visit('/cadastro');
  cy.get('#cpf').type(cpfInvalido);
  cy.get('button[type="submit"]').click();

  cy.get('.erro').should('contain', 'CPF inválido');
});`}</code>
          </pre>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Edge Case 2: CNPJ alfanumérico 2026
          </h3>

          <p className="text-sm text-muted-foreground mb-4">
            A partir de julho de 2026, CNPJs podem ter letras nas primeiras 8 posições. Teste isso:
          </p>

          <pre className="text-xs bg-background border border-border rounded-lg p-4 overflow-x-auto mb-4 font-mono">
            <code>{`test('Sistema aceita CNPJ alfanumérico', async () => {
  // Gerar CNPJ no novo formato
  const response = await fetch(
    'https://fakeforge.com.br/api/generate?type=cnpj&format=alfanumerico&quantity=1'
  );
  const cnpj = (await response.json()).data[0].cnpj; // Ex: AB123456000177

  cy.visit('/cadastro-empresa');
  cy.get('#cnpj').type(cnpj);
  cy.get('button[type="submit"]').click();

  cy.get('.sucesso').should('be.visible');
});`}</code>
          </pre>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Edge Case 3: CEP inexistente
          </h3>

          <p className="text-sm text-muted-foreground mb-4">
            Alguns CEPs foram desativados por fusão de cidades. Teste:
          </p>

          <pre className="text-xs bg-background border border-border rounded-lg p-4 overflow-x-auto mb-4 font-mono">
            <code>{`test('Validador rejeita CEP desativado', async () => {
  const cepDesativado = '12345-678'; // Fictício

  cy.visit('/cadastro');
  cy.get('#cep').type(cepDesativado);
  cy.get('#cep').blur(); // Trigger validação

  cy.get('.erro-cep').should('contain', 'CEP não encontrado');
});`}</code>
          </pre>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Edge Case 4: Telefone com 9 (celular moderno)
          </h3>

          <p className="text-sm text-muted-foreground mb-4">
            Celular tem 9 entre DDD e número: 11 9 8765-4321 (não é 11 8765-4321).
          </p>

          <pre className="text-xs bg-background border border-border rounded-lg p-4 overflow-x-auto mb-4 font-mono">
            <code>{`test('Validador aceita telefone moderno com 9', async () => {
  const telefone = '+5511987654321'; // 11 DDD + 9 + 8 dígitos

  cy.visit('/cadastro');
  cy.get('#telefone').type(telefone);
  cy.get('button[type="submit"]').click();

  cy.get('.sucesso').should('be.visible');
});`}</code>
          </pre>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            7. CI/CD integration
          </h2>

          <p className="mb-4">
            Integrar FakeForge em pipeline CI/CD significa: chamar API pra gerar dados antes de rodar testes, salvar em arquivo, passar path pro seu test runner.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            GitHub Actions
          </h3>

          <pre className="text-xs bg-background border border-border rounded-lg p-4 overflow-x-auto mb-4 font-mono">
            <code>{`name: QA Testes Automatizados

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Instalar dependências
        run: npm install

      - name: Gerar massa de dados via FakeForge
        run: |
          curl -s 'https://fakeforge.com.br/api/generate' \\
            --get --data-urlencode 'type=pessoa' \\
            --data-urlencode 'quantity=100' \\
            --data-urlencode 'format=json' \\
            > fixtures/pessoas.json

      - name: Rodar testes Selenium
        run: npm run test:selenium

      - name: Rodar testes Cypress
        run: npm run test:e2e

      - name: Upload relatório
        if: always()
        uses: actions/upload-artifact@v2
        with:
          name: test-reports
          path: reports/`}</code>
          </pre>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            GitLab CI
          </h3>

          <pre className="text-xs bg-background border border-border rounded-lg p-4 overflow-x-auto mb-4 font-mono">
            <code>{`stages:
  - test

QA_Tests:
  stage: test
  image: node:18
  script:
    - npm install
    - |
      curl -s 'https://fakeforge.com.br/api/generate?type=pessoa&quantity=100&format=json' \\
        > fixtures/pessoas.json
    - npm run test:cypress
    - npm run test:selenium
  artifacts:
    paths:
      - reports/
    expire_in: 1 week`}</code>
          </pre>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            8. Conformidade LGPD pro time QA
          </h2>

          <p className="mb-4">
            LGPD (Lei Geral de Proteção de Dados) regula como dados pessoais são coletados e usados no Brasil. Para QA, os riscos principais são:
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            1. Não copiar dados de produção pra staging
          </h3>

          <p className="text-sm text-muted-foreground mb-4">
            Quando você copia tabela de clientes reais (nome, CPF, email) pra staging, você está exposição dados pessoais. Auditoria LGPD descobre e multa R$50 mil mínimo.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            2. Dados sintéticos vs anonimização
          </h3>

          <p className="text-sm text-muted-foreground mb-4">
            Existe diferença:
          </p>

          <ul className="text-sm text-muted-foreground space-y-2 mb-4 list-disc list-inside">
            <li><strong>Sintéticos:</strong> Nunca foram dados reais. Gerados algoritmicamente. LGPD-seguro por design.</li>
            <li><strong>Anonimizados:</strong> Foram dados reais, depois tiveram identificadores removidos. Mais difícil garantir que não são re-identificáveis.</li>
          </ul>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            3. Documentar pra DPO
          </h3>

          <p className="text-sm text-muted-foreground mb-4">
            Se sua empresa tem Data Protection Officer (DPO), documente: "Time QA usa FakeForge pra gerar dados sintéticos que passam em validação real. Nenhum dado pessoal real é copiado pra staging. Dados são descartáveis após teste."
          </p>

          <p className="text-sm text-muted-foreground mb-4">
            Com essa documentação, você está LGPD-compliant. FakeForge já oferece documentação de LGPD pronta pra você passar pro DPO.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            FAQ
          </h2>

          <div className="space-y-3">
            <details className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">
                  Qual a diferença entre FakeForge e Faker.js em produção?
                </span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">
                  +
                </span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">
                Faker.js é biblioteca JavaScript pra gerar dados no seu código. FakeForge é API centralizada. Se você roda testes em múltiplas linguagens (Python, Java, Node), FakeForge é mais eficiente. E FakeForge valida CPF/CNPJ realmente, Faker não.
              </p>
            </details>

            <details className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">
                  Posso usar FakeForge pra testes de carga?
                </span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">
                  +
                </span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">
                Sim. Limite é 10 mil registros por chamada. Pra teste de carga com 100 mil registros, rode 10 chamadas antes de iniciar o teste. Tudo leva menos de 2 segundos.
              </p>
            </details>

            <details className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">
                  FakeForge é determinístico? Posso ter os mesmos dados em runs diferentes?
                </span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">
                  +
                </span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">
                Sim. Passe um parametro seed=123 e você sempre vai gerar os mesmos dados. Útil pra reproduzir bugs.
              </p>
            </details>

            <details className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">
                  Como saber se FakeForge é melhor que Mockaroo pra meu time?
                </span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">
                  +
                </span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">
                Se seu app valida CPF/CNPJ com mod-11, precisa de CEP por estado, ou trabalha com pagamento (PIX), FakeForge é escolha obvia. Se é app puramente internacional, Mockaroo é melhor.
              </p>
            </details>

            <details className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">
                  FakeForge vai adicionar suporte a mais documentos brasileiros?
                </span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">
                  +
                </span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">
                Sim. RG, CNH, PIS/PASEP estão na roadmap. Já estão suportados CPF, CNPJ, PIX, CEP, telefone, empresa.
              </p>
            </details>

            <details className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">
                  Quanto custa FakeForge pra meu time QA?
                </span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">
                  +
                </span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">
                Gratuito até 50 chamadas por dia. R$29/mês pro plano Dev (10 mil chamadas/dia). Pra time QA com 50-100 runs de teste por dia, plano gratuito já cobre.
              </p>
            </details>
          </div>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            Conclusão
          </h2>

          <p className="mb-4">
            Massa de dados é a base de QA. Se você gera dados manualmente, copia de produção (LGPD risk), ou confia em Faker sem validação, você está deixando bugs passar.
          </p>

          <p className="mb-4">
            FakeForge resolve isso: dados válidos, gerados em tempo real, integrados em Selenium/Cypress/Playwright/BDD, LGPD-compliant, pronto pra CI/CD. Uma API, nenhuma configuração, grátis até 50 chamadas por dia.
          </p>

          <p className="mb-8">
            Próximo passo: <Link href="/gerador-cpf" className="text-primary hover:underline">gere seu primeiro CPF</Link> agora, depois integre em seu primeiro teste. Tempo total: 10 minutos.
          </p>

          <div className="rounded-lg bg-primary/5 border border-primary/20 p-5 mt-10">
            <p className="text-sm font-semibold text-foreground mb-2">
              Recursos úteis
            </p>
            <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
              <li>
                <Link href="/docs" className="text-primary hover:underline">
                  Documentação API completa
                </Link>
              </li>
              <li>
                <Link href="/gerador-cpf" className="text-primary hover:underline">
                  Gerador CPF online
                </Link>
              </li>
              <li>
                <Link href="/para-qa-engineers" className="text-primary hover:underline">
                  Landing page pra QA engineers
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-primary hover:underline">
                  Planos e preços
                </Link>
              </li>
            </ul>
          </div>

          <p className="text-xs text-muted-foreground mt-8 italic">
            Everton, fundador do FakeForge
          </p>
        </div>

        <ShareBar
          title="Massa de Dados pra QA Brasileira: Guia Prático de Automação"
          path="/blog/massa-de-dados-qa-brasileira-guia-pratico-automacao"
        />

        <BlogPostingSchema
          title="Massa de Dados pra QA Brasileira: Guia Prático de Automação"
          slug="massa-de-dados-qa-brasileira-guia-pratico-automacao"
          description="Guia completo: TDM, sintética vs produção, arquitetura, Selenium/Cypress/Playwright/BDD, code examples, edge cases, CI/CD, LGPD compliance."
          datePublished="2026-10-01"
          image="https://fakeforge.com.br/api/og?title=Massa%20de%20Dados%20QA&subtitle=Guia%20Pr%C3%A1tico%20Automa%C3%A7%C3%A3o&category=TUTORIAL"
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
                name: "Qual a diferença entre FakeForge e Faker.js em produção?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Faker.js é biblioteca JavaScript pra gerar dados no seu código. FakeForge é API centralizada. Se você roda testes em múltiplas linguagens, FakeForge é mais eficiente. E valida CPF/CNPJ realmente.",
                },
              },
              {
                "@type": "Question",
                name: "Posso usar FakeForge pra testes de carga?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Sim. Limite é 10 mil registros por chamada. Pra teste com 100 mil registros, rode 10 chamadas. Tudo leva menos de 2 segundos.",
                },
              },
              {
                "@type": "Question",
                name: "FakeForge é determinístico? Posso ter os mesmos dados em runs diferentes?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Sim. Passe um parametro seed=123 e sempre gera os mesmos dados. Útil pra reproduzir bugs.",
                },
              },
              {
                "@type": "Question",
                name: "Como saber se FakeForge é melhor que Mockaroo pra meu time?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Se seu app valida CPF/CNPJ com mod-11, precisa de CEP por estado, ou trabalha com pagamento PIX, FakeForge é escolha óbvia.",
                },
              },
              {
                "@type": "Question",
                name: "Quanto custa FakeForge pra meu time QA?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Gratuito até 50 chamadas por dia. R$29/mês pro plano Dev (10 mil chamadas/dia). Pra team QA, gratuito já cobre.",
                },
              },
            ],
          }),
        }}
      />
    </PageShell>
  );
}
