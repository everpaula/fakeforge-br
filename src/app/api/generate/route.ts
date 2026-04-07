import { NextRequest, NextResponse } from "next/server";
import { generate, DATA_TYPES, type DataType } from "@/lib/generators";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, quantity = 10, formatted = true, format = "json" } = body;

    if (!type || !DATA_TYPES.find((t) => t.value === type)) {
      return NextResponse.json(
        { error: "Invalid type", validTypes: DATA_TYPES.map((t) => t.value) },
        { status: 400 }
      );
    }

    const qty = Math.min(Math.max(1, Number(quantity)), 10000);
    const data = generate({ type: type as DataType, quantity: qty, formatted });

    if (format === "csv") {
      const csv = toCSV(data);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename=${type}_${qty}.csv`,
        },
      });
    }

    if (format === "sql") {
      const sql = toSQL(data, type);
      return new NextResponse(sql, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Content-Disposition": `attachment; filename=${type}_${qty}.sql`,
        },
      });
    }

    return NextResponse.json({ type, quantity: qty, data });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const type = params.get("type");
  const quantity = Number(params.get("quantity") || "10");
  const formatted = params.get("formatted") !== "false";

  if (!type || !DATA_TYPES.find((t) => t.value === type)) {
    return NextResponse.json({
      message: "Test Data Generator API - Brazilian Data",
      usage: "GET /api/generate?type=cpf&quantity=10&formatted=true",
      types: DATA_TYPES.map((t) => ({ value: t.value, label: t.label, description: t.description })),
    });
  }

  const qty = Math.min(Math.max(1, quantity), 10000);
  const data = generate({ type: type as DataType, quantity: qty, formatted });

  return NextResponse.json({ type, quantity: qty, data });
}

function toCSV(data: unknown[]): string {
  if (data.length === 0) return "";

  const first = data[0];
  if (typeof first === "string") {
    return "value\n" + data.join("\n");
  }

  if (typeof first === "object" && first !== null) {
    const obj = first as Record<string, unknown>;
    const headers = flattenKeys(obj);
    const rows = data.map((item) => {
      const flat = flattenObject(item as Record<string, unknown>);
      return headers.map((h) => {
        const val = flat[h];
        if (typeof val === "string" && (val.includes(",") || val.includes('"'))) {
          return `"${val.replace(/"/g, '""')}"`;
        }
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
  if (typeof first === "string") {
    return data.map((v) => `INSERT INTO ${tableName} (value) VALUES ('${v}');`).join("\n");
  }

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
