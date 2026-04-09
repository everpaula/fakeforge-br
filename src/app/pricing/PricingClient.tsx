"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "R$0",
    period: "para sempre",
    description: "Para uso pessoal e testes rápidos",
    features: [
      "Web ilimitado (gerar e copiar)",
      "100 requests/dia na API",
      "Todos os 15 tipos de dados",
      "Export JSON, CSV, SQL",
    ],
    cta: "Usar grátis",
    highlighted: false,
  },
  {
    id: "dev",
    name: "Dev",
    price: "R$29",
    period: "/mes",
    description: "Para devs que integram no CI/CD",
    features: [
      "Tudo do Free +",
      "10.000 requests/dia na API",
      "API keys com tracking de uso",
      "Schema builder (dados correlacionados)",
      "5 presets prontos",
      "Suporte por email",
    ],
    cta: "Assinar Dev",
    highlighted: true,
  },
  {
    id: "team",
    name: "Team",
    price: "R$79",
    period: "/mes",
    description: "Para times e empresas",
    features: [
      "Tudo do Dev +",
      "100.000 requests/dia na API",
      "Múltiplas API keys",
      "Schemas customizados salvos",
      "Dashboard de uso por key",
      "Suporte prioritário",
    ],
    cta: "Assinar Team",
    highlighted: false,
  },
];

export default function PricingClient() {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);

  async function handleSubscribe(planId: string) {
    if (planId === "free") {
      router.push("/login");
      return;
    }

    setLoading(planId);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });
      const data = await res.json();

      if (data.error === "unauthenticated") {
        router.push("/login?redirect=/pricing");
        return;
      }

      if (data.error) {
        setError(data.error);
        return;
      }

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        setError("Checkout URL não retornada. Tente novamente.");
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor. Tente novamente.");
      console.error("Checkout error:", err);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
      {PLANS.map((plan) => (
        <div
          key={plan.id}
          className={`rounded-xl p-6 border transition-all ${
            plan.highlighted
              ? "bg-primary/5 border-primary/30 scale-[1.02]"
              : "bg-card border-border"
          }`}
        >
          {plan.highlighted && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-3 block">
              Mais popular
            </span>
          )}

          <h2 className="text-lg font-bold text-foreground">{plan.name}</h2>
          <div className="mt-2 mb-1">
            <span className="text-3xl font-bold text-foreground">{plan.price}</span>
            <span className="text-sm text-muted">{plan.period}</span>
          </div>
          <p className="text-xs text-muted mb-6">{plan.description}</p>

          <ul className="space-y-2 mb-6">
            {plan.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-primary mt-0.5 shrink-0">&#10003;</span>
                {feature}
              </li>
            ))}
          </ul>

          <button
            onClick={() => handleSubscribe(plan.id)}
            disabled={loading !== null}
            className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all ${
              plan.highlighted
                ? "bg-primary text-white hover:bg-primary-hover"
                : "bg-background border border-border text-foreground hover:border-border-hover"
            } disabled:opacity-50`}
          >
            {loading === plan.id ? "Processando..." : plan.cta}
          </button>
        </div>
      ))}

      {error && (
        <div className="md:col-span-3 mt-4 p-3 rounded-lg bg-danger/10 border border-danger/20 text-center">
          <p className="text-sm text-danger">{error}</p>
        </div>
      )}

      <div className="md:col-span-3 mt-4 text-center">
        <p className="text-xs text-muted">
          Pagamento via Mercado Pago. Pix, cartão de crédito ou boleto.
          Cancele a qualquer momento.
        </p>
      </div>

      {/* Comparison table */}
      <div className="md:col-span-3 mt-10 rounded-xl bg-card border border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Comparação detalhada</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-2.5 text-muted-foreground font-medium">Feature</th>
                <th className="text-center px-4 py-2.5 text-muted-foreground font-medium">Free</th>
                <th className="text-center px-4 py-2.5 text-primary font-medium">Dev</th>
                <th className="text-center px-4 py-2.5 text-accent font-medium">Team</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["Geração web (copiar/exportar)", "Ilimitado", "Ilimitado", "Ilimitado"],
                ["Chamadas API por dia", "100", "10.000", "100.000"],
                ["Export JSON/CSV/SQL", "check", "check", "check"],
                ["Schema builder (dados correlacionados)", "—", "check", "check"],
                ["Presets prontos (customer, employee...)", "—", "check", "check"],
                ["API keys com tracking de uso", "1", "5", "20"],
                ["Suporte", "—", "Email", "Prioritário"],
              ].map(([feature, free, dev, team], i) => (
                <tr key={i}>
                  <td className="px-4 py-2.5 text-muted-foreground">{feature}</td>
                  {[free, dev, team].map((val, j) => (
                    <td key={j} className="px-4 py-2.5 text-center">
                      {val === "check" ? (
                        <span className="text-success">&#10003;</span>
                      ) : val === "—" ? (
                        <span className="text-muted">—</span>
                      ) : (
                        <span className={j === 1 ? "text-primary font-medium" : j === 2 ? "text-accent font-medium" : "text-foreground"}>
                          {val}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="md:col-span-3 mt-10">
        <h2 className="text-lg font-semibold text-foreground mb-4 text-center">Perguntas frequentes</h2>
        <div className="space-y-3 max-w-2xl mx-auto">
          {[
            {
              q: "Posso cancelar a qualquer momento?",
              a: "Sim. Não há fidelidade ou multa. Cancele quando quiser pelo dashboard.",
            },
            {
              q: "O upgrade é instantâneo?",
              a: "Sim. Assim que o pagamento for confirmado, seu limite de chamadas aumenta automaticamente.",
            },
            {
              q: "Preciso trocar minha API key?",
              a: "Não. A mesma key que você já usa continua funcionando com o novo limite.",
            },
            {
              q: "Aceita quais formas de pagamento?",
              a: "Cartão de crédito, Pix e boleto via Mercado Pago.",
            },
            {
              q: "A geração pelo site continua grátis?",
              a: "Sim. O uso pelo site (gerar, copiar, exportar) é grátis e ilimitado, sempre. Os planos pagos são para uso via API.",
            },
          ].map((faq, i) => (
            <details key={i} className="rounded-lg bg-card border border-border overflow-hidden group">
              <summary className="px-4 py-3 text-sm font-medium text-foreground cursor-pointer hover:bg-card-hover transition-colors select-none">
                {faq.q}
              </summary>
              <div className="px-4 pb-3 text-sm text-muted-foreground">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
