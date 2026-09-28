import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import CheckoutClient from "./CheckoutClient";

/**
 * Sprint 8 — landing /checkout?plano=dev&cupom=CNPJ2026
 * Recebe o clique dos emails D14/D16 com cupom pré-aplicado.
 *
 * Fluxo:
 *   1. Se user não logado, redireciona pra /login?redirect=/checkout?plano=dev&cupom=CNPJ2026
 *   2. Se logado, componente client dispara POST /api/checkout com plano+cupom
 *   3. Redirecionamento pro Stripe hosted checkout com desconto já aplicado
 */

export const metadata = {
  title: "Assinar Plano — FakeForge",
  robots: { index: false, follow: false }, // Não indexar landing de checkout
};

interface PageProps {
  searchParams: Promise<{ plano?: string; cupom?: string }>;
}

const VALID_PLANOS = new Set([
  "dev",
  "team",
  "enterprise-starter",
  "enterprise-growth",
  "enterprise-scale",
]);

export default async function CheckoutPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const plano = params.plano && VALID_PLANOS.has(params.plano) ? params.plano : "dev";
  const cupom = params.cupom || undefined;

  const user = await getUser();
  if (!user) {
    const redirectUrl = `/login?redirect=/checkout?plano=${plano}${cupom ? `&cupom=${cupom}` : ""}`;
    redirect(redirectUrl);
  }

  return <CheckoutClient plano={plano} cupom={cupom} />;
}
