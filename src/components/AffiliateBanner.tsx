interface Props {
  variant?: "hostinger" | "rocketseat";
}

const VARIANTS = {
  hostinger: {
    title: "Vai colocar seu projeto no ar?",
    desc: "Hospedagem que aceita Pix e fala português. Hostinger tem servidores no Brasil, suporte em pt-BR e plano dev a partir de R$11,99/mês.",
    cta: "Ver planos com desconto",
    href: "https://www.hostinger.com.br/?REFERRALCODE=FAKEFORGE",
    accent: "from-purple-600/20 to-purple-900/20 border-purple-500/30",
  },
  rocketseat: {
    title: "Quer virar dev de verdade?",
    desc: "A Rocketseat tem trilhas de fullstack e cursos práticos com projetos reais. Acesso à comunidade ativa de devs e mentoria.",
    cta: "Ver trilhas Rocketseat",
    href: "https://www.rocketseat.com.br/?ref=fakeforge",
    accent: "from-fuchsia-600/20 to-fuchsia-900/20 border-fuchsia-500/30",
  },
};

export default function AffiliateBanner({ variant = "hostinger" }: Props) {
  const v = VARIANTS[variant];

  return (
    <aside
      className={`my-10 rounded-xl border bg-gradient-to-br ${v.accent} p-5 sm:p-6`}
      role="complementary"
      aria-label="Recomendação de parceiro"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted mb-1">Parceiro recomendado</p>
          <h3 className="text-base sm:text-lg font-semibold text-foreground">{v.title}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed">{v.desc}</p>
        </div>
        <a
          href={v.href}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="shrink-0 px-4 py-2 rounded-lg text-xs font-semibold bg-foreground text-background hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          {v.cta} →
        </a>
      </div>
      <p className="text-[10px] text-muted mt-3">
        Esta é uma recomendação com link de afiliado. O FakeForge recebe uma comissão sem custo extra para você.
      </p>
    </aside>
  );
}
