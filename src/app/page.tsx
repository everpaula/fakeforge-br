"use client";

import { useState, useCallback } from "react";
import { DATA_TYPES, type DataType } from "@/lib/generators";
import Link from "next/link";

type ExportFormat = "json" | "csv" | "sql";

const CATEGORY_ICONS: Record<string, string> = {
  Documentos: "\u{1F4C4}",
  Pessoa: "\u{1F464}",
  Contato: "\u{1F4F1}",
  "Endere\u00e7o": "\u{1F4CD}",
  Financeiro: "\u{1F4B3}",
  Empresa: "\u{1F3E2}",
};

export default function Home() {
  const [selectedType, setSelectedType] = useState<DataType>("cpf");
  const [quantity, setQuantity] = useState(10);
  const [formatted, setFormatted] = useState(true);
  const [results, setResults] = useState<unknown[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [genTime, setGenTime] = useState<number | null>(null);
  const [showApiHint, setShowApiHint] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const categories = [...new Set(DATA_TYPES.map((t) => t.category))];
  const selectedInfo = DATA_TYPES.find((t) => t.value === selectedType);

  const handleGenerate = useCallback(async () => {
    setLoading(true);
    setCopied(false);
    setCopiedIndex(null);
    const start = performance.now();
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: selectedType, quantity, formatted }),
      });
      const data = await res.json();
      setResults(data.data);
      setGenTime(Math.round(performance.now() - start));
      setShowApiHint(true);
      setHasGenerated(true);
    } catch {
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, [selectedType, quantity, formatted]);

  async function handleDemo() {
    setSelectedType("person");
    setQuantity(5);
    setFormatted(true);
    setLoading(true);
    setCopied(false);
    const start = performance.now();
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "person", quantity: 5, formatted: true }),
      });
      const data = await res.json();
      setResults(data.data);
      setGenTime(Math.round(performance.now() - start));
      setHasGenerated(true);
    } catch {
      setResults(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleExport(format: ExportFormat) {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: selectedType, quantity, formatted, format }),
    });
    if (format === "json") {
      const data = await res.json();
      downloadFile(JSON.stringify(data.data, null, 2), `${selectedType}_${quantity}.json`, "application/json");
    } else {
      const text = await res.text();
      const mime = format === "csv" ? "text/csv" : "text/plain";
      downloadFile(text, `${selectedType}_${quantity}.${format}`, mime);
    }
  }

  function downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleCopyAll() {
    if (!results) return;
    await navigator.clipboard.writeText(JSON.stringify(results, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleCopyItem(item: unknown, index: number) {
    const text = typeof item === "string" ? item : JSON.stringify(item);
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  }

  function formatResult(item: unknown): string {
    if (typeof item === "string") return item;
    return JSON.stringify(item, null, 2);
  }

  function getItemPreview(item: unknown): string {
    if (typeof item === "string") return item;
    if (typeof item === "object" && item !== null) {
      return Object.values(item as Record<string, unknown>)
        .filter((v) => typeof v === "string")
        .slice(0, 3)
        .join("  \u00b7  ");
    }
    return String(item);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-5 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white text-[10px] font-bold tracking-tight">FF</span>
            </div>
            <span className="font-semibold text-sm text-foreground">FakeForge</span>
            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/20">BR</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/blog" className="text-xs text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              Blog
            </Link>
            <Link href="/docs" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              API
            </Link>
            <Link href="/login" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Entrar
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-5 py-8 sm:py-10">
        {/* Hero */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            Gere dados brasileiros
            <span className="text-primary"> em 1 clique</span>
          </h1>
          <p className="text-muted mt-2 sm:mt-3 max-w-lg mx-auto text-sm leading-relaxed">
            CPF, CNPJ, nomes, endereços, telefones e mais.
            Todos fictícios, todos com formatação válida. Grátis.
          </p>
          {!hasGenerated && (
            <button
              onClick={handleDemo}
              disabled={loading}
              className="mt-4 text-xs text-primary hover:text-primary-hover transition-colors underline underline-offset-2"
            >
              Experimentar agora
            </button>
          )}
        </div>

        {/* Type selection */}
        <div className="mb-5 sm:mb-6">
          {categories.map((category) => (
            <div key={category} className="mb-3">
              <div className="flex items-center gap-1.5 mb-2 px-1">
                <span className="text-sm">{CATEGORY_ICONS[category]}</span>
                <span className="text-[11px] font-medium text-muted uppercase tracking-wider">{category}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {DATA_TYPES.filter((t) => t.category === category).map((type) => (
                  <button
                    key={type.value}
                    onClick={() => { setSelectedType(type.value); setResults(null); setGenTime(null); setShowApiHint(false); }}
                    className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-all border ${
                      selectedType === type.value
                        ? "bg-primary/10 border-primary/40 text-primary font-medium"
                        : "bg-card border-border text-muted-foreground hover:border-border-hover hover:text-foreground"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-5 sm:mb-6">
          <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
            <label className="text-xs text-muted">Qtd:</label>
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="bg-transparent text-sm text-foreground font-medium focus:outline-none cursor-pointer"
            >
              {[1, 5, 10, 25, 50, 100, 500, 1000, 5000, 10000].map((q) => (
                <option key={q} value={q} className="bg-card">{q}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setFormatted(!formatted)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm border transition-all ${
              formatted
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-card border-border text-muted-foreground"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full transition-colors ${formatted ? "bg-primary" : "bg-muted"}`} />
            {formatted ? "Formatado" : "Sem formato"}
          </button>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="ml-auto px-5 sm:px-8 py-2.5 rounded-lg font-semibold text-xs sm:text-sm text-white bg-primary hover:bg-primary-hover transition-all active:scale-[0.97] disabled:opacity-50"
          >
            {loading ? "Gerando..." : `Gerar ${selectedInfo?.label}`}
          </button>
        </div>

        {/* Results */}
        <div className="rounded-xl bg-card border border-border overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 border-b border-border">
            <div className="flex items-center gap-2 sm:gap-3">
              {results ? (
                <>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-success" />
                    {results.length} resultados
                  </span>
                  {genTime && <span className="text-[11px] text-muted hidden sm:inline">{genTime}ms</span>}
                </>
              ) : (
                <span className="text-xs text-muted">Resultado aparece aqui</span>
              )}
            </div>
            {results && (
              <div className="flex items-center gap-1">
                <button
                  onClick={handleCopyAll}
                  className={`text-[11px] px-2 sm:px-2.5 py-1 rounded-md font-medium transition-all ${
                    copied ? "bg-success text-white" : "text-muted-foreground hover:text-foreground hover:bg-background"
                  }`}
                >
                  {copied ? "Copiado!" : "Copiar"}
                </button>
                <div className="h-4 w-px bg-border mx-0.5 sm:mx-1" />
                {(["json", "csv", "sql"] as ExportFormat[]).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => handleExport(fmt)}
                    className="text-[11px] px-1.5 sm:px-2 py-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-background transition-all font-mono"
                  >
                    .{fmt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="max-h-[450px] sm:max-h-[500px] overflow-auto">
            {!results ? (
              <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-muted">
                <div className="w-14 h-14 rounded-2xl bg-background border border-border flex items-center justify-center mb-4">
                  <span className="text-xl font-mono text-border-hover">{"{ }"}</span>
                </div>
                <p className="text-sm text-muted-foreground">Selecione um tipo e clique em <strong>Gerar</strong></p>
                <p className="text-xs text-muted mt-1">Dados fictícios com formatação brasileira válida</p>
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
                    <span className="text-foreground break-all">{String(item)}</span>
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
                      <summary className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors select-none">
                        <span className="text-[11px] font-mono text-muted w-6 sm:w-7 text-right shrink-0">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-xs sm:text-sm text-foreground truncate flex-1 font-mono">
                          {getItemPreview(item)}
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
                      <div className="px-3 sm:px-4 pb-3 pl-10 sm:pl-14">
                        <pre className="text-xs font-mono text-primary/80 bg-background rounded-lg p-3 overflow-x-auto border border-border">
                          {formatResult(item)}
                        </pre>
                      </div>
                    </details>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* API CTA — only after first generation */}
        {showApiHint && results && (
          <div className="mt-5 sm:mt-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl border border-primary/20 bg-primary/5">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary text-base">{"{}"}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Precisa disso no seu código?</p>
                  <p className="text-xs text-muted mt-0.5">Essa mesma geração está disponível via API REST. Sem cadastro.</p>
                </div>
              </div>
              <Link
                href="/docs"
                className="shrink-0 px-4 py-2 rounded-lg text-xs font-medium bg-primary text-white hover:bg-primary-hover transition-colors w-full sm:w-auto text-center"
              >
                Ver API
              </Link>
            </div>
          </div>
        )}

        {/* Stats bar */}
        <div className="mt-10 sm:mt-14 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { value: "15", label: "Tipos de dados" },
            { value: "10", label: "Estados cobertos" },
            { value: "10K", label: "Items por request" },
            { value: "3", label: "Formatos de export" },
          ].map((stat) => (
            <div key={stat.label} className="text-center py-4 rounded-xl bg-card border border-border">
              <p className="text-xl sm:text-2xl font-bold text-primary">{stat.value}</p>
              <p className="text-[11px] text-muted mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 sm:mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-5 py-6">
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center text-[11px] text-muted mb-4">
            <Link href="/gerador-cpf" className="hover:text-foreground transition-colors">Gerador de CPF</Link>
            <Link href="/gerador-cnpj" className="hover:text-foreground transition-colors">Gerador de CNPJ</Link>
            <Link href="/gerador-cep" className="hover:text-foreground transition-colors">Gerador de CEP</Link>
            <Link href="/validar-cpf" className="hover:text-foreground transition-colors">Validar CPF</Link>
            <Link href="/validar-cnpj" className="hover:text-foreground transition-colors">Validar CNPJ</Link>
            <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <Link href="/docs" className="hover:text-foreground transition-colors">API</Link>
            <Link href="/pricing" className="hover:text-foreground transition-colors">Preços</Link>
          </div>
          <p className="text-[11px] text-muted text-center">
            Dados 100% fictícios. Nenhum dado real é utilizado ou armazenado.
          </p>
        </div>
      </footer>
    </div>
  );
}
