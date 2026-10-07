"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface HeroKPIs {
  mrr: number;
  mrr_mom_pct: number;
  signups_current_month: number;
  signups_mom_pct: number;
  waac: number;
  total_users: number;
  total_paying: number;
  activation_rate: number;
  ltv_cac_ratio: number;
  arpu: number;
}

interface UnitEcon {
  ltv: number;
  cac_estimate: number;
  ltv_cac_ratio: number;
  arpu: number;
  estimated_monthly_churn: number;
  payback_months: number;
  payback_period_months: number;
  burn_multiple: number | null;
}

interface TierBreakdown { customers: number; mrr: number; arpu: number }
interface MrrByTier { dev: TierBreakdown; team: TierBreakdown; enterprise: TierBreakdown }
interface SignupSource { page: string; signups: number }
interface LandingConversion { page: string; page_views: number; signups: number; conversion_pct: number }
interface RollingCohortRow { cohort_day: string; signups: number; activated_7d: number; activation_pct: number }
interface NrrGrr { nrr_pct: number | null; grr_pct: number | null; starting_mrr_30d_ago: number | null; expansion_mrr_30d: number; contraction_mrr_30d: number; churn_mrr_30d: number; status: string }
interface LogoVsRevenueChurn { logo_churn_30d_pct: number; revenue_churn_30d_pct: number; status: string }

interface MrrPoint { month: string; mrr: number; new_customers: number; churned: number }
interface ForecastPoint { month: string; mrr_projected: number }
interface SignupPoint { day: string; signups: number; cumulative: number }
interface CohortRow { week: string; total: number; w1_pct: number; w4_pct: number; w8_pct: number; w12_pct: number }
interface HistBucket { bucket: string; count: number }
interface TimeToFirstCall { sample_size: number; p50_min: number; p75_min: number; p90_min: number; mean_min: number; histogram: HistBucket[] }
interface Funnel {
  visitors_180d: number; signups: number; with_api_key: number; activated: number; paying: number;
  conversion: {
    visitor_to_signup: number; signup_to_key: number; key_to_activated: number;
    activated_to_paying: number; end_to_end: number;
  };
}
interface Benchmark { current: number; benchmark: number; best_in_class: number; unit: string; lower_is_better?: boolean }
interface Benchmarks { [key: string]: Benchmark }
interface PowerUser { user_id: string; email: string; calls: number }
interface Churn { total_churned: number; revenue_churned: number; by_month: Record<string, number> }

interface VcData {
  generated_at: string;
  hero: HeroKPIs;
  unit_economics: UnitEcon;
  mrr_history: MrrPoint[];
  mrr_forecast: ForecastPoint[];
  mrr_by_tier: MrrByTier;
  signups_daily: SignupPoint[];
  signup_source_30d: SignupSource[];
  top_landing_conversion: LandingConversion[];
  funnel: Funnel;
  cohort_table: CohortRow[];
  rolling_cohort: RollingCohortRow[];
  nrr_grr: NrrGrr;
  logo_vs_revenue_churn: LogoVsRevenueChurn;
  time_to_first_call: TimeToFirstCall;
  benchmarks: Benchmarks;
  power_users: PowerUser[];
  churn: Churn;
}

interface BotSample { email: string; created_at: string; score: number; has_key: boolean; calls: number }
interface BotAnalysisData {
  generated_at: string;
  total_users: number;
  bot_analysis: {
    suspicious_bots_count: number;
    high_confidence_bots_count: number;
    suspicious_pct: number;
    real_users_count: number;
  };
  score_breakdown: Record<string, number>;
  activation: {
    raw_activation_rate_pct: number;
    real_activation_rate_pct: number;
    real_users_activated: number;
    real_users_total: number;
  };
  recent_bot_samples: BotSample[];
}

interface FunnelTemplate {
  key: string;
  label: string;
  sent: number;
  opened: number;
  clicked: number;
  checkoutStarted: number;
  converted: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
}

interface FunnelMetricsData {
  generated_at: string;
  window: string;
  summary: {
    total_sent: number;
    total_opened: number;
    total_clicked: number;
    total_converted: number;
    overall_open_rate: number;
    overall_click_rate: number;
    overall_conversion_rate: number;
  };
  b2b: {
    triggers_sent: number;
    calendly_booked: number;
  };
  per_template: FunnelTemplate[];
}

function fmtMoney(n: number): string {
  return `R$${n.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}
function fmtPct(n: number, decimals = 1): string {
  return `${n.toFixed(decimals)}%`;
}
function fmtDelta(pct: number): { text: string; color: string } {
  if (pct === 0 || isNaN(pct) || !isFinite(pct)) return { text: "—", color: "text-muted" };
  if (pct > 0) return { text: `+${pct.toFixed(1)}%`, color: "text-success" };
  return { text: `${pct.toFixed(1)}%`, color: "text-danger" };
}
function fmtDuration(min: number): string {
  if (min < 1) return `${Math.round(min * 60)}s`;
  if (min < 60) return `${Math.round(min)}min`;
  if (min < 1440) return `${(min / 60).toFixed(1)}h`;
  if (min < 10080) return `${(min / 1440).toFixed(1)}d`;
  return `${Math.round(min / 1440)}d`;
}

export default function VcDashboard() {
  const [data, setData] = useState<VcData | null>(null);
  const [botData, setBotData] = useState<BotAnalysisData | null>(null);
  const [funnelData, setFunnelData] = useState<FunnelMetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [vcRes, botRes, funnelRes] = await Promise.all([
        fetch("/api/admin/vc-metrics"),
        fetch("/api/admin/bot-analysis"),
        fetch("/api/admin/funnel-metrics"),
      ]);
      if (vcRes.status === 403) return setError("Sem permissão.");
      if (vcRes.status === 401) return setError("Não autenticado.");
      const vcJson = await vcRes.json();
      setData(vcJson);
      if (botRes.ok) {
        const botJson = await botRes.json();
        setBotData(botJson);
      }
      if (funnelRes.ok) {
        const funnelJson = await funnelRes.json();
        setFunnelData(funnelJson);
      }
    } catch {
      setError("Erro ao carregar.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading && !data) return <div className="min-h-screen flex items-center justify-center bg-background"><span className="text-sm text-muted">Carregando VC dashboard...</span></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-sm text-danger">{error}</p></div>;
  if (!data) return null;

  const h = data.hero;
  const ue = data.unit_economics;
  const f = data.funnel;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">VC</span>
            </div>
            <span className="font-semibold text-sm">VC Dashboard</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-[10px] text-muted">Atualizado: {new Date(data.generated_at).toLocaleTimeString("pt-BR")}</span>
            <button onClick={load} className="text-primary hover:text-primary-hover">Atualizar</button>
            <Link href="/admin" className="text-muted-foreground hover:text-foreground">Ops Admin</Link>
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">Dashboard</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">FakeForge — Métricas VC-ready</h1>
          <p className="text-xs text-muted-foreground mt-1">Dados em tempo real. Snapshot pronto pra pitch.</p>
        </div>

        {/* ========== BOT ANALYSIS (Sprint 7) ========== */}
        {botData && (
          <section>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-wider text-muted font-bold">Análise de bots (Sprint 7)</p>
              <p className="text-[10px] text-muted">Heurística signup pattern + comportamento</p>
            </div>
            <div className="rounded-xl border border-danger/30 bg-danger/5 p-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div>
                  <p className="text-[10px] uppercase text-muted mb-1">Bots suspeitos (score ≥3)</p>
                  <p className="text-2xl font-bold text-danger">{botData.bot_analysis.suspicious_bots_count}</p>
                  <p className="text-[10px] text-muted">{botData.bot_analysis.suspicious_pct}% da base</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-muted mb-1">Alta confiança (≥4)</p>
                  <p className="text-2xl font-bold text-danger">{botData.bot_analysis.high_confidence_bots_count}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-muted mb-1">Users reais</p>
                  <p className="text-2xl font-bold text-success">{botData.bot_analysis.real_users_count}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-muted mb-1">Ativação real (excl bots)</p>
                  <p className="text-2xl font-bold text-foreground">{botData.activation.real_activation_rate_pct}%</p>
                  <p className="text-[10px] text-muted">vs {botData.activation.raw_activation_rate_pct}% raw</p>
                </div>
              </div>

              {botData.recent_bot_samples.length > 0 && (
                <details className="border-t border-danger/20 pt-3">
                  <summary className="text-xs cursor-pointer text-muted-foreground hover:text-foreground">
                    Ver últimos {botData.recent_bot_samples.length} bots suspeitos
                  </summary>
                  <div className="mt-3 space-y-1 max-h-64 overflow-y-auto">
                    {botData.recent_bot_samples.map((s) => (
                      <div key={s.email} className="flex items-center justify-between text-[11px] px-2 py-1 rounded bg-background/60">
                        <span className="font-mono text-foreground truncate flex-1">{s.email}</span>
                        <span className="text-muted ml-2 shrink-0">
                          score {s.score} · {s.calls} calls · {new Date(s.created_at).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          </section>
        )}

        {/* ========== HERO KPIs (F1) ========== */}
        <section>
          <p className="text-[11px] uppercase tracking-wider text-muted font-bold mb-3">Hero KPIs</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <HeroCard
              label="MRR"
              value={fmtMoney(h.mrr)}
              delta={fmtDelta(h.mrr_mom_pct)}
              subtitle={`${h.total_paying} pagantes · ARPU ${fmtMoney(h.arpu)}`}
              accent="primary"
            />
            <HeroCard
              label="WAAC"
              value={h.waac.toLocaleString()}
              delta={{ text: "7d", color: "text-muted" }}
              subtitle="Weekly Active API Callers"
              accent="accent"
            />
            <HeroCard
              label="Activation"
              value={fmtPct(h.activation_rate)}
              delta={{ text: `${h.total_users} users`, color: "text-muted" }}
              subtitle="Signup → 1a chamada API"
              accent={h.activation_rate < 10 ? "danger" : h.activation_rate < 20 ? "warning" : "success"}
            />
            <HeroCard
              label="LTV : CAC"
              value={`${ue.ltv_cac_ratio.toFixed(1)}x`}
              delta={{ text: `LTV ${fmtMoney(ue.ltv)}`, color: "text-muted" }}
              subtitle={`CAC ~${fmtMoney(ue.cac_estimate)} · payback ${ue.payback_months.toFixed(1)}mo`}
              accent={ue.ltv_cac_ratio < 3 ? "warning" : "success"}
            />
          </div>
        </section>

        {/* ========== MRR TREND + FORECAST (F2 + F9) ========== */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl bg-card border border-border p-5">
            <div className="mb-4">
              <p className="text-sm font-semibold">MRR ao longo dos meses</p>
              <p className="text-[11px] text-muted">Últimos 6 meses · valor no final do mês</p>
            </div>
            <BarChart data={data.mrr_history.map(m => ({ label: m.month.slice(5), value: m.mrr, extra: `+${m.new_customers} novos${m.churned ? ` / ${m.churned} churn` : ""}` }))} unit="R$" color="primary" />
          </div>

          <div className="rounded-xl bg-card border border-border p-5">
            <div className="mb-4">
              <p className="text-sm font-semibold">MRR Forecast (linear)</p>
              <p className="text-[11px] text-muted">Projeção próximos 6 meses · linear regression</p>
            </div>
            <BarChart data={data.mrr_forecast.map(m => ({ label: m.month.slice(5), value: m.mrr_projected, extra: "" }))} unit="R$" color="accent" />
          </div>
        </section>

        {/* ========== SIGNUPS TREND (F3) ========== */}
        <section>
          <div className="rounded-xl bg-card border border-border p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Signups cumulativos (últimos 90 dias)</p>
                <p className="text-[11px] text-muted">Curva log-scale visual · trajetória do crescimento</p>
              </div>
              <p className="text-2xl font-bold text-primary">{data.signups_daily[data.signups_daily.length - 1]?.cumulative.toLocaleString() || 0}</p>
            </div>
            <LineChart data={data.signups_daily.map(d => ({ label: d.day.slice(5), value: d.cumulative }))} color="success" />
          </div>
        </section>

        {/* ========== FUNNEL (F4) ========== */}
        <section>
          <div className="rounded-xl bg-card border border-border p-5">
            <div className="mb-4">
              <p className="text-sm font-semibold">Funil de conversão end-to-end</p>
              <p className="text-[11px] text-muted">Do visitante anônimo ao cliente pagante · últimos 180 dias</p>
            </div>
            <FunnelWaterfall funnel={f} />
          </div>
        </section>

        {/* ========== COHORT RETENTION (F5) ========== */}
        <section>
          <div className="rounded-xl bg-card border border-border overflow-hidden">
            <div className="p-5 border-b border-border">
              <p className="text-sm font-semibold">Cohort retention (últimas 12 semanas)</p>
              <p className="text-[11px] text-muted">% de users da cohort que fizeram ≥1 chamada até a semana X pós-signup</p>
            </div>
            <CohortTable rows={data.cohort_table} />
          </div>
        </section>

        {/* ========== TIME TO FIRST CALL (F6) ========== */}
        <section>
          <div className="rounded-xl bg-card border border-border p-5">
            <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="text-sm font-semibold">Time to First Call — activation velocity</p>
                <p className="text-[11px] text-muted">Distribuição do delta entre signup e 1ª chamada API</p>
              </div>
              <div className="flex gap-4 text-xs">
                <div><span className="text-muted">p50: </span><span className="font-bold text-foreground">{fmtDuration(data.time_to_first_call.p50_min)}</span></div>
                <div><span className="text-muted">p75: </span><span className="font-bold text-foreground">{fmtDuration(data.time_to_first_call.p75_min)}</span></div>
                <div><span className="text-muted">p90: </span><span className="font-bold text-foreground">{fmtDuration(data.time_to_first_call.p90_min)}</span></div>
                <div><span className="text-muted">n: </span><span className="font-bold text-foreground">{data.time_to_first_call.sample_size}</span></div>
              </div>
            </div>
            <BarChart data={data.time_to_first_call.histogram.map(h => ({ label: h.bucket, value: h.count, extra: "" }))} unit="" color="accent" />
          </div>
        </section>

        {/* ========== BENCHMARKS (F7) ========== */}
        <section>
          <div className="rounded-xl bg-card border border-border overflow-hidden">
            <div className="p-5 border-b border-border">
              <p className="text-sm font-semibold">Benchmarks vs. indústria (dev tools SaaS pré-seed)</p>
              <p className="text-[11px] text-muted">Comparação com médias reais do setor · fonte: OpenView + SaaStr benchmarks</p>
            </div>
            <BenchmarksTable benchmarks={data.benchmarks} />
          </div>
        </section>

        {/* ========== NPS PLACEHOLDER (F8) ========== */}
        <section>
          <div className="rounded-xl bg-card border-l-4 border-accent p-5">
            <p className="text-sm font-semibold text-foreground mb-1">NPS coleta — pendente instrumentação</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Widget in-app pra coletar NPS (0-10) programado pra Sprint 6. Trigger sugerido:
              após 5 chamadas API bem-sucedidas OU 3 dias como user Free. VC pergunta NPS a
              partir de Série A, não é crítico pré-seed.
            </p>
          </div>
        </section>

        {/* ========== POWER USERS (F10) ========== */}
        <section>
          <div className="rounded-xl bg-card border border-border overflow-hidden">
            <div className="p-5 border-b border-border">
              <p className="text-sm font-semibold">Power Users (top 10% em chamadas)</p>
              <p className="text-[11px] text-muted">Users com maior uso · candidatos naturais pra upsell Dev/Team</p>
            </div>
            {data.power_users.length === 0 ? (
              <p className="text-xs text-muted text-center py-8">Sem dados ainda</p>
            ) : (
              <div className="divide-y divide-border">
                {data.power_users.map((pu, i) => (
                  <div key={pu.user_id} className="flex items-center justify-between px-5 py-2.5">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">#{i + 1}</span>
                      <div>
                        <p className="text-sm text-foreground">{pu.email || <span className="text-muted italic">sem email</span>}</p>
                        <p className="text-[10px] text-muted font-mono">{pu.user_id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">{pu.calls.toLocaleString()}</p>
                      <p className="text-[10px] text-muted">items gerados</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ========== EMAIL FUNNEL D3-D30 (Sprint 8) ========== */}
        {funnelData && (
          <section>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-wider text-muted font-bold">Email Funnel D3-D30 (últimos 30d)</p>
              <p className="text-[10px] text-muted">Sprint 8 · nurture + B2B trigger</p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="rounded-lg bg-card border border-border p-4">
                <p className="text-[10px] uppercase text-muted mb-1">Total enviados</p>
                <p className="text-2xl font-bold text-foreground">{funnelData.summary.total_sent}</p>
              </div>
              <div className="rounded-lg bg-card border border-border p-4">
                <p className="text-[10px] uppercase text-muted mb-1">Open rate geral</p>
                <p className="text-2xl font-bold text-foreground">{fmtPct(funnelData.summary.overall_open_rate)}</p>
                <p className="text-[10px] text-muted mt-0.5">{funnelData.summary.total_opened} abertos</p>
              </div>
              <div className="rounded-lg bg-card border border-border p-4">
                <p className="text-[10px] uppercase text-muted mb-1">Click rate geral</p>
                <p className="text-2xl font-bold text-foreground">{fmtPct(funnelData.summary.overall_click_rate)}</p>
                <p className="text-[10px] text-muted mt-0.5">{funnelData.summary.total_clicked} clicks</p>
              </div>
              <div className="rounded-lg bg-card border-2 border-success/40 bg-success/5 p-4">
                <p className="text-[10px] uppercase text-success font-bold mb-1">Converteram</p>
                <p className="text-2xl font-bold text-success">{funnelData.summary.total_converted}</p>
                <p className="text-[10px] text-success mt-0.5">{fmtPct(funnelData.summary.overall_conversion_rate)} conversion</p>
              </div>
            </div>

            {/* Per-template table */}
            <div className="rounded-xl bg-card border border-border overflow-hidden">
              <div className="p-5 border-b border-border">
                <p className="text-sm font-semibold">Métricas por email</p>
                <p className="text-[11px] text-muted">Baseline meta: D14 open 40%, click 15%, conversion 3%</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-4 py-2 text-muted font-medium">Email</th>
                      <th className="text-right px-3 py-2 text-muted font-medium">Sent</th>
                      <th className="text-right px-3 py-2 text-muted font-medium">Open</th>
                      <th className="text-right px-3 py-2 text-muted font-medium">Click</th>
                      <th className="text-right px-3 py-2 text-muted font-medium">Checkout</th>
                      <th className="text-right px-3 py-2 text-muted font-medium">Convert</th>
                      <th className="text-right px-3 py-2 text-muted font-medium">Open %</th>
                      <th className="text-right px-3 py-2 text-muted font-medium">CTR %</th>
                      <th className="text-right px-3 py-2 text-muted font-medium">Conv %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {funnelData.per_template.map((t) => (
                      <tr key={t.key}>
                        <td className="px-4 py-2 text-foreground font-medium">{t.label}</td>
                        <td className="px-3 py-2 text-right text-foreground">{t.sent}</td>
                        <td className="px-3 py-2 text-right text-muted-foreground">{t.opened}</td>
                        <td className="px-3 py-2 text-right text-muted-foreground">{t.clicked}</td>
                        <td className="px-3 py-2 text-right text-muted-foreground">{t.checkoutStarted}</td>
                        <td className="px-3 py-2 text-right text-success font-bold">{t.converted}</td>
                        <td className="px-3 py-2 text-right text-muted-foreground">{t.sent > 0 ? fmtPct(t.openRate, 0) : "—"}</td>
                        <td className="px-3 py-2 text-right text-muted-foreground">{t.sent > 0 ? fmtPct(t.clickRate, 0) : "—"}</td>
                        <td className="px-3 py-2 text-right text-foreground font-bold">{t.sent > 0 ? fmtPct(t.conversionRate, 1) : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* B2B trigger summary */}
            <div className="mt-4 rounded-xl bg-card border-l-4 border-accent p-4">
              <p className="text-sm font-semibold text-foreground mb-1">🎯 B2B trigger (últimos 30d)</p>
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">{funnelData.b2b.triggers_sent}</strong> leads qualificados via heurística (heavy Free + sinal corporativo) ·{" "}
                <strong className="text-foreground">{funnelData.b2b.calendly_booked}</strong> agendaram call
              </p>
            </div>
          </section>
        )}

        {/* ========== CHURN (F11) ========== */}
        <section>
          <div className="rounded-xl bg-card border border-border p-5">
            <div className="mb-4">
              <p className="text-sm font-semibold">Churn analysis</p>
              <p className="text-[11px] text-muted">Assinaturas canceladas · lifetime da empresa</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-lg bg-background border border-border p-4">
                <p className="text-[10px] uppercase text-muted mb-1">Logo churn total</p>
                <p className="text-2xl font-bold text-foreground">{data.churn.total_churned}</p>
              </div>
              <div className="rounded-lg bg-background border border-border p-4">
                <p className="text-[10px] uppercase text-muted mb-1">Revenue churn total</p>
                <p className="text-2xl font-bold text-foreground">{fmtMoney(data.churn.revenue_churned)}</p>
              </div>
              <div className="rounded-lg bg-background border border-border p-4">
                <p className="text-[10px] uppercase text-muted mb-1">Churn mensal estimado</p>
                <p className="text-2xl font-bold text-foreground">{fmtPct(ue.estimated_monthly_churn)}</p>
                <p className="text-[10px] text-muted mt-0.5">baseline conservador pré-seed</p>
              </div>
            </div>
            {Object.keys(data.churn.by_month).length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-[10px] uppercase text-muted mb-2">Churn por mês</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(data.churn.by_month).sort().map(([month, count]) => (
                    <div key={month} className="px-2 py-1 rounded bg-danger/10 text-danger text-xs">
                      {month}: {count}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ========== MRR BY TIER (Sprint 2) ========== */}
        <section>
          <div className="rounded-xl bg-card border border-border p-5">
            <div className="mb-4">
              <p className="text-sm font-semibold">MRR por tier</p>
              <p className="text-[11px] text-muted">Breakdown de revenue + ARPU por plano · essencial pra pricing lesson</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {([
                { k: "dev" as const, label: "Dev · R$29/mês", color: "primary" },
                { k: "team" as const, label: "Team · R$79/mês", color: "accent" },
                { k: "enterprise" as const, label: "Enterprise · a definir", color: "warning" },
              ]).map((t) => {
                const tier = data.mrr_by_tier[t.k];
                return (
                  <div key={t.k} className="rounded-lg bg-background border border-border p-4">
                    <p className="text-[10px] uppercase text-muted mb-1">{t.label}</p>
                    <p className="text-2xl font-bold text-foreground">{tier.customers}</p>
                    <p className="text-[11px] text-muted">pagantes · {fmtMoney(tier.mrr)}/mês</p>
                    {tier.customers > 0 && (
                      <p className="text-[10px] text-muted mt-1">ARPU {fmtMoney(tier.arpu)}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========== UNIT ECONOMICS DETALHADO (Sprint 2) ========== */}
        <section>
          <div className="rounded-xl bg-card border border-border p-5">
            <div className="mb-4">
              <p className="text-sm font-semibold">Unit economics · pitch VC</p>
              <p className="text-[11px] text-muted">Payback period + Burn multiple · benchmarks a16z/SaaStr</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-lg bg-background border border-border p-4">
                <p className="text-[10px] uppercase text-muted mb-1">Payback period</p>
                <p className="text-2xl font-bold text-foreground">{ue.payback_period_months.toFixed(1)}mo</p>
                <p className="text-[10px] text-muted mt-0.5">best-in-class &lt;12mo · CAC/ARPU</p>
              </div>
              <div className="rounded-lg bg-background border border-border p-4">
                <p className="text-[10px] uppercase text-muted mb-1">Burn multiple</p>
                <p className="text-2xl font-bold text-foreground">
                  {ue.burn_multiple === null ? "n/a" : ue.burn_multiple.toFixed(1) + "x"}
                </p>
                <p className="text-[10px] text-muted mt-0.5">a16z &lt;1 excelente, &lt;3 bom · Net Burn / Net New MRR</p>
              </div>
              <div className="rounded-lg bg-background border border-border p-4">
                <p className="text-[10px] uppercase text-muted mb-1">LTV : CAC</p>
                <p className="text-2xl font-bold text-foreground">{ue.ltv_cac_ratio.toFixed(1)}x</p>
                <p className="text-[10px] text-muted mt-0.5">best-in-class &gt;5x · LTV R${ue.ltv.toFixed(0)} / CAC R${ue.cac_estimate}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ========== NRR / GRR + LOGO VS REVENUE CHURN (Sprint 4) ========== */}
        <section>
          <div className="rounded-xl bg-card border border-border p-5">
            <div className="mb-4">
              <p className="text-sm font-semibold">Retention adulta · NRR, GRR, Logo vs Revenue churn</p>
              <p className="text-[11px] text-muted">Métricas que todo VC Series A pergunta · hoje insufficient data (precisa 5+ pagantes)</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-lg bg-background border border-border p-4">
                <p className="text-[10px] uppercase text-muted mb-1">NRR 30d</p>
                <p className="text-2xl font-bold text-muted">{data.nrr_grr.nrr_pct === null ? "n/a" : fmtPct(data.nrr_grr.nrr_pct)}</p>
                <p className="text-[10px] text-muted mt-0.5">benchmark &gt;110%</p>
              </div>
              <div className="rounded-lg bg-background border border-border p-4">
                <p className="text-[10px] uppercase text-muted mb-1">GRR 30d</p>
                <p className="text-2xl font-bold text-muted">{data.nrr_grr.grr_pct === null ? "n/a" : fmtPct(data.nrr_grr.grr_pct)}</p>
                <p className="text-[10px] text-muted mt-0.5">benchmark &gt;85%</p>
              </div>
              <div className="rounded-lg bg-background border border-border p-4">
                <p className="text-[10px] uppercase text-muted mb-1">Logo churn 30d</p>
                <p className="text-2xl font-bold text-foreground">{fmtPct(data.logo_vs_revenue_churn.logo_churn_30d_pct)}</p>
                <p className="text-[10px] text-muted mt-0.5">% contas canceladas</p>
              </div>
              <div className="rounded-lg bg-background border border-border p-4">
                <p className="text-[10px] uppercase text-muted mb-1">Revenue churn 30d</p>
                <p className="text-2xl font-bold text-foreground">{fmtPct(data.logo_vs_revenue_churn.revenue_churn_30d_pct)}</p>
                <p className="text-[10px] text-muted mt-0.5">% MRR perdido</p>
              </div>
            </div>
            {data.nrr_grr.status === "insufficient_data_min_5_customers" && (
              <p className="text-[10px] text-muted mt-3 italic">⚠ NRR/GRR requer 5+ pagantes pra sinal útil. Hoje: {data.hero.total_paying}.</p>
            )}
          </div>
        </section>

        {/* ========== SIGNUP SOURCE ATTRIBUTION (Sprint 3) ========== */}
        <section>
          <div className="rounded-xl bg-card border border-border p-5">
            <div className="mb-4">
              <p className="text-sm font-semibold">Signup source attribution (30d)</p>
              <p className="text-[11px] text-muted">De onde vêm os signups · fonte: funnel_events.source_page</p>
            </div>
            {data.signup_source_30d.length === 0 ? (
              <p className="text-xs text-muted italic">Nenhum signup_click com source_page nos últimos 30d.</p>
            ) : (
              <div className="space-y-1">
                {data.signup_source_30d.map((s) => {
                  const max = data.signup_source_30d[0]?.signups || 1;
                  const pct = (s.signups / max) * 100;
                  return (
                    <div key={s.page} className="flex items-center gap-3 text-xs">
                      <span className="font-mono text-[11px] text-muted-foreground w-56 shrink-0 truncate" title={s.page}>{s.page}</span>
                      <div className="flex-1 bg-background rounded h-5 relative overflow-hidden">
                        <div className="absolute inset-y-0 left-0 bg-primary/40" style={{ width: `${pct}%` }} />
                        <span className="absolute inset-0 flex items-center justify-end pr-2 text-[11px] font-bold text-foreground">{s.signups}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ========== TOP LANDING CONVERSION (Sprint 3) ========== */}
        <section>
          <div className="rounded-xl bg-card border border-border p-5">
            <div className="mb-4">
              <p className="text-sm font-semibold">Top landing pages: views × signups (30d)</p>
              <p className="text-[11px] text-muted">Qual landing converte · não só qual traz tráfego</p>
            </div>
            {data.top_landing_conversion.length === 0 ? (
              <p className="text-xs text-muted italic">Sem dados de page_view ainda. Confere whitelist /api/events.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-3 py-2 text-muted">Página</th>
                      <th className="text-right px-3 py-2 text-muted">Views</th>
                      <th className="text-right px-3 py-2 text-muted">Signups</th>
                      <th className="text-right px-3 py-2 text-muted">Conv %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {data.top_landing_conversion.map((l) => (
                      <tr key={l.page}>
                        <td className="px-3 py-2 font-mono text-[11px] text-muted-foreground truncate max-w-xs">{l.page}</td>
                        <td className="px-3 py-2 text-right text-foreground">{l.page_views.toLocaleString("pt-BR")}</td>
                        <td className="px-3 py-2 text-right text-foreground">{l.signups}</td>
                        <td className={`px-3 py-2 text-right font-bold ${l.conversion_pct >= 1 ? "text-success" : l.conversion_pct >= 0.3 ? "text-foreground" : "text-muted"}`}>
                          {l.conversion_pct.toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* ========== ROLLING COHORT 7d (Sprint 4) ========== */}
        <section>
          <div className="rounded-xl bg-card border border-border p-5">
            <div className="mb-4">
              <p className="text-sm font-semibold">Rolling 7-day activation cohort (30 dias)</p>
              <p className="text-[11px] text-muted">% dos signups de cada dia que ativaram em 7 dias · mais sensível que cohort semanal</p>
            </div>
            {(() => {
              const maxSignups = Math.max(1, ...data.rolling_cohort.map((r) => r.signups));
              return (
                <div className="flex items-end gap-0.5 h-32">
                  {data.rolling_cohort.map((r) => {
                    const heightPct = (r.signups / maxSignups) * 100;
                    const activationColor = r.activation_pct >= 15 ? "bg-success" : r.activation_pct >= 5 ? "bg-primary" : "bg-muted-foreground/40";
                    return (
                      <div key={r.cohort_day} className="flex-1 flex flex-col justify-end group relative" title={`${r.cohort_day}: ${r.signups} signups, ${r.activation_pct.toFixed(1)}% ativaram em W1`}>
                        <div className={`${activationColor} rounded-t`} style={{ height: `${heightPct}%` }} />
                        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background px-2 py-1 rounded text-[10px] whitespace-nowrap z-10">
                          {r.cohort_day}: {r.signups}/{r.activation_pct.toFixed(0)}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
            <div className="flex items-center gap-4 mt-3 text-[10px] text-muted">
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-success inline-block" /> ≥15% ativaram</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-primary inline-block" /> 5-15% ativaram</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-muted-foreground/40 inline-block" /> &lt;5%</span>
            </div>
          </div>
        </section>

        {/* ========== FOOTER ========== */}
        <section className="pt-8 border-t border-border">
          <p className="text-[10px] text-muted text-center">
            FakeForge · Métricas geradas em {new Date(data.generated_at).toLocaleString("pt-BR")} · Dados em tempo real
          </p>
        </section>
      </main>
    </div>
  );
}

// -----------------------------------------------------------
// Sub-components
// -----------------------------------------------------------

function HeroCard({ label, value, delta, subtitle, accent }: {
  label: string;
  value: string;
  delta: { text: string; color: string };
  subtitle?: string;
  accent: "primary" | "accent" | "success" | "warning" | "danger";
}) {
  const accentClasses = {
    primary: "border-primary/30 bg-primary/5",
    accent: "border-accent/30 bg-accent/5",
    success: "border-success/30 bg-success/5",
    warning: "border-accent/40 bg-accent/10",
    danger: "border-danger/30 bg-danger/5",
  };
  return (
    <div className={`rounded-xl border-2 ${accentClasses[accent]} p-4`}>
      <div className="flex items-start justify-between mb-2">
        <p className="text-[10px] uppercase tracking-wider text-muted font-bold">{label}</p>
        <span className={`text-[10px] font-medium ${delta.color}`}>{delta.text}</span>
      </div>
      <p className="text-2xl font-bold text-foreground leading-tight">{value}</p>
      {subtitle && <p className="text-[10px] text-muted mt-1">{subtitle}</p>}
    </div>
  );
}

function BarChart({ data, unit = "", color = "primary" }: {
  data: Array<{ label: string; value: number; extra: string }>;
  unit?: string;
  color?: "primary" | "accent" | "success";
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const colorClass = { primary: "bg-primary", accent: "bg-accent", success: "bg-success" }[color];

  return (
    <div className="space-y-2">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="text-[10px] text-muted w-14 shrink-0 font-mono">{d.label}</span>
          <div className="flex-1 bg-background rounded h-6 relative overflow-hidden">
            <div className={`h-full ${colorClass} rounded transition-all`} style={{ width: `${(d.value / max) * 100}%` }} />
            <div className="absolute inset-0 flex items-center px-2 justify-between">
              <span className="text-[10px] font-bold text-foreground">{unit}{d.value.toLocaleString()}</span>
              {d.extra && <span className="text-[9px] text-muted">{d.extra}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function LineChart({ data, color = "primary" }: {
  data: Array<{ label: string; value: number }>;
  color?: "primary" | "accent" | "success";
}) {
  if (data.length === 0) return <p className="text-xs text-muted text-center py-8">Sem dados</p>;
  const max = Math.max(...data.map((d) => d.value), 1);
  const min = Math.min(...data.map((d) => d.value), 0);
  const range = max - min || 1;

  const width = 700;
  const height = 180;
  const padding = 20;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1 || 1)) * (width - 2 * padding);
    const y = height - padding - ((d.value - min) / range) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(" ");

  const strokeColor = { primary: "#a855f7", accent: "#f59e0b", success: "#10b981" }[color];

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40" preserveAspectRatio="xMidYMid meet">
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          points={points}
        />
        {data.length > 0 && (
          <>
            <text x={padding} y={15} className="text-[9px] fill-muted">{max.toLocaleString()}</text>
            <text x={padding} y={height - 5} className="text-[9px] fill-muted">{min.toLocaleString()}</text>
            <text x={width - padding - 30} y={height - 5} className="text-[9px] fill-muted">{data[data.length - 1]?.label}</text>
          </>
        )}
      </svg>
    </div>
  );
}

function FunnelWaterfall({ funnel }: { funnel: Funnel }) {
  const stages = [
    { label: "Visitantes anônimos (180d)", count: funnel.visitors_180d, pct: 100, isFirst: true },
    { label: "Signups", count: funnel.signups, pct: funnel.conversion.visitor_to_signup },
    { label: "Com API key", count: funnel.with_api_key, pct: funnel.conversion.signup_to_key * (funnel.conversion.visitor_to_signup / 100) },
    { label: "Ativados (≥1 chamada)", count: funnel.activated, pct: funnel.conversion.key_to_activated * (funnel.conversion.signup_to_key / 100) * (funnel.conversion.visitor_to_signup / 100) },
    { label: "Pagantes", count: funnel.paying, pct: funnel.conversion.end_to_end },
  ];

  const max = stages[0].count || 1;

  return (
    <div className="space-y-2">
      {stages.map((s, i) => {
        const width = Math.max(15, (s.count / max) * 100);
        const dropoff = i > 0 ? stages[i - 1].count - s.count : 0;
        const stageRate = i > 0 && stages[i - 1].count ? (s.count / stages[i - 1].count) * 100 : 100;

        return (
          <div key={s.label}>
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-foreground font-medium">{s.label}</span>
              <span className="text-muted">
                <span className="font-bold text-foreground">{s.count.toLocaleString()}</span>
                {i > 0 && <span className="ml-2">({fmtPct(stageRate)} da etapa anterior)</span>}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-8 bg-background rounded overflow-hidden">
                <div
                  className={`h-full ${
                    stageRate < 10 ? "bg-danger/70" :
                    stageRate < 30 ? "bg-accent/70" :
                    "bg-primary/70"
                  }`}
                  style={{ width: `${width}%` }}
                />
              </div>
              {i > 0 && dropoff > 0 && (
                <span className="text-[10px] text-danger whitespace-nowrap">
                  ↓ {dropoff.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        );
      })}
      <div className="pt-3 mt-3 border-t border-border">
        <p className="text-[11px] text-muted">
          Taxa end-to-end (visitante → pagante): <span className="font-bold text-foreground">{fmtPct(funnel.conversion.end_to_end, 3)}</span>
        </p>
      </div>
    </div>
  );
}

function CohortTable({ rows }: { rows: CohortRow[] }) {
  if (rows.length === 0) return <p className="text-xs text-muted text-center py-8">Sem dados ainda</p>;

  function cellColor(pct: number): string {
    if (pct === 0) return "bg-background text-muted";
    if (pct >= 40) return "bg-success/30 text-success font-bold";
    if (pct >= 25) return "bg-success/15 text-success";
    if (pct >= 15) return "bg-accent/15 text-accent";
    if (pct >= 5) return "bg-danger/10 text-danger";
    return "bg-danger/25 text-danger";
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left px-4 py-2 text-muted font-medium">Cohort</th>
            <th className="text-right px-3 py-2 text-muted font-medium">Signups</th>
            <th className="text-center px-3 py-2 text-muted font-medium">W1</th>
            <th className="text-center px-3 py-2 text-muted font-medium">W4</th>
            <th className="text-center px-3 py-2 text-muted font-medium">W8</th>
            <th className="text-center px-3 py-2 text-muted font-medium">W12</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((r) => (
            <tr key={r.week}>
              <td className="px-4 py-2 font-mono text-[11px] text-muted-foreground">{r.week}</td>
              <td className="px-3 py-2 text-right text-foreground">{r.total}</td>
              <td className={`px-3 py-2 text-center ${cellColor(r.w1_pct)}`}>{r.w1_pct.toFixed(0)}%</td>
              <td className={`px-3 py-2 text-center ${cellColor(r.w4_pct)}`}>{r.w4_pct.toFixed(0)}%</td>
              <td className={`px-3 py-2 text-center ${cellColor(r.w8_pct)}`}>{r.w8_pct.toFixed(0)}%</td>
              <td className={`px-3 py-2 text-center ${cellColor(r.w12_pct)}`}>{r.w12_pct.toFixed(0)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BenchmarksTable({ benchmarks }: { benchmarks: Benchmarks }) {
  const rows = [
    { key: "activation_rate", label: "Activation rate (signup → 1ª call)" },
    { key: "signup_to_key", label: "Signup → API key created" },
    { key: "key_to_activated", label: "API key → activated" },
    { key: "activated_to_paying", label: "Activated → paying" },
    { key: "monthly_churn", label: "Monthly churn" },
    { key: "ltv_cac_ratio", label: "LTV : CAC ratio" },
    { key: "time_to_first_call_p50", label: "Time to first call (p50)" },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left px-4 py-2 text-muted font-medium">Métrica</th>
            <th className="text-right px-3 py-2 text-muted font-medium">Você</th>
            <th className="text-right px-3 py-2 text-muted font-medium">Benchmark</th>
            <th className="text-right px-3 py-2 text-muted font-medium">Best-in-class</th>
            <th className="text-center px-3 py-2 text-muted font-medium">Gap</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row) => {
            const b = benchmarks[row.key];
            if (!b) return null;
            const isLowerBetter = b.lower_is_better;
            const meetsBenchmark = isLowerBetter ? b.current <= b.benchmark : b.current >= b.benchmark;
            const meetsBestInClass = isLowerBetter ? b.current <= b.best_in_class : b.current >= b.best_in_class;
            const gap = isLowerBetter ? b.benchmark - b.current : b.current - b.benchmark;

            return (
              <tr key={row.key}>
                <td className="px-4 py-2 text-foreground">{row.label}</td>
                <td className="px-3 py-2 text-right font-bold text-foreground">{b.current.toFixed(1)}{b.unit}</td>
                <td className="px-3 py-2 text-right text-muted">{b.benchmark}{b.unit}</td>
                <td className="px-3 py-2 text-right text-muted">{b.best_in_class}{b.unit}</td>
                <td className="px-3 py-2 text-center">
                  {meetsBestInClass && <span className="text-success">🏆 top</span>}
                  {!meetsBestInClass && meetsBenchmark && <span className="text-primary">✓ ok</span>}
                  {!meetsBenchmark && <span className="text-danger">↓ {Math.abs(gap).toFixed(1)}{b.unit}</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
