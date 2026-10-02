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
  subjectNurtureD7,
  htmlNurtureD7,
  textNurtureD7,
} from "@/lib/email-templates";

/**
 * Sprint 8 D7 Objection: 5 casos que Free não resolve.
 * PRA users confirmados há 7 dias, ainda Free, com >=3 chamadas últimos 7 dias.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const TEMPLATE = "nurture_d7";

export async function GET(request: NextRequest) {
  if (!verifyCronRequest(request)) return unauthorizedResponse();

  const admin = getAdminSupabase();
  const candidates = await getUsersInDayWindow(admin, 7);
  if (!candidates.length) return NextResponse.json({ ok: true, checked: 0, sent: 0 });

  const alreadySent = await getAlreadySent(admin, candidates.map((c) => c.id), TEMPLATE);

  let sent = 0, skipped = 0, failed = 0;

  for (const user of candidates) {
    if (alreadySent.has(user.id)) { skipped++; continue; }
    if (await isUserPaying(admin, user.id)) { skipped++; continue; }

    // Precisa ter ativado (>=3 calls em 7d)
    const calls = await getUserApiCallCount(admin, user.id, 7);
    if (calls < 3) { skipped++; continue; }

    const firstName = firstNameFromEmail(user.email);
    const result = await sendAndLog({
      admin,
      userId: user.id,
      email: user.email,
      template: TEMPLATE,
      subject: subjectNurtureD7(0),
      html: htmlNurtureD7({ firstName }),
      text: textNurtureD7({ firstName }),
    });

    if (result.ok) sent++;
    else if (result.skipped) skipped++;
    else failed++;
  }

  return NextResponse.json({ ok: true, checked: candidates.length, sent, skipped, failed });
}
