import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { hashIp } from "@/lib/api-auth";
import { isSuspiciousEmail } from "@/lib/email-suppression";
import { htmlWaitlistWelcome, textWaitlistWelcome } from "@/lib/email-templates";
import { BUDGETS, INFO_PRODUCTS, isInfoProductId } from "@/lib/info-products";
import { getResend, EMAIL_FROM, EMAIL_REPLY_TO } from "@/lib/resend";

export const dynamic = "force-dynamic";

const BASE_URL = "https://fakeforge.com.br";

interface WaitlistPayload {
  email?: string;
  product?: string;
  situation?: string;
  budget?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer?: string;
  landing_path?: string;
  honeypot?: string;
}

function clip(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

function getClientIP(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(request: NextRequest) {
  let body: WaitlistPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida" }, { status: 400 });
  }

  // Honeypot: bot preenche, humano nunca vê. Responde ok pra não dar sinal.
  if (body.honeypot?.trim()) {
    return NextResponse.json({ ok: true });
  }

  if (!isInfoProductId(body.product)) {
    return NextResponse.json({ error: "Produto inválido" }, { status: 400 });
  }
  const product = INFO_PRODUCTS[body.product];

  const email = clip(body.email, 254)?.toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }
  if (isSuspiciousEmail(email)) {
    return NextResponse.json(
      { error: "Esse email parece ter erro de digitação. Confere o domínio e tenta de novo." },
      { status: 400 }
    );
  }

  const situation = product.situations.find((s) => s.value === body.situation)?.value ?? null;
  const budget = BUDGETS.find((b) => b.value === body.budget)?.value ?? null;

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // ignoreDuplicates devolve [] quando o email já estava na lista desse produto,
  // o que evita reenviar o email de boas-vindas a cada resubmit.
  const { data: inserted, error } = await admin
    .from("info_product_leads")
    .upsert(
      {
        email,
        product: product.id,
        situation,
        budget,
        utm_source: clip(body.utm_source, 100),
        utm_medium: clip(body.utm_medium, 100),
        utm_campaign: clip(body.utm_campaign, 100),
        referrer: clip(body.referrer, 300),
        landing_path: clip(body.landing_path, 200),
        ip_hash: hashIp(getClientIP(request)),
      },
      { onConflict: "email,product", ignoreDuplicates: true }
    )
    .select("id");

  if (error) {
    console.error("[waitlist] insert error:", error.message);
    return NextResponse.json({ error: "Não consegui salvar agora. Tenta de novo em instantes." }, { status: 500 });
  }

  if (!inserted?.length) {
    return NextResponse.json({ ok: true, already: true });
  }

  // O lead já está salvo: falha de envio não pode virar erro pro visitante.
  try {
    const { data: suppressed } = await admin
      .from("email_suppressions")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (!suppressed) {
      const template = `waitlist_welcome_${product.id}`;
      const props = {
        pitch: product.emailPitch,
        question: product.emailQuestion,
        teaserLink: product.teaserUrl ? `${BASE_URL}${product.teaserUrl}` : null,
      };
      const result = await getResend().emails.send({
        from: EMAIL_FROM,
        to: email,
        replyTo: EMAIL_REPLY_TO,
        subject: product.emailSubject,
        html: htmlWaitlistWelcome(props),
        text: textWaitlistWelcome(props),
        tags: [{ name: "template", value: template }],
      });

      await admin.from("sent_emails").insert({
        user_id: null,
        template,
        recipient: email,
        resend_id: result.data?.id || null,
        status: result.error ? "failed" : "sent",
        metadata: result.error ? { error: result.error.message } : {},
      });
    }
  } catch (err) {
    console.error("[waitlist] welcome email error:", err);
  }

  return NextResponse.json({ ok: true });
}
