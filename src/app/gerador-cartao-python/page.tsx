import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de Cartão para Testes em Python: SDK + Luhn (2026)",
  description: "Gere números sintéticos de cartão de crédito para testes de checkout em Python. SDK fakeforge-br cobre Visa, Mastercard, Elo, Hipercard, Amex com algoritmo Luhn válido. Snippets pytest, Django, FastAPI. Grátis 50/dia.",
  keywords: "gerador cartao python para testes, cartao credito python testes, luhn python, algoritmo luhn python, cartao pytest, cartao django python testes, cartao fastapi",
  alternates: { canonical: "/gerador-cartao-python" },
  openGraph: { title: "Gerador de Cartão para Testes em Python", description: "SDK + Luhn puro pra testes de checkout em pytest, Django, FastAPI.", type: "article", locale: "pt_BR" },
};

export default function GeradorCartaoPython() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Python · SDK + algoritmo Luhn</p>
        <h1 className="text-3xl font-bold tracking-tight">Gerador de <span className="text-primary">Cartão para Testes em Python</span></h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          SDK oficial <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">fakeforge-br</code> gera números sintéticos de cartão que passam validação Luhn (mod-10). Cobre Visa, Mastercard, Elo, Hipercard, Amex. Snippets pra pytest, Django, FastAPI. Ambiente de desenvolvimento apenas.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`pip install fakeforge-br

from fakeforge import FakeForge
ff = FakeForge()

cartoes = ff.credit_card(100)  # 100 cartões sintéticos válidos Luhn`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">SDK oficial</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`from fakeforge import FakeForge

ff = FakeForge()

# 1 cartão sintético
[cartao] = ff.credit_card(1)
print(cartao)
# {
#   "number": "4532 8891 2947 6103",
#   "brand": "visa",
#   "cvv": "428",
#   "expiry": "07/29",
#   "holder": "MARINA SOUZA OLIVEIRA"
# }

# 100 cartões pra popular tabela de testes
cartoes = ff.credit_card(100)

# Preset fintech: customer + PIX + banco + cartão coerentes
[cliente] = ff.preset("fintech", 1)
print(cliente["credit_card"]["number"])`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Algoritmo Luhn local (offline)</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# luhn.py - implementação pura
import random

BIN_TESTE = {
    "visa": "4",
    "mastercard": "5",
    "elo": "6362",
}

def luhn_checksum(numero_sem_dv: str) -> int:
    """Calcula dígito Luhn (mod-10)."""
    digitos = [int(d) for d in numero_sem_dv][::-1]
    total = 0
    for i, d in enumerate(digitos):
        if i % 2 == 0:
            dobrado = d * 2
            total += dobrado if dobrado < 10 else dobrado - 9
        else:
            total += d
    return (10 - (total % 10)) % 10

def gerar_cartao(bandeira: str = "visa") -> str:
    """Gera número de cartão sintético que passa validação Luhn."""
    prefixo = BIN_TESTE.get(bandeira, "4")
    tam_prefixo = len(prefixo)
    aleatorios = "".join(str(random.randint(0, 9)) for _ in range(15 - tam_prefixo))
    numero_parcial = prefixo + aleatorios
    dv = luhn_checksum(numero_parcial)
    return f"{numero_parcial}{dv}"`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Uso em pytest — teste de checkout</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# tests/test_checkout.py
import pytest
from fakeforge import FakeForge
from myapp.checkout import CheckoutService

@pytest.fixture(scope="session")
def ff():
    return FakeForge()

@pytest.fixture(scope="session")
def cartoes_teste(ff):
    return ff.credit_card(50)

class TestCheckout:
    @pytest.mark.parametrize("indice", range(20))
    def test_aceita_cartao_com_luhn_valido(self, cartoes_teste, indice):
        cartao = cartoes_teste[indice]
        service = CheckoutService()
        resultado = service.validar_cartao(cartao["number"])
        assert resultado.valido

    def test_rejeita_luhn_invalido(self):
        service = CheckoutService()
        assert not service.validar_cartao("1234 5678 9012 3456").valido`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Uso em Django (seed de teste)</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# myapp/management/commands/seed_cartoes_teste.py
from django.core.management.base import BaseCommand
from django.conf import settings
from fakeforge import FakeForge
from myapp.models import CartaoTeste

class Command(BaseCommand):
    """Popula tabela cartao_teste em ambiente DE DESENVOLVIMENTO apenas."""

    def handle(self, *args, **options):
        if not settings.DEBUG:
            self.stderr.write("Refuso rodar em production.")
            return

        ff = FakeForge()
        dados = ff.credit_card(200)

        CartaoTeste.objects.bulk_create([
            CartaoTeste(
                numero=c["number"],
                bandeira=c["brand"],
                titular=c["holder"],
                validade=c["expiry"],
                cvv=c["cvv"],
            )
            for c in dados
        ])
        self.stdout.write("200 cartões sintéticos seeded (dev only)")`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Nota importante</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Cartões gerados aqui são <strong className="text-foreground">sintéticos, não pertencem a ninguém e não têm saldo em conta bancária real</strong>. Passam validação Luhn (mod-10) do lado do cliente, mas gateway de pagamento real (Stripe, Mercado Pago, PagSeguro, Cielo) vai rejeitar em transação verdadeira. Uso restrito a testes de front-end, seed de banco de desenvolvimento e fixtures de QA. Nunca use em cadastro real, contrato ou compra. Ver <Link href="/como-gerar-cpf-valido-sem-infringir-lei" className="text-primary hover:underline">guia LGPD + Código Penal art. 299</Link>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Próximos passos</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Testar API</Link>
          <Link href="/cartao-credito-teste-stripe" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Sandbox Stripe</Link>
          <Link href="/gerador-cartao-nodejs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Versão Node</Link>
        </div>
      </section>

      <BreadcrumbSchema items={[{ name: "Início", url: "/" }, { name: "Cartão", url: "/gerador-cartao" }, { name: "Python", url: "/gerador-cartao-python" }]} />
    </PageShell>
  );
}
