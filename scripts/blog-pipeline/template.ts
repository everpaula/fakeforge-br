// Gera o arquivo TSX final do post a partir dos dados extraídos.
import type { Category } from "./config.js";

export interface PostData {
  title: string;
  slug: string;
  metaDescription: string;
  category: Category;
  readTime: string; // "5 min"
  date: string; // ISO YYYY-MM-DD
  body: string; // markdown convertido pra JSX (parágrafos + code blocks)
  faqs: { q: string; a: string }[];
}

function escapeJsx(s: string): string {
  // JSX text accepts literal characters EXCEPT:
  // - { and } (interpreted as expressions)
  // - < and > (interpreted as tags)
  // We use HTML entities to escape these.
  return s
    .replace(/&/g, "&amp;")
    .replace(/{/g, "&#123;")
    .replace(/}/g, "&#125;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeJsString(s: string): string {
  // Para strings dentro de JSON.stringify, basta escapar aspas e barras
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

/**
 * Converte markdown simplificado em JSX. Suporta:
 * - parágrafos (\n\n)
 * - H2 (## ) e H3 (### )
 * - code blocks (```lang ... ```)
 * - inline code (`...`)
 * - bold (**...**)
 * - links markdown ([texto](url))
 * - listas (- item)
 * - blockquote (> ...)
 */
export function mdToJsx(md: string): string {
  const lines = md.split("\n");
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // pula o fechamento
      const code = codeLines.join("\n");
      out.push(`<pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-${lang}">{${JSON.stringify(code)}}</code></pre>`);
      continue;
    }

    // H2
    if (line.startsWith("## ")) {
      const text = inlineMd(line.slice(3));
      out.push(`<h2 className="text-lg font-semibold text-foreground mt-8 mb-3">${text}</h2>`);
      i++;
      continue;
    }

    // H3
    if (line.startsWith("### ")) {
      const text = inlineMd(line.slice(4));
      out.push(`<h3 className="text-base font-semibold text-foreground mt-6 mb-2">${text}</h3>`);
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      const text = inlineMd(line.slice(2));
      out.push(`<blockquote className="border-l-4 border-accent pl-4 my-4 text-muted-foreground italic">${text}</blockquote>`);
      i++;
      continue;
    }

    // Lista
    if (line.match(/^[-*] /)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^[-*] /)) {
        items.push(`<li>${inlineMd(lines[i].slice(2))}</li>`);
        i++;
      }
      out.push(`<ul className="list-disc list-inside space-y-2 pl-2 my-4">${items.join("")}</ul>`);
      continue;
    }

    // Tabela markdown (linhas com |)
    if (line.includes("|") && lines[i + 1]?.match(/^\s*\|[-:\s|]+\|\s*$/)) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].includes("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      out.push(renderTable(tableLines));
      continue;
    }

    // Parágrafo (acumula linhas até linha vazia)
    if (line.trim()) {
      const paraLines: string[] = [line];
      i++;
      while (i < lines.length && lines[i].trim() && !lines[i].startsWith("#") && !lines[i].startsWith("```") && !lines[i].match(/^[-*] /) && !lines[i].startsWith("> ")) {
        paraLines.push(lines[i]);
        i++;
      }
      const text = inlineMd(paraLines.join(" "));
      out.push(`<p className="mb-4">${text}</p>`);
      continue;
    }

    i++;
  }

  return out.join("\n          ");
}

function inlineMd(text: string): string {
  // FIRST escape characters that JSX interprets specially in text nodes:
  //   { } → expression boundaries
  //   < > → tag boundaries
  // We use HTML entities. Our generated tags use only literal-string attributes
  // (className="..."), so we never need real {, }, <, > in the output.
  // We escape & first to avoid double-escaping the entities we insert next.
  text = text.replace(/&/g, "&amp;");
  text = text.replace(/</g, "&lt;");
  text = text.replace(/>/g, "&gt;");
  text = text.replace(/\{/g, "&#123;");
  text = text.replace(/\}/g, "&#125;");

  // bold **text**
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong className="text-foreground">$1</strong>');
  // inline code `text`
  text = text.replace(/`([^`]+)`/g, '<code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">$1</code>');
  // links [text](url) — URLs were also escaped above; restore for valid hrefs
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, url) => {
    const realUrl = String(url).replace(/&amp;/g, "&");
    if (realUrl.startsWith("/")) {
      return `<Link href="${realUrl}" className="text-primary hover:underline">${t}</Link>`;
    }
    return `<a href="${realUrl}" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">${t}</a>`;
  });
  return text;
}

function renderTable(tableLines: string[]): string {
  const rows = tableLines.filter(l => !l.match(/^\s*\|[-:\s|]+\|\s*$/));
  if (rows.length < 2) return "";
  const cells = rows.map(r => r.split("|").map(c => c.trim()).filter(Boolean));
  const header = cells[0];
  const body = cells.slice(1);

  const headHtml = header.map(c => `<th className="text-left px-3 py-2 text-muted-foreground font-medium">${inlineMd(c)}</th>`).join("");
  const bodyHtml = body.map(row => `<tr className="border-b border-border">${row.map(c => `<td className="px-3 py-2">${inlineMd(c)}</td>`).join("")}</tr>`).join("");

  return `<div className="my-6 rounded-xl bg-card border border-border overflow-x-auto"><table className="w-full text-sm"><thead className="bg-card-hover"><tr>${headHtml}</tr></thead><tbody>${bodyHtml}</tbody></table></div>`;
}

export function generatePageTsx(post: PostData): string {
  const dateBR = new Date(post.date + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

  const faqJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  });

  const bodyJsx = mdToJsx(post.body);
  const faqsJsx = post.faqs.map(({ q, a }) => `
            <details key="${escapeJsx(q.slice(0, 30))}" className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">${escapeJsx(q)}</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">${escapeJsx(a)}</p>
            </details>`).join("");

  return `import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BlogFeaturedImage from "@/components/BlogFeaturedImage";

export const metadata: Metadata = {
  title: ${JSON.stringify(post.title)},
  description: ${JSON.stringify(post.metaDescription)},
  openGraph: {
    title: ${JSON.stringify(post.title)},
    description: ${JSON.stringify(post.metaDescription)},
    type: "article",
  },
  alternates: { canonical: ${JSON.stringify("/blog/" + post.slug)} },
};

export default function Post() {
  return (
    <PageShell>
      <article className="max-w-2xl">
        <Link href="/blog" className="text-xs text-primary hover:underline mb-4 inline-block">
          ← Voltar ao blog
        </Link>
        <BlogFeaturedImage category=${JSON.stringify(post.category)} title=${JSON.stringify(post.title)} className="mb-6" />
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
            ${escapeJsx(post.title)}
          </h1>
          <div className="flex items-center gap-3 text-xs text-muted mt-3">
            <time>${dateBR}</time>
            <span>·</span>
            <span>${post.readTime} de leitura</span>
          </div>
        </div>

        <div className="prose-custom space-y-2 text-sm text-muted-foreground leading-relaxed">
          ${bodyJsx}
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">Perguntas frequentes</h2>
          <div className="space-y-3">${faqsJsx}
          </div>
        </section>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: ${JSON.stringify(faqJsonLd)},
        }}
      />
    </PageShell>
  );
}
`;
}

// silence unused import lint
void escapeJsString;
