import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import BlogFeaturedImage from "@/components/BlogFeaturedImage";
import AffiliateBanner from "@/components/AffiliateBanner";

export const metadata: Metadata = {
  title: "Como popular banco de dados com dados fictícios brasileiros",
  description: "Aprenda a popular seu banco com CPF, CNPJ, nomes e endereços brasileiros válidos. Exemplos com SQL direto, Laravel Seeder, Prisma seed e Django fixtures.",
  keywords: "popular banco dados teste, seed banco dados brasileiro, dados fictícios seed, massa de dados teste, faker brasileiro, seed laravel, prisma seed",
  openGraph: {
    title: "Como popular banco de dados com dados fictícios brasileiros",
    description: "Guia prático para seed de bancos de dados com dados brasileiros realistas via API.",
    type: "article",
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
          title="Como popular banco de dados com dados fictícios brasileiros"
          className="mb-6"
        />
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
            Como popular banco de dados com dados fictícios brasileiros
          </h1>
          <div className="flex items-center gap-3 text-xs text-muted mt-3">
            <time>10 de abril de 2026</time>
            <span>·</span>
            <span>7 min de leitura</span>
          </div>
        </div>

        <div className="prose-custom space-y-6 text-sm text-muted-foreground leading-relaxed">
          <p>
            Todo projeto que lida com dados brasileiros precisa, em algum momento, de uma massa de
            testes realista. CPFs formatados, CNPJs válidos, nomes que fazem sentido, endereços com
            CEP correto. Usar Faker.js genérico gera &ldquo;John Doe&rdquo; morando em &ldquo;123 Main Street&rdquo; —
            nada útil quando seu sistema valida documentos brasileiros.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Por que dados genéricos não servem</h2>
          <p>
            Sistemas brasileiros validam CPF por dígito verificador, formatam telefone com DDD regional
            e esperam CEPs de 8 dígitos vinculados a estados reais. Dados genéricos quebram essas
            validações e geram bugs difíceis de reproduzir em staging.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Presets disponíveis na API</h2>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li><strong>customer</strong> — nome, CPF, email, telefone, endereço. Ideal para tabelas de clientes.</li>
            <li><strong>employee</strong> — nome, CPF, conta bancária, chave PIX. Para sistemas de RH.</li>
            <li><strong>company</strong> — razão social, CNPJ, endereço comercial, telefone. Para cadastros B2B.</li>
            <li><strong>ecommerce_order</strong> — cliente + cartão + endereço de entrega. Para testar checkouts.</li>
          </ul>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">1. SQL direto via curl — o jeito mais rápido</h2>
          <p>
            Gere dados com export SQL e insira direto no banco:
          </p>
          <div className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4">
            <div className="text-muted"># Gerar 100 clientes como INSERT statements</div>
            <div>
              <span className="text-success">curl</span>
              <span className="text-foreground"> -X POST &quot;https://fakeforge.com.br/api/generate&quot; \</span>
            </div>
            <div>
              <span className="text-foreground">  -H &quot;Content-Type: application/json&quot; \</span>
            </div>
            <div>
              <span className="text-foreground">  -d &apos;{`{"preset":"customer","quantity":100,"format":"sql"}`}&apos; \</span>
            </div>
            <div>
              <span className="text-foreground">  &gt; seed.sql</span>
            </div>
            <div className="mt-2 text-muted"># Executar no PostgreSQL</div>
            <div>
              <span className="text-success">psql</span>
              <span className="text-foreground"> -d meu_banco &lt; seed.sql</span>
            </div>
          </div>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">2. Laravel Seeder</h2>
          <p>
            Use o HTTP client nativo do Laravel para buscar dados da API:
          </p>
          <div className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4">
            <div className="text-muted">// database/seeders/ClienteSeeder.php</div>
            <div><span className="text-primary">use</span> Illuminate\Support\Facades\Http;</div>
            <div className="mt-2"><span className="text-primary">public function</span> run(): <span className="text-primary">void</span></div>
            <div>{`{`}</div>
            <div>  $response = Http::post(</div>
            <div>    &apos;https://fakeforge.com.br/api/generate&apos;,</div>
            <div>    [&apos;preset&apos; =&gt; &apos;customer&apos;, &apos;quantity&apos; =&gt; 50]</div>
            <div>  );</div>
            <div className="mt-2">  <span className="text-primary">foreach</span> ($response-&gt;json() <span className="text-primary">as</span> $p) {`{`}</div>
            <div>    Cliente::create([</div>
            <div>      &apos;nome&apos; =&gt; $p[&apos;nome&apos;],</div>
            <div>      &apos;cpf&apos; =&gt; $p[&apos;cpf&apos;],</div>
            <div>      &apos;email&apos; =&gt; $p[&apos;email&apos;],</div>
            <div>    ]);</div>
            <div>  {`}`}</div>
            <div>{`}`}</div>
          </div>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">3. Prisma seed (Node.js/TypeScript)</h2>
          <div className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4">
            <div className="text-muted">// prisma/seed.ts</div>
            <div><span className="text-primary">import</span> {`{`} PrismaClient {`}`} <span className="text-primary">from</span> &apos;@prisma/client&apos;;</div>
            <div><span className="text-primary">const</span> prisma = <span className="text-primary">new</span> PrismaClient();</div>
            <div className="mt-2"><span className="text-primary">const</span> res = <span className="text-primary">await</span> fetch(</div>
            <div>  &apos;https://fakeforge.com.br/api/generate?preset=customer&amp;quantity=30&apos;</div>
            <div>);</div>
            <div><span className="text-primary">const</span> pessoas = <span className="text-primary">await</span> res.json();</div>
            <div className="mt-2"><span className="text-primary">for</span> (<span className="text-primary">const</span> p <span className="text-primary">of</span> pessoas) {`{`}</div>
            <div>  <span className="text-primary">await</span> prisma.cliente.create({`{`}</div>
            <div>    data: {`{`} nome: p.nome, cpf: p.cpf, email: p.email {`}`},</div>
            <div>  {`}`});</div>
            <div>{`}`}</div>
          </div>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Experimente — gere uma pessoa fictícia</h2>
        </div>

        <div className="mt-6 mb-8">
          <SingleGenerator
            type="person"
            label="Pessoa Completa"
            description="Dados brasileiros correlacionados"
          />
        </div>

        <div className="prose-custom space-y-6 text-sm text-muted-foreground leading-relaxed">
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">4. Django management command</h2>
          <div className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4">
            <div className="text-muted"># clientes/management/commands/seed_clientes.py</div>
            <div><span className="text-primary">import</span> requests</div>
            <div className="mt-2">response = requests.post(</div>
            <div>  &apos;https://fakeforge.com.br/api/generate&apos;,</div>
            <div>  json={`{`}&apos;preset&apos;: &apos;customer&apos;, &apos;quantity&apos;: 100{`}`}</div>
            <div>)</div>
            <div className="mt-2">Cliente.objects.bulk_create([</div>
            <div>  Cliente(nome=p[&apos;nome&apos;], cpf=p[&apos;cpf&apos;], email=p[&apos;email&apos;])</div>
            <div>  <span className="text-primary">for</span> p <span className="text-primary">in</span> response.json()</div>
            <div>])</div>
          </div>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Dicas para seed em larga escala</h2>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>Use <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">format=sql</code> para inserir direto sem ORM — mais rápido para volumes grandes</li>
            <li>Desabilite índices e constraints antes do seed massivo e reabilite depois</li>
            <li>Combine presets: customers + companies + ecommerce_orders para um ambiente completo</li>
            <li>Salve a resposta da API como fixture JSON para rodar o seed offline</li>
            <li>No CI/CD, gere dados frescos a cada pipeline run para evitar fixtures estáticas</li>
          </ul>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Resumo</h2>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>Dados genéricos quebram validações brasileiras — use dados específicos para BR</li>
            <li>A API do FakeForge suporta export SQL, JSON e CSV para qualquer stack</li>
            <li>Presets geram dados correlacionados (email usa o nome, CEP bate com estado)</li>
            <li>Veja o <Link href="/gerador-pessoa" className="text-primary hover:underline">gerador de pessoa</Link> e o <Link href="/gerador-empresa" className="text-primary hover:underline">gerador de empresa</Link> para testar visualmente</li>
            <li>Consulte a <Link href="/docs" className="text-primary hover:underline">documentação da API</Link> para detalhes dos endpoints</li>
          </ul>
        </div>

        <AffiliateBanner variant="digitalocean" />
      </article>
    </PageShell>
  );
}