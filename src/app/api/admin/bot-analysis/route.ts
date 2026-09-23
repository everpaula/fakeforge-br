import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/**
 * Sprint 7 P2: análise heurística de bot signups.
 *
 * Aplica score de 0-5 pra cada user baseado em sinais:
 *   +2 email termina em 4+ dígitos aleatórios seguidos
 *   +1 domínio de gmail/outlook/yahoo + numeric ending
 *   +1 zero API calls apesar de ter key ativa
 *   +1 signup há <7 dias sem confirmar
 *   +1 last_sign_in nunca (só confirmou email, nunca logou)
 *
 * Score 3+ = provável bot.
 * Score 4+ = alta confiança.
 * Score 5 = definitivo.
 *
 * Retorna: total, breakdown por score, sample de emails suspeitos,
 * activation rate excluindo bots (>= score 3).
 */

export const dynamic = "force-dynamic";

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

/**
 * Heurística de bot signup baseada em padrões observados no audit 22/09.
 * Exemplos flagados: janeteterezinhamoreira11@gmail.com, mello367263@gmail.com,
 * senarobson039@gmail.com, netuno361@gmail.com, canvacod66@gmail.com.
 * Padrão: nome + string de 2-6 dígitos aleatórios sem sentido semântico.
 */
function scoreBot(user: {
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  confirmed: boolean;
  api_call_count: number;
  has_active_key: boolean;
}): number {
  let score = 0;
  const email = (user.email || "").toLowerCase();
  const localPart = email.split("@")[0] || "";
  const domain = email.split("@")[1] || "";

  // Regra 1: local part termina em 4+ dígitos consecutivos (bem forte pra bot)
  if (/\d{4,}$/.test(localPart)) score += 2;
  // Regra 2: local part termina em 2-3 dígitos + domain grátis (moderado)
  else if (/\d{2,3}$/.test(localPart) && ["gmail.com", "outlook.com", "yahoo.com", "hotmail.com"].includes(domain)) {
    score += 1;
  }

  // Regra 3: tem key ativa mas 0 chamadas API
  if (user.has_active_key && user.api_call_count === 0) score += 1;

  // Regra 4: signup < 7 dias E não confirmou (bot geralmente não confirma)
  const ageHours = (Date.now() - new Date(user.created_at).getTime()) / (3600 * 1000);
  if (ageHours < 7 * 24 && !user.confirmed) score += 1;

  // Regra 5: nunca logou apesar de ter confirmado (bot só confirma pra pegar key)
  if (user.confirmed && !user.last_sign_in_at) score += 1;

  return Math.min(5, score);
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

  // 1) Fetch all users (paginated)
  const users: Array<{ id: string; email: string; created_at: string; last_sign_in_at: string | null; confirmed: boolean }> = [];
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 100 });
    if (error) break;
    const batch = data?.users || [];
    for (const u of batch) {
      users.push({
        id: u.id,
        email: u.email || "",
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at || null,
        confirmed: !!(u.email_confirmed_at || u.confirmed_at),
      });
    }
    if (batch.length < 100) break;
  }

  // 2) Get users with active keys
  const { data: keys } = await admin
    .from("api_keys")
    .select("user_id")
    .eq("is_active", true)
    .range(0, 9999);
  const usersWithKey = new Set((keys || []).map((k) => k.user_id));

  // 3) Get user call counts
  const callsByUser: Record<string, number> = {};
  {
    let offset = 0;
    for (let i = 0; i < 100; i++) {
      const { data } = await admin
        .from("api_usage")
        .select("user_id, quantity")
        .not("user_id", "is", null)
        .range(offset, offset + 999);
      const batch = (data || []) as Array<{ user_id: string; quantity: number }>;
      for (const row of batch) {
        callsByUser[row.user_id] = (callsByUser[row.user_id] || 0) + (row.quantity || 1);
      }
      if (batch.length < 1000) break;
      offset += 1000;
    }
  }

  // 4) Score each user
  const scored = users.map((u) => ({
    ...u,
    api_call_count: callsByUser[u.id] || 0,
    has_active_key: usersWithKey.has(u.id),
    bot_score: scoreBot({
      email: u.email,
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at,
      confirmed: u.confirmed,
      api_call_count: callsByUser[u.id] || 0,
      has_active_key: usersWithKey.has(u.id),
    }),
  }));

  // 5) Aggregate
  const totalUsers = scored.length;
  const byScore: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const s of scored) byScore[s.bot_score]++;

  const suspiciousBots = scored.filter((s) => s.bot_score >= 3);
  const highConfidenceBots = scored.filter((s) => s.bot_score >= 4);
  const realUsers = scored.filter((s) => s.bot_score < 3);
  const realUsersActivated = realUsers.filter((s) => s.api_call_count > 0).length;

  // Sample de 10 bots suspeitos (mais recentes)
  const sample = suspiciousBots
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 15)
    .map((s) => ({
      email: s.email,
      created_at: s.created_at,
      score: s.bot_score,
      has_key: s.has_active_key,
      calls: s.api_call_count,
    }));

  return NextResponse.json(
    {
      generated_at: new Date().toISOString(),
      total_users: totalUsers,
      bot_analysis: {
        suspicious_bots_count: suspiciousBots.length, // score >= 3
        high_confidence_bots_count: highConfidenceBots.length, // score >= 4
        suspicious_pct: totalUsers ? Math.round((suspiciousBots.length / totalUsers) * 100) : 0,
        real_users_count: realUsers.length,
      },
      score_breakdown: byScore,
      activation: {
        raw_activation_rate_pct: totalUsers ? Math.round((scored.filter((s) => s.api_call_count > 0).length / totalUsers) * 100 * 10) / 10 : 0,
        real_activation_rate_pct: realUsers.length ? Math.round((realUsersActivated / realUsers.length) * 100 * 10) / 10 : 0,
        real_users_activated: realUsersActivated,
        real_users_total: realUsers.length,
      },
      recent_bot_samples: sample,
      heuristic_notes: [
        "+2: email termina em 4+ dígitos consecutivos",
        "+1: 2-3 dígitos + gmail/outlook/yahoo/hotmail",
        "+1: tem key ativa mas 0 chamadas API",
        "+1: signup <7d sem confirmar email",
        "+1: confirmou email mas nunca logou",
        "Score >= 3 = provável bot",
      ],
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
