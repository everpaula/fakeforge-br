"use client";

import { useState, useEffect, useCallback } from "react";

interface Draft {
  id: number;
  recipient_email: string;
  recipient_name: string | null;
  recipient_site: string | null;
  recipient_context: string | null;
  campaign: string;
  subject: string;
  body_text: string;
  from_email: string;
  rationale: string | null;
  priority: number;
  created_at: string;
}

interface InboxData {
  drafts: Draft[];
  counts: Record<string, number>;
}

/**
 * Approval inbox pros outreach drafts. Renderiza no AdminDashboard.
 * - Lista pending drafts com preview completo
 * - Botões Approve (envia via Resend) / Edit / Reject
 * - Batch approve pra campanhas de volume
 * - Idempotência: approved não envia 2 vezes
 */
export default function OutreachInbox() {
  const [data, setData] = useState<InboxData | null>(null);
  const [filter, setFilter] = useState<"pending" | "sent" | "rejected" | "failed">("pending");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editSubject, setEditSubject] = useState("");
  const [editBody, setEditBody] = useState("");
  const [acting, setActing] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/outreach-drafts?status=${filter}`);
    if (res.ok) setData(await res.json());
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  async function handleAction(draftId: number, action: "approve" | "reject") {
    setActing(draftId);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/outreach-drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft_id: draftId, action }),
      });
      const json = await res.json();
      if (res.ok) {
        setMessage(`✓ ${action === "approve" ? "Enviado" : "Rejeitado"} #${draftId}`);
        await load();
      } else {
        setMessage(`✗ ${json.error}`);
      }
    } catch (err) {
      setMessage(`✗ ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setActing(null);
    }
  }

  function startEdit(d: Draft) {
    setEditingId(d.id);
    setEditSubject(d.subject);
    setEditBody(d.body_text);
  }

  async function saveEdit(draftId: number) {
    const res = await fetch("/api/admin/outreach-drafts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ draft_id: draftId, subject: editSubject, body_text: editBody }),
    });
    if (res.ok) {
      setEditingId(null);
      await load();
      setMessage(`✓ Draft #${draftId} atualizado`);
    } else {
      const json = await res.json();
      setMessage(`✗ ${json.error}`);
    }
  }

  if (!data) return null;

  const total = Object.values(data.counts).reduce((a, b) => a + b, 0);
  if (total === 0 && filter === "pending") {
    return (
      <div className="rounded-xl bg-card border border-border p-6 text-center">
        <h2 className="text-sm font-semibold mb-2">Outreach inbox</h2>
        <p className="text-xs text-muted">Nenhum draft pendente. Claude cria drafts aqui conforme pesquisa alvos.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-card border border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-sm font-semibold">Outreach inbox</h2>
          <p className="text-xs text-muted mt-0.5">Approval gate pra emails cold em nome do founder</p>
        </div>
        <div className="flex gap-1">
          {(["pending", "sent", "rejected", "failed"] as const).map((s) => (
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

      {message && (
        <div className="px-6 py-2 bg-primary/10 border-b border-border text-xs text-foreground">{message}</div>
      )}

      {data.drafts.length === 0 ? (
        <p className="px-6 py-8 text-xs text-muted text-center">Nenhum draft em status "{filter}"</p>
      ) : (
        <div className="divide-y divide-border">
          {data.drafts.map((d) => (
            <div key={d.id} className="px-6 py-4">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[10px] font-mono text-muted">#{d.id}</span>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-accent/10 text-accent font-semibold">{d.campaign}</span>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-muted-foreground/10 text-muted-foreground">prio {d.priority}</span>
                  </div>
                  <p className="text-sm font-medium text-foreground truncate">
                    {d.recipient_name ? `${d.recipient_name} · ` : ""}{d.recipient_email}
                  </p>
                  {d.recipient_site && (
                    <p className="text-[11px] text-muted-foreground font-mono truncate">{d.recipient_site}</p>
                  )}
                </div>
                {filter === "pending" && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      disabled={acting === d.id}
                      onClick={() => handleAction(d.id, "approve")}
                      className="text-xs font-semibold px-3 py-1.5 rounded-md bg-success text-white hover:bg-success/80 disabled:opacity-50"
                    >
                      {acting === d.id ? "..." : "Approve + Send"}
                    </button>
                    <button
                      disabled={acting === d.id}
                      onClick={() => startEdit(d)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-md bg-background border border-border hover:bg-card-hover"
                    >
                      Edit
                    </button>
                    <button
                      disabled={acting === d.id}
                      onClick={() => handleAction(d.id, "reject")}
                      className="text-xs font-semibold px-3 py-1.5 rounded-md bg-background border border-border text-danger hover:bg-danger/5"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>

              {d.rationale && (
                <p className="text-[11px] italic text-muted-foreground mb-2 pl-2 border-l-2 border-border">💡 {d.rationale}</p>
              )}

              {editingId === d.id ? (
                <div className="mt-3 space-y-2">
                  <input
                    value={editSubject}
                    onChange={(e) => setEditSubject(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-md bg-background border border-border text-foreground"
                    placeholder="Subject"
                  />
                  <textarea
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    rows={10}
                    className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border text-foreground font-mono"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => saveEdit(d.id)} className="text-xs font-semibold px-3 py-1.5 rounded-md bg-primary text-white hover:bg-primary/80">Save</button>
                    <button onClick={() => setEditingId(null)} className="text-xs px-3 py-1.5 rounded-md bg-background border border-border">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setExpandedId(expandedId === d.id ? null : d.id)}
                    className="text-xs text-primary hover:underline mb-2"
                  >
                    {expandedId === d.id ? "▼" : "▶"} <span className="font-semibold">{d.subject}</span>
                  </button>
                  {expandedId === d.id && (
                    <div className="mt-2 p-3 bg-background rounded-md border border-border">
                      {d.recipient_context && (
                        <p className="text-[11px] text-muted mb-2 pb-2 border-b border-border">
                          <strong>Contexto:</strong> {d.recipient_context}
                        </p>
                      )}
                      <pre className="text-xs text-foreground whitespace-pre-wrap font-sans leading-relaxed">{d.body_text}</pre>
                      <p className="text-[10px] text-muted mt-3 pt-2 border-t border-border">
                        From: {d.from_email}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
