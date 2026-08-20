import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import GeneratorSchema from "@/components/GeneratorSchema";

export const metadata: Metadata = {
  title: "Gerar Cartão de Crédito Válido com CPF Correlacionado (Preset Customer)",
  description: "Cartão de crédito + CPF + email + endereço no mesmo objeto para testes de checkout brasileiro. Preset customer da API do FakeForge devolve tudo correlacionado em 1 chamada. Ideal para mock de fluxo antifraude.",
  keywords: "gerar cartão de credito valido com cpf, gerar cartão de credito com cpf, cartao com cpf, cartao credito cpf teste, gerador de credito com nome, gerador cartao credito nome cpf, cartão com nome fake, customer preset brasileiro, mock antifraude checkout",
  alternates: { canonical: "/gerar-cartao-com-cpf" },
  openGraph: {
    title: "Cartão de Crédito + CPF Correlacionado - Preset Customer",
    description: "Cartão + CPF + endereço no mesmo objeto pra mock de checkout e antifraude. 1 chamada, tudo válido.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function GerarCartaoComCpf() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Preset customer</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Cartão de Crédito <span className="text-primary">+ CPF Correlacionado</span>
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Pra testar checkout brasileiro completo, você precisa do cartão + CPF do titular +
          endereço de cobrança + email - tudo coerente entre si. O preset <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded font-mono">customer</code>
          {" "}da API do FakeForge devolve tudo em 1 chamada. Cada campo é individualmente válido (Luhn no cartão,
          mod-11 no CPF, formato BACEN no PIX) e a correlação evita mismatch em validação de antifraude.
        </p>
      </div>

      <SingleGenerator
        type="creditCard"
        label="Cartão sozinho"
        description="Só cartão - pra pegar cartão + CPF + endereço correlacionados, use o preset customer via API abaixo"
      />

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Cartão + CPF", url: "/gerar-cartao-com-cpf" },
      ]} />

      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Por que correlacionar cartão e CPF</h2>
          <p>
            Gateways brasileiros (Mercado Pago, Pagar.me, Cielo, Getnet) e sistemas de antifraude (Konduto,
            ClearSale, Legiti) fazem cross-check entre dados do pagamento. CPF do titular do cartão, CEP
            de cobrança, telefone e email são combinados pra calcular score de fraude. Se você mockar cada
            campo separado com dados aleatórios não correlacionados, seu teste dispara falso-positivo de
            fraude e o fluxo trava.
          </p>
          <p className="mt-2">
            Com o preset <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded font-mono">customer</code>,
            o email é derivado do nome (ex: joao.silva@gmail.com), o DDD do telefone bate com o estado do
            endereço, e o CEP corresponde a cidade real. Sistema antifraude vê o payload como consistente.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Chamada da API</h2>
          <pre className="bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`# Um customer completo (1 payload pra testar checkout)
curl "https://fakeforge.com.br/api/generate?preset=customer&quantity=1"

# Response:
{
  "preset": "customer",
  "quantity": 1,
  "data": [{
    "name": "João Silva Souza",
    "cpf": "123.456.789-09",
    "email": "joao.silva.souza@gmail.com",
    "phone": "(11) 98765-4321",
    "address": {
      "street": "Rua das Flores, 123",
      "city": "São Paulo",
      "state": "SP",
      "zip": "01310-100"
    },
    "creditCard": {
      "number": "4485 1234 5678 9012",
      "brand": "visa",
      "cvv": "123",
      "expiry": "12/28"
    }
  }]
}`}</code></pre>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Node.js - seed de 100 customers</h2>
          <pre className="bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`// Popular checkout_customers no banco de staging
const res = await fetch(
  "https://fakeforge.com.br/api/generate?preset=customer&quantity=100"
);
const { data } = await res.json();

// Cada objeto tem cartão + CPF + endereço COERENTES entre si
for (const customer of data) {
  await db.customer.create({
    data: {
      full_name: customer.name,
      document: customer.cpf,
      email: customer.email,
      phone: customer.phone,
      billing_address: customer.address,
      default_card: customer.creditCard,
    }
  });
}`}</code></pre>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Formato SQL direto</h2>
          <pre className="bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`# Baixar 1000 customers como INSERT INTO já pronto
curl -X POST "https://fakeforge.com.br/api/generate" \\
  -H "Content-Type: application/json" \\
  -d '{"preset":"customer","quantity":1000,"format":"sql"}' \\
  -o seed/customers_1000.sql

# Aplicar no banco
psql -d fakeforge_staging -f seed/customers_1000.sql`}</code></pre>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Outros presets correlacionados</h2>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li><code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded font-mono">employee</code> - pessoa + conta bancária + chave PIX (folha de pagamento)</li>
            <li><code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded font-mono">company</code> - empresa + CNPJ + endereço comercial</li>
            <li><code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded font-mono">ecommerce_order</code> - customer + cartão + endereço de entrega</li>
            <li><code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded font-mono">contact_list</code> - nome + email + telefone (CRM/marketing)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Perguntas Frequentes</h2>
          <div className="space-y-3">
            {[
              { q: "O CPF gerado é da mesma pessoa do cartão?", a: "O CPF é gerado com mod-11 válido e o nome é gerado independentemente - ambos são fictícios (nenhum pertence a pessoa real). A correlação garantida no preset customer é NOME ↔ EMAIL, DDD ↔ ESTADO, CEP ↔ CIDADE. Um sistema antifraude que compara nome do cartão vs nome do CPF via base externa (SPC/Serasa) vai retornar not-found, o que é esperado em ambiente de teste." },
              { q: "Serve pra teste com antifraude (Konduto/ClearSale)?", a: "Serve pra teste FUNCIONAL - garante que o payload é aceito no formato certo e passa validações de estrutura. Não serve pra teste de score de risco real, porque antifraude cruza com bases externas onde os dados sintéticos não existem. Use os dados de teste oficiais fornecidos por cada antifraude no sandbox deles pra isso." },
              { q: "Preciso cadastrar conta pra usar preset customer?", a: "Não. Preset customer é gratuito na API pública, 50 chamadas/dia sem cadastro (rate limit por IP). Cadastro dá 50 chamadas/dia por API key + preset customer via schema builder no dashboard." },
              { q: "Como escolher o estado do endereço?", a: "O preset customer distribui aleatoriamente entre 10 estados brasileiros cobertos (SP, RJ, MG, RS, PR, BA, SC, GO, PE, CE). Pra forçar um estado específico use schema builder com field 'address.state' fixado - documentação em /docs." },
              { q: "Cada chamada devolve customers diferentes?", a: "Sim. Cada chamada é aleatória - 2 chamadas seguidas com quantity=100 dão 200 customers únicos. Pra reproduzir a mesma sequência em CI, salve o resultado da 1a chamada como fixture versionada." },
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
            <Link href="/gerador-pessoa" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">Gerador de Pessoa completa</Link>
            <Link href="/gerador-cpf" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">CPF válido (mod-11)</Link>
            <Link href="/gerador-pix" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">Chave PIX BACEN</Link>
            <Link href="/docs" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">Docs presets</Link>
          </div>
        </section>
      </div>

      <GeneratorSchema
        name="Cartão de Crédito + CPF Correlacionado"
        url="https://fakeforge.com.br/gerar-cartao-com-cpf"
        description="Preset customer da API do FakeForge devolve cartão de crédito + CPF + email + telefone + endereço correlacionados em 1 chamada. Ideal para mock de checkout brasileiro completo."
        features={[
          "Cartão Luhn válido + CPF mod-11 válido no mesmo objeto",
          "Correlação nome ↔ email, DDD ↔ estado, CEP ↔ cidade",
          "Endpoint /api/generate?preset=customer&quantity=100",
          "Formato JSON, CSV ou SQL para seed direto",
          "Também disponível: preset employee, company, ecommerce_order",
          "Free tier: 50 chamadas/dia sem cadastro",
        ]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "O CPF gerado é da mesma pessoa do cartão?", acceptedAnswer: { "@type": "Answer", text: "O CPF tem mod-11 válido e o nome é gerado independentemente - ambos são fictícios. A correlação garantida é NOME ↔ EMAIL, DDD ↔ ESTADO, CEP ↔ CIDADE." } },
              { "@type": "Question", name: "Serve pra teste com antifraude?", acceptedAnswer: { "@type": "Answer", text: "Serve pra teste funcional - payload aceito no formato certo. Não serve pra teste de score de risco real, porque antifraude cruza com bases externas onde dados sintéticos não existem." } },
              { "@type": "Question", name: "Preciso cadastrar conta pra usar preset customer?", acceptedAnswer: { "@type": "Answer", text: "Não. Preset customer é gratuito na API pública, 50 chamadas/dia sem cadastro. Cadastro dá 50 chamadas/dia por API key + schema builder no dashboard." } },
              { "@type": "Question", name: "Como escolher o estado do endereço?", acceptedAnswer: { "@type": "Answer", text: "Preset customer distribui aleatoriamente entre 10 estados cobertos. Pra forçar um estado use schema builder com field address.state fixado." } },
              { "@type": "Question", name: "Cada chamada devolve customers diferentes?", acceptedAnswer: { "@type": "Answer", text: "Sim. Cada chamada é aleatória. Pra reproduzir em CI, salve o resultado da 1a chamada como fixture versionada." } },
            ],
          }),
        }}
      />
    </PageShell>
  );
}
