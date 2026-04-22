"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function UserMenu() {
  const [status, setStatus] = useState<"loading" | "authed" | "anon">("loading");

  useEffect(() => {
    let supabase;
    try {
      supabase = createClient();
    } catch {
      setStatus("anon");
      return;
    }

    supabase.auth.getUser().then(({ data }) => {
      setStatus(data.user ? "authed" : "anon");
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setStatus(session?.user ? "authed" : "anon");
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  if (status === "loading") {
    return <span className="w-16 h-4" aria-hidden />;
  }

  if (status === "authed") {
    return (
      <Link
        href="/dashboard"
        className="text-xs font-medium text-primary hover:text-primary-hover transition-colors"
      >
        Dashboard
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
    >
      Entrar
    </Link>
  );
}