import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de CNPJ em pytest: Fixture + Alfanumérico 2026",
  description: "Fixture pytest com CNPJ válido (numérico e alfanumérico 2026) usando SDK fakeforge-br. Setup conftest.py, parametrize com batch, pytest-django, mock de service. Snippets prontos.",
  keywords: "gerador cnpj pytest, cnpj pytest fixture, cnpj alfanumerico pytest 2026, pytest conftest cnpj, pytest django cnpj",
  alternates: { canonical: "/gerador-cnpj-pytest" },
  openGraph: { title: "Gerador de CNPJ em pytest", description: "conftest + parametrize + alfanumérico 2026.", type: "article", locale: "pt_BR" },
};

export default function GeradorCnpjPytest() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">pytest · conftest · alfanumérico 2026</p>
        <h1 className="text-3xl font-bold tracking-tight">Gerador de <span className="text-primary">CNPJ em pytest</span></h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Fixture pra CNPJ válido em testes pytest — cobre numérico e alfanumérico 2026. Session fixture pra economizar API calls, conftest.py compartilhado, parametrize com batch, integração com pytest-django. SDK <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">fakeforge-br</code>.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`pip install fakeforge-br pytest

# conftest.py
import pytest
from fakeforge import FakeForge

@pytest.fixture(scope="session")
def ff():
    return FakeForge()`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">conftest.py compartilhado</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# tests/conftest.py
import pytest
from fakeforge import FakeForge

@pytest.fixture(scope="session")
def ff():
    return FakeForge()

@pytest.fixture(scope="session")
def cnpjs_numericos(ff):
    """200 CNPJs numéricos pré-carregados."""
    return ff.cnpj(200)

@pytest.fixture(scope="session")
def cnpjs_alfanumericos(ff):
    """100 CNPJs no formato 2026 (IN RFB 2.229)."""
    return ff.cnpj_alfa(100)

@pytest.fixture(scope="session")
def empresa_completa(ff):
    """Empresa correlacionada: CNPJ + razão social + endereço."""
    return ff.preset("company", 1)[0]`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Teste de validador (numérico + alfa)</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# tests/test_validador_cnpj.py
import pytest
from myapp.validators import validar_cnpj

class TestValidadorCnpj:
    def test_aceita_cnpjs_numericos_validos(self, cnpjs_numericos):
        for cnpj in cnpjs_numericos:
            assert validar_cnpj(cnpj), f"Rejeitou CNPJ válido: {cnpj}"

    def test_aceita_cnpjs_alfanumericos_2026(self, cnpjs_alfanumericos):
        """IN RFB 2.229 vigência 01/07/2026. Sistemas DEVEM aceitar."""
        for cnpj in cnpjs_alfanumericos:
            assert validar_cnpj(cnpj), f"Validador NÃO cobre 2026: {cnpj}"

    def test_rejeita_cnpj_invalido(self):
        assert not validar_cnpj("11.111.111/1111-11")
        assert not validar_cnpj("abc")
        assert not validar_cnpj("")`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Uso em pytest-django</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# tests/test_empresa_model.py
import pytest
from myapp.models import Empresa

@pytest.mark.django_db
class TestEmpresaModel:
    def test_salva_empresa_com_cnpj_numerico(self, empresa_completa):
        obj = Empresa.objects.create(
            razao_social=empresa_completa["razao_social"],
            cnpj=empresa_completa["cnpj"],
        )
        assert obj.pk is not None

    def test_bulk_seed_1000_empresas(self, ff):
        cnpjs = ff.cnpj(500)
        cnpjs_alfa = ff.cnpj_alfa(500)
        Empresa.objects.bulk_create([
            Empresa(razao_social=f"Test {i}", cnpj=cnpj)
            for i, cnpj in enumerate(cnpjs + cnpjs_alfa)
        ])
        assert Empresa.objects.count() == 1000`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Parametrize massa (stress test)</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# tests/test_receita_client.py
import pytest
from myapp.receita import ReceitaClient

class TestReceitaClient:
    @pytest.fixture(autouse=True)
    def mock_receita(self, mocker):
        mocker.patch(
            "myapp.receita.ReceitaClient.consultar",
            return_value={"situacao": "ATIVA", "razao_social": "Mock LTDA"}
        )

    @pytest.mark.parametrize("indice", range(50))
    def test_client_lida_com_qualquer_cnpj_valido(self, cnpjs_numericos, indice):
        client = ReceitaClient()
        result = client.consultar(cnpjs_numericos[indice])
        assert result["situacao"] == "ATIVA"`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Próximos passos</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Testar API</Link>
          <Link href="/gerador-cnpj-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Python completo</Link>
          <Link href="/gerador-cnpj-jest" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Jest equivalente</Link>
        </div>
      </section>

      <BreadcrumbSchema items={[{ name: "Início", url: "/" }, { name: "Gerador CNPJ", url: "/gerador-cnpj" }, { name: "pytest", url: "/gerador-cnpj-pytest" }]} />
    </PageShell>
  );
}
