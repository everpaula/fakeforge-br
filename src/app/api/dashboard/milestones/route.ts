import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// Milestones do dashboard. Hoje só existe o streak de 5 dias seguidos.
//
// Equivalente SQL (dias distintos em America/Sao_Paulo, últimos 7 dias):
//
//   SELECT DISTINCT (created_at AT TIME ZONE 'America/Sao_Paulo')::date AS day
//   FROM api_usage
//   WHERE user_id = $1 AND created_at > NOW() - INTERVAL '7 days';
//
// Diferença do COUNT(*) puro: aqui contamos dias CONSECUTIVOS terminando hoje
// ou ontem. 5 dias espalhados em 7 não são "5 dias seguidos", e o copy do card
// promete isso. Começar a contar de ontem evita esconder o card de quem ainda
// não usou hoje (o card aparece no início da sessão).
//
// Dia calendário = BRT (UTC-3 fixo, sem horário de verão desde 2019).

export const dynamic = "force-dynamic";

const BRT_OFFSET_MS = 3 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const STREAK_TARGET = 5;

// Índice do dia calendário BRT desde a época Unix
function brtDayIndex(ms: number): number {
  return Math.floor((ms - BRT_OFFSET_MS) / DAY_MS);
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

  // Plano primeiro: pagante não precisa da query
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
  // 8 dias de margem: a janela de 7 dias em BRT pode começar no meio do dia
  const since = new Date(now - 8 * DAY_MS).toISOString();

  // Free tem teto de 50 chamadas/dia, então 8 dias cabem em 1 página
  const { data, error } = await admin
    .from("api_usage")
    .select("created_at")
    .eq("user_id", user.id)
    .gt("created_at", since)
    .order("created_at", { ascending: false })
    .limit(1000);

  if (error) {
    console.error("[api/dashboard/milestones] query error:", error.message);
    return NextResponse.json({ error: "query_failed" }, { status: 500 });
  }

  const days = new Set<number>();
  for (const r of data || []) {
    days.add(brtDayIndex(new Date(r.created_at as string).getTime()));
  }

  const today = brtDayIndex(now);
  let cursor = days.has(today) ? today : today - 1;
  let streak = 0;
  while (days.has(cursor)) {
    streak++;
    cursor--;
  }

  return NextResponse.json({
    authenticated: true,
    plan,
    streak_days: streak,
    streak5_achieved: streak >= STREAK_TARGET,
  });
}
