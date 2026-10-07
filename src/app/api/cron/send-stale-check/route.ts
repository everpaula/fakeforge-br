import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getResend, EMAIL_FROM, EMAIL_REPLY_TO } from "@/lib/resend";
import { getSuppressedUserIds } from "@/lib/email-suppression";
import { subjectStaleCheck, htmlStaleCheck, textStaleCheck } from "@/lib/email-templates";

/**
 * Cron T7+ "stale check": pergunta sincera pra users que signupou >= 7d
 * atrás E não fizeram call nos últimos 5 dias. Zero CTA de pricing.
 * Pede reply direto. Alvo = detectar porque o churn silencioso acontece.
 *
 * Diferente dos nurture_d*: esse não vende, pede feedback. Objetivo é
 * dado qualitativo pra decisao de produto, não conversion.
 *
 * Dedup: 1x por user, UNIQUE (user_id, template).
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const TEMPLATE = "stale_check";

function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function verifyCronRequest(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) return true;
  if (request.headers.get("x-vercel-cron") === "1") return true;
  return false;
}

async function firstNameFromEmail(email: string): Promise<string> {
  const localPart = email.split("@")[0] || "dev";
  const cleaned = localPart.replace(/[.\-_+]/g, " ").replace(/\d+/g, "").trim().split(" ")[0];
  if (!cleaned) return "dev";
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
}

export async function GET(request: NextRequest) {
  if (!verifyCronRequest(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const admin = getAdminSupabase();
  const now = Date.now();
  const sinceSignup = new Date(now - 7 * 86400000).toISOString();
  const beforeSignup = new Date(now - 30 * 86400000).toISOString(); // cap pra não enviar pra conta de meses

  // Pega users confirmados entre 7 e 30 dias atrás
  const { data: usersData, error: usersError } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (usersError) return NextResponse.json({ error: "listUsers failed" }, { status: 500 });

  interface UserInWindow { id: string; email: string; confirmedAt: string }
  const candidates: UserInWindow[] = (usersData.users || [])
    .filter((u) => {
      const confirmed = u.email_confirmed_at || u.confirmed_at;
      if (!confirmed || !u.email) return false;
      return confirmed <= sinceSignup && confirmed >= beforeSignup;
    })
    .map((u) => ({ id: u.id, email: u.email!, confirmedAt: u.email_confirmed_at || u.confirmed_at! }));

  if (!candidates.length) {
    return NextResponse.json({ ok: true, checked: 0, sent: 0 });
  }

  // Filtra os que já receberam o template
  const { data: sentData } = await admin
    .from("sent_emails")
    .select("user_id")
    .eq("template", TEMPLATE)
    .in("user_id", candidates.map((c) => c.id));
  const alreadySent = new Set((sentData || []).map((r) => r.user_id as string));

  // Filtra os que fizeram chamada nos últimos 5 dias (= estão ativos, não são stale)
  const since5d = new Date(now - 5 * 86400000).toISOString();
  const { data: recentCalls } = await admin
    .from("api_usage")
    .select("user_id")
    .in("user_id", candidates.map((c) => c.id))
    .gte("created_at", since5d);
  const stillActive = new Set((recentCalls || []).map((r) => r.user_id as string));

  // Filtra pagantes
  const { data: paying } = await admin
    .from("subscriptions")
    .select("user_id")
    .in("status", ["active", "trialing"])
    .in("user_id", candidates.map((c) => c.id));
  const payingSet = new Set((paying || []).map((r) => r.user_id as string));

  const suppressed = await getSuppressedUserIds(admin, candidates);

  const toSend = candidates.filter(
    (c) => !alreadySent.has(c.id) && !stillActive.has(c.id) && !payingSet.has(c.id) && !suppressed.has(c.id)
  );

  if (!toSend.length) {
    return NextResponse.json({ ok: true, checked: candidates.length, sent: 0, skipped: candidates.length });
  }

  const resend = getResend();
  let sent = 0, failed = 0;

  for (const user of toSend) {
    try {
      const firstName = await firstNameFromEmail(user.email);
      const result = await resend.emails.send({
        from: EMAIL_FROM,
        to: user.email,
        replyTo: EMAIL_REPLY_TO,
        subject: subjectStaleCheck(),
        html: htmlStaleCheck({ firstName }),
        text: textStaleCheck({ firstName }),
        tags: [{ name: "template", value: TEMPLATE }],
      });
      const resendId = result.data?.id || null;
      await admin.from("sent_emails").insert({
        user_id: user.id,
        template: TEMPLATE,
        recipient: user.email,
        resend_id: resendId,
        status: result.error ? "failed" : "sent",
        metadata: result.error ? { error: result.error.message } : {},
      });
      if (result.error) {
        failed++;
        console.error("[cron stale_check] Resend error for", user.email, result.error);
      } else {
        sent++;
      }
    } catch (err) {
      failed++;
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[cron stale_check] send error for", user.email, msg);
    }
  }

  return NextResponse.json({
    ok: true,
    checked: candidates.length,
    sent,
    failed,
    skipped: candidates.length - toSend.length,
  });
}
