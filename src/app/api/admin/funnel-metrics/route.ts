import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/**
 * Sprint 8 — Métricas do funil de email D3-D30 + B2B trigger.
 *
 * Retorna por template:
 *   - sent (últimos 30d)
 *   - opened (via funnel_events email_dX_opened se instrumentado)
 *   - clicked_cta (via funnel_events email_dX_clicked_cta OR checkout_started_from_dX)
 *   - converted (users que passaram por esse email + tem subscription ativa)
 *
 * Também retorna resumo do funil: sent → open → click → convert.
 */

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function getAuthenticatedUser(request: NextRequest) {
  void request;
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        },
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

const TEMPLATES = [
  { key: "nurture_d3", label: "D3 Hook", eventOpen: "email_d3_opened", eventClick: "email_d3_clicked_cta", checkoutSource: "checkout_started_from_d3" },
  { key: "nurture_d7", label: "D7 Objection", eventOpen: "email_d7_opened", eventClick: "email_d7_clicked_cta", checkoutSource: "checkout_started_from_d7" },
  { key: "nurture_d14", label: "D14 Offer", eventOpen: "email_d14_opened", eventClick: "email_d14_clicked_cta", checkoutSource: "checkout_started_from_d14" },
  { key: "nurture_d16", label: "D16 Last chance", eventOpen: "email_d16_opened", eventClick: "email_d16_clicked_cta", checkoutSource: "checkout_started_from_d16" },
  { key: "nurture_d30_retention", label: "D30 Retention", eventOpen: "email_d30_retention_opened", eventClick: "email_d30_retention_clicked_cta", checkoutSource: null },
  { key: "nurture_d30_digest", label: "D30 Digest", eventOpen: "email_d30_digest_opened", eventClick: "email_d30_digest_clicked_cta", checkoutSource: null },
  { key: "b2b_trigger", label: "B2B Trigger", eventOpen: "b2b_calendly_sent", eventClick: "b2b_calendly_booked", checkoutSource: null },
] as const;

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const admin = getAdminSupabase();
  const { data: isAdmin } = await admin
    .from("admins")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!isAdmin) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const since = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();

  // Fetch sent emails per template (30d)
  const sentCounts: Record<string, number> = {};
  const sentUserIds: Record<string, Set<string>> = {};
  {
    const { data } = await admin
      .from("sent_emails")
      .select("template, user_id, status")
      .gte("sent_at", since)
      .eq("status", "sent")
      .range(0, 9999);
    for (const row of (data || []) as Array<{ template: string; user_id: string }>) {
      sentCounts[row.template] = (sentCounts[row.template] || 0) + 1;
      if (!sentUserIds[row.template]) sentUserIds[row.template] = new Set();
      if (row.user_id) sentUserIds[row.template].add(row.user_id);
    }
  }

  // Fetch funnel events (30d) for opens/clicks/checkout starts
  const eventCounts: Record<string, number> = {};
  {
    let offset = 0;
    for (let i = 0; i < 30; i++) {
      const { data, error } = await admin
        .from("funnel_events")
        .select("event_type")
        .gte("created_at", since)
        .range(offset, offset + 999);
      if (error) break;
      const batch = (data || []) as Array<{ event_type: string }>;
      for (const row of batch) {
        eventCounts[row.event_type] = (eventCounts[row.event_type] || 0) + 1;
      }
      if (batch.length < 1000) break;
      offset += 1000;
    }
  }

  // Fetch paying users (converted)
  const { data: subs } = await admin
    .from("subscriptions")
    .select("user_id, plan, status, created_at")
    .eq("status", "active")
    .in("plan", ["dev", "team"]);
  const payingUserIds = new Set((subs || []).map((s) => s.user_id));

  // Compute per-template metrics
  const perTemplate = TEMPLATES.map((t) => {
    const sent = sentCounts[t.key] || 0;
    const opened = eventCounts[t.eventOpen] || 0;
    const clicked = eventCounts[t.eventClick] || 0;
    const checkoutStarted = t.checkoutSource ? (eventCounts[t.checkoutSource] || 0) : 0;

    // Converted: users que receberam este template E têm sub ativa
    let converted = 0;
    if (sentUserIds[t.key]) {
      for (const uid of sentUserIds[t.key]) {
        if (payingUserIds.has(uid)) converted++;
      }
    }

    const openRate = sent > 0 ? (opened / sent) * 100 : 0;
    const clickRate = opened > 0 ? (clicked / opened) * 100 : (sent > 0 ? (clicked / sent) * 100 : 0);
    const conversionRate = sent > 0 ? (converted / sent) * 100 : 0;

    return {
      key: t.key,
      label: t.label,
      sent,
      opened,
      clicked,
      checkoutStarted,
      converted,
      openRate,
      clickRate,
      conversionRate,
    };
  });

  // Funnel summary (sum across nurture templates only, not B2B)
  const nurtureTemplates = perTemplate.filter((t) => !t.key.startsWith("b2b"));
  const totalSent = nurtureTemplates.reduce((acc, t) => acc + t.sent, 0);
  const totalOpened = nurtureTemplates.reduce((acc, t) => acc + t.opened, 0);
  const totalClicked = nurtureTemplates.reduce((acc, t) => acc + t.clicked, 0);
  const totalConverted = nurtureTemplates.reduce((acc, t) => acc + t.converted, 0);

  // B2B summary
  const b2bTemplate = perTemplate.find((t) => t.key === "b2b_trigger");
  const b2bSent = b2bTemplate?.sent || 0;
  const b2bBooked = eventCounts["b2b_calendly_booked"] || 0;

  return NextResponse.json(
    {
      generated_at: new Date().toISOString(),
      window: "last_30_days",
      summary: {
        total_sent: totalSent,
        total_opened: totalOpened,
        total_clicked: totalClicked,
        total_converted: totalConverted,
        overall_open_rate: totalSent > 0 ? (totalOpened / totalSent) * 100 : 0,
        overall_click_rate: totalSent > 0 ? (totalClicked / totalSent) * 100 : 0,
        overall_conversion_rate: totalSent > 0 ? (totalConverted / totalSent) * 100 : 0,
      },
      b2b: {
        triggers_sent: b2bSent,
        calendly_booked: b2bBooked,
      },
      per_template: perTemplate,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
