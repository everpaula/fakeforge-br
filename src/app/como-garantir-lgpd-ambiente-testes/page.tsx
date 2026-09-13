import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Como Garantir LGPD em Ambiente de Testes de Software (2026)",
  description: "Guia prático pra rodar teste de software em conformidade com LGPD: dados sintéticos, mascaramento, anonimização, isolamento de staging, política de retenção. Checklist auditável.",
  keywords: "lgpd testes software, dados testes lgpd, anonimizar dados testes, mascarar dados producao teste, lgpd ambiente desenvolvimento, staging lgpd compliance, dados sinteticos lgpd",
  alternates: { canonical: "/como-garantir-lgpd-ambiente-testes" },
  openGraph: {
    title: "Como Garantir LGPD em Ambiente de Testes de Software",
    description: "3 estratégias, 6 controles obrigatórios, checklist auditável pra DPO.",
    type: "website",
    locale: "pt_BR",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Copiar banco de produção pra staging é permitido pela LGPD?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Não é proibido, mas exige base legal (interesse legítimo geralmente cobre) + controles: acesso restrito ao mesmo nível de produção, log de acesso, retention curta (idealmente <30 dias), e mascaramento dos campos sensíveis LGPD art. 5 II. A prática recomendada é substituir por dados sintéticos pra evitar toda essa complexidade regulatória.",
      },
    },
    {
      "@type": "Question",
      name: "O que é dado sintético e por que resolve o problema LGPD?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Dado sintético é gerado matematicamente (via algoritmos como mod-11 pra CPF ou Luhn pra cartão) sem corresponder a pessoa real. Como não identifica pessoa natural, sai completamente do escopo LGPD (art. 5 I). Você pode gerar, distribuir e usar sem base legal, sem consentimento, sem log de acesso. Ferramentas como FakeForge produzem esses dados.",
      },
    },
    {
      "@type": "Question",
      name: "Mascaramento (data masking) é suficiente pra LGPD?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Depende do método. Mascaramento reversível (tokenização com chave) ainda é dado pessoal pela LGPD - só reduz risco de vazamento. Mascaramento irreversível (hash sem chave, ou substituição por dado sintético) tira do escopo. Para testes, prefira substituição total por dado sintético.",
      },
    },
    {
      "@type": "Question",
      name: "Preciso do consentimento pra usar dado real em ambiente de teste?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Se usar dado real, precisa de base legal. Consentimento específico pra teste é impraticável. Interesse legítimo pode cobrir se você fizer LIA (Legitimate Interest Assessment) documentado + controles proporcionais. Mais simples: use dado sintético e sai do problema.",
      },
    },
  ],
};

export default function ComoGarantirLgpdTestes() {
  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Guia LGPD + DevOps</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Como garantir <span className="text-primary">conformidade com a LGPD</span> em ambientes de teste?
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          O caminho mais limpo é <strong className="text-foreground">substituir dados reais por dados sintéticos</strong>{" "}
          gerados matematicamente - assim seu ambiente de teste sai do escopo da LGPD (art. 5 I). As outras
          rotas (mascaramento, anonimização de produção) funcionam mas exigem controles adicionais e LIA
          documentado. Guia com 3 estratégias comparadas, 6 controles obrigatórios e checklist auditável.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>
            🥇 <strong className="text-foreground">Melhor rota:</strong> dado sintético 100% gerado. Sai do escopo LGPD, zero fricção, custo baixo.
          </li>
          <li>
            🥈 <strong className="text-foreground">Rota do meio:</strong> mascaramento irreversível de dado real. Ainda cai em LGPD mas com risco baixo.
          </li>
          <li>
            🥉 <strong className="text-foreground">Rota mais arriscada:</strong> cópia direta de produção com controles. LIA obrigatório + acesso restrito + log.
          </li>
          <li>
            🚨 <strong className="text-foreground">Nunca:</strong> copiar produção pra staging aberto ao time inteiro sem controle. Isso vira multa ANPD.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">3 estratégias comparadas</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg bg-card border-l-4 border-success p-4">
            <p className="text-xs font-bold text-success uppercase tracking-wider mb-2">Estratégia 1 - Recomendada</p>
            <p className="text-sm font-semibold text-foreground mb-2">Dados sintéticos</p>
            <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1 mb-3">
              <li>Gera via algoritmo (mod-11, Luhn)</li>
              <li>Não corresponde a pessoa real</li>
              <li>Sai do escopo LGPD</li>
              <li>Zero fricção pra devs</li>
            </ul>
            <p className="text-[10px] text-muted-foreground italic">Custo: ~R$29-99/mês com FakeForge ou equivalente</p>
          </div>

          <div className="rounded-lg bg-card border-l-4 border-accent p-4">
            <p className="text-xs font-bold text-accent uppercase tracking-wider mb-2">Estratégia 2 - Aceitável</p>
            <p className="text-sm font-semibold text-foreground mb-2">Mascaramento</p>
            <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1 mb-3">
              <li>Copia produção + mascara campos</li>
              <li>CPF vira &quot;XXX.XXX.XXX-XX&quot;</li>
              <li>Ainda cai em LGPD (reduziu risco)</li>
              <li>Requer LIA documentado</li>
            </ul>
            <p className="text-[10px] text-muted-foreground italic">Custo: engenharia + controles operacionais</p>
          </div>

          <div className="rounded-lg bg-card border-l-4 border-danger p-4">
            <p className="text-xs font-bold text-danger uppercase tracking-wider mb-2">Estratégia 3 - Arriscada</p>
            <p className="text-sm font-semibold text-foreground mb-2">Cópia direta de produção</p>
            <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1 mb-3">
              <li>Staging = mesmo dado de prod</li>
              <li>Acesso ao time inteiro = risco alto</li>
              <li>LGPD art. 46 (segurança) exige controles</li>
              <li>Multa ANPD até R$50M em vazamento</li>
            </ul>
            <p className="text-[10px] text-muted-foreground italic">Só justifica pra time pequeno + isolamento forte</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Os 6 controles obrigatórios (qualquer rota)</h2>

        <div className="space-y-3">
          {[
            {
              n: "1",
              title: "Documentar base legal + finalidade",
              body: "Registre por escrito qual base legal do art. 7 LGPD cobre o tratamento em teste (interesse legítimo é o padrão). Descreva finalidade específica: \"popular staging pra teste de regressão do checkout.\" DPO precisa dessa documentação.",
            },
            {
              n: "2",
              title: "Restringir acesso ao ambiente de teste",
              body: "Staging que contém dado real (mesmo mascarado) precisa mesmo controle de acesso da produção: SSO, MFA, IP whitelist, log de sessão. Staging aberto ao time inteiro sem controle = vulnerabilidade LGPD.",
            },
            {
              n: "3",
              title: "Política de retenção curta",
              body: "Dado copiado de prod pra staging tem que ter TTL: máximo 30 dias, idealmente 7. Reset periódico do banco staging + reload de dado sintético ou mascarado fresh. Documente o cron no runbook.",
            },
            {
              n: "4",
              title: "Log de acesso e auditoria",
              body: "Todo acesso a banco de teste com dado real logado: quem, quando, qual query, quantas rows retornadas. Retenção do log 6 meses mínimo. Vai ser pedido em auditoria ANPD ou LGPD assessment.",
            },
            {
              n: "5",
              title: "Não commitar dado em repositório",
              body: "Fixtures de teste com CPF/email/telefone nunca vão pro Git público. Use fixture local + .gitignore, secrets manager pra keys de acesso ao SDK/API do gerador, ou regenere em CI on-the-fly.",
            },
            {
              n: "6",
              title: "Plano de resposta a incidente",
              body: "Se dado de teste vazar (repo público acidental, S3 mal configurado, backup roubado), tem que ter runbook: notificar DPO em 4h, avaliar risco, notificar ANPD em 72h se necessário (art. 48). Sem esse plano, multa dobra.",
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

      <section className="mb-8 rounded-xl bg-card border border-border p-5">
        <h2 className="text-lg font-semibold text-foreground mb-4">Checklist auditável (imprimível pra DPO)</h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          {[
            "Estratégia definida por escrito (sintético / mascarado / cópia com controles)",
            "Base legal LGPD art. 7 registrada (interesse legítimo geralmente cobre)",
            "LIA (Legitimate Interest Assessment) documentado se rota 2 ou 3",
            "Acesso ao ambiente de teste com mesmo controle da produção (SSO/MFA/IP)",
            "Log de acesso ao banco de teste ativo e retido por 6+ meses",
            "Retention policy: dado real em staging expira em 30 dias máximo",
            "Fixtures de teste não commitadas em repositório público",
            "README do projeto documenta origem do dado (sintético / real mascarado)",
            "Runbook de incidente LGPD com fluxo notificar DPO → ANPD",
            "DPO informado do ambiente de teste e aprovou a estratégia",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 accent-primary" />
              <label className="text-xs cursor-pointer">{item}</label>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Exemplo: substituição total por sintético</h2>
        <p className="text-sm text-muted-foreground mb-3">
          Rota mais limpa: descartar cópia de produção e gerar 100% sintético via SDK do FakeForge no CI.
        </p>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# .github/workflows/staging-refresh.yml
name: Reset staging with synthetic data

on:
  schedule:
    - cron: "0 3 * * *"  # Todo dia 3h AM (política retention)
  workflow_dispatch:

jobs:
  refresh:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Truncate staging
        run: psql $STAGING_URL -c "TRUNCATE users, orders CASCADE;"

      - name: Generate synthetic data via FakeForge
        env:
          FAKEFORGE_KEY: \${{ secrets.FAKEFORGE_KEY }}
        run: |
          npm install fakeforge-br
          node scripts/seed-staging.js`}</code></pre>

        <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
          <strong className="text-foreground">Vantagem:</strong> staging sempre com dado fresh e 100%
          sintético. Zero base legal LGPD necessária. Zero log de acesso obrigatório pra staging (não é
          dado pessoal). DPO fica feliz.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">FAQ</h2>

        <div className="space-y-3">
          {[
            {
              q: "Copiar banco de produção pra staging é permitido pela LGPD?",
              a: "Não é proibido, mas exige base legal (interesse legítimo geralmente cobre) + controles: acesso restrito ao mesmo nível de produção, log de acesso, retention curta (idealmente <30 dias), e mascaramento dos campos sensíveis LGPD art. 5 II. A prática recomendada é substituir por dados sintéticos pra evitar toda essa complexidade regulatória.",
            },
            {
              q: "O que é dado sintético e por que resolve o problema LGPD?",
              a: "Dado sintético é gerado matematicamente (via algoritmos como mod-11 pra CPF ou Luhn pra cartão) sem corresponder a pessoa real. Como não identifica pessoa natural, sai completamente do escopo LGPD (art. 5 I). Você pode gerar, distribuir e usar sem base legal, sem consentimento, sem log de acesso. Ferramentas como FakeForge produzem esses dados.",
            },
            {
              q: "Mascaramento (data masking) é suficiente pra LGPD?",
              a: "Depende do método. Mascaramento reversível (tokenização com chave) ainda é dado pessoal pela LGPD - só reduz risco de vazamento. Mascaramento irreversível (hash sem chave, ou substituição por dado sintético) tira do escopo. Para testes, prefira substituição total por dado sintético.",
            },
            {
              q: "Preciso do consentimento pra usar dado real em ambiente de teste?",
              a: "Se usar dado real, precisa de base legal. Consentimento específico pra teste é impraticável. Interesse legítimo pode cobrir se você fizer LIA (Legitimate Interest Assessment) documentado + controles proporcionais. Mais simples: use dado sintético e sai do problema.",
            },
            {
              q: "E dado sensível LGPD art. 5 II (saúde, financeiro, biometria)?",
              a: "Regras mais rígidas. Consentimento específico ou base legal do art. 11 obrigatório. Em teste, jamais use dado real - sempre gere sintético. FakeForge não gera dado de saúde/biometria, mas gera CPF/CNPJ/PIX/cartão sintéticos que não caem em art. 5 II.",
            },
            {
              q: "ANPD já aplicou multa por dado real em staging?",
              a: "Sim. Casos documentados envolvem: (1) banco de dev exposto no S3 público, (2) empresa que compartilhou staging com fornecedor sem DPA (Data Processing Agreement), (3) log de acesso ausente em vazamento. Multa até 2% do faturamento (máximo R$50M por infração).",
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
          <Link href="/gerador-cpf" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Testar Gerador</Link>
          <Link href="/como-gerar-cpf-valido-sem-infringir-lei" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">CPF Sem Infringir a Lei</Link>
          <Link href="/melhor-gerador-cpf-testes-software" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Comparativo de Geradores</Link>
        </div>
      </section>

      <div className="mt-8 pt-6 border-t border-border">
        <p className="text-[11px] text-muted italic">
          Este guia é informativo e não substitui parecer jurídico. Consulte DPO/advogado se sua operação
          envolver dado de saúde, financeiro regulado BACEN, biometria ou dado sensível LGPD art. 5 II.
          Última atualização: setembro/2026.
        </p>
      </div>
    </PageShell>
  );
}
