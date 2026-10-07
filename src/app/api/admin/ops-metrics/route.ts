import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// Ops-focused metrics: infra costs, SDK adoption, community signals.
// Alimenta o Admin Dashboard (não o VC dashboard). Separado pra cache diferente
// e pra isolar fontes externas (npm, pypi, github) que podem falhar.

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Hardcoded monthly cost snapshot. Atualiza quando mudar o plan de alguma
// ferramenta. Fonte: faturas reais 2026-10.
const INFRA_COSTS_BRL = {
  vercel_pro: 100,          // $20 * 5 câmbio
  supabase_pro: 125,        // $25 * 5
  resend: 100,              // $20 * 5 (plano Pro quando passar de 3k/dia free)
  ubersuggest: 60,          // ~$12/mês
  stripe_fees_estimate: 20, // 3.99% de ~R$500 MRR projetado
  domain_yearly_amortized: 4, // R$40/ano / 12
};

async function getAuthenticatedUser(_request: NextRequest) {
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

function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// npm registry devolve weekly/monthly downloads sem autenticação.
// Doc: https://github.com/npm/registry/blob/main/docs/download-counts.md
async function fetchNpmDownloads(pkg: string) {
  try {
    const [last7, last30, lastMonth] = await Promise.all([
      fetch(`https://api.npmjs.org/downloads/point/last-week/${pkg}`, { next: { revalidate: 3600 } }),
      fetch(`https://api.npmjs.org/downloads/point/last-month/${pkg}`, { next: { revalidate: 3600 } }),
      fetch(`https://api.npmjs.org/downloads/range/last-month/${pkg}`, { next: { revalidate: 3600 } }),
    ]);
    const w = last7.ok ? await last7.json() : null;
    const m = last30.ok ? await last30.json() : null;
    const range = lastMonth.ok ? await lastMonth.json() : null;
    return {
      last_week: w?.downloads ?? 0,
      last_month: m?.downloads ?? 0,
      daily_last_30d: range?.downloads ?? [],
    };
  } catch {
    return { last_week: 0, last_month: 0, daily_last_30d: [], error: "fetch_failed" };
  }
}

// PyPI stats não têm endpoint público de downloads por package. A fonte
// canônica é BigQuery (pypi-public-data.pypi.file_downloads), mas isso exige
// GCP auth. Pypistats.org expõe uma API free e sem auth que agrega esse dado.
async function fetchPypiDownloads(pkg: string) {
  try {
    const [recent, overall] = await Promise.all([
      fetch(`https://pypistats.org/api/packages/${pkg}/recent`, { next: { revalidate: 3600 } }),
      fetch(`https://pypistats.org/api/packages/${pkg}/overall?mirrors=false`, { next: { revalidate: 3600 } }),
    ]);
    const r = recent.ok ? await recent.json() : null;
    const o = overall.ok ? await overall.json() : null;
    return {
      last_day: r?.data?.last_day ?? 0,
      last_week: r?.data?.last_week ?? 0,
      last_month: r?.data?.last_month ?? 0,
      total: Array.isArray(o?.data) ? o.data.reduce((a: number, b: { downloads: number }) => a + b.downloads, 0) : 0,
    };
  } catch {
    return { last_day: 0, last_week: 0, last_month: 0, total: 0, error: "fetch_failed" };
  }
}

async function fetchGithubStats(owner: string, repo: string) {
  try {
    const r = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    });
    if (!r.ok) return { error: `github_${r.status}` };
    const d = await r.json();
    return {
      stars: d.stargazers_count ?? 0,
      forks: d.forks_count ?? 0,
      watchers: d.subscribers_count ?? 0,
      open_issues: d.open_issues_count ?? 0,
      pushed_at: d.pushed_at,
    };
  } catch {
    return { error: "fetch_failed" };
  }
}

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const admin = getAdminSupabase();
  const { data: isAdmin } = await admin
    .from("admins").select("id").eq("user_id", user.id).single();
  if (!isAdmin) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  // Burn rate: soma dos custos fixos. Trackeado em BRL pra alinhamento com MRR.
  const monthly_burn = Object.values(INFRA_COSTS_BRL).reduce((a, b) => a + b, 0);

  // Suppression growth (7d)
  const since7d = new Date(Date.now() - 7 * 86400000).toISOString();
  const since14d = new Date(Date.now() - 14 * 86400000).toISOString();
  const { count: suppressions_total } = await admin
    .from("email_suppressions")
    .select("*", { count: "exact", head: true });
  const { count: suppressions_7d } = await admin
    .from("email_suppressions")
    .select("*", { count: "exact", head: true })
    .gte("created_at", since7d);
  const { count: suppressions_prev7d } = await admin
    .from("email_suppressions")
    .select("*", { count: "exact", head: true })
    .gte("created_at", since14d)
    .lt("created_at", since7d);

  // Bot block trend (7d) via funnel_events
  const { data: botBlockRows } = await admin
    .from("funnel_events")
    .select("event_type, created_at")
    .in("event_type", ["signup_blocked_bot", "signup_blocked_honeypot", "signup_blocked_invalid_format", "signup_blocked_disposable"])
    .gte("created_at", since14d)
    .range(0, 9999);
  const botBlockDaily: Record<string, number> = {};
  for (const r of botBlockRows || []) {
    const day = r.created_at.substring(0, 10);
    botBlockDaily[day] = (botBlockDaily[day] || 0) + 1;
  }
  const botBlockTrend = Object.entries(botBlockDaily)
    .map(([day, count]) => ({ day, count }))
    .sort((a, b) => a.day.localeCompare(b.day));

  // Top power users by quota utilization (last 7d)
  const { data: usageRows } = await admin
    .from("api_usage")
    .select("user_id, quantity, created_at")
    .gte("created_at", since7d)
    .range(0, 9999);
  const usageByUser: Record<string, number> = {};
  for (const r of (usageRows || []) as Array<{ user_id: string; quantity: number }>) {
    if (!r.user_id) continue;
    usageByUser[r.user_id] = (usageByUser[r.user_id] || 0) + (r.quantity || 1);
  }
  const topUsers = Object.entries(usageByUser)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([uid, calls]) => ({ user_id: uid.slice(0, 8) + "..." + uid.slice(-4), calls }));

  // External: SDK downloads + GitHub stars (3 fetches em paralelo)
  const [npm, pypi, github] = await Promise.all([
    fetchNpmDownloads("fakeforge-br"),
    fetchPypiDownloads("fakeforge-br"),
    fetchGithubStats("everpaula", "fakeforge-br"),
  ]);

  return NextResponse.json(
    {
      generated_at: new Date().toISOString(),
      burn: {
        monthly_total_brl: monthly_burn,
        breakdown: INFRA_COSTS_BRL,
      },
      email_health: {
        suppressions_total: suppressions_total ?? 0,
        suppressions_7d: suppressions_7d ?? 0,
        suppressions_prev7d: suppressions_prev7d ?? 0,
        wow_delta: (suppressions_7d ?? 0) - (suppressions_prev7d ?? 0),
      },
      bot_block: {
        total_14d: (botBlockRows || []).length,
        trend_daily: botBlockTrend,
      },
      quota_utilization: {
        top_users_7d: topUsers,
      },
      sdk: {
        npm: { package: "fakeforge-br", ...npm },
        pypi: { package: "fakeforge-br", ...pypi },
      },
      github: {
        repo: "everpaula/fakeforge-br",
        ...github,
      },
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
