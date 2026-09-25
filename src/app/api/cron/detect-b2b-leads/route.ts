import { NextRequest, NextResponse } from "next/server";
import {
  getAdminSupabase,
  verifyCronRequest,
  firstNameFromEmail,
  getAlreadySent,
  isUserPaying,
  sendAndLog,
  unauthorizedResponse,
} from "@/lib/nurture-cron-helper";
import {
  subjectB2BTrigger,
  htmlB2BTrigger,
  textB2BTrigger,
} from "@/lib/email-templates";

/**
 * Sprint 8 B2B trigger: detecta Free users com sinal de empresa.
 *
 * Regra (per Growth Hacker spec):
 *   Free + >=40 chamadas/dia por 5+ dias consecutivos
 *   E (domínio corporativo OR multi-IP no mesmo dia)
 *
 * Ação: email pro user com Calendly + email interno pro Everton.
 * Marca template `b2b_trigger_sent` pra idempotência.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 120;

const TEMPLATE = "b2b_trigger";
const CALENDLY_URL = process.env.B2B_CALENDLY_URL || "https://fakeforge.com.br/contato";
const FREE_DOMAINS = new Set([
  "gmail.com", "hotmail.com", "outlook.com", "yahoo.com", "yahoo.com.br",
  "icloud.com", "proton.me", "protonmail.com", "live.com", "bol.com.br",
  "uol.com.br", "terra.com.br", "ig.com.br",
]);

function isCorporateDomain(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase() || "";
  return !FREE_DOMAINS.has(domain);
}

interface DailyUsage {
  user_id: string;
  day: string;
  calls: number;
  distinct_ips: number;
}

export async function GET(request: NextRequest) {
  if (!verifyCronRequest(request)) return unauthorizedResponse();

  const admin = getAdminSupabase();
  const since = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();

  // Busca api_usage dos últimos 7 dias agrupado por user+dia+ip
  const { data: usage } = await admin
    .from("api_usage")
    .select("user_id, created_at, ip_hash")
    .not("user_id", "is", null)
    .gte("created_at", since)
    .range(0, 49999);

  if (!usage) return NextResponse.json({ ok: true, checked: 0 });

  // Agrupa por user_id + dia
  const daily: Record<string, DailyUsage> = {};
  for (const row of usage as Array<{ user_id: string; created_at: string; ip_hash: string }>) {
    const day = row.created_at.substring(0, 10);
    const key = `${row.user_id}::${day}`;
    if (!daily[key]) {
      daily[key] = { user_id: row.user_id, day, calls: 0, distinct_ips: 0 };
    }
    daily[key].calls++;
  }

  // Conta IPs distintos por user+dia
  const ipSets: Record<string, Set<string>> = {};
  for (const row of usage as Array<{ user_id: string; created_at: string; ip_hash: string }>) {
    const day = row.created_at.substring(0, 10);
    const key = `${row.user_id}::${day}`;
    if (!ipSets[key]) ipSets[key] = new Set();
    if (row.ip_hash) ipSets[key].add(row.ip_hash);
  }
  for (const [key, ips] of Object.entries(ipSets)) {
    if (daily[key]) daily[key].distinct_ips = ips.size;
  }

  // Identifica users com >=40 calls/dia em >=5 dias consecutivos
  const userDailyStats: Record<string, DailyUsage[]> = {};
  for (const entry of Object.values(daily)) {
    if (!userDailyStats[entry.user_id]) userDailyStats[entry.user_id] = [];
    userDailyStats[entry.user_id].push(entry);
  }

  const qualifiedUserIds: Array<{ id: string; avgCalls: number; multiIp: boolean }> = [];
  for (const [userId, days] of Object.entries(userDailyStats)) {
    const highVolumeDays = days.filter((d) => d.calls >= 40);
    if (highVolumeDays.length >= 5) {
      const avgCalls = Math.round(highVolumeDays.reduce((a, b) => a + b.calls, 0) / highVolumeDays.length);
      const multiIp = highVolumeDays.some((d) => d.distinct_ips >= 2);
      qualifiedUserIds.push({ id: userId, avgCalls, multiIp });
    }
  }

  if (qualifiedUserIds.length === 0) {
    return NextResponse.json({ ok: true, checked: 0, qualified: 0 });
  }

  const alreadySent = await getAlreadySent(admin, qualifiedUserIds.map((u) => u.id), TEMPLATE);

  // Fetch user emails
  const { data: usersData } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const usersMap = new Map((usersData?.users || []).map((u) => [u.id, u.email || ""]));

  let sent = 0, skipped = 0, failed = 0, flagged = 0;

  for (const qual of qualifiedUserIds) {
    if (alreadySent.has(qual.id)) { skipped++; continue; }
    if (await isUserPaying(admin, qual.id)) { skipped++; continue; }

    const email = usersMap.get(qual.id);
    if (!email) { skipped++; continue; }

    const isCorporate = isCorporateDomain(email);
    const hasSignal = isCorporate || qual.multiIp;
    if (!hasSignal) { skipped++; continue; }

    flagged++;
    const firstName = firstNameFromEmail(email);
    const volumeSummary = `${qual.avgCalls} chamadas/dia nos últimos 5+ dias${qual.multiIp ? " de múltiplos IPs (sinal de time)" : ""}`;

    const result = await sendAndLog({
      admin,
      userId: qual.id,
      email,
      template: TEMPLATE,
      subject: subjectB2BTrigger(),
      html: htmlB2BTrigger({ firstName, volumeSummary, calendlyUrl: CALENDLY_URL }),
      text: textB2BTrigger({ firstName, volumeSummary, calendlyUrl: CALENDLY_URL }),
    });

    if (result.ok) sent++;
    else failed++;
  }

  return NextResponse.json({
    ok: true,
    checked: qualifiedUserIds.length,
    flagged,
    sent,
    skipped,
    failed,
  });
}
