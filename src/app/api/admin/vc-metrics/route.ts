import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// Sprint 4 — VC-ready metrics endpoint.
// Retorna: hero KPIs, MRR trend, signups trend, funnel, cohort retention,
// time-to-first-call, benchmarks, forecast, power users, churn.

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function getAuthenticatedUser(request: NextRequest) {
  void request;
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        },
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

interface UserRecord { id: string; created_at: string; email?: string }
interface ApiUsageRecord { user_id: string | null; created_at: string; quantity: number }
interface SubscriberRecord { plan: string; status: string; created_at: string; current_period_end: string | null }

// Buckets a datetime into a YYYY-MM-DD string in UTC (dashboard reads pt-BR but
// bucketing by UTC keeps cohorts stable regardless of viewer TZ).
function dayKey(iso: string): string {
  return iso.substring(0, 10);
}

function weekKey(iso: string): string {
  const d = new Date(iso);
  const year = d.getUTCFullYear();
  const jan1 = new Date(Date.UTC(year, 0, 1));
  const days = Math.floor((d.getTime() - jan1.getTime()) / 86400000);
  const week = Math.ceil((days + jan1.getUTCDay() + 1) / 7);
  return `${year}-W${String(week).padStart(2, "0")}`;
}

function monthKey(iso: string): string {
  return iso.substring(0, 7);
}

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const admin = getAdminSupabase();
  const { data: isAdmin } = await admin
    .from("admins")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!isAdmin) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  // -----------------------------------------------------------------
  // Data fetching (paginated)
  // -----------------------------------------------------------------

  // 1) All users
  const users: UserRecord[] = [];
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 100 });
    if (error) break;
    const batch = data?.users || [];
    for (const u of batch) users.push({ id: u.id, created_at: u.created_at, email: u.email });
    if (batch.length < 100) break;
  }

  // 2) All API usage (last 180 days)
  const since180 = new Date(Date.now() - 180 * 86400000).toISOString();
  const apiUsage: ApiUsageRecord[] = [];
  {
    let offset = 0;
    for (let i = 0; i < 100; i++) {
      const { data, error } = await admin
        .from("api_usage")
        .select("user_id, created_at, quantity")
        .gte("created_at", since180)
        .order("created_at", { ascending: true })
        .range(offset, offset + 999);
      if (error) break;
      const batch = data || [];
      apiUsage.push(...batch as ApiUsageRecord[]);
      if (batch.length < 1000) break;
      offset += 1000;
    }
  }

  // 3) API keys (só count)
  const { count: totalKeysCount } = await admin
    .from("api_keys")
    .select("*", { count: "exact", head: true });

  const { data: allKeys } = await admin
    .from("api_keys")
    .select("user_id")
    .range(0, 9999);
  const userIdsWithKey = new Set((allKeys || []).map((k) => k.user_id));

  // 4) Subscribers
  const { data: subscribers } = await admin
    .from("subscriptions")
    .select("plan, status, created_at, current_period_end")
    .range(0, 999);
  const subs = (subscribers || []) as SubscriberRecord[];
  const activeSubs = subs.filter((s) => s.status === "active");

  // 5) Anonymous usage (past 180d, aggregated per day)
  const anonDailyMap: Record<string, number> = {};
  {
    let offset = 0;
    for (let i = 0; i < 50; i++) {
      const { data, error } = await admin
        .from("anonymous_usage")
        .select("created_at, quantity")
        .gte("created_at", since180)
        .range(offset, offset + 999);
      if (error) break;
      const batch = data || [];
      for (const row of batch as Array<{ created_at: string; quantity: number }>) {
        const k = dayKey(row.created_at);
        anonDailyMap[k] = (anonDailyMap[k] || 0) + (row.quantity || 1);
      }
      if (batch.length < 1000) break;
      offset += 1000;
    }
  }

  // 6) Anonymous unique visitors (proxy for traffic — hashes distinct IPs)
  const { data: anonUniqueRaw } = await admin
    .from("anonymous_usage")
    .select("ip_hash")
    .gte("created_at", since180)
    .range(0, 49999);
  const uniqueAnonHashes = new Set((anonUniqueRaw || []).map((r) => (r as { ip_hash: string }).ip_hash));

  // -----------------------------------------------------------------
  // Computations
  // -----------------------------------------------------------------

  // ---- Hero KPIs ----
  const totalUsers = users.length;
  const usersWithKeyCount = userIdsWithKey.size;

  // Users que fizeram calls (activated)
  const usersActivatedSet = new Set<string>();
  for (const row of apiUsage) {
    if (row.user_id) usersActivatedSet.add(row.user_id);
  }
  const usersActivated = usersActivatedSet.size;
  const activationRate = totalUsers ? (usersActivated / totalUsers) * 100 : 0;

  // WAAC: Weekly Active API Callers — usuários com >=1 chamada nos últimos 7 dias
  const since7d = Date.now() - 7 * 86400000;
  const waacSet = new Set<string>();
  for (const row of apiUsage) {
    if (row.user_id && new Date(row.created_at).getTime() >= since7d) {
      waacSet.add(row.user_id);
    }
  }
  const waac = waacSet.size;

  // MRR breakdown
  const planPrice: Record<string, number> = { dev: 29, team: 79 };
  let mrr = 0;
  let payingDev = 0;
  let payingTeam = 0;
  for (const s of activeSubs) {
    mrr += planPrice[s.plan] || 0;
    if (s.plan === "dev") payingDev++;
    else if (s.plan === "team") payingTeam++;
  }
  const totalPaying = payingDev + payingTeam;

  // ---- MRR history (by month, last 6 months) ----
  const mrrHistory: Array<{ month: string; mrr: number; new_customers: number; churned: number }> = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const monthDate = new Date(now.getUTCFullYear(), now.getUTCMonth() - i, 1);
    const monthEnd = new Date(now.getUTCFullYear(), now.getUTCMonth() - i + 1, 1);
    const monthStr = `${monthDate.getUTCFullYear()}-${String(monthDate.getUTCMonth() + 1).padStart(2, "0")}`;

    // MRR at end of month: sum of prices of subs active at that date
    let periodMrr = 0;
    let newCust = 0;
    let churned = 0;
    for (const s of subs) {
      const started = new Date(s.created_at);
      const ends = s.current_period_end ? new Date(s.current_period_end) : null;

      const wasActiveEndOfMonth =
        started < monthEnd &&
        (s.status === "active" || (ends && ends > monthEnd));

      if (wasActiveEndOfMonth) {
        periodMrr += planPrice[s.plan] || 0;
      }
      if (started >= monthDate && started < monthEnd) newCust++;
      if (ends && ends >= monthDate && ends < monthEnd && s.status !== "active") churned++;
    }

    mrrHistory.push({ month: monthStr, mrr: periodMrr, new_customers: newCust, churned });
  }

  // ---- Signups trend (daily, last 90d) ----
  const signupsDailyMap: Record<string, number> = {};
  for (const u of users) {
    const k = dayKey(u.created_at);
    signupsDailyMap[k] = (signupsDailyMap[k] || 0) + 1;
  }
  const signupsDaily: Array<{ day: string; signups: number; cumulative: number }> = [];
  const sortedDays = Object.keys(signupsDailyMap).sort();
  let cumulative = 0;
  for (const day of sortedDays) {
    cumulative += signupsDailyMap[day];
    signupsDaily.push({ day, signups: signupsDailyMap[day], cumulative });
  }

  // ---- Funnel ----
  const funnel = {
    visitors_180d: uniqueAnonHashes.size,
    signups: totalUsers,
    with_api_key: usersWithKeyCount,
    activated: usersActivated,
    paying: totalPaying,
    conversion: {
      visitor_to_signup: uniqueAnonHashes.size ? (totalUsers / uniqueAnonHashes.size) * 100 : 0,
      signup_to_key: totalUsers ? (usersWithKeyCount / totalUsers) * 100 : 0,
      key_to_activated: usersWithKeyCount ? (usersActivated / usersWithKeyCount) * 100 : 0,
      activated_to_paying: usersActivated ? (totalPaying / usersActivated) * 100 : 0,
      end_to_end: uniqueAnonHashes.size ? (totalPaying / uniqueAnonHashes.size) * 100 : 0,
    },
  };

  // ---- Cohort retention (by signup week) ----
  // Rows: signup week (last 12), Cols: W1, W4, W8, W12 retention
  const cohortMap: Record<string, { total: number; retained: Record<number, Set<string>> }> = {};

  for (const u of users) {
    const cohortWeek = weekKey(u.created_at);
    if (!cohortMap[cohortWeek]) {
      cohortMap[cohortWeek] = { total: 0, retained: { 1: new Set(), 4: new Set(), 8: new Set(), 12: new Set() } };
    }
    cohortMap[cohortWeek].total++;
  }

  // For each api_usage row, figure out user's cohort week + how many weeks post-signup
  const userCohortWeek: Record<string, string> = {};
  const userSignupDate: Record<string, number> = {};
  for (const u of users) {
    userCohortWeek[u.id] = weekKey(u.created_at);
    userSignupDate[u.id] = new Date(u.created_at).getTime();
  }

  for (const row of apiUsage) {
    if (!row.user_id) continue;
    const cohort = userCohortWeek[row.user_id];
    const signupMs = userSignupDate[row.user_id];
    if (!cohort || !signupMs) continue;
    const daysSince = Math.floor((new Date(row.created_at).getTime() - signupMs) / 86400000);
    const weeksSince = Math.floor(daysSince / 7) + 1; // 1-indexed
    if (weeksSince <= 0) continue;
    for (const marker of [1, 4, 8, 12]) {
      if (weeksSince >= marker) {
        cohortMap[cohort].retained[marker].add(row.user_id);
      }
    }
  }

  const cohortWeeksSorted = Object.keys(cohortMap).sort().slice(-12); // last 12 weeks
  const cohortTable = cohortWeeksSorted.map((week) => {
    const c = cohortMap[week];
    return {
      week,
      total: c.total,
      w1_pct: c.total ? (c.retained[1].size / c.total) * 100 : 0,
      w4_pct: c.total ? (c.retained[4].size / c.total) * 100 : 0,
      w8_pct: c.total ? (c.retained[8].size / c.total) * 100 : 0,
      w12_pct: c.total ? (c.retained[12].size / c.total) * 100 : 0,
    };
  });

  // ---- Time to first call ----
  const firstCallByUser: Record<string, number> = {};
  for (const row of apiUsage) {
    if (!row.user_id) continue;
    const t = new Date(row.created_at).getTime();
    if (firstCallByUser[row.user_id] === undefined || t < firstCallByUser[row.user_id]) {
      firstCallByUser[row.user_id] = t;
    }
  }

  const deltasMinutes: number[] = [];
  for (const [uid, firstMs] of Object.entries(firstCallByUser)) {
    const signupMs = userSignupDate[uid];
    if (!signupMs) continue;
    const deltaMin = (firstMs - signupMs) / 60000;
    if (deltaMin >= 0) deltasMinutes.push(deltaMin);
  }

  const sortedDeltas = [...deltasMinutes].sort((a, b) => a - b);
  function pct(p: number): number {
    if (!sortedDeltas.length) return 0;
    return sortedDeltas[Math.floor(sortedDeltas.length * p)] || 0;
  }
  const timeToFirstCall = {
    sample_size: deltasMinutes.length,
    p50_min: pct(0.5),
    p75_min: pct(0.75),
    p90_min: pct(0.9),
    mean_min: deltasMinutes.length ? deltasMinutes.reduce((a, b) => a + b, 0) / deltasMinutes.length : 0,
    // Histogram buckets: <1min, 1-5min, 5-30min, 30min-1h, 1h-1d, 1-7d, >7d
    histogram: [
      { bucket: "<1min", count: 0 },
      { bucket: "1-5min", count: 0 },
      { bucket: "5-30min", count: 0 },
      { bucket: "30min-1h", count: 0 },
      { bucket: "1h-1d", count: 0 },
      { bucket: "1-7d", count: 0 },
      { bucket: ">7d", count: 0 },
    ] as Array<{ bucket: string; count: number }>,
  };
  for (const d of deltasMinutes) {
    if (d < 1) timeToFirstCall.histogram[0].count++;
    else if (d < 5) timeToFirstCall.histogram[1].count++;
    else if (d < 30) timeToFirstCall.histogram[2].count++;
    else if (d < 60) timeToFirstCall.histogram[3].count++;
    else if (d < 1440) timeToFirstCall.histogram[4].count++;
    else if (d < 10080) timeToFirstCall.histogram[5].count++;
    else timeToFirstCall.histogram[6].count++;
  }

  // ---- Unit economics (estimated) ----
  // LTV: se ARPU = R$29 e churn mensal estimado = 5%, LTV = 29 / 0.05 = R$580
  // CAC: FakeForge é organic-driven (SEO), CAC estimado = R$5-15 por signup
  // Vamos usar valores conservadores.
  const estimatedChurnMonthly = 0.08; // 8% mensal (conservador pra dev tools bootstrapped)
  const arpu = totalPaying ? mrr / totalPaying : 29;
  const ltv = arpu / estimatedChurnMonthly;
  const cacEstimate = 10; // R$10 por signup (SEO organic, servidor + tempo)
  const ltvCacRatio = cacEstimate > 0 ? ltv / cacEstimate : 0;

  // ---- MoM growth ----
  const currentMonthKey = monthKey(new Date().toISOString());
  const lastMonthDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
  const lastMonthKey = monthKey(lastMonthDate.toISOString());

  const usersCurrentMonth = users.filter((u) => monthKey(u.created_at) === currentMonthKey).length;
  const usersLastMonth = users.filter((u) => monthKey(u.created_at) === lastMonthKey).length;
  const signupsMoM = usersLastMonth ? ((usersCurrentMonth - usersLastMonth) / usersLastMonth) * 100 : 0;

  const currentMrr = mrrHistory[mrrHistory.length - 1]?.mrr || 0;
  const previousMrr = mrrHistory[mrrHistory.length - 2]?.mrr || 0;
  const mrrMoM = previousMrr ? ((currentMrr - previousMrr) / previousMrr) * 100 : 0;

  // ---- Benchmarks (industry standards for dev tools SaaS pre-seed) ----
  const benchmarks = {
    activation_rate: { current: activationRate, benchmark: 15, best_in_class: 30, unit: "%" },
    signup_to_key: { current: funnel.conversion.signup_to_key, benchmark: 95, best_in_class: 99, unit: "%" },
    key_to_activated: { current: funnel.conversion.key_to_activated, benchmark: 25, best_in_class: 50, unit: "%" },
    activated_to_paying: { current: funnel.conversion.activated_to_paying, benchmark: 5, best_in_class: 15, unit: "%" },
    monthly_churn: { current: estimatedChurnMonthly * 100, benchmark: 5, best_in_class: 2, unit: "%", lower_is_better: true },
    ltv_cac_ratio: { current: ltvCacRatio, benchmark: 3, best_in_class: 5, unit: "x" },
    time_to_first_call_p50: { current: timeToFirstCall.p50_min, benchmark: 30, best_in_class: 5, unit: "min", lower_is_better: true },
  };

  // ---- MRR Forecast (linear projection next 6 months) ----
  const mrrForecast: Array<{ month: string; mrr_projected: number }> = [];
  if (mrrHistory.length >= 2) {
    const values = mrrHistory.map((m) => m.mrr);
    const n = values.length;
    const xMean = (n - 1) / 2;
    const yMean = values.reduce((a, b) => a + b, 0) / n;
    let num = 0, den = 0;
    for (let i = 0; i < n; i++) {
      num += (i - xMean) * (values[i] - yMean);
      den += (i - xMean) ** 2;
    }
    const slope = den ? num / den : 0;
    const intercept = yMean - slope * xMean;

    for (let i = 1; i <= 6; i++) {
      const futureDate = new Date(now.getUTCFullYear(), now.getUTCMonth() + i, 1);
      const futureKey = `${futureDate.getUTCFullYear()}-${String(futureDate.getUTCMonth() + 1).padStart(2, "0")}`;
      const projected = Math.max(0, intercept + slope * (n - 1 + i));
      mrrForecast.push({ month: futureKey, mrr_projected: Math.round(projected) });
    }
  }

  // ---- Power users (top 10% em API calls) ----
  const callsByUser: Record<string, number> = {};
  for (const row of apiUsage) {
    if (row.user_id) callsByUser[row.user_id] = (callsByUser[row.user_id] || 0) + (row.quantity || 1);
  }
  const sortedByUsage = Object.entries(callsByUser)
    .sort((a, b) => b[1] - a[1]);
  const top10Count = Math.max(1, Math.ceil(sortedByUsage.length * 0.1));
  const emailByUserId: Record<string, string> = {};
  for (const u of users) emailByUserId[u.id] = u.email || "";

  const powerUsers = sortedByUsage.slice(0, top10Count).map(([uid, count]) => ({
    user_id: uid.slice(0, 8) + "..." + uid.slice(-4),
    email: emailByUserId[uid] || "—",
    calls: count,
  }));

  // ---- Churn analysis ----
  const churnedSubs = subs.filter((s) => s.status !== "active" && s.current_period_end);
  const churn = {
    total_churned: churnedSubs.length,
    revenue_churned: churnedSubs.reduce((acc, s) => acc + (planPrice[s.plan] || 0), 0),
    by_month: {} as Record<string, number>,
  };
  for (const s of churnedSubs) {
    if (s.current_period_end) {
      const k = monthKey(s.current_period_end);
      churn.by_month[k] = (churn.by_month[k] || 0) + 1;
    }
  }

  // -----------------------------------------------------------------
  // Response
  // -----------------------------------------------------------------
  return NextResponse.json(
    {
      generated_at: new Date().toISOString(),
      hero: {
        mrr: currentMrr,
        mrr_mom_pct: mrrMoM,
        signups_current_month: usersCurrentMonth,
        signups_mom_pct: signupsMoM,
        waac,
        total_users: totalUsers,
        total_paying: totalPaying,
        activation_rate: activationRate,
        ltv_cac_ratio: ltvCacRatio,
        arpu,
      },
      unit_economics: {
        ltv,
        cac_estimate: cacEstimate,
        ltv_cac_ratio: ltvCacRatio,
        arpu,
        estimated_monthly_churn: estimatedChurnMonthly * 100,
        payback_months: arpu > 0 ? cacEstimate / arpu : 0,
      },
      mrr_history: mrrHistory,
      mrr_forecast: mrrForecast,
      signups_daily: signupsDaily.slice(-90), // last 90 days
      funnel,
      cohort_table: cohortTable,
      time_to_first_call: timeToFirstCall,
      benchmarks,
      power_users: powerUsers,
      churn,
      // Raw counts for verification
      _counts: {
        total_users: totalUsers,
        total_api_usage_rows: apiUsage.length,
        total_keys: totalKeysCount,
        unique_anon_visitors: uniqueAnonHashes.size,
      },
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
