"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import FirstCallActivation from "./FirstCallActivation";

interface Status {
  should_show: boolean;
  first_key?: string;
}

/**
 * Self-contained wrapper que renderiza o FirstCallActivation
 * em qualquer pagina que use PageShell. Fetch proprio via
 * /api/user/activation-status pra checar se user tá logado,
 * tem API key ativa e ainda nao usou hoje.
 *
 * Skip explicito no /dashboard porque la o DashboardClient
 * ja renderiza o card diretamente e nao queremos duplicar.
 * Skip em /admin e /login pra nao poluir.
 *
 * Adicionado no PageShell 26/08 apos audit: FirstCallActivation
 * antes so vivia no /dashboard e users vindos de SEO/geradores
 * nunca chegavam la (activation caiu pra 2.33% em 30d).
 */
export default function ActivationCallout() {
  const pathname = usePathname();
  const [status, setStatus] = useState<Status | null>(null);

  const skipPaths = ["/dashboard", "/admin", "/login", "/auth"];
  const shouldSkip = skipPaths.some((p) => pathname?.startsWith(p));

  useEffect(() => {
    if (shouldSkip) {
      setStatus(null);
      return;
    }
    let alive = true;
    async function load() {
      try {
        const res = await fetch("/api/user/activation-status");
        const data = await res.json();
        if (alive) setStatus(data);
      } catch {
        if (alive) setStatus({ should_show: false });
      }
    }
    load();
    return () => { alive = false; };
  }, [pathname, shouldSkip]);

  if (shouldSkip || !status?.should_show || !status.first_key) return null;

  return (
    <div className="mb-6">
      <FirstCallActivation
        apiKey={status.first_key}
        onActivated={() => setStatus({ should_show: false })}
      />
    </div>
  );
}
