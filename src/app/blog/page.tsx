import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import NewsletterCapture from "@/components/NewsletterCapture";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Blog FakeForge BR — Artigos sobre Dados de Teste, LGPD e Automação",
  description: "Artigos práticos sobre geração de dados brasileiros para testes: CPF/CNPJ válido, LGPD em ambiente de desenvolvimento, seed de banco de dados, automação no CI/CD e comparativos de ferramentas.",
  keywords: "blog dados teste, lgpd desenvolvimento, gerar cpf testes, cnpj validacao node, faker brasileiro, seed banco dados",
  alternates: { canonical: "/blog" },
};

const POSTS = [
  {
    slug: "fakeforge-vs-fakerjs-vs-4devs",
    title: "FakeForge vs Faker.js vs 4devs: qual usar para dados brasileiros?",
    excerpt: "Comparativo honesto entre os principais geradores de dados fake brasileiros. Acurácia, API, formatos de export e quando usar cada um.",
    date: "2026-04-10",
    readTime: "8 min",
    category: "Comparativos",
  },
  {
    slug: "popular-banco-dados-ficticios",
    title: "Como popular banco de dados com dados fictícios brasileiros",
    excerpt: "Guia prático para seed de bancos com CPF, CNPJ, nomes e endereços brasileiros. Exemplos com SQL, Laravel, Prisma e Django.",
    date: "2026-04-10",
    readTime: "7 min",
    category: "Tutoriais",
  },
  {
    slug: "testar-pix-desenvolvimento",
    title: "Como testar pagamento PIX em ambiente de desenvolvimento",
    excerpt: "Diferença entre dados fictícios e sandbox de gateway. Como gerar chaves PIX de teste e integrar com Mercado Pago, OpenPix e Pagar.me.",
    date: "2026-04-10",
    readTime: "6 min",
    category: "Tutoriais",
  },
  {
    slug: "algoritmo-luhn-cartao-credito",
    title: "Como funciona o algoritmo de Luhn: validação de cartão de crédito explicada",
    excerpt: "Entenda o algoritmo mod-10 usado para validar cartões de crédito. Implementação em JavaScript e como gerar números válidos para testes.",
    date: "2026-04-10",
    readTime: "6 min",
    category: "Conceitos",
  },
  {
    slug: "validacao-cnpj-nodejs",
    title: "Validação de CNPJ em Node.js: implementação completa sem dependências",
    excerpt: "Implemente validação de CNPJ do zero com o algoritmo mod-11. Código pronto para copiar, explicação passo a passo, e como testar com CNPJs fictícios.",
    date: "2026-04-10",
    readTime: "7 min",
    category: "Tutoriais",
  },
  {
    slug: "dados-teste-pix-checkout",
    title: "Dados de teste para PIX e checkout: como testar pagamentos sem dados reais",
    excerpt: "Como gerar dados fictícios (PIX, cartão, CPF) para testar fluxos de pagamento e checkout em ambiente de desenvolvimento.",
    date: "2026-04-10",
    readTime: "6 min",
    category: "Tutoriais",
  },
  {
    slug: "como-testar-cpf-em-staging",
    title: "Como testar CPF em ambiente de staging sem usar dados reais",
    excerpt: "Guia prático para testar validação de CPF em staging: por que evitar dados reais, como gerar CPFs fictícios, e como integrar no workflow.",
    date: "2026-04-10",
    readTime: "5 min",
    category: "LGPD",
  },
  {
    slug: "como-gerar-cpf-para-testes",
    title: "Como gerar CPF válido para testes sem violar a LGPD",
    excerpt: "Entenda por que usar CPFs reais em testes é ilegal, como funcionam os dígitos verificadores, e como gerar CPFs fictícios que passam na validação.",
    date: "2026-04-08",
    readTime: "5 min",
    category: "LGPD",
  },
  {
    slug: "lgpd-dados-de-teste",
    title: "LGPD e dados de teste: o que todo dev precisa saber",
    excerpt: "A Lei Geral de Proteção de Dados proíbe o uso de dados pessoais reais em ambientes de desenvolvimento. Veja como se adequar.",
    date: "2026-04-08",
    readTime: "6 min",
    category: "LGPD",
  },
  {
    slug: "automatizar-dados-teste-ci-cd",
    title: "Como automatizar dados de teste no CI/CD com API",
    excerpt: "Integre geração de dados brasileiros fictícios direto no seu pipeline de testes. Exemplos com GitHub Actions, Node.js e Python.",
    date: "2026-04-08",
    readTime: "4 min",
    category: "Tutoriais",
  },
];

const CATEGORIAS = [...new Set(POSTS.map(p => p.category))];

export default function Blog() {
  return (
    <PageShell>
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Blog do <span className="text-primary">FakeForge BR</span>
        </h1>
        <p className="text-muted-foreground mt-3 text-sm sm:text-base leading-relaxed max-w-2xl">
          Artigos práticos para desenvolvedores que trabalham com dados brasileiros em testes,
          ambientes de desenvolvimento e pipelines de CI/CD. Cobrimos LGPD aplicada ao
          desenvolvimento, validação de documentos (CPF, CNPJ, cartão), seed de banco de dados,
          automação com APIs e comparativos honestos entre ferramentas do ecossistema.
        </p>
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed max-w-2xl">
          Todo conteúdo é baseado em prática real de desenvolvimento solo no Brasil. Sem
          marketing chato, sem listas de 50 itens — apenas o que funciona quando você precisa
          gerar 10.000 CPFs válidos pro seed de staging na sexta às 18h.
        </p>
      </div>

      {/* Category overview */}
      <div className="mb-10 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {CATEGORIAS.map((cat) => {
          const count = POSTS.filter(p => p.category === cat).length;
          return (
            <div
              key={cat}
              className="rounded-lg bg-card border border-border px-3 py-2"
            >
              <p className="text-[11px] text-muted uppercase tracking-wider">{cat}</p>
              <p className="text-sm font-semibold text-foreground mt-0.5">{count} {count === 1 ? "artigo" : "artigos"}</p>
            </div>
          );
        })}
      </div>

      {/* Posts list */}
      <div className="space-y-3">
        {POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block rounded-xl bg-card border border-border p-5 sm:p-6 hover:border-primary/40 hover:bg-card-hover transition-all group"
          >
            <div className="flex items-center gap-3 text-xs text-muted mb-2">
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium text-[10px]">
                {post.category}
              </span>
              <time>{new Date(post.date).toLocaleDateString("pt-BR")}</time>
              <span>·</span>
              <span>{post.readTime} de leitura</span>
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
              {post.title}
            </h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {post.excerpt}
            </p>
          </Link>
        ))}
      </div>

      {/* Cross-link to generators */}
      <div className="mt-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 p-6 text-center">
        <h2 className="text-lg font-semibold text-foreground">Pronto pra parar de improvisar?</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
          Use os geradores direto no navegador, sem cadastro. Para automação, a API REST tem 100 chamadas grátis por dia.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center mt-4">
          <Link
            href="/geradores"
            className="px-5 py-2 rounded-lg text-xs font-medium bg-primary text-white hover:bg-primary-hover transition-colors"
          >
            Ver todos os geradores
          </Link>
          <Link
            href="/docs"
            className="px-5 py-2 rounded-lg text-xs font-medium border border-border text-foreground hover:border-border-hover transition-colors"
          >
            Documentação da API
          </Link>
        </div>
      </div>

      <div className="mt-10">
        <NewsletterCapture />
      </div>

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Blog", url: "/blog" },
      ]} />

      {/* Blog schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Blog do FakeForge BR",
            description: "Artigos sobre dados de teste, LGPD, automação e validação de documentos brasileiros para desenvolvedores.",
            url: "https://fakeforge.com.br/blog",
            publisher: {
              "@type": "Organization",
              name: "FakeForge BR",
              url: "https://fakeforge.com.br",
            },
            blogPost: POSTS.map(p => ({
              "@type": "BlogPosting",
              headline: p.title,
              description: p.excerpt,
              url: `https://fakeforge.com.br/blog/${p.slug}`,
              datePublished: p.date,
              author: { "@type": "Organization", name: "FakeForge BR" },
            })),
          }),
        }}
      />
    </PageShell>
  );
}
