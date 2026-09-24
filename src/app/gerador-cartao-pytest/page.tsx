import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import DevOnlyDisclaimer from "@/components/DevOnlyDisclaimer";

export const metadata: Metadata = {
  title: "Gerador de Cartão para Testes em pytest: Fixture + Luhn",
  description: "Fixture pytest com cartão sintético válido pelo algoritmo Luhn usando SDK fakeforge-br. Setup conftest.py, session fixture, mock de gateway. Snippets prontos pra pytest-django, pytest-mock.",
  keywords: "gerador cartao pytest, pytest cartao fixture, pytest luhn, mock gateway pytest, pytest checkout fixture, pytest cartao testes",
  alternates: { canonical: "/gerador-cartao-pytest" },
  openGraph: { title: "Gerador de Cartão para Testes em pytest", description: "conftest + fixture + mock gateway.", type: "article", locale: "pt_BR" },
};

export default function GeradorCartaoPytest() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">pytest · conftest · Luhn</p>
        <h1 className="text-3xl font-bold tracking-tight">Gerador de <span className="text-primary">Cartão para Testes em pytest</span></h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Fixture pytest com cartão sintético válido pelo algoritmo Luhn (mod-10). Session fixture pra economizar API calls, conftest.py compartilhado, integração pytest-django + pytest-mock. SDK <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">fakeforge-br</code>. Ambiente de desenvolvimento apenas.
        </p>
      </div>

      <DevOnlyDisclaimer dataType="cartão de crédito" className="mb-6" />

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`pip install fakeforge-br pytest pytest-mock

# conftest.py
import pytest
from fakeforge import FakeForge

@pytest.fixture(scope="session")
def cartoes(ff):
    return ff.credit_card(50)`}</code></pre>
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
def cartoes(ff):
    """50 cartões sintéticos pré-carregados."""
    return ff.credit_card(50)

@pytest.fixture(scope="session")
def cartoes_visa(ff):
    """20 cartões filtrados Visa."""
    return [c for c in ff.credit_card(100) if c["brand"] == "visa"][:20]

@pytest.fixture(scope="function")
def cartao(ff):
    """1 cartão novo por teste."""
    return ff.credit_card(1)[0]`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Teste de checkout com parametrize</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# tests/test_checkout.py
import pytest
from myapp.checkout import CheckoutService

class TestCheckoutLuhn:
    @pytest.mark.parametrize("indice", range(20))
    def test_aceita_cartao_com_luhn_valido(self, cartoes, indice):
        cartao = cartoes[indice]
        service = CheckoutService()
        resultado = service.validar(cartao["number"])
        assert resultado.valido, f"Rejeitou cartão válido: {cartao['number']}"

    def test_rejeita_luhn_invalido(self):
        service = CheckoutService()
        assert not service.validar("1234 5678 9012 3456").valido

    def test_rejeita_formato_incorreto(self):
        service = CheckoutService()
        assert not service.validar("").valido
        assert not service.validar("abc").valido`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Mock de gateway Stripe (pytest-mock)</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# tests/test_payment_service.py
class TestPaymentService:
    @pytest.fixture(autouse=True)
    def mock_stripe(self, mocker):
        mock = mocker.patch("stripe.PaymentIntent.create")
        mock.return_value = type("PI", (), {"id": "pi_mock", "status": "succeeded"})()
        return mock

    def test_paga_com_cartao_sintetico(self, cartao, mock_stripe):
        from myapp.payment import PaymentService
        result = PaymentService.pay(
            card_number=cartao["number"],
            amount_cents=5000,
        )
        assert result.status == "succeeded"
        mock_stripe.assert_called_once()`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Django checkout model (pytest-django)</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# tests/test_pedido_model.py
import pytest
from myapp.models import Pedido

@pytest.mark.django_db
class TestPedidoModel:
    def test_salva_pedido_com_cartao_sintetico(self, cartao):
        pedido = Pedido.objects.create(
            cliente_id=1,
            valor_total=15000,
            cartao_numero=cartao["number"],
            cartao_bandeira=cartao["brand"],
            status="pago",
        )
        assert pedido.pk is not None

    def test_bulk_seed_500_pedidos(self, cartoes):
        pedidos = [
            Pedido(
                cliente_id=i,
                valor_total=10000 + (i * 100),
                cartao_numero=cartoes[i % len(cartoes)]["number"],
                cartao_bandeira=cartoes[i % len(cartoes)]["brand"],
                status="pago",
            )
            for i in range(500)
        ]
        Pedido.objects.bulk_create(pedidos)
        assert Pedido.objects.count() == 500`}</code></pre>
      </section>

      <section className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Testar API</Link>
          <Link href="/gerador-cartao-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Python completo</Link>
          <Link href="/gerador-cartao-jest" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Jest equivalente</Link>
        </div>
      </section>

      <BreadcrumbSchema items={[{ name: "Início", url: "/" }, { name: "Cartão", url: "/gerador-cartao" }, { name: "pytest", url: "/gerador-cartao-pytest" }]} />
    </PageShell>
  );
}
