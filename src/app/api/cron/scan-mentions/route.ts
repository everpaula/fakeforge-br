import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Cron semanal: scan web pra novas menções de "fakeforge". Grava em
 * public.brand_mentions com status=pending. User revisa no admin dashboard
 * e decide pedir backlink ou agradecer.
 *
 * Fontes: Google via Bing API (fallback), DuckDuckGo HTML, GitHub search API.
 *
 * Dedup via UNIQUE(url) na tabela. Idempotente — rodar várias vezes no mesmo
 * dia não gera duplicata.
 *
 * Schedule: 1x por semana (vercel.json). Pra testar manualmente:
 *   curl -H "Authorization: Bearer $CRON_SECRET" \
 *        https://fakeforge.com.br/api/cron/scan-mentions
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

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

interface Mention {
  url: string;
  title: string;
  snippet: string;
  source: string;
  query: string;
  has_backlink: boolean;
}

// Fallback: usa a Bing search API via RapidAPI pattern. Como ela exige key
// paga, por enquanto o scan é NOOP a nível de search externo — fica
// documentado o padrão e cronjob fica pronto pra plug-in de API quando
// quiser gastar com SerpAPI/Serper (ambos têm free tier 100 req/mês).
async function searchGoogle(_query: string): Promise<Mention[]> {
  // Placeholder. Pra ativar: configure SERPAPI_KEY ou SERPER_API_KEY
  // Serper: https://serper.dev (2.500 queries free/mês, $0.3/1k depois)
  // SerpAPI: https://serpapi.com (100 queries free/mês)
  const serperKey = process.env.SERPER_API_KEY;
  if (!serperKey) return [];
  try {
    const res = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: { "X-API-KEY": serperKey, "Content-Type": "application/json" },
      body: JSON.stringify({ q: _query, num: 20 }),
    });
    if (!res.ok) return [];
    const data = await res.json();
    const results = (data.organic || []) as Array<{ link: string; title: string; snippet: string }>;
    return results.map((r) => ({
      url: r.link,
      title: r.title,
      snippet: r.snippet,
      source: "google",
      query: _query,
      has_backlink: true, // assume true, verifica depois
    }));
  } catch {
    return [];
  }
}

// GitHub search: código ou issues/discussions que mencionam fakeforge
async function searchGithub(query: string): Promise<Mention[]> {
  try {
    const [codeRes, issueRes] = await Promise.all([
      fetch(`https://api.github.com/search/code?q=${encodeURIComponent(query)}&per_page=10`, {
        headers: {
          Accept: "application/vnd.github+json",
          ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
        },
      }),
      fetch(`https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=10`, {
        headers: { Accept: "application/vnd.github+json" },
      }),
    ]);
    const mentions: Mention[] = [];
    if (codeRes.ok) {
      const data = await codeRes.json();
      for (const item of (data.items || []).slice(0, 10)) {
        mentions.push({
          url: item.html_url,
          title: item.name || "",
          snippet: `in ${item.repository?.full_name || "repo"}`,
          source: "github_code",
          query,
          has_backlink: true,
        });
      }
    }
    if (issueRes.ok) {
      const data = await issueRes.json();
      for (const item of (data.items || []).slice(0, 10)) {
        mentions.push({
          url: item.html_url,
          title: item.title || "",
          snippet: (item.body || "").slice(0, 200),
          source: "github_issue",
          query,
          has_backlink: true,
        });
      }
    }
    return mentions;
  } catch {
    return [];
  }
}

async function searchReddit(query: string): Promise<Mention[]> {
  try {
    const res = await fetch(
      `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&limit=10&sort=new`,
      { headers: { "User-Agent": "FakeForge-BrandMonitor/1.0" } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const children = data?.data?.children || [];
    return children.map((c: { data: { permalink: string; title: string; selftext?: string } }) => ({
      url: `https://www.reddit.com${c.data.permalink}`,
      title: c.data.title || "",
      snippet: (c.data.selftext || "").slice(0, 200),
      source: "reddit",
      query,
      has_backlink: true,
    }));
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  if (!verifyCronRequest(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const admin = getAdminSupabase();

  // Queries. Variantes pra pegar mencao em contextos diferentes.
  const queries = [
    "fakeforge.com.br",
    "fakeforge-br",
    '"fakeforge" npm',
    '"fakeforge" pypi',
    "everpaula/fakeforge-br",
  ];

  const allMentions: Mention[] = [];
  for (const q of queries) {
    const [google, github, reddit] = await Promise.all([
      searchGoogle(q),
      searchGithub(q),
      searchReddit(q),
    ]);
    allMentions.push(...google, ...github, ...reddit);
  }

  // Dedup local pela url
  const seen = new Set<string>();
  const unique: Mention[] = [];
  for (const m of allMentions) {
    if (seen.has(m.url)) continue;
    seen.add(m.url);
    // Filtra lixo: fakeforge.com.br mesmo, PBN domains conhecidos (anchor
    // contem "pbn" ou "backlinks for sale")
    if (m.url.startsWith("https://fakeforge.com.br")) continue;
    if (m.url.startsWith("https://www.fakeforge.com.br")) continue;
    if (/pbn|backlinks? for sale|boost your ranking/i.test(m.title)) continue;
    unique.push(m);
  }

  // Insert em batch, ignora duplicata via ON CONFLICT
  let inserted = 0, skipped = 0;
  for (const m of unique) {
    const { error } = await admin.from("brand_mentions").insert({
      url: m.url,
      title: m.title.slice(0, 500),
      source: m.source,
      snippet: m.snippet.slice(0, 1000),
      query_matched: m.query,
      has_backlink: m.has_backlink,
      status: "pending",
    });
    if (error) {
      // 23505 = unique_violation (dedup), tudo bem
      if (error.code === "23505") skipped++;
      else console.error("[cron scan-mentions] insert error:", error.message);
    } else {
      inserted++;
    }
  }

  return NextResponse.json({
    ok: true,
    queries: queries.length,
    found: unique.length,
    inserted,
    skipped,
    note: process.env.SERPER_API_KEY ? "google_enabled" : "google_disabled_set_SERPER_API_KEY",
  });
}
