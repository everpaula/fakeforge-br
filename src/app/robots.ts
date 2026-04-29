import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://fakeforge.com.br";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/dashboard/",
        "/admin/",
        "/login/",
        "/auth/",
        "/*?*",
        "/*/icon*",
        "/*/apple-icon*",
        "/*/opengraph-image*",
        "/*/twitter-image*",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
