import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de CEP em pytest: Fixture BR | FakeForge",
  description: "Fixture pytest com CEP brasileiro válido usando SDK fakeforge-br. conftest.py, pytest-django, mock ViaCEP. Snippets prontos.",
  keywords: "gerador cep pytest, pytest cep fixture, cep brasileiro pytest, mock viacep pytest",
  alternates: { canonical: "/gerador-cep-pytest" },
  openGraph: { title: "Gerador de CEP em pytest", description: "conftest + mock ViaCEP.", type: "article", locale: "pt_BR" },
};

export default function GeradorCepPytest() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">pytest · conftest · ViaCEP mock</p>
        <h1 className="text-3xl font-bold tracking-tight">Gerador de <span className="text-primary">CEP em pytest</span></h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Fixture pytest com CEP brasileiro válido. conftest.py, pytest-django, mock ViaCEP API.
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
def ceps(ff):
    return ff.cep(100)

@pytest.fixture(scope="session")
def enderecos_completos(ff):
    return ff.address(50)

@pytest.fixture
def cep(ff):
    return ff.cep(1)[0]`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Teste validador CEP</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# tests/test_cep_validator.py
import pytest
from myapp.validators import validar_cep

class TestValidadorCep:
    def test_aceita_ceps_do_fakeforge(self, ceps):
        for c in ceps[:30]:
            assert validar_cep(c), f"Rejeitou CEP válido: {c}"

    def test_rejeita_cep_invalido(self):
        assert not validar_cep("00000-000")
        assert not validar_cep("")
        assert not validar_cep("abc")

    @pytest.mark.parametrize("indice", range(20))
    def test_formato_correto(self, ceps, indice):
        c = ceps[indice]
        # 5 dígitos + hífen + 3 dígitos
        assert len(c) == 9
        assert c[5] == "-"
        assert c.replace("-", "").isdigit()`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Mock ViaCEP com pytest-mock</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# tests/test_viacep_service.py
class TestViaCEPService:
    @pytest.fixture(autouse=True)
    def mock_viacep(self, mocker):
        return mocker.patch(
            "myapp.viacep.ViaCEPClient.consultar",
            return_value={
                "logradouro": "Rua Mock", "bairro": "Mock",
                "localidade": "São Paulo", "uf": "SP",
            }
        )

    def test_consulta_viacep(self, cep, mock_viacep):
        from myapp.viacep.service import ViaCEPService
        service = ViaCEPService()
        result = service.consultar(cep)
        assert result["uf"] == "SP"
        mock_viacep.assert_called_once_with(cep)`}</code></pre>
      </section>

      <section className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Testar API</Link>
          <Link href="/gerador-cep-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Python</Link>
          <Link href="/gerador-cep-jest" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Jest</Link>
        </div>
      </section>

      <BreadcrumbSchema items={[{ name: "Início", url: "/" }, { name: "CEP", url: "/gerador-cep" }, { name: "pytest", url: "/gerador-cep-pytest" }]} />
    </PageShell>
  );
}
