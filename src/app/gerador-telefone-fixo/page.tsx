import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import GeneratorSchema from "@/components/GeneratorSchema";

export const metadata: Metadata = {
  title: "Gerador de Telefone Fixo Residencial (10 Dígitos)",
  description: "Gerador de telefone fixo residencial válido no formato brasileiro (10 dígitos, sem 9 na frente). DDDs oficiais por região. Para mock de cadastro, teste antifraude, seed de banco. Grátis, API REST.",
  keywords: "gerador de telefone fixo, telefone fixo, telefone residencial fake, gerar telefone fixo, telefone fixo aleatorio, número fixo, telefone comercial gerar, numero de telefone fixo aleatorio",
  alternates: { canonical: "/gerador-telefone-fixo" },
  openGraph: {
    title: "Gerador de Telefone Fixo Residencial",
    description: "10 dígitos no formato brasileiro. Sem 9 na frente. Para cadastro, antifraude e fixture.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function GeradorTelefoneFixo() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Ferramenta para desenvolvedores</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">Telefone Fixo Residencial</span>
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Telefone fixo residencial ou comercial no formato brasileiro: 10 dígitos totais, começa
          com 2, 3, 4 ou 5 depois do DDD (nunca 9). DDDs oficiais por região. Perfeito para cadastros
          que exigem tipo específico, teste de antifraude e seed de contatos em CRM.
        </p>
      </div>

      <SingleGenerator
        type="landline"
        label="Telefone Fixo"
        description="Formato: (DDD) XXXX-XXXX (10 dígitos, sem 9 na frente)"
      />

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Gerador de Telefone Fixo", url: "/gerador-telefone-fixo" },
      ]} />

      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Fixo vs celular: por que separar</h2>
          <p>
            Telefone fixo brasileiro sempre começa com um dígito entre 2 e 5. Nunca começa com 9 (que é
            marca de celular pós-2014). Se seu formulário aceita &quot;telefone residencial&quot; e o usuário digita
            <strong className="text-foreground"> 11 dígitos com 9 na frente</strong>, seu validador deveria rejeitar — a pessoa
            tá digitando celular no campo errado.
          </p>
          <p className="mt-2">
            Muitos sistemas de crédito, RH e cadastros bancários pedem os dois: celular pessoal + fixo
            residencial + fixo comercial. Cada um valida diferente. Nossa ferramenta gera especificamente
            o formato fixo, que evita bugs em testes de formulário.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">DDDs por região (mesma cobertura do celular)</h2>
          <p>
            Fixos usam os mesmos 67 DDDs oficiais da ANATEL. Diferença é o dígito inicial após o DDD.
            Nossa geração respeita ambas as regras — DDD válido + prefixo correto:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 mt-3">
            <li><strong className="text-foreground">Grande SP (11):</strong> começa com 2, 3, 4, 5 (ex: 11 3456-7890)</li>
            <li><strong className="text-foreground">RJ (21):</strong> começa com 2, 3 (ex: 21 2345-6789)</li>
            <li><strong className="text-foreground">Interior:</strong> mesma regra, prefixo variando por operadora local</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Seed no CRM: fixture PHP/Laravel</h2>
          <pre className="bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`use Illuminate\\Support\\Facades\\Http;

// 500 clientes com celular + fixo residencial pra staging
public function seedClientes()
{
    $celulares = Http::get('https://fakeforge.com.br/api/generate', [
        'type' => 'phone',
        'quantity' => 500,
    ])->json('data');

    $fixos = Http::get('https://fakeforge.com.br/api/generate', [
        'type' => 'landline',
        'quantity' => 500,
    ])->json('data');

    foreach ($celulares as $i => $celular) {
        Cliente::create([
            'celular' => $celular,
            'telefone_residencial' => $fixos[$i],
        ]);
    }
}`}</code></pre>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Perguntas Frequentes</h2>
          <div className="space-y-3">
            {[
              { q: "Fixo residencial e comercial usam formato diferente?", a: "Não. Ambos têm 10 dígitos e começam com 2, 3, 4 ou 5 depois do DDD. A diferença é comercial ou não, e isso é atributo do assinante, não do número. Nossa ferramenta gera número válido pra qualquer uso residencial ou comercial." },
              { q: "Como testo antifraude com fixo?", a: "Antifraudes geralmente pontuam fixo como mais confiável (indica endereço residencial estável) e celular pré-pago como menos. Se seu antifraude cruza DDD com CEP do endereço, use o preset customer que garante DDD × UF coerente." },
              { q: "Fixo pode receber SMS?", a: "Não. SMS é serviço de celular. Fixo recebe apenas chamada de voz. Se você tenta enviar SMS para fixo em produção, a operadora rejeita ou converte em ligação com síntese de voz (text-to-speech)." },
              { q: "Preciso do 9 na frente pra fixo?", a: "Não. O 9 na frente é exclusivo do celular (Resolução ANATEL 553/2010). Fixo mantém 8 dígitos após o DDD. Total 10 dígitos incluindo DDD." },
              { q: "Como gerar fixo em massa via API?", a: "GET /api/generate?type=landline&quantity=100. 50 chamadas/dia grátis. Plano Dev libera 10.000/dia." },
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
            <Link href="/gerador-de-numero-fake" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">Número fake</Link>
            <Link href="/gerador-endereco" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">Endereço brasileiro</Link>
          </div>
        </section>
      </div>

      <GeneratorSchema
        name="Gerador de Telefone Fixo Residencial"
        url="https://fakeforge.com.br/gerador-telefone-fixo"
        description="Gerador de telefone fixo residencial ou comercial no formato brasileiro (10 dígitos, sem 9). 67 DDDs oficiais. Para mock, antifraude e seed de CRM."
        features={[
          "10 dígitos totais (formato fixo brasileiro)",
          "Prefixo 2, 3, 4 ou 5 (nunca 9)",
          "67 DDDs oficiais da ANATEL",
          "Serve pra residencial e comercial",
          "API REST com 50 chamadas grátis/dia",
          "Preset customer com fixo + endereço correlacionados",
        ]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Fixo residencial e comercial usam formato diferente?", acceptedAnswer: { "@type": "Answer", text: "Não. Ambos têm 10 dígitos e começam com 2, 3, 4 ou 5 depois do DDD. Diferença é atributo do assinante, não do número." } },
              { "@type": "Question", name: "Como testo antifraude com fixo?", acceptedAnswer: { "@type": "Answer", text: "Antifraudes pontuam fixo como mais confiável. Use preset customer que garante DDD × UF coerente." } },
              { "@type": "Question", name: "Fixo pode receber SMS?", acceptedAnswer: { "@type": "Answer", text: "Não. SMS é serviço de celular. Fixo recebe apenas chamada de voz." } },
              { "@type": "Question", name: "Preciso do 9 na frente pra fixo?", acceptedAnswer: { "@type": "Answer", text: "Não. O 9 na frente é exclusivo do celular. Fixo mantém 8 dígitos após o DDD, total 10." } },
              { "@type": "Question", name: "Como gerar fixo em massa via API?", acceptedAnswer: { "@type": "Answer", text: "GET /api/generate?type=landline&quantity=100. 50 chamadas/dia grátis." } },
            ],
          }),
        }}
      />
    </PageShell>
  );
}
