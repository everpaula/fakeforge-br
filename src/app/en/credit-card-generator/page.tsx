import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import GeneratorSchema from "@/components/GeneratorSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Fake Credit Card Generator (Visa, Mastercard, Amex) for Testing",
  description: "Generate fake credit card numbers for testing checkout flows and sandbox integrations. Visa, Mastercard, Amex, Elo, Hipercard with valid Luhn checksum. Free REST API. Numbers fail at gateway authorization, safe for QA only.",
  keywords: "fake credit card generator, credit card generator, free credit card generator, visa card generator, mastercard generator, amex card generator, fake card generator, credit card generator for testing, fake visa card, fake mastercard",
  openGraph: {
    title: "Fake Credit Card Generator for Testing (Luhn Valid)",
    description: "Fake Visa, Mastercard, Amex, Elo and Hipercard numbers with valid Luhn checksum for sandbox testing. Free REST API.",
    type: "website",
    images: ["/api/og?title=Fake+Credit+Card+Generator&subtitle=Valid+Luhn+credit+card+numbers+for+sandbox+testing+and+QA&category=GENERATOR"],
    locale: "en_US",
  },
  alternates: {
    canonical: "/en/credit-card-generator",
    languages: {
      "pt-BR": "/gerador-cartao",
      "en-US": "/en/credit-card-generator",
    },
  },
};

export default function EnCreditCardGenerator() {
  return (
    <PageShell>
      <div className="mb-8" lang="en">
        <p className="text-xs text-muted-foreground mb-2">
          <Link href="/gerador-cartao" className="text-primary hover:underline">PT-BR</Link>
          {" · "}EN
        </p>
        <h1 className="text-3xl font-bold tracking-tight">
          Fake <span className="text-primary">Credit Card</span> Generator
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Generate fake credit card numbers for testing checkout flows, payment gateway sandbox
          integrations, and form validation. Supports Visa, Mastercard, American Express, Elo and
          Hipercard. All numbers pass the Luhn (mod-10) checksum, so they validate in any standard
          credit card validator, but they will fail at the gateway authorization step. Safe for QA
          environments only.
        </p>
      </div>

      <SingleGenerator
        type="creditCard"
        label="Credit Card"
        description="Click Generate to create fake credit card numbers"
      />

      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed" lang="en">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">How Luhn validation works</h2>
          <p>
            The Luhn algorithm (mod-10) is the checksum used by virtually all credit card networks
            since the 1960s. It detects single-digit typos and most adjacent-digit swaps. Every
            credit card number you see has a last digit calculated so the sum of digits (doubled
            in odd positions from the right, then summed in case of overflow) is divisible by 10.
            FakeForge generates the first 15 digits and calculates the 16th, producing numbers
            that pass any client-side or server-side Luhn check.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Brand-specific prefixes (BIN)</h2>
          <p className="mb-2">
            Each card network has a unique Bank Identification Number (BIN) prefix:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong>Visa</strong>: starts with 4, 16 digits, CVV 3 digits</li>
            <li><strong>Mastercard</strong>: starts with 51 to 55 (classic) or 2221 to 2720 (new range), 16 digits, CVV 3 digits</li>
            <li><strong>American Express</strong>: starts with 34 or 37, 15 digits, CID 4 digits</li>
            <li><strong>Elo</strong>: starts with 401178, 438935, 451416, 457631 and others (Brazilian network), 16 digits, CVV 3 digits</li>
            <li><strong>Hipercard</strong>: starts with 606282 (Brazilian network), 16 digits, CVV 3 digits</li>
          </ul>
          <div className="flex flex-wrap gap-2 mt-3">
            <Link href="/gerador-cartao/visa" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Visa Generator</Link>
            <Link href="/gerador-cartao/mastercard" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Mastercard Generator</Link>
            <Link href="/gerador-cartao/amex" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Amex Generator</Link>
            <Link href="/gerador-cartao/elo" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Elo Generator</Link>
            <Link href="/gerador-cartao/hipercard" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Hipercard Generator</Link>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">When to use fake credit card numbers</h2>
          <p>
            Use FakeForge cards for: client-side form validation tests, server-side Luhn check
            verification, e-commerce checkout flow UI testing, payment form QA in CI/CD pipelines,
            customer demo environments where you want a realistic-looking card but no real
            authorization risk. For end-to-end transaction tests, switch to the official sandbox
            cards provided by each payment gateway (Stripe, Mercado Pago, PagSeguro, Adyen,
            Braintree all publish lists of test card numbers that hit specific authorization
            scenarios).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">REST API for automated testing</h2>
          <pre className="bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto mb-3">
            <code>{`# Generate 100 random credit cards
curl "https://fakeforge.com.br/api/generate?type=creditCard&quantity=100"

# Generate 50 Visa cards specifically
curl "https://fakeforge.com.br/api/generate?type=creditCardVisa&quantity=50"

# Generate 50 Mastercard cards specifically
curl "https://fakeforge.com.br/api/generate?type=creditCardMastercard&quantity=50"

# Bulk export to JSON for fixture seeding
curl -X POST "https://fakeforge.com.br/api/generate" \\
  -H "Content-Type: application/json" \\
  -d '{"type":"creditCard","quantity":1000,"format":"json"}'`}</code>
          </pre>
          <p>
            Free tier: 100 requests per day, up to 10,000 cards per call. JSON, CSV and SQL output.
            Each card includes number, brand, CVV and expiration date.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Other Brazilian generators</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            <Link href="/en/cpf-generator" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">CPF Generator</Link>
            <Link href="/en/cnpj-generator" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">CNPJ Generator</Link>
            <Link href="/en/cep-generator" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">CEP Generator</Link>
            <Link href="/gerador-pix" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">PIX Key Generator</Link>
            <Link href="/docs" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">REST API Docs</Link>
          </div>
        </section>
      </div>

      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "EN", url: "/en/credit-card-generator" },
        { name: "Credit Card Generator", url: "/en/credit-card-generator" },
      ]} />

      <GeneratorSchema
        name="Fake Credit Card Generator"
        url="https://fakeforge.com.br/en/credit-card-generator"
        description="Generate fake credit card numbers (Visa, Mastercard, Amex, Elo, Hipercard) with valid Luhn checksum for sandbox testing and QA. Free REST API."
        features={[
          "5 brands: Visa, Mastercard, Amex, Elo, Hipercard",
          "Valid Luhn (mod-10) checksum",
          "Includes CVV and expiration date",
          "Bulk generation up to 10,000 per call",
          "REST API with 100 free requests per day",
          "Safe for QA only, fails at gateway authorization",
        ]}
      />
    </PageShell>
  );
}
