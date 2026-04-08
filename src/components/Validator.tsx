"use client";

import { useState } from "react";

interface Props {
  label: string;
  placeholder: string;
  validate: (value: string) => boolean;
  formatHint: string;
}

export default function Validator({ label, placeholder, validate, formatHint }: Props) {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<"valid" | "invalid" | null>(null);

  function handleValidate() {
    if (!value.trim()) return;
    setResult(validate(value.trim()) ? "valid" : "invalid");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleValidate();
  }

  return (
    <div className="rounded-xl bg-card border border-border p-5">
      <h3 className="text-sm font-semibold text-foreground mb-1">Validar {label}</h3>
      <p className="text-xs text-muted mb-4">Cole um {label} para verificar se é válido. {formatHint}</p>

      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => { setValue(e.target.value); setResult(null); }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 px-4 py-2.5 rounded-lg text-sm font-mono bg-background border border-border text-foreground focus:outline-none focus:border-primary"
        />
        <button
          onClick={handleValidate}
          className="px-5 py-2.5 rounded-lg text-sm font-medium bg-card border border-border text-foreground hover:border-border-hover transition-all"
        >
          Validar
        </button>
      </div>

      {result && (
        <div className={`mt-3 flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium animate-fade-in ${
          result === "valid"
            ? "bg-success/10 text-success border border-success/20"
            : "bg-danger/10 text-danger border border-danger/20"
        }`}>
          <span className={`w-2 h-2 rounded-full ${result === "valid" ? "bg-success" : "bg-danger"}`} />
          {result === "valid" ? `${label} válido` : `${label} inválido`}
        </div>
      )}
    </div>
  );
}
