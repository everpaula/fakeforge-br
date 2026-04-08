import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

interface ApiKeyInfo {
  userId: string;
  keyId: string;
  plan: "free" | "dev" | "team";
}

// Service role client for API key lookups (bypasses RLS)
function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

/**
 * Resolves API key from request header to user info and plan.
 * Returns null if no API key provided or invalid.
 */
export async function resolveApiKey(request: NextRequest): Promise<ApiKeyInfo | null> {
  const apiKey = request.headers.get("x-api-key");
  if (!apiKey || !apiKey.startsWith("ff_")) return null;

  const supabase = getAdminSupabase();
  if (!supabase) return null;

  // Look up the API key
  const { data: keyData } = await supabase
    .from("api_keys")
    .select("id, user_id")
    .eq("key", apiKey)
    .eq("is_active", true)
    .single();

  if (!keyData) return null;

  // Update last_used_at
  await supabase
    .from("api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", keyData.id);

  // Get user's plan
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan")
    .eq("user_id", keyData.user_id)
    .eq("status", "active")
    .single();

  const plan = (sub?.plan as "free" | "dev" | "team") || "free";

  return { userId: keyData.user_id, keyId: keyData.id, plan };
}

/**
 * Log API usage for tracking.
 */
export async function logApiUsage(
  userId: string | null,
  keyId: string | null,
  endpoint: string,
  dataType: string,
  quantity: number
) {
  const supabase = getAdminSupabase();
  if (!supabase || !userId) return;

  await supabase.from("api_usage").insert({
    user_id: userId,
    api_key_id: keyId,
    endpoint,
    data_type: dataType,
    quantity,
  });
}
