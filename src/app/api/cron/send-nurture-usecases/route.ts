import { NextRequest, NextResponse } from "next/server";
import {
  getAdminSupabase,
  verifyCronRequest,
  firstNameFromEmail,
  getUsersInDayWindow,
  getAlreadySent,
  getUserApiCallCount,
  isUserPaying,
  sendAndLog,
  unauthorizedResponse,
  DEFAULT_DAILY_CAP_PER_CRON,
  SEND_SLEEP_MS,
  sleep,
  getSentCountToday,
} from "@/lib/nurture-cron-helper";
import {
  subjectNurtureUsecases,
  htmlNurtureUsecases,
  textNurtureUsecases,
} from "@/lib/email-templates";

/**
 * Cron T3-T5: envia pra users que signupou 3-5 dias atrás e fizeram
 * entre 1 e 5 chamadas (perfil "testador" identificado no diagnóstico
 * 06/out). Ensina USO (fluxos que exigem volume), não vende upgrade.
 *
 * Pra quem tem 0 chamadas: reactivation_t24h já cobre.
 * Pra quem tem 6+ chamadas: user é "active" ou "power", nurture_d3
 * clássico converte melhor.
 *
 * Dedup: UNIQUE (user_id, template) em sent_emails.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const TEMPLATE = "nurture_usecases";
const MIN_CALLS = 1;
const MAX_CALLS = 5;

export async function GET(request: NextRequest) {
  if (!verifyCronRequest(request)) return unauthorizedResponse();

  const admin = getAdminSupabase();

  // Daily cap: Resend Free = 100/dia pra TODOS os crons somados. Esse limite
  // protege contra burst (bug 07/out quando stale_check mandou 50+ em 9s e
  // estourou cota, derrubando emails criticos como password reset).
  const sentToday = await getSentCountToday(admin, TEMPLATE);
  if (sentToday >= DEFAULT_DAILY_CAP_PER_CRON) {
    return NextResponse.json({ ok: true, capped: true, sent_today: sentToday });
  }
  const remainingCap = DEFAULT_DAILY_CAP_PER_CRON - sentToday;

  // Janela de 3-5 dias pos-signup (3 dias passou o hook, antes do d7)
  const candidates = await getUsersInDayWindow(admin, 3);
  if (!candidates.length) return NextResponse.json({ ok: true, checked: 0, sent: 0 });

  const alreadySent = await getAlreadySent(admin, candidates.map((c) => c.id), TEMPLATE);

  let sent = 0, skipped = 0, failed = 0;

  for (const user of candidates) {
    if (sent >= remainingCap) break; // respeita cap diario
    if (alreadySent.has(user.id)) { skipped++; continue; }
    if (await isUserPaying(admin, user.id)) { skipped++; continue; }

    // Perfil "testador": 1-5 chamadas totais. Fora dessa janela nao e o
    // alvo deste email.
    const calls = await getUserApiCallCount(admin, user.id, 90);
    if (calls < MIN_CALLS || calls > MAX_CALLS) { skipped++; continue; }

    const firstName = firstNameFromEmail(user.email);
    const result = await sendAndLog({
      admin,
      userId: user.id,
      email: user.email,
      template: TEMPLATE,
      subject: subjectNurtureUsecases(),
      html: htmlNurtureUsecases({ firstName }),
      text: textNurtureUsecases({ firstName }),
    });

    if (result.ok) {
      sent++;
      await sleep(SEND_SLEEP_MS); // respeita rate limit Resend 10 req/s
    } else if (result.skipped) skipped++;
    else failed++;
  }

  return NextResponse.json({ ok: true, checked: candidates.length, sent, skipped, failed, cap: remainingCap });
}
