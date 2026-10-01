import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de Título de Eleitor em Python: SDK + TSE (2026)",
  description: "Gere título de eleitor válido em Python com o SDK fakeforge-br ou o algoritmo local do TSE com código de UF. Pytest e Django inclusos. Grátis 50/dia.",
  keywords: "gerador de titulo de eleitor python, gerar titulo de eleitor python, titulo eleitor valido python, validar titulo de eleitor python, algoritmo titulo eleitor python, titulo eleitor tse mod-11, titulo eleitor pytest, titulo eleitor django",
  alternates: { canonical: "/gerador-titulo-eleitor-python" },
  openGraph: {
    title: "Gerador de Título de Eleitor em Python: SDK oficial + algoritmo local",
    description: "SDK oficial fakeforge-br + algoritmo do TSE em Python puro, com escolha de UF. Pra pytest e Django.",
    type: "article",
    locale: "pt_BR",
  },
};

const FAQ = [
  {
    q: "Como gerar título de eleitor válido em Python?",
    a: "Instale pip install fakeforge-br e chame FakeForge().titulo_eleitor(n). Sem SDK, sorteie 8 dígitos, acrescente o código da UF (01 a 28), calcule o primeiro dígito verificador com pesos 2 a 9 e o segundo com pesos 7, 8 e 9 sobre o código da UF mais o primeiro dígito.",
  },
  {
    q: "Qual é a estrutura do título de eleitor?",
    a: "12 dígitos: 8 sequenciais, 2 do código da UF de inscrição (01 SP, 02 MG, 03 RJ e assim por diante até 28 para o exterior) e 2 dígitos verificadores. O formato é definido pelo TSE (Tribunal Superior Eleitoral).",
  },
  {
    q: "Qual a regra especial dos dígitos verificadores para SP e MG?",
    a: "Nos dois cálculos, se o resto da divisão por 11 for 10, o dígito vira 0. Quando a UF é 01 (SP) ou 02 (MG) e o resto é 0, o dígito vira 1. Esquecer essa regra gera títulos inválidos justamente nos dois estados mais populosos.",
  },
  {
    q: "Dá pra escolher a UF do título gerado?",
    a: "Com o algoritmo local, sim: gera_titulo_eleitor('MG') fixa o código 02. O SDK sorteia a UF entre as 28 possíveis a cada título, sem parâmetro para fixá-la. Se o seu teste precisa de um estado específico, use o algoritmo local.",
  },
  {
    q: "O título de eleitor gerado pertence a alguém?",
    a: "Não. O número é sorteado e só passa na conta dos dígitos verificadores. Não está vinculado a nenhum eleitor, zona ou seção do TSE. Use apenas em testes de formulário, validação e cadastro, nunca para se passar por eleitor.",
  },
];

export default function GeradorTituloEleitorPython() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Python · SDK + algoritmo</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">Título de Eleitor em Python</span>
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Para gerar título de eleitor válido em Python, instale <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">pip install fakeforge-br</code> e chame <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">FakeForge().titulo_eleitor(n)</code>, ou calcule localmente os 12 dígitos do padrão TSE: 8 sequenciais, 2 de código de UF e 2 verificadores em mod-11. O guia traz o SDK, o algoritmo e testes prontos.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`pip install fakeforge-br

from fakeforge import FakeForge
titulos = FakeForge().titulo_eleitor(100)  # 100 títulos válidos, UF sorteada`}</code></pre>
        <p className="text-xs text-muted-foreground mt-2">
          Free 50 chamadas/dia sem cadastro. Versão no navegador: <Link href="/gerador-titulo-eleitor" className="text-primary hover:underline">Gerador de Título de Eleitor</Link>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Como gerar título de eleitor em Python com o SDK?</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
          <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">.titulo_eleitor(n)</code> devolve uma lista de strings.
        </p>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`from fakeforge import FakeForge

ff = FakeForge()

# 1 título formatado (grupos de 4 pra leitura)
titulo = ff.titulo_eleitor(1)[0]
print(titulo)  # "3847 5921 0213"

# 1000 títulos só com os 12 dígitos
titulos = ff.titulo_eleitor(1000, formatted=False)

# Pessoa de teste: CPF + título
cpfs = ff.cpf(10)
titulos = ff.titulo_eleitor(10)
eleitores = list(zip(cpfs, titulos))`}</code></pre>

        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          Requer internet, porque o SDK chama o endpoint HTTP. A UF de cada título é sorteada e o SDK não tem parâmetro pra fixá-la. Quando o teste exige um estado específico, use o algoritmo da próxima seção.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Qual é o algoritmo do título de eleitor em Python?</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
          O título tem 12 dígitos: <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">NNNNNNNN UU D1 D2</code>. O primeiro dígito verificador usa os 8 sequenciais com pesos 2 a 9. O segundo usa os 2 dígitos da UF e o primeiro verificador com pesos 7, 8 e 9. Versão offline, sem dependência:
        </p>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# titulo_eleitor.py - implementação pura, offline
import random

# Código de UF do título (TSE): 01 a 28
UFS = {
    "SP": "01", "MG": "02", "RJ": "03", "RS": "04", "BA": "05",
    "PR": "06", "CE": "07", "PE": "08", "SC": "09", "GO": "10",
    "MA": "11", "PB": "12", "PA": "13", "ES": "14", "PI": "15",
    "RN": "16", "AL": "17", "MT": "18", "MS": "19", "DF": "20",
    "SE": "21", "AM": "22", "RO": "23", "AC": "24", "AP": "25",
    "RR": "26", "TO": "27", "ZZ": "28",  # ZZ = exterior
}


def calcula_dv(digitos: list[int], pesos, cod_uf: str) -> int:
    dv = sum(d * p for d, p in zip(digitos, pesos)) % 11
    if dv == 10:
        dv = 0
    if dv == 0 and cod_uf in ("01", "02"):  # regra SP e MG
        dv = 1
    return dv


def gera_titulo_eleitor(uf: str = "SP") -> str:
    cod = UFS[uf]
    base = [random.randint(0, 9) for _ in range(8)]
    dv1 = calcula_dv(base, range(2, 10), cod)
    dv2 = calcula_dv([int(cod[0]), int(cod[1]), dv1], (7, 8, 9), cod)
    return "".join(map(str, base)) + cod + str(dv1) + str(dv2)


def valida_titulo_eleitor(titulo: str) -> bool:
    d = "".join(c for c in titulo if c.isdigit())
    if len(d) != 12 or len(set(d)) == 1:
        return False
    cod = d[8:10]
    if cod not in UFS.values():
        return False
    n = [int(c) for c in d]
    ok1 = calcula_dv(n[:8], range(2, 10), cod) == n[10]
    ok2 = calcula_dv([n[8], n[9], n[10]], (7, 8, 9), cod) == n[11]
    return ok1 and ok2`}</code></pre>

        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          Vantagens: zero deps, offline e UF à sua escolha. Limitação: só o título, sem zona ou seção eleitoral e sem correlação com o resto da pessoa.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Como testar título de eleitor em pytest?</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# tests/test_titulo_eleitor.py
import pytest
from titulo_eleitor import UFS, gera_titulo_eleitor, valida_titulo_eleitor


@pytest.mark.parametrize("uf", list(UFS))
def test_titulo_gerado_passa_no_validador(uf):
    for _ in range(100):
        assert valida_titulo_eleitor(gera_titulo_eleitor(uf))


@pytest.mark.parametrize("uf", ["SP", "MG"])
def test_ufs_com_regra_especial(uf):
    # 2000 títulos garantem casos de resto 0 nos dois estados
    for _ in range(2000):
        assert valida_titulo_eleitor(gera_titulo_eleitor(uf))


def test_codigo_uf_fica_nas_posicoes_9_e_10():
    assert gera_titulo_eleitor("MG")[8:10] == "02"


def test_validador_rejeita_dv_adulterado():
    titulo = gera_titulo_eleitor("RJ")
    dv_errado = str((int(titulo[-1]) + 1) % 10)
    assert not valida_titulo_eleitor(titulo[:-1] + dv_errado)


def test_validador_rejeita_uf_inexistente():
    assert not valida_titulo_eleitor("123456789912")  # UF 99`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Como popular um banco Django com título de eleitor?</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# cadastro/management/commands/seed_eleitores.py
from django.core.management.base import BaseCommand
from fakeforge import FakeForge
from cadastro.models import Eleitor


class Command(BaseCommand):
    help = "Cria eleitores de teste com CPF e título válidos"

    def add_arguments(self, parser):
        parser.add_argument("--qtd", type=int, default=500)

    def handle(self, *args, **options):
        qtd = options["qtd"]
        ff = FakeForge()
        cpfs = ff.cpf(qtd, formatted=False)
        titulos = ff.titulo_eleitor(qtd, formatted=False)
        nomes = ff.full_name(qtd)

        Eleitor.objects.bulk_create(
            [Eleitor(nome=n, cpf=c, titulo=t) for n, c, t in zip(nomes, cpfs, titulos)],
            ignore_conflicts=True,
        )
        self.stdout.write(f"{qtd} eleitores criados")`}</code></pre>
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
                ["Só título simples", "Sim", "Sim"],
                ["Escolher a UF do título", "Não (UF sorteada)", "Sim"],
                ["Pessoa correlacionada (nome + CPF)", "Sim", "Não"],
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
          Mais volume ou mais itens por chamada? Veja os <Link href="/pricing" className="text-primary hover:underline">planos</Link>.
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
          <Link href="/gerador-titulo-eleitor" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Gerador de Título de Eleitor</Link>
          <Link href="/gerador-cpf-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">CPF em Python</Link>
          <Link href="/gerador-cpf" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Gerador de CPF</Link>
          <Link href="/gerador-rg-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">RG em Python</Link>
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
        { name: "Gerador Título de Eleitor", url: "/gerador-titulo-eleitor" },
        { name: "Python", url: "/gerador-titulo-eleitor-python" },
      ]} />
    </PageShell>
  );
}
