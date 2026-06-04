import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import GeneratorSchema from "@/components/GeneratorSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Brazilian PIX Key Generator: CPF, Email, Phone, EVP UUID for Testing",
  description: "Generate Brazilian PIX keys for testing payment integrations. Supports all 4 BACEN formats: CPF, email, phone (+55) and EVP (UUID v4). For Mercado Pago, PagBank, Stripe Brazil sandbox testing. Free REST API.",
  keywords: "brazilian pix generator, pix key generator, fake pix key, pix key for testing, brazilian instant payment, bacen pix, pix evp uuid, pix api test, brazilian payment sandbox, mercado pago pix test",
  openGraph: {
    title: "Brazilian PIX Key Generator (CPF, Email, Phone, EVP UUID)",
    description: "Brazilian PIX keys in all 4 BACEN formats for testing Mercado Pago, PagBank, Stripe Brazil payment integrations. Free REST API.",
    type: "website",
    images: ["/api/og?title=Brazilian+PIX+Key+Generator&subtitle=All+4+BACEN+formats+for+testing+Mercado+Pago+and+PagBank+integrations&category=GENERATOR"],
    locale: "en_US",
  },
  alternates: {
    canonical: "/en/pix-key-generator",
    languages: {
      "pt-BR": "/gerador-pix",
      "en-US": "/en/pix-key-generator",
    },
  },
};

export default function EnPixKeyGenerator() {
  return (
    <PageShell>
      <div className="mb-8" lang="en">
        <p className="text-xs text-muted-foreground mb-2">
          <Link href="/gerador-pix" className="text-primary hover:underline">PT-BR</Link>
          {" · "}EN
        </p>
        <h1 className="text-3xl font-bold tracking-tight">
          Brazilian <span className="text-primary">PIX</span> Key Generator
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Generate Brazilian PIX keys for testing payment integrations with Mercado Pago, PagBank,
          Stripe Brazil, OpenPix and other Brazilian PSPs. Supports all 4 BACEN-approved key
          formats: CPF, email, phone (+55) and EVP (UUID v4). Keys are fictitious but format-valid,
          so they pass any PIX key parser or validator. For QA and sandbox environments only.
        </p>
      </div>

      <SingleGenerator
        type="pixKey"
        label="PIX Key"
        description="Click Generate to create fake Brazilian PIX keys"
      />

      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed" lang="en">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">What is PIX?</h2>
          <p>
            PIX is the Brazilian instant payment system, launched in November 2020 by the Central
            Bank of Brazil (BACEN). It enables 24/7 instant transfers between any two Brazilian
            bank accounts, free for individuals. PIX has become the dominant payment method in
            Brazil, processing over 3 billion transactions per month as of 2024, ahead of cards
            and TED transfers. International fintech and payment platforms serving Brazilian
            customers integrate PIX as a payment option through PSPs (Payment Service Providers).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">The 4 PIX key formats</h2>
          <p className="mb-2">
            BACEN regulates exactly 4 acceptable PIX key formats. Every PSP integration must
            validate against these:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong>CPF</strong>: 11-digit Brazilian individual tax ID, with valid mod-11 check digits</li>
            <li><strong>Email</strong>: standard email format, lowercase, max 77 characters</li>
            <li><strong>Phone</strong>: Brazilian phone in international format +55 (DDD) (9) XXXX-XXXX</li>
            <li><strong>EVP</strong>: random UUID v4, 32 hex characters with hyphens, also called &ldquo;chave aleatória&rdquo;</li>
          </ul>
          <p className="mt-2">
            CNPJ is also a valid PIX key for business accounts, but BACEN treats it as a fifth
            optional format. FakeForge can generate CNPJ-format PIX keys via the CNPJ generator.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">When to use fake PIX keys</h2>
          <p>
            Use FakeForge PIX keys for: payment form validation tests, checkout flow QA, customer
            onboarding UI testing, PSP integration sandbox setup, and demos of PIX-enabled
            features. For end-to-end PIX transaction tests, use the official sandbox keys
            provided by each PSP (Mercado Pago, PagBank, Stripe Brazil, OpenPix, Pagar.me publish
            test keys that simulate specific scenarios like success, insufficient funds, key not
            found, etc).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">REST API for payment integration tests</h2>
          <pre className="bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto mb-3">
            <code>{`# Generate 100 random PIX keys (mix of 4 formats)
curl "https://fakeforge.com.br/api/generate?type=pixKey&quantity=100"

# Use the customer_pix preset for correlated profiles with PIX
curl -X POST "https://fakeforge.com.br/api/generate" \\
  -H "Content-Type: application/json" \\
  -d '{"preset":"customer_pix","quantity":50,"format":"json"}'

# Bulk export to JSON for sandbox seed
curl -X POST "https://fakeforge.com.br/api/generate" \\
  -H "Content-Type: application/json" \\
  -d '{"type":"pixKey","quantity":1000,"format":"json"}'`}</code>
          </pre>
          <p>
            Free tier: 100 requests per day, up to 10,000 keys per call.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">QR Code PIX (dynamic and static)</h2>
          <p>
            PIX also supports QR code payments using the EMV BR Code standard. Dynamic QR codes
            include a PSP URL that returns transaction details when scanned; static QR codes
            embed the payment data directly. FakeForge currently generates PIX keys only. For
            generating EMV BR Code payloads, see our blog post on{" "}
            <Link href="/blog/qr-code-pix-dinamico-emv-br-code-nodejs" className="text-primary hover:underline">
              QR Code PIX dinâmico em Node.js
            </Link>
            {" "}with the TLV payload structure, CRC16-CCITT calculation and integration examples.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Other Brazilian generators</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            <Link href="/en/cpf-generator" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">CPF Generator</Link>
            <Link href="/en/cnpj-generator" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">CNPJ Generator</Link>
            <Link href="/en/cep-generator" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">CEP Generator</Link>
            <Link href="/en/credit-card-generator" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Credit Card Generator</Link>
            <Link href="/en/person-generator" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Person Generator</Link>
            <Link href="/docs" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">REST API Docs</Link>
          </div>
        </section>
      </div>

      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "EN", url: "/en/pix-key-generator" },
        { name: "PIX Key Generator", url: "/en/pix-key-generator" },
      ]} />

      <GeneratorSchema
        name="Brazilian PIX Key Generator"
        url="https://fakeforge.com.br/en/pix-key-generator"
        description="Generate Brazilian PIX keys in all 4 BACEN formats (CPF, email, phone, EVP UUID) for testing payment integrations with Mercado Pago, PagBank, Stripe Brazil and other PSPs."
        features={[
          "All 4 BACEN-approved key formats",
          "CPF, email, phone (+55), EVP UUID v4",
          "Format-valid for any PIX key parser",
          "Bulk generation up to 10,000 per call",
          "REST API with 100 free requests per day",
          "Safe for sandbox testing, not real keys",
        ]}
      />
    </PageShell>
  );
}
