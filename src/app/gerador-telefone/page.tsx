import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import ApiCtaBanner from "@/components/ApiCtaBanner";
import GeneratorSchema from "@/components/GeneratorSchema";
import RelatedGenerators from "@/components/RelatedGenerators";

export const metadata: Metadata = {
  title: "Gerador de Telefone, Celular e Fixo com DDD do Brasil",
  description: "Gere celular e telefone fixo brasileiro com DDD real (67 DDDs), formato ANATEL e prefixo 9. Para testar formulários, SMS e APIs. Grátis, sem cadastro.",
  keywords: "gerador de telefone, gerador de celular, gerador telefone fixo, números telefones residenciais, número celular fictício, telefone fake brasileiro, DDD válido, gerador número SMS, ANATEL formato, gerar telefone teste, gerador de tel, generador de numero de telefono brasil, numero de telefono brasil generador, generador telefono brasileño",
  openGraph: {
    title: "Gerador de Telefone e Celular Brasileiro Válido",
    description: "Celular e fixo com DDD real do Brasil para testes de formulários, SMS, APIs e checkout. Grátis.",
    type: "website",
    images: ["/api/og?title=Gerador+de+Telefone+e+Celular&subtitle=N%C3%BAmero+brasileiro+com+DDD+real+para+testes+de+SMS+e+formul%C3%A1rios&category=GERADOR"],
  },
  alternates: { canonical: "/gerador-telefone" },
};

const DDD_POR_ESTADO = [
    ["São Paulo (SP)", "11, 12, 13, 14, 15, 16, 17, 18, 19", "11"],
    ["Rio de Janeiro (RJ)", "21, 22, 24", "21"],
    ["Espírito Santo (ES)", "27, 28", "27"],
    ["Minas Gerais (MG)", "31, 32, 33, 34, 35, 37, 38", "31"],
    ["Paraná (PR)", "41, 42, 43, 44, 45, 46", "41"],
    ["Santa Catarina (SC)", "47, 48, 49", "48"],
    ["Rio Grande do Sul (RS)", "51, 53, 54, 55", "51"],
    ["Distrito Federal (DF)", "61", "61"],
    ["Goiás (GO)", "62, 64", "62"],
    ["Tocantins (TO)", "63", "63"],
    ["Mato Grosso (MT)", "65, 66", "65"],
    ["Mato Grosso do Sul (MS)", "67", "67"],
    ["Acre (AC)", "68", "68"],
    ["Rondônia (RO)", "69", "69"],
    ["Bahia (BA)", "71, 73, 74, 75, 77", "71"],
    ["Sergipe (SE)", "79", "79"],
    ["Pernambuco (PE)", "81, 87", "81"],
    ["Alagoas (AL)", "82", "82"],
    ["Paraíba (PB)", "83", "83"],
    ["Rio Grande do Norte (RN)", "84", "84"],
    ["Ceará (CE)", "85, 88", "85"],
    ["Piauí (PI)", "86, 89", "86"],
    ["Pará (PA)", "91, 93, 94", "91"],
    ["Amazonas (AM)", "92, 97", "92"],
    ["Roraima (RR)", "95", "95"],
    ["Amapá (AP)", "96", "96"],
    ["Maranhão (MA)", "98, 99", "98"],
  ];

const TIPOS_TELEFONE = [
  ["Celular", "11 (DDD + 9 + 8 dígitos)", "9", "(11) 98765-4321"],
  ["Fixo e residencial", "10 (DDD + 8 dígitos)", "2, 3, 4 ou 5", "(11) 3456-7890"],
];

export default function GeradorTelefone() {
  return (
    <PageShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">Telefone</span>, Celular e Fixo Residencial
        </h1>
        <p className="text-foreground mt-3 text-sm leading-relaxed max-w-2xl">
          O FakeForge é um gerador de telefone brasileiro que cria celulares (11 dígitos) e fixos (10 dígitos)
          com um dos 67 DDDs reais e no formato da ANATEL. Os números são fictícios, grátis sem cadastro
          e saem em JSON, CSV ou SQL pela API REST (100 chamadas por dia no plano gratuito).
        </p>
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

      <div className="mt-6 flex flex-wrap gap-2">
        <span className="text-xs text-muted self-center mr-2">Guias específicos:</span>
        <Link href="/numero-de-celular-aleatorio" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Celular aleatório</Link>
        <Link href="/telefone-aleatorio" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Telefone aleatório</Link>
        <Link href="/gerador-de-numero-fake" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Número fake</Link>
        <Link href="/gerador-telefone-fixo" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Fixo residencial</Link>
        <Link href="/gerador-numero-para-cadastro" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Para cadastro</Link>
      </div>

      <ApiCtaBanner dataType="telefones" />

      {/* SEO content */}
      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Como funciona a numeração telefônica no Brasil?</h2>
          <p>
            A ANATEL regulamenta a numeração brasileira. Celulares têm 11 dígitos (DDD + 9 + 8 dígitos)
            e telefones fixos têm 10 dígitos (DDD + 8 dígitos). O DDD identifica a região: 11 é São Paulo,
            21 é Rio de Janeiro, 31 é Belo Horizonte, e assim por diante. O FakeForge sorteia números entre os
            67 DDDs reais do país (tabela abaixo).
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
          <h2 className="text-lg font-semibold text-foreground mb-2">DDD por estado no Brasil</h2>
          <p className="mb-3">
            O Plano de Numeração da ANATEL define 67 DDDs, agrupados por estado. O gerador sorteia entre todos eles. O DDD da capital está na terceira coluna.
          </p>
          <div className="overflow-x-auto rounded-lg bg-card border border-border">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-3 py-2 text-muted">Estado</th>
                  <th className="text-left px-3 py-2 text-muted">DDDs</th>
                  <th className="text-left px-3 py-2 text-muted">DDD da capital</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {DDD_POR_ESTADO.map((r) => (
                  <tr key={r[0]}>
                    <td className="px-3 py-2 text-foreground">{r[0]}</td>
                    <td className="px-3 py-2 text-muted-foreground">{r[1]}</td>
                    <td className="px-3 py-2 text-muted-foreground">{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Celular vs telefone fixo: formato ANATEL</h2>
          <div className="overflow-x-auto rounded-lg bg-card border border-border">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-3 py-2 text-muted">Tipo</th>
                  <th className="text-left px-3 py-2 text-muted">Dígitos (com DDD)</th>
                  <th className="text-left px-3 py-2 text-muted">Primeiro dígito após o DDD</th>
                  <th className="text-left px-3 py-2 text-muted">Exemplo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {TIPOS_TELEFONE.map((r) => (
                  <tr key={r[0]}>
                    <td className="px-3 py-2 text-foreground">{r[0]}</td>
                    <td className="px-3 py-2 text-muted-foreground">{r[1]}</td>
                    <td className="px-3 py-2 text-muted-foreground">{r[2]}</td>
                    <td className="px-3 py-2 text-muted-foreground">{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

      <RelatedGenerators currentSlug="gerador-telefone" />

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
