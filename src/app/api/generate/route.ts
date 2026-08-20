import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { generate, DATA_TYPES, type DataType } from "@/lib/generators";
import { generateSchema, SCHEMA_PRESETS, type SchemaField } from "@/lib/generators/schema";
import { checkRateLimit, getRateLimitHeaders, getMaxQuantity, PLAN_MAX_QUANTITY, PLAN_LIMITS } from "@/lib/rate-limit";
import { resolveApiKey, logApiUsage, logAnonymousUsage } from "@/lib/api-auth";

type EffectivePlan = "anon" | "free" | "dev" | "team";

async function detectWebSessionPlan(): Promise<EffectivePlan> {
  // Detects if the request has a Supabase session cookie. We don't query the
  // subscriptions table here for latency reasons: web users with paid plans
  // typically use API keys for bulk work. Web logged-in users default to "free".
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
    return user ? "free" : "anon";
  } catch {
    return "anon";
  }
}

function getClientIP(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

async function withRateLimit(request: NextRequest): Promise<{
  allowed: boolean;
  headers: Record<string, string>;
  userId: string | null;
  keyId: string | null;
  clientType: "web" | "api_anon" | "api_authed";
  plan: EffectivePlan;
  ip: string;
}> {
  const ip = getClientIP(request);

  // Browser UI requests: skip call-rate limit, but DO detect session plan so
  // per-call quantity cap is enforced. Anonymous web users see 50/call max,
  // logged-in see 100/call. This was the loophole that let anon generate
  // 10,000 items in a single click.
  const isInternalUI = request.headers.get("x-fakeforge-client") === "web";
  if (isInternalUI) {
    const plan = await detectWebSessionPlan();
    return { allowed: true, headers: {}, userId: null, keyId: null, clientType: "web", plan, ip };
  }

  // Check for API key auth
  const apiKeyInfo = await resolveApiKey(request);
  if (apiKeyInfo) {
    const identifier = `key:${apiKeyInfo.keyId}`;
    const result = checkRateLimit(identifier, apiKeyInfo.plan);
    return {
      allowed: result.allowed,
      headers: getRateLimitHeaders(result),
      userId: apiKeyInfo.userId,
      keyId: apiKeyInfo.keyId,
      clientType: "api_authed",
      plan: apiKeyInfo.plan as EffectivePlan,
      ip,
    };
  }

  // Fall back to IP-based rate limiting (anonymous API)
  const result = checkRateLimit(ip, "free");
  return {
    allowed: result.allowed,
    headers: getRateLimitHeaders(result),
    userId: null,
    keyId: null,
    clientType: "api_anon",
    plan: "anon",
    ip,
  };
}

// Enriquece o 429 com contexto suficiente pra dev cliente saber:
// (1) onde ele tá no funil hoje (usado / limite / percent),
// (2) quanto o proximo tier libera (Dev = 200x mais),
// (3) link direto com ref pra rastrear atribuicao no dashboard.
// Sprint Ago P1 - alinha com dashboard hero + QuotaMeter pra virar "pull" e nao CTA vazio.
function buildRateLimitResponse(rateLimit: {
  headers: Record<string, string>;
  plan: EffectivePlan;
}) {
  const limit = Number(rateLimit.headers["X-RateLimit-Limit"]);
  const remaining = Number(rateLimit.headers["X-RateLimit-Remaining"]);
  const used = limit - remaining;
  const percent = limit > 0 ? Math.round((used / limit) * 100) : 100;
  const plan = rateLimit.plan;

  const message =
    plan === "anon" || plan === "free"
      ? `Você usou as ${limit} chamadas do dia no plano ${plan === "anon" ? "anônimo" : "Free"}. Plano Dev libera ${PLAN_LIMITS.dev.toLocaleString("pt-BR")} chamadas/dia por R$29/mês.`
      : plan === "dev"
      ? `Você usou as ${limit.toLocaleString("pt-BR")} chamadas do dia no plano Dev. Plano Team libera ${PLAN_LIMITS.team.toLocaleString("pt-BR")}/dia por R$79/mês.`
      : `Limite de ${limit.toLocaleString("pt-BR")} requisições/dia atingido no plano ${plan}.`;

  return {
    error: "rate_limit_exceeded",
    message,
    your_usage_today: used,
    daily_limit: limit,
    used_percent: percent,
    plan,
    reset_at: rateLimit.headers["X-RateLimit-Reset"],
    upgrade: {
      next_tier: plan === "dev" ? "team" : "dev",
      next_tier_daily_limit: plan === "dev" ? PLAN_LIMITS.team : PLAN_LIMITS.dev,
      multiplier: plan === "dev" ? Math.round(PLAN_LIMITS.team / PLAN_LIMITS.dev) : Math.round(PLAN_LIMITS.dev / limit),
      url: plan === "dev"
        ? "https://fakeforge.com.br/pricing?plan=team&ref=api_429"
        : "https://fakeforge.com.br/pricing?plan=dev&ref=api_429",
    },
    plans: {
      dev: { daily_limit: PLAN_LIMITS.dev, price: "R$29/mês", url: "https://fakeforge.com.br/pricing?plan=dev&ref=api_429" },
      team: { daily_limit: PLAN_LIMITS.team, price: "R$79/mês", url: "https://fakeforge.com.br/pricing?plan=team&ref=api_429" },
    },
  };
}

function quantityExceededResponse(plan: EffectivePlan, requested: number, cap: number, headers: Record<string, string>) {
  return NextResponse.json(
    {
      error: "quantity_limit_exceeded",
      plan,
      requested,
      max_quantity: cap,
      message:
        plan === "anon"
          ? `Plano anônimo limita ${cap} itens por chamada. Faça login (grátis) pra gerar até ${PLAN_MAX_QUANTITY.free}/chamada.`
          : plan === "free"
          ? `Plano Free limita ${cap} itens por chamada. Plano Dev (R$29/mês) libera ${PLAN_MAX_QUANTITY.dev}/chamada.`
          : `Seu plano (${plan}) limita ${cap} itens por chamada.`,
      upgrade: {
        free: { max_quantity: PLAN_MAX_QUANTITY.free, action: "Criar conta grátis", url: "https://fakeforge.com.br/login" },
        dev: { max_quantity: PLAN_MAX_QUANTITY.dev, price: "R$29/mês", url: "https://fakeforge.com.br/pricing?plan=dev" },
        team: { max_quantity: PLAN_MAX_QUANTITY.team, price: "R$79/mês", url: "https://fakeforge.com.br/pricing?plan=team" },
      },
    },
    { status: 400, headers }
  );
}

function logUsage(
  rateLimit: { userId: string | null; keyId: string | null; clientType: "web" | "api_anon" | "api_authed"; ip: string },
  dataType: string,
  qty: number
) {
  // Defer to `after()` so the response goes out first but Vercel waits for
  // the insert to land in Supabase before killing the function. Without this
  // the insert was being dropped post-response and the dashboard saw zero
  // anonymous activity despite real traffic.
  after(async () => {
    if (rateLimit.userId) {
      await logApiUsage(rateLimit.userId, rateLimit.keyId, "/api/generate", dataType, qty);
    } else if (rateLimit.clientType === "web" || rateLimit.clientType === "api_anon") {
      await logAnonymousUsage(rateLimit.clientType, rateLimit.ip, dataType, qty);
    }
  });
}

export async function POST(request: NextRequest) {
  const rateLimit = await withRateLimit(request);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      buildRateLimitResponse(rateLimit),
      { status: 429, headers: { ...rateLimit.headers, "X-RateLimit-Upgrade": "https://fakeforge.com.br/pricing" } }
    );
  }

  try {
    const body = await request.json();

    const cap = getMaxQuantity(rateLimit.plan);

    // Schema mode
    if (body.schema) {
      const fields = body.schema as SchemaField[];
      const requested = Math.max(1, Number(body.quantity || 10));
      if (requested > cap) return quantityExceededResponse(rateLimit.plan, requested, cap, rateLimit.headers);
      const qty = Math.min(requested, cap);
      const format = body.format || "json";
      const data = generateSchema(fields, qty);
      return formatResponse(data, "schema", qty, format, rateLimit.headers);
    }

    // Preset mode
    if (body.preset) {
      const preset = SCHEMA_PRESETS[body.preset as keyof typeof SCHEMA_PRESETS];
      if (!preset) {
        return NextResponse.json(
          { error: "Invalid preset", validPresets: Object.keys(SCHEMA_PRESETS) },
          { status: 400, headers: rateLimit.headers }
        );
      }
      const requested = Math.max(1, Number(body.quantity || 10));
      if (requested > cap) return quantityExceededResponse(rateLimit.plan, requested, cap, rateLimit.headers);
      const qty = Math.min(requested, cap);
      const format = body.format || "json";
      const data = generateSchema(preset, qty);
      return formatResponse(data, body.preset, qty, format, rateLimit.headers);
    }

    // Standard mode
    const { type, quantity = 10, formatted = true, format = "json" } = body;

    if (!type || !DATA_TYPES.find((t) => t.value === type)) {
      return NextResponse.json(
        { error: "Invalid type", validTypes: DATA_TYPES.map((t) => t.value) },
        { status: 400, headers: rateLimit.headers }
      );
    }

    const requested = Math.max(1, Number(quantity));
    if (requested > cap) return quantityExceededResponse(rateLimit.plan, requested, cap, rateLimit.headers);
    const qty = Math.min(requested, cap);
    const data = generate({ type: type as DataType, quantity: qty, formatted });
    logUsage(rateLimit, type, qty);
    return formatResponse(data, type, qty, format, rateLimit.headers);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  const rateLimit = await withRateLimit(request);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      buildRateLimitResponse(rateLimit),
      { status: 429, headers: { ...rateLimit.headers, "X-RateLimit-Upgrade": "https://fakeforge.com.br/pricing" } }
    );
  }

  const params = request.nextUrl.searchParams;
  const type = params.get("type");
  const preset = params.get("preset");
  const quantity = Number(params.get("quantity") || "10");
  const formatted = params.get("formatted") !== "false";

  const cap = getMaxQuantity(rateLimit.plan);

  // Preset mode via GET
  if (preset) {
    const schema = SCHEMA_PRESETS[preset as keyof typeof SCHEMA_PRESETS];
    if (!schema) {
      return NextResponse.json(
        { error: "Invalid preset", validPresets: Object.keys(SCHEMA_PRESETS) },
        { status: 400, headers: rateLimit.headers }
      );
    }
    const requested = Math.max(1, quantity);
    if (requested > cap) return quantityExceededResponse(rateLimit.plan, requested, cap, rateLimit.headers);
    const qty = Math.min(requested, cap);
    const data = generateSchema(schema, qty);
    logUsage(rateLimit, `preset:${preset}`, qty);
    return NextResponse.json({ preset, quantity: qty, data }, { headers: rateLimit.headers });
  }

  if (!type || !DATA_TYPES.find((t) => t.value === type)) {
    return NextResponse.json({
      message: "FakeForge BR API - Brazilian Test Data Generator",
      version: "0.3.0",
      usage: {
        single: "GET /api/generate?type=cpf&quantity=10",
        preset: "GET /api/generate?preset=customer&quantity=5",
        schema: "POST /api/generate with { schema: [...], quantity: 10 }",
      },
      types: DATA_TYPES.map((t) => ({ value: t.value, label: t.label, description: t.description })),
      presets: Object.keys(SCHEMA_PRESETS),
      limits: {
        maxQuantityPerCall: PLAN_MAX_QUANTITY,
        callsPerDay: { anon: 50, free: 50, dev: 10000, team: 100000 },
      },
    }, { headers: rateLimit.headers });
  }

  const requested = Math.max(1, quantity);
  if (requested > cap) return quantityExceededResponse(rateLimit.plan, requested, cap, rateLimit.headers);
  const qty = Math.min(requested, cap);
  const data = generate({ type: type as DataType, quantity: qty, formatted });
  logUsage(rateLimit, type, qty);
  return NextResponse.json({ type, quantity: qty, data }, { headers: rateLimit.headers });
}

function formatResponse(
  data: unknown[], tableName: string, qty: number, format: string, headers: Record<string, string>
): NextResponse {
  if (format === "csv") {
    return new NextResponse(toCSV(data), {
      headers: { ...headers, "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename=${tableName}_${qty}.csv` },
    });
  }
  if (format === "sql") {
    const safeTable = tableName.replace(/[^a-zA-Z0-9_]/g, "");
    return new NextResponse(toSQL(data, safeTable), {
      headers: { ...headers, "Content-Type": "text/plain; charset=utf-8", "Content-Disposition": `attachment; filename=${safeTable}_${qty}.sql` },
    });
  }
  return NextResponse.json({ type: tableName, quantity: qty, data }, { headers });
}

function toCSV(data: unknown[]): string {
  if (data.length === 0) return "";
  const first = data[0];
  if (typeof first === "string") return "value\n" + data.join("\n");
  if (typeof first === "object" && first !== null) {
    const headers = flattenKeys(first as Record<string, unknown>);
    const rows = data.map((item) => {
      const flat = flattenObject(item as Record<string, unknown>);
      return headers.map((h) => {
        const val = flat[h];
        if (typeof val === "string" && (val.includes(",") || val.includes('"'))) return `"${val.replace(/"/g, '""')}"`;
        return val ?? "";
      }).join(",");
    });
    return headers.join(",") + "\n" + rows.join("\n");
  }
  return "value\n" + data.join("\n");
}

function toSQL(data: unknown[], tableName: string): string {
  if (data.length === 0) return "";
  const first = data[0];
  if (typeof first === "string") return data.map((v) => `INSERT INTO ${tableName} (value) VALUES ('${v}');`).join("\n");
  if (typeof first === "object" && first !== null) {
    const flat = flattenObject(first as Record<string, unknown>);
    const columns = Object.keys(flat);
    const createTable = `CREATE TABLE IF NOT EXISTS ${tableName} (\n  id SERIAL PRIMARY KEY,\n${columns.map((c) => `  ${c.replace(/\./g, "_")} VARCHAR(255)`).join(",\n")}\n);\n\n`;
    const inserts = data.map((item) => {
      const f = flattenObject(item as Record<string, unknown>);
      const values = columns.map((c) => {
        const v = f[c];
        if (v === null || v === undefined) return "NULL";
        return `'${String(v).replace(/'/g, "''")}'`;
      });
      return `INSERT INTO ${tableName} (${columns.map(c => c.replace(/\./g, "_")).join(", ")}) VALUES (${values.join(", ")});`;
    });
    return createTable + inserts.join("\n");
  }
  return data.map((v) => `INSERT INTO ${tableName} (value) VALUES ('${v}');`).join("\n");
}

function flattenObject(obj: Record<string, unknown>, prefix = ""): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}_${key}` : key;
    const val = obj[key];
    if (val !== null && typeof val === "object" && !Array.isArray(val)) {
      Object.assign(result, flattenObject(val as Record<string, unknown>, fullKey));
    } else {
      result[fullKey] = val;
    }
  }
  return result;
}

function flattenKeys(obj: Record<string, unknown>, prefix = ""): string[] {
  const keys: string[] = [];
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}_${key}` : key;
    const val = obj[key];
    if (val !== null && typeof val === "object" && !Array.isArray(val)) {
      keys.push(...flattenKeys(val as Record<string, unknown>, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}
