"use client";

import { useState } from "react";

interface Props {
  defaultTier?: string;
}

export default function EnterpriseInquiryForm({ defaultTier }: Props) {
  const [nome, setNome] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [email, setEmail] = useState("");
  const [tamanhoTime, setTamanhoTime] = useState("");
  const [useCase, setUseCase] = useState("");
  const [tier, setTier] = useState(defaultTier || "Growth");
  const [honeypot, setHoneypot] = useState("");

  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    try {
      const res = await fetch("/api/enterprise-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          empresa,
          email,
          tamanho_time: tamanhoTime,
          use_case: useCase,
          tier_interesse: tier,
          honeypot,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setError(data.error || "Falha ao enviar");
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setError("Erro de rede");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl bg-success/5 border-2 border-success/40 p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-success">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="text-lg font-bold text-foreground">Recebi. Retorno em 24h úteis.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Um auto-reply foi enviado pra <strong>{email}</strong> confirmando recebimento.
          Sou fundador solo e leio pessoalmente cada mensagem — não deixo esperando.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-xl bg-card border border-border p-6 space-y-4">
      <div>
        <h3 className="text-lg font-bold text-foreground">Preenche em 30s, respondo em 24h</h3>
        <p className="text-xs text-muted-foreground mt-1">Sem call obrigatória. Se tua dúvida for técnica, respondo por email mesmo.</p>
      </div>

      {/* Honeypot invisível pra bot */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px]"
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Seu nome *</label>
          <input
            type="text"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Empresa *</label>
          <input
            type="text"
            required
            value={empresa}
            onChange={(e) => setEmpresa(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-muted-foreground block mb-1">Email de trabalho *</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="voce@empresa.com.br"
          className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Tamanho do time dev</label>
          <select
            value={tamanhoTime}
            onChange={(e) => setTamanhoTime(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
          >
            <option value="">Selecionar...</option>
            <option value="1-5">1-5 devs</option>
            <option value="6-15">6-15 devs</option>
            <option value="16-50">16-50 devs</option>
            <option value="51-200">51-200 devs</option>
            <option value="200+">200+ devs</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Interesse inicial</label>
          <select
            value={tier}
            onChange={(e) => setTier(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
          >
            <option value="Starter">Starter R$500/mês</option>
            <option value="Growth">Growth R$1.500/mês</option>
            <option value="Scale">Scale R$5.000+/mês</option>
            <option value="Ainda pesquisando">Ainda pesquisando</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs text-muted-foreground block mb-1">
          O que você quer resolver?
          <span className="text-muted"> (opcional, mas ajuda a preparar a resposta)</span>
        </label>
        <textarea
          rows={3}
          value={useCase}
          onChange={(e) => setUseCase(e.target.value)}
          placeholder="Ex: popular staging com 50k CPFs por noite, preciso on-premise, preciso preset custom pra insurtech..."
          className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary resize-none"
        />
      </div>

      {error && (
        <p className="text-xs text-danger">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full py-3 rounded-lg text-sm font-bold bg-primary text-white hover:bg-primary-hover transition-colors disabled:opacity-50"
      >
        {status === "sending" ? "Enviando..." : "Enviar e receber resposta em 24h"}
      </button>

      <p className="text-[11px] text-muted text-center">
        Zero SPAM. Uso esses dados só pra responder você. Se pedir remoção, apago tudo em 24h.
      </p>
    </form>
  );
}
