import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import ApiCtaBanner from "@/components/ApiCtaBanner";
import ApiCtaTop from "@/components/ApiCtaTop";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import GeneratorSchema from "@/components/GeneratorSchema";
import RelatedGenerators from "@/components/RelatedGenerators";

export const metadata: Metadata = {
  title: "Gerador de CNPJ Alfanumérico — Novo Formato 2026 | FakeForge",
  description: "Gere CNPJ alfanumérico válido para testes. Novo formato com letras (A-Z) entra em vigor em 01/07/2026 conforme IN RFB 2229/2024. Algoritmo módulo 11 com ASCII -48 implementado corretamente. Grátis.",
  keywords: "gerador cnpj alfanumérico, novo cnpj 2026, cnpj com letras, cnpj alfanumerico válido, instrução normativa 2229, validador cnpj alfanumérico, novo formato cnpj receita federal",
  openGraph: {
    title: "Gerador de CNPJ Alfanumérico — Novo Formato 2026",
    description: "CNPJ alfanumérico válido com letras (A-Z) — formato oficial vigente em 01/07/2026. Para testar sua aplicação antes da virada.",
    type: "website",
  },
  alternates: { canonical: "/gerador-cnpj-alfanumerico" },
};

export default function GeradorCnpjAlfanumerico() {
  return (
    <PageShell>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-[11px] font-semibold text-accent">Vigência: 01/07/2026 — IN RFB 2229/2024</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">CNPJ Alfanumérico</span>
        </h1>
        <p className="text-muted mt-3 text-sm leading-relaxed max-w-2xl">
          Gere CNPJ no novo formato alfanumérico (com letras A-Z nos 12 primeiros caracteres) que entra em vigor em
          <strong className="text-foreground"> 1º de julho de 2026</strong>. Implementa corretamente o algoritmo módulo 11
          com cálculo ASCII -48 conforme a Nota Técnica COCAD nº 49/2024 da Receita Federal. Use para testar e atualizar
          seus validadores antes da virada.
        </p>
      </div>

      <ApiCtaTop dataType="CNPJs alfanuméricos" />

      <SingleGenerator
        type="cnpjAlfa"
        label="CNPJ Alfanumérico"
        description="Clique em Gerar para criar CNPJs no novo formato"
      />

      <ApiCtaBanner dataType="CNPJs alfanuméricos" />

      {/* SEO content */}
      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">O que muda no novo CNPJ?</h2>
          <p>
            A partir de <strong className="text-foreground">01/07/2026</strong>, novos CNPJs emitidos pela Receita Federal
            poderão conter letras (A-Z) nos 12 primeiros caracteres. Os 2 últimos dígitos continuam sendo verificadores
            numéricos. CNPJs antigos (apenas numéricos) continuam válidos — <strong>não há expiração</strong>.
          </p>
          <p>
            A motivação é a iminente exaustão dos CNPJs numéricos: o sistema atual permite ~99,9 bilhões de combinações,
            e com o ritmo de abertura de empresas a Receita projeta esgotar o estoque. O formato alfanumérico amplia
            para 36¹² combinações nos 8 primeiros caracteres.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Estrutura do CNPJ alfanumérico</h2>
          <p>
            O formato continua sendo <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">XX.XXX.XXX/XXXX-XX</code> (14 caracteres),
            mas com regras novas:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li><strong>Posições 1-8:</strong> raiz da empresa — pode ter letras (A-Z) e dígitos (0-9)</li>
            <li><strong>Posições 9-12:</strong> filial — geralmente <code className="text-xs">0001</code> para matriz, mas também aceita alfanumérico</li>
            <li><strong>Posições 13-14:</strong> dígitos verificadores — <strong>continuam numéricos</strong> (0-9)</li>
          </ul>
          <p>
            <strong className="text-foreground">Exemplo válido:</strong> <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">12.ABC.345/01DE-35</code>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Como calcular os dígitos verificadores</h2>
          <p>
            O algoritmo continua sendo módulo 11, mas agora cada caractere é convertido para um valor numérico usando
            seu código ASCII menos 48:
          </p>
          <div className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4">
            <div className="text-muted"># Conversão ASCII -48</div>
            <div>&apos;0&apos; (ASCII 48) → 0</div>
            <div>&apos;9&apos; (ASCII 57) → 9</div>
            <div>&apos;A&apos; (ASCII 65) → 17</div>
            <div>&apos;B&apos; (ASCII 66) → 18</div>
            <div>...</div>
            <div>&apos;Z&apos; (ASCII 90) → 42</div>
          </div>
          <p>
            Com os valores convertidos, aplica-se a fórmula tradicional de pesos:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li><strong>1º dígito:</strong> pesos <code className="text-xs">5,4,3,2,9,8,7,6,5,4,3,2</code> sobre os 12 primeiros</li>
            <li><strong>2º dígito:</strong> pesos <code className="text-xs">6,5,4,3,2,9,8,7,6,5,4,3,2</code> sobre os 13 primeiros</li>
            <li>Cálculo: <code className="text-xs">soma % 11</code> — se &lt; 2, dígito = 0; senão, dígito = 11 - resto</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Implementação em JavaScript</h2>
          <div className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto">
            <div><span className="text-primary">function</span> <span className="text-success">validateCnpjAlfa</span>(cnpj: <span className="text-primary">string</span>): <span className="text-primary">boolean</span> {`{`}</div>
            <div>  <span className="text-primary">const</span> clean = cnpj.replace(<span className="text-warning">/[^0-9A-Z]/gi</span>, <span className="text-warning">&quot;&quot;</span>).toUpperCase();</div>
            <div>  <span className="text-primary">if</span> (clean.length !== <span className="text-warning">14</span>) <span className="text-primary">return false</span>;</div>
            <div>  <span className="text-primary">if</span> (!<span className="text-warning">/^\\d{`{2}`}$/</span>.test(clean.slice(<span className="text-warning">12</span>))) <span className="text-primary">return false</span>;</div>
            <div></div>
            <div>  <span className="text-primary">const</span> calc = (slice: <span className="text-primary">string</span>, w: <span className="text-primary">number</span>[]) =&gt; {`{`}</div>
            <div>    <span className="text-primary">const</span> sum = [...slice].reduce((acc, c, i) =&gt;</div>
            <div>      acc + (c.charCodeAt(<span className="text-warning">0</span>) - <span className="text-warning">48</span>) * w[i], <span className="text-warning">0</span>);</div>
            <div>    <span className="text-primary">return</span> sum % <span className="text-warning">11</span> &lt; <span className="text-warning">2</span> ? <span className="text-warning">0</span> : <span className="text-warning">11</span> - sum % <span className="text-warning">11</span>;</div>
            <div>  {`}`};</div>
            <div></div>
            <div>  <span className="text-primary">const</span> d1 = calc(clean.slice(<span className="text-warning">0</span>, <span className="text-warning">12</span>), [<span className="text-warning">5,4,3,2,9,8,7,6,5,4,3,2</span>]);</div>
            <div>  <span className="text-primary">const</span> d2 = calc(clean.slice(<span className="text-warning">0</span>, <span className="text-warning">13</span>), [<span className="text-warning">6,5,4,3,2,9,8,7,6,5,4,3,2</span>]);</div>
            <div>  <span className="text-primary">return</span> d1 === +clean[<span className="text-warning">12</span>] &amp;&amp; d2 === +clean[<span className="text-warning">13</span>];</div>
            <div>{`}`}</div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">O que fazer no seu sistema antes de 01/07/2026</h2>
          <ol className="list-decimal list-inside space-y-2 pl-2">
            <li>Atualize a regex de validação de <code className="text-xs">/^\d{`{14}`}$/</code> para <code className="text-xs">/^[0-9A-Z]{`{12}`}\d{`{2}`}$/</code></li>
            <li>Aumente o tipo da coluna no banco se for <code className="text-xs">NUMERIC(14)</code> — passe para <code className="text-xs">VARCHAR(14)</code> ou <code className="text-xs">CHAR(14)</code></li>
            <li>Atualize o algoritmo de validação para usar ASCII -48 em vez de parseInt</li>
            <li>Revise integrações com SEFAZ, NF-e, eSocial, FGTS Digital — todas serão atualizadas pela Receita</li>
            <li>Teste com CNPJs alfanuméricos válidos (gerador acima) antes da virada</li>
          </ol>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {[
              { q: "O que é o CNPJ alfanumérico?", a: "É o novo formato de CNPJ da Receita Federal que aceita letras (A-Z) além de números nos 12 primeiros caracteres, mantendo os 2 últimos como dígitos verificadores numéricos. O objetivo é ampliar a capacidade de registro de empresas, já que o formato só-números está perto do limite. A estrutura continua XX.XXX.XXX/XXXX-XX, com 14 caracteres." },
              { q: "Quando entra em vigor o novo formato?", a: "A partir de 1º de julho de 2026, conforme a Instrução Normativa RFB nº 2229/2024. Novos CNPJs emitidos pela Receita Federal a partir dessa data já podem vir no formato alfanumérico. Não há uma migração forçada dos CNPJs existentes, só os cadastros novos entram nesse padrão." },
              { q: "CNPJs numéricos antigos vão parar de funcionar?", a: "Não. Todo CNPJ já emitido no formato numérico continua válido para sempre, sem prazo de expiração ou necessidade de reemissão. O formato alfanumérico é aditivo, não substitui os CNPJs já existentes. Sistemas precisam apenas aceitar ambos os formatos a partir da vigência." },
              { q: "Como calcular o dígito verificador com letras?", a: "O algoritmo continua módulo 11, mas cada caractere é convertido para valor numérico pelo código ASCII menos 48 antes de aplicar os pesos (5,4,3,2,9,8,7,6,5,4,3,2 no 1º dígito e 6,5,4,3,2,9,8,7,6,5,4,3,2 no 2º). Letras de A a Z passam a valer de 17 a 42 nesse cálculo, em vez do valor direto do dígito." },
              { q: "Como testar meu sistema antes de 01/07/2026?", a: "Gere CNPJs alfanuméricos válidos com o gerador acima e rode contra seu banco, sua regex de validação e suas integrações (SEFAZ, NF-e, eSocial). Confira se colunas do tipo NUMERIC aceitam o novo formato, atualize a máscara de entrada e valide o cálculo do dígito verificador com ASCII -48 antes da virada." },
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

      <RelatedGenerators currentSlug="gerador-cnpj-alfanumerico" />

      {/* Artigos relacionados */}
      <div className="mt-8">
        <h2 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wider">Artigos relacionados</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/blog/validacao-cnpj-nodejs" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Validação CNPJ Node.js</Link>
        </div>
      </div>

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Geradores", url: "/geradores" },
        { name: "CNPJ Alfanumérico", url: "/gerador-cnpj-alfanumerico" },
      ]} />

      {/* FAQPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "O que é o CNPJ alfanumérico?", acceptedAnswer: { "@type": "Answer", text: "É o novo formato de CNPJ da Receita Federal que aceita letras (A-Z) além de números nos 12 primeiros caracteres, mantendo os 2 últimos como dígitos verificadores numéricos. O objetivo é ampliar a capacidade de registro de empresas, já que o formato só-números está perto do limite. A estrutura continua XX.XXX.XXX/XXXX-XX, com 14 caracteres." } },
              { "@type": "Question", name: "Quando entra em vigor o novo formato?", acceptedAnswer: { "@type": "Answer", text: "A partir de 1º de julho de 2026, conforme a Instrução Normativa RFB nº 2229/2024. Novos CNPJs emitidos pela Receita Federal a partir dessa data já podem vir no formato alfanumérico. Não há uma migração forçada dos CNPJs existentes, só os cadastros novos entram nesse padrão." } },
              { "@type": "Question", name: "CNPJs numéricos antigos vão parar de funcionar?", acceptedAnswer: { "@type": "Answer", text: "Não. Todo CNPJ já emitido no formato numérico continua válido para sempre, sem prazo de expiração ou necessidade de reemissão. O formato alfanumérico é aditivo, não substitui os CNPJs já existentes. Sistemas precisam apenas aceitar ambos os formatos a partir da vigência." } },
              { "@type": "Question", name: "Como calcular o dígito verificador com letras?", acceptedAnswer: { "@type": "Answer", text: "O algoritmo continua módulo 11, mas cada caractere é convertido para valor numérico pelo código ASCII menos 48 antes de aplicar os pesos (5,4,3,2,9,8,7,6,5,4,3,2 no 1º dígito e 6,5,4,3,2,9,8,7,6,5,4,3,2 no 2º). Letras de A a Z passam a valer de 17 a 42 nesse cálculo, em vez do valor direto do dígito." } },
              { "@type": "Question", name: "Como testar meu sistema antes de 01/07/2026?", acceptedAnswer: { "@type": "Answer", text: "Gere CNPJs alfanuméricos válidos com o gerador acima e rode contra seu banco, sua regex de validação e suas integrações (SEFAZ, NF-e, eSocial). Confira se colunas do tipo NUMERIC aceitam o novo formato, atualize a máscara de entrada e valide o cálculo do dígito verificador com ASCII -48 antes da virada." } },
            ],
          }),
        }}
      />

      <GeneratorSchema
        name="Gerador de CNPJ Alfanumérico (2026)"
        url="https://fakeforge.com.br/gerador-cnpj-alfanumerico"
        description="Gere CNPJ alfanumérico válido conforme a Instrução Normativa 2.229 da Receita Federal, com vigência em 01/07/2026. Cálculo do dígito verificador via ASCII-48."
        features={[
          "Conforme IN 2.229 da Receita Federal (vigência 01/07/2026)",
          "Cálculo de dígito verificador via ASCII-48",
          "Aceita letras (A-Z) e dígitos (0-9) nos primeiros 12 caracteres",
          "Geração em lote até 10.000 por chamada",
          "Export JSON, CSV e SQL",
          "API REST gratuita com 100 chamadas/dia",
        ]}
      />
    </PageShell>
  );
}
