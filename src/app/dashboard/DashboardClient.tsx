"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Link from "next/link";

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

const PLAN_LIMITS: Record<string, { requests: number; label: string; color: string }> = {
  free: { requests: 100, label: "Free", color: "text-muted-foreground" },
  dev: { requests: 10000, label: "Dev", color: "text-primary" },
  team: { requests: 100000, label: "Team", color: "text-accent" },
};

export default function DashboardClient({ userId, userEmail }: { userId: string; userEmail: string }) {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [subscription, setSubscription] = useState<Subscription>({ plan: "free", status: "active", current_period_end: null });
  const [usageToday, setUsageToday] = useState(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();
  const router = useRouter();

  const loadData = useCallback(async () => {
    setLoading(true);

    // Load API keys
    const { data: keys } = await supabase
      .from("api_keys")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (keys) setApiKeys(keys);

    // Load subscription
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("plan, status, current_period_end")
      .eq("user_id", userId)
      .eq("status", "active")
      .single();
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

    setLoading(false);
  }, [supabase, userId]);

  useEffect(() => { loadData(); }, [loadData]);

  async function createApiKey() {
    const key = `ff_${generateRandomKey(32)}`;
    await supabase.from("api_keys").insert({
      user_id: userId,
      key,
      name: `Key ${apiKeys.length + 1}`,
    });
    loadData();
  }

  async function deleteApiKey(id: string) {
    await supabase.from("api_keys").update({ is_active: false }).eq("id", id);
    loadData();
  }

  async function handleCopyKey(key: string) {
    await navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  const planInfo = PLAN_LIMITS[subscription.plan];
  const usagePercent = Math.min(100, (usageToday / planInfo.requests) * 100);

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
          <div className="mt-2 h-1.5 bg-background rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${usagePercent}%`,
                background: usagePercent > 80 ? "var(--color-danger)" : "var(--color-primary)",
              }}
            />
          </div>
        </div>

        <div className="rounded-xl bg-card border border-border p-5">
          <p className="text-xs text-muted uppercase tracking-wider mb-1">API Keys</p>
          <p className="text-xl font-bold text-foreground">{apiKeys.filter(k => k.is_active).length}</p>
        </div>
      </div>

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
          <div className="px-5 py-8 text-center">
            <p className="text-sm text-muted-foreground">Nenhuma API key criada.</p>
            <p className="text-xs text-muted mt-1">Crie uma key para usar a API com autenticação.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {apiKeys.filter(k => k.is_active).map((key) => (
              <div key={key.id} className="flex items-center justify-between px-5 py-3">
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
            ))}
          </div>
        )}
      </div>

      {/* Usage hint */}
      <div className="rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h3 className="text-sm font-semibold text-foreground mb-2">Como usar sua API key</h3>
        <div className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6">
          <div className="text-muted"># Adicione o header X-API-Key</div>
          <div>
            <span className="text-success">curl</span> -H <span className="text-accent">&quot;X-API-Key: ff_sua_chave_aqui&quot;</span> \
          </div>
          <div>{"  "}&quot;/api/generate?preset=customer&amp;quantity=100&quot;</div>
        </div>
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
