// Client-side analytics helper. Fire-and-forget, non-blocking.
// Batches events em 3s ou 10 items, o que vier primeiro.
//
// Uso: import { track } from "@/lib/analytics"
// track("copy_button_clicked", { generator_type: "cpf", index: 0 })

interface EventPayload {
  event_type: string;
  session_id?: string;
  user_id?: string | null;
  source_page?: string;
  event_data?: Record<string, unknown>;
}

const SESSION_KEY = "ff_session_id";
const BATCH_INTERVAL = 3000;
const BATCH_MAX = 10;

let queue: EventPayload[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  let sid = window.sessionStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = (crypto.randomUUID?.() || Math.random().toString(36).slice(2)) + "-" + Date.now().toString(36);
    window.sessionStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

function currentPath(): string {
  if (typeof window === "undefined") return "";
  return window.location.pathname + window.location.search;
}

async function flush() {
  if (typeof window === "undefined") return;
  if (queue.length === 0) return;
  const events = queue.splice(0, queue.length);
  flushTimer = null;
  try {
    // sendBeacon é ideal (funciona em unload). fallback pra fetch.
    const body = JSON.stringify({ events });
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/events", blob);
    } else {
      await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      });
    }
  } catch {
    // swallow — analytics não pode quebrar UX
  }
}

function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = setTimeout(flush, BATCH_INTERVAL);
}

export function track(
  eventType: string,
  eventData: Record<string, unknown> = {},
  userId?: string | null
) {
  if (typeof window === "undefined") return;
  queue.push({
    event_type: eventType,
    session_id: getOrCreateSessionId(),
    user_id: userId ?? null,
    source_page: currentPath(),
    event_data: eventData,
  });
  if (queue.length >= BATCH_MAX) {
    void flush();
  } else {
    scheduleFlush();
  }
}

// Flush no beforeunload pra não perder eventos
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    void flush();
  });
  window.addEventListener("pagehide", () => {
    void flush();
  });
}
