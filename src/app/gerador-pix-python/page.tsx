import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de Chave PIX em Python: SDK + 4 tipos BACEN (2026)",
  description: "Gere chave PIX válida em Python (CPF, email, telefone, aleatória) com SDK fakeforge-br. Snippets pra pytest, Django, FastAPI. Formato BACEN oficial. Grátis 50/dia.",
  keywords: "gerador pix python, chave pix python, pix bacen python, pix django, pix pytest, pix fastapi, gerar chave pix aleatoria python, pix email python",
  alternates: { canonical: "/gerador-pix-python" },
  openGraph: { title: "Gerador de PIX em Python", description: "SDK + 4 tipos BACEN. Pra pytest, Django, FastAPI.", type: "article", locale: "pt_BR" },
};

export default function GeradorPixPython() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Python · PIX BACEN · 4 tipos</p>
        <h1 className="text-3xl font-bold tracking-tight">Gerador de <span className="text-primary">Chave PIX em Python</span></h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          SDK oficial <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">fakeforge-br</code> gera os 4 tipos de chave PIX BACEN: CPF, email, telefone (+55) e aleatória (UUID v4). Snippets pra pytest, Django, FastAPI. Grátis 50 chamadas/dia sem cadastro.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`pip install fakeforge-br

from fakeforge import FakeForge
ff = FakeForge()

chaves = ff.pix_key(100)  # 100 chaves PIX aleatórias entre os 4 tipos`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Os 4 tipos de chave PIX</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`from fakeforge import FakeForge

ff = FakeForge()

# Tipo aleatório (mix dos 4)
chaves = ff.pix_key(20)

# Preset fintech tem 3-4 chaves por cliente (CPF + email + phone + aleatória)
[cliente] = ff.preset("fintech", 1)
for chave in cliente["pix_keys"]:
    print(f"{chave['type']}: {chave['value']}")

# Output típico:
# cpf: 12345678909
# email: marina.souza@gmail.com
# phone: +5511987654321
# aleatoria: 8f4e2c91-a3b7-4d5e-9f2a-1c8b6d0e5a3f`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Uso em Django (model PIX)</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# myapp/management/commands/seed_pix.py
from django.core.management.base import BaseCommand
from fakeforge import FakeForge
from myapp.models import User, PixKey

class Command(BaseCommand):
    def handle(self, *args, **options):
        ff = FakeForge()
        clientes = ff.preset("fintech", 500)  # 500 clientes com 3-4 chaves cada

        pix_keys = []
        for c in clientes:
            user, _ = User.objects.get_or_create(cpf=c["customer"]["cpf"])
            for chave in c["pix_keys"]:
                pix_keys.append(PixKey(
                    user=user,
                    tipo=chave["type"],
                    valor=chave["value"],
                ))

        PixKey.objects.bulk_create(pix_keys)
        self.stdout.write(f"{len(pix_keys)} chaves PIX seeded")`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Uso em pytest</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# tests/test_pix_transferencia.py
import pytest
from fakeforge import FakeForge
from myapp.pix import PixService

@pytest.fixture(scope="session")
def ff():
    return FakeForge()

@pytest.fixture(scope="session")
def clientes_fintech(ff):
    return ff.preset("fintech", 20)

class TestPixTransferencia:
    def test_valida_todos_4_tipos_bacen(self, clientes_fintech):
        service = PixService()
        for cliente in clientes_fintech:
            for chave in cliente["pix_keys"]:
                assert service.validar_chave(chave["type"], chave["value"]), \\
                    f"Validador rejeitou {chave['type']}: {chave['value']}"

    def test_transferencia_p2p(self, clientes_fintech):
        service = PixService()
        origem = clientes_fintech[0]["pix_keys"][0]
        destino = clientes_fintech[1]["pix_keys"][0]

        result = service.transferir(
            chave_origem=origem["value"],
            chave_destino=destino["value"],
            valor=100.00,
        )
        assert result.status == "concluido"`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Uso em FastAPI (endpoint de teste)</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# app.py
from fastapi import FastAPI, Query
from fakeforge import FakeForge

app = FastAPI()
ff = FakeForge()

@app.get("/dev/fake-pix-keys")
async def fake_pix(quantity: int = Query(10, le=100)):
    """Endpoint só em DEBUG=True. Gera chaves PIX pra testes locais."""
    chaves = ff.pix_key(quantity)
    return {"count": len(chaves), "keys": chaves}`}</code></pre>
      </section>

      <section className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Testar API</Link>
          <Link href="/preset-fintech" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Preset fintech</Link>
          <Link href="/gerador-pix-nodejs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Versão Node</Link>
        </div>
      </section>

      <BreadcrumbSchema items={[{ name: "Início", url: "/" }, { name: "PIX", url: "/gerador-pix" }, { name: "Python", url: "/gerador-pix-python" }]} />
    </PageShell>
  );
}
