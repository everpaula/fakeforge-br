import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { JWT } from "google-auth-library";

/**
 * Cron diario: submete URLs novas/mudadas pro Google Indexing API.
 *
 * Logica:
 * 1. Baixa sitemap.xml (fonte de verdade do que existe)
 * 2. Diff vs public.indexing_submissions (dedup — nao resubmete em menos de 30d)
 * 3. Submete ate 100 URLs/dia (metade da cota diaria do Indexing API)
 * 4. Grava resultado em indexing_submissions pra dedup futuro
 *
 * Requer env vars na Vercel:
 *   GOOGLE_INDEXING_SA_EMAIL = email do service account
 *   GOOGLE_INDEXING_SA_KEY = private_key do JSON do service account (com \n escapado)
 *
 * Schedule: 1x por dia (vercel.json) 06:00 UTC.
 * Teste manual:
 *   curl -H "Authorization: Bearer $CRON_SECRET" https://fakeforge.com.br/api/cron/submit-new-urls
 */

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 min pra batches grandes

const DAILY_CAP = 100;
const DEDUP_WINDOW_DAYS = 30;

function verifyCronRequest(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) return true;
  if (request.headers.get("x-vercel-cron") === "1") return true;
  return false;
}

function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function fetchSitemapUrls(): Promise<string[]> {
  const res = await fetch("https://fakeforge.com.br/sitemap.xml", {
    headers: { "User-Agent": "FakeForge-IndexingBot/1.0" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`sitemap fetch ${res.status}`);
  const xml = await res.text();
  const matches = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g));
  return matches.map((m) => m[1].trim()).filter(Boolean);
}

async function getRecentlySubmittedUrls(admin: ReturnType<typeof getAdminSupabase>): Promise<Set<string>> {
  const cutoff = new Date(Date.now() - DEDUP_WINDOW_DAYS * 86400 * 1000).toISOString();
  const { data, error } = await admin
    .from("indexing_submissions")
    .select("url")
    .eq("engine", "google")
    .in("result_type", ["URL_UPDATED", "URL_DELETED"])
    .gte("submitted_at", cutoff);
  if (error) {
    console.error("[submit-new-urls] supabase read error:", error.message);
    return new Set();
  }
  return new Set((data || []).map((r) => r.url as string));
}

async function submitToGoogle(urls: string[]): Promise<Array<{ url: string; result_type?: string; error?: string }>> {
  const email = process.env.GOOGLE_INDEXING_SA_EMAIL;
  const key = process.env.GOOGLE_INDEXING_SA_KEY?.replace(/\\n/g, "\n");
  if (!email || !key) {
    throw new Error("Missing GOOGLE_INDEXING_SA_EMAIL or GOOGLE_INDEXING_SA_KEY env vars");
  }
  const client = new JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/indexing"],
  });
  const tokenResp = await client.getAccessToken();
  const token = tokenResp.token;
  if (!token) throw new Error("Failed to get access token");

  const results: Array<{ url: string; result_type?: string; error?: string }> = [];
  for (const url of urls) {
    try {
      const r = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, type: "URL_UPDATED" }),
      });
      if (r.ok) {
        results.push({ url, result_type: "URL_UPDATED" });
      } else {
        const body = await r.text();
        results.push({ url, error: `HTTP ${r.status}: ${body.slice(0, 200)}` });
      }
    } catch (e: unknown) {
      results.push({ url, error: e instanceof Error ? e.message : String(e) });
    }
    // small pause to be gentle
    await new Promise((r) => setTimeout(r, 50));
  }
  return results;
}

export async function GET(request: NextRequest) {
  if (!verifyCronRequest(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const admin = getAdminSupabase();

  const [sitemapUrls, alreadySubmitted] = await Promise.all([
    fetchSitemapUrls(),
    getRecentlySubmittedUrls(admin),
  ]);

  const candidates = sitemapUrls.filter((u) => !alreadySubmitted.has(u));
  const toSubmit = candidates.slice(0, DAILY_CAP);

  if (toSubmit.length === 0) {
    return NextResponse.json({
      ok: true,
      sitemap_urls: sitemapUrls.length,
      already_submitted: alreadySubmitted.size,
      submitted_today: 0,
      note: "nothing new to submit",
    });
  }

  let results: Array<{ url: string; result_type?: string; error?: string }>;
  try {
    results = await submitToGoogle(toSubmit);
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }

  // Batch insert tracking
  const rows = results.map((r) => ({
    url: r.url,
    engine: "google",
    result_type: r.result_type || "error",
    error_message: r.error || null,
  }));
  await admin.from("indexing_submissions").insert(rows);

  const succeeded = results.filter((r) => r.result_type).length;
  const failed = results.length - succeeded;

  return NextResponse.json({
    ok: true,
    sitemap_urls: sitemapUrls.length,
    already_submitted: alreadySubmitted.size,
    submitted_today: results.length,
    succeeded,
    failed,
    remaining_candidates: Math.max(0, candidates.length - toSubmit.length),
    sample_errors: results.filter((r) => r.error).slice(0, 3),
  });
}
