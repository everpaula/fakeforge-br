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
  const [
    metrics,
    usageByType,
    usersDaily,
    apiDaily,
    subscribers,
    anon1d,
    anon7d,
    anon30d,
    anonRecent,
  ] = await Promise.all([
    admin.from("admin_metrics").select("*").single(),
    admin.from("admin_usage_by_type").select("*"),
    admin.from("admin_users_daily").select("*"),
    admin.from("admin_api_daily").select("*"),
    admin.from("admin_subscribers").select("*"),
    admin.from("anonymous_usage").select("client_type, ip_hash, quantity").gte("created_at", since1d),
    admin.from("anonymous_usage").select("client_type, ip_hash, quantity").gte("created_at", since7d),
    admin.from("anonymous_usage").select("client_type, ip_hash, data_type, quantity, created_at").gte("created_at", since30d),
    admin.from("anonymous_usage").select("client_type, data_type, quantity, created_at").gte("created_at", since30d).order("created_at", { ascending: false }).limit(2000),
  ]);

  // Aggregate anonymous metrics
  const anonRows = (anon30d.data || []) as Array<{ client_type: string; ip_hash: string; data_type: string; quantity: number; created_at: string }>;
  const rows1d = (anon1d.data || []) as Array<{ client_type: string; ip_hash: string; quantity: number }>;
  const rows7d = (anon7d.data || []) as Array<{ client_type: string; ip_hash: string; quantity: number }>;

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

  // Daily timeline (14 days)
  const recent = (anonRecent.data || []) as Array<{ client_type: string; data_type: string; quantity: number; created_at: string }>;
  const dailyMap: Record<string, { calls: number; items: number }> = {};
  for (const r of recent) {
    const day = r.created_at.slice(0, 10);
    if (!dailyMap[day]) dailyMap[day] = { calls: 0, items: 0 };
    dailyMap[day].calls++;
    dailyMap[day].items += r.quantity;
  }
  const anonDaily = Object.entries(dailyMap)
    .map(([day, v]) => ({ day, total_calls: v.calls, total_items: v.items }))
    .sort((a, b) => b.day.localeCompare(a.day))
    .slice(0, 14);

  return NextResponse.json({
    metrics: metrics.data,
    usageByType: usageByType.data || [],
    usersDaily: usersDaily.data || [],
    apiDaily: apiDaily.data || [],
    subscribers: subscribers.data || [],
    anon,
    anonByType,
    anonDaily,
  });
}
