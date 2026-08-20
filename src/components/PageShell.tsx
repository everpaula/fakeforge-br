import Link from "next/link";
import UserMenu from "./UserMenu";
import Logo from "./Logo";

interface Props {
  children: React.ReactNode;
}

export default function PageShell({ children }: Props) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-5 h-12 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Todos os geradores
            </Link>
            <Link href="/docs" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              API
            </Link>
            <Link href="/pricing" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Preços
            </Link>
            <UserMenu />
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-5 py-10">
        {children}
      </main>

      <footer className="border-t border-border mt-20">
        <div className="max-w-4xl mx-auto px-5 py-6">
          <div className="flex flex-wrap gap-4 justify-center text-[11px] text-muted mb-3">
            <Link href="/gerador-cpf" className="hover:text-foreground transition-colors">Gerador de CPF</Link>
            <Link href="/gerador-cnpj" className="hover:text-foreground transition-colors">Gerador de CNPJ</Link>
            <Link href="/gerador-cep" className="hover:text-foreground transition-colors">Gerador de CEP</Link>
            <Link href="/gerador-telefone" className="hover:text-foreground transition-colors">Gerador de Telefone</Link>
            <Link href="/gerador-email" className="hover:text-foreground transition-colors">Gerador de Email</Link>
            <Link href="/gerador-pix" className="hover:text-foreground transition-colors">Gerador de PIX</Link>
            <Link href="/gerador-cartao" className="hover:text-foreground transition-colors">Gerador de Cartão</Link>
            <Link href="/gerador-pessoa" className="hover:text-foreground transition-colors">Gerador de Pessoa</Link>
            <Link href="/gerador-empresa" className="hover:text-foreground transition-colors">Gerador de Empresa</Link>
            <Link href="/gerador-conta-bancaria" className="hover:text-foreground transition-colors">Conta Bancária</Link>
            <Link href="/gerador-endereco" className="hover:text-foreground transition-colors">Gerador de Endereço</Link>
            <Link href="/gerador-rg" className="hover:text-foreground transition-colors">Gerador de RG</Link>
            <Link href="/gerador-pis" className="hover:text-foreground transition-colors">PIS/PASEP</Link>
            <Link href="/gerador-titulo-eleitor" className="hover:text-foreground transition-colors">Título de Eleitor</Link>
            <Link href="/gerador-placa-mercosul" className="hover:text-foreground transition-colors">Placa Mercosul</Link>
          </div>
          <div className="flex flex-wrap gap-4 justify-center text-[11px] text-muted mb-3">
            <Link href="/validar-cpf" className="hover:text-foreground transition-colors">Validar CPF</Link>
            <Link href="/validar-cnpj" className="hover:text-foreground transition-colors">Validar CNPJ</Link>
            <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link>
            <Link href="/docs" className="hover:text-foreground transition-colors">API</Link>
            <Link href="/pricing" className="hover:text-foreground transition-colors">Preços</Link>
          </div>
          <div className="flex flex-wrap gap-4 justify-center text-[11px] text-muted mb-4">
            <Link href="/sobre" className="hover:text-foreground transition-colors">Sobre</Link>
            <Link href="/contato" className="hover:text-foreground transition-colors">Contato</Link>
            <Link href="/parceiros" className="hover:text-foreground transition-colors">Parceiros</Link>
            <Link href="/privacidade" className="hover:text-foreground transition-colors">Privacidade</Link>
            <Link href="/termos" className="hover:text-foreground transition-colors">Termos</Link>
          </div>
          <p className="text-[11px] text-muted text-center">
            FakeForge BR - Dados 100% fictícios para desenvolvimento e testes.
          </p>
        </div>
      </footer>
    </div>
  );
}
