"use client";

import { useEffect, useRef } from "react";

/**
 * Sprint 6 — AdBanner do Google AdSense.
 *
 * Renderiza um bloco de ad em placement manual. Requer:
 *   - process.env.NEXT_PUBLIC_ADSENSE_CLIENT = "ca-pub-XXXXXXXXXXXXXXXX"
 *   - slot ID criado no dashboard do AdSense (Ad Units → Display ads)
 *
 * Se env var faltar ou disabled=true, o componente renderiza `null` —
 * não polui a página com ad vazio.
 *
 * Design decisions:
 *   1. Uses "non-personalized ads" (NPA=1) por default. Menos revenue mas
 *      zero exposição LGPD. Everton pode remover a flag depois se decidir
 *      implementar cookie consent.
 *   2. `data-full-width-responsive="true"` deixa o ad se adaptar mobile.
 *   3. `data-adtest="on"` fica ligado em dev (localhost) pra evitar
 *      bater na conta AdSense de produção com impressoes falsas.
 */

type AdFormat = "auto" | "rectangle" | "horizontal" | "vertical";

interface Props {
  /** Slot ID do AdSense (numérico). Se omitido, usa NEXT_PUBLIC_ADSENSE_SLOT_DEFAULT */
  slot?: string;
  /** Formato do ad. Default: "auto" (responsivo) */
  format?: AdFormat;
  /** Label opcional acima do ad (accessibility + honestidade com user) */
  label?: string;
  /** Desabilita render — útil pra A/B tests ou paths que não devem ter ad */
  disabled?: boolean;
  /** Classes CSS extras no wrapper */
  className?: string;
}

// TS não conhece adsbygoogle no window
declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export default function AdBanner({ slot, format = "auto", label, disabled, className = "" }: Props) {
  const insRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef(false);
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const resolvedSlot = slot || process.env.NEXT_PUBLIC_ADSENSE_SLOT_DEFAULT;

  useEffect(() => {
    if (!client || !resolvedSlot || disabled || pushedRef.current) return;
    if (!insRef.current) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushedRef.current = true;
    } catch (err) {
      // AdSense pode falhar silenciosamente se bloqueado por adblock, CSP, etc.
      // Não queremos crashear a page por isso.
      console.warn("[AdBanner] push failed", err);
    }
  }, [client, disabled, resolvedSlot]);

  if (!client || !resolvedSlot || disabled) return null;

  const isDev = process.env.NODE_ENV !== "production";

  return (
    <div className={`ad-banner-wrapper my-6 ${className}`} role="complementary">
      {label && (
        <p className="text-[10px] uppercase tracking-wider text-muted mb-1 text-center">{label}</p>
      )}
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block", minHeight: format === "auto" ? 100 : undefined }}
        data-ad-client={client}
        data-ad-slot={resolvedSlot}
        data-ad-format={format}
        data-full-width-responsive="true"
        data-npa="1"
        data-adtest={isDev ? "on" : undefined}
      />
    </div>
  );
}
