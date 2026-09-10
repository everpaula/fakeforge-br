import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import GeneratorSchema from "@/components/GeneratorSchema";

export const metadata: Metadata = {
  title: "Telefone Aleatório: Celular ou Fixo Residencial (ANATEL)",
  description: "Gerador de telefone aleatório com formato brasileiro válido. Celular (11 dígitos com 9) ou fixo residencial (10 dígitos). 67 DDDs cobertos. Para mock de cadastro, teste de SMS, fixture de QA. Grátis, API REST.",
  keywords: "telefone aleatório, telefone aleatorio, gerador de telefone, gerar telefone, telefone fake, telefone fictício, número de telefone aleatório, gerador telefone brasileiro, gerar telefone fake para cadastro",
  alternates: { canonical: "/telefone-aleatorio" },
  openGraph: {
    title: "Telefone Aleatório: Celular ou Fixo Residencial",
    description: "Gera celular (com 9 na frente) ou fixo residencial no formato brasileiro válido. Escolhe qual precisa.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function TelefoneAleatorio() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Ferramenta para desenvolvedores</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Telefone <span className="text-primary">Aleatório</span> (Celular ou Fixo)
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Gerador de telefone aleatório com formato brasileiro válido. Escolha entre celular
          (11 dígitos com 9 na frente, formato ANATEL) ou fixo residencial (10 dígitos, sem 9).
          Ambos com DDDs corretos por região. Para mock de cadastro, teste de validação e fixture de QA.
        </p>
      </div>

      <div className="space-y-6">
        <SingleGenerator
          type="phone"
          label="Celular Aleatório"
          description="11 dígitos com 9 na frente (formato ANATEL)"
        />
        <SingleGenerator
          type="landline"
          label="Telefone Fixo Residencial"
          description="10 dígitos, sem prefixo 9 (formato residencial/comercial)"
        />
      </div>

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Telefone Aleatório", url: "/telefone-aleatorio" },
      ]} />

      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Celular vs fixo: quando usar cada</h2>
          <p>
            Sua aplicação provavelmente valida telefone com regra diferente pra celular e fixo.
            <strong className="text-foreground"> Celular exige 11 dígitos com 9 na frente</strong>{" "}
            (Resolução ANATEL 553/2010). <strong className="text-foreground">Fixo tem 10 dígitos</strong>{" "}
            e nunca começa com 9. Se seu regex trata os dois formatos igual, você tem bug.
          </p>
          <p className="mt-2">
            No frontend padrão de cadastro, o input geralmente aceita ambos. No backend, algumas empresas
            armazenam separado (celular_pessoal / telefone_residencial) e outras num campo único. Nossa
            ferramenta gera os dois formatos, você escolhe qual seed no banco.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Snippet Node.js</h2>
          <pre className="bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`// 500 celulares + 500 fixos pra seed de banco
const [celulares, fixos] = await Promise.all([
  fetch("https://fakeforge.com.br/api/generate?type=phone&quantity=500")
    .then(r => r.json()).then(r => r.data),
  fetch("https://fakeforge.com.br/api/generate?type=landline&quantity=500")
    .then(r => r.json()).then(r => r.data),
]);

for (let i = 0; i < 500; i++) {
  await db.contato.create({
    data: {
      celular: celulares[i],
      residencial: fixos[i],
    }
  });
}`}</code></pre>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Perguntas Frequentes</h2>
          <div className="space-y-3">
            {[
              { q: "Telefone aleatório é diferente de telefone fake?", a: "Não. Ambos são termos pra número gerado que passa validação de formato mas não pertence a chip real. Aleatório enfatiza o modo de geração (random), fake enfatiza a origem (não real). No FakeForge é a mesma coisa." },
              { q: "Como sei se é celular ou fixo?", a: "Celular brasileiro tem 11 dígitos e começa com 9 depois do DDD. Fixo tem 10 dígitos e começa com 2, 3, 4 ou 5 depois do DDD. Nossa ferramenta oferece os dois tipos separados pra você não misturar." },
              { q: "Números aleatórios respeitam DDD por estado?", a: "Sim. Cobrimos os 67 DDDs oficiais da ANATEL. Se você precisa forçar DDD específico ou casar DDD com UF do endereço, use o preset customer que gera pessoa com telefone, CPF e endereço correlacionados em 1 chamada." },
              { q: "Posso usar em cadastros reais como Serasa, banco?", a: "Não. Esses sistemas fazem lookup em operadora e vão retornar 'linha não encontrada'. Para testes de validação de formato, tudo bem. Para completar cadastro real, precisa de número que exista." },
              { q: "Quantos telefones grátis por dia?", a: "50 chamadas grátis/dia na API, até 100 telefones por chamada = 5.000 telefones/dia máximo. Plano Dev (R$29/mês) libera 10.000 chamadas + 10.000 por chamada." },
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

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Ferramentas relacionadas</h2>
          <div className="flex flex-wrap gap-2">
            <Link href="/gerador-telefone" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">Gerador de Telefone (pilar)</Link>
            <Link href="/numero-de-celular-aleatorio" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">Celular aleatório</Link>
            <Link href="/gerador-telefone-fixo" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">Fixo residencial</Link>
            <Link href="/gerador-de-numero-fake" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">Número fake</Link>
            <Link href="/gerador-numero-para-cadastro" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">Para cadastro</Link>
          </div>
        </section>
      </div>

      <GeneratorSchema
        name="Telefone Aleatório"
        url="https://fakeforge.com.br/telefone-aleatorio"
        description="Gerador de telefone aleatório com formato brasileiro válido. Celular (11 dígitos com 9) ou fixo residencial (10 dígitos). 67 DDDs cobertos. Para mock, teste e fixture."
        features={[
          "Escolha entre celular ANATEL ou fixo residencial",
          "67 DDDs oficiais cobertos",
          "11 dígitos para celular, 10 para fixo",
          "API REST com 50 chamadas grátis/dia",
          "Preset customer com telefone + CPF + endereço",
          "Export JSON, CSV e SQL com CREATE TABLE",
        ]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Telefone aleatório é diferente de telefone fake?", acceptedAnswer: { "@type": "Answer", text: "Não. Ambos são termos pra número gerado que passa validação de formato mas não pertence a chip real. No FakeForge é a mesma coisa." } },
              { "@type": "Question", name: "Como sei se é celular ou fixo?", acceptedAnswer: { "@type": "Answer", text: "Celular tem 11 dígitos e começa com 9 depois do DDD. Fixo tem 10 dígitos e começa com 2, 3, 4 ou 5." } },
              { "@type": "Question", name: "Números aleatórios respeitam DDD por estado?", acceptedAnswer: { "@type": "Answer", text: "Sim. Cobrimos os 67 DDDs oficiais da ANATEL. Preset customer casa DDD com UF do endereço." } },
              { "@type": "Question", name: "Posso usar em cadastros reais como Serasa, banco?", acceptedAnswer: { "@type": "Answer", text: "Não. Esses sistemas fazem lookup em operadora. Para teste de formato, funciona." } },
              { "@type": "Question", name: "Quantos telefones grátis por dia?", acceptedAnswer: { "@type": "Answer", text: "50 chamadas grátis/dia, 100 por chamada = 5.000/dia. Plano Dev libera 10.000/10.000." } },
            ],
          }),
        }}
      />
    </PageShell>
  );
}
