import Link from "next/link";

interface Props {
  dataType?: string;
}

export default function ApiCtaBanner({ dataType = "dados" }: Props) {
  return (
    <section className="my-10 rounded-xl border border-primary/20 bg-primary/5 p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-primary text-lg font-mono">{"{ }"}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-foreground">Automatize com a API</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Gere {dataType} direto no seu código ou pipeline de CI/CD.
            50 chamadas grátis por dia. Sem cartão de crédito.
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Link
            href="/docs"
            className="flex-1 sm:flex-initial text-center px-4 py-2.5 rounded-lg text-xs font-medium bg-primary text-white hover:bg-primary-hover transition-colors"
          >
            Ver documentação
          </Link>
          <Link
            href="/login"
            className="flex-1 sm:flex-initial text-center px-4 py-2.5 rounded-lg text-xs font-medium border border-border text-foreground hover:border-border-hover transition-colors"
          >
            Criar conta grátis
          </Link>
        </div>
      </div>
      <div className="mt-4 rounded-lg bg-background border border-border p-3 font-mono text-xs text-muted-foreground">
        <span className="text-success">curl</span> &quot;https://fakeforge.com.br/api/generate?type=cpf&amp;quantity=100&quot;
      </div>
    </section>
  );
}
