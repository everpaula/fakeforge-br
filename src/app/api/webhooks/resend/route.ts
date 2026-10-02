import { NextRequest, NextResponse } from "next/server";
import { getResend } from "@/lib/resend";
import { getAdminSupabase } from "@/lib/nurture-cron-helper";
import { addSuppression } from "@/lib/email-suppression";

/**
 * Webhook do Resend. Converte email.opened / email.clicked / email.bounced /
 * email.complained em linhas de funnel_events (e atualiza sent_emails.status
 * em bounce e complaint, e grava o destinatário em email_suppressions).
 *
 * Sem este endpoint, nenhum evento email_dX_opened chega no banco e o
 * dashboard de funil mostra 0% open rate mesmo com delivery OK.
 *
 * Config: Resend Dashboard > Webhooks > Add Endpoint
 *   URL: https://fakeforge.com.br/api/webhooks/resend
 *   Eventos: email.delivered, email.opened, email.clicked, email.bounced, email.complained
 *   Copiar o Signing Secret (whsec_...) para RESEND_WEBHOOK_SECRET na Vercel.
 */

export const runtime = "nodejs";

// sent_emails.template -> prefixo do event_type
// nurture_d3 -> email_d3 | nurture_d30_retention -> email_d30_retention
function eventPrefix(template: string): string | null {
  if (template.startsWith("nurture_")) return `email_${template.slice("nurture_".length)}`;
  return null;
}

export async function POST(request: NextRequest) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[webhooks/resend] RESEND_WEBHOOK_SECRET não configurado");
    return NextResponse.json({ error: "not configured" }, { status: 500 });
  }

  const payload = await request.text();

  let event: { type: string; data: Record<string, unknown> };
  try {
    event = getResend().webhooks.verify({
      payload,
      headers: {
        id: request.headers.get("svix-id") ?? "",
        timestamp: request.headers.get("svix-timestamp") ?? "",
        signature: request.headers.get("svix-signature") ?? "",
      },
      webhookSecret: secret,
    }) as unknown as typeof event;
  } catch {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  const emailId = typeof event.data?.email_id === "string" ? event.data.email_id : null;
  const handled = ["email.opened", "email.clicked", "email.bounced", "email.complained"];
  if (!emailId || !handled.includes(event.type)) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const admin = getAdminSupabase();

  const { data: sent, error: sentErr } = await admin
    .from("sent_emails")
    .select("user_id, template")
    .eq("resend_id", emailId)
    .maybeSingle();

  if (sentErr) {
    console.error("[webhooks/resend] lookup error:", sentErr.message);
    return NextResponse.json({ error: "lookup failed" }, { status: 500 });
  }

  // Bounce/complaint vai pra lista local mesmo quando o email não é do funil
  // (magic link e confirmação de signup não têm linha em sent_emails).
  if (event.type === "email.bounced" || event.type === "email.complained") {
    const to = Array.isArray(event.data.to) ? (event.data.to as unknown[]) : [];
    const bounce = event.data.bounce as { type?: string; subType?: string } | undefined;
    for (const addr of to) {
      if (typeof addr !== "string") continue;
      await addSuppression(
        admin,
        addr,
        event.type === "email.bounced" ? "bounced" : "complained",
        sent?.user_id ?? null,
        { resend_id: emailId, bounce_type: bounce?.type ?? null, bounce_sub_type: bounce?.subType ?? null }
      );
    }
  }

  // Email que não é do funil (magic link, activation etc): ignora sem erro
  if (!sent) return NextResponse.json({ ok: true, ignored: true });

  if (event.type === "email.bounced" || event.type === "email.complained") {
    const status = event.type === "email.bounced" ? "bounced" : "complained";
    const { error } = await admin.from("sent_emails").update({ status }).eq("resend_id", emailId);
    if (error) {
      console.error("[webhooks/resend] status update error:", error.message);
      return NextResponse.json({ error: "update failed" }, { status: 500 });
    }
    return NextResponse.json({ ok: true, status });
  }

  const prefix = eventPrefix(sent.template);
  if (!prefix) return NextResponse.json({ ok: true, ignored: true });

  const eventType = event.type === "email.opened" ? `${prefix}_opened` : `${prefix}_clicked_cta`;

  // Dedup: um open/click por email (scanners e Apple MPP disparam várias vezes)
  const { data: existing } = await admin
    .from("funnel_events")
    .select("id")
    .eq("event_type", eventType)
    .eq("user_id", sent.user_id)
    .limit(1);
  if (existing && existing.length > 0) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  const clickData = event.type === "email.clicked" ? (event.data.click as { link?: string } | undefined) : undefined;
  const { error: insertErr } = await admin.from("funnel_events").insert({
    event_type: eventType,
    user_id: sent.user_id,
    source_page: "resend_webhook",
    event_data: {
      resend_id: emailId,
      template: sent.template,
      ...(clickData?.link ? { link: clickData.link } : {}),
    },
  });
  if (insertErr) {
    console.error("[webhooks/resend] insert error:", insertErr.message);
    return NextResponse.json({ error: "insert failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, event_type: eventType });
}
