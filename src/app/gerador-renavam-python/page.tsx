import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de RENAVAM em Python: SDK + Algoritmo (2026)",
  description: "Gere RENAVAM válido em Python com o SDK fakeforge-br ou o algoritmo mod-11 do DENATRAN local. Snippets pra pytest e Django. Grátis 50/dia.",
  keywords: "gerador de renavam python, gerar renavam python, renavam valido python, validar renavam python, algoritmo renavam python, renavam django, renavam pytest, renavam denatran mod-11",
  alternates: { canonical: "/gerador-renavam-python" },
  openGraph: {
    title: "Gerador de RENAVAM em Python: SDK oficial + algoritmo local",
    description: "SDK oficial fakeforge-br + algoritmo mod-11 do DENATRAN em Python puro. Pra pytest e Django.",
    type: "article",
    locale: "pt_BR",
  },
};

const FAQ = [
  {
    q: "Como gerar RENAVAM válido em Python?",
    a: "Instale pip install fakeforge-br e chame FakeForge().renavam(n). Sem SDK, sorteie 10 dígitos, multiplique pelos pesos 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, some os produtos e calcule o dígito verificador como 11 menos o resto da divisão por 11, usando 0 quando o resultado for 10 ou 11.",
  },
  {
    q: "Quantos dígitos tem o RENAVAM?",
    a: "11 dígitos: 10 dígitos de base mais 1 dígito verificador. Registros antigos tinham 9 dígitos, mas o padrão atual do DENATRAN (hoje Senatran) usa 11, e é o que o gerador e o validador deste guia seguem.",
  },
  {
    q: "Como validar um RENAVAM em Python?",
    a: "Remova tudo que não for dígito, confira que sobraram 11 números e que eles não são todos iguais, recalcule o dígito verificador com os pesos 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 e compare com o último dígito. A função valida_renavam desta página faz isso em 6 linhas.",
  },
  {
    q: "O RENAVAM gerado pertence a um veículo real?",
    a: "Não. O número passa na conta do dígito verificador, mas é sorteado e não está vinculado a nenhum veículo no sistema do DENATRAN. Serve para testar formulários, validações e cadastros em ambiente de teste, nunca para consulta ou fraude.",
  },
  {
    q: "O SDK fakeforge-br gera RENAVAM?",
    a: "Sim. O método ff.renavam(n) retorna lista de RENAVAMs válidos, formatados em grupos de 4 por padrão. Use formatted=False para receber só os 11 dígitos. O endpoint HTTP chama o mesmo gerador que roda no site.",
  },
];

export default function GeradorRenavamPython() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Python · SDK + algoritmo</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">RENAVAM em Python</span>
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Para gerar RENAVAM válido em Python, instale <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">pip install fakeforge-br</code> e chame <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">FakeForge().renavam(n)</code>, ou calcule localmente os 10 dígitos de base mais o dígito verificador mod-11 do DENATRAN. Os dois caminhos geram números com 11 dígitos que passam em qualquer validador de formato. Abaixo estão o SDK, o algoritmo completo e testes prontos.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`pip install fakeforge-br

from fakeforge import FakeForge
renavams = FakeForge().renavam(100)  # 100 RENAVAMs válidos mod-11`}</code></pre>
        <p className="text-xs text-muted-foreground mt-2">
          Free 50 chamadas/dia sem cadastro. Quer ver o gerador no navegador? Use o <Link href="/gerador-renavam" className="text-primary hover:underline">Gerador de RENAVAM</Link>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Como gerar RENAVAM em Python com o SDK?</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
          A rota mais curta. <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">.renavam(n)</code> devolve uma lista de strings.
        </p>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`from fakeforge import FakeForge

ff = FakeForge()

# 1 RENAVAM formatado (grupos de 4 pra leitura)
renavam = ff.renavam(1)[0]
print(renavam)  # "5821 0347 696"

# 1000 RENAVAMs só com os 11 dígitos
renavams = ff.renavam(1000, formatted=False)

# Veículo de teste: RENAVAM + placa Mercosul
renavams = ff.renavam(10, formatted=False)
placas = ff.placa(10)
veiculos = list(zip(renavams, placas))`}</code></pre>

        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          Requer internet, porque o SDK chama o endpoint HTTP. O RENAVAM não é correlacionado com a placa: são dois sorteios independentes, o que basta pra cadastro de teste.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Qual é o algoritmo do RENAVAM em Python?</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
          O RENAVAM (Registro Nacional de Veículos Automotores) tem 11 dígitos. Os 10 primeiros são sequenciais e o último é o dígito verificador, calculado por mod-11 com pesos fixos do DENATRAN. Versão offline, sem dependência:
        </p>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# renavam.py - implementação pura, offline
import random

PESOS = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2]


def calcula_dv(base: list[int]) -> int:
    """DV = 11 - (soma ponderada % 11). Resultado 10 ou 11 vira 0."""
    soma = sum(d * p for d, p in zip(base, PESOS))
    dv = 11 - (soma % 11)
    return 0 if dv >= 10 else dv


def gera_renavam() -> str:
    base = [random.randint(0, 9) for _ in range(10)]
    return "".join(map(str, base + [calcula_dv(base)]))


def valida_renavam(renavam: str) -> bool:
    d = [int(c) for c in renavam if c.isdigit()]
    if len(d) != 11 or len(set(d)) == 1:
        return False
    return calcula_dv(d[:10]) == d[10]`}</code></pre>

        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          Alguns manuais descrevem a mesma conta como <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">(soma * 10) % 11</code> com resultado 10 virando 0. Os dois jeitos dão o mesmo dígito para todas as somas, e o código do FakeForge usa essa segunda forma. Vantagens do local: zero deps e offline. Limitação: só RENAVAM, sem placa nem outros documentos do veículo.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Como testar RENAVAM em pytest?</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
          Teste unitário que garante que o gerador só produz dígito verificador correto e que o validador rejeita número adulterado.
        </p>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# tests/test_renavam.py
import pytest
from renavam import gera_renavam, valida_renavam


def test_renavam_gerado_tem_11_digitos():
    assert len(gera_renavam()) == 11


@pytest.mark.parametrize("_", range(500))
def test_renavam_gerado_passa_no_validador(_):
    assert valida_renavam(gera_renavam())


def test_validador_rejeita_dv_errado():
    renavam = gera_renavam()
    dv_errado = str((int(renavam[-1]) + 1) % 10)
    assert not valida_renavam(renavam[:-1] + dv_errado)


def test_validador_rejeita_sequencia_repetida():
    assert not valida_renavam("11111111111")


# Com o SDK, em tests/conftest.py
@pytest.fixture(scope="session")
def renavams_sdk():
    from fakeforge import FakeForge
    return FakeForge().renavam(50, formatted=False)


def test_renavams_do_sdk_sao_validos(renavams_sdk):
    assert all(valida_renavam(r) for r in renavams_sdk)`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Como popular um banco Django com RENAVAM?</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# frota/management/commands/seed_veiculos.py
from django.core.management.base import BaseCommand
from fakeforge import FakeForge
from frota.models import Veiculo


class Command(BaseCommand):
    help = "Cria veículos de teste com RENAVAM e placa válidos"

    def add_arguments(self, parser):
        parser.add_argument("--qtd", type=int, default=500)

    def handle(self, *args, **options):
        qtd = options["qtd"]
        ff = FakeForge()
        renavams = ff.renavam(qtd, formatted=False)
        placas = ff.placa(qtd)

        Veiculo.objects.bulk_create(
            [Veiculo(renavam=r, placa=p) for r, p in zip(renavams, placas)],
            ignore_conflicts=True,  # renavam unique: colisão é rara, não quebra o seed
        )
        self.stdout.write(f"{qtd} veículos criados")`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">SDK ou algoritmo local: qual escolher?</h2>

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
                ["Só RENAVAM simples", "Sim", "Sim"],
                ["RENAVAM + placa Mercosul", "Sim", "Não (só RENAVAM)"],
                ["Preset com pessoa correlacionada", "Sim", "Não"],
                ["100% offline", "Não", "Sim"],
                ["Zero deps runtime", "Sim", "Sim"],
                ["Bulk 10k+", "1 chamada", "Loop"],
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
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          Precisa de mais de 50 chamadas por dia ou de 10 mil itens por request? Veja os <Link href="/pricing" className="text-primary hover:underline">planos</Link>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Perguntas frequentes</h2>
        <div className="space-y-4">
          {FAQ.map(({ q, a }) => (
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
          <Link href="/gerador-renavam" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Gerador de RENAVAM</Link>
          <Link href="/gerador-placa-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Placa em Python</Link>
          <Link href="/gerador-placa-mercosul" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Placa Mercosul</Link>
          <Link href="/gerador-cpf-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">CPF em Python</Link>
          <Link href="/pricing" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Preços</Link>
          <Link href="/docs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Docs completas</Link>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ.map(({ q, a }) => ({
              "@type": "Question",
              name: q,
              acceptedAnswer: { "@type": "Answer", text: a },
            })),
          }),
        }}
      />

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Gerador RENAVAM", url: "/gerador-renavam" },
        { name: "Python", url: "/gerador-renavam-python" },
      ]} />
    </PageShell>
  );
}
