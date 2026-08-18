import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { PLAN_LIMITS } from "@/lib/rate-limit";

// Retorna uso do dia + limite do plano pro user autenticado.
// Usado pelo QuotaMeter no dashboard e header.
//
// Anônimo: retorna null (não temos user_id pra medir).

function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
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
    return NextResponse.json({ authenticated: false });
  }

  const admin = getAdminSupabase();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const startIso = startOfDay.toISOString();

  // Busca plano do user
  const { data: sub } = await admin
    .from("subscriptions")
    .select("plan, status")
    .eq("user_id", user.id)
    .in("status", ["active", "trialing"])
    .single();

  const plan = (sub?.plan as string) || "free";
  const dailyLimit = PLAN_LIMITS[plan] || PLAN_LIMITS.free;

  // Conta chamadas do user hoje
  const { count } = await admin
    .from("api_usage")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", startIso);

  const used = count || 0;
  const remaining = Math.max(0, dailyLimit - used);
  const percent = dailyLimit > 0 ? Math.min(100, Math.round((used / dailyLimit) * 100)) : 0;

  return NextResponse.json({
    authenticated: true,
    plan,
    used_today: used,
    daily_limit: dailyLimit,
    remaining,
    percent,
    reset_at: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000).toISOString(),
  });
}
