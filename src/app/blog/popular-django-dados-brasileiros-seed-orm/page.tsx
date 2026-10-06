import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BlogFeaturedImage from "@/components/BlogFeaturedImage";
import ShareBar from "@/components/ShareBar";
import BlogPostingSchema from "@/components/BlogPostingSchema";

export const metadata: Metadata = {
  title: "Popular Django com CPF, CNPJ e PIX: seed do ORM BR",
  description: "Guia completo pra popular banco Django com dados brasileiros válidos: CPF, CNPJ, endereços, PIX, cartão. Migração, seed via ORM, comparação Faker vs FakeForge vs python-brasilidades. Código pronto.",
  keywords: "seed django dados brasileiros, popular django cpf cnpj, django orm dados teste br, faker django pt-br, django seed script python, dados fake django orm, django fixtures brasil",
  openGraph: {
    title: "Popular Django com CPF, CNPJ e PIX: seed do ORM BR",
    description: "Guia completo pra popular banco Django com dados brasileiros válidos: CPF, CNPJ, endereços, PIX, cartão. Migração, seed via ORM, comparação Faker vs FakeForge vs python-brasilidades.",
    type: "article",
    images: ["/api/og?title=Popular%20Django%20com%20dados%20brasileiros&subtitle=Seed%20do%20ORM%20com%20CPF%2C%20CNPJ%20e%20PIX&category=TUTORIAIS"],
  },
  alternates: { canonical: "/blog/popular-django-dados-brasileiros-seed-orm" },
};

export default function Post() {
  return (
    <PageShell>
      <article className="max-w-2xl">
        <Link href="/blog" className="text-xs text-primary hover:underline mb-4 inline-block">← Voltar ao blog</Link>
        <BlogFeaturedImage category="Tutoriais" title="Popular Django com dados brasileiros" className="mb-6" />

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
            Popular Django com dados brasileiros: seed do ORM com CPF, CNPJ e PIX
          </h1>
          <p className="text-xs text-muted mt-3">Publicado em 2026-09-24 · Leitura ~10 min</p>
        </div>

        <ShareBar title="Popular Django com dados brasileiros" path="/blog/popular-django-dados-brasileiros-seed-orm" />

        <div className="prose prose-invert mt-6 space-y-6 text-sm text-muted-foreground leading-relaxed">
          <p>
            Se você tá construindo app Django que atende Brasil, seed de banco com dado real de produção não é opção. LGPD proíbe, DPO não deixa, e mesmo se deixasse, cópia de produção pra staging é receita pra vazamento. A rota certa é popular staging com <strong className="text-foreground">dados brasileiros sintéticos válidos</strong>. Este guia mostra 3 abordagens, código pronto pra copiar, e quando cada uma faz sentido.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8">O problema real: por que Faker sozinho não resolve</h2>
          <p>
            Faker Python com locale <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">pt_BR</code> gera nome, email, endereço, telefone e alguns documentos. Mas tem 3 furos graves:
          </p>
          <ol className="list-decimal list-inside space-y-2 pl-2">
            <li><strong className="text-foreground">CPF quebra validação mod-11 em alguns cenários.</strong> Se seu Django tem validator (comum via <code className="text-xs">cpf-cnpj-validator</code> ou similar), Faker pode gerar CPF que quebra em CI.</li>
            <li><strong className="text-foreground">Zero correlação entre campos.</strong> Faker gera nome "João Silva" com email "jane@doe.com" e telefone com DDD 61 (DF), enquanto o endereço tá em São Paulo. Se seu app tem antifraude que valida coerência, teste dispara falso positivo em toda rodada.</li>
            <li><strong className="text-foreground">Sem cartão de crédito válido, PIX BACEN, conta bancária real.</strong> Faker gera número random. Se você testa integração com gateway ou validador Luhn, quebra.</li>
          </ol>

          <h2 className="text-lg font-semibold text-foreground mt-8">Abordagem 1: Faker + validators manuais</h2>
          <p>
            Se você só precisa cobrir o básico e não quer dependência externa, escreve validator próprio. Aqui vai o mod-11 pra CPF em ~30 linhas:
          </p>
          <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# utils/generators.py
import random

def gerar_cpf() -> str:
    """Gera CPF válido pelo mod-11 da Receita Federal."""
    n = [random.randint(0, 9) for _ in range(9)]
    # Primeiro dígito
    s = sum(a * b for a, b in zip(n, range(10, 1, -1)))
    d1 = (s * 10) % 11
    d1 = 0 if d1 == 10 else d1
    n.append(d1)
    # Segundo dígito
    s = sum(a * b for a, b in zip(n, range(11, 1, -1)))
    d2 = (s * 10) % 11
    d2 = 0 if d2 == 10 else d2
    n.append(d2)
    return f"{n[0]}{n[1]}{n[2]}.{n[3]}{n[4]}{n[5]}.{n[6]}{n[7]}{n[8]}-{n[9]}{n[10]}"`}</code></pre>

          <p>
            Combina com Faker no seu comando de management:
          </p>

          <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# myapp/management/commands/seed_staging.py
from django.core.management.base import BaseCommand
from faker import Faker
from myapp.models import Customer
from utils.generators import gerar_cpf

class Command(BaseCommand):
    def handle(self, *args, **options):
        fake = Faker("pt_BR")
        Customer.objects.bulk_create([
            Customer(
                nome=fake.name(),
                cpf=gerar_cpf(),
                email=fake.email(),
                telefone=fake.phone_number(),
                cep=fake.postcode(),
            )
            for _ in range(1000)
        ])
        self.stdout.write(f"1000 clientes seeded")`}</code></pre>

          <p>
            Roda com <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">python manage.py seed_staging</code>.
          </p>

          <p>
            <strong className="text-foreground">Quando usar:</strong> app simples, sem correlação, sem PIX, sem cartão. Cobre 40% dos casos.
          </p>

          <p>
            <strong className="text-foreground">Limitação:</strong> mesmo com CPF válido, os campos são independentes. Email não deriva do nome. DDD do telefone é aleatório vs UF. Pra teste de fluxo real, isso quebra.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8">Abordagem 2: python-brasilidades pra CPF/CNPJ, Faker pro resto</h2>

          <p>
            A biblioteca <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">python-brasilidades</code> cobre CPF, CNPJ, CNH e RG válidos em Python puro. Instala:
          </p>

          <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`pip install python-brasilidades`}</code></pre>

          <p>Uso combinado:</p>

          <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`from brasilidades.documentos import cpf, cnpj
from faker import Faker
from myapp.models import Customer

fake = Faker("pt_BR")

for _ in range(1000):
    Customer.objects.create(
        nome=fake.name(),
        cpf=cpf.gerar(),
        cnpj=cnpj.gerar(),
        email=fake.email(),
        telefone=fake.phone_number(),
        cep=fake.postcode(),
    )`}</code></pre>

          <p>
            <strong className="text-foreground">Quando usar:</strong> precisa CPF/CNPJ/CNH/RG válidos sem chamar API externa. Zero deps runtime além do pip install. Cobre 60% dos casos.
          </p>

          <p>
            <strong className="text-foreground">Limitação:</strong> continua sem correlação entre campos. Sem cartão de crédito com Luhn. Sem chave PIX BACEN. Sem conta bancária com DV real por banco.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8">Abordagem 3: FakeForge com presets correlacionados</h2>

          <p>
            O <Link href="/" className="text-primary hover:underline">FakeForge</Link> tem SDK Python oficial que cobre todos os documentos + correlação entre campos + presets verticais. Instala:
          </p>

          <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`pip install fakeforge-br`}</code></pre>

          <p>Seed de 1000 clientes correlacionados em 1 chamada:</p>

          <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# myapp/management/commands/seed_staging.py
from django.core.management.base import BaseCommand
from fakeforge import FakeForge
from myapp.models import Customer

class Command(BaseCommand):
    def handle(self, *args, **options):
        ff = FakeForge(api_key="sua_key_opcional")

        # 1000 clientes com CPF + email + endereço + telefone COERENTES
        dados = ff.preset("customer", 1000)

        Customer.objects.bulk_create([
            Customer(
                nome=c["nome"],
                cpf=c["cpf"],
                email=c["email"],        # deriva do nome
                telefone=c["telefone"],  # DDD bate com UF
                cep=c["endereco"]["cep"],
                cidade=c["endereco"]["cidade"],
                estado=c["endereco"]["estado"],
            )
            for c in dados
        ])
        self.stdout.write(f"1000 clientes seeded (correlacionados)")`}</code></pre>

          <p>
            <strong className="text-foreground">Vantagem principal:</strong> email deriva do nome (Marina Silva → marina.silva@gmail.com). DDD do telefone bate com UF do endereço. Se seu Django tem antifraude que valida "email match name" ou "phone UF match address", passa no teste.
          </p>

          <p>Se você constrói fintech, existe preset dedicado que devolve bundle completo:</p>

          <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`clientes = ff.preset("fintech", 100)

# cada cliente tem:
# - customer (nome, cpf, email, telefone, endereço, renda_mensal, score_serasa)
# - pix_keys (3-4 chaves: CPF + email + phone + aleatória)
# - bank_account (17 bancos brasileiros com DV real)
# - credit_card (Luhn válido, brand random, holder = nome)`}</code></pre>

          <p>
            Se você constrói ecommerce, tem preset ecom que devolve pedido completo com carrinho, endereços shipping/billing, payment (cartão/PIX/boleto) e totais calculados.
          </p>

          <p>
            <strong className="text-foreground">Quando usar:</strong> precisa dado correlacionado, cartão com Luhn, PIX BACEN, conta bancária real, presets verticais. Cobre 90% dos casos.
          </p>

          <p>
            <strong className="text-foreground">Limitação:</strong> requer conexão internet (chama endpoint HTTP). Free tier libera 50 chamadas/dia sem cadastro. Plano Dev R$29/mês libera 10.000 chamadas/dia com até 10.000 items por chamada.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8">Comparação: qual escolher</h2>

          <div className="rounded-lg bg-card border border-border overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-3 py-2 text-muted font-medium">Cenário</th>
                  <th className="text-center px-3 py-2 text-muted font-medium">Faker+ util</th>
                  <th className="text-center px-3 py-2 text-muted font-medium">python-brasilidades</th>
                  <th className="text-center px-3 py-2 text-muted font-medium">FakeForge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ["App CRUD simples", "✅", "✅", "✅"],
                  ["Fintech (PIX+banco+cartão)", "❌", "❌", "✅"],
                  ["E-commerce (carrinho+payment)", "❌", "❌", "✅"],
                  ["Antifraude (correlação obrigatória)", "❌", "❌", "✅"],
                  ["100% offline", "✅", "✅", "❌"],
                  ["Seed rápido de 10k rows", "⚠️ lento", "⚠️ lento", "✅ 1 chamada"],
                  ["CNPJ alfanumérico 2026", "❌", "❌", "✅"],
                  ["Custo mensal", "R$0", "R$0", "R$0-79"],
                ].map(([cenario, faker, brasilidades, ff], i) => (
                  <tr key={i}>
                    <td className="px-3 py-2 text-foreground">{cenario}</td>
                    <td className="px-3 py-2 text-center text-muted-foreground">{faker}</td>
                    <td className="px-3 py-2 text-center text-muted-foreground">{brasilidades}</td>
                    <td className="px-3 py-2 text-center text-primary">{ff}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-lg font-semibold text-foreground mt-8">Boas práticas independente da abordagem</h2>

          <ol className="list-decimal list-inside space-y-3 pl-2">
            <li>
              <strong className="text-foreground">Nunca seed em production database.</strong> Command management só roda em <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">DEBUG=True</code> ou com flag explícita <code className="text-xs">--force-production</code> que você nunca vai passar por engano.
            </li>
            <li>
              <strong className="text-foreground">Bulk create sempre.</strong> Um <code className="text-xs">create()</code> por row em loop é 100x mais lento que <code className="text-xs">bulk_create()</code>. Pra 10k rows, diferença é 5 min vs 3 segundos.
            </li>
            <li>
              <strong className="text-foreground">Reset periódico.</strong> Cron diário limpa staging + reload de dado sintético fresh. Evita LGPD gray area de "quanto tempo pode ficar dado real em staging" (não pode ter dado real em staging).
            </li>
            <li>
              <strong className="text-foreground">Documenta no README.</strong> "Dados sintéticos gerados via [ferramenta]. Nenhum documento pertence a pessoa real. Uso restrito a ambiente de desenvolvimento." Protege time em auditoria LGPD.
            </li>
            <li>
              <strong className="text-foreground">Cachea em CI.</strong> Se chama API externa (FakeForge), gera 1x, salva JSON em fixture, reusa entre runs. Não precisa chamar API a cada job.
            </li>
          </ol>

          <h2 className="text-lg font-semibold text-foreground mt-8">Exemplo completo: seed com 10k clientes fintech</h2>

          <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# myapp/management/commands/seed_fintech.py
from django.core.management.base import BaseCommand
from django.conf import settings
from fakeforge import FakeForge
from myapp.models import Customer, PixKey, BankAccount, CreditCard

class Command(BaseCommand):
    def handle(self, *args, **options):
        if not settings.DEBUG and "--force" not in options:
            self.stdout.write("Refuso rodar em production. Use --force se souber.")
            return

        ff = FakeForge(api_key=settings.FAKEFORGE_KEY)
        dados = ff.preset("fintech", 10000)

        customers, pix_keys, accounts, cards = [], [], [], []

        for d in dados:
            c = Customer(
                nome=d["customer"]["nome"],
                cpf=d["customer"]["cpf"],
                email=d["customer"]["email"],
                telefone=d["customer"]["telefone"],
                renda_mensal=d["customer"]["renda_mensal"],
                score_serasa=d["customer"]["score_serasa"],
            )
            customers.append(c)

            for pk in d["pix_keys"]:
                pix_keys.append(PixKey(tipo=pk["type"], valor=pk["value"]))

            ba = d["bank_account"]
            accounts.append(BankAccount(
                banco=ba["bankName"], agencia=ba["agency"],
                conta=ba["account"], dv=ba["accountDigit"],
            ))

            cc = d["credit_card"]
            cards.append(CreditCard(
                numero=cc["number"], titular=cc["holder"],
                validade=cc["expiry"], cvv=cc["cvv"], bandeira=cc["brand"],
            ))

        Customer.objects.bulk_create(customers)
        PixKey.objects.bulk_create(pix_keys)
        BankAccount.objects.bulk_create(accounts)
        CreditCard.objects.bulk_create(cards)

        self.stdout.write(f"{len(customers)} clientes fintech seeded")`}</code></pre>

          <p>
            Roda em 8-12 segundos (1 chamada HTTP + bulk creates). Mesmo seed com Faker + validators manuais levaria 5-10 minutos.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8">Conclusão</h2>

          <p>
            Se seu Django simples só precisa CPF/CNPJ, Faker + validator manual resolve. Se precisa cobrir também cartão, PIX, banco e correlação entre campos, python-brasilidades resolve parte e FakeForge resolve tudo. Escolha baseado no que você precisa hoje, não no que pode precisar depois.
          </p>

          <p>
            Todos os 3 são MIT-licensed ou tier gratuito honesto. Todos passam validação matemática. A diferença tá em cobertura + correlação. Meu voto: começa com <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">python-brasilidades</code> se app é simples, migra pra FakeForge quando precisar dos presets verticais.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            <Link href="/" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Testar FakeForge</Link>
            <Link href="/preset-fintech" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Ver preset fintech</Link>
            <Link href="/comparacao/fakeforge-vs-python-brasilidades" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Comparação FakeForge vs python-brasilidades</Link>
          </div>
        </div>

        <BlogPostingSchema
          title="Popular Django com dados brasileiros: seed do ORM com CPF, CNPJ e PIX"
          description="Guia completo pra popular banco Django com dados brasileiros válidos: CPF, CNPJ, endereços, PIX, cartão. Migração, seed via ORM, comparação Faker vs FakeForge vs python-brasilidades."
          slug="popular-django-dados-brasileiros-seed-orm"
          datePublished="2026-09-24"
        />
      </article>
    </PageShell>
  );
}
