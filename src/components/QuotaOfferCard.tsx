"use client";

import { useEffect } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";
import type { DataType } from "@/lib/generators";

interface Props {
  requested: number;
  delivered: number;
  plan: string;
  generatorType: DataType;
  onDismiss?: () => void;
}

/**
 * Aparece quando anonymous pediu mais itens que o cap (plano anon = 50).
 * Em vez de mostrar um erro seco, entrega o cap E mostra a oferta como
 * next step. Padrão: door, não wall.
 */
export default function QuotaOfferCard({ requested, delivered, plan, generatorType, onDismiss }: Props) {
  useEffect(() => {
    track("quota_offer_shown", { generator_type: generatorType, requested, delivered, plan });
  }, [generatorType, requested, delivered, plan]);

  function handleClick(action: "signup" | "dev" | "team") {
    track("quota_offer_clicked", { generator_type: generatorType, action, requested, plan });
  }

  const isAnon = plan === "anon";
  const nextCap = isAnon ? 100 : plan === "free" ? 1000 : 10000;
  const nextLabel = isAnon ? "conta grátis" : plan === "free" ? "plano Dev (R$29/mês)" : "plano Team (R$79/mês)";

  return (
    <div className="mt-3 rounded-xl bg-primary/5 border border-primary/25 p-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">
            Entregamos {delivered.toLocaleString()} de {requested.toLocaleString()} pedidos.
          </p>
          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
            Plano <span className="font-medium text-foreground">{isAnon ? "anônimo" : plan}</span> limita{" "}
            {delivered} itens por chamada. Com {nextLabel} você libera{" "}
            <span className="font-medium text-foreground">{nextCap.toLocaleString()}/chamada</span>.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {isAnon && (
            <Link
              href="/login"
              onClick={() => handleClick("signup")}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-white hover:bg-primary-hover transition-colors whitespace-nowrap"
            >
              Criar conta grátis (100/call)
            </Link>
          )}
          {plan === "free" && (
            <Link
              href="/pricing?plan=dev&ref=quota"
              onClick={() => handleClick("dev")}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-white hover:bg-primary-hover transition-colors whitespace-nowrap"
            >
              Assinar Dev · R$29/mês
            </Link>
          )}
          {plan === "dev" && (
            <Link
              href="/pricing?plan=team&ref=quota"
              onClick={() => handleClick("team")}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-white hover:bg-primary-hover transition-colors whitespace-nowrap"
            >
              Upgrade Team · R$79/mês
            </Link>
          )}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="px-3 py-2 rounded-lg text-[11px] text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Fechar"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
