import Stripe from "stripe";

// Singleton Stripe client. Init lazy pra permitir build sem env var.
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (stripeInstance) return stripeInstance;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not configured");
  stripeInstance = new Stripe(key, {
    apiVersion: "2026-07-29.dahlia",
    typescript: true,
  });
  return stripeInstance;
}

export const STRIPE_PRICE_IDS = {
  dev: process.env.STRIPE_PRICE_DEV || "",
  team: process.env.STRIPE_PRICE_TEAM || "",
  // Sprint B2B — Enterprise tiers self-serve
  "enterprise-starter": process.env.STRIPE_PRICE_ENTERPRISE_STARTER || "",
  "enterprise-growth": process.env.STRIPE_PRICE_ENTERPRISE_GROWTH || "",
  "enterprise-scale": process.env.STRIPE_PRICE_ENTERPRISE_SCALE || "",
} as const;

export type StripePlan = keyof typeof STRIPE_PRICE_IDS;

export const PLAN_PRICES_BRL: Record<StripePlan, number> = {
  dev: 29,
  team: 79,
  "enterprise-starter": 500,
  "enterprise-growth": 1500,
  "enterprise-scale": 5000,
};
