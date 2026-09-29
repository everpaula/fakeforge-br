import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de Placa Mercosul em Python: SDK + Regex + Testes ALPR",
  description: "Gere placa de carro brasileira (Mercosul e antiga) em Python com SDK fakeforge-br ou regex local. CONTRAN 729/2018, sem I/O/Q. Snippets pra pytest e testes de ALPR. Grátis 50/dia.",
  keywords: "gerador de placa python, gerar placa mercosul python, placa carro python, contran 729 python, placa lllnlnn python, alpr teste python, placa valida python",
  alternates: { canonical: "/gerador-placa-python" },
  openGraph: {
    title: "Gerador de Placa Mercosul em Python — SDK + regex local",
    description: "SDK oficial fakeforge-br + regex pura em Python. Pra pytest e testes de ALPR/OCR.",
    type: "article",
    locale: "pt_BR",
  },
};

export default function GeradorPlacaPython() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Python · SDK + algoritmo</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">Placa Mercosul em Python</span>
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Pra gerar placa Mercosul válida em Python (formato LLLNLNN da Resolução CONTRAN 729/2018), instale <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">pip install fakeforge-br</code> e chame <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">FakeForge().placa(n)</code>. As letras nunca incluem I, O ou Q, seguindo a regra visual do DENATRAN. Sem SDK, um regex mais random.choice replica a lógica offline.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`pip install fakeforge-br

from fakeforge import FakeForge
placas = FakeForge().placa(100)  # 100 placas Mercosul válidas`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Rota 1: SDK oficial fakeforge-br</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`from fakeforge import FakeForge

ff = FakeForge()

# 100 placas Mercosul (LLLNLNN)
placas = ff.placa(100)
print(placas[0])  # "ABC1D23"

# 50 placas no formato antigo (LLL-NNNN)
placas_antigas = ff.placa_antiga(50)
print(placas_antigas[0])  # "ABC-1234"`}</code></pre>
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          Vantagens: os dois formatos numa chamada, bulk até 10k, letras já filtradas conforme regra DENATRAN. Requer internet.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Rota 2: algoritmo local (offline)</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# gerador_placa.py - implementação pura, offline
import random
import re

LETRAS_VALIDAS = list("ABCDEFGHJKLMNPRSTUVWXYZ")  # sem I, O, Q

REGEX_MERCOSUL = re.compile(r"^[A-HJ-NP-Z]{3}[0-9][A-HJ-NP-Z][0-9]{2}$")
REGEX_ANTIGA = re.compile(r"^[A-HJ-NP-Z]{3}[0-9]{4}$")


def gerar_placa_mercosul() -> str:
    """Gera placa Mercosul (LLLNLNN) conforme Resolução CONTRAN 729/2018."""
    letras = "".join(random.choices(LETRAS_VALIDAS, k=3))
    d1 = random.randint(0, 9)
    letra_meio = random.choice(LETRAS_VALIDAS)
    d2 = random.randint(0, 9)
    d3 = random.randint(0, 9)
    return f"{letras}{d1}{letra_meio}{d2}{d3}"


def gerar_placa_antiga() -> str:
    """Gera placa no formato legado (LLL-NNNN)."""
    letras = "".join(random.choices(LETRAS_VALIDAS, k=3))
    numeros = "".join(str(random.randint(0, 9)) for _ in range(4))
    return f"{letras}-{numeros}"


def validar_placa(placa: str) -> str | None:
    """Retorna 'mercosul', 'antiga' ou None se inválida."""
    limpa = placa.replace("-", "")
    if REGEX_MERCOSUL.match(limpa):
        return "mercosul"
    if REGEX_ANTIGA.match(limpa):
        return "antiga"
    return None`}</code></pre>
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          Vantagens: zero deps, offline, valida os dois formatos numa função só. Limitação: sem correlação com marca/modelo do veículo.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Uso em testes de ALPR (leitura de placa)</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
          Sistemas de ALPR (Automatic License Plate Recognition) precisam aceitar os dois formatos. Um teste comum: gerar lote de placas e confirmar que o parser reconhece todas.
        </p>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# tests/test_alpr_parser.py
import pytest
from fakeforge import FakeForge
from myapp.alpr import parse_placa_ocr

@pytest.fixture(scope="session")
def ff():
    return FakeForge()

@pytest.fixture
def placas_mercosul(ff):
    return ff.placa(50)

@pytest.fixture
def placas_antigas(ff):
    return ff.placa_antiga(50)


def test_alpr_parser_aceita_mercosul(placas_mercosul):
    for placa in placas_mercosul:
        resultado = parse_placa_ocr(placa)
        assert resultado is not None, f"ALPR falhou pra placa Mercosul: {placa}"


def test_alpr_parser_aceita_antiga(placas_antigas):
    for placa in placas_antigas:
        resultado = parse_placa_ocr(placa)
        assert resultado is not None, f"ALPR falhou pra placa antiga: {placa}"


def test_alpr_parser_rejeita_letra_invalida():
    placa_invalida = "ABI1234"  # I não é letra válida
    assert parse_placa_ocr(placa_invalida) is None`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Comparação: qual escolher</h2>
        <div className="overflow-x-auto rounded-lg bg-card border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-3 py-2 text-muted">Cenário</th>
                <th className="text-center px-3 py-2 text-muted">SDK fakeforge-br</th>
                <th className="text-center px-3 py-2 text-muted">Algoritmo local</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["Só placa simples", "✅", "✅"],
                ["Mercosul + antiga na mesma chamada", "✅", "⚠️ 2 funções separadas"],
                ["Validador embutido (retorna tipo)", "✅", "✅"],
                ["100% offline", "❌", "✅"],
                ["Bulk 10k+", "✅ 1 chamada", "⚠️ loop"],
                ["Custo", "Free 50/dia", "R$0"],
              ].map(([c, sdk, local], i) => (
                <tr key={i}>
                  <td className="px-3 py-2 text-muted-foreground">{c}</td>
                  <td className="px-3 py-2 text-center text-foreground">{sdk}</td>
                  <td className="px-3 py-2 text-center text-foreground">{local}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Perguntas frequentes</h2>
        <div className="space-y-4">
          {[
            { q: "Como gerar placa Mercosul válida em Python?", a: "Instale pip install fakeforge-br e chame FakeForge().placa(n). Cada placa segue o formato LLLNLNN da Resolução CONTRAN 729/2018. Pra formato antigo (LLL-NNNN), use .placa_antiga(n)." },
            { q: "As letras I, O e Q aparecem na placa gerada?", a: "Não. O DENATRAN exclui essas três letras por confusão visual com os dígitos 1 e 0. O SDK e o algoritmo local usam só as 23 letras válidas (A-Z exceto I, O, Q)." },
            { q: "Dá pra gerar as duas placas (Mercosul e antiga) na mesma chamada?", a: "Não na mesma chamada, mas são dois métodos separados no SDK: .placa(n) pra Mercosul e .placa_antiga(n) pra formato legado." },
            { q: "Serve pra testar sistema de OCR ou ALPR?", a: "Sim. É um dos usos mais comuns: gerar um lote de placas válidas nos dois formatos e confirmar que o parser de OCR/ALPR reconhece todas, incluindo o meio-letra do Mercosul." },
          ].map(({ q, a }) => (
            <details key={q} className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">{q}</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Próximos passos</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Testar API</Link>
          <Link href="/gerador-placa-nodejs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Versão Node.js</Link>
          <Link href="/gerador-placa-curl" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Versão curl</Link>
          <Link href="/gerador-placa-mercosul" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Gerador de Placa</Link>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Como gerar placa Mercosul válida em Python?", acceptedAnswer: { "@type": "Answer", text: "Instale pip install fakeforge-br e chame FakeForge().placa(n). Segue o formato LLLNLNN da Resolução CONTRAN 729/2018. Pra formato antigo use .placa_antiga(n)." } },
              { "@type": "Question", name: "As letras I, O e Q aparecem na placa gerada?", acceptedAnswer: { "@type": "Answer", text: "Não. O DENATRAN exclui essas três letras por confusão visual com os dígitos 1 e 0." } },
              { "@type": "Question", name: "Dá pra gerar as duas placas na mesma chamada?", acceptedAnswer: { "@type": "Answer", text: "Não na mesma chamada, mas são dois métodos separados: .placa(n) pra Mercosul e .placa_antiga(n) pra formato legado." } },
              { "@type": "Question", name: "Serve pra testar sistema de OCR ou ALPR?", acceptedAnswer: { "@type": "Answer", text: "Sim. Gerar um lote de placas válidas nos dois formatos e confirmar que o parser de OCR/ALPR reconhece todas é um dos usos mais comuns." } },
            ],
          }),
        }}
      />

      <BreadcrumbSchema items={[{ name: "Início", url: "/" }, { name: "Gerador Placa", url: "/gerador-placa-mercosul" }, { name: "Python", url: "/gerador-placa-python" }]} />
    </PageShell>
  );
}
