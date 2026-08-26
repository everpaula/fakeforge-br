import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/**
 * Retorna dados pra decidir se mostra o FirstCallActivation callout
 * na pagina atual do user logado. Chamado pelo <ActivationCallout />
 * que fica no PageShell (renderiza em todas paginas com layout padrao).
 *
 * Lógica:
 * - Anon: {should_show:false}
 * - Logged in + tem >=1 API key ativa + 0 uso hoje: {should_show:true, first_key}
 * - Logged in + tem uso hoje: {should_show:false} (ja ativou)
 * - Logged in + zero keys: {should_show:false, needs_key:true}
 *   (user precisa criar key primeiro, fica pro dashboard)
 */
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
  if (!user) return NextResponse.json({ should_show: false });

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Uso hoje (fuso BS)
  const startOfDayBs = new Date();
  startOfDayBs.setHours(0, 0, 0, 0);
  const { count: usageCount } = await admin
    .from("api_usage")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", startOfDayBs.toISOString());

  if ((usageCount || 0) > 0) {
    return NextResponse.json({ should_show: false, activated: true });
  }

  // Primeira API key ativa
  const { data: keys } = await admin
    .from("api_keys")
    .select("key")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: true })
    .limit(1);

  if (!keys || keys.length === 0) {
    return NextResponse.json({ should_show: false, needs_key: true });
  }

  return NextResponse.json({
    should_show: true,
    first_key: keys[0].key,
  });
}
