import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Parceiros e Programas de Afiliados — FakeForge BR",
  description: "Lista transparente de todos os parceiros e programas de afiliados que o FakeForge BR participa. Política de divulgação, comissões e como funciona.",
  alternates: { canonical: "/parceiros" },
};

const PARCEIROS = [
  {
    nome: "Hostinger",
    desc: "Hospedagem web com servidores no Brasil, suporte em pt-BR e preços a partir de R$11,99/mês.",
    porque: "Recomendamos para devs solo lançando projetos pessoais. Bom custo-benefício pra MVP.",
    comissao: "~50% sobre primeira mensalidade (varia por plano)",
    href: "https://www.hostinger.com.br/",
  },
  {
    nome: "DigitalOcean",
    desc: "Cloud com VPS, bancos gerenciados e Kubernetes. UI limpa e preço previsível.",
    porque: "Ideal pra projetos que precisam de mais controle que Vercel mas menos complexidade que AWS.",
    comissao: "US$25 por novo cliente que gaste US$25 em 60 dias",
    href: "https://www.digitalocean.com/",
  },
  {
    nome: "Clerk",
    desc: "Auth-as-a-service com GitHub OAuth, magic link, MFA e gestão de organizações.",
    porque: "Pra quem está construindo SaaS B2B e quer terceirizar auth. Plano grátis até 10K MAUs.",
    comissao: "30% recorrente por 12 meses",
    href: "https://clerk.com/",
  },
  {
    nome: "Rocketseat",
    desc: "Trilhas e cursos de programação em pt-BR com comunidade ativa.",
    porque: "Ecossistema completo pra dev brasileiro evoluir, do básico ao avançado.",
    comissao: "Variável (programa restrito)",
    href: "https://www.rocketseat.com.br/",
  },
  {
    nome: "Hotmart",
    desc: "Catálogo de cursos digitais em português, incluindo programação.",
    porque: "Modelo &ldquo;compra uma vez, acessa pra sempre&rdquo; é bom pra autoaprendizado.",
    comissao: "Variável por produto (5-50%)",
    href: "https://hotmart.com/",
  },
];

export default function Parceiros() {
  return (
    <PageShell>
      <article className="max-w-2xl">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          Parceiros e <span className="text-primary">Afiliados</span>
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed mb-8">
          Transparência sobre quem o FakeForge BR recomenda e por quê.
        </p>

        <section className="rounded-xl bg-card border border-border p-6 mb-10">
          <h2 className="text-base font-semibold text-foreground mb-3">Como funciona</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Todo link nesta página e nos artigos do blog que aponta para um parceiro é um
            <strong className="text-foreground"> link de afiliado</strong>. Quando você clica e contrata o serviço, o FakeForge
            recebe uma comissão. <strong className="text-foreground">O preço pra você é exatamente o mesmo</strong> (ou melhor —
            às vezes oferecem desconto exclusivo via referral).
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Esses links têm o atributo <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">rel=&quot;sponsored noopener noreferrer&quot;</code>{" "}
            conforme padrões do Google e da regulação brasileira de publicidade (Resolução 12/2018 do CONAR).
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Critério de inclusão:</strong> só recomendamos serviços que usamos ou
            usaríamos no contexto do FakeForge. Não somos pagos pra escrever review positivo. Se você
            tiver experiência ruim com algum, <a href="/contato" className="text-primary hover:underline">nos avise</a>.
          </p>
        </section>

        <h2 className="text-xl font-semibold text-foreground mb-4">Lista atual de parceiros</h2>
        <div className="space-y-3">
          {PARCEIROS.map((p) => (
            <div key={p.nome} className="rounded-xl bg-card border border-border p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-base font-semibold text-foreground">{p.nome}</h3>
                <a
                  href={p.href}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                  className="text-xs text-primary hover:underline whitespace-nowrap"
                >
                  Visitar →
                </a>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{p.desc}</p>
              <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                <strong className="text-foreground">Por que recomendamos:</strong> {p.porque}
              </p>
              <p className="text-[11px] text-muted">
                <strong>Comissão recebida pelo FakeForge:</strong> {p.comissao}
              </p>
            </div>
          ))}
        </div>

        <section className="mt-10 rounded-xl bg-primary/5 border border-primary/20 p-6">
          <h2 className="text-base font-semibold text-foreground mb-2">Quer ser parceiro?</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Se você tem um produto/serviço para devs brasileiros e acha que faz sentido com nossa
            audiência (devs, QAs, agências de software, freelancers), entre em contato.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Critérios:</strong> produto bom, comissão competitiva, política de
            cancelamento clara, e nenhum dark pattern. <a href="/contato" className="text-primary hover:underline">Página de contato</a>.
          </p>
        </section>
      </article>

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Parceiros", url: "/parceiros" },
      ]} />
    </PageShell>
  );
}
