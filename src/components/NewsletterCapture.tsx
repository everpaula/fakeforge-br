"use client";

import { useState } from "react";

export default function NewsletterCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-success/30 bg-success/5 p-6 text-center">
        <p className="text-sm font-medium text-success">Inscrito com sucesso!</p>
        <p className="text-xs text-muted-foreground mt-1">Você receberá nossas dicas de QA e automação de testes.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
      <h3 className="text-base font-semibold text-foreground">Dicas de QA e automação de testes</h3>
      <p className="text-xs text-muted-foreground mt-1 mb-4">
        Receba artigos sobre dados de teste, LGPD e boas práticas direto no seu email. Sem spam.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          required
          className="flex-1 px-4 py-2.5 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary/50 transition-colors"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-5 py-2.5 rounded-lg text-xs font-medium bg-primary text-white hover:bg-primary-hover transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {status === "loading" ? "Enviando..." : "Inscrever-se"}
        </button>
      </form>
      {status === "error" && (
        <p className="text-xs text-red-400 mt-2">Erro ao inscrever. Tente novamente.</p>
      )}
    </div>
  );
}
