import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de CNPJ em Python: SDK + Alfanumérico 2026 (2026)",
  description: "Gere CNPJ válido em Python (numérico e alfanumérico 2026) com SDK fakeforge-br. Snippets pra pytest, Django, Flask, FastAPI. Algoritmo mod-11 local incluído. Grátis 50/dia.",
  keywords: "gerador cnpj python, gerar cnpj python, cnpj valido python, cnpj alfanumerico python 2026, cnpj django python, cnpj pytest, cnpj fastapi, cnpj sintetico python",
  alternates: { canonical: "/gerador-cnpj-python" },
  openGraph: {
    title: "Gerador de CNPJ em Python — SDK + algoritmo local",
    description: "SDK oficial fakeforge-br cobre CNPJ numérico e alfanumérico 2026. Snippets prontos pra pytest, Django, FastAPI.",
    type: "article",
    locale: "pt_BR",
  },
};

export default function GeradorCnpjPython() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Python · SDK + algoritmo</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">CNPJ em Python</span>
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Duas rotas: SDK oficial <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">fakeforge-br</code> (cobre CNPJ numérico + alfanumérico 2026) ou algoritmo mod-11 local em Python puro. Snippets pra pytest, Django, Flask e FastAPI. Grátis 50/dia sem cadastro.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`pip install fakeforge-br

from fakeforge import FakeForge
ff = FakeForge()

cnpjs = ff.cnpj(100)              # 100 CNPJs numéricos válidos
cnpjs_alfa = ff.cnpj_alfa(50)     # 50 CNPJs alfanuméricos 2026`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">CNPJ alfanumérico 2026 (importante)</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
          A IN RFB 2.229 obriga sistemas a aceitar CNPJ com letras a partir de 1º de julho de 2026. Se seu sistema Python valida CNPJ hoje via regex ou biblioteca antiga, provavelmente vai quebrar. Testa desde já com os novos formatos:
        </p>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`from fakeforge import FakeForge

ff = FakeForge()

# Gera 20 CNPJs no novo formato alfanumérico
cnpjs_alfa = ff.cnpj_alfa(20, formatted=True)
for c in cnpjs_alfa:
    print(c)
    # 12.ABC.678/0001-90
    # AB.234.567/0001-XY
    # ...

# Usa pra testar seu validador
from myapp.validators import validar_cnpj
resultados = [validar_cnpj(c) for c in cnpjs_alfa]
assert all(resultados), "Seu validador quebra no formato 2026!"`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Algoritmo mod-11 local (numérico)</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# gerador_cnpj.py - Python puro, offline
import random

def gerar_cnpj(formatado: bool = True) -> str:
    """Gera CNPJ válido pelo algoritmo mod-11 da Receita."""
    # 8 dígitos base + /0001 (matriz)
    n = [random.randint(0, 9) for _ in range(8)] + [0, 0, 0, 1]

    pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

    s1 = sum(a * b for a, b in zip(n, pesos1))
    d1 = (s1 % 11)
    d1 = 0 if d1 < 2 else 11 - d1
    n.append(d1)

    s2 = sum(a * b for a, b in zip(n, pesos2))
    d2 = (s2 % 11)
    d2 = 0 if d2 < 2 else 11 - d2
    n.append(d2)

    if formatado:
        return f"{n[0]}{n[1]}.{n[2]}{n[3]}{n[4]}.{n[5]}{n[6]}{n[7]}/{n[8]}{n[9]}{n[10]}{n[11]}-{n[12]}{n[13]}"
    return "".join(str(d) for d in n)`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Uso em Django (empresa model)</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# myapp/management/commands/seed_empresas.py
from django.core.management.base import BaseCommand
from fakeforge import FakeForge
from myapp.models import Empresa

class Command(BaseCommand):
    def handle(self, *args, **options):
        ff = FakeForge()
        cnpjs = ff.cnpj(500)  # 500 empresas com CNPJ válido

        Empresa.objects.bulk_create([
            Empresa(razao_social=f"Empresa {i}", cnpj=cnpj)
            for i, cnpj in enumerate(cnpjs)
        ])

        # E 100 empresas com CNPJ alfanumérico 2026
        cnpjs_alfa = ff.cnpj_alfa(100)
        Empresa.objects.bulk_create([
            Empresa(razao_social=f"Empresa Alfa {i}", cnpj=cnpj)
            for i, cnpj in enumerate(cnpjs_alfa)
        ])`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Uso em pytest</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# tests/test_cnpj_validator.py
import pytest
from fakeforge import FakeForge
from myapp.validators import validar_cnpj

@pytest.fixture(scope="session")
def ff():
    return FakeForge()

@pytest.mark.parametrize("indice", range(20))
def test_valida_cnpj_numerico(ff, indice):
    cnpj = ff.cnpj(1)[0]
    assert validar_cnpj(cnpj), f"Falhou pro CNPJ {cnpj}"

@pytest.mark.parametrize("indice", range(20))
def test_valida_cnpj_alfanumerico_2026(ff, indice):
    """IN RFB 2.229 vigência 01/07/2026."""
    cnpj = ff.cnpj_alfa(1)[0]
    assert validar_cnpj(cnpj), f"Validador NÃO aceita formato 2026: {cnpj}"`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Próximos passos</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Testar API</Link>
          <Link href="/gerador-cnpj-alfanumerico" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">CNPJ Alfa 2026</Link>
          <Link href="/gerador-cnpj-nodejs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Versão Node</Link>
          <Link href="/blog/cnpj-alfanumerico-checklist-migracao-2026" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Checklist 2026</Link>
        </div>
      </section>

      <BreadcrumbSchema items={[{ name: "Início", url: "/" }, { name: "Gerador CNPJ", url: "/gerador-cnpj" }, { name: "Python", url: "/gerador-cnpj-python" }]} />
    </PageShell>
  );
}
