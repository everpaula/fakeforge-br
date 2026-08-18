"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";

const STORAGE_KEY = "ff_gen_count";
const DISMISS_KEY = "ff_nudge_dismissed_until";
const TRIGGER_AT = 5;
const DISMISS_DAYS = 7;

function readCount(): number {
  if (typeof window === "undefined") return 0;
  return Number(window.localStorage.getItem(STORAGE_KEY) || "0");
}

function readDismissedUntil(): number {
  if (typeof window === "undefined") return 0;
  return Number(window.localStorage.getItem(DISMISS_KEY) || "0");
}

/**
 * Soft inline nudge shown after N anonymous generations. Persists count in
 * localStorage so it survives across pages. Dismissal sets a 7-day cooldown.
 *
 * Render below the results panel of generator pages. The bump() callback is
 * what increments the counter — caller fires it after each successful
 * generation.
 */
export function useGenerationNudge() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const count = readCount();
    const dismissedUntil = readDismissedUntil();
    const now = Date.now();
    if (count >= TRIGGER_AT && now > dismissedUntil) {
      setShow(true);
      track("nudge_shown", { source: "generation_count", count });
    }
  }, []);

  function bump() {
    if (typeof window === "undefined") return;
    const next = readCount() + 1;
    window.localStorage.setItem(STORAGE_KEY, String(next));
    const dismissedUntil = readDismissedUntil();
    if (next >= TRIGGER_AT && Date.now() > dismissedUntil && !show) {
      setShow(true);
      track("nudge_shown", { source: "generation_count", count: next });
    }
  }

  function dismiss() {
    if (typeof window === "undefined") return;
    const until = Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000;
    window.localStorage.setItem(DISMISS_KEY, String(until));
    setShow(false);
    track("nudge_dismissed", { source: "generation_count" });
  }

  return { show, bump, dismiss };
}

export function SignupNudge({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="mt-4 rounded-xl bg-card border border-border p-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">
            Curtindo o gerador? Vai mais longe com uma conta grátis.
          </p>
          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
            API key pessoal com 50 chamadas/dia, histórico de gerações, presets salvos
            e prioridade para gerar lotes de até 10.000 itens.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/login"
            onClick={() => track("nudge_clicked", { source: "generation_count" })}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-white hover:bg-primary-hover transition-colors whitespace-nowrap"
          >
            Criar conta grátis
          </Link>
          <button
            onClick={onDismiss}
            className="px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Dispensar"
          >
            Agora não
          </button>
        </div>
      </div>
    </div>
  );
}
