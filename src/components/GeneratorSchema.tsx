type Props = {
  name: string;
  url: string;
  description: string;
  features: string[];
  category?: string;
  inLanguage?: string;
};

/**
 * Per-page WebApplication schema for individual generator pages.
 * Adds featureList + audience signal beyond the root SoftwareApplication schema.
 */
export default function GeneratorSchema({
  name,
  url,
  description,
  features,
  category = "DeveloperApplication",
  inLanguage = "pt-BR",
}: Props) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    url,
    description,
    applicationCategory: category,
    browserRequirements: "Requires JavaScript",
    operatingSystem: "Web",
    inLanguage,
    isPartOf: {
      "@type": "WebSite",
      name: "FakeForge BR",
      url: "https://fakeforge.com.br",
    },
    audience: {
      "@type": "Audience",
      audienceType: "Software Developers, QA Engineers",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BRL",
    },
    featureList: features,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
