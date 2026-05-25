import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "FakeForge vs Faker (Python): qual usar para dados brasileiros?",
  description:
    "Comparativo técnico entre FakeForge BR e a lib Faker do Python (locale pt_BR). CPF/CNPJ mod-11, CNPJ alfanumérico, PIX BACEN, CIN, dados correlacionados, API vs pip install. Quando usar cada um.",
  keywords:
    "fakeforge vs faker python, faker python brasileiro, faker pt_BR cpf, faker python cnpj, alternativa faker python brasil, faker pt_BR pix",
  alternates: { canonical: "/comparacao/fakeforge-vs-faker-py" },
  openGraph: {
    title: "FakeForge vs Faker (Python): comparação para dados brasileiros",
    description:
      "Faker.py tem locale pt_BR com CPF e CNPJ válidos via mod-11. FakeForge cobre CNPJ alfanumérico, PIX BACEN, CIN e dados correlacionados. Quando usar cada um.",
    type: "article",
  },
};

const COMPARISON: [string, string, string][] = [
  ["CPF passa em mod-11", "✓ nativo", "✓ via provider brazil"],
  ["CNPJ passa em mod-11", "✓ nativo", "✓ via provider brazil"],
  ["CNPJ Alfanumérico (2026)", "✓", "Não suportado"],
  ["CIN (novo RG biométrico)", "✓", "Não suportado"],
  ["CNH válida (DENATRAN)", "✓", "Não suportado"],
  ["Chave PIX (4 tipos BACEN)", "✓", "Não suportado"],
  ["RG por estado", "✓", "Apenas RG genérico"],
  ["Título de eleitor (TSE)", "✓", "Não suportado"],
  ["PIS/PASEP (mod-11)", "✓", "Não suportado"],
  ["Cartão de crédito (Luhn + bandeira BR)", "✓ Visa/Master/Elo/Hiper/Amex", "Genérico, sem Elo/Hiper"],
  ["CEP coerente por estado", "✓ 10 estados", "CEP aleatório, não bate com estado"],
  ["Bairros e cidades reais", "✓", "Lista pt_BR limitada"],
  ["Nomes brasileiros típicos", "✓ 125+ nomes", "Locale pt_BR completo"],
  ["Telefone com DDD válido", "✓ 67 DDDs", "Formato pt_BR sem validar DDD"],
  ["Placa Mercosul + antiga", "✓ ambos formatos", "Apenas formato antigo"],
  ["Dados correlacionados (preset pessoa completa)", "✓ via API", "Você compõe via factory"],
  ["Forma de uso", "API REST + UI web", "pip install + import"],
  ["Setup necessário", "Zero (chamada HTTP)", "Python env + pip install Faker"],
  ["Plano gratuito", "100 chamadas/dia (API), web ilimitado", "Grátis e open source"],
  ["Plano pago", "R$ 29/mês (Dev)", "Não tem"],
  ["Export SQL pronto", "✓ INSERT INTO direto", "Você escreve o SQL"],
  ["Export JSON/CSV", "✓", "Não nativo, você serializa"],
  ["Roda offline", "Não (API hospedada)", "✓ no seu Python"],
  ["Interface em português", "✓", "Apenas docs em inglês"],
];

export default function ComparacaoFakerPy() {
  return (
    <PageShell>
      <article className="max-w-3xl">
        <div className="mb-10">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Comparativo · 2026
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            FakeForge vs <span className="text-primary">Faker (Python)</span>
          </h1>
          <p className="text-muted-foreground mt-4 text-sm sm:text-base leading-relaxed">
            Faker (Python) é a biblioteca de fake data mais popular do ecossistema Python, mantida
            ativamente desde 2012. O locale pt_BR cobre nomes, endereços, telefones e gera CPF e
            CNPJ válidos via mod-11. FakeForge é uma API hospedada com cobertura mais ampla do
            mercado brasileiro: PIX BACEN, CNH DENATRAN, CIN, CNPJ alfanumérico, e dados
            correlacionados em uma única chamada. Este comparativo cobre quando vale usar cada um.
          </p>
        </div>

        <div className="rounded-xl bg-primary/5 border border-primary/20 p-5 mb-10">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">TL;DR</p>
          <ul className="text-sm space-y-1.5 text-foreground">
            <li>
              <strong>Use FakeForge se:</strong> precisa de PIX BACEN, CNH, CIN, CNPJ alfanumérico
              ou dados correlacionados, ou quer uma API REST sem instalar dependências.
            </li>
            <li>
              <strong>Use Faker (Python) se:</strong> seu projeto é Python (Django, FastAPI, Flask),
              precisa de geração offline em test suite, ou só usa CPF, CNPJ, nomes e endereços
              básicos brasileiros.
            </li>
            <li>
              <strong>Use os dois juntos:</strong> Faker para factories em pytest (timestamps, UUIDs,
              foreign keys, nomes em outras línguas), FakeForge para PIX, CNH, CIN e qualquer
              campo BR que o Faker não cobre.
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
                  <th className="text-center px-4 py-3 text-muted-foreground font-medium">Faker (Python)</th>
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
          Quando o Faker (Python) é melhor
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Três cenários onde a lib Python ganha sem disputa:
        </p>
        <ul className="text-sm text-muted-foreground space-y-2 mb-8 list-disc list-inside">
          <li>
            <strong className="text-foreground">Test suites pytest com factories ricas.</strong>{" "}
            Faker integra direto com pytest-factoryboy, model_bakery (Django) e factory_boy. Cria
            factories tipadas, com seeds determinísticos, e gera milhares de registros sem chamada
            de rede. Em pipeline de CI com testes paralelos, isso elimina latência e rate limit.
          </li>
          <li>
            <strong className="text-foreground">Projetos internacionais com Brasil como um locale entre vários.</strong>{" "}
            Se o seu app suporta pt-BR, en-US, es-MX e ja-JP, mantém um único stack de fake data.
            FakeForge cobre apenas Brasil.
          </li>
          <li>
            <strong className="text-foreground">Ambientes air-gapped ou sem acesso à internet.</strong>{" "}
            Bancos, governo e indústria às vezes operam em redes isoladas. Faker roda 100% offline
            depois do pip install. FakeForge precisa de chamada HTTPS para fakeforge.com.br.
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
            <strong className="text-foreground">Cobertura BR ampla além de CPF e CNPJ.</strong>{" "}
            Faker pt_BR cobre CPF, CNPJ, nomes, endereços, RG e telefones. Não cobre PIX (4 tipos
            BACEN), CNH (DENATRAN), CIN (novo RG biométrico), título de eleitor (TSE), PIS/PASEP,
            placa Mercosul, cartão Elo e Hipercard. FakeForge cobre tudo isso.
          </li>
          <li>
            <strong className="text-foreground">CNPJ alfanumérico de 2026.</strong> A Receita
            Federal vai introduzir CNPJ alfanumérico em 01/07/2026 (Instrução Normativa 2.229).
            O Faker pt_BR ainda não cobre o novo formato. FakeForge gera CNPJs alfanuméricos
            válidos hoje.
          </li>
          <li>
            <strong className="text-foreground">Dados correlacionados em uma chamada.</strong>{" "}
            FakeForge preset &quot;customer&quot; devolve pessoa coerente: nome típico brasileiro,
            email derivado do nome (sem acento), CEP que bate com a cidade, DDD que bate com o
            estado, cartão com nome do titular. No Faker você compõe isso à mão usando providers
            isolados e mantém a coerência por código.
          </li>
          <li>
            <strong className="text-foreground">Times mistos (dev + QA manual + produto).</strong>{" "}
            A interface web do FakeForge permite que QAs manuais, PMs e analistas gerem dados sem
            tocar em Python. Faker exige código.
          </li>
          <li>
            <strong className="text-foreground">Export SQL pronto.</strong> FakeForge devolve
            INSERT INTO direto para o seu schema. No Faker, você escreve o INSERT à mão ou usa
            ORM (Django/SQLAlchemy), o que adiciona ~20 linhas de código por entidade.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground mt-12 mb-4">
          Exemplo prático: gerar 100 customers brasileiros válidos
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Cenário comum: popular o banco de staging com 100 customers que tenham CPF válido,
          email coerente com o nome, CEP que bate com o estado, telefone com DDD certo, e chave
          PIX no formato BACEN.
        </p>

        <p className="text-sm text-foreground font-semibold mt-6 mb-2">FakeForge:</p>
        <pre className="text-xs bg-card border border-border rounded-lg p-4 overflow-x-auto mb-6">
          <code>{`POST https://fakeforge.com.br/api/generate
{
  "preset": "customer_pix",
  "quantity": 100,
  "format": "sql"
}

// Retorna INSERT INTO customers ... com PIX no padrão BACEN
// CPF passa em validação mod-11
// Email derivado do nome, CEP bate com cidade, DDD bate com estado
// Chave PIX é UUID v4 ou +55(DDD)(9XXXX-XXXX)`}</code>
        </pre>

        <p className="text-sm text-foreground font-semibold mt-6 mb-2">Faker (Python):</p>
        <pre className="text-xs bg-card border border-border rounded-lg p-4 overflow-x-auto mb-6">
          <code>{`from faker import Faker
import uuid

fake = Faker('pt_BR')
customers = []

for _ in range(100):
    nome = fake.name()
    primeiro, *_, sobrenome = nome.split()
    customers.append({
        'nome': nome,
        'cpf': fake.cpf(),
        'cnpj': fake.cnpj(),
        'email': f'{primeiro}.{sobrenome}@gmail.com'.lower(),
        'cep': fake.postcode(),                  # aleatório, sem checar estado
        'estado': fake.estado_sigla(),
        'telefone': fake.phone_number(),         # DDD não validado
        'pix_key': str(uuid.uuid4()),            # você gera manualmente
    })

// CPF e CNPJ passam em mod-11
// CEP, estado e DDD não estão correlacionados
// PIX você implementa à mão (UUID v4 ou +55... ou email)
// Sem CNH, sem CIN, sem cartão Elo/Hipercard`}</code>
        </pre>

        <p className="text-sm text-muted-foreground leading-relaxed mb-8">
          O Faker resolve bem CPF, CNPJ e nomes. PIX, correlação de CEP/estado/DDD e validações
          extras (CNH, CIN) ficam por sua conta. Em projetos pequenos isso é gerenciável, em
          projetos com 20+ campos brasileiros o trabalho braçal acumula.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-12 mb-4">
          Veredicto honesto
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Faker (Python) é uma escolha sólida e está em quase todo projeto Python que precisa de
          dados de teste. CPF e CNPJ válidos no locale pt_BR cobrem o caso mais comum. Quando o
          projeto BR cresce em complexidade (PIX, CNH, CIN, cartão Elo, dados correlacionados),
          o Faker começa a exigir glue code que vira manutenção.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          FakeForge não pretende substituir Faker em projeto Python. Substitui apenas onde o Faker
          não cobre: PIX BACEN, CNH DENATRAN, CIN, CNPJ alfanumérico, e a correlação coerente entre
          campos.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-8">
          A combinação prática em times Python BR: Faker no pytest para o esqueleto (timestamps,
          UUIDs, foreign keys, nomes), FakeForge para qualquer campo brasileiro que precise passar
          em validação real ou que tenha formato novo (CNPJ alfanumérico, CIN).
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
              Comparar com Mockaroo, Faker.js, 4devs
            </Link>
          </div>
        </div>
      </article>

      <BreadcrumbSchema
        items={[
          { name: "Início", url: "/" },
          { name: "Comparações", url: "/comparacao/fakeforge-vs-alternativas" },
          { name: "FakeForge vs Faker (Python)", url: "/comparacao/fakeforge-vs-faker-py" },
        ]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "FakeForge vs Faker (Python): qual usar para dados brasileiros?",
            description:
              "Comparativo técnico entre FakeForge BR e Faker (Python) para gerar dados brasileiros de teste.",
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
              "@id": "https://fakeforge.com.br/comparacao/fakeforge-vs-faker-py",
            },
          }),
        }}
      />
    </PageShell>
  );
}
