import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de CNH em Python: SDK + Algoritmo DENATRAN",
  description: "Gere CNH válida em Python com o SDK fakeforge-br. Algoritmo mod-11 DENATRAN federal. Snippets pra pytest, Django, FastAPI. Uso restrito a desenvolvimento e QA.",
  keywords: "gerador cnh python, gerar cnh python, cnh valida python, algoritmo denatran python, cnh pytest, cnh django python, cnh fastapi",
  alternates: { canonical: "/gerador-cnh-python" },
  openGraph: { title: "Gerador de CNH em Python", description: "SDK oficial + mod-11 DENATRAN.", type: "article", locale: "pt_BR" },
};

export default function GeradorCnhPython() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Python · SDK + DENATRAN</p>
        <h1 className="text-3xl font-bold tracking-tight">Gerador de <span className="text-primary">CNH em Python</span></h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          SDK <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">fakeforge-br</code> gera CNH com dígitos verificadores mod-11 do DENATRAN. Snippets pra pytest, Django, FastAPI. Grátis 50/dia.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`pip install fakeforge-br

from fakeforge import FakeForge
cnhs = FakeForge().cnh(100)`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">SDK oficial</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`from fakeforge import FakeForge

ff = FakeForge()

# 100 CNHs válidas
cnhs = ff.cnh(100)

# Todos passam mod-11 do DENATRAN
for c in cnhs[:5]:
    print(c)
    # 12345678900
    # 98765432100
    # ...`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Algoritmo DENATRAN mod-11 local</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# gerador_cnh.py - Python puro
import random

def gerar_cnh() -> str:
    """Gera número CNH válido pelo algoritmo mod-11 DENATRAN."""
    n = [random.randint(0, 9) for _ in range(9)]

    # Primeiro dígito verificador (pesos 9..1)
    s1 = sum(a * b for a, b in zip(n, range(9, 0, -1)))
    d1 = s1 % 11
    if d1 >= 10:
        d1 = 0
        dsc = 2
    else:
        dsc = 0

    # Segundo dígito verificador (pesos 1..9)
    s2 = sum(a * b for a, b in zip(n, range(1, 10)))
    d2 = s2 % 11
    d2 = 0 if d2 >= 10 else d2
    d2 = max(0, d2 - dsc)

    return "".join(str(x) for x in n) + str(d1) + str(d2)`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Uso em Django (motorista model)</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# myapp/management/commands/seed_motoristas.py
from django.core.management.base import BaseCommand
from fakeforge import FakeForge
from myapp.models import Motorista

class Command(BaseCommand):
    def handle(self, *args, **options):
        ff = FakeForge()
        cnhs = ff.cnh(1000)
        pessoas = ff.preset("customer", 1000)

        Motorista.objects.bulk_create([
            Motorista(
                cpf=p["cpf"],
                nome=p["nome"],
                cnh=cnh,
                categoria=random.choice(["A", "B", "AB", "C", "D"]),
            )
            for p, cnh in zip(pessoas, cnhs)
        ])`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Uso em pytest</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# tests/test_cnh_validator.py
import pytest
from fakeforge import FakeForge

@pytest.fixture(scope="session")
def ff():
    return FakeForge()

@pytest.fixture(scope="session")
def cnhs(ff):
    return ff.cnh(100)

class TestCnhValidator:
    @pytest.mark.parametrize("indice", range(20))
    def test_valida_cnh_denatran(self, cnhs, indice):
        from myapp.validators import validar_cnh
        assert validar_cnh(cnhs[indice])`}</code></pre>
      </section>

      <section className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Testar API</Link>
          <Link href="/gerador-cnh" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">CNH por estado</Link>
          <Link href="/gerador-cnh-nodejs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Versão Node</Link>
        </div>
      </section>

      <BreadcrumbSchema items={[{ name: "Início", url: "/" }, { name: "CNH", url: "/gerador-cnh" }, { name: "Python", url: "/gerador-cnh-python" }]} />
    </PageShell>
  );
}
