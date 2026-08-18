import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { createClient } from "@supabase/supabase-js";
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

  // Filtra + normaliza
  const rows = events
    .filter((e) => e && typeof e.event_type === "string" && ALLOWED_TYPES.has(e.event_type))
    .map((e) => ({
      event_type: e.event_type,
      session_id: typeof e.session_id === "string" ? e.session_id.slice(0, 64) : null,
      user_id: typeof e.user_id === "string" ? e.user_id : null,
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
