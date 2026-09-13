import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Como Gerar CPF Válido Sem Infringir a Lei (Guia LGPD 2026)",
  description: "É legal gerar CPF válido pra testes? Sim, se seguir 3 regras. Guia prático com base LGPD, Código Penal art. 299, e boas praticas de segurança de dados em ambiente de desenvolvimento.",
  keywords: "cpf valido legal, gerar cpf sem infringir lei, cpf teste lgpd, cpf ficticio legal, cpf falso legal, testes software cpf lei, cpf desenvolvimento legal",
  alternates: { canonical: "/como-gerar-cpf-valido-sem-infringir-lei" },
  openGraph: {
    title: "Como Gerar CPF Válido Sem Infringir a Lei",
    description: "É legal, se seguir 3 regras: nao é CPF real, uso restrito a testes, nao circula em produção.",
    type: "website",
    locale: "pt_BR",
  },
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Como gerar CPF válido para testes sem infringir a lei",
  description: "Método legal e seguro para gerar CPFs válidos matematicamente para uso em ambiente de teste de software, em conformidade com LGPD e Código Penal.",
  totalTime: "PT2M",
  supply: [
    { "@type": "HowToSupply", name: "Acesso a um gerador que use algoritmo mod-11 sem consultar base da Receita" },
    { "@type": "HowToSupply", name: "Ambiente de teste isolado (staging, dev, CI)" },
  ],
  step: [
    {
      "@type": "HowToStep",
      name: "Use um gerador matemático, não uma base real",
      text: "Escolha uma ferramenta que gere o CPF via algoritmo mod-11 da Receita Federal - não uma que consulte lista de CPFs reais. FakeForge, 4devs e validate-docbr geram matematicamente. Isso garante que o CPF passa validação mas não corresponde a nenhuma pessoa real.",
    },
    {
      "@type": "HowToStep",
      name: "Restrinja o uso ao ambiente de testes",
      text: "Nunca use o CPF gerado em formulário real de terceiros, em cadastro em site real, ou em qualquer sistema em produção. Uso legítimo é: seed de banco staging, fixture de teste automatizado, mock de checkout em CI, load test.",
    },
    {
      "@type": "HowToStep",
      name: "Documente a origem dos dados",
      text: "Adicione ao README do projeto: 'Dados sintéticos gerados via <ferramenta> em <data>. Nenhum CPF corresponde a pessoa real.' Isso protege o time em eventual auditoria LGPD ou disputa de propriedade intelectual.",
    },
    {
      "@type": "HowToStep",
      name: "Preserve isolamento de dados",
      text: "Mesmo sendo sintético, não faça commit do dataset gerado em repositório público. Guarde em fixture local + .gitignore, ou regenere na hora em CI. Isso previne que scraper de bad actor descubra o padrão.",
    },
  ],
};

export default function ComoGerarCpfValidoLegal() {
  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Guia LGPD + Direito</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Como gerar CPF válido <span className="text-primary">sem infringir a lei</span>?
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Resposta curta: <strong className="text-foreground">sim, é legal</strong>, se seguir 3 regras.
          O que a lei brasileira proíbe é usar CPF de <em>terceiro real</em> sem autorização (LGPD art. 7)
          ou falsidade ideológica com CPF gerado (Código Penal art. 299). Gerar matematicamente pra popular
          teste automatizado é uso legítimo e prática comum de mercado.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR — as 3 regras</h2>
        <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
          <li>
            <strong className="text-foreground">Gerar matematicamente</strong>, não copiar de base real. Algoritmo mod-11 → passa validação mas não corresponde a pessoa real.
          </li>
          <li>
            <strong className="text-foreground">Restrição ao ambiente de teste</strong>. Zero uso em produção, formulário externo, ou cadastro real.
          </li>
          <li>
            <strong className="text-foreground">Documentar origem</strong>. README + política interna dizendo &quot;dados sintéticos gerados via X, nenhum CPF é real.&quot;
          </li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">O que a lei diz (LGPD + Código Penal)</h2>

        <div className="space-y-4">
          <div className="rounded-lg bg-card border border-border p-4">
            <p className="text-sm font-semibold text-foreground mb-2">📜 LGPD (Lei 13.709/2018) — art. 7</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Tratamento de dado pessoal exige base legal (consentimento, contrato, obrigação legal, etc).
              CPF de pessoa real cai nessa lei. <strong className="text-foreground">CPF sintético matematicamente
              gerado não é dado pessoal</strong> - não identifica pessoa natural. Uso irrestrito em ambiente
              controlado.
            </p>
          </div>

          <div className="rounded-lg bg-card border border-border p-4">
            <p className="text-sm font-semibold text-foreground mb-2">⚖️ Código Penal — art. 299 (Falsidade Ideológica)</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Crime de falsidade ideológica exige <strong className="text-foreground">intenção de enganar ou obter
              vantagem indevida</strong>. Popular banco staging com 1000 CPFs sintéticos pra rodar teste
              automatizado não configura falsidade ideológica - o CPF nunca é apresentado como real a terceiro.
            </p>
          </div>

          <div className="rounded-lg bg-card border border-border p-4">
            <p className="text-sm font-semibold text-foreground mb-2">🚨 Onde vira crime</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Se você pegar um CPF gerado e cadastrar em site de banco pra abrir conta, apresentar em
              contrato fake, ou passar em cadastro comercial pra obter desconto - aí é falsidade ideológica.
              <strong className="text-foreground"> A ferramenta é neutra; o uso decide a legalidade.</strong>
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Os 4 passos práticos</h2>

        <div className="space-y-4">
          {[
            {
              n: "1",
              title: "Use um gerador matemático, não uma base real",
              body: "Escolha uma ferramenta que gere via algoritmo mod-11 da Receita - não uma que consulte lista de CPFs vazados. Todo gerador sério (FakeForge, 4devs, validate-docbr, python-brasilidades) usa mod-11. Ferramentas ruins da darknet vendem base real vazada - fuja delas.",
            },
            {
              n: "2",
              title: "Restrinja o uso ao ambiente de teste",
              body: "Uso legítimo: seed de banco staging, fixture de pytest/jest, mock de checkout em Playwright, load test em CI. Uso ilegal: cadastro em site real, apresentação a terceiros como real, contrato, formulário externo. A linha é onde o CPF sai do seu ambiente controlado.",
            },
            {
              n: "3",
              title: "Documente a origem dos dados",
              body: "Adicione ao README: \"Dados sintéticos gerados via <ferramenta> em <data>. Nenhum CPF corresponde a pessoa real. Uso restrito a ambiente de teste.\" Isso protege o time em auditoria LGPD, audit externo, ou disputa de propriedade intelectual.",
            },
            {
              n: "4",
              title: "Preserve isolamento de dados",
              body: "Não commite dataset gerado em repo público. Guarde em fixture local + .gitignore, ou regenere na hora via SDK/API em CI. Isso previne que scraper descubra o padrão de geração e reproduza a estratégia.",
            },
          ].map(({ n, title, body }) => (
            <div key={n} className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center">{n}</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground mb-1">{title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Exemplo prático seguro</h2>
        <p className="text-sm text-muted-foreground mb-3">
          Popular banco de staging Postgres com 1000 usuários pra rodar teste de load em endpoint de signup:
        </p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// ✅ LEGAL - Node/TypeScript
import { FakeForge } from "fakeforge";
import { pool } from "./db/staging";  // apenas staging

const ff = new FakeForge();
const customers = await ff.preset("customer", 1000);

for (const c of customers) {
  await pool.query(
    "INSERT INTO users (cpf, name, email) VALUES ($1, $2, $3)",
    [c.cpf, c.name, c.email]
  );
}

// README documentado:
// "Dataset gerado via FakeForge em 2026-09-13.
//  Nenhum CPF corresponde a pessoa real.
//  Uso restrito a ambiente staging."`}</code></pre>

        <p className="text-sm text-muted-foreground mt-4 mb-3">Contra-exemplo do que NÃO fazer:</p>
        <pre className="bg-danger/5 border border-danger/30 rounded-lg p-4 text-xs overflow-x-auto"><code>{`// ❌ ILEGAL - falsidade ideológica art. 299
const cpf = await ff.cpf(1);

// Cadastrar em site real como se fosse real:
await fetch("https://banco-real.com.br/abrir-conta", {
  method: "POST",
  body: JSON.stringify({ cpf, name: "João Fake" }),
});

// Isso não é teste - é fraude.`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">FAQ rápido</h2>

        <div className="space-y-3">
          {[
            {
              q: "Preciso de aprovação do jurídico pra usar CPF sintético em CI?",
              a: "Não. Uso interno em ambiente de teste é prática pacífica de mercado. Basta documentar no README/wiki interno. Se sua empresa tem DPO (Data Protection Officer), avise que o dataset é 100% sintético - decisão dele se quer política formal.",
            },
            {
              q: "E se o CPF sintético coincidir com CPF de alguma pessoa real?",
              a: "Estatisticamente possível mas juridicamente inócuo. Você não sabe quem é, não usa pra identificar, não trata dado pessoal. LGPD só aplica quando dado identifica ou pode identificar pessoa. CPF isolado sem outros identificadores não pega no radar.",
            },
            {
              q: "Posso publicar dataset gerado em repositório público (Kaggle, GitHub)?",
              a: "Tecnicamente sim (dado sintético não é pessoal). Mas não recomendo: bad actor pode escrapear + testar em sistemas mal protegidos. Se precisa publicar, gere small sample (10-100 rows) só pra doc, mantenha bulk em fixture privada.",
            },
            {
              q: "É diferente pra CNPJ, RG, CNH?",
              a: "Mesmo princípio. Todos os documentos brasileiros com algoritmo de validação (mod-11 pra CPF/CNPJ/CNH/PIS) são geráveis sinteticamente sem infringir lei. RG por estado usa algoritmos diferentes mas mesma lógica se aplica.",
            },
            {
              q: "E cartão de crédito? Vale o mesmo?",
              a: "Cartão sintético via algoritmo de Luhn (com BIN de teste como 4111 1111 1111 1111) é 100% legal e padrão da indústria. Adyen, Stripe, PayPal publicam BINs de teste pra desenvolvedores usarem. Nunca use cartão real de terceiro.",
            },
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

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Próximos passos</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/gerador-cpf" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Gerar CPF Agora</Link>
          <Link href="/como-garantir-lgpd-ambiente-testes" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Guia LGPD Completo</Link>
          <Link href="/melhor-gerador-cpf-testes-software" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Qual Gerador Escolher</Link>
        </div>
      </section>

      <div className="mt-8 pt-6 border-t border-border">
        <p className="text-[11px] text-muted italic">
          Este guia é informativo e não substitui parecer jurídico. Consulte advogado se sua operação envolver
          dados de saúde, financeiros regulados por BACEN, ou dado sensível LGPD art. 5 II. Última atualização: setembro/2026.
        </p>
      </div>
    </PageShell>
  );
}
