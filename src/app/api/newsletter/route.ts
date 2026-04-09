import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }

  const supabase = await createServerSupabase();

  const { error } = await supabase
    .from("newsletter_subscribers")
    .upsert({ email: email.toLowerCase() }, { onConflict: "email" });

  if (error) {
    return NextResponse.json({ error: "Erro ao salvar" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
