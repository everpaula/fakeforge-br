import { NextRequest, NextResponse } from "next/server";
import { generate, DATA_TYPES, type DataType } from "@/lib/generators";
import { generateSchema, SCHEMA_PRESETS, type SchemaField } from "@/lib/generators/schema";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limit";
import { resolveApiKey, logApiUsage } from "@/lib/api-auth";

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
}> {
  // Skip rate limiting for browser requests (same-origin UI)
  const origin = request.headers.get("origin") || "";
  const referer = request.headers.get("referer") || "";
  const isBrowser = origin.includes("localhost") || referer.includes("localhost") ||
    origin.includes("fakeforge") || referer.includes("fakeforge");
  if (isBrowser) return { allowed: true, headers: {}, userId: null, keyId: null };

  // Check for API key auth
  const apiKeyInfo = await resolveApiKey(request);
  if (apiKeyInfo) {
    const identifier = `key:${apiKeyInfo.keyId}`;
    const result = checkRateLimit(identifier, apiKeyInfo.plan);
    return { allowed: result.allowed, headers: getRateLimitHeaders(result), userId: apiKeyInfo.userId, keyId: apiKeyInfo.keyId };
  }

  // Fall back to IP-based rate limiting (free tier)
  const ip = getClientIP(request);
  const result = checkRateLimit(ip, "free");
  return { allowed: result.allowed, headers: getRateLimitHeaders(result), userId: null, keyId: null };
}

export async function POST(request: NextRequest) {
  const rateLimit = await withRateLimit(request);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded.", upgrade: "https://fakeforge.com.br/pricing", plan: rateLimit.headers["X-RateLimit-Plan"] || "free" },
      { status: 429, headers: rateLimit.headers }
    );
  }

  try {
    const body = await request.json();

    // Schema mode
    if (body.schema) {
      const fields = body.schema as SchemaField[];
      const qty = Math.min(Math.max(1, Number(body.quantity || 10)), 10000);
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
      const qty = Math.min(Math.max(1, Number(body.quantity || 10)), 10000);
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

    const qty = Math.min(Math.max(1, Number(quantity)), 10000);
    const data = generate({ type: type as DataType, quantity: qty, formatted });
    return formatResponse(data, type, qty, format, rateLimit.headers);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  const rateLimit = await withRateLimit(request);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded.", upgrade: "https://fakeforge.com.br/pricing" },
      { status: 429, headers: rateLimit.headers }
    );
  }

  const params = request.nextUrl.searchParams;
  const type = params.get("type");
  const preset = params.get("preset");
  const quantity = Number(params.get("quantity") || "10");
  const formatted = params.get("formatted") !== "false";

  // Preset mode via GET
  if (preset) {
    const schema = SCHEMA_PRESETS[preset as keyof typeof SCHEMA_PRESETS];
    if (!schema) {
      return NextResponse.json(
        { error: "Invalid preset", validPresets: Object.keys(SCHEMA_PRESETS) },
        { status: 400, headers: rateLimit.headers }
      );
    }
    const qty = Math.min(Math.max(1, quantity), 10000);
    const data = generateSchema(schema, qty);
    return NextResponse.json({ preset, quantity: qty, data }, { headers: rateLimit.headers });
  }

  if (!type || !DATA_TYPES.find((t) => t.value === type)) {
    return NextResponse.json({
      message: "FakeForge BR API - Brazilian Test Data Generator",
      version: "0.2.0",
      usage: {
        single: "GET /api/generate?type=cpf&quantity=10",
        preset: "GET /api/generate?preset=customer&quantity=5",
        schema: "POST /api/generate with { schema: [...], quantity: 10 }",
      },
      types: DATA_TYPES.map((t) => ({ value: t.value, label: t.label, description: t.description })),
      presets: Object.keys(SCHEMA_PRESETS),
      limits: { maxQuantity: 10000, freeApiCalls: "100/day" },
    }, { headers: rateLimit.headers });
  }

  const qty = Math.min(Math.max(1, quantity), 10000);
  const data = generate({ type: type as DataType, quantity: qty, formatted });
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
    return new NextResponse(toSQL(data, tableName), {
      headers: { ...headers, "Content-Type": "text/plain; charset=utf-8", "Content-Disposition": `attachment; filename=${tableName}_${qty}.sql` },
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
