import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BlogFeaturedImage from "@/components/BlogFeaturedImage";
import ShareBar from "@/components/ShareBar";

export const metadata: Metadata = {
  title: "Dados Sintéticos BR: Gerador LGPD-safe pra Dev, ML e QA",
  description:
    "FakeForge é a primeira ferramenta brasileira de dados sintéticos: CPF/CNPJ validados mod-11, correlação de campos, API REST, LGPD-safe. Grátis 50 chamadas/dia.",
  keywords:
    "dados sintéticos, gerador dados sintéticos brasil, dados sintéticos LGPD, synthetic data, machine learning dados, ML training data, data scientist, QA testing, compliance dados",
  openGraph: {
    title: "Dados Sintéticos BR: Gerador LGPD-safe pra Dev, ML e QA",
    description:
      "Dados sintéticos são informações geradas artificialmente sem risco de re-identificação. FakeForge gera CPF/CNPJ válidos, correlaciona campos, em compliance LGPD.",
    type: "article",
    images: [
      "/api/og?title=Dados%20Sintéticos&subtitle=Gerador%20LGPD-safe%20pra%20Dev%20e%20ML&category=SYNTHETIC%20DATA",
    ],
  },
  alternates: {
    canonical: "/dados-sinteticos",
  },
};

export default function Page() {
  return (
    <PageShell>
      <article className="max-w-2xl">
        <Link
          href="/"
          className="text-xs text-primary hover:underline mb-4 inline-block"
        >
          ← Voltar ao início
        </Link>
        <BlogFeaturedImage
          category="Synthetic Data"
          title="Dados Sintéticos BR: Gerador LGPD-safe pra Dev, ML e QA"
          className="mb-6"
        />
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
            Dados Sintéticos pra Mercado Brasileiro
          </h1>
          <div className="flex items-center gap-3 text-xs text-muted mt-3">
            <time>1º de outubro de 2026</time>
            <span>·</span>
            <span>Ferramenta</span>
          </div>
        </div>

        <div className="prose-custom space-y-2 text-sm text-muted-foreground leading-relaxed">
          <p className="mb-4">
            <strong>Dados sintéticos</strong> são informações geradas artificialmente que mantêm características estatísticas de dados reais, mas sem conter nenhuma referência a pessoa real. FakeForge gera CPF e CNPJ válidos pelo módulo-11 da Receita Federal, correlacionando nome, email, telefone e endereço, em compliance total com LGPD por definição. Não é cópia de dados de produção. Não é anonimização fraca. É geração do zero, algoritmo validado.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            O que diferencia dados sintéticos de outras técnicas
          </h2>

          <div className="rounded-lg bg-card border border-border overflow-x-auto my-4">
            <table className="w-full text-sm">
              <thead className="bg-card-hover">
                <tr>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                    Técnica
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                    Exemplo
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                    Status LGPD
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                    Risco re-identificação
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-3 py-2 text-muted-foreground">
                    Dados reais em dev
                  </td>
                  <td className="px-3 py-2">CPF do cliente real</td>
                  <td className="px-3 py-2">
                    <span className="text-red-600 font-medium">Dado pessoal</span>
                  </td>
                  <td className="px-3 py-2 text-red-600">Alto</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-muted-foreground">
                    Pseudonimização
                  </td>
                  <td className="px-3 py-2">Hash do CPF</td>
                  <td className="px-3 py-2">
                    <span className="text-yellow-600 font-medium">Pessoal</span>
                  </td>
                  <td className="px-3 py-2 text-yellow-600">Médio</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-muted-foreground">
                    Anonimização fraca
                  </td>
                  <td className="px-3 py-2">Trunca campos</td>
                  <td className="px-3 py-2">
                    <span className="text-yellow-600 font-medium">Depende</span>
                  </td>
                  <td className="px-3 py-2 text-yellow-600">Médio</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-muted-foreground">
                    Anonimização forte
                  </td>
                  <td className="px-3 py-2">k-anonymity</td>
                  <td className="px-3 py-2">
                    <span className="text-green-600 font-medium">Fora LGPD</span>
                  </td>
                  <td className="px-3 py-2 text-green-600">Baixo</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-foreground font-semibold">
                    Dado sintético
                  </td>
                  <td className="px-3 py-2 font-semibold">Gerado do zero</td>
                  <td className="px-3 py-2">
                    <span className="text-green-600 font-semibold">Nunca foi pessoal</span>
                  </td>
                  <td className="px-3 py-2 text-green-600 font-semibold">Zero</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-xs text-muted-foreground italic">
            Nota: LGPD Art. 12, § 2º classifica como anonimizado apenas dado cuja re-identificação é "inviável por esforço técnico ordinário". Dados sintéticos atendem esse critério por não terem origem pessoal.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            Por que Brasil precisa de dados sintéticos agora
          </h2>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            1. Multas LGPD crescendo
          </h3>

          <p className="mb-4">
            A Autoridade Nacional de Proteção de Dados (ANPD) vem autuando empresas desde 2022. Multa por copiar dados reais para ambiente de teste sem consentimento pode chegar a R$50 milhões. Dados sintéticos eliminam esse risco completamente.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            2. CNPJ Alfanumérico em 2026
          </h3>

          <p className="mb-4">
            A Instrução Normativa RFB 2.237/2024 permite letras nas primeiras oito posições de CNPJ a partir de julho de 2026. Seus testes precisam cobrir esse novo formato agora. FakeForge já gera CNPJ alfanumérico. Dados sintéticos permitem escalar testes sem esperar entrada de dados reais em produção.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            3. AI e ML exigem diversidade massiva
          </h3>

          <p className="mb-4">
            Treinar modelos de classificação, regressão ou ranking exige milhares de exemplos. Dados reais em quantidade dessa escala enfrentam barreiras LGPD e custo de desidentificação. Dados sintéticos resolvem: gere 1 milhão de exemplos correlacionados, com distribuição controlada, em segundos.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            Casos de uso por persona
          </h2>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Dev Backend
          </h3>

          <p className="mb-4">
            Seed de staging com CPF/CNPJ validados, seed de fixtures em CI/CD, testes de integração com sistemas de pagamento que rejeitam dados inválidos. FakeForge API REST integra em qualquer pipeline.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            QA Engineer
          </h3>

          <p className="mb-4">
            Teste de Behavior Driven Development (BDD) com massa de dados correlacionados. Um QA coloca 1000 registros em segundos sem coordenar com backend. Reduz ciclo de preparação de ambiente em horas.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Data Scientist / ML Engineer
          </h3>

          <p className="mb-4">
            Augmentação de dataset para treinamento, baseline antes de dados reais, testes de robustez contra distribuições adversárias, prototipagem de pipelines sem esperar aprovação de compliance. FakeForge SDK em Python + Node facilita loop rápido.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Pesquisador de Mercado
          </h3>

          <p className="mb-4">
            Gerar personas sintéticas com perfil demográfico controlado, executar surveys com respondentes fictícios, mapear segmentação de mercado antes de coleta real. Reduz custo de prototipagem de pesquisa.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            DPO / Compliance
          </h3>

          <p className="mb-4">
            Ferramenta de referência para times de dados. Documentação LGPD pronta, logs auditáveis, sem armazenamento de dados reais. Prova de controle em auditorias.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Product Manager
          </h3>

          <p className="mb-4">
            Prototipar fluxos com dados realistas sem riscos de privacidade. Demonstrar features a stakeholders com base de dados completa. Acelerar feedback de mockups.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            Como funciona o FakeForge
          </h2>

          <p className="mb-4">
            FakeForge gera dados validados em três etapas:
          </p>

          <ol className="text-sm text-muted-foreground space-y-2 mb-4 list-decimal list-inside">
            <li>
              <strong className="text-foreground">Algoritmo de geração:</strong> Cria número aleatório dentro de regras (ex: CPF tem 11 dígitos, primeira posição não é zero).
            </li>
            <li>
              <strong className="text-foreground">Validação mod-11:</strong> Calcula dígitos verificadores conforme algoritmo oficial da Receita Federal. Garantia de passagem em validadores reais.
            </li>
            <li>
              <strong className="text-foreground">Correlação de campos:</strong> Nome, email, telefone, CEP e cidade são correlacionados — nenhum erro de "São Paulo com CEP do Paraná".
            </li>
          </ol>

          <p className="text-sm text-muted-foreground mb-8">
            Resultado: dados prontos para integrar em pipeline, banco de dados, testes. Sem configuração manual. Sem checagem de validação. Sem surpresas em produção.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Exemplo: Bash
          </h3>

          <pre className="text-xs bg-background border border-border rounded-lg p-4 overflow-x-auto mb-4 font-mono">
            <code>{`# Gerar 100 CPFs válidos em JSON
curl -X GET "https://fakeforge.com.br/api/generate?type=cpf&quantity=100&format=json" \\
  -H "Authorization: Bearer seu_token_aqui"

# Resposta (trecho):
{
  "data": [
    {
      "cpf": "123.456.789-09",
      "valido": true,
      "modulo_11": true
    },
    ...
  ]
}`}</code>
          </pre>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Exemplo: Python
          </h3>

          <pre className="text-xs bg-background border border-border rounded-lg p-4 overflow-x-auto mb-4 font-mono">
            <code>{`from fakeforge import generate

# Gerar 50 pessoas com CPF, email, telefone correlacionados
pessoas = generate(
    type="pessoa",
    quantity=50,
    format="dict"
)

for pessoa in pessoas:
    print(f"{pessoa['nome']} - {pessoa['cpf']} - {pessoa['email']}")

# Resultado:
# João Silva - 123.456.789-09 - joao.silva.123456789@outlook.com
# Maria Santos - 987.654.321-00 - maria.santos.987654321@gmail.com`}</code>
          </pre>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            FAQ
          </h2>

          <div className="space-y-3">
            <details className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">
                  O que são dados sintéticos exatamente?
                </span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">
                  +
                </span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">
                Dados sintéticos são números, textos e outros valores gerados por algoritmo, que nunca foram pessoais. Diferente de anonimização (remover referência de dado real) ou pseudonimização (usar hash), dados sintéticos nascem do zero sem vínculo com pessoa real. Pela LGPD, não são dados pessoais e podem ser usados livremente em desenvolvimento, teste e treinamento de modelos.
              </p>
            </details>

            <details className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">
                  Dados sintéticos valem pra treinar modelos de IA?
                </span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">
                  +
                </span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">
                Sim, com ressalva. Modelos treinados com sintéticos aprendem o padrão correlacionado gerado (por exemplo, correlação entre CEP e cidade). Para tarefa simples (classificação por campo), é suficiente. Para padrão complexo (detecção de fraude, previsão de churn), o modelo pode sofrer degradação se distribuição sintética não capturar anomalias reais. Solução: usar sintéticos para prototipagem rápida, depois validar com subset real antes de produção.
              </p>
            </details>

            <details className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">
                  FakeForge gera dados estatisticamente realistas?
                </span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">
                  +
                </span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">
                Sim, em escopo correlacionado. FakeForge respeita coerência geográfica (CEP sempre bate com cidade/estado), validação de checksum (CPF passa em mod-11), padrão de distribuição de DDD (telefones da região usada). Não replicamos distribuição real de renda ou comportamento — é tarefa de ferramentas especializadas em sintético avançado (Tonic.ai, Syntho.ai). Para teste, QA e prototipagem, o nível de realismo de FakeForge é suficiente.
              </p>
            </details>

            <details className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">
                  Como integrar dados sintéticos no pipeline CI/CD?
                </span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">
                  +
                </span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">
                Seu CI/CD chama endpoint FakeForge via API REST, recebe dados em JSON/CSV/SQL, importa direto no banco de teste, roda suite de testes. Exemplo em GitHub Actions: fazer POST para /api/generate antes de cada step de teste. Latência: 200-500ms para gerar 1000 registros. Rate limit no plano gratuito (100 chamadas/dia) é suficiente para pipeline que roda 2-3 vezes/dia. Upgrade para R$29/mês para 10 mil chamadas/dia se escalar.
              </p>
            </details>

            <details className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">
                  Dados sintéticos substituem completamente dados reais em teste?
                </span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">
                  +
                </span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">
                Em 80% dos casos, sim: desenvolvimento, CI/CD, teste unitário, teste de integração de API. Mas há exceções: teste de performance contra carga real (dados sintéticos em volume pequeno não capturam padrão de acesso de usuários reais), teste de conformidade regulatória (precisa dados real anonimizados para auditoria), validação de experiência do usuário (dados sintéticos podem parecer artificiais em UI). Recomendação: use sintéticos em tudo, 1-2x por mês rode teste com subset real anonimizado.
              </p>
            </details>

            <details className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">
                  Qual é o custo mensal de usar dados sintéticos?
                </span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">
                  +
                </span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">
                FakeForge grátis: 100 chamadas/dia. Plano Dev: R$29/mês com 10 mil chamadas/dia (300k/mês). Plano Scale: R$299/mês com 100 mil chamadas/dia. Para comparação: anonimização via serviço externo custa R$500-2000/mês por volume. Dados sintéticos são 10x mais baratos porque não requerem pipeline de desidentificação — você apenas gera.
              </p>
            </details>
          </div>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            Próximas ações
          </h2>

          <p className="text-sm text-muted-foreground mb-4">
            Comece gerando dados agora. Sem cadastro. Sem cartão.
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            <Link
              href="/gerador-cpf"
              className="inline-block px-4 py-2 rounded-lg text-sm bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Gerar CPF sintético agora
            </Link>
            <Link
              href="/gerador-pessoa"
              className="inline-block px-4 py-2 rounded-lg text-sm bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Gerar pessoa completa
            </Link>
            <Link
              href="/docs"
              className="inline-block px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground font-medium hover:border-border-hover transition-colors"
            >
              Documentação API
            </Link>
            <Link
              href="/pricing"
              className="inline-block px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground font-medium hover:border-border-hover transition-colors"
            >
              Planos e preços
            </Link>
          </div>

          <div className="rounded-lg bg-primary/5 border border-primary/20 p-5">
            <p className="text-sm font-semibold text-foreground mb-2">
              Assinado por
            </p>
            <p className="text-sm text-muted-foreground">
              Everton, fundador do FakeForge
            </p>
          </div>
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Conteúdo relacionado
          </h2>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
            <li>
              <Link
                href="/blog/lgpd-dados-teste-desenvolvimento-guia-completo-devs-brasileiros"
                className="text-primary hover:underline"
              >
                LGPD e dados de teste: guia completo pra devs
              </Link>
            </li>
            <li>
              <Link
                href="/blog/mockaroo-vs-fakeforge-qual-escolher-times-brasileiros"
                className="text-primary hover:underline"
              >
                Mockaroo vs FakeForge: qual escolher
              </Link>
            </li>
            <li>
              <Link
                href="/blog/anonimizacao-vs-pseudonimizacao-lgpd-developers"
                className="text-primary hover:underline"
              >
                Anonimização vs pseudonimização na LGPD
              </Link>
            </li>
            <li>
              <Link
                href="/blog/automatizar-dados-teste-ci-cd"
                className="text-primary hover:underline"
              >
                Automatizar dados de teste em CI/CD
              </Link>
            </li>
          </ul>
        </section>

        <ShareBar
          title="Dados Sintéticos BR: Gerador LGPD-safe pra Dev, ML e QA"
          path="/dados-sinteticos"
        />
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "O que são dados sintéticos exatamente?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Dados sintéticos são números, textos e outros valores gerados por algoritmo, que nunca foram pessoais. Diferente de anonimização ou pseudonimização, dados sintéticos nascem do zero sem vínculo com pessoa real.",
                },
              },
              {
                "@type": "Question",
                name: "Dados sintéticos valem pra treinar modelos de IA?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Sim, com ressalva. Modelos treinados com sintéticos aprendem o padrão correlacionado. Para tarefa simples, é suficiente. Para padrão complexo, valide depois com subset real.",
                },
              },
              {
                "@type": "Question",
                name: "FakeForge gera dados estatisticamente realistas?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Sim, em escopo correlacionado. FakeForge respeita coerência geográfica, validação de checksum, padrão de distribuição. Para teste e prototipagem, o nível é suficiente.",
                },
              },
              {
                "@type": "Question",
                name: "Como integrar dados sintéticos no pipeline CI/CD?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Seu CI/CD chama endpoint FakeForge via API REST antes de cada step de teste. Latência: 200-500ms para gerar 1000 registros.",
                },
              },
              {
                "@type": "Question",
                name: "Dados sintéticos substituem completamente dados reais em teste?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Em 80% dos casos, sim. Exceções: teste de performance contra carga real, conformidade regulatória, validação de experiência de usuário.",
                },
              },
              {
                "@type": "Question",
                name: "Qual é o custo mensal de usar dados sintéticos?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "FakeForge grátis: 100 chamadas/dia. Plano Dev: R$29/mês com 10 mil chamadas/dia. Dados sintéticos são 10x mais baratos que anonimização via serviço externo.",
                },
              },
            ],
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "FakeForge",
                item: "https://fakeforge.com.br",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Dados Sintéticos",
                item: "https://fakeforge.com.br/dados-sinteticos",
              },
            ],
          }),
        }}
      />
    </PageShell>
  );
}
