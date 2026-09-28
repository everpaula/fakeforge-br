"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";

interface Props {
  plano: string;
  cupom?: string;
}

const PLAN_INFO: Record<string, { name: string; price: number; features: string[]; fullName?: string }> = {
  dev: {
    name: "Dev",
    price: 29,
    features: [
      "10.000 chamadas/dia",
      "10.000 items por chamada (bulk)",
      "CNPJ alfanumérico 2026",
      "Todos os presets (fintech, ecom, customer)",
      "SDK Node + Python oficial",
      "Cancelamento em 1 clique",
    ],
  },
  team: {
    name: "Team",
    price: 79,
    features: [
      "100.000 chamadas/dia",
      "10.000 items por chamada",
      "Múltiplas API keys por ambiente",
      "Todos os presets + suporte prioritário",
      "Cancelamento em 1 clique",
    ],
  },
  "enterprise-starter": {
    name: "Enterprise Starter",
    fullName: "Enterprise Starter",
    price: 500,
    features: [
      "50.000 chamadas/dia",
      "10.000 items por chamada",
      "5 API keys por ambiente",
      "Suporte email prioritário 24h",
      "SLA 99.5% uptime",
      "Fatura via NF (Plenor Group LLC)",
      "Cancelamento em 1 clique",
    ],
  },
  "enterprise-growth": {
    name: "Enterprise Growth",
    fullName: "Enterprise Growth",
    price: 1500,
    features: [
      "200.000 chamadas/dia",
      "10 API keys (ambiente + CI paralelo)",
      "Presets custom (fintech seu setor)",
      "Slack compartilhado com o founder",
      "SLA 99.9% uptime",
      "Onboarding call 1h",
      "CNPJ alfanumérico 2026 garantido",
    ],
  },
  "enterprise-scale": {
    name: "Enterprise Scale",
    fullName: "Enterprise Scale",
    price: 5000,
    features: [
      "Chamadas ilimitadas",
      "Multi-API key ilimitado",
      "SLA 99.95% + response time",
      "Presets custom + campos custom",
      "DPO consultation LGPD",
      "Dedicated Slack channel",
      "Contrato via jurídico BR (setup)",
      "Audit log completo",
    ],
  },
};

const COUPON_INFO: Record<string, { discountPct: number; expiresIn: string; source: string }> = {
  CNPJ2026: {
    discountPct: 30,
    expiresIn: "48 horas após envio do email",
    source: "email nurture D14",
  },
};

export default function CheckoutClient({ plano, cupom }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const info = PLAN_INFO[plano] || PLAN_INFO.dev;
  const couponInfo = cupom ? COUPON_INFO[cupom.toUpperCase()] : null;
  const priceWithDiscount = couponInfo
    ? Math.round(info.price * (1 - couponInfo.discountPct / 100))
    : info.price;

  useEffect(() => {
    if (cupom) {
      track("coupon_d14_applied", { plano, cupom: cupom.toUpperCase(), source: "checkout_page" });
    }
    if (plano === "dev" && cupom) {
      track("checkout_started_from_d14", { cupom });
    }
  }, [cupom, plano]);

  async function iniciar() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: plano, coupon: cupom }),
      });
      const data = await res.json();

      if (!res.ok || !data.checkout_url) {
        setError(data.error || "Falha ao criar sessão de checkout");
        setLoading(false);
        return;
      }

      window.location.href = data.checkout_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro de rede");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-xl bg-card border border-border p-6 sm:p-8">
          <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-1">
            Assinar plano
          </p>
          <h1 className="text-2xl font-bold text-foreground">
            FakeForge <span className="text-primary">{info.name}</span>
          </h1>

          {couponInfo && (
            <div className="mt-4 rounded-lg border-2 border-success/40 bg-success/5 p-3">
              <p className="text-xs font-bold text-success uppercase tracking-wider mb-1">
                🎉 Cupom <code className="text-xs bg-background px-1.5 py-0.5 rounded">{cupom?.toUpperCase()}</code> aplicado
              </p>
              <p className="text-[11px] text-muted-foreground">
                {couponInfo.discountPct}% off no primeiro mês. Cupom válido por {couponInfo.expiresIn}.
              </p>
            </div>
          )}

          <div className="mt-5">
            <div className="flex items-baseline gap-2">
              {couponInfo && (
                <span className="text-lg text-muted-foreground line-through">R${info.price}</span>
              )}
              <span className="text-4xl font-bold text-foreground">R${priceWithDiscount}</span>
              <span className="text-sm text-muted-foreground">/mês</span>
            </div>
            {couponInfo && (
              <p className="text-xs text-muted-foreground mt-1">
                A partir do segundo mês: R${info.price}/mês
              </p>
            )}
          </div>

          <ul className="mt-5 space-y-2">
            {info.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                <span className="text-success mt-0.5">✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>

          {error && (
            <p className="text-xs text-danger mt-4 text-center">{error}</p>
          )}

          <button
            onClick={iniciar}
            disabled={loading}
            className="w-full mt-6 py-3 rounded-lg text-sm font-bold bg-primary text-white hover:bg-primary-hover transition-all disabled:opacity-50"
          >
            {loading ? "Abrindo checkout Stripe..." : `Assinar por R$${priceWithDiscount}/mês`}
          </button>

          <p className="text-[11px] text-muted text-center mt-3">
            Cancelamento em 1 clique. Sem fidelidade.
          </p>

          <div className="mt-6 pt-4 border-t border-border text-center">
            <Link href="/pricing" className="text-xs text-muted-foreground hover:text-foreground">
              Ver todos os planos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
