import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import ValidatorCPF from "../gerador-cpf/ValidatorCPF";
import SingleGenerator from "@/components/SingleGenerator";
import ApiCtaBanner from "@/components/ApiCtaBanner";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Validar CPF - Verifique se um CPF é Válido | FakeForge",
  description: "Valide um CPF online gratuitamente. Verifica se os dígitos verificadores estão corretos usando o algoritmo mod-11 da Receita Federal.",
  keywords: "validar cpf, verificar cpf, cpf válido, validação cpf online, checar cpf",
};

export default function ValidarCPF() {
  return (
    <PageShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Validar <span className="text-primary">CPF</span>
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Cole um CPF para verificar se os dígitos verificadores estão corretos.
          A validação usa o algoritmo oficial mod-11 da Receita Federal.
          Nenhum dado é armazenado ou enviado para servidores externos.
        </p>
      </div>

      <ValidatorCPF />

      <div className="mt-10">
        <h2 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wider">Precisa de CPFs para teste?</h2>
        <SingleGenerator
          type="cpf"
          label="CPF"
          description="Gere CPFs válidos e fictícios"
        />
      </div>
      <ApiCtaBanner dataType="CPFs" />

      {/* FAQ Section */}
      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {[
              { q: "Como funciona a validação de CPF?", a: "A validação usa o algoritmo mod-11 da Receita Federal. Dois dígitos verificadores são calculados com pesos multiplicadores sobre os 9 primeiros dígitos. Se os dígitos calculados batem com os informados, o CPF é válido." },
              { q: "Um CPF válido significa que ele existe?", a: "Não necessariamente. A validação verifica apenas se os dígitos verificadores estão matematicamente corretos. Um CPF pode ser válido no formato mas não estar registrado na Receita Federal." },
              { q: "A validação consulta a Receita Federal?", a: "Não. A validação é feita localmente no seu navegador usando o algoritmo oficial. Nenhum dado é enviado para servidores externos." },
              { q: "Quais CPFs são considerados inválidos?", a: "CPFs com dígitos verificadores incorretos, com todos os dígitos iguais (111.111.111-11), ou com menos de 11 dígitos são considerados inválidos." },
              { q: "Posso validar CPFs via API?", a: "A API do FakeForge é focada em geração de dados. Para validação, use esta página ou implemente o algoritmo mod-11 no seu código — é simples e não requer chamadas externas." },
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
          <Link href="/validar-cnpj" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Validar CNPJ</Link>
          <Link href="/gerador-cnpj" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Gerador de CNPJ</Link>
          <Link href="/blog/como-validar-cpf-online-e-no-codigo" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Como checar se um CPF é válido</Link>
          <Link href="/blog/como-gerar-cpf-para-testes" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Como gerar CPF para testes</Link>
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
              { "@type": "Question", name: "Como funciona a validação de CPF?", acceptedAnswer: { "@type": "Answer", text: "A validação usa o algoritmo mod-11 da Receita Federal. Dois dígitos verificadores são calculados com pesos multiplicadores sobre os 9 primeiros dígitos. Se os dígitos calculados batem com os informados, o CPF é válido." } },
              { "@type": "Question", name: "Um CPF válido significa que ele existe?", acceptedAnswer: { "@type": "Answer", text: "Não necessariamente. A validação verifica apenas se os dígitos verificadores estão matematicamente corretos. Um CPF pode ser válido no formato mas não estar registrado na Receita Federal." } },
              { "@type": "Question", name: "A validação consulta a Receita Federal?", acceptedAnswer: { "@type": "Answer", text: "Não. A validação é feita localmente no seu navegador usando o algoritmo oficial. Nenhum dado é enviado para servidores externos." } },
              { "@type": "Question", name: "Quais CPFs são considerados inválidos?", acceptedAnswer: { "@type": "Answer", text: "CPFs com dígitos verificadores incorretos, com todos os dígitos iguais (111.111.111-11), ou com menos de 11 dígitos são considerados inválidos." } },
            ],
          }),
        }}
      />

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Validadores", url: "/geradores" },
        { name: "Validar CPF", url: "/validar-cpf" },
      ]} />
    </PageShell>
  );
}
