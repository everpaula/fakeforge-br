import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { createClient } from "@supabase/supabase-js";

// Use service role key for server-side operations (bypasses RLS)
function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // MP sends notification with type and data.id
    if (body.type !== "payment" || !body.data?.id) {
      return NextResponse.json({ ok: true });
    }

    const accessToken = process.env.MP_ACCESS_TOKEN?.trim();
    if (!accessToken) {
      return NextResponse.json({ error: "Not configured" }, { status: 500 });
    }

    // Fetch payment details from MP
    const client = new MercadoPagoConfig({ accessToken });
    const paymentClient = new Payment(client);
    const payment = await paymentClient.get({ id: body.data.id });

    if (payment.status !== "approved") {
      return NextResponse.json({ ok: true, status: payment.status });
    }

    // Extract metadata
    const metadata = payment.metadata as Record<string, string> | undefined;
    const userId = metadata?.user_id;
    const plan = metadata?.plan;

    if (!userId || !plan) {
      console.error("Webhook: missing metadata", { userId, plan, paymentId: body.data.id });
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    // Activate subscription
    const supabase = getAdminSupabase();
    const periodEnd = new Date();
    periodEnd.setDate(periodEnd.getDate() + 30); // 30 days

    const { error } = await supabase
      .from("subscriptions")
      .upsert({
        user_id: userId,
        plan,
        mp_subscription_id: String(body.data.id),
        mp_payer_email: metadata?.user_email || "",
        status: "active",
        current_period_start: new Date().toISOString(),
        current_period_end: periodEnd.toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: "user_id",
      });

    if (error) {
      console.error("Webhook: failed to upsert subscription", error);
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, plan, userId });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
