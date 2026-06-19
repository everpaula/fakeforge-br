import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import GeneratorSchema from "@/components/GeneratorSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import RelatedEnGenerators from "@/components/RelatedEnGenerators";

export const metadata: Metadata = {
  title: "Brazilian CEP Generator: Valid Postal Codes for Address Testing",
  description: "Generate valid Brazilian CEP (postal code) numbers with coherent city, state and neighborhood. For address validation tests, shipping integration QA, and e-commerce fulfillment sandboxes. Free REST API.",
  keywords: "brazilian cep generator, cep generator, brazilian postal code generator, brazil zip code, cep for testing, cep api, brazilian address test data, shipping integration test",
  openGraph: {
    title: "Brazilian CEP Generator: Valid Postal Codes for Testing",
    description: "Valid Brazilian CEP numbers with coherent city and state for address validation tests, shipping integration QA and e-commerce sandboxes. Free REST API.",
    type: "website",
    images: ["/api/og?title=Brazilian+CEP+Generator&subtitle=Valid+postal+codes+for+address+validation+and+shipping+integration+tests&category=GENERATOR"],
    locale: "en_US",
  },
  alternates: {
    canonical: "/en/cep-generator",
    languages: {
      "pt-BR": "/gerador-cep",
      "en-US": "/en/cep-generator",
    },
  },
};

export default function EnCepGenerator() {
  return (
    <PageShell>
      <div className="mb-8" lang="en">
        <p className="text-xs text-muted-foreground mb-2">
          <Link href="/gerador-cep" className="text-primary hover:underline">PT-BR</Link>
          {" · "}EN
        </p>
        <h1 className="text-3xl font-bold tracking-tight">
          Brazilian <span className="text-primary">CEP</span> (Postal Code) Generator
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Generate valid Brazilian CEP (Código de Endereçamento Postal) numbers with coherent
          city, state and neighborhood, for address validation tests, shipping integration QA,
          e-commerce fulfillment sandboxes and customer onboarding flows. Each CEP returned
          matches an actual Brazilian geographic region.
        </p>
      </div>

      <SingleGenerator
        type="cep"
        label="CEP"
        description="Click Generate to create valid Brazilian postal codes"
      />

      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed" lang="en">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">What is a CEP?</h2>
          <p>
            CEP (Código de Endereçamento Postal) is the Brazilian postal code, equivalent to the
            US ZIP code or the UK postcode. It has 8 digits in the format XXXXX-XXX, where the
            first 5 identify the geographic region (city or city district) and the last 3 identify
            the specific delivery route. Every Brazilian address has a CEP, used for mail delivery,
            shipping, address validation, e-commerce fulfillment and tax jurisdiction lookup.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">When to use a fake CEP</h2>
          <p>
            International e-commerce, logistics, and shipping platforms serving Brazilian customers
            need address test data that behaves like real Brazilian addresses. FakeForge generates
            CEPs with coherent city, state, neighborhood and street, so the test data passes any
            address validation API (Correios, ViaCEP, BrasilAPI) format check. Use cases: shipping
            rate calculation tests, address autocomplete sandbox, e-commerce checkout flows for
            Brazilian customers, fulfillment center routing, and any QA scenario that exercises
            Brazilian address logic.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Coherent address data</h2>
          <p>
            FakeForge does not just generate random 8-digit numbers. Each CEP is tied to a real
            city in one of 10 covered Brazilian states (São Paulo, Rio de Janeiro, Minas Gerais,
            Bahia, Paraná, Rio Grande do Sul, Pernambuco, Ceará, Distrito Federal, Goiás). The
            neighborhood matches a real neighborhood within that city. This matters because real
            address validators check that the CEP prefix matches the state, and many e-commerce
            platforms reject CEPs that do not match the declared shipping address.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">REST API for shipping integration tests</h2>
          <pre className="bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto mb-3">
            <code>{`# Generate 100 CEPs with coherent address
curl "https://fakeforge.com.br/api/generate?type=cep&quantity=100"

# Generate full address (street, neighborhood, city, state, CEP)
curl "https://fakeforge.com.br/api/generate?type=address&quantity=50"

# Bulk export as JSON for shipping rate test fixtures
curl -X POST "https://fakeforge.com.br/api/generate" \\
  -H "Content-Type: application/json" \\
  -d '{"type":"address","quantity":1000,"format":"json"}'`}</code>
          </pre>
          <p>
            Free tier: 100 requests per day, up to 10,000 CEPs per call.
          </p>
        </section>

        <RelatedEnGenerators currentSlug="cep-generator" />
      </div>

      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "EN", url: "/en/cep-generator" },
        { name: "CEP Generator", url: "/en/cep-generator" },
      ]} />

      <GeneratorSchema
        inLanguage="en"
        name="Brazilian CEP Generator"
        url="https://fakeforge.com.br/en/cep-generator"
        description="Generate valid Brazilian CEP postal codes with coherent city, state and neighborhood, for address validation tests, shipping integration QA and e-commerce sandboxes."
        features={[
          "Valid CEP with coherent city and state",
          "Real neighborhoods from 10 Brazilian states",
          "Bulk generation up to 10,000 per call",
          "REST API with 100 free requests per day",
          "JSON, CSV and SQL export",
          "Safe for LGPD compliance, no real addresses",
        ]}
      />
    </PageShell>
  );
}
