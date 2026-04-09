import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import NewsletterCapture from "@/components/NewsletterCapture";

export const metadata: Metadata = {
  title: "Blog - FakeForge BR",
  description: "Artigos sobre geração de dados de teste, LGPD, automação de testes e boas práticas para desenvolvedores brasileiros.",
};

const POSTS = [
  {
    slug: "como-gerar-cpf-para-testes",
    title: "Como gerar CPF válido para testes sem violar a LGPD",
    excerpt: "Entenda por que usar CPFs reais em testes é ilegal, como funcionam os dígitos verificadores, e como gerar CPFs fictícios que passam na validação.",
    date: "2026-04-08",
    readTime: "5 min",
  },
  {
    slug: "lgpd-dados-de-teste",
    title: "LGPD e dados de teste: o que todo dev precisa saber",
    excerpt: "A Lei Geral de Proteção de Dados proíbe o uso de dados pessoais reais em ambientes de desenvolvimento. Veja como se adequar.",
    date: "2026-04-08",
    readTime: "6 min",
  },
  {
    slug: "automatizar-dados-teste-ci-cd",
    title: "Como automatizar dados de teste no CI/CD com API",
    excerpt: "Integre geração de dados brasileiros fictícios direto no seu pipeline de testes. Exemplos com GitHub Actions, Node.js e Python.",
    date: "2026-04-08",
    readTime: "4 min",
  },
];

export default function Blog() {
  return (
    <PageShell>
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
        <p className="text-muted mt-2 text-sm">
          Artigos sobre dados de teste, LGPD e automação para desenvolvedores brasileiros.
        </p>
      </div>

      <div className="space-y-6">
        {POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block rounded-xl bg-card border border-border p-6 hover:border-border-hover transition-all group"
          >
            <div className="flex items-center gap-3 text-xs text-muted mb-2">
              <time>{new Date(post.date).toLocaleDateString("pt-BR")}</time>
              <span>·</span>
              <span>{post.readTime} de leitura</span>
            </div>
            <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {post.title}
            </h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {post.excerpt}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <NewsletterCapture />
      </div>
    </PageShell>
  );
}
