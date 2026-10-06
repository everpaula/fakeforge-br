import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import ApiCtaBanner from "@/components/ApiCtaBanner";
import ApiCtaTop from "@/components/ApiCtaTop";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import GeneratorSchema from "@/components/GeneratorSchema";
import RelatedGenerators from "@/components/RelatedGenerators";

export const metadata: Metadata = {
  title: "Gerador de Pessoa Fictícia: Nome, CPF Válido, Email e Endereço",
  description: "Gere pessoa fictícia brasileira com CPF válido (mod-11), nome típico, email, telefone com DDD ANATEL real e endereço coerente. Pra seed de banco e QA. Grátis.",
  keywords: "gerador de pessoa, gerador de pessoa física, gerador de pessoa fisica, gerador pessoa fisica, gerador de pessoa fictícia, gerar pessoa fake, pessoa fake brasileira, dados fictícios brasileiros, gerador nome cpf email correlacionados, dados teste cadastro, seed banco staging, gerador de pessoas, gerar pessoa",
  openGraph: {
    title: "Gerador de Pessoa Fictícia Brasileira Completa",
    description: "Pessoa com nome, CPF válido, email, telefone e endereço correlacionados para seed de banco e cadastros de teste.",
    type: "website",
    images: ["/api/og?title=Gerador+de+Pessoa+Fict%C3%ADcia&subtitle=Nome%2C+CPF+v%C3%A1lido%2C+email%2C+telefone+e+endere%C3%A7o+correlacionados&category=GERADOR"],
  },
  alternates: { canonical: "/gerador-pessoa" },
};

const CAMPOS_PRESET = [
  ["Nome completo", "Sim", "Sim", "Sim"],
  ["CPF válido (mod-11)", "Sim", "Sim", "Sim"],
  ["Email", "Sim", "Sim", "Sim"],
  ["Telefone com DDD", "Sim", "Sim", "Sim"],
  ["Endereço", "Sim", "Sim", "Sim"],
  ["Conta bancária", "Não", "Sim", "Sim"],
  ["Chave PIX", "Não", "Sim", "Sim (lista)"],
  ["Cartão de crédito", "Não", "Não", "Sim"],
  ["Renda mensal", "Não", "Não", "Sim"],
  ["Score Serasa", "Não", "Não", "Sim"],
];

export default function GeradorPessoa() {
  return (
    <PageShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">Pessoa</span> Fictícia
        </h1>
        <p className="text-foreground mt-3 text-sm leading-relaxed max-w-2xl">
          O FakeForge é um gerador de pessoa fictícia brasileira: a interface web cria nome e sobrenome comuns
          no país, e os presets customer, employee e fintech da API devolvem CPF válido (mod-11), email,
          telefone e endereço no mesmo registro. Grátis sem cadastro, em JSON, CSV ou SQL.
        </p>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Gere perfis completos de pessoas fictícias brasileiras com nome, sobrenome e gênero.
          Os dados são gerados com nomes comuns no Brasil e podem ser combinados com outros
          geradores (CPF, email, telefone, endereço) para criar cadastros completos.
          Ideal para popular bancos de dados de teste, seeds e cenários de QA.
        </p>
      </div>

      <ApiCtaTop dataType="pessoas completas" />

      <SingleGenerator
        type="person"
        label="Pessoa Completa"
        description="Clique em Gerar para criar perfis de pessoas fictícias"
      />

      <p className="text-xs text-muted mt-3">
        Precisa só de nome? Use o <Link href="/" className="text-primary hover:underline">gerador rápido</Link> e selecione &ldquo;Nome Completo&rdquo;.
      </p>

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Geradores", url: "/geradores" },
        { name: "Pessoa Completa", url: "/gerador-pessoa" },
      ]} />

      <ApiCtaBanner dataType="pessoas" />

      {/* SEO content */}
      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">O que é um gerador de pessoa fictícia?</h2>
          <p>
            Um gerador de pessoa fictícia cria perfis completos com dados brasileiros realistas (nome,
            sobrenome, gênero) que não pertencem a ninguém real. O FakeForge usa uma base de nomes
            e sobrenomes comuns no Brasil para que os dados pareçam naturais em formulários e bancos de dados.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Dados correlacionados via API</h2>
          <p>
            Ao usar o preset &ldquo;customer&rdquo; da API, o FakeForge gera uma pessoa completa com todos os campos
            correlacionados: o email usa o nome da pessoa, o telefone tem DDD do mesmo estado do CEP,
            e o cartão de crédito tem o nome do titular correto. Isso é algo que o Faker.js não faz nativamente.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Campos por preset da API</h2>
          <p className="mb-3">
            Use o parâmetro preset em POST https://fakeforge.com.br/api/generate. A tabela mostra quais campos cada preset inclui.
          </p>
          <div className="overflow-x-auto rounded-lg bg-card border border-border">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-3 py-2 text-muted">Campo gerado</th>
                  <th className="text-left px-3 py-2 text-muted">customer</th>
                  <th className="text-left px-3 py-2 text-muted">employee</th>
                  <th className="text-left px-3 py-2 text-muted">fintech</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {CAMPOS_PRESET.map((r) => (
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
            O preset fintech devolve os dados aninhados (customer, pix_keys, bank_account e credit_card). Renda mensal e score Serasa saem de distribuições estatísticas, sem consulta a nenhuma base real, e são independentes entre si.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Casos de uso</h2>
          <p>
            Popular bancos de dados de desenvolvimento (seed), testar formulários de cadastro,
            criar cenários de teste para e-commerce, gerar dados de amostra para demos e apresentações,
            e alimentar pipelines de CI/CD com dados brasileiros realistas.
          </p>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {[
              { q: "A pessoa gerada é real?", a: "Não. Os nomes são combinações aleatórias de nomes e sobrenomes comuns no Brasil. Nenhum perfil gerado corresponde a uma pessoa real." },
              { q: "Os dados são correlacionados?", a: "Na interface web, cada gerador funciona independentemente. Via API com presets (customer, employee), os dados são correlacionados: email usa o nome, CEP bate com o estado, cartão tem o titular correto." },
              { q: "Posso gerar pessoas com CPF, email e endereço juntos?", a: "Sim. Use o preset 'customer' da API: POST https://fakeforge.com.br/api/generate com {\"preset\":\"customer\",\"quantity\":10}. Cada registro terá nome, CPF, email, telefone e endereço." },
              { q: "Quantos nomes diferentes o gerador tem?", a: "O FakeForge usa mais de 40 nomes masculinos, 40 femininos e 45 sobrenomes comuns no Brasil, gerando milhares de combinações únicas." },
              { q: "Posso usar para popular meu banco de dados de teste?", a: "Sim. Use a API com formato SQL: GET https://fakeforge.com.br/api/generate?type=person&quantity=500&format=sql. O output pode ser executado direto no banco." },
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

      <RelatedGenerators currentSlug="gerador-pessoa" />

      {/* FAQPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "A pessoa gerada é real?", acceptedAnswer: { "@type": "Answer", text: "Não. Os nomes são combinações aleatórias de nomes e sobrenomes comuns no Brasil. Nenhum perfil gerado corresponde a uma pessoa real." } },
              { "@type": "Question", name: "Os dados são correlacionados?", acceptedAnswer: { "@type": "Answer", text: "Na interface web, cada gerador funciona independentemente. Via API com presets (customer, employee), os dados são correlacionados: email usa o nome, CEP bate com o estado, cartão tem o titular correto." } },
              { "@type": "Question", name: "Posso gerar pessoas com CPF, email e endereço juntos?", acceptedAnswer: { "@type": "Answer", text: "Sim. Use o preset 'customer' da API: POST https://fakeforge.com.br/api/generate com {\"preset\":\"customer\",\"quantity\":10}. Cada registro terá nome, CPF, email, telefone e endereço." } },
              { "@type": "Question", name: "Quantos nomes diferentes o gerador tem?", acceptedAnswer: { "@type": "Answer", text: "O FakeForge usa mais de 40 nomes masculinos, 40 femininos e 45 sobrenomes comuns no Brasil, gerando milhares de combinações únicas." } },
              { "@type": "Question", name: "Posso usar para popular meu banco de dados de teste?", acceptedAnswer: { "@type": "Answer", text: "Sim. Use a API com formato SQL: GET https://fakeforge.com.br/api/generate?type=person&quantity=500&format=sql. O output pode ser executado direto no banco." } },
              { "@type": "Question", name: "O FakeForge armazena os dados gerados?", acceptedAnswer: { "@type": "Answer", text: "Não. Os dados são gerados em tempo real e descartados imediatamente. Nenhum dado é armazenado ou rastreado." } },
            ],
          }),
        }}
      />

      <GeneratorSchema
        name="Gerador de Pessoa Brasileira para Testes"
        url="https://fakeforge.com.br/gerador-pessoa"
        description="Gere perfis fictícios completos de pessoas brasileiras: nome, CPF, email, telefone e endereço. Mais de 40 nomes masculinos, 40 femininos, 45 sobrenomes. Dados correlacionados via presets de API."
        features={[
          "40+ nomes masculinos e femininos, 45+ sobrenomes brasileiros",
          "Geração coerente: nome compõe o email, CPF é válido mod-11",
          "Preset 'customer' correlaciona nome + CPF + email + telefone + endereço",
          "Preset 'employee' inclui CTPS, PIS e dados profissionais",
          "Export JSON, CSV e SQL",
          "API REST gratuita com 100 chamadas/dia",
        ]}
      />
    </PageShell>
  );
}
