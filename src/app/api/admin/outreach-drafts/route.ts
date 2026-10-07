import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getResend } from "@/lib/resend";
import { getSuppressedUserIds } from "@/lib/email-suppression";

// GET  /api/admin/outreach-drafts         → lista drafts (filtra por status)
// POST /api/admin/outreach-drafts/approve → aprova + envia via Resend
// PATCH /api/admin/outreach-drafts        → edita draft antes de aprovar
// POST /api/admin/outreach-drafts/reject  → marca como rejected
//
// Workflow: Claude cria drafts com status='pending'. User revisa no admin
// dashboard, aprova 1-clique. Approval dispara Resend send + grava sent_at.

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
  const limit = Math.min(100, Number(url.searchParams.get("limit")) || 50);

  const { data, error } = await admin
    .from("outreach_drafts")
    .select("*")
    .eq("status", status)
    .order("priority", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Também devolve contagem por status pra UI mostrar badges
  const { data: counts } = await admin
    .from("outreach_drafts")
    .select("status");
  const statusCounts: Record<string, number> = {};
  for (const row of counts || []) {
    statusCounts[row.status] = (statusCounts[row.status] || 0) + 1;
  }

  return NextResponse.json({ drafts: data, counts: statusCounts });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  const { user, admin } = auth;

  const body = await request.json().catch(() => null);
  const action = body?.action;
  const draftId = body?.draft_id;

  if (!action || !draftId) {
    return NextResponse.json({ error: "missing action or draft_id" }, { status: 400 });
  }

  const { data: draft, error: fetchErr } = await admin
    .from("outreach_drafts")
    .select("*")
    .eq("id", draftId)
    .single();

  if (fetchErr || !draft) {
    return NextResponse.json({ error: "draft not found" }, { status: 404 });
  }

  if (action === "reject") {
    await admin.from("outreach_drafts")
      .update({ status: "rejected", approved_by: user.id })
      .eq("id", draftId);
    return NextResponse.json({ ok: true, action: "rejected" });
  }

  if (action === "approve") {
    if (draft.status !== "pending") {
      return NextResponse.json({ error: `cannot approve draft in status ${draft.status}` }, { status: 400 });
    }

    // Suppression check (não manda pra email já bouncado/complained)
    // getSuppressedUserIds espera {id, email}, usamos recipient_email como id fake.
    const suppressed = await getSuppressedUserIds(admin, [{ id: `outreach-${draft.id}`, email: draft.recipient_email }]);
    if (suppressed.size > 0) {
      await admin.from("outreach_drafts")
        .update({ status: "failed", metadata: { ...(draft.metadata || {}), skip_reason: "suppressed" }, approved_by: user.id, approved_at: new Date().toISOString() })
        .eq("id", draftId);
      return NextResponse.json({ error: "recipient suppressed", skipped: true }, { status: 400 });
    }

    // Marca approved antes de enviar (idempotência)
    await admin.from("outreach_drafts")
      .update({ status: "approved", approved_by: user.id, approved_at: new Date().toISOString() })
      .eq("id", draftId);

    // Envia via Resend
    try {
      const resend = getResend();
      const result = await resend.emails.send({
        from: draft.from_email || "contato@fakeforge.com.br",
        to: draft.recipient_email,
        replyTo: draft.reply_to || "contato@fakeforge.com.br",
        subject: draft.subject,
        html: draft.body_html || draft.body_text.replace(/\n/g, "<br>"),
        text: draft.body_text,
        tags: [
          { name: "type", value: "outreach" },
          { name: "campaign", value: draft.campaign },
        ],
      });

      if (result.error) {
        await admin.from("outreach_drafts")
          .update({ status: "failed", metadata: { ...(draft.metadata || {}), error: result.error.message } })
          .eq("id", draftId);
        return NextResponse.json({ error: result.error.message }, { status: 500 });
      }

      await admin.from("outreach_drafts")
        .update({ status: "sent", resend_id: result.data?.id, sent_at: new Date().toISOString() })
        .eq("id", draftId);

      return NextResponse.json({ ok: true, action: "sent", resend_id: result.data?.id });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      await admin.from("outreach_drafts")
        .update({ status: "failed", metadata: { ...(draft.metadata || {}), error: msg } })
        .eq("id", draftId);
      return NextResponse.json({ error: msg }, { status: 500 });
    }
  }

  return NextResponse.json({ error: `unknown action: ${action}` }, { status: 400 });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  const { admin } = auth;

  const body = await request.json().catch(() => null);
  const { draft_id, subject, body_text, body_html, recipient_email, recipient_name } = body || {};

  if (!draft_id) {
    return NextResponse.json({ error: "missing draft_id" }, { status: 400 });
  }

  const updates: Record<string, string> = {};
  if (subject !== undefined) updates.subject = subject;
  if (body_text !== undefined) updates.body_text = body_text;
  if (body_html !== undefined) updates.body_html = body_html;
  if (recipient_email !== undefined) updates.recipient_email = recipient_email;
  if (recipient_name !== undefined) updates.recipient_name = recipient_name;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "no fields to update" }, { status: 400 });
  }

  const { data, error } = await admin
    .from("outreach_drafts")
    .update(updates)
    .eq("id", draft_id)
    .eq("status", "pending") // só edita se ainda pending
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, draft: data });
}
