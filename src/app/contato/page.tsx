import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import ContactReveal from "./ContactReveal";

export const metadata: Metadata = {
  title: "Contato — FakeForge BR",
  description: "Fale com o FakeForge BR. Suporte para usuários da API, dúvidas sobre LGPD, sugestões de novos geradores, parcerias e exercício de direitos da LGPD.",
  alternates: { canonical: "/contato" },
};

export default function Contato() {
  return (
    <PageShell>
      <article className="max-w-2xl">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          Fale com a gente
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed mb-10">
          Suporte, sugestões, parcerias ou exercício de direitos LGPD — tudo passa por aqui.
        </p>

        <div className="space-y-6">
          <section className="rounded-xl bg-card border border-border p-6">
            <h2 className="text-base font-semibold text-foreground mb-2">Email principal</h2>
            <p className="text-sm text-muted-foreground mb-3">
              Para suporte técnico da API, dúvidas sobre planos, sugestões de geradores e parcerias:
            </p>
            <ContactReveal kind="contact" />
            <p className="text-xs text-muted mt-3">
              Respondemos em até 2 dias úteis. Para usuários do plano Team, prioridade em até 24h úteis.
            </p>
          </section>

          <section className="rounded-xl bg-card border border-border p-6">
            <h2 className="text-base font-semibold text-foreground mb-2">Direitos LGPD</h2>
            <p className="text-sm text-muted-foreground mb-3">
              Para exercer seus direitos previstos na Lei Geral de Proteção de Dados (acesso,
              correção, eliminação, portabilidade, revogação de consentimento):
            </p>
            <ContactReveal kind="lgpd" />
            <p className="text-xs text-muted mt-3">
              Atendimento em até 15 dias úteis conforme art. 19 da LGPD. Identifique-se com o email da
              sua conta para acelerar a verificação.
            </p>
          </section>

          <section className="rounded-xl bg-card border border-border p-6">
            <h2 className="text-base font-semibold text-foreground mb-2">Imprensa e mídia</h2>
            <p className="text-sm text-muted-foreground mb-3">
              Jornalistas, podcasters ou newsletters de dev/tech querendo cobrir o projeto:
            </p>
            <ContactReveal kind="press" />
            <p className="text-xs text-muted mt-3">
              Disponibilizamos kit de imprensa, dados de uso anonimizados e entrevista com o mantenedor.
            </p>
          </section>

          <section className="rounded-xl bg-primary/5 border border-primary/20 p-6">
            <h2 className="text-base font-semibold text-foreground mb-2">Antes de enviar email</h2>
            <p className="text-sm text-muted-foreground mb-3">
              Sua dúvida pode estar respondida em:
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1.5 pl-2">
              <li><a href="/docs" className="text-primary hover:underline">Documentação da API</a> — endpoints, autenticação, rate limits</li>
              <li><a href="/blog" className="text-primary hover:underline">Blog</a> — tutoriais e comparativos</li>
              <li><a href="/pricing" className="text-primary hover:underline">Preços</a> — FAQ sobre planos e cancelamento</li>
              <li><a href="/privacidade" className="text-primary hover:underline">Privacidade</a> — como tratamos dados</li>
            </ul>
          </section>
        </div>
      </article>

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Contato", url: "/contato" },
      ]} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contato FakeForge BR",
            url: "https://fakeforge.com.br/contato",
            inLanguage: "pt-BR",
          }),
        }}
      />
    </PageShell>
  );
}
