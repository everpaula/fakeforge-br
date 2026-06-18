interface Props {
  title: string;
  slug: string;
  description?: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
}

/**
 * Per-post BlogPosting schema. Renders inside individual blog post pages.
 * The blog index already exposes a Blog container listing all posts; this
 * complements it by giving each post URL its own BlogPosting block — required
 * by Google to be eligible for article rich results.
 */
export default function BlogPostingSchema({
  title,
  slug,
  description = "",
  datePublished,
  dateModified,
  image,
}: Props) {
  const url = `https://fakeforge.com.br/blog/${slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url,
    datePublished,
    dateModified: dateModified || datePublished,
    inLanguage: "pt-BR",
    author: {
      "@type": "Organization",
      name: "FakeForge BR",
      url: "https://fakeforge.com.br",
    },
    publisher: {
      "@type": "Organization",
      name: "FakeForge BR",
      url: "https://fakeforge.com.br",
      logo: {
        "@type": "ImageObject",
        url: "https://fakeforge.com.br/logo-icon.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    ...(image ? { image } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
