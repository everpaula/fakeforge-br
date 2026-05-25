import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import ApiCtaBanner from "@/components/ApiCtaBanner";
import ApiCtaTop from "@/components/ApiCtaTop";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import GeneratorSchema from "@/components/GeneratorSchema";
import type { DataType } from "@/lib/generators";

export interface BrandLandingConfig {
  brandName: string; // "Visa", "Mastercard", etc
  brandSlug: string; // "visa", "mastercard"
  generatorType: DataType;
  prefixDescription: string;
  cardLength: number;
  cvvLength: number;
  faqs: { q: string; a: string }[];
  about: string;
  history: string;
  technicalNote?: string;
}

export default function BrandCardLanding({ config }: { config: BrandLandingConfig }) {
  const { brandName, brandSlug, generatorType, prefixDescription, cardLength, cvvLength, faqs, about, history, technicalNote } = config;

  return (
    <PageShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de Cartão <span className="text-primary">{brandName}</span>
        </h1>
        <p className="text-muted mt-3 text-sm leading-relaxed max-w-2xl">
          Gere números de cartão {brandName} fictícios válidos pelo algoritmo de Luhn (mod-10).
          {prefixDescription} {cardLength} dígitos no total + CVV de {cvvLength} dígitos. Para
          testar checkouts, integração com gateways e formulários sem usar cartões reais.
        </p>
      </div>

      <ApiCtaTop dataType={`cartões ${brandName}`} />

      <SingleGenerator
        type={generatorType}
        label={`Cartão ${brandName}`}
        description={`Clique em Gerar para criar cartões ${brandName} fictícios`}
      />

      <ApiCtaBanner dataType={`cartões ${brandName}`} />

      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Sobre a bandeira {brandName}</h2>
          <p>{about}</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Como o número é gerado</h2>
          <p>{history}</p>
          {technicalNote && (
            <p className="mt-3"><strong className="text-foreground">Nota técnica:</strong> {technicalNote}</p>
          )}
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {faqs.map(({ q, a }) => (
              <details key={q} className="group border border-border rounded-lg">
                <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                  <span className="text-sm font-medium text-foreground">{q}</span>
                  <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
                </summary>
                <p className="px-4 pb-3 text-sm text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-10 pt-8 border-t border-border">
        <h2 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wider">Outras bandeiras</h2>
        <div className="flex flex-wrap gap-2">
          {["visa", "mastercard", "elo", "hipercard", "amex"].filter(b => b !== brandSlug).map(b => (
            <Link
              key={b}
              href={`/gerador-cartao/${b}`}
              className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors capitalize"
            >
              {b === "amex" ? "Amex" : b}
            </Link>
          ))}
          <Link href="/gerador-cartao" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">
            Qualquer bandeira
          </Link>
          <Link href="/gerador-pix" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Gerador de PIX</Link>
          <Link href="/docs" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">API REST</Link>
        </div>
      </div>

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Geradores", url: "/geradores" },
        { name: "Cartão de Crédito", url: "/gerador-cartao" },
        { name: brandName, url: `/gerador-cartao/${brandSlug}` },
      ]} />

      <GeneratorSchema
        name={`Gerador de Cartão ${brandName}`}
        url={`https://fakeforge.com.br/gerador-cartao/${brandSlug}`}
        description={`Gere cartão ${brandName} fictício válido pelo algoritmo de Luhn (mod-10) com ${cardLength} dígitos e CVV de ${cvvLength}. Para testes de checkout, gateways de pagamento e formulários, sem usar cartões reais.`}
        features={[
          "Algoritmo de Luhn (mod-10) com dígito verificador correto",
          `${cardLength} dígitos no formato ISO/IEC 7812`,
          `CVV de ${cvvLength} dígitos e data de validade fictícia`,
          `Prefixo BIN específico da bandeira ${brandName}`,
          "Geração em lote até 10.000 por chamada",
          "Export JSON, CSV e SQL",
          "API REST gratuita com 100 chamadas/dia",
        ]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map(({ q, a }) => ({
              "@type": "Question",
              name: q,
              acceptedAnswer: { "@type": "Answer", text: a },
            })),
          }),
        }}
      />
    </PageShell>
  );
}
