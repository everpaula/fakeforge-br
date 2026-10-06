import { NextRequest, NextResponse } from "next/server";

/**
 * Sprint 7 P1: verifica token do reCAPTCHA v3.
 *
 * reCAPTCHA v3 é invisible + score-based. Retorna float 0.0-1.0 onde
 * 0.0 = provável bot, 1.0 = provável humano. Google recomenda threshold
 * 0.5 pra maioria dos casos.
 *
 * Frontend chama esse endpoint ANTES de fazer signup no Supabase.
 * Se score baixo, endpoint retorna 403 e frontend aborta signup.
 *
 * Env vars necessárias:
 *   NEXT_PUBLIC_RECAPTCHA_SITE_KEY = site key pública (usada no frontend)
 *   RECAPTCHA_SECRET_KEY = secret key privada (verificação servidor)
 *
 * Se as env vars não estiverem setadas, endpoint retorna 200 sempre
 * (feature disabled). Isso permite deploy antes de config de conta Google.
 */

export const dynamic = "force-dynamic";

interface RecaptchaResponse {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
}

// Threshold subido de 0.5 → 0.7 em 06/out. Analise 05/out mostrou 174 bots
// suspeitos (23% da base) passando o filtro. Google docs recomendam 0.5 pra
// maioria dos casos, mas aplicacoes com alvo de fraude (dados brasileiros
// fakes = atrai mta automacao) sobem pra 0.7-0.8. False positive rate em
// humanos reais fica em ~2%, aceitavel vs reducao de ~60% em bots.
const SCORE_THRESHOLD = 0.7;

export async function POST(request: NextRequest) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  // Feature flag: se secret não configurado, permite passar (dev/setup mode)
  if (!secret) {
    return NextResponse.json({ ok: true, disabled: true, score: null });
  }

  const body = await request.json().catch(() => null);
  const token = body?.token;

  if (!token || typeof token !== "string") {
    return NextResponse.json(
      { ok: false, error: "missing_token" },
      { status: 400 }
    );
  }

  try {
    const params = new URLSearchParams();
    params.append("secret", secret);
    params.append("response", token);

    const remoteIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    if (remoteIp) params.append("remoteip", remoteIp);

    const googleResponse = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const data = (await googleResponse.json()) as RecaptchaResponse;

    if (!data.success) {
      console.warn("[recaptcha] verification failed", data["error-codes"]);
      return NextResponse.json(
        { ok: false, error: "verification_failed", codes: data["error-codes"] },
        { status: 403 }
      );
    }

    const score = data.score ?? 0;

    if (score < SCORE_THRESHOLD) {
      console.warn("[recaptcha] low score signup blocked", { score, ip: remoteIp });
      return NextResponse.json(
        { ok: false, error: "score_too_low", score },
        { status: 403 }
      );
    }

    return NextResponse.json({ ok: true, score, action: data.action });
  } catch (err) {
    console.error("[recaptcha] fetch error", err);
    // Em erro de rede com Google, permite passar (fail-open pra não bloquear
    // signup real por infra do Google fora do ar). Bots ainda serão bloqueados
    // no próximo request.
    return NextResponse.json({ ok: true, error: "network_error_fail_open" });
  }
}
