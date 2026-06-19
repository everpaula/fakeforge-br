import Link from "next/link";

const EN_PAGES = [
  { slug: "cpf-generator", label: "CPF Generator" },
  { slug: "cnpj-generator", label: "CNPJ Generator" },
  { slug: "cep-generator", label: "CEP (Postal Code) Generator" },
  { slug: "credit-card-generator", label: "Credit Card Generator" },
  { slug: "person-generator", label: "Person Generator" },
  { slug: "pix-key-generator", label: "PIX Key Generator" },
  { slug: "random-number-generator", label: "Random Number Generator" },
] as const;

interface Props {
  currentSlug: string;
}

/**
 * Related generator links for English landing pages. Links stay within /en/
 * cluster so English visitors don't get bounced into PT-BR pages — keeps the
 * EN PageRank loop intact and avoids language-mismatch bounce.
 */
export default function RelatedEnGenerators({ currentSlug }: Props) {
  const others = EN_PAGES.filter((p) => p.slug !== currentSlug);
  return (
    <section className="mt-10 pt-8 border-t border-border" lang="en">
      <h2 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wider">Other generators</h2>
      <div className="flex flex-wrap gap-2">
        {others.map((p) => (
          <Link
            key={p.slug}
            href={`/en/${p.slug}`}
            className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors"
          >
            {p.label}
          </Link>
        ))}
        <Link
          href="/docs"
          className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors"
        >
          REST API Docs
        </Link>
      </div>
    </section>
  );
}
