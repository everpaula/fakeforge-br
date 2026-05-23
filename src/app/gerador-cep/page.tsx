import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import ApiCtaBanner from "@/components/ApiCtaBanner";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import GeneratorSchema from "@/components/GeneratorSchema";
import { CEP_CITIES } from "@/lib/cep-cities";

export const metadata: Metadata = {
  title: "Gerador de CEP e Endereço - Gere Endereços Brasileiros | FakeForge BR",
  description: "Gere CEP e endereços brasileiros fictícios e completos para testes. Rua, bairro, cidade e estado coerentes. Grátis e sem cadastro.",
  keywords: "gerador de cep, gerar endereço, endereço fictício, cep para testes, endereço brasileiro falso",
};

export default function GeradorCEP() {
  return (
    <PageShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">CEP</span> e Endereço
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Gere endereços brasileiros completos e coerentes para testes.
          Cada endereço inclui rua, número, bairro, cidade, estado e CEP — todos consistentes entre si.
          Os dados cobrem 10 estados brasileiros com bairros reais.
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wider">Endereço Completo</h2>
          <SingleGenerator
            type="address"
            label="Endereço"
            description="Endereço completo com rua, bairro, cidade, estado e CEP"
          />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wider">Somente CEP</h2>
          <SingleGenerator
            type="cep"
            label="CEP"
            description="Apenas o código de endereçamento postal"
          />
        </div>
      </div>

      <ApiCtaBanner dataType="endereços" />

      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">O que é um CEP?</h2>
          <p>
            O CEP (Código de Endereçamento Postal) é o sistema brasileiro de códigos postais,
            com 8 dígitos no formato XXXXX-XXX. Os dois primeiros dígitos identificam a região
            e o estado, e os demais especificam a localidade e o logradouro.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Como os endereços são gerados?</h2>
          <p>
            O FakeForge gera endereços coerentes: o prefixo do CEP corresponde a cidade correta,
            o bairro existe naquela cidade, e o estado bate com tudo.
            Isso é importante porque sistemas que validam endereço por CEP rejeitam dados inconsistentes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Estados cobertos</h2>
          <p>
            SP, RJ, MG, RS, PR, BA, PE, CE, DF e SC — cobrindo as maiores capitais e cidades do Brasil.
          </p>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {[
              { q: "O endereço gerado existe de verdade?", a: "Não. As cidades, estados e prefixos de CEP são reais, mas a combinação completa (rua + número + bairro) é fictícia. Isso garante coerência geográfica sem expor endereços reais." },
              { q: "O CEP gerado passa na validação dos Correios?", a: "O formato é válido (8 dígitos, prefixo coerente com o estado), mas o CEP específico pode não existir na base dos Correios. Para testes de formato e integração, funciona perfeitamente." },
              { q: "Quais estados são cobertos?", a: "SP, RJ, MG, RS, PR, BA, PE, CE, DF e SC — os 10 estados mais populosos e economicamente relevantes do Brasil." },
              { q: "Posso gerar endereços de um estado específico?", a: "No momento, o gerador seleciona aleatoriamente entre os 10 estados cobertos. Filtro por estado é um recurso planejado para versões futuras." },
              { q: "Os dados de endereço são consistentes entre si?", a: "Sim. O bairro pertence à cidade correta, o CEP corresponde ao estado, e todos os campos são coerentes. Sistemas que cruzam CEP com cidade/estado aceitarão os dados." },
              { q: "Posso exportar endereços em SQL para popular um banco?", a: "Sim. Use a API com formato SQL: POST /api/generate com body {\"type\":\"address\", \"quantity\":100, \"format\":\"sql\"}. O resultado inclui CREATE TABLE e INSERT INTO prontos." },
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
          <Link href="/gerador-cnpj" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Gerador de CNPJ</Link>
          <Link href="/gerador-telefone" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Gerador de Telefone</Link>
          <Link href="/validar-cpf" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Validar CPF</Link>
          <Link href="/docs" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">API REST</Link>
          <Link href="/blog/automatizar-dados-teste-ci-cd" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Automatizar dados no CI/CD</Link>
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
              { "@type": "Question", name: "O endereço gerado existe de verdade?", acceptedAnswer: { "@type": "Answer", text: "Não. As cidades, estados e prefixos de CEP são reais, mas a combinação completa (rua + número + bairro) é fictícia. Isso garante coerência geográfica sem expor endereços reais." } },
              { "@type": "Question", name: "O CEP gerado passa na validação dos Correios?", acceptedAnswer: { "@type": "Answer", text: "O formato é válido (8 dígitos, prefixo coerente com o estado), mas o CEP específico pode não existir na base dos Correios. Para testes de formato e integração, funciona perfeitamente." } },
              { "@type": "Question", name: "Quais estados são cobertos?", acceptedAnswer: { "@type": "Answer", text: "SP, RJ, MG, RS, PR, BA, PE, CE, DF e SC — os 10 estados mais populosos e economicamente relevantes do Brasil." } },
              { "@type": "Question", name: "Os dados de endereço são consistentes entre si?", acceptedAnswer: { "@type": "Answer", text: "Sim. O bairro pertence à cidade correta, o CEP corresponde ao estado, e todos os campos são coerentes. Sistemas que cruzam CEP com cidade/estado aceitarão os dados." } },
              { "@type": "Question", name: "Posso exportar endereços em SQL para popular um banco?", acceptedAnswer: { "@type": "Answer", text: "Sim. Use a API com formato SQL: POST /api/generate com body {\"type\":\"address\", \"quantity\":100, \"format\":\"sql\"}. O resultado inclui CREATE TABLE e INSERT INTO prontos." } },
            ],
          }),
        }}
      />

      {/* City-specific generators */}
      <div className="mt-12 pt-8 border-t border-border">
        <h2 className="text-lg font-semibold text-foreground mb-2">
          Gerador de CEP por cidade
        </h2>
        <p className="text-sm text-muted-foreground mb-4 max-w-2xl leading-relaxed">
          Precisa de CEP de uma cidade específica? Use as páginas dedicadas com bairros e prefixos reais de cada capital, ideais para testes regionais ou validação geográfica.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {CEP_CITIES.map((c) => (
            <Link
              key={c.slug}
              href={`/gerador-cep/${c.slug}`}
              className="block px-3 py-2 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors text-center"
            >
              {c.name}
              <span className="block text-[10px] text-muted opacity-70">{c.stateCode}</span>
            </Link>
          ))}
        </div>
      </div>

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Geradores", url: "/geradores" },
        { name: "CEP", url: "/gerador-cep" },
      ]} />

      <GeneratorSchema
        name="Gerador de CEP e Endereço Brasileiro"
        url="https://fakeforge.com.br/gerador-cep"
        description="Gere CEP e endereço brasileiro fictício e coerente para testes. Rua, bairro, cidade e estado consistentes entre si. 10 estados cobertos. API REST gratuita."
        features={[
          "Endereço completo: CEP, rua, bairro, cidade, estado",
          "Dados coerentes (CEP bate com estado, bairro com cidade)",
          "10 estados cobertos com referências reais",
          "Geração em lote até 10.000 endereços",
          "Export JSON, CSV e SQL",
          "API REST gratuita com 100 chamadas/dia",
        ]}
      />
    </PageShell>
  );
}
