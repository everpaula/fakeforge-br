"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import QuotaMeter from "@/components/QuotaMeter";
import FirstCallActivation from "@/components/FirstCallActivation";
import OnboardingChecklist from "@/components/OnboardingChecklist";
import UsageProfileCard from "@/components/UsageProfileCard";
import SuccessMetricCard from "@/components/SuccessMetricCard";
import MilestoneCelebrationCard from "@/components/MilestoneCelebrationCard";
import { track } from "@/lib/analytics";

interface ApiKey {
  id: string;
  key: string;
  name: string;
  created_at: string;
  last_used_at: string | null;
  is_active: boolean;
}

interface Subscription {
  plan: "free" | "dev" | "team";
  status: string;
  current_period_end: string | null;
}

interface ReferralStats {
  total: number;
  pending: number;
  converted: number;
  monthly_recurring: number;
  total_earned: number;
}

const PLAN_LIMITS: Record<string, { requests: number; label: string; color: string }> = {
  free: { requests: 50, label: "Free", color: "text-muted-foreground" },
  dev: { requests: 10000, label: "Dev", color: "text-primary" },
  team: { requests: 100000, label: "Team", color: "text-accent" },
};

interface KeyTestResult {
  ok: boolean;
  data?: string[];
  error?: string;
}

export default function DashboardClient({ userId, userEmail }: { userId: string; userEmail: string }) {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [subscription, setSubscription] = useState<Subscription>({ plan: "free", status: "active", current_period_end: null });
  const [usageToday, setUsageToday] = useState(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);
  const [testingKey, setTestingKey] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, KeyTestResult>>({});
  const [loading, setLoading] = useState(true);
  const [refStats, setRefStats] = useState<ReferralStats>({ total: 0, pending: 0, converted: 0, monthly_recurring: 0, total_earned: 0 });

  const [keyError, setKeyError] = useState<string | null>(null);
  const [creatingKey, setCreatingKey] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const autoCreateTried = useRef(false);

  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  // Insere uma key e devolve true se deu certo. O erro fica visível pro user
  // (antes o insert falhava em silêncio e o botão parecia morto).
  const insertKey = useCallback(async (name: string): Promise<boolean> => {
    const key = `ff_${generateRandomKey(32)}`;
    const { error } = await supabase.from("api_keys").insert({ user_id: userId, key, name });
    if (error) {
      setKeyError(error.message);
      track("api_key_create_failed", { name, error: error.message });
      return false;
    }
    setKeyError(null);
    return true;
  }, [supabase, userId]);

  // Só o primeiro carregamento mostra "Carregando...". Recargas (após teste
  // ou criar key) atualizam em silêncio e não desmontam o dashboard inteiro.
  const loadData = useCallback(async (initial = false) => {
    if (initial) setLoading(true);

    // Load API keys
    const { data: keys } = await supabase
      .from("api_keys")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (keys) setApiKeys(keys);

    // Self-heal: se o trigger do signup falhou e o user chegou sem key,
    // cria "my-first-key" agora, antes de ele ver qualquer tela vazia.
    if (keys && !keys.some((k) => k.is_active) && !autoCreateTried.current) {
      autoCreateTried.current = true;
      if (await insertKey("my-first-key")) {
        track("api_key_auto_created", { source: "dashboard_self_heal" });
        const { data: fresh } = await supabase
          .from("api_keys")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });
        if (fresh) setApiKeys(fresh);
      }
    }

    // Load subscription. maybeSingle porque a maioria dos users é Free (sem
    // row em subscriptions) - .single() retornava 406 Not Acceptable pra
    // Free users e poluia o console + criava ambiguidade se travava algo.
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("plan, status, current_period_end")
      .eq("user_id", userId)
      .eq("status", "active")
      .maybeSingle();
    if (sub) setSubscription(sub);

    // Load usage today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { count } = await supabase
      .from("api_usage")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", today.toISOString());
    setUsageToday(count || 0);

    // Load referral stats (independent fetch)
    try {
      const refRes = await fetch("/api/referral");
      if (refRes.ok) {
        const refData = await refRes.json();
        if (refData.stats) setRefStats(refData.stats);
      }
    } catch {/* ignore */}

    setLoading(false);
  }, [supabase, userId, insertKey]);

  useEffect(() => { loadData(true); }, [loadData]);

  useEffect(() => {
    if (!loading && subscription.plan === "free") {
      track("dashboard_upsell_shown", { plan: subscription.plan, usage_percent: Math.round(usagePercent) });
    }
    // Intencional: dispara uma vez por carga, nao a cada mudanca de state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, subscription.plan]);

  async function createApiKey() {
    if (creatingKey) return;
    setCreatingKey(true);
    const activeCount = apiKeys.filter((k) => k.is_active).length;
    const ok = await insertKey(activeCount === 0 ? "my-first-key" : `Key ${apiKeys.length + 1}`);
    if (ok) track("api_key_created", { manual: true, first: activeCount === 0 });
    await loadData();
    setCreatingKey(false);
  }

  async function deleteApiKey(id: string) {
    await supabase.from("api_keys").update({ is_active: false }).eq("id", id);
    loadData();
  }

  async function testApiKey(key: string) {
    setTestingKey(key);
    setTestResults((prev) => ({ ...prev, [key]: { ok: false, data: undefined, error: undefined } }));
    try {
      const res = await fetch("/api/generate?type=cpf&quantity=3", {
        headers: { "X-API-Key": key },
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setTestResults((prev) => ({
          ...prev,
          [key]: { ok: false, error: body?.error || `HTTP ${res.status}` },
        }));
      } else {
        const data = Array.isArray(body?.data) ? body.data.map(String) : [];
        setTestResults((prev) => ({ ...prev, [key]: { ok: true, data } }));
        // Refresh usage counter to reflect the new call
        loadData();
      }
    } catch (e) {
      setTestResults((prev) => ({
        ...prev,
        [key]: { ok: false, error: e instanceof Error ? e.message : "Erro de rede" },
      }));
    } finally {
      setTestingKey(null);
    }
  }

  async function handleCopyKey(key: string) {
    await navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }

  const referralLink = typeof window !== "undefined"
    ? `${window.location.origin}/?ref=${userId}`
    : `https://fakeforge.com.br/?ref=${userId}`;

  async function handleCopyReferral() {
    await navigator.clipboard.writeText(referralLink);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  const activeKeys = apiKeys.filter((k) => k.is_active);
  const planInfo = PLAN_LIMITS[subscription.plan];
  const usagePercent = Math.min(100, (usageToday / planInfo.requests) * 100);
  const curlSnippet = `curl -H "X-API-Key: ${activeKeys[0]?.key ?? "SUA_KEY_AQUI"}" \\\n  "https://fakeforge.com.br/api/generate?preset=customer&quantity=5"`;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="text-sm text-muted">Carregando...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted mt-1">{userEmail}</p>
        </div>
        <div className="flex items-center gap-4">
          {userEmail === "evertonsilvapaula@gmail.com" && (
            <Link href="/admin" className="text-xs text-accent hover:text-accent/80 transition-colors font-medium">
              Admin
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Sair
          </button>
        </div>
      </div>

      {/* Activation primeiro: é a única ação que importa pra quem nunca chamou a API.
          Com key: 3 demos de 1 clique. Sem key (trigger e self-heal falharam): botão único. */}
      {usageToday === 0 && activeKeys.length > 0 && (
        <FirstCallActivation
          apiKey={activeKeys[0].key}
          onActivated={() => loadData()}
        />
      )}
      {usageToday === 0 && activeKeys.length === 0 && (
        <div className="mb-6 rounded-xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-5 sm:p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Passo 1 · Ativar sua conta</p>
          <h2 className="text-lg sm:text-xl font-bold text-foreground leading-tight mt-2">
            Crie sua key e rode a primeira chamada
          </h2>
          <p className="text-sm text-muted-foreground mt-2">Um clique. Sem formulário. Grátis.</p>
          <button
            onClick={createApiKey}
            disabled={creatingKey}
            className="mt-4 px-5 py-2.5 rounded-lg text-sm font-bold bg-primary text-white hover:bg-primary-hover transition-all disabled:opacity-60"
          >
            {creatingKey ? "Criando..." : "Criar minha primeira key"}
          </button>
          {keyError && (
            <p className="mt-3 text-xs text-danger">
              Não consegui criar a key ({keyError}). Tenta de novo ou escreve pra contato@fakeforge.com.br.
            </p>
          )}
        </div>
      )}

      {/* Milestone streak 5 dias (Free, 1x por milestone, dismiss 7d). Acima do card de valor: mais raro */}
      <MilestoneCelebrationCard />

      {/* Card de valor extraído (Free, 10+ itens, dismiss 7d, 1x/sessão) */}
      <SuccessMetricCard userId={userId} />

      {/* Upsell hero - persistente pra Free, empurra Dev na primeira coisa que ve.
          NOTE (audit 26/08): removido gate 'usageToday > 0' que impedia o hero
          de renderizar pra quem nunca ativou. Zero eventos de dashboard_upsell_*
          em 5 dias porque ninguem ativa antes de ver o hero. Agora hero aparece
          sempre pra Free, independente de ativacao. */}
      {subscription.plan === "free" && (
        <div className="mb-6 rounded-xl border border-accent/30 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
                  Você tá no Free
                </span>
                <span className="text-[10px] text-muted-foreground">100 chamadas/dia · 100 itens/call</span>
              </div>
              <p className="text-base sm:text-lg font-bold text-foreground leading-tight">
                Passa disso com frequência? Dev libera 100x mais chamadas e 100x mais itens por call.
              </p>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                <strong className="text-foreground">10.000 chamadas/dia</strong>,{" "}
                <strong className="text-foreground">10.000 itens por chamada</strong>, presets prontos (customer, order, invoice)
                e suporte por email direto comigo. Cancela quando quiser.
              </p>
            </div>
            <div className="shrink-0">
              <Link
                href="/pricing?plan=dev&ref=dashboard_hero"
                onClick={() => track("dashboard_upsell_clicked", { plan: subscription.plan, target: "dev" })}
                className="group inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-bold bg-accent text-white shadow-lg shadow-accent/30 hover:shadow-accent/60 hover:bg-accent/90 hover:-translate-y-0.5 active:translate-y-0 transition-all whitespace-nowrap"
              >
                Assinar Dev · R$29/mês
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Quota meter — loss aversion pra upgrade */}
      <div className="mb-6">
        <QuotaMeter variant="full" />
      </div>

      {/* Sprint 5 F4 - Onboarding checklist pós-primeira chamada */}
      <OnboardingChecklist
        hasCalled={usageToday > 0}
        isFreePlan={subscription.plan === "free"}
      />

      {/* Sprint 1 Task 3 (13/09) - Upsell contextual baseado no perfil de uso real do user */}
      <UsageProfileCard />

      {/* Quick access to generators */}
      <div className="rounded-xl bg-card border border-border p-5 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Acesso rápido aos geradores</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Gere dados brasileiros direto no navegador — CPF, CNPJ, pessoa, PIX e mais.
            </p>
          </div>
          <Link
            href="/"
            className="shrink-0 px-4 py-2 rounded-lg text-xs font-medium bg-primary text-white hover:bg-primary-hover transition-colors"
          >
            Ir para geradores →
          </Link>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {[
            ["/gerador-cpf", "CPF"],
            ["/gerador-cnpj", "CNPJ"],
            ["/gerador-pessoa", "Pessoa"],
            ["/gerador-empresa", "Empresa"],
            ["/gerador-pix", "PIX"],
            ["/gerador-cartao", "Cartão"],
            ["/gerador-email", "Email"],
            ["/gerador-telefone", "Telefone"],
            ["/gerador-endereco", "Endereço"],
            ["/gerador-cep", "CEP"],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="px-2.5 py-1 rounded-md text-[11px] bg-background border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Usage alert — progressive */}
      {subscription.plan === "free" && usagePercent >= 50 && (
        <div className={`mb-6 p-4 rounded-xl border animate-fade-in ${
          usagePercent >= 90
            ? "bg-danger/10 border-danger/30"
            : usagePercent >= 75
            ? "bg-accent/10 border-accent/30"
            : "bg-primary/5 border-primary/20"
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className={`text-sm font-medium ${
                usagePercent >= 90 ? "text-danger" : usagePercent >= 75 ? "text-accent" : "text-primary"
              }`}>
                {usagePercent >= 90
                  ? `Apenas ${planInfo.requests - usageToday} chamadas restantes hoje`
                  : usagePercent >= 75
                  ? "Você está chegando no limite diário"
                  : "Você já usou metade do seu limite diário"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {usageToday} de {planInfo.requests.toLocaleString()} chamadas usadas.
                O plano Dev tem 10.000 chamadas/dia por R$29/mês.
              </p>
            </div>
            <Link
              href="/pricing"
              className={`shrink-0 px-4 py-2 rounded-lg text-xs font-medium text-white transition-colors ${
                usagePercent >= 90 ? "bg-danger hover:bg-danger/80" : "bg-primary hover:bg-primary-hover"
              }`}
            >
              Fazer upgrade
            </Link>
          </div>
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl bg-card border border-border p-5">
          <p className="text-xs text-muted uppercase tracking-wider mb-1">Plano</p>
          <p className={`text-xl font-bold ${planInfo.color}`}>{planInfo.label}</p>
          {subscription.plan === "free" && (
            <Link href="/pricing" className="text-xs text-primary hover:underline mt-2 inline-block">
              Fazer upgrade
            </Link>
          )}
        </div>

        <div className="rounded-xl bg-card border border-border p-5">
          <p className="text-xs text-muted uppercase tracking-wider mb-1">Uso hoje</p>
          <p className="text-xl font-bold text-foreground">{usageToday} <span className="text-sm text-muted font-normal">/ {planInfo.requests.toLocaleString()}</span></p>
          <div className="mt-2 h-2 bg-background rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${usagePercent}%`,
                background: usagePercent > 90 ? "var(--color-danger)" : usagePercent > 75 ? "var(--color-accent)" : "var(--color-primary)",
              }}
            />
          </div>
        </div>

        <div className="rounded-xl bg-card border border-border p-5">
          <p className="text-xs text-muted uppercase tracking-wider mb-1">API Keys</p>
          <p className="text-xl font-bold text-foreground">{apiKeys.filter(k => k.is_active).length}</p>
        </div>
      </div>

      {/* Plan comparison — always visible for free users */}
      {subscription.plan === "free" && (
        <div className="rounded-xl bg-card border border-border overflow-hidden mb-8">
          <div className="px-5 py-3 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Compare os planos</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-2.5 text-muted-foreground font-medium"></th>
                  <th className="text-center px-4 py-2.5 text-muted-foreground font-medium">Free (atual)</th>
                  <th className="text-center px-4 py-2.5 text-primary font-medium">Dev</th>
                  <th className="text-center px-4 py-2.5 text-accent font-medium">Team</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-4 py-2.5 text-muted-foreground">Chamadas API/dia</td>
                  <td className="px-4 py-2.5 text-center text-foreground">100</td>
                  <td className="px-4 py-2.5 text-center text-primary font-medium">10.000</td>
                  <td className="px-4 py-2.5 text-center text-accent font-medium">100.000</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 text-muted-foreground">Schema builder</td>
                  <td className="px-4 py-2.5 text-center text-muted">—</td>
                  <td className="px-4 py-2.5 text-center text-success">&#10003;</td>
                  <td className="px-4 py-2.5 text-center text-success">&#10003;</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 text-muted-foreground">Presets prontos</td>
                  <td className="px-4 py-2.5 text-center text-muted">—</td>
                  <td className="px-4 py-2.5 text-center text-success">&#10003;</td>
                  <td className="px-4 py-2.5 text-center text-success">&#10003;</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 text-muted-foreground">Suporte</td>
                  <td className="px-4 py-2.5 text-center text-muted">—</td>
                  <td className="px-4 py-2.5 text-center text-foreground">Email</td>
                  <td className="px-4 py-2.5 text-center text-foreground">Prioritário</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 text-muted-foreground">Preço</td>
                  <td className="px-4 py-2.5 text-center text-foreground">R$0</td>
                  <td className="px-4 py-2.5 text-center text-primary font-bold">R$29/mês</td>
                  <td className="px-4 py-2.5 text-center text-accent font-bold">R$79/mês</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-border flex justify-center">
            <Link
              href="/pricing"
              className="px-6 py-2 rounded-lg text-xs font-medium bg-primary text-white hover:bg-primary-hover transition-colors"
            >
              Ver planos e assinar
            </Link>
          </div>
        </div>
      )}

      {/* API Keys */}
      <div className="rounded-xl bg-card border border-border overflow-hidden mb-8">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">API Keys</h2>
          <button
            onClick={createApiKey}
            className="text-xs px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary-hover transition-all font-medium"
          >
            + Nova key
          </button>
        </div>

        {apiKeys.filter(k => k.is_active).length === 0 ? (
          <div className="px-5 py-6">
            <p className="text-sm font-semibold text-foreground">Bem-vindo. Crie sua primeira API key.</p>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
              Com uma key você roda esses 3 fluxos em segundos. Tudo dentro do limite grátis de 50 chamadas/dia.
            </p>

            <div className="mt-4 space-y-2 text-xs">
              <div className="rounded-lg border border-border bg-background px-3 py-2">
                <p className="font-medium text-foreground">1. Seed de banco de staging em 1 chamada</p>
                <p className="text-muted mt-0.5">
                  Gere 100 clientes brasileiros correlacionados (nome + CPF + email + endereço + telefone)
                  prontos pra <span className="font-mono text-primary">INSERT INTO customers</span>.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-background px-3 py-2">
                <p className="font-medium text-foreground">2. Fixtures pra suite de testes</p>
                <p className="text-muted mt-0.5">
                  Use o preset <span className="font-mono text-primary">customer</span> em pytest/jest factories.
                  Cada chamada devolve dados que passam mod-11, Luhn e validação BACEN.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-background px-3 py-2">
                <p className="font-medium text-foreground">3. Mock de checkout de pagamento</p>
                <p className="text-muted mt-0.5">
                  CPF + cartão Luhn + chave PIX BACEN no mesmo objeto. Ideal pra rodar testes E2E
                  do seu fluxo de checkout sem dado real.
                </p>
              </div>
            </div>

            <button
              onClick={createApiKey}
              className="mt-4 w-full sm:w-auto text-xs px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-hover transition-all font-semibold"
            >
              Criar minha primeira API key
            </button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {apiKeys.filter(k => k.is_active).map((key) => {
              const test = testResults[key.key];
              const isTesting = testingKey === key.key;
              return (
                <div key={key.id} className="px-5 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-foreground truncate">{key.key.slice(0, 12)}...{key.key.slice(-4)}</span>
                        <span className="text-[10px] text-muted">{key.name}</span>
                      </div>
                      <p className="text-[11px] text-muted mt-0.5">
                        Criada em {new Date(key.created_at).toLocaleDateString("pt-BR")}
                        {key.last_used_at && ` · Último uso: ${new Date(key.last_used_at).toLocaleDateString("pt-BR")}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => testApiKey(key.key)}
                        disabled={isTesting}
                        className={`text-[11px] px-2.5 py-1 rounded-md transition-all font-medium ${
                          isTesting
                            ? "bg-primary/40 text-white"
                            : "bg-primary text-white hover:bg-primary-hover"
                        }`}
                      >
                        {isTesting ? "Testando..." : "Testar agora"}
                      </button>
                      <button
                        onClick={() => handleCopyKey(key.key)}
                        className={`text-[11px] px-2.5 py-1 rounded-md transition-all ${
                          copiedKey === key.key ? "bg-success text-white" : "text-muted-foreground hover:text-foreground hover:bg-background"
                        }`}
                      >
                        {copiedKey === key.key ? "Copiada!" : "Copiar"}
                      </button>
                      <button
                        onClick={() => deleteApiKey(key.id)}
                        className="text-[11px] px-2.5 py-1 rounded-md text-danger/70 hover:text-danger hover:bg-danger/10 transition-all"
                      >
                        Revogar
                      </button>
                    </div>
                  </div>

                  {test && (
                    <div className={`mt-3 rounded-lg border p-3 text-xs ${
                      test.ok ? "border-success/30 bg-success/5" : "border-danger/30 bg-danger/5"
                    }`}>
                      {test.ok ? (
                        <>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-success" />
                            <span className="text-success font-medium">Funcionou. 3 CPFs gerados via sua key:</span>
                          </div>
                          <pre className="font-mono text-foreground bg-background border border-border rounded p-2 overflow-x-auto">
{`GET /api/generate?type=cpf&quantity=3
X-API-Key: ${key.key.slice(0, 12)}...

${(test.data || []).map((cpf, i) => `${i + 1}. ${cpf}`).join("\n")}`}
                          </pre>
                          <p className="text-muted mt-2 text-[10px]">
                            A chamada conta no seu limite diário. Use {"`curl -H 'X-API-Key: ...' '...'`"} ou o SDK no seu projeto.
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-danger" />
                            <span className="text-danger font-medium">Falhou:</span>
                          </div>
                          <p className="text-foreground font-mono">{test.error}</p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Affiliate / Referral program */}
      <div className="rounded-xl bg-card border border-border overflow-hidden mb-8">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Programa de Afiliados</h2>
            <p className="text-[11px] text-muted mt-0.5">Ganhe 30% recorrente sobre cada indicação que assinar plano pago</p>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-success/10 text-success font-medium">Beta</span>
        </div>

        <div className="p-5 space-y-4">
          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-lg bg-background border border-border p-3">
              <p className="text-[10px] text-muted uppercase tracking-wider">Cliques convertidos</p>
              <p className="text-xl font-bold text-foreground mt-1">{refStats.total}</p>
            </div>
            <div className="rounded-lg bg-background border border-border p-3">
              <p className="text-[10px] text-muted uppercase tracking-wider">Assinaturas ativas</p>
              <p className="text-xl font-bold text-success mt-1">{refStats.converted}</p>
            </div>
            <div className="rounded-lg bg-background border border-border p-3">
              <p className="text-[10px] text-muted uppercase tracking-wider">MRR/mês</p>
              <p className="text-xl font-bold text-primary mt-1">R${refStats.monthly_recurring.toFixed(2)}</p>
            </div>
            <div className="rounded-lg bg-background border border-border p-3">
              <p className="text-[10px] text-muted uppercase tracking-wider">Total ganho</p>
              <p className="text-xl font-bold text-accent mt-1">R${refStats.total_earned.toFixed(2)}</p>
            </div>
          </div>

          {/* Referral link */}
          <div>
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Seu link de indicação</label>
            <div className="flex items-center gap-2 mt-1.5">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 px-3 py-2 rounded-lg text-xs font-mono bg-background border border-border text-foreground"
              />
              <button
                onClick={handleCopyReferral}
                className={`shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  copiedRef ? "bg-success text-white" : "bg-primary text-white hover:bg-primary-hover"
                }`}
              >
                {copiedRef ? "Copiado!" : "Copiar"}
              </button>
            </div>
            <p className="text-[11px] text-muted mt-2">
              Compartilhe o link. Quem se cadastrar e assinar plano pago via essa indicação gera <strong className="text-foreground">30% recorrente</strong> pra você
              (R$8,70/mês por Dev assinante, R$23,70/mês por Team).
            </p>
          </div>
        </div>
      </div>

      {/* Snippet pronto com a key real do user e URL absoluta (copiar e colar no terminal) */}
      <div className="rounded-xl bg-primary/5 border border-primary/20 p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-foreground">Copie, cole no terminal, pronto</h3>
          {activeKeys.length > 0 && (
            <button
              onClick={async () => {
                await navigator.clipboard.writeText(curlSnippet);
                setCopiedCurl(true);
                track("dashboard_curl_copied", {});
                setTimeout(() => setCopiedCurl(false), 2000);
              }}
              className={`text-[11px] px-2.5 py-1 rounded-md font-medium transition-all ${
                copiedCurl ? "bg-success text-white" : "bg-primary text-white hover:bg-primary-hover"
              }`}
            >
              {copiedCurl ? "Copiado!" : "Copiar curl"}
            </button>
          )}
        </div>
        <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 overflow-x-auto whitespace-pre-wrap break-all">{curlSnippet}</pre>
        <p className="text-[11px] text-muted mt-2">
          Retorna 5 clientes brasileiros correlacionados (CPF, email, endereço, telefone). Mais exemplos em{" "}
          <Link href="/docs" className="text-primary hover:underline">/docs</Link>.
        </p>
      </div>
    </div>
  );
}

function generateRandomKey(length: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const values = new Uint8Array(length);
  crypto.getRandomValues(values);
  for (let i = 0; i < length; i++) {
    result += chars[values[i] % chars.length];
  }
  return result;
}
