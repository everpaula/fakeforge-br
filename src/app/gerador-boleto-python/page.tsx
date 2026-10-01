import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de Boleto em Python: Linha Digitável FEBRABAN",
  description: "Monte linha digitável de boleto FEBRABAN válida em Python: 47 dígitos, mod-10 por campo e mod-11 geral. Código com pytest e Django. Zero deps.",
  keywords: "gerador de boleto python, gerar boleto python, linha digitavel python, boleto febraban python, validar linha digitavel python, codigo de barras boleto python, boleto pytest, boleto django, fator de vencimento python",
  alternates: { canonical: "/gerador-boleto-python" },
  openGraph: {
    title: "Gerador de Boleto em Python: linha digitável FEBRABAN válida",
    description: "Algoritmo FEBRABAN em Python puro: 47 dígitos, mod-10 por campo, mod-11 geral e fator de vencimento. Pra pytest e Django.",
    type: "article",
    locale: "pt_BR",
  },
};

const FAQ = [
  {
    q: "Como gerar linha digitável de boleto em Python?",
    a: "Monte o código de barras de 44 dígitos (banco, moeda, dígito geral, fator de vencimento, valor e campo livre de 25), calcule o dígito geral por mod-11 e reorganize em 3 campos com mod-10 mais o dígito geral e o campo de vencimento e valor. Totaliza 47 dígitos. O código desta página faz tudo com a biblioteca padrão.",
  },
  {
    q: "Qual a diferença entre código de barras e linha digitável?",
    a: "O código de barras tem 44 dígitos e é o que o leitor ótico lê. A linha digitável tem 47 dígitos, é o que a pessoa digita e reorganiza os mesmos dados em cinco campos, adicionando um dígito verificador mod-10 em cada um dos três primeiros. O dígito geral mod-11 aparece nos dois formatos.",
  },
  {
    q: "O que é o fator de vencimento do boleto?",
    a: "Número de 4 dígitos que conta os dias desde 07/10/1997. Ao chegar a 9999, em 21/02/2025, a contagem voltou para 1000 em 22/02/2025. Por isso o código desta página subtrai 9000 dos dias quando passam de 9999, o que cobre vencimentos até 2025 e depois.",
  },
  {
    q: "O SDK fakeforge-br gera boleto?",
    a: "Não. O SDK e a API do FakeForge não têm gerador de boleto hoje. Eles cobrem os dados ao redor, como CPF, CNPJ e nome do pagador, mas a linha digitável você monta com o algoritmo local desta página. Não prometemos um endpoint que não existe.",
  },
  {
    q: "A linha digitável gerada paga um boleto de verdade?",
    a: "Não. A linha passa na conta dos dígitos verificadores, mas não corresponde a cobrança registrada em banco algum. Use só em testes de formulário, parser, conciliação e telas de pagamento. Para emitir boleto registrado, use a API de cobrança do seu banco ou PSP.",
  },
];

export default function GeradorBoletoPython() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Python · algoritmo FEBRABAN</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">Boleto em Python</span>
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Para gerar uma linha digitável de boleto válida em Python, monte o código de barras de 44 dígitos, calcule o dígito geral por mod-11 e distribua em três campos com mod-10, chegando a 47 dígitos no padrão FEBRABAN. O FakeForge ainda não tem gerador de boleto no SDK nem na API, então esta página ensina o algoritmo local com código que roda sem dependências.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`from datetime import date
from boleto import monta_linha_digitavel

linha = monta_linha_digitavel("341", 15990, date(2026, 10, 15), "1" * 25)
print(linha)  # 34191.11111 11111.111115 11111.111115 9 16000000015990 (47 dígitos)`}</code></pre>
        <p className="text-xs text-muted-foreground mt-2">
          Código completo na próxima seção. Sem SDK de boleto: o SDK cobre CPF, CNPJ e pessoa para o pagador.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">O que o SDK fakeforge-br cobre num boleto?</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
          Nada da linha digitável em si. O SDK serve para os dados que ficam em volta: pagador (sacado), beneficiário e chave PIX, que muitos boletos trazem como alternativa de pagamento.
        </p>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`from fakeforge import FakeForge

ff = FakeForge()

pagador_cpf = ff.cpf(1, formatted=False)[0]
beneficiario = ff.company(1)[0]   # CNPJ + razão social
chave_pix = ff.pix_key(1)[0]      # alternativa de pagamento no mesmo documento`}</code></pre>

        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          Não existe <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">ff.boleto()</code>. Pra gerar a linha, use o algoritmo abaixo.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Como é a estrutura do boleto FEBRABAN?</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
          O padrão vem da FEBRABAN (Federação Brasileira de Bancos). Existem duas representações dos mesmos dados:
        </p>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`CÓDIGO DE BARRAS (44 dígitos)
  pos 1-3    banco (ex: 341 Itaú, 237 Bradesco, 001 Banco do Brasil)
  pos 4      moeda (9 = real)
  pos 5      dígito verificador geral (mod-11)
  pos 6-9    fator de vencimento (dias desde 07/10/1997)
  pos 10-19  valor em centavos
  pos 20-44  campo livre (25 dígitos, layout definido por cada banco)

LINHA DIGITÁVEL (47 dígitos, 5 campos)
  campo 1   banco + moeda + 5 primeiros do campo livre   + DV mod-10
  campo 2   posições 6-15 do campo livre                 + DV mod-10
  campo 3   posições 16-25 do campo livre                + DV mod-10
  campo 4   dígito verificador geral (mod-11)
  campo 5   fator de vencimento (4) + valor (10)`}</code></pre>

        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          O campo livre é a parte que muda de banco pra banco (carteira, nosso número, agência, conta). Para teste de parser e validação de DV, 25 dígitos quaisquer servem. Para simular o layout de um banco específico, consulte o manual de cobrança dele.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Como gerar boleto em Python sem dependências?</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# boleto.py - linha digitável FEBRABAN, biblioteca padrão
import random
from datetime import date


def mod10(campo: str) -> int:
    """Pesos 2,1,2,1... da direita pra esquerda; soma os algarismos do produto."""
    soma = 0
    for i, c in enumerate(reversed(campo)):
        p = int(c) * (2 if i % 2 == 0 else 1)
        soma += p // 10 + p % 10
    return (10 - soma % 10) % 10


def mod11_barras(corpo: str) -> int:
    """Pesos 2..9 da direita pra esquerda sobre os 43 dígitos. 0, 10 e 11 viram 1."""
    soma = sum(int(c) * (2 + i % 8) for i, c in enumerate(reversed(corpo)))
    dv = 11 - soma % 11
    return 1 if dv in (0, 10, 11) else dv


def fator_vencimento(venc: date) -> int:
    dias = (venc - date(1997, 10, 7)).days
    # A contagem chegou a 9999 em 21/02/2025 e recomeçou em 1000 no dia seguinte
    return dias - 9000 if dias > 9999 else dias


def monta_linha_digitavel(banco: str, valor_centavos: int, venc: date, campo_livre: str) -> str:
    assert len(banco) == 3 and len(campo_livre) == 25
    fator = f"{fator_vencimento(venc):04d}"
    valor = f"{valor_centavos:010d}"

    corpo = f"{banco}9{fator}{valor}{campo_livre}"  # 43 dígitos, sem o DV geral
    dv_geral = mod11_barras(corpo)
    barras = corpo[:4] + str(dv_geral) + corpo[4:]  # 44 dígitos

    c1 = barras[0:4] + barras[19:24]
    c2 = barras[24:34]
    c3 = barras[34:44]
    return (
        f"{c1[:5]}.{c1[5:]}{mod10(c1)} "
        f"{c2[:5]}.{c2[5:]}{mod10(c2)} "
        f"{c3[:5]}.{c3[5:]}{mod10(c3)} "
        f"{dv_geral} {fator}{valor}"
    )


def valida_linha_digitavel(linha: str) -> bool:
    d = "".join(c for c in linha if c.isdigit())
    if len(d) != 47:
        return False
    c1, c2, c3 = d[0:9], d[10:20], d[21:31]
    if (mod10(c1), mod10(c2), mod10(c3)) != (int(d[9]), int(d[20]), int(d[31])):
        return False
    # reconstrói os 43 dígitos do corpo: banco+moeda, fator+valor, campo livre
    corpo = d[0:4] + d[33:47] + d[4:9] + d[10:20] + d[21:31]
    return mod11_barras(corpo) == int(d[32])


def gera_boleto_teste(banco: str = "341", valor_centavos: int = 15990,
                      venc: date | None = None) -> str:
    livre = "".join(str(random.randint(0, 9)) for _ in range(25))
    return monta_linha_digitavel(banco, valor_centavos, venc or date.today(), livre)`}</code></pre>

        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          Isso gera a linha digitável de teste, não um boleto registrado. Para emitir cobrança real (PDF, registro na CIP, nosso número controlado), use a API do seu banco ou PSP. Existem bibliotecas open source de PDF de boleto, como <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">pyboleto</code>, mas avalie a manutenção antes de adotar em produção.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Como testar linha digitável em pytest?</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# tests/test_boleto.py
from datetime import date
import pytest
from boleto import (
    fator_vencimento, gera_boleto_teste, valida_linha_digitavel,
)

# Exemplo público de documentação de cobrança (Itaú), com DVs corretos
LINHA_CONHECIDA = "34191.79001 01043.510047 91020.150008 1 84340000012345"


def test_validador_aceita_linha_conhecida():
    assert valida_linha_digitavel(LINHA_CONHECIDA)


def test_validador_rejeita_dv_de_campo_adulterado():
    adulterada = LINHA_CONHECIDA.replace("79001", "79002", 1)
    assert not valida_linha_digitavel(adulterada)


@pytest.mark.parametrize("banco", ["001", "237", "341", "033", "260"])
def test_linha_gerada_tem_47_digitos_e_valida(banco):
    linha = gera_boleto_teste(banco=banco, venc=date(2026, 10, 15))
    assert len("".join(c for c in linha if c.isdigit())) == 47
    assert valida_linha_digitavel(linha)


def test_valor_fica_nos_ultimos_10_digitos():
    linha = gera_boleto_teste(valor_centavos=15990, venc=date(2026, 10, 15))
    assert linha[-10:] == "0000015990"


def test_fator_de_vencimento_reinicia_em_22_fev_2025():
    assert fator_vencimento(date(1997, 10, 7)) == 0
    assert fator_vencimento(date(2025, 2, 21)) == 9999
    assert fator_vencimento(date(2025, 2, 22)) == 1000`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Como popular um banco Django com boletos de teste?</h2>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# cobranca/management/commands/seed_boletos.py
import random
from datetime import date, timedelta

from django.core.management.base import BaseCommand
from fakeforge import FakeForge

from boleto import gera_boleto_teste
from cobranca.models import Boleto


class Command(BaseCommand):
    help = "Cria boletos de teste com linha digitável válida e CPF de pagador"

    def add_arguments(self, parser):
        parser.add_argument("--qtd", type=int, default=200)

    def handle(self, *args, **options):
        qtd = options["qtd"]
        cpfs = FakeForge().cpf(qtd, formatted=False)  # 1 chamada de API

        boletos = []
        for cpf in cpfs:
            venc = date.today() + timedelta(days=random.randint(1, 60))
            valor = random.randint(5_000, 500_000)  # centavos
            boletos.append(Boleto(
                pagador_cpf=cpf,
                valor_centavos=valor,
                vencimento=venc,
                linha_digitavel=gera_boleto_teste("341", valor, venc),
            ))
        Boleto.objects.bulk_create(boletos)
        self.stdout.write(f"{qtd} boletos criados")`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">SDK ou algoritmo local: o que usar em boleto?</h2>

        <div className="overflow-x-auto rounded-lg bg-card border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-3 py-2 text-muted">Necessidade</th>
                <th className="text-center px-3 py-2 text-muted">SDK fakeforge-br</th>
                <th className="text-center px-3 py-2 text-muted">Algoritmo local</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["Linha digitável FEBRABAN", "Não existe", "Sim"],
                ["CPF e CNPJ do pagador", "Sim", "Não"],
                ["Chave PIX no mesmo cenário", "Sim", "Não"],
                ["100% offline", "Não", "Sim"],
                ["Zero deps runtime", "Sim", "Sim"],
                ["Boleto registrado de verdade", "Não", "Não (use API do banco)"],
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
          Quer a versão em Node.js do algoritmo? Leia o <Link href="/blog/gerar-boleto-febraban-linha-digitavel-nodejs-testes" className="text-primary hover:underline">tutorial de boleto FEBRABAN em Node.js</Link>. Dados do pagador em volume: veja os <Link href="/pricing" className="text-primary hover:underline">planos</Link>.
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
          <Link href="/blog/gerar-boleto-febraban-linha-digitavel-nodejs-testes" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Boleto em Node.js</Link>
          <Link href="/gerador-pix-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">PIX em Python</Link>
          <Link href="/gerador-pix" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Gerador de PIX</Link>
          <Link href="/gerador-cpf-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">CPF em Python</Link>
          <Link href="/gerador-conta-bancaria" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Conta bancária</Link>
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
        { name: "Geradores", url: "/geradores" },
        { name: "Boleto em Python", url: "/gerador-boleto-python" },
      ]} />
    </PageShell>
  );
}
