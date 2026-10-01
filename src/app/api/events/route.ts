import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { hashIp } from "@/lib/api-auth";

// Aceita batch de até 20 eventos por request. Fire-and-forget do lado
// do client (não bloqueia UX). Server insere via after() pra não
// segurar a resposta.

interface EventInput {
  event_type: string;
  session_id?: string;
  user_id?: string | null;
  source_page?: string;
  event_data?: Record<string, unknown>;
}

// IMPORTANTE: se adicionar novo track() no frontend, adicionar aqui tambem
// ou o event e' descartado silenciosamente (bug do Weekend 3 audit 01/09).
const ALLOWED_TYPES = new Set([
  "page_view",
  "session_start",
  "signup_click",
  "signup_completed",
  "copy_button_clicked",
  "copy_as_clicked",
  "rate_limit_hit",
  "nudge_shown",
  "nudge_clicked",
  "nudge_dismissed",
  "generator_type_touched",
  "generation_success",
  "post_copy_card_shown",
  "post_copy_card_clicked",
  "post_copy_card_dismissed",
  "quota_offer_shown",
  "quota_offer_clicked",
  // Weekend 3 (audit 26/08 fixes) - dashboard hero upsell + first call card
  "dashboard_upsell_shown",
  "dashboard_upsell_clicked",
  "first_call_button_clicked",
  "first_call_success",
  "first_call_failed",
  // Sprint 1 Task 3 (Chief of Staff 13/09) - contextual upsell per user profile
  "usage_profile_card_shown",
  "usage_profile_card_clicked",
  // Sprint 5 F1 (13/09) - FirstCallActivation redesenhado com 3 CTAs
  "first_call_dismissed",
  "first_call_result_copied",
  "first_call_curl_copied",
  "first_call_next_step",
  // Sprint 5 F4 - Onboarding checklist
  "onboarding_step_clicked",
  "onboarding_dismissed",
  // Sprint 7 P1 - reCAPTCHA v3 anti-bot
  "signup_blocked_bot",
  // Bounce rate mitigation (2026-09-28) - typo detection + disposable domain block
  "signup_blocked_disposable",
  "signup_typo_detected", "signup_typo_accepted", "signup_typo_rejected",
  // Sprint 8 - Email funnel D3-D30 + B2B trigger
  "email_d3_sent", "email_d3_opened", "email_d3_clicked_cta",
  "email_d7_sent", "email_d7_opened", "email_d7_clicked_cta",
  "email_d14_sent", "email_d14_opened", "email_d14_clicked_cta",
  "email_d16_sent", "email_d16_opened", "email_d16_clicked_cta",
  "email_d30_retention_sent", "email_d30_digest_sent",
  "checkout_started_from_d3", "checkout_started_from_d7",
  "checkout_started_from_d14", "checkout_started_from_d16",
  "coupon_d14_applied", "coupon_d14_expired_unused",
  "plan_upgraded_dev", "plan_upgraded_team",
  "b2b_lead_flagged", "b2b_calendly_sent", "b2b_calendly_booked",
  "enterprise_inquiry_submitted",
  // Success Metric Card no dashboard (30/09)
  "success_card_shown", "success_card_dismissed", "success_card_clicked",
  // Milestone streak 5 dias no dashboard (30/09)
  "milestone_streak5_shown", "milestone_streak5_clicked", "milestone_streak5_dismissed",
  // Activation fixes (30/09): self-heal de key + snippet curl no dashboard
  // Paywall soft "Copiar como SQL" (01/10): Free bloqueado, Dev/Team baseline
  "copy_sql_blocked_free", "copy_sql_upgrade_clicked", "copy_sql_fallback_json", "copy_sql_unlocked_use",
  "api_key_created", "api_key_auto_created", "api_key_create_failed", "dashboard_curl_copied",
]);

function getClientIP(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  let body: { events?: EventInput[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const events = Array.isArray(body.events) ? body.events.slice(0, 20) : [];
  if (!events.length) {
    return NextResponse.json({ ok: true, inserted: 0 });
  }

  const ip = getClientIP(request);
  const ipHash = hashIp(ip);

  // Enriquece user_id via cookie do Supabase - frontend nao sabe user_id
  // (auth e' via cookie httpOnly), backend sabe. Sem isso, todos os events
  // logados apareciam com user_id=null e nao dava pra correlacionar por user.
  let authedUserId: string | null = null;
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll() { /* read-only */ },
        },
      }
    );
    const { data: { user } } = await supabase.auth.getUser();
    authedUserId = user?.id ?? null;
  } catch {
    // anon - segue com user_id null
  }

  // Filtra + normaliza
  const rows = events
    .filter((e) => e && typeof e.event_type === "string" && ALLOWED_TYPES.has(e.event_type))
    .map((e) => ({
      event_type: e.event_type,
      session_id: typeof e.session_id === "string" ? e.session_id.slice(0, 64) : null,
      user_id: authedUserId ?? (typeof e.user_id === "string" ? e.user_id : null),
      source_page: typeof e.source_page === "string" ? e.source_page.slice(0, 200) : null,
      ip_hash: ipHash,
      event_data: (typeof e.event_data === "object" && e.event_data !== null) ? e.event_data : {},
    }));

  if (!rows.length) {
    return NextResponse.json({ ok: true, inserted: 0, skipped: events.length });
  }

  // Insere depois da resposta (não bloqueia UX)
  after(async () => {
    try {
      const supabase = getAdminSupabase();
      const { error } = await supabase.from("funnel_events").insert(rows);
      if (error) console.error("[api/events] insert error:", error.message);
    } catch (err) {
      console.error("[api/events] handler error:", err);
    }
  });

  return NextResponse.json({ ok: true, accepted: rows.length });
}
