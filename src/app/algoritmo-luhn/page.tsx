import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import LuhnCalculator from "./LuhnCalculator";

export const metadata: Metadata = {
  title: "Algoritmo de Luhn: Como Funciona (JS + Python)",
  description: "Tutorial completo do algoritmo de Luhn (mod-10): origem, passo a passo com exemplo numérico, implementação em TypeScript e Python, e calculadora interativa pra validar qualquer número de cartão.",
  keywords: "algoritmo luhn, algoritmo de luhn, mod 10, validacao cartao credito, luhn javascript, luhn typescript, luhn python, como funciona luhn, hans peter luhn, validar cartao algoritmo, checksum cartao credito",
  openGraph: {
    title: "Algoritmo de Luhn: como funciona e implementação",
    description: "Tutorial passo a passo do mod-10 com exemplo numérico, código TS/Python e calculadora interativa.",
    type: "article",
    images: ["/api/og?title=Algoritmo+de+Luhn&subtitle=Como+funciona+o+mod-10+que+valida+cart%C3%B5es+de+cr%C3%A9dito&category=TUTORIAIS"],
  },
  alternates: { canonical: "/algoritmo-luhn" },
};

export default function AlgoritmoLuhn() {
  return (
    <PageShell>
      <article className="max-w-3xl">
        <Link href="/" className="text-xs text-primary hover:underline mb-4 inline-block">
          ← Voltar
        </Link>

        <div className="mb-8">
          <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-primary mb-2">
            Tutorial · 12 min de leitura
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
            Algoritmo de Luhn: como funciona e como implementar
          </h1>
          <p className="text-muted mt-3 text-sm sm:text-base leading-relaxed">
            O algoritmo de Luhn (também chamado mod-10) é o checksum que valida números de cartão de
            crédito antes de qualquer chamada ao gateway. Esse guia explica o algoritmo do zero, mostra
            um exemplo numérico passo a passo, traz implementação em TypeScript e Python, e tem uma
            calculadora interativa pra testar qualquer número.
          </p>
        </div>

        <nav className="mb-8 rounded-xl bg-card border border-border p-4" aria-label="Sumário">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-2">Sumário</p>
          <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
            <li><a href="#o-que-e" className="hover:text-primary">O que é o algoritmo de Luhn</a></li>
            <li><a href="#passo-a-passo" className="hover:text-primary">Passo a passo com exemplo numérico</a></li>
            <li><a href="#calculadora" className="hover:text-primary">Calculadora interativa</a></li>
            <li><a href="#typescript" className="hover:text-primary">Implementação em TypeScript</a></li>
            <li><a href="#python" className="hover:text-primary">Implementação em Python</a></li>
            <li><a href="#o-que-luhn-nao-faz" className="hover:text-primary">O que o Luhn não faz</a></li>
            <li><a href="#bandeiras" className="hover:text-primary">BINs por bandeira</a></li>
            <li><a href="#faq" className="hover:text-primary">Perguntas frequentes</a></li>
          </ol>
        </nav>

        <div className="prose-custom space-y-2 text-sm text-muted-foreground leading-relaxed">
          <section id="o-que-e">
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">O que é o algoritmo de Luhn</h2>
            <p className="mb-4">
              O algoritmo de Luhn é uma fórmula simples de checksum criada pelo engenheiro Hans Peter
              Luhn, da IBM, em 1954. Ele verifica se um número longo (cartão de crédito, IMEI, CPF/CNPJ
              tem variante similar) está sintaticamente correto. Não verifica fraude, não verifica se o
              cartão existe, não verifica saldo. Verifica se os dígitos batem com o dígito verificador
              que foi calculado no momento da emissão.
            </p>
            <p className="mb-4">
              A ideia é simples: o último dígito do número é um <strong className="text-foreground">dígito verificador</strong>{" "}
              que existe pra fazer o número inteiro passar numa soma específica. Se você muda qualquer
              dígito, a soma quebra. Se você inverte dois adjacentes (exceto 09 ↔ 90), a soma quebra.
              Isso pega ~90% dos erros de digitação antes de chegar no gateway.
            </p>
            <p className="mb-4">
              Toda bandeira de cartão (Visa, Mastercard, Elo, Hipercard, Amex) usa Luhn. Padronizado
              pela ISO/IEC 7812. Por isso o mesmo algoritmo funciona pra qualquer cartão de 13 a 19
              dígitos. Comprimento e prefixo (BIN) é que diferenciam as bandeiras — mas a validação do
              checksum é universal.
            </p>
          </section>

          <section id="passo-a-passo">
            <h2 className="text-xl font-semibold text-foreground mt-10 mb-3">Passo a passo com exemplo numérico</h2>
            <p className="mb-4">
              Vou usar o número <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">4532 0151 1283 0366</code>{" "}
              (um Visa fictício) e mostrar cada passo:
            </p>
            <ol className="list-decimal list-inside space-y-3 pl-2 mt-3 mb-4">
              <li>
                <strong className="text-foreground">Comece da direita pra esquerda</strong>, ignorando
                o último dígito (o verificador). Os outros dígitos serão processados em pares: posição
                par (do fim) é multiplicada por 2, posição ímpar fica como está.
              </li>
              <li>
                <strong className="text-foreground">Multiplique por 2 cada segundo dígito</strong>{" "}
                contando da direita. Se o resultado passar de 9, subtraia 9 (ou some os dois dígitos
                — dá no mesmo).
              </li>
              <li>
                <strong className="text-foreground">Some todos os dígitos</strong> (modificados +
                inalterados + verificador).
              </li>
              <li>
                <strong className="text-foreground">Se a soma for divisível por 10</strong>, o número
                é válido. Se sobrar 1, 2, 3..., é inválido.
              </li>
            </ol>

            <p className="mb-2">Aplicando ao <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">4532015112830366</code>:</p>

            <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto leading-relaxed mb-4">{`Posição:    1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16
Dígito:     4  5  3  2  0  1  5  1  1  2  8  3  0  3  6  6
                                                              ← último = verificador (6)
Da direita:
  pos 16: 6 (verificador, soma direta no final)
  pos 15: 6  →  ×2 = 12 → 1+2 = 3
  pos 14: 3 (soma direta)
  pos 13: 0  →  ×2 = 0
  pos 12: 3 (soma direta)
  pos 11: 8  →  ×2 = 16 → 1+6 = 7
  pos 10: 2 (soma direta)
  pos 9:  1  →  ×2 = 2
  pos 8:  1 (soma direta)
  pos 7:  5  →  ×2 = 10 → 1+0 = 1
  pos 6:  1 (soma direta)
  pos 5:  0  →  ×2 = 0
  pos 4:  2 (soma direta)
  pos 3:  3  →  ×2 = 6
  pos 2:  5 (soma direta)
  pos 1:  4  →  ×2 = 8

Soma = 6 + 3 + 3 + 0 + 3 + 7 + 2 + 2 + 1 + 1 + 1 + 0 + 0 + 2 + 6 + 5 + 8
     = 50

50 mod 10 = 0  →  VÁLIDO ✓`}</pre>

            <p className="mb-4">
              Se você muda qualquer dígito (digamos, o último 6 vira 7), a soma vira 51, que não é
              divisível por 10, e o número é rejeitado.
            </p>
          </section>

          <section id="calculadora">
            <h2 className="text-xl font-semibold text-foreground mt-10 mb-3">Calculadora interativa</h2>
            <p className="mb-4">
              Digite qualquer número de cartão pra ver se passa no Luhn. Funciona pra Visa, Mastercard,
              Elo, Amex, Hipercard, Diners e qualquer cartão de 13 a 19 dígitos.
            </p>
            <LuhnCalculator />
          </section>

          <section id="typescript">
            <h2 className="text-xl font-semibold text-foreground mt-10 mb-3">Implementação em TypeScript</h2>
            <p className="mb-3">
              Função pura, sem dependências, ~15 linhas:
            </p>
            <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto leading-relaxed mb-4">{`export function luhnCheck(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\\D/g, "");
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i]);
    if (shouldDouble) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

// Uso:
luhnCheck("4532 0151 1283 0366"); // true
luhnCheck("4532 0151 1283 0367"); // false`}</pre>
            <p className="mb-4">
              Notas: o <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">replace(/\D/g, &quot;&quot;)</code>{" "}
              remove espaços, hífens e qualquer não-dígito (o usuário pode digitar com ou sem
              formatação). O range 13-19 cobre Visa Electron (13), maioria das bandeiras (16),
              Amex (15) e cartões UnionPay (até 19).
            </p>
          </section>

          <section id="python">
            <h2 className="text-xl font-semibold text-foreground mt-10 mb-3">Implementação em Python</h2>
            <p className="mb-3">
              Versão equivalente em Python, também sem dependências:
            </p>
            <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto leading-relaxed mb-4">{`import re

def luhn_check(card_number: str) -> bool:
    digits = re.sub(r"\\D", "", card_number)
    if not 13 <= len(digits) <= 19:
        return False

    total = 0
    for i, ch in enumerate(reversed(digits)):
        d = int(ch)
        if i % 2 == 1:        # cada segundo dígito (1, 3, 5...) da direita
            d *= 2
            if d > 9:
                d -= 9
        total += d

    return total % 10 == 0

# Uso:
luhn_check("4532 0151 1283 0366")   # True
luhn_check("4532-0151-1283-0367")   # False`}</pre>
          </section>

          <section id="o-que-luhn-nao-faz">
            <h2 className="text-xl font-semibold text-foreground mt-10 mb-3">O que o Luhn NÃO faz</h2>
            <p className="mb-4">
              Importante entender o escopo do checksum pra não confiar nele além do que ele resolve:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 mt-3 mb-4">
              <li>
                <strong className="text-foreground">Não verifica fraude.</strong> Você pode gerar
                infinitos números que passam no Luhn (esse site faz isso). Não tem nada a ver com
                identidade do portador ou autorização.
              </li>
              <li>
                <strong className="text-foreground">Não verifica se o cartão existe.</strong> Número
                que passa pode pertencer a ninguém. Só quem confirma existência é o emissor (banco).
              </li>
              <li>
                <strong className="text-foreground">Não verifica CVV nem data de validade.</strong>{" "}
                Esses campos têm validação separada (CVV não tem checksum — é só verificação contra
                a base do emissor).
              </li>
              <li>
                <strong className="text-foreground">Não impede ataques sofisticados.</strong> Pega
                erro de digitação. Pra fraude real, o gateway combina autorização, AVS, fingerprint
                de dispositivo, behavioral signals, etc.
              </li>
            </ul>
            <p className="mb-4">
              Use Luhn no <strong className="text-foreground">cliente</strong> pra evitar requisições
              óbvias inválidas. Use no <strong className="text-foreground">servidor</strong> também
              (cliente pode ser manipulado via DevTools). Mas nunca confie só nele.
            </p>
          </section>

          <section id="bandeiras">
            <h2 className="text-xl font-semibold text-foreground mt-10 mb-3">BINs por bandeira</h2>
            <p className="mb-4">
              O Luhn valida o checksum. Pra detectar a <strong className="text-foreground">bandeira</strong> do
              cartão, você olha o IIN/BIN (os primeiros dígitos):
            </p>
            <div className="rounded-xl bg-card border border-border overflow-x-auto mb-4">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-2 text-muted-foreground font-medium">Bandeira</th>
                    <th className="text-left px-4 py-2 text-muted-foreground font-medium">Prefixo</th>
                    <th className="text-left px-4 py-2 text-muted-foreground font-medium">Comprimento</th>
                    <th className="text-left px-4 py-2 text-muted-foreground font-medium">CVV</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr><td className="px-4 py-2">Visa</td><td className="px-4 py-2 font-mono">4</td><td className="px-4 py-2">13, 16, 19</td><td className="px-4 py-2">3</td></tr>
                  <tr><td className="px-4 py-2">Mastercard</td><td className="px-4 py-2 font-mono">51-55, 2221-2720</td><td className="px-4 py-2">16</td><td className="px-4 py-2">3</td></tr>
                  <tr><td className="px-4 py-2">Amex</td><td className="px-4 py-2 font-mono">34, 37</td><td className="px-4 py-2">15</td><td className="px-4 py-2">4 (CID)</td></tr>
                  <tr><td className="px-4 py-2">Elo</td><td className="px-4 py-2 font-mono">prefixos BR específicos</td><td className="px-4 py-2">16</td><td className="px-4 py-2">3</td></tr>
                  <tr><td className="px-4 py-2">Hipercard</td><td className="px-4 py-2 font-mono">606282, 3841</td><td className="px-4 py-2">16, 19</td><td className="px-4 py-2">3</td></tr>
                  <tr><td className="px-4 py-2">Diners</td><td className="px-4 py-2 font-mono">300-305, 36, 38</td><td className="px-4 py-2">14</td><td className="px-4 py-2">3</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mb-4">
              Pra gerar números válidos por bandeira pra testes, use os geradores específicos:{" "}
              <Link href="/gerador-cartao/visa" className="text-primary hover:underline">Visa</Link>,{" "}
              <Link href="/gerador-cartao/mastercard" className="text-primary hover:underline">Mastercard</Link>,{" "}
              <Link href="/gerador-cartao/elo" className="text-primary hover:underline">Elo</Link>,{" "}
              <Link href="/gerador-cartao/amex" className="text-primary hover:underline">Amex</Link>{" "}ou{" "}
              <Link href="/gerador-cartao/hipercard" className="text-primary hover:underline">Hipercard</Link>.
            </p>
          </section>

          <section id="faq">
            <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">Perguntas frequentes</h2>
            <div className="space-y-3">
              {[
                { q: "Por que o algoritmo se chama mod-10?", a: "Porque a verificação final é se a soma é divisível por 10 (soma mod 10 == 0). 'mod' = módulo, operação de resto da divisão. O nome técnico ISO é 'Luhn' em homenagem ao autor; mod-10 é o jeito informal de descrever a matemática." },
                { q: "O algoritmo de Luhn é o mesmo do CPF/CNPJ?", a: "Não. CPF e CNPJ usam mod-11 (resto da divisão por 11) com pesos diferentes pra cada dígito. Conceito de checksum é parecido, mas os pesos e o módulo são distintos. CPF e CNPJ também têm 2 dígitos verificadores, não 1." },
                { q: "Posso usar Luhn pra IMEI?", a: "Sim. IMEI usa o mesmo algoritmo de Luhn pro último dígito (o check digit). O IMEISV (16 dígitos com software version) também segue a mesma regra." },
                { q: "Qual a diferença entre Luhn e Luhn mod-N?", a: "Luhn padrão usa base 10 (dígitos 0-9). Existe variante 'Luhn mod-N' que generaliza pra qualquer base — usado em códigos alfanuméricos. Pra cartão de crédito, é sempre o Luhn padrão (base 10)." },
                { q: "Por que cartão de teste 4111 1111 1111 1111 funciona?", a: "Porque ele passa no Luhn (some os dígitos seguindo as regras e dá múltiplo de 10) E está na lista de BINs reservados de teste do Visa. Gateways como Stripe, Cielo, Mercado Pago reconhecem ele como 'cartão de sandbox' e simulam respostas — sem tentar autorizar de verdade." },
                { q: "O algoritmo de Luhn protege contra fraude?", a: "Não. Ele detecta erros de digitação (~90% deles). Pra fraude real, gateway combina autorização (banco emissor confirma fundos), AVS (endereço bate?), 3DS (autenticação extra), e múltiplos sinais comportamentais. Luhn é só a pré-filtragem barata antes de tudo isso." },
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

          <section className="mt-12 pt-8 border-t border-border">
            <h2 className="text-base font-semibold text-foreground mb-3">Próximos passos</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Agora que você entende o algoritmo, pode usar os geradores pra criar números de teste
              válidos em qualquer bandeira:
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/gerador-cartao" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">
                Gerador de Cartão (qualquer bandeira)
              </Link>
              <Link href="/blog/algoritmo-luhn-cartao-credito-validacao-testes" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">
                Tutorial completo no blog
              </Link>
              <Link href="/docs" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">
                API REST
              </Link>
            </div>
          </section>
        </div>
      </article>

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Algoritmo de Luhn", url: "/algoritmo-luhn" },
      ]} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            headline: "Algoritmo de Luhn: como funciona e implementação (TypeScript, Python)",
            description: "Tutorial completo do algoritmo de Luhn (mod-10) com exemplo numérico, código TS/Python e calculadora interativa.",
            url: "https://fakeforge.com.br/algoritmo-luhn",
            datePublished: "2026-06-18",
            dateModified: "2026-06-18",
            inLanguage: "pt-BR",
            author: { "@type": "Organization", name: "FakeForge", url: "https://fakeforge.com.br" },
            publisher: {
              "@type": "Organization",
              name: "FakeForge",
              url: "https://fakeforge.com.br",
              logo: { "@type": "ImageObject", url: "https://fakeforge.com.br/logo-icon.png" },
            },
            proficiencyLevel: "Beginner",
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Por que o algoritmo se chama mod-10?", acceptedAnswer: { "@type": "Answer", text: "Porque a verificação final é se a soma é divisível por 10 (soma mod 10 == 0). 'mod' = módulo, operação de resto da divisão." } },
              { "@type": "Question", name: "O algoritmo de Luhn é o mesmo do CPF/CNPJ?", acceptedAnswer: { "@type": "Answer", text: "Não. CPF e CNPJ usam mod-11 com pesos diferentes. Conceito de checksum é parecido, mas pesos e módulo são distintos." } },
              { "@type": "Question", name: "O algoritmo de Luhn protege contra fraude?", acceptedAnswer: { "@type": "Answer", text: "Não. Detecta erros de digitação. Fraude real exige autorização, AVS, 3DS e sinais comportamentais." } },
            ],
          }),
        }}
      />
    </PageShell>
  );
}
