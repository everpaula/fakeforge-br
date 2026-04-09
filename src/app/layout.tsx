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
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "FakeForge BR",
    title: "FakeForge BR - Gerador de Dados Brasileiros para Testes",
    description: "Gere CPF, CNPJ, CEP, nomes, emails, telefones e mais dados brasileiros fictícios para desenvolvimento e testes. Grátis e sem cadastro.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FakeForge BR - Gerador de Dados Brasileiros",
    description: "Gere CPF, CNPJ, endereços e mais dados brasileiros fictícios para testes. API REST gratuita.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.svg",
  },
  alternates: {
    canonical: "/",
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
