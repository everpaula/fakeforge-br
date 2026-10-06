"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Logo from "@/components/Logo";
import { track } from "@/lib/analytics";

// Sprint 7 P1: reCAPTCHA v3 pra bloquear bot signups.
// Se site key não estiver setada, o flow segue direto (feature disabled).
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

// Bounce rate mitigation (2026-09-28): 5.46% de bounce estava próximo do teto
// de suspensão do Resend (5%). Maioria dos bounces vinha de typos de humano
// (gmil.com) e emails descartáveis (mailinator). Fix na fonte.
const EMAIL_TYPOS: Record<string, string> = {
  "gmil.com": "gmail.com", "gmial.com": "gmail.com", "gmai.com": "gmail.com",
  "gnail.com": "gmail.com", "gamil.com": "gmail.com", "gmail.co": "gmail.com",
  "hotnail.com": "hotmail.com", "hotmial.com": "hotmail.com", "hotmai.com": "hotmail.com",
  "yahho.com": "yahoo.com", "yaho.com": "yahoo.com", "yahoo.co": "yahoo.com",
  "outlok.com": "outlook.com", "outllok.com": "outlook.com",
  "iclod.com": "icloud.com", "iclou.com": "icloud.com",
  "uol.co": "uol.com.br", "bol.co": "bol.com.br",
};
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "10minutemail.com", "tempmail.com",
  "throwawaymail.com", "temp-mail.org", "mailnesia.com", "yopmail.com",
  "trashmail.com", "sharklasers.com", "getnada.com", "maildrop.cc",
  "fakeinbox.com", "spamgourmet.com", "mintemail.com", "dispostable.com",
]);

// Regex básica RFC-5322 simplificada: local@domain.tld onde tld tem no
// mínimo 2 chars (letras ou -). Pega 99% dos typos reais tipo "gmailcom"
// (sem ponto antes de "com") que o Resend devolve 422 e vira runtime error.
// Não substitui validação do servidor (Supabase Auth também valida), só
// bloqueia o typo no cliente antes da chamada.
const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

function checkEmail(email: string):
  | { ok: true }
  | { suggestion: string }
  | { disposable: true }
  | { invalid: true }
{
  const trimmed = email.toLowerCase().trim();
  if (!EMAIL_FORMAT.test(trimmed)) return { invalid: true };
  const parts = trimmed.split("@");
  if (parts.length !== 2 || !parts[1]) return { ok: true };
  const domain = parts[1];
  if (DISPOSABLE_DOMAINS.has(domain)) return { disposable: true };
  const fix = EMAIL_TYPOS[domain];
  if (fix) return { suggestion: `${parts[0]}@${fix}` };
  return { ok: true };
}

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

async function getRecaptchaToken(action: string): Promise<string | null> {
  if (!RECAPTCHA_SITE_KEY || !window.grecaptcha) return null;
  try {
    return await new Promise<string>((resolve, reject) => {
      window.grecaptcha!.ready(async () => {
        try {
          const token = await window.grecaptcha!.execute(RECAPTCHA_SITE_KEY!, { action });
          resolve(token);
        } catch (err) {
          reject(err);
        }
      });
    });
  } catch (err) {
    console.warn("[recaptcha] token generation failed", err);
    return null;
  }
}

async function verifyRecaptchaToken(token: string): Promise<{ ok: boolean; score?: number }> {
  try {
    const res = await fetch("/api/auth/verify-recaptcha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data = await res.json();
    return { ok: res.ok && data.ok, score: data.score };
  } catch {
    // Fail-open: se endpoint falhar, permite passar (evita bloquear user real
    // por bug de infra). Bot ainda vai errar em outros pontos do fluxo.
    return { ok: true };
  }
}

function LoginInner() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const intentPlan = searchParams.get("plan");

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notConfigured, setNotConfigured] = useState(false);
  const [emailSuggestion, setEmailSuggestion] = useState<string | null>(null);
  // Honeypot (06/out): campo invisivel ao humano. Bot preenche todo input
  // visivel ou nao via DOM scraping. Se tiver valor, aborta signup sem
  // consumir reCAPTCHA nem enviar magic link.
  const [hp, setHp] = useState("");

  useEffect(() => {
    if (intentPlan && typeof window !== "undefined") {
      sessionStorage.setItem("fakeforge_checkout_intent", intentPlan);
    }
    if (redirect && typeof window !== "undefined") {
      sessionStorage.setItem("fakeforge_post_login_redirect", redirect);
    }
  }, [intentPlan, redirect]);

  const supabase = useMemo(() => {
    try { return createClient(); }
    catch { setNotConfigured(true); return null; }
  }, []);

  if (notConfigured) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-5">
        <div className="text-center">
          <p className="text-sm text-danger font-medium mb-2">Supabase não configurado</p>
          <p className="text-xs text-muted">Crie o arquivo .env.local com as chaves do Supabase.</p>
          <p className="text-xs text-muted mt-1">Veja: docs/SETUP_GUIDE.md</p>
          <Link href="/" className="text-xs text-primary hover:underline mt-4 inline-block">Voltar</Link>
        </div>
      </div>
    );
  }

  async function sendMagicLink(targetEmail: string) {
    setLoading(true);
    setError("");
    setEmailSuggestion(null);

    track("signup_click", { method: "magic_link", has_intent_plan: !!intentPlan, has_redirect: !!redirect });

    // reCAPTCHA v3 check (invisible, só bloqueia bots com score baixo)
    if (RECAPTCHA_SITE_KEY) {
      const token = await getRecaptchaToken("signup_magic_link");
      if (token) {
        const verify = await verifyRecaptchaToken(token);
        if (!verify.ok) {
          track("signup_blocked_bot", { score: verify.score });
          setError("Não foi possível confirmar que você é humano. Tente novamente ou entre em contato.");
          setLoading(false);
          return;
        }
      }
    }

    const { error } = await supabase!.auth.signInWithOtp({
      email: targetEmail,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();

    // Honeypot: se preencheu, 100% bot. Finge sucesso sem fazer nada pra
    // nao sinalizar pro bot que foi detectado (evita adaptacao da heuristica).
    if (hp) {
      track("signup_blocked_honeypot");
      setSent(true);
      return;
    }

    // Bounce mitigation: bloqueia descartáveis, formato inválido (ex: @gmailcom
    // sem ponto) e sugere correção pra typos comuns.
    const check = checkEmail(email);
    if ("invalid" in check) {
      setError("Formato de email inválido. Confere se faltou um ponto antes do \".com\".");
      track("signup_blocked_invalid_format", { typed: email });
      return;
    }
    if ("disposable" in check) {
      setError("Emails temporários não são aceitos. Use seu email pessoal ou de trabalho.");
      track("signup_blocked_disposable", { domain: email.split("@")[1] });
      return;
    }
    if ("suggestion" in check) {
      setEmailSuggestion(check.suggestion);
      track("signup_typo_detected", { typed: email, suggested: check.suggestion });
      return;
    }

    await sendMagicLink(email);
  }

  async function handleGitHub() {
    track("signup_click", { method: "github", has_intent_plan: !!intentPlan, has_redirect: !!redirect });

    // reCAPTCHA no OAuth também (bots às vezes farmam contas GitHub descartáveis)
    if (RECAPTCHA_SITE_KEY) {
      const token = await getRecaptchaToken("signup_github");
      if (token) {
        const verify = await verifyRecaptchaToken(token);
        if (!verify.ok) {
          track("signup_blocked_bot", { score: verify.score, method: "github" });
          setError("Não foi possível confirmar que você é humano. Tente novamente ou entre em contato.");
          return;
        }
      }
    }

    await supabase!.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-5">
      {RECAPTCHA_SITE_KEY && (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
          strategy="afterInteractive"
        />
      )}
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo size="md" />
        </div>

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
                {/* Honeypot invisivel. Aria-hidden + tabIndex -1 + off-screen
                    position pra garantir que screen reader + teclado + usuario
                    normal nao preenchem. Nome generico "website" porque bots
                    procuram esse padrao. */}
                <div style={{ position: "absolute", left: "-9999px", width: 0, height: 0, overflow: "hidden" }} aria-hidden="true">
                  <label htmlFor="website">Website (deixe em branco)</label>
                  <input
                    type="text"
                    name="website"
                    id="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={hp}
                    onChange={(e) => setHp(e.target.value)}
                  />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailSuggestion(null); }}
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

              {emailSuggestion && (
                <div className="mt-3 rounded-lg border border-primary/40 bg-primary/5 p-3 text-center">
                  <p className="text-xs text-foreground mb-2">
                    Você quis dizer <strong>{emailSuggestion}</strong>?
                  </p>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => { track("signup_typo_accepted"); setEmail(emailSuggestion); sendMagicLink(emailSuggestion); }}
                      className="px-3 py-1 rounded text-[11px] font-semibold bg-primary text-white hover:bg-primary-hover"
                    >
                      Sim, corrigir e enviar
                    </button>
                    <button
                      onClick={() => { track("signup_typo_rejected"); sendMagicLink(email); }}
                      className="px-3 py-1 rounded text-[11px] font-medium border border-border text-foreground hover:bg-card-hover"
                    >
                      Manter como digitei
                    </button>
                  </div>
                </div>
              )}

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
          Ao entrar, você concorda com nossos termos de uso.
        </p>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <LoginInner />
    </Suspense>
  );
}
