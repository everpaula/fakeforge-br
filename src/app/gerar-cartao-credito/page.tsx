import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import GeneratorSchema from "@/components/GeneratorSchema";

export const metadata: Metadata = {
  title: "Gerar Cartão de Crédito Válido para Testes (API + Integração)",
  description: "Gerar cartão de crédito para testes de checkout em Node.js, Python, PHP e React. Snippets prontos de integração, algoritmo Luhn implementado, curl exemplo. Free tier 50 chamadas/dia sem cadastro.",
  keywords: "gerar cartao de credito, gerar cartão de crédito, gerar cartão de credito valido, gerar cartão de crédito online, gerar cartao credito, como gerar cartão de credito para teste, gerar cartao credito visa, gerar cartão node js python php",
  alternates: { canonical: "/gerar-cartao-credito" },
  openGraph: {
    title: "Gerar Cartão de Crédito Válido - Snippets Node/Python/PHP/React",
    description: "Snippets prontos pra integrar geração de cartão fictício no seu stack. API REST grátis + exemplos em 4 linguagens.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function GerarCartaoCredito() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Snippets de integração</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Gerar <span className="text-primary">Cartão de Crédito</span> Válido no Seu Código
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Snippets prontos pra chamar a geração de cartão via API dentro do seu stack. Node.js, Python,
          PHP, curl. Todos os cartões passam Luhn (mod-10), inclui bandeira aleatória entre Visa,
          Mastercard, Elo, Hipercard e Amex. Grátis, sem cadastro.
        </p>
      </div>

      <SingleGenerator
        type="creditCard"
        label="Gerar cartão"
        description="Teste no browser - depois copie o snippet abaixo pra usar no seu projeto"
      />

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Gerar Cartão de Crédito", url: "/gerar-cartao-credito" },
      ]} />

      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Node.js / TypeScript</h2>
          <pre className="bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`// Gerar 50 cartões pra fixture de teste
const res = await fetch(
  "https://fakeforge.com.br/api/generate?type=creditCard&quantity=50"
);
const { data } = await res.json();

// data = [
//   { number: "4485...", brand: "visa", cvv: "123", expiry: "12/28" },
//   { number: "5187...", brand: "mastercard", cvv: "456", expiry: "03/29" },
//   ...
// ]

// Usar em fixture do Vitest / Jest
export const cardFixtures = data;`}</code></pre>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Python (pytest)</h2>
          <pre className="bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`import pytest
import requests

@pytest.fixture(scope="session")
def credit_cards():
    """100 cartões válidos (Luhn) pra sessão de testes"""
    res = requests.get(
        "https://fakeforge.com.br/api/generate",
        params={"type": "creditCard", "quantity": 100}
    )
    return res.json()["data"]

def test_checkout_accepts_visa(credit_cards, checkout_client):
    visas = [c for c in credit_cards if c["brand"] == "visa"]
    for card in visas[:5]:
        response = checkout_client.post("/pay", json=card)
        assert response.status_code == 200`}</code></pre>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">PHP (Laravel factory)</h2>
          <pre className="bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`use Illuminate\\Support\\Facades\\Http;

// database/factories/PaymentFactory.php
public function definition(): array
{
    $response = Http::get('https://fakeforge.com.br/api/generate', [
        'type' => 'creditCard',
        'quantity' => 1,
    ]);

    $card = $response->json('data.0');

    return [
        'card_number' => $card['number'],
        'brand' => $card['brand'],
        'cvv' => $card['cvv'],
        'expiry' => $card['expiry'],
    ];
}`}</code></pre>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">curl (bash / CI/CD)</h2>
          <pre className="bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`# Salvar 500 cartões como JSON pra fixture versionada
curl "https://fakeforge.com.br/api/generate?type=creditCard&quantity=500" \\
  -o fixtures/credit_cards.json

# CSV pra importar no banco de staging
curl "https://fakeforge.com.br/api/generate?type=creditCard&quantity=1000&format=csv" \\
  -o fixtures/cards.csv

# SQL com CREATE TABLE + INSERT em lote
curl -X POST "https://fakeforge.com.br/api/generate" \\
  -H "Content-Type: application/json" \\
  -d '{"type":"creditCard","quantity":1000,"format":"sql"}' \\
  -o seed/credit_cards.sql`}</code></pre>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Free tier vs Plano Dev</h2>
          <p>
            Free (sem cadastro): 50 chamadas/dia, até 100 cartões por chamada = ~5.000 cartões/dia máximo.
            Cobre 90% dos casos de teste local e CI leve.
          </p>
          <p className="mt-2">
            <Link href="/pricing?plan=dev&ref=gerar_cartao_snippets" className="text-primary hover:underline font-medium">Plano Dev (R$29/mês)</Link>: 10.000 chamadas/dia, até 10.000 cartões por chamada = 100.000.000/dia
            teórico. Pra CI pesado, seed de staging com &gt;10k rows, ou stress-test.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Perguntas Frequentes</h2>
          <div className="space-y-3">
            {[
              { q: "Precisa cadastrar pra usar a API?", a: "Não. 50 chamadas/dia sem cadastro, sem API key, sem cartão. Basta chamar o endpoint. Rate limit é por IP." },
              { q: "Como escolher só uma bandeira?", a: "Use o parâmetro brand: ?type=creditCard&brand=visa&quantity=50. Bandeiras aceitas: visa, mastercard, elo, hipercard, amex. Sem o parâmetro, distribui aleatoriamente." },
              { q: "Os cartões incluem nome do titular?", a: "O endpoint /api/generate?type=creditCard retorna número, bandeira, CVV e validade. Pra incluir nome, use o preset customer que devolve cartão + pessoa + endereço correlacionados em 1 chamada." },
              { q: "Como paralelizar chamadas no CI?", a: "Com o Free tier (50/dia por IP), rode a chamada 1 vez no início do CI e cacheie o resultado como fixture. Pra grandes volumes, use plano Dev que tem 10.000/dia." },
              { q: "O formato SQL funciona no MySQL e PostgreSQL?", a: "Sim. O SQL gerado usa CREATE TABLE IF NOT EXISTS + INSERT genérico compatível com MySQL, PostgreSQL, SQLite, SQL Server e MariaDB." },
            ].map(({ q, a }) => (
              <details key={q} className="group border border-border rounded-lg">
                <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                  <span className="text-sm font-medium text-foreground">{q}</span>
                  <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
                </summary>
                <p className="px-4 pb-3 text-sm text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Ferramentas relacionadas</h2>
          <div className="flex flex-wrap gap-2">
            <Link href="/gerador-cartao" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">Gerador de Cartão (pilar)</Link>
            <Link href="/cartao-credito-fake" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">Cartão fake</Link>
            <Link href="/cartao-credito-valido" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">Cartão válido (Luhn)</Link>
            <Link href="/docs" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">Docs API completa</Link>
          </div>
        </section>
      </div>

      <GeneratorSchema
        name="Gerar Cartão de Crédito via API"
        url="https://fakeforge.com.br/gerar-cartao-credito"
        description="Snippets prontos pra gerar cartão de crédito fictício válido (Luhn) no seu código Node.js, Python, PHP ou curl. API REST grátis, 50 chamadas/dia sem cadastro."
        features={[
          "Snippets em Node.js, Python, PHP e curl",
          "Fixtures prontas pra Vitest, Jest e pytest",
          "Export em JSON, CSV e SQL",
          "5 bandeiras: Visa, Mastercard, Elo, Hipercard, Amex",
          "Preset customer inclui cartão + CPF + endereço correlacionados",
          "50 chamadas grátis/dia, 10.000/dia no plano Dev",
        ]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Precisa cadastrar pra usar a API?", acceptedAnswer: { "@type": "Answer", text: "Não. 50 chamadas/dia sem cadastro, sem API key, sem cartão. Basta chamar o endpoint. Rate limit é por IP." } },
              { "@type": "Question", name: "Como escolher só uma bandeira?", acceptedAnswer: { "@type": "Answer", text: "Use o parâmetro brand: ?type=creditCard&brand=visa&quantity=50. Bandeiras aceitas: visa, mastercard, elo, hipercard, amex." } },
              { "@type": "Question", name: "Os cartões incluem nome do titular?", acceptedAnswer: { "@type": "Answer", text: "O endpoint /api/generate?type=creditCard retorna número, bandeira, CVV e validade. Pra incluir nome, use o preset customer que devolve cartão + pessoa + endereço correlacionados em 1 chamada." } },
              { "@type": "Question", name: "Como paralelizar chamadas no CI?", acceptedAnswer: { "@type": "Answer", text: "Com o Free tier (50/dia por IP), rode a chamada 1 vez no início do CI e cacheie o resultado como fixture. Pra grandes volumes, use plano Dev que tem 10.000/dia." } },
              { "@type": "Question", name: "O formato SQL funciona no MySQL e PostgreSQL?", acceptedAnswer: { "@type": "Answer", text: "Sim. O SQL gerado usa CREATE TABLE IF NOT EXISTS + INSERT genérico compatível com MySQL, PostgreSQL, SQLite, SQL Server e MariaDB." } },
            ],
          }),
        }}
      />
    </PageShell>
  );
}
