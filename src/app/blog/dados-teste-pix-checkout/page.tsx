import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import BlogFeaturedImage from "@/components/BlogFeaturedImage";
import ShareBar from "@/components/ShareBar";
import BlogPostingSchema from "@/components/BlogPostingSchema";

export const metadata: Metadata = {
  title: "Dados de teste para PIX e checkout: como testar pagamentos sem dados reais",
  description: "Como gerar dados fictícios (PIX, cartão, CPF) para testar fluxos de pagamento e checkout em ambiente de desenvolvimento. Guia prático com exemplos.",
  keywords: "dados teste pix, testar pix desenvolvimento, chave pix teste, cartão teste checkout, dados pagamento staging, mock pagamento",
  openGraph: {
    title: "Dados de teste para PIX e checkout",
    description: "Como gerar dados fictícios para testar fluxos de pagamento sem usar dados reais.",
    type: "article",
    images: ["/api/og?title=Dados%20de%20teste%20para%20PIX%20e%20checkout&subtitle=Como%20gerar%20dados%20fict%C3%ADcios%20para%20testar%20fluxos%20de%20pagamento%20sem%20usar%20dados%20reais.&category=TUTORIAIS"],
  },
};

export default function Post() {
  return (
    <PageShell>
      <article className="max-w-2xl">
        <Link href="/blog" className="text-xs text-primary hover:underline mb-4 inline-block">
          ← Voltar ao blog
        </Link>
        <BlogFeaturedImage
          category="Tutoriais"
          title="Dados de teste para PIX e checkout"
          className="mb-6"
        />
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
            Dados de teste para PIX e checkout: como testar pagamentos sem dados reais
          </h1>
          <div className="flex items-center gap-3 text-xs text-muted mt-3">
            <time>10 de abril de 2026</time>
            <span>·</span>
            <span>6 min de leitura</span>
          </div>
        </div>

        <div className="prose-custom space-y-6 text-sm text-muted-foreground leading-relaxed">
          <p>
            Testar fluxos de pagamento é uma das partes mais críticas do desenvolvimento de e-commerce
            e aplicativos financeiros. Você precisa de CPFs, chaves PIX, números de cartão e dados
            bancários — mas usar dados reais em ambiente de teste é um risco que nenhum dev deveria correr.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">O cenário típico</h2>
          <p>
            Você está integrando o Mercado Pago, PagSeguro ou Stripe no seu app. O checkout exige:
            CPF do comprador, chave PIX para recebimento, ou número de cartão de crédito com CVV e validade.
            Em sandbox, os gateways aceitam dados de teste específicos — mas e quando você precisa testar
            a validação do seu próprio formulário antes de chegar ao gateway?
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Dados fictícios para cada etapa</h2>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">CPF do comprador</h3>
          <p>
            Todo checkout brasileiro pede CPF. Você precisa de um CPF que passe na validação mod-11
            do seu formulário. CPFs gerados algoritmicamente fazem exatamente isso.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Chave PIX</h3>
          <p>
            Para testar o fluxo de pagamento via PIX, você precisa de chaves nos quatro formatos
            aceitos pelo BACEN: CPF, email, telefone e chave aleatória (EVP/UUID). O FakeForge gera
            todos os quatro tipos.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Cartão de crédito</h3>
          <p>
            Números de cartão com validação Luhn passam na verificação de formato do seu formulário.
            Para testes com o gateway em si, use os cartões de teste fornecidos pelo próprio gateway
            (Mercado Pago, Stripe, etc. têm números específicos para sandbox).
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Gere dados de pagamento agora</h2>
          <p>Chaves PIX fictícias:</p>
        </div>

        <div className="mt-6 mb-4">
          <SingleGenerator
            type="pixKey"
            label="Chave PIX"
            description="Chaves PIX fictícias (CPF, email, telefone, EVP)"
          />
        </div>

        <div className="prose-custom space-y-2 text-sm text-muted-foreground leading-relaxed">
          <p>Cartões de crédito fictícios:</p>
        </div>

        <div className="mt-4 mb-8">
          <SingleGenerator
            type="creditCard"
            label="Cartão de Crédito"
            description="Visa, Mastercard e Elo com Luhn válido"
          />
        </div>

        <div className="prose-custom space-y-6 text-sm text-muted-foreground leading-relaxed">
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Automatizando via API</h2>
          <p>
            Para popular seu ambiente de staging com dados de pagamento completos, use o preset de e-commerce:
          </p>
          <div className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4">
            <div className="text-muted"># Gerar 50 pedidos com dados completos de pagamento</div>
            <div>
              <span className="text-success">curl</span>
              <span className="text-foreground"> -X POST &quot;https://fakeforge.com.br/api/generate&quot; \</span>
            </div>
            <div>
              <span className="text-foreground">  -H &quot;Content-Type: application/json&quot; \</span>
            </div>
            <div>
              <span className="text-foreground">  -d &apos;{`{"preset":"ecommerce_order","quantity":50}`}&apos;</span>
            </div>
          </div>
          <p>
            O preset <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">ecommerce_order</code> gera
            um objeto completo com nome do cliente, CPF, email, telefone, endereço de entrega e dados
            de cartão — tudo correlacionado (o email usa o nome da pessoa, o cartão tem o nome do titular).
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Boas práticas</h2>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>Use dados fictícios para validação de formulário, dados do gateway para teste de transação</li>
            <li>Nunca misture dados reais com dados de teste no mesmo ambiente</li>
            <li>Documente quais dados de teste o gateway aceita (cada um tem os seus)</li>
            <li>Automatize a geração de dados no seed do ambiente de staging</li>
            <li>Veja o <Link href="/gerador-pix" className="text-primary hover:underline">gerador de PIX</Link> e o <Link href="/gerador-cartao" className="text-primary hover:underline">gerador de cartão</Link> para uso manual</li>
          </ul>
        </div>
        <ShareBar title={"Dados de teste para PIX e checkout: como testar pagamentos sem dados reais"} path="/blog/dados-teste-pix-checkout" />
        <BlogPostingSchema
          title={"Dados de teste para PIX e checkout: como testar pagamentos sem dados reais"}
          slug="dados-teste-pix-checkout"
          description={"Como gerar dados fictícios (PIX, cartão, CPF) para testar fluxos de pagamento e checkout em ambiente de desenvolvimento. Guia prático com exemplos."}
          datePublished="2026-04-15"
          image="https://fakeforge.com.br/api/og?title=Dados%20de%20teste%20para%20PIX%20e%20checkout&subtitle=Como%20gerar%20dados%20fict%C3%ADcios%20para%20testar%20fluxos%20de%20pagamento%20sem%20usar%20dados%20reais.&category=TUTORIAIS"
        />
      </article>
    </PageShell>
  );
}
