const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

export const PLAN_LIMITS: Record<string, number> = {
  free: 50,
  dev: 10000,
  team: 100000,
};

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store. Resets on server restart. Fine for MVP.
// Replace with Redis/Upstash when scaling.
const store = new Map<string, RateLimitEntry>();

// Cleanup old entries every 10 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now > entry.resetAt) store.delete(key);
    }
  }, 10 * 60 * 1000);
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: number;
  plan: string;
}

export function checkRateLimit(identifier: string, plan = "free"): RateLimitResult {
  const limit = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  const now = Date.now();
  const entry = store.get(identifier);

  if (!entry || now > entry.resetAt) {
    store.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: limit - 1, limit, resetAt: now + WINDOW_MS, plan };
  }

  entry.count++;
  const remaining = Math.max(0, limit - entry.count);

  if (entry.count > limit) {
    return { allowed: false, remaining: 0, limit, resetAt: entry.resetAt, plan };
  }

  return { allowed: true, remaining, limit, resetAt: entry.resetAt, plan };
}

export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": new Date(result.resetAt).toISOString(),
    "X-RateLimit-Plan": result.plan,
  };
}
