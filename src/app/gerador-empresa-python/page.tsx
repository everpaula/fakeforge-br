import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de Empresa em Python: SDK + CNPJ + Seed Django (2026)",
  description: "Gere empresa fictícia completa em Python (CNPJ, razão social, endereço e telefone correlacionados) com SDK fakeforge-br. Seed pronto pra Django. Grátis 50/dia.",
  keywords: "gerador de empresa python, gerar cnpj empresa python, empresa fake python, django seed empresa, cnpj razao social python, preset company python",
  alternates: { canonical: "/gerador-empresa-python" },
  openGraph: {
    title: "Gerador de Empresa em Python — SDK + algoritmo local",
    description: "SDK oficial fakeforge-br gera CNPJ + razão social + endereço correlacionados. Seed pronto pra Django.",
    type: "article",
    locale: "pt_BR",
  },
};

export default function GeradorEmpresaPython() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Python · SDK + algoritmo</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">Empresa em Python</span>
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Pra gerar empresa fictícia completa em Python (CNPJ, razão social, endereço e telefone correlacionados), instale <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">pip install fakeforge-br</code> e chame <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">FakeForge().company(n)</code>. O CNPJ usa o algoritmo mod-11 da Receita com sufixo /0001 (matriz), e o endereço acompanha um DDD e estado coerentes.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`pip install fakeforge-br

from fakeforge import FakeForge
empresas = FakeForge().company(50)  # 50 empresas com CNPJ + razão social + endereço`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Rota 1: SDK oficial fakeforge-br</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
          A mais rápida. <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">.company(n)</code> retorna objeto completo por empresa.
        </p>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`from fakeforge import FakeForge

ff = FakeForge()

# 50 empresas fictícias completas
empresas = ff.company(50)
for e in empresas:
    print(e["razao_social"], e["cnpj"], e["endereco"]["estado"])

# Preset company (mesma coisa, via schema builder)
empresas_preset = ff.preset("company", 100)

# Só o CNPJ, sem os outros campos
cnpjs = ff.cnpj(1000)`}</code></pre>

        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          Vantagens: CNPJ, razão social, endereço e telefone já correlacionados, presets B2B, bulk até 10k por chamada. Requer internet.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Rota 2: algoritmo local (offline)</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
          O CNPJ segue o mesmo mod-11 da Receita. Pra correlacionar endereço, um mapa simples de DDD para estado já resolve a maioria dos casos de teste:
        </p>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# gerador_empresa.py - implementação pura, offline
import random

SUFIXOS = ["LTDA", "S.A.", "ME", "EIRELI"]
DDD_PARA_ESTADO = {
    11: "SP", 21: "RJ", 31: "MG", 41: "PR",
    51: "RS", 61: "DF", 71: "BA", 81: "PE", 91: "PA",
}


def gerar_cnpj(formatado: bool = True) -> str:
    """Gera CNPJ válido pelo algoritmo mod-11 da Receita, sufixo /0001 (matriz)."""
    n = [random.randint(0, 9) for _ in range(8)] + [0, 0, 0, 1]

    pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

    s1 = sum(a * b for a, b in zip(n, pesos1))
    d1 = 0 if (s1 % 11) < 2 else 11 - (s1 % 11)
    n.append(d1)

    s2 = sum(a * b for a, b in zip(n, pesos2))
    d2 = 0 if (s2 % 11) < 2 else 11 - (s2 % 11)
    n.append(d2)

    if formatado:
        return f"{n[0]}{n[1]}.{n[2]}{n[3]}{n[4]}.{n[5]}{n[6]}{n[7]}/{n[8]}{n[9]}{n[10]}{n[11]}-{n[12]}{n[13]}"
    return "".join(str(d) for d in n)


def gerar_empresa() -> dict:
    """Gera empresa fictícia com CNPJ, razão social e endereço correlacionados."""
    ddd = random.choice(list(DDD_PARA_ESTADO.keys()))
    estado = DDD_PARA_ESTADO[ddd]
    return {
        "razao_social": f"Comercial {random.randint(100, 999)} {random.choice(SUFIXOS)}",
        "cnpj": gerar_cnpj(),
        "estado": estado,
        "telefone": f"({ddd}) 9{random.randint(1000, 9999)}-{random.randint(1000, 9999)}",
    }`}</code></pre>

        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          Vantagens: zero deps, offline, controle total sobre a correlação. Limitação: endereço simplificado a um mapa fixo de DDDs, sem nome fantasia nem CNPJ alfanumérico 2026.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Uso em Django (seed de empresas)</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# myapp/management/commands/seed_empresas.py
from django.core.management.base import BaseCommand
from fakeforge import FakeForge
from myapp.models import Empresa

class Command(BaseCommand):
    def handle(self, *args, **options):
        ff = FakeForge()
        empresas = ff.company(500)  # 500 empresas correlacionadas

        Empresa.objects.bulk_create([
            Empresa(
                razao_social=e["razao_social"],
                cnpj=e["cnpj"],
                endereco=e["endereco"]["logradouro"],
                estado=e["endereco"]["estado"],
                telefone=e["telefone"],
            )
            for e in empresas
        ])
        self.stdout.write(f"{len(empresas)} empresas seeded")`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Comparação: qual escolher</h2>
        <div className="overflow-x-auto rounded-lg bg-card border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-3 py-2 text-muted">Cenário</th>
                <th className="text-center px-3 py-2 text-muted">SDK fakeforge-br</th>
                <th className="text-center px-3 py-2 text-muted">Algoritmo local</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["Só CNPJ simples", "✅", "✅"],
                ["Empresa completa correlacionada", "✅", "⚠️ simplificado"],
                ["Endereço com CEP coerente", "✅", "❌"],
                ["100% offline", "❌", "✅"],
                ["Bulk 10k+", "✅ 1 chamada", "⚠️ loop"],
                ["Custo", "Free 50/dia", "R$0"],
              ].map(([c, sdk, local], i) => (
                <tr key={i}>
                  <td className="px-3 py-2 text-muted-foreground">{c}</td>
                  <td className="px-3 py-2 text-center text-foreground">{sdk}</td>
                  <td className="px-3 py-2 text-center text-foreground">{local}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Perguntas frequentes</h2>
        <div className="space-y-4">
          {[
            { q: "O CNPJ da empresa gerada em Python é válido?", a: "Tem dígitos verificadores válidos pelo algoritmo mod-11 (passa em qualquer validação de formato), mas não está registrado na Receita Federal. A empresa é fictícia." },
            { q: "Dá pra usar esse CNPJ pra testar emissão de NF-e em homologação?", a: "Sim, é um dos usos mais comuns. Ambientes de homologação de NF-e aceitam CNPJ com formato válido mesmo sem CNPJ real, já que não consultam a Receita em produção." },
            { q: "O endereço da empresa é coerente com o CNPJ?", a: "No SDK sim, o endereço é gerado junto com CNPJ, razão social e telefone no mesmo objeto. No algoritmo local, a correlação usa um mapa simplificado de DDD para estado." },
            { q: "Dá pra popular banco Django com empresas fictícias em lote?", a: "Sim. Use ff.company(n) num management command com bulk_create, como no exemplo desta página. Suporta até 10.000 empresas por chamada no SDK." },
          ].map(({ q, a }) => (
            <details key={q} className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">{q}</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Próximos passos</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Testar API</Link>
          <Link href="/gerador-empresa-nodejs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Versão Node.js</Link>
          <Link href="/gerador-empresa-curl" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Versão curl</Link>
          <Link href="/gerador-empresa" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Gerador de Empresa</Link>
          <Link href="/gerador-cnpj-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Só CNPJ (Python)</Link>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "O CNPJ da empresa gerada em Python é válido?", acceptedAnswer: { "@type": "Answer", text: "Tem dígitos verificadores válidos pelo algoritmo mod-11, mas não está registrado na Receita Federal. A empresa é fictícia." } },
              { "@type": "Question", name: "Dá pra usar esse CNPJ pra testar emissão de NF-e em homologação?", acceptedAnswer: { "@type": "Answer", text: "Sim. Ambientes de homologação de NF-e aceitam CNPJ com formato válido mesmo sem estar registrado na Receita." } },
              { "@type": "Question", name: "O endereço da empresa é coerente com o CNPJ?", acceptedAnswer: { "@type": "Answer", text: "No SDK sim, gerado junto com CNPJ, razão social e telefone no mesmo objeto correlacionado." } },
              { "@type": "Question", name: "Dá pra popular banco Django com empresas fictícias em lote?", acceptedAnswer: { "@type": "Answer", text: "Sim. Use ff.company(n) num management command com bulk_create, suportando até 10.000 empresas por chamada." } },
            ],
          }),
        }}
      />

      <BreadcrumbSchema items={[{ name: "Início", url: "/" }, { name: "Gerador Empresa", url: "/gerador-empresa" }, { name: "Python", url: "/gerador-empresa-python" }]} />
    </PageShell>
  );
}
