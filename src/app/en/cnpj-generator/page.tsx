import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import GeneratorSchema from "@/components/GeneratorSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Brazilian CNPJ Generator: Valid Tax IDs for B2B Software Testing",
  description: "Generate valid Brazilian CNPJ numbers for B2B software testing, supplier verification sandboxes and ERP integration QA. Uses official mod-11 algorithm. Free REST API. Supports new alphanumeric CNPJ format starting July 2026.",
  keywords: "brazilian cnpj generator, cnpj generator, fake cnpj, brazilian company tax id, brazil business id, cnpj for testing, cnpj api, brazilian b2b test data, alphanumeric cnpj 2026",
  openGraph: {
    title: "Brazilian CNPJ Generator for B2B Software Testing",
    description: "Valid Brazilian CNPJ numbers for B2B software, ERP integration QA and supplier verification sandboxes. Free REST API.",
    type: "website",
    images: ["/api/og?title=Brazilian+CNPJ+Generator&subtitle=Valid+CNPJ+numbers+for+B2B+software+testing+and+ERP+integration+QA&category=GENERATOR"],
    locale: "en_US",
  },
  alternates: {
    canonical: "/en/cnpj-generator",
    languages: {
      "pt-BR": "/gerador-cnpj",
      "en-US": "/en/cnpj-generator",
    },
  },
};

export default function EnCnpjGenerator() {
  return (
    <PageShell>
      <div className="mb-8" lang="en">
        <p className="text-xs text-muted-foreground mb-2">
          <Link href="/gerador-cnpj" className="text-primary hover:underline">PT-BR</Link>
          {" · "}EN
        </p>
        <h1 className="text-3xl font-bold tracking-tight">
          Brazilian <span className="text-primary">CNPJ</span> Generator
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Generate valid Brazilian CNPJ (Cadastro Nacional da Pessoa Jurídica) numbers for B2B
          software testing, ERP integration QA, supplier verification sandboxes, and invoice
          generation in homologation. Numbers are fictitious but pass the official mod-11
          algorithm, so they validate against any Brazilian CNPJ checker.
        </p>
      </div>

      <SingleGenerator
        type="cnpj"
        label="CNPJ"
        description="Click Generate to create valid Brazilian CNPJ numbers"
      />

      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed" lang="en">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">What is a CNPJ?</h2>
          <p>
            CNPJ (Cadastro Nacional da Pessoa Jurídica) is the Brazilian company tax identification
            number, equivalent to the US EIN (Employer Identification Number) or the UK Company
            Number. It has 14 digits in the format XX.XXX.XXX/XXXX-XX, where the last 2 are check
            digits calculated via mod-11. Every Brazilian legal entity (LLC, S.A., MEI, EIRELI)
            has a unique CNPJ, used for tax filing, invoice issuance, B2B contracts and government
            registrations.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">When to use a fake CNPJ</h2>
          <p>
            International SaaS, ERP, accounting, and B2B platforms serving Brazilian businesses
            need CNPJ test data that behaves like real CNPJs in validation pipelines. FakeForge
            generates CNPJs that pass mod-11 checksum but do not belong to real companies. Use
            cases: Stripe Connect onboarding for Brazilian merchants, NetSuite and SAP Brazil
            localization tests, e-invoice (NF-e) sandbox testing, supplier verification flows,
            and any QA scenario that exercises CNPJ format and checksum validation.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Alphanumeric CNPJ (July 2026)</h2>
          <p>
            Receita Federal will introduce an alphanumeric CNPJ format starting July 2026
            (Instrução Normativa 2.229). The 8-digit root and 4-digit order can contain letters
            (A to Z) and digits (0 to 9). The check digit is calculated via ASCII minus 48. If
            your platform serves Brazilian businesses, you should test schema migrations, regex
            validators and SEFAZ integrations against the new format now. FakeForge has a
            dedicated{" "}
            <Link href="/gerador-cnpj-alfanumerico" className="text-primary hover:underline">
              Alphanumeric CNPJ Generator
            </Link>
            {" "}for early testing.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">REST API for ERP and CI/CD</h2>
          <pre className="bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto mb-3">
            <code>{`# Generate 100 valid CNPJs
curl "https://fakeforge.com.br/api/generate?type=cnpj&quantity=100"

# Generate alphanumeric CNPJs (2026 format)
curl "https://fakeforge.com.br/api/generate?type=cnpjAlfa&quantity=50"

# Bulk export as SQL for ERP staging seed
curl -X POST "https://fakeforge.com.br/api/generate" \\
  -H "Content-Type: application/json" \\
  -d '{"type":"cnpj","quantity":1000,"format":"sql"}'`}</code>
          </pre>
          <p>
            Free tier: 100 requests per day, up to 10,000 CNPJs per call. JSON, CSV and SQL output.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Other Brazilian generators</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            <Link href="/en/cpf-generator" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">CPF Generator</Link>
            <Link href="/en/cep-generator" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">CEP (Postal Code) Generator</Link>
            <Link href="/gerador-empresa" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Full Company Generator</Link>
            <Link href="/docs" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">REST API Docs</Link>
          </div>
        </section>
      </div>

      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "EN", url: "/en/cnpj-generator" },
        { name: "CNPJ Generator", url: "/en/cnpj-generator" },
      ]} />

      <GeneratorSchema
        name="Brazilian CNPJ Generator"
        url="https://fakeforge.com.br/en/cnpj-generator"
        description="Generate valid Brazilian CNPJ numbers for B2B software testing, ERP integration QA and supplier verification sandboxes. Supports new alphanumeric format starting July 2026."
        features={[
          "Valid CNPJ with correct mod-11 check digits",
          "Alphanumeric CNPJ support (2026 format)",
          "Bulk generation up to 10,000 per call",
          "REST API with 100 free requests per day",
          "JSON, CSV and SQL export for ERP seeding",
          "Safe for LGPD compliance, no real data",
        ]}
      />
    </PageShell>
  );
}
