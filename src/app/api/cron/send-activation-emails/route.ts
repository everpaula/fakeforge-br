import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSuppressedUserIds } from "@/lib/email-suppression";
import { subjectActivationT10, htmlActivationT10, textActivationT10 } from "@/lib/email-templates";
import { sendAndLog, SEND_SLEEP_MS, sleep, isTestAccount } from "@/lib/nurture-cron-helper";

// Cron: roda a cada 5 min. Busca users que confirmaram email nos
// últimos 15 min e ainda não receberam email de ativação. Envia
// curl pré-preenchido com API key real do user.
//
// Sprint 5 F2 (audit 13/09): mudou janela de [10-20min] pra [0-15min].
// Motivação: audit funil mostrou p50=6min do signup → 1a chamada API.
// Email a 10-20min chegava tarde. Agora chega na primeira janela cron
// APÓS signup (max 5min de latência).
//
// Trigger: Vercel Cron (vercel.json) ou manual via CRON_SECRET.
//
// Dedup: UNIQUE (user_id, template) em sent_emails previne 2 emails
// mesmo se user aparecer em runs consecutivos do cron.

export const dynamic = "force-dynamic";
export const maxDuration = 60; // segundos

function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function verifyCronRequest(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  // Vercel Cron sends "Authorization: Bearer <CRON_SECRET>"
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) return true;
  // Vercel dev headers
  if (request.headers.get("x-vercel-cron") === "1") return true;
  return false;
}

async function firstNameFromEmail(email: string): Promise<string> {
  const localPart = email.split("@")[0] || "dev";
  const cleaned = localPart
    .replace(/[.\-_+]/g, " ")
    .replace(/\d+/g, "")
    .trim()
    .split(" ")[0];
  if (!cleaned) return "dev";
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
}

export async function GET(request: NextRequest) {
  if (!verifyCronRequest(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const admin = getAdminSupabase();
  const now = Date.now();
  // Sprint 5 F2: janela T+0 - pega users confirmados nos últimos 15 min
  const windowStart = new Date(now - 15 * 60 * 1000).toISOString();
  const windowEnd = new Date(now).toISOString();

  // Busca users que confirmaram email nos últimos 15 min (T+0 dispatch)
  const { data: usersData, error: usersError } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  });

  if (usersError) {
    console.error("[cron activation] listUsers error:", usersError.message);
    return NextResponse.json({ error: "listUsers failed" }, { status: 500 });
  }

  interface UserInWindow {
    id: string;
    email: string;
    confirmedAt: string;
  }
  const candidates: UserInWindow[] = (usersData.users || [])
    .filter((u) => {
      const confirmed = u.email_confirmed_at || u.confirmed_at;
      if (!confirmed || !u.email) return false;
      if (isTestAccount(u.email)) return false;
      return confirmed >= windowStart && confirmed <= windowEnd;
    })
    .map((u) => ({ id: u.id, email: u.email!, confirmedAt: u.email_confirmed_at || u.confirmed_at! }));

  if (!candidates.length) {
    return NextResponse.json({ ok: true, checked: 0, sent: 0, skipped: 0 });
  }

  // Filtra os que já receberam esse template
  const { data: sentData } = await admin
    .from("sent_emails")
    .select("user_id")
    .eq("template", "activation_t10")
    .in("user_id", candidates.map((c) => c.id));

  const alreadySent = new Set((sentData || []).map((r) => r.user_id));

  // Fast activators (05/out): quem já chamou a API antes do cron pegar não
  // precisa do email "sua primeira chamada". p50 do time-to-first-call é
  // 1.6min, então ~50% dos ativadores de verdade estariam recebendo um email
  // obsoleto. Isso polui a bandeja e queima open rate.
  const { data: alreadyCalledData } = await admin
    .from("api_usage")
    .select("user_id")
    .in("user_id", candidates.map((c) => c.id))
    .limit(candidates.length);
  const alreadyCalled = new Set((alreadyCalledData || []).map((r) => r.user_id as string));

  // Bounce/complaint prévio, lista local e emails com cara de typo ou bot ficam de fora
  const suppressed = await getSuppressedUserIds(admin, candidates);
  const toSend = candidates.filter(
    (c) => !alreadySent.has(c.id) && !suppressed.has(c.id) && !alreadyCalled.has(c.id)
  );

  if (!toSend.length) {
    return NextResponse.json({ ok: true, checked: candidates.length, sent: 0, skipped: candidates.length, suppressed: suppressed.size });
  }

  let sent = 0;
  let failed = 0;
  let capped = 0;

  for (const user of toSend) {
    // Busca API key do user (usa a primeira ativa)
    const { data: keyRow } = await admin
      .from("api_keys")
      .select("key")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: true })
      .limit(1)
      .single();

    const apiKey = keyRow?.key || "ff_criar_uma_no_dashboard";
    const firstName = await firstNameFromEmail(user.email);

    const result = await sendAndLog({
      admin,
      userId: user.id,
      email: user.email,
      template: "activation_t10",
      subject: subjectActivationT10(),
      html: htmlActivationT10({ firstName, apiKey }),
      text: textActivationT10({ firstName, apiKey }),
      priority: "transactional",
    });

    if (result.ok) {
      sent++;
      await sleep(SEND_SLEEP_MS);
    } else if (result.error?.startsWith("global_cap_")) {
      capped++;
      break; // sem usar budget resto do cron
    } else if (result.skipped) {
      // noop
    } else {
      failed++;
      console.error("[cron activation] send failed for", user.email, result.error);
    }
  }

  return NextResponse.json({
    ok: true,
    checked: candidates.length,
    sent,
    failed,
    capped,
    skipped: candidates.length - toSend.length,
    already_called: alreadyCalled.size,
  });
}
