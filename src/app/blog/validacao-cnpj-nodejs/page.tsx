import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import BlogFeaturedImage from "@/components/BlogFeaturedImage";
import AffiliateBanner from "@/components/AffiliateBanner";
import ShareBar from "@/components/ShareBar";
import BlogPostingSchema from "@/components/BlogPostingSchema";

export const metadata: Metadata = {
  title: "Validação de CNPJ em Node.js: implementação completa sem dependências",
  description: "Implemente validação de CNPJ em Node.js do zero com o algoritmo mod-11. Código pronto para copiar, explicação passo a passo, e como testar com CNPJs fictícios.",
  keywords: "validar cnpj nodejs, validação cnpj javascript, algoritmo cnpj, cnpj mod-11, validar cnpj typescript, cnpj node",
  openGraph: {
    title: "Validação de CNPJ em Node.js: implementação completa",
    description: "Implemente validação de CNPJ em Node.js do zero com o algoritmo mod-11.",
    type: "article",
    images: ["/api/og?title=Valida%C3%A7%C3%A3o%20de%20CNPJ%20em%20Node.js%3A%20implementa%C3%A7%C3%A3o%20completa&subtitle=Implemente%20valida%C3%A7%C3%A3o%20de%20CNPJ%20em%20Node.js%20do%20zero%20com%20o%20algoritmo%20mod-11.&category=TUTORIAIS"],
  },
};

export default function Post() {
  return (
    <PageShell>
      <article className="max-w-2xl">
        <Link href="/blog" className="text-xs text-primary hover:underline mb-4 inline-block">
          ← Voltar ao blog
        </Link>
        <BlogFeaturedImage category="Tutoriais" title="Validação de CNPJ em Node.js sem dependências" className="mb-6" />
        <div className="mb-8">
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
            Se você está construindo um sistema que aceita CNPJ (cadastro de fornecedores, marketplace,
            emissão de NF-e), precisa validar o formato e os dígitos verificadores. Muitos devs instalam
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
            <div>  <span className="text-primary">const</span> digits = cnpj.replace(<span className="text-warning">{"/\\D/g"}</span>, <span className="text-warning">&apos;&apos;</span>);</div>
            <div></div>
            <div>  <span className="text-muted">// Deve ter 14 dígitos</span></div>
            <div>  <span className="text-primary">if</span> (digits.length !== <span className="text-warning">14</span>) <span className="text-primary">return false</span>;</div>
            <div></div>
            <div>  <span className="text-muted">// Rejeita sequências repetidas</span></div>
            <div>  <span className="text-primary">if</span> (<span className="text-warning">{"/^(\\d)\\1+$/"}</span>.test(digits)) <span className="text-primary">return false</span>;</div>
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

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Edge cases que quebram validadores simples</h2>
          <p>
            A função acima cobre o caminho feliz, mas CNPJ em produção chega sujo. Vale testar estes casos
            antes de publicar:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li><strong className="text-foreground">Tipo errado:</strong> o campo pode chegar como número, <code>null</code> ou <code>undefined</code>. Um CNPJ com zeros à esquerda perde dígitos quando vira <code>number</code> (00.000.000/0001-91 vira 191). Aceite só string e recuse o resto.</li>
            <li><strong className="text-foreground">Espaços e caracteres invisíveis:</strong> copiar de PDF ou planilha traz espaços não separáveis. A limpeza com regex remove, mas confira o tamanho depois dela.</li>
            <li><strong className="text-foreground">Zeros à esquerda:</strong> use <code>padStart(14, &quot;0&quot;)</code> só se a origem for um campo numérico legado. Em API pública, exija os 14 dígitos.</li>
            <li><strong className="text-foreground">Sequências repetidas:</strong> 00000000000000 passa no cálculo do mod-11, por isso a checagem de repetição é obrigatória.</li>
            <li><strong className="text-foreground">Matriz e filial:</strong> a ordem (0001, 0002...) não altera o algoritmo. Os dígitos verificadores consideram os 12 primeiros dígitos inteiros.</li>
            <li><strong className="text-foreground">Validade matemática não é existência:</strong> um CNPJ pode passar no mod-11 e não existir na Receita Federal. Para saber se a empresa está ativa, consulte uma fonte oficial.</li>
          </ul>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">CNPJ alfanumérico a partir de 2026</h2>
          <p>
            A Receita Federal passou a emitir CNPJs com letras nas 12 primeiras posições. Os dois últimos
            caracteres continuam numéricos. O cálculo usa o mesmo mod-11 e os mesmos pesos, mas cada
            caractere entra como seu código ASCII menos 48 (o 0 vale 0, o A vale 17, o Z vale 42). Se o seu
            validador limpa a entrada com um regex de &quot;só dígitos&quot;, ele apaga as letras e rejeita CNPJs
            legítimos. Troque por <code>/[^0-9A-Z]/gi</code> e converta para maiúsculas antes de calcular.
            Há um passo a passo no <Link href="/gerador-cnpj-alfanumerico" className="text-primary hover:underline">gerador de CNPJ alfanumérico</Link>.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Usando a validação em Express</h2>
          <p>
            Em Express, valide na borda da rota e devolva 422 com mensagem clara. Normalize o CNPJ antes
            de gravar, para que o índice único no banco não aceite duas versões do mesmo número.
          </p>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-ts">{"import express from \"express\";\nimport { validateCNPJ } from \"./validate-cnpj\";\n\nconst app = express();\napp.use(express.json());\n\napp.post(\"/fornecedores\", (req, res) => {\n  const { cnpj } = req.body ?? {};\n  if (typeof cnpj !== \"string\" || !validateCNPJ(cnpj)) {\n    return res.status(422).json({ error: \"CNPJ inválido\" });\n  }\n  // normaliza antes de salvar\n  const normalizado = cnpj.replace(/\\D/g, \"\");\n  return res.status(201).json({ cnpj: normalizado });\n});"}</code></pre>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Usando a validação em NestJS</h2>
          <p>
            No NestJS o caminho natural é um decorator do <code>class-validator</code>. Assim o
            {" "}<code>ValidationPipe</code> global rejeita o DTO antes de chegar ao service.
          </p>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-ts">{"import { registerDecorator, ValidationOptions } from \"class-validator\";\nimport { validateCNPJ } from \"./validate-cnpj\";\n\nexport function IsCNPJ(options?: ValidationOptions) {\n  return (object: object, propertyName: string) => {\n    registerDecorator({\n      name: \"isCNPJ\",\n      target: object.constructor,\n      propertyName,\n      options: { message: \"CNPJ inválido\", ...options },\n      validator: {\n        validate: (value: unknown) => typeof value === \"string\" && validateCNPJ(value),\n      },\n    });\n  };\n}\n\n// create-fornecedor.dto.ts\nexport class CreateFornecedorDto {\n  @IsCNPJ()\n  cnpj: string;\n}"}</code></pre>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Usando a validação em Fastify</h2>
          <p>
            No Fastify, o JSON Schema cuida do formato e do tamanho, e um hook <code>preValidation</code>
            {" "}aplica o dígito verificador. O schema barra lixo barato antes do cálculo.
          </p>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-ts">{"import Fastify from \"fastify\";\nimport { validateCNPJ } from \"./validate-cnpj\";\n\nconst app = Fastify();\n\napp.post(\"/fornecedores\", {\n  schema: {\n    body: {\n      type: \"object\",\n      required: [\"cnpj\"],\n      properties: { cnpj: { type: \"string\", minLength: 14, maxLength: 18 } },\n    },\n  },\n  preValidation: async (req, reply) => {\n    const { cnpj } = req.body as { cnpj: string };\n    if (!validateCNPJ(cnpj)) {\n      return reply.code(422).send({ error: \"CNPJ inválido\" });\n    }\n  },\n}, async () => ({ ok: true }));"}</code></pre>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Perguntas frequentes</h2>
          <h3 className="text-base font-semibold text-foreground mt-4 mb-2">Preciso de uma biblioteca para validar CNPJ?</h3>
          <p>
            Não. São cerca de 20 linhas e você controla o comportamento com entradas estranhas. Uma
            dependência só compensa se o time precisar de CPF, CNPJ, título de eleitor e outros documentos
            com a mesma API.
          </p>
          <h3 className="text-base font-semibold text-foreground mt-4 mb-2">Posso usar CNPJs gerados em ambiente de teste?</h3>
          <p>
            Sim, para validar formato e fluxo. Um CNPJ gerado passa no mod-11, mas pode coincidir com o de
            uma empresa real por acaso. Nunca use esses números para emitir nota fiscal ou chamar serviços
            oficiais.
          </p>
          <h3 className="text-base font-semibold text-foreground mt-4 mb-2">O validador deve aceitar CNPJ formatado?</h3>
          <p>
            Aceite as duas formas na entrada e grave sempre só os 14 caracteres. Formate apenas na exibição.
          </p>
          <h3 className="text-base font-semibold text-foreground mt-4 mb-2">Como testar o validador de forma automatizada?</h3>
          <p>
            Gere uma lista de CNPJs válidos pela API e rode todos no teste de aceitação. Depois altere um
            dígito de cada um e confirme que todos são rejeitados. Isso pega erros de peso e de resto
            que um único exemplo manual não pega.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Resumo</h2>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>Validação de CNPJ são ~20 linhas de código, sem necessidade de libs externas</li>
            <li>O algoritmo mod-11 com pesos específicos valida os 2 dígitos verificadores</li>
            <li>Teste com CNPJs válidos (gerados) e inválidos para cobrir ambos os caminhos</li>
            <li>Use o <Link href="/validar-cnpj" className="text-primary hover:underline">validador online</Link> para checar CNPJs rapidamente</li>
            <li>Trate tipo, zeros à esquerda e CNPJ alfanumérico antes de confiar no cálculo</li>
            <li>Use a <Link href="/docs" className="text-primary hover:underline">API</Link> para gerar CNPJs em massa no CI/CD</li>
          </ul>
        </div>

        <AffiliateBanner variant="digitalocean" />
        <ShareBar title={"Validação de CNPJ em Node.js: implementação completa sem dependências"} path="/blog/validacao-cnpj-nodejs" />
        <BlogPostingSchema
          title={"Validação de CNPJ em Node.js: implementação completa sem dependências"}
          slug="validacao-cnpj-nodejs"
          description={"Implemente validação de CNPJ em Node.js do zero com o algoritmo mod-11. Código pronto para copiar, explicação passo a passo, e como testar com CNPJs fictícios."}
          datePublished="2026-04-15"
          image="https://fakeforge.com.br/api/og?title=Valida%C3%A7%C3%A3o%20de%20CNPJ%20em%20Node.js%3A%20implementa%C3%A7%C3%A3o%20completa&subtitle=Implemente%20valida%C3%A7%C3%A3o%20de%20CNPJ%20em%20Node.js%20do%20zero%20com%20o%20algoritmo%20mod-11.&category=TUTORIAIS"
        />
      </article>
    </PageShell>
  );
}
