import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import PricingClient from "./PricingClient";

export const metadata: Metadata = {
  title: "Preços do FakeForge BR — API de Dados Brasileiros a partir de R$0",
  description: "Use os geradores grátis no navegador para sempre. Para integrar a API REST no código ou CI/CD, escolha entre Dev (R$29/mês, 10 mil chamadas/dia) ou Team (R$79/mês, 100 mil chamadas/dia).",
  keywords: "preço gerador dados brasileiros, api cpf cnpj preço, fakeforge planos, api dados teste mensal",
  alternates: { canonical: "/pricing" },
};

const FAQ = [
  { q: "Posso cancelar a qualquer momento?", a: "Sim. Não há fidelidade ou multa. Cancele quando quiser pelo dashboard." },
  { q: "O upgrade é instantâneo?", a: "Sim. Assim que o pagamento for confirmado, seu limite de chamadas aumenta automaticamente." },
  { q: "Preciso trocar minha API key?", a: "Não. A mesma key que você já usa continua funcionando com o novo limite." },
  { q: "Aceita quais formas de pagamento?", a: "Cartão de crédito, Pix e boleto via Mercado Pago." },
  { q: "A geração pelo site continua grátis?", a: "Sim. O uso pelo site (gerar, copiar, exportar) é grátis e ilimitado, sempre. Os planos pagos são para uso via API." },
];

export default function Pricing() {
  return (
    <PageShell>
      <PricingClient />

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Preços", url: "/pricing" },
      ]} />

      {/* FAQPage JSON-LD for rich snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ.map(({ q, a }) => ({
              "@type": "Question",
              name: q,
              acceptedAnswer: { "@type": "Answer", text: a },
            })),
          }),
        }}
      />

      {/* Product/Offer schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "FakeForge BR API",
            description: "API REST para gerar dados brasileiros fictícios (CPF, CNPJ, CEP, PIX, cartão, pessoa) com formatação válida e dígitos verificadores corretos.",
            brand: { "@type": "Brand", name: "FakeForge BR" },
            offers: [
              {
                "@type": "Offer",
                name: "Free",
                price: "0",
                priceCurrency: "BRL",
                description: "100 chamadas/dia, todos os tipos de dados, export JSON/CSV/SQL",
                availability: "https://schema.org/InStock",
                url: "https://fakeforge.com.br/pricing",
              },
              {
                "@type": "Offer",
                name: "Dev",
                price: "29",
                priceCurrency: "BRL",
                description: "10.000 chamadas/dia, schema builder, presets",
                availability: "https://schema.org/InStock",
                url: "https://fakeforge.com.br/pricing",
              },
              {
                "@type": "Offer",
                name: "Team",
                price: "79",
                priceCurrency: "BRL",
                description: "100.000 chamadas/dia, múltiplas API keys, dashboard de uso",
                availability: "https://schema.org/InStock",
                url: "https://fakeforge.com.br/pricing",
              },
            ],
          }),
        }}
      />
    </PageShell>
  );
}
