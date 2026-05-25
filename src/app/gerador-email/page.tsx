import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import ApiCtaBanner from "@/components/ApiCtaBanner";
import GeneratorSchema from "@/components/GeneratorSchema";

export const metadata: Metadata = {
  title: "Gerador de Email Fictício - Emails para Testes | FakeForge BR",
  description: "Gere endereços de email fictícios com domínios brasileiros e internacionais. Ideal para testes de cadastro, formulários e integração com APIs. Grátis e sem cadastro.",
  keywords: "gerador de email, email fictício, email para testes, email falso, gerador de email brasileiro, email temporário testes",
  openGraph: {
    title: "Gerador de Email Fictício - FakeForge BR",
    description: "Gere emails fictícios com domínios BR e internacionais para testes. Grátis e sem cadastro.",
    type: "website",
  },
};

export default function GeradorEmail() {
  return (
    <PageShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">Email</span> Fictício
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Gere endereços de email fictícios com nomes brasileiros e domínios realistas.
          Os emails são baseados em nomes comuns no Brasil e usam domínios como gmail.com, hotmail.com,
          outlook.com.br e outros. Ideal para testes de cadastro, formulários e integração com serviços de email.
        </p>
      </div>

      <SingleGenerator
        type="email"
        label="Email"
        description="Clique em Gerar para criar emails fictícios"
      />

      <ApiCtaBanner dataType="emails" />

      {/* SEO content */}
      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Por que usar emails fictícios em testes?</h2>
          <p>
            Usar emails reais em ambientes de teste é arriscado: notificações podem ser enviadas acidentalmente,
            dados pessoais podem vazar em logs, e você pode violar a LGPD ao processar emails de pessoas reais
            sem consentimento. Emails fictícios eliminam todos esses riscos.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Como os emails são gerados?</h2>
          <p>
            O FakeForge combina nomes e sobrenomes brasileiros comuns com domínios de email populares.
            Os endereços seguem padrões realistas (nome.sobrenome@dominio.com, nome_sobrenome@dominio.com.br)
            para que passem em validações de formato sem pertencer a ninguém.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Casos de uso comuns</h2>
          <p>
            Popular bancos de dados de desenvolvimento, testar fluxos de cadastro e login,
            validar campos de email em formulários, testar envio de emails transacionais
            em staging, e gerar dados de seed para ambientes de QA.
          </p>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {[
              { q: "Os emails gerados são reais?", a: "Não. Os emails são fictícios — combinam nomes brasileiros comuns com domínios populares. Não são endereços reais e não recebem mensagens." },
              { q: "Posso usar esses emails para receber mensagens?", a: "Não. São emails fictícios para preenchimento de formulários e testes. Se você precisa de email temporário funcional, procure serviços de email descartável." },
              { q: "Os emails passam em validação de formato?", a: "Sim. Todos seguem o padrão RFC 5322 (usuario@dominio.tld) e passam em qualquer validação de formato de email." },
              { q: "Os nomes nos emails são brasileiros?", a: "Sim. O FakeForge usa uma base de nomes e sobrenomes comuns no Brasil para gerar emails realistas como maria.silva@gmail.com ou joao.santos@hotmail.com." },
              { q: "Posso gerar emails em massa via API?", a: "Sim. Use GET https://fakeforge.com.br/api/generate?type=email&quantity=100. São 100 chamadas grátis por dia." },
              { q: "O FakeForge armazena os emails gerados?", a: "Não. Os emails são gerados em tempo real e descartados imediatamente. Nenhum dado é armazenado ou rastreado." },
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
          <Link href="/gerador-telefone" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Gerador de Telefone</Link>
          <Link href="/gerador-cpf" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Gerador de CPF</Link>
          <Link href="/gerador-cnpj" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Gerador de CNPJ</Link>
          <Link href="/gerador-pix" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Gerador de PIX</Link>
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
              { "@type": "Question", name: "Os emails gerados são reais?", acceptedAnswer: { "@type": "Answer", text: "Não. Os emails são fictícios — combinam nomes brasileiros comuns com domínios populares. Não são endereços reais e não recebem mensagens." } },
              { "@type": "Question", name: "Posso usar esses emails para receber mensagens?", acceptedAnswer: { "@type": "Answer", text: "Não. São emails fictícios para preenchimento de formulários e testes. Se você precisa de email temporário funcional, procure serviços de email descartável." } },
              { "@type": "Question", name: "Os emails passam em validação de formato?", acceptedAnswer: { "@type": "Answer", text: "Sim. Todos seguem o padrão RFC 5322 (usuario@dominio.tld) e passam em qualquer validação de formato de email." } },
              { "@type": "Question", name: "Os nomes nos emails são brasileiros?", acceptedAnswer: { "@type": "Answer", text: "Sim. O FakeForge usa uma base de nomes e sobrenomes comuns no Brasil para gerar emails realistas como maria.silva@gmail.com ou joao.santos@hotmail.com." } },
              { "@type": "Question", name: "Posso gerar emails em massa via API?", acceptedAnswer: { "@type": "Answer", text: "Sim. Use GET https://fakeforge.com.br/api/generate?type=email&quantity=100. São 100 chamadas grátis por dia." } },
              { "@type": "Question", name: "O FakeForge armazena os emails gerados?", acceptedAnswer: { "@type": "Answer", text: "Não. Os emails são gerados em tempo real e descartados imediatamente. Nenhum dado é armazenado ou rastreado." } },
            ],
          }),
        }}
      />

      <GeneratorSchema
        name="Gerador de Email Brasileiro"
        url="https://fakeforge.com.br/gerador-email"
        description="Gere email fictício com domínios brasileiros (gmail.com, hotmail.com, outlook.com.br, uol.com.br, terra.com.br) e nomes derivados de nomes brasileiros típicos para testes."
        features={[
          "Domínios brasileiros populares (gmail, hotmail, outlook, uol, terra)",
          "Nome de usuário derivado de nomes brasileiros (acentos removidos)",
          "Geração em lote até 10.000 por chamada",
          "Formato primeironome.sobrenome ou primeironome_sobrenome",
          "Export JSON, CSV e SQL",
          "API REST gratuita com 100 chamadas/dia",
        ]}
      />
    </PageShell>
  );
}
