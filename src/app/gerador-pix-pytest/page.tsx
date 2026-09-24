import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de Chave PIX em pytest: Fixture + 4 tipos BACEN",
  description: "Fixture pytest com chave PIX válida BACEN usando SDK fakeforge-br. Setup conftest.py, session fixture, mock de banco central, integração pytest-django. Snippets prontos.",
  keywords: "gerador pix pytest, pytest pix fixture, pix bacen pytest, mock bacen pytest, pytest django pix",
  alternates: { canonical: "/gerador-pix-pytest" },
  openGraph: { title: "Gerador de PIX em pytest", description: "conftest + fixture + mock BACEN.", type: "article", locale: "pt_BR" },
};

export default function GeradorPixPytest() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">pytest · conftest · BACEN</p>
        <h1 className="text-3xl font-bold tracking-tight">Gerador de <span className="text-primary">Chave PIX em pytest</span></h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Fixture pra chave PIX válida em testes pytest — 4 tipos BACEN (CPF, email, telefone, aleatória). Session fixture, conftest.py compartilhado, pytest-django, mock de banco central. SDK <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">fakeforge-br</code>.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`pip install fakeforge-br pytest pytest-mock

# conftest.py
import pytest
from fakeforge import FakeForge

@pytest.fixture(scope="session")
def chaves_pix(ff):
    return ff.pix_key(50)`}</code></pre>
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
def clientes_fintech(ff):
    """20 clientes fintech, cada um com 3-4 chaves PIX correlacionadas."""
    return ff.preset("fintech", 20)

@pytest.fixture(scope="session")
def chaves_por_tipo(clientes_fintech):
    """Chaves PIX indexadas por tipo pra fácil acesso."""
    grupos = {"cpf": [], "email": [], "phone": [], "aleatoria": []}
    for c in clientes_fintech:
        for k in c["pix_keys"]:
            grupos[k["type"]].append(k["value"])
    return grupos

@pytest.fixture
def chave_pix_cpf(chaves_por_tipo):
    return chaves_por_tipo["cpf"][0]

@pytest.fixture
def chave_pix_email(chaves_por_tipo):
    return chaves_por_tipo["email"][0]`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Teste — validador PIX</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# tests/test_pix_validator.py
import pytest
from myapp.pix.validator import PixValidator

class TestPixValidator:
    @pytest.mark.parametrize("tipo", ["cpf", "email", "phone", "aleatoria"])
    def test_aceita_chave_valida(self, chaves_por_tipo, tipo):
        validator = PixValidator()
        for chave in chaves_por_tipo[tipo][:5]:
            assert validator.eh_valida(tipo, chave), \\
                f"Rejeitou chave válida tipo {tipo}: {chave}"

    def test_rejeita_cpf_invalido(self):
        validator = PixValidator()
        assert not validator.eh_valida("cpf", "111.111.111-11")

    def test_rejeita_phone_sem_prefixo(self):
        validator = PixValidator()
        assert not validator.eh_valida("phone", "11987654321")  # falta +55`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Uso em Django (pytest-django)</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# tests/test_pix_model.py
import pytest
from myapp.models import User, PixKey

@pytest.mark.django_db
class TestPixKeyModel:
    def test_salva_chave_pix_correlacionada(self, clientes_fintech):
        c = clientes_fintech[0]
        user = User.objects.create(cpf=c["customer"]["cpf"], nome=c["customer"]["nome"])

        for chave in c["pix_keys"]:
            PixKey.objects.create(user=user, tipo=chave["type"], valor=chave["value"])

        assert PixKey.objects.filter(user=user).count() == len(c["pix_keys"])

    def test_bulk_seed_500_chaves(self, ff):
        clientes = ff.preset("fintech", 200)
        chaves = []
        for c in clientes:
            user = User.objects.create(cpf=c["customer"]["cpf"])
            for k in c["pix_keys"]:
                chaves.append(PixKey(user=user, tipo=k["type"], valor=k["value"]))
        PixKey.objects.bulk_create(chaves)
        assert PixKey.objects.count() >= 500`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Mock de banco central (pytest-mock)</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# tests/test_transfer_service.py
class TestTransferService:
    @pytest.fixture(autouse=True)
    def mock_bacen(self, mocker):
        mock = mocker.patch("myapp.bacen.BacenClient.transferir")
        mock.return_value = {
            "status": "concluido",
            "id_end2end": "E12345678202609241234567890123456",
        }
        return mock

    def test_transferencia_pix(self, chave_pix_cpf, mock_bacen):
        from myapp.pix.transfer import TransferService
        service = TransferService()

        result = service.transferir(
            chave_destino=chave_pix_cpf,
            valor_centavos=10000,
        )

        assert result["status"] == "concluido"
        mock_bacen.assert_called_once()`}</code></pre>
      </section>

      <section className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Testar API</Link>
          <Link href="/preset-fintech" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Preset fintech</Link>
          <Link href="/gerador-pix-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Python básico</Link>
        </div>
      </section>

      <BreadcrumbSchema items={[{ name: "Início", url: "/" }, { name: "PIX", url: "/gerador-pix" }, { name: "pytest", url: "/gerador-pix-pytest" }]} />
    </PageShell>
  );
}
