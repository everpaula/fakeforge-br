"use client";

import { useState, useEffect, useCallback } from "react";

interface Mention {
  id: number;
  url: string;
  title: string | null;
  source: string;
  snippet: string | null;
  query_matched: string | null;
  has_backlink: boolean | null;
  status: string;
  found_at: string;
  outreach_draft_id: number | null;
}

interface InboxData {
  mentions: Mention[];
  counts: Record<string, number>;
}

/**
 * Monitor de brand mentions. Cron scan-mentions popula tabela com achados.
 * Admin revisa cada mention e decide:
 * - Create outreach draft "pedir backlink" (gera draft no outreach_drafts)
 * - Ignore (marca ignored)
 */
export default function MentionsInbox() {
  const [data, setData] = useState<InboxData | null>(null);
  const [filter, setFilter] = useState<"pending" | "action_taken" | "ignored">("pending");
  const [acting, setActing] = useState<number | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/mentions?status=${filter}`);
    if (res.ok) setData(await res.json());
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  async function act(mentionId: number, action: "create_outreach" | "ignore") {
    setActing(mentionId);
    setMsg(null);
    const res = await fetch("/api/admin/mentions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mention_id: mentionId, action }),
    });
    const json = await res.json();
    if (res.ok) {
      setMsg(action === "create_outreach" ? `✓ Draft criado (#${json.draft_id}) — edita no Outreach Inbox` : `✓ Ignored`);
      await load();
    } else {
      setMsg(`✗ ${json.error}`);
    }
    setActing(null);
  }

  if (!data) return null;

  const total = Object.values(data.counts).reduce((a, b) => a + b, 0);
  if (total === 0 && filter === "pending") {
    return (
      <div className="rounded-xl bg-card border border-border p-6 text-center">
        <h2 className="text-sm font-semibold mb-2">Brand mentions</h2>
        <p className="text-xs text-muted">Cron weekly scan ainda não encontrou nada. Rode manual via <code className="text-[11px] bg-background px-1.5 py-0.5 rounded">GET /api/cron/scan-mentions</code> com Bearer CRON_SECRET.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-card border border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-sm font-semibold">Brand mentions</h2>
          <p className="text-xs text-muted mt-0.5">Scan semanal via Google (Serper) + GitHub + Reddit · dedup por URL</p>
        </div>
        <div className="flex gap-1">
          {(["pending", "action_taken", "ignored"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-md transition-colors ${filter === s ? "bg-primary text-white" : "bg-background text-muted-foreground hover:text-foreground"}`}
            >
              {s} {data.counts[s] ? `(${data.counts[s]})` : ""}
            </button>
          ))}
        </div>
      </div>

      {msg && (
        <div className="px-6 py-2 bg-primary/10 border-b border-border text-xs text-foreground">{msg}</div>
      )}

      {data.mentions.length === 0 ? (
        <p className="px-6 py-8 text-xs text-muted text-center">Nenhuma mention em status "{filter}"</p>
      ) : (
        <div className="divide-y divide-border">
          {data.mentions.map((m) => (
            <div key={m.id} className="px-6 py-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-accent/10 text-accent font-semibold">{m.source}</span>
                    {m.query_matched && (
                      <span className="text-[9px] text-muted-foreground font-mono">query: {m.query_matched}</span>
                    )}
                    <span className="text-[9px] text-muted-foreground">{new Date(m.found_at).toLocaleDateString("pt-BR")}</span>
                  </div>
                  <a href={m.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline break-all">
                    {m.title || m.url}
                  </a>
                  {m.snippet && (
                    <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 italic">{m.snippet}</p>
                  )}
                </div>
                {filter === "pending" && (
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      disabled={acting === m.id}
                      onClick={() => act(m.id, "create_outreach")}
                      className="text-[11px] font-semibold px-2 py-1 rounded-md bg-success text-white hover:bg-success/80 disabled:opacity-50"
                    >
                      {acting === m.id ? "..." : "Criar draft"}
                    </button>
                    <button
                      disabled={acting === m.id}
                      onClick={() => act(m.id, "ignore")}
                      className="text-[11px] px-2 py-1 rounded-md bg-background border border-border text-muted-foreground hover:text-foreground"
                    >
                      Ignore
                    </button>
                  </div>
                )}
                {filter === "action_taken" && m.outreach_draft_id && (
                  <span className="text-[10px] text-muted shrink-0">
                    draft #{m.outreach_draft_id}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
