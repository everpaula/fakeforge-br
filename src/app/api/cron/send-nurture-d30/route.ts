import { NextRequest, NextResponse } from "next/server";
import {
  getAdminSupabase,
  verifyCronRequest,
  firstNameFromEmail,
  getUsersInDayWindow,
  getAlreadySent,
  isUserPaying,
  sendAndLog,
  unauthorizedResponse,
} from "@/lib/nurture-cron-helper";
import {
  subjectNurtureD30Retention,
  htmlNurtureD30Retention,
  textNurtureD30Retention,
  subjectNurtureD30Digest,
  htmlNurtureD30Digest,
  textNurtureD30Digest,
} from "@/lib/email-templates";

/**
 * Sprint 8 D30 Split: retention (converteu) OU monthly digest (não converteu).
 * PRA users confirmados há 30 dias.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const TEMPLATE_RETENTION = "nurture_d30_retention";
const TEMPLATE_DIGEST = "nurture_d30_digest";

export async function GET(request: NextRequest) {
  if (!verifyCronRequest(request)) return unauthorizedResponse();

  const admin = getAdminSupabase();
  const candidates = await getUsersInDayWindow(admin, 30);
  if (!candidates.length) return NextResponse.json({ ok: true, checked: 0, sent: 0 });

  const userIds = candidates.map((c) => c.id);
  const alreadySentRetention = await getAlreadySent(admin, userIds, TEMPLATE_RETENTION);
  const alreadySentDigest = await getAlreadySent(admin, userIds, TEMPLATE_DIGEST);

  let sentRetention = 0, sentDigest = 0, skipped = 0, failed = 0;

  for (const user of candidates) {
    const isPaying = await isUserPaying(admin, user.id);
    const template = isPaying ? TEMPLATE_RETENTION : TEMPLATE_DIGEST;
    const alreadySent = isPaying ? alreadySentRetention : alreadySentDigest;

    if (alreadySent.has(user.id)) { skipped++; continue; }

    const firstName = firstNameFromEmail(user.email);
    const subject = isPaying ? subjectNurtureD30Retention() : subjectNurtureD30Digest();
    const html = isPaying ? htmlNurtureD30Retention({ firstName }) : htmlNurtureD30Digest({ firstName });
    const text = isPaying ? textNurtureD30Retention({ firstName }) : textNurtureD30Digest({ firstName });

    const result = await sendAndLog({
      admin,
      userId: user.id,
      email: user.email,
      template,
      subject,
      html,
      text,
    });

    if (result.ok) {
      if (isPaying) sentRetention++;
      else sentDigest++;
    } else if (result.skipped) skipped++;
    else failed++;
  }

  return NextResponse.json({
    ok: true,
    checked: candidates.length,
    sent_retention: sentRetention,
    sent_digest: sentDigest,
    skipped,
    failed,
  });
}
