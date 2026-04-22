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

    const accessToken = process.env.MP_ACCESS_TOKEN?.trim();
    if (!accessToken) {
      return NextResponse.json({ error: "Payment not configured" }, { status: 500 });
    }

    const client = new MercadoPagoConfig({ accessToken });
    const preference = new Preference(client);

    const rawBaseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim() || "http://localhost:3000";
    // Normalize: strip trailing slash, force https for non-localhost
    let baseUrl = rawBaseUrl.replace(/\/$/, "");
    const isLocalhost = baseUrl.includes("localhost") || baseUrl.includes("127.0.0.1");
    if (!isLocalhost && baseUrl.startsWith("http://")) {
      baseUrl = baseUrl.replace("http://", "https://");
    }

    // Build preference body. MP rejects back_urls with query strings when
    // auto_return is set, so we use clean paths and let dashboard detect state.
    const preferenceBody: Parameters<typeof preference.create>[0]["body"] = {
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
      ...(isLocalhost ? {} : {
        back_urls: {
          success: `${baseUrl}/dashboard`,
          failure: `${baseUrl}/pricing`,
          pending: `${baseUrl}/dashboard`,
        },
        auto_return: "approved" as const,
      }),
      metadata: {
        user_id: user.id,
        plan: planId,
        user_email: user.email,
      },
      statement_descriptor: "FAKEFORGE BR",
    };

    // MP rejects localhost notification URLs
    if (!isLocalhost) {
      preferenceBody.notification_url = `${baseUrl}/api/webhooks/mercadopago`;
    }

    const result = await preference.create({ body: preferenceBody });

    if (!result.init_point) {
      console.error("MP response missing init_point:", JSON.stringify(result).slice(0, 500));
      return NextResponse.json({ error: "Checkout URL não gerada pelo Mercado Pago" }, { status: 500 });
    }

    return NextResponse.json({ checkout_url: result.init_point });
  } catch (error: unknown) {
    let errMsg = "Erro desconhecido";
    if (error instanceof Error) {
      errMsg = error.message;
    } else if (typeof error === "object" && error !== null) {
      errMsg = JSON.stringify(error);
    } else {
      errMsg = String(error);
    }
    console.error("Checkout error:", errMsg);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
