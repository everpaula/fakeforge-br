"use client";

import { useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notConfigured, setNotConfigured] = useState(false);

  const supabase = useMemo(() => {
    try { return createClient(); }
    catch { setNotConfigured(true); return null; }
  }, []);

  if (notConfigured) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-5">
        <div className="text-center">
          <p className="text-sm text-danger font-medium mb-2">Supabase nao configurado</p>
          <p className="text-xs text-muted">Crie o arquivo .env.local com as chaves do Supabase.</p>
          <p className="text-xs text-muted mt-1">Veja: docs/SETUP_GUIDE.md</p>
          <Link href="/" className="text-xs text-primary hover:underline mt-4 inline-block">Voltar</Link>
        </div>
      </div>
    );
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase!.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  async function handleGitHub() {
    await supabase!.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white text-[11px] font-bold">FF</span>
          </div>
          <span className="font-semibold text-foreground">FakeForge</span>
          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/20">BR</span>
        </Link>

        <div className="rounded-xl bg-card border border-border p-6">
          <h1 className="text-lg font-semibold text-foreground text-center mb-1">Entrar</h1>
          <p className="text-xs text-muted text-center mb-6">Acesse seu dashboard e API keys</p>

          {sent ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-success text-xl">✓</span>
              </div>
              <p className="text-sm text-foreground font-medium">Link enviado!</p>
              <p className="text-xs text-muted mt-1">Verifique seu email <strong>{email}</strong></p>
              <button
                onClick={() => setSent(false)}
                className="text-xs text-primary mt-4 hover:underline"
              >
                Usar outro email
              </button>
            </div>
          ) : (
            <>
              <form onSubmit={handleMagicLink} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full px-4 py-2.5 rounded-lg text-sm bg-background border border-border text-foreground focus:outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-primary-hover transition-all disabled:opacity-50"
                >
                  {loading ? "Enviando..." : "Entrar com email"}
                </button>
              </form>

              {error && (
                <p className="text-xs text-danger mt-2 text-center">{error}</p>
              )}

              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-[11px] text-muted">ou</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <button
                onClick={handleGitHub}
                className="w-full py-2.5 rounded-lg text-sm font-medium border border-border text-foreground hover:bg-card-hover transition-all flex items-center justify-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                Entrar com GitHub
              </button>
            </>
          )}
        </div>

        <p className="text-[11px] text-muted text-center mt-4">
          Ao entrar, voce concorda com nossos termos de uso.
        </p>
      </div>
    </div>
  );
}
