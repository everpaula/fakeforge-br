import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "FakeForge vs Faker.js: qual usar para dados brasileiros em 2026?",
  description:
    "Comparativo técnico entre FakeForge BR e Faker.js (@faker-js/faker) para gerar dados brasileiros válidos. CPF mod-11, CNPJ alfanumérico, PIX BACEN, locale pt_BR, API REST. Quando usar cada um.",
  keywords:
    "fakeforge vs faker.js, faker.js brasileiro, faker pt_BR cpf válido, alternativa faker.js brasil, faker js cnpj válido, gerador dados brasil sem instalar lib",
  alternates: { canonical: "/comparacao/fakeforge-vs-fakerjs" },
  openGraph: {
    title: "FakeForge vs Faker.js: comparação para dados brasileiros",
    description:
      "Faker.js é uma lib JS internacional com locale pt_BR mas CPF/CNPJ não passam em mod-11. FakeForge é API BR com validação algorítmica. Quando usar cada um.",
    type: "article",
  },
};

const COMPARISON: [string, string, string][] = [
  ["CPF passa em mod-11", "✓ nativo", "Formato pt_BR sem checksum"],
  ["CNPJ passa em mod-11", "✓ nativo", "Formato pt_BR sem checksum"],
  ["CNPJ Alfanumérico (2026)", "✓", "Não suportado"],
  ["CIN (novo RG biométrico)", "✓", "Não suportado"],
  ["CNH válida (DENATRAN)", "✓", "Não suportado"],
  ["Chave PIX (4 tipos BACEN)", "✓", "Não suportado"],
  ["RG por estado", "✓", "Apenas formato genérico"],
  ["Título de eleitor (TSE)", "✓", "Não suportado"],
  ["PIS/PASEP (mod-11)", "✓", "Não suportado"],
  ["Cartão de crédito (Luhn + bandeira)", "✓ Visa/Master/Elo/Hiper/Amex", "Genérico, sem Elo/Hiper"],
  ["CEP coerente por estado", "✓ 10 estados", "CEP aleatório no formato BR"],
  ["Bairros e cidades reais", "✓", "Lista limitada"],
  ["Nomes brasileiros típicos", "✓ 125+ nomes", "Locale pt_BR completo"],
  ["Telefone com DDD válido", "✓ 67 DDDs", "Formato pt_BR sem validar DDD"],
  ["Dados correlacionados (nome+email+CEP)", "✓ via presets", "Não, cada provider é isolado"],
  ["Forma de uso", "API REST + UI web", "Lib npm no seu código"],
  ["Setup necessário", "Zero, chamada HTTP", "npm install + import"],
  ["Plano gratuito", "100 chamadas/dia (API), web ilimitado", "Grátis e open source"],
  ["Plano pago", "R$ 29/mês (Dev)", "Não tem"],
  ["Export SQL pronto", "✓ INSERT INTO direto", "Você escreve o SQL"],
  ["Export JSON/CSV", "✓", "Não nativo, você serializa"],
  ["Roda offline", "Não (API hospedada)", "✓ executa no seu Node"],
  ["Interface em português", "✓", "Apenas API em inglês"],
  ["Hospedagem", "Brasil (latência baixa)", "Sua máquina ou CI"],
];

export default function ComparacaoFakerjs() {
  return (
    <PageShell>
      <article className="max-w-3xl">
        <div className="mb-10">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Comparativo · 2026
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            FakeForge vs <span className="text-primary">Faker.js</span>
          </h1>
          <p className="text-muted-foreground mt-4 text-sm sm:text-base leading-relaxed">
            Faker.js (mantido oficialmente como @faker-js/faker desde 2022) é a biblioteca JavaScript
            de fake data mais popular do mundo, com locale pt_BR e dezenas de outras línguas. FakeForge
            é uma API hospedada no Brasil com validação algorítmica nativa para CPF, CNPJ, PIX, CNH e
            CIN. Este comparativo cobre quando vale usar cada um, e como combinar os dois.
          </p>
        </div>

        <div className="rounded-xl bg-primary/5 border border-primary/20 p-5 mb-10">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">TL;DR</p>
          <ul className="text-sm space-y-1.5 text-foreground">
            <li>
              <strong>Use FakeForge se:</strong> seu sistema valida CPF/CNPJ via mod-11, precisa
              de CNPJ alfanumérico, PIX BACEN, CNH ou CIN, e você quer chamar uma API em vez de
              instalar uma lib.
            </li>
            <li>
              <strong>Use Faker.js se:</strong> seu projeto é internacional, roda em Node ou
              browser, e o Brasil é apenas um locale entre vários. Open source, executa offline,
              sem rate limit.
            </li>
            <li>
              <strong>Use os dois juntos:</strong> Faker.js para o resto (timestamps, UUIDs, nomes
              em outras línguas, custom factories), FakeForge para os campos brasileiros que
              precisam passar em validador oficial.
            </li>
          </ul>
        </div>

        <h2 className="text-xl font-semibold text-foreground mb-4">Tabela comparativa</h2>
        <div className="rounded-xl bg-card border border-border overflow-hidden mb-10">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-card-hover">
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Recurso</th>
                  <th className="text-center px-4 py-3 text-primary font-semibold">FakeForge BR</th>
                  <th className="text-center px-4 py-3 text-muted-foreground font-medium">Faker.js</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {COMPARISON.map(([feature, ff, faker], i) => (
                  <tr key={i}>
                    <td className="px-4 py-2.5 text-muted-foreground">{feature}</td>
                    <td className="px-4 py-2.5 text-center text-primary font-medium">{ff}</td>
                    <td className="px-4 py-2.5 text-center">{faker}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-foreground mt-12 mb-4">
          Quando o Faker.js é melhor
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Três cenários onde a lib JS ganha sem disputa:
        </p>
        <ul className="text-sm text-muted-foreground space-y-2 mb-8 list-disc list-inside">
          <li>
            <strong className="text-foreground">Geração offline ou em pipelines de CI.</strong>{" "}
            Faker.js executa no seu Node sem chamada de rede. Em test suites com milhares de testes
            paralelos, isso elimina latência e rate limit. Você gera 50.000 registros em poucos
            segundos, no próprio runner.
          </li>
          <li>
            <strong className="text-foreground">Projetos internacionais com Brasil como um locale entre vários.</strong>{" "}
            Se o seu app suporta pt-BR, en-US, es-MX e ja-JP, mantém um único stack de fake data.
            FakeForge não tem outros locales, foca só no Brasil.
          </li>
          <li>
            <strong className="text-foreground">Custom factories e correlação manual no código.</strong>{" "}
            Faker.js permite escrever factories ricas combinando providers (nome + email + datas + UUIDs
            + foreign keys) com controle total. FakeForge oferece presets prontos, com menos flexibilidade
            de composição.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground mt-12 mb-4">
          Quando o FakeForge é melhor
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Cinco cenários onde a especialização BR muda o resultado:
        </p>
        <ul className="text-sm text-muted-foreground space-y-2 mb-8 list-disc list-inside">
          <li>
            <strong className="text-foreground">Validação algorítmica nativa.</strong> O locale pt_BR
            do Faker.js gera CPF no formato XXX.XXX.XXX-XX mas os dígitos verificadores são aleatórios.
            Se o seu backend valida via mod-11, esses CPFs falham. FakeForge gera CPF, CNPJ, CNH, PIS
            e título de eleitor que passam em qualquer validador oficial.
          </li>
          <li>
            <strong className="text-foreground">CNPJ alfanumérico de 2026.</strong> A Receita
            Federal vai introduzir CNPJ alfanumérico em 01/07/2026. O Faker.js ainda não suporta o
            novo formato. FakeForge gera CNPJs alfanuméricos válidos hoje, alinhado com a Instrução
            Normativa da Receita.
          </li>
          <li>
            <strong className="text-foreground">PIX no formato BACEN.</strong> 4 tipos de chave
            (CPF, email, telefone +55, EVP UUID v4) com formato exato que passa em validação de PSPs
            como Mercado Pago, PagBank e Stripe Brasil. Faker.js não cobre PIX.
          </li>
          <li>
            <strong className="text-foreground">Time misto dev + QA + produto.</strong> A interface
            web do FakeForge permite que QA manual e PMs gerem dados sem precisar mexer em código.
            Faker.js exige instalação no projeto e código pra cada chamada.
          </li>
          <li>
            <strong className="text-foreground">Dados correlacionados via preset.</strong> Gere
            uma pessoa completa em uma chamada: nome típico brasileiro, email do nome (sem acento),
            CEP que bate com a cidade, DDD que bate com o estado. No Faker.js você compõe isso à
            mão combinando providers, e tem que manter a coerência manualmente.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground mt-12 mb-4">
          Exemplo prático: gerar 100 customers brasileiros válidos
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Cenário comum: popular o banco de staging com 100 customers que tenham CPF que passe em
          mod-11, email coerente com o nome, CEP que bate com o estado e telefone com DDD válido.
        </p>

        <p className="text-sm text-foreground font-semibold mt-6 mb-2">FakeForge:</p>
        <pre className="text-xs bg-card border border-border rounded-lg p-4 overflow-x-auto mb-6">
          <code>{`POST https://fakeforge.com.br/api/generate
{
  "preset": "customer",
  "quantity": 100,
  "format": "sql"
}

// Retorna INSERT INTO customers ... pronto pra executar
// CPF passa em validação mod-11 oficial
// Email = primeironome.sobrenome@gmail.com (acentos removidos)
// CEP bate com estado, bairro bate com cidade
// Telefone +55(DDD)(9XXXX-XXXX) com DDD válido`}</code>
        </pre>

        <p className="text-sm text-foreground font-semibold mt-6 mb-2">Faker.js:</p>
        <pre className="text-xs bg-card border border-border rounded-lg p-4 overflow-x-auto mb-6">
          <code>{`import { faker, fakerPT_BR } from '@faker-js/faker';
import { cpf } from 'cpf-cnpj-validator'; // lib extra pra mod-11

const customers = Array.from({ length: 100 }, () => {
  const nome = fakerPT_BR.person.fullName();
  const [primeiro, sobrenome] = nome.split(' ');
  return {
    nome,
    cpf: cpf.generate(),                            // CPF válido via lib extra
    email: \`\${primeiro}.\${sobrenome}@gmail.com\`.toLowerCase(),
    cep: fakerPT_BR.location.zipCode('#####-###'),  // aleatório, sem checagem estado
    telefone: fakerPT_BR.phone.number(),            // DDD não validado
    estado: fakerPT_BR.location.state(),
  };
});

// CPF passa em mod-11 (graças à lib extra)
// Mas CEP, estado e DDD não estão correlacionados
// Você implementa a coerência manualmente`}</code>
        </pre>

        <p className="text-sm text-muted-foreground leading-relaxed mb-8">
          O Faker.js precisa de uma lib auxiliar para gerar CPF/CNPJ válidos, e a correlação entre
          campos brasileiros (estado, CEP, DDD) fica por sua conta. FakeForge entrega o pacote
          coerente em uma chamada.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-12 mb-4">
          Veredicto honesto
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Faker.js é uma das melhores libs de fake data do ecossistema JS. A questão não é qualidade,
          é foco. Faker.js cobre 60+ locales com profundidade média em cada um. FakeForge cobre um
          locale (Brasil) com profundidade alta, e adiciona validações algorítmicas, PIX, CNH, CIN
          que o Faker.js não pretende cobrir.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Se o seu produto é internacional e o BR é só um mercado entre vários, Faker.js cobre tudo
          razoavelmente bem. Quando o validador BR rejeitar um CPF, troque para FakeForge naquele
          campo específico.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-8">
          A combinação que funciona melhor em times BR: Faker.js para o esqueleto (timestamps, UUIDs,
          números aleatórios, nomes em outras línguas), FakeForge para qualquer campo brasileiro
          que precise passar em validação real.
        </p>

        <div className="rounded-xl bg-primary/5 border border-primary/20 p-5 mt-10">
          <p className="text-sm font-semibold text-foreground mb-2">Próximo passo</p>
          <p className="text-sm text-muted-foreground mb-3">
            Teste o FakeForge agora gratuitamente. Sem cadastro, sem cartão.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/gerador-cpf"
              className="inline-block px-4 py-2 rounded-lg text-sm bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Gerar CPF agora
            </Link>
            <Link
              href="/docs"
              className="inline-block px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground font-medium hover:border-border-hover transition-colors"
            >
              Documentação da API REST
            </Link>
            <Link
              href="/comparacao/fakeforge-vs-alternativas"
              className="inline-block px-4 py-2 rounded-lg text-sm bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors"
            >
              Comparar com Mockaroo, 4devs, fakerbr
            </Link>
          </div>
        </div>
      </article>

      <BreadcrumbSchema
        items={[
          { name: "Início", url: "/" },
          { name: "Comparações", url: "/comparacao/fakeforge-vs-alternativas" },
          { name: "FakeForge vs Faker.js", url: "/comparacao/fakeforge-vs-fakerjs" },
        ]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "FakeForge vs Faker.js: qual usar para dados brasileiros em 2026?",
            description:
              "Comparativo técnico entre FakeForge BR e Faker.js para gerar dados brasileiros de teste.",
            author: {
              "@type": "Organization",
              name: "FakeForge BR",
              url: "https://fakeforge.com.br",
            },
            publisher: {
              "@type": "Organization",
              name: "FakeForge BR",
              url: "https://fakeforge.com.br",
            },
            datePublished: "2026-05-25",
            dateModified: "2026-05-25",
            inLanguage: "pt-BR",
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": "https://fakeforge.com.br/comparacao/fakeforge-vs-fakerjs",
            },
          }),
        }}
      />
    </PageShell>
  );
}
