import Link from "next/link";

interface Props {
  children: React.ReactNode;
}

export default function PageShell({ children }: Props) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-5 h-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white text-[10px] font-bold tracking-tight">FF</span>
            </div>
            <span className="font-semibold text-sm text-foreground">FakeForge</span>
            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/20">BR</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Todos os geradores
            </Link>
            <Link href="/docs" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              API
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-5 py-10">
        {children}
      </main>

      <footer className="border-t border-border mt-20">
        <div className="max-w-4xl mx-auto px-5 py-6">
          <div className="flex flex-wrap gap-4 justify-center text-[11px] text-muted mb-4">
            <Link href="/gerador-cpf" className="hover:text-foreground transition-colors">Gerador de CPF</Link>
            <Link href="/gerador-cnpj" className="hover:text-foreground transition-colors">Gerador de CNPJ</Link>
            <Link href="/gerador-cep" className="hover:text-foreground transition-colors">Gerador de CEP</Link>
            <Link href="/validar-cpf" className="hover:text-foreground transition-colors">Validar CPF</Link>
            <Link href="/validar-cnpj" className="hover:text-foreground transition-colors">Validar CNPJ</Link>
            <Link href="/docs" className="hover:text-foreground transition-colors">API</Link>
          </div>
          <p className="text-[11px] text-muted text-center">
            FakeForge BR - Dados 100% ficticios para desenvolvimento e testes.
          </p>
        </div>
      </footer>
    </div>
  );
}
