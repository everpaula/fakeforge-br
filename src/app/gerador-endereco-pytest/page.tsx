import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de Endereço em pytest: Fixture BR | FakeForge",
  description: "Fixture pytest com endereço brasileiro válido usando SDK fakeforge-br. conftest.py, pytest-django, mock de Correios API. Snippets prontos.",
  keywords: "gerador endereco pytest, pytest endereco fixture, endereco brasileiro pytest, mock correios pytest",
  alternates: { canonical: "/gerador-endereco-pytest" },
  openGraph: { title: "Gerador de Endereço em pytest", description: "conftest + mock Correios.", type: "article", locale: "pt_BR" },
};

export default function GeradorEnderecoPytest() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">pytest · conftest · Correios</p>
        <h1 className="text-3xl font-bold tracking-tight">Gerador de <span className="text-primary">Endereço em pytest</span></h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Fixture pytest com endereço brasileiro. Session fixture, conftest.py, pytest-django, mock de Correios API pra teste de frete.
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
def enderecos(ff):
    return ff.address(100)

@pytest.fixture(scope="session")
def enderecos_por_uf(enderecos):
    grupos = {}
    for e in enderecos:
        grupos.setdefault(e["estado"], []).append(e)
    return grupos

@pytest.fixture
def endereco_sp(enderecos_por_uf):
    return enderecos_por_uf.get("SP", [None])[0]`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Teste de frete Django</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# tests/test_frete.py
import pytest
from myapp.frete import CalculadoraFrete

@pytest.mark.django_db
class TestFrete:
    def test_frete_sp_barato(self, endereco_sp):
        if endereco_sp is None:
            pytest.skip("Sem endereço SP no cache")
        valor = CalculadoraFrete.calcular(cep=endereco_sp["cep"], peso_kg=2)
        assert 0 < valor < 50

    def test_frete_todas_regioes(self, enderecos_por_uf):
        for uf, enderecos in enderecos_por_uf.items():
            if not enderecos:
                continue
            e = enderecos[0]
            valor = CalculadoraFrete.calcular(cep=e["cep"], peso_kg=1)
            assert valor > 0, f"Frete negativo pra {uf}"`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Mock Correios API</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# tests/test_correios_service.py
class TestCorreiosService:
    @pytest.fixture(autouse=True)
    def mock_correios(self, mocker):
        return mocker.patch(
            "myapp.correios.CorreiosClient.consultar_cep",
            return_value={"logradouro": "Mock Rua", "cidade": "Mock", "uf": "SP"}
        )

    def test_service_consulta_cep(self, endereco_sp, mock_correios):
        from myapp.endereco.service import EnderecoService
        service = EnderecoService()
        result = service.consultar(endereco_sp["cep"])
        assert result["uf"] == "SP"
        mock_correios.assert_called_once()`}</code></pre>
      </section>

      <section className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Testar API</Link>
          <Link href="/gerador-endereco-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Python</Link>
          <Link href="/gerador-endereco-jest" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Jest</Link>
        </div>
      </section>

      <BreadcrumbSchema items={[{ name: "Início", url: "/" }, { name: "Endereço", url: "/gerador-endereco" }, { name: "pytest", url: "/gerador-endereco-pytest" }]} />
    </PageShell>
  );
}
