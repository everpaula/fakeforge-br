import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getResend, EMAIL_FROM, EMAIL_REPLY_TO } from "@/lib/resend";

/**
 * Sprint 8 — helper compartilhado pros crons do funil D3/D7/D14/D16/D30 + B2B.
 *
 * Padrão: cada cron é um GET que:
 *   1. verifica auth (Vercel Cron header ou CRON_SECRET)
 *   2. busca users candidatos (janela de dias + condições)
 *   3. filtra os que já receberam esse template
 *   4. filtra pelo predicate específico da etapa (ativou API? converteu?)
 *   5. envia email via Resend
 *   6. grava em sent_emails
 */

export function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export function verifyCronRequest(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) return true;
  if (request.headers.get("x-vercel-cron") === "1") return true;
  return false;
}

export function firstNameFromEmail(email: string): string {
  const localPart = email.split("@")[0] || "dev";
  const cleaned = localPart
    .replace(/[.\-_+]/g, " ")
    .replace(/\d+/g, "")
    .trim()
    .split(" ")[0];
  if (!cleaned) return "dev";
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
}

export interface UserCandidate {
  id: string;
  email: string;
  confirmedAt: string;
  createdAt: string;
}

/**
 * Busca users confirmados numa janela (D dias atrás com tolerância).
 * Ex: D=3 com hoursTolerance=6 → confirmados entre 3d-6h e 3d+6h.
 */
export async function getUsersInDayWindow(
  admin: ReturnType<typeof getAdminSupabase>,
  daysAgo: number,
  hoursTolerance: number = 6
): Promise<UserCandidate[]> {
  const now = Date.now();
  const windowCenter = now - daysAgo * 24 * 3600 * 1000;
  const windowStart = new Date(windowCenter - hoursTolerance * 3600 * 1000).toISOString();
  const windowEnd = new Date(windowCenter + hoursTolerance * 3600 * 1000).toISOString();

  const candidates: UserCandidate[] = [];
  // Paginate all users (avoid missing recent ones)
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 500 });
    if (error) break;
    const users = data?.users || [];
    for (const u of users) {
      const confirmed = u.email_confirmed_at || u.confirmed_at;
      if (!confirmed || !u.email) continue;
      if (confirmed >= windowStart && confirmed <= windowEnd) {
        candidates.push({
          id: u.id,
          email: u.email,
          confirmedAt: confirmed,
          createdAt: u.created_at,
        });
      }
    }
    if (users.length < 500) break;
  }
  return candidates;
}

/** Retorna IDs de users que já receberam esse template */
export async function getAlreadySent(
  admin: ReturnType<typeof getAdminSupabase>,
  userIds: string[],
  template: string
): Promise<Set<string>> {
  if (userIds.length === 0) return new Set();
  const { data } = await admin
    .from("sent_emails")
    .select("user_id")
    .eq("template", template)
    .in("user_id", userIds);
  return new Set((data || []).map((r) => r.user_id));
}

/** Retorna quantidade de chamadas API do user em N dias */
export async function getUserApiCallCount(
  admin: ReturnType<typeof getAdminSupabase>,
  userId: string,
  daysAgo: number
): Promise<number> {
  const since = new Date(Date.now() - daysAgo * 24 * 3600 * 1000).toISOString();
  const { count } = await admin
    .from("api_usage")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", since);
  return count || 0;
}

/** Retorna true se user tem subscription ativa (dev ou team) */
export async function isUserPaying(
  admin: ReturnType<typeof getAdminSupabase>,
  userId: string
): Promise<boolean> {
  const { data } = await admin
    .from("subscriptions")
    .select("plan, status")
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();
  return !!data && (data.plan === "dev" || data.plan === "team");
}

interface SendEmailArgs {
  admin: ReturnType<typeof getAdminSupabase>;
  userId: string;
  email: string;
  template: string;
  subject: string;
  html: string;
  text: string;
}

/** Envia email via Resend + grava em sent_emails. Retorna {ok, error?} */
export async function sendAndLog({ admin, userId, email, template, subject, html, text }: SendEmailArgs): Promise<{ ok: boolean; error?: string }> {
  const resend = getResend();
  try {
    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      replyTo: EMAIL_REPLY_TO,
      subject,
      html,
      text,
      tags: [{ name: "template", value: template }],
    });

    const resendId = result.data?.id || null;
    await admin.from("sent_emails").insert({
      user_id: userId,
      template,
      recipient: email,
      resend_id: resendId,
      status: result.error ? "failed" : "sent",
      metadata: result.error ? { error: result.error.message } : {},
    });

    if (result.error) return { ok: false, error: result.error.message };
    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[nurture ${template}] send error for ${email}:`, msg);
    return { ok: false, error: msg };
  }
}

/** Retorna response 401 pra cron não autorizado */
export function unauthorizedResponse() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

/** Formata expiração do cupom em BR (ex: "sábado 23h59") */
export function formatCouponExpiry(hoursFromNow: number): string {
  const expiry = new Date(Date.now() + hoursFromNow * 3600 * 1000);
  const dayNames = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
  const dayName = dayNames[expiry.getDay()];
  const hours = expiry.getHours().toString().padStart(2, "0");
  const minutes = expiry.getMinutes().toString().padStart(2, "0");
  return `${dayName} ${hours}h${minutes}`;
}
