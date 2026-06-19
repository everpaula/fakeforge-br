import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import GeneratorSchema from "@/components/GeneratorSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import RelatedEnGenerators from "@/components/RelatedEnGenerators";

export const metadata: Metadata = {
  title: "Brazilian Person Generator: Full Profile with CPF, Email, Address",
  description: "Generate complete Brazilian person profiles for testing: name, valid CPF, email, phone, address. All fields are correlated and pass real validators. For KYC sandbox, customer onboarding QA and identity verification testing. Free REST API.",
  keywords: "brazilian person generator, brazilian profile generator, fake brazilian identity, brazilian customer test data, brazilian kyc sandbox, brazilian fintech test data, fake person brazil, brazilian user generator",
  openGraph: {
    title: "Brazilian Person Generator (Full Profile for Testing)",
    description: "Complete Brazilian person profiles with name, CPF, email, phone and address, all correlated. For KYC sandbox and customer onboarding QA.",
    type: "website",
    images: ["/api/og?title=Brazilian+Person+Generator&subtitle=Full+profile+with+CPF%2C+email%2C+phone+and+address+for+KYC+sandbox+testing&category=GENERATOR"],
    locale: "en_US",
  },
  alternates: {
    canonical: "/en/person-generator",
    languages: {
      "pt-BR": "/gerador-pessoa",
      "en-US": "/en/person-generator",
    },
  },
};

export default function EnPersonGenerator() {
  return (
    <PageShell>
      <div className="mb-8" lang="en">
        <p className="text-xs text-muted-foreground mb-2">
          <Link href="/gerador-pessoa" className="text-primary hover:underline">PT-BR</Link>
          {" · "}EN
        </p>
        <h1 className="text-3xl font-bold tracking-tight">
          Brazilian <span className="text-primary">Person</span> Generator
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Generate complete Brazilian person profiles for software testing, KYC sandbox
          environments and customer onboarding QA. Each profile includes a typical Brazilian
          name, a valid CPF (Brazilian tax ID), an email derived from the name, a phone number
          with a real DDD area code, and a coherent address. All fields are correlated so the
          data passes any cross-validation logic.
        </p>
      </div>

      <SingleGenerator
        type="person"
        label="Person"
        description="Click Generate to create complete Brazilian person profiles"
      />

      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed" lang="en">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">What is included in each profile</h2>
          <p className="mb-2">
            Each generated person includes:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong>Full name</strong>: typical Brazilian first name and surname pair from a curated list of 125+ Brazilian names</li>
            <li><strong>CPF</strong>: 11-digit Brazilian tax ID with valid mod-11 check digits</li>
            <li><strong>Email</strong>: derived from the name (first.last@gmail.com format), accents stripped, lowercase, with a Brazilian email domain</li>
            <li><strong>Phone</strong>: Brazilian mobile or landline with a real DDD area code matching one of the 67 valid Brazilian DDDs</li>
            <li><strong>Address</strong>: street, neighborhood, city, state and CEP (postal code), all coherent with each other</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">When to use Brazilian person test data</h2>
          <p>
            International fintech, identity verification, KYC and customer onboarding teams need
            test data that behaves like real Brazilian customer records in validation pipelines.
            FakeForge generates persons that pass CPF mod-11 validation, DDD area code checks,
            CEP format validation and basic name pattern checks, but the data does not belong to
            real people. Use cases: Stripe Connect onboarding for Brazilian customers, Plaid-style
            identity verification sandbox, sanctions screening test fixtures, customer support
            tooling demos, and any QA scenario that exercises Brazilian customer record logic.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Why correlation matters</h2>
          <p>
            Random fake data often fails cross-validation. If your form generates a CPF in São
            Paulo, an email with a random domain, a DDD from Rio, and a CEP from Bahia, real
            validators will flag the inconsistency. FakeForge guarantees: email matches the name
            (without accents), DDD matches the state, CEP prefix matches the state, and the
            address (street/neighborhood/city) is coherent. This matters when you test against
            address validation APIs, fraud detection rules or cross-field form validation logic.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">REST API for KYC sandbox seeding</h2>
          <pre className="bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto mb-3">
            <code>{`# Generate 100 complete person profiles
curl "https://fakeforge.com.br/api/generate?type=person&quantity=100"

# Use the "customer" preset for fully correlated profiles
curl -X POST "https://fakeforge.com.br/api/generate" \\
  -H "Content-Type: application/json" \\
  -d '{"preset":"customer","quantity":500,"format":"sql"}'

# Bulk export to JSON for KYC sandbox seed
curl -X POST "https://fakeforge.com.br/api/generate" \\
  -H "Content-Type: application/json" \\
  -d '{"type":"person","quantity":1000,"format":"json"}'`}</code>
          </pre>
          <p>
            Free tier: 100 requests per day, up to 10,000 profiles per call.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Compliance and safety</h2>
          <p>
            Using real Brazilian customer data in development or staging violates the LGPD
            (Brazilian data protection law) and exposes companies to fines up to BRL 50 million
            per incident. FakeForge profiles are generated on demand and not stored, so there is
            no risk of leaking real personal data through test fixtures, screenshots, log files
            or analytics events. Safe for CI/CD pipelines, shared staging databases, customer
            demo environments and offshore QA teams.
          </p>
        </section>

        <RelatedEnGenerators currentSlug="person-generator" />
      </div>

      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "EN", url: "/en/person-generator" },
        { name: "Person Generator", url: "/en/person-generator" },
      ]} />

      <GeneratorSchema
        inLanguage="en"
        name="Brazilian Person Generator"
        url="https://fakeforge.com.br/en/person-generator"
        description="Generate complete Brazilian person profiles with name, CPF, email, phone and address, all correlated. For KYC sandbox, customer onboarding QA and identity verification testing."
        features={[
          "Full profile: name, CPF, email, phone, address",
          "All fields correlated (DDD matches state, CEP matches state)",
          "Typical Brazilian names from curated list",
          "Bulk generation up to 10,000 per call",
          "REST API with 100 free requests per day",
          "Safe for LGPD compliance, no real data",
        ]}
      />
    </PageShell>
  );
}
