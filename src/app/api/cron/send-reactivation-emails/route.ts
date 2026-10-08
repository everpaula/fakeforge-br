import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSuppressedUserIds } from "@/lib/email-suppression";
import { subjectReactivationT24h, htmlReactivationT24h, textReactivationT24h } from "@/lib/email-templates";
import { sendAndLog, SEND_SLEEP_MS, sleep, isTestAccount } from "@/lib/nurture-cron-helper";

// Cron: roda de hora em hora. Busca users que:
//   1. Confirmaram email 24-48h atrás (janela larga pra tolerar cron atrasado)
//   2. Têm pelo menos 1 API key ativa
//   3. Ainda NÃO usaram a API (0 rows em api_usage nas últimas 24h)
//   4. Ainda não receberam o template 'reactivation_t24h' (dedup via unique index)
//
// Envia email com 3 casos de uso concretos + curls prontos pra copiar.
// Complementa o T+10min: se aquele não converteu ativação, esse dá segunda tentativa
// 24h depois com mais contexto de valor.

export const dynamic = "force-dynamic";
export const maxDuration = 60;

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

function firstNameFromEmail(email: string): string {
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
  const windowStart = new Date(now - 48 * 60 * 60 * 1000).toISOString();
  const windowEnd = new Date(now - 24 * 60 * 60 * 1000).toISOString();

  // 1. Users que confirmaram email na janela 24-48h atrás
  const { data: usersData, error: usersError } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 500,
  });

  if (usersError) {
    console.error("[cron reactivation] listUsers error:", usersError.message);
    return NextResponse.json({ error: "listUsers failed" }, { status: 500 });
  }

  interface Candidate {
    id: string;
    email: string;
  }

  const inWindow: Candidate[] = (usersData.users || [])
    .filter((u) => {
      const confirmed = u.email_confirmed_at || u.confirmed_at;
      if (!confirmed || !u.email) return false;
      if (isTestAccount(u.email)) return false;
      return confirmed >= windowStart && confirmed <= windowEnd;
    })
    .map((u) => ({ id: u.id, email: u.email! }));

  if (!inWindow.length) {
    return NextResponse.json({ ok: true, checked: 0, sent: 0, skipped: 0 });
  }

  // 2. Filtra: já receberam esse template
  const { data: alreadySentRows } = await admin
    .from("sent_emails")
    .select("user_id")
    .eq("template", "reactivation_t24h")
    .in("user_id", inWindow.map((c) => c.id));

  const alreadySent = new Set((alreadySentRows || []).map((r) => r.user_id));
  const notYetSent = inWindow.filter((c) => !alreadySent.has(c.id));

  if (!notYetSent.length) {
    return NextResponse.json({ ok: true, checked: inWindow.length, sent: 0, skipped: inWindow.length });
  }

  // 3. Filtra: tem API key ativa
  const { data: keysData } = await admin
    .from("api_keys")
    .select("user_id, key, created_at")
    .in("user_id", notYetSent.map((c) => c.id))
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  const firstKeyByUser = new Map<string, string>();
  for (const row of keysData || []) {
    if (!firstKeyByUser.has(row.user_id)) {
      firstKeyByUser.set(row.user_id, row.key);
    }
  }

  const hasKey = notYetSent.filter((c) => firstKeyByUser.has(c.id));
  if (!hasKey.length) {
    return NextResponse.json({
      ok: true,
      checked: inWindow.length,
      sent: 0,
      skipped: inWindow.length,
      reason: "no_api_keys_yet",
    });
  }

  // 4. Filtra: zero uso da API nas últimas 24h (dead activation)
  const usageSince = new Date(now - 24 * 60 * 60 * 1000).toISOString();
  const { data: usageRows } = await admin
    .from("api_usage")
    .select("user_id")
    .in("user_id", hasKey.map((c) => c.id))
    .gte("created_at", usageSince);

  const usedRecently = new Set((usageRows || []).map((r) => r.user_id));
  const suppressed = await getSuppressedUserIds(admin, hasKey);
  const toSend = hasKey.filter((c) => !usedRecently.has(c.id) && !suppressed.has(c.id));

  if (!toSend.length) {
    return NextResponse.json({
      ok: true,
      checked: inWindow.length,
      sent: 0,
      skipped: inWindow.length,
      reason: "all_activated",
    });
  }

  let sent = 0;
  let failed = 0;
  let capped = 0;

  for (const user of toSend) {
    const apiKey = firstKeyByUser.get(user.id)!;
    const firstName = firstNameFromEmail(user.email);

    const result = await sendAndLog({
      admin,
      userId: user.id,
      email: user.email,
      template: "reactivation_t24h",
      subject: subjectReactivationT24h(),
      html: htmlReactivationT24h({ firstName, apiKey }),
      text: textReactivationT24h({ firstName, apiKey }),
      priority: "transactional",
    });

    if (result.ok) {
      sent++;
      await sleep(SEND_SLEEP_MS);
    } else if (result.error?.startsWith("global_cap_")) {
      capped++;
      break;
    } else if (!result.skipped) {
      failed++;
      console.error("[cron reactivation] send failed for", user.email, result.error);
    }
  }

  return NextResponse.json({
    ok: true,
    checked: inWindow.length,
    sent,
    failed,
    capped,
    skipped: inWindow.length - toSend.length,
  });
}
