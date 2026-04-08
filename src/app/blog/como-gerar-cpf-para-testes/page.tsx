import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";

export const metadata: Metadata = {
  title: "Como gerar CPF válido para testes sem violar a LGPD",
  description: "Aprenda por que usar CPFs reais em testes é ilegal, como funcionam os dígitos verificadores mod-11, e como gerar CPFs fictícios válidos para desenvolvimento.",
  keywords: "gerar cpf para testes, cpf válido para teste, cpf fictício, gerador de cpf, cpf desenvolvimento, lgpd cpf teste",
  openGraph: {
    title: "Como gerar CPF válido para testes sem violar a LGPD",
    description: "Guia completo sobre geração de CPFs fictícios para desenvolvimento e testes.",
    type: "article",
  },
};

export default function Post() {
  return (
    <PageShell>
      <article className="max-w-2xl">
        <div className="mb-8">
          <Link href="/blog" className="text-xs text-primary hover:underline mb-4 inline-block">
            ← Voltar ao blog
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
            Como gerar CPF válido para testes sem violar a LGPD
          </h1>
          <div className="flex items-center gap-3 text-xs text-muted mt-3">
            <time>08 de abril de 2026</time>
            <span>·</span>
            <span>5 min de leitura</span>
          </div>
        </div>

        <div className="prose-custom space-y-6 text-sm text-muted-foreground leading-relaxed">
          <p>
            Se você é desenvolvedor no Brasil, já precisou de um CPF para testar um formulário de cadastro,
            um gateway de pagamento ou um sistema de e-commerce. O problema é que usar um CPF real — seja
            o seu ou de qualquer outra pessoa — em ambiente de teste é uma violação da LGPD.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Por que não usar CPFs reais?</h2>
          <p>
            A Lei Geral de Proteção de Dados (Lei 13.709/2018) classifica o CPF como dado pessoal.
            Isso significa que qualquer uso de um CPF real precisa ter base legal, consentimento e finalidade
            específica. Ambiente de teste não é nenhuma dessas coisas.
          </p>
          <p>
            Além do risco legal, usar CPFs reais em bancos de dados de desenvolvimento cria problemas práticos:
            dumps de banco vazam, ambientes de staging são compartilhados entre equipes, e dados de teste
            frequentemente acabam em logs e dashboards de monitoramento.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Como funciona a validação do CPF?</h2>
          <p>
            O CPF tem 11 dígitos. Os 9 primeiros identificam o contribuinte e os 2 últimos são dígitos
            verificadores calculados pelo algoritmo módulo 11:
          </p>
          <ol className="list-decimal list-inside space-y-2 pl-2">
            <li>Multiplique cada um dos 9 primeiros dígitos por pesos de 10 a 2</li>
            <li>Some os resultados</li>
            <li>Calcule o resto da divisão por 11</li>
            <li>Se o resto for menor que 2, o dígito verificador é 0. Caso contrário, é 11 menos o resto</li>
            <li>Repita o processo incluindo o primeiro dígito verificador, com pesos de 11 a 2</li>
          </ol>
          <p>
            Um gerador de CPF válido faz exatamente esse cálculo: cria 9 dígitos aleatórios e depois calcula
            os 2 dígitos verificadores corretamente. O resultado passa em qualquer validador, mas não pertence
            a ninguém.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Gere CPFs agora</h2>
          <p>
            Use o gerador abaixo para criar CPFs fictícios com dígitos verificadores válidos:
          </p>
        </div>

        <div className="mt-6 mb-8">
          <SingleGenerator
            type="cpf"
            label="CPF"
            description="CPFs fictícios com validação mod-11"
          />
        </div>

        <div className="prose-custom space-y-6 text-sm text-muted-foreground leading-relaxed">
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Usando via API</h2>
          <p>
            Se você precisa de CPFs em massa para popular um banco de dados de teste ou rodar em um pipeline
            de CI/CD, use a API:
          </p>
          <div className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4">
            <div className="text-muted"># Gerar 100 CPFs via API</div>
            <div>
              <span className="text-success">curl</span>
              <span className="text-foreground"> &quot;https://fakeforge.com.br/api/generate?type=cpf&amp;quantity=100&quot;</span>
            </div>
          </div>
          <p>
            A API é gratuita para até 100 requests por dia. Para volumes maiores,
            veja os <Link href="/pricing" className="text-primary hover:underline">planos pagos</Link>.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Resumo</h2>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>Nunca use CPFs reais em testes — é violação da LGPD</li>
            <li>CPFs gerados passam na validação mod-11 sem pertencer a ninguém</li>
            <li>Use o <Link href="/gerador-cpf" className="text-primary hover:underline">gerador web</Link> para uso manual</li>
            <li>Use a <Link href="/docs" className="text-primary hover:underline">API</Link> para automação</li>
          </ul>
        </div>
      </article>
    </PageShell>
  );
}
