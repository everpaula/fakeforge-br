import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Geradores de Dados Brasileiros — Ferramentas para Desenvolvedores",
  description: "Todas as ferramentas do FakeForge BR: gerador de CPF, CNPJ, CEP, telefone, email, PIX, cartão de crédito, pessoa, empresa e endereço. Grátis para uso web.",
  keywords: "geradores dados brasileiros, ferramentas desenvolvedor BR, gerador cpf cnpj cep telefone email pix cartão",
  alternates: { canonical: "/geradores" },
};

const GERADORES = [
  { href: "/gerador-cpf", title: "CPF", desc: "Números com dígitos verificadores válidos (mod-11)", icon: "📄", category: "Documentos" },
  { href: "/gerador-cnpj", title: "CNPJ", desc: "CNPJs válidos com razão social e endereço", icon: "📄", category: "Documentos" },
  { href: "/gerador-cnpj-alfanumerico", title: "CNPJ Alfanumérico", desc: "Novo formato 2026 (com letras A-Z) — vigência 01/07/2026", icon: "🆕", category: "Documentos" },
  { href: "/gerador-cnh", title: "CNH", desc: "Carteira Nacional de Habilitação válida (algoritmo DENATRAN)", icon: "🚗", category: "Documentos" },
  { href: "/gerador-cin", title: "CIN", desc: "Carteira de Identidade Nacional — substitui o RG", icon: "🆔", category: "Documentos" },
  { href: "/gerador-rg", title: "RG", desc: "Registro Geral formato SP (mod-11 com dígito X)", icon: "📇", category: "Documentos" },
  { href: "/gerador-pis", title: "PIS / PASEP / NIT / NIS", desc: "Número previdenciário válido (mod-11 com pesos 3-2)", icon: "🧾", category: "Documentos" },
  { href: "/gerador-titulo-eleitor", title: "Título de Eleitor", desc: "12 dígitos com UF e dígitos verificadores TSE", icon: "🗳️", category: "Documentos" },
  { href: "/gerador-placa-mercosul", title: "Placa Mercosul", desc: "Placa formato Mercosul (LLLNLNN) e antigo (LLL-NNNN)", icon: "🚘", category: "Documentos" },
  { href: "/gerador-pessoa", title: "Pessoa Completa", desc: "Nome, CPF, email, telefone e endereço correlacionados", icon: "👤", category: "Pessoa" },
  { href: "/gerador-empresa", title: "Empresa", desc: "CNPJ, razão social, nome fantasia e endereço comercial", icon: "🏢", category: "Pessoa" },
  { href: "/gerador-email", title: "Email", desc: "Emails fictícios com nomes brasileiros realistas", icon: "📧", category: "Contato" },
  { href: "/gerador-telefone", title: "Telefone e Celular", desc: "Números com DDD válido de todos os estados", icon: "📱", category: "Contato" },
  { href: "/gerador-cep", title: "CEP", desc: "CEPs brasileiros com prefixo correto por estado", icon: "📍", category: "Endereço" },
  { href: "/gerador-endereco", title: "Endereço Completo", desc: "Rua, bairro, cidade, estado e CEP coerentes", icon: "📍", category: "Endereço" },
  { href: "/gerador-pix", title: "Chave PIX", desc: "CPF, CNPJ, email, celular ou EVP — 4 formatos BACEN", icon: "💰", category: "Financeiro" },
  { href: "/gerador-cartao", title: "Cartão de Crédito", desc: "Visa, Mastercard, Elo e Amex com Luhn válido", icon: "💳", category: "Financeiro" },
  { href: "/gerador-conta-bancaria", title: "Conta Bancária", desc: "Banco, agência e conta com dígito verificador", icon: "🏦", category: "Financeiro" },
];

const VALIDADORES = [
  { href: "/validar-cpf", title: "Validar CPF", desc: "Verifique se um CPF tem dígitos verificadores válidos", icon: "✅" },
  { href: "/validar-cnpj", title: "Validar CNPJ", desc: "Verifique se um CNPJ tem dígitos verificadores válidos", icon: "✅" },
];

export default function Geradores() {
  const categorias = [...new Set(GERADORES.map(g => g.category))];

  return (
    <PageShell>
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">
          Geradores de <span className="text-primary">Dados Brasileiros</span>
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Todas as ferramentas do FakeForge BR em um só lugar. Geração grátis e ilimitada pelo navegador.
          Para uso programático, <Link href="/docs" className="text-primary hover:underline">confira a API REST</Link>.
        </p>
      </div>

      {categorias.map(cat => (
        <div key={cat} className="mb-10">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">{cat}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {GERADORES.filter(g => g.category === cat).map(g => (
              <Link
                key={g.href}
                href={g.href}
                className="group rounded-xl bg-card border border-border p-5 hover:border-primary/40 hover:bg-card-hover transition-all"
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">{g.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {g.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{g.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}

      <div className="mb-10">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">Validadores</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {VALIDADORES.map(v => (
            <Link
              key={v.href}
              href={v.href}
              className="group rounded-xl bg-card border border-border p-5 hover:border-primary/40 hover:bg-card-hover transition-all"
            >
              <div className="flex items-start gap-3">
                <span className="text-xl">{v.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {v.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-primary/5 border border-primary/20 p-6 text-center">
        <h2 className="text-base font-semibold text-foreground">Precisa gerar em massa?</h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-lg mx-auto">
          A API REST aceita até 10.000 itens por request, com export em JSON, CSV ou SQL.
          100 chamadas grátis por dia, sem cadastro.
        </p>
        <div className="flex flex-wrap gap-2 justify-center mt-4">
          <Link href="/docs" className="px-5 py-2 rounded-lg text-xs font-medium bg-primary text-white hover:bg-primary-hover transition-colors">
            Ver documentação da API
          </Link>
          <Link href="/pricing" className="px-5 py-2 rounded-lg text-xs font-medium border border-border text-foreground hover:border-border-hover transition-colors">
            Ver planos
          </Link>
        </div>
      </div>

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Geradores", url: "/geradores" },
      ]} />
    </PageShell>
  );
}