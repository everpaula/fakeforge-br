import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de CPF em pytest: Fixture, conftest e parametrize (2026)",
  description: "Fixture pytest com CPF válido usando SDK fakeforge-br. Setup conftest.py, session fixture, parametrize com 100 CPFs, mock de service que consome CPF, teste E2E de signup. Snippets prontos.",
  keywords: "gerador cpf pytest, pytest cpf fixture, pytest cpf brasil, pytest conftest cpf, mock cpf pytest, pytest fake data brasil, pytest parametrize cpf, cpf session fixture pytest",
  alternates: { canonical: "/gerador-cpf-pytest" },
  openGraph: {
    title: "Gerador de CPF em pytest",
    description: "Fixture + conftest + parametrize + mock. Snippets prontos.",
    type: "article",
    locale: "pt_BR",
  },
};

export default function GeradorCpfPytest() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">pytest · conftest · parametrize</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">CPF em pytest</span>
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Setup completo pra usar CPF válido em testes pytest. Session fixture pra economizar API calls, conftest.py compartilhado entre módulos, parametrize com batch de 100 CPFs, mock de service que consome CPF. Tudo com SDK <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">fakeforge-br</code>.
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
        <p className="text-xs text-muted-foreground mt-2">Session scope evita chamar API 1 vez por teste.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">conftest.py compartilhado</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# tests/conftest.py
import pytest
from fakeforge import FakeForge

@pytest.fixture(scope="session")
def ff():
    """SDK instance compartilhada entre TODOS os testes da sessão."""
    return FakeForge()

@pytest.fixture(scope="session")
def cpfs_batch(ff):
    """500 CPFs pré-carregados. Reusa entre testes."""
    return ff.cpf(500)

@pytest.fixture(scope="function")
def customer(ff):
    """1 customer novo por teste. Correlacionado."""
    return ff.preset("customer", 1)[0]

@pytest.fixture(scope="session")
def fintech_customers(ff):
    """50 clientes fintech com PIX + banco + cartão + score."""
    return ff.preset("fintech", 50)`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Teste de signup (parametrize)</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# tests/test_signup.py
import pytest
from myapp.services import SignupService

class TestSignup:
    def test_aceita_100_cpfs_validos(self, cpfs_batch):
        service = SignupService()
        for cpf in cpfs_batch[:100]:
            resultado = service.criar_conta(cpf=cpf, email=f"user-{cpf[-2:]}@test.com")
            assert resultado.status == "created"

    def test_rejeita_cpf_invalido(self):
        service = SignupService()
        with pytest.raises(ValueError, match="CPF inválido"):
            service.criar_conta(cpf="111.111.111-11", email="user@test.com")

    @pytest.mark.parametrize("indice", range(10))
    def test_customer_completo(self, ff, indice):
        [c] = ff.preset("customer", 1)
        assert c["cpf"]
        assert c["email"].endswith("@gmail.com") or c["email"].endswith("@outlook.com")
        assert len(c["telefone"]) >= 14`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Django tests com pytest-django</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# tests/test_customer_model.py
import pytest
from myapp.models import Customer

@pytest.mark.django_db
class TestCustomerModel:
    def test_salvar_customer_correlacionado(self, customer):
        obj = Customer.objects.create(
            nome=customer["nome"],
            cpf=customer["cpf"],
            email=customer["email"],
            telefone=customer["telefone"],
        )
        assert obj.pk is not None
        # Email tem que derivar do nome
        primeiro_nome = customer["nome"].split()[0].lower()
        assert primeiro_nome in customer["email"].lower()

    def test_bulk_seed_1000_customers(self, ff):
        dados = ff.preset("customer", 1000)
        Customer.objects.bulk_create([
            Customer(**{k: d[k] for k in ("nome", "cpf", "email", "telefone")})
            for d in dados
        ])
        assert Customer.objects.count() == 1000`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Teste de fintech (preset fintech)</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# tests/test_credit_engine.py
import pytest
from myapp.credit import CreditEngine

class TestCreditEngine:
    def test_score_distribution_realista(self, fintech_customers):
        """Score Serasa segue distribuição normal ponderada (média 650)."""
        engine = CreditEngine()
        aprovados = 0
        rejeitados = 0

        for c in fintech_customers:
            resultado = engine.avaliar(
                cpf=c["customer"]["cpf"],
                score=c["customer"]["score_serasa"],
                renda=c["customer"]["renda_mensal"],
            )
            if resultado.aprovado:
                aprovados += 1
            else:
                rejeitados += 1

        # ~40% aprovação esperada em base realista
        taxa = aprovados / len(fintech_customers)
        assert 0.30 <= taxa <= 0.55`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Mock com pytest-mock</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# tests/test_kyc.py
def test_kyc_com_customer_fake(mocker, customer):
    mock_serasa = mocker.patch("myapp.serasa.consultar_score")
    mock_serasa.return_value = 750

    from myapp.kyc import KycService
    resultado = KycService().validar(cpf=customer["cpf"], nome=customer["nome"])

    assert resultado.status == "aprovado"
    mock_serasa.assert_called_once_with(customer["cpf"])`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Rodando com paralelismo (pytest-xdist)</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# pytest -n auto (roda em N processos)
# Cuidado: cada worker chama a API 1 vez pro session fixture
# Free tier 50/dia pode estourar com xdist + muitos testes

# Solução: cache em disco
@pytest.fixture(scope="session")
def cpfs_batch(ff, tmp_path_factory, worker_id):
    if worker_id == "master":
        return ff.cpf(500)
    # workers reusa cache do master (via arquivo temp compartilhado)
    cache_file = tmp_path_factory.getbasetemp().parent / "cpfs.json"
    if cache_file.exists():
        import json
        return json.loads(cache_file.read_text())
    data = ff.cpf(500)
    cache_file.write_text(json.dumps(data))
    return data`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Próximos passos</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Testar API</Link>
          <Link href="/gerador-cpf-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Python completo</Link>
          <Link href="/gerador-cpf-jest" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Jest equivalente</Link>
          <Link href="/preset-fintech" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Preset fintech</Link>
        </div>
      </section>

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Gerador CPF", url: "/gerador-cpf" },
        { name: "pytest", url: "/gerador-cpf-pytest" },
      ]} />
    </PageShell>
  );
}
