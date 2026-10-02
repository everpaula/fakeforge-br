"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";
import { BUDGETS, INFO_PRODUCTS, type InfoProductId } from "@/lib/info-products";

interface Props {
  product: InfoProductId;
  heading: string;
  cta: string;
}

const FIELD =
  "w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-primary";

export default function WaitlistForm({ product, heading, cta }: Props) {
  const config = INFO_PRODUCTS[product];
  const [email, setEmail] = useState("");
  const [situation, setSituation] = useState("");
  const [budget, setBudget] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  function markStarted() {
    if (started.current) return;
    started.current = true;
    track("waitlist_form_started", { product });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get("utm_source");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          product,
          situation,
          budget,
          utm_source: utmSource,
          utm_medium: params.get("utm_medium"),
          utm_campaign: params.get("utm_campaign"),
          referrer: document.referrer,
          landing_path: window.location.pathname,
          honeypot,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setError(data.error || "Falha ao enviar");
        track("waitlist_submit_failed", { product, status: res.status });
        return;
      }

      setStatus("success");
      track("waitlist_submitted", { product, situation, budget, utm_source: utmSource, already: Boolean(data.already) });
    } catch {
      setStatus("error");
      setError("Erro de rede. Tenta de novo.");
    }
  }

  if (status === "success") {
    return (
      <div id="lista" className="rounded-xl bg-success/5 border border-success/40 p-6 scroll-mt-20" role="status">
        <p className="text-lg font-bold text-foreground">Você está na lista.</p>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          Mandei a confirmação pra <strong className="text-foreground">{email}</strong>. Se não aparecer em
          alguns minutos, olha a caixa de spam e marca como confiável pra prévia não se perder.
        </p>
      </div>
    );
  }

  return (
    <form
      id="lista"
      onSubmit={submit}
      onFocus={markStarted}
      className="rounded-xl bg-card border border-border p-6 space-y-4 scroll-mt-20"
    >
      <h2 className="text-lg font-bold text-foreground">{heading}</h2>

      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px]"
        aria-hidden="true"
      />

      <div>
        <label htmlFor={`${product}-email`} className="text-xs text-muted-foreground block mb-1">
          Seu melhor email
        </label>
        <input
          id={`${product}-email`}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="voce@email.com"
          className={FIELD}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor={`${product}-situation`} className="text-xs text-muted-foreground block mb-1">
            {config.situationLabel}
          </label>
          <select
            id={`${product}-situation`}
            required
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            className={FIELD}
          >
            <option value="">Selecionar...</option>
            {config.situations.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${product}-budget`} className="text-xs text-muted-foreground block mb-1">
            Quanto investiria pra resolver isso?
          </label>
          <select
            id={`${product}-budget`}
            required
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className={FIELD}
          >
            <option value="">Selecionar...</option>
            {BUDGETS.map((b) => (
              <option key={b.value} value={b.value}>{b.label}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="text-xs text-danger" role="alert">{error}</p>}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full py-3 rounded-lg text-sm font-bold bg-primary text-white hover:bg-primary-hover transition-colors disabled:opacity-50"
      >
        {status === "sending" ? "Enviando..." : cta}
      </button>

      <p className="text-[11px] text-muted text-center">
        Uso seu email só pra mandar a prévia e avisar do lançamento. Pra sair, é só responder pedindo.{" "}
        <Link href="/privacidade" className="underline hover:text-foreground">Privacidade</Link>
      </p>
    </form>
  );
}
