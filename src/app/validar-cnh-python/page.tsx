import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Validar CNH em Python: algoritmo DENATRAN pronto",
  description: "Como validar CNH em Python: mod-11 do DENATRAN com código que roda standalone, testes com pytest e conferência com a API FakeForge.",
  keywords: "validar cnh python, validação de cnh python, verificar cnh python, algoritmo cnh python, dígito verificador cnh, cnh denatran mod-11, cnh válida python",
  alternates: { canonical: "/validar-cnh-python" },
  openGraph: {
    title: "Validar CNH em Python com código pronto",
    description: "Mod-11 DENATRAN. Código standalone, testes com pytest e dicas de produção.",
    type: "article",
    locale: "pt_BR",
  },
};

const faq = [
  {
    "q": "Como validar CNH em Python?",
    "a": "Use a função valida_cnh desta página: ela limpa espaços e pontuação, exige 11 dígitos, rejeita repetidos e recalcula os dois dígitos verificadores pelo mod-11 do DENATRAN, incluindo o desconto de 2. Só biblioteca padrão."
  },
  {
    "q": "Como calcular o dígito verificador da CNH?",
    "a": "O primeiro DV soma os 9 primeiros dígitos com pesos de 9 a 1 e toma o resto por 11. O segundo soma os mesmos 9 dígitos com pesos de 1 a 9, toma o resto por 11 e subtrai o desconto. Resultados de 10 ou mais viram 0."
  },
  {
    "q": "O que é o desconto de 2 no cálculo da CNH?",
    "a": "Quando o resto do primeiro DV é 10 ou mais, o DV vira 0 e o segundo DV é calculado subtraindo 2 do resto. Se o resultado ficar negativo, soma-se 11. Esquecer esse passo faz o validador rejeitar cerca de 1 em cada 11 CNHs legítimas."
  },
  {
    "q": "CNH válida quer dizer habilitação vigente?",
    "a": "Não. A validação confere só a matemática do número de registro. Vigência, suspensão e categoria só se consultam nos órgãos de trânsito (Senatran e Detrans)."
  },
  {
    "q": "A API do FakeForge valida CNH?",
    "a": "Não. A API gera CNHs com dígitos corretos (type=cnh), e a validação roda no seu código. Use o lote gerado como casos positivos e troque o último dígito para casos negativos."
  }
];

export default function ValidarCnhPython() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">{"Python · algoritmo local + API"}</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Validar <span className="text-primary">{"CNH em Python"}</span>
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          {"Para validar CNH em Python, recalcule os dois dígitos verificadores do registro de 11 dígitos pelo mod-11 do DENATRAN, com pesos 9 a 1 e 1 a 9."} {"Quando o primeiro cálculo dá resto 10, o dígito vira 0 e o segundo perde 2. A validação confirma só a matemática, não se a habilitação está vigente. Abaixo: uma função Python só com a biblioteca padrão, testes e conferência com CNHs da API."}
        </p>
        <p className="text-xs text-muted-foreground mt-3 max-w-2xl">{"Fonte: algoritmo do dígito verificador do número de registro da CNH, do DENATRAN (hoje Senatran)."}</p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`def valida_cnh(cnh: str) -> bool:
    d = [int(c) for c in cnh if c.isdigit()]
    if len(d) != 11 or len(set(d)) == 1:
        return False
    dv1, dsc = sum(n * p for n, p in zip(d[:9], range(9, 0, -1))) % 11, 0
    if dv1 >= 10:
        dv1, dsc = 0, 2
    dv2 = (sum(n * p for n, p in zip(d[:9], range(1, 10))) % 11 - dsc) % 11
    return d[9] == dv1 and d[10] == (0 if dv2 >= 10 else dv2)


print(valida_cnh("123 456 789 00"))  # True
print(valida_cnh("123 456 789 01"))  # False`}</code></pre>
        <p className="text-xs text-muted-foreground mt-2">
          {"Python 3.9+, sem pip install. Salve cada bloco no arquivo indicado no topo."}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">{"Rota 1: validar CNH em Python com o algoritmo local"}</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{"Versão completa com o desconto do segundo dígito comentado. Aceita espaços, pontos e hífen, e rejeita os 11 dígitos iguais."}</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# validador_cnh.py (só stdlib)
import re


def valida_cnh(cnh: str) -> bool:
    """Valida o número de registro da CNH (11 dígitos) pelo mod-11 do DENATRAN."""
    s = re.sub(r"[\\s.-]", "", cnh)
    if not re.fullmatch(r"\\d{11}", s) or len(set(s)) == 1:
        return False
    d = [int(c) for c in s]

    # 1º DV: pesos 9 a 1 sobre os 9 primeiros dígitos
    dv1 = sum(n * p for n, p in zip(d[:9], range(9, 0, -1))) % 11
    dsc = 0
    if dv1 >= 10:  # resto 10: DV vira 0 e o 2º DV sofre desconto de 2
        dv1, dsc = 0, 2

    # 2º DV: pesos 1 a 9 sobre os mesmos 9 dígitos, menos o desconto
    dv2 = sum(n * p for n, p in zip(d[:9], range(1, 10))) % 11 - dsc
    if dv2 < 0:
        dv2 += 11
    if dv2 >= 10:
        dv2 = 0

    return d[9] == dv1 and d[10] == dv2


if __name__ == "__main__":
    for cnh in ("123 456 789 00", "12345678900", "987.654.321-09", "123 456 789 01", "123 456 702 02", "000 000 001 19"):
        print(f"{cnh!r:18} -> {valida_cnh(cnh)}")`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">{"Como o cálculo do dígito verificador da CNH funciona"}</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{"Um exemplo calculado à mão, para você conferir o código contra a conta."}</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`CNH 123 456 789 00

1º DV: 1×9 + 2×8 + 3×7 + 4×6 + 5×5 + 6×4 + 7×3 + 8×2 + 9×1
      = 165
      165 mod 11 = 0  ->  DV1 = 0, desconto 0

2º DV: 1×1 + 2×2 + 3×3 + 4×4 + 5×5 + 6×6 + 7×7 + 8×8 + 9×9
      = 285
      285 mod 11 = 10  ->  resultado >= 10 vira 0

Caso do desconto: CNH 123 456 702 02

1º DV: 1×9 + 2×8 + 3×7 + 4×6 + 5×5 + 6×4 + 7×3 + 0×2 + 2×1
      = 142
      142 mod 11 = 10 (>= 10)  ->  DV1 = 0 e desconto = 2

2º DV: 1×1 + 2×2 + 3×3 + 4×4 + 5×5 + 6×6 + 7×7 + 0×8 + 2×9
      = 158
      158 mod 11 = 4, menos o desconto 2 = 2  ->  DV2 = 2`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">{"Rota 2: conferir o validador com CNHs da API do FakeForge"}</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{"A API do FakeForge gera CNHs válidas, mas não tem endpoint de validação. Use o lote gerado como oráculo de teste: todas precisam passar no seu validador, e com o último dígito trocado precisam falhar."}</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# confere_cnh_api.py (stdlib). Salve o validador da Rota 1 como validador_cnh.py
import json
import urllib.request

from validador_cnh import valida_cnh

URL = "https://fakeforge.com.br/api/generate?type=cnh&quantity=30"

with urllib.request.urlopen(URL, timeout=10) as resp:
    cnhs = json.load(resp)["data"]


def troca_ultimo_digito(cnh: str) -> str:
    return cnh[:-1] + str((int(cnh[-1]) + 1) % 10)


rejeitados_indevidos = [c for c in cnhs if not valida_cnh(c)]
aceitos_indevidos = [c for c in cnhs if valida_cnh(troca_ultimo_digito(c))]

print(f"{len(cnhs)} CNHs da API | válidas rejeitadas: {len(rejeitados_indevidos)} | inválidas aceitas: {len(aceitos_indevidos)}")
assert not rejeitados_indevidos and not aceitos_indevidos`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">{"Como testar o validador de CNH com pytest"}</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{"Rode com "}<code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">{"pytest -q"}</code>{". Os casos cobrem válidos, inválidos e as bordas de CNH."}</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# test_validador_cnh.py (pytest)
import pytest

from validador_cnh import valida_cnh

VALIDOS = [
    "123 456 789 00",
    "12345678900",
    "987.654.321-09",
    "123 456 702 02",  # caso do desconto: 1º DV com resto 10 vira 0 e o 2º perde 2
]
INVALIDOS = [
    "123 456 789 01",  # 2º DV errado
    "123 456 789 10",  # 1º DV errado
    "111 111 111 11",  # repetidos
    "123 456 789 0",   # curto demais
    "",
]


@pytest.mark.parametrize("cnh", VALIDOS)
def test_aceita_cnh_valida(cnh):
    assert valida_cnh(cnh) is True


@pytest.mark.parametrize("cnh", INVALIDOS)
def test_rejeita_cnh_invalida(cnh):
    assert valida_cnh(cnh) is False`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">{"Validar CNH: algoritmo local ou serviço externo"}</h2>
        <div className="overflow-x-auto rounded-lg bg-card border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-3 py-2 text-muted">Cenário</th>
                <th className="text-center px-3 py-2 text-muted">{"Algoritmo local"}</th>
                <th className="text-center px-3 py-2 text-muted">{"API FakeForge (geração)"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[["Confere os dígitos verificadores", "Sim", "Não, a API só gera"], ["Gera CNHs válidas para teste", "Não", "Sim, até 10.000 por chamada"], ["Funciona offline", "Sim", "Não"], ["Confirma que a habilitação está vigente", "Não", "Não"], ["Dependências", "Nenhuma", "Uma chamada HTTP"], ["Custo", "R$ 0", "Grátis até 50 chamadas por dia"]].map(([c, a, b]) => (
                <tr key={c}>
                  <td className="px-3 py-2 text-muted-foreground">{c}</td>
                  <td className="px-3 py-2 text-center text-foreground">{a}</td>
                  <td className="px-3 py-2 text-center text-foreground">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">{"Perguntas frequentes sobre validar CNH em Python"}</h2>
        <div className="space-y-4">
          {faq.map(({ q, a }) => (
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
        <h2 className="text-xl font-bold text-foreground mb-3">Páginas relacionadas</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/gerador-cnh" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">{"Gerador de CNH"}</Link>
          <Link href="/gerador-cnh-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">{"Gerar CNH em Python"}</Link>
          <Link href="/validar-cnh-nodejs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">{"Validar CNH em Node.js"}</Link>
          <Link href="/validar-cnh-curl" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">{"Validar CNH via curl"}</Link>
          <Link href="/docs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">{"Docs da API"}</Link>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map(({ q, a }) => ({
              "@type": "Question",
              name: q,
              acceptedAnswer: { "@type": "Answer", text: a },
            })),
          }),
        }}
      />

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Gerador CNH", url: "/gerador-cnh" },
        { name: "Python", url: "/validar-cnh-python" },
      ]} />
    </PageShell>
  );
}
