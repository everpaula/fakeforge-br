import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import ApiCtaBanner from "@/components/ApiCtaBanner";
import GeneratorSchema from "@/components/GeneratorSchema";

export const metadata: Metadata = {
  title: "Gerador de Empresa Fictícia - CNPJ, Razão Social e Endereço | FakeForge BR",
  description: "Gere empresas fictícias completas com CNPJ válido, razão social, nome fantasia, endereço e telefone. Ideal para testes de sistemas B2B e marketplace. Grátis.",
  keywords: "gerador de empresa fictícia, gerador de dados empresariais, empresa fake, cnpj razão social, dados empresa teste, gerador empresa brasileira",
  openGraph: {
    title: "Gerador de Empresa Fictícia - FakeForge BR",
    description: "Gere empresas fictícias com CNPJ válido, razão social e endereço para testes. Grátis e sem cadastro.",
    type: "website",
  },
};

export default function GeradorEmpresa() {
  return (
    <PageShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">Empresa</span> Fictícia
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Gere dados completos de empresas fictícias brasileiras com CNPJ válido (dígitos verificadores
          corretos), razão social, nome fantasia, endereço comercial e telefone. Ideal para testar
          cadastros B2B, marketplaces, emissão de NF-e em homologação e integração com sistemas empresariais.
        </p>
      </div>

      <SingleGenerator
        type="company"
        label="Empresa"
        description="Clique em Gerar para criar empresas fictícias"
      />

      <ApiCtaBanner dataType="empresas" />

      {/* SEO content */}
      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">O que é gerado?</h2>
          <p>
            Cada empresa fictícia inclui: CNPJ com dígitos verificadores válidos (mod-11),
            razão social com tipo societário (LTDA, S.A., ME, EIRELI), nome fantasia,
            endereço comercial completo (rua, bairro, cidade, estado, CEP) e telefone com DDD válido.
            Os CNPJs usam o sufixo /0001 (matriz), que é o formato mais comum em testes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Para que usar dados de empresa fictícia?</h2>
          <p>
            Testar cadastros de fornecedores e parceiros em ERPs, validar integração com APIs de consulta
            CNPJ, popular ambientes de staging de marketplaces B2B, testar emissão de NF-e em ambiente
            de homologação, e criar cenários de QA que envolvem dados empresariais completos.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Empresa completa via API</h2>
          <p>
            Use o preset &ldquo;company&rdquo; da API para gerar empresas com todos os campos correlacionados:
            o CNPJ é válido, o endereço é coerente com o estado, e o telefone tem DDD da região.
            Suporta export em JSON, CSV e SQL para integração direta com seu banco de dados.
          </p>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {[
              { q: "O CNPJ da empresa gerada é real?", a: "Não. O CNPJ tem dígitos verificadores válidos (passa na validação mod-11), mas não está registrado na Receita Federal. A empresa não existe." },
              { q: "Posso usar o CNPJ gerado para abrir uma empresa?", a: "Não. Os CNPJs são fictícios e servem exclusivamente para testes de software. Para abrir uma empresa, é necessário registrar um CNPJ real na Receita Federal." },
              { q: "Qual a diferença entre CNPJ matriz e filial?", a: "O CNPJ matriz usa o sufixo /0001. Filiais usam /0002, /0003, etc. O FakeForge gera apenas CNPJs de matriz (/0001), que é o cenário mais comum em testes." },
              { q: "Os dados da empresa são correlacionados?", a: "Sim. O endereço é coerente com o estado, o telefone tem DDD da região, e a razão social segue padrões brasileiros com tipo societário (LTDA, S.A., ME)." },
              { q: "Posso gerar empresas em massa via API?", a: "Sim. Use o preset 'company': POST https://fakeforge.com.br/api/generate com {\"preset\":\"company\",\"quantity\":50}. São 100 chamadas grátis por dia." },
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
          <Link href="/gerador-cnpj" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Gerador de CNPJ</Link>
          <Link href="/validar-cnpj" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Validar CNPJ</Link>
          <Link href="/gerador-pessoa" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Gerador de Pessoa</Link>
          <Link href="/gerador-endereco" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Gerador de Endereço</Link>
          <Link href="/gerador-telefone" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Gerador de Telefone</Link>
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
              { "@type": "Question", name: "O CNPJ da empresa gerada é real?", acceptedAnswer: { "@type": "Answer", text: "Não. O CNPJ tem dígitos verificadores válidos (passa na validação mod-11), mas não está registrado na Receita Federal. A empresa não existe." } },
              { "@type": "Question", name: "Posso usar o CNPJ gerado para abrir uma empresa?", acceptedAnswer: { "@type": "Answer", text: "Não. Os CNPJs são fictícios e servem exclusivamente para testes de software. Para abrir uma empresa, é necessário registrar um CNPJ real na Receita Federal." } },
              { "@type": "Question", name: "Qual a diferença entre CNPJ matriz e filial?", acceptedAnswer: { "@type": "Answer", text: "O CNPJ matriz usa o sufixo /0001. Filiais usam /0002, /0003, etc. O FakeForge gera apenas CNPJs de matriz (/0001), que é o cenário mais comum em testes." } },
              { "@type": "Question", name: "Os dados da empresa são correlacionados?", acceptedAnswer: { "@type": "Answer", text: "Sim. O endereço é coerente com o estado, o telefone tem DDD da região, e a razão social segue padrões brasileiros com tipo societário (LTDA, S.A., ME)." } },
              { "@type": "Question", name: "Posso gerar empresas em massa via API?", acceptedAnswer: { "@type": "Answer", text: "Sim. Use o preset 'company': POST https://fakeforge.com.br/api/generate com {\"preset\":\"company\",\"quantity\":50}. São 100 chamadas grátis por dia." } },
              { "@type": "Question", name: "O FakeForge armazena os dados gerados?", acceptedAnswer: { "@type": "Answer", text: "Não. Os dados são gerados em tempo real e descartados imediatamente. Nenhum dado é armazenado ou rastreado." } },
            ],
          }),
        }}
      />

      <GeneratorSchema
        name="Gerador de Empresa Fictícia"
        url="https://fakeforge.com.br/gerador-empresa"
        description="Gere empresa fictícia completa para testes: CNPJ válido, razão social, nome fantasia, endereço coerente, telefone e email. Para uso em ambiente de desenvolvimento."
        features={[
          "CNPJ válido via algoritmo mod-11",
          "Razão social, nome fantasia, endereço, telefone e email correlacionados",
          "Endereço com CEP coerente por estado",
          "Geração em lote até 10.000 por chamada",
          "Export JSON, CSV e SQL",
          "API REST gratuita com 100 chamadas/dia",
        ]}
      />
    </PageShell>
  );
}
