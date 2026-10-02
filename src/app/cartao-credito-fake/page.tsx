import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import GeneratorSchema from "@/components/GeneratorSchema";
import DevOnlyDisclaimer from "@/components/DevOnlyDisclaimer";

export const metadata: Metadata = {
  title: "Cartão de Crédito Fake: Visa, Mastercard, Elo (Luhn)",
  description: "Gere cartão de crédito fake com Luhn válido (mod-10). Visa, Mastercard, Elo, Hipercard e Amex. Para testes de checkout e sandbox. Grátis, sem cadastro.",
  keywords: "cartao de credito fake, cartão de crédito fake, cartão fake, cartão falso, cartão fictício, cartão de crédito falso, cartão fake teste, cartão fake grátis, gerar cartão fake, cartão de crédito fake válido, cartao fake luhn, cartão para testes de checkout, cartão sintético para desenvolvimento",
  alternates: { canonical: "/cartao-credito-fake" },
  openGraph: {
    title: "Cartão de Crédito Fake com Luhn Válido para Testes",
    description: "Números fake que passam validação matemática, para testar checkout sem tocar em cartão real. Visa, Mastercard, Elo, Hipercard, Amex.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function CartaoCreditoFake() {
  return (
    <PageShell>
      <div className="mb-6">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Ferramenta para desenvolvedores</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Cartão de <span className="text-primary">Crédito Fake</span> para Testes
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Números sintéticos que passam a validação matemática (Luhn / mod-10) mas não estão
          vinculados a nenhuma conta bancária. Use pra testar formulários de checkout, integração
          com gateway, validador front-end e fixtures de QA. Não funcionam em compra real
          porque não existem no sistema financeiro.
        </p>
      </div>

      <DevOnlyDisclaimer dataType="cartão de crédito" className="mb-6" />

      <SingleGenerator
        type="creditCard"
        label="Cartão Fake"
        description="Clique em Gerar - Visa, Mastercard, Elo, Hipercard ou Amex aleatório"
      />

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Cartão de Crédito Fake", url: "/cartao-credito-fake" },
      ]} />

      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Fake não é o mesmo que inválido</h2>
          <p>
            Cartão fake gerado pelo FakeForge é <strong>matematicamente válido</strong>: o último dígito é
            calculado corretamente pelo algoritmo Luhn (mod-10), então o número passa em qualquer validador
            front-end (React, Vue, formulário HTML) e nas checagens iniciais do gateway. O que ele NÃO tem
            é vínculo com conta bancária real - por isso é seguro.
          </p>
          <p className="mt-2">
            Cartão &quot;aleatório&quot; sem cálculo de Luhn (ex: <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded font-mono">4111 1111 1111 1112</code>) falha na primeira validação e desperdiça
            tempo em fixtures que quebram no CI. Use sempre um gerador que calcula o checksum.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Por que dev BR usa &quot;fake&quot; e não &quot;teste&quot;</h2>
          <p>
            &quot;Cartão de teste&quot; costuma se referir aos números oficiais que gateways como Stripe, Mercado
            Pago e Pagar.me publicam no sandbox (ex: <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded font-mono">4242 4242 4242 4242</code> pra Stripe). Esses são fixos, poucos e
            sinalizam cenários específicos (approved, declined, insufficient funds).
          </p>
          <p className="mt-2">
            &quot;Cartão fake&quot; é o jargão pra números aleatórios gerados na hora com Luhn válido - <strong>quantidade infinita e
            variedade de bandeira</strong>. Servem pra popular banco de staging com 500 cartões diferentes,
            testar máscaras de formatação por bandeira, ou stress-test de formulário com N combinações.
            Os dois casos coexistem no fluxo de desenvolvimento.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Uso em massa via API</h2>
          <p className="mb-3">
            Pra gerar 100 cartões fake de uma vez:
          </p>
          <pre className="bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`curl "https://fakeforge.com.br/api/generate?type=creditCard&quantity=100"

# Só uma bandeira
curl "https://fakeforge.com.br/api/generate?type=creditCard&brand=visa&quantity=50"`}</code></pre>
          <p className="mt-3">
            Grátis: 50 chamadas/dia sem cadastro, até 100 items por chamada. Plano <Link href="/pricing?plan=dev&ref=cartao_fake" className="text-primary hover:underline">Dev (R$29/mês)</Link> libera 10.000 chamadas/dia e 10.000 items por chamada.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Perguntas Frequentes</h2>
          <div className="space-y-3">
            {[
              { q: "Cartão fake é crime?", a: "Não. Gerar números que passam validação matemática pra fins de teste é prática padrão em desenvolvimento. O que é crime é usar cartão (fake ou real) pra fraudar compra ou obter benefício - independente da origem do número." },
              { q: "O cartão fake tem CVV real?", a: "O CVV é gerado como número aleatório de 3 dígitos (4 pra Amex). Não corresponde a nenhum CVV emitido por banco real - é fictício assim como o número principal." },
              { q: "Posso usar em sandbox do Stripe / Mercado Pago?", a: "Não. Sandboxes de gateway aceitam apenas os cartões de teste oficiais que eles publicam. O cartão fake gerado aqui serve pra teste de front-end, validação de formulário, seed de banco - fluxos ANTES da chamada ao gateway." },
              { q: "Cartão fake e cartão fictício são a mesma coisa?", a: "Sim. Fake, fictício, falso, teste - são termos usados como sinônimos pra número de cartão gerado que passa Luhn mas não existe como conta real." },
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
            <Link href="/gerar-cartao-credito" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">Gerar cartão de crédito</Link>
            <Link href="/cartao-credito-valido" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">Cartão válido (Luhn)</Link>
            <Link href="/gerar-cartao-com-cpf" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">Cartão + CPF correlacionado</Link>
            <Link href="/algoritmo-luhn" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">Algoritmo Luhn explicado</Link>
          </div>
        </section>
      </div>

      <GeneratorSchema
        name="Cartão de Crédito Fake"
        url="https://fakeforge.com.br/cartao-credito-fake"
        description="Gere números de cartão de crédito fake que passam validação Luhn (mod-10). Visa, Mastercard, Elo, Hipercard e Amex. Para testes de front-end, staging e fixtures de QA."
        features={[
          "5 bandeiras: Visa, Mastercard, Elo, Hipercard, Amex",
          "Passa validação Luhn (mod-10)",
          "CVV e data de validade fictícios inclusos",
          "50 chamadas/dia grátis na API sem cadastro",
          "Geração em lote via /api/generate?type=creditCard",
          "Cartões descartados após geração - nada armazenado",
        ]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Cartão fake é crime?", acceptedAnswer: { "@type": "Answer", text: "Não. Gerar números que passam validação matemática pra fins de teste é prática padrão em desenvolvimento. O que é crime é usar cartão (fake ou real) pra fraudar compra ou obter benefício - independente da origem do número." } },
              { "@type": "Question", name: "O cartão fake tem CVV real?", acceptedAnswer: { "@type": "Answer", text: "O CVV é gerado como número aleatório de 3 dígitos (4 pra Amex). Não corresponde a nenhum CVV emitido por banco real - é fictício assim como o número principal." } },
              { "@type": "Question", name: "Posso usar em sandbox do Stripe / Mercado Pago?", acceptedAnswer: { "@type": "Answer", text: "Não. Sandboxes de gateway aceitam apenas os cartões de teste oficiais que eles publicam. O cartão fake gerado aqui serve pra teste de front-end, validação de formulário, seed de banco - fluxos ANTES da chamada ao gateway." } },
              { "@type": "Question", name: "Cartão fake e cartão fictício são a mesma coisa?", acceptedAnswer: { "@type": "Answer", text: "Sim. Fake, fictício, falso, teste - são termos usados como sinônimos pra número de cartão gerado que passa Luhn mas não existe como conta real." } },
            ],
          }),
        }}
      />
    </PageShell>
  );
}
