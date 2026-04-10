import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";

export const metadata: Metadata = {
  title: "Validação de CNPJ em Node.js: implementação completa sem dependências",
  description: "Implemente validação de CNPJ em Node.js do zero com o algoritmo mod-11. Código pronto para copiar, explicação passo a passo, e como testar com CNPJs fictícios.",
  keywords: "validar cnpj nodejs, validação cnpj javascript, algoritmo cnpj, cnpj mod-11, validar cnpj typescript, cnpj node",
  openGraph: {
    title: "Validação de CNPJ em Node.js: implementação completa",
    description: "Implemente validação de CNPJ em Node.js do zero com o algoritmo mod-11.",
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
            Validação de CNPJ em Node.js: implementação completa sem dependências
          </h1>
          <div className="flex items-center gap-3 text-xs text-muted mt-3">
            <time>10 de abril de 2026</time>
            <span>·</span>
            <span>7 min de leitura</span>
          </div>
        </div>

        <div className="prose-custom space-y-6 text-sm text-muted-foreground leading-relaxed">
          <p>
            Se você está construindo um sistema que aceita CNPJ — cadastro de fornecedores, marketplace,
            emissão de NF-e — precisa validar o formato e os dígitos verificadores. Muitos devs instalam
            uma lib para isso, mas a validação é simples o suficiente para implementar em poucas linhas.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Estrutura do CNPJ</h2>
          <p>
            O CNPJ tem 14 dígitos no formato XX.XXX.XXX/XXXX-XX. Os 8 primeiros identificam a empresa,
            os 4 seguintes identificam a filial (0001 para matriz), e os 2 últimos são dígitos verificadores
            calculados pelo algoritmo módulo 11.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">O algoritmo</h2>
          <p>
            O cálculo é similar ao do CPF, mas com pesos diferentes:
          </p>
          <ol className="list-decimal list-inside space-y-2 pl-2">
            <li>Remova a formatação (pontos, barra, traço)</li>
            <li>Verifique se tem exatamente 14 dígitos e não é uma sequência repetida</li>
            <li>Para o primeiro dígito verificador: multiplique os 12 primeiros dígitos pelos pesos 5,4,3,2,9,8,7,6,5,4,3,2</li>
            <li>Some os resultados e calcule o resto da divisão por 11</li>
            <li>Se o resto for menor que 2, o dígito é 0; caso contrário, é 11 menos o resto</li>
            <li>Repita com os 13 dígitos e pesos 6,5,4,3,2,9,8,7,6,5,4,3,2 para o segundo dígito</li>
          </ol>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Implementação em TypeScript</h2>
          <div className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto">
            <div><span className="text-primary">function</span> <span className="text-success">validateCNPJ</span>(cnpj: <span className="text-primary">string</span>): <span className="text-primary">boolean</span> {`{`}</div>
            <div>  <span className="text-muted">// Remove formatação</span></div>
            <div>  <span className="text-primary">const</span> digits = cnpj.replace(<span className="text-warning">/\\D/g</span>, <span className="text-warning">&apos;&apos;</span>);</div>
            <div></div>
            <div>  <span className="text-muted">// Deve ter 14 dígitos</span></div>
            <div>  <span className="text-primary">if</span> (digits.length !== <span className="text-warning">14</span>) <span className="text-primary">return false</span>;</div>
            <div></div>
            <div>  <span className="text-muted">// Rejeita sequências repetidas</span></div>
            <div>  <span className="text-primary">if</span> (<span className="text-warning">/^(\\d)\\1+$/</span>.test(digits)) <span className="text-primary">return false</span>;</div>
            <div></div>
            <div>  <span className="text-muted">// Calcula dígitos verificadores</span></div>
            <div>  <span className="text-primary">const</span> weights1 = [<span className="text-warning">5,4,3,2,9,8,7,6,5,4,3,2</span>];</div>
            <div>  <span className="text-primary">const</span> weights2 = [<span className="text-warning">6,5,4,3,2,9,8,7,6,5,4,3,2</span>];</div>
            <div></div>
            <div>  <span className="text-primary">const</span> calcDigit = (slice: <span className="text-primary">string</span>, w: <span className="text-primary">number</span>[]) =&gt; {`{`}</div>
            <div>    <span className="text-primary">const</span> sum = slice.split(<span className="text-warning">&apos;&apos;</span>)</div>
            <div>      .reduce((acc, d, i) =&gt; acc + parseInt(d) * w[i], <span className="text-warning">0</span>);</div>
            <div>    <span className="text-primary">const</span> rest = sum % <span className="text-warning">11</span>;</div>
            <div>    <span className="text-primary">return</span> rest &lt; <span className="text-warning">2</span> ? <span className="text-warning">0</span> : <span className="text-warning">11</span> - rest;</div>
            <div>  {`}`};</div>
            <div></div>
            <div>  <span className="text-primary">const</span> d1 = calcDigit(digits.slice(<span className="text-warning">0</span>, <span className="text-warning">12</span>), weights1);</div>
            <div>  <span className="text-primary">const</span> d2 = calcDigit(digits.slice(<span className="text-warning">0</span>, <span className="text-warning">12</span>) + d1, weights2);</div>
            <div></div>
            <div>  <span className="text-primary">return</span> d1 === parseInt(digits[<span className="text-warning">12</span>])</div>
            <div>    &amp;&amp; d2 === parseInt(digits[<span className="text-warning">13</span>]);</div>
            <div>{`}`}</div>
          </div>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Testando a validação</h2>
          <p>
            Agora você precisa de CNPJs fictícios para testar. Se usar apenas CNPJs inválidos, você só
            testa o caminho de rejeição. Gere CNPJs válidos para testar o caminho de aceitação:
          </p>
        </div>

        <div className="mt-6 mb-8">
          <SingleGenerator
            type="cnpj"
            label="CNPJ"
            description="CNPJs fictícios com dígitos verificadores válidos"
          />
        </div>

        <div className="prose-custom space-y-6 text-sm text-muted-foreground leading-relaxed">
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Casos de teste recomendados</h2>
          <div className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto">
            <div><span className="text-muted">// Deve aceitar</span></div>
            <div>validateCNPJ(<span className="text-warning">&apos;11.222.333/0001-81&apos;</span>); <span className="text-muted">// formatado</span></div>
            <div>validateCNPJ(<span className="text-warning">&apos;11222333000181&apos;</span>);     <span className="text-muted">// sem formato</span></div>
            <div></div>
            <div><span className="text-muted">// Deve rejeitar</span></div>
            <div>validateCNPJ(<span className="text-warning">&apos;11.111.111/1111-11&apos;</span>); <span className="text-muted">// sequência repetida</span></div>
            <div>validateCNPJ(<span className="text-warning">&apos;12.345.678/0001-00&apos;</span>); <span className="text-muted">// dígitos errados</span></div>
            <div>validateCNPJ(<span className="text-warning">&apos;123&apos;</span>);                 <span className="text-muted">// tamanho errado</span></div>
            <div>validateCNPJ(<span className="text-warning">&apos;&apos;</span>);                    <span className="text-muted">// vazio</span></div>
          </div>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Via API para testes em massa</h2>
          <div className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4">
            <div className="text-muted"># Gerar 200 CNPJs para popular o banco de testes</div>
            <div>
              <span className="text-success">curl</span>
              <span className="text-foreground"> &quot;https://fakeforge.com.br/api/generate?type=cnpj&amp;quantity=200&amp;format=json&quot;</span>
            </div>
          </div>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Resumo</h2>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>Validação de CNPJ são ~20 linhas de código, sem necessidade de libs externas</li>
            <li>O algoritmo mod-11 com pesos específicos valida os 2 dígitos verificadores</li>
            <li>Teste com CNPJs válidos (gerados) e inválidos para cobrir ambos os caminhos</li>
            <li>Use o <Link href="/validar-cnpj" className="text-primary hover:underline">validador online</Link> para checar CNPJs rapidamente</li>
            <li>Use a <Link href="/docs" className="text-primary hover:underline">API</Link> para gerar CNPJs em massa no CI/CD</li>
          </ul>
        </div>
      </article>
    </PageShell>
  );
}
