import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import GeneratorSchema from "@/components/GeneratorSchema";
import DevOnlyDisclaimer from "@/components/DevOnlyDisclaimer";

export const metadata: Metadata = {
  title: "Cartão Teste Stripe: Fake vs Cartão Oficial do Gateway",
  description: "Diferença entre cartões de teste oficiais do Stripe (fixos) e cartões fake gerados (Luhn válido, quantidade infinita). Snippet Node.js, 3D Secure e antifraude.",
  keywords: "cartão de credito teste stripe, cartao teste stripe, stripe test card brasil, stripe sandbox cartão, cartão fake stripe, cartão para testar checkout stripe, cartão teste mercado pago, cartão sandbox pagseguro, cartão teste cielo, dados teste stripe brasil",
  alternates: { canonical: "/cartao-credito-teste-stripe" },
  openGraph: {
    title: "Cartão de Crédito Teste Stripe vs Fake - Quando Usar Cada",
    description: "Quando escolher os 4242 4242... oficiais do Stripe vs gerar cartões fake em massa. Snippets Node.js pra ambos os casos.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function CartaoCreditoTesteStripe() {
  return (
    <PageShell>
      <div className="mb-6">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Cartões de teste + gerador sintético</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Cartão de Crédito <span className="text-primary">Teste Stripe</span> (e Mercado Pago, PagSeguro, Cielo)
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Testar integração com gateway envolve 2 tipos de cartão: os cartões oficiais publicados pelo PSP
          (fixos, disparam cenários específicos como approved / declined) e os cartões sintéticos gerados em massa
          (variados, servem pra validação front-end e seed de banco). Abaixo o gerador sintético + tabela de
          quando usar cada tipo.
        </p>
      </div>

      <DevOnlyDisclaimer dataType="cartão de crédito" className="mb-6" />

      <SingleGenerator
        type="creditCard"
        label="Cartão sintético"
        description="Pra testar validador front-end ou popular banco de desenvolvimento. Pra sandbox de gateway, use os cartões oficiais listados abaixo."
      />

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Cartão de Teste Stripe", url: "/cartao-credito-teste-stripe" },
      ]} />

      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Quando usar cartão oficial do PSP</h2>
          <p>
            Use os cartões de teste publicados pelo gateway quando você precisa <strong>testar o fluxo dentro
            do sandbox do PSP</strong>: 3D Secure, cenários de decline, insufficient funds, expired card, ou
            resposta de antifraude. Cada PSP tem sua lista curada:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 mt-3">
            <li><strong className="text-foreground">Stripe:</strong> <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded font-mono">4242 4242 4242 4242</code> (approved), <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded font-mono">4000 0000 0000 0002</code> (declined), <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded font-mono">4000 0025 0000 3155</code> (3DS required)</li>
            <li><strong className="text-foreground">Mercado Pago:</strong> <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded font-mono">5031 4332 1540 6351</code> (approved Master), CVV 123, expiry qualquer futura</li>
            <li><strong className="text-foreground">Pagar.me:</strong> <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded font-mono">4000 0000 0000 0010</code> (approved), <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded font-mono">4000 0000 0000 0002</code> (refused)</li>
            <li><strong className="text-foreground">Cielo:</strong> <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded font-mono">0000 0000 0000 0001</code> (approved), disponível na doc oficial do e-Commerce Cielo</li>
          </ul>
          <p className="mt-3">
            Consulte a documentação oficial de cada gateway - a lista muda com o tempo e pode variar por
            conta. Cartão oficial só funciona no <em>sandbox</em> do PSP correspondente, não em produção.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Quando usar cartão fake gerado</h2>
          <p>
            Use cartão fake (o que o FakeForge gera) quando você precisa de <strong>variedade e volume</strong>:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 mt-3">
            <li>Popular banco de staging com 1.000 cartões diferentes pra ter dado realista no dashboard</li>
            <li>Testar máscara de input aceitando 5 bandeiras diferentes (Visa, Master, Elo, Hipercard, Amex)</li>
            <li>Fixtures de teste unitário/integração ANTES da chamada ao gateway</li>
            <li>Stress-test de validador front-end com N combinações</li>
            <li>Popular sistema antifraude interno com dado sintético</li>
          </ul>
          <p className="mt-3">
            Cartão fake não vai passar em sandbox de PSP - ele serve pras camadas anteriores (front-end,
            validação, banco, cache, filas). A tabela abaixo consolida a decisão.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Tabela de decisão</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-3 py-2 text-muted-foreground font-medium">Caso de uso</th>
                  <th className="text-left px-3 py-2 text-muted-foreground font-medium">Use isto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-3 py-2">Testar fluxo dentro do sandbox Stripe/Mercado Pago</td>
                  <td className="px-3 py-2 text-foreground">Cartão oficial do PSP</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">Testar validador de cartão no formulário (React/Vue)</td>
                  <td className="px-3 py-2 text-foreground">Cartão fake do FakeForge</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">Seed de banco com 1.000 customers pra staging</td>
                  <td className="px-3 py-2 text-foreground">Cartão fake do FakeForge (preset customer)</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">Testar 3D Secure / autenticação forte</td>
                  <td className="px-3 py-2 text-foreground">Cartão oficial do PSP</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">Verificar máscara de input por bandeira</td>
                  <td className="px-3 py-2 text-foreground">Cartão fake do FakeForge</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">Popular dashboard de admin com histórico de transações</td>
                  <td className="px-3 py-2 text-foreground">Cartão fake do FakeForge</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">Testar antifraude interno (regras próprias)</td>
                  <td className="px-3 py-2 text-foreground">Cartão fake do FakeForge (preset customer)</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">Testar retentativa após decline</td>
                  <td className="px-3 py-2 text-foreground">Cartão oficial do PSP (decline específico)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Node.js - preencher formulário com fake antes de trocar por oficial</h2>
          <pre className="bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`// Playwright / Cypress - preenche formulário com cartão fake
// pra testar validador front, DEPOIS submete com cartão oficial pro sandbox

test("checkout aceita cartão válido", async ({ page }) => {
  // Fase 1: valida front com cartão fake gerado
  const fakeCard = await fetch(
    "https://fakeforge.com.br/api/generate?type=creditCard&quantity=1"
  ).then(r => r.json()).then(r => r.data[0]);

  await page.fill("#card-number", fakeCard.number);
  await page.fill("#cvv", fakeCard.cvv);
  await page.fill("#expiry", fakeCard.expiry);
  await expect(page.locator(".card-valid-check")).toBeVisible();

  // Fase 2: troca por cartão oficial do Stripe pra passar no sandbox
  await page.fill("#card-number", "4242 4242 4242 4242");
  await page.click("#submit");
  await expect(page).toHaveURL(/thank-you/);
});`}</code></pre>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Perguntas Frequentes</h2>
          <div className="space-y-3">
            {[
              { q: "Posso usar cartão fake do FakeForge no Stripe test mode?", a: "Não. Stripe test mode aceita apenas os cartões oficiais publicados na documentação (4242..., 4000...). Cartão fake do FakeForge é gerado com Luhn válido mas Stripe rejeita porque o número não está na tabela deles. Use cartão fake pras camadas anteriores (validador front, banco de staging, mock)." },
              { q: "Cartão fake ativa cenário de 3DS?", a: "Não. 3DS é acionado por regras do PSP e do issuer. Só cartões oficiais do sandbox do PSP (ex: 4000 0025 0000 3155 no Stripe) disparam o fluxo 3DS de teste. Cartão fake não atinge esse layer." },
              { q: "Preciso de 2 tipos de cartão no meu CI?", a: "Sim, geralmente. Testes unitários e integração front-end usam cartão fake (rápido, variado). Testes end-to-end que batem no sandbox do PSP usam cartão oficial do gateway. Ferramentas como Playwright rodam os 2 tipos em fases diferentes." },
              { q: "O FakeForge tem lista dos cartões oficiais de cada PSP?", a: "Nesta página listamos os principais. A lista definitiva sempre é a documentação oficial de cada gateway (Stripe, Mercado Pago, Pagar.me, Cielo, PagSeguro, Getnet). Elas mudam e podem variar por conta." },
              { q: "Cartão do FakeForge funciona no PagSeguro sandbox?", a: "Não. Mesma regra do Stripe: PagSeguro sandbox só aceita os cartões de teste que eles publicam. Cartão fake do FakeForge serve pra tudo que vem ANTES da chamada ao PagSeguro." },
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
            <Link href="/cartao-credito-fake" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">Cartão fake explicado</Link>
            <Link href="/cartao-credito-valido" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">Algoritmo Luhn</Link>
            <Link href="/gerar-cartao-com-cpf" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">Cartão + CPF correlacionado</Link>
            <Link href="/blog/cartao-credito-falso-testes-fake-teste-sandbox" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">Artigo: fake vs sandbox</Link>
          </div>
        </section>
      </div>

      <GeneratorSchema
        name="Cartão de Crédito Teste (Stripe / Mercado Pago / PagSeguro)"
        url="https://fakeforge.com.br/cartao-credito-teste-stripe"
        description="Guia de decisão entre cartão de teste oficial de PSP (Stripe, Mercado Pago, Pagar.me, Cielo) e cartão fake gerado pra testes de front-end, seed de banco e QA. Inclui tabela de decisão + snippets Node.js."
        features={[
          "Tabela de decisão fake vs cartão oficial",
          "Lista de cartões oficiais Stripe / MP / Pagar.me / Cielo",
          "Snippet Playwright/Cypress em Node.js",
          "Explicação de quando 3DS dispara",
          "5 bandeiras geradas: Visa, Mastercard, Elo, Hipercard, Amex",
          "Free tier 50 chamadas/dia sem cadastro",
        ]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Posso usar cartão fake do FakeForge no Stripe test mode?", acceptedAnswer: { "@type": "Answer", text: "Não. Stripe test mode aceita apenas os cartões oficiais publicados na documentação (4242..., 4000...). Cartão fake é gerado com Luhn válido mas Stripe rejeita porque o número não está na tabela deles." } },
              { "@type": "Question", name: "Cartão fake ativa cenário de 3DS?", acceptedAnswer: { "@type": "Answer", text: "Não. 3DS é acionado por regras do PSP e do issuer. Só cartões oficiais do sandbox do PSP disparam o fluxo 3DS de teste." } },
              { "@type": "Question", name: "Preciso de 2 tipos de cartão no meu CI?", acceptedAnswer: { "@type": "Answer", text: "Sim. Testes unitários e integração front-end usam cartão fake (rápido, variado). Testes end-to-end que batem no sandbox usam cartão oficial do gateway." } },
              { "@type": "Question", name: "O FakeForge tem lista dos cartões oficiais de cada PSP?", acceptedAnswer: { "@type": "Answer", text: "Nesta página listamos os principais. A lista definitiva sempre é a documentação oficial de cada gateway." } },
              { "@type": "Question", name: "Cartão do FakeForge funciona no PagSeguro sandbox?", acceptedAnswer: { "@type": "Answer", text: "Não. PagSeguro sandbox só aceita os cartões de teste que eles publicam. Cartão fake serve pra tudo que vem antes da chamada ao PagSeguro." } },
            ],
          }),
        }}
      />
    </PageShell>
  );
}
