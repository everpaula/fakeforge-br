import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import GeneratorSchema from "@/components/GeneratorSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "CPF Generator: Generate Valid Brazilian CPF Numbers (Free)",
  description: "Generate valid Brazilian CPF numbers for software testing, fintech KYC sandboxes, and customer onboarding QA. Uses official mod-11 algorithm from Receita Federal. Free REST API with 100 calls per day. No signup.",
  keywords: "cpf generator, generate cpf, cpf number generator, brazilian cpf generator, fake cpf, brazilian tax id generator, brazil personal id, cpf for testing, cpf api, brazilian kyc test data, fintech sandbox test data, cpf validator, valid cpf number, brazilian tax id",
  openGraph: {
    title: "Brazilian CPF Generator for Testing (Valid Mod-11)",
    description: "Valid Brazilian CPF numbers for fintech KYC sandboxes, customer onboarding QA and form validation tests. Free REST API.",
    type: "website",
    images: ["/api/og?title=Brazilian+CPF+Generator&subtitle=Valid+CPF+numbers+for+software+testing+and+fintech+KYC+sandboxes&category=GENERATOR"],
    locale: "en_US",
  },
  alternates: {
    canonical: "/en/cpf-generator",
    languages: {
      "pt-BR": "/gerador-cpf",
      "en-US": "/en/cpf-generator",
    },
  },
};

export default function EnCpfGenerator() {
  return (
    <PageShell>
      <div className="mb-8" lang="en">
        <p className="text-xs text-muted-foreground mb-2">
          <Link href="/gerador-cpf" className="text-primary hover:underline">PT-BR</Link>
          {" · "}EN
        </p>
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="text-primary">CPF</span> Generator
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Generate valid Brazilian CPF (Cadastro de Pessoas Físicas) numbers for software testing,
          fintech KYC sandboxes, customer onboarding QA, and form validation. Numbers are
          fictitious but pass the official mod-11 algorithm from Receita Federal, so they validate
          successfully against any Brazilian CPF validator. Free, no signup, REST API included.
        </p>
      </div>

      <SingleGenerator
        type="cpf"
        label="CPF"
        description="Click Generate to create valid Brazilian CPF numbers"
      />

      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed" lang="en">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">What is a CPF?</h2>
          <p>
            CPF (Cadastro de Pessoas Físicas) is the Brazilian individual taxpayer identification
            number, similar to the US Social Security Number or the UK National Insurance Number.
            It has 11 digits in the format XXX.XXX.XXX-XX, where the last two digits are check
            digits calculated by a mod-11 algorithm. Every Brazilian citizen and resident has a
            unique CPF, used for tax filing, financial transactions, employment, healthcare and
            government services.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">When to use a fake CPF</h2>
          <p>
            International fintech, payments, KYC, and identity verification teams working with
            Brazilian customers need CPF test data that behaves like real CPFs in validation
            pipelines. FakeForge generates CPFs that pass mod-11 checksum but do not belong to
            real people. Use cases: Stripe Connect onboarding for Brazilian merchants, Adyen
            payment method testing, customer onboarding flows for Brazilian markets, sanctions
            screening pipelines, and any QA scenario that exercises CPF validation logic.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">REST API for automated testing</h2>
          <p className="mb-3">
            Use the REST API to seed test databases and run integration tests:
          </p>
          <pre className="bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto mb-3">
            <code>{`# Generate 100 valid CPFs
curl "https://fakeforge.com.br/api/generate?type=cpf&quantity=100"

# Bulk export as SQL for database seeding
curl -X POST "https://fakeforge.com.br/api/generate" \\
  -H "Content-Type: application/json" \\
  -d '{"type":"cpf","quantity":1000,"format":"sql"}'`}</code>
          </pre>
          <p>
            Free tier: 100 requests per day, up to 10,000 CPFs per call. No signup, no API key
            required. For higher volumes or dedicated rate limits, paid plans start at BRL 29 per month.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Compliance and safety</h2>
          <p>
            Using real CPFs in development or staging environments violates the LGPD (Brazilian
            data protection law) and exposes companies to fines up to BRL 50 million per incident.
            FakeForge CPFs are generated on demand and not stored, so there is no risk of leaking
            real personal data through test fixtures, screenshots, or log files. Safe for CI/CD
            pipelines, shared staging databases, and customer demo environments.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Other Brazilian generators</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            <Link href="/en/cnpj-generator" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">CNPJ Generator</Link>
            <Link href="/en/cep-generator" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">CEP (Postal Code) Generator</Link>
            <Link href="/gerador-pessoa" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Full Person Generator</Link>
            <Link href="/docs" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">REST API Docs</Link>
          </div>
        </section>
      </div>

      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "EN", url: "/en/cpf-generator" },
        { name: "CPF Generator", url: "/en/cpf-generator" },
      ]} />

      <GeneratorSchema
        inLanguage="en"
        name="Brazilian CPF Generator"
        url="https://fakeforge.com.br/en/cpf-generator"
        description="Generate valid Brazilian CPF numbers for software testing, KYC sandboxes and customer onboarding QA. Uses official mod-11 algorithm. Free REST API."
        features={[
          "Valid CPF with correct mod-11 check digits",
          "Bulk generation up to 10,000 per call",
          "REST API with 100 free requests per day",
          "JSON, CSV and SQL export",
          "Safe for LGPD compliance, no real data",
          "Fintech KYC sandbox ready",
        ]}
      />
    </PageShell>
  );
}
