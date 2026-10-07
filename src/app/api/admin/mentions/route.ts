import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// GET /api/admin/mentions?status=pending → lista brand mentions
// POST /api/admin/mentions com action=create_outreach → cria draft "pedir backlink"
// POST /api/admin/mentions com action=ignore → marca como ignored

export const dynamic = "force-dynamic";

function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function getAuthenticatedUser() {
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

async function requireAdmin() {
  const user = await getAuthenticatedUser();
  if (!user) return { error: NextResponse.json({ error: "unauthenticated" }, { status: 401 }) };
  const admin = getAdminSupabase();
  const { data: isAdmin } = await admin.from("admins").select("id").eq("user_id", user.id).single();
  if (!isAdmin) return { error: NextResponse.json({ error: "forbidden" }, { status: 403 }) };
  return { user, admin };
}

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  const { admin } = auth;

  const url = new URL(request.url);
  const status = url.searchParams.get("status") || "pending";

  const { data } = await admin
    .from("brand_mentions")
    .select("*")
    .eq("status", status)
    .order("found_at", { ascending: false })
    .limit(100);

  const { data: counts } = await admin.from("brand_mentions").select("status");
  const statusCounts: Record<string, number> = {};
  for (const row of counts || []) {
    statusCounts[row.status] = (statusCounts[row.status] || 0) + 1;
  }

  return NextResponse.json({ mentions: data || [], counts: statusCounts });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  const { user, admin } = auth;

  const body = await request.json().catch(() => null);
  const { mention_id, action } = body || {};
  if (!mention_id || !action) {
    return NextResponse.json({ error: "missing mention_id or action" }, { status: 400 });
  }

  const { data: mention } = await admin.from("brand_mentions").select("*").eq("id", mention_id).single();
  if (!mention) return NextResponse.json({ error: "mention not found" }, { status: 404 });

  if (action === "ignore") {
    await admin.from("brand_mentions")
      .update({ status: "ignored", reviewed_at: new Date().toISOString(), reviewed_by: user.id })
      .eq("id", mention_id);
    return NextResponse.json({ ok: true, action: "ignored" });
  }

  if (action === "create_outreach") {
    // Gera um draft de outreach "pedir backlink" automaticamente
    const subject = `Oi — vi que você mencionou FakeForge no "${(mention.title || "").slice(0, 60)}"`;
    const bodyText = `Oi,

Everton aqui, criador do FakeForge BR.

Vi que você mencionou FakeForge em ${mention.url} — valeu pela menção!

Reparei que não tem link direto pro site. Se fizer sentido, agradeceria se pudesse adicionar o link https://fakeforge.com.br quando mencionar — ajuda outros devs a encontrar.

Sem pressão. Se não couber no contexto, de boa.

Abraço,
Everton
fakeforge.com.br`;

    const { data: draft, error } = await admin.from("outreach_drafts").insert({
      recipient_email: "unknown@placeholder.com", // precisa editar antes de enviar
      recipient_name: null,
      recipient_site: mention.url,
      recipient_context: `Mencionou FakeForge em: ${mention.title || mention.url}. Snippet: ${mention.snippet || ""}`,
      campaign: "mention_backlink_request",
      subject,
      body_text: bodyText,
      rationale: `Mention detectada via ${mention.source}. User precisa editar o recipient_email antes de aprovar (geralmente achando contato no site mencionado).`,
      priority: 6,
      researched_by: "mention_scanner",
      status: "pending",
    }).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await admin.from("brand_mentions")
      .update({ status: "action_taken", outreach_draft_id: draft.id, reviewed_at: new Date().toISOString(), reviewed_by: user.id })
      .eq("id", mention_id);

    return NextResponse.json({ ok: true, action: "created_outreach", draft_id: draft.id });
  }

  return NextResponse.json({ error: `unknown action: ${action}` }, { status: 400 });
}
