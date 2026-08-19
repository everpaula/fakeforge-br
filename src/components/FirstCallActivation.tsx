"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

interface Props {
  apiKey: string;
  onActivated: () => void;
}

/**
 * Card destaque pra ativação: user recém-cadastrado clica UM botão
 * e a gente executa a primeira chamada real via API dele. Sem tour,
 * sem tutorial, sem docs. Só clica e vê 5 CPFs.
 *
 * Depois de ativado, o loadData() do parent detecta usageToday > 0
 * e esse component nao renderiza mais.
 */
export default function FirstCallActivation({ apiKey, onActivated }: Props) {
  const [status, setStatus] = useState<"idle" | "running" | "success" | "error">("idle");
  const [results, setResults] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  async function runFirstCall() {
    setStatus("running");
    track("first_call_button_clicked", { source: "activation_card" });

    try {
      const res = await fetch("/api/generate?type=cpf&quantity=5", {
        headers: { "X-API-Key": apiKey },
      });
      const body = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(body?.error || `HTTP ${res.status}`);
        track("first_call_failed", { error: body?.error || `HTTP ${res.status}` });
        return;
      }

      const cpfs = Array.isArray(body?.data) ? body.data.map(String) : [];
      setResults(cpfs);
      setStatus("success");
      track("first_call_success", { quantity: cpfs.length });

      // Delay antes de sumir o card - user vê o resultado, entende o que aconteceu
      setTimeout(() => {
        onActivated();
      }, 4500);
    } catch (err) {
      setStatus("error");
      const msg = err instanceof Error ? err.message : "Erro de rede";
      setErrorMsg(msg);
      track("first_call_failed", { error: msg });
    }
  }

  const shortKey = `${apiKey.slice(0, 8)}...${apiKey.slice(-4)}`;

  return (
    <div className="mb-6 rounded-xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-5 sm:p-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-start gap-5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Passo 1 · Ativar sua conta
            </span>
          </div>

          {status === "idle" && (
            <>
              <h2 className="text-lg sm:text-xl font-bold text-foreground leading-tight">
                Rode sua primeira chamada em 3 segundos
              </h2>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Vou executar uma chamada real usando sua chave <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded font-mono">{shortKey}</code> e gerar 5 CPFs válidos.
                Você vê o output em tempo real e a conta fica ativada.
              </p>
            </>
          )}

          {status === "running" && (
            <>
              <h2 className="text-lg sm:text-xl font-bold text-foreground leading-tight">
                Chamando a API...
              </h2>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded font-mono">GET /api/generate?type=cpf&amp;quantity=5</code>
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <h2 className="text-lg sm:text-xl font-bold text-success leading-tight">
                ✓ Ativado. Sua conta tá pronta.
              </h2>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Chamada bem sucedida. Os 5 CPFs abaixo passam validação mod-11 e podem ser usados como fixtures.
              </p>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-5 gap-2">
                {results.map((cpf, i) => (
                  <div
                    key={i}
                    className="px-3 py-2 rounded-lg bg-background border border-success/30 font-mono text-xs text-foreground text-center animate-fade-in"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    {cpf}
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-muted mt-3">
                A partir de agora, cola esse curl no seu terminal ou usa a chave no seu código.
                Esse card some em instantes.
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <h2 className="text-lg sm:text-xl font-bold text-danger leading-tight">
                Falhou. Vou anotar o problema.
              </h2>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Erro: <code className="text-xs bg-background border border-danger/30 px-1.5 py-0.5 rounded font-mono">{errorMsg}</code>
                <br />
                Me manda um email em <a href="mailto:contato@fakeforge.com.br" className="text-primary underline">contato@fakeforge.com.br</a> que eu conserto rápido.
              </p>
            </>
          )}
        </div>

        {status === "idle" && (
          <div className="shrink-0">
            <button
              onClick={runFirstCall}
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary-hover hover:shadow-primary/50 hover:-translate-y-0.5 active:translate-y-0 transition-all whitespace-nowrap"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
              Rodar demo agora
            </button>
          </div>
        )}

        {status === "running" && (
          <div className="shrink-0">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold bg-primary/50 text-white">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="animate-spin">
                <circle cx="12" cy="12" r="10" strokeDasharray="30 100" />
              </svg>
              Executando...
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="shrink-0">
            <button
              onClick={runFirstCall}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border border-border text-foreground hover:bg-card-hover transition-colors"
            >
              Tentar de novo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
