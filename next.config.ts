import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Redirect www → non-www to consolidate SEO equity into a single canonical host.
  // Without this, www.fakeforge.com.br and fakeforge.com.br serve identical content
  // and the Google indexer can't tell which one is canonical.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.fakeforge.com.br" }],
        destination: "https://fakeforge.com.br/:path*",
        permanent: true,
      },
      // Consolidação de 5 thin posts de abril 2026 → seus equivalentes deeper.
      // Mantém SEO equity dos backlinks históricos via 301.
      {
        source: "/blog/como-testar-cpf-em-staging",
        destination: "/blog/validar-cpf-javascript-algoritmo-passo-a-passo",
        permanent: true,
      },
      {
        source: "/blog/lgpd-dados-de-teste",
        destination: "/blog/lgpd-testes-software-guia-pratico-devs",
        permanent: true,
      },
      {
        source: "/blog/dados-teste-pix-checkout",
        destination: "/blog/qr-code-pix-dinamico-emv-br-code-nodejs",
        permanent: true,
      },
      {
        source: "/blog/testar-pix-desenvolvimento",
        destination: "/blog/qr-code-pix-dinamico-emv-br-code-nodejs",
        permanent: true,
      },
      {
        source: "/pix/qrcode",
        destination: "/blog/qr-code-pix-dinamico-emv-br-code-nodejs",
        permanent: true,
      },
      {
        source: "/blog/popular-banco-dados-ficticios",
        destination: "/blog/popular-postgresql-dados-brasileiros-staging",
        permanent: true,
      },
      {
        source: "/blog/como-gerar-cpf-para-testes",
        destination: "/blog/como-gerar-cpf-valido-python-testes",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
