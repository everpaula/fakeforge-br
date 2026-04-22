"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PostLogin() {
  const router = useRouter();

  useEffect(() => {
    const intentPlan = sessionStorage.getItem("fakeforge_checkout_intent");
    const redirect = sessionStorage.getItem("fakeforge_post_login_redirect");

    sessionStorage.removeItem("fakeforge_checkout_intent");
    sessionStorage.removeItem("fakeforge_post_login_redirect");

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
          // fall through to redirect
        }
      }

      if (redirect && redirect.startsWith("/")) {
        router.replace(redirect);
      } else {
        router.replace("/dashboard");
      }
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