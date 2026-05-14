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
    ];
  },
};

export default nextConfig;
