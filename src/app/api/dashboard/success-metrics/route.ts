import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { PLAN_LIMITS } from "@/lib/rate-limit";

// Métricas de valor extraído pro <SuccessMetricCard> do dashboard.
//
// Equivalente SQL (o supabase-js não expõe FILTER, então agregamos em JS
// sobre as linhas do usuário):
//
//   SELECT COUNT(*) AS calls_30d,
//          SUM(quantity) AS items_30d,
//          COUNT(*) FILTER (WHERE created_at >= <início do dia em BRT>) AS calls_today
//   FROM api_usage
//   WHERE user_id = $1 AND created_at > NOW() - INTERVAL '30 days';
//
// "Hoje" = dia calendário em America/Sao_Paulo (UTC-3 fixo, sem horário de
// verão desde 2019). CURRENT_DATE do Postgres seria UTC e viraria o dia às
// 21h no Brasil.

export const dynamic = "force-dynamic";

const BRT_OFFSET_MS = 3 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const PAGE_SIZE = 1000; // teto de linhas por request do PostgREST
const MAX_PAGES = 5;
const MIN_CALLS_TO_PROJECT = 5; // abaixo disso o ritmo é ruído

interface UsageRow {
  quantity: number | null;
  created_at: string;
}

function startOfDayBrt(now: number): number {
  return Math.floor((now - BRT_OFFSET_MS) / DAY_MS) * DAY_MS + BRT_OFFSET_MS;
}

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() { /* read-only */ },
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Plano primeiro: pagante não precisa da query pesada
  const { data: sub } = await admin
    .from("subscriptions")
    .select("plan")
    .eq("user_id", user.id)
    .in("status", ["active", "trialing"])
    .maybeSingle();
  const plan = (sub?.plan as string) || "free";

  if (plan !== "free") {
    return NextResponse.json({ authenticated: true, plan });
  }

  const now = Date.now();
  const since30d = new Date(now - 30 * DAY_MS).toISOString();
  const dayStart = startOfDayBrt(now);

  const rows: UsageRow[] = [];
  for (let page = 0; page < MAX_PAGES; page++) {
    const { data, error } = await admin
      .from("api_usage")
      .select("quantity, created_at")
      .eq("user_id", user.id)
      .gt("created_at", since30d)
      .order("created_at", { ascending: true })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
    if (error) {
      console.error("[api/dashboard/success-metrics] query error:", error.message);
      return NextResponse.json({ error: "query_failed" }, { status: 500 });
    }
    rows.push(...((data || []) as UsageRow[]));
    if (!data || data.length < PAGE_SIZE) break;
  }

  let itemsTotal = 0;
  let callsToday = 0;
  for (const r of rows) {
    itemsTotal += r.quantity || 0;
    if (new Date(r.created_at).getTime() >= dayStart) callsToday++;
  }

  const dailyLimit = PLAN_LIMITS.free;
  const hoursSaved = Math.round(itemsTotal * 0.001 * 10) / 10;

  // Projeção: ritmo médio desde 00:00 BRT até agora. Só projeta se já há
  // amostra mínima e o limite ainda não foi atingido.
  let blocksTodayAt: string | null = null;
  const limitReachedToday = callsToday >= dailyLimit;
  if (!limitReachedToday && callsToday >= MIN_CALLS_TO_PROJECT) {
    const hoursElapsed = (now - dayStart) / (60 * 60 * 1000);
    if (hoursElapsed > 0) {
      const callsPerHour = callsToday / hoursElapsed;
      const hitAt = dayStart + (dailyLimit / callsPerHour) * 60 * 60 * 1000;
      if (hitAt > now && hitAt < dayStart + DAY_MS) {
        blocksTodayAt = new Date(hitAt).toISOString();
      }
    }
  }

  return NextResponse.json({
    authenticated: true,
    plan,
    calls_30d: rows.length,
    items_30d: itemsTotal,
    calls_today: callsToday,
    daily_limit: dailyLimit,
    hours_saved: hoursSaved,
    limit_reached_today: limitReachedToday,
    blocks_today_at: blocksTodayAt,
  });
}
