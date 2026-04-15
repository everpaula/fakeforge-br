import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import ApiCtaBanner from "@/components/ApiCtaBanner";

export const metadata: Metadata = {
  title: "Gerador de Pessoa Fictícia - Dados Pessoais Completos | FakeForge BR",
  description: "Gere pessoas fictícias completas com nome, CPF, email, telefone e endereço brasileiro. Dados correlacionados e válidos para testes de software. Grátis e sem cadastro.",
  keywords: "gerador de pessoa fictícia, gerador de dados pessoais, pessoa fake, dados fictícios brasileiros, gerador de nome cpf email, dados teste cadastro",
  openGraph: {
    title: "Gerador de Pessoa Fictícia - FakeForge BR",
    description: "Gere pessoas fictícias completas com dados brasileiros correlacionados para testes. Grátis e sem cadastro.",
    type: "website",
  },
};

export default function GeradorPessoa() {
  return (
    <PageShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">Pessoa</span> Fictícia
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Gere perfis completos de pessoas fictícias brasileiras com nome, sobrenome e gênero.
          Os dados são gerados com nomes comuns no Brasil e podem ser combinados com outros
          geradores (CPF, email, telefone, endereço) para criar cadastros completos.
          Ideal para popular bancos de dados de teste, seeds e cenários de QA.
        </p>
      </div>

      <div className="space-y-6">
        <SingleGenerator
          type="person"
          label="Pessoa Completa"
          description="Clique em Gerar para criar perfis de pessoas fictícias"
        />
        <SingleGenerator
          type="fullName"
          label="Nome Completo"
          description="Nomes e sobrenomes brasileiros"
        />
      </div>

      <ApiCtaBanner dataType="pessoas" />

      {/* SEO content */}
      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">O que é um gerador de pessoa fictícia?</h2>
          <p>
            Um gerador de pessoa fictícia cria perfis completos com dados brasileiros realistas — nome,
            sobrenome, gênero — que não pertencem a ninguém real. O FakeForge usa uma base de nomes
            e sobrenomes comuns no Brasil para que os dados pareçam naturais em formulários e bancos de dados.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Dados correlacionados via API</h2>
          <p>
            Ao usar o preset &ldquo;customer&rdquo; da API, o FakeForge gera uma pessoa completa com todos os campos
            correlacionados: o email usa o nome da pessoa, o telefone tem DDD do mesmo estado do CEP,
            e o cartão de crédito tem o nome do titular correto. Isso é algo que o Faker.js não faz nativamente.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Casos de uso</h2>
          <p>
            Popular bancos de dados de desenvolvimento (seed), testar formulários de cadastro,
            criar cenários de teste para e-commerce, gerar dados de amostra para demos e apresentações,
            e alimentar pipelines de CI/CD com dados brasileiros realistas.
          </p>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {[
              { q: "A pessoa gerada é real?", a: "Não. Os nomes são combinações aleatórias de nomes e sobrenomes comuns no Brasil. Nenhum perfil gerado corresponde a uma pessoa real." },
              { q: "Os dados são correlacionados?", a: "Na interface web, cada gerador funciona independentemente. Via API com presets (customer, employee), os dados são correlacionados: email usa o nome, CEP bate com o estado, cartão tem o titular correto." },
              { q: "Posso gerar pessoas com CPF, email e endereço juntos?", a: "Sim. Use o preset 'customer' da API: POST https://fakeforge.com.br/api/generate com {\"preset\":\"customer\",\"quantity\":10}. Cada registro terá nome, CPF, email, telefone e endereço." },
              { q: "Quantos nomes diferentes o gerador tem?", a: "O FakeForge usa mais de 40 nomes masculinos, 40 femininos e 45 sobrenomes comuns no Brasil, gerando milhares de combinações únicas." },
              { q: "Posso usar para popular meu banco de dados de teste?", a: "Sim. Use a API com formato SQL: GET https://fakeforge.com.br/api/generate?type=person&quantity=500&format=sql. O output pode ser executado direto no banco." },
              { q: "O FakeForge armazena os dados gerados?", a: "Não. Os dados são gerados em tempo real e descartados imediatamente. Nenhum dado é armazenado ou rastreado." },
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
          <Link href="/gerador-cpf" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Gerador de CPF</Link>
          <Link href="/gerador-email" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Gerador de Email</Link>
          <Link href="/gerador-telefone" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Gerador de Telefone</Link>
          <Link href="/gerador-endereco" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Gerador de Endereço</Link>
          <Link href="/gerador-empresa" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Gerador de Empresa</Link>
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
              { "@type": "Question", name: "A pessoa gerada é real?", acceptedAnswer: { "@type": "Answer", text: "Não. Os nomes são combinações aleatórias de nomes e sobrenomes comuns no Brasil. Nenhum perfil gerado corresponde a uma pessoa real." } },
              { "@type": "Question", name: "Os dados são correlacionados?", acceptedAnswer: { "@type": "Answer", text: "Na interface web, cada gerador funciona independentemente. Via API com presets (customer, employee), os dados são correlacionados: email usa o nome, CEP bate com o estado, cartão tem o titular correto." } },
              { "@type": "Question", name: "Posso gerar pessoas com CPF, email e endereço juntos?", acceptedAnswer: { "@type": "Answer", text: "Sim. Use o preset 'customer' da API: POST https://fakeforge.com.br/api/generate com {\"preset\":\"customer\",\"quantity\":10}. Cada registro terá nome, CPF, email, telefone e endereço." } },
              { "@type": "Question", name: "Quantos nomes diferentes o gerador tem?", acceptedAnswer: { "@type": "Answer", text: "O FakeForge usa mais de 40 nomes masculinos, 40 femininos e 45 sobrenomes comuns no Brasil, gerando milhares de combinações únicas." } },
              { "@type": "Question", name: "Posso usar para popular meu banco de dados de teste?", acceptedAnswer: { "@type": "Answer", text: "Sim. Use a API com formato SQL: GET https://fakeforge.com.br/api/generate?type=person&quantity=500&format=sql. O output pode ser executado direto no banco." } },
              { "@type": "Question", name: "O FakeForge armazena os dados gerados?", acceptedAnswer: { "@type": "Answer", text: "Não. Os dados são gerados em tempo real e descartados imediatamente. Nenhum dado é armazenado ou rastreado." } },
            ],
          }),
        }}
      />
    </PageShell>
  );
}
