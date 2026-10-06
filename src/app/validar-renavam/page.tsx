import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import ApiCtaBanner from "@/components/ApiCtaBanner";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import ValidatorRENAVAM from "./ValidatorRENAVAM";

export const metadata: Metadata = {
  title: "Validar RENAVAM Online: Verificar DV mod-11 DENATRAN",
  description: "Valide RENAVAM online com algoritmo mod-11 do DENATRAN. Verifica os 11 dígitos e o dígito verificador em tempo real, sem enviar dados a servidor. Grátis.",
  keywords: "validar renavam, verificar renavam, renavam valido, validacao renavam online, checar renavam, renavam denatran, mod-11 renavam",
  alternates: { canonical: "/validar-renavam" },
  openGraph: {
    title: "Validar RENAVAM Online — mod-11 DENATRAN",
    description: "Verificação local no navegador. 11 dígitos + DV calculado. Grátis.",
    type: "website",
    locale: "pt_BR",
  },
};

const FAQ = [
  {
    q: "Como funciona a validação de RENAVAM?",
    a: "A validação usa o algoritmo mod-11 do DENATRAN. Multiplica os 10 primeiros dígitos pelos pesos 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 da esquerda pra direita, soma, multiplica por 10, calcula o resto da divisão por 11. Se o resto for 10 ou 11, o dígito verificador é 0. Senão, o DV é o próprio resto."
  },
  {
    q: "Quantos dígitos tem um RENAVAM?",
    a: "O RENAVAM atual tem 11 dígitos: 10 dígitos base (identificador do veículo) + 1 dígito verificador. Documentos antigos emitidos antes de 2007 podiam ter 9 dígitos, mas o DETRAN completa com zeros à esquerda para padronizar."
  },
  {
    q: "Um RENAVAM válido significa que o veículo existe?",
    a: "Não. A validação apenas confere se o dígito verificador está matematicamente correto. Para confirmar que o RENAVAM corresponde a um veículo real registrado, é preciso consultar o DETRAN estadual ou a base SNG (Sistema Nacional de Gravames)."
  },
  {
    q: "A validação consulta o DENATRAN?",
    a: "Não. A validação é feita 100% no seu navegador usando o algoritmo público mod-11. Nenhum dado é enviado para servidores externos."
  },
  {
    q: "Posso validar RENAVAM via API?",
    a: "A API do FakeForge é focada em geração de dados sintéticos para testes. Para validação, use esta página ou implemente o algoritmo mod-11 no seu código. É simples (10 linhas) e não exige chamadas externas."
  },
];

export default function ValidarRENAVAM() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQ.map((f) => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a },
    })),
  };

  return (
    <PageShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Validar <span className="text-primary">RENAVAM</span>
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Cole um RENAVAM pra verificar se o dígito verificador está correto pelo algoritmo mod-11 do DENATRAN.
          A validação roda localmente no seu navegador. Nenhum dado é enviado a servidores externos.
        </p>
      </div>

      <ValidatorRENAVAM />

      <div className="mt-10">
        <h2 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wider">Precisa de RENAVAMs pra teste?</h2>
        <SingleGenerator
          type="renavam"
          label="RENAVAM"
          description="Gere RENAVAMs válidos com DV correto"
        />
      </div>
      <ApiCtaBanner dataType="RENAVAMs" />

      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {FAQ.map(({ q, a }) => (
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
          <Link href="/gerador-renavam" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Gerador de RENAVAM</Link>
          <Link href="/validar-renavam-python" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Validar em Python</Link>
          <Link href="/validar-renavam-nodejs" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Validar em Node.js</Link>
          <Link href="/validar-renavam-curl" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Validar via curl</Link>
          <Link href="/validar-cnh" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Validar CNH</Link>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Validar RENAVAM", url: "/validar-renavam" },
      ]} />
    </PageShell>
  );
}
