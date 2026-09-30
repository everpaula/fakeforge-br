"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";

/**
 * Card de valor extraído no topo do dashboard (Free only).
 *
 * Regras (value-first):
 * - Só aparece com 10+ itens gerados nos últimos 30 dias (aha moment).
 * - Nunca pra plano pago.
 * - Fechar esconde por 7 dias (localStorage).
 * - No máximo 1x por sessão do navegador (sessionStorage).
 * - Qualquer falha no fetch = não renderiza nada.
 */

const MIN_ITEMS = 10;
const DISMISS_KEY = "fakeforge_success_card_dismissed_until";
const SESSION_KEY = "fakeforge_success_card_shown_session";
const DISMISS_MS = 7 * 24 * 60 * 60 * 1000;

interface Metrics {
  authenticated?: boolean;
  plan?: string;
  calls_30d?: number;
  items_30d?: number;
  calls_today?: number;
  daily_limit?: number;
  hours_saved?: number;
  limit_reached_today?: boolean;
  blocks_today_at?: string | null;
}

function isDismissed(): boolean {
  try {
    const until = Number(window.localStorage.getItem(DISMISS_KEY) || 0);
    return until > Date.now();
  } catch {
    return false;
  }
}

function shownThisSession(): boolean {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function formatSaved(items: number): string {
  // 1.000 itens = 1 hora (3,6 s por item). Abaixo de 1h mostra em minutos,
  // senão "0,0 horas" não diz nada.
  const minutes = items * 0.06;
  if (minutes < 1) return "menos de 1 minuto";
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const hours = Math.round((items * 0.001) * 10) / 10;
  return `${hours.toLocaleString("pt-BR")} h`;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export default function SuccessMetricCard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isDismissed() || shownThisSession()) return;

    let alive = true;
    async function load() {
      try {
        const res = await fetch("/api/dashboard/success-metrics");
        if (!res.ok) return;
        const data: Metrics = await res.json();
        if (!alive) return;
        if (data.plan !== "free") return;
        if ((data.items_30d ?? 0) < MIN_ITEMS) return;
        try {
          window.sessionStorage.setItem(SESSION_KEY, "1");
        } catch {/* ignore */}
        setMetrics(data);
        setVisible(true);
      } catch {
        // silent fail: sem card, sem quebrar o dashboard
      }
    }
    load();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (visible && metrics) {
      track("success_card_shown", {
        items_30d: metrics.items_30d,
        calls_30d: metrics.calls_30d,
        calls_today: metrics.calls_today,
      });
    }
    // dispara uma vez, quando o card aparece
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!visible || !metrics) return null;

  const items = metrics.items_30d ?? 0;
  const limit = metrics.daily_limit ?? 50;

  function handleDismiss() {
    try {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now() + DISMISS_MS));
    } catch {/* ignore */}
    track("success_card_dismissed", { items_30d: items });
    setVisible(false);
  }

  let paceLine: string;
  if (metrics.limit_reached_today) {
    paceLine = `Hoje você já usou as ${limit} chamadas do Free.`;
  } else if (metrics.blocks_today_at) {
    paceLine = `No ritmo de hoje, você chega no limite de ${limit} chamadas do Free por volta das ${formatTime(metrics.blocks_today_at)}.`;
  } else {
    paceLine = "Você ainda tem margem hoje.";
  }

  return (
    <div className="mb-6 rounded-xl border border-success/30 bg-gradient-to-br from-success/10 via-transparent to-transparent p-5 sm:p-6 relative">
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Fechar"
        className="absolute top-3 right-3 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <div className="flex items-start gap-3 pr-6">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-success/15 text-success" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-base sm:text-lg font-bold text-foreground leading-tight">
            Você já gerou {items.toLocaleString("pt-BR")} dados com o FakeForge
          </p>

          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mt-3 mb-1">
            Nos últimos 30 dias
          </p>
          <ul className="space-y-1 text-sm text-foreground">
            <li>
              <strong>{(metrics.calls_30d ?? 0).toLocaleString("pt-BR")}</strong> chamadas API
            </li>
            <li>
              <strong>{items.toLocaleString("pt-BR")}</strong> itens gerados no total
            </li>
            <li>
              <strong>~{formatSaved(items)}</strong> economizadas vs código local{" "}
              <span
                tabIndex={0}
                role="note"
                title="Estimativa: 3,6 segundos de código local por item de teste. 1.000 itens equivalem a 1 hora."
                aria-label="Estimativa: 3,6 segundos de código local por item de teste. 1.000 itens equivalem a 1 hora."
                className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-border text-[10px] text-muted-foreground cursor-help align-middle"
              >
                ?
              </span>
            </li>
          </ul>

          <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{paceLine}</p>

          <Link
            href="/pricing?plan=dev&ref=success_card"
            onClick={() => track("success_card_clicked", { items_30d: items, target: "dev" })}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-primary text-white hover:bg-primary-hover transition-colors"
          >
            Ver planos R$29/mês
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
