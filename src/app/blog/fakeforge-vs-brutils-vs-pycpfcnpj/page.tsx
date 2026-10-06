import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BlogFeaturedImage from "@/components/BlogFeaturedImage";
import ShareBar from "@/components/ShareBar";
import BlogPostingSchema from "@/components/BlogPostingSchema";

export const metadata: Metadata = {
  title: "FakeForge vs brutils-py vs pycpfcnpj: qual escolher em Python?",
  description: "Comparativo honesto entre as 3 principais libs Python pra dados brasileiros fictícios: FakeForge (API-first), brutils-py (standalone completo) e pycpfcnpj (lib mínima). Casos de uso, código, benchmarks.",
  keywords: "fakeforge python, brutils-py, pycpfcnpj, biblioteca python cpf cnpj, python dados brasileiros teste, python gerador cpf valido, mkfbr python, python-brasilidades",
  alternates: { canonical: "/blog/fakeforge-vs-brutils-vs-pycpfcnpj" },
  openGraph: {
    title: "FakeForge vs brutils-py vs pycpfcnpj: qual escolher em Python?",
    description: "Comparativo honesto entre as 3 principais libs Python pra dados brasileiros fictícios. Casos de uso, código real, decisão por cenário.",
    type: "article",
    locale: "pt_BR",
    images: ["/api/og?title=FakeForge%20vs%20brutils-py%20vs%20pycpfcnpj&subtitle=Qual%20escolher%20pra%20dados%20brasileiros%20em%20Python&category=COMPARATIVOS"],
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
          category="Comparativos"
          title="FakeForge vs brutils-py vs pycpfcnpj: qual escolher em Python?"
          className="mb-6"
        />

        <h1 className="text-3xl font-bold tracking-tight mb-3">
          FakeForge vs brutils-py vs pycpfcnpj: qual escolher em Python?
        </h1>
        <p className="text-xs text-muted mb-6">6 min de leitura</p>

        <ShareBar title="FakeForge vs brutils-py vs pycpfcnpj: qual escolher em Python?" path="/blog/fakeforge-vs-brutils-vs-pycpfcnpj" />

        <div className="prose prose-sm max-w-none text-foreground mt-8 space-y-6 leading-relaxed">
          <p>
            Dev Python no Brasil tem 5 libs principais pra gerar/validar CPF, CNPJ e outros documentos: <strong>pycpfcnpj</strong>,
            {" "}<strong>brutils-py</strong>, <strong>mkfbr</strong>, <strong>python-brasilidades</strong> e o
            {" "}<strong>fakeforge-br</strong> (publicado agora em 2026). Esse post compara as 3 que valem a pena entender a fundo pra decisão de projeto.
          </p>

          <p>
            <strong>TL;DR</strong>: se seu uso é "quero validar/gerar 1 CPF em Python puro, sem HTTP", usa <code>pycpfcnpj</code> (lib madura, 10 anos de maturidade). Se precisa de mais docs standalone (RG, CNH, CEP, PIX validação), usa <code>brutils-py</code>. Se precisa de <strong>pessoa completa correlacionada</strong> (nome ↔ email ↔ CPF ↔ endereço ↔ PIX), <strong>CNPJ alfanumérico 2026</strong>, ou gerar <strong>SQL direto</strong> pra seed em escala, usa <code>fakeforge-br</code>.
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4">Instalação lado a lado</h2>

          <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# pycpfcnpj — a lib histórica
pip install pycpfcnpj

# brutils-py — standalone completo
pip install brutils

# fakeforge-br — API-first + presets correlacionados
pip install fakeforge-br`}</code></pre>

          <h2 className="text-xl font-bold mt-10 mb-4">Gerar 1 CPF válido: código de cada uma</h2>

          <h3 className="text-base font-semibold mt-6 mb-2">pycpfcnpj</h3>
          <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`from pycpfcnpj import gen

cpf = gen.cpf()           # "12345678909"
cpf_formatted = gen.cpf_with_punctuation()  # "123.456.789-09"`}</code></pre>

          <h3 className="text-base font-semibold mt-6 mb-2">brutils-py</h3>
          <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`from brutils import cpf

numero = cpf.generate()                       # "12345678909"
numero_formatado = cpf.format_cpf(numero)     # "123.456.789-09"`}</code></pre>

          <h3 className="text-base font-semibold mt-6 mb-2">fakeforge-br</h3>
          <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`from fakeforge import FakeForge

ff = FakeForge()
cpfs = ff.cpf(10)   # 10 CPFs formatados em 1 chamada
# ['123.456.789-09', '987.654.321-00', ...]`}</code></pre>

          <p className="text-sm">
            <strong>Diferença de design:</strong> pycpfcnpj e brutils-py geram 1 CPF por função call. fakeforge-br gera N de uma vez (default quantity). Pra popular banco de 10K registros, isso vira 10K vs 1 chamada.
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4">O caso de uso que separa as 3 libs</h2>

          <p>
            Imagine que você precisa popular banco de staging com <strong>500 clientes</strong> onde cada cliente tem: nome, CPF válido, email derivado do nome, telefone com DDD do mesmo estado do CEP, e endereço completo.
          </p>

          <h3 className="text-base font-semibold mt-6 mb-2">Com pycpfcnpj (não cobre endereço)</h3>
          <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`from pycpfcnpj import gen
from faker import Faker

faker = Faker("pt_BR")

customers = []
for _ in range(500):
    name = faker.name()
    customers.append({
        "name": name,
        "cpf": gen.cpf_with_punctuation(),
        # email, telefone e CEP vêm do faker ou código custom
        "email": name.lower().replace(" ", ".") + "@gmail.com",
        "phone": faker.phone_number(),
        "cep": faker.postcode(),
        # ⚠️ nada bate: email não deriva do CPF, telefone não combina com CEP
    })`}</code></pre>

          <p className="text-sm">
            Funciona, mas você acabou de escrever 20 linhas de código de glue, e os campos <strong>não são coerentes entre si</strong>. Email não bate com nome em várias combinações, DDD do telefone não bate com estado do CEP.
          </p>

          <h3 className="text-base font-semibold mt-6 mb-2">Com brutils-py (standalone, melhor que o anterior)</h3>
          <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`from brutils import cpf, cep, telefone
from faker import Faker

faker = Faker("pt_BR")

customers = []
for _ in range(500):
    name = faker.name()
    customers.append({
        "name": name,
        "cpf": cpf.format_cpf(cpf.generate()),
        "email": name.lower().replace(" ", ".") + "@gmail.com",
        "phone": telefone.generate_telefone(),
        "cep": cep.generate(),
        # ⚠️ ainda sem correlação entre campos
    })`}</code></pre>

          <h3 className="text-base font-semibold mt-6 mb-2">Com fakeforge-br</h3>
          <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`from fakeforge import FakeForge

ff = FakeForge()
customers = ff.preset("customer", 500)

# Cada registro já vem:
# - nome: "João Silva Souza"
# - cpf: "123.456.789-09" (mod-11 válido)
# - email: "joao.silva.souza@gmail.com" (derivado do nome)
# - phone: "(11) 98765-4321" (DDD 11 pq o endereço é SP)
# - address.state: "SP"
# - address.city: "São Paulo"
# - address.cep: "01310-100" (prefixo correto de SP)`}</code></pre>

          <p className="text-sm">
            1 chamada. Zero código de glue. Correlação garantida. O trade-off é a dependência de API HTTP (que falha offline, se seu CI não tem internet).
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4">Matriz de features completa</h2>

          <div className="overflow-x-auto rounded-lg bg-card border border-border">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-3 py-2 text-muted">Recurso</th>
                  <th className="text-center px-3 py-2 text-muted">pycpfcnpj</th>
                  <th className="text-center px-3 py-2 text-muted">brutils-py</th>
                  <th className="text-center px-3 py-2 text-muted">fakeforge-br</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ["CPF com mod-11", "✅", "✅", "✅"],
                  ["CNPJ com mod-11", "✅", "✅", "✅"],
                  ["CNPJ alfanumérico (vigor 01/07/2026)", "❌", "❌", "✅"],
                  ["CEP válido por estado", "❌", "✅ (gen)", "✅ (prefixo correto)"],
                  ["Endereço completo (rua, bairro, cidade, UF)", "❌", "❌", "✅"],
                  ["Telefone com DDD ANATEL", "❌", "✅", "✅ (67 DDDs)"],
                  ["RG, CNH, RENAVAM, PIS", "❌", "✅", "✅"],
                  ["Chave PIX BACEN (4 formatos)", "❌", "❌", "✅"],
                  ["QR Code PIX EMV", "❌", "❌", "✅ (via API)"],
                  ["Cartão com Luhn + bandeira", "❌", "❌", "✅"],
                  ["Conta bancária com DV por banco", "❌", "❌", "✅ (17 bancos)"],
                  ["Pessoa correlacionada (nome↔email↔DDD↔CEP)", "❌", "❌", "✅"],
                  ["Presets bundle (customer, fintech, ecom)", "❌", "❌", "✅"],
                  ["Export CSV / SQL / JSON", "❌", "❌", "✅ (via API)"],
                  ["API HTTP (consume de outras linguagens)", "❌", "❌", "✅"],
                  ["Zero dependências runtime", "✅", "✅", "✅"],
                  ["Funciona offline", "✅", "✅", "⚠️ (SDK precisa de internet)"],
                  ["Comunidade e maturidade", "10+ anos", "5+ anos", "2026, nova"],
                ].map(([a, b, c, d]) => (
                  <tr key={a}>
                    <td className="px-3 py-2 text-foreground">{a}</td>
                    <td className="px-3 py-2 text-center text-muted-foreground">{b}</td>
                    <td className="px-3 py-2 text-center text-muted-foreground">{c}</td>
                    <td className="px-3 py-2 text-center text-muted-foreground">{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-bold mt-10 mb-4">Quando escolher cada uma</h2>

          <h3 className="text-base font-semibold mt-6 mb-2">Use pycpfcnpj se:</h3>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Precisa só de CPF ou CNPJ puros (gerar e validar)</li>
            <li>Quer lib super madura, 10+ anos, zero surpresas</li>
            <li>Prefere função simples <code>gen.cpf()</code>, uma chamada por documento</li>
            <li>Projeto rodando em ambiente offline (airgap)</li>
          </ul>

          <h3 className="text-base font-semibold mt-6 mb-2">Use brutils-py se:</h3>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Precisa de mais documentos BR standalone (RG, CNH, CEP, telefone)</li>
            <li>Quer lib ativa com cobertura ampla sem HTTP</li>
            <li>Está construindo validador de documentos (não gerador em escala)</li>
            <li>Prefere lib brasileira community-maintained</li>
          </ul>

          <h3 className="text-base font-semibold mt-6 mb-2">Use fakeforge-br se:</h3>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Precisa popular banco com <strong>pessoas correlacionadas</strong> (nome, CPF, email, telefone, endereço coerentes entre si)</li>
            <li>Quer <strong>PIX BACEN</strong> ou <strong>cartão com Luhn</strong> pra testar checkout em sandbox (Stripe, Pagar.me, Mercado Pago)</li>
            <li>Precisa cobertura de <strong>CNPJ alfanumérico 2026</strong> (vigor 01/07/2026)</li>
            <li>Quer gerar <strong>SQL direto</strong> pra popular 10K+ registros sem código de glue</li>
            <li>Tem stack poliglota (Python no backend, Node no frontend) e quer <strong>mesma fonte</strong> de dados pros 2</li>
            <li>Precisa de export CSV/SQL automático pra onboarding de equipe de QA</li>
          </ul>

          <h2 className="text-xl font-bold mt-10 mb-4">E as outras libs?</h2>

          <p className="text-sm">
            <strong>mkfbr</strong> (make_a_fake_brazilian) é lib menor que gera pessoa completa standalone (nome, endereço, CPF, CNPJ, idade). Útil se você precisa de pessoa em dev local sem internet, não cobre PIX nem presets avançados.
          </p>
          <p className="text-sm">
            <strong>python-brasilidades</strong> é a lib histórica brasileira, estável, cobre bem documentos mas não gera dados correlacionados nem PIX BACEN. Fit similar ao pycpfcnpj.
          </p>
          <p className="text-sm">
            <strong>faker-js/faker (locale pt_BR)</strong> é o padrão JS, mas a localização pt-BR do faker <strong>NÃO gera CPF válido mod-11</strong>. Só gera 11 dígitos aleatórios no formato visual. Pra teste de regra de validação, falha imediato. Vale só pra nome e endereço genéricos.
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4">Decisão em 3 perguntas</h2>

          <ol className="list-decimal list-inside space-y-2 pl-2">
            <li>
              <strong>Vou gerar 10 CPFs em teste unitário?</strong>
              <br />
              → <code>pycpfcnpj</code> ou <code>brutils-py</code>. Mais rápido, zero overhead HTTP.
            </li>
            <li>
              <strong>Vou popular banco com milhares de registros correlacionados?</strong>
              <br />
              → <code>fakeforge-br</code>. 1 chamada vs 500 funções. Correlação garantida.
            </li>
            <li>
              <strong>Vou testar checkout com PIX e cartão?</strong>
              <br />
              → <code>fakeforge-br</code> é a única que gera chave PIX BACEN e cartão com Luhn+bandeira.
            </li>
          </ol>

          <h2 className="text-xl font-bold mt-10 mb-4">Posso usar as 3 juntas?</h2>

          <p className="text-sm">
            Sim. Caso real: validação de input no backend com <code>brutils-py</code> ou <code>pycpfcnpj</code> (standalone, rápido), e seed de banco de staging com <code>fakeforge-br</code> (correlacionado, em volume). As 3 têm licença permissiva (MIT ou similar), zero conflito.
          </p>

          <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# backend: validação de input de user
from brutils import cpf
if not cpf.is_valid(user_input["cpf"]):
    raise ValueError("CPF inválido")

# seed script (uma vez por deploy): popula staging
from fakeforge import FakeForge
customers = FakeForge().preset("customer", 10000)
# bulk_insert no banco`}</code></pre>

          <h2 className="text-xl font-bold mt-10 mb-4">Instalação dos 3 pra experimentar</h2>

          <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`pip install pycpfcnpj brutils fakeforge-br`}</code></pre>

          <p className="text-sm">
            Depois, roda cada um e compara. A escolha certa depende do seu caso, não da popularidade da lib. Pra teste unitário simples, uma lib tiny ganha. Pra seed em escala com correlação, API ganha.
          </p>

          <section className="mt-10 pt-8 border-t border-border">
            <h3 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wider">Ver também</h3>
            <div className="flex flex-wrap gap-2">
              <Link href="/gerador-cpf-python" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Gerar CPF em Python</Link>
              <Link href="/validar-cpf-python" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Validar CPF em Python</Link>
              <Link href="/blog/popular-django-dados-brasileiros-seed-orm" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Seed Django com dados brasileiros</Link>
              <Link href="/docs" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Docs da API FakeForge</Link>
            </div>
          </section>
        </div>
      </article>

      <BlogPostingSchema
        title="FakeForge vs brutils-py vs pycpfcnpj: qual escolher em Python?"
        description="Comparativo honesto entre as 3 principais libs Python pra dados brasileiros fictícios: FakeForge, brutils-py e pycpfcnpj."
        datePublished="2026-10-06"
        slug="fakeforge-vs-brutils-vs-pycpfcnpj"
      />
    </PageShell>
  );
}
