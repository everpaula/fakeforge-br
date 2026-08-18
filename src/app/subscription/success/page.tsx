import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Assinatura confirmada",
  robots: { index: false, follow: false },
};

export default function SubscriptionSuccess() {
  return (
    <PageShell>
      <div className="max-w-lg mx-auto py-12 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-success/10 mb-6">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-success">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold tracking-tight">Assinatura confirmada</h1>
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          Pagamento processado com sucesso. Seu plano já está ativo — pode começar a usar
          agora mesmo pelo dashboard.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-2 justify-center">
          <Link
            href="/dashboard"
            className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-primary text-white hover:bg-primary-hover transition-colors"
          >
            Ir pro dashboard
          </Link>
          <Link
            href="/docs"
            className="px-6 py-2.5 rounded-lg text-sm font-medium border border-border text-foreground hover:border-border-hover transition-colors"
          >
            Ver documentação da API
          </Link>
        </div>

        <div className="mt-10 rounded-xl bg-card border border-border p-5 text-left">
          <h2 className="text-sm font-semibold text-foreground mb-2">O que fazer agora</h2>
          <ol className="text-xs text-muted-foreground space-y-2 list-decimal list-inside">
            <li>
              Vai pro <Link href="/dashboard" className="text-primary hover:underline">dashboard</Link>{" "}
              e copia sua API key.
            </li>
            <li>
              Testa uma chamada:{" "}
              <code className="text-[11px] bg-background border border-border px-1.5 py-0.5 rounded font-mono">
                curl -H &quot;X-API-Key: SUA_KEY&quot; https://fakeforge.com.br/api/generate?type=cpf&amp;quantity=10
              </code>
            </li>
            <li>
              Se precisar cancelar ou trocar de plano, escreve pra{" "}
              <a href="mailto:contato@fakeforge.com.br" className="text-primary hover:underline">
                contato@fakeforge.com.br
              </a>.
            </li>
          </ol>
        </div>

        <p className="mt-6 text-[11px] text-muted-foreground">
          Sua fatura vai chegar no email cadastrado em até 10 minutos. Renovação automática mensal;
          cancele a qualquer momento sem multa.
        </p>
      </div>
    </PageShell>
  );
}
