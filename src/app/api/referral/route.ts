// Records a referral when a new user signs up via ?ref=USER_ID
// Called from client immediately after successful signup.

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  // Identify the referred user (must be authenticated)
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
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  // Get referrer ID from request body (sent by client from cookie)
  const body = await request.json().catch(() => ({}));
  const referrerId = String(body.referrerId || "").trim();
  if (!referrerId || referrerId === user.id) {
    return NextResponse.json({ ok: true, skipped: "self-referral or empty" });
  }

  const admin = getAdminSupabase();

  // Verify referrer exists
  const { data: referrer } = await admin.auth.admin.getUserById(referrerId);
  if (!referrer?.user) {
    return NextResponse.json({ ok: true, skipped: "invalid referrer" });
  }

  // Insert referral (UNIQUE constraint on referred_user_id prevents duplicates)
  const { error } = await admin.from("referrals").insert({
    referrer_user_id: referrerId,
    referred_user_id: user.id,
    status: "pending",
  });

  if (error && !error.message.includes("duplicate")) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, registered: true });
}

// GET — list referrals for current user (the affiliate)
export async function GET(request: NextRequest) {
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
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const admin = getAdminSupabase();
  const { data: refs } = await admin
    .from("referrals")
    .select("status, plan, monthly_commission_brl, total_paid_brl, created_at, converted_at")
    .eq("referrer_user_id", user.id)
    .order("created_at", { ascending: false });

  const stats = {
    total: refs?.length || 0,
    pending: refs?.filter(r => r.status === "pending").length || 0,
    converted: refs?.filter(r => r.status === "converted").length || 0,
    churned: refs?.filter(r => r.status === "churned").length || 0,
    monthly_recurring: refs?.filter(r => r.status === "converted")
      .reduce((sum, r) => sum + Number(r.monthly_commission_brl || 0), 0) || 0,
    total_earned: refs?.reduce((sum, r) => sum + Number(r.total_paid_brl || 0), 0) || 0,
  };

  // Suppress unused imports — request not needed for GET, kept for symmetry
  void request;

  return NextResponse.json({ stats, referrals: refs || [] });
}
