import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import ApiCtaBanner from "@/components/ApiCtaBanner";
import ApiCtaTop from "@/components/ApiCtaTop";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de CIN — Carteira de Identidade Nacional (Novo RG) para Testes",
  description: "Gere dados de CIN fictícios para testes: número (CPF), UF emissora, data de emissão e validade. CIN substitui o RG e usa o CPF como identificador único. Conforme Decreto 10.977/2022.",
  keywords: "gerador cin, carteira identidade nacional, novo rg, cin substitui rg, gerador rg cin, cin teste software",
  openGraph: {
    title: "Gerador de CIN — Carteira de Identidade Nacional",
    description: "Dados de CIN fictícios para testes: número CPF, UF, data emissão, validade.",
    type: "website",
  },
  alternates: { canonical: "/gerador-cin" },
};

export default function GeradorCIN() {
  return (
    <PageShell>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-[11px] font-semibold text-accent">Substitui o RG · Decreto 10.977/2022</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">CIN</span> (Carteira de Identidade Nacional)
        </h1>
        <p className="text-muted mt-3 text-sm leading-relaxed max-w-2xl">
          Gere dados completos de CIN fictícios para testes. A Carteira de Identidade Nacional substitui o RG
          desde 2022 e usa o <strong className="text-foreground">CPF como número único</strong> de identificação
          do cidadão. Inclui UF emissora, data de emissão, data de validade (10 anos) e identificador único alfanumérico.
        </p>
      </div>

      <ApiCtaTop dataType="CINs" />

      <SingleGenerator
        type="cin"
        label="CIN"
        description="Clique em Gerar para criar dados de CIN fictícios"
      />

      <ApiCtaBanner dataType="CINs" />

      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">O que é a CIN?</h2>
          <p>
            A <strong>Carteira de Identidade Nacional (CIN)</strong> é o novo documento de identidade
            brasileiro instituído pelo Decreto 10.977/2022. Substitui gradualmente o RG estadual e usa
            o <strong className="text-foreground">CPF como número único</strong> em todo território nacional —
            acabando com a fragmentação histórica em que cada estado emitia seu próprio RG.
          </p>
          <p>
            Em 2026 já são mais de 50 milhões de CINs emitidas. Até 2032, o RG estadual será descontinuado
            por completo. A CIN tem versão física com QR Code e MRZ (zona de leitura mecânica), além de
            versão digital no app gov.br.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Por que devs precisam adaptar sistemas</h2>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>Formulários que pediam &ldquo;RG&rdquo; precisam aceitar &ldquo;CIN&rdquo; ou &ldquo;número de identidade&rdquo;</li>
            <li>Sistemas que validavam RG por estado precisam aceitar formato unificado</li>
            <li>Integrações KYC (fintech, healthtech) precisam reconhecer CIN como válida</li>
            <li>Sistemas de seguridade social a partir de 2027 exigirão CIN</li>
            <li>Novos dispositivos de leitura precisam ler QR Code e MRZ da CIN física</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Estrutura dos dados gerados</h2>
          <div className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4">
            <div>{`{`}</div>
            <div>  &quot;numero&quot;: &quot;123.456.789-09&quot;,        <span className="text-muted">// CPF</span></div>
            <div>  &quot;uf_emissora&quot;: &quot;SP&quot;,</div>
            <div>  &quot;data_emissao&quot;: &quot;2024-03-15&quot;,</div>
            <div>  &quot;data_validade&quot;: &quot;2034-03-15&quot;,    <span className="text-muted">// 10 anos</span></div>
            <div>  &quot;identificador_unico&quot;: &quot;A3F9...&quot;  <span className="text-muted">// 12 chars</span></div>
            <div>{`}`}</div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {[
              { q: "A CIN tem o mesmo número que o CPF?", a: "Sim. Por isso ela unifica a identificação no Brasil — não importa o estado de emissão, o número é sempre o CPF do titular. Isso elimina a duplicidade histórica em que uma pessoa podia ter RGs diferentes em estados diferentes." },
              { q: "Quando o RG estadual deixa de valer?", a: "Não há data de extinção imediata. RGs já emitidos continuam válidos. A migração é gradual, com previsão de completar até 2032. Sistemas novos devem aceitar CIN, mas precisam continuar aceitando RGs antigos por anos." },
              { q: "A CIN gerada é válida?", a: "O número de CPF passa na validação mod-11 da Receita Federal. Os dados de emissão (UF, datas) seguem o formato real, mas não correspondem a nenhuma CIN emitida — use apenas para testes." },
              { q: "Como adaptar formulários antigos?", a: "Renomeie o campo 'RG' para 'CIN/RG' e aceite tanto o formato CIN (CPF) quanto RGs antigos por número e UF emissora. Para validação digital, use a API gov.br ou serviços como Serpro/Direto BR." },
              { q: "Posso gerar CINs em massa via API?", a: "Sim. Use GET https://fakeforge.com.br/api/generate?type=cin&quantity=100. São 100 chamadas grátis por dia." },
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
          <Link href="/gerador-cnh" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Gerador de CNH</Link>
          <Link href="/gerador-pessoa" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Pessoa Completa</Link>
          <Link href="/validar-cpf" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Validar CPF</Link>
          <Link href="/docs" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">API REST</Link>
        </div>
      </div>

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Geradores", url: "/geradores" },
        { name: "CIN", url: "/gerador-cin" },
      ]} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "A CIN tem o mesmo número que o CPF?", acceptedAnswer: { "@type": "Answer", text: "Sim. A CIN usa o CPF como número único — não importa o estado de emissão, o número é sempre o CPF do titular. Isso unifica a identificação em todo o Brasil." } },
              { "@type": "Question", name: "Quando o RG estadual deixa de valer?", acceptedAnswer: { "@type": "Answer", text: "Não há data de extinção imediata. RGs já emitidos continuam válidos. A migração é gradual, com previsão de completar até 2032." } },
              { "@type": "Question", name: "A CIN gerada é válida?", acceptedAnswer: { "@type": "Answer", text: "O número de CPF passa na validação mod-11 da Receita Federal. Os dados de emissão seguem o formato real, mas não correspondem a nenhuma CIN emitida." } },
              { "@type": "Question", name: "Como adaptar formulários antigos?", acceptedAnswer: { "@type": "Answer", text: "Renomeie o campo 'RG' para 'CIN/RG' e aceite tanto o formato CIN (CPF) quanto RGs antigos por número e UF emissora." } },
            ],
          }),
        }}
      />
    </PageShell>
  );
}
