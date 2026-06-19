"use client";

import { useMemo, useState } from "react";

function luhnCheck(cardNumber: string): { valid: boolean; sum: number; cleaned: string; length: number } {
  const cleaned = cardNumber.replace(/\D/g, "");
  if (cleaned.length < 13 || cleaned.length > 19) {
    return { valid: false, sum: 0, cleaned, length: cleaned.length };
  }
  let sum = 0;
  let shouldDouble = false;
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let d = Number(cleaned[i]);
    if (shouldDouble) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    shouldDouble = !shouldDouble;
  }
  return { valid: sum % 10 === 0, sum, cleaned, length: cleaned.length };
}

function detectBrand(cleaned: string): string {
  if (/^4/.test(cleaned)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(cleaned)) return "Mastercard";
  if (/^3[47]/.test(cleaned)) return "Amex";
  if (/^(606282|3841)/.test(cleaned)) return "Hipercard";
  if (/^(3[0-5]|36|38)/.test(cleaned)) return "Diners";
  if (/^(4011|4312|4389|4514|4576|5041|5066|5067|509|6277|6362|6363|650|6516|6550)/.test(cleaned)) return "Elo";
  return "Desconhecida";
}

function formatNumber(cleaned: string): string {
  return cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
}

export default function LuhnCalculator() {
  const [input, setInput] = useState("4532 0151 1283 0366");

  const result = useMemo(() => luhnCheck(input), [input]);
  const brand = useMemo(() => (result.cleaned.length >= 4 ? detectBrand(result.cleaned) : "—"), [result.cleaned]);

  const tooShort = result.cleaned.length > 0 && result.cleaned.length < 13;
  const tooLong = result.cleaned.length > 19;

  return (
    <div className="rounded-xl bg-card border border-border overflow-hidden">
      <div className="p-5 border-b border-border">
        <label htmlFor="luhn-input" className="block text-xs text-muted-foreground mb-2 font-medium">
          Número do cartão
        </label>
        <input
          id="luhn-input"
          type="text"
          inputMode="numeric"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="4532 0151 1283 0366"
          className="w-full rounded-lg bg-background border border-border px-3 py-2.5 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono tracking-wider"
        />
        <p className="mt-2 text-[11px] text-muted-foreground">
          Digite com ou sem espaços/hífens. Aceita 13 a 19 dígitos.
        </p>
      </div>

      {result.cleaned.length === 0 ? (
        <div className="p-5 text-center text-xs text-muted-foreground">
          Cole ou digite um número pra ver o resultado.
        </div>
      ) : tooShort ? (
        <div className="p-5">
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground font-medium">Aguardando dígitos:</span>{" "}
            {result.cleaned.length} de 13 mínimo.
          </p>
        </div>
      ) : tooLong ? (
        <div className="p-5">
          <p className="text-sm text-danger">
            Número longo demais ({result.cleaned.length} dígitos). Máximo é 19.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          <div className="px-5 py-4 grid grid-cols-3 gap-4">
            <dt className="text-xs text-muted-foreground col-span-1">Validação Luhn</dt>
            <dd className="col-span-2">
              {result.valid ? (
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-success">
                  <span className="w-2 h-2 rounded-full bg-success" />
                  Válido
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-danger">
                  <span className="w-2 h-2 rounded-full bg-danger" />
                  Inválido (não passa no mod-10)
                </span>
              )}
            </dd>
          </div>
          <div className="px-5 py-3 grid grid-cols-3 gap-4">
            <dt className="text-xs text-muted-foreground col-span-1">Soma final</dt>
            <dd className="text-sm font-mono text-foreground col-span-2">{result.sum}</dd>
          </div>
          <div className="px-5 py-3 grid grid-cols-3 gap-4">
            <dt className="text-xs text-muted-foreground col-span-1">Soma mod 10</dt>
            <dd className="text-sm font-mono text-foreground col-span-2">
              {result.sum % 10}{" "}
              <span className="text-muted-foreground text-xs">
                {result.sum % 10 === 0 ? "(múltiplo de 10 = válido)" : "(precisa ser 0 pra ser válido)"}
              </span>
            </dd>
          </div>
          <div className="px-5 py-3 grid grid-cols-3 gap-4">
            <dt className="text-xs text-muted-foreground col-span-1">Comprimento</dt>
            <dd className="text-sm font-mono text-foreground col-span-2">{result.length} dígitos</dd>
          </div>
          <div className="px-5 py-3 grid grid-cols-3 gap-4">
            <dt className="text-xs text-muted-foreground col-span-1">Bandeira (BIN)</dt>
            <dd className="text-sm text-foreground col-span-2">{brand}</dd>
          </div>
          <div className="px-5 py-3 grid grid-cols-3 gap-4">
            <dt className="text-xs text-muted-foreground col-span-1">Formatado</dt>
            <dd className="text-sm font-mono text-foreground col-span-2">{formatNumber(result.cleaned)}</dd>
          </div>
        </div>
      )}
    </div>
  );
}
