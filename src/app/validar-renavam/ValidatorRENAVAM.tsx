"use client";

import { useState } from "react";
import { validateRenavam } from "@/lib/generators/renavam";

export default function ValidatorRENAVAM() {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<"idle" | "valid" | "invalid">("idle");

  function handleCheck() {
    if (!value.trim()) {
      setResult("idle");
      return;
    }
    setResult(validateRenavam(value) ? "valid" : "invalid");
  }

  return (
    <div className="rounded-xl bg-card border border-border p-5 sm:p-6">
      <label htmlFor="renavam-input" className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
        RENAVAM
      </label>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          id="renavam-input"
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => { setValue(e.target.value); setResult("idle"); }}
          onKeyDown={(e) => { if (e.key === "Enter") handleCheck(); }}
          placeholder="12345678901"
          maxLength={16}
          className="flex-1 px-4 py-2.5 rounded-lg text-sm bg-background border border-border text-foreground focus:outline-none focus:border-primary font-mono"
        />
        <button
          onClick={handleCheck}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-primary text-white hover:bg-primary-hover transition-colors"
        >
          Validar
        </button>
      </div>
      {result === "valid" && (
        <p className="mt-3 text-sm text-success font-medium">✓ RENAVAM válido (DV correto pelo mod-11 DENATRAN)</p>
      )}
      {result === "invalid" && (
        <p className="mt-3 text-sm text-danger font-medium">✗ RENAVAM inválido (DV não bate ou 11 dígitos iguais)</p>
      )}
    </div>
  );
}
