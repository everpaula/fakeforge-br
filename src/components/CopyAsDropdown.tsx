"use client";

import { useState, useEffect, useRef } from "react";
import { track } from "@/lib/analytics";
import type { DataType } from "@/lib/generators";

type Format = "curl" | "js" | "python" | "postman" | "csv" | "sql" | "json";

interface Props {
  generatorType: DataType;
  quantity: number;
  formatted: boolean;
  results: unknown[];
  compact?: boolean;
  onCopy?: (format: Format) => void;
}

const LABELS: Record<Format, string> = {
  curl: "Copiar como cURL",
  js: "Copiar como JavaScript (fetch)",
  python: "Copiar como Python (requests)",
  postman: "Copiar como Postman collection",
  csv: "Copiar como CSV",
  sql: "Copiar como SQL INSERT",
  json: "Copiar JSON puro",
};

function buildCurl(type: DataType, qty: number, formatted: boolean) {
  const url = `https://fakeforge.com.br/api/generate?type=${type}&quantity=${qty}&formatted=${formatted}`;
  return `# Requer login pra rodar (API key). Grátis: 50 chamadas/dia\ncurl -H "X-API-Key: SUA_KEY" "${url}"`;
}

function buildJs(type: DataType, qty: number, formatted: boolean) {
  return `// Requer API key (grátis 50/dia após signup)
const res = await fetch(
  "https://fakeforge.com.br/api/generate?type=${type}&quantity=${qty}&formatted=${formatted}",
  { headers: { "X-API-Key": process.env.FAKEFORGE_KEY } }
);
const { data } = await res.json();
console.log(data);`;
}

function buildPython(type: DataType, qty: number, formatted: boolean) {
  return `# Requer API key (grátis 50/dia após signup)
import os, requests

res = requests.get(
    "https://fakeforge.com.br/api/generate",
    params={"type": "${type}", "quantity": ${qty}, "formatted": ${formatted ? "True" : "False"}},
    headers={"X-API-Key": os.environ["FAKEFORGE_KEY"]},
)
data = res.json()["data"]
print(data)`;
}

function buildPostman(type: DataType, qty: number, formatted: boolean) {
  const collection = {
    info: {
      name: `FakeForge — ${type}`,
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
    },
    item: [
      {
        name: `Gerar ${qty} ${type}`,
        request: {
          method: "GET",
          header: [{ key: "X-API-Key", value: "{{FAKEFORGE_KEY}}", type: "text" }],
          url: {
            raw: `https://fakeforge.com.br/api/generate?type=${type}&quantity=${qty}&formatted=${formatted}`,
            protocol: "https",
            host: ["fakeforge", "com", "br"],
            path: ["api", "generate"],
            query: [
              { key: "type", value: type },
              { key: "quantity", value: String(qty) },
              { key: "formatted", value: String(formatted) },
            ],
          },
        },
      },
    ],
    variable: [{ key: "FAKEFORGE_KEY", value: "cole-sua-key-aqui", type: "string" }],
  };
  return JSON.stringify(collection, null, 2);
}

function buildCsv(results: unknown[]) {
  if (results.length === 0) return "";
  if (typeof results[0] === "string") {
    return "value\n" + results.map((r) => String(r)).join("\n");
  }
  if (typeof results[0] === "object" && results[0] !== null) {
    const first = results[0] as Record<string, unknown>;
    const headers = Object.keys(first);
    const rows = results.map((r) => {
      const obj = r as Record<string, unknown>;
      return headers
        .map((h) => {
          const v = obj[h];
          const s = v === null || v === undefined ? "" : typeof v === "object" ? JSON.stringify(v) : String(v);
          return s.includes(",") || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
        })
        .join(",");
    });
    return headers.join(",") + "\n" + rows.join("\n");
  }
  return "";
}

function buildSql(type: DataType, results: unknown[]) {
  const table = type.replace(/[^a-zA-Z0-9_]/g, "_");
  if (results.length === 0) return "";
  if (typeof results[0] === "string") {
    return `CREATE TABLE IF NOT EXISTS ${table} (id SERIAL PRIMARY KEY, value TEXT);\n` +
      results.map((r) => `INSERT INTO ${table} (value) VALUES ('${String(r).replace(/'/g, "''")}');`).join("\n");
  }
  if (typeof results[0] === "object" && results[0] !== null) {
    const first = results[0] as Record<string, unknown>;
    const cols = Object.keys(first);
    const createCols = cols.map((c) => `  ${c.replace(/\./g, "_")} TEXT`).join(",\n");
    const create = `CREATE TABLE IF NOT EXISTS ${table} (\n  id SERIAL PRIMARY KEY,\n${createCols}\n);\n\n`;
    const inserts = results.map((r) => {
      const obj = r as Record<string, unknown>;
      const values = cols.map((c) => {
        const v = obj[c];
        if (v === null || v === undefined) return "NULL";
        const s = typeof v === "object" ? JSON.stringify(v) : String(v);
        return `'${s.replace(/'/g, "''")}'`;
      });
      return `INSERT INTO ${table} (${cols.map((c) => c.replace(/\./g, "_")).join(", ")}) VALUES (${values.join(", ")});`;
    });
    return create + inserts.join("\n");
  }
  return "";
}

export default function CopyAsDropdown({ generatorType, quantity, formatted, results, compact, onCopy }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<Format | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  async function copyAs(format: Format) {
    let text = "";
    switch (format) {
      case "curl":
        text = buildCurl(generatorType, quantity, formatted);
        break;
      case "js":
        text = buildJs(generatorType, quantity, formatted);
        break;
      case "python":
        text = buildPython(generatorType, quantity, formatted);
        break;
      case "postman":
        text = buildPostman(generatorType, quantity, formatted);
        break;
      case "csv":
        text = buildCsv(results);
        break;
      case "sql":
        text = buildSql(generatorType, results);
        break;
      case "json":
        text = JSON.stringify(results, null, 2);
        break;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(format);
      track("copy_as_clicked", { generator_type: generatorType, format, quantity, has_results: results.length > 0 });
      onCopy?.(format);
      setTimeout(() => {
        setCopied(null);
        setOpen(false);
      }, 1500);
    } catch {
      // ignore
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center gap-1.5 rounded-md font-medium transition-all ${
          compact ? "text-[11px] px-2 py-1" : "text-xs px-3 py-1.5"
        } text-primary bg-primary/10 border border-primary/30 hover:bg-primary/20`}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        Copiar como…
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-64 rounded-lg bg-card border border-border shadow-lg z-20 overflow-hidden">
          <div className="px-3 py-1.5 border-b border-border">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Formatos de código</p>
          </div>
          {(["curl", "js", "python", "postman"] as Format[]).map((f) => (
            <button
              key={f}
              onClick={() => copyAs(f)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-card-hover transition-colors"
            >
              <span className="text-foreground">{LABELS[f]}</span>
              {copied === f ? (
                <span className="text-success text-[10px]">✓ copiado</span>
              ) : (
                <span className="text-muted text-[10px]">→</span>
              )}
            </button>
          ))}
          <div className="px-3 py-1.5 border-t border-border">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Dados brutos</p>
          </div>
          {(["json", "csv", "sql"] as Format[]).map((f) => (
            <button
              key={f}
              onClick={() => copyAs(f)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-card-hover transition-colors"
            >
              <span className="text-foreground">{LABELS[f]}</span>
              {copied === f ? (
                <span className="text-success text-[10px]">✓ copiado</span>
              ) : (
                <span className="text-muted text-[10px]">→</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
