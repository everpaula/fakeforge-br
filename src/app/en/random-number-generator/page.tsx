import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import GeneratorSchema from "@/components/GeneratorSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import RelatedEnGenerators from "@/components/RelatedEnGenerators";

export const metadata: Metadata = {
  title: "Random 4-Digit Code Generator: Free OTP & Verification Numbers",
  description: "Generate random 4-digit, 6-digit, or 8-digit numeric codes for OTP testing, 2FA flows, SMS verification mocks, and PIN seeders. Free REST API. No signup, 100 calls per day.",
  keywords: "random 4 digit code generator, random number generator, random digit generator, otp generator, 4 digit code, 6 digit code, 8 digit code, verification code generator, 2fa code generator, pin generator, random numeric code, sms code generator, test otp",
  openGraph: {
    title: "Random 4-Digit Code Generator (OTP, 2FA, PIN)",
    description: "Generate random numeric codes for OTP testing, 2FA verification flows, and PIN seeders. Free REST API.",
    type: "website",
    images: ["/api/og?title=Random+Number+Generator&subtitle=4-digit+OTP+codes+for+2FA+and+verification+testing&category=GENERATOR"],
    locale: "en_US",
  },
  alternates: {
    canonical: "/en/random-number-generator",
    languages: {
      "en-US": "/en/random-number-generator",
    },
  },
};

export default function EnRandomNumberGenerator() {
  return (
    <PageShell>
      <div className="mb-8" lang="en">
        <h1 className="text-3xl font-bold tracking-tight">
          Random <span className="text-primary">4-Digit Code</span> Generator
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Generate random 4-digit, 6-digit, or 8-digit numeric codes for OTP testing, 2FA verification
          flows, SMS code mocks, PIN seeders, and any QA scenario that needs disposable numeric tokens.
          Leading zeros preserved. Free REST API with no signup.
        </p>
      </div>

      <div className="space-y-6">
        <SingleGenerator
          type="random4"
          label="4-digit code"
          description="Common format for SMS OTP, PIN entry, voicemail boxes"
        />
        <SingleGenerator
          type="random6"
          label="6-digit code"
          description="Standard for TOTP (Google Authenticator, Authy) and modern 2FA flows"
        />
        <SingleGenerator
          type="random8"
          label="8-digit code"
          description="Bank account recovery codes, high-entropy verification, backup tokens"
        />
      </div>

      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed" lang="en">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">When to use a random numeric code</h2>
          <p>
            One-time passwords (OTP), two-factor authentication codes (2FA), SMS verification numbers,
            email confirmation tokens, voicemail PINs, and account recovery codes all use short numeric
            strings as their wire format. When you build or test those flows, you need fixture data that
            looks identical to what your provider will send. Hard-coding &quot;1234&quot; in tests creates
            collisions; using real OTPs from production providers is slow and unauditable. A deterministic
            generator gives you the right shape, every time.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Why 4, 6 and 8 digits</h2>
          <ul className="list-disc list-inside space-y-2 pl-2 mt-3">
            <li>
              <strong className="text-foreground">4 digits</strong> — legacy SMS OTPs, voicemail PINs, low-stakes
              app unlock codes. 10,000 possibilities, brute-force risk if no rate limit. Common in older
              banking apps, hotel safes, and SIM PINs.
            </li>
            <li>
              <strong className="text-foreground">6 digits</strong> — modern standard. RFC 6238 TOTP
              (Time-based One-Time Password) defaults to 6 digits. Used by Google Authenticator, Authy,
              Microsoft Authenticator, Stripe 3DS, and most banking 2FA. One million possibilities,
              30-second window.
            </li>
            <li>
              <strong className="text-foreground">8 digits</strong> — high-entropy backup codes, account
              recovery, sensitive admin flows. 100 million possibilities. Often grouped as XXXX-XXXX
              for readability.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">REST API for automated testing</h2>
          <p className="mb-3">
            Use the REST API to seed test fixtures, mock SMS providers, or load-test OTP validation
            endpoints:
          </p>
          <pre className="bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto mb-3">
            <code>{`# Generate 100 random 4-digit codes
curl "https://fakeforge.com.br/api/generate?type=random4&quantity=100"

# Generate 6-digit TOTP-shaped codes for load testing
curl "https://fakeforge.com.br/api/generate?type=random6&quantity=1000"

# Bulk export as JSON for a Postman or Playwright fixture
curl "https://fakeforge.com.br/api/generate?type=random8&quantity=500" \\
  -o backup-codes.json`}</code>
          </pre>
          <p>
            Free tier: 100 requests per day, up to 10,000 codes per call. No signup, no API key required.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Important: not cryptographically secure</h2>
          <p>
            These codes use JavaScript&apos;s <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">Math.random()</code>,
            which is fine for test fixtures and mock data but is <strong className="text-foreground">not safe</strong>{" "}
            for real authentication tokens. For production OTP, TOTP, or session secrets, use{" "}
            <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">crypto.randomInt()</code>{" "}
            (Node) or <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">window.crypto.getRandomValues()</code>{" "}
            (browser). This tool exists for the QA / staging layer only.
          </p>
        </section>

        <RelatedEnGenerators currentSlug="random-number-generator" />
      </div>

      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "EN", url: "/en/cpf-generator" },
        { name: "Random Number Generator", url: "/en/random-number-generator" },
      ]} />

      <GeneratorSchema
        inLanguage="en"
        name="Random 4-Digit Code Generator"
        url="https://fakeforge.com.br/en/random-number-generator"
        description="Generate random 4-digit, 6-digit, or 8-digit numeric codes for OTP testing, 2FA verification flows, SMS mocks, and PIN seeders. Free REST API."
        features={[
          "4, 6, and 8 digit length presets",
          "Leading zeros preserved",
          "Bulk generation up to 10,000 per call",
          "REST API with 100 free requests per day",
          "JSON, CSV, and text export",
          "Safe for QA fixtures, NOT for production crypto",
        ]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What is a 4-digit code generator used for?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "A 4-digit code generator produces 4-digit numeric strings for testing SMS OTP flows, PIN entry screens, voicemail boxes, and legacy authentication mocks. It is a test fixture, not a cryptographic primitive.",
                },
              },
              {
                "@type": "Question",
                name: "Is this generator safe for real 2FA?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "No. The codes use Math.random() which is not cryptographically secure. For production OTP, TOTP, or session secrets, use crypto.randomInt() in Node or window.crypto.getRandomValues() in the browser.",
                },
              },
              {
                "@type": "Question",
                name: "Can I generate codes in bulk via API?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. Use GET https://fakeforge.com.br/api/generate?type=random4&quantity=100 for 4-digit, type=random6 for 6-digit, or type=random8 for 8-digit. Free tier is 100 calls per day, up to 10,000 codes per call.",
                },
              },
              {
                "@type": "Question",
                name: "Why does the code have leading zeros?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "OTP and PIN systems treat the code as a string, not a number. A 4-digit code 0042 is different from 42 — leading zeros are preserved so the output matches what real SMS providers send.",
                },
              },
            ],
          }),
        }}
      />
    </PageShell>
  );
}
