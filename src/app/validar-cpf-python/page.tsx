import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Validar CPF em Python: mod-11 com código pronto",
  description: "Como validar CPF em Python: mod-11 da Receita Federal com código que roda standalone, testes com pytest e conferência com a API FakeForge.",
  keywords: "validar cpf python, validação de cpf python, verificar cpf python, algoritmo cpf python, mod-11 cpf, dígito verificador cpf, cpf válido python",
  alternates: { canonical: "/validar-cpf-python" },
  openGraph: {
    title: "Validar CPF em Python com código pronto",
    description: "Mod-11 Receita Federal. Código standalone, testes com pytest e dicas de produção.",
    type: "article",
    locale: "pt_BR",
  },
};

const faq = [
  {
    "q": "Como validar CPF em Python?",
    "a": "Use a função valida_cpf desta página: ela aceita CPF com ou sem pontuação, rejeita sequências repetidas como 111.111.111-11 e confere os dois dígitos verificadores pelo mod-11. Só biblioteca padrão, sem pip install."
  },
  {
    "q": "Como funciona o cálculo dos dígitos verificadores do CPF?",
    "a": "Os 9 primeiros dígitos são multiplicados por pesos de 10 a 2, somados, o total é multiplicado por 10 e se toma o resto da divisão por 11. Resto 10 vira 0. O segundo dígito repete a conta com 10 dígitos e pesos de 11 a 2."
  },
  {
    "q": "CPF válido quer dizer que o CPF existe?",
    "a": "Não. A validação confere só a matemática dos dígitos verificadores. Saber se o CPF está regular exige consulta à Receita Federal, que não cabe num validador de formulário."
  },
  {
    "q": "Por que 111.111.111-11 é inválido se a conta bate?",
    "a": "Sequências de um dígito repetido passam no cálculo mod-11, mas a Receita Federal não emite esses números. Todo validador deve rejeitar os 10 casos, de 000.000.000-00 a 999.999.999-99."
  },
  {
    "q": "A API do FakeForge valida CPF?",
    "a": "Não. A API gera CPFs válidos com GET /api/generate?type=cpf, e a validação roda no seu código. Use os CPFs gerados como casos positivos e troque o último dígito para obter casos negativos."
  }
];

export default function ValidarCpfPython() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">{"Python · algoritmo local + API"}</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Validar <span className="text-primary">{"CPF em Python"}</span>
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          {"Para validar CPF em Python, exija 11 dígitos e recalcule os dois dígitos verificadores pelo mod-11 da Receita Federal, com pesos 10 a 2 e 11 a 2."} {"CPFs com todos os dígitos iguais são rejeitados mesmo quando a conta bate. A validação confirma só a matemática, não se o CPF está ativo. Abaixo: uma função Python só com a biblioteca padrão, teste automatizado e conferência com CPFs gerados pela API."}
        </p>
        <p className="text-xs text-muted-foreground mt-3 max-w-2xl">{"Fonte: algoritmo de dígito verificador do CPF, definido pela Receita Federal."}</p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`def valida_cpf(cpf: str) -> bool:
    d = [int(c) for c in cpf if c.isdigit()]
    if len(d) != 11 or len(set(d)) == 1:
        return False
    for i in (9, 10):
        soma = sum(n * p for n, p in zip(d[:i], range(i + 1, 1, -1)))
        if d[i] != (soma * 10 % 11) % 10:
            return False
    return True


print(valida_cpf("529.982.247-25"))  # True
print(valida_cpf("529.982.247-26"))  # False`}</code></pre>
        <p className="text-xs text-muted-foreground mt-2">
          {"Python 3.9+, sem pip install. Salve cada bloco no arquivo indicado no topo."}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">{"Rota 1: validar CPF em Python com o algoritmo local"}</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{"Versão completa, pronta pra colar no projeto. Aceita CPF com ou sem pontuação, rejeita caracteres estranhos e as 10 sequências repetidas."}</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# validador_cpf.py (só stdlib)
import re

FORMATO_CPF = re.compile(r"\\d{3}\\.?\\d{3}\\.?\\d{3}-?\\d{2}")


def _digito(base: list[int]) -> int:
    """Um DV: pesos decrescentes de len(base)+1 até 2, resto de (soma * 10) % 11."""
    soma = sum(n * p for n, p in zip(base, range(len(base) + 1, 1, -1)))
    resto = (soma * 10) % 11
    return 0 if resto == 10 else resto


def valida_cpf(cpf: str) -> bool:
    """Valida CPF pelo mod-11 da Receita Federal, com ou sem pontuação."""
    if not FORMATO_CPF.fullmatch(cpf.strip()):
        return False
    d = [int(c) for c in cpf if c.isdigit()]
    if len(set(d)) == 1:  # 111.111.111-11 passa na conta, mas é inválido
        return False
    return d[9] == _digito(d[:9]) and d[10] == _digito(d[:10])


if __name__ == "__main__":
    for cpf in ("529.982.247-25", "52998224725", "529.982.247-26", "111.111.111-11", "abc"):
        print(f"{cpf!r:20} -> {valida_cpf(cpf)}")`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">{"Como o cálculo do dígito verificador do CPF funciona"}</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{"Um exemplo calculado à mão, para você conferir o código contra a conta."}</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`CPF 529.982.247-25

1º DV: 5×10 + 2×9 + 9×8 + 9×7 + 8×6 + 2×5 + 2×4 + 4×3 + 7×2
      = 295
      (295 × 10) mod 11 = 2  ->  DV1 = 2  (resto 10 viraria 0)

2º DV: 5×11 + 2×10 + 9×9 + 9×8 + 8×7 + 2×6 + 2×5 + 4×4 + 7×3 + 2×2
      = 347
      (347 × 10) mod 11 = 5  ->  DV2 = 5

Resultado: 529.982.247-25`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">{"Rota 2: conferir o validador com CPFs da API do FakeForge"}</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{"A API do FakeForge gera CPFs válidos, mas não tem endpoint de validação. O uso útil é como oráculo de teste: todo CPF gerado precisa passar no seu validador, e o mesmo CPF com o último dígito trocado precisa falhar."}</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# confere_cpf_api.py (stdlib). Salve o validador da Rota 1 como validador_cpf.py
import json
import urllib.request

from validador_cpf import valida_cpf

URL = "https://fakeforge.com.br/api/generate?type=cpf&quantity=20"

with urllib.request.urlopen(URL, timeout=10) as resp:
    cpfs = json.load(resp)["data"]


def troca_ultimo_digito(cpf: str) -> str:
    return cpf[:-1] + str((int(cpf[-1]) + 1) % 10)


rejeitados_indevidos = [c for c in cpfs if not valida_cpf(c)]
aceitos_indevidos = [c for c in cpfs if valida_cpf(troca_ultimo_digito(c))]

print(f"{len(cpfs)} CPFs da API | válidos rejeitados: {len(rejeitados_indevidos)} | inválidos aceitos: {len(aceitos_indevidos)}")
assert not rejeitados_indevidos and not aceitos_indevidos`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">{"Como testar o validador de CPF com pytest"}</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{"Rode com "}<code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">{"pytest -q"}</code>{". Os casos cobrem válidos, inválidos e as bordas de CPF."}</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# test_validador_cpf.py (pytest)
import pytest

from validador_cpf import valida_cpf

VALIDOS = ["529.982.247-25", "52998224725", "111.444.777-35"]
INVALIDOS = [
    "529.982.247-26",  # DV errado
    "111.111.111-11",  # dígitos repetidos
    "529.982.247-2",   # curto demais
    "529.982.247-2a",  # caractere inválido
    "",
]


@pytest.mark.parametrize("cpf", VALIDOS)
def test_aceita_cpf_valido(cpf):
    assert valida_cpf(cpf) is True


@pytest.mark.parametrize("cpf", INVALIDOS)
def test_rejeita_cpf_invalido(cpf):
    assert valida_cpf(cpf) is False


def test_todas_as_repeticoes_sao_rejeitadas():
    assert not any(valida_cpf(str(d) * 11) for d in range(10))`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">{"Validar CPF: algoritmo local ou serviço externo"}</h2>
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
              {[["Confere os dígitos verificadores", "Sim", "Não, a API só gera"], ["Gera CPFs válidos para teste", "Não", "Sim, até 10.000 por chamada"], ["Funciona offline", "Sim", "Não"], ["Confirma que o CPF está ativo na Receita", "Não", "Não"], ["Dependências", "Nenhuma", "Uma chamada HTTP"], ["Custo", "R$ 0", "Grátis até 50 chamadas por dia"]].map(([c, a, b]) => (
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
        <h2 className="text-xl font-bold text-foreground mb-4">{"Perguntas frequentes sobre validar CPF em Python"}</h2>
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
          <Link href="/validar-cpf" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">{"Validar CPF online"}</Link>
          <Link href="/gerador-cpf" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">{"Gerador de CPF"}</Link>
          <Link href="/gerador-cpf-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">{"Gerar CPF em Python"}</Link>
          <Link href="/validar-cpf-nodejs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">{"Validar CPF em Node.js"}</Link>
          <Link href="/validar-cpf-curl" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">{"Validar CPF via curl"}</Link>
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
        { name: "Validar CPF", url: "/validar-cpf" },
        { name: "Python", url: "/validar-cpf-python" },
      ]} />
    </PageShell>
  );
}
