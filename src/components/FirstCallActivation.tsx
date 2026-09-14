"use client";

import { useState } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";

interface Props {
  apiKey: string;
  onActivated: () => void;
}

type DemoType = "cpf" | "customer" | "fintech";
type Status = "idle" | "running" | "success" | "error";

const DEMOS: Record<DemoType, {
  label: string;
  subtitle: string;
  endpoint: string;
  outputHint: string;
}> = {
  cpf: {
    label: "5 CPFs válidos",
    subtitle: "Simples · mod-11 Receita",
    endpoint: "/api/generate?type=cpf&quantity=5",
    outputHint: "5 CPFs formatados",
  },
  customer: {
    label: "1 pessoa completa",
    subtitle: "Correlacionado · CPF + email + endereço",
    endpoint: "/api/generate?preset=customer&quantity=1",
    outputHint: "1 pessoa com dados coerentes",
  },
  fintech: {
    label: "1 cliente fintech",
    subtitle: "Bundle rico · PIX + banco + cartão + score",
    endpoint: "/api/generate?preset=fintech&quantity=1",
    outputHint: "1 cliente completo pra teste de checkout",
  },
};

/**
 * Sprint 5 F1: FirstCallActivation redesenhado.
 * - 3 CTAs em vez de 1 (dá agência ao user)
 * - Post-success permanece na tela ate user dismiss (não some em 4.5s)
 * - Next steps claros: copy curl, install SDK, docs
 */
export default function FirstCallActivation({ apiKey, onActivated }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [selectedDemo, setSelectedDemo] = useState<DemoType | null>(null);
  const [results, setResults] = useState<unknown>(null);
  const [errorMsg, setErrorMsg] = useState("");

  async function runDemo(demo: DemoType) {
    setStatus("running");
    setSelectedDemo(demo);
    track("first_call_button_clicked", { source: "activation_card", demo });

    try {
      const res = await fetch(DEMOS[demo].endpoint, {
        headers: { "X-API-Key": apiKey },
      });
      const body = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(body?.error || `HTTP ${res.status}`);
        track("first_call_failed", { error: body?.error || `HTTP ${res.status}`, demo });
        return;
      }

      setResults(body.data);
      setStatus("success");
      track("first_call_success", { demo, has_data: Array.isArray(body.data) });
    } catch (err) {
      setStatus("error");
      const msg = err instanceof Error ? err.message : "Erro de rede";
      setErrorMsg(msg);
      track("first_call_failed", { error: msg, demo });
    }
  }

  function dismiss() {
    track("first_call_dismissed", { source: "activation_card", after_status: status });
    onActivated();
  }

  const shortKey = `${apiKey.slice(0, 8)}...${apiKey.slice(-4)}`;
  const curlSnippet = selectedDemo
    ? `curl -H "X-API-Key: ${apiKey}" "https://fakeforge.com.br${DEMOS[selectedDemo].endpoint}"`
    : "";

  return (
    <div className="mb-6 rounded-xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-5 sm:p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${status === "success" ? "bg-success" : "bg-primary animate-pulse"}`} />
          <span className={`text-[10px] font-bold uppercase tracking-widest ${status === "success" ? "text-success" : "text-primary"}`}>
            {status === "success" ? "Passo 1 · Ativado" : "Passo 1 · Ativar sua conta"}
          </span>
        </div>
        {status === "success" && (
          <button
            onClick={dismiss}
            className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
          >
            Fechar ✕
          </button>
        )}
      </div>

      {/* IDLE STATE - 3 CTAs */}
      {status === "idle" && (
        <>
          <h2 className="text-lg sm:text-xl font-bold text-foreground leading-tight">
            Rode sua primeira chamada em 3 segundos
          </h2>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed mb-5">
            Escolhe uma demo abaixo. Vou chamar a API real usando sua chave{" "}
            <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded font-mono">{shortKey}</code>{" "}
            e mostrar o output aqui.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(Object.keys(DEMOS) as DemoType[]).map((key) => (
              <button
                key={key}
                onClick={() => runDemo(key)}
                className="text-left p-4 rounded-lg bg-background border-2 border-border hover:border-primary hover:bg-primary/5 transition-all group"
              >
                <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                  ▷ {DEMOS[key].label}
                </p>
                <p className="text-[11px] text-muted mt-1">{DEMOS[key].subtitle}</p>
              </button>
            ))}
          </div>
        </>
      )}

      {/* RUNNING */}
      {status === "running" && selectedDemo && (
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground leading-tight">
            Chamando a API...
          </h2>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded font-mono">
              GET {DEMOS[selectedDemo].endpoint}
            </code>
          </p>
          <div className="mt-4 inline-flex items-center gap-2 text-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="animate-spin">
              <circle cx="12" cy="12" r="10" strokeDasharray="30 100" />
            </svg>
            <span className="text-xs">Executando...</span>
          </div>
        </div>
      )}

      {/* SUCCESS - output + next steps */}
      {status === "success" && selectedDemo && (
        <>
          <h2 className="text-lg sm:text-xl font-bold text-success leading-tight">
            ✓ Ativado. Sua conta tá pronta.
          </h2>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Chamada bem sucedida em <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded font-mono">{DEMOS[selectedDemo].endpoint}</code>.
          </p>

          {/* Result output */}
          <div className="mt-4 rounded-lg bg-background border border-border overflow-hidden">
            <div className="px-3 py-1.5 border-b border-border flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-muted font-bold">Response · JSON</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(results, null, 2));
                  track("first_call_result_copied", { demo: selectedDemo });
                }}
                className="text-[10px] text-primary hover:text-primary-hover"
              >
                Copiar JSON
              </button>
            </div>
            <pre className="p-3 text-[11px] font-mono text-foreground max-h-64 overflow-y-auto"><code>{JSON.stringify(results, null, 2)}</code></pre>
          </div>

          {/* Copy curl */}
          <div className="mt-4">
            <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-2">Curl equivalente</p>
            <div className="rounded-lg bg-background border border-border p-3 flex items-start gap-3">
              <code className="flex-1 text-[11px] font-mono text-foreground overflow-x-auto whitespace-nowrap">
                {curlSnippet}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(curlSnippet);
                  track("first_call_curl_copied", { demo: selectedDemo });
                }}
                className="shrink-0 text-[10px] text-primary hover:text-primary-hover font-medium"
              >
                Copiar
              </button>
            </div>
          </div>

          {/* Next steps */}
          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-3">Próximos passos</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Link
                href="/docs"
                onClick={() => track("first_call_next_step", { target: "docs" })}
                className="p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-primary/5 transition-all"
              >
                <p className="text-xs font-bold text-foreground">📖 Ver docs completos</p>
                <p className="text-[10px] text-muted mt-0.5">Todos os endpoints + presets</p>
              </Link>
              <button
                onClick={() => {
                  navigator.clipboard.writeText("npm install fakeforge-br");
                  track("first_call_next_step", { target: "sdk_node" });
                }}
                className="text-left p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-primary/5 transition-all"
              >
                <p className="text-xs font-bold text-foreground">📦 SDK Node</p>
                <p className="text-[10px] text-muted mt-0.5"><code className="font-mono">npm install fakeforge-br</code></p>
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText("pip install fakeforge-br");
                  track("first_call_next_step", { target: "sdk_python" });
                }}
                className="text-left p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-primary/5 transition-all"
              >
                <p className="text-xs font-bold text-foreground">🐍 SDK Python</p>
                <p className="text-[10px] text-muted mt-0.5"><code className="font-mono">pip install fakeforge-br</code></p>
              </button>
            </div>
          </div>

          {/* Try another */}
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => { setStatus("idle"); setResults(null); setSelectedDemo(null); }}
              className="text-xs text-primary hover:text-primary-hover transition-colors font-medium"
            >
              ← Rodar outra demo
            </button>
          </div>
        </>
      )}

      {/* ERROR */}
      {status === "error" && (
        <>
          <h2 className="text-lg sm:text-xl font-bold text-danger leading-tight">
            Falhou. Vou anotar o problema.
          </h2>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Erro: <code className="text-xs bg-background border border-danger/30 px-1.5 py-0.5 rounded font-mono">{errorMsg}</code>
            <br />
            Me manda um email em{" "}
            <a href="mailto:contato@fakeforge.com.br" className="text-primary underline">
              contato@fakeforge.com.br
            </a>{" "}
            que eu conserto rápido.
          </p>
          <button
            onClick={() => { setStatus("idle"); setSelectedDemo(null); }}
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border border-border text-foreground hover:bg-card-hover transition-colors"
          >
            Tentar outra demo
          </button>
        </>
      )}
    </div>
  );
}
