import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import GeneratorSchema from "@/components/GeneratorSchema";

export const metadata: Metadata = {
  title: "Cartão de Crédito Válido: Algoritmo Luhn (mod-10) Passo a Passo",
  description: "Cartão de crédito válido = passa no algoritmo Luhn (mod-10) usado pela indústria de pagamentos desde 1954. Explicação completa do checksum, exemplos matemáticos e gerador que aplica Luhn corretamente para todas as bandeiras.",
  keywords: "cartão de credito valido, cartão de crédito válido, cartao de credito numeros validos, numero de cartao de credito valido, numeros de cartao valido, cartão válido teste, luhn, algoritmo luhn, mod 10, cartao valido gerador, gerador cartao credito valido, cartao valido para netflix teste",
  alternates: { canonical: "/cartao-credito-valido" },
  openGraph: {
    title: "Cartão de Crédito Válido - Algoritmo Luhn Explicado",
    description: "Como funciona o mod-10 usado por Visa, Mastercard e Elo. Gerador que aplica Luhn corretamente + exemplo passo a passo do cálculo.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function CartaoCreditoValido() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Cartão fictício + explicação técnica</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Cartão de <span className="text-primary">Crédito Válido</span> (Luhn / mod-10)
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Cartão válido significa que passa no algoritmo Luhn (mod-10), o checksum criado por Hans
          Peter Luhn em 1954 na IBM e adotado pela ISO 7812 pra numeração de cartões. Todo cartão
          gerado pelo FakeForge tem o último dígito calculado corretamente. Abaixo, o gerador +
          explicação passo a passo do algoritmo.
        </p>
      </div>

      <SingleGenerator
        type="creditCard"
        label="Cartão Válido"
        description="Todo cartão gerado tem checksum Luhn correto e passa validador de qualquer front-end"
      />

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Cartão de Crédito Válido", url: "/cartao-credito-valido" },
      ]} />

      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">O que torna um cartão &quot;válido&quot;</h2>
          <p>
            Um número de cartão é <strong>válido</strong> quando o último dígito (dígito verificador ou
            check digit) é o resultado correto do algoritmo Luhn aplicado aos 15 dígitos anteriores
            (ou 14, no caso de Amex de 15 dígitos totais). Se você digitar 1 dígito errado no meio do
            número, o Luhn detecta. Se trocar 2 dígitos adjacentes, também detecta. Por isso ele é usado
            no mundo todo pra validar entrada de cartão no front-end antes de mandar pro gateway.
          </p>
          <p className="mt-2">
            Válido <strong>não significa emitido</strong>. Ninguém precisou aprovar o cartão pra ele ser
            válido matematicamente - qualquer sequência de 16 dígitos onde o último bate com o cálculo é
            válida. Só emissores (Visa, Master, Elo) sabem quais desses números foram realmente atribuídos
            a titulares reais.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Algoritmo Luhn passo a passo</h2>
          <p className="mb-3">
            Pra validar o cartão <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded font-mono">4485 1234 5678 9012</code>:
          </p>
          <ol className="list-decimal list-inside space-y-2 pl-2">
            <li><strong className="text-foreground">Da direita pra esquerda</strong>, dobra cada dígito em posição par (segundo, quarto, sexto...).</li>
            <li>Se o resultado da multiplicação passar de 9, soma os dígitos (ex: 8 × 2 = 16 → 1 + 6 = 7).</li>
            <li>Soma todos os dígitos (os que foram dobrados + os que não foram).</li>
            <li>Se o total for múltiplo de 10, o cartão é válido. Se não, é inválido.</li>
          </ol>
          <p className="mt-3">
            Pra <strong>gerar</strong> um cartão válido (o que o FakeForge faz), você calcula tudo isso menos o último dígito, depois escolhe o último dígito que faz o total virar múltiplo de 10.
            Detalhes completos com implementação em JavaScript no <Link href="/algoritmo-luhn" className="text-primary hover:underline font-medium">artigo Algoritmo Luhn</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Implementação em JavaScript</h2>
          <pre className="bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`function isValidLuhn(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\\D/g, "").split("").map(Number);
  let sum = 0;
  let shouldDouble = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = digits[i];
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

// Testar com cartão gerado pelo FakeForge
isValidLuhn("4485 1234 5678 9012"); // true ou false
`}</code></pre>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Prefixos BIN por bandeira</h2>
          <p>
            Antes de validar Luhn, o front-end costuma identificar a bandeira pelo prefixo (BIN - Bank
            Identification Number). O FakeForge respeita esses prefixos ao gerar:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-3 pl-2">
            <li><strong className="text-foreground">Visa:</strong> começa com 4 (13, 16 ou 19 dígitos)</li>
            <li><strong className="text-foreground">Mastercard:</strong> 51-55 ou 2221-2720 (16 dígitos)</li>
            <li><strong className="text-foreground">Elo:</strong> prefixos específicos como 636368, 438935, 504175, 451416, 509046 (16 dígitos)</li>
            <li><strong className="text-foreground">Hipercard:</strong> 606282 (16 dígitos)</li>
            <li><strong className="text-foreground">Amex:</strong> 34 ou 37 (15 dígitos, CVV de 4)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Perguntas Frequentes</h2>
          <div className="space-y-3">
            {[
              { q: "Cartão válido é diferente de cartão fake?", a: "Não. Todo cartão gerado por ferramentas de teste sérias (incluindo o FakeForge) é ao mesmo tempo válido (passa Luhn) e fake (não vinculado a conta real). Cartão sem Luhn é 'aleatório' e falha na primeira validação de front-end." },
              { q: "Cartão gerado passa no BIN Check?", a: "Sim pro BIN em si (prefixo da bandeira). Não pra API de BIN lookup que consulta emissor real - essas APIs sabem quais faixas de BIN foram emitidas pra quais bancos. Um cartão fake com prefixo 4485 pode não corresponder a nenhum banco existente pra esse BIN." },
              { q: "Luhn é a única validação de cartão?", a: "É a primeira. Depois vem verificação de bandeira (BIN), formato (dígitos por bandeira), CVV, expiry date, e finalmente o call ao gateway que checa se o número existe + tem saldo + passa 3DS. O FakeForge cobre as 4 primeiras camadas." },
              { q: "Cartão válido pra Netflix teste?", a: "Serviços que checam apenas Luhn no front vão aceitar o cartão gerado. Serviços que fazem pré-autorização (bloqueio de R$1 ou similar) vão rejeitar porque o número não corresponde a conta real. Netflix faz pré-auth, então não passa - use o teste gratuito oficial." },
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
            <Link href="/gerar-cartao-credito" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">Snippets Node/Python/PHP</Link>
            <Link href="/algoritmo-luhn" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">Algoritmo Luhn (calculadora)</Link>
          </div>
        </section>
      </div>

      <GeneratorSchema
        name="Cartão de Crédito Válido (Luhn)"
        url="https://fakeforge.com.br/cartao-credito-valido"
        description="Gera cartão de crédito válido segundo o algoritmo Luhn (mod-10). Inclui explicação passo a passo do cálculo, implementação em JavaScript e tabela de prefixos BIN por bandeira."
        features={[
          "Todo cartão passa validação Luhn (mod-10)",
          "Prefixos BIN corretos por bandeira",
          "Explicação passo a passo do algoritmo",
          "Implementação de referência em JavaScript",
          "Cobre Visa, Mastercard, Elo, Hipercard e Amex",
          "5 bandeiras + CVV + expiry inclusos",
        ]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Cartão válido é diferente de cartão fake?", acceptedAnswer: { "@type": "Answer", text: "Não. Todo cartão gerado por ferramentas de teste sérias é ao mesmo tempo válido (passa Luhn) e fake (não vinculado a conta real). Cartão sem Luhn é aleatório e falha na primeira validação de front-end." } },
              { "@type": "Question", name: "Cartão gerado passa no BIN Check?", acceptedAnswer: { "@type": "Answer", text: "Sim pro BIN em si (prefixo da bandeira). Não pra API de BIN lookup que consulta emissor real - essas sabem quais faixas de BIN foram emitidas pra quais bancos." } },
              { "@type": "Question", name: "Luhn é a única validação de cartão?", acceptedAnswer: { "@type": "Answer", text: "É a primeira. Depois vem verificação de bandeira (BIN), formato, CVV, expiry date, e finalmente o call ao gateway que checa se o número existe + tem saldo + passa 3DS." } },
              { "@type": "Question", name: "Cartão válido pra Netflix teste?", acceptedAnswer: { "@type": "Answer", text: "Serviços que checam apenas Luhn no front vão aceitar. Serviços que fazem pré-autorização (bloqueio de R$1) vão rejeitar porque o número não corresponde a conta real. Netflix faz pré-auth, então não passa." } },
            ],
          }),
        }}
      />
    </PageShell>
  );
}
