import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import ApiCtaBanner from "@/components/ApiCtaBanner";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import GeneratorSchema from "@/components/GeneratorSchema";
import ValidatorCNPJ from "./ValidatorCNPJ";

export const metadata: Metadata = {
  title: "Gerador de CNPJ Válido - Gere CNPJ para Testes | FakeForge BR",
  description: "Gere CNPJ válido e fictício para testes e desenvolvimento. Números com dígitos verificadores corretos, formatados ou sem pontuação. Grátis e sem cadastro.",
  keywords: "gerador de cnpj, cnpj válido, gerar cnpj, cnpj para testes, cnpj fictício",
};

export default function GeradorCNPJ() {
  return (
    <PageShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">CNPJ</span> Válido
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Gere números de CNPJ fictícios com dígitos verificadores matematicamente corretos.
          Os CNPJs gerados usam o sufixo /0001 (matriz) e passam na validação do algoritmo mod-11.
          Não pertencem a nenhuma empresa real.
        </p>
      </div>

      <SingleGenerator
        type="cnpj"
        label="CNPJ"
        description="Clique em Gerar para criar CNPJs válidos"
      />

      <div className="mt-8">
        <ValidatorCNPJ />
      </div>

      <ApiCtaBanner dataType="CNPJs" />

      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">O que é um CNPJ?</h2>
          <p>
            O CNPJ (Cadastro Nacional da Pessoa Jurídica) é o registro de empresas na Receita Federal do Brasil.
            Possui 14 dígitos no formato XX.XXX.XXX/XXXX-XX. Os 8 primeiros identificam a empresa,
            os 4 seguintes identificam a filial (0001 para matriz), e os 2 últimos são dígitos verificadores.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Como funciona a validação?</h2>
          <p>
            Semelhante ao CPF, os dígitos verificadores são calculados com pesos multiplicadores e módulo 11.
            O primeiro dígito usa pesos 5,4,3,2,9,8,7,6,5,4,3,2 e o segundo usa 6,5,4,3,2,9,8,7,6,5,4,3,2.
            Todos os CNPJs gerados pelo FakeForge passam nessa validação.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Para que usar?</h2>
          <p>
            Testes de cadastro de empresas, integração com APIs de consulta CNPJ,
            sistemas de emissão de nota fiscal em homologação, e população de bancos de dados
            de desenvolvimento e staging.
          </p>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {[
              { q: "O CNPJ gerado pertence a uma empresa real?", a: "Não. Todos os CNPJs são fictícios e gerados algoritmicamente. Os dígitos verificadores são válidos, mas os números não existem na base da Receita Federal." },
              { q: "Posso usar CNPJ gerado para emitir nota fiscal?", a: "Não. Os CNPJs gerados são para testes em ambiente de desenvolvimento e homologação. Para emitir notas fiscais reais, é necessário um CNPJ verdadeiro registrado na Receita Federal." },
              { q: "Por que o CNPJ gerado sempre tem /0001?", a: "O sufixo /0001 indica a matriz da empresa. Filiais usam números sequenciais (/0002, /0003, etc.). O FakeForge gera apenas CNPJs de matriz, que é o cenário mais comum em testes." },
              { q: "O CNPJ gerado passa na validação de APIs?", a: "Sim. Os dígitos verificadores são calculados com o algoritmo oficial mod-11. Qualquer sistema que valida o formato e checksum do CNPJ aceitará os números gerados." },
              { q: "Posso gerar CNPJs em massa via API?", a: "Sim. Use a API REST: GET https://fakeforge.com.br/api/generate?type=cnpj&quantity=1000. Até 10.000 CNPJs por chamada, com 100 chamadas grátis por dia." },
              { q: "Gerar CNPJ fictício é ilegal?", a: "Não. Gerar números fictícios para testes de software é legal. Ilegal seria usar um CNPJ de outra empresa para fins fraudulentos." },
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
          <Link href="/validar-cnpj" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Validar CNPJ</Link>
          <Link href="/gerador-cpf" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Gerador de CPF</Link>
          <Link href="/gerador-cep" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Gerador de CEP</Link>
          <Link href="/gerador-cartao" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Gerador de Cartão</Link>
          <Link href="/docs" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">API REST</Link>
          <Link href="/blog/validacao-cnpj-nodejs" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Validação de CNPJ em Node.js</Link>
          <Link href="/blog/cnpj-fake-vs-cnpj-valido-testes" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">CNPJ fake vs CNPJ válido</Link>
          <Link href="/blog/cnpj-alfanumerico-checklist-migracao-2026" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">CNPJ alfanumérico 2026</Link>
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
              { "@type": "Question", name: "O CNPJ gerado pertence a uma empresa real?", acceptedAnswer: { "@type": "Answer", text: "Não. Todos os CNPJs são fictícios e gerados algoritmicamente. Os dígitos verificadores são válidos, mas os números não existem na base da Receita Federal." } },
              { "@type": "Question", name: "Posso usar CNPJ gerado para emitir nota fiscal?", acceptedAnswer: { "@type": "Answer", text: "Não. Os CNPJs gerados são para testes em ambiente de desenvolvimento e homologação. Para emitir notas fiscais reais, é necessário um CNPJ verdadeiro registrado na Receita Federal." } },
              { "@type": "Question", name: "Por que o CNPJ gerado sempre tem /0001?", acceptedAnswer: { "@type": "Answer", text: "O sufixo /0001 indica a matriz da empresa. Filiais usam números sequenciais (/0002, /0003, etc.). O FakeForge gera apenas CNPJs de matriz, que é o cenário mais comum em testes." } },
              { "@type": "Question", name: "O CNPJ gerado passa na validação de APIs?", acceptedAnswer: { "@type": "Answer", text: "Sim. Os dígitos verificadores são calculados com o algoritmo oficial mod-11. Qualquer sistema que valida o formato e checksum do CNPJ aceitará os números gerados." } },
              { "@type": "Question", name: "Posso gerar CNPJs em massa via API?", acceptedAnswer: { "@type": "Answer", text: "Sim. Use a API REST: GET https://fakeforge.com.br/api/generate?type=cnpj&quantity=1000. Até 10.000 CNPJs por chamada, com 100 chamadas grátis por dia." } },
              { "@type": "Question", name: "Gerar CNPJ fictício é ilegal?", acceptedAnswer: { "@type": "Answer", text: "Não. Gerar números fictícios para testes de software é legal. Ilegal seria usar um CNPJ de outra empresa para fins fraudulentos." } },
            ],
          }),
        }}
      />

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Geradores", url: "/geradores" },
        { name: "CNPJ", url: "/gerador-cnpj" },
      ]} />

      <GeneratorSchema
        name="Gerador de CNPJ Válido"
        url="https://fakeforge.com.br/gerador-cnpj"
        description="Gere CNPJ válido e fictício para testes de software. Dígitos verificadores corretos pelo algoritmo mod-11. Inclui sufixo /0001 (matriz). API REST gratuita."
        features={[
          "Geração em lote até 10.000 CNPJs por chamada",
          "Algoritmo mod-11 com dígitos verificadores corretos",
          "Validador integrado de CNPJ",
          "Formato com pontuação (XX.XXX.XXX/XXXX-XX) ou apenas dígitos",
          "Sufixo /0001 (matriz) padrão",
          "Export JSON, CSV e SQL",
          "API REST gratuita com 100 chamadas/dia",
        ]}
      />
    </PageShell>
  );
}
