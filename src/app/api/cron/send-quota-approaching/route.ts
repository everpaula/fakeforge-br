import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getResend, EMAIL_FROM, EMAIL_REPLY_TO } from "@/lib/resend";
import { getSuppressedUserIds } from "@/lib/email-suppression";
import { subjectQuotaApproaching, htmlQuotaApproaching, textQuotaApproaching } from "@/lib/email-templates";
import { canSendNow, SEND_SLEEP_MS, sleep, isTestAccount } from "@/lib/nurture-cron-helper";

// Cron weekly (segunda 10h BS = 13h UTC).
//
// Filtra Free users que bateram >=80% do limite diario em algum dia dos
// ultimos 7 dias. Envia aviso transacional (nao marketing, sem opt-in)
// avisando que estao proximos do teto.
//
// Regras:
// - Free plan APENAS (Dev/Team ja tem quota alta, nao precisa aviso)
// - Nao envia se recebeu esse mesmo template nas ultimas 2 semanas
// - Dedup via UNIQUE index em sent_emails (user_id, template)
//
// Sprint 1 Task 4 - Chief of Staff synthesis 13/09.

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const FREE_DAILY_LIMIT = 100;
const THRESHOLD = 0.8; // 80% do limite

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

// Template usa "sent_emails" com UNIQUE (user_id, template). Mesma template
// nao pode ser reenviada. Solucao: sufixo com ISO week - permite envio a
// cada semana calendario.
function templateForThisWeek(): string {
  const now = new Date();
  const year = now.getFullYear();
  // Semana ISO simples (dia do ano / 7)
  const dayOfYear = Math.floor((now.getTime() - new Date(year, 0, 0).getTime()) / 86400000);
  const week = Math.ceil(dayOfYear / 7);
  return `quota_approaching_${year}_w${week}`;
}

export async function GET(request: NextRequest) {
  if (!verifyCronRequest(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const admin = getAdminSupabase();
  const currentWeekTemplate = templateForThisWeek();
  const since7d = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();
  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString();

  // 1. Puxa uso agregado por (user_id, dia BS) dos ultimos 7 dias.
  const { data: usage, error: usageError } = await admin
    .from("api_usage")
    .select("user_id, created_at")
    .gte("created_at", since7d);

  if (usageError) {
    console.error("[cron quota] api_usage error:", usageError.message);
    return NextResponse.json({ error: "usage query failed" }, { status: 500 });
  }

  // Conta chamadas por (user_id, dia local BS)
  const perUserPerDay = new Map<string, number>();
  for (const row of usage || []) {
    if (!row.user_id) continue;
    const dayBs = new Date(new Date(row.created_at).getTime() - 3 * 3600 * 1000)
      .toISOString().slice(0, 10);
    const key = `${row.user_id}|${dayBs}`;
    perUserPerDay.set(key, (perUserPerDay.get(key) || 0) + 1);
  }

  // Pra cada user, encontra o dia de pico e checa se passou 80%
  interface UserPeak {
    user_id: string;
    peak_day: string;
    peak_calls: number;
  }
  const usersPeaks = new Map<string, UserPeak>();
  for (const [key, calls] of perUserPerDay) {
    const [userId, day] = key.split("|");
    const existing = usersPeaks.get(userId);
    if (!existing || calls > existing.peak_calls) {
      usersPeaks.set(userId, { user_id: userId, peak_day: day, peak_calls: calls });
    }
  }

  const candidates = Array.from(usersPeaks.values()).filter(
    (u) => u.peak_calls >= FREE_DAILY_LIMIT * THRESHOLD
  );

  if (!candidates.length) {
    return NextResponse.json({ ok: true, checked: 0, sent: 0 });
  }

  // 2. Filtra: users com subscription Dev/Team ativa (nao envia pra pagante)
  const { data: subs } = await admin
    .from("subscriptions")
    .select("user_id")
    .in("status", ["active", "trialing"])
    .in("plan", ["dev", "team"])
    .in("user_id", candidates.map((c) => c.user_id));

  const paidUserIds = new Set((subs || []).map((s) => s.user_id));
  const freeOnly = candidates.filter((c) => !paidUserIds.has(c.user_id));

  if (!freeOnly.length) {
    return NextResponse.json({ ok: true, checked: candidates.length, sent: 0, skipped_paid: candidates.length });
  }

  // 3. Filtra: ja recebeu template similar nas ultimas 2 semanas
  const { data: recentSends } = await admin
    .from("sent_emails")
    .select("user_id, template, sent_at")
    .like("template", "quota_approaching_%")
    .gte("sent_at", twoWeeksAgo)
    .in("user_id", freeOnly.map((c) => c.user_id));

  const recentlySent = new Set((recentSends || []).map((r) => r.user_id));
  const toSend = freeOnly.filter((c) => !recentlySent.has(c.user_id));

  if (!toSend.length) {
    return NextResponse.json({ ok: true, checked: freeOnly.length, sent: 0, skipped_recent: freeOnly.length });
  }

  // 4. Puxa email + nome dos users que vao receber
  const { data: usersData } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const userMap = new Map<string, { email: string }>();
  for (const u of usersData?.users || []) {
    if (u.email) userMap.set(u.id, { email: u.email });
  }

  const suppressed = await getSuppressedUserIds(
    admin,
    toSend.flatMap((c) => {
      const info = userMap.get(c.user_id);
      return info ? [{ id: c.user_id, email: info.email }] : [];
    })
  );

  const resend = getResend();
  let sent = 0;
  let failed = 0;
  let capped = 0;

  for (const user of toSend) {
    const userInfo = userMap.get(user.user_id);
    if (!userInfo) continue;
    if (suppressed.has(user.user_id)) continue;
    if (isTestAccount(userInfo.email)) continue;

    // Global cap gate — quota_approaching e transactional (user espera o aviso)
    const capCheck = await canSendNow(admin, "transactional");
    if (capCheck) { capped++; break; }

    try {
      // Puxa items totais 7d desse user pra copy pessoal
      const { data: userUsage7d } = await admin
        .from("api_usage")
        .select("quantity")
        .eq("user_id", user.user_id)
        .gte("created_at", since7d);

      const totalCalls = (userUsage7d || []).length;
      const totalItems = (userUsage7d || []).reduce((sum, r) => sum + (r.quantity || 0), 0);
      const peakPercent = Math.round((user.peak_calls / FREE_DAILY_LIMIT) * 100);
      const peakDayFormatted = new Date(user.peak_day + "T00:00:00-03:00").toLocaleDateString("pt-BR", {
        day: "2-digit", month: "2-digit"
      });

      const firstName = firstNameFromEmail(userInfo.email);

      const result = await resend.emails.send({
        from: EMAIL_FROM,
        to: userInfo.email,
        replyTo: EMAIL_REPLY_TO,
        subject: subjectQuotaApproaching(),
        html: htmlQuotaApproaching({
          firstName,
          peakUsageDay: peakDayFormatted,
          peakUsagePercent: peakPercent,
          callsMade: totalCalls,
          itemsGenerated: totalItems,
        }),
        text: textQuotaApproaching({
          firstName,
          peakUsageDay: peakDayFormatted,
          peakUsagePercent: peakPercent,
          callsMade: totalCalls,
          itemsGenerated: totalItems,
        }),
        tags: [{ name: "template", value: "quota_approaching" }],
      });

      const resendId = result.data?.id || null;

      await admin.from("sent_emails").insert({
        user_id: user.user_id,
        template: currentWeekTemplate,
        recipient: userInfo.email,
        resend_id: resendId,
        status: result.error ? "failed" : "sent",
        metadata: {
          peak_percent: peakPercent,
          peak_day: user.peak_day,
          calls_7d: totalCalls,
          items_7d: totalItems,
          ...(result.error ? { error: result.error.message } : {}),
        },
      });

      if (result.error) {
        failed++;
        console.error("[cron quota] Resend error for", userInfo.email, result.error);
      } else {
        sent++;
        await sleep(SEND_SLEEP_MS); // respeita rate limit Resend 10 req/s
      }
    } catch (err) {
      failed++;
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[cron quota] send error:", msg);
    }
  }

  return NextResponse.json({
    ok: true,
    checked: freeOnly.length,
    sent,
    failed,
    capped,
    skipped_paid: paidUserIds.size,
    skipped_recent: recentlySent.size,
    skipped_suppressed: suppressed.size,
  });
}
