"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Usage {
  authenticated: boolean;
  plan?: string;
  used_today?: number;
  daily_limit?: number;
  remaining?: number;
  percent?: number;
}

interface Props {
  variant?: "compact" | "full";
}

/**
 * Mostra quantas chamadas de API o user usou hoje vs limite do plano.
 * Loss aversion: user vê que tá perto do teto e considera upgrade.
 *
 * Anônimos veem null (nada). Retorna silenciosamente se não autenticado.
 * Refresh a cada 60s automaticamente.
 */
export default function QuotaMeter({ variant = "full" }: Props) {
  const [usage, setUsage] = useState<Usage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const res = await fetch("/api/usage/today");
        const data = await res.json();
        if (alive) {
          setUsage(data);
          setLoading(false);
        }
      } catch {
        if (alive) setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 60_000);
    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, []);

  if (loading || !usage || !usage.authenticated) return null;

  const percent = usage.percent || 0;
  const isHigh = percent >= 80;
  const isMedium = percent >= 50 && percent < 80;

  const barColor = isHigh ? "bg-danger" : isMedium ? "bg-accent" : "bg-primary";
  const textColor = isHigh ? "text-danger" : isMedium ? "text-accent" : "text-muted-foreground";

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className={textColor}>
          {usage.used_today}/{usage.daily_limit}
        </span>
        <div className="w-14 h-1 rounded-full bg-border overflow-hidden">
          <div
            className={`h-full ${barColor} transition-all`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    );
  }

  // Comparativo Free vs Dev: mostra visualmente o quao pequeno Free é vs Dev.
  // 100 vs 10.000 = ratio 1% na barra do Dev. Loss aversion escancarada.
  const isFree = usage.plan === "free";
  const devLimit = 10000;
  const usedInDevScale = usage.used_today || 0;
  const devPercent = Math.min(100, (usedInDevScale / devLimit) * 100);

  return (
    <div className="rounded-xl bg-card border border-border p-4">
      <div className="flex items-baseline justify-between mb-2">
        <div>
          <p className="text-[11px] text-muted uppercase tracking-wider">Uso da API hoje</p>
          <p className={`text-xl font-bold mt-1 ${textColor}`}>
            {usage.used_today?.toLocaleString()}
            <span className="text-sm text-muted-foreground font-normal ml-1">
              / {usage.daily_limit?.toLocaleString()}
            </span>
          </p>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-background text-muted-foreground border border-border uppercase font-medium">
          {usage.plan}
        </span>
      </div>

      <div className="h-2 rounded-full bg-border overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Comparativo Free vs Dev - escancara o gap 100x visualmente */}
      {isFree && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-baseline justify-between mb-2">
            <p className="text-[11px] text-muted uppercase tracking-wider">
              Mesma chamada no plano Dev
            </p>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/30 uppercase font-bold">
              100x mais
            </span>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <p className="text-sm font-bold text-foreground">
              {usedInDevScale.toLocaleString()}
              <span className="text-xs text-muted-foreground font-normal ml-1">
                / {devLimit.toLocaleString()}
              </span>
            </p>
            <p className="text-[10px] text-muted">
              ({devPercent.toFixed(2)}% do Dev)
            </p>
          </div>
          <div className="h-2 rounded-full bg-border overflow-hidden">
            <div
              className="h-full bg-accent transition-all"
              style={{ width: `${Math.max(devPercent, 0.5)}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
            No Dev, esse mesmo uso é <strong className="text-foreground">insignificante</strong>. R$29/mês libera 10.000 chamadas/dia.
          </p>
        </div>
      )}

      {isHigh && isFree && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-foreground font-medium mb-2">
            Você usou {percent}% do limite grátis hoje.
          </p>
          <Link
            href="/pricing?plan=dev&ref=quota_meter"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-accent text-white shadow-md shadow-accent/30 hover:bg-accent/90 hover:shadow-accent/50 transition-all"
          >
            Assinar Dev · 100x mais →
          </Link>
        </div>
      )}

      {isMedium && isFree && !isHigh && (
        <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
          Faltam <strong className="text-foreground">{usage.remaining}</strong> chamadas. Reset em 00:00.
        </p>
      )}
    </div>
  );
}
