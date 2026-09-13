import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "FakeForge vs. python-brasilidades: Qual Escolher?",
  description: "Comparação direta entre FakeForge e python-brasilidades pra gerar dados brasileiros em testes Python. python-brasilidades é a alternativa mais próxima. Saiba quando cada uma faz mais sentido.",
  keywords: "fakeforge vs python-brasilidades, alternativa python-brasilidades, gerar cpf python, biblioteca dados brasileiros python, python fake data brazil, django seed cpf cnpj",
  alternates: { canonical: "/comparacao/fakeforge-vs-python-brasilidades" },
  openGraph: {
    title: "FakeForge vs. python-brasilidades",
    description: "Comparação direta em Python. Qual escolher pra teste, seed de Django ou fixture pytest.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function FakeForgeVsPythonBrasilidades() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Comparação de ferramentas</p>
        <h1 className="text-3xl font-bold tracking-tight">
          FakeForge vs. <span className="text-primary">python-brasilidades</span>
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          As duas bibliotecas geram documentos brasileiros válidos em Python. python-brasilidades é a
          alternativa mais próxima do FakeForge no ecossistema Python. As diferenças importam quando
          você precisa de CNPJ alfanumérico 2026, presets correlacionados ou stack polyglot.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-card border border-border p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
          <li>
            <strong className="text-foreground">python-brasilidades:</strong> lib Python madura com CPF,
            CNPJ, RG, CNH válidos. Cobre básico e funciona offline (sem chamar API). Zero deps runtime.
          </li>
          <li>
            <strong className="text-foreground">FakeForge:</strong> tem SDK Python (`pip install fakeforge`)
            + presets correlacionados + CNPJ alfanumérico 2026 + API HTTP pra polyglot.
          </li>
          <li>
            <strong className="text-foreground">Quando python-brasilidades chega:</strong> use ela. Mais
            simples, offline, menor superfície.
          </li>
          <li>
            <strong className="text-foreground">Quando FakeForge chega:</strong> presets, novo formato CNPJ,
            CI em múltiplas linguagens, seed de banco em volume alto.
          </li>
        </ul>
      </section>

      <section className="mb-8 rounded-xl bg-card border border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Comparação lado a lado</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-3 py-2 text-muted-foreground font-medium">Recurso</th>
                <th className="text-center px-3 py-2 text-primary font-medium">FakeForge</th>
                <th className="text-center px-3 py-2 text-muted-foreground font-medium">python-brasilidades</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["CPF com mod-11", "✅", "✅"],
                ["CNPJ com mod-11", "✅", "✅"],
                ["CNPJ alfanumérico 2026", "✅", "❌"],
                ["Cartão com Luhn", "✅", "❌"],
                ["Chave PIX BACEN (4 formatos)", "✅", "❌"],
                ["RG por estado", "✅", "✅"],
                ["CNH DENATRAN", "✅", "✅"],
                ["Correlação nome ↔ email ↔ DDD", "✅", "❌"],
                ["Presets bundle (customer, employee)", "✅", "❌"],
                ["17 bancos com DV", "✅", "❌"],
                ["Offline (sem chamar API)", "❌ (chama api.fakeforge.com.br)", "✅"],
                ["SDK Python oficial", "✅ (pip install fakeforge)", "✅ (pip install brasilidades)"],
                ["Zero deps runtime", "✅", "✅"],
                ["Uso via API HTTP (polyglot)", "✅", "❌"],
              ].map(([recurso, ff, brasilidades], i) => (
                <tr key={i}>
                  <td className="px-3 py-2 text-muted-foreground">{recurso}</td>
                  <td className="px-3 py-2 text-center text-foreground font-medium">{ff}</td>
                  <td className="px-3 py-2 text-center text-muted-foreground">{brasilidades}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Código lado a lado</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-2">python-brasilidades</p>
            <pre className="bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`from brasilidades.documentos import cpf, cnpj

# Gera 1 CPF
c = cpf.gerar()  # "123.456.789-09"

# Gera 1 CNPJ
n = cnpj.gerar()  # "12.345.678/0001-90"

# Loop pra volume
cpfs = [cpf.gerar() for _ in range(1000)]`}</code></pre>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-2">FakeForge SDK</p>
            <pre className="bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`from fakeforge import FakeForge

ff = FakeForge()

# Gera 1000 CPFs em 1 chamada
cpfs = ff.cpf(1000)

# Gera 100 pessoas correlacionadas
customers = ff.preset("customer", 100)
# Cada customer tem CPF + email deriva
# do nome + DDD × UF coerente

# CNPJ alfanumérico 2026
cnpjs = ff.cnpj_alfa(50)`}</code></pre>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Quando escolher cada</h2>

        <div className="rounded-lg border-l-4 border-primary bg-primary/5 p-4 mb-4">
          <p className="text-sm font-semibold text-foreground mb-1">Use python-brasilidades se:</p>
          <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
            <li>Você quer geração 100% offline sem dependência de API externa</li>
            <li>Só precisa dos tipos básicos: CPF, CNPJ, CNH, RG</li>
            <li>Não precisa de correlação entre campos (email deriva do nome, DDD × UF)</li>
            <li>Prefere lib madura com anos de mercado</li>
            <li>Não usa outras linguagens no CI (só Python)</li>
          </ul>
        </div>

        <div className="rounded-lg border-l-4 border-accent bg-accent/5 p-4 mb-4">
          <p className="text-sm font-semibold text-foreground mb-1">Use FakeForge se:</p>
          <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
            <li>Precisa de CNPJ alfanumérico 2026 (IN RFB 2.229) - único que cobre</li>
            <li>Quer presets correlacionados (customer com CPF + email + endereço + PIX)</li>
            <li>Precisa gerar chave PIX BACEN, cartão com Luhn, ou conta bancária com DV real</li>
            <li>Tem stack polyglot (Python + Node + Go) - API HTTP evita instalar dep em cada linguagem</li>
            <li>Precisa de volume alto (10.000+ items por chamada no plano Dev)</li>
          </ul>
        </div>

        <div className="rounded-lg border-l-4 border-success bg-success/5 p-4">
          <p className="text-sm font-semibold text-foreground mb-1">Use as duas se:</p>
          <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
            <li>Testes unitários offline com python-brasilidades + testes E2E com FakeForge preset customer</li>
            <li>Django app + microserviços em Node: python-brasilidades no Django + FakeForge no Node</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Django seed side-by-side</h2>
        <p className="text-sm text-muted-foreground mb-3">
          Exemplo prático: popular tabela Customer com 1000 registros usando cada biblioteca.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-2">python-brasilidades</p>
            <pre className="bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`from brasilidades.documentos import cpf
from faker import Faker

fake = Faker("pt_BR")

for _ in range(1000):
    Customer.objects.create(
        cpf=cpf.gerar(),
        name=fake.name(),
        email=fake.email(),
        phone=fake.phone_number(),
        # Note: campos NÃO correlacionados
        # email não deriva do name
    )`}</code></pre>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-2">FakeForge SDK</p>
            <pre className="bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`from fakeforge import FakeForge

ff = FakeForge(api_key="sua_key")

customers = ff.preset("customer", 1000)

Customer.objects.bulk_create([
    Customer(
        cpf=c["cpf"],
        name=c["name"],
        email=c["email"],       # deriva do nome
        phone=c["phone"],       # DDD bate com UF
        address=c["address"],   # coerente
    )
    for c in customers
])`}</code></pre>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
          A diferença é que <strong className="text-foreground">FakeForge devolve dados coerentes entre si</strong>{" "}
          - útil pra teste de sistemas de antifraude, KYC, ou cross-check de dados. python-brasilidades
          entrega campos independentes válidos, o que basta pra maioria dos testes.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Outras comparações relacionadas</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/comparacoes" className="px-3 py-1.5 rounded-lg text-xs bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors">Todas as comparações</Link>
          <Link href="/comparacao/fakeforge-vs-faker-py" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">FakeForge vs. Faker (Python)</Link>
          <Link href="/comparacao/fakeforge-vs-validate-docbr" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">FakeForge vs. validate-docbr</Link>
          <Link href="/comparacao/fakeforge-vs-mockaroo" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">FakeForge vs. Mockaroo</Link>
        </div>
      </section>
    </PageShell>
  );
}
