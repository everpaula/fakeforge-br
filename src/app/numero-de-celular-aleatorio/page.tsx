import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import GeneratorSchema from "@/components/GeneratorSchema";

export const metadata: Metadata = {
  title: "Número de Celular Aleatório: 67 DDDs (Formato ANATEL)",
  description: "Gerador de número de celular aleatório com formato ANATEL válido: 9 na frente + 67 DDDs brasileiros. Perfeito para mock de cadastro, teste de SMS e fixture de checkout. Grátis, sem cadastro.",
  keywords: "número de celular aleatório, numero de celular aleatorio, gerador de numero de celular, gerador celular aleatorio, celular aleatorio, gerar celular, numero celular fake, celular ficticio, gerador de celular anatel",
  alternates: { canonical: "/numero-de-celular-aleatorio" },
  openGraph: {
    title: "Número de Celular Aleatório - 67 DDDs ANATEL",
    description: "Gerador com formato válido ANATEL (9 + 8 dígitos, DDD por estado). Para mock de cadastro, SMS e checkout.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function NumeroCelularAleatorio() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Ferramenta para desenvolvedores</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Número de <span className="text-primary">Celular Aleatório</span>
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Gera número de celular aleatório no formato ANATEL: prefixo 9 + 8 dígitos, com DDD válido
          de qualquer um dos 67 códigos brasileiros. Passa em validador de máscara e regex de front-end.
          Ideal para mock de cadastro, SMS OTP, checkout e fixture de teste.
        </p>
      </div>

      <SingleGenerator
        type="phone"
        label="Celular Aleatório"
        description="Formato: (DDD) 9XXXX-XXXX. DDDs válidos ANATEL."
      />

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Número de Celular Aleatório", url: "/numero-de-celular-aleatorio" },
      ]} />

      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Formato ANATEL: 9 na frente e DDD válido</h2>
          <p>
            Desde 2014 a ANATEL exige o dígito 9 antes dos 8 dígitos no celular brasileiro (Resolução 553/2010).
            Cada número tem 11 dígitos totais: 2 do DDD + 9 do assinante. Um celular sem o 9 na frente
            <strong className="text-foreground"> falha na validação</strong> de qualquer sistema que segue padrão ANATEL,
            desde fintechs até apps de e-commerce.
          </p>
          <p className="mt-2">
            Nossa geração respeita todos os 67 DDDs válidos por estado. Isso importa se sua aplicação faz
            <strong className="text-foreground"> cross-check DDD × UF</strong> (comum em antifraude), porque
            um DDD inexistente cai como suspeito.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Cobertura de DDDs</h2>
          <p>Distribuímos aleatoriamente entre os 67 DDDs oficiais:</p>
          <ul className="list-disc list-inside space-y-1 pl-2 mt-3">
            <li><strong className="text-foreground">SP:</strong> 11, 12, 13, 14, 15, 16, 17, 18, 19</li>
            <li><strong className="text-foreground">RJ:</strong> 21, 22, 24</li>
            <li><strong className="text-foreground">MG:</strong> 31, 32, 33, 34, 35, 37, 38</li>
            <li><strong className="text-foreground">Sul:</strong> 41-49 (PR, SC), 51-55 (RS)</li>
            <li><strong className="text-foreground">Nordeste:</strong> 71-89</li>
            <li><strong className="text-foreground">Norte + CO:</strong> 61-69, 91-99</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Uso via API REST</h2>
          <pre className="bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`# 100 celulares aleatórios em JSON
curl "https://fakeforge.com.br/api/generate?type=phone&quantity=100"

# CSV pra importar no banco de staging
curl "https://fakeforge.com.br/api/generate?type=phone&quantity=1000&format=csv" \\
  -o fixtures/celulares.csv

# Pessoa completa com celular + CPF + endereço correlacionados
curl "https://fakeforge.com.br/api/generate?preset=customer&quantity=50"`}</code></pre>
          <p className="mt-3">50 chamadas grátis/dia. <Link href="/pricing?plan=dev&ref=celular_aleatorio" className="text-primary hover:underline">Plano Dev (R$29/mês)</Link> libera 10.000/dia.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Perguntas Frequentes</h2>
          <div className="space-y-3">
            {[
              { q: "Os celulares gerados podem receber SMS?", a: "Não. São números que passam validação de formato mas não estão vinculados a nenhum chip. Se sua aplicação tenta enviar SMS pra eles, o SMS não chega. É o comportamento correto pra ambiente de teste." },
              { q: "Formato ANATEL exige o 9 na frente?", a: "Sim, desde 2014 (Resolução 553/2010). Celulares brasileiros têm 11 dígitos: DDD (2) + 9 + assinante (8). Nossa geração sempre inclui o 9. Fixos residenciais são diferentes — usam type=landline (10 dígitos, sem 9)." },
              { q: "O DDD do número gerado é válido?", a: "Sim. Distribuímos entre os 67 DDDs oficiais da ANATEL. Nunca gera DDDs inexistentes como 27, 28 ou 30 (que caem em faixa reservada)." },
              { q: "Posso escolher um DDD específico?", a: "Pela API pública não. Se precisa forçar DDD, use o schema builder (dashboard após criar conta grátis) com o campo phone.ddd fixo. Ou use o preset customer que casa DDD com estado do endereço." },
              { q: "Qual a diferença entre celular aleatório e telefone fake?", a: "Celular aleatório = número que passa validação ANATEL (formato correto). Telefone fake, em jargão dev, significa a mesma coisa: número que não pertence a chip real, usado pra teste. Os dois termos se sobrepõem." },
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
            <Link href="/telefone-aleatorio" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">Telefone aleatório</Link>
            <Link href="/gerador-telefone-fixo" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">Fixo residencial</Link>
            <Link href="/gerador-de-numero-fake" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">Número fake</Link>
            <Link href="/gerador-pessoa" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">Pessoa completa</Link>
          </div>
        </section>
      </div>

      <GeneratorSchema
        name="Número de Celular Aleatório"
        url="https://fakeforge.com.br/numero-de-celular-aleatorio"
        description="Gerador de número de celular aleatório no formato ANATEL válido (9 + 8 dígitos, 67 DDDs brasileiros). Perfeito para mock de cadastro, teste de SMS e fixture de checkout."
        features={[
          "Formato ANATEL correto (11 dígitos com 9 na frente)",
          "Cobertura dos 67 DDDs oficiais",
          "Distribuição por estado e região",
          "API REST com 50 chamadas grátis/dia",
          "Preset customer com celular + CPF + endereço correlacionados",
          "Passa em validador de máscara e regex de front-end",
        ]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Os celulares gerados podem receber SMS?", acceptedAnswer: { "@type": "Answer", text: "Não. São números que passam validação de formato mas não estão vinculados a nenhum chip. Se sua aplicação tenta enviar SMS pra eles, o SMS não chega." } },
              { "@type": "Question", name: "Formato ANATEL exige o 9 na frente?", acceptedAnswer: { "@type": "Answer", text: "Sim, desde 2014. Celulares brasileiros têm 11 dígitos: DDD (2) + 9 + assinante (8). Fixos residenciais usam type=landline (10 dígitos, sem 9)." } },
              { "@type": "Question", name: "O DDD do número gerado é válido?", acceptedAnswer: { "@type": "Answer", text: "Sim. Distribuímos entre os 67 DDDs oficiais da ANATEL. Nunca gera DDDs inexistentes." } },
              { "@type": "Question", name: "Posso escolher um DDD específico?", acceptedAnswer: { "@type": "Answer", text: "Pela API pública não. Use o schema builder no dashboard com phone.ddd fixo, ou o preset customer que casa DDD com estado." } },
              { "@type": "Question", name: "Qual a diferença entre celular aleatório e telefone fake?", acceptedAnswer: { "@type": "Answer", text: "São a mesma coisa em contexto dev: número que passa validação ANATEL mas não pertence a chip real." } },
            ],
          }),
        }}
      />
    </PageShell>
  );
}
