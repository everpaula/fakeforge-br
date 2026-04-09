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

async function getAuthenticatedUser(request: NextRequest) {
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

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  // Check if user is admin
  const admin = getAdminSupabase();
  const { data: isAdmin } = await admin
    .from("admins")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!isAdmin) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // Fetch all metrics in parallel
  const [metrics, usageByType, usersDaily, apiDaily, subscribers] = await Promise.all([
    admin.from("admin_metrics").select("*").single(),
    admin.from("admin_usage_by_type").select("*"),
    admin.from("admin_users_daily").select("*"),
    admin.from("admin_api_daily").select("*"),
    admin.from("admin_subscribers").select("*"),
  ]);

  return NextResponse.json({
    metrics: metrics.data,
    usageByType: usageByType.data || [],
    usersDaily: usersDaily.data || [],
    apiDaily: apiDaily.data || [],
    subscribers: subscribers.data || [],
  });
}
