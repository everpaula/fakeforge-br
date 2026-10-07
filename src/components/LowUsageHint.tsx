"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";

/**
 * Dica contextual que aparece pra users Free com 1-5 chamadas nos últimos
 * 7 dias — perfil "testador" identificado no diagnóstico 06/out. Ensina
 * CASO DE USO, não paywall.
 *
 * - 3 dicas rotativas por dia (hash do dia pra escolher)
 * - Dismiss por 7 dias via localStorage
 * - 1x por sessão
 * - Silent fail se qualquer endpoint quebrar
 */

interface Metrics {
  authenticated?: boolean;
  plan?: string;
  calls_30d?: number;
  calls_today?: number;
}

const DISMISS_KEY = "fakeforge_low_usage_hint_dismissed_until";
const SESSION_KEY = "fakeforge_low_usage_hint_shown_session";
const DISMISS_MS = 7 * 24 * 60 * 60 * 1000;

const HINTS = [
  {
    icon: "🌱",
    title: "Rode seed de banco com 1 chamada",
    body: "A UI gera 1 item por vez. A API aceita quantity até 100 no Free (10k no Dev). Script Node de 5 linhas popula tabela customers inteira em staging.",
    cta: "Ver seed PostgreSQL",
    href: "/blog/popular-postgresql-dados-brasileiros-staging",
    event_label: "seed_banco",
  },
  {
    icon: "🔄",
    title: "CI/CD determinístico com seed",
    body: "Mesmo parâmetro seed devolve os mesmos CPFs. Em pipeline, cada PR usa dados iguais, teste roda determinístico, flaky test some.",
    cta: "Ver guia CI/CD",
    href: "/blog/5-fluxos-que-exigem-api-fakeforge",
    event_label: "ci_cd",
  },
  {
    icon: "💳",
    title: "Checkout PIX com QR Code dinâmico",
    body: "Preset pix_dynamic devolve chave + QR Code EMV BR Code + CRC16. Teste E2E de checkout sem mock manual.",
    cta: "Ver QR Code PIX",
    href: "/blog/qr-code-pix-dinamico-emv-br-code-nodejs",
    event_label: "pix_qrcode",
  },
];

function isDismissed(): boolean {
  try {
    const until = Number(window.localStorage.getItem(DISMISS_KEY) || 0);
    return until > Date.now();
  } catch { return false; }
}

function shownThisSession(): boolean {
  try { return window.sessionStorage.getItem(SESSION_KEY) === "1"; }
  catch { return false; }
}

// Hint do dia: escolhe baseado em dia do ano, estável no mesmo dia
function hintOfTheDay() {
  const day = Math.floor(Date.now() / 86400000);
  return HINTS[day % HINTS.length];
}

export default function LowUsageHint() {
  const [visible, setVisible] = useState(false);
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    if (isDismissed() || shownThisSession()) return;

    (async () => {
      try {
        const res = await fetch("/api/dashboard/success-metrics");
        if (!res.ok) return;
        const data: Metrics = await res.json();
        if (data.plan !== "free") return;
        const calls = data.calls_30d ?? 0;
        // Alvo: testador (1-5 chamadas em 30d). 0 chamadas = FirstCallActivation
        // já cobre. 6+ = user ativo, não precisa de hint básico.
        if (calls < 1 || calls > 5) return;
        try { window.sessionStorage.setItem(SESSION_KEY, "1"); } catch {}
        setMetrics(data);
        setVisible(true);
      } catch { /* silent */ }
    })();
  }, []);

  useEffect(() => {
    if (visible && metrics) {
      const hint = hintOfTheDay();
      track("low_usage_hint_shown", {
        calls_30d: metrics.calls_30d,
        hint_label: hint.event_label,
      });
    }
  }, [visible, metrics]);

  if (!visible || !metrics) return null;

  const hint = hintOfTheDay();

  function handleDismiss() {
    try {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now() + DISMISS_MS));
    } catch {}
    track("low_usage_hint_dismissed", { hint_label: hint.event_label });
    setVisible(false);
  }

  function handleClick() {
    track("low_usage_hint_clicked", { hint_label: hint.event_label });
  }

  return (
    <div className="mb-6 rounded-xl border border-accent/30 bg-gradient-to-br from-accent/10 via-transparent to-transparent p-5 relative">
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
        <span className="text-2xl shrink-0" aria-hidden="true">{hint.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-accent mb-1">Dica pra tirar mais do Free</p>
          <p className="text-base font-bold text-foreground leading-tight">{hint.title}</p>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{hint.body}</p>
          <Link
            href={`${hint.href}?utm_source=dashboard&utm_campaign=low_usage_hint`}
            onClick={handleClick}
            className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-accent hover:text-accent/80 transition-colors"
          >
            {hint.cta}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
