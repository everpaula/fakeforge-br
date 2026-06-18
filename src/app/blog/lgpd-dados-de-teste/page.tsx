import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BlogFeaturedImage from "@/components/BlogFeaturedImage";
import ShareBar from "@/components/ShareBar";
import BlogPostingSchema from "@/components/BlogPostingSchema";

export const metadata: Metadata = {
  title: "LGPD e dados de teste: o que todo dev precisa saber",
  description: "A LGPD proíbe o uso de dados pessoais reais em ambientes de desenvolvimento. Entenda os riscos e como usar dados fictícios para se adequar à lei.",
  keywords: "lgpd dados de teste, lgpd desenvolvimento, dados fictícios lgpd, proteção de dados teste, lei geral proteção dados",
  openGraph: {
    title: "LGPD e dados de teste: o que todo dev precisa saber",
    description: "Guia sobre como a LGPD afeta o uso de dados em ambientes de desenvolvimento e teste.",
    type: "article",
    images: ["/api/og?title=LGPD%20e%20dados%20de%20teste%3A%20o%20que%20todo%20dev%20precisa%20saber&subtitle=Guia%20sobre%20como%20a%20LGPD%20afeta%20o%20uso%20de%20dados%20em%20ambientes%20de%20desenvolvimento%20e%20teste.&category=LGPD"],
  },
};

export default function Post() {
  return (
    <PageShell>
      <article className="max-w-2xl">
        <Link href="/blog" className="text-xs text-primary hover:underline mb-4 inline-block">
          ← Voltar ao blog
        </Link>
        <BlogFeaturedImage category="LGPD" title="LGPD e dados de teste: o que todo dev precisa saber" className="mb-6" />
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
            LGPD e dados de teste: o que todo dev precisa saber
          </h1>
          <div className="flex items-center gap-3 text-xs text-muted mt-3">
            <time>08 de abril de 2026</time>
            <span>·</span>
            <span>6 min de leitura</span>
          </div>
        </div>

        <div className="prose-custom space-y-6 text-sm text-muted-foreground leading-relaxed">
          <p>
            A Lei Geral de Proteção de Dados (LGPD) entrou em vigor em 2020 e mudou a forma como empresas
            brasileiras tratam dados pessoais. Mas muitos times de desenvolvimento ainda usam dados reais
            em ambientes de teste e staging — frequentemente sem perceber que isso é uma violação.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">O que a LGPD diz sobre dados de teste?</h2>
          <p>
            A LGPD (Lei 13.709/2018) se aplica a qualquer operação de tratamento de dados pessoais,
            independente do ambiente. Isso inclui:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li><strong className="text-foreground">Ambiente de desenvolvimento</strong> — seu localhost, bancos de dados locais</li>
            <li><strong className="text-foreground">Staging/homologação</strong> — servidores compartilhados entre equipe</li>
            <li><strong className="text-foreground">CI/CD pipelines</strong> — testes automatizados que rodam em cada commit</li>
            <li><strong className="text-foreground">Demos e treinamentos</strong> — apresentações com dados de exemplo</li>
          </ul>
          <p>
            Se o dado identifica ou pode identificar uma pessoa real (nome, CPF, email, telefone, endereço),
            a LGPD se aplica. Não importa se é &quot;só para teste&quot;.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Os riscos reais</h2>
          <p>Usar dados pessoais reais em ambientes de teste cria riscos concretos:</p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li><strong className="text-foreground">Dumps de banco vazam.</strong> Backups de staging acabam em S3 buckets públicos, repositórios Git, ou Slack channels.</li>
            <li><strong className="text-foreground">Logs capturam dados.</strong> Ferramentas de monitoramento como Sentry, Datadog e CloudWatch registram payloads com dados reais.</li>
            <li><strong className="text-foreground">Ambientes são compartilhados.</strong> Estagiários, terceiros e ferramentas de CI têm acesso a ambientes de teste.</li>
            <li><strong className="text-foreground">Multas são reais.</strong> A ANPD pode aplicar multas de até 2% do faturamento, limitado a R$50 milhões por infração.</li>
          </ul>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">A solução: dados sintéticos</h2>
          <p>
            Dados sintéticos (ou fictícios) são dados que parecem reais mas não pertencem a ninguém.
            Um CPF gerado algoritmicamente passa na validação mod-11 mas não está cadastrado na Receita Federal.
            Um nome como &quot;Aline Teixeira Andrade&quot; pode existir no mundo real, mas o registro gerado
            (nome + CPF + email + endereço combinados) não corresponde a nenhuma pessoa.
          </p>
          <p>
            Benefícios de usar dados sintéticos:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>Conformidade total com a LGPD — sem dados pessoais, sem obrigação legal</li>
            <li>Testes mais realistas — dados no formato correto, com validações passando</li>
            <li>Sem risco de vazamento — se o dump vazar, nenhuma pessoa é afetada</li>
            <li>Facilidade de geração em massa — API gera milhares de registros em segundos</li>
          </ul>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Como implementar na prática</h2>
          <ol className="list-decimal list-inside space-y-3 pl-2">
            <li>
              <strong className="text-foreground">Substitua dumps de produção por dados sintéticos.</strong>{" "}
              Em vez de copiar o banco de produção para staging, gere dados fictícios com a mesma estrutura.
            </li>
            <li>
              <strong className="text-foreground">Integre no CI/CD.</strong>{" "}
              Use a <Link href="/docs" className="text-primary hover:underline">API do FakeForge</Link> para
              popular o banco antes de cada suíte de testes.
            </li>
            <li>
              <strong className="text-foreground">Use presets correlacionados.</strong>{" "}
              O <Link href="/docs" className="text-primary hover:underline">preset &quot;customer&quot;</Link> gera
              nome + CPF + email + telefone + endereço onde o email bate com o nome — dados coerentes entre si.
            </li>
            <li>
              <strong className="text-foreground">Documente a prática.</strong>{" "}
              Inclua no README do projeto que dados de teste são sintéticos e como gerá-los.
            </li>
          </ol>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Resumo</h2>
          <div className="rounded-xl bg-card border border-border p-5">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-danger shrink-0">✕</span>
                <span>Copiar banco de produção para staging</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-danger shrink-0">✕</span>
                <span>Usar seu CPF ou de colegas em testes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-danger shrink-0">✕</span>
                <span>Hardcodar dados reais em fixtures de teste</span>
              </li>
              <li className="flex items-start gap-2 mt-3">
                <span className="text-success shrink-0">✓</span>
                <span>Gerar dados sintéticos com validação correta</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success shrink-0">✓</span>
                <span>Usar API para popular banco de teste automaticamente</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success shrink-0">✓</span>
                <span>Dados correlacionados (nome ↔ email ↔ CPF)</span>
              </li>
            </ul>
          </div>
        </div>
        <ShareBar title={"LGPD e dados de teste: o que todo dev precisa saber"} path="/blog/lgpd-dados-de-teste" />
        <BlogPostingSchema
          title={"LGPD e dados de teste: o que todo dev precisa saber"}
          slug="lgpd-dados-de-teste"
          description={"A LGPD proíbe o uso de dados pessoais reais em ambientes de desenvolvimento. Entenda os riscos e como usar dados fictícios para se adequar à lei."}
          datePublished="2026-04-15"
          image="https://fakeforge.com.br/api/og?title=LGPD%20e%20dados%20de%20teste%3A%20o%20que%20todo%20dev%20precisa%20saber&subtitle=Guia%20sobre%20como%20a%20LGPD%20afeta%20o%20uso%20de%20dados%20em%20ambientes%20de%20desenvolvimento%20e%20teste.&category=LGPD"
        />
      </article>
    </PageShell>
  );
}
