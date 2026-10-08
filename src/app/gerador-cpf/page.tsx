import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import ApiCtaBanner from "@/components/ApiCtaBanner";
import AdBanner from "@/components/AdBanner";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import GeneratorSchema from "@/components/GeneratorSchema";
import RelatedGenerators from "@/components/RelatedGenerators";
import ValidatorCPF from "./ValidatorCPF";

// Title + description otimizados pra competir em "gerador de cpf" (pos 8-9
// GSC Oct 05, CTR 0.3% em 12.6k impressions). Antes: "Gerador de CPF Válido
// Online: mod-11 Receita, Grátis" — jargão tecnico ("mod-11") no inicio sem
// hook de beneficio, zero diferencial numerico, dois pontos+virgula confuso.
// Agora: beneficio primeiro ("Grátis, Sem Cadastro"), diferencial numerico
// no description ("50 CPFs/dia"), API como diferencial vs 4devs.
export const metadata: Metadata = {
  title: "Gerador de CPF Válido — Grátis, Sem Cadastro | FakeForge",
  description: "Gere CPF válido pra testes de software, QA e seed de banco. Algoritmo mod-11 oficial da Receita Federal, formatado ou puro. 50 CPFs/dia grátis, sem cadastro, com API REST.",
  keywords: "gerador de cpf, cpf válido, gerar cpf, cpf fake, cpf falso, cpf fictício, cpf para testes, gerador cpf online, gerador cpf grátis, cpf aleatório, cpf sintético, cpf válido para teste, gerar cpf fake, cpf receita federal, mod-11 cpf",
  openGraph: {
    title: "Gerador de CPF Válido — Grátis, Sem Cadastro",
    description: "CPF válido com mod-11 da Receita Federal. 50/dia grátis sem cadastro + API REST pra automação.",
    type: "website",
    images: ["/api/og?title=Gerador+de+CPF+V%C3%A1lido&subtitle=Mod-11+Receita+Federal+%7C+50%2Fdia+gr%C3%A1tis+sem+cadastro&category=GERADOR"],
  },
  alternates: { canonical: "/gerador-cpf" },
};

const LINK_CLS = "px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors";

const GUIAS_LINGUAGEM = [
  ["/gerador-cpf-python", "Python"],
  ["/gerador-cpf-nodejs", "Node.js"],
  ["/gerador-cpf-curl", "cURL"],
  ["/gerador-cpf-jest", "Jest"],
  ["/gerador-cpf-pytest", "pytest"],
];

const ESTRUTURA_CPF = [
  ["1º ao 8º", "Número-base", "Sequência sorteada pela Receita Federal na inscrição. Não carrega informação da pessoa."],
  ["9º", "Região fiscal", "Indica o estado de inscrição: 0 (RS), 1 (DF, GO, MS, MT, TO), 2 (AC, AM, AP, PA, RO, RR), 3 (CE, MA, PI), 4 (AL, PB, PE, RN), 5 (BA, SE), 6 (MG), 7 (ES, RJ), 8 (SP), 9 (PR, SC)."],
  ["10º", "1º dígito verificador", "Mod-11 sobre os 9 primeiros dígitos, pesos de 10 a 2."],
  ["11º", "2º dígito verificador", "Mod-11 sobre os 10 primeiros dígitos, pesos de 11 a 2."],
];

export default function GeradorCPF() {
  return (
    <PageShell>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">CPF</span> Válido para Testes
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Gerar CPF válido online, sem cadastro e sem instalação. Os CPFs são gerados pelo algoritmo mod-11
          da Receita Federal (mesma matemática que a RFB usa pros dígitos verificadores reais) e passam em
          qualquer validador. Fake, fictício, aleatório ou sintético: termos usados pelo mesmo CPF, só mudam
          as palavras. Para testes de software, seed de banco, QA e cadastros em homologação.
        </p>
      </div>

      <SingleGenerator
        type="cpf"
        label="CPF"
        description="Clique em Gerar para criar CPFs válidos"
      />

      <div className="mt-8">
        <ValidatorCPF />
      </div>

      <ApiCtaBanner dataType="CPFs" />

      <div className="mt-6 flex flex-wrap gap-2">
        <span className="text-xs text-muted self-center mr-2">Guias por linguagem:</span>
        {GUIAS_LINGUAGEM.map(([href, label]) => (
          <Link key={href} href={href} className={LINK_CLS}>{`CPF em ${label}`}</Link>
        ))}
      </div>

      {/* SEO content */}
      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">O que é um CPF?</h2>
          <p>
            O CPF (Cadastro de Pessoa Física) é o documento de identificação fiscal de pessoas físicas no Brasil,
            emitido pela Receita Federal. Ele possui 11 dígitos no formato XXX.XXX.XXX-XX, onde os dois últimos
            são dígitos verificadores calculados pelo algoritmo módulo 11.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Como funciona a validação?</h2>
          <p>
            Os dígitos verificadores do CPF são calculados usando pesos multiplicadores sobre os 9 primeiros dígitos.
            O primeiro dígito verificador usa pesos de 10 a 2, e o segundo usa pesos de 11 a 2.
            O resultado é o resto da divisão por 11: se menor que 2, o dígito é 0; caso contrário, é 11 menos o resto.
            Todos os CPFs gerados pelo FakeForge passam nessa validação.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Para que serve um gerador de CPF?</h2>
          <p>
            Desenvolvedores precisam de CPFs válidos para testar sistemas que validam esse campo (cadastros,
            formulários de e-commerce, integração com gateways de pagamento e testes automatizados).
            Usar um CPF real em ambiente de teste viola a LGPD. Geradores criam números fictícios que passam
            na validação sem pertencer a ninguém.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Estrutura do CPF: os 11 dígitos explicados</h2>
          <p className="mb-3">
            O CPF é mantido pela Receita Federal e tem 11 dígitos no formato XXX.XXX.XXX-XX.
            Os 8 primeiros são o número-base, o 9º indica a região fiscal e os 2 últimos são verificadores.
          </p>
          <div className="overflow-x-auto rounded-lg bg-card border border-border">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-3 py-2 text-muted">Posição</th>
                  <th className="text-left px-3 py-2 text-muted">Campo</th>
                  <th className="text-left px-3 py-2 text-muted">Significado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ESTRUTURA_CPF.map((r) => (
                  <tr key={r[0]}>
                    <td className="px-3 py-2 text-foreground whitespace-nowrap">{r[0]}</td>
                    <td className="px-3 py-2 text-foreground">{r[1]}</td>
                    <td className="px-3 py-2 text-muted-foreground">{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Algoritmo mod-11 passo a passo</h2>
          <p className="mb-3">
            Exemplo com os 9 primeiros dígitos <strong>529.982.247</strong>:
          </p>
          <ol className="list-decimal pl-5 space-y-1 mb-3">
            <li>Multiplique cada dígito pelos pesos 10, 9, 8, 7, 6, 5, 4, 3, 2: 50 + 18 + 72 + 63 + 48 + 10 + 8 + 12 + 14 = 295.</li>
            <li>Calcule o resto de 295 dividido por 11: 295 mod 11 = 9.</li>
            <li>Se o resto for menor que 2, o dígito é 0. Senão, é 11 menos o resto: 11 - 9 = <strong>2</strong>.</li>
            <li>Acrescente o 2 ao final e repita com pesos 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 sobre os 10 dígitos: soma 347, resto 6, dígito 11 - 6 = <strong>5</strong>.</li>
            <li>Resultado: <strong>529.982.247-25</strong>.</li>
          </ol>
          <p className="mb-3">Em Python, a validação completa cabe em poucas linhas:</p>
          <pre className="bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto mb-3">
            <code>{`def valida_cpf(cpf: str) -> bool:
    d = [int(c) for c in cpf if c.isdigit()]
    if len(d) != 11 or len(set(d)) == 1:  # 111.111.111-11 passa no cálculo, mas é rejeitado
        return False
    for i in (9, 10):
        soma = sum(d[j] * (i + 1 - j) for j in range(i))
        resto = soma % 11
        if d[i] != (0 if resto < 2 else 11 - resto):
            return False
    return True

print(valida_cpf("529.982.247-25"))  # True
print(valida_cpf("529.982.247-26"))  # False`}</code>
          </pre>
          <p>
            Precisa de implementação por linguagem? Veja os guias de{" "}
            <Link href="/gerador-cpf-python" className="text-primary hover:underline">Python</Link>,{" "}
            <Link href="/gerador-cpf-nodejs" className="text-primary hover:underline">Node.js</Link> e{" "}
            <Link href="/gerador-cpf-curl" className="text-primary hover:underline">cURL</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Por que CPF fake é seguro pra testes (LGPD)</h2>
          <p className="mb-2">
            A Lei Geral de Proteção de Dados (Lei 13.709/2018) trata o CPF como dado pessoal. Copiar CPFs reais
            de produção para ambientes de teste, staging ou planilhas de QA amplia a superfície de vazamento e
            exige base legal para esse uso.
          </p>
          <p>
            Um CPF gerado pelo algoritmo mod-11 tem o formato correto, mas não foi emitido pela Receita Federal
            para ninguém, então não identifica uma pessoa natural. Há uma ressalva: como o espaço de números é
            finito (cerca de 1 bilhão de combinações), um CPF sorteado pode coincidir por acaso com um CPF real.
            Por isso, nunca use CPF gerado em produção, em consultas à base da Receita Federal ou em qualquer
            fluxo com efeito jurídico. Em homologação e testes automatizados, o risco é desprezível.
          </p>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {[
              { q: "Como gerar CPF válido online?", a: "Clique em Gerar nesta página pra criar CPFs válidos pelo mod-11 da Receita Federal. Também dá pra gerar em massa via API REST: curl 'https://fakeforge.com.br/api/generate?type=cpf&quantity=100'. Grátis 50/dia, sem cadastro." },
              { q: "O que é CPF aleatório ou CPF fake?", a: "CPF aleatório, CPF fake e CPF fictício são sinônimos pra o mesmo conceito: um CPF gerado algoritmicamente que passa no mod-11 mas não pertence a pessoa real. O FakeForge entrega os três: aleatórios, fakes e válidos ao mesmo tempo." },
              { q: "O CPF gerado é de uma pessoa real?", a: "Não. Todos os CPFs são 100% fictícios, gerados algoritmicamente. Eles passam na validação matemática (mod-11), mas não pertencem a nenhuma pessoa real e não existem na base da Receita Federal." },
              { q: "Gerar CPF para testes é crime?", a: "Não. Gerar números fictícios para testes de software é uma prática comum e legal. Crime seria usar um CPF real de outra pessoa (falsidade ideológica). CPFs gerados algoritmicamente não pertencem a ninguém." },
              { q: "O CPF gerado passa na validação de sistemas?", a: "Sim. Os dígitos verificadores são calculados usando o mesmo algoritmo mod-11 da Receita Federal. Qualquer sistema que valida o formato e os dígitos do CPF aceitará os números gerados." },
              { q: "Posso usar o gerador de CPF em testes automatizados?", a: "Sim. Use a API REST do FakeForge para gerar CPFs programaticamente em seus testes: GET https://fakeforge.com.br/api/generate?type=cpf&quantity=100. São 50 chamadas grátis por dia sem cadastro." },
              { q: "Qual a diferença entre CPF formatado e sem formato?", a: "CPF formatado inclui pontos e traço (123.456.789-00). Sem formato retorna apenas os 11 dígitos (12345678900). Use o toggle 'Formatado' para alternar entre os dois." },
              { q: "Como gerar vários CPFs de uma vez pra popular banco?", a: "Use a API no formato SQL: curl 'https://fakeforge.com.br/api/generate?type=cpf&quantity=1000&format=sql'. Devolve 1000 CPFs em INSERT INTO pronto pra executar no banco. Pra correlacionar com nome, email e endereço, use preset=customer." },
              { q: "O FakeForge armazena os CPFs gerados?", a: "Não. Os CPFs são gerados em tempo real no servidor e descartados imediatamente. Nenhum dado é armazenado, logado ou rastreado." },
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
      </div>

      <AdBanner label="Publicidade" className="max-w-3xl mx-auto" />

      <RelatedGenerators currentSlug="gerador-cpf" />

      {/* Artigos relacionados */}
      <div className="mt-8">
        <h2 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wider">Artigos relacionados</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/blog/como-gerar-cpf-para-testes" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Como gerar CPF para testes</Link>
        </div>
      </div>

      {/* FAQPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Como gerar CPF válido online?", acceptedAnswer: { "@type": "Answer", text: "Clique em Gerar nesta página pra criar CPFs válidos pelo mod-11 da Receita Federal. Também dá pra gerar em massa via API REST: curl 'https://fakeforge.com.br/api/generate?type=cpf&quantity=100'. Grátis 50/dia, sem cadastro." } },
              { "@type": "Question", name: "O que é CPF aleatório ou CPF fake?", acceptedAnswer: { "@type": "Answer", text: "CPF aleatório, CPF fake e CPF fictício são sinônimos pra o mesmo conceito: um CPF gerado algoritmicamente que passa no mod-11 mas não pertence a pessoa real. O FakeForge entrega os três: aleatórios, fakes e válidos ao mesmo tempo." } },
              { "@type": "Question", name: "O CPF gerado é de uma pessoa real?", acceptedAnswer: { "@type": "Answer", text: "Não. Todos os CPFs são 100% fictícios, gerados algoritmicamente. Eles passam na validação matemática (mod-11), mas não pertencem a nenhuma pessoa real e não existem na base da Receita Federal." } },
              { "@type": "Question", name: "Gerar CPF para testes é crime?", acceptedAnswer: { "@type": "Answer", text: "Não. Gerar números fictícios para testes de software é uma prática comum e legal. Crime seria usar um CPF real de outra pessoa (falsidade ideológica). CPFs gerados algoritmicamente não pertencem a ninguém." } },
              { "@type": "Question", name: "O CPF gerado passa na validação de sistemas?", acceptedAnswer: { "@type": "Answer", text: "Sim. Os dígitos verificadores são calculados usando o mesmo algoritmo mod-11 da Receita Federal. Qualquer sistema que valida o formato e os dígitos do CPF aceitará os números gerados." } },
              { "@type": "Question", name: "Posso usar o gerador de CPF em testes automatizados?", acceptedAnswer: { "@type": "Answer", text: "Sim. Use a API REST do FakeForge para gerar CPFs programaticamente em seus testes: GET https://fakeforge.com.br/api/generate?type=cpf&quantity=100. São 50 chamadas grátis por dia sem cadastro." } },
              { "@type": "Question", name: "Qual a diferença entre CPF formatado e sem formato?", acceptedAnswer: { "@type": "Answer", text: "CPF formatado inclui pontos e traço (123.456.789-00). Sem formato retorna apenas os 11 dígitos (12345678900). Use o toggle 'Formatado' para alternar entre os dois." } },
              { "@type": "Question", name: "Como gerar vários CPFs de uma vez pra popular banco?", acceptedAnswer: { "@type": "Answer", text: "Use a API no formato SQL: curl 'https://fakeforge.com.br/api/generate?type=cpf&quantity=1000&format=sql'. Devolve 1000 CPFs em INSERT INTO pronto pra executar no banco. Pra correlacionar com nome, email e endereço, use preset=customer." } },
              { "@type": "Question", name: "O FakeForge armazena os CPFs gerados?", acceptedAnswer: { "@type": "Answer", text: "Não. Os CPFs são gerados em tempo real no servidor e descartados imediatamente. Nenhum dado é armazenado, logado ou rastreado." } },
            ],
          }),
        }}
      />

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Geradores", url: "/geradores" },
        { name: "CPF", url: "/gerador-cpf" },
      ]} />

      <GeneratorSchema
        name="Gerador de CPF Válido"
        url="https://fakeforge.com.br/gerador-cpf"
        description="Gere CPF válido e fictício para testes de software. Dígitos verificadores corretos pelo algoritmo mod-11. Formatado ou sem pontuação. API REST gratuita."
        features={[
          "Geração em lote até 10.000 CPFs por chamada",
          "Algoritmo mod-11 com dígitos verificadores corretos",
          "Validador integrado de CPF",
          "Formato com pontuação (XXX.XXX.XXX-XX) ou apenas dígitos",
          "Export JSON, CSV e SQL",
          "API REST gratuita com 100 chamadas/dia",
        ]}
      />
    </PageShell>
  );
}
