"use client";

import { useState, useCallback } from "react";
import { DATA_TYPES, type DataType } from "@/lib/generators";
import Link from "next/link";
import UserMenu from "@/components/UserMenu";
import Logo from "@/components/Logo";
import Icon from "@/components/Icon";

type ExportFormat = "json" | "csv" | "sql";

const CATEGORY_ICONS: Record<string, "document" | "user" | "phone" | "map-pin" | "credit-card" | "building" | "sparkle"> = {
  Documentos: "document",
  Pessoa: "user",
  Contato: "phone",
  "Endere\u00e7o": "map-pin",
  Financeiro: "credit-card",
  Empresa: "building",
  Random: "sparkle",
};

interface QuotaError {
  plan: "anon" | "free" | "dev" | "team";
  requested: number;
  max_quantity: number;
  message: string;
  upgrade: {
    free: { max_quantity: number; action: string; url: string };
    dev: { max_quantity: number; price: string; url: string };
    team: { max_quantity: number; price: string; url: string };
  };
}

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
  const [quotaError, setQuotaError] = useState<QuotaError | null>(null);

  const categories = [...new Set(DATA_TYPES.map((t) => t.category))];
  const selectedInfo = DATA_TYPES.find((t) => t.value === selectedType);

  const handleGenerate = useCallback(async () => {
    setLoading(true);
    setCopied(false);
    setCopiedIndex(null);
    setQuotaError(null);
    const start = performance.now();
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-fakeforge-client": "web" },
        body: JSON.stringify({ type: selectedType, quantity, formatted }),
      });
      const data = await res.json();
      if (!res.ok && data.error === "quantity_limit_exceeded") {
        setQuotaError(data as QuotaError);
        setResults(null);
        return;
      }
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
        headers: { "Content-Type": "application/json", "x-fakeforge-client": "web" },
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
      headers: { "Content-Type": "application/json", "x-fakeforge-client": "web" },
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
          <Logo />
          <div className="hidden">legacy-removed</div>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/geradores" className="text-xs text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              Geradores
            </Link>
            <Link href="/blog" className="text-xs text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              Blog
            </Link>
            <Link href="/docs" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              API
            </Link>
            <Link href="/pricing" className="text-xs text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              Preços
            </Link>
            <UserMenu />
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-5 py-8 sm:py-10">
        {/* Hero */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-[11px] font-medium text-primary">LGPD-safe · 100% fictício · sem cadastro</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            Pare de inventar CPFs na mão.
            <br className="hidden sm:block" />
            <span className="text-primary">Gere dados brasileiros que passam em qualquer validação.</span>
          </h1>
          <p className="text-muted mt-4 sm:mt-5 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            CPF, CNPJ, CEP, PIX, cartão de crédito, pessoas completas. Todos fictícios, todos com
            dígito verificador válido (mod-11, Luhn). Para testes, seeds de banco e QA.
          </p>
          <p className="text-xs text-muted mt-3">
            <a href="/en/cpf-generator" className="hover:text-primary transition-colors">English version</a>
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center mt-6">
            {!hasGenerated && (
              <button
                onClick={handleDemo}
                disabled={loading}
                className="px-6 py-2.5 rounded-lg font-semibold text-sm text-white bg-primary hover:bg-primary-hover transition-all"
              >
                {loading ? "Gerando..." : "Gerar 5 pessoas de exemplo"}
              </button>
            )}
            <Link
              href="/docs"
              className="px-6 py-2.5 rounded-lg font-medium text-sm border border-border text-foreground hover:border-border-hover transition-all"
            >
              Ver API REST
            </Link>
          </div>
        </div>

        {/* Stats bar — pure type, no decoration */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 mb-10 sm:mb-12 py-4 border-y border-border text-xs">
          <span className="text-muted-foreground">
            <span className="text-foreground font-medium">100%</span> dados brasileiros
          </span>
          <span className="text-muted-foreground">
            <span className="text-foreground font-medium">10.000</span> itens por request
          </span>
          <span className="text-muted-foreground">
            <span className="text-foreground font-medium">Nada</span> é armazenado
          </span>
          <span className="text-muted-foreground">
            Export <span className="text-foreground font-medium font-mono">.json .csv .sql</span>
          </span>
        </div>

        {/* Type selection */}
        <div className="mb-5 sm:mb-6">
          {categories.map((category) => (
            <div key={category} className="mb-3">
              <div className="flex items-center gap-1.5 mb-2 px-1 text-muted">
                <Icon name={CATEGORY_ICONS[category]} size={12} strokeWidth={1.75} />
                <span className="text-[11px] font-medium uppercase tracking-wider">{category}</span>
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

        {/* Quota error banner */}
        {quotaError && (
          <div className="mb-5 rounded-xl border border-primary/30 bg-primary/5 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground">
                  Limite por chamada atingido
                </h3>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  Você pediu <span className="font-medium text-foreground">{quotaError.requested.toLocaleString()}</span> mas o plano{" "}
                  <span className="font-medium text-foreground">{quotaError.plan === "anon" ? "anônimo" : quotaError.plan}</span>{" "}
                  libera <span className="font-medium text-foreground">{quotaError.max_quantity}</span> itens por chamada.
                </p>
              </div>
              <button
                onClick={() => { setQuotaError(null); setQuantity(quotaError.max_quantity); }}
                className="text-[11px] text-muted-foreground hover:text-foreground"
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
              {quotaError.plan === "anon" && (
                <Link
                  href="/login"
                  className="rounded-lg border border-primary bg-primary px-4 py-2.5 text-xs font-semibold text-white text-center hover:bg-primary-hover transition-colors"
                >
                  Login grátis · {quotaError.upgrade.free.max_quantity}/chamada
                </Link>
              )}
              <Link
                href={quotaError.upgrade.dev.url}
                className="rounded-lg border border-border bg-card px-4 py-2.5 text-xs font-medium text-foreground text-center hover:border-border-hover transition-colors"
              >
                Dev {quotaError.upgrade.dev.price} · {quotaError.upgrade.dev.max_quantity.toLocaleString()}/chamada
              </Link>
              <Link
                href={quotaError.upgrade.team.url}
                className="rounded-lg border border-border bg-card px-4 py-2.5 text-xs font-medium text-foreground text-center hover:border-border-hover transition-colors"
              >
                Team {quotaError.upgrade.team.price} · {quotaError.upgrade.team.max_quantity.toLocaleString()}/chamada
              </Link>
            </div>
            <p className="text-[11px] text-muted-foreground mt-3">
              Pra automação em escala, recomendamos usar a <Link href="/docs" className="text-primary hover:underline">API REST</Link> com chave do seu plano.
            </p>
          </div>
        )}

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

        {/* API showcase — appears after first generation */}
        {showApiHint && results && (
          <div className="mt-5 sm:mt-6 animate-fade-in rounded-xl border border-primary/20 bg-primary/5 overflow-hidden">
            <div className="p-5 sm:p-6">
              <h3 className="text-base font-semibold text-foreground">Use via API no seu código</h3>
              <p className="text-xs text-muted-foreground mt-1 mb-4">
                Essa mesma geração está disponível via API REST. 50 chamadas grátis por dia.
              </p>
              <div className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6">
                <div className="text-muted"># Gerar {quantity} {selectedInfo?.label} via API</div>
                <div>
                  <span className="text-success">curl</span>
                  <span className="text-foreground"> &quot;https://fakeforge.com.br/api/generate?type={selectedType}&amp;quantity={quantity}&quot;</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <Link
                  href="/docs"
                  className="text-center px-5 py-2.5 rounded-lg text-xs font-medium bg-primary text-white hover:bg-primary-hover transition-colors"
                >
                  Ver documentação completa
                </Link>
                <Link
                  href="/login"
                  className="text-center px-5 py-2.5 rounded-lg text-xs font-medium border border-border text-foreground hover:border-border-hover transition-colors"
                >
                  Criar conta grátis
                </Link>
                <Link
                  href="/pricing"
                  className="text-center px-5 py-2.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Ver planos
                </Link>
              </div>
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

        {/* Diferenciais */}
        <section className="mt-16 sm:mt-20">
          <div className="mb-8 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              O Faker.js não conhece o Brasil.{" "}
              <span className="text-primary">Esses geradores conhecem.</span>
            </h2>
            <p className="text-muted mt-3 text-sm">
              Cada algoritmo é o oficial — mod-11 da Receita Federal, Luhn em Visa/Master/Elo/Amex/Hipercard,
              DDDs ANATEL, prefixos CEP por estado. Sem atalho.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                icon: "check" as const,
                title: "Validação real, não só formato",
                desc: "CPF e CNPJ passam no mod-11. Cartões passam no Luhn. CEPs batem com o estado. Dados que passam em qualquer validador.",
              },
              {
                icon: "link" as const,
                title: "Dados correlacionados",
                desc: "Via API, gere uma pessoa completa onde o email usa o nome, o DDD bate com o estado e o cartão tem o nome do titular. Algo que o Faker.js não faz.",
              },
              {
                icon: "settings" as const,
                title: "API REST para automação",
                desc: "50 chamadas grátis por dia. Integre no seed do banco, no CI/CD, ou gere em massa. Export direto em JSON, CSV ou SQL.",
              },
              {
                icon: "shield" as const,
                title: "LGPD-safe por design",
                desc: "Nenhum dado real é usado ou armazenado. Seguro para dev, staging, homologação. Pare de expor CPFs reais em ambiente de teste.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl bg-card border border-border p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <span className="text-primary mt-0.5"><Icon name={item.icon} size={18} strokeWidth={1.75} /></span>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Comparativo */}
        <section className="mt-16 sm:mt-20">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Por que não usar o que já existe?
            </h2>
            <p className="text-muted mt-3 max-w-xl mx-auto text-sm">
              Cada ferramenta serve a um propósito. Veja onde o FakeForge ganha.
            </p>
          </div>
          <div className="rounded-xl bg-card border border-border overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-3 sm:px-4 py-3 text-muted-foreground font-medium">Critério</th>
                  <th className="text-center px-3 sm:px-4 py-3 text-muted-foreground font-medium">Faker.js</th>
                  <th className="text-center px-3 sm:px-4 py-3 text-muted-foreground font-medium">4devs</th>
                  <th className="text-center px-3 sm:px-4 py-3 text-primary font-medium">FakeForge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ["CPF/CNPJ válido mod-11", "Não nativo", "✓", "✓"],
                  ["Dados correlacionados", "—", "—", "✓"],
                  ["API REST", "—", "—", "✓"],
                  ["Export SQL/CSV", "—", "—", "✓"],
                  ["Automação CI/CD", "Código", "—", "API"],
                  ["Zero dependências no projeto", "—", "N/A", "✓"],
                ].map(([criterio, faker, devs, ff]) => (
                  <tr key={criterio}>
                    <td className="px-3 sm:px-4 py-2.5 text-muted-foreground">{criterio}</td>
                    <td className="px-3 sm:px-4 py-2.5 text-center text-muted-foreground">{faker}</td>
                    <td className="px-3 sm:px-4 py-2.5 text-center text-muted-foreground">{devs}</td>
                    <td className="px-3 sm:px-4 py-2.5 text-center text-primary font-medium">{ff}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted text-center mt-3">
            <Link href="/blog/fakeforge-vs-fakerjs-vs-4devs" className="text-primary hover:underline">
              Comparativo completo no blog →
            </Link>
          </p>
        </section>

        {/* Pricing teaser */}
        <section className="mt-16 sm:mt-20">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Gratuito no navegador. API paga por volume.
            </h2>
            <p className="text-muted mt-3 max-w-xl mx-auto text-sm">
              Use sem limite pelo site. Para gerar via código, escolha o plano certo.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { name: "Free", price: "R$0", tagline: "Para uso pessoal", quota: "50 chamadas/dia na API", highlight: false },
              { name: "Dev", price: "R$29", tagline: "Para devs que integram no CI/CD", quota: "10.000 chamadas/dia", highlight: true },
              { name: "Team", price: "R$79", tagline: "Para times e empresas", quota: "100.000 chamadas/dia", highlight: false },
            ].map((p) => (
              <div
                key={p.name}
                className={`rounded-xl p-5 border ${
                  p.highlight
                    ? "bg-primary/5 border-primary/30"
                    : "bg-card border-border"
                }`}
              >
                {p.highlight && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-2 block">
                    Mais popular
                  </span>
                )}
                <h3 className="text-sm font-semibold text-foreground">{p.name}</h3>
                <p className="text-2xl font-bold text-foreground mt-1">{p.price}<span className="text-xs text-muted font-normal">{p.name === "Free" ? "" : "/mês"}</span></p>
                <p className="text-xs text-muted mt-0.5">{p.tagline}</p>
                <p className="text-xs text-muted-foreground mt-3">{p.quota}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link
              href="/pricing"
              className="inline-block px-6 py-2.5 rounded-lg font-semibold text-sm bg-primary text-white hover:bg-primary-hover transition-all"
            >
              Ver comparação completa dos planos
            </Link>
          </div>
        </section>

        {/* CTA final */}
        <section className="mt-16 sm:mt-20 mb-10 rounded-2xl bg-card border border-border p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Pronto para parar de improvisar dados de teste?
          </h2>
          <p className="text-muted mt-3 max-w-lg mx-auto text-sm">
            Sem cadastro, sem cartão. Comece gerando CPFs válidos e explore o resto.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center mt-6">
            <Link
              href="/geradores"
              className="px-6 py-2.5 rounded-lg font-semibold text-sm text-white bg-primary hover:bg-primary-hover transition-all"
            >
              Ver todos os geradores
            </Link>
            <Link
              href="/docs"
              className="px-6 py-2.5 rounded-lg font-medium text-sm border border-border text-foreground hover:border-border-hover transition-all"
            >
              Explorar a API REST
            </Link>
          </div>
        </section>
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
