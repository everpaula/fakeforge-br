import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import WaitlistForm from "@/components/WaitlistForm";

export const metadata: Metadata = {
  title: "Como Criar um Micro SaaS no Brasil: Playbook do FakeForge",
  description: "O que é micro SaaS e como criar um no Brasil: stack, custo real por mês, SEO programático e os erros que cometi no FakeForge. Receba a prévia grátis.",
  keywords: "micro saas, como criar um micro saas, como criar um saas, micro saas o que é, ideias de micro saas, micro saas exemplos, como criar um saas do zero",
  alternates: { canonical: "/como-criar-micro-saas" },
  openGraph: {
    title: "Como criar um micro SaaS no Brasil: o playbook real do FakeForge",
    description: "Stack, custo por mês, SEO programático e os erros de quem colocou um SaaS brasileiro no ar sozinho e sem investidor.",
    type: "article",
    locale: "pt_BR",
  },
};

const STACK = [
  ["Frontend", "Next.js (App Router)", "US$ 0"],
  ["Hospedagem", "Vercel Pro", "US$ 20"],
  ["Banco e login", "Supabase Pro", "US$ 25"],
  ["Email", "Resend", "US$ 0 a 20"],
  ["Pagamento", "Stripe, cobrando em reais", "3,99% por venda"],
  ["SEO", "Ubersuggest", "US$ 12"],
];

const STEPS = [
  {
    title: "Escolher uma dor que você mesmo tem",
    body: "O FakeForge nasceu de um problema de dev brasileiro: gerar CPF, CNPJ e CEP que passem em validação de verdade. Quando a dor é sua, você sabe o que buscar no Google e o que é resposta ruim.",
  },
  {
    title: "Subir com a camada grátis de tudo",
    body: "No primeiro mês o custo ficou perto de R$ 5. Plano pago só entra quando aparece um limite real, e cada ferramenta dá um sinal claro de quando isso acontece.",
  },
  {
    title: "Tratar SEO como produto",
    body: "Sem verba de anúncio, tráfego vem de página. Cada gerador, cada linguagem e cada comparação com concorrente virou uma página própria, com conteúdo que responde a busca direto.",
  },
  {
    title: "Medir o funil antes de criar teoria",
    body: "Passei semanas achando que o problema era conversão. Uma consulta SQL de 20 minutos mostrou que o painel estava cortando os dados e que o gargalo era outro.",
  },
  {
    title: "Cobrar cedo, em reais, sem formulário de contato",
    body: "Checkout direto, preço em reais, plano empresarial também no cartão. Quem quer pagar não deveria precisar marcar reunião.",
  },
];

const MISTAKES = [
  {
    title: "O email de cadastro travava em poucos envios por dia",
    body: "O serviço de email que vem embutido no Supabase tem um teto baixo. Os cadastros ficaram iguais por dias seguidos e eu demorei pra perceber que era limite, não falta de interesse.",
  },
  {
    title: "O painel mostrava uma fração dos dados reais",
    body: "A consulta do painel administrativo cortava em mil linhas sem avisar. Todo diagnóstico de conversão que fiz nesse período estava errado.",
  },
  {
    title: "Eventos novos eram descartados em silêncio",
    body: "A API de eventos tinha uma lista de tipos aceitos. Cada evento novo que eu esquecia de registrar ali sumia, e a funcionalidade parecia não estar sendo usada.",
  },
];

const FAQ = [
  {
    q: "O que é micro SaaS?",
    a: "Micro SaaS é um software vendido por assinatura que resolve um problema específico de um nicho, mantido por uma pessoa ou um time muito pequeno, sem investidor. A diferença pra um SaaS tradicional está no tamanho da operação e no foco: um problema, um público, custo fixo baixo.",
  },
  {
    q: "Quanto custa manter um micro SaaS no Brasil?",
    a: "No primeiro mês, perto de R$ 5, usando os planos grátis de hospedagem, banco e email. Com algumas centenas de usuários ativos, o FakeForge roda entre R$ 300 e R$ 400 por mês somando Vercel, Supabase, Resend e ferramenta de SEO.",
  },
  {
    q: "Preciso saber programar pra criar um micro SaaS?",
    a: "Ajuda muito, mas eu não sou desenvolvedor de formação. Venho de operações e construí o FakeForge com Claude Code. O playbook mostra como eu estruturei esse trabalho: o que pedir, o que revisar e onde a IA erra.",
  },
  {
    q: "Brasileiro paga por SaaS?",
    a: "Ainda estou descobrindo, e não vou fingir o contrário. O FakeForge trouxe tráfego e cadastro bem antes de trazer receita. O playbook mostra os números reais das duas metades: o que fez gente chegar e o que estou testando pra transformar cadastro em cliente.",
  },
  {
    q: "Quanto vai custar o playbook e quando sai?",
    a: "O playbook em PDF vai custar R$ 97 no lançamento. A prévia é grátis pra quem está na lista. A data depende do interesse: estou medindo quantas pessoas entram na lista antes de fechar o material.",
  },
];

export default function ComoCriarMicroSaas() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Playbook em PDF · lista de espera aberta</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Como criar um micro SaaS no Brasil: <span className="text-primary">o playbook real do FakeForge</span>
        </h1>
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed max-w-2xl">
          Micro SaaS é um software por assinatura que resolve um problema específico de um nicho, tocado por uma
          pessoa ou um time mínimo, sem investidor. Este site é um: o FakeForge foi construído por uma pessoa só,
          tem mais de 130 páginas indexáveis e passou de 700 cadastros (uns 550 depois de tirar os bots). Estou documentando o caminho inteiro, com
          stack, custo, o que trouxe tráfego e os erros que me custaram semanas.
        </p>
      </div>

      <div className="mb-10">
        <WaitlistForm
          product="micro-saas"
          heading="Receba a prévia do playbook por email, grátis"
          cta="Quero receber a prévia"
        />
      </div>

      <section className="mb-10 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">Resumo</h2>
        <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
          <li>Stack: Next.js, Vercel, Supabase, Resend e Stripe.</li>
          <li>Custo: perto de R$ 5 no primeiro mês, entre R$ 300 e R$ 400 por mês com centenas de usuários.</li>
          <li>Tráfego: SEO programático, sem anúncio pago.</li>
          <li>Inclui os erros: limite de email, painel com dado cortado, eventos perdidos.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-foreground mb-3">Por que tanto projeto paralelo morre antes do primeiro usuário</h2>
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            Você já começou dois ou três. Comprou o domínio, montou o login, travou em algum detalhe de
            infraestrutura numa terça à noite e nunca mais abriu o repositório.
          </p>
          <p>
            O conteúdo sobre micro SaaS que aparece por aí vem quase todo de fora: preço em dólar, cliente
            americano, meio de pagamento que não existe aqui. Quando é brasileiro, costuma ser a história de
            sucesso contada depois, sem a parte em que deu errado.
          </p>
          <p>
            O que falta é o registro de alguém que está no meio do caminho, com os números de verdade e as decisões
            que tomaria diferente. É isso que o playbook entrega.
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-foreground mb-4">Como criar um micro SaaS em 5 passos</h2>
        <ol className="space-y-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="rounded-lg bg-card border border-border p-4 flex gap-4">
              <span className="text-primary font-mono text-sm font-bold shrink-0">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-foreground mb-3">A stack e quanto ela custa</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
          Tudo abaixo tem plano grátis suficiente pra validar. Os valores são dos planos pagos que o FakeForge usa
          hoje.
        </p>
        <div className="overflow-x-auto rounded-lg bg-card border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-3 py-2 text-muted font-medium">Camada</th>
                <th className="text-left px-3 py-2 text-muted font-medium">Ferramenta</th>
                <th className="text-left px-3 py-2 text-muted font-medium">Custo por mês</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {STACK.map(([layer, tool, cost]) => (
                <tr key={layer}>
                  <td className="px-3 py-2 text-foreground">{layer}</td>
                  <td className="px-3 py-2 text-muted-foreground">{tool}</td>
                  <td className="px-3 py-2 text-muted-foreground">{cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-foreground mb-4">Três erros que o playbook conta em detalhe</h2>
        <div className="space-y-3">
          {MISTAKES.map((mistake) => (
            <div key={mistake.title} className="rounded-lg bg-card border border-border p-4">
              <h3 className="text-sm font-semibold text-foreground">{mistake.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{mistake.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-foreground mb-3">Quem escreve</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Everton Paula, fundador do FakeForge. Venho de mais de 15 anos em operações de marketplaces e tecnologia,
          não de engenharia de software. O FakeForge é independente, sem investidor, e você pode conferir o produto
          agora mesmo na <Link href="/" className="text-primary hover:underline">página inicial</Link> ou na{" "}
          <Link href="/docs" className="text-primary hover:underline">documentação da API</Link>.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-foreground mb-4">Perguntas frequentes</h2>
        <div className="space-y-3">
          {FAQ.map((item) => (
            <details key={item.q} className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">{item.q}</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="rounded-xl bg-card border border-border p-6 text-center">
        <h2 className="text-lg font-bold text-foreground">A prévia sai antes do playbook completo</h2>
        <p className="text-sm text-muted-foreground mt-2 mb-4">
          Quem está na lista recebe primeiro, de graça, e é avisado do lançamento a R$ 97.
        </p>
        <a
          href="#lista"
          className="inline-block px-6 py-3 rounded-lg text-sm font-bold bg-primary text-white hover:bg-primary-hover transition-colors"
        >
          Quero entrar na lista
        </a>
      </section>

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Como criar um micro SaaS", url: "/como-criar-micro-saas" },
      ]} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            })),
          }),
        }}
      />
    </PageShell>
  );
}
