import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import ApiCtaBanner from "@/components/ApiCtaBanner";
import AdBanner from "@/components/AdBanner";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import GeneratorSchema from "@/components/GeneratorSchema";
import RelatedGenerators from "@/components/RelatedGenerators";
import ValidatorCNPJ from "./ValidatorCNPJ";

export const metadata: Metadata = {
  title: "Gerador de CNPJ Válido: Fake, Aleatório e Grátis Online",
  description: "Gere CNPJ fake válido com mod-11 da Receita Federal. Pra teste de cadastro B2B, NF-e em homologação, integração ERP e SEFAZ. Grátis, sem cadastro.",
  keywords: "gerador de cnpj, gerador cnpj, gerar cnpj, gerar um cnpj, gerar cnpj válido, gerador de cnpj válido, cnpj válido, cnpj fictício, cnpj fake, cnpj aleatório, cnpj aleatorio, generate cnpj, gerador cnpj online, cnpj sintético, cnpj receita federal, mod-11 cnpj",
  openGraph: {
    title: "Gerador de CNPJ Válido Online - mod-11 Receita Federal",
    description: "CNPJ fake aleatório com dígito verificador mod-11. Pra NF-e em homologação, integração ERP, teste B2B. Grátis.",
    type: "website",
    images: ["/api/og?title=Gerador+de+CNPJ+V%C3%A1lido&subtitle=CNPJ+fict%C3%ADcio+com+algoritmo+mod-11+e+d%C3%ADgito+verificador+correto+para+testes&category=GERADOR"],
  },
  alternates: { canonical: "/gerador-cnpj" },
};

export default function GeradorCNPJ() {
  return (
    <PageShell>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">CNPJ</span> Válido para Testes
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Gere CNPJ sintético online com dígitos verificadores matematicamente corretos pelo algoritmo
          mod-11 da Receita Federal. Os CNPJs gerados usam o sufixo /0001 (matriz) e passam na
          validação de qualquer sistema brasileiro: ERP, NF-e, integração SEFAZ, cadastros B2B
          e seed de banco de desenvolvimento. Não pertencem a nenhuma empresa real.
        </p>
      </div>

      <SingleGenerator
        type="cnpj"
        label="CNPJ"
        description="Clique em Gerar para criar CNPJs válidos"
      />

      <div className="rounded-xl bg-accent/10 border border-accent/30 p-4 my-6">
        <p className="text-[11px] uppercase tracking-wider text-accent font-bold mb-1">Novo formato 2026</p>
        <h3 className="text-sm font-semibold text-foreground mb-2">
          Precisa do CNPJ alfanumérico que entra em vigor em 01/07/2026?
        </h3>
        <p className="text-xs text-muted-foreground mb-2">
          A partir de julho de 2026 novos CNPJs podem ter letras (A-Z) nas primeiras 12 posições. Testa seu sistema antes da virada.
        </p>
        <Link href="/gerador-cnpj-alfanumerico" className="text-xs text-primary hover:underline font-medium">
          Ir pro Gerador de CNPJ Alfanumérico →
        </Link>
      </div>

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
          <h2 className="text-lg font-semibold text-foreground mb-2">Para que usar um CNPJ fictício</h2>
          <p>
            Testes de cadastro de empresas, integração com APIs de consulta CNPJ,
            sistemas de emissão de nota fiscal em homologação, e população de bancos de dados
            de desenvolvimento e staging.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">CNPJ válido, CNPJ fake e CNPJ aleatório: qual a diferença</h2>
          <p className="mb-2">
            <strong>CNPJ aleatório</strong> é qualquer número de 14 dígitos que segue o formato XX.XXX.XXX/XXXX-XX.
            Quase sempre falha no validador da Receita porque os dígitos verificadores são randômicos.
            <strong> CNPJ fake</strong> e <strong>CNPJ fictício</strong> são termos genéricos que podem
            se referir tanto a CNPJs com checksum válido quanto inválido, dependendo da ferramenta usada.
          </p>
          <p>
            O <strong>CNPJ válido</strong> que o FakeForge gera é diferente: os 12 primeiros dígitos são
            aleatórios, mas os 2 últimos são calculados pelo algoritmo oficial mod-11, garantindo que
            o número passe em qualquer validador (Receita Federal, eSocial, SEFAZ, gateways de pagamento,
            integrações ERP). É a opção correta para testar fluxos que validam checksum antes de aceitar
            o cadastro.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Como gerar CNPJ via API REST</h2>
          <p className="mb-3">
            Para automatizar a geração de CNPJs (CI/CD, seed de banco, testes de carga), use a API REST:
          </p>
          <pre className="bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto mb-3">
            <code>{`# Gerar 100 CNPJs em uma chamada
curl "https://fakeforge.com.br/api/generate?type=cnpj&quantity=100"

# Gerar e exportar direto em SQL
curl -X POST "https://fakeforge.com.br/api/generate" \\
  -H "Content-Type: application/json" \\
  -d '{"type":"cnpj","quantity":1000,"format":"sql"}'`}</code>
          </pre>
          <p>
            Plano grátis: 100 chamadas/dia, até 10.000 CNPJs por chamada. Sem cadastro, sem token.
            Para volumes maiores ou rate limit dedicado, planos pagos começam em R$ 29/mês.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">CNPJ alfanumérico (vigência 01/07/2026)</h2>
          <p className="mb-2">
            A Receita Federal vai introduzir o CNPJ alfanumérico em 2026 (Instrução Normativa 2.229).
            Os 8 primeiros caracteres da raiz e os 4 da ordem podem conter letras (A-Z) além de dígitos
            (0-9). O dígito verificador é calculado via ASCII-48 (valor numérico = código ASCII menos 48).
          </p>
          <p>
            Se você precisa testar o suporte ao novo formato antes da vigência,
            use o <Link href="/gerador-cnpj-alfanumerico" className="text-primary hover:underline">Gerador de CNPJ Alfanumérico</Link>{" "}
            do FakeForge. Recomendado validar schema de banco, regex de validação, integrações com SEFAZ
            e eSocial nos próximos meses.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Diferenças entre CNPJ tradicional e alfanumérico</h2>
          <p className="mb-3">
            Os dois formatos convivem a partir de 01/07/2026: o tradicional continua valendo pra sempre,
            e o alfanumérico passa a ser emitido pra empresas novas. Veja o que muda na prática:
          </p>
          <div className="overflow-x-auto rounded-lg bg-background border border-border">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-3 py-2 text-muted">Característica</th>
                  <th className="text-left px-3 py-2 text-muted">CNPJ tradicional</th>
                  <th className="text-left px-3 py-2 text-muted">CNPJ alfanumérico</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ["Caracteres nas posições 1-12", "Só dígitos (0-9)", "Letras (A-Z) e dígitos (0-9)"],
                  ["Dígitos verificadores (13-14)", "Numéricos", "Numéricos (sem mudança)"],
                  ["Formato visual", "XX.XXX.XXX/XXXX-XX", "XX.XXX.XXX/XXXX-XX (mesma máscara)"],
                  ["Cálculo do dígito verificador", "Módulo 11 direto sobre o dígito", "Módulo 11 com valor ASCII -48 por caractere"],
                  ["Vigência", "Já em uso, continua válido pra sempre", "A partir de 01/07/2026, só pra CNPJs novos"],
                  ["Tipo de coluna recomendado no banco", "NUMERIC ou VARCHAR(14)", "VARCHAR(14) ou CHAR(14) obrigatoriamente"],
                  ["Onde testar no FakeForge", "gerador-cnpj (esta página)", "gerador-cnpj-alfanumerico"],
                ].map(([c, trad, alfa], i) => (
                  <tr key={i}>
                    <td className="px-3 py-2 font-medium text-foreground">{c}</td>
                    <td className="px-3 py-2 text-muted-foreground">{trad}</td>
                    <td className="px-3 py-2 text-muted-foreground">{alfa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

      <AdBanner label="Publicidade" className="max-w-3xl mx-auto" />

      <RelatedGenerators currentSlug="gerador-cnpj" />

      {/* Artigos relacionados */}
      <div className="mt-8">
        <h2 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wider">Artigos relacionados</h2>
        <div className="flex flex-wrap gap-2">
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
