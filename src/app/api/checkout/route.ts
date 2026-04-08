import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const PLANS = {
  dev: {
    title: "FakeForge BR - Plano Dev",
    price: 29,
    description: "10.000 requests/dia, API keys, Schema builder",
  },
  team: {
    title: "FakeForge BR - Plano Team",
    price: 79,
    description: "100.000 requests/dia, Multiplas API keys, Schemas salvos",
  },
};

export async function POST(request: NextRequest) {
  // Get authenticated user
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
    const planId = body.plan as keyof typeof PLANS;
    const plan = PLANS[planId];

    if (!plan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      return NextResponse.json({ error: "Payment not configured" }, { status: 500 });
    }

    const client = new MercadoPagoConfig({ accessToken });
    const preference = new Preference(client);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const result = await preference.create({
      body: {
        items: [
          {
            id: `fakeforge_${planId}`,
            title: plan.title,
            description: plan.description,
            quantity: 1,
            unit_price: plan.price,
            currency_id: "BRL",
          },
        ],
        payer: {
          email: user.email || "",
        },
        back_urls: {
          success: `${baseUrl}/dashboard?payment=success&plan=${planId}`,
          failure: `${baseUrl}/pricing?payment=failed`,
          pending: `${baseUrl}/dashboard?payment=pending&plan=${planId}`,
        },
        auto_return: "approved",
        notification_url: `${baseUrl}/api/webhooks/mercadopago`,
        metadata: {
          user_id: user.id,
          plan: planId,
          user_email: user.email,
        },
        statement_descriptor: "FAKEFORGE BR",
      },
    });

    return NextResponse.json({ checkout_url: result.init_point });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
  }
}
