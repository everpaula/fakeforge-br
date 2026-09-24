import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de CNH em pytest: Fixture DENATRAN",
  description: "Fixture pytest com CNH válida DENATRAN usando SDK fakeforge-br. conftest.py, mock de DETRAN, pytest-django. Snippets prontos.",
  keywords: "gerador cnh pytest, pytest cnh fixture, cnh denatran pytest, mock detran pytest",
  alternates: { canonical: "/gerador-cnh-pytest" },
  openGraph: { title: "Gerador de CNH em pytest", description: "conftest + mock DETRAN.", type: "article", locale: "pt_BR" },
};

export default function GeradorCnhPytest() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">pytest · conftest · DENATRAN</p>
        <h1 className="text-3xl font-bold tracking-tight">Gerador de <span className="text-primary">CNH em pytest</span></h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Fixture pytest com CNH válida mod-11 DENATRAN. Session fixture, conftest.py, mock de DETRAN, integração pytest-django. Ideal pra app de motorista, entregador, autoescola.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`pip install fakeforge-br pytest pytest-mock

# conftest.py
import pytest
from fakeforge import FakeForge

@pytest.fixture(scope="session")
def cnhs(ff):
    return ff.cnh(100)`}</code></pre>
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
def cnhs(ff):
    return ff.cnh(100)

@pytest.fixture(scope="session")
def motoristas_completos(ff):
    """Motorista com customer + CNH correlacionado."""
    customers = ff.preset("customer", 30)
    cnhs = ff.cnh(30)
    return [
        {**c, "cnh": cnh, "categoria": "B"}
        for c, cnh in zip(customers, cnhs)
    ]`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Teste validador CNH</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# tests/test_validador_cnh.py
import pytest
from myapp.validators import validar_cnh

class TestValidadorCnh:
    def test_aceita_cnhs_validas_denatran(self, cnhs):
        for cnh in cnhs:
            assert validar_cnh(cnh), f"Rejeitou CNH válida: {cnh}"

    def test_rejeita_cnh_invalida(self):
        assert not validar_cnh("11111111111")
        assert not validar_cnh("12345678900")  # DV errado
        assert not validar_cnh("")`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Uso em Django (pytest-django)</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# tests/test_motorista_model.py
import pytest
from myapp.models import Motorista

@pytest.mark.django_db
class TestMotoristaModel:
    def test_salva_motorista_com_cnh_valida(self, motoristas_completos):
        m = motoristas_completos[0]
        obj = Motorista.objects.create(
            cpf=m["cpf"], nome=m["nome"],
            cnh=m["cnh"], categoria=m["categoria"],
        )
        assert obj.pk is not None

    def test_bulk_seed_500_motoristas(self, ff):
        customers = ff.preset("customer", 500)
        cnhs = ff.cnh(500)
        Motorista.objects.bulk_create([
            Motorista(cpf=c["cpf"], nome=c["nome"], cnh=cnh, categoria="B")
            for c, cnh in zip(customers, cnhs)
        ])
        assert Motorista.objects.count() == 500`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Mock DETRAN (pytest-mock)</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# tests/test_detran_check.py
class TestDetranCheck:
    @pytest.fixture(autouse=True)
    def mock_detran(self, mocker):
        return mocker.patch(
            "myapp.detran.DetranClient.consultar_cnh",
            return_value={
                "valida": True, "pontos": 0,
                "restricoes": [], "vencimento": "2028-06-15",
            }
        )

    def test_consulta_cnh_no_cadastro(self, motoristas_completos, mock_detran):
        from myapp.motorista.service import MotoristaService
        m = motoristas_completos[0]
        service = MotoristaService()

        result = service.aprovar_cadastro(cnh=m["cnh"])
        assert result["aprovado"]
        mock_detran.assert_called_once_with(m["cnh"])`}</code></pre>
      </section>

      <section className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Testar API</Link>
          <Link href="/gerador-cnh-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Python</Link>
          <Link href="/gerador-cnh-jest" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Jest</Link>
        </div>
      </section>

      <BreadcrumbSchema items={[{ name: "Início", url: "/" }, { name: "CNH", url: "/gerador-cnh" }, { name: "pytest", url: "/gerador-cnh-pytest" }]} />
    </PageShell>
  );
}
