import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de CPF em Python: SDK + Algoritmo mod-11 (2026)",
  description: "Gere CPF válido em Python com o SDK fakeforge-br (pip install) ou implementação local do algoritmo mod-11. Snippets prontos pra pytest, Django, Flask e FastAPI. Grátis 50/dia.",
  keywords: "gerador de cpf python, gerar cpf python, cpf valido python, algoritmo mod-11 python, cpf django python, cpf pytest, cpf faker python, cpf sintetico python, python cpf teste",
  alternates: { canonical: "/gerador-cpf-python" },
  openGraph: {
    title: "Gerador de CPF em Python — SDK oficial + algoritmo local",
    description: "SDK oficial fakeforge-br + implementação mod-11 pura. Pra pytest, Django, Flask, FastAPI. Grátis.",
    type: "article",
    locale: "pt_BR",
  },
};

export default function GeradorCpfPython() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Python · SDK + algoritmo</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">CPF em Python</span>
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Duas rotas: SDK oficial <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">fakeforge-br</code> (mais fácil) ou implementação local do algoritmo mod-11 da Receita Federal (mais controle). Este guia mostra as duas com snippets prontos pra pytest, Django, Flask e FastAPI.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`pip install fakeforge-br

from fakeforge import FakeForge
cpfs = FakeForge().cpf(100)  # 100 CPFs válidos mod-11`}</code></pre>
        <p className="text-xs text-muted-foreground mt-2">
          Free 50 chamadas/dia sem cadastro. Zero deps runtime além do install.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Rota 1: SDK oficial fakeforge-br</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
          A mais rápida. Zero código de validação, apenas <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">.cpf(n)</code> retorna lista.
        </p>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# Instalação
pip install fakeforge-br

# Uso básico
from fakeforge import FakeForge

ff = FakeForge()

# 1 CPF formatado
cpf = ff.cpf(1)[0]
print(cpf)  # "123.456.789-09"

# 1000 CPFs sem formatação
cpfs = ff.cpf(1000, formatted=False)

# Preset customer (CPF + email + endereço correlacionados)
pessoas = ff.preset("customer", 10)
for p in pessoas:
    print(p["cpf"], p["nome"], p["email"])`}</code></pre>

        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          Vantagens: correlação entre campos, CNPJ alfanumérico 2026, presets fintech/ecom, bulk até 10k por chamada. Requer internet (chama endpoint HTTP).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Rota 2: algoritmo mod-11 local (offline)</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
          Se você não quer dep externa ou precisa de geração 100% offline:
        </p>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# gerador_cpf.py - implementação pura mod-11
import random

def gerar_cpf(formatado: bool = True) -> str:
    """Gera CPF válido pelo algoritmo mod-11 da Receita Federal."""
    n = [random.randint(0, 9) for _ in range(9)]

    # Primeiro dígito verificador
    soma = sum(a * b for a, b in zip(n, range(10, 1, -1)))
    d1 = (soma * 10) % 11
    d1 = 0 if d1 == 10 else d1
    n.append(d1)

    # Segundo dígito verificador
    soma = sum(a * b for a, b in zip(n, range(11, 1, -1)))
    d2 = (soma * 10) % 11
    d2 = 0 if d2 == 10 else d2
    n.append(d2)

    if formatado:
        return f"{n[0]}{n[1]}{n[2]}.{n[3]}{n[4]}{n[5]}.{n[6]}{n[7]}{n[8]}-{n[9]}{n[10]}"
    return "".join(str(d) for d in n)


def validar_cpf(cpf: str) -> bool:
    """Valida CPF pelo mesmo algoritmo mod-11."""
    d = [int(c) for c in cpf if c.isdigit()]
    if len(d) != 11 or len(set(d)) == 1:
        return False
    s1 = sum(a * b for a, b in zip(d[:9], range(10, 1, -1)))
    v1 = (s1 * 10) % 11
    v1 = 0 if v1 == 10 else v1
    if v1 != d[9]:
        return False
    s2 = sum(a * b for a, b in zip(d[:10], range(11, 1, -1)))
    v2 = (s2 * 10) % 11
    v2 = 0 if v2 == 10 else v2
    return v2 == d[10]`}</code></pre>

        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          Vantagens: zero deps, offline, controle total. Limitação: só CPF, sem correlação com outros campos.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Uso em pytest</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# tests/conftest.py
import pytest
from fakeforge import FakeForge

@pytest.fixture(scope="session")
def ff():
    return FakeForge(api_key=None)  # free tier

@pytest.fixture
def cpfs(ff):
    return ff.cpf(100)

# tests/test_signup.py
def test_signup_aceita_cpf_valido(client, cpfs):
    for cpf in cpfs[:10]:
        response = client.post("/signup", json={"cpf": cpf, "email": "test@test.com"})
        assert response.status_code == 201`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Uso em Django</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# myapp/management/commands/seed_customers.py
from django.core.management.base import BaseCommand
from fakeforge import FakeForge
from myapp.models import Customer

class Command(BaseCommand):
    def handle(self, *args, **options):
        ff = FakeForge()
        dados = ff.preset("customer", 1000)  # 1000 clientes correlacionados

        Customer.objects.bulk_create([
            Customer(
                nome=d["nome"],
                cpf=d["cpf"],
                email=d["email"],
                telefone=d["telefone"],
            )
            for d in dados
        ])
        self.stdout.write(f"1000 customers seeded")`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Uso em FastAPI / Flask</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# app.py - endpoint de teste que gera CPFs on demand
from fastapi import FastAPI
from fakeforge import FakeForge

app = FastAPI()
ff = FakeForge()

@app.get("/dev/fake-cpfs")
async def fake_cpfs(quantity: int = 10):
    """Endpoint só ativo em DEBUG=True."""
    return {"cpfs": ff.cpf(quantity)}`}</code></pre>
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
                ["Só CPF simples", "✅", "✅"],
                ["Pessoa correlacionada (nome+CPF+email)", "✅", "❌"],
                ["Fintech (PIX+banco+cartão)", "✅", "❌"],
                ["100% offline", "❌", "✅"],
                ["Zero deps runtime", "✅", "✅"],
                ["Bulk 10k+", "✅ 1 chamada", "⚠️ loop"],
                ["Custo", "Free 50/dia", "R$0"],
              ].map(([c, ff, local], i) => (
                <tr key={i}>
                  <td className="px-3 py-2 text-muted-foreground">{c}</td>
                  <td className="px-3 py-2 text-center text-foreground">{ff}</td>
                  <td className="px-3 py-2 text-center text-foreground">{local}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Próximos passos</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Testar API</Link>
          <Link href="/blog/popular-django-dados-brasileiros-seed-orm" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Django seed</Link>
          <Link href="/gerador-cpf-pytest" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">pytest fixture</Link>
          <Link href="/docs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Docs completas</Link>
        </div>
      </section>

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Gerador CPF", url: "/gerador-cpf" },
        { name: "Python", url: "/gerador-cpf-python" },
      ]} />
    </PageShell>
  );
}
