import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import ReferralCapture from "@/components/ReferralCapture";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "FakeForge: Gerador de Dados Brasileiros Válidos para Testes",
    // No suffix. Each page sets its own complete title so we can keep them
    // under the 60-char SERP truncation limit per page.
    template: "%s",
  },
  description: "Gere CPF, CNPJ, CEP, nomes, emails, telefones e mais dados brasileiros fictícios para desenvolvimento e testes. API gratuita.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://fakeforge.com.br"),
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/logo-icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/logo-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  alternates: {
    canonical: "/",
    languages: {
      "pt-BR": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "FakeForge",
    title: "FakeForge - Gerador de Dados Brasileiros para Testes",
    description: "Gere CPF, CNPJ, CEP, nomes, emails, telefones e mais dados brasileiros fictícios para desenvolvimento e testes. Grátis e sem cadastro.",
    images: [
      {
        url: "/api/og?title=FakeForge+BR&subtitle=Gerador+de+dados+brasileiros+v%C3%A1lidos+para+testes",
        width: 1200,
        height: 630,
        alt: "FakeForge: gerador de dados brasileiros para testes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FakeForge - Gerador de Dados Brasileiros",
    description: "Gere CPF, CNPJ, endereços e mais dados brasileiros fictícios para testes. API REST gratuita.",
    images: ["/api/og?title=FakeForge+BR&subtitle=Gerador+de+dados+brasileiros+v%C3%A1lidos+para+testes"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Google Analytics (gtag.js) - G-RP4KV5SD88 */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-RP4KV5SD88"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-RP4KV5SD88');`,
          }}
        />
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <script
            defer
            src={process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL || "https://cloud.umami.is/script.js"}
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          />
        )}
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
          />
        )}
        {process.env.NEXT_PUBLIC_ETHICALADS_PUBLISHER && (
          <script async src="https://media.ethicalads.io/media/client/ethicalads.min.js" />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "FakeForge",
              description: "Gerador de dados brasileiros fictícios para testes — CPF, CNPJ, CEP, nomes, emails, telefones, cartões e mais. API REST gratuita.",
              url: "https://fakeforge.com.br",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Web",
              offers: [
                { "@type": "Offer", price: "0", priceCurrency: "BRL", name: "Free" },
                { "@type": "Offer", price: "29", priceCurrency: "BRL", name: "Dev" },
                { "@type": "Offer", price: "79", priceCurrency: "BRL", name: "Team" },
              ],
              inLanguage: "pt-BR",
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Suspense fallback={null}>
          <ReferralCapture />
        </Suspense>
        {children}
        {/* Sticky footer ad slot — only renders if EthicalAds publisher ID is set */}
        {process.env.NEXT_PUBLIC_ETHICALADS_PUBLISHER && (
          <div
            data-ea-publisher={process.env.NEXT_PUBLIC_ETHICALADS_PUBLISHER}
            data-ea-type="image"
            data-ea-style="fixedfooter"
            data-ea-campaign-types="paid|community|house"
          />
        )}
        <Analytics />
      </body>
    </html>
  );
}
