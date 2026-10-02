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
  formatCouponExpiry,
  unauthorizedResponse,
} from "@/lib/nurture-cron-helper";
import {
  subjectNurtureD14,
  htmlNurtureD14,
  textNurtureD14,
} from "@/lib/email-templates";

/**
 * Sprint 8 D14 Urgency+Offer: R$19 primeiro mês, cupom CNPJ2026, 48h.
 * PRA users confirmados há 14 dias, ainda Free, com >=10 chamadas últimos 14 dias.
 * (heavy engaged — provável comprador)
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const TEMPLATE = "nurture_d14";
const CHECKOUT_URL = "https://fakeforge.com.br/checkout?plano=dev&cupom=CNPJ2026";

export async function GET(request: NextRequest) {
  if (!verifyCronRequest(request)) return unauthorizedResponse();

  const admin = getAdminSupabase();
  const candidates = await getUsersInDayWindow(admin, 14);
  if (!candidates.length) return NextResponse.json({ ok: true, checked: 0, sent: 0 });

  const alreadySent = await getAlreadySent(admin, candidates.map((c) => c.id), TEMPLATE);

  let sent = 0, skipped = 0, failed = 0;
  const couponExpiresAt = formatCouponExpiry(48);

  for (const user of candidates) {
    if (alreadySent.has(user.id)) { skipped++; continue; }
    if (await isUserPaying(admin, user.id)) { skipped++; continue; }

    // Heavy engaged: >=10 chamadas em 14 dias
    const calls = await getUserApiCallCount(admin, user.id, 14);
    if (calls < 10) { skipped++; continue; }

    const firstName = firstNameFromEmail(user.email);
    const result = await sendAndLog({
      admin,
      userId: user.id,
      email: user.email,
      template: TEMPLATE,
      subject: subjectNurtureD14(0),
      html: htmlNurtureD14({ firstName, couponExpiresAt, checkoutUrl: CHECKOUT_URL }),
      text: textNurtureD14({ firstName, couponExpiresAt, checkoutUrl: CHECKOUT_URL }),
    });

    if (result.ok) sent++;
    else if (result.skipped) skipped++;
    else failed++;
  }

  return NextResponse.json({ ok: true, checked: candidates.length, sent, skipped, failed });
}
