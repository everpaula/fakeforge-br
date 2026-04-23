import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
    default: "FakeForge BR - Gerador de Dados Brasileiros para Testes",
    template: "%s | FakeForge BR",
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
    siteName: "FakeForge BR",
    title: "FakeForge BR - Gerador de Dados Brasileiros para Testes",
    description: "Gere CPF, CNPJ, CEP, nomes, emails, telefones e mais dados brasileiros fictícios para desenvolvimento e testes. Grátis e sem cadastro.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FakeForge BR — Gerador de dados brasileiros para testes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FakeForge BR - Gerador de Dados Brasileiros",
    description: "Gere CPF, CNPJ, endereços e mais dados brasileiros fictícios para testes. API REST gratuita.",
    images: ["/og-image.png"],
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
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <script
            defer
            src={process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL || "https://cloud.umami.is/script.js"}
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "FakeForge BR",
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
