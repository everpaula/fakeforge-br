const FREE_LIMIT = 100; // requests per day
const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

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
}

export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: FREE_LIMIT - 1, limit: FREE_LIMIT, resetAt: now + WINDOW_MS };
  }

  entry.count++;
  const remaining = Math.max(0, FREE_LIMIT - entry.count);

  if (entry.count > FREE_LIMIT) {
    return { allowed: false, remaining: 0, limit: FREE_LIMIT, resetAt: entry.resetAt };
  }

  return { allowed: true, remaining, limit: FREE_LIMIT, resetAt: entry.resetAt };
}

export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": new Date(result.resetAt).toISOString(),
  };
}
