import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Proteção de reputação do domínio de envio (bounce rate Resend).
 *
 * Um destinatário é bloqueado quando QUALQUER uma dessas condições é verdadeira:
 *   1. sent_emails tem linha dele com status bounced/complained (por user_id ou recipient)
 *   2. email consta em public.email_suppressions (docs/sql/017)
 *   3. email tem cara de typo de provedor (gmil.com, hotnail.com...) ou de bot
 *      (5+ dígitos antes do @, mesma regra da query 3 do docs/sql/016)
 *
 * Tolerante a tabela ausente: se 017 ainda não rodou, a consulta a
 * email_suppressions falha em silêncio e as demais regras continuam valendo.
 */

type Admin = SupabaseClient;

export interface Recipient {
  id: string;
  email: string;
}

const TYPO_DOMAIN = /@(gmil|gmial|gamil|gnail|hotnail|hotmial|yahho|yaho|outlok|outloook)\.(com|com\.br)$/i;
const BOT_LOCAL_PART = /\d{5,}@/;

/** Heurística só de formato. Conservadora: 4 dígitos (ano de nascimento) NÃO bloqueia. */
export function isSuspiciousEmail(email: string): boolean {
  const e = email.trim().toLowerCase();
  return TYPO_DOMAIN.test(e) || BOT_LOCAL_PART.test(e);
}

/**
 * Retorna os IDs (de `recipients`) que NÃO devem receber email.
 * Usa no máximo 3 queries, independente do tamanho da lista.
 */
export async function getSuppressedUserIds(admin: Admin, recipients: Recipient[]): Promise<Set<string>> {
  const blocked = new Set<string>();
  if (recipients.length === 0) return blocked;

  const ids = recipients.map((r) => r.id);
  const emails = Array.from(new Set(recipients.map((r) => r.email.trim().toLowerCase())));
  const idByEmail = new Map<string, string[]>();
  for (const r of recipients) {
    const key = r.email.trim().toLowerCase();
    idByEmail.set(key, [...(idByEmail.get(key) ?? []), r.id]);
    if (isSuspiciousEmail(r.email)) blocked.add(r.id);
  }

  const [byUser, byRecipient, byList] = await Promise.all([
    admin.from("sent_emails").select("user_id").in("status", ["bounced", "complained"]).in("user_id", ids),
    admin.from("sent_emails").select("recipient").in("status", ["bounced", "complained"]).in("recipient", emails),
    admin.from("email_suppressions").select("email").in("email", emails),
  ]);

  for (const row of byUser.data ?? []) if (row.user_id) blocked.add(row.user_id);
  for (const row of byRecipient.data ?? []) {
    for (const id of idByEmail.get(String(row.recipient).toLowerCase()) ?? []) blocked.add(id);
  }
  // byList.error (tabela inexistente) é ignorado de propósito
  for (const row of byList.data ?? []) {
    for (const id of idByEmail.get(String(row.email).toLowerCase()) ?? []) blocked.add(id);
  }

  return blocked;
}

export async function isSuppressed(admin: Admin, userId: string, email: string): Promise<boolean> {
  const set = await getSuppressedUserIds(admin, [{ id: userId, email }]);
  return set.has(userId);
}

/** Registra bounce/complaint na lista local (chamado pelo webhook do Resend). */
export async function addSuppression(
  admin: Admin,
  email: string,
  reason: "bounced" | "complained",
  userId: string | null,
  detail: Record<string, unknown> = {}
): Promise<void> {
  const { error } = await admin.from("email_suppressions").upsert(
    { email: email.trim().toLowerCase(), reason, user_id: userId, detail },
    { onConflict: "email" }
  );
  if (error) console.error("[email-suppression] upsert error:", error.message);
}
