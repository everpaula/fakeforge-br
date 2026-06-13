import Link from "next/link";

interface Props {
  dataType: string;
}

export default function ApiCtaTop({ dataType }: Props) {
  return (
    <div className="rounded-lg bg-primary/5 border border-primary/20 px-4 py-3 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="text-base">⚡</span>
        <p className="text-xs sm:text-sm text-foreground">
          Precisa gerar muitos {dataType} via código?{" "}
          <span className="text-muted-foreground">API REST com 50 chamadas grátis/dia.</span>
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Link
          href="/docs"
          className="text-xs font-medium text-primary hover:text-primary-hover transition-colors"
        >
          Ver docs →
        </Link>
      </div>
    </div>
  );
}