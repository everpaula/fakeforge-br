import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import BlogFeaturedImage from "@/components/BlogFeaturedImage";
import ShareBar from "@/components/ShareBar";
import BlogPostingSchema from "@/components/BlogPostingSchema";

export const metadata: Metadata = {
  title: "Como testar pagamento PIX em ambiente de desenvolvimento",
  description: "Guia completo para testar PIX em dev: diferença entre dados fictícios e sandbox de gateway, como gerar chaves PIX de teste, e integração com Mercado Pago, OpenPix e Pagar.me.",
  keywords: "testar pix desenvolvimento, pix sandbox, simular pix teste, chave pix teste, pix homologação, mock pix",
  openGraph: {
    title: "Como testar pagamento PIX em ambiente de desenvolvimento",
    description: "Guia para testar PIX em dev: dados fictícios vs sandbox de gateway.",
    type: "article",
    images: ["/api/og?title=Como%20testar%20pagamento%20PIX%20em%20ambiente%20de%20desenvolvimento&subtitle=Guia%20para%20testar%20PIX%20em%20dev%3A%20dados%20fict%C3%ADcios%20vs%20sandbox%20de%20gateway.&category=TUTORIAIS"],
  },
};

export default function Post() {
  return (
    <PageShell>
      <article className="max-w-2xl">
        <Link href="/blog" className="text-xs text-primary hover:underline mb-4 inline-block">
          ← Voltar ao blog
        </Link>
        <BlogFeaturedImage category="Tutoriais" title="Testar pagamento PIX em desenvolvimento" className="mb-6" />
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
            Como testar pagamento PIX em ambiente de desenvolvimento
          </h1>
          <div className="flex items-center gap-3 text-xs text-muted mt-3">
            <time>10 de abril de 2026</time>
            <span>·</span>
            <span>6 min de leitura</span>
          </div>
        </div>

        <div className="prose-custom space-y-6 text-sm text-muted-foreground leading-relaxed">
          <p>
            O PIX se tornou o principal meio de pagamento no Brasil. Se você está integrando PIX
            no seu app — seja com Mercado Pago, PagSeguro, OpenPix, Pagar.me ou outro PSP — precisa
            testar o fluxo completo. Mas testar pagamentos sem gastar dinheiro real e sem usar dados
            reais exige entender a diferença entre duas camadas: dados de teste e sandbox de gateway.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Duas camadas de teste</h2>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">1. Dados de teste (formulário e validação)</h3>
          <p>
            Antes de chegar ao gateway, seu formulário precisa aceitar e validar os dados do pagador:
            CPF, chave PIX, dados bancários. Para isso, você precisa de dados fictícios que passem
            na validação do seu frontend e backend — mas que não pertençam a ninguém real.
          </p>
          <p>
            É aqui que entra o FakeForge. Gere chaves PIX nos 4 formatos do BACEN (CPF, email,
            telefone, EVP), CPFs válidos, e dados bancários com códigos de banco reais.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">2. Sandbox do gateway (transação real simulada)</h3>
          <p>
            Para testar a transação em si — gerar QR Code, receber webhook de confirmação, atualizar
            status do pedido — você precisa do ambiente de sandbox do seu PSP. Cada gateway tem suas
            próprias regras e dados de teste específicos.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Sandbox por gateway</h2>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Mercado Pago</h3>
          <p>
            O Mercado Pago tem um ambiente de sandbox com credenciais de teste (Access Token de teste).
            Use a API de pagamentos com as credenciais de sandbox para criar cobranças PIX simuladas.
            O QR Code gerado pode ser &ldquo;pago&rdquo; usando o app de testes do Mercado Pago.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">OpenPix</h3>
          <p>
            A OpenPix oferece uma conta bancária de teste que permite criar cobranças PIX sem custos.
            É possível simular o pagamento e receber o webhook de confirmação em tempo real.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Pagar.me</h3>
          <p>
            O Pagar.me disponibiliza chaves transacionais de teste e um simulador de PIX no dashboard.
            Você cria a cobrança via API e simula o pagamento pelo painel.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Gerando dados de teste para PIX</h2>
          <p>
            Para a camada de dados (formulários, validação, seed de banco), gere chaves PIX fictícias:
          </p>
        </div>

        <div className="mt-6 mb-8">
          <SingleGenerator
            type="pixKey"
            label="Chave PIX"
            description="Chaves nos 4 formatos BACEN"
          />
        </div>

        <div className="prose-custom space-y-6 text-sm text-muted-foreground leading-relaxed">
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Via API para automação</h2>
          <div className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4">
            <div className="text-muted"># Gerar 20 chaves PIX para seed</div>
            <div>
              <span className="text-success">curl</span>
              <span className="text-foreground"> &quot;https://fakeforge.com.br/api/generate?type=pixKey&amp;quantity=20&quot;</span>
            </div>
            <div className="mt-2 text-muted"># Gerar pedido completo com dados de pagamento</div>
            <div>
              <span className="text-success">curl</span>
              <span className="text-foreground"> -X POST &quot;https://fakeforge.com.br/api/generate&quot; \</span>
            </div>
            <div>
              <span className="text-foreground">  -H &quot;Content-Type: application/json&quot; \</span>
            </div>
            <div>
              <span className="text-foreground">  -d &apos;{`{"preset":"ecommerce_order","quantity":10}`}&apos;</span>
            </div>
          </div>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Checklist de teste PIX</h2>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>Validação de CPF no formulário — use <Link href="/gerador-cpf" className="text-primary hover:underline">CPFs fictícios</Link></li>
            <li>Validação de chave PIX (formato) — use <Link href="/gerador-pix" className="text-primary hover:underline">chaves PIX fictícias</Link></li>
            <li>Geração de QR Code — use sandbox do gateway</li>
            <li>Webhook de confirmação — use sandbox do gateway</li>
            <li>Atualização de status do pedido — teste end-to-end no sandbox</li>
            <li>Seed do banco de staging — use a <Link href="/docs" className="text-primary hover:underline">API</Link> com preset ecommerce_order</li>
          </ul>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Resumo</h2>
          <p>
            Testar PIX exige duas camadas: dados fictícios para formulários e validação (FakeForge),
            e sandbox do gateway para transações simuladas (Mercado Pago, OpenPix, Pagar.me).
            Não misture — cada camada tem seu propósito. E nunca use dados reais em desenvolvimento.
          </p>
        </div>
        <ShareBar title={"Como testar pagamento PIX em ambiente de desenvolvimento"} path="/blog/testar-pix-desenvolvimento" />
        <BlogPostingSchema
          title={"Como testar pagamento PIX em ambiente de desenvolvimento"}
          slug="testar-pix-desenvolvimento"
          description={"Guia completo para testar PIX em dev: diferença entre dados fictícios e sandbox de gateway, como gerar chaves PIX de teste, e integração com Mercado Pago, OpenPix e Pagar.me."}
          datePublished="2026-04-15"
          image="https://fakeforge.com.br/api/og?title=Como%20testar%20pagamento%20PIX%20em%20ambiente%20de%20desenvolvimento&subtitle=Guia%20para%20testar%20PIX%20em%20dev%3A%20dados%20fict%C3%ADcios%20vs%20sandbox%20de%20gateway.&category=TUTORIAIS"
        />
      </article>
    </PageShell>
  );
}
