"use client";

import { useState, useCallback } from "react";
import type { DataType } from "@/lib/generators";

interface Props {
  type: DataType;
  label: string;
  description: string;
  maxQuantity?: number;
}

export default function SingleGenerator({ type, label, description, maxQuantity = 100 }: Props) {
  const [quantity, setQuantity] = useState(10);
  const [formatted, setFormatted] = useState(true);
  const [results, setResults] = useState<unknown[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = useCallback(async () => {
    setLoading(true);
    setCopied(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-fakeforge-client": "web" },
        body: JSON.stringify({ type, quantity, formatted }),
      });
      const data = await res.json();
      setResults(data.data);
    } catch {
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, [type, quantity, formatted]);

  async function handleCopyItem(item: unknown, index: number) {
    const text = typeof item === "string" ? item : JSON.stringify(item);
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  }

  async function handleCopyAll() {
    if (!results) return;
    const text = results.map((r) => (typeof r === "string" ? r : JSON.stringify(r))).join("\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
          <label className="text-xs text-muted">Qtd:</label>
          <select
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="bg-transparent text-sm text-foreground font-medium focus:outline-none cursor-pointer"
          >
            {[1, 5, 10, 25, 50, 100].filter((q) => q <= maxQuantity).map((q) => (
              <option key={q} value={q} className="bg-card">{q}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setFormatted(!formatted)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-all ${
            formatted
              ? "bg-primary/10 border-primary/30 text-primary"
              : "bg-card border-border text-muted-foreground"
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${formatted ? "bg-primary" : "bg-muted"}`} />
          {formatted ? "Formatado" : "Sem formato"}
        </button>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="ml-auto px-8 py-2.5 rounded-lg font-semibold text-sm text-white bg-primary hover:bg-primary-hover transition-all active:scale-[0.97] disabled:opacity-50"
        >
          {loading ? "Gerando..." : `Gerar ${label}`}
        </button>
      </div>

      {/* Results */}
      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
          <span className="text-xs text-muted-foreground">
            {results ? `${results.length} resultados` : description}
          </span>
          {results && (
            <button
              onClick={handleCopyAll}
              className={`text-[11px] px-2.5 py-1 rounded-md font-medium transition-all ${
                copied ? "bg-success text-white" : "text-muted-foreground hover:text-foreground hover:bg-background"
              }`}
            >
              {copied ? "Copiado!" : "Copiar tudo"}
            </button>
          )}
        </div>

        <div className="max-h-[400px] overflow-auto">
          {!results ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted">
              <p className="text-sm text-muted-foreground">Clique em <strong>Gerar</strong> para começar</p>
            </div>
          ) : typeof results[0] === "string" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border/40">
              {results.map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleCopyItem(item, i)}
                  className="relative px-4 py-3 text-sm font-mono bg-card hover:bg-card-hover transition-colors text-left group animate-fade-in"
                  style={{ animationDelay: `${Math.min(i * 15, 200)}ms` }}
                >
                  <span className="text-foreground">{String(item)}</span>
                  <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-sans transition-all ${
                    copiedIndex === i ? "opacity-100 text-success" : "opacity-0 group-hover:opacity-100 text-muted"
                  }`}>
                    {copiedIndex === i ? "copiado!" : "copiar"}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {results.map((item, i) => (
                <div key={i} className="group animate-fade-in" style={{ animationDelay: `${Math.min(i * 25, 300)}ms` }}>
                  <details open={i < 5}>
                    <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors select-none">
                      <span className="text-[11px] font-mono text-muted w-7 text-right shrink-0">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-sm text-foreground truncate flex-1 font-mono">
                        {typeof item === "object" && item !== null
                          ? Object.values(item as Record<string, unknown>).filter((v) => typeof v === "string").slice(0, 3).join("  \u00b7  ")
                          : String(item)}
                      </span>
                      <button
                        onClick={(e) => { e.preventDefault(); handleCopyItem(item, i); }}
                        className={`text-[10px] px-2 py-0.5 rounded transition-all shrink-0 ${
                          copiedIndex === i ? "text-success opacity-100" : "text-muted opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        {copiedIndex === i ? "copiado!" : "copiar"}
                      </button>
                    </summary>
                    <div className="px-4 pb-3 pl-14">
                      <pre className="text-xs font-mono text-primary/80 bg-background rounded-lg p-3 overflow-x-auto border border-border">
                        {JSON.stringify(item, null, 2)}
                      </pre>
                    </div>
                  </details>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
