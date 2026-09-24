import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "4devs tem API? Não, mas existe alternativa REST oficial",
  description: "Resposta direta: 4devs não tem API pública oficial. Se você precisa gerar CPF, CNPJ, PIX ou cartão programaticamente em CI/CD, FakeForge é a alternativa com API REST + SDK Node/Python. Free 50 chamadas/dia.",
  keywords: "4devs tem api, 4devs api, 4devs api rest, api 4devs cpf, 4devs api gratuita, 4devs endpoint, 4devs integracao, scrape 4devs api, 4devs sem api",
  alternates: { canonical: "/4devs-tem-api" },
  openGraph: {
    title: "4devs tem API?",
    description: "Resposta curta: não. Resposta útil: FakeForge é a alternativa dev-first com API REST oficial.",
    type: "article",
    locale: "pt_BR",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "O 4devs.com.br tem API pública?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Não. O 4devs é uma ferramenta web pra gerar CPF, CNPJ, endereço e outros dados brasileiros direto no browser via HTML form. Não tem endpoint REST público, não tem SDK oficial em Node/Python, não tem documentação de API. Alguns devs fazem scraping do HTML pra automatizar, mas isso quebra em cada mudança do site e viola os termos de uso.",
      },
    },
    {
      "@type": "Question",
      name: "Existe alternativa ao 4devs com API oficial?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim. FakeForge (fakeforge.com.br) tem API REST oficial em https://fakeforge.com.br/api/generate, SDK Node (npm install fakeforge-br), SDK Python (pip install fakeforge-br), presets correlacionados fintech/ecom e CNPJ alfanumérico 2026. Free tier 50 chamadas/dia sem cadastro.",
      },
    },
    {
      "@type": "Question",
      name: "Posso fazer scrape do 4devs em vez de usar API?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tecnicamente sim, mas é frágil (quebra a cada mudança de HTML), lento (page load + parse HTML), viola termos de uso do 4devs e não escala pra CI/CD confiável. Se você precisa de dados brasileiros programaticamente, use um serviço com API oficial. FakeForge foi construído exatamente pra esse caso.",
      },
    },
    {
      "@type": "Question",
      name: "Quanto custa a API do FakeForge?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Free tier: 50 chamadas/dia por IP sem cadastro nenhum, cobre 90% dos casos de dev. Plano Dev R$29/mês: 10.000 chamadas/dia com até 10.000 items por chamada. Plano Team R$79/mês: 100.000 chamadas/dia.",
      },
    },
    {
      "@type": "Question",
      name: "A API do FakeForge cobre os mesmos tipos que o 4devs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim, mais alguns. FakeForge cobre CPF, CNPJ (inclusive alfanumérico 2026), CNH, RG por estado, PIS, título de eleitor, placa Mercosul, CEP e endereço, telefone (celular e fixo), email, PIX (4 tipos de chave), cartão com Luhn (5 bandeiras), 17 bancos com DV real, pessoa completa correlacionada e empresa completa. Presets fintech e ecom devolvem bundles ricos.",
      },
    },
  ],
};

export default function DevsTemApi() {
  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Resposta direta</p>
        <h1 className="text-3xl font-bold tracking-tight">
          O <span className="text-primary">4devs tem API</span>?
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Resposta curta: <strong className="text-foreground">não</strong>. O 4devs.com.br é ferramenta web feita pra copiar dados no browser. Sem endpoint REST público, sem SDK, sem documentação de API. Se você chegou aqui procurando isso, este guia mostra a alternativa dev-first + o que muda na prática.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-foreground mb-3">A resposta em 3 linhas</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
          <li><strong className="text-foreground">4devs não tem API oficial.</strong> Só ferramenta web pra usar no browser.</li>
          <li><strong className="text-foreground">Scrape do HTML é frágil</strong> — quebra em cada mudança de layout do 4devs.</li>
          <li><strong className="text-foreground">FakeForge é a alternativa com API REST</strong> — free 50/dia sem cadastro, plano Dev R$29/mês pra volume.</li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Por que 4devs não tem API</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          O 4devs foi construído em 2010 como ferramenta web pra QA manual. O modelo de negócio é AdSense (impressões de banner) — cada uso via browser gera pageview e receita. API não gera pageview, então não faz parte do produto deles. É decisão consciente, não bug.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Isso funciona pra quem só precisa copiar 1 CPF pra formulário. <strong className="text-foreground">Não funciona</strong> pra dev que precisa integrar em CI/CD, seed de banco em volume ou fixture de teste automatizado. Aí você precisa de outra ferramenta.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">O que você provavelmente tá tentando fazer</h2>

        <div className="space-y-3">
          {[
            {
              scenario: "Popular banco de staging com 1000+ CPFs válidos",
              solution: "FakeForge API. 1 chamada GET retorna 1000 items em JSON, importa direto no ORM.",
              code: `curl "https://fakeforge.com.br/api/generate?type=cpf&quantity=1000"`,
            },
            {
              scenario: "Fixture de teste Jest/Vitest/Pytest com pessoa completa",
              solution: "FakeForge SDK Node ou Python. Preset customer devolve pessoa correlacionada.",
              code: `import { FakeForge } from "fakeforge-br"\nconst pessoas = await new FakeForge().preset("customer", 100)`,
            },
            {
              scenario: "Teste E2E Playwright/Cypress com cartão que passa Luhn",
              solution: "FakeForge API. Cartão gerado passa validação de qualquer gateway em modo teste.",
              code: `const [cartao] = await ff.creditCard(1, { brand: "visa" })`,
            },
            {
              scenario: "Popular banco Postgres com dados de fintech",
              solution: "FakeForge preset fintech. Devolve customer + PIX + banco + cartão + score coerentes.",
              code: `curl "https://fakeforge.com.br/api/generate?preset=fintech&quantity=500"`,
            },
            {
              scenario: "Automação em GitHub Actions",
              solution: "FakeForge SDK. Roda no ambiente de CI sem browser, sem headless Chrome.",
              code: `- run: npx fakeforge-br seed --preset customer --quantity 5000`,
            },
          ].map(({ scenario, solution, code }, i) => (
            <div key={i} className="rounded-lg bg-card border border-border p-4">
              <p className="text-sm font-semibold text-foreground mb-1">Cenário: {scenario}</p>
              <p className="text-xs text-muted-foreground mb-3">{solution}</p>
              <pre className="bg-background border border-border rounded p-2 text-[11px] overflow-x-auto"><code>{code}</code></pre>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Perguntas frequentes</h2>

        <div className="space-y-3">
          {faqSchema.mainEntity.map((q, i) => (
            <details key={i} className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">{q.name}</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">{q.acceptedAnswer.text}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mb-8 rounded-xl bg-card border-l-4 border-accent p-5">
        <p className="text-sm font-semibold text-foreground mb-1">💡 Nota sobre scrape do 4devs</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Vi alguns projetos GitHub com scrape do HTML do 4devs pra automatizar. Não recomendo por 3 motivos:
          (1) <strong className="text-foreground">quebra em cada mudança de layout</strong> — 4devs redesenhou o site 3 vezes nos últimos 5 anos;
          (2) <strong className="text-foreground">viola termos de uso</strong> — 4devs pode bloquear IP ou processar;
          (3) <strong className="text-foreground">lento em volume</strong> — cada chamada faz page load + parse HTML, latência de 500ms-2s vs 100-200ms de API REST.
          Se seu caso justifica API, FakeForge foi construído exatamente pra isso e é grátis pra 50 chamadas/dia.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Próximos passos</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Testar API agora</Link>
          <Link href="/docs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Docs completas</Link>
          <Link href="/alternativa-ao-4devs-com-api" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Alternativa dev-first ao 4devs</Link>
          <Link href="/comparacao/fakeforge-vs-4devs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Comparação técnica completa</Link>
        </div>
      </section>

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Comparações", url: "/comparacoes" },
        { name: "4devs tem API?", url: "/4devs-tem-api" },
      ]} />
    </PageShell>
  );
}
