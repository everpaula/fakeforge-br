import { NextRequest, NextResponse } from "next/server";
import {
  getAdminSupabase,
  verifyCronRequest,
  firstNameFromEmail,
  getAlreadySent,
  isUserPaying,
  sendAndLog,
  unauthorizedResponse,
  DEFAULT_DAILY_CAP_PER_CRON,
  SEND_SLEEP_MS,
  sleep,
  getSentCountToday,
  isTestAccount,
} from "@/lib/nurture-cron-helper";
import { subjectStaleCheck, htmlStaleCheck, textStaleCheck } from "@/lib/email-templates";

/**
 * Cron T7+ "stale check": pergunta sincera pra users que signupou >= 7d
 * atrás E não fizeram call nos ultimos 5 dias. Zero CTA de pricing.
 *
 * Protecoes contra o incidente 07/out (burst 50+ em 9s estourou Resend quota):
 *   - UNIQUE (user_id, template) em sent_emails previne race (sendAndLog)
 *   - DAILY_CAP_PER_CRON cap diario (15 users/dia default)
 *   - SEND_SLEEP_MS 150ms entre sends (respeita Resend 10 req/s)
 *   - isTestAccount filtra plus-addressed +test*/+teste*
 *   - Agora semanal (domingo) em vez de diario, enquanto base e pequena
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const TEMPLATE = "stale_check";

export async function GET(request: NextRequest) {
  if (!verifyCronRequest(request)) return unauthorizedResponse();

  const admin = getAdminSupabase();

  const sentToday = await getSentCountToday(admin, TEMPLATE);
  if (sentToday >= DEFAULT_DAILY_CAP_PER_CRON) {
    return NextResponse.json({ ok: true, capped: true, sent_today: sentToday });
  }
  const remainingCap = DEFAULT_DAILY_CAP_PER_CRON - sentToday;

  const now = Date.now();
  const sinceSignup = new Date(now - 7 * 86400000).toISOString();
  const beforeSignup = new Date(now - 30 * 86400000).toISOString();

  // Pega users confirmados entre 7 e 30 dias atras
  const { data: usersData, error: usersError } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (usersError) return NextResponse.json({ error: "listUsers failed" }, { status: 500 });

  interface UserInWindow { id: string; email: string }
  const candidates: UserInWindow[] = (usersData.users || [])
    .filter((u) => {
      const confirmed = u.email_confirmed_at || u.confirmed_at;
      if (!confirmed || !u.email) return false;
      if (isTestAccount(u.email)) return false;
      return confirmed <= sinceSignup && confirmed >= beforeSignup;
    })
    .map((u) => ({ id: u.id, email: u.email! }));

  if (!candidates.length) {
    return NextResponse.json({ ok: true, checked: 0, sent: 0 });
  }

  const alreadySent = await getAlreadySent(admin, candidates.map((c) => c.id), TEMPLATE);

  // Filtra os que fizeram chamada nos ultimos 5 dias (= ativos, nao stale)
  const since5d = new Date(now - 5 * 86400000).toISOString();
  const { data: recentCalls } = await admin
    .from("api_usage")
    .select("user_id")
    .in("user_id", candidates.map((c) => c.id))
    .gte("created_at", since5d);
  const stillActive = new Set((recentCalls || []).map((r) => r.user_id as string));

  let sent = 0, skipped = 0, failed = 0;

  for (const user of candidates) {
    if (sent >= remainingCap) break;
    if (alreadySent.has(user.id)) { skipped++; continue; }
    if (stillActive.has(user.id)) { skipped++; continue; }
    if (await isUserPaying(admin, user.id)) { skipped++; continue; }

    const firstName = firstNameFromEmail(user.email);
    const result = await sendAndLog({
      admin,
      userId: user.id,
      email: user.email,
      template: TEMPLATE,
      subject: subjectStaleCheck(),
      html: htmlStaleCheck({ firstName }),
      text: textStaleCheck({ firstName }),
    });

    if (result.ok) {
      sent++;
      await sleep(SEND_SLEEP_MS);
    } else if (result.skipped) skipped++;
    else failed++;
  }

  return NextResponse.json({
    ok: true,
    checked: candidates.length,
    sent,
    skipped,
    failed,
    cap: remainingCap,
  });
}
