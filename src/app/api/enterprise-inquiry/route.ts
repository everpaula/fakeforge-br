import { NextRequest, NextResponse } from "next/server";
import { getResend, EMAIL_FROM, EMAIL_REPLY_TO } from "@/lib/resend";

/**
 * Sprint B2B — endpoint contactless pra Enterprise inquiry.
 *
 * Recebe form de /empresa com dados estruturados, envia:
 *   1. Email pro Everton com lead qualificado
 *   2. Auto-reply pro prospect confirmando recebimento
 *
 * Zero login required. Anti-spam simples: honeypot + rate limit por IP.
 */

export const dynamic = "force-dynamic";

const INTERNAL_EMAIL = "contato@fakeforge.com.br";

interface InquiryPayload {
  nome: string;
  empresa: string;
  email: string;
  tamanho_time: string;
  use_case: string;
  tier_interesse?: string;
  honeypot?: string;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as InquiryPayload;

    // Honeypot: bots preenchem, humano nunca vê
    if (body.honeypot && body.honeypot.trim().length > 0) {
      return NextResponse.json({ ok: true, msg: "obrigado" });
    }

    // Validação
    if (!body.nome?.trim() || !body.empresa?.trim() || !validateEmail(body.email)) {
      return NextResponse.json({ error: "Campos obrigatórios faltando ou email inválido" }, { status: 400 });
    }

    const resend = getResend();
    const nome = body.nome.trim().slice(0, 100);
    const empresa = body.empresa.trim().slice(0, 100);
    const email = body.email.trim().toLowerCase();
    const tamanho = body.tamanho_time?.trim().slice(0, 50) || "não informado";
    const useCase = body.use_case?.trim().slice(0, 500) || "não informado";
    const tier = body.tier_interesse?.trim().slice(0, 50) || "sem preferência";

    // 1. Email interno pro Everton
    const internalHtml = `<h2>Novo Enterprise Inquiry</h2>
<p><strong>Nome:</strong> ${escapeHtml(nome)}</p>
<p><strong>Empresa:</strong> ${escapeHtml(empresa)}</p>
<p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
<p><strong>Tamanho do time:</strong> ${escapeHtml(tamanho)}</p>
<p><strong>Tier de interesse:</strong> ${escapeHtml(tier)}</p>
<h3>Use case:</h3>
<pre style="background:#f5f5f5;padding:12px;border-radius:6px;white-space:pre-wrap;">${escapeHtml(useCase)}</pre>
<hr>
<p style="font-size:11px;color:#666;">Origem: /empresa contactless form · ${new Date().toISOString()}</p>`;

    await resend.emails.send({
      from: EMAIL_FROM,
      to: INTERNAL_EMAIL,
      replyTo: email,
      subject: `[Enterprise] ${empresa} · ${tier}`,
      html: internalHtml,
      text: `Novo Enterprise Inquiry\n\nNome: ${nome}\nEmpresa: ${empresa}\nEmail: ${email}\nTime: ${tamanho}\nTier: ${tier}\n\nUse case:\n${useCase}`,
      tags: [{ name: "template", value: "enterprise_inquiry" }],
    });

    // 2. Auto-reply pro prospect
    const replySubject = `Recebi teu contato, ${nome.split(" ")[0]}`;
    const replyText = `Fala ${nome.split(" ")[0]},

Recebi teu contato sobre FakeForge Enterprise pra ${empresa}. Vou olhar o que você mandou e te respondo em até 24h úteis (geralmente antes).

Se for urgência ou preferir call rápida sem esperar, responde esse email com 2-3 horários que funcionam pra você essa semana e a gente marca 15 min.

Sou fundador solo, então toda mensagem que chega aqui eu leio pessoalmente.

Abraço,
Everton
Fundador FakeForge
fakeforge.com.br
`;

    const replyHtml = `<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;color:#1f2937;">
<p>Fala ${escapeHtml(nome.split(" ")[0])},</p>
<p>Recebi teu contato sobre <strong>FakeForge Enterprise</strong> pra ${escapeHtml(empresa)}. Vou olhar o que você mandou e te respondo em até 24h úteis (geralmente antes).</p>
<p>Se for urgência ou preferir call rápida sem esperar, responde esse email com 2-3 horários que funcionam pra você essa semana e a gente marca 15 min.</p>
<p>Sou fundador solo, então toda mensagem que chega aqui eu leio pessoalmente.</p>
<p>Abraço,<br>Everton<br><em style="color:#6b7280;">Fundador FakeForge</em><br><a href="https://fakeforge.com.br">fakeforge.com.br</a></p>
</div>`;

    await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      replyTo: EMAIL_REPLY_TO,
      subject: replySubject,
      html: replyHtml,
      text: replyText,
      tags: [{ name: "template", value: "enterprise_inquiry_reply" }],
    });

    return NextResponse.json({ ok: true, msg: "Recebido. Auto-reply enviado." });
  } catch (err) {
    console.error("[enterprise-inquiry]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
