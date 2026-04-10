import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";

export const metadata: Metadata = {
  title: "Como testar CPF em ambiente de staging sem usar dados reais",
  description: "Guia prático para testar validação de CPF em staging: por que evitar dados reais, como gerar CPFs fictícios, e como integrar geração automática no seu workflow.",
  keywords: "testar cpf staging, cpf ambiente de teste, cpf fictício staging, validar cpf desenvolvimento, cpf qa testes",
  openGraph: {
    title: "Como testar CPF em ambiente de staging sem usar dados reais",
    description: "Guia prático para testar validação de CPF em staging sem violar a LGPD.",
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
            Como testar CPF em ambiente de staging sem usar dados reais
          </h1>
          <div className="flex items-center gap-3 text-xs text-muted mt-3">
            <time>10 de abril de 2026</time>
            <span>·</span>
            <span>5 min de leitura</span>
          </div>
        </div>

        <div className="prose-custom space-y-6 text-sm text-muted-foreground leading-relaxed">
          <p>
            Você subiu o ambiente de staging, o formulário de cadastro está pronto, e agora precisa testar
            se a validação de CPF funciona. O caminho mais rápido parece ser digitar o seu próprio CPF —
            mas isso é exatamente o que você não deveria fazer.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">O problema com dados reais em staging</h2>
          <p>
            Ambientes de staging costumam ter menos controle de acesso que produção. Logs ficam expostos,
            dumps de banco circulam entre devs, e ferramentas de monitoramento capturam payloads completos.
            Colocar um CPF real nesse ambiente significa que ele pode acabar em qualquer um desses lugares.
          </p>
          <p>
            Além do risco técnico, a LGPD exige que dados pessoais tenham finalidade específica e base legal.
            &ldquo;Eu estava testando&rdquo; não é base legal. Se o ambiente de staging vazar e tiver CPFs reais,
            a empresa pode ser responsabilizada.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">A solução: CPFs algoritmicamente válidos</h2>
          <p>
            O CPF usa o algoritmo módulo 11 para os dígitos verificadores. Qualquer sequência de 9 dígitos
            pode ter seus 2 dígitos verificadores calculados corretamente. O resultado é um número que passa
            em qualquer validador, mas não pertence a nenhuma pessoa.
          </p>
          <p>
            Isso é diferente de digitar &ldquo;111.111.111-11&rdquo; — que muitos validadores rejeitam por ser uma
            sequência repetida. CPFs gerados corretamente são indistinguíveis de CPFs reais para o software.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Teste agora</h2>
          <p>
            Gere CPFs fictícios válidos para usar no seu staging:
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
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Automatizando com a API</h2>
          <p>
            Se o seu staging precisa de dados populados automaticamente (seed), use a API para gerar
            CPFs em massa:
          </p>
          <div className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4">
            <div className="text-muted"># Seed do banco com 500 CPFs</div>
            <div>
              <span className="text-success">curl</span>
              <span className="text-foreground"> &quot;https://fakeforge.com.br/api/generate?type=cpf&amp;quantity=500&amp;format=sql&quot;</span>
            </div>
          </div>
          <p>
            O output em formato SQL pode ser executado direto no banco de staging. Também suporta JSON e CSV
            para outros workflows.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Integrando no CI/CD</h2>
          <p>
            Para testes automatizados, gere dados frescos a cada pipeline run:
          </p>
          <div className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4">
            <div className="text-muted"># No seu script de testes</div>
            <div><span className="text-success">CPF</span>=<span className="text-foreground">$(curl -s &quot;https://fakeforge.com.br/api/generate?type=cpf&amp;quantity=1&quot; | jq -r &apos;.[0]&apos;)</span></div>
            <div><span className="text-success">echo</span> <span className="text-foreground">&quot;Testando com CPF: $CPF&quot;</span></div>
          </div>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Checklist para staging seguro</h2>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>Nunca use seu CPF real ou de colegas em staging</li>
            <li>Configure seeds com dados fictícios gerados algoritmicamente</li>
            <li>Adicione geração de dados no pipeline de CI/CD</li>
            <li>Documente para o time que staging deve usar apenas dados fictícios</li>
            <li>Use o <Link href="/gerador-cpf" className="text-primary hover:underline">gerador web</Link> para testes manuais rápidos</li>
            <li>Use a <Link href="/docs" className="text-primary hover:underline">API</Link> para automação</li>
          </ul>
        </div>
      </article>
    </PageShell>
  );
}
