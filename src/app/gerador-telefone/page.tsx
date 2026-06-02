import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import ApiCtaBanner from "@/components/ApiCtaBanner";
import GeneratorSchema from "@/components/GeneratorSchema";

export const metadata: Metadata = {
  title: "Gerador de Telefone, Celular e Fixo Residencial com DDD do Brasil",
  description: "Gere número de celular, telefone fixo ou residencial brasileiro com DDD real (67 DDDs válidos), formato ANATEL e prefixo 9 do celular. Para testes de formulários, SMS, APIs e checkout. Grátis e sem cadastro.",
  keywords: "gerador de telefone, gerador de celular, gerador telefone fixo, números telefones residenciais, número celular fictício, telefone fake brasileiro, DDD válido, gerador número SMS, ANATEL formato, gerar telefone teste, gerador de tel, generador de numero de telefono brasil, numero de telefono brasil generador, generador telefono brasileño",
  openGraph: {
    title: "Gerador de Telefone e Celular Brasileiro Válido",
    description: "Celular e fixo com DDD real do Brasil para testes de formulários, SMS, APIs e checkout. Grátis.",
    type: "website",
    images: ["/api/og?title=Gerador+de+Telefone+e+Celular&subtitle=N%C3%BAmero+brasileiro+com+DDD+real+para+testes+de+SMS+e+formul%C3%A1rios&category=GERADOR"],
  },
  alternates: { canonical: "/gerador-telefone" },
};

export default function GeradorTelefone() {
  return (
    <PageShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">Telefone</span>, Celular e Fixo Residencial
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Gere números de celular, telefone fixo e residencial brasileiros fictícios com DDDs válidos.
          Os números seguem o formato real da ANATEL (celular com 9 dígitos, fixo e residencial com 8),
          mas não pertencem a nenhuma linha ativa. Ideal para testes de formulários, validação de campos
          e integração com APIs de SMS.
        </p>
      </div>

      <div className="space-y-6">
        <SingleGenerator
          type="phone"
          label="Celular"
          description="Clique em Gerar para criar números de celular"
        />
        <SingleGenerator
          type="landline"
          label="Telefone Fixo / Residencial"
          description="Clique em Gerar para criar números de telefone fixo ou residencial"
        />
      </div>

      <ApiCtaBanner dataType="telefones" />

      {/* SEO content */}
      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Como funciona a numeração telefônica no Brasil?</h2>
          <p>
            A ANATEL regulamenta a numeração brasileira. Celulares têm 11 dígitos (DDD + 9 + 8 dígitos)
            e telefones fixos têm 10 dígitos (DDD + 8 dígitos). O DDD identifica a região: 11 é São Paulo,
            21 é Rio de Janeiro, 31 é Belo Horizonte, e assim por diante. O FakeForge gera números com DDDs
            reais dos 10 principais estados brasileiros.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Para que usar um gerador de telefone?</h2>
          <p>
            Testar campos de telefone em formulários, validar máscaras de input, popular bancos de dados
            de desenvolvimento, testar integração com APIs de SMS (como Twilio ou Zenvia) e criar cenários
            de QA que envolvem contato telefônico. Usar números reais em testes pode gerar ligações indesejadas
            e violar a LGPD.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Diferença entre celular e fixo</h2>
          <p>
            Celulares brasileiros sempre começam com 9 após o DDD (ex: 11 9XXXX-XXXX), totalizando 11 dígitos.
            Telefones fixos não têm o 9 inicial e têm 10 dígitos (ex: 11 XXXX-XXXX). O FakeForge gera ambos
            os formatos corretamente, com ou sem formatação.
          </p>
        </section>

        {/* Spanish section for ES-speaking developers */}
        <section lang="es">
          <h2 className="text-lg font-semibold text-foreground mb-2">Generador de números de teléfono de Brasil</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Si llegaste buscando un <strong>generador de número de teléfono brasileño</strong> para tus tests:
            FakeForge crea números de móvil y fijo brasileños con DDD real (los 67 códigos de área del país)
            y formato ANATEL. Útil para QA, integraciones con APIs de SMS, formularios y datos de prueba en
            checkout. Gratis y sin registro. Los números son ficticios, no corresponden a líneas activas.
          </p>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {[
              { q: "Os números gerados são de linhas reais?", a: "Não. Os números são fictícios. Seguem o formato correto da ANATEL com DDDs válidos, mas não correspondem a nenhuma linha telefônica ativa." },
              { q: "Qual a diferença entre celular, telefone fixo e residencial?", a: "Celular tem 9 dígitos e começa com 9 após o DDD (ex: (11) 98765-4321). Telefone fixo comercial e residencial têm 8 dígitos e começam com 2, 3, 4 ou 5 após o DDD (ex: (11) 3456-7890). O FakeForge gera ambos os formatos respeitando a regra ANATEL." },
              { q: "Posso usar esses números para testes de SMS?", a: "Sim. São ideais para testar a validação e formatação em sistemas que enviam SMS. Obviamente, nenhuma mensagem será entregue, já que os números não existem." },
              { q: "Os DDDs gerados são reais?", a: "Sim. O FakeForge usa DDDs reais dos principais estados brasileiros (11-SP, 21-RJ, 31-MG, 41-PR, 51-RS, etc.), garantindo que o formato passe em validações regionais." },
              { q: "Qual o formato do número gerado?", a: "Celular: (11) 98765-4321 (formatado) ou 11987654321 (sem formato). Fixo: (11) 3456-7890 (formatado) ou 1134567890 (sem formato). Use o toggle 'Formatado' para alternar." },
              { q: "Posso gerar números em massa via API?", a: "Sim. Use GET https://fakeforge.com.br/api/generate?type=phone&quantity=100 para celulares ou type=landline para fixos. São 100 chamadas grátis por dia." },
              { q: "O FakeForge armazena os números gerados?", a: "Não. Os números são gerados em tempo real e descartados imediatamente. Nenhum dado é armazenado ou rastreado." },
            ].map(({ q, a }) => (
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

      {/* Cross-links */}
      <div className="mt-10 pt-8 border-t border-border">
        <h2 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wider">Ferramentas relacionadas</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/gerador-email" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Gerador de Email</Link>
          <Link href="/gerador-cpf" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Gerador de CPF</Link>
          <Link href="/gerador-pix" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Gerador de PIX</Link>
          <Link href="/gerador-cartao" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Gerador de Cartão</Link>
          <Link href="/docs" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">API REST</Link>
        </div>
      </div>

      {/* FAQPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Os números gerados são de linhas reais?", acceptedAnswer: { "@type": "Answer", text: "Não. Os números são fictícios. Seguem o formato correto da ANATEL com DDDs válidos, mas não correspondem a nenhuma linha telefônica ativa." } },
              { "@type": "Question", name: "Qual a diferença entre celular, telefone fixo e residencial?", acceptedAnswer: { "@type": "Answer", text: "Celular tem 9 dígitos e começa com 9 após o DDD (ex: (11) 98765-4321). Telefone fixo comercial e residencial têm 8 dígitos e começam com 2, 3, 4 ou 5 após o DDD (ex: (11) 3456-7890). O FakeForge gera ambos os formatos respeitando a regra ANATEL." } },
              { "@type": "Question", name: "Posso usar esses números para testes de SMS?", acceptedAnswer: { "@type": "Answer", text: "Sim. São ideais para testar a validação e formatação em sistemas que enviam SMS. Obviamente, nenhuma mensagem será entregue, já que os números não existem." } },
              { "@type": "Question", name: "Os DDDs gerados são reais?", acceptedAnswer: { "@type": "Answer", text: "Sim. O FakeForge usa DDDs reais dos principais estados brasileiros (11-SP, 21-RJ, 31-MG, 41-PR, 51-RS, etc.), garantindo que o formato passe em validações regionais." } },
              { "@type": "Question", name: "Qual o formato do número gerado?", acceptedAnswer: { "@type": "Answer", text: "Celular: (11) 98765-4321 (formatado) ou 11987654321 (sem formato). Fixo: (11) 3456-7890 (formatado) ou 1134567890 (sem formato). Use o toggle 'Formatado' para alternar." } },
              { "@type": "Question", name: "Posso gerar números em massa via API?", acceptedAnswer: { "@type": "Answer", text: "Sim. Use GET https://fakeforge.com.br/api/generate?type=phone&quantity=100 para celulares ou type=landline para fixos. São 100 chamadas grátis por dia." } },
              { "@type": "Question", name: "O FakeForge armazena os números gerados?", acceptedAnswer: { "@type": "Answer", text: "Não. Os números são gerados em tempo real e descartados imediatamente. Nenhum dado é armazenado ou rastreado." } },
            ],
          }),
        }}
      />

      <GeneratorSchema
        name="Gerador de Telefone Brasileiro"
        url="https://fakeforge.com.br/gerador-telefone"
        description="Gere telefone brasileiro fictício para testes: celular (9 prefix) ou fixo, com DDD válido entre os 67 códigos de área do Brasil. Para uso em desenvolvimento e QA."
        features={[
          "67 DDDs válidos do Brasil cobertos",
          "Celular (9XXXX-XXXX) e fixo",
          "Formato +55(DDD) ou apenas dígitos",
          "Geração em lote até 10.000 por chamada",
          "Export JSON, CSV e SQL",
          "API REST gratuita com 100 chamadas/dia",
        ]}
      />
    </PageShell>
  );
}
