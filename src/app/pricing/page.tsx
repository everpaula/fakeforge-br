import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PricingClient from "./PricingClient";

export const metadata: Metadata = {
  title: "Precos - FakeForge BR",
  description: "Planos e precos do FakeForge BR. Free, Dev e Team. API para gerar dados brasileiros de teste.",
};

export default function Pricing() {
  return (
    <PageShell>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight">
          Planos <span className="text-primary">simples</span>
        </h1>
        <p className="text-muted mt-2 text-sm">
          Web gratuito, sempre. API paga por volume.
        </p>
      </div>
      <PricingClient />
    </PageShell>
  );
}
