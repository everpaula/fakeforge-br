import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import ValidatorCNPJ from "../gerador-cnpj/ValidatorCNPJ";
import SingleGenerator from "@/components/SingleGenerator";
import ApiCtaBanner from "@/components/ApiCtaBanner";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Validar CNPJ - Verifique se um CNPJ é Válido | FakeForge",
  description: "Valide um CNPJ online gratuitamente. Verifica se os dígitos verificadores estão corretos usando o algoritmo mod-11 da Receita Federal.",
  keywords: "validar cnpj, verificar cnpj, cnpj válido, validação cnpj online, checar cnpj",
};

export default function ValidarCNPJ() {
  return (
    <PageShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Validar <span className="text-primary">CNPJ</span>
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Cole um CNPJ para verificar se os dígitos verificadores estão corretos.
          A validação usa o algoritmo oficial mod-11.
          Nenhum dado é armazenado ou enviado para servidores externos.
        </p>
      </div>

      <ValidatorCNPJ />

      <div className="mt-10">
        <h2 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wider">Precisa de CNPJs para teste?</h2>
        <SingleGenerator
          type="cnpj"
          label="CNPJ"
          description="Gere CNPJs válidos e fictícios"
        />
      </div>
      <ApiCtaBanner dataType="CNPJs" />

      {/* FAQ Section */}
      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {[
              { q: "Como funciona a validação de CNPJ?", a: "A validação usa o algoritmo mod-11 com pesos específicos para cada posição. Dois dígitos verificadores são calculados e comparados com os informados. Se batem, o CNPJ é válido no formato." },
              { q: "CNPJ válido significa que a empresa existe?", a: "Não. A validação verifica apenas se os dígitos verificadores estão corretos. Um CNPJ pode ter formato válido mas não estar registrado na Receita Federal." },
              { q: "A validação consulta a Receita Federal?", a: "Não. Tudo é calculado localmente no seu navegador. Nenhum dado é enviado para servidores externos." },
              { q: "Qual o formato correto de um CNPJ?", a: "O CNPJ tem 14 dígitos no formato XX.XXX.XXX/XXXX-XX. Os 8 primeiros identificam a empresa, os 4 seguintes a filial (0001 = matriz), e os 2 últimos são dígitos verificadores." },
              { q: "Posso validar CNPJs em massa?", a: "Esta ferramenta valida um CNPJ por vez. Para validação em massa, implemente o algoritmo mod-11 no seu código — são apenas algumas linhas em qualquer linguagem." },
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
          <Link href="/validar-cpf" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Validar CPF</Link>
          <Link href="/gerador-cpf" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Gerador de CPF</Link>
          <Link href="/blog/lgpd-dados-de-teste" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">LGPD e dados de teste</Link>
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
              { "@type": "Question", name: "Como funciona a validação de CNPJ?", acceptedAnswer: { "@type": "Answer", text: "A validação usa o algoritmo mod-11 com pesos específicos para cada posição. Dois dígitos verificadores são calculados e comparados com os informados. Se batem, o CNPJ é válido no formato." } },
              { "@type": "Question", name: "CNPJ válido significa que a empresa existe?", acceptedAnswer: { "@type": "Answer", text: "Não. A validação verifica apenas se os dígitos verificadores estão corretos. Um CNPJ pode ter formato válido mas não estar registrado na Receita Federal." } },
              { "@type": "Question", name: "A validação consulta a Receita Federal?", acceptedAnswer: { "@type": "Answer", text: "Não. Tudo é calculado localmente no seu navegador. Nenhum dado é enviado para servidores externos." } },
              { "@type": "Question", name: "Qual o formato correto de um CNPJ?", acceptedAnswer: { "@type": "Answer", text: "O CNPJ tem 14 dígitos no formato XX.XXX.XXX/XXXX-XX. Os 8 primeiros identificam a empresa, os 4 seguintes a filial (0001 = matriz), e os 2 últimos são dígitos verificadores." } },
            ],
          }),
        }}
      />

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Validadores", url: "/geradores" },
        { name: "Validar CNPJ", url: "/validar-cnpj" },
      ]} />
    </PageShell>
  );
}
