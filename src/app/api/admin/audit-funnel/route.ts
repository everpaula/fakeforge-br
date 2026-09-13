import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// Sprint 3 T4: audit funil signup -> primeira chamada API
// Objetivo: descobrir onde 227 users viram 13 keys ativas.
// Investiga: users sem key, users com key mas 0 chamadas, tempo medio ate 1a chamada.

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

  // --- 1. Total users (auth.users) - paginate pra pegar todos
  //     Supabase listUsers max perPage = 1000 mas comportamento inconsistente
  //     em versoes mais antigas do SDK. Paginamos manualmente ate esgotar.
  const usersWithMeta: Array<{ id: string; created_at: string; email?: string }> = [];
  for (let page = 1; page <= 20; page++) {
    const { data: usersList, error } = await admin.auth.admin.listUsers({ page, perPage: 100 });
    if (error) {
      console.error("[audit-funnel] listUsers page", page, "error:", error.message);
      break;
    }
    const batch = usersList?.users || [];
    for (const u of batch) {
      usersWithMeta.push({ id: u.id, created_at: u.created_at, email: u.email });
    }
    if (batch.length < 100) break;
  }
  const totalUsers = usersWithMeta.length;

  // --- 2. Users com API key (deveria ser 100% pos-migration 013)
  const { data: allKeys } = await admin
    .from("api_keys")
    .select("user_id, created_at")
    .range(0, 9999);
  const usersWithKeyIds = new Set((allKeys || []).map((k) => k.user_id));
  const totalKeys = allKeys?.length || 0;

  // --- 3. Users com chamada API (algum registro em api_usage)
  //     Paginar porque api_usage pode ter muito registro
  const usersWithCallIds = new Set<string>();
  {
    let offset = 0;
    for (let i = 0; i < 50; i++) {
      const { data, error } = await admin
        .from("api_usage")
        .select("user_id")
        .not("user_id", "is", null)
        .range(offset, offset + 999);
      if (error) break;
      const batch = data || [];
      for (const row of batch) {
        if (row.user_id) usersWithCallIds.add(row.user_id);
      }
      if (batch.length < 1000) break;
      offset += 1000;
    }
  }

  // --- 4. Tempo entre signup e 1a chamada
  //     Pega o min(created_at) de api_usage por user_id, cross com auth.users.created_at
  const firstCallByUser = new Map<string, string>();
  {
    let offset = 0;
    for (let i = 0; i < 50; i++) {
      const { data, error } = await admin
        .from("api_usage")
        .select("user_id, created_at")
        .not("user_id", "is", null)
        .order("created_at", { ascending: true })
        .range(offset, offset + 999);
      if (error) break;
      const batch = data || [];
      for (const row of batch) {
        if (row.user_id && !firstCallByUser.has(row.user_id)) {
          firstCallByUser.set(row.user_id, row.created_at);
        }
      }
      if (batch.length < 1000) break;
      offset += 1000;
    }
  }

  // --- 5. Landings mais vistas por users que NUNCA chamaram
  //     Cruza funnel_events (source_page) com users que nao chamaram
  const usersNoCall = usersWithMeta
    .filter((u) => !usersWithCallIds.has(u.id))
    .map((u) => u.id);

  const noCallPageCounts: Record<string, number> = {};
  if (usersNoCall.length > 0) {
    let offset = 0;
    for (let i = 0; i < 50; i++) {
      const { data, error } = await admin
        .from("funnel_events")
        .select("source_page, event_data")
        .in("event_data->>user_id", usersNoCall.slice(0, 500)) // Supabase in() limit
        .not("source_page", "is", null)
        .range(offset, offset + 999);
      if (error) break;
      const batch = data || [];
      for (const row of batch) {
        const page = (row as { source_page: string }).source_page;
        if (page) noCallPageCounts[page] = (noCallPageCounts[page] || 0) + 1;
      }
      if (batch.length < 1000) break;
      offset += 1000;
    }
  }

  const topPagesNoCall = Object.entries(noCallPageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([page, count]) => ({ page, count }));

  // --- 6. Compute deltas
  const deltas: number[] = [];
  for (const u of usersWithMeta) {
    const first = firstCallByUser.get(u.id);
    if (first && u.created_at) {
      const deltaMs = new Date(first).getTime() - new Date(u.created_at).getTime();
      if (deltaMs >= 0) deltas.push(deltaMs);
    }
  }

  const deltaSorted = [...deltas].sort((a, b) => a - b);
  const p50 = deltaSorted[Math.floor(deltaSorted.length * 0.5)] || 0;
  const p90 = deltaSorted[Math.floor(deltaSorted.length * 0.9)] || 0;
  const mean = deltas.length ? deltas.reduce((a, b) => a + b, 0) / deltas.length : 0;

  function fmt(ms: number): string {
    const s = Math.round(ms / 1000);
    if (s < 60) return `${s}s`;
    if (s < 3600) return `${Math.round(s / 60)}min`;
    if (s < 86400) return `${(s / 3600).toFixed(1)}h`;
    return `${(s / 86400).toFixed(1)}d`;
  }

  return NextResponse.json({
    generated_at: new Date().toISOString(),
    summary: {
      total_users: totalUsers,
      users_with_api_key: usersWithKeyIds.size,
      users_with_api_key_pct: totalUsers ? Math.round((usersWithKeyIds.size / totalUsers) * 100) : 0,
      total_api_keys: totalKeys,
      users_that_made_call: usersWithCallIds.size,
      users_that_made_call_pct: totalUsers ? Math.round((usersWithCallIds.size / totalUsers) * 100) : 0,
      users_signed_up_but_zero_calls: totalUsers - usersWithCallIds.size,
      users_signed_up_but_zero_calls_pct: totalUsers ? Math.round(((totalUsers - usersWithCallIds.size) / totalUsers) * 100) : 0,
    },
    time_to_first_call: {
      sample_size: deltas.length,
      p50: fmt(p50),
      p90: fmt(p90),
      mean: fmt(mean),
      p50_ms: p50,
      p90_ms: p90,
      mean_ms: Math.round(mean),
    },
    top_landings_users_no_call: topPagesNoCall,
    diagnosis: {
      has_key_gap: usersWithKeyIds.size < totalUsers,
      has_activation_gap: usersWithCallIds.size < usersWithKeyIds.size,
      key_creation_working: usersWithKeyIds.size >= totalUsers * 0.95,
      activation_rate_healthy: (usersWithCallIds.size / totalUsers) >= 0.1,
    },
  }, { headers: { "Cache-Control": "no-store" } });
}
