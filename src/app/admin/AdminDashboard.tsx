"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Metrics {
  total_users: number;
  users_today: number;
  users_7d: number;
  users_30d: number;
  active_api_keys: number;
  api_calls_today: number;
  api_calls_7d: number;
  api_calls_30d: number;
  paying_dev: number;
  paying_team: number;
  mrr: number;
}

interface UsageByType {
  data_type: string;
  total_calls: number;
  total_items: number;
  unique_users: number;
}

interface DailyData {
  day: string;
  new_users?: number;
  total_calls?: number;
  total_items?: number;
}

interface Subscriber {
  plan: string;
  status: string;
  mp_payer_email: string;
  created_at: string;
  current_period_end: string | null;
}

interface AdminData {
  metrics: Metrics;
  usageByType: UsageByType[];
  usersDaily: DailyData[];
  apiDaily: DailyData[];
  subscribers: Subscriber[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin");
      if (res.status === 403) {
        setError("Acesso negado. Você não é admin.");
        return;
      }
      if (res.status === 401) {
        setError("Não autenticado.");
        return;
      }
      const json = await res.json();
      setData(json);
      setLastRefresh(new Date());
    } catch {
      setError("Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, [loadData]);

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="text-sm text-muted">Carregando painel admin...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-danger font-medium">{error}</p>
          <Link href="/dashboard" className="text-xs text-primary hover:underline mt-4 inline-block">
            Voltar ao dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { metrics: m } = data;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-danger flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">AD</span>
            </div>
            <span className="font-semibold text-sm">FakeForge Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-muted">
              Atualizado: {lastRefresh.toLocaleTimeString("pt-BR")}
            </span>
            <button
              onClick={loadData}
              className="text-xs text-primary hover:text-primary-hover transition-colors"
            >
              Atualizar
            </button>
            <Link href="/dashboard" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Site
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold tracking-tight mb-8">Métricas do FakeForge BR</h1>

        {/* Revenue card — highlighted */}
        <div className="rounded-xl bg-primary/5 border border-primary/20 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-primary uppercase tracking-wider font-medium">MRR (Receita Mensal Recorrente)</p>
              <p className="text-4xl font-bold text-primary mt-1">R${m.mrr}</p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{m.paying_dev}</p>
                <p className="text-[11px] text-muted">Plano Dev</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{m.paying_team}</p>
                <p className="text-[11px] text-muted">Plano Team</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{m.paying_dev + m.paying_team}</p>
                <p className="text-[11px] text-muted">Total pagantes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key metrics grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <MetricCard label="Usuários total" value={m.total_users} />
          <MetricCard label="Novos hoje" value={m.users_today} highlight={m.users_today > 0} />
          <MetricCard label="Novos 7 dias" value={m.users_7d} />
          <MetricCard label="Novos 30 dias" value={m.users_30d} />
          <MetricCard label="API keys ativas" value={m.active_api_keys} />
          <MetricCard label="Chamadas API hoje" value={m.api_calls_today} highlight={m.api_calls_today > 0} />
          <MetricCard label="Chamadas 7 dias" value={m.api_calls_7d} />
          <MetricCard label="Chamadas 30 dias" value={m.api_calls_30d} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Users daily */}
          <div className="rounded-xl bg-card border border-border overflow-hidden">
            <div className="px-5 py-3 border-b border-border">
              <h2 className="text-sm font-semibold">Novos usuários por dia</h2>
            </div>
            <div className="p-4">
              {data.usersDaily.length === 0 ? (
                <p className="text-xs text-muted text-center py-8">Sem dados ainda</p>
              ) : (
                <div className="space-y-1.5">
                  {data.usersDaily.slice(0, 14).map((d) => (
                    <div key={d.day} className="flex items-center gap-3">
                      <span className="text-xs text-muted w-20 shrink-0 font-mono">
                        {new Date(d.day + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                      </span>
                      <div className="flex-1 h-5 bg-background rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary/60 rounded-full transition-all"
                          style={{
                            width: `${Math.max(4, ((d.new_users || 0) / Math.max(...data.usersDaily.map(x => x.new_users || 1))) * 100)}%`
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium text-foreground w-8 text-right">{d.new_users}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* API daily */}
          <div className="rounded-xl bg-card border border-border overflow-hidden">
            <div className="px-5 py-3 border-b border-border">
              <h2 className="text-sm font-semibold">Chamadas API por dia</h2>
            </div>
            <div className="p-4">
              {data.apiDaily.length === 0 ? (
                <p className="text-xs text-muted text-center py-8">Sem dados ainda</p>
              ) : (
                <div className="space-y-1.5">
                  {data.apiDaily.slice(0, 14).map((d) => (
                    <div key={d.day} className="flex items-center gap-3">
                      <span className="text-xs text-muted w-20 shrink-0 font-mono">
                        {new Date(d.day + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                      </span>
                      <div className="flex-1 h-5 bg-background rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent/60 rounded-full transition-all"
                          style={{
                            width: `${Math.max(4, ((d.total_calls || 0) / Math.max(...data.apiDaily.map(x => x.total_calls || 1))) * 100)}%`
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium text-foreground w-12 text-right">{d.total_calls?.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Usage by type */}
          <div className="rounded-xl bg-card border border-border overflow-hidden">
            <div className="px-5 py-3 border-b border-border">
              <h2 className="text-sm font-semibold">Tipos mais usados (30 dias)</h2>
            </div>
            {data.usageByType.length === 0 ? (
              <p className="text-xs text-muted text-center py-8">Sem dados ainda</p>
            ) : (
              <div className="divide-y divide-border">
                {data.usageByType.map((t) => (
                  <div key={t.data_type} className="flex items-center justify-between px-5 py-2.5">
                    <span className="text-sm font-mono text-primary">{t.data_type}</span>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className="text-xs font-medium text-foreground">{t.total_calls.toLocaleString()}</span>
                        <span className="text-[10px] text-muted ml-1">calls</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-medium text-foreground">{t.total_items.toLocaleString()}</span>
                        <span className="text-[10px] text-muted ml-1">items</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-medium text-foreground">{t.unique_users}</span>
                        <span className="text-[10px] text-muted ml-1">users</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent subscribers */}
          <div className="rounded-xl bg-card border border-border overflow-hidden">
            <div className="px-5 py-3 border-b border-border">
              <h2 className="text-sm font-semibold">Assinantes recentes</h2>
            </div>
            {data.subscribers.length === 0 ? (
              <p className="text-xs text-muted text-center py-8">Nenhum assinante ainda</p>
            ) : (
              <div className="divide-y divide-border">
                {data.subscribers.map((s, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-2.5">
                    <div>
                      <span className="text-sm text-foreground">{s.mp_payer_email || "—"}</span>
                      <p className="text-[10px] text-muted">
                        {new Date(s.created_at).toLocaleDateString("pt-BR")}
                        {s.current_period_end && ` · Expira: ${new Date(s.current_period_end).toLocaleDateString("pt-BR")}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        s.plan === "team" ? "bg-accent/15 text-accent" :
                        s.plan === "dev" ? "bg-primary/15 text-primary" :
                        "bg-card text-muted"
                      }`}>
                        {s.plan}
                      </span>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        s.status === "active" ? "bg-success" :
                        s.status === "past_due" ? "bg-accent" : "bg-danger"
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Success metrics targets */}
        <div className="mt-8 rounded-xl bg-card border border-border p-6">
          <h2 className="text-sm font-semibold mb-4">Metas de sucesso</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <GoalCard label="Usuários totais" current={m.total_users} target={1000} />
            <GoalCard label="API keys ativas" current={m.active_api_keys} target={50} />
            <GoalCard label="Pagantes" current={m.paying_dev + m.paying_team} target={15} />
            <GoalCard label="MRR" current={m.mrr} target={1500} prefix="R$" />
          </div>
        </div>
      </main>
    </div>
  );
}

function MetricCard({ label, value, highlight = false }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className="rounded-xl bg-card border border-border p-4 text-center">
      <p className={`text-2xl font-bold ${highlight ? "text-success" : "text-foreground"}`}>
        {value.toLocaleString()}
      </p>
      <p className="text-[11px] text-muted mt-0.5">{label}</p>
    </div>
  );
}

function GoalCard({ label, current, target, prefix = "" }: { label: string; current: number; target: number; prefix?: string }) {
  const percent = Math.min(100, (current / target) * 100);
  const achieved = current >= target;

  return (
    <div className="rounded-lg bg-background border border-border p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted">{label}</span>
        {achieved && <span className="text-[10px] text-success font-medium">Meta atingida!</span>}
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-lg font-bold ${achieved ? "text-success" : "text-foreground"}`}>
          {prefix}{current.toLocaleString()}
        </span>
        <span className="text-xs text-muted">/ {prefix}{target.toLocaleString()}</span>
      </div>
      <div className="mt-2 h-1.5 bg-border rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${percent}%`,
            background: achieved ? "var(--color-success)" : percent > 50 ? "var(--color-primary)" : "var(--color-accent)",
          }}
        />
      </div>
    </div>
  );
}
