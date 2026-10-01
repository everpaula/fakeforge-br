"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";

/**
 * Card de milestone no topo do dashboard (Free only): 5 dias seguidos de uso.
 *
 * Regras (value-first):
 * - Só aparece com streak real de 5+ dias seguidos (checado no servidor).
 * - Nunca pra plano pago.
 * - 1x por milestone: ver e fechar/clicar grava `fakeforge_milestone_streak5_seen`.
 * - "Talvez depois" também esconde por 7 dias.
 * - localStorage só é gravado em interação, depois do card renderizado.
 * - Qualquer falha no fetch = não renderiza nada.
 */

const SEEN_KEY = "fakeforge_milestone_streak5_seen";
const DISMISS_KEY = "fakeforge_milestone_streak5_dismissed_until";
const DISMISS_MS = 7 * 24 * 60 * 60 * 1000;

interface Milestones {
  plan?: string;
  streak_days?: number;
  streak5_achieved?: boolean;
}

function alreadyHandled(): boolean {
  try {
    if (window.localStorage.getItem(SEEN_KEY) === "true") return true;
    const until = Number(window.localStorage.getItem(DISMISS_KEY) || 0);
    return until > Date.now();
  } catch {
    return false;
  }
}

function markSeen(withSnooze: boolean) {
  try {
    window.localStorage.setItem(SEEN_KEY, "true");
    if (withSnooze) {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now() + DISMISS_MS));
    }
  } catch {/* ignore */}
}

export default function MilestoneCelebrationCard() {
  const [streak, setStreak] = useState<number | null>(null);

  useEffect(() => {
    if (alreadyHandled()) return;

    let alive = true;
    async function load() {
      try {
        const res = await fetch("/api/dashboard/milestones");
        if (!res.ok) return;
        const data: Milestones = await res.json();
        if (!alive) return;
        if (data.plan !== "free") return;
        if (!data.streak5_achieved) return;
        setStreak(data.streak_days ?? 5);
      } catch {
        // silent fail: sem card, sem quebrar o dashboard
      }
    }
    load();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (streak !== null) {
      track("milestone_streak5_shown", { streak_days: streak });
    }
  }, [streak]);

  if (streak === null) return null;

  function handleDismiss() {
    markSeen(true);
    track("milestone_streak5_dismissed", { streak_days: streak });
    setStreak(null);
  }

  function handleClick() {
    markSeen(false);
    track("milestone_streak5_clicked", { streak_days: streak, target: "dev" });
  }

  return (
    <div className="mb-6 rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-transparent to-transparent p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="text-2xl leading-none" aria-hidden="true">🎉</span>
        <div className="flex-1 min-w-0">
          <p className="text-base sm:text-lg font-bold text-foreground leading-tight">
            {streak} dias seguidos gerando dados
          </p>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Você entrou na rotina. Quem chega aqui geralmente precisa de mais do que 50 chamadas por dia.
          </p>

          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mt-4 mb-1">
            Sua rotina desbloquearia
          </p>
          <ul className="space-y-1 text-sm text-foreground">
            <li>10.000 chamadas/dia (Dev, R$29/mês)</li>
            <li>Sem interrupção quando bate o limite</li>
            <li>CNPJ alfanumérico 2026 garantido</li>
          </ul>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Link
              href="/pricing?plan=dev&ref=milestone_streak5"
              onClick={handleClick}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-primary text-white hover:bg-primary-hover transition-colors"
            >
              Assinar R$29/mês
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
            <button
              type="button"
              onClick={handleDismiss}
              className="px-3 py-2 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
            >
              Talvez depois
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
