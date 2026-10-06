"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

declare global {
  interface Window {
    gtag?: (command: string, eventName: string, params?: Record<string, unknown>) => void;
  }
}

// Signup novo = user criado nos últimos 2 min. Usado pra distinguir signup
// completo (evento signup_completed pro GA4) de login recorrente. GA4 Auto
// Form interactions quase nunca captura o magic link, então a gente dispara
// explicitamente aqui.
const NEW_USER_WINDOW_MS = 2 * 60 * 1000;

export default function PostLogin() {
  const router = useRouter();

  useEffect(() => {
    const intentPlan = sessionStorage.getItem("fakeforge_checkout_intent");
    // NOTE (audit 26/08): removido o respeito ao fakeforge_post_login_redirect
    // porque users vindos de /gerador-X (que era o path mais comum de login)
    // voltavam pra la sem nunca ver o /dashboard, entao ninguem via o
    // FirstCallActivation nem o hero upsell. Metrica activation caiu de
    // 5.7% pra 2.33% em 30d. Sempre pro dashboard agora (excecao: checkout
    // intent onde user quer comprar direto).
    sessionStorage.removeItem("fakeforge_checkout_intent");
    sessionStorage.removeItem("fakeforge_post_login_redirect");

    // GA4: dispara login_completed sempre, e signup_completed se o user
    // foi criado nos ultimos 2 min (= primeira vez que ele entra). Isso
    // destrava remarketing + funnel accurate no GA4 ja que Form
    // interactions nao captura magic link.
    (async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || typeof window.gtag !== "function") return;

        const createdAt = new Date(user.created_at).getTime();
        const isNewSignup = Date.now() - createdAt < NEW_USER_WINDOW_MS;

        window.gtag("event", "login_completed", {
          method: user.app_metadata?.provider ?? "magic_link",
          user_id: user.id,
        });

        if (isNewSignup) {
          window.gtag("event", "signup_completed", {
            method: user.app_metadata?.provider ?? "magic_link",
            user_id: user.id,
          });
        }
      } catch {
        // GA4 dispatch não deve bloquear o fluxo de login
      }
    })();

    // Register referral if cookie exists
    const refMatch = document.cookie.match(/(?:^|;\s*)ff_ref=([^;]+)/);
    if (refMatch) {
      const referrerId = decodeURIComponent(refMatch[1]);
      fetch("/api/referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referrerId }),
      }).catch(() => {/* fire-and-forget */});
      // Clear ref cookie after attempt
      document.cookie = "ff_ref=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }

    async function proceed() {
      if (intentPlan && intentPlan !== "free") {
        try {
          const res = await fetch("/api/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ plan: intentPlan }),
          });
          const data = await res.json();
          if (data.checkout_url) {
            window.location.href = data.checkout_url;
            return;
          }
        } catch {
          // fall through to dashboard
        }
      }

      // Sempre pro dashboard - onde vive o FirstCallActivation + hero upsell.
      router.replace("/dashboard");
    }

    proceed();
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-muted">Preparando sua conta...</p>
      </div>
    </div>
  );
}