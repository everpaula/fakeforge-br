import { NextRequest, NextResponse } from "next/server";
import {
  getAdminSupabase,
  verifyCronRequest,
  firstNameFromEmail,
  getAlreadySent,
  isUserPaying,
  sendAndLog,
  formatCouponExpiry,
  unauthorizedResponse,
} from "@/lib/nurture-cron-helper";
import {
  subjectNurtureD16,
  htmlNurtureD16,
  textNurtureD16,
} from "@/lib/email-templates";

/**
 * Sprint 8 D16 Last chance: 24h antes do cupom expirar.
 * PRA users que receberam D14 há 2 dias E ainda são Free (não converteram).
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const TEMPLATE = "nurture_d16";
const CHECKOUT_URL = "https://fakeforge.com.br/checkout?plano=dev&cupom=CNPJ2026";

export async function GET(request: NextRequest) {
  if (!verifyCronRequest(request)) return unauthorizedResponse();

  const admin = getAdminSupabase();

  // Busca users que receberam D14 há aprox 2 dias (janela 40-56h atrás)
  const now = Date.now();
  const windowEnd = new Date(now - 40 * 3600 * 1000).toISOString();
  const windowStart = new Date(now - 56 * 3600 * 1000).toISOString();

  const { data: d14Recipients } = await admin
    .from("sent_emails")
    .select("user_id, recipient, sent_at")
    .eq("template", "nurture_d14")
    .gte("sent_at", windowStart)
    .lte("sent_at", windowEnd);

  if (!d14Recipients || d14Recipients.length === 0) {
    return NextResponse.json({ ok: true, checked: 0, sent: 0 });
  }

  const userIds = d14Recipients.map((r) => r.user_id).filter(Boolean) as string[];
  const alreadySent = await getAlreadySent(admin, userIds, TEMPLATE);

  let sent = 0, skipped = 0, failed = 0;
  const couponExpiresAt = formatCouponExpiry(24);

  for (const r of d14Recipients) {
    if (!r.user_id || !r.recipient) { skipped++; continue; }
    if (alreadySent.has(r.user_id)) { skipped++; continue; }
    if (await isUserPaying(admin, r.user_id)) { skipped++; continue; }

    const firstName = firstNameFromEmail(r.recipient);
    const result = await sendAndLog({
      admin,
      userId: r.user_id,
      email: r.recipient,
      template: TEMPLATE,
      subject: subjectNurtureD16(0),
      html: htmlNurtureD16({ firstName, couponExpiresAt, checkoutUrl: CHECKOUT_URL }),
      text: textNurtureD16({ firstName, couponExpiresAt, checkoutUrl: CHECKOUT_URL }),
    });

    if (result.ok) sent++;
    else if (result.skipped) skipped++;
    else failed++;
  }

  return NextResponse.json({ ok: true, checked: d14Recipients.length, sent, skipped, failed });
}
