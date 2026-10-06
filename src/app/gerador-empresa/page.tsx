import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import ApiCtaBanner from "@/components/ApiCtaBanner";
import GeneratorSchema from "@/components/GeneratorSchema";
import RelatedGenerators from "@/components/RelatedGenerators";

export const metadata: Metadata = {
  title: "Gerador de Empresa Fictícia com CNPJ Válido e Razão Social",
  description: "Gere empresa fictícia com CNPJ válido (mod-11), razão social, nome fantasia, endereço e telefone correlacionados. Pra testar sistemas B2B. Grátis, sem cadastro.",
  keywords: "gerador de empresa fictícia, gerador de empresa, gerador cnpj, gerador de cnpj, gerar cnpj, gerar empresa, empresa fake, cnpj razão social, dados empresa teste, gerador empresa brasileira, cnpj válido razão social, gerador de dados empresariais, empresa fictícia com cnpj, cnpj aleatório, cnpj completo",
  openGraph: {
    title: "Gerador de Empresa Fictícia - FakeForge",
    description: "Gere empresas fictícias com CNPJ válido, razão social e endereço para testes. Grátis e sem cadastro.",
    type: "website",
    images: ["/api/og?title=Gerador+de+Empresa+Fict%C3%ADcia&subtitle=CNPJ+v%C3%A1lido%2C+raz%C3%A3o+social%2C+endere%C3%A7o+e+contato+correlacionados&category=GERADOR"],
  },
  alternates: { canonical: "/gerador-empresa" },
};

const TIPOS_SOCIETARIOS = [
  ["Ltda.", "Sociedade Limitada", "Tipo mais comum em pequenas e médias empresas. Código Civil, arts. 1.052 a 1.087.", "Sim"],
  ["S.A.", "Sociedade Anônima", "Capital dividido em ações, usada em empresas de médio e grande porte. Lei 6.404/1976.", "Sim"],
  ["ME", "Microempresa", "Enquadramento de porte, com receita bruta anual de até R$ 360 mil. Lei Complementar 123/2006.", "Sim"],
  ["EIRELI", "Empresa Individual de Responsabilidade Limitada", "Extinta em 2022 (Lei 14.382/2022). Aparece em cadastros antigos.", "Sim"],
  ["S/S", "Sociedade Simples", "Prestação de serviços intelectuais por profissionais. Código Civil, arts. 997 a 1.038.", "Sim"],
];

export default function GeradorEmpresa() {
  return (
    <PageShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">CNPJ Válido</span> e Empresa Fictícia
        </h1>
        <p className="text-foreground mt-3 text-sm leading-relaxed max-w-2xl">
          O FakeForge é um gerador de CNPJ válido e empresa fictícia brasileira. Cria CNPJ com os 2 dígitos
          verificadores corretos (mod-11, regra da Receita Federal), junto com razão social, nome fantasia,
          endereço e telefone correlacionados. Grátis sem cadastro, com API REST em JSON, CSV e SQL
          (100 chamadas por dia no plano gratuito).
        </p>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Gere dados completos de empresas fictícias brasileiras com CNPJ válido (dígitos verificadores
          corretos), razão social, nome fantasia, endereço comercial e telefone. Ideal para testar
          cadastros B2B, marketplaces, emissão de NF-e em homologação e integração com sistemas empresariais.
        </p>
        <p className="text-xs text-muted mt-2 max-w-2xl">
          Precisa só do número do CNPJ, sem razão social e endereço? Use o{" "}
          <Link href="/gerador-cnpj" className="text-primary hover:underline">Gerador de CNPJ Válido</Link>{" "}
          (atômico, mais rápido).
        </p>
      </div>

      <SingleGenerator
        type="company"
        label="Empresa"
        description="Clique em Gerar para criar empresas fictícias"
      />

      <ApiCtaBanner dataType="empresas" />

      {/* SEO content */}
      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section className="rounded-xl bg-primary/5 border border-primary/20 p-4">
          <h2 className="text-lg font-semibold text-foreground mb-2">CNPJ válido: o que significa</h2>
          <p className="mb-3">
            Um CNPJ válido é um número de 14 dígitos cujos 2 últimos dígitos (verificadores) batem com o cálculo
            módulo 11 definido pela Receita Federal. Válido não quer dizer registrado: o número passa na
            validação matemática, mas só existe como empresa se constar na base da Receita Federal.
          </p>
          <p className="mb-2 font-medium text-foreground">Como o dígito verificador é calculado (mod-11):</p>
          <ol className="list-decimal pl-5 space-y-1 mb-3">
            <li>Pegue os 12 primeiros dígitos (8 da raiz + 4 da ordem) e multiplique pelos pesos 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2.</li>
            <li>Some os produtos e calcule o resto da divisão por 11.</li>
            <li>Se o resto for menor que 2, o 1º dígito verificador é 0. Senão, é 11 menos o resto.</li>
            <li>Acrescente esse dígito aos 12 e repita com os 13 dígitos e os pesos 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 para achar o 2º dígito.</li>
          </ol>
          <p className="mb-3">
            Exemplo com a base 11.222.333/0001: a soma dos produtos é 102, o resto é 3 e o 1º dígito é 8. Com os
            13 dígitos a soma é 120, o resto é 10 e o 2º dígito é 1. Resultado: <strong>11.222.333/0001-81</strong>.
          </p>
          <p className="mb-2 font-medium text-foreground">Matriz e filial:</p>
          <p>
            Os 4 dígitos da ordem (posições 9 a 12) separam os estabelecimentos da mesma empresa. <strong>0001</strong>{" "}
            é a matriz. <strong>0002</strong>, <strong>0003</strong> e seguintes são filiais. A raiz (8 primeiros
            dígitos) é a mesma e só os dígitos verificadores mudam, porque dependem da ordem. O gerador desta
            página usa sempre /0001.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Qual gerador usar: empresa completa ou só o CNPJ</h2>
          <ul className="space-y-2">
            <li>
              Precisa só do número CNPJ (mais rápido)? Use{" "}
              <Link href="/gerador-cnpj" className="text-primary hover:underline font-medium">gerador-cnpj</Link>.
            </li>
            <li>
              Testar novo formato alfanumérico? Use{" "}
              <Link href="/gerador-cnpj-alfanumerico" className="text-primary hover:underline font-medium">gerador-cnpj-alfanumerico</Link>.
            </li>
            <li>
              Quer entender CNPJ numérico e alfanumérico lado a lado? Veja{" "}
              <Link href="/gerador-cnpj-valido" className="text-primary hover:underline font-medium">gerador de CNPJ válido</Link>.
            </li>
            <li>
              Precisa de razão social, endereço e telefone junto do CNPJ? Continue aqui, no gerador de empresa.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">O que é gerado?</h2>
          <p>
            Cada empresa fictícia inclui: CNPJ com dígitos verificadores válidos (mod-11),
            razão social com tipo societário (LTDA, S.A., ME, EIRELI), nome fantasia,
            endereço comercial completo (rua, bairro, cidade, estado, CEP) e telefone com DDD válido.
            Os CNPJs usam o sufixo /0001 (matriz), que é o formato mais comum em testes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Tipos societários gerados na razão social</h2>
          <p className="mb-3">
            A razão social sai com um dos cinco sufixos abaixo. O CNPJ tem 14 dígitos: 8 da raiz, 4 da ordem (/0001 para matriz) e 2 verificadores, conforme a Receita Federal.
          </p>
          <div className="overflow-x-auto rounded-lg bg-card border border-border">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-3 py-2 text-muted">Sigla</th>
                  <th className="text-left px-3 py-2 text-muted">Nome completo</th>
                  <th className="text-left px-3 py-2 text-muted">Uso e base legal</th>
                  <th className="text-left px-3 py-2 text-muted">Gerada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {TIPOS_SOCIETARIOS.map((r) => (
                  <tr key={r[0]}>
                    <td className="px-3 py-2 text-foreground">{r[0]}</td>
                    <td className="px-3 py-2 text-muted-foreground">{r[1]}</td>
                    <td className="px-3 py-2 text-muted-foreground">{r[2]}</td>
                    <td className="px-3 py-2 text-muted-foreground">{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3">
            ME não é um tipo societário, é um enquadramento de porte da Lei Complementar 123/2006. A EIRELI foi extinta pela Lei 14.382/2022 e as existentes viraram sociedade limitada unipessoal. O gerador mantém os dois sufixos porque eles ainda aparecem em bases legadas.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Para que usar dados de empresa fictícia?</h2>
          <p>
            Testar cadastros de fornecedores e parceiros em ERPs, validar integração com APIs de consulta
            CNPJ, popular ambientes de staging de marketplaces B2B, testar emissão de NF-e em ambiente
            de homologação, e criar cenários de QA que envolvem dados empresariais completos.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Empresa completa via API</h2>
          <p>
            Use o preset &ldquo;company&rdquo; da API para gerar empresas com todos os campos correlacionados:
            o CNPJ é válido, o endereço é coerente com o estado, e o telefone tem DDD da região.
            Suporta export em JSON, CSV e SQL para integração direta com seu banco de dados.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Como validar um CNPJ programaticamente</h2>
          <p className="mb-3">
            A validação é o mesmo mod-11 descrito acima. Em Python:
          </p>
          <pre className="bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto mb-3">
            <code>{`def valida_cnpj(cnpj: str) -> bool:
    d = [int(c) for c in cnpj if c.isdigit()]
    if len(d) != 14 or len(set(d)) == 1:  # 00.000.000/0000-00 e similares são inválidos
        return False
    pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    pesos2 = [6] + pesos1

    def digito(base, pesos):
        resto = sum(n * p for n, p in zip(base, pesos)) % 11
        return 0 if resto < 2 else 11 - resto

    return d[12] == digito(d[:12], pesos1) and d[13] == digito(d[:13], pesos2)

print(valida_cnpj("11.222.333/0001-81"))  # True
print(valida_cnpj("11.222.333/0001-82"))  # False`}</code>
          </pre>
          <p>
            Para gerar e validar em lote na mesma rotina, busque os CNPJs pela API e passe cada um pela função:{" "}
            <code className="text-xs">curl &quot;https://fakeforge.com.br/api/generate?type=cnpj&amp;quantity=10&quot;</code>.
            Mais detalhes em{" "}
            <Link href="/gerador-cnpj-python" className="text-primary hover:underline">CNPJ em Python</Link> e{" "}
            <Link href="/gerador-cnpj-nodejs" className="text-primary hover:underline">CNPJ em Node.js</Link>.
          </p>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {[
              { q: "Como gerar CNPJ válido online?", a: "Clique em Gerar nesta página pra criar CNPJ com mod-11 da Receita Federal junto com razão social, nome fantasia, endereço e telefone. Também dá pra gerar em massa via API: curl 'https://fakeforge.com.br/api/generate?type=cnpj&quantity=100'. Grátis 50/dia sem cadastro. Se precisar só do número CNPJ sem a empresa, use o Gerador de CNPJ atômico." },
              { q: "Qual a diferença entre gerador de CNPJ e gerador de empresa?", a: "Gerador de CNPJ devolve só os 14 dígitos com DV válido. Gerador de empresa devolve CNPJ + razão social + nome fantasia + endereço + telefone correlacionados. Pra teste de cadastro B2B precisa do pacote completo. Pra teste unitário de validação, só o número." },
              { q: "Como saber se um CNPJ é válido?", a: "Calcule os 2 dígitos verificadores com o módulo 11 da Receita Federal: pesos 5,4,3,2,9,8,7,6,5,4,3,2 para o primeiro e 6,5,4,3,2,9,8,7,6,5,4,3,2 para o segundo. Se os dígitos calculados baterem com os 2 últimos do número, o CNPJ é válido. Isso confirma só o formato: para saber se a empresa existe, consulte a base da Receita Federal." },
              { q: "O CNPJ da empresa gerada é real?", a: "Não. O CNPJ tem dígitos verificadores válidos (passa na validação mod-11), mas não está registrado na Receita Federal. A empresa não existe." },
              { q: "Posso usar o CNPJ gerado para abrir uma empresa?", a: "Não. Os CNPJs são fictícios e servem exclusivamente para testes de software. Para abrir uma empresa, é necessário registrar um CNPJ real na Receita Federal." },
              { q: "Qual a diferença entre CNPJ matriz e filial?", a: "O CNPJ matriz usa o sufixo /0001. Filiais usam /0002, /0003, etc. O FakeForge gera apenas CNPJs de matriz (/0001), que é o cenário mais comum em testes." },
              { q: "Os dados da empresa são correlacionados?", a: "Sim. O endereço é coerente com o estado, o telefone tem DDD da região, e a razão social segue padrões brasileiros com tipo societário (LTDA, S.A., ME)." },
              { q: "O CNPJ alfanumérico de 2026 está suportado?", a: "Sim. A partir de 01/07/2026, a Instrução Normativa RFB 2.229/2024 permite CNPJs com letras A-Z nas 12 primeiras posições. O FakeForge gera os dois formatos: tradicional neste gerador e alfanumérico em /gerador-cnpj-alfanumerico. Dois dígitos verificadores continuam numéricos (mod-11 com código ASCII das letras)." },
              { q: "Posso gerar empresas em massa via API?", a: "Sim. Use o preset 'company': POST https://fakeforge.com.br/api/generate com {\"preset\":\"company\",\"quantity\":50}. São 50 chamadas grátis por dia sem cadastro." },
              { q: "O FakeForge armazena os dados gerados?", a: "Não. Os dados são gerados em tempo real e descartados imediatamente. Nenhum dado é armazenado ou rastreado." },
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

      <RelatedGenerators currentSlug="gerador-empresa" />

      {/* FAQPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Como gerar CNPJ válido online?", acceptedAnswer: { "@type": "Answer", text: "Clique em Gerar nesta página pra criar CNPJ com mod-11 da Receita Federal junto com razão social, nome fantasia, endereço e telefone. Também dá pra gerar em massa via API: curl 'https://fakeforge.com.br/api/generate?type=cnpj&quantity=100'. Grátis 50/dia sem cadastro. Se precisar só do número CNPJ sem a empresa, use o Gerador de CNPJ atômico." } },
              { "@type": "Question", name: "Qual a diferença entre gerador de CNPJ e gerador de empresa?", acceptedAnswer: { "@type": "Answer", text: "Gerador de CNPJ devolve só os 14 dígitos com DV válido. Gerador de empresa devolve CNPJ + razão social + nome fantasia + endereço + telefone correlacionados. Pra teste de cadastro B2B precisa do pacote completo. Pra teste unitário de validação, só o número." } },
              { "@type": "Question", name: "Como saber se um CNPJ é válido?", acceptedAnswer: { "@type": "Answer", text: "Calcule os 2 dígitos verificadores com o módulo 11 da Receita Federal: pesos 5,4,3,2,9,8,7,6,5,4,3,2 para o primeiro e 6,5,4,3,2,9,8,7,6,5,4,3,2 para o segundo. Se os dígitos calculados baterem com os 2 últimos do número, o CNPJ é válido. Isso confirma só o formato: para saber se a empresa existe, consulte a base da Receita Federal." } },
              { "@type": "Question", name: "O CNPJ da empresa gerada é real?", acceptedAnswer: { "@type": "Answer", text: "Não. O CNPJ tem dígitos verificadores válidos (passa na validação mod-11), mas não está registrado na Receita Federal. A empresa não existe." } },
              { "@type": "Question", name: "Posso usar o CNPJ gerado para abrir uma empresa?", acceptedAnswer: { "@type": "Answer", text: "Não. Os CNPJs são fictícios e servem exclusivamente para testes de software. Para abrir uma empresa, é necessário registrar um CNPJ real na Receita Federal." } },
              { "@type": "Question", name: "Qual a diferença entre CNPJ matriz e filial?", acceptedAnswer: { "@type": "Answer", text: "O CNPJ matriz usa o sufixo /0001. Filiais usam /0002, /0003, etc. O FakeForge gera apenas CNPJs de matriz (/0001), que é o cenário mais comum em testes." } },
              { "@type": "Question", name: "Os dados da empresa são correlacionados?", acceptedAnswer: { "@type": "Answer", text: "Sim. O endereço é coerente com o estado, o telefone tem DDD da região, e a razão social segue padrões brasileiros com tipo societário (LTDA, S.A., ME)." } },
              { "@type": "Question", name: "O CNPJ alfanumérico de 2026 está suportado?", acceptedAnswer: { "@type": "Answer", text: "Sim. A partir de 01/07/2026, a Instrução Normativa RFB 2.229/2024 permite CNPJs com letras A-Z nas 12 primeiras posições. O FakeForge gera os dois formatos: tradicional neste gerador e alfanumérico em /gerador-cnpj-alfanumerico. Dois dígitos verificadores continuam numéricos (mod-11 com código ASCII das letras)." } },
              { "@type": "Question", name: "Posso gerar empresas em massa via API?", acceptedAnswer: { "@type": "Answer", text: "Sim. Use o preset 'company': POST https://fakeforge.com.br/api/generate com {\"preset\":\"company\",\"quantity\":50}. São 50 chamadas grátis por dia sem cadastro." } },
              { "@type": "Question", name: "O FakeForge armazena os dados gerados?", acceptedAnswer: { "@type": "Answer", text: "Não. Os dados são gerados em tempo real e descartados imediatamente. Nenhum dado é armazenado ou rastreado." } },
            ],
          }),
        }}
      />

      <GeneratorSchema
        name="Gerador de Empresa Fictícia"
        url="https://fakeforge.com.br/gerador-empresa"
        description="Gere empresa fictícia completa para testes: CNPJ válido, razão social, nome fantasia, endereço coerente, telefone e email. Para uso em ambiente de desenvolvimento."
        features={[
          "CNPJ válido via algoritmo mod-11",
          "Razão social, nome fantasia, endereço, telefone e email correlacionados",
          "Endereço com CEP coerente por estado",
          "Geração em lote até 10.000 por chamada",
          "Export JSON, CSV e SQL",
          "API REST gratuita com 100 chamadas/dia",
        ]}
      />
    </PageShell>
  );
}
