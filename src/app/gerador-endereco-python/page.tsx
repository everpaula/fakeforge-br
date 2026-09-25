import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de Endereço em Python: SDK + Todas UFs | FakeForge",
  description: "Gere endereço brasileiro completo em Python com SDK fakeforge-br: rua, número, bairro, cidade, UF, CEP válido. Snippets pytest, Django, FastAPI. Grátis 50/dia.",
  keywords: "gerador endereco python, endereco brasileiro python, endereco django, endereco pytest, endereco fake python, endereco fastapi",
  alternates: { canonical: "/gerador-endereco-python" },
  openGraph: { title: "Gerador de Endereço em Python", description: "SDK + todas UFs. Pra pytest, Django, FastAPI.", type: "article", locale: "pt_BR" },
};

export default function GeradorEnderecoPython() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Python · SDK · todas UFs</p>
        <h1 className="text-3xl font-bold tracking-tight">Gerador de <span className="text-primary">Endereço em Python</span></h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          SDK <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">fakeforge-br</code> gera endereço brasileiro completo — rua, número, bairro, cidade, UF, CEP válido. Cobre todas as 27 UFs.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`pip install fakeforge-br

from fakeforge import FakeForge
enderecos = FakeForge().address(100)`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">SDK oficial</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`from fakeforge import FakeForge

ff = FakeForge()

# 100 endereços aleatórios (mix de UFs)
enderecos = ff.address(100)
for e in enderecos[:3]:
    print(e)
    # {
    #   "cep": "01310-100",
    #   "logradouro": "Av. Paulista, 1500",
    #   "bairro": "Bela Vista",
    #   "cidade": "São Paulo",
    #   "estado": "SP",
    #   "estadoNome": "São Paulo"
    # }

# Preset customer com endereço correlacionado (email deriva do nome, DDD bate com UF)
pessoas = ff.preset("customer", 10)
for p in pessoas:
    e = p["endereco"]
    print(f"{p['nome']}: {e['cidade']}/{e['estado']}")`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Django seed com endereços por região</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# myapp/management/commands/seed_users_regionalizados.py
from django.core.management.base import BaseCommand
from fakeforge import FakeForge
from myapp.models import User, Endereco

class Command(BaseCommand):
    def handle(self, *args, **options):
        ff = FakeForge()
        pessoas = ff.preset("customer", 1000)

        for p in pessoas:
            u = User.objects.create(nome=p["nome"], cpf=p["cpf"], email=p["email"])
            Endereco.objects.create(
                user=u,
                cep=p["endereco"]["cep"],
                logradouro=p["endereco"]["logradouro"],
                bairro=p["endereco"]["bairro"],
                cidade=p["endereco"]["cidade"],
                uf=p["endereco"]["estado"],
            )`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">pytest com fixture</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# tests/conftest.py
import pytest
from fakeforge import FakeForge

@pytest.fixture(scope="session")
def enderecos(ff):
    return ff.address(50)

@pytest.fixture
def endereco_sp(ff):
    """1 endereço garantido de SP pra testar regra específica."""
    for _ in range(20):
        e = ff.address(1)[0]
        if e["estado"] == "SP":
            return e
    raise AssertionError("Não gerou endereço SP em 20 tentativas")

# tests/test_frete.py
def test_frete_regionalizado(endereco_sp):
    from myapp.frete import CalculadoraFrete
    valor = CalculadoraFrete.calcular(cep=endereco_sp["cep"], peso_kg=2)
    assert valor > 0`}</code></pre>
      </section>

      <section className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Testar API</Link>
          <Link href="/gerador-endereco" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Endereço básico</Link>
          <Link href="/gerador-endereco-nodejs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Node.js</Link>
        </div>
      </section>

      <BreadcrumbSchema items={[{ name: "Início", url: "/" }, { name: "Endereço", url: "/gerador-endereco" }, { name: "Python", url: "/gerador-endereco-python" }]} />
    </PageShell>
  );
}
