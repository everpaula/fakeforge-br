interface FaqItem {
  question: string;
  answer: string;
}

interface Props {
  items: FaqItem[];
}

/**
 * Injeta JSON-LD FAQPage schema. Google renderiza como rich snippet (FAQ
 * accordion na SERP) → ganha espaço vertical e sobe CTR em queries de
 * cauda. Pair com <section> visivel renderizando as mesmas perguntas pros
 * users (necessario pra Google aceitar o schema — tem que ter paridade).
 */
export default function FaqSchema({ items }: Props) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
