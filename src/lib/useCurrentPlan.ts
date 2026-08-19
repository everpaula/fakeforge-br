"use client";

import { useEffect, useState } from "react";

export type Plan = "anon" | "free" | "dev" | "team";

interface State {
  plan: Plan;
  loading: boolean;
}

// Cache em memória compartilhado entre todos os hooks — evita 1 fetch
// por card. TTL 5 min é suficiente pra sessao típica de geração; se o
// user assinar/deslogar, o refresh pega no proximo mount.
let cache: { plan: Plan; expiresAt: number } | null = null;
const TTL_MS = 5 * 60 * 1000;

let pending: Promise<Plan> | null = null;

async function fetchPlan(): Promise<Plan> {
  if (cache && Date.now() < cache.expiresAt) return cache.plan;
  if (pending) return pending;

  pending = (async () => {
    try {
      const res = await fetch("/api/usage/today");
      const data = await res.json();
      const plan: Plan = data.authenticated ? (data.plan as Plan) || "free" : "anon";
      cache = { plan, expiresAt: Date.now() + TTL_MS };
      return plan;
    } catch {
      return "anon";
    } finally {
      pending = null;
    }
  })();

  return pending;
}

export function useCurrentPlan(): State {
  const [plan, setPlan] = useState<Plan>(cache?.plan ?? "anon");
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    let alive = true;
    fetchPlan().then((p) => {
      if (!alive) return;
      setPlan(p);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  return { plan, loading };
}
