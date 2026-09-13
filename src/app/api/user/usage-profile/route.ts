import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// Retorna perfil de uso agregado do user autenticado (ultimos 30 dias).
// Usado pelo <UsageProfileCard> no dashboard pra personalizar copy de upsell.
//
// Response shape:
// {
//   authenticated: true,
//   has_signal: boolean,           // >= 5 chamadas nos ultimos 30d
//   profile_tag: string,           // heavy_cpf | diverse | preset_user | occasional
//   total_calls_30d: number,
//   total_items_30d: number,
//   top_types: [{data_type, calls, items}]
// }

export const dynamic = "force-dynamic";

interface UsageRow {
  data_type: string;
  quantity: number;
}

function classifyProfile(topTypes: Array<{ data_type: string; calls: number; items: number }>, totalCalls: number): string {
  if (totalCalls < 5) return "occasional";

  const top = topTypes[0];
  const topShare = top ? top.calls / totalCalls : 0;

  // Preset detection: preset:customer, preset:employee, etc
  const usesPreset = topTypes.some((t) => t.data_type.startsWith("preset:"));
  if (usesPreset) return "preset_user";

  // Concentrado em 1 tipo (>=60% do uso)
  if (topShare >= 0.6) return `heavy_${top.data_type}`;

  // Diverso: 3+ tipos com >=15% de share cada
  const diverseTypes = topTypes.filter((t) => t.calls / totalCalls >= 0.15);
  if (diverseTypes.length >= 3) return "diverse";

  return "occasional";
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
  if (!user) return NextResponse.json({ authenticated: false });

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const since30d = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();

  // Puxa uso por data_type
  const { data: usageRows } = await admin
    .from("api_usage")
    .select("data_type, quantity")
    .eq("user_id", user.id)
    .gte("created_at", since30d);

  const rows = (usageRows || []) as UsageRow[];
  const totalCalls = rows.length;
  const totalItems = rows.reduce((sum, r) => sum + (r.quantity || 0), 0);

  // Agrupa por data_type
  const byType: Record<string, { calls: number; items: number }> = {};
  for (const r of rows) {
    if (!byType[r.data_type]) byType[r.data_type] = { calls: 0, items: 0 };
    byType[r.data_type].calls++;
    byType[r.data_type].items += r.quantity || 0;
  }

  const topTypes = Object.entries(byType)
    .map(([data_type, v]) => ({ data_type, calls: v.calls, items: v.items }))
    .sort((a, b) => b.calls - a.calls)
    .slice(0, 5);

  const profileTag = classifyProfile(topTypes, totalCalls);

  return NextResponse.json({
    authenticated: true,
    has_signal: totalCalls >= 5,
    profile_tag: profileTag,
    total_calls_30d: totalCalls,
    total_items_30d: totalItems,
    top_types: topTypes,
  });
}
