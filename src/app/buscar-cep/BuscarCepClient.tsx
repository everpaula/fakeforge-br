"use client";

import { useState, useCallback, useEffect } from "react";

interface CepResult {
  cep: string;
  logradouro: string;
  complemento: string;
  unidade?: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado?: string;
  regiao?: string;
  ibge: string;
  gia?: string;
  ddd: string;
  siafi: string;
}

interface CepError {
  erro: true | string;
}

function normalizeCep(input: string): string {
  return input.replace(/\D/g, "").slice(0, 8);
}

function maskCep(digits: string): string {
  const d = digits.slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

export default function BuscarCepClient() {
  const [cep, setCep] = useState("");
  const [result, setResult] = useState<CepResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const lookup = useCallback(async (digits: string) => {
    if (digits.length !== 8) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      if (!res.ok) {
        setError("Erro ao consultar ViaCEP. Tenta de novo em alguns segundos.");
        return;
      }
      const data = (await res.json()) as CepResult | CepError;
      if ("erro" in data && data.erro) {
        setError("CEP não encontrado na base dos Correios. Confere os dígitos.");
        return;
      }
      setResult(data as CepResult);
    } catch {
      setError("Sem conexão com ViaCEP. Verifica sua internet.");
    } finally {
      setLoading(false);
    }
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = normalizeCep(e.target.value);
    setCep(digits);
    setError(null);
    if (digits.length < 8) setResult(null);
  }

  useEffect(() => {
    if (cep.length === 8) {
      lookup(cep);
    }
  }, [cep, lookup]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (cep.length === 8) lookup(cep);
  }

  async function copyAddress() {
    if (!result) return;
    const addr = [
      result.logradouro,
      result.complemento,
      result.bairro,
      `${result.localidade} - ${result.uf}`,
      result.cep,
    ].filter(Boolean).join(", ");
    await navigator.clipboard.writeText(addr);
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="rounded-xl bg-card border border-border p-5">
        <label htmlFor="cep-input" className="block text-xs text-muted-foreground mb-2 font-medium">
          Digite o CEP (8 dígitos)
        </label>
        <div className="flex gap-3">
          <input
            id="cep-input"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="01310-100"
            value={maskCep(cep)}
            onChange={handleChange}
            autoFocus
            className="flex-1 rounded-lg bg-background border border-border px-3 py-2.5 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono tracking-wider"
          />
          <button
            type="submit"
            disabled={cep.length !== 8 || loading}
            className="px-6 py-2.5 rounded-lg font-semibold text-sm text-white bg-primary hover:bg-primary-hover transition-all active:scale-[0.97] disabled:opacity-50"
          >
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          A busca acontece automaticamente quando você completa os 8 dígitos. Dados vêm da{" "}
          <a href="https://viacep.com.br/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            ViaCEP
          </a>, base oficial dos Correios.
        </p>
      </form>

      {error && (
        <div className="rounded-xl bg-danger/5 border border-danger/30 p-4">
          <p className="text-sm text-danger">{error}</p>
        </div>
      )}

      {result && (
        <div className="rounded-xl bg-card border border-border overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">
              CEP {result.cep}
            </span>
            <button
              onClick={copyAddress}
              className="text-xs text-primary hover:underline"
            >
              Copiar endereço
            </button>
          </div>

          {/* Resultado principal — formato readable, não JSON */}
          <div className="px-5 py-5 space-y-1.5">
            {result.logradouro && (
              <p className="text-lg font-semibold text-foreground">{result.logradouro}</p>
            )}
            {result.bairro && (
              <p className="text-sm text-muted-foreground">{result.bairro}</p>
            )}
            <p className="text-sm text-foreground">
              {result.localidade} <span className="text-muted-foreground">·</span> {result.uf}
            </p>
            {result.complemento && (
              <p className="text-xs text-muted-foreground italic mt-2">{result.complemento}</p>
            )}
          </div>

          <div className="px-5 py-2.5 border-t border-border bg-background/50">
            <p className="text-[11px] text-muted-foreground">
              Dados reais via{" "}
              <a href="https://viacep.com.br/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                ViaCEP
              </a>
              {" "}— base oficial dos Correios. Este é um resultado real, não dado fictício.
            </p>
          </div>

          {/* Detalhes técnicos colapsados — só pra devs */}
          <details className="group border-t border-border">
            <summary className="px-5 py-2.5 cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center justify-between">
              <span>Mais detalhes (DDD, IBGE, SIAFI)</span>
              <span className="text-muted group-open:rotate-45 transition-transform text-base leading-none">+</span>
            </summary>
            <dl className="divide-y divide-border border-t border-border">
              {[
                ["DDD", result.ddd],
                ["Código IBGE", result.ibge],
                ["Código SIAFI", result.siafi],
              ].map(([label, value]) => (
                <div key={label} className="px-5 py-2 grid grid-cols-3 gap-4">
                  <dt className="text-xs text-muted-foreground col-span-1">{label}</dt>
                  <dd className="text-sm text-foreground col-span-2 font-mono">{value}</dd>
                </div>
              ))}
            </dl>
          </details>
        </div>
      )}
    </div>
  );
}
