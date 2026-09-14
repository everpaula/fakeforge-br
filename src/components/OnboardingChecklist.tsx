"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";

/**
 * Sprint 5 F4: Onboarding checklist pós-primeira chamada.
 *
 * Aparece SÓ depois que user fez pelo menos 1 chamada API (usageToday > 0
 * ou historico). FirstCallActivation cobre pré-ativação. Este componente
 * cobre a próxima fase: retenção + educação sobre features avançadas.
 *
 * 4 steps, persistidos em localStorage por checkbox:
 *   1. Rode um preset (fintech ou ecom)
 *   2. Instale SDK Node ou Python
 *   3. Explore comparações
 *   4. Assine Dev pra 10.000 chamadas/dia
 *
 * Dismissable. Uma vez fechado, não reaparece (localStorage flag).
 */

interface Props {
  hasCalled: boolean;
  isFreePlan: boolean;
}

const STORAGE_KEY = "fakeforge_onboarding_v1";
const DISMISSED_KEY = "fakeforge_onboarding_dismissed_v1";

interface StepState { preset: boolean; sdk: boolean; comparisons: boolean; upgrade: boolean }

const DEFAULT_STATE: StepState = { preset: false, sdk: false, comparisons: false, upgrade: false };

function loadState(): StepState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATE;
  }
}

function saveState(s: StepState) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch { /* ignore */ }
}

function isDismissed(): boolean {
  try { return localStorage.getItem(DISMISSED_KEY) === "true"; } catch { return false; }
}

function markDismissed() {
  try { localStorage.setItem(DISMISSED_KEY, "true"); } catch { /* ignore */ }
}

export default function OnboardingChecklist({ hasCalled, isFreePlan }: Props) {
  const [state, setState] = useState<StepState>(DEFAULT_STATE);
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setState(loadState());
    setDismissed(isDismissed());
  }, []);

  // Não renderiza server-side pra evitar hydration mismatch com localStorage
  if (!mounted) return null;
  if (!hasCalled) return null;
  if (dismissed) return null;

  const steps = [
    {
      key: "preset" as const,
      label: "Rode um preset vertical",
      subtitle: "Bundle rico correlacionado · fintech ou ecom",
      href: "/preset-fintech",
      done: state.preset,
    },
    {
      key: "sdk" as const,
      label: "Instale um SDK oficial",
      subtitle: "npm ou pip · zero deps",
      href: "/docs",
      done: state.sdk,
    },
    {
      key: "comparisons" as const,
      label: "Ver comparações vs. outras ferramentas",
      subtitle: "Entenda quando escolher FakeForge",
      href: "/comparacoes",
      done: state.comparisons,
    },
    ...(isFreePlan ? [{
      key: "upgrade" as const,
      label: "Considere assinar Dev pra 10.000 chamadas/dia",
      subtitle: "R$29/mês · cancela quando quiser",
      href: "/pricing",
      done: state.upgrade,
    }] : []),
  ];

  const doneCount = steps.filter((s) => s.done).length;
  const totalSteps = steps.length;
  const allDone = doneCount === totalSteps;
  const pctDone = Math.round((doneCount / totalSteps) * 100);

  function toggleStep(key: keyof StepState) {
    const next = { ...state, [key]: !state[key] };
    setState(next);
    saveState(next);
    track("onboarding_step_clicked", { step: key, marked_done: next[key] });
  }

  function dismiss() {
    setDismissed(true);
    markDismissed();
    track("onboarding_dismissed", { completed_steps: doneCount, total_steps: totalSteps });
  }

  return (
    <div className="mb-6 rounded-xl bg-card border border-border p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-[10px] font-bold text-primary">{doneCount}</span>
          </div>
          <p className="text-sm font-semibold text-foreground">
            Próximos passos
            <span className="text-xs text-muted ml-2 font-normal">
              ({doneCount}/{totalSteps} completos · {pctDone}%)
            </span>
          </p>
        </div>
        <button
          onClick={dismiss}
          className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
        >
          Ocultar
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-4 h-1 bg-background rounded-full overflow-hidden">
        <div
          className={`h-full transition-all ${allDone ? "bg-success" : "bg-primary"}`}
          style={{ width: `${pctDone}%` }}
        />
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {steps.map((step) => (
          <div
            key={step.key}
            className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
              step.done ? "bg-success/5" : "hover:bg-background"
            }`}
          >
            <button
              onClick={() => toggleStep(step.key)}
              className={`shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                step.done
                  ? "bg-success border-success text-white"
                  : "border-border hover:border-primary"
              }`}
              aria-label={step.done ? "Desmarcar" : "Marcar como feito"}
            >
              {step.done && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
            <Link
              href={step.href}
              onClick={() => track("onboarding_step_clicked", { step: step.key, action: "link_clicked" })}
              className="flex-1 min-w-0"
            >
              <p className={`text-sm font-medium ${step.done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                {step.label}
              </p>
              <p className="text-[11px] text-muted">{step.subtitle}</p>
            </Link>
          </div>
        ))}
      </div>

      {allDone && (
        <div className="mt-4 pt-3 border-t border-border">
          <p className="text-xs text-success font-medium">🎉 Tudo pronto! Você tá turbinando com o FakeForge.</p>
        </div>
      )}
    </div>
  );
}
