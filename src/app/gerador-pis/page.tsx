import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import ApiCtaBanner from "@/components/ApiCtaBanner";
import ApiCtaTop from "@/components/ApiCtaTop";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de PIS/PASEP/NIT/NIS Válido — Mod-11 para Testes",
  description: "Gere números de PIS, PASEP, NIT ou NIS fictícios válidos. 11 dígitos com dígito verificador calculado pelo algoritmo oficial mod-11 (pesos 3-2). Para testes de RH, eSocial e cadastros. Grátis.",
  keywords: "gerador pis, gerador pasep, gerador nit, gerador nis, pis válido, pasep válido, número pis teste",
  openGraph: {
    title: "Gerador de PIS/PASEP/NIT/NIS Válido — FakeForge BR",
    description: "Números válidos pelo mod-11 oficial para testes de RH, eSocial e cadastros.",
    type: "website",
  },
  alternates: { canonical: "/gerador-pis" },
};

export default function GeradorPIS() {
  return (
    <PageShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">PIS / PASEP / NIT / NIS</span>
        </h1>
        <p className="text-muted mt-3 text-sm leading-relaxed max-w-2xl">
          Gere números de PIS, PASEP, NIT ou NIS fictícios — todos compartilham o mesmo formato
          (11 dígitos) e o mesmo algoritmo (mod-11 com pesos 3,2,9,8,7,6,5,4,3,2). Use para testar
          sistemas de RH, integração com eSocial, FGTS Digital e cadastros previdenciários sem
          expor dados reais de funcionários.
        </p>
      </div>

      <ApiCtaTop dataType="PIS/PASEP" />

      <SingleGenerator
        type="pis"
        label="PIS / PASEP / NIT / NIS"
        description="Clique em Gerar para criar números válidos"
      />

      <ApiCtaBanner dataType="PIS/PASEP" />

      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">PIS, PASEP, NIT e NIS — qual a diferença?</h2>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li><strong className="text-foreground">PIS</strong> (Programa de Integração Social): trabalhadores CLT</li>
            <li><strong className="text-foreground">PASEP</strong> (Programa de Formação do Patrimônio do Servidor Público): servidores estatutários</li>
            <li><strong className="text-foreground">NIT</strong> (Número de Identificação do Trabalhador): autônomos e contribuintes individuais</li>
            <li><strong className="text-foreground">NIS</strong> (Número de Identificação Social): beneficiários de programas sociais (Bolsa Família, etc)</li>
          </ul>
          <p>
            Os 4 compartilham o mesmo formato: 11 dígitos numéricos. Cada cidadão tem apenas um
            número, mas pode ser identificado em diferentes contextos por nomenclaturas distintas.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Algoritmo de validação (mod-11)</h2>
          <ol className="list-decimal list-inside space-y-2 pl-2">
            <li>Multiplique os 10 primeiros dígitos pelos pesos 3, 2, 9, 8, 7, 6, 5, 4, 3, 2</li>
            <li>Some os resultados</li>
            <li>Calcule o resto da divisão por 11</li>
            <li>Se o resto for menor que 2, dígito = 0; senão dígito = 11 − resto</li>
          </ol>
          <p>
            <strong className="text-foreground">Formato:</strong> XXX.XXXXX.XX-X (ex: 120.93908.05-9)
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {[
              { q: "O PIS gerado existe?", a: "O número passa na validação mod-11, mas não corresponde a nenhum trabalhador cadastrado na Caixa, INSS ou CEF. Apenas para testes." },
              { q: "Posso usar pra testar eSocial?", a: "Sim, mas apenas em ambiente de homologação. O eSocial valida o formato (mod-11) antes de processar — então o número fictício passa na primeira camada, mas qualquer consulta real falhará." },
              { q: "PIS e CPF são a mesma coisa?", a: "Não. São números independentes — um cidadão tem CPF E PIS. O CPF é vinculado à Receita Federal; o PIS, à Previdência Social/Caixa." },
              { q: "Posso usar em sistemas de FGTS?", a: "Para testes locais e validação de máscara, sim. Para integrações com a CEF (FGTS Digital), use o sandbox oficial — números fictícios serão recusados." },
              { q: "Posso gerar PIS em massa via API?", a: "Sim. Use GET https://fakeforge.com.br/api/generate?type=pis&quantity=100. São 100 chamadas grátis por dia." },
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

      <div className="mt-10 pt-8 border-t border-border">
        <h2 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wider">Ferramentas relacionadas</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/gerador-cpf" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Gerador de CPF</Link>
          <Link href="/gerador-rg" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Gerador de RG</Link>
          <Link href="/gerador-titulo-eleitor" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Título de Eleitor</Link>
          <Link href="/gerador-pessoa" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Pessoa Completa</Link>
          <Link href="/docs" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">API REST</Link>
        </div>
      </div>

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Geradores", url: "/geradores" },
        { name: "PIS/PASEP", url: "/gerador-pis" },
      ]} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "O PIS gerado existe?", acceptedAnswer: { "@type": "Answer", text: "O número passa na validação mod-11, mas não corresponde a nenhum trabalhador cadastrado. Apenas para testes." } },
              { "@type": "Question", name: "Posso usar pra testar eSocial?", acceptedAnswer: { "@type": "Answer", text: "Sim, em ambiente de homologação. O eSocial valida o formato (mod-11) antes de processar." } },
              { "@type": "Question", name: "PIS e CPF são a mesma coisa?", acceptedAnswer: { "@type": "Answer", text: "Não. São números independentes — um cidadão tem CPF E PIS." } },
            ],
          }),
        }}
      />
    </PageShell>
  );
}
