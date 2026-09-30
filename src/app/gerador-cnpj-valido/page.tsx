import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import GeneratorSchema from "@/components/GeneratorSchema";

export const metadata: Metadata = {
  title: "Gerador de CNPJ Válido: Numérico e Alfanumérico 2026",
  description: "Gerador de CNPJ válido para testes: mod-11 da Receita Federal + suporte ao novo formato alfanumérico (IN RFB 2.229, vigência 01/07/2026). Grátis, sem cadastro, API REST.",
  keywords: "gerador de cnpj válido, gerador cnpj valido, cnpj válido, cnpj valido para testes, gerar cnpj válido, cnpj para testes, cnpj alfanumérico, gerador cnpj alfanumerico, cnpj mod 11, cnpj receita federal, cnpj 2026",
  // Consolidacao SEO (30/set/2026): canonical aponta pra /gerador-empresa que
  // tem conteudo mais rico (gerador completo com razao social + endereco correlacionado)
  // e vai rankear pra "gerador de cnpj valido" (vol 1.600). Evita canibalizacao.
  alternates: { canonical: "/gerador-empresa" },
  openGraph: {
    title: "Gerador de CNPJ Válido: Numérico e Alfanumérico 2026",
    description: "Passa mod-11 da Receita Federal. Cobre o novo formato alfanumérico obrigatório desde 01/07/2026. Grátis, API REST.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function GeradorCnpjValido() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Ferramenta para desenvolvedores</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">CNPJ Válido</span> (Numérico e Alfanumérico)
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Todo CNPJ gerado passa no algoritmo mod-11 da Receita Federal. Cobre o formato tradicional
          (14 dígitos numéricos) e o novo <strong className="text-foreground">CNPJ alfanumérico</strong>
          {" "}(IN RFB 2.229, vigência desde 01/07/2026). Grátis, sem cadastro, também via API REST.
        </p>
      </div>

      <SingleGenerator
        type="cnpj"
        label="CNPJ Válido"
        description="Todos passam validação mod-11 da Receita Federal"
      />

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="text-xs text-muted self-center mr-2">Também disponíveis:</span>
        <Link href="/gerador-cnpj-alfanumerico" className="px-3 py-1.5 rounded-lg text-xs bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors">CNPJ Alfanumérico 2026</Link>
        <Link href="/gerador-empresa" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">Empresa (CNPJ + Razão Social)</Link>
        <Link href="/validar-cnpj" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">Validar CNPJ</Link>
      </div>

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Gerador de CNPJ Válido", url: "/gerador-cnpj-valido" },
      ]} />

      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">O que faz um CNPJ ser &quot;válido&quot;</h2>
          <p>
            Um CNPJ tem 14 caracteres divididos em 3 partes: os 8 primeiros identificam a raiz da empresa,
            os 4 seguintes identificam o estabelecimento (0001 = matriz) e os 2 últimos são dígitos verificadores.
            Os 2 dígitos são calculados pelo <strong className="text-foreground">algoritmo mod-11</strong>{" "}
            da Receita Federal — um checksum que detecta erros de digitação e serve como validação primária
            em qualquer formulário que aceita CNPJ.
          </p>
          <p className="mt-2">
            Válido não significa emitido. O FakeForge gera CNPJs que passam no mod-11 mas não pertencem a
            nenhuma empresa registrada. Perfeito para seed de banco, fixtures de teste, mocks de checkout
            e validação de front-end. Nunca use para abrir conta, emitir nota ou qualquer transação real.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">CNPJ alfanumérico: a mudança de 2026</h2>
          <p>
            Desde <strong className="text-foreground">01/07/2026</strong> a Receita Federal aceita CNPJs no
            novo formato alfanumérico definido pela <strong className="text-foreground">IN RFB 2.229/2024</strong>.
            Nele, as 12 primeiras posições (raiz + estabelecimento) podem conter letras maiúsculas A-Z além
            de dígitos 0-9. Os 2 dígitos verificadores continuam numéricos.
          </p>
          <p className="mt-2">
            O cálculo do mod-11 muda: letras são tratadas pelo <strong className="text-foreground">código ASCII menos 48</strong>
            {" "}(por exemplo, A = 65 - 48 = 17). CNPJs numéricos existentes continuam válidos e não migram.
            Todo software que valida CNPJ tem que aceitar os dois formatos a partir de agora.
          </p>
          <p className="mt-2">
            Se você precisa gerar CNPJs no formato alfanumérico específico para atualizar seu ambiente de
            testes, use o <Link href="/gerador-cnpj-alfanumerico" className="text-primary hover:underline font-medium">gerador de CNPJ alfanumérico</Link>.
            É o mesmo algoritmo mod-11 mas com letras nas posições permitidas.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Uso via API REST</h2>
          <pre className="bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`# CNPJ tradicional
curl "https://fakeforge.com.br/api/generate?type=cnpj&quantity=100"

# CNPJ alfanumérico (novo formato 2026)
curl "https://fakeforge.com.br/api/generate?type=cnpjAlfa&quantity=100"

# CNPJ + Razão Social + Endereço em 1 chamada
curl "https://fakeforge.com.br/api/generate?preset=company&quantity=50"`}</code></pre>
          <p className="mt-3">
            Grátis: 50 chamadas/dia, até 100 CNPJs por chamada. Plano <Link href="/pricing?plan=dev&ref=gerador_cnpj_valido" className="text-primary hover:underline">Dev (R$29/mês)</Link>{" "}
            libera 10.000 chamadas e 10.000 CNPJs por chamada para uso em CI/CD e seed de banco em escala.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Snippet em Node.js</h2>
          <pre className="bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`// Seed de 500 empresas em banco de staging
const res = await fetch(
  "https://fakeforge.com.br/api/generate?preset=company&quantity=500"
);
const { data } = await res.json();

for (const empresa of data) {
  await db.company.create({
    data: {
      cnpj: empresa.cnpj,
      razao_social: empresa.name,
      nome_fantasia: empresa.brand,
      endereco: empresa.address,
    }
  });
}`}</code></pre>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Perguntas Frequentes</h2>
          <div className="space-y-3">
            {[
              { q: "Gerar CNPJ válido é crime?", a: "Não. Gerar números que passam mod-11 pra fins de teste é prática padrão em desenvolvimento. Crime é usar CNPJ (fake ou real) pra emitir nota fiscal fraudulenta ou abrir conta de fachada. Uso em staging, CI e mocks é seguro." },
              { q: "Qual a diferença entre CNPJ válido e CNPJ real?", a: "CNPJ válido passa no algoritmo mod-11. CNPJ real, além de passar no mod-11, foi efetivamente emitido pela Receita Federal e tem empresa associada. FakeForge gera CNPJs válidos que não são reais — perfeito pra testes." },
              { q: "O gerador aceita o formato alfanumérico novo?", a: "Sim. Use type=cnpjAlfa na API ou vá em /gerador-cnpj-alfanumerico. O algoritmo respeita a regra ASCII-48 para letras A-Z nas 12 primeiras posições." },
              { q: "Posso gerar CNPJ de UF específica?", a: "O CNPJ do FakeForge não codifica UF (diferente do CPF, que tem UF na 9ª posição). Se precisa de empresa vinculada a estado específico, use o preset company que gera CNPJ + endereço coerente." },
              { q: "Como validar CNPJ no meu código?", a: "Implemente o mod-11 da Receita Federal (multiplique cada dígito pela sua posição, some, tire resto por 11, aplique a regra de dígito). Nossa página /validar-cnpj tem calculadora online e o blog tem implementações passo a passo em Node.js, Python e PHP." },
              { q: "Os CNPJs gerados são únicos?", a: "Cada chamada gera CNPJs aleatórios. Duas chamadas seguidas devolvem conjuntos diferentes. Se precisa reprodutibilidade em CI, salve o resultado da primeira chamada como fixture versionada." },
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

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Ferramentas relacionadas</h2>
          <div className="flex flex-wrap gap-2">
            <Link href="/gerador-cnpj-alfanumerico" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">CNPJ Alfanumérico 2026</Link>
            <Link href="/gerador-empresa" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">Empresa completa</Link>
            <Link href="/validar-cnpj" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">Validador de CNPJ</Link>
            <Link href="/gerador-cpf" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">CPF Válido (mod-11)</Link>
            <Link href="/blog/cnpj-alfanumerico-checklist-migracao-2026" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">Checklist migração 2026</Link>
          </div>
        </section>
      </div>

      <GeneratorSchema
        name="Gerador de CNPJ Válido"
        url="https://fakeforge.com.br/gerador-cnpj-valido"
        description="Gerador de CNPJ válido para testes com algoritmo mod-11 da Receita Federal. Cobre formato tradicional (14 dígitos) e o novo CNPJ alfanumérico (IN RFB 2.229, vigência 01/07/2026)."
        features={[
          "Todo CNPJ passa validação mod-11 da Receita Federal",
          "Suporte ao novo formato alfanumérico 2026 (IN RFB 2.229)",
          "Gera até 10.000 CNPJs por chamada via API",
          "Preset company adiciona razão social + endereço correlacionados",
          "50 chamadas grátis/dia sem cadastro",
          "Export em JSON, CSV e SQL com CREATE TABLE",
        ]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Gerar CNPJ válido é crime?", acceptedAnswer: { "@type": "Answer", text: "Não. Gerar números que passam mod-11 pra fins de teste é prática padrão em desenvolvimento. Crime é usar CNPJ pra emitir nota fiscal fraudulenta ou abrir conta de fachada. Uso em staging, CI e mocks é seguro." } },
              { "@type": "Question", name: "Qual a diferença entre CNPJ válido e CNPJ real?", acceptedAnswer: { "@type": "Answer", text: "CNPJ válido passa no algoritmo mod-11. CNPJ real, além de passar no mod-11, foi emitido pela Receita Federal e tem empresa associada. FakeForge gera CNPJs válidos que não são reais — perfeito pra testes." } },
              { "@type": "Question", name: "O gerador aceita o formato alfanumérico novo?", acceptedAnswer: { "@type": "Answer", text: "Sim. Use type=cnpjAlfa na API ou vá em /gerador-cnpj-alfanumerico. O algoritmo respeita a regra ASCII-48 para letras A-Z nas 12 primeiras posições." } },
              { "@type": "Question", name: "Posso gerar CNPJ de UF específica?", acceptedAnswer: { "@type": "Answer", text: "O CNPJ não codifica UF. Se precisa de empresa vinculada a estado específico, use o preset company que gera CNPJ + endereço coerente." } },
              { "@type": "Question", name: "Como validar CNPJ no meu código?", acceptedAnswer: { "@type": "Answer", text: "Implemente o mod-11 da Receita Federal. Nossa página /validar-cnpj tem calculadora e o blog tem implementações passo a passo em Node.js, Python e PHP." } },
              { "@type": "Question", name: "Os CNPJs gerados são únicos?", acceptedAnswer: { "@type": "Answer", text: "Cada chamada gera CNPJs aleatórios. Se precisa reprodutibilidade em CI, salve o resultado da primeira chamada como fixture versionada." } },
            ],
          }),
        }}
      />
    </PageShell>
  );
}
