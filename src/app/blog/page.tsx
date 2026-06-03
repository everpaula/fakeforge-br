import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import NewsletterCapture from "@/components/NewsletterCapture";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import BlogFeaturedImage from "@/components/BlogFeaturedImage";

export const metadata: Metadata = {
  title: "Blog FakeForge BR — Artigos sobre Dados de Teste, LGPD e Automação",
  description: "Artigos práticos sobre geração de dados brasileiros para testes: CPF/CNPJ válido, LGPD em ambiente de desenvolvimento, seed de banco de dados, automação no CI/CD e comparativos de ferramentas.",
  keywords: "blog dados teste, lgpd desenvolvimento, gerar cpf testes, cnpj validacao node, faker brasileiro, seed banco dados",
  alternates: { canonical: "/blog" },
};

const POSTS = [
  {
    slug: "validar-cpf-java-spring-boot-algoritmo-mod11-junit",
    title: "Validar CPF em Java Spring Boot: Algoritmo Mod-11 e JUnit",
    excerpt: "Implementação do validador de CPF em Java/Spring Boot. Algoritmo mod-11, custom annotation @CPF com Bean Validation, validator class, testes JUnit + Mockito e integração com REST controllers.",
    date: "2026-06-03",
    readTime: "9 min",
    category: "Tutoriais",
  },
  {
    slug: "cpf-php-laravel-algoritmo-mod11-validacao-testes",
    title: "CPF em PHP e Laravel: Algoritmo Mod-11 com Testes",
    excerpt: "Implementação completa do validador e gerador de CPF em PHP puro e Laravel. Algoritmo mod-11 da Receita Federal, custom validation rule, FormRequest, factory para Eloquent e PHPUnit tests.",
    date: "2026-06-03",
    readTime: "11 min",
    category: "Tutoriais",
  },
  {
    slug: "lgpd-testes-software-guia-pratico-devs",
    title: "LGPD em Testes de Software: Guia Prático para Devs",
    excerpt: "Como estruturar fixtures, seeds e pipelines de CI/CD sem tocar em dados pessoais reais. Por que usar CPF/CNPJ real em staging viola a LGPD (multa até R$50M) e como gerar fixtures válidos sem risco.",
    date: "2026-06-03",
    readTime: "11 min",
    category: "LGPD",
  },
  {
    slug: "como-validar-cpf-online-e-no-codigo",
    title: "Validar CPF: Como Checar se um CPF é Válido Online e no Código",
    excerpt: "Como checar se um CPF é válido: validador online no navegador, implementação do algoritmo mod-11 em JavaScript e Python, regex de formato, e diferença entre CPF válido e CPF real.",
    date: "2026-06-03",
    readTime: "10 min",
    category: "Conceitos",
  },
  {
    slug: "gerar-cnpj-valido-testes-algoritmo-mod11-api",
    title: "Gerar CNPJ Válido para Testes: Algoritmo Mod-11 e API REST",
    excerpt: "Como gerar CNPJ válido online para testes: implementação do algoritmo mod-11 da Receita Federal em Node.js e Python, cálculo dos dois dígitos verificadores e como integrar via API REST sem rodar código.",
    date: "2026-06-03",
    readTime: "10 min",
    category: "Tutoriais",
  },
  {
    slug: "documentos-brasileiros-formatos-algoritmos-validacao",
    title: "Documentos Brasileiros para Devs: Formatos e Algoritmos de Validação",
    excerpt: "Guia completo de CPF, CNPJ, RG, CIN, CNH, PIS, Título de Eleitor, CEP e mais: formatos, dígitos verificadores, algoritmos mod-11 e ASCII-48, exemplos de validação e implementação.",
    date: "2026-06-02",
    readTime: "14 min",
    category: "Conceitos",
  },
  {
    slug: "gerador-conta-corrente-nodejs-digito-verificador-banco",
    title: "Conta Corrente em Node.js: Calculando o Dígito Verificador por Banco",
    excerpt: "Implementação do dígito verificador de conta corrente em Node.js para Itaú, Bradesco, Banco do Brasil, Nubank, Inter e mais 12 bancos. Algoritmos mod-10 e mod-11 com pesos específicos por instituição.",
    date: "2026-06-02",
    readTime: "12 min",
    category: "Tutoriais",
  },
  {
    slug: "cnpj-fake-vs-cnpj-valido-testes",
    title: "CNPJ Fake vs CNPJ Válido: Diferença e Quando Usar em Testes",
    excerpt: "Diferença técnica entre CNPJ fake (formato apenas) e CNPJ válido (com mod-11 calculado). Quando usar cada um em unit tests, integração, staging e load testing sem violar LGPD.",
    date: "2026-05-27",
    readTime: "10 min",
    category: "Conceitos",
  },
  {
    slug: "gerador-inscricao-estadual-sp-algoritmo",
    title: "Inscrição Estadual SP: Algoritmo Passo a Passo e Gerador em TypeScript",
    excerpt: "Formato e algoritmo do dígito verificador da IE-SP, implementação completa do gerador e validador em TypeScript com exemplos rodáveis e edge cases.",
    date: "2026-05-26",
    readTime: "11 min",
    category: "Tutoriais",
  },
  {
    slug: "gerar-boleto-febraban-linha-digitavel-nodejs-testes",
    title: "Boleto FEBRABAN em Node.js: Gerar Linha Digitável para Testes",
    excerpt: "Implementação completa do cálculo da linha digitável FEBRABAN em Node.js: código de barras, dígitos verificadores mod-10 e mod-11, conversão para 47 dígitos digitáveis. Pronto pra QA e CI/CD.",
    date: "2026-05-26",
    readTime: "12 min",
    category: "Tutoriais",
  },
  {
    slug: "conta-bancaria-fake-bradesco-itau-nubank-testes",
    title: "Conta Bancária Fake para Testes: Bradesco, Itaú e Nubank",
    excerpt: "Gere conta corrente fictícia para testes nos 17 principais bancos brasileiros (Bradesco, Itaú, Nubank, BB, Inter, C6). Agência, conta e dígito verificador no formato de cada emissor.",
    date: "2026-05-26",
    readTime: "12 min",
    category: "Tutoriais",
  },
  {
    slug: "validar-cnh-javascript-algoritmo-denatran",
    title: "Validar CNH em JavaScript: Algoritmo DENATRAN Passo a Passo",
    excerpt: "Implementação completa do validador de CNH em JavaScript e TypeScript. Algoritmo oficial do DENATRAN com mod-11 invertido, 2 dígitos verificadores, regex e Zod schema. Código rodável.",
    date: "2026-05-26",
    readTime: "13 min",
    category: "Tutoriais",
  },
  {
    slug: "anonimizacao-vs-pseudonimizacao-lgpd-developers",
    title: "Anonimização vs Pseudonimização LGPD: Guia Prático para Devs",
    excerpt: "Diferença técnica entre anonimização e pseudonimização pela LGPD, quando cada técnica se aplica, exemplos em TypeScript e como evitar reidentificação em ambientes de teste.",
    date: "2026-05-26",
    readTime: "11 min",
    category: "LGPD",
  },
  {
    slug: "fakeforge-vs-mockaroo-vs-fakerjs-dados-brasileiros",
    title: "FakeForge vs Mockaroo vs Faker.js: qual gera dados brasileiros de verdade?",
    excerpt: "Comparativo prático entre FakeForge, Mockaroo e Faker.js para gerar CPF, CNPJ, PIX e endereços BR. Quem valida checksums, quem exporta SQL, quem respeita a LGPD.",
    date: "2026-05-21",
    readTime: "14 min",
    category: "Comparativos",
  },
  {
    slug: "mockar-cep-cypress-dados-brasileiros-falsos",
    title: "Como Mockar CEP no Cypress com Dados Brasileiros Falsos",
    excerpt: "Intercepte chamadas ViaCEP no Cypress e devolva endereços BR coerentes sem depender de API externa. cy.intercept, fixtures determinísticos e testes E2E confiáveis.",
    date: "2026-05-21",
    readTime: "10 min",
    category: "Tutoriais",
  },
  {
    slug: "qr-code-pix-dinamico-emv-br-code-nodejs",
    title: "QR Code PIX Dinâmico (EMV BR Code) em Node.js",
    excerpt: "Gere QR Code PIX dinâmico no padrão EMV BR Code em Node.js: payload TLV, cálculo CRC16-CCITT, integração com PSPs e validação com TXID único. Código rodável copiável.",
    date: "2026-05-20",
    readTime: "12 min",
    category: "Tutoriais",
  },
  {
    slug: "popular-mysql-dados-brasileiros-fake-staging",
    title: "Popular MySQL com Dados Brasileiros Falsos no Staging",
    excerpt: "Seed de banco MySQL com CPF, CNPJ, endereços e PIX falsos via FakeForge API. Scripts LOAD DATA INFILE, transações, índices e dataset de 100k rows sem violar LGPD.",
    date: "2026-05-20",
    readTime: "10 min",
    category: "Tutoriais",
  },
  {
    slug: "validar-cpf-javascript-algoritmo-passo-a-passo",
    title: "Validar CPF em JavaScript — Algoritmo Mod-11 Passo a Passo",
    excerpt: "Implementação completa do validador de CPF em JavaScript vanilla. Algoritmo mod-11 da Receita Federal, regex, Zod schema, integração com React forms e edge cases. Código rodável.",
    date: "2026-05-07",
    readTime: "9 min",
    category: "Tutoriais",
  },
  {
    slug: "popular-postgresql-dados-brasileiros-staging",
    title: "Como Popular PostgreSQL com Dados Brasileiros para Staging",
    excerpt: "Seed de banco PostgreSQL com CPF, CNPJ, CEP e dados correlacionados via FakeForge API. Scripts pgbench, COPY FROM, transações, índices e dataset de 100k+ rows.",
    date: "2026-05-07",
    readTime: "11 min",
    category: "Tutoriais",
  },
  {
    slug: "cnpj-alfanumerico-checklist-migracao-2026",
    title: "CNPJ Alfanumérico: checklist para migrar antes de 01/07/2026",
    excerpt: "Guia prático com 7 áreas que precisam de atenção antes da virada do CNPJ alfanumérico. Schema de banco, regex, integrações com SEFAZ, eSocial, e validação JS/Python pronta.",
    date: "2026-05-05",
    readTime: "9 min",
    category: "News",
  },
  {
    slug: "como-gerar-cpf-valido-python-testes",
    title: "Como Gerar CPF Válido em Python para Testes",
    excerpt: "Algoritmo do dígito verificador (mod-11) implementado em Python com Faker, pytest fixtures, integração com Pandas e seed de banco. Código rodável copiável.",
    date: "2026-05-05",
    readTime: "10 min",
    category: "Tutoriais",
  },
  {
    slug: "gerador-placa-mercosul-teste-software",
    title: "Gerador de Placa Mercosul para Testes: Algoritmo e Validação",
    excerpt: "Implementação TypeScript do formato Mercosul (LLLNLNN) e antigo (LLL-NNNN), validação Zod, fixtures Vitest determinísticos e seed de banco.",
    date: "2026-05-04",
    readTime: "11 min",
    category: "Tutoriais",
  },
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

      {/* Posts list with featured images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block rounded-xl bg-card border border-border overflow-hidden hover:border-primary/40 hover:bg-card-hover transition-all group"
          >
            <BlogFeaturedImage category={post.category} title={post.title} />
            <div className="p-5">
              <div className="flex items-center gap-3 text-xs text-muted mb-2">
                <time>{new Date(post.date).toLocaleDateString("pt-BR")}</time>
                <span>·</span>
                <span>{post.readTime} de leitura</span>
              </div>
              <h2 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                {post.title}
              </h2>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                {post.excerpt}
              </p>
            </div>
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
