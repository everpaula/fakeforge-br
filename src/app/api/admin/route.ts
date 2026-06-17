import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Paginate through anonymous_usage in 1000-row batches until exhausted.
 * Supabase PostgREST enforces a server-side max of 1000 rows per response
 * even when no `.limit()` is set, so simple selects silently truncate the
 * 30-day window once we cross that threshold (visible as the dashboard
 * "geracoes" counter sticking at 1000).
 */
async function fetchAllAnon<T = Record<string, unknown>>(
  adminClient: ReturnType<typeof getAdminSupabase>,
  selectFields: string,
  sinceIso: string,
): Promise<T[]> {
  const PAGE = 1000;
  const out: T[] = [];
  let offset = 0;
  // Hard ceiling to avoid runaway loops if something is wrong upstream.
  // 50 pages = 50_000 rows = generous headroom for the 30-day window.
  for (let i = 0; i < 50; i++) {
    const { data, error } = await adminClient
      .from("anonymous_usage")
      .select(selectFields)
      .gte("created_at", sinceIso)
      .order("created_at", { ascending: false })
      .range(offset, offset + PAGE - 1);
    if (error) {
      console.error("[fetchAllAnon] page", i, "error:", error.message);
      break;
    }
    const batch = (data || []) as T[];
    out.push(...batch);
    if (batch.length < PAGE) break;
    offset += PAGE;
  }
  return out;
}

async function getAuthenticatedUser(request: NextRequest) {
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

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  // Check if user is admin
  const admin = getAdminSupabase();
  const { data: isAdmin } = await admin
    .from("admins")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!isAdmin) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const now = new Date();
  const since1d = new Date(now.getTime() - 24 * 3600 * 1000).toISOString();
  const since7d = new Date(now.getTime() - 7 * 24 * 3600 * 1000).toISOString();
  const since30d = new Date(now.getTime() - 30 * 24 * 3600 * 1000).toISOString();

  // Fetch all metrics in parallel
  // anon1d / anon7d / anon30d use paginated fetches because Supabase PostgREST
  // caps single-call results at 1000 rows. The previous direct selects were
  // silently truncating the 30-day window, causing the dashboard counter to
  // stick at exactly 1.000 geracoes.
  const [
    metrics,
    usageByType,
    usersDaily,
    apiDaily,
    anonDailyRaw,
    subscribers,
    anon1d,
    anon7d,
    anon30d,
    recentUsersData,
  ] = await Promise.all([
    admin.from("admin_metrics").select("*").single(),
    admin.from("admin_usage_by_type").select("*"),
    admin.from("admin_users_daily_90d").select("*"),
    admin.from("admin_api_daily_90d").select("*"),
    admin.from("admin_anon_daily_90d").select("*"),
    admin.from("admin_subscribers").select("*"),
    fetchAllAnon<{ client_type: string; ip_hash: string; quantity: number }>(
      admin, "client_type, ip_hash, quantity", since1d,
    ),
    fetchAllAnon<{ client_type: string; ip_hash: string; quantity: number }>(
      admin, "client_type, ip_hash, quantity", since7d,
    ),
    fetchAllAnon<{ client_type: string; ip_hash: string; data_type: string; quantity: number; created_at: string }>(
      admin, "client_type, ip_hash, data_type, quantity, created_at", since30d,
    ),
    admin.auth.admin.listUsers({ page: 1, perPage: 30 }),
  ]);

  // Recent users — list of last 30 sign-ups with email + created_at + last_sign_in
  const recentUsers = (recentUsersData.data?.users || []).map(u => ({
    id: u.id,
    email: u.email || "(sem email)",
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at,
    provider: u.app_metadata?.provider || "email",
    confirmed: !!u.email_confirmed_at || !!u.confirmed_at,
  })).sort((a, b) => b.created_at.localeCompare(a.created_at));

  // Aggregate anonymous metrics
  // fetchAllAnon returns the rows array directly (no .data wrapper).
  const anonRows = anon30d;
  const rows1d = anon1d;
  const rows7d = anon7d;

  const aggCount = (rows: Array<{ client_type: string; quantity: number }>) => {
    let web = 0, api = 0, items = 0;
    for (const r of rows) {
      if (r.client_type === "web") web++;
      else api++;
      items += r.quantity;
    }
    return { web, api, total: web + api, items };
  };
  const uniqueIps = (rows: Array<{ ip_hash: string }>) => new Set(rows.map(r => r.ip_hash)).size;

  const anon = {
    today: { ...aggCount(rows1d), unique_visitors: uniqueIps(rows1d) },
    last_7d: { ...aggCount(rows7d), unique_visitors: uniqueIps(rows7d) },
    last_30d: { ...aggCount(anonRows), unique_visitors: uniqueIps(anonRows) },
  };

  // Group by data_type (30d)
  const byType: Record<string, { calls: number; items: number; ips: Set<string>; web: number; api: number }> = {};
  for (const r of anonRows) {
    const k = r.data_type;
    if (!byType[k]) byType[k] = { calls: 0, items: 0, ips: new Set(), web: 0, api: 0 };
    byType[k].calls++;
    byType[k].items += r.quantity;
    byType[k].ips.add(r.ip_hash);
    if (r.client_type === "web") byType[k].web++;
    else byType[k].api++;
  }
  const anonByType = Object.entries(byType)
    .map(([data_type, v]) => ({ data_type, total_calls: v.calls, total_items: v.items, unique_visitors: v.ips.size, web: v.web, api: v.api }))
    .sort((a, b) => b.total_calls - a.total_calls)
    .slice(0, 20);

  // Daily timeline comes directly from admin_anon_daily_90d view (preaggregated).
  // Normalize: the view's day comes as Date|string, we stringify; total_calls
  // and total_items come as bigint string from Postgres COUNT/SUM, cast to number.
  const anonDaily = (anonDailyRaw.data || []).map((r: { day: string | Date; total_calls: number | string; total_items: number | string }) => ({
    day: typeof r.day === "string" ? r.day : new Date(r.day).toISOString().slice(0, 10),
    total_calls: Number(r.total_calls) || 0,
    total_items: Number(r.total_items) || 0,
  }));

  return NextResponse.json({
    metrics: metrics.data,
    usageByType: usageByType.data || [],
    usersDaily: usersDaily.data || [],
    apiDaily: apiDaily.data || [],
    subscribers: subscribers.data || [],
    anon,
    anonByType,
    anonDaily,
    recentUsers,
  });
}
