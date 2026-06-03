import Link from "next/link";

type Generator = {
  slug: string;
  label: string;
  category: GeneratorCategory;
};

type GeneratorCategory =
  | "doc-pessoal"
  | "doc-empresa"
  | "pessoa"
  | "contato"
  | "endereco"
  | "financeiro"
  | "veicular";

const ALL_GENERATORS: Generator[] = [
  { slug: "gerador-cpf", label: "CPF", category: "doc-pessoal" },
  { slug: "gerador-cin", label: "CIN", category: "doc-pessoal" },
  { slug: "gerador-rg", label: "RG", category: "doc-pessoal" },
  { slug: "gerador-cnh", label: "CNH", category: "doc-pessoal" },
  { slug: "gerador-pis", label: "PIS/PASEP", category: "doc-pessoal" },
  { slug: "gerador-titulo-eleitor", label: "Título de Eleitor", category: "doc-pessoal" },

  { slug: "gerador-cnpj", label: "CNPJ", category: "doc-empresa" },
  { slug: "gerador-cnpj-alfanumerico", label: "CNPJ Alfanumérico 2026", category: "doc-empresa" },
  { slug: "gerador-empresa", label: "Empresa Completa", category: "doc-empresa" },

  { slug: "gerador-pessoa", label: "Pessoa Fictícia", category: "pessoa" },

  { slug: "gerador-email", label: "Email", category: "contato" },
  { slug: "gerador-telefone", label: "Telefone e Celular", category: "contato" },

  { slug: "gerador-cep", label: "CEP", category: "endereco" },
  { slug: "gerador-endereco", label: "Endereço Completo", category: "endereco" },

  { slug: "gerador-pix", label: "Chave PIX", category: "financeiro" },
  { slug: "gerador-cartao", label: "Cartão de Crédito", category: "financeiro" },
  { slug: "gerador-conta-bancaria", label: "Conta Bancária", category: "financeiro" },

  { slug: "gerador-placa-mercosul", label: "Placa Mercosul", category: "veicular" },
];

const RELATED_CATEGORIES: Record<GeneratorCategory, GeneratorCategory[]> = {
  "doc-pessoal": ["pessoa", "doc-empresa", "contato"],
  "doc-empresa": ["doc-pessoal", "pessoa", "endereco"],
  pessoa: ["doc-pessoal", "contato", "endereco"],
  contato: ["pessoa", "endereco", "doc-pessoal"],
  endereco: ["pessoa", "contato", "doc-pessoal"],
  financeiro: ["doc-pessoal", "doc-empresa", "pessoa"],
  veicular: ["doc-pessoal", "pessoa", "contato"],
};

interface Props {
  currentSlug: string;
  /** Optional title override. Defaults to "Geradores relacionados". */
  title?: string;
  /** How many related links to show (default 7, hard cap 9). */
  max?: number;
}

/**
 * Per-page related generators block. Surfaces up to N links to other generator
 * landings, prioritizing same-category siblings then cross-category neighbors,
 * plus a global "Ver todos" and "API REST" anchor at the end.
 *
 * Compound SEO mechanic: every generator page gets a curated, semantically
 * grouped internal link set, so authority flows around the cluster instead of
 * stopping at the home and the geradores hub.
 */
export default function RelatedGenerators({ currentSlug, title = "Geradores relacionados", max = 7 }: Props) {
  const current = ALL_GENERATORS.find((g) => g.slug === currentSlug);
  if (!current) return null;

  const cap = Math.min(max, 9);
  const sameCategory = ALL_GENERATORS.filter((g) => g.category === current.category && g.slug !== currentSlug);
  const relatedCats = RELATED_CATEGORIES[current.category];
  const fromRelated = relatedCats.flatMap((cat) => ALL_GENERATORS.filter((g) => g.category === cat));

  const links = [...sameCategory, ...fromRelated].slice(0, cap);

  return (
    <div className="mt-10 pt-8 border-t border-border">
      <h2 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wider">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {links.map((g) => (
          <Link
            key={g.slug}
            href={`/${g.slug}`}
            className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors"
          >
            Gerador de {g.label}
          </Link>
        ))}
        <Link
          href="/geradores"
          className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors"
        >
          Ver todos
        </Link>
        <Link
          href="/docs"
          className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors"
        >
          API REST
        </Link>
      </div>
    </div>
  );
}
