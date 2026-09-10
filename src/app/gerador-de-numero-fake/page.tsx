import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import GeneratorSchema from "@/components/GeneratorSchema";

export const metadata: Metadata = {
  title: "Gerador de Número Fake para Testes (Celular ou Fixo)",
  description: "Gerador de número fake em formato brasileiro válido para testes de cadastro, mock de checkout e fixtures de QA. Passa em validação de front-end. Grátis, sem cadastro, API REST.",
  keywords: "gerador de numero fake, gerador de número fake, numero fake, número fake, gerar numero fake, celular fake, telefone fake, gerador de numero fake para cadastro, numero fake brasileiro, numero de celular fake, numero de telefone que não existe",
  alternates: { canonical: "/gerador-de-numero-fake" },
  openGraph: {
    title: "Gerador de Número Fake para Testes",
    description: "Passa validação, não pertence a chip real. Ideal pra ambiente de teste, staging e fixtures.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function GeradorNumeroFake() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Ferramenta para desenvolvedores</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">Número Fake</span> para Testes
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Número fake = número que passa validação de formato mas não está vinculado a chip real.
          Perfeito pra mock de cadastro, teste de máscara, fixture pytest/jest e seed de banco de
          staging. Nunca vai completar chamada, receber SMS ou identificar linha ativa. Escolha entre
          celular (com 9 na frente) ou fixo residencial.
        </p>
      </div>

      <div className="space-y-6">
        <SingleGenerator
          type="phone"
          label="Celular Fake"
          description="11 dígitos com 9 na frente. Passa validação mas não recebe SMS."
        />
        <SingleGenerator
          type="landline"
          label="Fixo Residencial Fake"
          description="10 dígitos, formato residencial. Passa máscara mas não completa chamada."
        />
      </div>

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Gerador de Número Fake", url: "/gerador-de-numero-fake" },
      ]} />

      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Fake não é aleatório sem regra</h2>
          <p>
            Muito código de teste usa números tipo <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded font-mono">1234567890</code>
            {" "}ou <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded font-mono">(00) 00000-0000</code>. Isso <strong className="text-foreground">quebra na primeira validação</strong> de qualquer front-end que checa formato ANATEL: sem 9 na frente do celular, DDD 00
            que não existe, sequência óbvia.
          </p>
          <p className="mt-2">
            Número fake do FakeForge é <strong className="text-foreground">algoritmicamente válido</strong>:
            11 dígitos com 9 se for celular, 10 dígitos sem 9 se for fixo, DDD escolhido entre os 67 oficiais
            da ANATEL. Passa em qualquer validador de formato. Só não passa em lookup de operadora (porque
            a operadora não tem esse número registrado como linha ativa).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Fixture pra pytest e jest</h2>
          <pre className="bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`# pytest — fixture com 100 celulares fake
import pytest, requests

@pytest.fixture(scope="session")
def fake_celulares():
    res = requests.get(
        "https://fakeforge.com.br/api/generate",
        params={"type": "phone", "quantity": 100}
    )
    return res.json()["data"]

def test_cadastro_valida_formato(fake_celulares, client):
    for celular in fake_celulares[:20]:
        r = client.post("/cadastro", json={"telefone": celular})
        assert r.status_code == 200  # passa validação de formato`}</code></pre>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Perguntas Frequentes</h2>
          <div className="space-y-3">
            {[
              { q: "Usar número fake em testes é ilegal?", a: "Não. Gerar número que passa validação de formato pra fins de teste é prática padrão em desenvolvimento. O que é ilegal é usar número (fake ou real) para fraude, invasão de conta ou passar por outra pessoa em serviço oficial. Uso em staging, CI e mock é livre." },
              { q: "Número fake e número aleatório são iguais?", a: "Sim. Ambos se referem a número gerado que passa validação mas não pertence a chip real. Aleatório enfatiza o modo de geração (random), fake enfatiza o resultado (não real). É o mesmo produto." },
              { q: "O número fake tem operadora identificada?", a: "Não. Nossa geração não codifica operadora. Se sua aplicação faz lookup em operadora via API de portabilidade (BC ou similar), o número não aparece em nenhum registro. É comportamento esperado." },
              { q: "Como diferenciar celular de fixo no fake?", a: "Celular tem 11 dígitos e começa com 9 depois do DDD. Fixo tem 10 dígitos e começa com 2, 3, 4 ou 5. Nossa ferramenta separa os dois pra você não misturar no seed." },
              { q: "Posso gerar em massa via API?", a: "Sim. 50 chamadas/dia grátis sem cadastro, até 100 números por chamada. Total 5.000/dia. Plano Dev (R$29/mês) libera 10.000 chamadas + 10.000 por chamada." },
              { q: "Número fake dispara antifraude do meu sistema?", a: "Se seu antifraude cruza número com base externa (operadora, cadastro positivo), sim vai marcar como não encontrado. Isso é esperado em teste. Se cruza apenas formato e DDD × UF, o fake do FakeForge passa (respeitamos os 67 DDDs oficiais)." },
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
            <Link href="/telefone-aleatorio" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">Telefone aleatório</Link>
            <Link href="/gerador-telefone-fixo" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">Fixo residencial</Link>
            <Link href="/gerador-numero-para-cadastro" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">Para cadastro</Link>
          </div>
        </section>
      </div>

      <GeneratorSchema
        name="Gerador de Número Fake"
        url="https://fakeforge.com.br/gerador-de-numero-fake"
        description="Gerador de número fake em formato brasileiro válido (celular ou fixo). Passa validação de front-end mas não pertence a chip real. Ideal para testes de cadastro, mock e fixture."
        features={[
          "Celular fake (11 dígitos com 9) ou fixo (10 dígitos)",
          "Passa validação de formato ANATEL",
          "Não recebe SMS nem completa chamada",
          "67 DDDs oficiais cobertos",
          "API REST com fixtures prontas em pytest e jest",
          "50 chamadas grátis/dia sem cadastro",
        ]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Usar número fake em testes é ilegal?", acceptedAnswer: { "@type": "Answer", text: "Não. Gerar número que passa validação de formato pra fins de teste é prática padrão em dev. Ilegal é usar pra fraude ou invasão de conta." } },
              { "@type": "Question", name: "Número fake e número aleatório são iguais?", acceptedAnswer: { "@type": "Answer", text: "Sim. Ambos se referem a número gerado que passa validação mas não pertence a chip real. É o mesmo produto." } },
              { "@type": "Question", name: "O número fake tem operadora identificada?", acceptedAnswer: { "@type": "Answer", text: "Não. Nossa geração não codifica operadora. Lookup via API de portabilidade vai retornar não encontrado." } },
              { "@type": "Question", name: "Como diferenciar celular de fixo no fake?", acceptedAnswer: { "@type": "Answer", text: "Celular tem 11 dígitos e começa com 9. Fixo tem 10 dígitos e começa com 2, 3, 4 ou 5." } },
              { "@type": "Question", name: "Posso gerar em massa via API?", acceptedAnswer: { "@type": "Answer", text: "Sim. 50 chamadas/dia grátis, 100 números por chamada. Plano Dev libera 10.000/10.000." } },
              { "@type": "Question", name: "Número fake dispara antifraude do meu sistema?", acceptedAnswer: { "@type": "Answer", text: "Se cruza com base externa, vai marcar como não encontrado (esperado em teste). Se cruza só formato + DDD × UF, o fake do FakeForge passa." } },
            ],
          }),
        }}
      />
    </PageShell>
  );
}
