import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de RG em pytest: Fixture + Formato UF",
  description: "Fixture pytest com RG válido por UF usando SDK fakeforge-br. conftest.py, pytest-django, mock de instituto identificação. Snippets prontos.",
  keywords: "gerador rg pytest, pytest rg fixture, rg por estado pytest, pytest django rg",
  alternates: { canonical: "/gerador-rg-pytest" },
  openGraph: { title: "Gerador de RG em pytest", description: "conftest + formato UF.", type: "article", locale: "pt_BR" },
};

export default function GeradorRgPytest() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">pytest · conftest · UF</p>
        <h1 className="text-3xl font-bold tracking-tight">Gerador de <span className="text-primary">RG em pytest</span></h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Fixture pytest com RG válido por UF. Session fixture, conftest.py, integração pytest-django. SDK <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">fakeforge-br</code>.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`pip install fakeforge-br pytest pytest-mock`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">conftest.py</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# tests/conftest.py
import pytest
from fakeforge import FakeForge

@pytest.fixture(scope="session")
def ff():
    return FakeForge()

@pytest.fixture(scope="session")
def rgs(ff):
    return ff.rg(100)

@pytest.fixture(scope="session")
def pessoas_com_rg(ff):
    customers = ff.preset("customer", 50)
    rgs = ff.rg(50)
    return [
        {**c, "rg": rg, "uf_emissor": c["endereco"]["estado"]}
        for c, rg in zip(customers, rgs)
    ]`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Teste validador</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# tests/test_validador_rg.py
import pytest
from myapp.validators import validar_rg

class TestValidadorRg:
    def test_aceita_rgs_validos(self, rgs):
        for rg in rgs[:30]:
            assert validar_rg(rg), f"Rejeitou RG válido: {rg}"

    def test_rejeita_rg_invalido(self):
        assert not validar_rg("00.000.000-0")
        assert not validar_rg("abc")`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Uso em pytest-django</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# tests/test_identidade_model.py
import pytest
from myapp.models import Identidade

@pytest.mark.django_db
class TestIdentidadeModel:
    def test_salva_identidade_com_rg(self, pessoas_com_rg):
        p = pessoas_com_rg[0]
        obj = Identidade.objects.create(
            cpf=p["cpf"], nome=p["nome"],
            rg=p["rg"], uf_emissor=p["uf_emissor"],
        )
        assert obj.pk is not None

    def test_bulk_seed(self, pessoas_com_rg):
        Identidade.objects.bulk_create([
            Identidade(cpf=p["cpf"], nome=p["nome"], rg=p["rg"], uf_emissor=p["uf_emissor"])
            for p in pessoas_com_rg
        ])
        assert Identidade.objects.count() == len(pessoas_com_rg)`}</code></pre>
      </section>

      <section className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Testar API</Link>
          <Link href="/gerador-rg-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Python</Link>
          <Link href="/gerador-rg-jest" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Jest</Link>
        </div>
      </section>

      <BreadcrumbSchema items={[{ name: "Início", url: "/" }, { name: "RG", url: "/gerador-rg" }, { name: "pytest", url: "/gerador-rg-pytest" }]} />
    </PageShell>
  );
}
