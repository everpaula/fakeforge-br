import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BuscarCepClient from "./BuscarCepClient";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Buscar CEP por Endereço ou Número: Consulta Grátis via ViaCEP",
  description: "Consulte CEP brasileiro em tempo real: digite os 8 dígitos e veja logradouro, bairro, cidade, UF, DDD e código IBGE. Base oficial dos Correios via ViaCEP. Gratuito.",
  keywords: "buscar cep, cep busca, busca por cep, busca cep, consultar cep, consulta cep, cep brasil, cep brasileiro, cepbrasil, viacep, buscar endereco pelo cep, descobrir cep, qual o cep, cep correios",
  openGraph: {
    title: "Buscar CEP por Número: Consulta Grátis via ViaCEP",
    description: "Consulte CEP brasileiro em tempo real. Logradouro, bairro, cidade, UF, DDD e código IBGE.",
    type: "website",
    images: ["/api/og?title=Buscar+CEP&subtitle=Consulta+gr%C3%A1tis+via+ViaCEP+oficial+dos+Correios&category=GENERATOR"],
  },
  alternates: { canonical: "/buscar-cep" },
};

export default function BuscarCEP() {
  return (
    <PageShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="text-primary">Buscar CEP</span> por Número
        </h1>
        <p className="text-muted mt-3 text-sm leading-relaxed max-w-2xl">
          Consulta de CEP brasileiro em tempo real, direto da base oficial dos Correios via API ViaCEP.
          Digita os 8 dígitos e mostramos logradouro, bairro, cidade, UF, DDD e os códigos IBGE/SIAFI.
          Sem cadastro, sem captcha.
        </p>
      </div>

      <BuscarCepClient />

      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Perguntas Frequentes</h2>
          <div className="space-y-3">
            {[
              { q: "Posso usar essa busca sem limite?", a: "Sim, a ViaCEP é pública e gratuita. Para volume alto (>1 chamada/segundo por IP), considere cachear localmente — a base muda raramente." },
              { q: "Por que alguns CEPs não trazem logradouro?", a: "CEPs gerais cobrem um bairro inteiro ou uma cidade pequena, não um logradouro específico. Nesses casos, vêm só bairro, cidade e UF." },
              { q: "Posso descobrir o CEP a partir do endereço?", a: "A ViaCEP suporta busca reversa (UF + cidade + parte do logradouro), mas essa rota aqui só faz busca direta por CEP. Pra reversa, consulte busca avançada no site da ViaCEP ou Correios." },
              { q: "Meus dados ficam armazenados?", a: "Não. A consulta vai direto do seu navegador pra ViaCEP, sem passar pelos nossos servidores." },
              { q: "O que é o código IBGE retornado?", a: "É o código numérico que o IBGE atribui a cada município brasileiro. Útil pra integrar com bases de cadastro nacionais, estatísticas, ou serviços do gov.br." },
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
          <h2 className="text-lg font-semibold text-foreground mb-2">O que é CEP e como funciona</h2>
          <p>
            CEP (Código de Endereçamento Postal) é o sistema dos Correios para identificar endereços no
            Brasil. São 8 dígitos no formato <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">XXXXX-XXX</code>,
            divididos em região (1º dígito), sub-região (2º), setor (3º), subsetor (4º), divisor (5º) e
            distribuidor (últimos 3, separados por hífen). Cada faixa cobre uma área geográfica delimitada —
            um logradouro, um trecho dele, um bairro inteiro, ou um destinatário específico (caixa postal,
            grandes empresas, órgãos públicos).
          </p>
        </section>

        <hr className="border-border" />

        <details className="group">
          <summary className="cursor-pointer text-sm font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-2">
            <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
            Para desenvolvedores: integrar busca de CEP em código
          </summary>
          <div className="mt-4 space-y-3">
            <p>
              A ViaCEP tem endpoint REST aberto. Para integrar busca de CEP no seu app:
            </p>
            <pre className="bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto">
              <code>{`# cURL
curl https://viacep.com.br/ws/01310100/json/

# JavaScript
const res = await fetch("https://viacep.com.br/ws/01310100/json/");
const endereco = await res.json();
// { cep, logradouro, bairro, localidade, uf, ddd, ibge, ... }

# Erro de CEP inexistente vem como { erro: true }
if (endereco.erro) console.log("CEP nao encontrado");`}</code>
            </pre>
          </div>
        </details>

        <details className="group">
          <summary className="cursor-pointer text-sm font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-2">
            <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
            Precisa de CEP fictício para testes? Use o gerador
          </summary>
          <div className="mt-4">
            <p>
              Esta página busca CEPs reais. Se você precisa de <strong className="text-foreground">CEPs fictícios</strong> para
              popular banco de staging, fixtures de teste, ou mockar formulários sem expor endereços reais, use o{" "}
              <Link href="/gerador-cep" className="text-primary hover:underline font-medium">
                gerador de CEP
              </Link>
              . Ele produz códigos no formato sintaticamente correto por estado, sem corresponder a endereços reais —
              útil pra QA sem violar LGPD.
            </p>
          </div>
        </details>
      </div>

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Buscar CEP", url: "/buscar-cep" },
      ]} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Buscar CEP Brasileiro",
            url: "https://fakeforge.com.br/buscar-cep",
            description: "Consulta de CEP brasileiro em tempo real via ViaCEP. Logradouro, bairro, cidade, UF, DDD, IBGE.",
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
            inLanguage: "pt-BR",
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Posso usar essa busca sem limite?", acceptedAnswer: { "@type": "Answer", text: "Sim, a ViaCEP é pública e gratuita. Para volume alto considere cachear localmente." } },
              { "@type": "Question", name: "Por que alguns CEPs não trazem logradouro?", acceptedAnswer: { "@type": "Answer", text: "CEPs gerais cobrem um bairro inteiro ou cidade pequena, não logradouro específico." } },
              { "@type": "Question", name: "O que é o código IBGE retornado?", acceptedAnswer: { "@type": "Answer", text: "É o código numérico que o IBGE atribui a cada município brasileiro." } },
            ],
          }),
        }}
      />
    </PageShell>
  );
}
