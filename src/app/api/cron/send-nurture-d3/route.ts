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
} from "@/lib/nurture-cron-helper";
import {
  subjectNurtureD3,
  htmlNurtureD3,
  textNurtureD3,
} from "@/lib/email-templates";

/**
 * Sprint 8 D3 Hook: 3 features que fazem devs virar cliente.
 * Envia PRA users confirmados há 3 dias que fizeram >=1 chamada API.
 * Se não chamou API, cron reactivation existente já cobre.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const TEMPLATE = "nurture_d3";

export async function GET(request: NextRequest) {
  if (!verifyCronRequest(request)) return unauthorizedResponse();

  const admin = getAdminSupabase();
  const candidates = await getUsersInDayWindow(admin, 3);
  if (!candidates.length) return NextResponse.json({ ok: true, checked: 0, sent: 0 });

  const alreadySent = await getAlreadySent(admin, candidates.map((c) => c.id), TEMPLATE);

  let sent = 0, skipped = 0, failed = 0;

  for (const user of candidates) {
    if (alreadySent.has(user.id)) { skipped++; continue; }

    // Pula pagantes (não faz sentido email de upsell pra quem já pagou)
    if (await isUserPaying(admin, user.id)) { skipped++; continue; }

    // Precisa ter feito pelo menos 1 chamada API (senão cron reactivation cuida)
    const calls = await getUserApiCallCount(admin, user.id, 3);
    if (calls < 1) { skipped++; continue; }

    const firstName = firstNameFromEmail(user.email);
    const result = await sendAndLog({
      admin,
      userId: user.id,
      email: user.email,
      template: TEMPLATE,
      subject: subjectNurtureD3(0),
      html: htmlNurtureD3({ firstName }),
      text: textNurtureD3({ firstName }),
    });

    if (result.ok) sent++;
    else if (result.skipped) skipped++;
    else failed++;
  }

  return NextResponse.json({ ok: true, checked: candidates.length, sent, skipped, failed });
}
