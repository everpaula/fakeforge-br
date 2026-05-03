import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Sobre o FakeForge BR — Quem Somos e Por Que Existe",
  description: "Conheça a história e a missão do FakeForge BR. Ferramenta criada para resolver a dor real de gerar dados brasileiros válidos para testes em compliance com LGPD.",
  alternates: { canonical: "/sobre" },
};

export default function Sobre() {
  return (
    <PageShell>
      <article className="max-w-2xl">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          Sobre o <span className="text-primary">FakeForge BR</span>
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed mb-10">
          Uma ferramenta feita por dev brasileiro, para devs brasileiros, resolvendo uma
          dor real: gerar dados de teste que passem nas validações reais do Brasil.
        </p>

        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-foreground mt-2 mb-3">A dor que resolvemos</h2>
            <p>
              Todo dev brasileiro já passou pela mesma cena: precisa testar um cadastro,
              um checkout ou popular um banco de staging. O Faker.js gera &ldquo;John Doe&rdquo; com
              endereço genérico que não passa em validação de CPF. Os geradores online
              tradicionais não têm API. Algumas libs npm de dados BR estão abandonadas.
            </p>
            <p>
              O resultado: devs perdem horas inventando CPFs na mão (e torcendo pra passar
              no validador), copiando CEPs do Google ou — pior — usando CPFs reais em
              ambientes de teste. Isso é violação direta da LGPD.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">A solução</h2>
            <p>
              O FakeForge BR gera dados brasileiros fictícios mas <strong className="text-foreground">algoritmicamente
              válidos</strong>: CPF e CNPJ passam no mod-11 da Receita, cartão passa no Luhn,
              CEPs batem com o estado, DDDs com a região, e tudo é correlacionado quando
              você pede uma pessoa completa.
            </p>
            <p>
              Tem interface web grátis e ilimitada (não precisa cadastro pra usar) e API REST
              paga para volume — porque manter API custa servidor, e queremos que o projeto
              dure.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Princípios</h2>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>
                <strong className="text-foreground">Privacidade primeiro:</strong> nenhum dado real é usado, nada que
                você gera é armazenado, IPs são hasheados antes de qualquer log.
              </li>
              <li>
                <strong className="text-foreground">Open por padrão:</strong> os algoritmos são públicos (mod-11, Luhn,
                ASCII -48 do CNPJ alfanumérico). Não há segredo — só implementação correta.
              </li>
              <li>
                <strong className="text-foreground">Sem dark patterns:</strong> sem trackers de terceiros, sem cookie
                walls intrusivos, sem upsell agressivo. Você usa quanto quiser, paga se quiser API.
              </li>
              <li>
                <strong className="text-foreground">Compliance LGPD:</strong> projetado pra ser ferramenta segura em
                ambientes de dev/staging, eliminando a necessidade de manipular dados pessoais reais.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Quem mantém</h2>
            <p>
              O FakeForge BR é mantido por <strong className="text-foreground">Everton Paula</strong>, profissional
              com 15+ anos de operações em tecnologia na América Latina. O projeto é independente —
              sem investidores, sem ads invasivos, sem coleta de dados secundários. A monetização
              vem de planos pagos da API e parcerias afiliadas declaradas.
            </p>
            <p>
              Build pública: você pode acompanhar updates no <Link href="/blog" className="text-primary hover:underline">blog</Link> e
              na <Link href="/docs" className="text-primary hover:underline">documentação da API</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Stack técnico</h2>
            <p>
              Feito com Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS 4. Hospedagem
              na Vercel, banco e auth no Supabase, pagamentos via Mercado Pago. Todos os algoritmos
              de geração e validação são implementação própria, sem dependências de Faker.js ou libs
              de terceiros — o que dá controle total sobre acurácia e estabilidade.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Quer falar com a gente?</h2>
            <p>
              <Link href="/contato" className="text-primary hover:underline">Página de contato</Link> tem todos os canais.
              Se você é dev brasileiro com sugestão de novo gerador, parceria, dúvida técnica
              ou só quer dar feedback — chega aí.
            </p>
          </section>
        </div>
      </article>

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Sobre", url: "/sobre" },
      ]} />

      {/* Person + Organization schema for E-E-A-T (helps with AdSense, AI citation) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            mainEntity: {
              "@type": "Organization",
              name: "FakeForge BR",
              url: "https://fakeforge.com.br",
              logo: "https://fakeforge.com.br/logo-icon.png",
              founder: {
                "@type": "Person",
                name: "Everton Paula",
                description: "Profissional com 15+ anos em operações de tecnologia na América Latina, mantenedor independente do FakeForge BR.",
              },
              foundingDate: "2026-04",
              description: "Gerador de dados brasileiros fictícios para desenvolvimento e testes de software, com compliance LGPD.",
              sameAs: ["https://fakeforge.com.br"],
            },
          }),
        }}
      />
    </PageShell>
  );
}
