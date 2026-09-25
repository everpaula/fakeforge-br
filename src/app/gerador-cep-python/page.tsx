import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de CEP em Python: SDK + Todas Capitais | FakeForge",
  description: "Gere CEP brasileiro válido em Python com SDK fakeforge-br. Cobre todas 27 capitais + regiões. Snippets pytest, Django, FastAPI. Grátis 50/dia.",
  keywords: "gerador cep python, cep valido python, cep brasileiro python, cep django, cep pytest",
  alternates: { canonical: "/gerador-cep-python" },
  openGraph: { title: "Gerador de CEP em Python", description: "SDK + 27 capitais.", type: "article", locale: "pt_BR" },
};

export default function GeradorCepPython() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Python · SDK · 27 capitais</p>
        <h1 className="text-3xl font-bold tracking-tight">Gerador de <span className="text-primary">CEP em Python</span></h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          SDK <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">fakeforge-br</code> gera CEP no formato dos Correios (5 dígitos + hífen + 3). Cobre todas as 27 capitais brasileiras.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`pip install fakeforge-br

from fakeforge import FakeForge
ceps = FakeForge().cep(100)`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">SDK oficial</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`from fakeforge import FakeForge

ff = FakeForge()

# 100 CEPs no formato oficial
ceps = ff.cep(100)
for c in ceps[:5]:
    print(c)  # "01310-100"

# Sem formatação (só dígitos)
ceps_puros = ff.cep(50, formatted=False)
# ["01310100", "22440000", ...]

# Endereço completo com CEP incluso
enderecos = ff.address(10)
for e in enderecos:
    print(f"{e['cep']} — {e['cidade']}/{e['estado']}")`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Django — model com validator de CEP</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# myapp/management/commands/seed_ceps.py
from django.core.management.base import BaseCommand
from fakeforge import FakeForge
from myapp.models import EnderecoEntrega

class Command(BaseCommand):
    def handle(self, *args, **options):
        ff = FakeForge()
        enderecos = ff.address(1000)

        EnderecoEntrega.objects.bulk_create([
            EnderecoEntrega(
                cep=e["cep"],
                logradouro=e["logradouro"],
                cidade=e["cidade"],
                uf=e["estado"],
            )
            for e in enderecos
        ])`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">pytest — validador CEP</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# tests/test_cep_validator.py
import pytest
from fakeforge import FakeForge
from myapp.validators import validar_cep

@pytest.fixture(scope="session")
def ceps(ff):
    return ff.cep(100)

class TestValidadorCep:
    @pytest.mark.parametrize("indice", range(30))
    def test_valida_cep_formatado(self, ceps, indice):
        assert validar_cep(ceps[indice])

    def test_rejeita_cep_invalido(self):
        assert not validar_cep("00000-000")
        assert not validar_cep("abc")
        assert not validar_cep("1234")`}</code></pre>
      </section>

      <section className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Testar API</Link>
          <Link href="/gerador-cep" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">CEP por cidade</Link>
          <Link href="/gerador-cep-nodejs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Node.js</Link>
        </div>
      </section>

      <BreadcrumbSchema items={[{ name: "Início", url: "/" }, { name: "CEP", url: "/gerador-cep" }, { name: "Python", url: "/gerador-cep-python" }]} />
    </PageShell>
  );
}
