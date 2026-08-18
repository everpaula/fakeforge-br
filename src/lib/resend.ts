import { Resend } from "resend";

let resendInstance: Resend | null = null;

export function getResend(): Resend {
  if (resendInstance) return resendInstance;
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY not configured");
  resendInstance = new Resend(key);
  return resendInstance;
}

export const EMAIL_FROM = "Everton do FakeForge <hey@fakeforge.com.br>";
export const EMAIL_REPLY_TO = "contato@fakeforge.com.br";
