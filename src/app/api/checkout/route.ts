import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getStripe, STRIPE_PRICE_IDS, type StripePlan } from "@/lib/stripe";

function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
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
  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const plan = body.plan as StripePlan;

    if (plan !== "dev" && plan !== "team") {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const priceId = STRIPE_PRICE_IDS[plan];
    if (!priceId) {
      return NextResponse.json({ error: "Price not configured" }, { status: 500 });
    }

    const rawBaseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim() || "https://fakeforge.com.br";
    const baseUrl = rawBaseUrl.replace(/\/$/, "");

    // Reusa Stripe customer se já existir pro user (evita duplicar customers)
    let stripeCustomerId: string | undefined;
    const admin = getAdminSupabase();
    const { data: existing } = await admin
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .not("stripe_customer_id", "is", null)
      .single();
    if (existing?.stripe_customer_id) {
      stripeCustomerId = existing.stripe_customer_id;
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      ...(stripeCustomerId
        ? { customer: stripeCustomerId }
        : { customer_email: user.email || undefined }),
      client_reference_id: user.id,
      subscription_data: {
        metadata: {
          user_id: user.id,
          plan,
          user_email: user.email || "",
        },
      },
      metadata: {
        user_id: user.id,
        plan,
        user_email: user.email || "",
      },
      success_url: `${baseUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing?canceled=1`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      locale: "pt-BR",
    });

    if (!session.url) {
      console.error("Stripe session missing URL:", session.id);
      return NextResponse.json({ error: "Checkout URL não gerada pelo Stripe" }, { status: 500 });
    }

    return NextResponse.json({ checkout_url: session.url });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Stripe checkout error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
