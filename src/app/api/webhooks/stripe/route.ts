import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getStripe, PLAN_PRICES_BRL, type StripePlan } from "@/lib/stripe";
import type Stripe from "stripe";

// Stripe webhook precisa do RAW body pra validar assinatura.
// Route handlers do Next 16 permitem via request.text().
export const dynamic = "force-dynamic";

function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

interface SubMetadata {
  user_id?: string;
  plan?: string;
  user_email?: string;
}

async function activateSubscription(sub: Stripe.Subscription, sourceEventId: string) {
  const admin = getAdminSupabase();
  const metadata = sub.metadata as SubMetadata;
  const userId = metadata.user_id;
  const plan = metadata.plan as StripePlan | undefined;

  if (!userId || (plan !== "dev" && plan !== "team")) {
    console.error("[stripe webhook] subscription missing metadata", {
      eventId: sourceEventId,
      subId: sub.id,
      metadata,
    });
    return { error: "missing metadata" };
  }

  const item = sub.items.data[0];
  const periodEnd = item?.current_period_end
    ? new Date(item.current_period_end * 1000).toISOString()
    : new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString();
  const periodStart = item?.current_period_start
    ? new Date(item.current_period_start * 1000).toISOString()
    : new Date().toISOString();

  const { error } = await admin
    .from("subscriptions")
    .upsert(
      {
        user_id: userId,
        plan,
        stripe_customer_id: typeof sub.customer === "string" ? sub.customer : sub.customer.id,
        stripe_subscription_id: sub.id,
        stripe_price_id: item?.price?.id || null,
        mp_payer_email: metadata.user_email || "",
        status: sub.status === "trialing" ? "active" : sub.status,
        current_period_start: periodStart,
        current_period_end: periodEnd,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

  if (error) {
    console.error("[stripe webhook] upsert failed", error);
    return { error: error.message };
  }

  // Converte referral pendente (mesma lógica do MP)
  const COMMISSION_RATE = 0.30;
  const monthlyCommission = PLAN_PRICES_BRL[plan] * COMMISSION_RATE;
  if (monthlyCommission > 0) {
    await admin
      .from("referrals")
      .update({
        status: "converted",
        plan,
        monthly_commission_brl: monthlyCommission,
        converted_at: new Date().toISOString(),
      })
      .eq("referred_user_id", userId)
      .eq("status", "pending");
  }

  return { ok: true, userId, plan };
}

async function markSubscriptionStatus(sub: Stripe.Subscription, newStatus: string) {
  const admin = getAdminSupabase();
  const { error } = await admin
    .from("subscriptions")
    .update({
      status: newStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", sub.id);
  if (error) console.error("[stripe webhook] status update failed", error);
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !secret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const body = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[stripe webhook] signature verification failed:", msg);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription" || !session.subscription) break;
        const subId = typeof session.subscription === "string" ? session.subscription : session.subscription.id;
        const sub = await stripe.subscriptions.retrieve(subId);
        await activateSubscription(sub, event.id);
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        await activateSubscription(sub, event.id);
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await markSubscriptionStatus(sub, "canceled");
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const invoiceWithSub = invoice as unknown as { subscription?: string | Stripe.Subscription };
        if (invoiceWithSub.subscription) {
          const subId = typeof invoiceWithSub.subscription === "string" ? invoiceWithSub.subscription : invoiceWithSub.subscription.id;
          const sub = await stripe.subscriptions.retrieve(subId);
          await markSubscriptionStatus(sub, "past_due");
        }
        break;
      }
      default:
        // Outros eventos são ignorados silenciosamente
        break;
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[stripe webhook] handler error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
