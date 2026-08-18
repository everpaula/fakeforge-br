"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";
import type { DataType } from "@/lib/generators";

interface Props {
  generatorType: DataType;
  quantity: number;
  onDismiss?: () => void;
}

const DISMISS_KEY = "ff_post_copy_dismissed_until";
const DISMISS_HOURS = 6;

function readDismissedUntil(): number {
  if (typeof window === "undefined") return 0;
  return Number(window.localStorage.getItem(DISMISS_KEY) || "0");
}

/**
 * Card inline no momento de pico de intenção — logo após o usuário
 * copiar (item, tudo, ou via CopyAsDropdown). Não bloqueia tela.
 * Auto-dismiss em 20s. Se user clica "Depois", cooldown de 6h.
 */
export default function PostCopyCard({ generatorType, quantity, onDismiss }: Props) {
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    return Date.now() < readDismissedUntil();
  });

  useEffect(() => {
    if (dismissed) return;
    track("post_copy_card_shown", { generator_type: generatorType, quantity });
    const t = setTimeout(() => {
      setDismissed(true);
      onDismiss?.();
    }, 20000);
    return () => clearTimeout(t);
    // Intencional: só dispara evento na primeira render, não em cada mudança
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (dismissed) return null;

  function handleClick(target: "signup" | "docs") {
    track("post_copy_card_clicked", { generator_type: generatorType, target });
  }

  function handleDismiss() {
    track("post_copy_card_dismissed", { generator_type: generatorType });
    if (typeof window !== "undefined") {
      const until = Date.now() + DISMISS_HOURS * 60 * 60 * 1000;
      window.localStorage.setItem(DISMISS_KEY, String(until));
    }
    setDismissed(true);
    onDismiss?.();
  }

  return (
    <div
      className="mt-3 rounded-lg bg-primary/5 border border-primary/25 p-3 sm:p-4 animate-fade-in flex flex-col sm:flex-row sm:items-center gap-3"
      role="status"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground leading-tight">
          Copiado ✓ Precisa de mais de {quantity} ou acesso via API?
        </p>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          Conta grátis libera 100 itens por chamada e API key com 50 requests/dia. Signup em 20 segundos.
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Link
          href="/login"
          onClick={() => handleClick("signup")}
          className="px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-white hover:bg-primary-hover transition-colors whitespace-nowrap"
        >
          Criar conta grátis
        </Link>
        <button
          onClick={handleDismiss}
          className="px-3 py-2 rounded-lg text-[11px] text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Dispensar"
        >
          Depois
        </button>
      </div>
    </div>
  );
}
