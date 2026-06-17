import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import BlogFeaturedImage from "@/components/BlogFeaturedImage";
import ShareBar from "@/components/ShareBar";

export const metadata: Metadata = {
  title: "Como funciona o algoritmo de Luhn: validação de cartão de crédito explicada",
  description: "Entenda o algoritmo de Luhn (mod-10) usado para validar números de cartão de crédito. Implementação em JavaScript, como funciona passo a passo, e como gerar números válidos para testes.",
  keywords: "algoritmo luhn, validação cartão crédito, mod-10, luhn javascript, como validar cartão, número cartão válido teste, check digit",
  openGraph: {
    title: "Como funciona o algoritmo de Luhn: validação de cartão de crédito",
    description: "Entenda o algoritmo de Luhn (mod-10) e como validar números de cartão de crédito.",
    type: "article",
    images: ["/api/og?title=Como%20funciona%20o%20algoritmo%20de%20Luhn%3A%20valida%C3%A7%C3%A3o%20de%20cart%C3%A3o%20de%20cr%C3%A9dito&subtitle=Entenda%20o%20algoritmo%20de%20Luhn%20(mod-10)%20e%20como%20validar%20n%C3%BAmeros%20de%20cart%C3%A3o%20de%20cr%C3%A9dito.&category=CONCEITOS"],
  },
};

export default function Post() {
  return (
    <PageShell>
      <article className="max-w-2xl">
        <Link href="/blog" className="text-xs text-primary hover:underline mb-4 inline-block">
          ← Voltar ao blog
        </Link>
        <BlogFeaturedImage category="Conceitos" title="Algoritmo de Luhn: validação de cartão de crédito" className="mb-6" />
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
            Como funciona o algoritmo de Luhn: validação de cartão de crédito explicada
          </h1>
          <div className="flex items-center gap-3 text-xs text-muted mt-3">
            <time>10 de abril de 2026</time>
            <span>·</span>
            <span>6 min de leitura</span>
          </div>
        </div>

        <div className="prose-custom space-y-6 text-sm text-muted-foreground leading-relaxed">
          <p>
            Todo número de cartão de crédito — Visa, Mastercard, Elo, American Express — é validado
            por um algoritmo inventado em 1954 por Hans Peter Luhn, cientista da IBM. O algoritmo de
            Luhn (também chamado de mod-10) é um checksum simples que detecta erros de digitação.
            É usado por gateways de pagamento, formulários de checkout e geradores de cartão de teste.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">O algoritmo passo a passo</h2>
          <p>
            Dado um número de cartão (ex: 4532015112830366):
          </p>
          <ol className="list-decimal list-inside space-y-2 pl-2">
            <li>Comece pelo último dígito e vá da direita para a esquerda</li>
            <li>Dobre cada segundo dígito (posições ímpares contando da direita)</li>
            <li>Se o resultado da dobra for maior que 9, subtraia 9</li>
            <li>Some todos os dígitos</li>
            <li>Se o total for divisível por 10, o número é válido</li>
          </ol>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Exemplo visual</h2>
          <div className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto">
            <div>Número:  4  5  3  2  0  1  5  1  1  2  8  3  0  3  6  6</div>
            <div>Dobrar:  8  5  6  2  0  1  1  1  2  2  7  3  0  3  3  6</div>
            <div className="text-muted">         ↑     ↑     ↑     ↑     ↑     ↑     ↑     ↑</div>
            <div className="mt-2">Soma: 8+5+6+2+0+1+1+1+2+2+7+3+0+3+3+6 = <span className="text-success">50</span></div>
            <div>50 % 10 = <span className="text-success">0</span> → <span className="text-success">Válido!</span></div>
          </div>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Implementação em JavaScript</h2>
          <div className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto">
            <div><span className="text-primary">function</span> <span className="text-success">luhnCheck</span>(num: <span className="text-primary">string</span>): <span className="text-primary">boolean</span> {`{`}</div>
            <div>  <span className="text-primary">const</span> digits = num.replace(<span className="text-warning">/\\D/g</span>, <span className="text-warning">&apos;&apos;</span>);</div>
            <div>  <span className="text-primary">let</span> sum = <span className="text-warning">0</span>;</div>
            <div>  <span className="text-primary">let</span> alternate = <span className="text-primary">false</span>;</div>
            <div></div>
            <div>  <span className="text-primary">for</span> (<span className="text-primary">let</span> i = digits.length - <span className="text-warning">1</span>; i &gt;= <span className="text-warning">0</span>; i--) {`{`}</div>
            <div>    <span className="text-primary">let</span> n = parseInt(digits[i]);</div>
            <div>    <span className="text-primary">if</span> (alternate) {`{`}</div>
            <div>      n *= <span className="text-warning">2</span>;</div>
            <div>      <span className="text-primary">if</span> (n &gt; <span className="text-warning">9</span>) n -= <span className="text-warning">9</span>;</div>
            <div>    {`}`}</div>
            <div>    sum += n;</div>
            <div>    alternate = !alternate;</div>
            <div>  {`}`}</div>
            <div></div>
            <div>  <span className="text-primary">return</span> sum % <span className="text-warning">10</span> === <span className="text-warning">0</span>;</div>
            <div>{`}`}</div>
          </div>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Identificando a bandeira pelo prefixo</h2>
          <p>
            Além do checksum, o primeiro dígito (ou primeiros dígitos) identifica a bandeira:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li><strong>Visa:</strong> começa com 4 (16 dígitos)</li>
            <li><strong>Mastercard:</strong> começa com 5 (51-55) ou 2 (2221-2720)</li>
            <li><strong>Elo:</strong> prefixos específicos como 636368, 438935, 504175</li>
            <li><strong>American Express:</strong> começa com 34 ou 37 (15 dígitos)</li>
          </ul>
          <p>
            Um gerador de cartão de teste cria números com o prefixo correto da bandeira
            e calcula o último dígito para que passe no Luhn.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Gere cartões de teste</h2>
          <p>
            Use o gerador abaixo para criar números válidos (Luhn + prefixo correto):
          </p>
        </div>

        <div className="mt-6 mb-8">
          <SingleGenerator
            type="creditCard"
            label="Cartão de Crédito"
            description="Visa, Mastercard e Elo com Luhn válido"
          />
        </div>

        <div className="prose-custom space-y-6 text-sm text-muted-foreground leading-relaxed">
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Luhn não é segurança</h2>
          <p>
            É importante entender que o Luhn é apenas um checksum para detectar erros de digitação —
            não é criptografia e não garante que o cartão existe ou tem saldo. Gateways de pagamento
            fazem validações adicionais (BIN lookup, verificação com o emissor, 3D Secure) antes
            de autorizar uma transação.
          </p>
          <p>
            Por isso, cartões gerados passam na validação de formulário mas são recusados por qualquer
            gateway real. São úteis exclusivamente para testar a camada de validação do seu frontend.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Resumo</h2>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>O algoritmo de Luhn valida números de cartão com um checksum mod-10</li>
            <li>É simples de implementar (~15 linhas de código) e não requer libs externas</li>
            <li>O prefixo identifica a bandeira (4=Visa, 5=Mastercard, etc.)</li>
            <li>Cartões gerados passam no Luhn mas não funcionam para compras reais</li>
            <li>Use o <Link href="/gerador-cartao" className="text-primary hover:underline">gerador de cartão</Link> para testes de formulário</li>
            <li>Use a <Link href="/docs" className="text-primary hover:underline">API</Link> para gerar em massa no CI/CD</li>
          </ul>
        </div>
        <ShareBar title={"Como funciona o algoritmo de Luhn: validação de cartão de crédito explicada"} path="/blog/algoritmo-luhn-cartao-credito" />
      </article>
    </PageShell>
  );
}