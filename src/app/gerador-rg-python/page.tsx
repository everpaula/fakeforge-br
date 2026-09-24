import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de RG em Python: SDK + Formato por Estado",
  description: "Gere RG válido em Python com SDK fakeforge-br. Formato específico por UF (SSP/SP, IFP/RJ, etc). Snippets pra pytest, Django, FastAPI. Grátis 50/dia.",
  keywords: "gerador rg python, rg python testes, rg django python, rg pytest, rg por estado python, rg ssp python",
  alternates: { canonical: "/gerador-rg-python" },
  openGraph: { title: "Gerador de RG em Python", description: "SDK oficial + formato por estado.", type: "article", locale: "pt_BR" },
};

export default function GeradorRgPython() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Python · SDK · formato por UF</p>
        <h1 className="text-3xl font-bold tracking-tight">Gerador de <span className="text-primary">RG em Python</span></h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          RG é responsabilidade estadual — cada UF tem formato próprio. SDK <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">fakeforge-br</code> cobre formatos oficiais SSP/SP, IFP/RJ, SSP/MG e outros 24 estados. Snippets pytest, Django, FastAPI.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`pip install fakeforge-br

from fakeforge import FakeForge
rgs = FakeForge().rg(100)  # 100 RGs formato mais comum (SP)`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">SDK oficial</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`from fakeforge import FakeForge

ff = FakeForge()

# 100 RGs
rgs = ff.rg(100)

# Preset customer traz RG correlacionado com estado do endereço
pessoas = ff.preset("customer", 10)
for p in pessoas:
    print(f"{p['nome']}: RG {p.get('rg')} - {p['endereco']['estado']}")`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Uso em Django (identidade model)</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# myapp/management/commands/seed_identidades.py
from fakeforge import FakeForge
from myapp.models import Identidade

class Command(BaseCommand):
    def handle(self, *args, **options):
        ff = FakeForge()
        pessoas = ff.preset("customer", 1000)
        rgs = ff.rg(1000)

        Identidade.objects.bulk_create([
            Identidade(
                cpf=p["cpf"],
                nome=p["nome"],
                rg=rg,
                uf_emissor=p["endereco"]["estado"],
            )
            for p, rg in zip(pessoas, rgs)
        ])`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">pytest</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# tests/test_validador_rg.py
import pytest
from fakeforge import FakeForge

@pytest.fixture(scope="session")
def ff():
    return FakeForge()

class TestValidadorRg:
    @pytest.mark.parametrize("indice", range(20))
    def test_valida_rg(self, ff, indice):
        from myapp.validators import validar_rg
        rg = ff.rg(1)[0]
        assert validar_rg(rg)`}</code></pre>
      </section>

      <section className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Testar API</Link>
          <Link href="/gerador-rg" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">RG por estado</Link>
          <Link href="/gerador-rg-nodejs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Node.js</Link>
        </div>
      </section>

      <BreadcrumbSchema items={[{ name: "Início", url: "/" }, { name: "RG", url: "/gerador-rg" }, { name: "Python", url: "/gerador-rg-python" }]} />
    </PageShell>
  );
}
