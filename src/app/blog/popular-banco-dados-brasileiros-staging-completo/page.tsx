import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BlogFeaturedImage from "@/components/BlogFeaturedImage";
import ShareBar from "@/components/ShareBar";
import BlogPostingSchema from "@/components/BlogPostingSchema";

export const metadata: Metadata = {
  title: "Popular Banco com Dados Brasileiros: Postgres, MySQL, SQLite",
  description: "Pillar guide pra popular banco de staging com dados BR fictícios válidos. Cobre PostgreSQL, MySQL, SQLite, MongoDB. Compara seed estático vs dinâmico, mostra padrões de migração + seed e estratégias de reset entre testes.",
  openGraph: {
    title: "Popular Banco com Dados Brasileiros: Postgres, MySQL, SQLite",
    description: "Pillar guide pra popular banco de staging com dados BR fictícios válidos. Cobre PostgreSQL, MySQL, SQLite, MongoDB. Compara seed estático vs dinâmico, mostra padrões de migração + seed e estratégias de reset entre testes.",
    type: "article",
    images: ["/api/og?title=Popular%20banco%20com%20dados%20BR&subtitle=Guia%20completo%20PostgreSQL%2C%20MySQL%2C%20SQLite%2C%20MongoDB&category=TUTORIAIS"],
  },
  alternates: { canonical: "/blog/popular-banco-dados-brasileiros-staging-completo" },
};

export default function Post() {
  return (
    <PageShell>
      <article className="max-w-2xl">
        <Link href="/blog" className="text-xs text-primary hover:underline mb-4 inline-block">
          ← Voltar ao blog
        </Link>
        <BlogFeaturedImage category="Tutoriais" title="Popular banco com dados brasileiros: guia completo" className="mb-6" />
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
            Popular banco com dados brasileiros: guia completo
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            PostgreSQL, MySQL, SQLite e MongoDB. Seed estático vs dinâmico, migrações com fixture, reset entre testes, e o que fazer com CPF/CNPJ/CEP/cartão sem violar LGPD.
          </p>
          <div className="flex items-center gap-3 text-xs text-muted mt-3">
            <time>18 de junho de 2026</time>
            <span>·</span>
            <span>16 min de leitura</span>
          </div>
        </div>

        <nav className="mb-8 rounded-xl bg-card border border-border p-4" aria-label="Sumário">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-2">Sumário</p>
          <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
            <li><a href="#por-que-importa" className="hover:text-primary">Por que dados BR importam (e por que faker.js não basta)</a></li>
            <li><a href="#decidir-estrategia" className="hover:text-primary">Decidir estratégia: estático vs dinâmico</a></li>
            <li><a href="#postgresql" className="hover:text-primary">PostgreSQL: seed via SQL gerado</a></li>
            <li><a href="#mysql" className="hover:text-primary">MySQL: seed com TRUNCATE + INSERT</a></li>
            <li><a href="#sqlite" className="hover:text-primary">SQLite: seed em arquivo único pra testes locais</a></li>
            <li><a href="#mongodb" className="hover:text-primary">MongoDB: insertMany com documentos correlacionados</a></li>
            <li><a href="#migracao-orms" className="hover:text-primary">Integrar com migrações: Prisma, Knex, Alembic, Django</a></li>
            <li><a href="#reset-entre-testes" className="hover:text-primary">Reset entre testes: transação vs truncate vs container</a></li>
            <li><a href="#anti-patterns" className="hover:text-primary">Anti-patterns que matam staging</a></li>
            <li><a href="#proximos-passos" className="hover:text-primary">Próximos passos</a></li>
          </ol>
        </nav>

        <div className="prose-custom space-y-2 text-sm text-muted-foreground leading-relaxed">
          <section id="por-que-importa">
            <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Por que dados BR importam (e por que faker.js não basta)</h2>
            <p className="mb-4">
              Popular banco de staging com dados realistas é um problema antigo. Faker.js, Faker (Python), Mockaroo e bibliotecas equivalentes resolvem o caso geral: nome, email, endereço, número de cartão. Pra contextos brasileiros, todas falham em pelo menos um lugar crítico:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 mt-3 mb-4">
              <li>
                <strong className="text-foreground">CPF e CNPJ válidos (mod-11).</strong> Faker.js gera 11 dígitos quaisquer; nenhum passa em validador real. Isso quebra integração com checkout, KYC, antifraude, qualquer fluxo que valide formato.
              </li>
              <li>
                <strong className="text-foreground">Cartão por bandeira.</strong> Faker.js gera Visa/Master genéricos; Elo, Hipercard e Amex pedem prefixos BIN próprios. Testes que dependem de roteamento por bandeira (Cielo, Mercado Pago, Pagar.me) silenciosamente caem no fluxo errado.
              </li>
              <li>
                <strong className="text-foreground">CEP por estado.</strong> CEP 22000-000 só existe no Rio. CEP 01000-000 só em SP. Faker.js gera 5+3 dígitos quaisquer; o teste de checkout BR rejeita.
              </li>
              <li>
                <strong className="text-foreground">DDD válido por região.</strong> 11 é SP capital, 21 é RJ capital, 12 é Vale do Paraíba. Gerador genérico produz <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">(00) 99999-9999</code> que não bate.
              </li>
              <li>
                <strong className="text-foreground">CNPJ alfanumérico.</strong> Em vigor desde 01/07/2026 (IN RFB 2.229). Faker.js não atualizou ainda. Seu app aceita os 2 formatos? Como você testa?
              </li>
            </ul>
            <p className="mb-4">
              A solução cara é manter uma biblioteca interna que implementa os algoritmos. A solução barata é chamar uma API que já implementa. Este guia assume a segunda opção e usa o{" "}
              <Link href="/" className="text-primary hover:underline">FakeForge</Link> como provedor (free tier: 50 chamadas/dia, sem cadastro), mas os padrões valem pra qualquer fonte que gere dado BR válido.
            </p>
          </section>

          <section id="decidir-estrategia">
            <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Decidir estratégia: estático vs dinâmico</h2>
            <p className="mb-4">
              Antes de escolher banco, decida o modelo:
            </p>
            <div className="rounded-xl bg-card border border-border overflow-x-auto mb-4">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-2 text-muted-foreground font-medium">Modelo</th>
                    <th className="text-left px-4 py-2 text-muted-foreground font-medium">Quando usar</th>
                    <th className="text-left px-4 py-2 text-muted-foreground font-medium">Onde mora o seed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-2 text-foreground font-medium">Estático commitado</td>
                    <td className="px-4 py-2">Reproducibilidade absoluta. Debug de bug específico que precisa do mesmo CPF toda vez.</td>
                    <td className="px-4 py-2 font-mono">/tests/fixtures/*.sql</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-foreground font-medium">Estático gerado uma vez</td>
                    <td className="px-4 py-2">Snapshot inicial salvo, regenerado quando schema muda. CI mais rápido (sem chamada de API).</td>
                    <td className="px-4 py-2 font-mono">/seeds/baseline.sql</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-foreground font-medium">Dinâmico por job</td>
                    <td className="px-4 py-2">Padrão moderno. Dados frescos a cada run. Cobre mudança de regra (CNPJ alfanumérico) sem rebuild do seed.</td>
                    <td className="px-4 py-2">Volátil, descartado pós-run</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-foreground font-medium">Híbrido</td>
                    <td className="px-4 py-2">Dados &quot;sticky&quot; (10 user demos fixos) commitados; dados &quot;volume&quot; (10k orders pra testar paginação) gerados.</td>
                    <td className="px-4 py-2 font-mono">/seeds/demo.sql + run-time</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mb-4">
              Pra staging compartilhado entre time, o híbrido é o sweet spot. 10-20 contas demo fixas (pra QA referenciar &quot;teste com o user Carlos Silva&quot;) + dados de volume gerados sob demanda. Pra CI, dinâmico por job é o padrão sólido. Pra testes unit locais, estático em arquivo único.
            </p>
          </section>

          <section id="postgresql">
            <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">PostgreSQL: seed via SQL gerado</h2>
            <p className="mb-4">
              PostgreSQL é o caso mais limpo. A API entrega <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">CREATE TABLE IF NOT EXISTS</code> + <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">INSERT INTO</code> diretamente, e psql aceita stdin:
            </p>
            <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto">{`# Reset rápido + seed de 500 customers
psql "$DB_URL" -c "TRUNCATE customers, addresses, orders RESTART IDENTITY CASCADE;"

curl -sS "https://fakeforge.com.br/api/generate?preset=customer&quantity=500&format=sql" \\
  | psql "$DB_URL"

# 1.000 CNPJs em uma tabela própria
curl -sS "https://fakeforge.com.br/api/generate?type=cnpj&quantity=1000&format=sql" \\
  | psql "$DB_URL"

# 50 cartões Visa válidos
curl -sS "https://fakeforge.com.br/api/generate?type=creditCardVisa&quantity=50&format=sql" \\
  | psql "$DB_URL"`}</pre>
            <p className="mb-4">
              O <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">RESTART IDENTITY</code> reseta sequences (IDs voltam pro 1), e <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">CASCADE</code> derruba FK referências em cadeia. Cuidado: derruba <em>todos</em> os dados das tabelas listadas. Em staging compartilhado, isso pode pisar no trabalho de outro dev.
            </p>
            <p className="mb-4">
              Padrão alternativo pra staging compartilhado: trabalhar em schema dedicado. Cria <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">CREATE SCHEMA test_seed</code>, popula só ali, e cada teste usa <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">SET search_path TO test_seed, public</code>. Quando termina, <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">DROP SCHEMA test_seed CASCADE</code> tira sem afetar o resto.
            </p>
            <p className="mb-4">
              Pra detalhes específicos de PostgreSQL (extensão pgcrypto pra UUID, transações pra rollback, COPY pra volume grande), veja o tutorial dedicado:{" "}
              <Link href="/blog/popular-postgresql-dados-brasileiros-staging" className="text-primary hover:underline font-medium">Popular PostgreSQL com dados brasileiros</Link>.
            </p>
          </section>

          <section id="mysql">
            <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">MySQL: seed com TRUNCATE + INSERT</h2>
            <p className="mb-4">
              MySQL tem 2 diferenças importantes vs PostgreSQL no contexto de seed. <strong className="text-foreground">Primeiro</strong>, <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">TRUNCATE</code> não aceita CASCADE; você precisa desativar FK checks ou ordenar manualmente. <strong className="text-foreground">Segundo</strong>, o tipo VARCHAR com encoding latin1 pode comer caracteres acentuados (José, São Paulo) silenciosamente — use sempre <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">utf8mb4</code> nas tabelas que recebem nomes/endereços.
            </p>
            <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto">{`# Garante encoding correto antes do seed
mysql "$DB_URL" -e "
  SET NAMES utf8mb4;
  SET FOREIGN_KEY_CHECKS = 0;
  TRUNCATE orders;
  TRUNCATE addresses;
  TRUNCATE customers;
  SET FOREIGN_KEY_CHECKS = 1;
"

# Popula via SQL gerado
curl -sS "https://fakeforge.com.br/api/generate?preset=customer&quantity=500&format=sql" \\
  | mysql --default-character-set=utf8mb4 "$DB_URL"`}</pre>
            <p className="mb-4">
              Tutorial completo:{" "}
              <Link href="/blog/popular-mysql-dados-brasileiros-fake-staging" className="text-primary hover:underline font-medium">Popular MySQL com dados brasileiros</Link>.
            </p>
          </section>

          <section id="sqlite">
            <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">SQLite: seed em arquivo único pra testes locais</h2>
            <p className="mb-4">
              SQLite é o pé sujo da maioria das suites de teste em Django, Rails e FastAPI: rápido, in-memory, descarta no final. Não tem TRUNCATE nem stored procedures, então o padrão é diferente:
            </p>
            <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto">{`# Gera SQL e aplica em DB nova
curl -sS "https://fakeforge.com.br/api/generate?preset=customer&quantity=100&format=sql" \\
  -o seed.sql

# Cada test run cria uma DB do zero
rm -f test.db
sqlite3 test.db < seed.sql

# pytest, jest, ou seu runner aponta DATABASE_URL=sqlite:test.db
DATABASE_URL="sqlite:./test.db" pytest`}</pre>
            <p className="mb-4">
              Atenção: SQLite trata FK constraints como advisory por default. Pra forçar checagem (e validar que seu seed respeita FKs), abra com <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">PRAGMA foreign_keys = ON;</code> no início do arquivo.
            </p>
          </section>

          <section id="mongodb">
            <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">MongoDB: insertMany com documentos correlacionados</h2>
            <p className="mb-4">
              MongoDB não aceita SQL, então a estratégia muda. Pega JSON da API e usa o driver:
            </p>
            <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto">{`// seed-mongo.ts
import { MongoClient } from "mongodb";

async function seed() {
  const client = await MongoClient.connect(process.env.MONGO_URL!);
  const db = client.db("staging");

  // Limpa coleções
  await Promise.all([
    db.collection("customers").drop().catch(() => {}),
    db.collection("orders").drop().catch(() => {}),
  ]);

  // Pega 500 customers correlacionados
  const res = await fetch(
    "https://fakeforge.com.br/api/generate?preset=customer&quantity=500"
  );
  const { data: customers } = await res.json();

  // insertMany aceita o array direto
  await db.collection("customers").insertMany(
    customers.map((c: any) => ({
      ...c,
      _id: undefined,           // deixa o Mongo gerar ObjectId
      createdAt: new Date(),
    }))
  );

  console.log(\`Inseridos \${customers.length} customers BR.\`);
  await client.close();
}

seed();`}</pre>
            <p className="mb-4">
              Padrão pra correlacionar orders com os customers recém-inseridos:
            </p>
            <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto">{`// Pega os IDs gerados pelo Mongo
const customerIds = (await db.collection("customers").find({}, { projection: { _id: 1 } }).toArray())
  .map(c => c._id);

// Gera 2000 orders correlacionados
const orderRes = await fetch(
  "https://fakeforge.com.br/api/generate?type=cpf&quantity=2000"
);
const { data: cpfs } = await orderRes.json();

await db.collection("orders").insertMany(
  cpfs.map((cpf: string, i: number) => ({
    customer_id: customerIds[i % customerIds.length],  // distribui pelos customers existentes
    cpf,
    total: Math.round(Math.random() * 50000) / 100,
    status: ["pending", "paid", "shipped"][i % 3],
    createdAt: new Date(),
  }))
);`}</pre>
          </section>

          <section id="migracao-orms">
            <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Integrar com migrações: Prisma, Knex, Alembic, Django</h2>
            <p className="mb-4">
              Maioria dos ORMs separa migration (mudança de schema) de seed (popular dados). Mas integrar os dois ajuda a garantir que o seed reflete o schema atual:
            </p>
            <p className="mt-4 mb-2"><strong className="text-foreground">Prisma:</strong></p>
            <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto">{`// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const res = await fetch(
    "https://fakeforge.com.br/api/generate?preset=customer&quantity=200"
  );
  const { data } = await res.json();

  await prisma.customer.createMany({
    data: data.map((c: any) => ({
      name: c.name,
      cpf: c.cpf,
      email: c.email,
    })),
    skipDuplicates: true,
  });
}

main().finally(() => prisma.$disconnect());

// package.json
{ "prisma": { "seed": "tsx prisma/seed.ts" } }
// Roda com: npx prisma db seed`}</pre>
            <p className="mt-4 mb-2"><strong className="text-foreground">Knex (Node):</strong></p>
            <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto">{`// seeds/01_customers.ts
import { Knex } from "knex";

export async function seed(knex: Knex) {
  await knex("customers").del();

  const res = await fetch(
    "https://fakeforge.com.br/api/generate?preset=customer&quantity=200"
  );
  const { data } = await res.json();
  await knex("customers").insert(data);
}

// Roda com: knex seed:run`}</pre>
            <p className="mt-4 mb-2"><strong className="text-foreground">Alembic (Python) + SQLAlchemy:</strong></p>
            <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto">{`# scripts/seed.py
import requests
from sqlalchemy.orm import Session
from app.db import engine
from app.models import Customer

def main():
    res = requests.get(
        "https://fakeforge.com.br/api/generate",
        params={"preset": "customer", "quantity": 200},
    )
    customers = res.json()["data"]

    with Session(engine) as s:
        s.query(Customer).delete()
        s.add_all([Customer(**c) for c in customers])
        s.commit()

if __name__ == "__main__":
    main()`}</pre>
            <p className="mt-4 mb-2"><strong className="text-foreground">Django:</strong></p>
            <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto">{`# core/management/commands/seed.py
from django.core.management.base import BaseCommand
import requests
from core.models import Customer

class Command(BaseCommand):
    def handle(self, *args, **opts):
        res = requests.get(
            "https://fakeforge.com.br/api/generate",
            params={"preset": "customer", "quantity": 200},
        )
        Customer.objects.bulk_create([
            Customer(**c) for c in res.json()["data"]
        ])

# Roda com: python manage.py seed`}</pre>
          </section>

          <section id="reset-entre-testes">
            <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Reset entre testes: transação vs truncate vs container</h2>
            <p className="mb-4">
              Você populou. Agora, como garantir que cada teste começa numa base previsível? Três padrões, do mais leve pro mais pesado:
            </p>
            <p className="mt-4 mb-2"><strong className="text-foreground">1. Transação rollback (mais rápido).</strong></p>
            <p className="mb-4">
              Cada teste roda dentro de uma transação que dá rollback no final. Funciona pra DBs que suportam SAVEPOINT (PostgreSQL, MySQL InnoDB, SQLite). Não funciona pra testes que precisam ver dados de outras conexões (smoke test de uma fila assíncrona, por exemplo). Implementação típica em pytest:
            </p>
            <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto">{`@pytest.fixture
def db_session():
    conn = engine.connect()
    trans = conn.begin()
    session = Session(bind=conn)
    yield session
    session.close()
    trans.rollback()
    conn.close()`}</pre>

            <p className="mt-4 mb-2"><strong className="text-foreground">2. TRUNCATE entre testes (consistente).</strong></p>
            <p className="mb-4">
              Antes de cada teste, trunca as tabelas relevantes e repopula. Lento se você tem muitas tabelas. Pode acelerar com <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">RESTART IDENTITY</code> em PostgreSQL ou desativando FK checks temporariamente em MySQL.
            </p>

            <p className="mt-4 mb-2"><strong className="text-foreground">3. Container descartável (mais isolamento).</strong></p>
            <p className="mb-4">
              Sobe um container Docker novo por teste (testcontainers em qualquer linguagem). Mais lento (~1-3s por teste só pra subir o container), mas garante isolamento absoluto. Útil pra testes que mexem em extensões do banco, índices, ou setup complexo:
            </p>
            <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto">{`// vitest com testcontainers
import { PostgreSqlContainer } from "@testcontainers/postgresql";

let pg: any;
let connectionString: string;

beforeEach(async () => {
  pg = await new PostgreSqlContainer().start();
  connectionString = pg.getConnectionUri();

  // Roda migrações + seed BR no container novo
  await runMigrations(connectionString);
  const res = await fetch(
    "https://fakeforge.com.br/api/generate?preset=customer&quantity=50&format=sql"
  );
  await execSql(connectionString, await res.text());
});

afterEach(() => pg.stop());`}</pre>
          </section>

          <section id="anti-patterns">
            <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Anti-patterns que matam staging</h2>
            <ul className="list-disc list-inside space-y-2 pl-2 mt-3 mb-4">
              <li>
                <strong className="text-foreground">Copiar dump de produção pra staging.</strong> Maior risco LGPD, sanção de até 2% do faturamento por incidente. Mesmo &quot;mascarando&quot; CPF (XXX.XXX.XXX-09), a junção com email + endereço re-identifica. Use sempre fictícios.
              </li>
              <li>
                <strong className="text-foreground">Mesma DB compartilhada entre dev local e staging.</strong> Cada dev mexe nos dados do colega. Causa &quot;funciona na minha máquina&quot; clássico. SQLite local + Postgres staging resolve.
              </li>
              <li>
                <strong className="text-foreground">Seed gigante por hábito.</strong> 100.000 customers porque &quot;parece mais real&quot;. Lentidão de teste cresce linearmente. 200-500 customers cobre 99% dos cenários; pra paginação, gera 10.000 só nesse teste específico.
              </li>
              <li>
                <strong className="text-foreground">Não versionar o seed script.</strong> Refactor da equação que decide cota muda comportamento; seed antigo testava cenário diferente. Commita o script (não os dados gerados) e roda na pipeline.
              </li>
              <li>
                <strong className="text-foreground">Hard-code de CPF/CNPJ específico em testes.</strong> Quando você quiser regenerar seed, o teste quebra. Use IDs ou queries genéricas: <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">db.customers.first()</code> em vez de <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">db.customers.find(cpf=&quot;123.456.789-09&quot;)</code>.
              </li>
            </ul>
          </section>

          <section id="proximos-passos">
            <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Próximos passos</h2>
            <p className="mb-4">
              Dependendo do seu stack, vale aprofundar:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 mt-3 mb-4">
              <li>
                Pipeline CI/CD completa (GitHub Actions, pytest, Jest):{" "}
                <Link href="/blog/automatizar-dados-teste-ci-cd" className="text-primary hover:underline">Dados de teste no CI/CD</Link>
              </li>
              <li>
                PostgreSQL específico:{" "}
                <Link href="/blog/popular-postgresql-dados-brasileiros-staging" className="text-primary hover:underline">Popular PostgreSQL com dados brasileiros</Link>
              </li>
              <li>
                MySQL específico:{" "}
                <Link href="/blog/popular-mysql-dados-brasileiros-fake-staging" className="text-primary hover:underline">Popular MySQL com dados brasileiros</Link>
              </li>
              <li>
                E2E com Cypress mockando CEP:{" "}
                <Link href="/blog/mockar-cep-cypress-dados-brasileiros-falsos" className="text-primary hover:underline">Mockar CEP em Cypress</Link>
              </li>
              <li>
                LGPD em ambiente de teste:{" "}
                <Link href="/blog/lgpd-testes-software-guia-pratico-devs" className="text-primary hover:underline">LGPD em testes: guia prático</Link>
              </li>
              <li>
                Documentação da API:{" "}
                <Link href="/docs" className="text-primary hover:underline">/docs</Link>
              </li>
            </ul>
            <p className="mb-4">
              Os dados são fáceis. O custo real é decidir o modelo (estático vs dinâmico, dedicated schema vs shared, transação vs truncate) cedo o suficiente pra não refatorar a suite inteira em 6 meses. Decide agora; o resto é boilerplate.
            </p>
          </section>
        </div>

        <ShareBar title={"Popular banco com dados brasileiros: guia completo (PostgreSQL, MySQL, SQLite, MongoDB)"} path="/blog/popular-banco-dados-brasileiros-staging-completo" />
        <BlogPostingSchema
          title={"Popular banco com dados brasileiros: guia completo (PostgreSQL, MySQL, SQLite, MongoDB)"}
          slug="popular-banco-dados-brasileiros-staging-completo"
          description={"Pillar guide pra popular banco de staging com dados BR fictícios válidos. Cobre PostgreSQL, MySQL, SQLite, MongoDB."}
          datePublished="2026-06-18"
        />
      </article>
    </PageShell>
  );
}
