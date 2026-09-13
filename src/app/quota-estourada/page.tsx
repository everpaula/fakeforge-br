import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Chegou no Limite Grátis: Assine Dev e Continue Agora",
  description: "Você bateu o limite do plano grátis do FakeForge. Assine o plano Dev por R$29/mês e libere 10.000 chamadas por dia + 10.000 items por chamada + presets premium.",
  robots: {
    // Nao indexar essa landing - e' dead-end contextual, nao SEO
    index: false,
    follow: false,
  },
};

export default function QuotaEstourada() {
  return (
    <PageShell>
      <div className="max-w-2xl mx-auto">
        {/* Hero: chegou no limite */}
        <div className="mb-8 rounded-2xl border-2 border-danger/40 bg-gradient-to-br from-danger/10 via-danger/5 to-transparent p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-danger animate-pulse" />
            <p className="text-[11px] font-bold uppercase tracking-widest text-danger">
              Limite grátis atingido
            </p>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
            Você chegou no teto do plano grátis hoje.
          </h1>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
            O reset acontece às <strong className="text-foreground">00:00 (horário de Brasília)</strong>.
            Se você ainda precisa gerar dados agora, o plano Dev libera{" "}
            <strong className="text-foreground">10.000 chamadas por dia</strong> imediatamente após
            a confirmação do pagamento.
          </p>
        </div>

        {/* Comparativo escalado brutalmente */}
        <div className="mb-8 rounded-xl bg-card border border-border overflow-hidden">
          <div className="grid grid-cols-2 divide-x divide-border">
            <div className="p-5">
              <p className="text-[10px] text-muted uppercase tracking-widest font-bold">Plano atual</p>
              <p className="text-2xl font-bold text-foreground mt-1">Free</p>
              <p className="text-3xl font-bold text-danger mt-3">100</p>
              <p className="text-xs text-muted-foreground">chamadas/dia</p>
              <p className="text-lg font-semibold text-foreground mt-3">100</p>
              <p className="text-xs text-muted-foreground">items/chamada</p>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-[10px] text-muted uppercase tracking-wider">Status</p>
                <p className="text-xs text-danger font-bold mt-1">✕ Bloqueado até 00:00</p>
              </div>
            </div>
            <div className="p-5 bg-accent/5">
              <p className="text-[10px] text-accent uppercase tracking-widest font-bold">Upgrade</p>
              <p className="text-2xl font-bold text-foreground mt-1">Dev</p>
              <p className="text-3xl font-bold text-accent mt-3">10.000</p>
              <p className="text-xs text-muted-foreground">chamadas/dia</p>
              <p className="text-lg font-semibold text-foreground mt-3">10.000</p>
              <p className="text-xs text-muted-foreground">items/chamada</p>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-[10px] text-muted uppercase tracking-wider">Preço</p>
                <p className="text-xs text-foreground font-bold mt-1">R$29/mês · cancela quando quiser</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA principal */}
        <div className="mb-8 text-center">
          <Link
            href="/pricing?plan=dev&ref=quota_estourada"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold bg-accent text-white shadow-xl shadow-accent/40 hover:bg-accent/90 hover:shadow-accent/60 hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            Assinar Dev agora · R$29/mês
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </Link>
          <p className="text-xs text-muted-foreground mt-3">
            Ou <Link href="/" className="text-primary hover:underline">volte pra home</Link> e aguarde o reset em 00:00.
          </p>
        </div>

        {/* Por que o Dev vale a pena (loss aversion pura + product proof) */}
        <div className="mb-8 rounded-xl bg-card border border-border p-5">
          <h2 className="text-sm font-semibold text-foreground mb-3">Se você já bateu o limite grátis, o Dev evita:</h2>
          <ul className="space-y-2.5">
            <li className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="text-success shrink-0 mt-0.5">✓</span>
              <span>
                <strong className="text-foreground">Pausar o CI enquanto espera reset.</strong> 10.000 chamadas/dia
                cobre pipelines pesados de fixture, seed e mock de checkout.
              </span>
            </li>
            <li className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="text-success shrink-0 mt-0.5">✓</span>
              <span>
                <strong className="text-foreground">Fragmentar chamada em várias requests.</strong>{" "}
                Dev permite 10.000 items por chamada única - populador de banco vira uma linha de código.
              </span>
            </li>
            <li className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="text-success shrink-0 mt-0.5">✓</span>
              <span>
                <strong className="text-foreground">Perder o preset customer completo.</strong> Pessoa
                com CPF + email + endereço + telefone + PIX correlacionados em 1 chamada só existe no Dev.
              </span>
            </li>
            <li className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="text-success shrink-0 mt-0.5">✓</span>
              <span>
                <strong className="text-foreground">Ficar sem suporte por email.</strong> No Dev você
                fala direto comigo (Everton), autor do FakeForge. Bug ou dúvida vira resposta em horas.
              </span>
            </li>
          </ul>
        </div>

        {/* FAQ rápido pra tirar objeções finais */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-foreground mb-3">Dúvidas rápidas</h2>
          <div className="space-y-2">
            {[
              { q: "Cancelo quando quiser?", a: "Sim. Cancela pelo dashboard em 1 clique. Cobrança para imediatamente no próximo ciclo." },
              { q: "Posso testar antes?", a: "Você já testou - por isso chegou no teto. O plano grátis serve pra sentir o produto. Dev é pra uso profissional recorrente." },
              { q: "Aceita cartão brasileiro?", a: "Sim. Stripe processa Visa, Master, Elo. Fatura em BRL. Se preferir boleto ou PIX, me manda email em hey@fakeforge.com.br." },
              { q: "E se eu quiser mais que 10.000/dia?", a: "Plano Team (R$79/mês) libera 100.000 chamadas/dia. Ideal pra load test ou app com muitos users." },
            ].map(({ q, a }) => (
              <details key={q} className="group border border-border rounded-lg">
                <summary className="flex items-center justify-between px-4 py-2.5 cursor-pointer hover:bg-card-hover transition-colors text-xs">
                  <span className="font-medium text-foreground">{q}</span>
                  <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
                </summary>
                <p className="px-4 pb-3 text-xs text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Fallback pros que nao querem pagar agora */}
        <div className="rounded-xl bg-primary/5 border border-primary/20 p-5 text-center">
          <p className="text-sm text-foreground font-medium mb-2">Não quer pagar hoje?</p>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            O reset acontece às 00:00 (horário de Brasília). Você pode continuar gerando amanhã
            no plano grátis com o mesmo limite de 100 chamadas/dia.
          </p>
          <Link href="/" className="text-xs text-primary hover:underline font-medium">
            Voltar pra home ←
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
