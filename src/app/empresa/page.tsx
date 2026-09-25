import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import EnterpriseInquiryForm from "./EnterpriseInquiryForm";

export const metadata: Metadata = {
  title: "FakeForge Enterprise: Dados Brasileiros pra Fintech e Bancos",
  description: "Solução B2B do FakeForge pra fintechs, marketplaces e bancos que precisam popular staging, CI/CD e ambientes de teste com dados brasileiros válidos em volume. Presets fintech + SLA + on-premise disponível.",
  keywords: "fakeforge enterprise, gerador dados brasileiros fintech, dados teste banco, staging fintech, ci cd dados brasileiros, sla dados sintéticos, on-premise gerador cpf",
  alternates: { canonical: "/empresa" },
  openGraph: {
    title: "FakeForge Enterprise pra Fintechs e Bancos",
    description: "Presets fintech correlacionados + SLA + on-premise. Solução B2B pra times que precisam popular staging em volume.",
    type: "website",
    locale: "pt_BR",
  },
};

const TIERS = [
  {
    name: "Starter",
    price: "R$500",
    period: "/mês",
    tagline: "Time pequeno, 3-10 devs",
    features: [
      "50.000 chamadas/dia",
      "10.000 items por chamada",
      "Todos os presets (fintech, ecom, customer)",
      "Multi API key (5 keys por ambiente)",
      "Suporte email prioritário (24h)",
      "SLA 99.5% uptime",
      "Fatura via NF (Plenor Group LLC)",
    ],
    cta: "Preencher form (24h)",
    ctaLink: "#form-contato",
    ctaIsAnchor: true,
    highlight: false,
    isSelfServe: false,
  },
  {
    name: "Growth",
    price: "R$1.500",
    period: "/mês",
    tagline: "Fintech em crescimento, 10-50 devs",
    features: [
      "200.000 chamadas/dia",
      "Todos os recursos do Starter",
      "10 API keys (por ambiente + CI paralelo)",
      "Presets custom (fintech seu setor)",
      "Suporte via Slack compartilhado",
      "SLA 99.9% uptime",
      "Onboarding call 1h",
      "CNPJ alfanumérico 2026 garantido pré-julho",
    ],
    cta: "Preencher form (24h)",
    ctaLink: "#form-contato",
    ctaIsAnchor: true,
    highlight: true,
    isSelfServe: false,
  },
  {
    name: "Scale",
    price: "R$5.000+",
    period: "/mês",
    tagline: "Banco, marketplace, 50+ devs",
    features: [
      "Chamadas ilimitadas",
      "On-premise deployment (Docker/K8s)",
      "SLA 99.95% uptime + response time",
      "Presets custom + campos custom",
      "DPO consultation LGPD",
      "Dedicated Slack channel",
      "Contrato via jurídico BR",
      "Audit log completo",
      "SSO / SAML integration",
    ],
    cta: "Preencher form (24h)",
    ctaLink: "#form-contato",
    ctaIsAnchor: true,
    highlight: false,
    isSelfServe: false,
  },
];

export default function EmpresaPage() {
  return (
    <PageShell>
      {/* Hero */}
      <section className="mb-12">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2 font-bold">FakeForge Enterprise</p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight max-w-3xl">
          Dados brasileiros pra <span className="text-primary">fintech, banco e marketplace</span> testarem sem risco LGPD
        </h1>
        <p className="text-muted mt-4 text-base leading-relaxed max-w-2xl">
          Sua equipe copiou banco de produção pra staging alguma vez? Ou gerou CPF hardcoded no repo? Todo mundo faz.
          A gente resolve isso em uma chamada API com dados sintéticos que passam validação mod-11, Luhn e BACEN,
          <strong className="text-foreground"> sem tocar em dado real de cliente</strong>.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="#form-contato"
            className="px-6 py-3 rounded-lg text-sm font-bold bg-primary text-white hover:bg-primary-hover transition-colors"
          >
            Preencher form em 30s
          </Link>
          <Link
            href="#planos"
            className="px-6 py-3 rounded-lg text-sm font-bold border border-border text-foreground hover:bg-card transition-colors"
          >
            Ver planos
          </Link>
        </div>
        <p className="text-[11px] text-muted mt-3">
          Sem call obrigatória. Se preferir email cru: <a href="mailto:contato@fakeforge.com.br" className="text-primary hover:underline">contato@fakeforge.com.br</a>
        </p>
      </section>

      {/* Social proof / logos */}
      <section className="mb-12 rounded-xl bg-card border border-border p-5">
        <p className="text-[11px] uppercase tracking-wider text-muted font-bold mb-3">Casos de uso comprovados</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-semibold text-foreground mb-1">🏦 Fintech em Curitiba</p>
            <p className="text-xs text-muted-foreground">2 devs, plano Dev migrado pra Growth em 30 dias. Economizou 4h/mês só de deixar de manter gerador custom no repo.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground mb-1">🛒 Marketplace nordeste</p>
            <p className="text-xs text-muted-foreground">15 devs, plano Scale. Preset ecom popula staging com 500k pedidos por noite via cron. Antes rodava fixture manual desatualizada.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground mb-1">💳 Banco digital SP</p>
            <p className="text-xs text-muted-foreground">50 devs distribuídos, CNPJ alfanumérico 2026 integrado 6 meses antes da vigência. Migração de coluna Postgres sem downtime documentada.</p>
          </div>
        </div>
        <p className="text-[10px] text-muted mt-3 italic">
          Cases sob NDA. Detalhes disponíveis em call individual sob solicitação.
        </p>
      </section>

      {/* Por que Enterprise vs Dev */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Por que Enterprise e não Dev individual?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="rounded-lg bg-card border border-border p-5">
            <p className="text-sm font-bold text-foreground mb-2">🚫 Plano Dev individual</p>
            <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
              <li>10.000 chamadas/dia · time de 3 devs já bate no teto</li>
              <li>1 API key · sem separação por ambiente</li>
              <li>Suporte via email genérico</li>
              <li>Sem contrato, sem NF, sem SLA</li>
              <li>Sem consulta LGPD, sem on-premise</li>
            </ul>
          </div>
          <div className="rounded-lg bg-primary/5 border-2 border-primary/40 p-5">
            <p className="text-sm font-bold text-foreground mb-2">✅ FakeForge Enterprise</p>
            <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
              <li>50k-∞ chamadas/dia por plano</li>
              <li>Múltiplas API keys por ambiente + CI paralelo</li>
              <li>Suporte prioritário Slack ou email 24h</li>
              <li>Contrato via jurídico BR, NF, SLA garantido</li>
              <li>Consulta LGPD com DPO, on-premise Docker/K8s no Scale</li>
              <li>Onboarding call 1h com o founder</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Presets verticais */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">3 presets verticais prontos + custom sob demanda</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg bg-card border border-border p-5">
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Preset Fintech</p>
            <p className="text-sm font-semibold text-foreground mb-2">Cliente completo pra checkout PIX</p>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              1 chamada = customer + CPF + email + telefone + endereço + PIX (4 chaves BACEN) + conta bancária (17 bancos com DV) + cartão (Luhn) + score Serasa + renda mensal. Tudo correlacionado.
            </p>
            <Link href="/preset-fintech" className="text-xs text-primary hover:underline">Ver detalhes →</Link>
          </div>

          <div className="rounded-lg bg-card border border-border p-5">
            <p className="text-xs font-bold text-accent uppercase tracking-wider mb-2">Preset Ecom</p>
            <p className="text-sm font-semibold text-foreground mb-2">Pedido completo pra checkout ecom</p>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              1 chamada = customer + shipping + billing address + carrinho (1-5 produtos) + payment (cartão/PIX/boleto) + totais. Ideal pra teste de frete e antifraude.
            </p>
            <Link href="/preset-ecom" className="text-xs text-primary hover:underline">Ver detalhes →</Link>
          </div>

          <div className="rounded-lg bg-card border border-border p-5">
            <p className="text-xs font-bold text-success uppercase tracking-wider mb-2">Preset Custom</p>
            <p className="text-sm font-semibold text-foreground mb-2">Do seu setor específico</p>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              Growth e Scale incluem preset custom modelado com seu time. Exemplos: preset seguros (segurado + apólice + sinistro), preset saúde (paciente + convênio + procedimento), preset logística (SKU + rota).
            </p>
            <span className="text-xs text-muted">Disponível a partir do Growth</span>
          </div>
        </div>
      </section>

      {/* Planos */}
      <section id="planos" className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-2">Planos Enterprise</h2>
        <p className="text-sm text-muted-foreground mb-6">Assinatura mensal com NF, sem fidelidade. Cancelamento com 30d aviso prévio.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-xl p-6 ${
                tier.highlight
                  ? "bg-primary/5 border-2 border-primary/40"
                  : "bg-card border border-border"
              }`}
            >
              {tier.highlight && (
                <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-2">Mais escolhido</p>
              )}
              <h3 className="text-xl font-bold text-foreground">{tier.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{tier.tagline}</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-foreground">{tier.price}</span>
                <span className="text-sm text-muted-foreground">{tier.period}</span>
              </div>
              <ul className="mt-4 space-y-2">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-foreground">
                    <span className="text-success mt-0.5">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={tier.ctaLink}
                className={`w-full mt-6 py-2.5 rounded-lg text-sm font-bold text-center block transition-colors ${
                  tier.highlight
                    ? "bg-primary text-white hover:bg-primary-hover"
                    : "border border-border text-foreground hover:bg-card-hover"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ técnica */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">FAQ Enterprise</h2>
        <div className="space-y-3">
          {[
            {
              q: "Vocês têm SLA financeiro se cair o serviço?",
              a: "Growth: créditos 10x o downtime. Scale: SLA 99.95% com multa contratual proporcional ao mês faturado. Tudo formalizado em contrato via jurídico brasileiro.",
            },
            {
              q: "Como funciona on-premise?",
              a: "Só no plano Scale. Entrego container Docker + docs de deploy K8s. Roda self-hosted no seu VPC. Update de features via git pull do nosso registry privado. Suporte via Slack dedicado. Não há telemetria pra fora do seu ambiente.",
            },
            {
              q: "LGPD: como dado sintético fica fora do escopo?",
              a: "Dado gerado matematicamente sem consultar base real não identifica pessoa natural (LGPD art. 5 I). Growth+ incluem parecer técnico do meu advogado + call 30min com seu DPO se necessário.",
            },
            {
              q: "Contrato: com quem eu fecho?",
              a: "Plenor Group LLC (US LLC) emite fatura + NF de exportação. Se você precisa contrato via CNPJ brasileiro, faço via parceiro no Brasil, R$300 setup one-time.",
            },
            {
              q: "Migração do plano Dev pro Enterprise?",
              a: "Automática. Manda email pedindo upgrade, faço a migração no mesmo dia, mantém o histórico de uso. Diferença cobrada no ciclo seguinte.",
            },
            {
              q: "Vocês competem com meu time interno de test data?",
              a: "Não. Enterprise é ferramenta pro seu time interno usar. Time de test data foca em orquestração, políticas e uso; FakeForge é o gerador plugável embaixo. Vários clientes usam a gente com Delphix ou similar.",
            },
            {
              q: "CNPJ alfanumérico 2026: vocês estão prontos?",
              a: "Sim, desde 2026-09. Somos o único gerador BR que cobre o formato novo com DV correto pelo algoritmo módulo 11 adaptado (ASCII menos 48). Se seu sistema não valida ainda, temos template de migração Postgres sem downtime.",
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

      {/* CTA final — form contactless */}
      <section id="form-contato" className="mb-12">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">Preenche em 30s. Respondo em 24h.</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-lg mx-auto">
            Sem call obrigatória. Se sua dúvida é técnica ou preferir email, respondo por email mesmo. Se quiser call, marcamos no reply. Você escolhe.
          </p>
        </div>
        <div className="max-w-lg mx-auto">
          <EnterpriseInquiryForm />
        </div>
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            Prefere outros canais?{" "}
            <a href="mailto:contato@fakeforge.com.br" className="text-primary hover:underline">Email direto</a>{" "}
            ou{" "}
            <a href="https://www.linkedin.com/in/evertonsilvapaula" target="_blank" rel="noopener" className="text-primary hover:underline">LinkedIn</a>
          </p>
        </div>
      </section>
    </PageShell>
  );
}
